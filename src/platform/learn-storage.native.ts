import * as SecureStore from "expo-secure-store";
// Non-sensitive progress only. SecureStore is the existing device store in this app.
const memory = new Map<string, string>();
export const readLearn = async (key: string): Promise<string | null> => {
  try {
    return (await SecureStore.getItemAsync(key)) ?? memory.get(key) ?? null;
  } catch {
    return memory.get(key) ?? null;
  }
};
export const writeLearn = async (key: string, value: string) => {
  memory.set(key, value);
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    // Keep in-memory progress for this session if the write fails.
  }
};
