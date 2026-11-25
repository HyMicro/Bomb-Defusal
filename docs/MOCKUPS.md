# UI MOCKUPS
## 9 runtime captures — 1920×1080, bright comic-arcade / PID landscape

![UI Mockup Sheet](00-overview.png)

All mockups in this folder are **real screenshots of the running Phaser build**, captured at 1920×1080 (16:9) in Chromium. They are not painted comps. The official logo, cast avatars, comic button states, pop-art pages, metal frame cuts, timer bezel and penalty frame are the same PNG files that ship in `assets/`.

---

## Screen index

| # | Screen | File | What the mockup proves |
|---:|---|---|---|
| 1 | Main Menu / Attract | `01-main-menu.png` | Bright pop-art page, official logo, supplied comic button stack, REN hero card, leaderboard modal entry |
| 2 | Team Selection | `02-team-selection.png` | Cast REN/KAI/MIRA/RIN, 2/3/4 player cards, difficulty chips, bright CTA |
| 3 | Pre-Mission Story | `09-pre-mission-story.png` | Alternating dialog, speaker portrait, typewriter with typing SFX, party chips, skip |
| 4 | Mission Briefing | `03-mission-briefing.png` | Bomb case, three module rows, cast roster, sabotage warning, 3-2-1 countdown |
| 5 | Gameplay | `04-gameplay.png` | Three module cards, LCD timer, player tags, lives, score, cipher ribbon, progress + pass bomb |
| 6 | Sabotage | `05-sabotage.png` | Smoke Screen overlay + flat sabotage banner; cipher ribbon hidden during the event |
| 7 | Victory | `06-victory.png` | Bright mission report, MVP, daily top 5, replay/home, confetti |
| 8 | Defeat | `07-defeat.png` | Comic detonation, cracked glass, red penalty frame, safe-for-public penalty card |
| 9 | Operator Panel | `08-operator-panel.png` | PIN-protected bright overlay: presets, toggles, branding, data/export panel |
| 10 | Contact sheet | `00-overview.png` | All screens in one design-review board |

Open the browsable board: [`overview.html`](overview.html).

---

## Capture specification

| Property | Value |
|---|---|
| Viewport | 1920 × 1080 CSS px |
| Engine | Phaser 3.90, WebGL |
| Browser | Chromium (Playwright-driven) |
| Preview routes | `/?preview=menu`, `team`, `story`, `briefing`, `gameplay`, `sabotage`, `victory`, `defeat`, `admin` |
| Font state | Local WOFF2 fully loaded before capture |
| Device scale | 1× CSS capture; live PID may upscale to 4K with documented softness |
| Date | 24 November 2026 (build 2.3.0) |

### Why preview routes

Normal navigation includes live countdowns and player-selected state. Preview routes freeze a representative state so the UI can be reviewed consistently:

- **Gameplay:** Wires, Crowd Cipher and Reverse Psychology in a mid-round state; cipher ribbon visible; score/contribution split is preset.
- **Sabotage:** Smoke Screen opens automatically after the GameScene settles.
- **Briefing:** frozen at “2”.
- **Story:** party of 3, first REN line fully typed.
- **Victory/Defeat:** demo flags prevent leaderboard writes and auto-initials from covering the clean result screen (the real screens still prompt when qualified).

---

## Bright theme (2.3)

- Page backgrounds are the supplied pop-art sheet exported as `bg-bright-menu`, `bg-bright-page` and `bg-bright-game`; no dark overlay is baked in.
- Panels are warm cream `#FFF4DF` / `#FFF9ED` with ink borders. The main menu control stack and pass-bomb panel stay dark ink slabs for contrast.
- Body and microcopy use ink/brown `#1B1406` / `#6B5A43`; bright accents stay reserved for outcomes and player identity.
- Small red labels that sit directly on the busy page get a cream stroke so they remain readable at 1080p.
- The operator overlay is now cream with ink fields, yellow presets and green toggles.

