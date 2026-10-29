import { useSyncExternalStore,useRef,useEffect } from 'react';
import { useRouter,usePathname } from 'expo-router';
const EVENT='bouldy:sheet-location';
const subscribe=(listener:()=>void)=>{window.addEventListener(EVENT,listener);window.addEventListener('popstate',listener);return()=>{window.removeEventListener(EVENT,listener);window.removeEventListener('popstate',listener);};};
const snapshot=()=>window.location.search;
const emit=()=>window.dispatchEvent(new Event(EVENT));
export function useSheetNavigation(){const search=useSyncExternalStore(subscribe,snapshot,()=>''),router=useRouter(),path=usePathname();const params=new URLSearchParams(search),pushedSheet=useRef<string|null>(null);useEffect(()=>{if(!new URLSearchParams(search).has('sheet'))pushedSheet.current=null;},[search]);
 function close(){if(pushedSheet.current===params.get('sheet')){pushedSheet.current=null;window.history.back();return;}const url=new URL(window.location.href);url.searchParams.delete('sheet');url.searchParams.delete('error');window.history.replaceState(null,'',url.pathname+url.search+url.hash);emit();}
 function open(id:string){const url=new URL(window.location.href);url.searchParams.delete('error');url.searchParams.delete('notice');url.searchParams.set('sheet',id);window.history.pushState(null,'',url.pathname+url.search);pushedSheet.current=id;emit();}
 function apply(destination:string){pushedSheet.current=null;const url=new URL(destination,window.location.origin);if(url.pathname===path){window.history.replaceState(null,'',url.pathname+url.search+url.hash);emit();}else router.replace(destination as never);}
 return {sheet:params.get('sheet')??undefined,error:params.get('error')??undefined,open,close,apply};
}
