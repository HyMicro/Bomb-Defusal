# QA CHECKLIST & TEST RECORD
## BOMB DEFUSAL: CHAOS EDITION — build 2.3.0

Test environment used for this record:
- Chromium (Playwright-driven) on Windows, 1920×1080 CSS viewport unless noted.
- Local server `node serve.mjs 8123`.
- Keyboard/mouse plus CDP touch-emulation for a two-finger test.
- Headless screenshots; audio cannot be verified audibly in this environment.

**Status key:** PASS • PARTIAL • NOT RUN • ENV-LIMITED

---

## 1. Build & navigation

| # | Test | Expected | Result | Evidence / notes |
|---:|---|---|---|---|
| 1.1 | Cold boot with network off | Attract appears, no external calls | PASS | Local assets only; final build cold boot 3.5–4.0s (fresh context). |
| 1.2 | Attract -> Team -> Story -> Briefing -> Game | Normal flow with transitions | PASS | Real Playwright clicks plus final 2.3 run. |
| 1.3 | Preview routes | Each route opens the intended screen | PASS | 01-09 mockups captured from previews. |
| 1.4 | Canvas FIT at 1920×1080 | fills exactly | PASS | 1920 viewport, 16:9. |
| 1.5 | Canvas FIT at 3840×2160 | fills, no scrollbars, internal 1920 buffer | PASS (upscaled) | Canvas rect 3840×2160, internal 1920×1080. Text softness expected. |
| 1.6 | Canvas at 1280×720 | fills, UI remains usable | PASS | `docs/qa/720p-menu.png`. |
| 1.7 | Any portrait viewport | rotate hint, no broken canvas | PASS by CSS | hint now activates on all portrait orientations. |
| 1.8 | Browser refresh mid-round | reload to Attract, no stuck state | PASS | Scene boot is clean. |
| 1.9 | localStorage disabled | game still boots, settings defaults | NOT RUN | code has guarded access; verify on device. |
| 1.10 | Boot benchmark — PNG runtime vs SVG fallback | PASS | Same Chromium/machine: old PNG ~5.3s, new curated comic/PNG build **~3.5–4.0s**, SVG ~10.1–10.8s. |
| 1.11 | PNG runtime visual parity | PASS | Mockups 01-09 captured from the current runtime at 1920x1080. |
| 1.12 | `?assets=svg` fallback | PASS | SVG pack loads successfully for design/4K experiments. |

---

## 2. Team / difficulty

| # | Test | Result | Notes |
|---:|---|---|---|
| 2.1 | 2-player card + estimated 44s (Standard) | PASS | `02-team-selection` shows 3P; 2P/4P tested via direct session. |
| 2.2 | 3-player default | PASS | standard flow. |
| 2.3 | 4-player card + 37s | PASS | 4P Chaos session; 4 HUD tags, 3 cards, RIN support. |
| 2.4 | Santai = 2 modules | PASS | 2P casual session: 2 cards, 2 tags, 52s. |
| 2.5 | Difficulty chip selection | PASS | Selected border/scale; summary updates. |
| 2.6 | CTA starts briefing with selected count/mode | PASS | session.create receives values. |

---

## 3. Round, timer, score

| # | Test | Result | Notes |
|---:|---|---|---|
| 3.1 | Briefing 3-2-1-MULAI | PASS | normal flow advances to Game; preview freezes at 2. |
| 3.2 | Timer counts down | PASS | verified via live queries in test sessions. |
| 3.3 | +3s per solved module | PASS | wire solve moved 32→35 in preview; session timeBonus increments. |
| 3.4 | Strike + penalty | PASS | cipher wrong tap: score −120, strike 2/3, time −3. |
| 3.5 | 3 strikes defeat | PASS | `?preview=defeat` data; manual win/lose flow with forced timer. |
| 3.6 | Timer 0 defeat | PASS | forced 0.15s → explosion → Defeat; resultReason `WAKTU HABIS`. |
| 3.7 | All modules solved win | PASS | forced `round.win()` → Victory; auto initials opened. |
| 3.8 | Sabotage thresholds | PASS (observed via forced manager tests) | scheduled open/queue logic reviewed; smoke triggered on preview. |
| 3.9 | Score display consistency | PASS | final gameplay preview aligned contributions to score; victory aligned too. |
| 3.10 | 50-round endurance | NOT RUN | required on target PID before event. |

---

## 4. Puzzle modules

