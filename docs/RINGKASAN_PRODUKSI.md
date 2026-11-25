# RINGKASAN PRODUKSI
## BOMB DEFUSAL: CHAOS EDITION
### Game arcade ice-breaking multipemain untuk layar PID sentuh

**Status:** build playable + asset pack lengkap + dokumentasi produksi. Dibuat dengan HTML5, CSS3, JavaScript (ES modules), Phaser 3.90; target logical 1920×1080 (16:9), FIT scaling ke PID 4K, 2–4 pemain co-op, multi-touch 10 titik.

---

## 1. Yang sudah jadi

- **Alur lengkap:** Attract → pilih pemain/kesulitan → briefing 3-2-1 → ronde defusal → victory/defeat → kartu hukuman/leaderboard → kembali ke Attract.
- **6 keluarga puzzle modular** dengan varian:
  1. Dual-Hand Anchor (tahan sensor + geser tuas / dua sensor 2,5 detik)
  2. Meta UI Trap (kata BOM pada judul / digit timer / drag blok GESER)
  3. Reverse Psychology (jangan tekan 4 detik / pengecualian tombol biru)
  4. Logic Wire Cutter (5 kabel, 16 aturan logika, swipe potong)
  5. Crowd Cipher (kamus simbol→angka di zona penonton + keypad)
  6. Acoustic Sensor (tap storm / hening 3 detik; simulasi touch, bukan mikrofon)
- **4 sabotase fisik:** Smoke Screen (gosok dengan telapak tangan), Cryo Freeze (6 ketukan), Gravity Flip (modul berputar 180° selama 7 detik), Fake Glitch (geser pop-up ke atas).
- **LEMPAR BOM!** sekali per ronde: freeze timer 5 detik, target sosial, +5 detik jika diterima, boom jika tidak.
- **Timer/ronde:** Santai 2 modul 48s; Standar 3 modul 40s; Chaos 3 modul 32s (offset 2P +4s / 4P −3s). Setiap modul aman +3 detik. 3 strike atau waktu habis = meledak.
- **Skor:** `800 × multiplier` per modul ke pemilik; sabotase `250 × multiplier`; mistake −120 + penalti waktu; bonus waktu, perfect, dan sabotase saat menang. Papan skor harian Top-5 berdasarkan sisa waktu.
- **Kartu hukuman:** 9 tantangan ringan, aman untuk acara publik, dapat dimatikan.
- **Operator panel:** hotspot 5 ketukan di kiri-atas (2 detik) atau tombol PENGATURAN → PIN `0000`. Preset, toggle, branding acara, export CSV, reset skor.
- **Audio prosedural adaptif:** 110 → 135 → 165 BPM, detak jantung <10 detik, SFX sintetis, mute terpisah; tanpa file audio eksternal.
- **Input:** 10 pointer aktif, cooldown tombol, filter ghost touch radius >92px (kecuali smoke), ripple per pemain, dua tangan teruji lewat simulasi CDP multi-touch.
- **Brand & cast resmi:** logo BOMB DEFUSAL transparan + REN (leader), KAI (strategist), MIRA (energizer), RIN (wild card), masing-masing dengan avatar bulat dan warna sendiri.
- **UI comic-arcade:** background halftone dari sheet klien, frame modul, LCD timer, tombol play, frame penalty, dan bubble bantuan.

### Optimasi yang ditambahkan

| Optimasi | Dampak |
|---|---|
| Runtime hanya memuat tekstur yang dipakai (±100 aset) | Cold boot **~3,4–3,7s** pada fresh context (sebelumnya ~5,3s PNG mirror, ~10,1–10,8s SVG) |
| Background comic dibakar jadi PNG 1920×1080 | Tidak ada rasterisasi SVG full-screen saat boot |
| SVG tetap jadi source; fallback `?assets=svg` | Editing/4K tetap bisa, tanpa mengorbankan waktu boot |
| Timer HUD hanya update **1× per detik**, bukan per frame | Mengurangi regenerasi texture Phaser Text terus-menerus |
| AudioContext baru dibuat setelah gesture pertama | Menghilangkan warning audio sebelum interaksi; tidak ada audio idle |
| Touch/particle/effect cap + pembersihan tween idle | Frame lebih stabil dan tidak ada error setelah overlay ditutup |
| Perbaikan restart `__leaving` di semua scene | Main Lagi dari Victory/Defeat benar-benar memulai ronde baru |
| Aset & font lokal, tanpa request jaringan | Offline aman untuk event |

---

## 2. Asset pack

| Kategori | Jumlah | Format |
|---|---:|---|
| SVG source total | **175** | SVG transparan |
| Buttons (legacy; tidak semua dimuat) | 43 | SVG + PNG mirror |
| Panels / frames / HUD legacy | 29 | SVG (arsip) |
| Ikon tintable | 51 | SVG 96×96 |
| Puzzle objects | 22 | SVG |
| Backgrounds | 3 SVG source + **2 comic PNG** | 1920×1080 |
| Characters | **4 avatar PNG baru** + source sheets | PNG 130×130 |
| Logo resmi | **1 PNG transparan** | PNG |
| Comic UI cuts | **18** | PNG transparan |
| Bomb props / FX | 3 + 14 | SVG |
| PNG exports @1× | **180** | PNG |
| Font lokal | 4 keluarga | WOFF2 (OFL) |

