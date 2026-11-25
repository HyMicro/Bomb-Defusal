# UI & ART ASSET SPECIFICATION
## BOMB DEFUSAL: CHAOS EDITION — modular Cartoon Arcade pack

| Field | Value |
|---|---|
| Pack version | 2.3 |
| SVG source assets | **175** |
| PNG export mirror | **180** (175 SVG mirrors + 4 avatar masters + logo lockup) |
| PNG masters | comic UI cuts in `assets/ui/comic/`; avatars `assets/characters/avatar-*.png` 130×130; official logo `assets/brand/bomb-defusal-logo.png` |
| Runtime integration | Phaser 3.90; **curated comic/PNG runtime** (~3.5–4.0s cold boot), SVG prop fallback with `?assets=svg` |
| Transparency | All UI components, characters, FX, puzzle props are transparent; the 3 bright comic backgrounds are full-bleed |
| Naming | lowercase, hyphenated, semantic; no spaces; no text baked into SVGs |
| Master catalogue | [`asset-catalog.html`](asset-catalog.html) + [`asset-manifest.json`](../assets/asset-manifest.json) + [`export-manifest.json`](../assets/exports/export-manifest.json) |

---

## 1. Art direction

### 1.1 One-line direction

> **Comic Arcade bomb-lab**: bright cream page, halftone comic panels, thick ink outlines, arcade metal frames used as accents, a single glossy play button, and a colour-coded cast. Friendly panic, not realistic danger.

### 1.2 Palette

| Token | HEX | Use |
|---|---|---|
| Red | `#F2555F` | danger, active LED, REVERSE, primary warning |
| Yellow | `#FFC93C` | primary CTA, timer warmth, caution, scores |
| Electric blue | `#4C9BFF` | secondary CTA, teamwork, info, KAI |
| Neon purple | `#B55DDC` | crowd/spectator, jokers, meta traps |
| Green | `#45D6A0` | solved, safe, accept, success |
| Orange | `#FFB45E` | pass-the-bomb, industrial highlights |
| Cast orange | `#FF9A2A` | REN |
| Cast pink | `#FF4F9A` | MIRA |
| Cast lime | `#C6F53C` | RIN |
| Dark ink slab | `#0F1728` | menu control stack, pass-bomb panel, LCD bezel |
| Ink | `#1B1406` | outlines, primary text, card borders |
| Cream | `#FFF4DF` | page background, cream cards |
| Card cream | `#FFF9ED` | raised cards, fields, chips |
| Body brown | `#6B5A43` | secondary copy, microcopy |
| Steel | `#263248` | rails, metal, chassis |

### 1.3 Typography

| Role | Family | Weight | Fallbacks | Source |
|---|---|---|---|---|
| Display / big titles | **Luckiest Guy** | 400 | Impact, fantasy | OFL, bundled |
| Headings / buttons | **Fredoka One** | 400 | Arial Black | OFL, bundled |
| Body / UI | **Varela Round** | 400 | Segoe UI | OFL, bundled |
| Timer / numeric | **Bungee** | 400 | Consolas | OFL, bundled |

All fonts are local `.woff2`; the game never requests a CDN. See `assets/fonts/fonts.css`.

### 1.4 Shape / line language

- Thick ink outline: 6–14 px at 1920 scale.
- Radii: 10–30 px; module frame 30 px.
- Bevels and gloss are flat-vector, not photoreal.
- Metal parts use diagonal gradients and rivets.
- Yellow corner brackets mark “interactive machine”. Do not use them for passive text.
- Hazard stripes are reserved for edges, transfer banners, and frame trims.
- Drop shadows are soft and dark; no colored contact shadows unless it’s a neon glow.
- Actions use scale/press movement, not colour alone.

---

## 2. File structure

