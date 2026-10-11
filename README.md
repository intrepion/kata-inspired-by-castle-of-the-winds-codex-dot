# The Lantern Below
An original, playable browser adventure inspired by the classic windowed dungeon RPG form. Bring three lost beacon seals home from a coastal labyrinth and silence its Bellkeeper.

**Play on this Mac:** http://127.0.0.1:5179/

Three connected seeded depths, fog and remembered terrain, bump combat, sentries, magic, salvage, inventory/equipment, refuge provisions, experience, journal, complete ending and validated autosaves. Defeat rescues you at refuge and costs carried gold; expedition progress remains. Free refuge rest restores health and focus. No assets, maps, characters or text copied from Castle of the Winds.

## Controls
Arrow keys / WASD move or attack. Space waits (+1 focus), E uses stairs, H mends, P drinks. Click adjacent tiles or use the touch d-pad. Bolt targets are visible buttons; failed actions and reading menus are free. Held movement keys are ignored after the initial action. Focused controls isolate gameplay shortcuts.

## Develop and verify
Node 24 recommended.
```
npm ci
npm test
npm run typecheck
npm run build
npm audit
npm run dev
```
Port 5179 is reserved for this project; strict port checking prevents silently taking another game's port.

## Restart the Mac session server
From this cloned folder:
```
npm run build
./scripts/start-session.sh
```
The script registers a launchd job **only in the current GUI login session**, from a plist in /tmp. No file is installed in LaunchAgents and it does not start at boot/login. The process continues when this Codex task ends; logout/reboot stops it. Rerun the script after login. If an existing registration is present it restarts the job. Logs: /tmp/lantern-below.stdout.log and /tmp/lantern-below.stderr.log.
To stop: `launchctl bootout gui/$(id -u)/com.intrepion.lantern-below`.
The server binds only 127.0.0.1. Run `npm run dev` instead during active development (stop session server first).

## Evidence and decisions
[Acceptance specification](docs/spec.md) · [Glossary](GLOSSARY.md) · [Skill adaptations](docs/workflow.md) · [Separate reviews](docs/review.md) · [Browser/test verification](docs/verification.md)

Inspiration checked against [Castle of the Winds gameplay](https://en.wikipedia.org/wiki/Castle_of_the_Winds) and [the creator interview](https://www.gamedeveloper.com/game-platforms/playing-catch-up-i-castle-of-the-winds-i-rick-saada). Matt Pocock Grill with Docs, Grilling, Domain Modeling, Implement, TDD and Code Review used; interview waits adapted to delegated recommended decisions. Standards/spec reviews ran independently.

Save v1 validates canonical seeded terrain and objectives, resource ranges, item ownership, guardian/enemy identity, position reachability and unique rewards. A corrupt primary save recovers the last valid backup; both invalid starts fresh with an explanation. Storage-denied mode retains play in memory with a warning. This compact campaign uses nine chamber placements with seeded extra connecting passages, rather than unrestricted procedural room shapes. No audio, external images, or external font requests.
