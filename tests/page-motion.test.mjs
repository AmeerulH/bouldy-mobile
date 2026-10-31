import test from 'node:test';
import assert from 'node:assert/strict';
import { pageTransition, tabSwipeDestination } from '../src/features/page-motion.ts';

test('same path and query-only changes never create a page entrance', () => {
  assert.equal(pageTransition('/sessions/3', '/sessions/3'), null);
});
test('pushed screens retain direction while main tab switches stay quiet', () => {
  assert.deepEqual(pageTransition('/sessions', '/sessions/3'), { distance: 28, duration: 260 });
  assert.deepEqual(pageTransition('/sessions/3', '/sessions'), { distance: -28, duration: 260 });
  assert.deepEqual(pageTransition('/sessions', '/climbs'), { distance: 28, duration: 260 });
  assert.equal(pageTransition('/sessions', '/'), null);
  assert.deepEqual(pageTransition('/login', '/welcome'), { distance: 18, duration: 220 });
});
test('tab swipes respect browser edges, 90px travel, 2:1 intent and sequence boundaries', () => {
  const start = { x: 200, y: 300 };
  assert.equal(tabSwipeDestination('/sessions', start, { x: 110, y: 345 }, 390), '/profile');
  assert.equal(tabSwipeDestination('/sessions', start, { x: 111, y: 300 }, 390), null);
  assert.equal(tabSwipeDestination('/sessions', start, { x: 110, y: 346 }, 390), null);
  assert.equal(tabSwipeDestination('/', { x: 27, y: 300 }, { x: 150, y: 300 }, 390), null);
  assert.equal(tabSwipeDestination('/', start, { x: 300, y: 300 }, 390), null);
  assert.equal(tabSwipeDestination('/profile', start, { x: 100, y: 300 }, 390), null);
  assert.equal(tabSwipeDestination('/sessions/3', start, { x: 100, y: 300 }, 390), null);
});

test('native controls and rails exclude only their own touch sequence',async()=>{
 const {markControlTouch,isControlTouch}=await import('../src/features/touch-guard.ts');markControlTouch(100);assert.equal(isControlTouch(100),true);assert.equal(isControlTouch(101),false);for(let n=101;n<180;n++)markControlTouch(n);assert.equal(isControlTouch(100),false);assert.equal(isControlTouch(179),true);
});

test('modified browser presses retain native browser navigation without a loading overlay',async()=>{
 const {navigationPressAllowed}=await import('../src/platform/navigation-state.ts');assert.equal(navigationPressAllowed({nativeEvent:{}}),true);assert.equal(navigationPressAllowed({nativeEvent:{metaKey:true}}),false);assert.equal(navigationPressAllowed({nativeEvent:{ctrlKey:true}}),false);assert.equal(navigationPressAllowed({nativeEvent:{button:1}}),false);
});
