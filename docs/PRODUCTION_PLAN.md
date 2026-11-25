# PRODUCTION PLAN
## BOMB DEFUSAL: CHAOS EDITION — from this build to a public PID event

| Field | Value |
|---|---|
| Build status | Playable prototype / vertical slice plus complete content pass |
| Target platform | Chromium kiosk on Windows or Linux, 65–86″ IR/capacitive PID |
| Session | 45–60s, 2–4 players |
| Event horizon | 6–8 weeks for a polished public deployment (1 senior game dev + 1 technical artist + part-time QA) |
| This repository | Game, full modular UI asset pack, 9 runtime microcopy screens, GDD, specs, QA | 
| Owner | Senior Web Game Developer / UI-UX Game Designer / Technical Artist |

---

## 1. Feature status snapshot

| Area | Prototype status | Public-event readiness |
|---|---|---|
| 2–4 player co-op setup | Done | Ready |
| 3 difficulty presets | Done | Ready |
| 6 puzzle modules (variants) | Done and tested | Ready; content expansion recommended |
| 4 sabotages + clearance mechanics | Done and tested | Ready |
| Pass-the-bomb + failure path | Done | Ready |
| Round timer, +3s, strikes, scoring | Done | Ready |
| Daily top 5 + initials keyboard | Done | Ready |
| Penalty cards + toggle | Done | Ready |
| Operator PIN panel | Done | Ready, but PIN management can be improved |
| Adaptive procedural audio | Done, headless-unverified | Verify on target PID speakers |
| 1920×1080 responsive FIT | Done and tested | Ready for 1080p / 4K upscale |
| Native 4K render | Not implemented | Add for 4K kiosks if text softness is unacceptable |
| Real microphone acoustic module | Simulation only | Add only if the PID microphone is reliable |
| Public restart / long-press reset | Admin/reload path | Add operator-safe public restart for unsupervised kiosks |
| Attract auto-reset | Not implemented | Add a 20–30s attract reset if the screen should never sit idle |
| Automated test suite | Manual + preview routes | Add Playwright kiosk smoke tests in the release pipeline |

Legend: **Done** = works; **Ready** = acceptable for a supervised event; **Roadmap** = before unattended deployment.

---

## 2. Production phases

### Phase 0 — Discovery & technical validation (2–3 days)
- Confirm PID model, native resolution, touch points, browser version, audio output, mounting height and reachability.
- Verify `touch-action:none`, multi-touch, ghost touches and 4K browser scaling.
- Agree on event branding, language and penalty-card safety constraints.
- **Deliverable:** device checklist + go/no-go for the local-server kiosk approach.

### Phase 1 — Core loop vertical slice (1 week) — implemented
- Phaser boot, 1920×1080 FIT, static menu, a single wires puzzle, timer, win/lose.
- Touch input manager, strike/score, one sabotage.
- **Gate:** 2 people can play a complete round without instructions beyond the module prompts.
- **Status:** complete; expanded in Build v2.0.

### Phase 2 — Systems & content (1.5 weeks) — implemented
- RoundManager, SabotageManager, PuzzleBase, 6 modules, 4 sabotages, pass-the-bomb.
- Session singleton, scoring formulas, end states, leaderboard, penalty cards.
- Admin panel and persistence.
- **Gate:** all modules and sabotages can be exercised from preview routes; win/lose flows tested.

### Phase 3 — Art direction & asset pack (1.5 weeks) — implemented
- Vector art bible (palette, outline language, typography).
- 175 modular SVGs across backgrounds, brand, characters, bomb props, UI, HUD, puzzle objects, icons, gestures and FX.
- 480×480 avatar crops and 1680×800 transparent logo lockup.
- 4-state button system, 9-slice panel system, 560×620 module frame.
- PNG export mirror and searchable catalogue.
- **Gate:** every runtime component is separable and transparent; asset manifest complete.

### Phase 4 — UI integration & feel (1 week) — implemented
- 8 screen compositions: Attract, Team Select, Mission Briefing, Gameplay, Sabotage, Victory, Defeat, Admin.
- Touch FX, screen shake, flashes, confetti, win/lose climax.
- Camera/timing polish, audio integration, mobile/touch suppression.
- **Gate:** a 60-second round feels like an arcade event; screenshots match the supplied art direction.

### Phase 5 — QA & event hardening (1 week) — next
- Run the full QA checklist on the target PID.
- Real 10-point multi-touch test with different finger sizes, palms, sleeves and children.
- 50 consecutive rounds endurance; memory and FPS logging.
- Network-off, browser-crash, power-cycle and localStorage-disabled recovery.
- Calibrate hitboxes, audio levels, timer balance and top-5 thresholds.
- **Gate:** no blocker bugs for 50 rounds, no stuck states, no accidental admin access.

### Phase 6 — Deployment & live operations (2–3 days) — next
- Kiosk browser profile, autostart, display sleep-off, Windows update pause, network isolation.
- Branding replacement (logo lockup, event title, subtitle), leaderboard reset, PIN change.
- Staff one-page runbook and incident recovery script.
- On-site rehearsal and accessibility pass.
- **Gate:** operator can reset/recover in < 60 seconds; game starts automatically after power-cycle.

