import type { Route,Attempt } from '../data/types.ts';
import { duplicateRouteIds,journalComplete,routeProgress,type Journal } from '../domain/journal-summary.ts';
export type RouteState={route:Route;attempt?:Attempt;ambiguous:boolean;previous:ReturnType<typeof routeProgress>;project:boolean};
export const triesLabel=(count:number)=>`${count} ${count===1?'try':'tries'}`;
export const routeMeta=(r:Route)=>[r.wall,...r.styles.slice(0,2)].filter(Boolean).join(' · ');
export function routeStates(routes:Route[],attempts:Attempt[],journal:Journal,sessionId:number,isEnded:boolean):RouteState[]{
 const duplicateIds=duplicateRouteIds(attempts),byRoute=new Map(attempts.map(a=>[a.route_id,a]));
 return routes.map(route=>{const attempt=byRoute.get(route.id),ambiguous=duplicateIds.has(route.id),previous=routeProgress(journal,route.id,sessionId);const completed=attempt?.result==='send'||attempt?.result==='flash';return {route,attempt:ambiguous?undefined:attempt,ambiguous,previous,project:!isEnded&&journalComplete(journal)&&route.status==='active'&&previous.tried&&!previous.sent&&!previous.ambiguous&&!completed};});
}
export function statusText({route,attempt,ambiguous,previous,project}:RouteState,ended:boolean){const retired=route.status==='retired'?' · Retired':'';if(ambiguous)return 'Conflicting logs';if(attempt?.result==='flash')return `Flashed${retired}`;if(attempt?.result==='send')return `Sent · ${triesLabel(attempt.num_attempts)}${retired}`;if(attempt?.result==='zone')return `Zone · ${triesLabel(attempt.num_attempts)}${retired}`;if(attempt)return `${triesLabel(attempt.num_attempts)}${ended?'':' today'}${retired}`;if(previous.sent)return 'Sent before';if(project&&previous.total!==null)return `Project · ${triesLabel(previous.total)} before`;return routeMeta(route)||'Not tried yet';}
