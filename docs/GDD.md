# GAME DESIGN DOCUMENT
## BOMB DEFUSAL: CHAOS EDITION
### BOMB DEFUSAL: CHAOS EDITION - comic-arcade ice-breaking for PID touchscreens

| Field | Value |
|---|---|
| Version | 2.0 (production build) |
| Game type | Cooperative party / puzzle / physical ice-breaker |
| Platform | Web HTML5, Chromium, Phaser 3.90 |
| Display | Landscape 16:9, logical 1920×1080, upscaled to 4K UHD PID |
| Input | Capacitive/IR multi-touch, 2–4 players, 10 active pointers |
| Session | 45–60 seconds including transitions |
| Audience | Public 10–55 years, exhibition / office gathering / festival |
| Build status | Playable vertical slice + production content, see [PRD map](PRD_IMPLEMENTATION_MAP.md) |

---

## 1. Vision

**BOMB DEFUSAL: CHAOS EDITION** turns a passive large-format touchscreen into the loudest corner of the room. One team of 2–4 people must defuse a cartoon bomb by solving three deliberately unfair-feeling modules while the screen sabotages itself, the bomb timer speeds up, and the crowd behind them is encouraged to shout the answers.

The game is an **ice-breaker first, a puzzle game second**. Nobody should need a tutorial, nobody should feel embarrassed, and every round should produce a story within 60 seconds.

### Three pillars

1. **Zero-tutorial onboarding**
   - Every module communicates its verb through shape, animation and short instructions.
   - Instructions are ≤ 110 characters where possible.
   - Touch affordances pulse, glow and physically react within one frame.
   - Target: new player understands the first interaction in **< 3 seconds** after the briefing.

2. **Whole-body, multi-touch ergonomics**
   - The PID is 65–86 inches; interactions must use arms, palms and two hands, not one index finger.
   - Every module has at least one gesture that is easier with two hands or two people.
   - Minimum interactive target at 1920 logical: **70×70 px** (≈140×140 px at 4K / 75-inch physical). Primary controls are larger (96–204 px).

3. **Asymmetric crowd synergy**
   - The spectator zone (top of screen) carries information a player cannot comfortably read from 50–80 cm away.
   - Crowd Cipher makes the audience mechanically necessary. The crowd is not decoration.
   - The game rewards shouting, pointing, laughing and passing the bomb to a stranger.

### Success criteria

| Metric | Target |
|---|---|
| Time from touch to first meaningful interaction | < 3 seconds |
| Players completing one module unaided | > 90% of groups |
| Full win rate on Standard, first session | 35–55% |
| Average session length | 45–60 seconds |
| Groups that replay immediately | > 40% |
| Physical gestures per 15 seconds of play | ≥ 4 |
| Readable timer at 10 metres | 180 px digits at 4K / 90 px at 1080p |

---

## 2. Audience, venue and tone

- Public exhibition booths, internal company gatherings, seminars, school/festival activations.
- Players are standing, often two or three abreast in front of a wall-mounted panel.
- Spectators are 1–5 metres behind them; children may be lifted or stand at the side.
- Round language is Indonesian, with English technical labels where the arcade look benefits.
- Tone: **chaotic but safe**. No gore, no humiliation, no politics, no alcohol references, no jump scares that could hurt a child. Explosions are comic-book, not realistic.
- Penalty cards are light physical/verbal dares that finish in 5–10 seconds and are safe in a formal corporate setting.

---

## 3. Core experience loop

```
ATTRACT ──touch──► TEAM SELECT ──► BRIEFING 3-2-1 ──► ACTIVE DEFUSAL
                                                          │
              ┌───────────────────────────────────────────┤
              │                                           │
        solve module (+3s)                         sabotage at time %
              │                                           │
              └──────────────► all modules safe ──► DEFUSED / WIN
                                                          │
                               timer 0 or 3 strikes ──► DETONATED / LOSE
                                                          │
                               penaltiy card / initials ◄─┘
                                                          │
                                                          ▼
                                                       ATTRACT
```

### Emotional beat sheet (target 45–60s)

