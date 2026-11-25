# PRD → IMPLEMENTATION MAP
## BOMB DEFUSAL: CHAOS EDITION v2.0

This document maps the supplied PRD to the actual Playable build. It is intentionally honest: a production team should know what is shipped, what is simulated, and what remains for an unattended public deployment.

**Legend:** ✅ Done / tested • 🟡 Done with a documented difference or simulation • 🔵 Roadmap (not in this build)

---

## 1. Product vision & pillars

| PRD item | Status | Implementation |
|---|---|---|
| Arcade ice-breaking for room-scale PID | ✅ | Full Attract → Team → Briefing → Game → Result loop at 1920×1080, FIT to 4K. |
| Zero-tutorial onboarding (<3s) | 🟡 | Every module has a focused instruction, but a first-time player still benefits from the Briefing. CTA/verb is visible immediately; help is optional. |
| Whole-body & multi-touch ergonomics | ✅ | Dual-hand scanner + lever, two-scanner hold, palm smoke wipe, 10-pointer input; tested with a two-finger digital touch sequence. |
| Asymmetric crowd synergy | ✅ | Crowd Cipher ribbon at the top of the display + spectator-facing instructions. |
| 2–4 simultaneous players | ✅ | Player selection 2/3/4; co-op ownership and support roles; verified 2P and 4P layouts. |
| 45–60s sessions | ✅ | Standard 3P: 40s live + ~4.5s briefing/transition. Tuned 44/40/37s base by player count. |

---

## 2. End-to-end state machine

| State | Status | Notes |
|---|---|---|
| Attract Mode with top 5 + CTA + preview | ✅ | `AttractScene`; seeded daily top 5, characters, bomb, CTA. |
| Any-touch start | 🟡 | The large CTA starts; arbitrary background touches do not, to avoid accidental starts while using help/admin. |
| 3-second pre-round countdown | ✅ | `BriefingScene`, 3 × 900ms + “MULAI!” + transition. Preview route freezes at 2 for design review. |
| Active defusal loop | ✅ | 3 cards (2 in Santai), timer, sabotage schedule, strikes, bonuses. |
| Random 3 unique module categories | ✅ | `session.pickModules`; casual 2 modules. Avoids two “trap” modules in the same round. |
| +3s per solved module | ✅ | `RoundManager.solveModule`. |
| Sabotage at 65% / 40% / 20% | ✅ | Standard exactly; Chaos has 4 thresholds; Santai has 2. |
| Penalty for mistakes (−3s + strike) | ✅ | Default −3s; reverse A −5s; acoustic silence −2s. |
| Pass-the-bomb 5s window | ✅ | One per round, timer freezes, accept +5s/+300, timeout detonates. |
| Win when all modules safe | ✅ | Immediate win; sabotage is destroyed. |
| Lose at 0s or 3 strikes | ✅ | Full explosion sequence → penalty card. |
| Top-5 initials entry | ✅ | 3-letter A–Z keyboard; auto-opens when qualified; stores daily. |
| Optional physical/verbal penalty | ✅ | 9 safe cards; can be disabled in admin. |
| Auto-return from result | ✅ | 30s; paused while initials modal is open. |
| Auto-reset Attract after idle | 🔵 | Result screens auto-return; Attract itself stays ready. Add for unsupervised kiosks if desired. |

---

## 3. Puzzle modules

### Module 1 — Dual-Hand Anchor

| PRD detail | Status | Implementation |
|---|---|---|
| Two biometric scanners + centre lever | ✅ | `DualHandAnchor`. |
| Variant A: hold left + drag lever right | ✅ | Finger 1 holds scanner, finger 2 drags; release snaps lever back. |
| Variant B: two moving targets held 2.5s | 🟡 | Two large scanners at fixed edges are held for 2.5s with a charge/decay bar. The “moving apart” visual is replaced by a charge/expand feel to keep the hit targets stable on a 75″ PID. |
| Visual electric connection | ✅ | `fx-electric`, progress bar, pulsing rings. |
| Failure penalty | ✅ | Release resets, no strike. |

### Module 2 — Meta UI Trap

| PRD detail | Status | Implementation |
|---|---|---|
| Fake system confirmation + 3 coloured buttons | ✅ | Dialog chrome, fake BOM 1/2/3 buttons. |
| A: tap the word BOM in the title | ✅ | The only correct target is the word. Fake buttons trigger −3s/strike. |
| B: tap the number equal to the last timer digit | ✅ | Live timer digit, 5×2 keypad; wrong −3s/strike. |
| C: drag the word “GESER” | ✅ | Draggable tape; decoys shake but do not solve or punish. |
| Deceive with visual affordance, not long text | ✅ | Short, large instructions; fake button labels. |