```
assets/
├─ asset-manifest.json               175 SVG entries + category/notes
├─ backgrounds/
│  ├─ bg-comic.png                   1920×1080 comic page (menu/team/briefing/results)
│  ├─ bg-comic-quiet.png             1920×1080 quiet comic page (gameplay)
│  ├─ bg-menu.svg                    1920×1080 editable source
│  ├─ bg-game.svg                    1920×1080 editable source
│  └─ overlay-halftone.svg           1920×1080, transparent pattern
├─ brand/
│  ├─ logo-mark.svg                  640×640 icon mark
│  ├─ logo-lockup.png                1680×800, transparent wordmark
│  └─ bomb-defusal-logo.png          official logo, white background removed
├─ characters/
│  ├─ avatar-ren.png                 130×130 circular crop (REN)
│  ├─ avatar-kai.png                 KAI
│  ├─ avatar-mira.png                MIRA
│  ├─ avatar-rin.png                 RIN
│  ├─ char-*.svg                     legacy bust sources
│  └─ avatar-ren/…png               legacy circular masters
├─ bomb/
│  ├─ bomb-hero.svg                  560×640
│  ├─ bomb-defused.svg               560×640
│  └─ bomb-case.svg                  820×620
├─ icons/
│  └─ icon-*.svg                     96×96 white line icons, tintable
├─ ui/
│  ├─ comic/                         sliced PNG UI kit (frame, LCD, play, penalty, etc.)
│  ├─ buttons/                       legacy btn-*, keypad-*   (see table)
│  ├─ panels/                        legacy panel-* 240×240 9-slice
│  ├─ frames/                        frame-module* 560×620; corner-*
│  ├─ hud/                           timer, score, progress, ribbon, strikes, rings
│  ├─ gestures/                      gesture-* 240×180 onboarding
│  └─ caution-tape.svg               512×64 tile
├─ puzzles/
│  ├─ puzzle-scanner.svg             300×300
│  ├─ lever-track.svg / lever-handle.svg
│  ├─ button-red/blue/green.svg      460×340
│  ├─ wire-*.svg                     110×540 (5 colours)
│  ├─ scissors.svg                   190×160
│  ├─ glitch-popup.svg               780×300
│  ├─ vu-meter.svg                   520×320
│  └─ symbol-*.svg                   96×96 (8 shapes)
├─ fx/
│  ├─ fx-spark.svg                   128
│  ├─ fx-smoke.svg / fx-smoke-dark.svg 512
│  ├─ fx-ice.svg                     1700×760
│  ├─ fx-glass-crack.svg             1920×1080
│  ├─ fx-explosion.svg               1400×1400
│  ├─ fx-shockwave.svg               600
│  ├─ fx-flame.svg                   280×360
│  ├─ fx-electric.svg                520×180
│  ├─ fx-confetti-1…3.svg            64×36
│  ├─ fx-flash-rays.svg              1400×1400
│  └─ fx-speedlines.svg              1600×900
├─ exports/                           180 PNG @1x + export-manifest.json
├─ fonts/                             local woff2 + fonts.css
└─ *.jpg                              provided style reference boards (not runtime)
```

> Every SVG is self-contained and has no `<text>` elements. Labels and dynamic values are rendered at runtime so localisation and font loading never break a sprite. Gradients/filters have per-file IDs, so files can also be inlined without collisions.

---

## 3. Asset family details

### 3.1 Backgrounds

| File | Size | Format | Notes |
|---|---:|---|---|
| `backgrounds/bg-menu.svg` | 1920×1080 | SVG, PNG mirror | Purple/navy bomb-lab wall, pipes, machinery, floor grid, hazard rails, vignette. Safe centre for the hero/menu. |
| `backgrounds/bg-game.svg` | 1920×1080 | SVG, PNG mirror | Darker symmetrical control-room plate. Work-zone safe area 60–1860 × 250–890. |
| `backgrounds/overlay-halftone.svg` | 1920×1080 | SVG | Transparent dot/scan pattern; runtime alpha 0.4–0.7. |

At 4K, use the same SVG rendered at 3840×2160 or export @3× for the richest edges; the vector source has no resolution ceiling.

### 3.2 Logo / brand

