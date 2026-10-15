export const W = 19,
  H = 13;
export type Point = { x: number; y: number };
export type Enemy = Point & {
  id: number;
  name: string;
  hp: number;
  attack: number;
  ranged: boolean;
  boss: boolean;
};
export type Floor = {
  tiles: string[];
  seen: number[];
  enemies: Enemy[];
  loot: Point[];
  seal: Point;
  claimed: boolean;
  up: Point;
  down: Point;
};
export const SPELLS = ["ward", "blink"] as const;
export type Spell = typeof SPELLS[number];
export const BOOK_COST: Record<Spell,number> = {ward:6,blink:12};
export type Game = {
  version: 1;
  seed: number;
  floor: number;
  pos: Point;
  hp: number;
  mana: number;
  xp: number;
  gold: number;
  potions: number;
  weapon: string;
  armor: string;
  inventory: string[];
  books: Spell[];
  learned: Spell[];
  ward: number;
  seals: number;
  bossDead: boolean;
  won: boolean;
  turn: number;
  deaths: number;
  floors: Floor[];
  log: string[];
};
export type Action =
  | {type:"buyBook"|"learn";spell:Spell}
  | {type:"cast";spell:Spell;point?:Point}
  | { type: "move"; dx: number; dy: number }
  | { type: "bolt"; target: number }
  | { type: "equip" | "buy" | "sell"; item: string }
  | { type: "wait" | "heal" | "potion" | "travel" | "rest" | "light" };
export const ITEMS: Record<
  string,
  {
    slot: "weapon" | "armor";
    attack: number;
    defense: number;
    mana: number;
    price: number;
    description: string;
  }
> = {
  "Harbor knife": {
    slot: "weapon",
    attack: 4,
    defense: 0,
    mana: 0,
    price: 0,
    description: "Reliable steel. 4 melee damage.",
  },
  "Tide axe": {
    slot: "weapon",
    attack: 7,
    defense: 0,
    mana: -2,
    price: 22,
    description: "7 melee damage; maximum focus −2.",
  },
  "Glass wand": {
    slot: "weapon",
    attack: 3,
    defense: 0,
    mana: 5,
    price: 22,
    description: "3 melee damage; maximum focus +5. Bolt damage +3.",
  },
  "Oilskin coat": {
    slot: "armor",
    attack: 0,
    defense: 1,
    mana: 0,
    price: 0,
    description: "Soaks 1 damage from each blow.",
  },
  "Shell mail": {
    slot: "armor",
    attack: 0,
    defense: 3,
    mana: -2,
    price: 24,
    description: "Soaks 3 damage; maximum focus −2.",
  },
};
export const names = [
  "Refuge of Salt",
  "The Dry Cistern",
  "The Echo Galleries",
  "The Drowned Bell",
];
const distance = (a: Point, b: Point) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
export const maxHp = (s: Game) => 28 + Math.floor(s.xp / 12) * 5;
export const maxMana = (s: Game) =>
  12 + Math.floor(s.xp / 12) * 2 + ITEMS[s.weapon].mana + ITEMS[s.armor].mana;
export const tile = (f: Floor, p: Point) =>
  p.x < 0 || p.y < 0 || p.x >= W || p.y >= H ? "#" : f.tiles[p.y][p.x];
export function los(f: Floor, a: Point, b: Point) {
  let x = a.x,
    y = a.y;
  const dx = Math.abs(b.x - x),
    dy = Math.abs(b.y - y),
    sx = x < b.x ? 1 : -1,
    sy = y < b.y ? 1 : -1;
  let err = dx - dy;
  while (x !== b.x || y !== b.y) {
    const e = err * 2;
    if (e > -dy) {
      err -= dy;
      x += sx;
    }
    if (e < dx) {
      err += dx;
      y += sy;
    }
    if (tile(f, { x, y }) === "#") return x === b.x && y === b.y;
  }
  return true;
}
export const visible = (s: Game, p: Point) =>
  s.floor === 0 ||
  (distance(s.pos, p) <= 6 && los(s.floors[s.floor - 1], s.pos, p));