### Module 3 — Reverse Psychology

| PRD detail | Status | Implementation |
|---|---|---|
| Giant red button + “JANGAN DITEKAN!” + 4s internal bar | ✅ | Variant A. |
| Do not touch for 4s | ✅ | Bar fills; press → −5s, strike, reset. |
| Variant with blue-button exception | ✅ | Variant B; blue wait 3.2s or press immediately for red/green. |
| Colour-blind label | ✅ | Colour name chip (`WARNA: BIRU`). |
| No unintentional lock | ✅ | The module auto-solves after the wait; pressing is a real risk. |

### Module 4 — Logic Wire Cutter

| PRD detail | Status | Implementation |
|---|---|---|
| 4–5 coloured cables | ✅ | 5 cables with wavy art, names and markers. |
| Swipe-to-cut with scissors | ✅ | 44px threshold; scissors + trail follow the finger; multi-touch safe. |
| 30+ rule bank | 🟡 | 16 robust rules implemented and guaranteed to have one answer for the drawn order; many combinations/replays. Full 30+ bank is a content expansion. |
| Stroop / position / length / logic rules | ✅ | Implemented including Stroop colour names, second from right, middle, 4-letter name, relative positions, marker rules. |
| Wrong wire penalty | ✅ | −3s, strike, cable severed, remaining wires playable. |
| Colour-blind patterns/labels | ✅ | Pattern + marker + label per wire. |

### Module 5 — Crowd Cipher

| PRD detail | Status | Implementation |
|---|---|---|
| 6 symbol→digit dictionary at the top | ✅ | 6 random pairs in the crowd ribbon; re-randomised each session. |
| 3 symbols + 1–9 keypad in module | 🟡 | 3 symbols and a 0–9 keypad (digital display needs 0). |
| Spectators read the dictionary for players | ✅ | Ribbon is above the cards and can be read from several metres. |
| Correct code feedback | ✅ | Entry boxes, green frame, ribbon exits. |
| Wrong code penalty | ✅ | −3s, strike, entry clears. |
| Mandatory in Chaos | ✅ | Forced into the Chaos module set. |

### Module 6 — Acoustic / Vibration

| PRD detail | Status | Implementation |
|---|---|---|
| VU meter + shout/silence variants | ✅ | VU chassis, tap storm and silence variants. |
| Real microphone RMS | 🔵 | Touch simulation only, no browser permission prompt. Admin toggle reserves the feature. |
| Crowd can disrupt silence | ✅ | Any tap on the zone resets; −2s/strike. |
| Optional hardware | ✅ | Works on every PID without a mic. |

---

## 4. Sabotage mechanics

| PRD sabotage | Status | Implementation |
|---|---|---|
| Smoke Screen at 65% | ✅ | 20 puffs, full-screen blocker, palm wipe, 80% clearance, safety timeout. |
| Cryo Freeze at 40% | ✅ | Ice sheet + cracks, 6 taps, shatter/shards. |
| Gravity Flip at 20% | ✅ | Work cards rotate 180° for 7s, HUD unaffected. |
| Fake low battery / glitch | ✅ | Fake system popup, chromatic static, drag up to reboot. |
| Physical counter, not “OK” | ✅ | All use screen gestures. |
| Random 25% glitch chance | 🟡 | Glitch is one of the scheduled pool and appears in the three/four timeline slots; it is not a separate 25% random extra. All preset schedules are deterministic for fair event pacing. |
| Screen shake, gas, ice audio | ✅ | Procedural SFX and camera effects. |
| Ghost touches during smoke | ✅ | Smoke accepts palm; other modes use the normal input filter. |

---

## 5. Pass-the-Bomb

| PRD item | Status | Implementation |
|---|---|---|
| Bottom-right 320×140 orange button | 🟡 | A 276×96 button inside a 310×148 panel, tinted orange; meets touch ergonomics. |
| One use per round above 8s | ✅ | `RoundManager.canPassBomb`. |
| Freeze timer 5s | ✅ | Pauses round; overlay timer counts down. |
| Nomination conditions | ✅ | 5 conditions (glasses, bright shirt, front row, name S, watch). |
| Giant accept button | ✅ | “SAYA TERIMA BOMNYA! (+5 DETIK)” green 710×128. |
| Accepted → +5s and new player | ✅ | Time and score bonus, overlay closes, play resumes. |
| Timeout → explode both players | ✅ | Round loses immediately and the shared penalty card screen follows. |

