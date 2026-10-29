import { useLocalSearchParams,useRouter } from 'expo-router';
import { useEffect } from 'react';
export const FILTER_KEYS=['q','grade','status','colour','wall','gym'] as const;
export type Filters=Record<typeof FILTER_KEYS[number],string>;
const stores=new Map<string,Partial<Filters>>();
export function clearFilterState(){stores.clear();}
export function useRouteFilters(key:string){const params=useLocalSearchParams<Record<string,string>>(),router=useRouter();const filters=Object.fromEntries(FILTER_KEYS.map(k=>[k,params[k]??''])) as Filters;const text=JSON.stringify(filters);
 useEffect(()=>{if(FILTER_KEYS.some(k=>params[k]))return;const stored=stores.get(key);if(stored)router.setParams(stored);},[key,text,params,router]);
 function set(patch:Partial<Filters>){const next={...filters,...patch};stores.set(key,next);router.setParams(patch);}
 return {filters,set};
}