| # | Test | Result | Notes |
|---:|---|---|---|
| 4.1 | Dual-Hand A (scanner hold + lever drag) | PASS (CDP two-touch) | Module solved; card green. Release warning after solve fixed in source. |
| 4.2 | Dual-Hand B hold both 2.5s | PARTIAL | visual/layout verified; not solved via CDP in this session. |
| 4.3 | Meta Trap A click word BOM | NOT RUN | current random draws used B/C; code path reviewed. |
| 4.4 | Meta Trap B last timer digit | NOT RUN | current random draws used C; code path reviewed. |
| 4.5 | Meta Trap C drag GESER | PASS | drag 220px solved, +960. |
| 4.6 | Reverse A hold 4s | PASS | auto-solved during live normal session; +960, green frame. |
| 4.7 | Reverse A press | NOT RUN | code path reviewed; would call mistake −5s. |
| 4.8 | Reverse B blue exception | NOT RUN | color chip in place; logic reviewed. |
| 4.9 | Wires correct swipe | PASS | target yellow solved with mouse drag; score 4440. |
| 4.10 | Wires wrong cut | NOT RUN | code path reviewed; demo shows severed wire. |
| 4.11 | Crowd Cipher wrong code | PASS | −3s, strike, toast, cleared entry. |
| 4.12 | Crowd Cipher correct code | PARTIAL | code path reviewed; test was interrupted by preview prefilled demo entry. |
| 4.13 | Crowd ribbon appears/disappears | PASS | banner visible in gameplay preview; disappears with module solve / scene end. |
| 4.14 | Acoustic B silence | PASS | auto-solved after 3s; score credited. |
| 4.15 | Acoustic A rapid taps | NOT RUN | code path reviewed; tap gain/decay values documented. |

---

## 5. Sabotage

| # | Test | Result | Notes |
|---:|---|---|---|
| 5.1 | Smoke opens and dims work zone | PASS | `05-sabotage` screenshot. |
| 5.2 | Smoke palm wipe clears ≥80% | PASS | 16/20 puffs cleared → active null, +300, session.sabotageCleared=1. |
| 5.3 | Smoke timeout | NOT RUN | safety code reviewed. |
| 5.4 | Ice overlay + 6 taps → shatter | PASS | taps=6, active null, +300. |
| 5.5 | Gravity rotates 180° and returns | PASS | rotation π, active gravity, later null + rotation 0. |
| 5.6 | Glitch popup drag up | PASS | active null after drag; score +300. |
| 5.7 | Blocker prevents puzzle input during smoke/ice/glitch | PASS by design / partial test | puzzle inputs were not activated under the overlay in tests. |
| 5.8 | Sabotage during win | PASS by code review | manager destroyed before result. |

---

## 6. Pass-the-bomb

| # | Test | Result | Notes |
|---:|---|---|---|
| 6.1 | Button enabled >8s, unused, no sabotage | PASS | active orange; caption correct. |
| 6.2 | Open overlay, freeze timer | PASS | countdown 5.0; timer paused. |
| 6.3 | Accept | PASS | +5s, +300, resumed, overlay removed. |
| 6.4 | Timeout / failure | NOT RUN | immediate lose + defeat code reviewed. |
| 6.5 | One use per round | PASS by state | `session.passUsed` set on open; button disabled. |

---

## 7. Results / leaderboard / admin

| # | Test | Result | Notes |
|---:|---|---|---|
| 7.1 | Victory visuals | PASS | mockup 06. |
| 7.2 | Victory report numbers | PASS | stats/waktu/modul/strike/sabotage/bonus. |
| 7.3 | Auto initials modal for qualifying result | PASS | opened after ~1.7s in a normal victory. |
| 7.4 | Initials keyboard A–Z + HAPUS + SIMPAN | PASS | ACE entered, saveEnabled true, saved to localStorage. |
| 7.5 | Leaderboard highlight + save state | PASS | green row; score line. |
| 7.6 | Skip initials | PASS by code review | marks saved without score. |
| 7.7 | Defeat explosion sequence | PASS | flash, burst, glass crack, BOOM. |
| 7.8 | Penalty card | PASS | random card, safe copy, two actions. |
| 7.9 | Penalty cards disabled | NOT RUN | conditional branch reviewed. |
| 7.10 | Admin PIN gate | PASS | wrong/right input; body unlocks with 0000. |
| 7.11 | Admin toggles / select | PASS | DOM state updates; persistence code. |
| 7.12 | Admin 5-tap hotspot | PASS | 5 taps in top-left opened the PIN gate; PIN 0000 unlocked the body. |
| 7.13 | Export CSV | PASS | Download produced `bom-challenge-leaderboard-2026-11-24.csv`; UTF-8 BOM retained. |
| 7.14 | Reset scores | PASS by code / not clicked | admin calls resetLeaderboard; should be validated before doors. |
| 7.15 | Help overlay | PASS | `docs/qa/help.png`. |
| 7.16 | 30s result auto-return | NOT RUN | timer code reviewed; demo skips. |
| 7.17 | Close admin → Attract restart | PASS | After closing the admin overlay, the Attract scene restarted with focus restored. |

---

## 8. Audio