| Beat | Time | What the player feels |
|---|---:|---|
| Attract | idle | “Oh, this looks fun / loud.” |
| Team select | 5–10s | “We choose how many of us play.” |
| Briefing | 3–4s | “Bomb active. Read fast.” |
| First puzzle | 0–8s | “Okay, I get the gesture.” |
| First sabotage | ~14–20s | “Ah! The screen is attacking us!” |
| First module solved | 10–25s | “We are actually good at this.” |
| Pass-the-bomb | optional | “Not me — you take it!” |
| Last 10s | last 10s | Heartbeat, ticking, crowd shouting |
| Win/Lose | 2s | Confetti or a comic explosion |
| Penalty card | 5–10s | Laughter, photo moment |
| Leaderboard | 5–10s | “We need to beat RYU.” |

---

## 4. Session flow and rules

### 4.1 Team setup

- 2, 3 or 4 players.
- One shared team. No competitive teams in one round.
- Module ownership is round-robin: module 1 → P1, module 2 → P2, module 3 → P3, module 4 → P4.
- If modules < players (Santai or 3 modules with 4 players), surplus players are **SUPPORT**. They can help on any module; their contribution is credited when they are the last toucher who clears a sabotage or accepts the bomb.
- All players may touch all modules. Ownership is for score attribution and friendly bragging, not for locking input.

### 4.2 Difficulty presets

| Preset | Modules | Base time | 2P | 3P | 4P | Sabotage moments (% remaining) | Pool |
|---|---:|---:|---:|---:|---:|---|---|
| **Santai** | 2 | 48s | 52 | 48 | 45 | 62%, 32% | smoke, ice, glitch |
| **Standar** | 3 | 40s | 44 | 40 | 37 | 65%, 40%, 20% | smoke, ice, gravity, glitch |
| **Chaos** | 3 | 32s | 36 | 32 | 29 | 72%, 52%, 32%, 15% | 4 slots + Crowd Cipher forced |

- Player-count offset: 2P +4s, 4P −3s. Three players is the tuning baseline.
- Sabotage triggers at most once per threshold and is queued if another sabotage is active.
- Each solved module adds **+3.0s** to the live timer.
- Chaos forces Crowd Cipher into the module set so the crowd mechanic always appears.
- The round ends **immediately** when all modules are safe, even if a sabotage is active.

### 4.3 Timer and strikes

- Max strikes: **3**. A strike is consumed by:
  - any declared module mistake (wrong trap button, wrong wire, pressing the reverse-psychology button, making noise during silence, etc.);
  - pass-the-bomb failure causes instant detonation rather than a strike (special case).
- Mistake time penalties: **−3s** default, **−5s** on Reverse Psychology A, **−2s** on Acoustic silence.
- A mistake always adds **−120 score** and one strike.
- Reaching 0 seconds **or** 3 strikes detonates immediately.
- Buttons use a 160 ms click lock; small key targets use 55–130 ms guards. This prevents a single fat finger from registering as three wrong presses.
- The timer is displayed with `ceil(secondsRemaining)` as `MM:SS`; internal timing keeps sub-second precision.
- Under 10 seconds:
  - timer pulsates and turns red;
  - the ticking doubles (twice per second);
  - music rises to 165 BPM with a sub-bass heartbeat every ~0.9s;
  - danger border pulses.

### 4.4 Round state machine

| State | Enter | Exit | Visible |
|---|---|---|---|
| `ATTRACT` | boot / result auto-return | touch START | logo, top-5, hero |
| `TEAM_SELECT` | Attract CTA | “LANJUT” | player count, difficulty |
| `BRIEFING` | team select | 3-2-1-MULAI | bomb case, modules preview, roster |
| `INTRO` | GameScene create | 950ms | cards slide in, “MULAI!” stamp |
| `RUNNING` | intro timer | win/lose | active defusal |
| `WON` | all modules solved | transition | confetti stamp |
| `LOST` | 0s / 3 strikes / pass fail | transition | explosion shatter |
| `VICTORY` | GameScene | replay / home / 30s idle | report + leaderboard |
| `DEFEAT` | GameScene | replay / home / 30s idle | penalty card |

