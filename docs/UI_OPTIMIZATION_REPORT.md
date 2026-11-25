# UI RECREATION, COMIC ART & PERFORMANCE PASS
## BOMB DEFUSAL: CHAOS EDITION — build 2.3.0

**Scope:** finish the **bright comic-arcade** UI pass, add typewriter audio and a trigger-heavy comic sound layer, keep the supplied logo/character/button/UI assets, and preserve the 2–4 player flow, admin panel and restart fixes. **No new dependencies.**

**Font set (2.3):** Luckiest Guy (display), Fredoka One (headings/buttons), Varela Round (body), Bungee (numeric). All local OFL; the old Bangers/Lilita/Nunito/Orbitron faces are retained only for archive/docs.

### 2.3 additions
- **Bright theme:** cream pop-art pages (`bg-bright-menu/page/game.png`), ink borders, warm cream panels, and ink/brown body text across menu, team, story, briefing, gameplay, victory, defeat and admin.
- **Main menu:** supplied button states, polished logo, REN hero card, party strip, leaderboard modal and sound toggle on a bright page; the control stack stays a dark ink slab for contrast.
- **Story typing sound:** low-gain square tick every six characters, random 1.5–2.4 kHz pitch, 18 ms envelope. Tapping to finish a line stops it cleanly.
- **Trigger comic stinger:** low thump + noise burst + two rising square hits. Fires on MULAI MISI, story open and story finish.
- **Bouncy comic score:** walking bass, off-beat brass stabs, pluck melody, kick/clap/hats and a rubber-hose “boing”; tempo escalates from 126 to 172 BPM with tension. Still procedural, no audio files.
- **Admin overlay:** cream paper, ink fields, yellow presets and green toggles; close by X, backdrop or Escape still works.
- **Mockups:** all 9 runtime captures recaptured at 1920×1080, plus a bright overview sheet (V2.3).

### 2.2 baseline retained
- Official polished **BOMB DEFUSAL** logo, pop-art comic pages and REN hero card.
- Supplied button sheet for MULAI MISI, CARA MAIN, PENGATURAN, LEADERBOARD, MULAI/LANJUT, LEMPAR BOM, LEWATI and ULANGI.
- Full **comic icon set** (cream fill + ink outline), still tintable.
- **Pre-mission Story** scene with alternating speakers, portrait swap, party chips, progress dots and skip.
- **Admin close fixed**: sticky 56px yellow X, backdrop click, Escape.
- **Leaderboard key v3** with REN/KAI/MIR/RIN seed names.
- Flow: Attract → Team → Story → Briefing → Game; restart from results skips Story.

---

## 1. Hasil singkat

| Area | Sebelum | Sesudah |
|---|---|---|
| Tema | Halaman gelap + panel navy | **Cream pop-art + ink slab**; teks ink/cokelat, aksen tetap terang |
| Background | SVG gelap custom | **`bg-bright-*` PNG 1920×1080** dari sheet yang diberikan |
| Story | Typewriter tanpa suara | **Typewriter + typing tick**, trigger stinger saat buka/tutup |
| Musik | Pulse/arp sederhana | **Comic score**: walking bass, brass stab, boing, tempo naik saat timer menipis |
| Tombol utama | Panel gelap permanen | **Supplied button states** + REN card; LEADERBOARD jadi modal |
| Operator panel | Overlay gelap | **Overlay cream** dengan field putih dan toggle hijau |
| Restart | Scene berikutnya bisa “diam” karena `__leaving` | **Reset `__leaving` + input**; diuji Victory/Defeat → Briefing → Game |
| Timer | Update tiap frame | **Hanya saat digit detik berubah** |
| AudioContext | Dibuat sebelum gesture | **Baru dibuat setelah gesture pertama** |
| Console | Warning audio/tekstur lama | **0 error / 0 warning** pada seluruh preview final |

---

## 2. Design system

### 2.1 Font (2.3 set)
- **Luckiest Guy** — screen headlines, BOOM/POW moments, score hero.
- **Fredoka One** — card titles, section labels, CTA labels, HUD headings.
- **Varela Round** — body, instructions, status.
- **Bungee** — timer, score, numeric labels.
- All local `.woff2`; no network. Old OFL faces retained for archive/docs only.

### 2.2 Palet terang
- Page cream `#FFF4DF`, card `#FFF9ED`, warm highlight `#FFE9A8`.
- Ink `#1B1406` for titles and primary text; body brown `#6B5A43`; dim `#8B785C`.
- Accent: yellow `#FFC93C`, blue `#4C9BFF`, red `#F2555F`, green `#45D6A0`, pink `#FF4F9A`, lime `#C6F53C`, orange `#FF9A2A`.
- Warna karakter: REN orange, KAI blue, MIRA pink, RIN lime.
- Panel gelap hanya untuk kontrol menu dan pass-bomb; sisanya cream agar layar terasa cerah.

