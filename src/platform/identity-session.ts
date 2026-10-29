// Platform-independent identity lifecycle. Reads are disposable; writes are never replayed.
export type IdentityState<User> = { user: User | null; ready: boolean; error: string; revision: number };
type Dependencies<User> = {
  read: () => Promise<User>;
  write: (credential: string | null) => Promise<void>;
  clearFilters: () => void;
  unauthorized: (error: unknown) => boolean;
};
export class IdentitySession<User extends { id: number }> {
  private state: IdentityState<User> = { user: null, ready: false, error: '', revision: 0 };
  private listeners = new Set<() => void>();
  private generation = 0;
  private readId = 0;
  private storage: Promise<void> = Promise.resolve();
  private needsErase = false;
  private readonly dependencies: Dependencies<User>;
  constructor(dependencies: Dependencies<User>) { this.dependencies = dependencies; }
  snapshot = () => this.state;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  current = () => this.generation;
  isCurrent = (generation: number) => generation === this.generation;
  private publish(patch: Partial<IdentityState<User>>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach(listener => listener());
  }
  private invalidate() { this.generation++; this.readId++; }
  private save(credential: string | null) {
    // A slow logout deletion must finish before a subsequent login credential is stored.
    const next = this.storage.catch(() => {}).then(() => this.dependencies.write(credential));
    this.storage = next;
    return next;
  }
  flush = () => this.storage;
  refresh = () => this.publish({ revision: this.state.revision + 1 });
  beginLogin() { this.invalidate(); return this.generation; }
  async expire() {
    this.invalidate();
    const generation = this.generation;
    this.dependencies.clearFilters();
    this.publish({ user: null, ready: true, error: '', revision: this.state.revision + 1 });
    this.needsErase = true;
    try { await this.save(null); this.needsErase = false; }
    catch (error) {
      if (this.isCurrent(generation)) this.publish({ error: message(error) });
      throw error;
    }
  }
  async retry() {
    // Explicit user retry may retry local credential cleanup, never an API mutation.
    if (this.needsErase) {
      try { await this.save(null); this.needsErase = false; }
      catch (error) { this.publish({ error: message(error) }); return; }
    }
    await this.hydrate();
  }
  async acceptLogin(credential: string | null, generation: number) {
    if (!this.isCurrent(generation)) return false;
    this.dependencies.clearFilters();
    await this.save(credential);
    if (!this.isCurrent(generation)) return false;
    const user = await this.dependencies.read();
    if (!this.isCurrent(generation)) return false;
    this.publish({ user, ready: true, error: '', revision: this.state.revision + 1 });
    return true;
  }
  async hydrate(blocking = true) {
    const generation = this.generation, readId = ++this.readId;
    const current = () => this.isCurrent(generation) && readId === this.readId;
    if (blocking) this.publish({ ready: false, error: '' });
    try {
      await this.storage;
      const user = await this.dependencies.read();
      if (!current()) return;
      if (this.state.user?.id !== user.id) {
        this.invalidate();
        this.dependencies.clearFilters();
      }
      this.publish({ user, ready: true, error: '', revision: this.state.revision + 1 });
    } catch (error) {
      if (!current()) return;
      if (this.dependencies.unauthorized(error)) {
        await this.expire().catch(() => {}); // expire records storage failures for the retry UI.
      } else if (blocking) {
        this.publish({ ready: true, error: message(error) });
      }
      // A transient resume failure keeps the mounted screen and unsaved drafts.
      // Commands still authenticate at the adapter and have no offline/retry queue.
    }
  }
  cancelRead() { this.readId++; }
}
function message(error: unknown) { return error instanceof Error ? error.message : 'Something went wrong'; }