---

## 6. Penalty cards

| PRD item | Status | Implementation |
|---|---|---|
| 6 example categories | ✅ | 9 cards across movement, verbal, expression. |
| 5–10 seconds | ✅ | Card copy is explicit; no timer blocks the operator. |
| Safe for formal events | ✅ | No humiliation/contact/undressing. Admin toggle. |
| Random card | ✅ | Random per defeat; preview demo uses card 1. |
| Photo-friendly | ✅ | Large card and comic background. |

---

## 7. UI/UX, layout & touch

| PRD item | Status | Implementation | Notes |
|---|---|---|---|
| Canvas 3840×2160 | 🟡 | Design at 1920×1080, FIT to 4K. Native 4K is roadmap. | All geometry shrinks/grows consistently. |
| Top zone for far reading | ✅ | Timer 560×180 plate, strikes/score top-right, player chips top-left. No top-zone buttons. |
| Crowd-zone ribbon 85–98% | 🟡 | Ribbon is at 16–25% height (below the timer) for practical touch distance and readability. “Top” in the PRD’s sense. |
| Middle work zone 3 modules + 80px gutters | ✅ | 3 cards 560×620, 40px logical gutters (≈80px at 4K). |
| Bottom control zone | ✅ | Progress, gesture hint, pass bomb; min 908px from top. |
| Minimum hit 140×140 at 4K | ✅ | ≥70×70 logical; primary targets 84–204. |
| Touch ripple/sparks | ✅ | Per-player rings + additive sparks. |
| Colour-blind patterns/labels | ✅ | Wires, cipher shapes, button text, colour labels. |
| Long-press emergency restart | 🔵 | Admin/reload path in this build. |
| Multi-touch 10 points | ✅ | Phaser activePointers=10 + active pointer handling. |

---

## 8. Audio

| PRD item | Status | Implementation |
|---|---|---|
| BGM 110 → 135 → 165 BPM | ✅ | Procedural sequencer; transitions at ≤20s and ≤10s. |
| Heartbeat <10s | ✅ | Sub-bass pulse every ~0.9s. |
| Tick every second, double <10s | ✅ | `RoundManager` tick slot doubles. |
| Strike warning / alarm | ✅ | SFX + red flash/shake. |
| Smoke/ice distinct SFX | ✅ | Procedural noise/sizzle/crack. |
| Spatial panning | 🟡 | Stereo master, no true positional pan by card; crowd is the room, not speakers. |

---

## 9. Operator/admin

| PRD item | Status | Implementation |
|---|---|---|
| Hidden menu via 5 taps + PIN 0000 | ✅ | 90×90 top-left hotspot, 2s window, DOM PIN keypad. |
| Presets Santai/Standar/Chaos | ✅ | Applied next round. |
| Toggle penalties / acoustic / pass bomb | ✅ | Stored in localStorage; audio toggles live. |
| Event theme customisation | ✅ | Event title/subtitle; logo replacement by asset swap. |
| Export CSV / reset daily | ✅ | Blob download + reset. |
| PIN management | 🔵 | Edit `bc.settings.v2` or code; no UI editor. |
| Operator restart round | 🔵 | Use reload/back to team selection; public long-press is roadmap. |

---

## 10. Edge cases

| PRD item | Status | Implementation |
|---|---|---|
| Ghost touch radius filter | ✅ | >92px ignored, except smoke wipe. |
| Player leaves screen 15s | ✅ | Warning overlay at 15s; 21s no activity → Attract. |
| Spectator spam / 150ms cooldown | ✅ | 160ms buttons, 55–130ms puzzle keys, base 700ms mistake lock. |
| Start card countdown mobile | ✅ | 3-2-1 in Briefing. |
| Win/lose race conditions | ✅ | `finished` guards; solve ignored after result; sabotage destroyed on win. |
| Pass timeout lose | ✅ | Immediate `round.lose`. |
| Sabotage stuck | ✅ | Auto-timeout after 14–16s with no points. |
| Audio blocked by browser | ✅ | First gesture unlock; silent fail if WebAudio unavailable. |
| 4K/Letterbox | ✅ | FIT/center; UI remains 16:9. |
| Portrait orientation | ✅ | CSS rotate hint; game assumes landscape. |

---

