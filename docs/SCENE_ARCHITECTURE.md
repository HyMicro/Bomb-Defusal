# SCENE & SYSTEMS ARCHITECTURE
## BOMB DEFUSAL: CHAOS EDITION — Phaser 3 implementation

| Field | Value |
|---|---|
| Runtime | Browser, Chromium 100+, Phaser 3.90.0 (WebGL preferred, Canvas fallback) |
| Logical resolution | 1920×1080, `Phaser.Scale.FIT`, `CENTER_BOTH` |
| Input | 10 active pointers, mouse and native touch, no scrolling/zoom |
| Persistence | `localStorage` — settings + daily leaderboard |
| Backend | None. Fully offline by design. |
| Code style | ES modules, one responsibility per file, DOM only for operator panel and boot screen |

---

## 1. High-level flow

```
main.js
  │  waits fonts → new Phaser.Game
  ▼
BootScene (asset preload + preview routing)
  ├── AttractScene ──► TeamSelectScene ──► BriefingScene ──► GameScene
  │        ▲                                                   │
  │        └────────────── VictoryScene / DefeatScene ◄────────┘
  │
  └── preview URLs bypass normal navigation for deterministic captures
```

`localhost:8123/?preview=<scene>` selects the scene in `BootScene.route()`:

| Preview | Starts |
|---|---|
| `menu`, `admin` | AttractScene |
| `team` | TeamSelectScene |
| `story` | StoryScene (pre-mission dialogue) |\n| `briefing` | BriefingScene (countdown frozen) |
| `gameplay`, `sabotage` | GameScene (paused preview state) |
| `victory`, `defeat` | ResultScene with demo session stats |

Normal navigation is always `Attract → TeamSelect → Briefing → Game → result → Attract`.

---

## 2. Scene responsibilities

| Scene | Responsibility | Key data |
|---|---|---|
| `BootScene` | Load 175 SVG textures + PNG logo/avatars, boot bar, URL routing, preview session setup | `session.create(...)`, `session.preview` |
| `AttractScene` | Hero menu, daily top 5, help overlay, admin hotspot, sound toggle | `topLeaderboard()`, `loadSettings()` |
| `TeamSelectScene` | Player count 2–4, difficulty 3 presets, estimated duration, roster preview | writes `session.create(...)` on start |
| `StoryScene` | Alternating 2�4 player dialogue, portrait swap, typewriter, skip | auto transitions to Briefing |\n| `BriefingScene` | Bomb case, module preview, owner roster, 3-2-1-MULAI | auto transitions to Game |
| `GameScene` | HUD, 3 card modules, timer/sabotage, pass-the-bomb, win/lose overlay | owns `RoundManager`, `SabotageManager`, `TouchManager` |
| `VictoryScene` | Report, MVP, daily board, initials entry, replay/home, 30s auto-return | `topLeaderboard`, `addLeaderboardEntry` |
| `DefeatScene` | Explosion aftermath, penalty card, replay/home, 30s auto-return | `PENALTY_CARDS`, settings toggle |

### Scene transition API

All normal transitions use `goToScene(scene, key, data, { fade })` from `src/ui/factory.js`, which:

1. guards against double transitions with `scene.__leaving`;
2. disables input;
3. fades the camera out;
4. calls `scene.scene.start(key, data)` after the fade.

Preview routing is intentionally outside this path and starts a scene directly.

---

## 3. Shared session model

`src/core/session.js` exports a singleton that survives scene transitions:

```js
session = {
  players: [{ id, key, name, avatar, css, color, index, contribution, modules[] }],
  difficultyKey, difficulty, moduleKeys[], moduleCount, roundNumber,
  timeMax, timeLeft, strikes, maxStrikes, score, solved, sabotageCleared,
  timeBonus, passUsed, passOwner, result, resultReason,
  startedAt, endedAt, saved, demo, preview, stats,
  create({ playerCount, difficultyKey, moduleKeys?, demo?, preview? }),
  moduleSolved(index), registerMistake? (handled by RoundManager),
  addScore(points, player?), addStrike(), finalScore(), mvp, supportPlayer
}
```

