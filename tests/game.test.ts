import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newGame,act} from '../src/game.ts';
test('a wall and a menu never advance a beat, a valid movement does',()=>{
const s=newGame(42); assert.equal(act(s,{type:'move',dx:-1,dy:0}).turn,0); assert.equal(act(s,{type:'move',dx:1,dy:0}).turn,1);
});
