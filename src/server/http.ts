import { ApiError, getMe, getGyms, getSession, getGym, getGymRoutes, getRoutes, getSessionAttempts, getRoute } from './fastapi.ts';
import { executeCommand, type Command } from './commands.ts';
import { loadJournal } from './journal.ts';
const COOKIE = 'bouldy_token';
const noStore = { 'Cache-Control': 'no-store, private', 'Vary': 'Cookie, Authorization' };
function cookie(token: string | null) {
 return `${COOKIE}=${token ? encodeURIComponent(token) : ''}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${token ? 60*60*24*30 : 0}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
}
function tokenOf(request: Request) {
 const auth = request.headers.get('authorization');
 if (auth) { if (!/^Bearer [^\s]+$/.test(auth)) throw new ApiError(401, 'Please sign in'); return auth.slice(7); }
 return request.headers.get('cookie')?.split(';').map(v=>v.trim()).find(v=>v.startsWith(`${COOKIE}=`))?.slice(COOKIE.length+1) ?? null;
}
async function readBoundedBody(request: Request) {
 const reader=request.body?.getReader();if(!reader)return '';
 const chunks:Uint8Array[]=[];let total=0;
 try { while(true){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>1048576){await reader.cancel();throw new ApiError(413,'Request too large');}chunks.push(value);} }
 finally {reader.releaseLock();}
 const bytes=new Uint8Array(total);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}return new TextDecoder().decode(bytes);
}
function reply(value: unknown, status=200, headers: Record<string,string>={}) { return Response.json(value,{status,headers:{...noStore,...headers}}); }
async function guarded(run:()=>Promise<Response>) {
 try { return await run(); } catch(error) {
  const status=error instanceof ApiError ? error.status : 500;
  return reply({error:error instanceof ApiError ? error.message : 'Something went wrong'},status,status===401?{'Set-Cookie':cookie(null)}:{});
 }
}
export function commandRequest(request: Request) { return guarded(async()=>{
 if(request.method!=='POST') return reply({error:'Method not allowed'},405);
 // JSON + exact same-origin checks replace Next Server Actions' cookie-write protection.
 if(!request.headers.get('content-type')?.startsWith('application/json')) return reply({error:'Expected JSON'},415);
 const bearer=request.headers.has('authorization');
 const origin=request.headers.get('origin');
 if((origin && origin!==new URL(request.url).origin) || (!bearer && !origin && !(request.headers.get('x-bouldy-client')==='native' && !request.headers.has('cookie')))) return reply({error:'Invalid request origin'},403);
 if(Number(request.headers.get('content-length'))>1048576) return reply({error:'Request too large'},413);
 const raw=await readBoundedBody(request);
 let body;try{body=JSON.parse(raw);}catch{return reply({error:'Invalid JSON'},400);}
 const allowed: Command[]=['addRoute','editRoute','login','signup','addGym','startSession','logout','logAttempt','correctAttempt','saveAttemptNote','endSession'];
 if(!body || !allowed.includes(body.command) || !body.fields || typeof body.fields!=='object' || Array.isArray(body.fields)) return reply({error:'Unknown command'},400);
 const form=new FormData();
 for(const [key,value] of Object.entries(body.fields)) {
  if(key==='style' && Array.isArray(value) && value.every(item=>typeof item==='string')) { for(const item of value)form.append(key,item);continue; }
  if(typeof value!=='string' && typeof value!=='number') return reply({error:'Invalid field'},400); form.set(key,String(value)); }
 let token=tokenOf(request);let changed=false;
 if(!['login','signup','logout'].includes(body.command)) {
  if(!token) throw new ApiError(401,'Please sign in');
  const user=await getMe(token);
  if(['logAttempt','correctAttempt','saveAttemptNote','endSession'].includes(body.command) || (body.command==='addRoute' && form.has('session_id'))) {
  const id=Number(form.get('session_id'));
  if(!Number.isInteger(id)||id<1) return reply({error:'Invalid session'},400);
  const session=await getSession(token,id);
  if(session.user_id!==user.id) throw new ApiError(403,'That session does not belong to this account.');
  if(body.command==='addRoute' && (session.gym_id!==Number(form.get('gym_id')) || session.duration_minutes>0))throw new ApiError(400,'This route can no longer be added in this session.');
  }
 }
 const outcome=await executeCommand(body.command,form,{token,setToken(value){token=value;changed=true;}});
 // Native identifies itself only on login/signup and receives a bearer credential. Browser tokens remain HTTP-only.
 const nativeLogin=['login','signup'].includes(body.command) && request.headers.get('x-bouldy-client')==='native' && !origin;
 return reply({...outcome,...(nativeLogin && changed && token ? {credential:token}: {})},200,changed && !nativeLogin ? {'Set-Cookie':cookie(token)}:{});
 }); }
export function snapshotRequest(request: Request) { return guarded(async()=>{
 const token=tokenOf(request);if(!token) throw new ApiError(401,'Please sign in');
 const user=await getMe(token); const url=new URL(request.url);const view=url.searchParams.get('view') ?? 'home';
 if(!['home','journal','session','route','gyms','gym','route-form','session-route-form','climbs','profile','beta'].includes(view)) return reply({error:'Unknown view'},400);
 if(view==='route-form') {
  const id=Number(url.searchParams.get('id'));if(!Number.isInteger(id)||id<1)return reply({error:'Invalid resource'},400);
  const gym=await getGym(id),routeId=url.searchParams.get('routeId');
  if(routeId===null)return reply({user,gym});
  const rid=Number(routeId);if(!Number.isInteger(rid)||rid<1)return reply({error:'Invalid resource'},400);
  const route=await getRoute(rid);if(route.gym_id!==id||route.status!=='active')throw new ApiError(404,'Route not found');
  return reply({user,gym,route});
 }
 if(view==='session-route-form') {
  const id=Number(url.searchParams.get('id'));if(!Number.isInteger(id)||id<1)return reply({error:'Invalid resource'},400);
  const session=await getSession(token,id);if(session.user_id!==user.id)throw new ApiError(403,'That session does not belong to this account.');
  return reply({user,session,gym:await getGym(session.gym_id)});
 }
 if(view==='beta') {
  const id=Number(url.searchParams.get('id'));if(!Number.isInteger(id)||id<1)return reply({error:'Invalid resource'},400);
  const route=await getRoute(id);return reply({user,route,gym:await getGym(route.gym_id).catch(()=>null)});
 }
 if(view==='gyms') return reply({user,gyms:await getGyms()});
 if(view==='gym') {
  const id=Number(url.searchParams.get('id'));if(!Number.isInteger(id)||id<1)return reply({error:'Invalid resource'},400);
  const [gym,gymRoutes]=await Promise.all([getGym(id),getGymRoutes(id)]);
  return reply({user,gym,gymRoutes});
 }
 const [journal,gyms]=await Promise.all([loadJournal(token),getGyms().catch(()=>null)]);
 if(journal.records.some(r=>r.session.user_id!==user.id)) throw new ApiError(403,'Journal unavailable for this account.');
 if(view==='home'||view==='profile') return reply({user,journal,gyms});
 if(view==='climbs')return reply({user,journal,gyms,routes:await getRoutes().catch(()=>null)});
 if(view==='journal'){const latest=journal.records[0];const [gymRoutes,routes]=await Promise.all([latest?getGymRoutes(latest.session.gym_id).catch(()=>null):null,getRoutes().catch(()=>null)]);return reply({user,journal,gyms,gymRoutes,routes});}
 const id=Number(url.searchParams.get('id'));if(!Number.isInteger(id)||id<1)return reply({error:'Invalid resource'},400);
 if(view==='route') { const route=await getRoute(id);return reply({user,journal,gyms,route}); }
 const session=await getSession(token,id);if(session.user_id!==user.id) throw new ApiError(403,'That session does not belong to this account.');
 const [gym,gymRoutes,routes,attempts]=await Promise.all([getGym(session.gym_id),getGymRoutes(session.gym_id),getRoutes(),getSessionAttempts(token,id)]);
 return reply({user,journal,gyms,session,gym,gymRoutes,routes,attempts});
 }); }
export function identityRequest(request: Request) { return guarded(async()=>{const token=tokenOf(request);if(!token)throw new ApiError(401,'Please sign in');return reply({user:await getMe(token)});}); }