Why a singleton:
- Scenes restart while the team and score remain.
- Preview routes can pre-fill a valid session without passing large payloads.
- The DOM admin panel can read/write settings without knowing Phaser internals.

**Ownership rule**

```
owner = players[moduleIndex % players.length]
surplus player = SUPPORT (0 modules)
```

It only affects score attribution. It never blocks other players from touching a module.

---

## 4. RoundManager

`src/managers/RoundManager.js` is the round clock and rule authority.

### State

```js
state: 'idle' | 'intro' | 'running' | 'won' | 'lost'
paused: boolean
timeLeft: number (seconds, internal sub-second precision)
timeMax: number            // initial value used for sabotage ratios
thresholds: number[]       // descending, e.g. [0.65, 0.4, 0.2]
triggered: Set<number>     // each threshold fires once
strikes, solved, finished, preview
```

### Public API

| Method | Effect |
|---|---|
| `start()` | `intro` for 950ms; preview mode enters paused running state |
| `pause()/resume()` | Freeze timer for pass-bomb overlay |
| `update(time, delta)` | countdown, tick sounds, adaptive music, sabotage threshold checks, timer display |
| `solveModule(puzzle)` | +800×mult to owner, +3s, solve count; calls scene callbacks; win at all modules |
| `registerMistake(sec, player, message)` | time penalty, strike, score penalty, shake, lose at 3 strikes/0s |
| `canPassBomb()` | `timeLeft > 8 && !session.passUsed && !finished` |
| `addTime(seconds)` | Pass-bomb/bonus time, syncs display |
| `win()/lose(reason)` | freeze, compute final score, stop music, invoke scene hooks |

### Scene hooks (loose coupling)

```
onRoundStarted, onRoundIntro, onRoundPaused, onTimeChanged, onTick,
onTimeBonus, onModuleSolved, onStrike, onMusicIntensity,
onSabotageCleared, onRoundWon, onRoundLost
```

The scene owns presentation. The manager owns rules and timing. This makes the clock testable and keeps puzzle classes independent of transitions.

---

## 5. SabotageManager

`src/managers/SabotageManager.js` is an interruption director.

```
this.layer (depth 80)
  └── this.active (container for current event)
        ├── dim / visual layer
        ├── puffs / ice / glitch popup / gravity orbit
        ├── sabotage banner (above visuals)
        ├── full-screen transparent input blocker (except gravity)
        └── event-specific interactive elements
```

### Lifecycle

1. `trigger(type)`:
   - ignored if round ended;
   - queued if another sabotage is active;
   - otherwise `open(type)`.
2. `open(type)` builds the physical interaction and increments `session.stats.sabotageSeen`.
3. `update(delta)` handles timeout and gravity countdown.
4. `finish(success)`:
   - fades and destroys active layer;
   - clears the active flag immediately (prevents double rewards);
   - calls `scene.onSabotageCleared(type, success, lastPlayer)`;
   - starts the next queued sabotage after 850ms.
5. `destroy()` on scene shutdown.

### Inputs

| Event | Input model |
|---|---|
| Smoke | Full-screen blocker; pointerdown/move with `pointer.isDown`; clears puffs within radius; threshold 80% |
| Ice | Full-screen blocker; pointerdown counters 6 taps with an 80ms guard |
| Gravity | **No blocker**; puzzles remain touchable while `workPivot.rotation` flips |
| Glitch | Full-screen blocker + popup; pointerdown/move/up drags popup vertically ≥100px |

A full-screen transparent blocker sits above the HUD so the pass button cannot be used mid-sabotage. The sabotage banner is brought to the top of its layer so it remains readable.

---

## 6. Multi-touch input pipeline

`src/core/input.js` — `TouchManager`