| File | Size | Format | Use |
|---|---:|---|---|
| `brand/bomb-defusal-logo.png` | 991×676 | PNG | Official BOMB DEFUSAL wordmark + bomb/timer. Used on Attract and boot; can be printed on backdrops. |
| `brand/logo-lockup.png` | 1680×800 | PNG | Legacy transparent wordmark; retained for archive. |
| `brand/logo-mark.svg` | 640×640 | SVG + PNG | Text-free bomb emblem; app icon, admin header, favicon. |
| `favicon` reference | 640 import | SVG | `index.html` points at logo-mark.svg. |

The official logo was cut from the supplied white-background sheet; enclosed cream letters stay opaque. Do not edit the PNG; replace it with a client/event-specific logo while keeping the 991×676 transparent container.

### 3.3 Character busts

All character assets are 130×130 transparent circular avatar crops derived from the supplied character sheets. The runtime HUD draws the player-colour ring; the crop itself has no baked ring.

| File | Character | Palette | Personality |
|---|---|---|---|
| `characters/avatar-ren.png` | REN — The Leader | orange hoodie / goggles | bold, takes charge |
| `characters/avatar-kai.png` | KAI — The Strategist | blue hair / white jacket / headphones | analyst, plans ahead |
| `characters/avatar-mira.png` | MIRA — The Energizer | pink twin-tails / stars | fast, loud, positive |
| `characters/avatar-rin.png` | RIN — The Wild Card | lime cap / black jacket / bubble gum | unpredictable, quick |

Avatar crop rules:
- face centred inside a 130×130 circular alpha crop;
- ring is drawn at runtime (never baked), so the player colour can change;
- role/status labels are drawn at runtime;
- in-game HUD avatars 30–104 px; team cards 54–76 px;
- no masks in Phaser because the crops are already circular with alpha.

Source character sheets and the official logo stay outside the runtime pack:
`assets/d07d20cd-…png` (REN), `assets/KAI_…png`, `assets/Mira…png`, `assets/RIN_…png`, `assets/BOMB DEFUSAL Timer Logo.png`.

### 3.4 Bomb props

| File | Size | Use |
|---|---:|---|
| `bomb/bomb-hero.svg` | 560×640 | Attract mascot, panic expression, raised hand, fuse spark. |
| `bomb/bomb-defused.svg` | 560×640 | Victory, happy eyes, green band, extinguished fuse. |
| `bomb/bomb-case.svg` | 820×620 | Mission briefing, result backdrops, admin marketing. |

All transparent except the contact shadow inside the drawing. Display at 0.7–1.3×. Do not add baked text; labels are runtime.

### 3.5 Buttons — 4 states, 6 colourways

Source size **480×144**, transparent, 9-slice ready. Filenames:

```
btn-{primary|blue|danger|success|ghost|purple}-{normal|hover|pressed|disabled}.svg
```

| Property | Value |
|---|---|
| Canvas | 480×144 |
| Safe label area | 56–424 × 30–118 |
| 9-slice | left 54 / right 54 / top 40 / bottom 44 |
| Stroke | 6 px ink |
| State difference | hover: outer glow + brighter; pressed: 8 px down, darker, smaller lip; disabled: grey + diagonal hatch |
| Label / icon | Rendered at runtime; label dark on yellow/blue, cream on ghost/danger |
| Minimum runtime height | 84 px (the 9-slice needs top+bottom) |

Round icon buttons:

```
btn-round-{primary|blue|ghost|danger}-{normal|hover|pressed|disabled}.svg
```

- **144×144**, transparent.
- Used for back, sound, icon-only operator/utility controls.
- Runtime display 48–96 px; minimum touch zone 140×140 is provided by a Zone, not by the image.

Keypad keys:

```
keypad-{normal|hover|pressed}.svg
```

- **160×120** (runtime 84×60 for 5×2 keypads).
- Pressed state shifts 3–6 px.
- Digits/letters always runtime text; keypad is reused by both Meta Trap and Crowd Cipher.

### 3.6 Panels and frames

