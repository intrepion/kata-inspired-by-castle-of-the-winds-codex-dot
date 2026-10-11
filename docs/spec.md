# The Lantern Below — acceptance specification
A 10–20 minute original coastal dungeon expedition. A quiet harbor has lost its beacon. Recover one seal on each of three connected dungeon floors, defeat the Bellkeeper, and return to the refuge to light the beacon.

- Seeded repeatable connected rooms, visible stairs, fog of war with remembered terrain and line of sight. Every seal and enemy is reachable. Floor contents persist across travel.
- One successful move, bump attack, cast, potion, equip, wait, or stair travel consumes one turn. Walls, invalid casts, menus, inspection and shop choices consume no turns. Hub is safe. Held keys do not repeat.
- Pursuers use connected paths; sentries shoot only with clear range/line of sight. Telegraph and stats are inspectable. Melee, bolt and healing, mana, potions, armor and weapon choices matter.
- Loot and seals cannot be collected twice. XP raises health and mana. Town shop trades gold for equipment and potions. Safe refuge restores resources without cost; defeat returns the player to refuge, forfeiting carried gold but retaining expedition progress.
- Complete ending requires three seals and Bellkeeper defeat, then interaction in refuge. Restart requests explicit second click and offers a fresh seed.
- Versioned validated autosave rejects corruption, uses prior valid backup, or starts fresh with an explanation. No remote services.
- Keyboard and touch directions, clickable adjacent tiles and visible spell targets. Input in menus/forms is isolated from gameplay. Accessible labels, focus rings, readable mobile layout and reduced motion.
- Tests at agreed public seams: newGame(seed), act(state, action), encode/decode save and terrain queries. Delegation explicitly authorizes recommended seams and design choices.
- Actual browser play to ending, defeat/recovery, reload, menus, repeated input, mobile layout. Full tests, typecheck, build, audit; private push and matching CI.