---

## 5. Player experience and ergonomics

### 5.1 Layout on the PID

Logical layout at 1920×1080 (scales proportionally):

```
┌──────────────────────────────────────────────────────────────────────┐
│ TOP COMMAND BAR  y 0–190                                             │
│  round/O2 chip        TIMER PLATE (560×180)        strike / score    │
│  player chips x4                                                     │
├──────────────────────────────────────────────────────────────────────┤
│ CROWD CIPHER RIBBON y 170–268 (only when Cipher is in play)          │
├──────────────────────────────────────────────────────────────────────┤
│ WORK ZONE y 278–898                                                   │
│  [MODULE 1 560×620]   [MODULE 2 560×620]   [MODULE 3 560×620]         │
├──────────────────────────────────────────────────────────────────────┤
│ BOTTOM CONTROL RAIL y 908–1056                                        │
│  progress + module nodes     help/gesture hint      LEMPAR BOM!       │
└──────────────────────────────────────────────────────────────────────┘
```

- 3-module card x positions: 80 / 680 / 1280; 40 px gutters.
- 2-module layout: 360 / 1000, centred around 960.
- Top zone contains **no interactive controls** except the hidden operator hotspot.
- Bottom controls are reachable by children and wheelchair users.
- The crowd-zone ribbon sits at 16–25% screen height; it is legible from the crowd, not from close-up gameplay.

### 5.2 Touch rules

- 10 active pointers; each player does not have a dedicated reserved quadrant, but touch colour/feedback is attributed by nearest zone.
- Ghost touch filter: touch radius > 92 CSS px is ignored (palms, sleeves, forearms), except during Smoke Screen wiping, which deliberately accepts palms.
- Every pointer-down spawns a spark/ripple in the player’s colour.
- Primary hit target ≥ 70×70 at 1920; all gameplay-critical targets are 84–204 px.
- Buttons and keypads implement cooldown and “press vs drag” distance checks.
- Drag actions use screen-space tracking so multi-touch fingers do not fight each other.
- Pointer-down input is used for immediate feedback; activation is on pointer-up for menu buttons/puzzles, allowing users to slide off to cancel.

### 5.3 Colour-blind and low-vision support

- Every wire colour includes:
  - a named label (`MERAH`, `BIRU`, `KUNING`, `HIJAU`, `PUTIH`);
  - a shape marker (triangle, square, circle, X, star);
  - a background pattern (diagonal, line, dot, zigzag, checker).
- Cipher symbols are geometric shapes (triangle, diamond, circle, square, star, hexagon) plus digits; no colour-only puzzle.
- Buttons always carry text labels (not colour-only meaning).
- The timer is high-contrast and uses a monospaced digital face.
- Large counts and numbers use thousands separators.

---

## 6. Puzzle bank

All modules share the 560×620 shell:

- metal frame, module number, title, category subtitle, owner, status LED;
- active = red LED, solved = green LED and green frame;
- active/solved footer status;
- header/footer safe areas reserved so content can be authored independently.

### 6.1 Dual-Hand Anchor — *Kunci Sinkronisasi Dua Tangan*

**Design purpose:** make a wide screen feel wide. One player must use both hands at once.

| Variant | Instruction | Interaction | Success | Failure/reset |
|---|---|---|---|---|
| A: Hold & Drag | “Tahan sensor kiri, lalu geser tuas merah ke kanan!” | One finger keeps the left biometric scanner pressed; a second finger drags the red lever to its right end. | Lever reaches ≥ 96% while the scanner is held. | Release of the left scanner snaps the lever back; no strike, just lost time. |
| B: Stretch & Hold | “Rentangkan kedua tangan — tahan dua sensor selama 2,5 detik!” | Hold both scanners simultaneously. The charge meter gains while both are held; it decays fast when either hand is released. | Both held for 2,500ms. | Release/decay; no strike. |

Implementation details:
- The visual fingerprint scanners are 212px (A) / 204px (B); hit zones are 204×204.
- Variant A has electric arcs and a synchronisation bar; a small lock glyph teaches “two fingers”.
- Variant B uses a connected arc and charges 0–2.5s; after 2.6s it would be impossible to hold a single hand.
- Local test: 2-pointer CDP touch sequence solved the module; see QA.