function random(seed: number) {
  let n = seed >>> 0;
  return () => {
    n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
    return n / 4294967296;
  };
}
function makeFloor(seed: number, depth: number): Floor {
  const r = random(seed + depth * 777),
    grid = Array.from({ length: H }, () => Array(W).fill("#") as string[]);
  // Nine connected chambers. A tree plus loops guarantees every route.
  const centers: Point[] = [];
  for (let row = 0; row < 3; row++)
    for (let col = 0; col < 3; col++) {
      const x = 3 + col * 6,
        y = 2 + row * 4;
      centers.push({ x, y });
      for (let yy = y - 1; yy <= y + 1; yy++)
        for (let xx = x - 2; xx <= x + 2; xx++) grid[yy][xx] = ".";
    }
  for (let i = 1; i < centers.length; i++) {
    const a = centers[i],
      b = centers[i % 3 === 0 ? i - 3 : i - 1];
    let x = a.x,
      y = a.y;
    while (x !== b.x) {
      grid[y][x] = ".";
      x += Math.sign(b.x - x);
    }
    while (y !== b.y) {
      grid[y][x] = ".";
      y += Math.sign(b.y - y);
    }
    grid[y][x] = ".";
  }
  for (let row = 1; row < 3; row++)
    for (let col = 1; col < 3; col++)
      if (r() > 0.35) {
        const x = 3 + col * 6;
        for (let y = 2 + (row - 1) * 4; y <= 2 + row * 4; y++) grid[y][x] = ".";
      }
  const up = { x: 3, y: 2 },
    down = { x: 15, y: 10 },
    seal = { x: 15, y: 6 };
  grid[up.y][up.x] = "<";
  grid[down.y][down.x] = ">";
  const enemies: Enemy[] = centers
    .filter((_, i) => [2, 4, 6, 8].includes(i))
    .map((p, i) => ({
      ...p,
      id: depth * 10 + i,
      name:
        i === 3 && depth === 3
          ? "Bellkeeper"
          : i % 2
            ? "Salt sentry"
            : "Cinder crab",
      hp: i === 3 && depth === 3 ? 26 : 8 + depth * 2,
      attack: 2 + depth,
      ranged: i % 2 === 1,
      boss: i === 3 && depth === 3,
    }));
  return {
    tiles: grid.map((row) => row.join("")),
    seen: [],
    enemies,
    loot: [
      { x: 9, y: 2 },
      { x: 3, y: 10 },
    ],
    seal,
    claimed: false,
    up,
    down,
  };
}
export function newGame(seed = 2718): Game {
  return {
    version: 1,
    seed,
    floor: 0,
    pos: { x: 1, y: 1 },
    hp: 28,
    mana: 12,
    xp: 0,
    gold: 18,
    potions: 3,
    weapon: "Harbor knife",
    armor: "Oilskin coat",
    inventory: ["Harbor knife", "Oilskin coat"],
    books: [], learned: [], ward: 0,
    seals: 0,
    bossDead: false,
    won: false,
    turn: 0,
    deaths: 0,
    floors: [1, 2, 3].map((d) => makeFloor(seed, d)),
    log: ["The beacon has gone dark. Three seals wait beneath the harbor."],
  };
}
function note(s: Game, t: string) {
  s.log = [...s.log, t].slice(-60);
}
function reveal(s: Game) {
  if (!s.floor) return;
  const f = s.floors[s.floor - 1];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (visible(s, { x, y }) && !f.seen.includes(y * W + x))
        f.seen.push(y * W + x);
}
function damage(s: Game, e: Enemy, n: number) {
  e.hp -= n;
  note(s, `${e.name} takes ${n} damage.`);
  if (e.hp <= 0) {
    s.xp += 6;
    s.gold += 8;
    if (e.boss) {
      s.bossDead = true;
      note(s, "The Bellkeeper falls. Carry the seals home.");
    }
    note(s, `+6 experience · +8 gold. Level ${1 + Math.floor(s.xp / 12)}.`);
    s.hp = Math.min(maxHp(s), s.hp + 3);
    s.floors[s.floor - 1].enemies = s.floors[s.floor - 1].enemies.filter(
      (m) => m.id !== e.id,
    );
  }
}
function enemyBeat(s: Game) {
  const f = s.floors[s.floor - 1];
  for (const e of f.enemies) {
    if (distance(e, s.pos) > 8 || !los(f, e, s.pos)) continue;
    if (distance(e, s.pos) === 1 || (e.ranged && distance(e, s.pos) <= 4)) {
      const n = Math.max(1, e.attack - ITEMS[s.armor].defense - (s.ward > 0 ? 3 : 0));
      s.hp -= n;
      note(s, `${e.name} ${e.ranged ? "rings" : "strikes"} for ${n}.`);
    } else {
      const queue = [s.pos],
        visited = new Set([s.pos.y * W + s.pos.x]),
        next = new Map<number, Point>();
      let found = false;
      while (queue.length && !found) {
        const p = queue.shift()!;
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const q = { x: p.x + dx, y: p.y + dy },
            k = q.y * W + q.x;
          if (
            tile(f, q) === "#" ||
            visited.has(k) ||
            f.enemies.some((m) => m !== e && m.x === q.x && m.y === q.y)
          )
            continue;
          visited.add(k);
          next.set(k, p);
          queue.push(q);
          if (q.x === e.x && q.y === e.y) {
            found = true;
            break;
          }
        }
      }
      const step = next.get(e.y * W + e.x);
      if (step) {
        e.x = step.x;
        e.y = step.y;
      }
    }
    if (s.hp <= 0) {
      s.deaths++;
      s.gold = 0;
      s.floor = 0;
      s.ward = 0;
      s.pos = { x: 1, y: 1 };
      s.hp = maxHp(s);
      s.mana = maxMana(s);
      note(
        s,
        "The refuge keeper rescues you. Carried gold is lost; your expedition remains.",
      );
      break;
    }
  }
}
export function act(original: Game, a: Action): Game {
  const s = structuredClone(original);
  s.books ??= []; s.learned ??= []; s.ward ??= 0;
  if (s.won) return s;
  let committed = false,
    arrival = false;
  const f = s.floors[s.floor - 1];
  if (a.type === "buyBook") {
    if (s.floor === 0 && SPELLS.includes(a.spell) && !s.books.includes(a.spell) && !s.learned.includes(a.spell) && s.gold >= BOOK_COST[a.spell]) {
      s.gold -= BOOK_COST[a.spell]; s.books.push(a.spell); note(s, `Purchased ${a.spell} primer. Learn it in the Spells tab.`);
    }
  } else if (a.type === "learn") {
    if (SPELLS.includes(a.spell) && s.books.includes(a.spell) && !s.learned.includes(a.spell)) {
      s.books = s.books.filter(x => x !== a.spell); s.learned.push(a.spell); committed = true;
      note(s, `Learned ${a.spell}. The primer is consumed; the spell remains yours.`);
    }
  } else if (a.type === "cast") {
    if (s.floor && s.learned.includes(a.spell)) {
      if (a.spell === "ward" && s.mana >= 4 && s.ward === 0) {
        s.mana -= 4; s.ward = 3; committed = true; note(s, "Ward: 3 defense for this response and the next two beats.");
      } else if (a.spell === "blink" && a.point && Number.isInteger(a.point.x) && Number.isInteger(a.point.y) && s.mana >= 5 && distance(s.pos,a.point) > 0 && distance(s.pos,a.point) <= 3 && tile(f,a.point) === "." && visible(s,a.point) && los(f,s.pos,a.point) && !f.enemies.some(e => e.x === a.point!.x && e.y === a.point!.y) && !f.loot.some(p => p.x === a.point!.x && p.y === a.point!.y) && !(!f.claimed && f.seal.x === a.point.x && f.seal.y === a.point.y)) {
        s.mana -= 5; s.pos = {...a.point}; committed = true; note(s, "Blink: crossed clear space. Enemies take their beat.");
      } else note(s, "Spell failed: check focus, active ward, or a clear unoccupied blink tile within 3 steps.");
    } else note(s, "Learn the spell first; cast only in a dungeon.");
  } else if (a.type === "move") {
    if (Math.abs(a.dx) + Math.abs(a.dy) !== 1) return s;
    const p = { x: s.pos.x + a.dx, y: s.pos.y + a.dy };
    if (s.floor === 0) {
      if (p.x < 1 || p.x > 7 || p.y < 1 || p.y > 5) return s;
      s.pos = p;
      committed = true;
    } else if (tile(f, p) !== "#") {
      const e = f.enemies.find((m) => m.x === p.x && m.y === p.y);
      if (e) damage(s, e, ITEMS[s.weapon].attack);
      else {
        s.pos = p;
        const loot = f.loot.findIndex((l) => l.x === p.x && l.y === p.y);
        if (loot >= 0) {
          f.loot.splice(loot, 1);
          s.gold += 10;
          s.potions++;
          note(s, "Salvage found: 10 gold and a healing draught.");
          const spell:Spell = s.floor === 1 ? "ward" : "blink";
          if (!s.books.includes(spell) && !s.learned.includes(spell)) {s.books.push(spell);note(s, `Found a ${spell} primer. Choose Spells to learn it.`);}
        }
        if (!f.claimed && p.x === f.seal.x && p.y === f.seal.y) {
          f.claimed = true;
          s.seals++;
          note(s, `Beacon seal recovered (${s.seals}/3).`);
        }
      }
      committed = true;
    }
  } else if (a.type === "travel") {
    if (s.floor === 0 && s.pos.x === 7 && s.pos.y === 3) {
      s.floor = 1;
      s.pos = { ...s.floors[0].up };
      committed = true;
      arrival = true;
    } else if (s.floor && tile(f, s.pos) === "<") {
      s.floor--;
      s.pos = s.floor ? { ...s.floors[s.floor - 1].down } : { x: 7, y: 3 };
      committed = true;
      arrival = true;
    } else if (s.floor < 3 && s.floor && tile(f, s.pos) === ">") {
      s.floor++;
      s.pos = { ...s.floors[s.floor - 1].up };
      committed = true;
      arrival = true;
    } else note(s, "Stand on a stair (or the refuge gate) to travel.");
  } else if (a.type === "bolt") {
    const e = f?.enemies.find((m) => m.id === a.target);
    if (
      e &&
      visible(s, e) &&
      distance(s.pos, e) <= 5 &&
      los(f, s.pos, e) &&
      s.mana >= 3
    ) {
      s.mana -= 3;
      damage(s, e, 9 + (s.weapon === "Glass wand" ? 3 : 0));
      committed = true;
    } else
      note(s, "Bolt requires 3 focus, a visible target and clear range of 5.");
  } else if (a.type === "heal") {
    if (s.hp < maxHp(s) && s.mana >= 4) {
      s.mana -= 4;
      s.hp = Math.min(maxHp(s), s.hp + 12);
      note(s, "Mend restores 12 health.");
      committed = true;
    } else note(s, "Mend requires injury and 4 focus.");
  } else if (a.type === "potion") {
    if (s.potions > 0 && s.hp < maxHp(s)) {
      s.potions--;
      s.hp = Math.min(maxHp(s), s.hp + 18);
      note(s, "Draught restores 18 health.");
      committed = true;
    }
  } else if (a.type === "wait") {
    s.mana = Math.min(maxMana(s), s.mana + 1);
    committed = true;
    note(s, "You wait. +1 focus.");
  } else if (a.type === "equip") {
    const item = ITEMS[a.item];
    if (item && s.inventory.includes(a.item) && s[item.slot] !== a.item) {
      s[item.slot] = a.item;
      s.mana = Math.min(s.mana, maxMana(s));
      committed = true;
      note(s, `${a.item} equipped.`);
    }
  } else if (a.type === "buy" && s.floor === 0) {
    const price = a.item === "Draught" ? 8 : ITEMS[a.item]?.price;
    if (
      price &&
      s.gold >= price &&
      (a.item === "Draught" || !s.inventory.includes(a.item))
    ) {
      s.gold -= price;
      if (a.item === "Draught") s.potions++;
      else s.inventory.push(a.item);
      note(s, `Purchased ${a.item}.`);
    } else note(s, "Insufficient gold, or already owned.");
  } else if (a.type === "sell" && s.floor === 0) {
    const item = ITEMS[a.item];
    if (
      item &&
      item.price > 0 &&
      s.inventory.includes(a.item) &&
      s.weapon !== a.item &&
      s.armor !== a.item
    ) {
      s.inventory = s.inventory.filter((i) => i !== a.item);
      s.gold += Math.floor(item.price / 2);
      note(s, `Sold ${a.item} for ${Math.floor(item.price / 2)} gold.`);
    }
  } else if (a.type === "rest" && s.floor === 0) {
    s.hp = maxHp(s);
    s.mana = maxMana(s);
    note(s, "Warm tea and lamplight. Health and focus restored.");
  } else if (a.type === "light" && s.floor === 0) {
    if (s.seals === 3 && s.bossDead) {
      s.won = true;
      note(
        s,
        "The lantern burns again. Ships will find their way home. Your expedition is complete.",
      );
    } else
      note(s, "The beacon needs all three seals and a silenced Bellkeeper.");
  }
  if (committed) {
    s.turn++;
    if (s.floor && !arrival) enemyBeat(s);
    if (s.ward > 0) s.ward--;
  }
  reveal(s);
  return s;
}
