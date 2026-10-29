import test from 'node:test';
import assert from 'node:assert/strict';
import {sheetDragDistance,sheetDragDismisses} from '../src/features/sheet-drag.ts';
test('sheet distance retains the first move even when native translation resets to zero on activation',()=>{
 assert.equal(sheetDragDistance(525,701),176);assert.equal(sheetDragDismisses(525,701),true);
});
test('source dismissal is strictly greater than 80 and upward movement never drags or closes',()=>{
 assert.equal(sheetDragDismisses(100,180),false);assert.equal(sheetDragDismisses(100,180.01),true);assert.equal(sheetDragDistance(100,60),0);assert.equal(sheetDragDismisses(100,60),false);
});