---

## Screen intent

### 1. Main Menu / Attract
- The official **BOMB DEFUSAL** logo is the focal point, top-left.
- The supplied arcade button states drive MULAI MISI, CARA MAIN, PENGATURAN and LEADERBOARD.
- REN’s comic portrait card holds the right side; the rest of the party sits in a small strip below.
- LEADERBOARD opens a modal instead of a permanent panel; menu modals use a warm cream scrim with an ink-bordered card.
- Sound toggle and the invisible operator hotspot remain in the top-right / top-left.

### 2. Team Selection
- Three cream cards: 2 / 3 / 4 players, with the current cast avatars.
- Difficulty is one chip row; the selected chip is a solid yellow pill.
- Check badge appears only on the selected card.
- CTA subtext repeats the resolved mode: players • difficulty • seconds.

### 3. Pre-Mission Story
- Speakers alternate through the selected party; portraits swap and the active chip highlights.
- Typewriter runs at 22 ms with a low-gain typing tick every six characters.
- Tapping while typing completes the line; tapping again advances. Skip jumps straight to Briefing.
- A trigger stinger opens the story and a comic hit lands when it hands over to the briefing.

### 4. Mission Briefing
- Bomb case is the left hero; the countdown ring is translucent so the prop stays visible.
- Right panel uses three readable module rows instead of small cards.
- Cast roster shows owner/module assignment.
- Sabotage warning is a single quiet cream panel; hazard strip is only at the bottom edge.

### 5. Gameplay
- Top bar: round chip, 4 player tags, LCD timer, score + lives.
- Three cream module cards use a thin metal rim sourced from the supplied module frame.
- Cipher ribbon sits directly under the HUD and is never covered by the start toast.
- Bottom rail contains only progress and **LEMPAR BOM**.
- Timer updates once per visible second.

### 6. Sabotage
- Cipher ribbon hides during the event and is restored after it clears.
- Flat banner + progress bar; smoke is light enough to read the work zone while wiping.
- The pass-bomb button dims while a sabotage is active.

### 7. Victory
- Bright green-washed comic page, check stamp, large score, compact mission report.
- Leaderboard uses flat rows; initials keyboard is flat and tappable.
- Replay/home remain the only actions; auto-return countdown is in the footer.

### 8. Defeat
- Explosion + BOOM + reason, compact black-box stats.
- Penalty card uses the supplied red metal frame and cream paper.
- Two actions inside the card: home and replay.

### 9. Operator Panel
- DOM overlay with local fonts and the bright palette.
- Presets, audio, branding, daily data reset, CSV export.
- Closable by the sticky X, backdrop tap or Escape.

---

## Audio in the build

All audio is procedural Web Audio — no external files, so the build stays offline.

| Layer | Behaviour |
|---|---|
| Comic score | Bouncy walking bass, off-beat brass stabs, pluck melody and rubber-hose “boing”; tempo rises with tension |
| Typewriter | Short square tick, random 1.5–2.4 kHz pitch, low gain, every six characters |
| Trigger stinger | Low thump + noise burst + two rising square hits on story open/finish and MULAI MISI |
| UI | Click, tick, countdown, solve, strike, explosion; all respect the Sound / Music admin toggles |

---

## Asset provenance

| Runtime asset | Source |
|---|---|
| `assets/brand/bomb-defusal-logo.png` | supplied logo sheet, white background removed |
| `assets/characters/avatar-ren|kai|mira|rin.png` | supplied character sheets, circular crops |
| `assets/backgrounds/bg-bright-*.png` | supplied pop-art sheet, brightened at 1920×1080 |
| `assets/ui/comic/*.png` | supplied metal frame, timer, buttons, penalty frame, trophy, hazard, speech bubble |
| SVG props/icons/puzzles | original modular vector pack |
| Fonts | Luckiest Guy, Fredoka One, Varela Round, Bungee (OFL) |
