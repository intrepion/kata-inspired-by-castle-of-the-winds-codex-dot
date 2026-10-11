# Verified on the user's Mac
2026-10-11, Chrome, http://127.0.0.1:5179.

Campaign chart 2718 completed entirely through visible d-pad movement, bolt target buttons, draught/wait, stairs, refuge trade/rest and beacon controls. No save injection, cheats, or direct engine calls used for browser campaign.
- Beat 9 entered cistern. Salvage collected, crabs/sentries defeated with bolts; first level gain verified.
- Refuge: shell mail purchased/equipped and resources restored. Beat 50 reload retained chart, position (9,6), turn, kit, resources and floor contents.
- First seal beat 56; depth two entered beat 77. Second seal recovered. Deliberately waited under sentry fire; rescued once with zero gold, both seals retained, equipment/XP/floor contents retained (beat 138).
- Resumed cleared floors; depth three entered, last seal recovered beat 232. Used melee, draughts and focus regeneration tactically.
- Bellkeeper defeated beat 245. Returned through all three depths; beacon lit at beat 304, level 6, 3 seals, 1 rescue, 27/53 health. Ending survives reload.
- New expedition first click preserved ending and requested confirmation; second click reset to beat 0 with new chart 3715. Guide navigation and ArrowRight while its control focused preserved beat 0. ArrowRight from heading moved once; holding D for 1200ms advanced only one additional beat.
- 390×844 mobile viewport inspected after reload: CSS mobile flex layout; no horizontal overflow. Increased touch actions and d-pad to 44px and simplified mobile keeper stats after visual inspection. Mobile ending captured. Viewport restored.
- Final fresh chart 4712 left at beat 0 after checks. Production browser load reverified with full starting health/focus, zero XP/rescues and original kit. Session job com.intrepion.lantern-below running under launchd; HTTP 200. Existing port 5177/5178 listener PIDs unchanged. Browser console review showed only unrelated extension warnings, no app error in inspected logs.

Screenshots: docs/screenshots/ending.jpg, mobile-ending.jpg, starting-game.jpg, mobile-dungeon.jpg. Full-page screenshots may be tall because field desk and journal remain accessible vertically.

Unit tests exercise public transition/save seams, 100-seed full terrain connectivity, scheduling/collision, melee/ranged behavior and line of sight, costs/healing, equipment/trades, deaths/restart, progression, travel persistence, one-time loot/seals, objective, round trip/version/corruption/backups and malicious nested input. First movement and save seams used failing tests before implementation; review regressions also red → green. Remaining behavior tests were added after initial engine implementation, so this is not a claim that every feature was strictly test-first.

No public deployment, paid service, external gameplay request or original game asset. Browser campaign demonstrates one seed; connectivity tests cover 100 seeds. Screen reader behavior was not tested with a screen reader. LocalStorage is browser-profile/origin specific. Only this current Mac login session runs the server; log out/reboot stops it. No login/boot autostart installed. Codex project sidebar registration is not exposed by supported current tools; cloned folder is delivered, not registered.
