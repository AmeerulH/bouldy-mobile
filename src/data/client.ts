import { Platform } from 'react-native';
import { readCredential } from '../platform/credentials';
/** `status` 0 means the request never reached the server (offline, DNS, timeout). */
export class TransportError extends Error { constructor(public status:number,message:string){super(message);} }
export async function request<T>(path: string, body?: unknown): Promise<T> {
 const token=await readCredential();
 const origin=Platform.OS==='web'?'':process.env.EXPO_PUBLIC_ADAPTER_ORIGIN;
 if(Platform.OS!=='web' && !origin)throw new TransportError(503,'The application API is unavailable.');
 let res:Response;
 try{
  res=await fetch(`${origin}${path}`,{method:body?'POST':'GET',credentials:Platform.OS==='web'?'same-origin':'omit',cache:'no-store',headers:{...(body?{'Content-Type':'application/json'}:{}),...(Platform.OS!=='web'?{'X-Bouldy-Client':'native'}:{}),...(token?{Authorization:`Bearer ${token}`}:{})},body:body?JSON.stringify(body):undefined});
 }catch{
  throw new TransportError(0,'Couldn’t reach Bouldy.');
 }
 // A gateway or proxy error page is not JSON; keep the HTTP status instead of throwing a parse error.
 const data=await res.json().catch(()=>null);
 if(!res.ok)throw new TransportError(res.status,data?.error || 'Something went wrong');
 if(data===null)throw new TransportError(502,'Bouldy sent an unreadable response.');
 return data;
}
