# Castle of the Winds spellbook native acceptance

2026-10-15 actual Mac Chrome/intrepion, dedicated tab222225542, isolated http://fidelity-qa-20261015.localhost:5215/. Final reviewed production build;21 actual tests/typecheck/build passed including both Blink-marker regressions. Native visible CUA controls/keys only, no model/state/DOM injection. User/root/Witness tabs and existing save origins preserved.

Camera: fixed top-down tile map with fog/remembered terrain. Controls: arrows/WASD bump-move/strike, E stairs, Space wait; Shop/Spells buttons learn/cast; Blink then visible floor click. Each valid committed action advances one enemy beat; menus do not.

Observed end-to-end: fresh18gold/beat0 → Shop Ward6 then Blink12 (0gold, both purchases disabled) → Spells Learn Ward then Blink (beat2, primers disappear, learned entries remain) → sixRight/twoDown/E down to DryCistern,You(3,2),beat11,focus12 → CastWard focus8/beat12/remaining2 → CastBlink, visible floor(6,2):You(6,2),focus3/beat13/ward1 → twoSpace:focus5/beat15/ward0 → aimBlink at visible salvage(9,2): position/focus5/beat15 unchanged → threeRight collects normal10gold and fourth draught,beat18/hp26.

Visible sentry was within range. CastWard then yieldedfocus1/beat19/ward2/hp25 while crab moved closer: one protected enemy response observed (previous unwarded approach had cost2hp). SixLeft/E returned to refuge,beat26/hp24, learned spells retained. Rest → reload → `Expedition restored`,hp28/focus12,10gold/4draughts; Spells tab still containedWard/Blink and no primers. Screenshots: ward-cast.jpg, rejected-salvage.jpg, ward-enemy-response.jpg, repertoire-reload.jpg.

One stale AX handle after buyingBlink was refreshed normally; no application defect or source/build/restart required. Native loop covers purchase→learn→cast→ordinary dungeon reward→return/reload. Unclaimed-seal rejection, natural book discovery and full three-seal/boss campaign remain source/test evidence, not newly completed native routes. Scope stays two learned spells and existing four-way turn-grid controls.

Native screenshots and the session record are preserved in `qa/fidelity-2026-10-15/`. No additional browser playthrough was performed by the documentation reviewer.

## Included native captures

- [ward-cast.jpg](qa/fidelity-2026-10-15/ward-cast.jpg)
- [rejected-salvage.jpg](qa/fidelity-2026-10-15/rejected-salvage.jpg)
- [ward-enemy-response.jpg](qa/fidelity-2026-10-15/ward-enemy-response.jpg)
- [repertoire-reload.jpg](qa/fidelity-2026-10-15/repertoire-reload.jpg)
