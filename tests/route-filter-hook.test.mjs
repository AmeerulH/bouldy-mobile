import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { pathToFileURL } from 'node:url';
// Exercise the actual native hook's effect and router patches, with fresh param
// identities like Expo Router supplies. Native UI tests separately cover React.
const subject=process.env.BOULDY_FILTER_TEST_SOURCE ? pathToFileURL(process.env.BOULDY_FILTER_TEST_SOURCE).href : new URL('../src/platform/route-filters.ts',import.meta.url).href;
globalThis.bouldyFilterHarness={params:{},effects:[],calls:[]};
const react='export function useEffect(effect){globalThis.bouldyFilterHarness.effects.push(effect)}';
const router='export function useLocalSearchParams(){return globalThis.bouldyFilterHarness.params} export function useRouter(){return {setParams(patch){const h=globalThis.bouldyFilterHarness;h.calls.push(patch);h.params={...h.params,...patch}}}}';
registerHooks({resolve(specifier,context,next){if(context.parentURL===subject && ['react','expo-router'].includes(specifier))return {url:'data:text/javascript,'+encodeURIComponent(specifier==='react'?react:router),shortCircuit:true};return next(specifier,context);}});
const {useRouteFilters,clearFilterState,FILTER_KEYS}=await import(subject);
const harness=globalThis.bouldyFilterHarness;
function FilterHarness(params,key='1:session-3'){harness.params={...params};const result=useRouteFilters(key);for(const effect of harness.effects.splice(0))effect();return result;}
function reset(){clearFilterState();harness.params={};harness.effects=[];harness.calls=[];}

test('native filter restore applies nonempty saved values once, then leaves URL-controlled state alone',()=>{
 reset();FilterHarness({}).set({colour:'blue'});harness.calls=[];FilterHarness({});assert.equal(harness.calls.length,1);assert.equal(harness.params.colour,'blue');FilterHarness(harness.params);assert.equal(harness.calls.length,1);
});
test('Clear all does not restore empty saved values or repeatedly dispatch SET_PARAMS',()=>{
 reset();const active=FilterHarness({colour:'blue'});active.set(Object.fromEntries(FILTER_KEYS.map(key=>[key,''])));assert.equal(harness.calls.length,1);
 for(let i=0;i<100;i++)FilterHarness(harness.params);
 assert.equal(harness.calls.length,1,'empty saved filters must not trigger a router/render feedback loop');
});
test('clearing the last search term stays cleared across rerenders and route return',()=>{
 reset();FilterHarness({}).set({q:'no-such-route'});FilterHarness(harness.params).set({q:''});harness.calls=[];for(let i=0;i<20;i++)FilterHarness({});assert.deepEqual(harness.calls,[]);
});
test('account lifecycle clearing removes native filter memory',()=>{
 reset();FilterHarness({}).set({grade:'V3',gym:'1'});clearFilterState();harness.calls=[];FilterHarness({});assert.deepEqual(harness.calls,[]);
});