### 6.2 Meta UI Trap — *Jebakan Antarmuka*

**Design purpose:** punish the habit of tapping the most colourful object without reading. The correct action is always visible but counter-intuitive.

| Variant | Fake/trap | Correct action | Wrong action |
|---|---|---|---|
| A: The word | Three juicy `BOM 1`, `BOM 2`, `BOM 3` buttons. | Tap the word **BOM** inside the instruction. | Any fake button: −3s, strike, system shake. |
| B: Serial digit | A keypad 0–9 that invites an immediate press. | Press the digit matching the last digit of the live timer. | Wrong digit: −3s, strike. |
| C: GESER | Three grey “KIRI / ATAS / BAWAH” decoys. | Drag the large yellow `GESER` block >170px sideways. | Decoys only shake and notify; no strike. |

Notes:
- Variant B accepts the current timer digit; the player must observe the top timer, not a local fake display.
- A small “SYSTEM VERIFY // NODE 03” header and fake window chrome sell the illusion.
- The correct word pulses very subtly, not like a button.

### 6.3 Reverse Psychology — *Ujian Kesabaran*

**Design purpose:** create tension without a single button press. Crowds usually shout “press it!”.

| Variant | Rule | Do | Don’t |
|---|---|---|---|
| A: Red button | “JANGAN SENTUH TOMBOL MERAH SELAMA 4 DETIK!” | Do nothing for 4.0s; the internal bar fills and turns green. | Touching it triggers −5s, one strike, resets the 4s bar. |
| B: Blue exception | Big button says “TEKAN SEKARANG!”; small print: exception if the button is blue. | If red/green, tap it. If blue, wait 3.2s untouched. | Blue + press = −3s, strike, reset. |

Notes:
- A colour chip (`WARNA: BIRU`) makes the trap readable without relying on colour perception alone.
- Variant A’s hold bar decays to zero after a press; the module can be solved by literally leaving it alone, which is a great spectator moment.
- The internal timer pauses when the round is paused by a pass-the-bomb overlay.

### 6.4 Logic Wire Cutter — *Potong Kabel Logika*

**Design purpose:** a fast verbal-logic test with a satisfying physical swipe.

- Five vertical wavy cables; colours red, blue, yellow, green, white.
- Each cable has a colour-blind marker and text label.
- The rule card is generated against the current left-to-right order, ensuring one unique answer.
- Swipe distance ≥ 44 px across the cable triggers a cut. Scissors follow the finger.
- Correct cut: green frame, chime, +800×score multiplier.
- Wrong cut: −3s, strike; that cable is visually severed and the rest remain playable.
- Rule bank (16 implemented):
  1. “Potong kabel yang warnanya TIDAK tertulis di sini” (Stroop names; correct omitted colour).
  2. Second from the right.
  3. If yellow → leftmost; otherwise blue.
  4. A colour name with 4 letters (B-I-R-U).
  5. The middle cable.
  6. “Sama dengan HIJAU — abaikan warna tintanya.”
  7. Find the star marker.
  8. The cable immediately right of blue.
  9. The cable immediately left of white.
  10. From the left, the first cable that is neither red nor blue.
  11. If white exists → rightmost; else green.
  12. Third from the left.
  13. From the right, the first cable that is not white.
  14. Find the triangle marker.
  15. From the left, the first cable that is not white.
  16. Second from the left.
- Rules that are invalid for the drawn order are filtered out; if all fail, a deterministic middle/third fallback is still available (the generator guarantees at least 11 valid rules in normal draws).
- Stroke colours deliberately conflict with the colour names in the Stroop rules.

### 6.5 Crowd Cipher — *Sandi Kolaborasi Penonton*

**Design purpose:** force players to turn around and involve the room.