- Hooks: `scene.input.on('pointerdown'|'pointermove'|'pointerup')`.
- Pointer limit: Phaser config `input.activePointers: 10`, `touch: true`, `mouse: true`.
- Ghost-touch filter: browser `Touch.radiusX/radiusY > 92` → ignore. Smoke wiping bypasses this because palm contact is required.
- Player attribution for touch feedback: screen x divided into N equal player zones; colour ring + ripple + sparks use that player colour.
- Effects are capped at 28 concurrent ripple groups to protect frame rate.
- Puzzle interactions use their own Phaser GameObjects or screen-space pointer tracking (wire swipe, scanner hold, lever drag, glitch popup).
- Global puzzle input handlers are registered in `PuzzleBase.onCleanup()` so a scene restart does not leave dangling listeners.

### Selector / hit testing notes

- Phaser input `topOnly` behaviour is used intentionally:
  - sabotage blocker prevents puzzle interaction;
  - modals add an interactive dim first;
  - globe buttons use a dedicated `Zone` child rather than container hit area;
  - nineslice buttons use `Zone` for stable touch hit areas.
- UI buttons use `pointerup` + distance check < 34px so dragging off cancels a press.
- Minimum interactive hitbox is 140×120 for button factory zones, 84×70 for keypad keys at 1080p.

---

## 7. Puzzle module contract

`src/puzzles/PuzzleBase.js` + six modules.

### Base shell

- 560×620 metal card, header, owner, LED, footer, content container.
- Build order: panel → frame overlay → header/owner/LED → content.
- Local coordinates are card-relative; all scene effects use `worldPoint(localX, localY)` because cards live inside `workPivot`.
- `solve({silent})`:
  - guards against double solve;
  - disables every input recursively;
  - turns LED/frame green;
  - shows a “MODUL AMAN” stamp;
  - plays solve SFX;
  - calls `onSolved`.
- `mistake(seconds, message)`:
  - 700ms lock per module;
  - red flash + card/camera shake;
  - calls `onMistake` (RoundManager).
- `onCleanup(fn)` for global pointer listeners.
- `close()` destroys card and runs cleanups on scene shutdown.

### Contract for a new module

```js
export class MyModule extends PuzzleBase {
  constructor(scene, ctx) {
    super(scene, { ...ctx, moduleKey: 'myModule', variant: ctx.variant || 'A' });
  }
  build() {
    this.instruction('TOUCH THE THING!', { y: 142 });
    const zone = this.scene.add.zone(280, 320, 240, 160)
      .setOrigin(0.5).setInteractive();
    zone.on('pointerdown', () => this.solve());
    this.add(zone);
  }
  update(time, delta) { /* per-frame logic if needed */ }
  demoState() { /* deterministic visual for preview captures */ }
}
```

Register in `src/puzzles/index.js` and add metadata to `MODULES` in `src/config.js`; add a card mini-preview automatically uses its title/short/icon.

### Module state ownership

- Puzzle classes own local state and visuals.
- `RoundManager` owns round outcome.
- `GameScene` owns HUD, timers, scoring UI, scene transitions.
- `session` owns persistent player/team data.
- `SabotageManager` owns overlays and can block all puzzle input.

---

## 8. Display depth map

| Depth | Layer |
|---:|---|
| 0 | background |
| 1 | halftone overlay |
| 2 | ambient particles/speedlines |
| 8–10 | work card modules (inside `workPivot` at 960,588) |
| 18 | top/bottom HUD panels |
| 19–21 | HUD chrome, text, buttons |
| 24–25 | cipher ribbon |
| 30 | result stamps/confetti (Victory uses depth 8 so it sits behind panels) |
| 60 | danger border |
| 80 | sabotage layer |
| 96–99 | touch rings/ripples |
| 100 | toast / notification |
| 110–127 | win/lose climax (explosion, crack, BOOM!) |
| 130–150 | pass-the-bomb overlay, saved-score toast |
| 140 | DOM admin panel is outside Phaser entirely |