### Post-event / Phase 7 — Productization (roadmap)
- Native 4K rendering.
- Real microphone analysis.
- Long-press public round reset + operator pause menu.
- Tournament mode (multiple teams, cumulative leaderboard, queue screen).
- Remote admin/analytics (optional local network only).
- More module and sabotage content packs; themed skins.

---

## 3. Work breakdown & staffing

| Workstream | Owner | Effort already invested | Remaining for public event |
|---|---|---:|---:|
| Game direction / rules | Senior Web Game Dev + UX | 1.0 wk | 2 days tuning |
| Gameplay systems & puzzles | Senior Web Game Dev | 2.0 wk | 2 days QA fixes |
| UI/UX layout & mockups | UI/UX Game Designer | 1.0 wk | 1 day |
| Art direction & SVG pack | Technical Artist | 2.0 wk | 2 days event branding |
| Audio & haptics | Tech Artist + Dev | 0.5 wk | 0.5 day on PID |
| QA / kiosk hardening | Part-time QA + Dev | 0.5 wk | 1 wk |
| Deployment / operator runbook | Dev | 0.5 wk | 1 day |
| **Total** | | **~7.5 weeks equivalent** | **~2–3 weeks** |

Scope guardrails:
- One additional module must reuse the PuzzleBase contract, not add a new subsystem.
- No backend required for the event; if the client wants a venue-wide leaderboard, plan a separate service and network policy.
- Event branding changes should be limited to logo lockup + event name/subtitle + colour re-tint where possible.
- Do not add live user-generated content or photos in v2.0.

---

## 4. Content and art pipeline

```
Brief / event theme
  → moodboard & references (client JPGs, supplied art)
  → vector generator templates (lib/ui/art)
  → individual SVG assets + 480 avatars/logo PNG
  → asset manifest + catalog QA
  → Phaser integration (nineslice, tint, runtime text)
  → runtime capture / mockup sheet
  → client sign-off
  → PNG export mirror for other tools
```

Rules:
- Text is always runtime text. Never bake labels into an SVG unless it is a logo.
- Every colour-coded puzzle object also gets a pattern/marker/label.
- Every button ships four states, no exceptions.
- Keep the source generator under version control; changing a master regenerates the full pack consistently.
- Export a PNG mirror after every approved art change (`tools/build-export-manifest.mjs`).
- Assets under `assets/exports` are generated; do not hand-edit them.
- **Runtime uses the 1× PNG mirror by default** for speed. Keep the SVG sources as the editable master and use `?assets=svg` for vector experiments/native-4K work.
- When art changes, regenerate the SVG pack, re-export the PNG mirror, then update `export-manifest.json`; never patch runtime PNGs by hand.

---

## 5. PID / kiosk deployment

### 5.1 Recommended hardware profile

- 65–86″ Interactive Flat Panel, 10-point IR/capacitive touch.
- Chrome/Chromium 100+ with WebGL enabled (or Edge Chromium).
- Windows 11 or Linux kiosk; dedicated local SSD; 8 GB RAM minimum.
- Stereo speakers with external volume control; subwoofer optional for the explosion/heartbeat.
- Disable OS gestures, notification banners, sleep, auto-update during the event, and edge-swipe navigation.

### 5.2 Launch steps

1. Copy the project folder to the PID (or to a local mini-PC).
2. Install Node 18+ and open a terminal.
3. `node serve.mjs 8123`
4. Open Chromium:
   ```text
   chrome.exe --kiosk --autoplay-policy=no-user-gesture-required
              --touch-events=enabled --overscroll-history-navigation=0
              --disable-pinch http://localhost:8123
   ```
5. Verify:
   - 2-finger dual-hand module;
   - smoke wipe with the palm;
   - timer sound and music;
   - admin PIN;
   - leaderboard persistence after a browser restart;
   - 4K letterboxing / no scrollbars.
6. Set the browser page as the kiosk home page.
7. Reset daily scores and seed data before doors open.
8. Set the auto-reset to 30s (or the setting the event wants).
9. Test the top-left 5-tap admin hotspot and the visible PENGATURAN button.
10. Keep a USB stick with the project folder and a 1-page operator runbook.

### 5.3 Operator runbook (one page)

- **No game visible / stuck:** refresh the page (`F5`) or restart Chromium; local server should stay running.
- **Sounds off:** press the speaker icon or open admin → audio toggles.
- **Next team with different settings:** admin → difficulty preset → close (applies to next round).
- **Leaderboard wrong / new day:** admin → RESET SKOR HARI INI.
- **Artwork/event name:** admin → BRANDING ACARA, or replace `assets/brand/bomb-defusal-logo.png` and reload.
- **Touch feels offset:** close full-screen browser zoom; calibrate the PID OS; do not use browser zoom.
- **Ghost presses:** ensure the screen is clean; the game already ignores large-radius touches except smoke.
- **Overexcited crowd / repeated palm hits:** Smoke Screen is the only palm mode; other interactions require distinct targets.
- **Recover after crash:** start `node serve.mjs 8123` and relaunch Chromium kiosk.