- Six geometric symbols are mapped to six unique digits in the **crowd ribbon** at the top of the PID.
- The module shows a sequence of three symbols; the player types the three matching digits on a 5×2 keypad.
- Wrong code: −3s, strike, entry clears; the ribbon stays visible.
- Correct code: module safe; the ribbon animates away.
- A live timer is still running; the crowd must read quickly.
- The crowd-zone ribbon is 90–120 px tall, placed below the timer and above the cards, visible at ~10 metres.
- The mapping is re-randomised each session, so spectators cannot memorise last round's answer.
- If the module is not drawn, the ribbon is absent; the work zone leaves a clean vertical gap.

### 6.6 Acoustic Sensor — *Ujian Suara / Simulasi*

**Design purpose:** leverage the volume of the room without requiring microphone permissions.

| Variant | Rule | Interaction | Fail |
|---|---|---|---|
| A: Shout meter | Fill the VU meter by tapping rapidly or shouting; simulation uses taps. | ~10 rapid taps; power gains 10.5% per tap and decays 4.5%/s. | No penalty for slow taps; just time lost. |
| B: Silence | “DIAM TOTAL! Jangan sentuh selama 3 detik.” | Do nothing for 3.0s. | Any tap resets the timer, −2s, strike. |

- The optional microphone build maps RMS amplitude to the same VU target; the shipped version is deliberately touch-simulated so no permission popup interrupts a public event.
- Spectators can tap the module to ruin a silence challenge — that is part of the fun.

---

## 7. Sabotage bank

Sabotage is a **physical interruption**, never a modal “click OK”. It must be cleared with a gesture while the bomb timer keeps ticking.

| Sabotage | Trigger | Visual | Mechanic | Counter | Auto-timeout |
|---|---|---|---|---|---|
| **Smoke Screen** | 65% (standard) | 20 dark grey puffs, 0.42 full-screen dim, gas hiss, hand hint | Covers cards; single taps don't clear enough | Wipe with palm/flat hand; clear ≥80% of 20 puffs | 16s, no clear score |
| **Cryo Freeze** | 40% / chaos slots | Ice sheet, cracks, blue shards, klang | Modules are functionally frozen under the sheet | 6 rapid taps, cracks appear, shatter | 15s |
| **Gravity Flip** | 20% | Work cards rotate 180° around centre in 0.9s; purple orbit rings | Buttons left/right and up/down are inverted for 7s | No removal; adapt hands/head or wait 7s | fixed 7s |
| **Fake Glitch** | 20% / random | Chromatic fake error window, static scanlines | Blocks work zone | Drag pop-up up >100px to “reboot” | 14s |

Mechanics:
- One sabotage active at a time; additional triggers queue (up to 3).
- Sabotage clears award `250 × score multiplier` to the last toucher and add to the final win tally.
- If a sabotage times out automatically, no clear points are awarded and the round continues with no extra penalty. This prevents a kiosk soft-lock.
- The sabotage banner is 850×151 and sits between the timer and cards. It is always above smoke/ice for readability.
- Smoke Screen is the only mode that intentionally permits palm-sized touch points.
- Gravity rotation uses `workPivot` so HUD/player tags do not rotate.
- Ice uses a full-screen transparent input blocker under the banner so puzzles cannot be solved behind the frost.

---

## 8. LEMPAR BOM! (Pass the Bomb)

A social escape valve, once per round.

- Button in the bottom-right control panel; enabled only if:
  - remaining time > 8s;
  - not used yet;
  - not during a sabotage;
  - pass-the-bomb feature enabled in admin.
- Pressing it:
  1. Consumes the one use.
  2. Pauses the round timer for 5.0 seconds.
  3. Dims the game and presents a yellow/black transfer banner.
  4. Displays a randomly chosen nomination condition:
     - wears glasses;
     - bright-coloured shirt;
     - sitting in the front row;
     - name starts with S;
     - wearing a watch.
  5. A giant “SAYA TERIMA BOMNYA! (+5 DETIK)” button appears.
- Accept:
  - timer resumes with **+5s**;
  - +300 score to the accepting player (or last toucher);
  - confetti;
  - the game continues with the new player physically at the screen.
- Timeout:
  - bomb detonates immediately; `reason = BOM TIDAK DITERIMA SIAPA PUN`;
  - both initiator and target are eligible for the shared penalty card in the fiction.
