import test from 'node:test';
import assert from 'node:assert/strict';
import middleware from '../src/app/+middleware.ts';
test('legacy history returns a server redirect to the original journal destination',()=>{
 const response=middleware(new Request('https://bouldy.test/history?old=1'));assert.equal(response.status,307);assert.equal(response.headers.get('location'),'https://bouldy.test/sessions');
});
test('all development catalogues return branded, uncached 404 documents in production',async()=>{
 const before=process.env.NODE_ENV;process.env.NODE_ENV='production';try{for(const path of ['/brand-preview','/loading-preview','/component-preview']){const response=middleware(new Request('https://bouldy.test'+path));assert.equal(response.status,404);assert.equal(response.headers.get('cache-control'),'no-store');assert.match(await response.text(),/That route is off the wall/);}}finally{process.env.NODE_ENV=before;}
});
test('middleware does not intercept normal product or API requests',()=>{
 assert.equal(middleware(new Request('https://bouldy.test/climbs')),undefined);assert.equal(middleware(new Request('https://bouldy.test/api/command',{method:'POST'})),undefined);
});
