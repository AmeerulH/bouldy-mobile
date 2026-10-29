import test from 'node:test';
import assert from 'node:assert/strict';
import { IdentitySession } from '../src/platform/identity-session.ts';

const climber = { id: 1, username: 'sample-climber' };
const expired = () => Object.assign(new Error('Please sign in'), { status: 401 });
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function setup(overrides = {}) {
  const writes = [], filters = [];
  const dependencies = {
    read: async () => climber,
    write: async token => { writes.push(token); },
    clearFilters: () => filters.push('cleared'),
    unauthorized: error => error?.status === 401,
    ...overrides,
  };
  return { session: new IdentitySession(dependencies), writes, filters, dependencies };
}

test('startup restores validated identity and resume invalidates reads without hiding the screen', async () => {
  const { session, writes } = setup();
  await session.hydrate();
  const before = session.snapshot(), changes = [];
  const unsubscribe = session.subscribe(() => changes.push(session.snapshot()));
  await session.hydrate(false);
  assert.equal(session.snapshot().user, climber);
  assert.equal(session.snapshot().revision, before.revision + 1);
  assert.ok(changes.every(state => state.ready && state.user === climber));
  assert.deepEqual(writes, []);
  unsubscribe();
});
test('expired identity on resume clears credentials and private filters', async () => {
  const { session, writes, filters, dependencies } = setup();
  await session.hydrate();
  dependencies.read = async () => { throw expired(); };
  await session.hydrate(false);
  assert.equal(session.snapshot().user, null);
  assert.equal(session.snapshot().ready, true);
  assert.deepEqual(writes, [null]);
  assert.equal(filters.length, 2);
});
test('resume network and resource failures keep mounted data; startup failure exposes retry', async () => {
  const { session, writes, dependencies } = setup();
  await session.hydrate();
  const before = session.snapshot();
  for (const error of [new Error('Network unavailable'), Object.assign(new Error('Forbidden'), { status: 403 })]) {
    dependencies.read = async () => { throw error; };
    await session.hydrate(false);
    assert.equal(session.snapshot(), before);
  }
  await session.hydrate();
  assert.equal(session.snapshot().error, 'Forbidden');
  assert.equal(session.snapshot().ready, true);
  dependencies.read = async () => climber;
  await session.hydrate();
  assert.equal(session.snapshot().error, '');
  assert.deepEqual(writes, []);
});
test('late identity success cannot restore an explicitly logged-out account', async () => {
  const pending = deferred(), { session } = setup({ read: () => pending.promise });
  const hydration = session.hydrate();
  await Promise.resolve();
  await session.expire();
  pending.resolve(climber);
  await hydration;
  assert.equal(session.snapshot().user, null);
});
test('old account expiry cannot clear the credential of a newer login', async () => {
  const pending = deferred(), { session, writes, dependencies } = setup();
  await session.hydrate();
  dependencies.read = () => pending.promise;
  const resume = session.hydrate(false);
  await Promise.resolve();
  const generation = session.beginLogin(), nextClimber = { id: 2, username: 'second-climber' };
  dependencies.read = async () => nextClimber;
  assert.equal(await session.acceptLogin('synthetic-second-token', generation), true);
  pending.reject(expired());
  await resume;
  assert.equal(session.snapshot().user, nextClimber);
  assert.deepEqual(writes, ['synthetic-second-token']);
});
test('credential deletion finishes before a rapid subsequent login save', async () => {
  const deletion = deferred(), events = [];
  const { session } = setup({ write: async token => {
    events.push(['start', token]);
    if (token === null) await deletion.promise;
    events.push(['finish', token]);
  } });
  const logout = session.expire();
  const login = session.acceptLogin('synthetic-new-token', session.beginLogin());
  await Promise.resolve(); await Promise.resolve();
  assert.deepEqual(events, [['start', null]]);
  deletion.resolve();
  await logout;
  assert.equal(await login, true);
  assert.deepEqual(events, [['start', null], ['finish', null], ['start', 'synthetic-new-token'], ['finish', 'synthetic-new-token']]);
});
test('cancelled hydration and superseded account generations cannot update identity', async () => {
  const pending = deferred(), { session, writes } = setup({ read: () => pending.promise });
  const hydration = session.hydrate();
  session.cancelRead();
  pending.resolve(climber);
  await hydration;
  assert.equal(session.snapshot().user, null);
  const stale = session.beginLogin();
  session.beginLogin();
  assert.equal(await session.acceptLogin('stale-token', stale), false);
  assert.deepEqual(writes, []);
});
test('failed credential deletion keeps access closed and surfaces storage failure', async () => {
  const { session, dependencies, writes } = setup({ write: async () => { throw new Error('Secure storage unavailable'); } });
  await session.hydrate();
  await assert.rejects(session.expire(), /Secure storage unavailable/);
  assert.equal(session.snapshot().user, null);
  assert.equal(session.snapshot().error, 'Secure storage unavailable');
  dependencies.write = async token => { writes.push(token); };
  dependencies.read = async () => { throw expired(); };
  await session.retry();
  assert.equal(session.snapshot().user, null);
  assert.equal(session.snapshot().error, '');
  assert.ok(writes.every(token => token === null));
});
