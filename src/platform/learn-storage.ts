// Web and fallback: localStorage when available, otherwise process memory.
// Holds only non-sensitive tour/lesson progress, keyed per user id by the caller.
const memory = new Map<string, string>();
const web = () => {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
};
export const readLearn = async (key: string): Promise<string | null> => {
  try {
    return web()?.getItem(key) ?? memory.get(key) ?? null;
  } catch {
    return memory.get(key) ?? null;
  }
};
export const writeLearn = async (key: string, value: string) => {
  memory.set(key, value);
  try {
    web()?.setItem(key, value);
  } catch {
    // Storage full or blocked: progress stays for this session only.
  }
};
