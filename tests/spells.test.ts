import {test} from 'node:test';import assert from 'node:assert/strict';
import {newGame,act,tile,type Game} from '../src/game.ts';import {decode,encode} from '../src/save.ts';
const learn=(s:Game,spell:'ward'|'blink')=>act(act(s,{type:'buyBook',spell}),{type:'learn',spell});
test('book costs once, learning takes one beat, repertoire and old saves survive',()=>{
 let s=learn(newGame(),'ward');assert.equal(s.gold,12);assert.equal(s.turn,1);assert.deepEqual(s.books,[]);assert.deepEqual(s.learned,['ward']);assert.equal(act(s,{type:'learn',spell:'ward'}).turn,1);assert.equal(act(s,{type:'buyBook',spell:'ward'}).gold,12);assert.deepEqual(decode(encode(s)),s);
 const legacy=JSON.parse(encode(newGame()));delete legacy.books;delete legacy.learned;delete legacy.ward;assert.deepEqual(decode(JSON.stringify(legacy))?.learned,[]);
 const bad=JSON.parse(encode(s));bad.books=['ward'];assert.equal(decode(JSON.stringify(bad)),null);
});
test('ward protects casting response and expires after three enemy beats',()=>{
 let s=learn(newGame(),'ward');s.floor=1;s.pos={...s.floors[0].up};const adjacent=[{x:s.pos.x+1,y:s.pos.y},{x:s.pos.x-1,y:s.pos.y},{x:s.pos.x,y:s.pos.y+1},{x:s.pos.x,y:s.pos.y-1}].find(p=>tile(s.floors[0],p)==='.')!;
 s.floors[0].enemies=[{...s.floors[0].enemies[0],...adjacent,attack:7,ranged:false}];s=act(s,{type:'cast',spell:'ward'});assert.equal(s.hp,25);assert.equal(s.mana,8);assert.equal(s.ward,2);assert.equal(s.turn,2);
 const again=act(s,{type:'cast',spell:'ward'});assert.equal(again.mana,s.mana);assert.equal(again.turn,s.turn);s=act(act(s,{type:'wait'}),{type:'wait'});assert.equal(s.ward,0);
});
test('blink costs exactly one action to clear floor; invalid targets cost nothing',()=>{
 let s=learn(newGame(),'blink');s.floor=1;s.pos={...s.floors[0].up};s.floors[0].enemies=[];
 const target=[{x:s.pos.x+1,y:s.pos.y},{x:s.pos.x-1,y:s.pos.y},{x:s.pos.x,y:s.pos.y+1},{x:s.pos.x,y:s.pos.y-1}].find(p=>tile(s.floors[0],p)==='.')!;assert.ok(target);
 const before=s.mana,turn=s.turn;s=act(s,{type:'cast',spell:'blink',point:target});assert.deepEqual(s.pos,target);assert.equal(s.mana,before-5);assert.equal(s.turn,turn+1);
 const bad=act(s,{type:'cast',spell:'blink',point:{x:-1,y:-1}});assert.equal(bad.turn,s.turn);assert.equal(bad.mana,s.mana);
});

test('normal salvage discovers a book once without changing gold and draught rewards',()=>{
 let s=newGame();s.floor=1;s.floors[0].enemies=[];const loot=s.floors[0].loot[0];
 const start=[{x:loot.x-1,y:loot.y},{x:loot.x+1,y:loot.y},{x:loot.x,y:loot.y-1},{x:loot.x,y:loot.y+1}].find(p=>tile(s.floors[0],p)!=='#')!;s.pos=start;
 const before=s.gold;s=act(s,{type:'move',dx:loot.x-start.x,dy:loot.y-start.y});assert.deepEqual(s.books,['ward']);assert.equal(s.gold,before+10);assert.equal(s.potions,4);
 s=act(s,{type:'learn',spell:'ward'});assert.deepEqual(s.learned,['ward']);assert.deepEqual(s.books,[]);
});

test('blink rejects salvage and unclaimed seal markers without cost or skipping their collection',()=>{
 for(const marker of ['salvage','seal'] as const){
  const s=learn(newGame(),'blink');s.floor=1;s.floors[0].enemies=[];const f=s.floors[0],target=marker==='salvage'?f.loot[0]:f.seal;
  s.pos=[{x:target.x-1,y:target.y},{x:target.x+1,y:target.y},{x:target.x,y:target.y-1},{x:target.x,y:target.y+1}].find(p=>tile(f,p)==='.')!;assert.ok(s.pos);const mana=s.mana,turn=s.turn,pos={...s.pos};
  const after=act(s,{type:'cast',spell:'blink',point:target});assert.equal(after.mana,mana);assert.equal(after.turn,turn);assert.deepEqual(after.pos,pos);assert.deepEqual(after.floors[0].loot,f.loot);assert.equal(after.seals,s.seals);
 }
});
