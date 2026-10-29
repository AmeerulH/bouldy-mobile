import { useEffect,useState } from 'react';
import { request,TransportError } from './client';
import { useAuth } from '../platform/auth';
import type { UserResponse,Gym,Session,Route,Attempt } from './types';
import type { Journal } from '../domain/journal-summary';
export type Snapshot={user:UserResponse;journal:Journal;gyms:Gym[]|null;session:Session;gym:Gym;gymRoutes:Route[];routes:Route[]|null;attempts:Attempt[];route:Route};
export function useSnapshot(view='home',id?:string,routeId?:string) {
 const auth=useAuth();const key=`${auth.user?.id}:${view}:${id??''}:${routeId??''}`;const [state,setState]=useState<{key?:string;data?:Snapshot;error?:string;status?:number}>({});
 useEffect(()=>{let alive=true;if(!auth.user)return;
 request<Snapshot>(`/api/snapshot?view=${view}${id?`&id=${encodeURIComponent(id)}`:''}${routeId?`&routeId=${encodeURIComponent(routeId)}`:''}`).then(data=>{if(alive)setState({key,data});}).catch(error=>{if(!alive)return;if(error instanceof TransportError && error.status===401)auth.expire();else setState({key,error:error.message,status:error instanceof TransportError?error.status:500});});return()=>{alive=false;};
 // auth functions are recreated; only identity/revision should invalidate a read.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[view,id,routeId,auth.user?.id,auth.revision]);if(state.key===key&&state.error&&[400,404].includes(state.status??0))throw new TransportError(state.status!,state.error);return state.key===key?state:{};
}