Detail lengkap: [`ASSET_SPEC.md`](ASSET_SPEC.md), katalog visual: [`asset-catalog.html`](asset-catalog.html), manifest: [`../assets/asset-manifest.json`](../assets/asset-manifest.json), PNG: [`../assets/exports`](../assets/exports/README.md).

Art direction: **Comic Arcade** — ink `#070C16`, panel `#121C2C`, kuning `#FFC93C`, biru `#4C9BFF`, merah `#F2555F`, hijau `#45D6A0`, pink `#FF4F9A`, lime `#C6F53C`, orange `#FF9A2A`. Font: Luckiest Guy (display), Fredoka One (heading), Varela Round (body), Bungee (timer). Halftone comic page, outline tebal, metal frame dipakai tipis sebagai aksen.

Aset referensi klien disimpan di [`references/`](references/README.md) dan `assets/`. Logo, avatar cast, frame modul, LCD timer, tombol play, frame penalty, dan halaman comic adalah **sprite runtime**; sheet lain tetap referensi.

---

## 3. UI mockup

Semua adalah tangkapan runtime 1920×1080, bukan comps ilustrasi:

| Layar | File |
|---|---|
| Contact sheet | [`mockups/00-overview.png`](mockups/00-overview.png) |
| Main Menu | [`mockups/01-main-menu.png`](mockups/01-main-menu.png) |
| Team Selection | [`mockups/02-team-selection.png`](mockups/02-team-selection.png) |
| Mission Briefing | [`mockups/03-mission-briefing.png`](mockups/03-mission-briefing.png) |
| Gameplay | [`mockups/04-gameplay.png`](mockups/04-gameplay.png) |
| Sabotage | [`mockups/05-sabotage.png`](mockups/05-sabotage.png) |
| Victory | [`mockups/06-victory.png`](mockups/06-victory.png) |
| Defeat + penalty card | [`mockups/07-defeat.png`](mockups/07-defeat.png) |
| Bonus operator panel | [`mockups/08-operator-panel.png`](mockups/08-operator-panel.png) |

---

## 4. Struktur teknis

```
index.html + styles.css + serve.mjs
src/
  main.js · config.js
  core/      session, input, audio, storage
  managers/  RoundManager, SabotageManager
  puzzles/   PuzzleBase + 6 modul + factory
  scenes/    Boot, Attract, TeamSelect, Briefing, Game, Victory, Defeat
  ui/        factory (tombol/HUD/FX), admin (DOM)
assets/      SVG, PNG masters, PNG exports, font, manifest, katalog
docs/        GDD, arsitektur, asset spec, production plan, PRD map, QA, mockups
tools/       generator SVG, PNG manifest, render logo/avatar
scripts/     start-kiosk.ps1
```

Arsitektur rinci: [`SCENE_ARCHITECTURE.md`](SCENE_ARCHITECTURE.md).
GDD & aturan: [`GDD.md`](GDD.md).
Peta kesesuaian PRD: [`PRD_IMPLEMENTATION_MAP.md`](PRD_IMPLEMENTATION_MAP.md).
Tahapan implementasi, deployment PID & QA: [`PRODUCTION_PLAN.md`](PRODUCTION_PLAN.md), [`QA_CHECKLIST.md`](QA_CHECKLIST.md).

---

## 5. Cara menjalankan

```powershell
node serve.mjs 8123
# buka http://localhost:8123
```

Windows kiosk:
```powershell
npm run kiosk
# atau
powershell -ExecutionPolicy Bypass -File .\scripts\start-kiosk.ps1
```

Semua aset, font, dan Phaser ada lokal. Tanpa internet. Admin PIN default `0000` (dapat diubah di `localStorage` `bc.settings.v2`).

Perbaikan UI/typography dan detail optimasi terbaru: [`UI_OPTIMIZATION_REPORT.md`](UI_OPTIMIZATION_REPORT.md). Ringkasnya: runtime memakai PNG mirror (~5,3s boot vs ~10,1–10,8s SVG), timer HUD di-throttle, tipografi/alignment dirapikan, cipher ribbon diposisikan ulang, dan akses `?assets=svg` tetap tersedia.

---

## 6. Batasan / roadmap (jujur)

- Native 4K belum dirender; logical 1920×1080 di-upscale ke 4K. Sumber SVG siap dirender @2×.
- Sensor mikrofon hanya disimulasikan dengan ketukan/silence; toggle admin disiapkan untuk mikrofon asli.
- Tombol ulang ronde long-press belum ada di rail publik; recovery lewat admin/reload.
- Attract belum auto-reset; layar hasil auto-return 30 detik (bisa diatur).
- Papan skor lokal per perangkat; tidak ada backend/venue-wide board.
- Skor awal memakai 5 entri contoh; reset lewat operator sebelum acara.
- Kartu hukuman, jumlah modul, dan timer sudah bisa dikonfigurasi, tetapi batas 3 strike tetap.
- Penuh untuk event **tersupervisi** pada 1080p; jalankan QA PID nyata 50 ronde sebelum instalasi tanpa operator.

Lihat [`PRD_IMPLEMENTATION_MAP.md`](PRD_IMPLEMENTATION_MAP.md) untuk daftar deviasi dan alasan desainnya.