The `workPivot` container is centred at (960, 588) so Gravity Flip can rotate the entire 3-card group around the screen’s work-zone centre without moving the HUD.

---

## 9. Data flow

### Start a round

```
TeamSelect → session.create({playerCount, difficultyKey})
           → Briefing (reads session)
           → GameScene.create():
                settings = loadSettings()
                modules = moduleKeys.map(createPuzzle)
                round = new RoundManager(scene, {timeLimit, ...})
                sabotage = new SabotageManager(scene)
                touch = new TouchManager(scene)
                round.start()
```

### A solve

```
PuzzleBase.solve()
  → GameScene.handleModuleSolved(puzzle)
      → RoundManager.solveModule(puzzle)
          → session.moduleSolved(index)
          → +3s, scene.onModuleSolved, scene.onTimeChanged
          → if all safe → round.win()
      → scene.onRoundWon()
          → confetti + title + delayed VictoryScene
```

### A mistake

```
PuzzleBase.mistake(...)
  → GameScene.handleModuleMistake(...)
      → RoundManager.registerMistake(seconds, owner, message)
          → timeLeft -= seconds; session.addStrike()
          → scene.onStrike(...)
          → if 3 strikes or 0s → round.lose()
```

### A sabotage

```
RoundManager.update(): ratio crosses threshold
  → GameScene.triggerSabotage(type)
      → SabotageManager.trigger/open
          → player clears
          → scene.onSabotageCleared(type, true, lastPlayer)
              → session.sabotageCleared++
              → session.addScore(250×mult, player)
              → HUD update
```

---

## 10. Persistence

`src/core/storage.js`

| Key | Shape |
|---|---|
| `bc.settings.v2` | `{ difficulty, sound, music, penaltyCards, passBomb, sabotage, acoustic, autoResetSeconds, eventTitle, eventSubtitle, pin, seeded }` |
| `bc.leaderboard.v2` | Array of `{date, initials, score, timeLeft, players, difficulty, strikes, demo, savedAt}` |

- All localStorage access is guarded (`try/catch`); if unavailable, settings fall back to defaults and the game still runs.
- Leaderboard is filtered to today, sorted by `timeLeft` descending then score, limited to 5 for display.
- New wins save only if they qualify; the initials modal is auto-opened when the player has a top-5 time.
- CSV export uses a Blob download with a UTF-8 BOM for Excel compatibility.
- Seeds are inserted on an empty install when `settings.seeded` is true; reset score in admin for an event.

---

## 11. Asset lifecycle

`BootScene.preload()` loads using a mapping function in `BootScene.js`:

- `bg-*` → `assets/backgrounds/*.svg`
- `char-*` → `assets/characters/*.svg`
- `avatar-*` → `assets/characters/*.png` (image loader)
- `bomb-*` → `assets/bomb/*.svg`
- `icon-*` → `assets/icons/*.svg` (white, tintable)
- `symbol-*`, puzzle props → `assets/puzzles/*.svg`
- `btn-*`, `keypad-*` → `assets/ui/buttons/*.svg`
- `frame-*` → `assets/ui/frames/*.svg`
- `panel-*` → `assets/ui/panels/*.svg`
- HUD → `assets/ui/hud/*.svg`
- `gesture-*` → `assets/ui/gestures/*.svg`
- `fx-*` → `assets/fx/*.svg`
- `logo-lockup` → `assets/brand/logo-lockup.png` (legacy, not loaded)
- `brand-logo` → `assets/brand/bomb-defusal-logo.png`

**Runtime asset mode**