| File | Size | Slices | Use |
|---|---:|---|---|
| `ui/panels/panel-dark.svg` | 240×240 | 52 / 52 / 52 / 52 | Main card/plate backgrounds |
| `ui/panels/panel-metal.svg` | 240×240 | 52 | Heavy industrial card bases |
| `ui/panels/panel-inset.svg` | 240×240 | 52 | Inner rule cards, dialog interiors |
| `ui/frames/frame-module.svg` | 560×620 | fixed | Transparent centre overlay; header band + LED mount |
| `ui/frames/frame-module-solved.svg` | 560×620 | fixed | Green-accent solved state |
| `ui/frames/corner-yellow.svg` | 160×160 | fixed | Rotate/flip for corner accents |
| `ui/frames/corner-blue.svg` | 160×160 | fixed | Alternate corner accent |

Module frame safe areas:
- header band 0–96;
- content 28–532 × 112–540;
- footer 540–600;
- LED mount at 500,55;
- hazard grille at 474–524 bottom right (owner label ends at x=452).

### 3.7 HUD assets

| File | Size | Notes |
|---|---:|---|
| `hud/timer-plate.svg` | 560×190 | Red LED recess; digits runtime Orbitron; safe digits 42–518 × 40–120 |
| `hud/score-plate.svg` | 360×112 | Purple glow; score runtime |
| `hud/player-chip.svg` | 300×88 | Avatar crop at 46,42 r25; the game draws a compact variant inline |
| `hud/leader-row.svg` | 520×72 | Gold rank plate 8–64; name/time/score runtime |
| `hud/cipher-ribbon.svg` | 1600×120 | 9-slice 150/150/40/40; megaphones at ends; safe 90–1510 × 26–88 |
| `hud/sabotage-banner.svg` | 900×160 | Red warning center, hazard ends, bolt icon; text safe 130–780 |
| `hud/progress-track.svg` | 900×44 | 9-slice 34/34/14/14; fills rendered runtime or PNG fills |
| `hud/progress-fill-green/yellow/red.svg` | 900×44 | Static fill alternatives |
| `hud/strike-on.svg` / `strike-off.svg` | 72×72 | Alternate pip art; runtime HUD uses custom hex pips for clarity at small size |
| `hud/round-chip.svg` | 300×68 | Round/difficulty label; runtime uses a custom cleaner chip |
| `hud/tag-blue.svg` / `tag-red.svg` | 240×54 | Small status tags |
| `hud/touch-ring-*.svg` | 160×160 | 5 player colours; touch cursor / ripple |
| `hud/hazard-strip.svg` | 256×40 | Repeat tile |

Runtime V1 at 1920 uses a custom round chip rather than the SVG, because the dynamic “STANDAR • 3 MODUL” strings clipped the asset’s fixed flag. The asset remains for integrations/alternative layouts.

### 3.8 Icons — 96×96 white, tintable

- 51 SVG line icons: navigation, system, gestures, media, status, data, bomb, wire, mic, leaderboard, trophies, CSV, etc.
- Pure `#FFFFFF` strokes; no baked colour.
- Tint at runtime: `icon.setTint(0xffc93c)`.
- Full list searchable in the asset catalogue; examples:

```
icon-play, icon-settings, icon-sound, icon-mute, icon-music, icon-info, icon-back, icon-home,
icon-replay, icon-help, icon-trophy, icon-crown, icon-leaderboard, icon-team, icon-timer,
icon-bomb, icon-wire, icon-hand-tap, icon-hand-hold, icon-hand-drag, icon-hand-swipe,
icon-hand-multi, icon-snowflake, icon-smoke, icon-glitch, icon-alert, icon-check, icon-cross,
icon-star, icon-bolt, icon-spark, icon-shield, icon-key, icon-lock, icon-eye, icon-arrow-right,
icon-arrow-up, icon-plus, icon-minus, icon-pause, icon-mic, icon-reset, icon-close, icon-heart,
icon-flag, icon-clockw, icon-stopwatch, icon-megaphone, icon-csv, icon-map, icon-wifi
```

### 3.9 Puzzle objects