- The “target” is not tracked with a camera; it is a social contract. This avoids hardware dependencies and makes it work for any crowd.

---

## 9. Scoring

Let `M` = difficulty score multiplier:

| Preset | `M` |
|---|---:|
| Santai | 1.0 |
| Standar | 1.2 |
| Chaos | 1.5 |

### 9.1 In-round scoring

| Event | Points | Time |
|---|---:|---:|
| Module solved | `800 × M` to owner contribution | +3.0s |
| Sabotage cleared | `250 × M` to last toucher | no time |
| Pass-the-bomb accepted | +300 to accepter | +5.0s |
| Any strike/mistake | −120 | −2 / −3 / −5s depending on module |
| Sabotage auto-timeout | 0 | no change |

### 9.2 Final win tally

```
finalScore = roundScore
           + floor(timeLeft × 120 × M)
           + (strikes == 0 ? 1500 : 0)
           + sabotageCleared × 250
```

- The last term is a retention bonus on top of the immediate sabotage clear points; the UI reports “sabotase dibersihkan”.
- Loss gives no final bonus; the round score remains visible in the “black box” report.
- Team contribution sums to the team score where all score events are attributed. (Preview scenes set a deliberate non-gameplay score split for visual mockups.)

### 9.3 Leaderboard

- Daily local leaderboard, top 5 by **remaining time** (fastest defuser), tie-break by score.
- Player initials are 3 letters, entered on a large A–Z keyboard.
- Only victories can be saved.
- Seed entries are marked as demo in storage; use the operator panel to reset before a real event.
- CSV export includes date, initials, score, remaining time, players, difficulty, strikes and demo flag.

### 9.4 Victory / defeat conditions

**Victory**
- all modules in the current round are safe;
- timer may be at any positive value;
- strikes can be 0–2;
- final score is tallied, leaderboard qualification checked, victory screen and confetti; if qualified, initials keyboard auto-opens after 1.7s.

**Defeat**
- timer reaches 0; or
- 3rd strike occurs; or
- pass-the-bomb expires without acceptance.

**Penalty card**
- displayed after the explosion afterglow;
- 1 of 9 safe challenges selected randomly;
- no card if the operator disabled them;
- card persists until a button is pressed or the result auto-returns in 30s.

---

## 10. Penalty cards (safe-for-public)

| # | Title | Challenge |
|---:|---|---|
| 1 | Pose Superhero | Hold a superhero pose in front of the screen for 5 seconds; spectators may take photos. |
| 2 | Slow Motion | Walk back to your seat in cinematic slow motion for 5 seconds. |
| 3 | High-Five Trio | High-five 3 nearby people within 5 seconds. |
| 4 | Flat Face | Say “Saya berjanji tidak akan panik lagi” with the flattest possible expression. |
| 5 | Three “S” Foods | Name 3 foods starting with S within 4 seconds. |
| 6 | Ambulance Siren | Imitate an ambulance siren or explosion for 3 seconds. |
| 7 | Head Pat | Pat your own head 3 times saying “Bom ini terlalu pintar untukku.” |
| 8 | Robot Dance | Do a robot dance for 5 seconds. |
| 9 | Countdown Drama | Count down 5–1 dramatically, then shout “BOOM!” |

Design rules for cards:
- no removing clothing;
- no physical contact beyond consensual high-fives;
- no personal/embarrassing facts;
- no running or climbing;
- finish in ≤ 10 seconds;
- can be disabled for formal corporate events.

---

## 11. UI/UX specification

### 11.1 Type hierarchy

| Role | Font | Size (1920) | Notes |
|---|---|---:|---|
| Logo | Luckiest Guy / supplied logo PNG | 700 px asset | transparent, tilted |
| Screen title | Bangers | 56–150 px | thick dark stroke, red/blue extrusion |
| Module title | Fredoka One | 21 px | fit to 320 px |
| HUD labels | Nunito ExtraBold | 8–15 px | uppercase, letter-spaced |
| Body/instructions | Nunito ExtraBold | 10–18 px | high contrast, line-spacing 3–7 |
| Timer | Orbitron Bold | 72–82 px | red LED, high contrast |
| Leaderboard times | Orbitron Bold | 14–21 px | tabular rhythm |

