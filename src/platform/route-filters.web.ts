import { useEffect,useSyncExternalStore } from 'react';
import type { Filters } from './route-filters';
const keys=['q','grade','status','colour','wall','gym'] as const,EVENT='bouldy:sheet-location';
const subscribe=(listener:()=>void)=>{window.addEventListener(EVENT,listener);window.addEventListener('popstate',listener);return()=>{window.removeEventListener(EVENT,listener);window.removeEventListener('popstate',listener);};};
const snapshot=()=>window.location.search;
export function clearFilterState(){try{for(const key of Object.keys(window.sessionStorage))if(key.startsWith('bouldy:routes:'))window.sessionStorage.removeItem(key);}catch{}}
export function useRouteFilters(key:string){const search=useSyncExternalStore(subscribe,snapshot,()=>''),params=new URLSearchParams(search),filters=Object.fromEntries(keys.map(k=>[k,params.get(k)??''])) as Filters;
 function set(patch:Partial<Filters>){const url=new URL(window.location.href);for(const [k,v] of Object.entries(patch)){if(v)url.searchParams.set(k,v);else url.searchParams.delete(k);}window.history.replaceState(null,'',url.pathname+url.search);try{window.sessionStorage.setItem(`bouldy:routes:${key}`,JSON.stringify(Object.fromEntries(keys.map(k=>[k,url.searchParams.get(k)??'']).filter(([,v])=>v))));}catch{}window.dispatchEvent(new Event(EVENT));}
 useEffect(()=>{if(keys.some(k=>new URLSearchParams(search).has(k)))return;try{const stored=JSON.parse(window.sessionStorage.getItem(`bouldy:routes:${key}`)??'{}');if(Object.keys(stored).length)set(stored);}catch{}}
 // set restores only when URL filters disappear, matching source command redirects.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 ,[key,search]);return {filters,set};
}