| File | Size | Notes |
|---|---:|---|
| `puzzles/puzzle-scanner.svg` | 300×300 | Biometric pad, green fingerprint, tick marks |
| `puzzles/lever-track.svg` | 420×110 | Recessed rail, end caps, ticks |
| `puzzles/lever-handle.svg` | 110×170 | Red grip, chrome collar |
| `puzzles/button-red/blue/green.svg` | 460×340 | Glossy arcade dome; red/blue/green variants |
| `puzzles/wire-red/blue/yellow/green/white.svg` | 110×540 | Wavy cable, plugs, colour-blind pattern + shape marker |
| `puzzles/scissors.svg` | 190×160 | Wire cutter cursor |
| `puzzles/glitch-popup.svg` | 780×300 | Fake system error with glitch offsets; text runtime |
| `puzzles/vu-meter.svg` | 520×320 | Acoustic level chassis, needle/scale |
| `puzzles/symbol-*.svg` | 96×96 | 8 white geometric symbols for Crowd Cipher |

Wire patterns:

| Colour | Marker | Pattern |
|---|---|---|
| Merah | triangle | diagonal stripe |
| Biru | square | straight line |
| Kuning | circle | dots |
| Hijau | X | zigzag |
| Putih | star | checker |

### 3.10 Gesture illustrations

`ui/gestures/gesture-{tap|hold|drag|swipe|multi}.svg` — **240×180**, dark card, cream hand line art, yellow motion cue. Used by the help overlay.

### 3.11 FX

| File | Size | Use | Runtime technique |
|---|---:|---|---|
| `fx-spark.svg` | 128 | touch sparks, cut burst | Additive, tween scale/alpha, tint per player |
| `fx-smoke.svg` | 512 | Smoke Screen | 20 large puffs, tinted grey, alpha 0.72–0.82, palm wipe |
| `fx-smoke-dark.svg` | 512 | Smoke Screen depth | Dark variant |
| `fx-ice.svg` | 1700×760 | Cryo Freeze overlay | Scale to work zone; input blocker on top |
| `fx-glass-crack.svg` | 1920×1080 | Defeat aftermath | Overlay at alpha 0.55–0.9 |
| `fx-explosion.svg` | 1400×1400 | Detonation | Scale 0.25→1.08, rotate, screen shake |
| `fx-shockwave.svg` | 600 | impact ring | scale/fade |
| `fx-flame.svg` | 280×360 | fire accents | particle/tint |
| `fx-electric.svg` | 520×180 | dual-hand connection | additive pulse |
| `fx-confetti-1…3.svg` | 64×36 | victory | tint 5 colours, 28–92 particles, depth below panels |
| `fx-flash-rays.svg` | 1400×1400 | victory/win flash | slow rotation |
| `fx-speedlines.svg` | 1600×900 | ambient/attack | low alpha overlay |

---

## 4. PNG export mirror

`assets/exports/` contains a complete @1× mirror and is used by the game at runtime by default:

- 175 SVG assets exported as PNG with the same relative folder names.
- 4 circular avatar masters (130×130).
- The official transparent logo (`assets/brand/bomb-defusal-logo.png`).
- `export-manifest.json` lists every file with width, height, byte size, source path, transparency flag and source type.
- UI assets were captured against a transparent Chromium page; verify edges on a real compositing stack if you integrate outside Phaser.
- **Why PNG at runtime:** the source SVG pack is ideal for editing and re-export, but rasterising 175 SVGs dominated cold boot. The curated PNG runtime now loads ±100 sprites and measured **~3.5–4.0s cold boot** in a fresh Chromium context (old mirror ~5.3s; SVG ~10.1–10.8s). Use `?assets=svg` to force the vector loader for props.
- Use the PNG mirror for tools that cannot consume SVG (After Effects, Unity Canvas, PowerPoint, Figma batch import, etc.).
- For print/large backdrop/native 4K, re-render the SVG at 2×–4× rather than upscaling the @1× PNG.

Example paths:

```
assets/exports/ui/buttons/btn-primary-normal.png          480×144 (legacy, not loaded)
assets/ui/comic/frame-card.png                            422×380
assets/ui/comic/panel-lcd.png                             1007×289
assets/characters/avatar-ren.png                          130×130
assets/backgrounds/bg-comic.png                           1920×1080
```

---

## 5. Responsive scaling system

