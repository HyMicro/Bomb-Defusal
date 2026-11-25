# CREDITS & LICENCES

## Project
**BOMB DEFUSAL: CHAOS EDITION**
Concepts, game rules, UI/UX, Phaser implementation, art direction, vector asset pack and documentation produced for this project. Official logo, cast art and UI sheet elements supplied by the client.

Design/engineering roles embodied in this build:
- Senior Web Game Developer
- UI/UX Game Designer
- Technical Artist

## Engine
**Phaser 3.90.0**
- © Phaser Studio Inc. / Richard Davey
- MIT License
- Vendored at `vendor/phaser.min.js`
- Licence: `vendor/PHASER-LICENSE.txt`

## Fonts
All fonts are bundled locally so the PID works offline.

| Font | Copyright / source | Licence |
|---|---|---|
| **Bangers** | Google Fonts / Vernon Adams | SIL Open Font License 1.1 — `assets/fonts/licenses/OFL-Bangers.txt` |
| **Lilita One** | Google Fonts / Juan Pablo del Peral | SIL OFL 1.1 — `assets/fonts/licenses/OFL-LilitaOne.txt` |
| **Nunito** | Google Fonts / Vernon Adams, Cyreal | SIL OFL 1.1 — `assets/fonts/licenses/OFL-Nunito.txt` |
| **Orbitron** | Google Fonts / Matt McInerney | SIL OFL 1.1 — `assets/fonts/licenses/OFL-Orbitron.txt` |

The current runtime font set is Luckiest Guy, Fredoka One, Varela Round and Bungee; Bangers/Lilita One/Nunito/Orbitron remain as archive/docs fallbacks. All are SIL OFL 1.1 and the OFL permits embedding/redistribution with the licence text retained.

## Art & UI asset pack
- `assets/**/*.svg` — original vector assets authored for this project (175 source files).
- `assets/brand/bomb-defusal-logo.png` — official supplied logo, white background removed for runtime.
- `assets/characters/avatar-ren|kai|mira|rin.png` — 130×130 circular crops from the supplied character sheets.
- `assets/backgrounds/bg-comic*.png` — comic halftone page backgrounds baked from the supplied four-panel artwork.
- `assets/ui/comic/*.png` — transparent UI cuts (module frame, LCD timer, play button, penalty frame, trophy, hazard, speech bubble, arcade buttons).
- `assets/exports/**` — generated @1× PNG mirror of the SVG pack.
- `assets/asset-manifest.json`, `docs/asset-catalog.html` — generated metadata/QA sheets.

## Provided art-direction & runtime references
The client supplied UI sheets, character sheets and a logo. Files remain in `assets/` and `docs/references/` for provenance:

- *Frame Modul, Panel Metal, Timer & Indikator Status.jpg*
- *Tombol Aksi Utama, Banner Peringatan & Bingkai Kartu Hukuman.jpg*
- *Ikon Bom, Efek Sabotase & Ledakan.jpg*
- *Elemen Interaktif (Tombol Arcade, Kabel, Slider & Fingerprint).jpg*
- *Simbol Crowd Cipher, Keypad Angka & Ikon Sistem.jpg*
- *REN / KAI / MIRA / RIN character sheets*
- *BOMB DEFUSAL Timer Logo.png*
- *1443969_11427.jpg* (halftone comic panels), *blank-comic-speech-bubbles...png*, *32972002_7994582.jpg* (speed lines), *3797319_9837.jpg* (word bursts)

The logo, character avatars and selected UI cuts are **runtime sprites**; the remaining sheets are reference material. Rights remain with the client/provider.

## Runtime audio
All audio is synthesized in-browser via the Web Audio API. No third-party samples or music tracks are used.

## Libraries / services not used
- No analytics, ad SDKs, backend, CDN, or tracking.
- No external image or audio hosts at runtime.
- Node is used only as a local static server (`serve.mjs`); no npm dependencies.

## Attribution note for event use
If the game is presented publicly, a small credit such as “Game by [studio]” can be added to the Attract screen footer or the printed booth signage. No credit is required by the licences beyond retaining the font/engine licence files.
