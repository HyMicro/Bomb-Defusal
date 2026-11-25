# CLIENT ART REFERENCES & RUNTIME SOURCES

The client supplied two waves of art:

1. **UI sheets** (arcade buttons, metal frames, timer, penalty card, bomb/FX, cipher symbols).
2. **Comic pack** (halftone panels, word bursts, speed lines, speech bubbles) plus **four character sheets** and the **official BOMB DEFUSAL logo**.

The original files are kept in `/assets` and this folder for provenance. Selected elements are now **runtime sprites**; the rest remain reference material.

---

## What is used at runtime

| Supplied file | Runtime use |
|---|---|
| `BOMB DEFUSAL Timer Logo.png` | `assets/brand/bomb-defusal-logo.png` — transparent logo, Attract + boot |
| REN / KAI / MIRA / RIN character sheets | `assets/characters/avatar-*.png` — 130×130 circular crops, HUD/team/briefing |
| `Frame Modul, Panel Metal, Timer & Indikator Status.jpg` | `frame-card`, `panel-lcd` cuts: module rim + LCD timer bezel |
| `Tombol Aksi Utama, Banner Peringatan & Bingkai Kartu Hukuman.jpg` | green play button, red penalty frame |
| `Elemen Interaktif (...).jpg` | round arcade buttons used as difficulty LEDs |
| `Ikon Bom, Efek Sabotase & Ledakan.jpg` | hazard strip + explosion accent |
| `1443969_11427.jpg` | `bg-comic.png` / `bg-comic-quiet.png` — full-page comic halftone backgrounds |
| `blank-comic-speech-bubbles...png` | `bubble-cloud` — help modal header |
| `Simbol Crowd Cipher, Keypad Angka & Ikon Sistem.jpg` | reference for cipher symbols and keypad language |
| `3797319_9837.jpg` (word bursts) / `32972002_7994582.jpg` (speed lines) | reference; not used as runtime sprites because the JPGs have a baked checkerboard/white background |

The 175-file vector pack remains the source for icons, puzzle objects, wires, scanners, FX and the older UI kit. Runtime loads only the subset listed in `src/scenes/BootScene.js`.

---

## Board notes

### Interactive elements
Glossy dome buttons, chunky lever, biometric pad, thick wires and pliers informed the vector puzzle kit. The comic round-button crops now also drive the difficulty LEDs.

### Frames, panels, timer, LEDs
The module frame is used as a **thin metal rim** on puzzle cards; the green LCD cut provides the timer bezel with a clean dark screen and live Orbitron digits.

### Bomb icons, sabotage, explosions
Bomb silhouette, comic bursts, smoke/frost/hazard language informed both the vector FX and the Defeat screenshot composition.

### Comic pack
The four-panel halftone sheet is baked into two dark 1920×1080 pages so the UI stays readable while keeping the Ben-Day dots and diagonal panel gutters. The speech-bubble sheet is a real transparent PNG and is used in the help modal.

### Characters & logo
The four character sheets provide clean expression headshots; circular crops remove the cell borders and white background. The logo is cut from its white sheet with a flood-fill pass that preserves the enclosed cream letters.

---

## Regeneration

```powershell
# slice supplied UI sheets, cut the logo, rebuild comic UI PNGs
powershell -ExecutionPolicy Bypass -File tools/extract-ui-assets.ps1

# bake the comic halftone pages
powershell -ExecutionPolicy Bypass -File tools/make-comic-bg.ps1
```

Avatars are produced by the crop/mask pass documented in `docs/ASSET_SPEC.md`.

Rights to the supplied sheets remain with the client/provider. See the root [CREDITS.md](../../CREDITS.md).