### 2.3 Prinsip layout
- Satu fokus utama per layar (logo, kartu tim, kartu modul, atau hasil).
- Label minimum 9–10px, teks utama 11–16px, judul 20–74px.
- Panel rounded rectangle tipis; metal/grunge hanya aksen (frame modul, timer, penalty card).
- Microcopy di atas halaman ramai diberi cream stroke tipis agar tetap terbaca di 1080p.
- Informasi sekunder diturunkan kontrasnya, bukan dihapus.

---

## 3. Aset yang diintegrasikan

| Aset sumber | Pemakaian runtime |
|---|---|
| **Logo BOMB DEFUSAL** (putih → transparan) | Attract hero, boot screen, brand utama |
| **4 character sheets** (REN/KAI/MIRA/RIN) | Avatar bulat → tag pemain, kartu tim, briefing, story, leaderboard/rapor |
| **Frame modul / panel metal** | Rim tipis pada kartu puzzle, frame penalty |
| **Timer LCD hijau** | HUD timer dengan layar gelap |
| **Tombol play / button sheet** | MULAI MISI, CARA MAIN, PENGATURAN, LEADERBOARD, LANJUT, LEMPAR BOM, LEWATI, ULANGI |
| **Frame penalty merah** | Kartu hukuman Defeat |
| **Banner / trophy / hazard** | Strip hazard, ikon trophy, aksen hasil |
| **Halftone 4-panel comic sheet** | **Tiga halaman terang**: `bg-bright-menu.png`, `bg-bright-page.png`, `bg-bright-game.png` |
| **Speech bubble PNG** | Header modal “Cara Bermain” |
| **LED/round arcade buttons** | Difficulty chips, strike row, status LED |

Aset sumber tetap disimpan di `assets/` dan `docs/references/`; hasil potongan transparan ada di `assets/ui/comic/`, `assets/brand/`, dan `assets/characters/`.

---

## 4. Perubahan per layar

### Boot
- Logo resmi + progress bar biru→hijau→kuning di atas cream page.
- Boot title memakai ink slab agar terbaca dari jauh; tidak ada layout shift saat Attract muncul.

### Attract / Main Menu
- Logo resmi sebagai hero; REN portrait card di kanan dengan label “THE LEADER”.
- Tiga tombol sekunder memakai state sheet: Cara Main, Pengaturan, Leaderboard.
- Leaderboard sekarang modal; party strip KAI/MIRA/RIN di bawah kartu REN.
- Modal menu memakai scrim cream hangat + kartu ber-border ink; bukan overlay hitam.
- Latar pop-art terang; kontrol menu tetap slab ink agar CTA menonjol.
- Header acara (nama + sub-judul) berada di cream pill, bukan teks liar di background.

### Team Selection
- Tiga kartu cream 2/3/4 pemain dengan avatar cast.
- Difficulty chip cream; chip terpilih kuning penuh dengan ikon LED.
- Check badge hanya pada kartu terpilih.
- Satu CTA “MULAI / LANJUT” dengan subteks dinamis (pemain • mode • detik).

### Pre-Mission Story
- Dialog bergantian mengikuti party 2–4; portrait dan chip aktif berganti.
- Typewriter 22 ms + tick audio tiap 6 karakter; tap pertama menyelesaikan baris, tap berikutnya lanjut.
- Progress dots, nomor baris, dan tombol LEWATI.
- Trigger stinger saat story dibuka dan saat menyerahkan ke briefing.

### Mission Briefing
- Bomb case tetap fokus kiri; countdown ring transparan.
- Panel kanan cream: objektif, tiga baris modul, roster cast, warning sabotage.
- Hazard strip hanya di dasar layar.

### Gameplay
- HUD cream 140px: round chip, 4 player tag, timer LCD, score + lives.
- Timer update 1× per detik.
- Kartu modul cream dengan rim metal tipis; judul ink, body cokelat.
- Puzzle UI (wire, cipher, reverse, acoustic, meta, dual-hand) diselaraskan ke teks gelap; status penting tetap berwarna.
- Cipher ribbon tepat di bawah HUD; sembunyi saat sabotage lalu kembali.
- Bottom rail: progress + LEMPAR BOM; pass-bomb panel tetap ink.

### Victory
- Judul “BOM DJINAKKAN!”, rapor cream, skor besar, MVP.
- Leaderboard flat; entry inisial top-5 tetap muncul saat layak.
- Satu CTA ULANGI + LAYAR UTAMA, auto-return di footer.

### Defeat
- Ledakan + “BOOM!” + alasan gagal dengan teks merah gelap.
- Black-box stats cream; penalty card memakai frame merah dan kertas cream.
- Kartu hukuman aman untuk acara publik; tombol home/replay di dalam kartu.