- Default: a curated PNG runtime. Comic page backgrounds, logo, cast avatars, 18 comic UI cuts and only the used SVG props are loaded.
- Legacy button/panel/HUD families are no longer requested at all; the full 180-file PNG mirror and 175 SVGs remain in the repo for documentation/exports.
- Why: Phaser's SVG parsing/rasterisation of the full 175-file pack was the dominant boot cost; even the old full PNG mirror was heavier than the curated set.
- Measured on the test machine: **~3.5–4.0s curated PNG**, old mirror ~5.3s, SVG ~10.1–10.8s cold boot.
- `?assets=svg` forces the vector loader for props (backgrounds stay baked PNG).
- The SVG pack remains the editable master.

9-slice textures use explicit slices:

```js
btn-primary-*:  left 54, right 54, top 40, bottom 44   (source 480×144)
panel-*:        left 52, right 52, top 52, bottom 52   (source 240×240)
progress-track: left 34, right 34, top 14, bottom 14   (source 900×44)
keypad-*:       left 30, right 30, top 26, bottom 26   (source 160×120)
```

### Fonts

`assets/fonts/fonts.css` defines Bangers / Lilita One / Nunito / Orbitron from local `.woff2` files. `main.js` waits for `document.fonts.load` for all four families before booting Phaser. This prevents first-frame fallback glyphs.

---

## 12. Adaptive audio class

`src/core/audio.js` — no audio files.

- Lazy AudioContext creation.
- A 30ms lookahead scheduler with 16-step patterns.
- BPM controlled by `setMusicLevel(0|1|2)`.
- Oscillator methods: `tone`, `noise`, `kick`, `sfx`.
- Master bus → compressor → destination.
- Sound/music toggles via settings; master buses ramp to 0.
- `unlock()` is called on the first pointer/key from `main.js`.
- Ticking/heartbeat calls come from `RoundManager`.

---

## 13. Preview and testing (deterministic states)

- URL preview routing is in `BootScene.route()`.
- GameScene `preparePreview()` locks the session to 3 players/Standard and overwrites module keys.
- `RoundManager.preview` sets `paused = true` and does not count down.
- Modules are frozen in attractive states via `module.demoState()`.
- Sabotage preview opens Smoke Screen directly.
- Victory/Defeat demos skip saving and auto prompts; production paths are still tested by driving normal sessions.
- Internal test API exposed as `window.BC_GAME` for QA; not presented in UI.

---

## 14. Performance and deployment notes

- Texture loading remains the slowest startup step, but the **curated comic/PNG runtime cuts it to ~3.5–4.0s** (old mirror ~5.3s, full SVG ~10.1–10.8s on the test machine). It is a one-time cost; use a local SSD and Chromium.
- The timer UI updates **once per visible second** (not every frame), avoiding constant Phaser Text texture regeneration.
- AudioContext is armed only after the first pointer/key gesture, eliminating pre-gesture AudioContext warnings and idle audio work.
- Effects are object/tween-based, not shader-heavy. Average particles are <200; smoke uses 20 large images, with touch/effect caps.
- Cap: 60 FPS target, full 1920×1080 fill; 4K upscales by browser. For a PID with weak GPU, disable the ambient sparks via settings in a future build.
- No network requests after the static files are loaded; serves from Node only for the document and assets.
- Browser kiosk:
  ```
  chrome --kiosk --autoplay-policy=no-user-gesture-required
         --touch-events=enabled --overscroll-history-navigation=0
         --disable-pinch http://localhost:8123
  ```
- Disable OS sleep, display scaling, on-screen keyboard and notification toasts.
- Calibrate the PID’s touch digitiser at native resolution; effective game touch mapping is handled by Phaser FIT, so do not enable browser zoom.

---

## 15. Known architectural limits

1. One team per round, no simultaneous lanes.
2. No backend; leaderboard is per-device.
3. No native 4K render path; logical 1080p upscaled.
4. Microphone is a simulation; optional hardware input is a roadmap module.
5. Admin overlay only exists in the Attract flow; mid-round operator tools are roadmap.
6. Result screens auto-return after 30s; Attract itself does not auto-reset.
7. Some preview code paths deliberately bypass PIN/leaderboard saving for design captures.