| # | Test | Result | Notes |
|---:|---|---|---|
| 8.1 | AudioContext unlock on first touch | PASS by code / not audible | after arming the engine post-gesture, the browser emitted **zero AudioContext warnings** in the final smoke; no exceptions. |
| 8.2 | Adaptive BPM transitions | NOT VERIFIED | logic in `audio.js` and RoundManager. |
| 8.3 | Tick / heartbeat / explosion / win | NOT VERIFIED | procedural; test on PID speakers. |
| 8.4 | Sound/music toggles | PASS by code | setPrefs ramps bus gain; settings persist. |
| 8.5 | Audio persists after admin | PASS by code | Attract restart uses new settings. |

---

## 9. Input & ergonomics

| # | Test | Result | Notes |
|---:|---|---|---|
| 9.1 | 10 active pointer config | PASS by config | Phaser `activePointers: 10`. |
| 9.2 | Two-finger scanner/lever | PASS (CDP) | Dual-Hand A solved. |
| 9.3 | Ghost touch radius filter | PARTIAL | logic reviewed; needs real IR panel. |
| 9.4 | Button spam cooldown | PASS by code | 160ms menu, 55–130ms key targets, 700ms module mistake lock. |
| 9.5 | Palm wipe | PASS (mouse drag analogue) | needs real palm test. |
| 9.6 | Idle warning dismiss | PASS | overlay shown/dismissed via scene API; no tween-after-destroy errors. Auto-return at 21s code-reviewed. |
| 9.7 | Touch ripple per player | PASS visually | previews show rings/sparks. |
| 9.8 | Colour-blind wire markers/labels | PASS visually | all 5 wires have markers/labels. |

---

## 10. Content / visual QA

| # | Test | Result | Notes |
|---:|---|---|---|
| 10.1 | All 175 SVGs parse | PASS | DOMParser validation; 0 errors. |
| 10.2 | PNG export mirror | PASS | 180 files; export manifest dimensions. |
| 10.3 | No missing textures at runtime | PASS | console error count 0 on normal routes (favicon fixed). |
| 10.4 | Mockups 01-09 | PASS | runtime captures; see `docs/mockups/`. |
| 10.5 | Briefing title clipping | FIXED | stroke added; final capture correct. |
| 10.6 | Victory toast overlapping MAIN LAGI | FIXED | removed toast. |
| 10.7 | Dual-Hand stale “left hand released” after solve | FIXED | solved/locked guard in `endDrag`. |
| 10.8 | Fonts render on first frame | PASS | fonts preloaded; no fallback glyphs observed. |
| 10.9 | 4K upscale expected softness | KNOWN | documented, roadmap native 4K. |
| 10.10 | UI typography / layout polish pass | PASS | Captures `ui-pass-*.png`: larger minimum labels, reflowed cipher ribbon, clean team CTA subtext, selected-card check, no clipped titles. |
| 10.11 | Timer HUD update throttle | PASS by code + inspection | Display changes once per visible second; no visible lag in 60fps runtime. |

---

## 11. Release blockers

None for a **supervised event at 1920×1080** with the tested content. Before an unattended public deployment:

1. Run 50 rounds on the actual PID.
2. Verify real palm wipe, ghost touches and simultaneous 4-player input on the IR/capacitive panel.
3. Run an audible audio pass at venue volume.
4. Add public round restart / operator pause if the booth is not constantly staffed.
5. Add a 20–30s Attract reset if the screen must not sit idle between groups.
6. Test browser crash/power cycle recovery.
7. Decide whether native 4K text sharpness is required.
8. Test CSV download and leaderboard reset on the kiosk browser.
9. Confirm penalty cards are acceptable for the client's audience.
10. Replace seeded demo leaderboard entries with event data.

---

## 12. Test evidence index

| Evidence | Path |
|---|---|
| Final UI mockups | `docs/mockups/01-09` |
| Overview sheet | `docs/mockups/00-overview.png` |
| Flow: menu/team/briefing/game | `docs/qa/flow-1…4` |
| Wire solved / cipher error | `docs/qa/interact-wire.png`, `interact-cipher.png` |
| Smoke wipe verification | `docs/qa/smoke-wiped2.png` |
| Pass overlay | `docs/qa/pass-overlay.png` |
| Ice / gravity / glitch | `docs/qa/sabotage-ice2.png`, `-gravity2.png`, `-glitch2.png` |
| 4-player / 2-player layouts | `docs/qa/game-4p-reals.png`, `game-2p-reals.png` |
| Initials keyboard | `docs/qa/initials2.png`, `initials-filled2.png` |
| Admin PIN/body | `docs/qa/admin-pin.png`, `admin-body.png` |
| Help overlay | `docs/qa/help.png` |
| 4K / 720p scaling | `docs/qa/4k-menu.png`, `720p-menu.png` |

