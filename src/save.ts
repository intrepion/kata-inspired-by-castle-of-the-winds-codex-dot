import { type Game, ITEMS, W, H, maxHp, maxMana, tile, newGame } from "./game";
export const SAVE_KEY = "lantern-below-v1",
  BACKUP_KEY = SAVE_KEY + "-backup";
const integer = (n: unknown, min: number, max: number) =>
  typeof n === "number" && Number.isInteger(n) && n >= min && n <= max;
const point = (p: any) => p && integer(p.x, 0, W - 1) && integer(p.y, 0, H - 1);
export const encode = (s: Game) => JSON.stringify(s);
export function decode(raw: string | null): Game | null {
  try {
    if (!raw || raw.length > 100000) return null;
    const s = JSON.parse(raw);
    if (
      !s ||
      s.version !== 1 ||
      !integer(s.seed, 0, 4294967295) ||
      !integer(s.floor, 0, 3) ||
      !point(s.pos) ||
      !["won", "bossDead"].every((k) => typeof s[k] === "boolean") ||
      !["xp", "gold", "potions", "turn", "deaths"].every((k) =>
        integer(s[k], 0, 1000000),
      ) ||
      !integer(s.seals, 0, 3) ||
      !Array.isArray(s.inventory) ||
      s.inventory.length > 5 ||
      !s.inventory.every(
        (i: unknown) => typeof i === "string" && Object.hasOwn(ITEMS, i),
      ) ||
      new Set(s.inventory).size !== s.inventory.length ||
      typeof s.weapon !== "string" ||
      !Object.hasOwn(ITEMS, s.weapon) ||
      ITEMS[s.weapon].slot !== "weapon" ||
      typeof s.armor !== "string" ||
      !Object.hasOwn(ITEMS, s.armor) ||
      ITEMS[s.armor].slot !== "armor" ||
      !s.inventory.includes(s.weapon) ||
      !s.inventory.includes(s.armor) ||
      !integer(s.hp, 1, maxHp(s)) ||
      !integer(s.mana, 0, maxMana(s)) ||
      !Array.isArray(s.log) ||
      s.log.length > 60 ||
      !s.log.every((l: unknown) => typeof l === "string" && l.length < 400) ||
      !Array.isArray(s.floors) ||
      s.floors.length !== 3
    )
      return null;
    const canonical = newGame(s.seed);
    let seals = 0;
    for (const [index, f] of s.floors.entries()) {
      if (
        !f ||
        !Array.isArray(f.tiles) ||
        f.tiles.length !== H ||
        !f.tiles.every(
          (r: unknown) =>
            typeof r === "string" && r.length === W && /^[#.<>]+$/.test(r),
        ) ||
        !point(f.up) ||
        !point(f.down) ||
        !point(f.seal) ||
        tile(f, f.up) !== "<" ||
        tile(f, f.down) !== ">" ||
        tile(f, f.seal) === "#" ||
        typeof f.claimed !== "boolean" ||
        !Array.isArray(f.seen) ||
        f.seen.length > W * H ||
        !f.seen.every((n: unknown) => integer(n, 0, W * H - 1)) ||
        !Array.isArray(f.loot) ||
        f.loot.length > 2 ||
        !f.loot.every((p: unknown) => point(p) && tile(f, p as any) !== "#") ||
        !Array.isArray(f.enemies) ||
        f.enemies.length > 4 ||
        !f.enemies.every(
          (e: any) =>
            point(e) &&
            tile(f, e) !== "#" &&
            integer(e.id, 10, 33) &&
            typeof e.name === "string" &&
            e.name.length < 40 &&
            integer(e.hp, 1, 26) &&
            integer(e.attack, 1, 10) &&
            typeof e.ranged === "boolean" &&
            typeof e.boss === "boolean",
        ) ||
        new Set(f.enemies.map((e: any) => e.id)).size !== f.enemies.length
      )
        return null;
      const source = canonical.floors[index];
      if (
        JSON.stringify(f.tiles) !== JSON.stringify(source.tiles) ||
        JSON.stringify(f.up) !== JSON.stringify(source.up) ||
        JSON.stringify(f.down) !== JSON.stringify(source.down) ||
        JSON.stringify(f.seal) !== JSON.stringify(source.seal) ||
        new Set(f.loot.map((p: any) => p.y * W + p.x)).size !== f.loot.length ||
        !f.loot.every((p: any) =>
          source.loot.some((q) => p.x === q.x && p.y === q.y),
        ) ||
        new Set(f.enemies.map((e: any) => e.y * W + e.x)).size !==
          f.enemies.length ||
        !f.enemies.every((e: any) => {
          const expected = source.enemies.find((m) => m.id === e.id);
          return (
            expected &&
            e.name === expected.name &&
            e.attack === expected.attack &&
            e.ranged === expected.ranged &&
            e.boss === expected.boss &&
            e.hp <= expected.hp
          );
        })
      )
        return null;
      // Validate reachable saved terrain, including objective, keeper and inhabitants.
      const queue = [f.up],
        reached = new Set([f.up.y * W + f.up.x]);
      for (let i = 0; i < queue.length; i++) {
        const p = queue[i];
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const q = { x: p.x + dx, y: p.y + dy },
            k = q.y * W + q.x;
          if (tile(f, q) !== "#" && !reached.has(k)) {
            reached.add(k);
            queue.push(q);
          }
        }
      }
      if (
        ![
          f.down,
          f.seal,
          ...f.loot,
          ...f.enemies,
          ...(s.floor === index + 1 ? [s.pos] : []),
        ].every((p) => reached.has(p.y * W + p.x))
      )
        return null;
      if (f.claimed) seals++;
    }
    if (
      s.seals !== seals ||
      s.bossDead === s.floors[2].enemies.some((e: any) => e.boss) ||
      (s.won && (!s.bossDead || s.seals !== 3 || s.floor !== 0))
    )
      return null;
    if (
      s.floor
        ? tile(s.floors[s.floor - 1], s.pos) === "#"
        : s.pos.x < 1 || s.pos.x > 7 || s.pos.y < 1 || s.pos.y > 5
    )
      return null;
    return s as Game;
  } catch {
    return null;
  }
}
export function load(storage: Pick<Storage, "getItem">): {
  game: Game | null;
  message: string;
} {
  try {
    const raw = storage.getItem(SAVE_KEY);
    const game = decode(raw);
    if (game) return { game, message: "Expedition restored." };
    const backup = decode(storage.getItem(BACKUP_KEY));
    return {
      game: backup,
      message: backup
        ? "Damaged save: previous valid beat restored."
        : raw
          ? "Damaged save discarded. A fresh expedition awaits."
          : "",
    };
  } catch {
    return {
      game: null,
      message: "Storage unavailable. Expedition runs in memory.",
    };
  }
}
export function persist(
  storage: Pick<Storage, "getItem" | "setItem">,
  s: Game,
) {
  try {
    const previous = storage.getItem(SAVE_KEY);
    if (decode(previous)) storage.setItem(BACKUP_KEY, previous!);
    storage.setItem(SAVE_KEY, encode(s));
    return true;
  } catch {
    return false;
  }
}