### 11.2 Chrome language

- 12–24 px radii, 6–8 px ink outlines, steel bevels, yellow corner brackets.
- Hazard-stripe tiles appear only on edges/status plates, not behind body text.
- Rivets are decorative and non-interactive.
- Active module LED is red; solved is green. Category accent is used for the header badge/button edge.
- Every interactive button has normal / hover / pressed / disabled states. Disabled is grey hatched, never just low-alpha colour.
- Pressing feedback: scale 0.985, 4 px downward motion, texture swap; release 100ms Back.Out.

### 11.3 Feedback rules

| Event | Visual | Audio | Haptic/gesture |
|---|---|---|---|
| Touch | spark + coloured ripple; ring stays under finger | soft click | immediate |
| Module solved | green LED/frame, “MODUL AMAN” stamp, sparks, +800/+3s float | chime + solve arpeggio | visible across the room |
| Mistake | red flash, card shake, camera shake, strike pip updates | error saw + strike thud | screen edge red |
| Sabotage start | banner, dim, physical covering | siren/ice/gas ambience | banner + hand hint |
| Last 10s | timer scales, red border, faster ticks | 165 BPM + heartbeat | urgency |
| Win | confetti, rays, green stamp | fanfare | crowd moment |
| Lose | white flash, explosion, glass shards, shake | explosion | spectacle |

### 11.4 Onboarding

- Attract screen contains only:
  1. logo + tagline;
  2. big “SENTUH UNTUK JINAKKAN BOM” CTA;
  3. daily top 5;
  4. characters and bomb hero;
  5. two secondary buttons (CARA BERMAIN, PENGATURAN).
- Help overlay is optional and never blocks the first round.
- Team selection explains 2/3/4 players and estimates duration; no name entry.
- Briefing shows the exact modules and owner names so players know who is “responsible” (even though everyone can help).
- During play, every module has a hint line (“BUTUH 2 TANGAN”, “SWIPE”, “TAHAN DIRI”, etc.).

---

## 12. Audio design

The shipped build uses a procedural Web Audio engine, no external audio dependencies.

### Adaptive music

| Condition | BPM | Layers |
|---|---:|---|
| > 20s | 110 | triangle bass, soft square arp, light hats |
| ≤ 20s | 135 | + kick, denser arp |
| ≤ 10s | 165 | + heartbeat sub-bass every ~0.9s, more hats |

### SFX inventory

- click, select, back;
- mechanical tick (urgent variant doubles at <10s);
- chime/solve arpeggio;
- error saw, strike thud, denied;
- gas hiss/sabotage rumble, ice crack, whoosh, spark;
- explosion (noise + sub drop), win fanfare;
- countdown beeps and “MULAI!” go;
- pass siren/chime, heartbeat.

Audio rules:
- AudioContext unlocks on the first physical touch.
- Music and SFX are separate toggles.
- Volume is intentionally modest at a public booth; the speech/crowd should dominate.
- No loud jump-scare transients; the explosion is bass-heavy but short.

---

## 13. Operator/admin design

Access:
- 5 taps in the top-left 90×90 hotspot within 2 seconds; or
- PENGATURAN on the Attract screen;
- PIN gate, default `0000`.
- `?preview=admin` bypasses the PIN only for design review; production should remove this preview bypass if the URL is exposed.

Panel:
- preset difficulty (applies to next round);
- toggles: sabotage, penalty cards, pass-the-bomb, acoustic mic (roadmap), SFX, music;
- auto-reset seconds (default 30);
- event title/subtitle for Attract;
- export leaderboard CSV;
- reset daily scores/settings;
- reload application.

Not included in the production build yet:
- restart round button (use reload/back to team select);
- logo upload UI (replace `assets/brand/bomb-defusal-logo.png`);
- per-event colour skins;
- PIN change UI (edit `bc.settings.v2`).

---

## 14. Edge cases and recovery

