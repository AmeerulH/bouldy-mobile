import test from 'node:test';
import assert from 'node:assert/strict';
import { collectClimbs } from '../src/features/climbs.ts';
const route=(id,gym_id=1,status='active')=>({id,gym_id,status,grade:'V3',route_name:'Same route name',colour:'red',styles:[],wall:null,setter:null,set_date:null,retired_date:null});
const attempt=(id,session_id,route_id,num_attempts,result='project')=>({id,session_id,route_id,num_attempts,result,notes:null});
const record=(id,attempts,loaded=true,gym_id=1)=>({session:{id,user_id:1,gym_id,session_date:'2026-10-01',duration_minutes:60,notes:null},attempts,loaded});
test('collection preserves best result, visits and tries across visits without merging reset IDs',()=>{
 const journal={sessionsLoaded:true,records:[record(2,[attempt(2,2,7,2,'send'),attempt(3,2,8,1,'flash')]),record(1,[attempt(1,1,7,4)])]};
 const c=collectClimbs(journal,[{id:1,name:'Gym A',location:'Test'}],[route(7,1,'retired'),route(8)]);
 assert.equal(c.items.length,2);assert.equal(c.items.find(i=>i.route.id===7).tries,6);assert.equal(c.items.find(i=>i.route.id===7).visits,2);assert.equal(c.items.find(i=>i.route.id===7).best,'send');assert.equal(c.items.find(i=>i.route.id===7).route.status,'retired');assert.equal(c.sent,2);assert.equal(c.warning,false);
});
test('partial and duplicate journals never invent confirmed totals; best observed result is preserved',()=>{
 for(const journal of [{sessionsLoaded:true,records:[record(1,[attempt(1,1,7,2,'zone')]),record(2,[],false)]},{sessionsLoaded:true,records:[record(1,[attempt(1,1,7,2),attempt(2,1,7,3,'send')])]}]){
  const c=collectClimbs(journal,null,[route(7)]);assert.equal(c.items[0].tries,null);assert.equal(c.items[0].gym.name,'Unknown gym');
 }
});
test('missing routes trigger a warning; identical grades at different gyms remain separate entries',()=>{
 const journal={sessionsLoaded:true,records:[record(1,[attempt(1,1,7,1)]),record(2,[attempt(2,2,8,1)],true,2)]};
 assert.equal(collectClimbs(journal,null,[route(7)]).warning,true);assert.equal(collectClimbs(journal,null,null).warning,true);
 const c=collectClimbs(journal,null,[route(7),route(8,2)]);assert.equal(c.gyms,2);assert.equal(c.items.length,2);assert.equal(c.warning,false);
});
test('empty loaded and unavailable collections retain separate uncertainty',()=>{
 assert.equal(collectClimbs({sessionsLoaded:true,records:[]},[],[]).warning,false);
 assert.equal(collectClimbs({sessionsLoaded:false,records:[]},[],[]).warning,true);
});
