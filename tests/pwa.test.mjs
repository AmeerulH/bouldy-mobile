import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source=readFileSync(new URL('../public/sw.js',import.meta.url),'utf8');
function worker(network=async()=>new Response('private journal')){
 const listeners={},stored=new Map(),deleted=[],pending=[];let skipped=0,claimed=0;
 const cache={addAll:async paths=>{for(const path of paths)stored.set(path,new Response(path));},match:async path=>stored.get(path)};
 const context={URL,Response,Set,Promise,fetch:network,caches:{open:async()=>cache,keys:async()=>['unrelated-cache','bouldy-public-old'],delete:async key=>{deleted.push(key);}},self:{location:{origin:'https://bouldy.test'},addEventListener:(name,fn)=>listeners[name]=fn,skipWaiting:()=>skipped++,clients:{claim:()=>claimed++}}};
 vm.runInNewContext(source,context);
 const lifecycle=async name=>{listeners[name]({waitUntil:p=>pending.push(p)});await Promise.all(pending);};
 const fetch=async(path,{method='GET',mode='navigate'}={})=>{let response;listeners.fetch({request:{url:new URL(path,'https://bouldy.test').href,method,mode},respondWith:r=>response=Promise.resolve(r)});return response?await response:null;};
 return {stored,deleted,lifecycle,fetch,counts:()=>({skipped,claimed})};
}
test('worker installs only generic public assets and never forces draft-discarding activation',async()=>{
 const w=worker();await w.lifecycle('install');assert.deepEqual([...w.stored.keys()],['/offline.html','/icons/icon-192.png','/icons/icon-512.png','/icons/maskable-512.png']);await w.lifecycle('activate');assert.deepEqual(w.deleted,['bouldy-public-old']);assert.deepEqual(w.counts(),{skipped:0,claimed:0});
});
test('API reads/writes, private bundles and cross-origin URLs bypass service-worker handling',async()=>{
 const w=worker();await w.lifecycle('install');for(const [path,opts] of [['/api/identity',{}],['/api/command',{method:'POST'}],['/sessions/3',{method:'POST'}],['https://outside.test/route',{}],['/_expo/private.js',{mode:'cors'}]])assert.equal(await w.fetch(path,opts),null);
});
test('navigation reads the network without caching private content; network failure shows generic fallback',async()=>{
 const w=worker();await w.lifecycle('install');const before=[...w.stored.keys()];assert.equal(await(await w.fetch('/sessions/3')).text(),'private journal');assert.deepEqual([...w.stored.keys()],before);
 const offline=worker(async()=>{throw new TypeError('offline');});await offline.lifecycle('install');assert.equal(await(await offline.fetch('/profile')).text(),'/offline.html');assert.equal(offline.stored.has('/profile'),false);
});