| Case | Handling |
|---|---|
| Ghost touch / sleeve | Touch radius > 92 px is dropped before it reaches any button, except Smoke Screen wiping |
| Single fat finger spamming a keypad | 55–130 ms guards + button 160 ms cooldown |
| Player walks away | 15s idle warning overlay; no touch for 20s → Attract |
| No one touches Attract | Stays in attract loop for next group |
| Result screen idle | 30s auto return to Attract (Victory pauses if initials modal open) |
| Timer hits 0 during a solve animation | Round is already finished; solve is ignored; defeat sequence plays |
| Sabotage active when modules are all solved | Sabotage is destroyed; win takes priority |
| Sabotage never cleared | Auto-clears after 14–16s with no points, preventing soft-lock |
| Use pass bomb with <8s | Button disabled; caption explains |
| Pass bomb timeout | Immediate detonation; defeat reason logged |
| Admin opens while game runs | Not reachable from active round in this build; use restart/pause plan for production |
| localStorage disabled | Settings fall back to defaults; leaderboard still displays seeds; no crash |
| WebAudio unavailable | Game continues silently; no blocking errors |
| 4K panel | FIT scaling; 1920 logical canvas upscaled; upgrade path documented |
| Touch panel lost calibration | Use browser window at 1920 CSS px and recalibrate PID OS; no in-app calibration |
| Network unavailable | Vendored Phaser/fonts/assets; static local server works offline |

---

## 15. Balance tuning

All numbers live in `src/config.js`, `RoundManager`, or the relevant puzzle.

| Knob | Default | File |
|---|---|---|
| Base time | 48 / 40 / 32 | `config.js` `DIFFICULTIES` |
| Player offset | +4 / 0 / −3 | `timeForDifficulty()` |
| Module solve bonus | +3s | `RoundManager.solveModule` |
| Sabotage thresholds | 0.65/0.40/0.20 | `config.js` |
| Score per solve | 800 × mult | `RoundManager` / `GameScene` |
| Mistake score | −120 | `RoundManager.registerMistake` |
| Strike penalties | −3 / −5 / −2 | puzzle `mistake()` calls |
| Pass bomb window | >8s / 5s freeze / +5s | `GameScene.openPassBomb` |
| Leaderboard size | 5 | `storage.js` |
| Result auto-return | 30s | Victory/Defeat scenes |
| Idle warning / reset | 15s / 21s | `GameScene.checkIdle` |

Tuning guidelines:
- If win rate < 25% on Standard: increase base time by 3s before lowering sabotage count.
- If win rate > 65%: add a 4th sabotage threshold or force one Crowd Cipher.
- If groups do not use pass-the-bomb: increase the visual pulse and move the nomination condition into the pre-round briefing.
- If crowd participation is low: enlarge the Cipher ribbon and add a spectator-facing instruction ticker.

---

## 16. Content and replay

- 6 module families × variants yields 11+ distinct puzzle experiences.
- 16 wire rules are generated against wire order; thousands of combinations.
- 4 sabotage types; chaos uses 4 slots.
- 9 penalty cards.
- Daily top-5 creates a same-day competition without persistent accounts.
- Scope for more content: 3D card-flip code, order-of-operations keypads, hidden QR codes (offline), sound waveform matching, crowd colour callouts.

---

## 17. Acceptance criteria

1. A group of 2, 3 or 4 can start, play, win or lose, and restart without a mouse or keyboard.
2. 10 simultaneous touch points are supported; Dual-Hand Anchor can be solved with two fingers.
3. Every round lasts 45–60 seconds at 3 players Standard (including briefing) unless the team fails early.
4. Timer, sabotage schedule and strikes stop cleanly at all state transitions.
5. All 6 module families can be solved; all 4 sabotages can be cleared.
6. Pass-the-bomb success and failure both resolve the round correctly.
7. Daily top-5 saves only victories, with 3 initials, and survives a page reload.
8. Admin panel gates with PIN `0000`; toggles persist.
9. Game runs offline from `localhost` with vendored dependencies.
10. 175 SVGs and 180 PNG exports are present and load; UI mockups 01-09 captured from the running game.