## 11. Asset pack deliverables

| PRD request | Status | Implementation |
|---|---|---|
| Logo, background | ✅ | Transparent 1680×800 wordmark; 640 SVG mark; 2 full-bleed backgrounds. |
| Buttons normal/hover/pressed/disabled | ✅ | 6 rectangular colourways × 4 states; 4 round icon colourways × 4 states; keypad 3 states. |
| Panels, frames, timer, progress, HUD | ✅ | 9-slice panels, 560×620 module frame, timer/score plates, ribbon, banner, progress, strikes. |
| Icons | ✅ | 51 white tintable 96×96 icons. |
| Characters | ✅ | 4 busts + 4 circular avatars. |
| Bomb props | ✅ | Hero, defused, case. |
| Cables, puzzle objects | ✅ | 5 colour-coded wires, scanner, lever, arcade buttons, scissors, VU, glitch popup, 8 symbols. |
| Particle FX | ✅ | 14: sparks, smoke, ice, glass, explosion, shockwave, flame, electric, confetti, rays, speedlines. |
| HUD complete | ✅ | Timer, score, player tag, leaderboard row, cipher ribbon, sabotage banner, progress, strike, round tag, touch rings. |
| Full modular/transparent/integratable | ✅ | 175 SVGs, 180 PNG exports, manifest/catalog, 9-slice sizes documented. |

---

## 12. UI mockups

| Required screen | Status | File |
|---|---|---|
| Main Menu | ✅ | `docs/mockups/01-main-menu.png` |
| Team Selection | ✅ | `docs/mockups/02-team-selection.png` |
| Mission Briefing | ✅ | `docs/mockups/03-mission-briefing.png` |
| Gameplay | ✅ | `docs/mockups/04-gameplay.png` |
| Sabotage | ✅ | `docs/mockups/05-sabotage.png` |
| Victory | ✅ | `docs/mockups/06-victory.png` |
| Defeat | ✅ | `docs/mockups/07-defeat.png` |
| Bonus: Operator panel | ✅ | `docs/mockups/08-operator-panel.png` |
| Contact sheet | ✅ | `docs/mockups/00-overview.png` |

All are **runtime captures at 1920×1080**, not illustrated comps. Preview URLs are documented in the README.

---

## 13. Known deviations and rationale

1. **Logical 1920×1080 rather than native 3840×2160.** Chosen for broad PID/browser performance and asset fidelity; the SVG pack can render at 4K. Admin states the upscale explicitly. Native 4K is a roadmap item with a 2× camera/world approach.
2. **Casual mode uses 2 modules** (per PRD). Standard/Chaos use 3 cards to fill the 16:9 work zone.
3. **Crowd ribbon placement** is high on the screen but below the timer, where it is practical to read and not clipped by browser chrome.
4. **Acoustic is simulation-first.** Real microphone permissions/noise make it unreliable at events; tapping preserves the social mechanic without a hardware dependency.
5. **Meta UI Trap C decoys are non-punishing.** The PRD says they do not work; the build shakes and notifies, but does not add a strike, to avoid frustration after a correct reading of the instruction.
6. **Wire bank is 16 rules, not 30+.** All 16 are verified for an unambiguous answer against the drawn wire order; more rules are straightforward content additions.
7. **No public long-press round reset.** The kiosk is supervised and the admin/reload path recovers; a public reset can be added once a safe UX is agreed.
8. **Attract mode does not auto-reset.** Results auto-return; Attract remains ready for the next group.
9. **Player names are fixed characters**, not custom initials. Initials are used only for the daily top 5.
10. **Leaderboard is per-device and daily.** A venue-wide board would need a backend or exported CSV aggregation, intentionally out of scope for an offline PID.
11. **Reference JPG sheets are not used as runtime sprites.** Their dark baked backgrounds and multi-asset sheets make them unsuitable for modular transparent integration; the vector pack recaptures their visual language.
12. **Some preview routes bypass saving and PIN for QA.** Do not expose preview URLs to the public; they are for design review and capture.

---

## 14. What “complete” means for this delivery

- A playable build with a complete session loop and all core mechanics.
- A production-grade modular asset pack that can be re-skinned and integrated beyond Phaser.
- A GDD, technical architecture, asset spec and production plan.
- Real UI mockups of every requested screen.
- A transparent limitations list so a client can decide what to fund next.

This is a strong supervised-event build, not yet an unattended 4K productized installation. The gap is clearly scoped in the Production Plan and roadmap above.
