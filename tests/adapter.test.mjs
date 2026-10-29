import test,{before,after,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
process.env.NODE_ENV='development';process.env.BOULDY_LOCAL_API='http://127.0.0.1:4012';
let fixture;const origin='http://localhost:8081';let commandRequest,snapshotRequest;
before(async()=>{fixture=spawn(process.execPath,['scripts/fixture-api.cjs'],{env:{...process.env,FIXTURE_PORT:'4012'},stdio:'ignore'});await new Promise((resolve,reject)=>{fixture.on('error',reject);const poll=setInterval(async()=>{try{await fetch('http://127.0.0.1:4012/__state');clearInterval(poll);resolve();}catch{}},50);setTimeout(()=>{clearInterval(poll);reject(new Error('fixture failed to start'));},5000).unref();});({commandRequest,snapshotRequest}=await import('../src/server/http.ts'));});
after(()=>fixture?.kill());
async function control(scenario='normal'){await fetch('http://127.0.0.1:4012/__control',{method:'POST',body:JSON.stringify({reset:true,scenario})});}
beforeEach(()=>control());
const state=async()=>await (await fetch('http://127.0.0.1:4012/__state')).json();
const post=(command,fields={},headers={})=>commandRequest(new Request(origin+'/api/command',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,Cookie:'bouldy_token=walkthrough-sample',...headers},body:JSON.stringify({command,fields})}));
const log=(fields={})=>post('logAttempt',{session_id:3,route_id:11,intent:'attempt',attempt_id:31,...fields});
test('cookie login never returns bearer; SameSite/HttpOnly 30-day cookie',async()=>{const res=await post('login',{email:' climber@example.test ',password:'fixture-only'});assert.equal(res.status,200);const out=await res.json();assert.equal(out.destination,'/');assert.equal(out.credential,undefined);assert.match(res.headers.get('set-cookie'),/HttpOnly; SameSite=Lax; Max-Age=2592000/);});
test('native login receives credential only without browser Origin/cookie',async()=>{const req=new Request(origin+'/api/command',{method:'POST',headers:{'Content-Type':'application/json','X-Bouldy-Client':'native'},body:JSON.stringify({command:'login',fields:{email:'climber@example.test',password:'fixture-only'}})});const res=await commandRequest(req);assert.equal((await res.json()).credential,'walkthrough-sample');assert.equal(res.headers.get('set-cookie'),null);});
test('cookie writes reject cross-origin, missing origin and non-JSON',async()=>{assert.equal((await post('logout',{}, {Origin:'https://attacker.test'})).status,403);const req=new Request(origin+'/api/command',{method:'POST',headers:{'Content-Type':'application/json',Cookie:'bouldy_token=walkthrough-sample'},body:'{}'});assert.equal((await commandRequest(req)).status,403);assert.equal((await post('logout',{}, {'Content-Type':'text/plain'})).status,415);assert.deepEqual((await state()).writes,[]);});
test('+1 changes only today; Send adds no try; saved history totals seven',async()=>{assert.match((await (await log()).json()).destination,/#route-11$/);let s=await state();assert.equal(s.attempts.find(a=>a.id===31).num_attempts,3);assert.equal(s.attempts.find(a=>a.id===23).num_attempts,4);await log({intent:'send'});s=await state();assert.equal(s.attempts.find(a=>a.id===31).num_attempts,3);assert.equal(s.attempts.find(a=>a.id===31).result,'send');assert.equal(s.attempts.filter(a=>a.route_id===11).reduce((n,a)=>n+a.num_attempts,0),7);await log();assert.equal((await state()).attempts.find(a=>a.id===31).num_attempts,3);});
test('first try creates one aggregate project; genuine Flash has one try',async()=>{await log({route_id:16,attempt_id:'',intent:'attempt'});await log({route_id:17,attempt_id:'',intent:'flash'});const s=await state();assert.equal(s.attempts.find(a=>a.route_id===16).num_attempts,1);assert.equal(s.attempts.find(a=>a.route_id===17).result,'flash');assert.equal(s.attempts.find(a=>a.route_id===17).num_attempts,1);});
test('stale IDs, duplicate logs, completed visits and unavailable lifetime history block writes',async()=>{for(const [scenario,fields] of [['normal',{attempt_id:999}],['duplicate',{}],['normal',{session_id:2,attempt_id:23}],['partial',{route_id:16,attempt_id:'',intent:'flash'}]]){await control(scenario);const out=await (await log(fields)).json();assert.match(out.destination,/error=/);assert.equal(out.replace,true);assert.deepEqual((await state()).writes,[]);}});
test('notes patch notes only; failed note retains supplied draft',async()=>{const before=await state();let out=await(await post('saveAttemptNote',{session_id:3,attempt_id:31,notes:'Updated note'})).json();assert.equal(out.status,'saved');let a=(await state()).attempts.find(a=>a.id===31);assert.equal(a.notes,'Updated note');assert.equal(a.num_attempts,before.attempts.find(a=>a.id===31).num_attempts);assert.equal(a.result,'project');await control('note-error');out=await(await post('saveAttemptNote',{session_id:3,attempt_id:31,notes:'keep this unsaved draft'})).json();assert.equal(out.status,'error');assert.equal(out.notes,'keep this unsaved draft');assert.deepEqual((await state()).writes,[]);});
test('failed attempt stays in affected sheet and never writes',async()=>{await control('attempt-error');const out=await (await log()).json();assert.match(out.destination,/sheet=route-11&error=/);assert.equal(out.replace,true);assert.deepEqual((await state()).writes,[]);});
test('expired identity returns 401 and clears cookie; resource errors remain distinct',async()=>{await control('expired');const res=await snapshotRequest(new Request(origin+'/api/snapshot?view=home',{headers:{Cookie:'bouldy_token=walkthrough-sample'}}));assert.equal(res.status,401);assert.match(res.headers.get('set-cookie'),/Max-Age=0/);});
test('adapter accepts no arbitrary proxy URL or unknown command',async()=>{assert.equal((await post('proxy',{url:'https://attacker.test'})).status,400);assert.equal((await snapshotRequest(new Request(origin+'/api/snapshot?view=https://attacker.test',{headers:{Cookie:'bouldy_token=walkthrough-sample'}}))).status,400);});
test('end session preserves positive-duration convention and journal destination',async()=>{const out=await(await post('endSession',{session_id:3,duration_minutes:0})).json();assert.equal(out.destination,'/sessions');assert.equal((await state()).sessions.find(s=>s.id===3).duration_minutes,1);});
test('correction updates the aggregate without adding a try and completed correction is blocked',async()=>{const res=await post('correctAttempt',{session_id:3,route_id:11,attempt_id:31,result:'send',num_attempts:1});assert.match((await res.json()).destination,/notice=/);const a=(await state()).attempts.find(a=>a.id===31);assert.equal(a.num_attempts,1);assert.equal(a.result,'send');await control();const out=await(await post('correctAttempt',{session_id:2,route_id:11,attempt_id:23,result:'send',num_attempts:1})).json();assert.match(out.destination,/error=/);assert.deepEqual((await state()).writes,[]);});
test('application boundary rejects a foreign session even if an upstream returns it; 403 does not clear login',async()=>{await control('foreign-session');const write=await log();assert.equal(write.status,403);assert.equal(write.headers.get('set-cookie'),null);const read=await snapshotRequest(new Request(origin+'/api/snapshot?view=session&id=3',{headers:{Cookie:'bouldy_token=walkthrough-sample'}}));assert.equal(read.status,403);assert.deepEqual((await state()).writes,[]);});
test('JSON size bound is enforced without trusting Content-Length',async()=>{const req=new Request(origin+'/api/command',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify({command:'logout',fields:{notes:'x'.repeat(1048576)}})});assert.equal((await commandRequest(req)).status,413);assert.deepEqual((await state()).writes,[]);});

test('signup preserves registration then login, trims fields and keeps browser token HTTP-only',async()=>{
 const res=await post('signup',{username:' new-climber ',email:' new@example.test ',password:'fixture-only',current_grade:' V4 '},{Cookie:''});
 assert.equal(res.status,200);const out=await res.json();assert.equal(out.destination,'/');assert.equal(out.credential,undefined);
 assert.match(res.headers.get('set-cookie'),/HttpOnly; SameSite=Lax/);
 const s=await state();assert.deepEqual(s.registrations,[{username:'new-climber',email:'new@example.test',current_grade:'V4'}]);assert.deepEqual(s.writes,['/auth/register']);
});
test('native signup returns a credential through the same boundary as login; optional grade is omitted',async()=>{
 const res=await commandRequest(new Request(origin+'/api/command',{method:'POST',headers:{'Content-Type':'application/json','X-Bouldy-Client':'native'},body:JSON.stringify({command:'signup',fields:{username:'new',email:'new@example.test',password:'fixture-only',current_grade:'  '}})}));
 assert.equal(res.status,200);assert.equal((await res.json()).credential,'walkthrough-sample');assert.equal(res.headers.get('set-cookie'),null);assert.deepEqual((await state()).registrations,[{username:'new',email:'new@example.test'}]);
});
test('signup validation and registration/login failures preserve source errors with no automatic retry',async()=>{
 let res=await post('signup',{username:' ',email:'new@example.test',password:'fixture-only'},{Cookie:''});assert.equal(new URL((await res.json()).destination,origin).searchParams.get('error'),'Fill in username, email, and password.');assert.deepEqual((await state()).writes,[]);
 for(const scenario of ['signup-error','signup-login-error']){
  await control(scenario);res=await post('signup',{username:'new',email:'new@example.test',password:'fixture-only'},{Cookie:''});
  assert.match((await res.json()).destination,/^\/signup\?error=/);assert.equal(res.headers.get('set-cookie'),null);
  assert.equal((await state()).registrations.length,scenario==='signup-error'?0:1);
 }
});
test('new commands retain authentication and exact-origin protection',async()=>{
 for(const command of ['addGym','startSession']){
  assert.equal((await post(command,{gym_id:1,name:'Sample',location:'Test'},{Cookie:''})).status,401);
  assert.equal((await post(command,{gym_id:1,name:'Sample',location:'Test'},{Origin:'https://attacker.test'})).status,403);
 }
 assert.equal((await post('signup',{username:'new',email:'new@example.test',password:'fixture-only'},{Origin:'https://attacker.test',Cookie:''})).status,403);
 assert.deepEqual((await state()).writes,[]);
});
test('start session derives owner and UTC date on the server and opens the created session',async()=>{
 const date=new Date().toISOString().slice(0,10);const out=await(await post('startSession',{gym_id:2,user_id:999,session_date:'1900-01-01',duration_minutes:999})).json();
 const s=await state(),created=s.sessions.find(s=>s.id===100);assert.equal(out.destination,'/sessions/100');
 assert.deepEqual(created,{id:100,notes:null,user_id:1,gym_id:2,session_date:date,duration_minutes:0});assert.deepEqual(s.writes,['/sessions/']);
});
test('invalid gym and failed session creation return to Gyms without mutation/retry',async()=>{
 let out=await(await post('startSession',{gym_id:0})).json();assert.equal(new URL(out.destination,origin).searchParams.get('error'),'Choose a gym before starting a session.');assert.deepEqual((await state()).writes,[]);
 await control('session-error');out=await(await post('startSession',{gym_id:1})).json();assert.equal(new URL(out.destination,origin).searchParams.get('error'),'Could not start this sample session. Try again.');assert.deepEqual((await state()).writes,[]);
});
test('Add gym trims input, returns sheet errors with replace, and succeeds with the original notice',async()=>{
 let out=await(await post('addGym',{name:' ',location:'Test'})).json();assert.equal(out.replace,true);assert.equal(new URL(out.destination,origin).searchParams.get('sheet'),'add-gym');assert.deepEqual((await state()).writes,[]);
 await control('gym-error');out=await(await post('addGym',{name:'New wall',location:'Test'})).json();assert.equal(out.replace,true);assert.equal(new URL(out.destination,origin).searchParams.get('error'),'Could not add this sample gym. Try again.');assert.deepEqual((await state()).writes,[]);
 await control();out=await(await post('addGym',{name:' New wall ',location:' Test '})).json();assert.equal(out.replace,true);assert.equal(new URL(out.destination,origin).searchParams.get('notice'),'Gym added. You can start a session now.');const s=await state();assert.deepEqual(s.gyms.at(-1),{id:100,name:'New wall',location:'Test'});assert.deepEqual(s.writes,['/gyms/']);
});
test('gym reads are protected and independent of an unavailable journal; empty/missing states remain explicit',async()=>{
 const read=url=>snapshotRequest(new Request(origin+url,{headers:{Cookie:'bouldy_token=walkthrough-sample'}}));
 await control('unavailable');let res=await read('/api/snapshot?view=gyms');assert.equal(res.status,200);assert.equal((await res.json()).gyms.length,2);
 res=await read('/api/snapshot?view=gym&id=1');assert.equal(res.status,200);const detail=await res.json();assert.equal(detail.gym.id,1);assert.ok(detail.gymRoutes.some(r=>r.status==='retired'));assert.equal(detail.journal,undefined);
 assert.equal((await read('/api/snapshot?view=gym&id=0')).status,400);assert.equal((await read('/api/snapshot?view=gym&id=999')).status,404);
 await control('empty-gyms');assert.deepEqual((await(await read('/api/snapshot?view=gyms')).json()).gyms,[]);
 assert.equal((await snapshotRequest(new Request(origin+'/api/snapshot?view=gyms'))).status,401);
});

const routeFields={gym_id:1,route_name:' Test route ',grade:' 3 dots ',colour:'Green',wall:' Slab ',setter:' Sample setter ',main_style:'Slab',style:['Balance','Slab','not-a-source-style']};
test('add route preserves gym grades, colour case, UTC date and deduplicated allowlisted styles',async()=>{
 const out=await(await post('addRoute',routeFields)).json();assert.equal(new URL(out.destination,origin).pathname,'/gyms/1');assert.equal(new URL(out.destination,origin).searchParams.get('notice'),'Route added to this gym.');
 const s=await state(),r=s.routes.find(r=>r.id===100);assert.deepEqual(r,{id:100,status:'active',retired_date:null,gym_id:1,route_name:'Test route',grade:'3 dots',colour:'Green',wall:'Slab',setter:'Sample setter',set_date:new Date().toISOString().slice(0,10),styles:['Slab','Balance']});assert.deepEqual(s.writes,['/routes/']);
});
test('route validation and failures return to the originating form without a write or retry',async()=>{
 let out=await(await post('addRoute',{...routeFields,session_id:3,colour:'Unknown'})).json();assert.match(out.destination,/^\/sessions\/3\/routes\/new\?error=/);assert.deepEqual((await state()).writes,[]);
 await control('route-error');out=await(await post('addRoute',{...routeFields,session_id:3})).json();assert.match(out.destination,/^\/sessions\/3\/routes\/new\?error=/);assert.equal(out.replace,true);assert.deepEqual((await state()).writes,[]);
});
test('session route creation rejects foreign, completed or wrong-gym context before a write',async()=>{
 for(const [scenario,fields,status] of [['foreign-session',{session_id:3},403],['normal',{session_id:2},400],['normal',{session_id:3,gym_id:2},400]]){
  await control(scenario);assert.equal((await post('addRoute',{...routeFields,...fields})).status,status);assert.deepEqual((await state()).writes,[]);
 }
 await control();const out=await(await post('addRoute',{...routeFields,session_id:3})).json();assert.equal(new URL(out.destination,origin).pathname,'/sessions/3');assert.deepEqual((await state()).writes,['/routes/']);
});
test('edit route preserves ID, retirement/date metadata and attempts; a foreign gym blocks updates',async()=>{
 const before=await state();let out=await(await post('editRoute',{...routeFields,route_id:11})).json();assert.equal(new URL(out.destination,origin).searchParams.get('notice'),'Route updated.');let s=await state();const updated=s.routes.find(r=>r.id===11);assert.equal(updated.set_date,before.routes.find(r=>r.id===11).set_date);assert.equal(updated.status,'active');assert.deepEqual(s.attempts,before.attempts);assert.deepEqual(updated.styles,['Slab','Balance']);assert.deepEqual(s.writes,['/routes/11']);
 await control();out=await(await post('editRoute',{...routeFields,gym_id:2,route_id:11})).json();assert.equal(new URL(out.destination,origin).searchParams.get('error'),'That route does not belong to this gym.');assert.deepEqual((await state()).writes,[]);
});
test('route form reads reject retired/mismatched routes and foreign sessions',async()=>{
 const read=url=>snapshotRequest(new Request(origin+url,{headers:{Cookie:'bouldy_token=walkthrough-sample'}}));
 assert.equal((await read('/api/snapshot?view=route-form&id=1&routeId=13')).status,404);assert.equal((await read('/api/snapshot?view=route-form&id=2&routeId=11')).status,404);
 assert.equal((await read('/api/snapshot?view=route-form&id=1&routeId=bad')).status,400);assert.equal((await read('/api/snapshot?view=route-form&id=1&routeId=11')).status,200);assert.equal((await read('/api/snapshot?view=route-form&id=1')).status,200);
 const data=await(await read('/api/snapshot?view=session-route-form&id=2')).json();assert.equal(data.session.duration_minutes,75);
 await control('foreign-session');assert.equal((await read('/api/snapshot?view=session-route-form&id=3')).status,403);
});
test('only repeated style strings may cross the command boundary as arrays',async()=>{
 assert.equal((await post('addRoute',{...routeFields,style:['Slab',42]})).status,400);assert.equal((await post('addRoute',{...routeFields,gym_id:[1]})).status,400);assert.deepEqual((await state()).writes,[]);
});

test('Climbs/Profile return only validated private journal reads, with partial route/name handling',async()=>{
 const read=view=>snapshotRequest(new Request(origin+'/api/snapshot?view='+view,{headers:{Cookie:'bouldy_token=walkthrough-sample'}}));
 for(const view of ['climbs','profile']){
  const res=await read(view);assert.equal(res.status,200);assert.equal(res.headers.get('cache-control'),'no-store, private');const data=await res.json();assert.equal(data.user.id,1);assert.ok(data.journal.records.every(record=>record.session.user_id===1));if(view==='climbs')assert.ok(data.routes.some(route=>route.status==='retired'));
 }
 await control('partial');const data=await(await read('climbs')).json();assert.ok(data.journal.records.some(record=>!record.loaded));
 assert.equal((await snapshotRequest(new Request(origin+'/api/snapshot?view=profile'))).status,401);
});
test('Beta remains read-only, supports retired IDs, and validates missing resources',async()=>{
 const read=id=>snapshotRequest(new Request(origin+'/api/snapshot?view=beta&id='+id,{headers:{Cookie:'bouldy_token=walkthrough-sample'}}));
 const data=await(await read(13)).json();assert.equal(data.route.status,'retired');assert.equal(data.gym.id,1);assert.equal((await read('bad')).status,400);assert.equal((await read(999)).status,404);assert.deepEqual((await state()).writes,[]);
});

test('foreign journal rows cannot cross the application boundary into Climbs or Profile',async()=>{
 await control('foreign-journal');
 for(const view of ['climbs','profile','home','journal']){
  const res=await snapshotRequest(new Request(origin+'/api/snapshot?view='+view,{headers:{Cookie:'bouldy_token=walkthrough-sample'}}));assert.equal(res.status,403);assert.equal(res.headers.get('set-cookie'),null);const data=await res.json();assert.equal(data.journal,undefined);
 }
 assert.deepEqual((await state()).writes,[]);
});
