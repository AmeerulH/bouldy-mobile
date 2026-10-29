import * as SecureStore from 'expo-secure-store';
const KEY='bouldy_token';
export const readCredential=()=>SecureStore.getItemAsync(KEY);
export async function writeCredential(token: string|null) {
 if(token) await SecureStore.setItemAsync(KEY,token,{keychainAccessible:SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY});
 else await SecureStore.deleteItemAsync(KEY);
}