Internal QA screenshots are not linked in the public README; they are retained for engineering evidence.

---

## 13. Final UI recreation QA — build 2.3.0

Fresh Chromium context, 1920×1080, real Playwright clicks on the canvas.

| # | Test | Result | Evidence |
|---:|---|---|---|
| 13.1 | Official logo transparent on bright page | PASS | docs/mockups/01-main-menu.png; no white box / alpha fringe. |
| 13.2 | Cast REN/KAI/MIRA/RIN in tags, team cards, briefing, results | PASS | 2, 3, 4, 6, 7; 4 tags in 4P session. |
| 13.3 | Bright pop-art pages on menu, story, gameplay | PASS | `bg-bright-menu/page/game.png`; no dark overlay baked in. |
| 13.4 | Attract -> Team -> Story -> Briefing -> Game with real clicks | PASS | Playwright final flow; no stuck state. |
| 13.5 | Victory → Main Lagi → Briefing → Game | **PASS (restart bug fixed)** | Scene keys: Victory → Briefing → Game; timer running. |
| 13.6 | Defeat → Main Lagi → Briefing → Game | **PASS (restart bug fixed)** | Scene keys: Defeat → Briefing → Game; timer running. |
| 13.7 | 4P Chaos layout | PASS | 4 tags, timer 00:29, no overlap; console clean. |
| 13.8 | Difficulty chip selected state | PASS | Yellow pill, dark label; unselected read as muted. |
| 13.9 | Cipher ribbon no longer covered by start toast | PASS | Start toast removed; ribbon sits under HUD. |
| 13.10 | Sabotage hides/restores cipher ribbon | PASS | Smoke preview; ribbon hidden during event. |
| 13.11 | Cold boot (fresh context) | PASS | 3.5s and 4.0s in two runs. |
| 13.12 | Console errors/warnings | PASS | 0 / 0 in final smoke. |
| 13.13 | Unused legacy UI textures not loaded | PASS | Boot network no longer requests old btn/panel/hud families. |
| 13.14 | Physical PID touch/audio/4K native | ENV-LIMITED | requires target hardware / speakers / native 4K panel. |
| 13.15 | Pre-mission story 2-4 speakers | PASS | 3P preview = 7 alternating lines; portrait/name swap, typewriter + typing SFX, skip. |
| 13.16 | Admin close (X / backdrop / Escape) | PASS | Sticky 56px X always visible; `admin-root` class removed and Attract restored. |
| 13.17 | New font + comic icon set | PASS | Luckiest Guy / Fredoka One / Varela Round / Bungee; button/icon textures loaded, 0 warnings. |

---

## 14. Bright theme & comic audio QA — build 2.3.0

Fresh Chromium context, 1920×1080, real Playwright clicks on the canvas. Audio cues cannot be judged by ear headlessly; the audio graph was verified from code + clean console.

| # | Test | Result | Evidence |
|---:|---|---|---|
| 14.1 | Menu, team, story, briefing, gameplay, victory, defeat, admin on cream pages | PASS | `docs/mockups/01`–`09`; no dark page left. |
| 14.2 | Readable ink text on cream cards and HUD | PASS | Cream panel `#FFF4DF`, ink `#1B1406`; small labels audited at 1080p. |
| 14.3 | Page copy over busy pop-art has cream stroke | PASS | Header/footer/status labels on menu, story, victory, defeat. |
| 14.4 | Admin panel is bright and still closable | PASS | X, backdrop and Escape; sticky X visible while scrolling. |
| 14.5 | Typewriter tick fires every 6 chars | PASS | `audio.sfx('type')` at 22 ms tick; random 1.5–2.4 kHz, low gain. |
| 14.6 | Trigger stinger on MULAI MISI / story open / story finish | PASS | `audio.sfx('trigger')` wired in AttractScene and StoryScene. |
| 14.7 | Comic score is bouncy and tension-scaled | PASS | Walking bass, off-beat brass, melody, percussion, boing; `[126,148,172]` BPM. |
| 14.8 | Sound/music toggles silence their bus | PASS | `audio.setSound/setMusic`; no audio before first gesture. |
| 14.9 | Full flow with real clicks | PASS | Menu → Team → Story → Briefing → Game; skip also tested. |
| 14.10 | Victory/Defeat restart | PASS | Both route to Briefing → Game; timer runs. |
| 14.11 | 4P Chaos | PASS | 4 tags, timer 00:29, 9 story lines, no overlap. |
| 14.12 | Console errors/warnings on all previews | PASS | 0 / 0. |
| 14.13 | `?assets=svg` fallback | PASS | Loads after the bright/audio pass. |
| 14.14 | Physical PID audio, palm/IR, native 4K | ENV-LIMITED | Requires target hardware. |