### 5.1 Runtime

Phaser config:

```js
width: 1920, height: 1080,
scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }
```

Asset loading is likewise runtime-optimised:

```text
default  → curated PNG runtime (comic backgrounds, logo, avatars, comic UI cuts, used SVG props)
?assets=svg → assets/**/*.svg       (vector source for props, ~10.1–10.8s cold boot)
```

- Canvas is fitted with letterboxing to any 16:9 (or wider) viewport.
- On a 3840×2160 panel, the 1920 logical canvas is scaled ×2 by the browser.
- The game never reflows to a different layout. Zones and hitboxes are in logical pixels, so touch mapping is automatically correct.
- On portrait phones (`orientation: portrait` + width ≤ 900), a CSS overlay asks the user to rotate the display. The game itself is landscape-only.
- Touch/scroll suppression: `touch-action:none`, `overscroll-behavior:none`, user-select none, context menu disabled, double-tap disabled.

### 5.2 Physical sizing at PID

At 1920 logical, a 70 px target ≈ 3.5 cm on a 75-inch 16:9 panel. At 4K logical equivalents, use 140 px.

| UI target | Logical 1080p | 4K equivalent |
|---|---:|---:|
| Minimum touch | 70×70 | 140×140 |
| Button factory zone | 140×120 | 280×240 |
| Primary CTA | 654×118 | 1308×236 |
| Pass bomb button | 276×96 | 552×192 |
| Module card | 560×620 | 1120×1240 |
| Timer plate | 560×180 | 1120×360 |
| Crowd ribbon | 1560×96 | 3120×192 |

### 5.3 Native 4K upgrade path

The delivered build intentionally renders at 1920×1080 for broad performance. For pixel-native 4K:

1. Set Phaser game size to 3840×2160 and camera zoom 2 over a 1920×1080 world (or multiply every UI coordinate by 2).
2. Use the SVG sources; Phaser’s SVG loader can rasterize at 2× (pass `width/height` to `load.svg`).
3. Export key raster assets at @2× from `assets/exports` or re-render SVG at 2×.
4. Re-check text metrics because Phaser text is rendered at the new internal resolution (crisper, different line wraps).
5. Profile on the actual PID GPU; 4× fill rate is the main cost.

Do **not** implement 4K by upscaling PNGs; use the vector sources.

---

## 6. Motion and feedback specifications

| Element | Specification |
|---|---|
| Button hover | container scale 1.025, 100–140 ms |
| Button press | texture `pressed`, y +4, scale 0.985, 65 ms |
| Button release | 100 ms Back.Out, back to 1.0 |
| Module entrance | alpha 0→1, y +40→0, 420 ms Back.Out, 90 ms stagger |
| Active LED | glow alpha 0.28→0.55, scale 1→1.3, 760 ms sine yoyo |
| Solved LED | solid green, no pulse; frame switches to solved variant |
| Timer pulse | scale 1.04, 90 ms yoyo at low time / on solve |
| Touch ripple | ring 16→56 px radius, alpha .9→0, 430 ms |
| Spark | 2–18 small additive stars, 260–680 ms |
| Sabotage banner | slides in with the overlay; 850×151, at y≈350 |
| Smoke puff clear | 260 ms fade, scale 1.2 |
| Ice hit | 80 ms shake, crack lines at the touch point |
| Gravity | rotate 0.9s, hold 7s, rotate back 0.9s |
| Explosion | white flash 180 ms, scale 0.25→1.08, 520 ms, shake 700 ms |
| Confetti (Victory) | 92 initial + 28 periodic, depth 8 (behind panels), scale 0.26–0.62 |
| Results auto-return | 30s, labels tick every second; modal pauses the countdown |
| Idle warning | after 15s no touch, overlay + 6s countdown; reset at 21s |

---

## 7. Accessibility & PID ergonomics

