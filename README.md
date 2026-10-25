# The Lantern Below
An original, playable browser adventure inspired by the classic windowed dungeon RPG form. Bring three lost beacon seals home from a coastal labyrinth and silence its Bellkeeper.

**Play on this Mac:** http://127.0.0.1:5215/

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
The current audited production preview runs on port 5215. The package scripts and existing session launcher default to 5179; strict port checking prevents silently taking another game's port.

## Legacy Mac session server (5179)
The existing session launcher targets 5179. The current production preview at 5215 is a separate loopback preview. From this cloned folder:
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

## Learned spellbooks (local fidelity correction)
The **Spells** desk tab now holds a permanent repertoire. First-depth salvage can contain a **Ward primer**; deeper salvage can contain **Blink**. The refuge Shop also sells the two primers (6 / 12 gold), so an existing explored save is not locked out. Learn consumes its primer and one beat; it cannot duplicate the spell.

Ward costs 4 focus and adds 3 defense for the casting response plus two more committed beats. Blink costs 5 focus: choose a visible, unoccupied ordinary floor tile without salvage or an unclaimed seal, within three clear steps. Failed learning/casting spends no resources or beat. Valid casts allow one enemy response. Existing Bolt/Mend, gear and three-depth campaign remain. Old v1 saves and backups acquire empty learned/book fields safely; all existing progress remains. [Research and acceptance](docs/fidelity-spellbooks.md).

## Play online

[Play the hosted game](https://intrepion.github.io/kata-inspired-by-castle-of-the-winds-codex-dot/)
