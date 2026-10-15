# Spellbook discovery and permanent repertoire

> Final native acceptance completed on 2026-10-15. See [the normal-input record](LOCAL_ACCEPTANCE_2026-10-15.md) for observed outcomes and remaining limits. Earlier worker statements below describe source-only handoff evidence.

Primary research read 2026-10-15: [Rick Saada’s original-source port page](https://store.steampowered.com/app/4313160/Castle_of_the_Winds/) explicitly identifies learned spells and discovered magical items as defining systems. This bounded correction adds two original spells to the existing turn-grid dungeon. It does not reproduce dozens of original formulas or the full inventory GUI.

Books are separate from equipment inventory. Ward primer appears with unclaimed first-floor salvage; Blink appears with later salvage. Both are also finite one-copy refuge purchases for existing explored saves. Learn consumes a primer once and commits one beat. Ward protects the casting response plus two subsequent beats; Blink needs ordinary visible clear floor without salvage or unclaimed seals, costs 5 focus and commits one enemy response. Failed casts are free.

Existing v1 schema/key, canonical maps, seals, gold, gear and backups remain. Absent books/learned/ward fields migrate to []/[]/0; explicit malformed/null/duplicate/overlapping ownership rejects. Learned magic persists across rescue and saves. No timer or moving-world conversion.

Tests: all21 actual tests passed, including100 seeded connected maps, legacy save/corruption/backup checks and5 new spellbook regressions for cost/relearn/migration, protected damage/expiry, valid/invalid blink, book discovery and rejection of both salvage/seal destinations. Strict typecheck and production build passed; preserved preview PID76146 on5215 serves updated dist. Independent review’s Blink marker finding was corrected and rechecked successfully. Focused native acceptance completed; see central evidence below.

Normal-input route: refuge Shop → buy Ward primer → Spells → Learn → walk six east/two south to gate → E descend → Cast Ward and see remaining beats fall while an enemy responds → collect salvage or later buy Blink → Learn → Cast Blink → choose valid floor → observe focus/beat/position and an invalid click preserving focus → return/reload repertoire and continue a seal objective. Normal controls only; no progress injection.

Still omitted: eight-way held movement, drag/drop pack, weight/affixes and broad original spell set. No commits or pushes.

Native acceptance (2026-10-15): Both primers consumed/learned; Ward 4 focus; Blink 3 tiles / 5 focus / 1 beat; salvage target free rejection; collect 10 gold + draught; return/reload repertoire. Camera: Fixed top-down tile map with fog. Controls: Arrows/WASD; E stairs; Space wait; Shop/Spells; Blink target click. Central evidence: [native acceptance](LOCAL_ACCEPTANCE_2026-10-15.md) (screenshots alongside). Limit: Full 3-seal/boss campaign, natural primer discovery and seal-marker rejection not replayed natively; tests cover them. Existing localhost/127-origin saves were untouched; test progress was isolated at `http://fidelity-qa-20261015.localhost:5215/`.
