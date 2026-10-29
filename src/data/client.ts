import { Platform } from 'react-native';
import { readCredential } from '../platform/credentials';
export class TransportError extends Error { constructor(public status:number,message:string){super(message);} }
export async function request<T>(path: string, body?: unknown): Promise<T> {
 const token=await readCredential();
 const origin=Platform.OS==='web'?'':process.env.EXPO_PUBLIC_ADAPTER_ORIGIN;
 if(Platform.OS!=='web' && !origin)throw new TransportError(503,'The application API is unavailable.');
 const res=await fetch(`${origin}${path}`,{method:body?'POST':'GET',credentials:Platform.OS==='web'?'same-origin':'omit',cache:'no-store',headers:{...(body?{'Content-Type':'application/json'}:{}),...(Platform.OS!=='web'?{'X-Bouldy-Client':'native'}:{}),...(token?{Authorization:`Bearer ${token}`}:{})},body:body?JSON.stringify(body):undefined});
 const data=await res.json();if(!res.ok)throw new TransportError(res.status,data.error || 'Something went wrong');return data;
}