---

## 6. QA plan

### 6.1 Test types

- **Functional:** every screen, every module, every variant, every sabotage, pass success/failure, win/lose, replay/home.
- **Input:** 1–10 simultaneous touches; palm; sleeve; slow drag; fast swipe; a touch that starts and ends on different targets; two players on one module.
- **Timing:** 50 consecutive rounds, timer accuracy, sabotage thresholds, pass freeze/resume.
- **Audio:** first-gesture unlock, music level changes, mute toggles, volume on the actual PID.
- **Persistence:** reload, browser close, storage disabled, admin reset, CSV contents.
- **Visual:** 1080p and 4K, different contrast/lighting, 16:9 and ultrawide letterbox, projector reflections.
- **Recovery:** browser refresh mid-round, server restart, network off, power cycle.
- **Endurance:** 1–2 hours continuous play, memory, thermals, frame rate.

### 6.2 Acceptance gates

- 100% of round states complete (prevent stuck overlays).
- 2, 3 and 4 player flows.
- 3 strikes → loss; 0s → loss; all modules safe → win.
- All 6 module families and all 4 sabotages.
- Pass accept and pass timeout.
- Leaderboard save and reload.
- Admin open/close and reset without leaving the application in a broken state.
- Continuous play 50 rounds without memory growth > 20% or FPS below 45.

### 6.3 Test data

- Use fresh storage for release QA.
- Run `?preview=<screen>` for visual regression; run normal flow for state-machine regression.
- Keep screenshot evidence in `docs/qa` or CI artifacts (not shipped in the event folder).
- After launch, reset scores and verify the seed/demo flag is off or the board is empty.

---

## 7. Performance budgets

| Metric | Budget | Notes |
|---|---:|---|
| Cold start to Attract | ≤ 6s on event laptop | Curated comic/PNG runtime measured ~3.5–4.0s in a fresh Chromium context (old mirror ~5.3s, SVG ~10.1–10.8s) |
| Interactive frame rate | 60 FPS target, 45 floor | 1920×1080, 3 cards, effects |
| Memory after 30 min | < 450MB | no audio files, SVG textures, local storage |
| Network calls at runtime | 0 | local static server only |
| Input-to-visual feedback | ≤ 1 frame | ripple/button press |
| Result transition | ≤ 3.2s including explosion | victory 1.55s, defeat 2.7s |
| Storage writes | only result/settings | no per-frame writes |

Profiling notes:
- If a low-end PID struggles: lower ambient particles, reduce smoke puffs from 20 to 14, reduce confetti.
- If cold start is too slow: pre-rasterize the UI SVGs to @1× PNG in `assets/exports` and load those at `Boot`, keeping SVG for print/other tools. (This trades vector crispness at 4K.)
- Do not enable 4K native rendering without measuring fill rate.

---

## 8. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Ghost touches from IR panel | High | Wrong answers, frustration | Radius filter, palm-only smoke, hit cooldowns; physical test |
| 4K text softness | Medium | Visual quality | SVG sources, 2× render roadmap; test 4K-at-distance |
| Ambient noise breaks real mic idea | High | Module failure | Shipped simulation; mic only when reliable |
| Crowd too rough / overexcited | Medium | Damage / injury | Mount/secure PID, no running, operator present, broad hitboxes |
| Leaderboard pollution by test runs | High | Trust | Reset before doors, seeded flag, CSV audit |
| Browser/OS notifications | Medium | Immersion break | Kiosk profile, disable notifications/updates |
| Power/network failure | Medium | Downtime | Offline static build, local server, restart runbook |
| Admin access by players | Low/Medium | Misconfiguration | PIN gate, hidden hotspot, change PIN, supervised kiosk |
| Asset font missing | Low | Broken labels | Vendored fonts + preload before Phaser |
| Content fatigue after 100 rounds | Medium | Repeat visitors bored | Random module rules, 6 families, top-5 competition, chaos mode |

---

## 9. Event-day schedule

| Time | Task |
|---|---|
| T-1 day | Install on PID, run 50-round endurance, set branding, calibrate touch/audio |
| T-60 min | Reset scores, verify leaderboard and admin PIN, clear test data |
| T-30 min | Sound check at crowd volume, test palm wipe, check kids’ reach |
| Doors open | Operator watches first 5 groups, adjusts volume/difficulty |
| Mid-event | Reset scores if board is stale; keep a queue of next players |
| Last 30 min | Ensure leaderboard resets/export CSV per client request |
| Tear-down | Export CSV, copy storage if requested, reset daily data |

---

## 10. Definition of done for the event

- Attract runs automatically after power-up and idles safely.
- Any group of 2–4 can complete or fail a round without operator help.
- The operator can reset data and change difficulty in under a minute.
- All assets are local; unplugging the network changes nothing.
- No fallback fonts, missing textures, clipped buttons or stuck modals at the event resolution.
- 50 consecutive rounds completed with no freeze or forced browser restart.
- A printed one-page runbook and a USB backup are at the booth.