- **Minimum hitboxes** as above; module interactions 84–204 px.
- **Palm-sized ghost touch filter**: radius > 92 ignored except Smoke.
- **Colour-blind wire system**: names + markers + patterns.
- **No colour-only answers** in modules: digits and shapes, labels and patterns.
- **Contrast**: cream on navy at ≥ 7:1 for key copy; timer red is high-chroma on dark recess.
- **Standing distances**: crowd ribbon is sized to read from 5–10 m; HUD timer from 10 m; module text is intended for 50–100 cm.
- **Reach**: top zone is non-interactive; all control targets live below 908 px or on module cards in the middle band; pass bomb is bottom right for a standing adult/teen.
- **Motion**: no rapid full-screen flash sequences beyond 180 ms and no strobe pattern; shake amplitudes are modest (≤ 0.014) and short.

---

## 8. Integration recipes

### 8.1 9-slice button

```js
const btn = scene.add.nineslice(0, 0, 'btn-primary-normal', null, 360, 104, 54, 54, 40, 44)
  .setOrigin(0.5);
```

### 8.2 Module frame overlay

```js
const frame = scene.add.image(0, 0, 'frame-module').setOrigin(0);
// content is added between the card background and the frame; header/LED are added above
```

### 8.3 Tintable icon

```js
scene.add.image(x, y, 'icon-wire').setDisplaySize(48, 48).setTint(0xffc93c);
```

### 8.4 Avatar crop

```js
scene.add.image(x, y, 'avatar-ren').setDisplaySize(64, 64);
// ring and number badge drawn on top at runtime
```

### 8.5 Background

```js
scene.add.image(960, 540, 'bg-game').setDisplaySize(1920, 1080);
```

### 8.6 Fonts

Load `assets/fonts/fonts.css` in the page, wait for `document.fonts.load`, then boot Phaser. Do not put live text inside SVG assets if fonts must be guaranteed.

---

## 9. Regeneration / maintenance

```powershell
# Rebuild all 175 SVGs + manifest + catalogue
node tools/generate-assets.mjs

# Rebuild the PNG export manifest after adding/removing PNGs
node tools/build-export-manifest.mjs
```

Source generators:
- `tools/assets/lib.mjs` — palette, gradients, frames, strokes.
- `tools/assets/ui.mjs` — buttons, panels, frames, HUD, icons, gestures.
- `tools/assets/art.mjs` — backgrounds, characters, bombs, puzzle props, FX, brand mark.
- `tools/render/logo.html`, `tools/render/avatars.html` — Chromium-rendered PNG masters.
- `tools/generate-assets.mjs` — writes files, `asset-manifest.json`, `asset-catalog.html`.

If you change a master PNG (logo/avatar), update `assets/exports` and rerun `build-export-manifest.mjs`.

---

## 10. Provided style reference boards

The client supplied three JPG art-direction sheets:
1. interactive elements (arcade buttons, cables, sliders, fingerprint scanners);
2. module frames, metal panels, timers and indicator LEDs;
3. bomb icons, sabotage FX, explosions and hazard tape.

They are preserved at `docs/references/` and the original `assets/*.jpg` paths. They are **references, not runtime sprites**: they have baked dark backgrounds and multiple items in one raster, so the delivered pack re-authors the language as transparent, modular SVG components. Their rust/gloss/metal cues are visible in the panel gradients, rivets, hazard trims, glossy scanners and LED housings.

If a production team must use the original painted elements, crop and key them on a neutral background and add them as PNGs; maintain the same naming convention and sizes described above so the Phaser integration stays unchanged.

---

## 11. Asset QA checklist

- [x] All 175 SVGs parse and load in Chromium.
- [x] All UI/character/FX assets have transparent backgrounds (tested via alpha sampling).
- [x] Each button has all four states and consistent label-safe area.
- [x] Module frames are transparent in the content area and have a fixed 560×620 box.
- [x] 9-slice slice sizes match the integration code.
- [x] Wire colours have pattern, marker and label.
- [x] Timer digits are runtime text, not baked.
- [x] Fonts are vendored and loaded before first text creation.
- [x] Assets are offline-friendly; no external requests.
- [x] PNG export mirror generated and manifest entries have dimensions.
- [ ] Print-specific CMYK exports (not in scope for screen PID).
- [ ] Localised button label images (not needed — labels runtime).