### Admin
- Overlay cream, field putih, preset kuning, toggle hijau.
- Catatan brand mengarah ke `assets/brand/bomb-defusal-logo.png`.
- Tutup lewat X sticky, tap backdrop, atau Escape; scroll panel tidak menyembunyikan X.

---

## 5. Audio komik (2.3)

Semua suara dibuat dengan Web Audio API di `src/core/audio.js`; tidak ada file audio eksternal.

| Layer | Detail |
|---|---|
| **Music** | `scheduleStep()` 16 langkah: walking bass tiap 2 langkah, brass stab off-beat, pluck melody, kick/clap/hat, “boing” di akhir bar. BPM `[126, 148, 172]` mengikuti level tegangan. |
| **Typewriter** | `sfx('type')`: square 1.5–2.4 kHz acak, gain 0.016, durasi 18 ms, filter 5 kHz. Dipanggil tiap 6 karakter; tidak terkena throttle 25 ms. |
| **Trigger** | `sfx('trigger')`: triangle 190→95 Hz, noise burst, lalu dua square 440/660 Hz. Dipakai di MULAI MISI, story open, story finish. |
| **UI** | click, tick, countdown, countdown-go, solve, strike, explosion, pass; semua lewat master gain dan toggle. |
| **Toggles** | `settings.sound` mematikan SFX; `settings.music` mematikan score. Tidak ada audio yang dibuat sebelum gesture pertama. |

---

## 6. Perbaikan bug restart

**Gejala:** setelah menang/kalah, menekan “Main Lagi” masuk Briefing tetapi tidak melanjutkan ke Game.

**Akar masalah:** instance Scene Phaser dipakai ulang. Flag `__leaving` yang diset `true` oleh `goToScene()` bertahan saat scene yang sama dijalankan lagi. `launchGame()`/`replay()` lalu langsung `return`.

**Perbaikan:**
- Reset `this.__leaving = false` di `init()` semua scene (Attract, TeamSelect, Story, Briefing, Game, Victory, Defeat).
- Re-enable `this.input.enabled = true` saat create.
- `goToScene()` mematikan input selama fade agar tidak ada tap ganda.
- Cleanup scene menghapus timer/tween/listener.

**Bukti uji final (Playwright, klik nyata pada canvas):**
- Attract → Team → Story → Briefing → Game.
- Victory → Main Lagi → Briefing → Game (timer berjalan).
- Defeat → Main Lagi → Briefing → Game (timer berjalan).
- 4 pemain / Chaos: 4 tag, timer 29 detik, tanpa error.

---

## 7. Optimasi runtime

1. **Culling tekstur:** keluarga `btn-*`, `panel-*`, `keypad-*`, `timer-plate`, `leader-row`, `progress-*`, `strike-*`, `hazard-strip` dan aset lama lain tidak dimuat. Hanya ±100 aset yang dipakai.
2. **Background PNG:** halaman pop-art 1920×1080 dimuat sebagai PNG, bukan SVG full-screen.
3. **Timer throttle:** update teks hanya saat detik tampil berubah.
4. **Audio gesture:** `AudioContext` baru dibuat setelah interaksi; warning autoplay hilang.
5. **Audio ringan:** osilator/noise dibuat per cue dan berhenti sendiri; tidak ada buffer audio besar.
6. **Comic UI:** potongan PNG yang dipakai saja (bukan seluruh hasil ekstraksi).
7. **Idle warning:** tween dibersihkan; tidak ada error setelah overlay ditutup.
8. **Frame cap / particle cap** tetap aktif dari pass sebelumnya.

---

## 8. Verifikasi

- Resolusi: 1920×1080, FIT scaling; viewport Playwright 1920×1080.
- Seluruh preview (`menu`, `team`, `story`, `briefing`, `gameplay`, `sabotage`, `victory`, `defeat`, `admin`): **0 console error / 0 warning**.
- Alur klik nyata: menu → team → story (tap/skip) → briefing → game → victory/defeat → replay → game.
- Empat pemain: REN/KAI/MIRA/RIN, 4 tag, timer 29s, 9 baris story, layout tidak overlap.
- Mockup final: `docs/mockups/00-overview.png` + `01`–`09`, build 2.3.0.
- `?assets=svg` tetap berfungsi sebagai fallback.

---

## 9. Batas yang belum diuji

- Kualitas audio melalui speaker PID fisik.
- Input palm/IR asli di panel 10-point (baru diuji pointer Playwright).
- Ketajaman native 4K (background 1× di-upscale; gunakan @2×/SVG untuk 4K native).
- Endurance 50 ronde di perangkat PID.
- Mikrofon asli (modul Acoustic masih simulasi tap).
- Animasi/implementasi Unity 6 tidak ada di repo Phaser ini.
