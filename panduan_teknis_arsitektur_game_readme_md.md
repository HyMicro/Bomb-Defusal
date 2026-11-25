# 💣 BOMB DEFUSAL: CHAOS EDITION (PID Interactive Edition)

Game *arcade ice-breaking* interaktif berbasis layar sentuh besar (**Interactive Flat Panel / PID 65"–86"**) dengan gaya visual **Pop-Art Comic / Action Brawl**. Dirancang untuk memadukan teka-teki meta anti-mainstream, sabotase layar aktif (*multi-touch*), dan interaksi langsung antara pemain di depan layar dengan penonton di ruangan.

---

## 📋 Daftar Isi
1. [Spesifikasi Sistem & Target Perangkat](#1-spesifikasi-sistem--target-perangkat)
2. [Instalasi & Setup Proyek](#2-instalasi--setup-proyek)
3. [Struktur Folder & Penamaan Assets](#3-struktur-folder--penamaan-assets)
4. [Standar Gaya Visual & Tipografi (Comic Style Guide)](#4-standar-gaya-visual--tipografi-comic-style-guide)
5. [Arsitektur Alur Permainan (State Machine)](#5-arsitektur-alur-permainan-state-machine)
6. [Aturan UI/UX & Multi-Touch PID (Anti-Bug & Anti-Misclick)](#6-aturan-uiux--multi-touch-pid-anti-bug--anti-misclick)
7. [Modul Teka-Teki & Mekanik Sabotase](#7-modul-teka-teki--mekanik-sabotase)
8. [Panel Admin Tersembunyi (Operator Mode)](#8-panel-admin-tersembunyi-operator-mode)

---

## 1. Spesifikasi Sistem & Target Perangkat

* **Perangkat Utama:** Interactive Flat Panel (PID) ukuran 65" – 86" (Landscape 16:9).
* **Resolusi Target:** `3840 x 2160` (4K UHD) atau `1920 x 1080` (Full HD) dengan *Canvas Scaler* (`Scale With Screen Size`, Match `0.5`).
* **Input Sensor:** Infrared (IR) atau Capacitive Multi-Touch (Minimal mendukung **10 titik sentuh simultan**).
* **Target Frame Rate:** Terkunci stabil di **60 FPS** (`Application.targetFrameRate = 60`).
* **Audio:** Speaker stereo eksternal/internal PID dengan dukungan *bass* yang jelas.

---

## 2. Instalasi & Setup Proyek

### Opsi A: Menggunakan Unity Engine (Rekomendasi Utama untuk PID 60 FPS)
1. **Versi Engine:** Gunakan **Unity 2022.3 LTS** atau **Unity 6 LTS** (2D URP Template).
2. **Package Wajib (Install via Package Manager):**
   * `2D Sprite` & `2D PSD Importer` (untuk *slicing* otomatis sprite sheet).
   * `TextMeshPro` (wajib untuk *rendering* teks miring & *outline* tajam di resolusi 4K).
   * `Input System` (New Input System — wajib diaktifkan untuk menangani *EnhancedTouch* multi-jari tanpa konflik).
   * `DOTween (HOTween v2)` *(Opsional/Sangat Disarankan)* untuk animasi *pop-up* komik, *screen shake*, dan rotasi *Gravity Flip* yang mulus.
3. **Konfigurasi Input PID:**
   * Masuk ke `Edit > Project Settings > Player > Other Settings > Active Input Handling`, pilih **Both** atau **Input System Package (New)**.
   * Nonaktifkan simulasi *mouse-from-touch* (`Input.simulateMouseWithTouches = false`) agar sentuhan 2 tangan bersamaan pada modul *Dual-Hand Anchor* tidak saling menimpa.

### Opsi B: Menggunakan Web / Electron (HTML5 + Canvas / React + Vite)
1. **Inisialisasi:**
   ```bash
   npm create vite@latest bomb-defusal-pid -- --template react-ts
   cd bomb-defusal-pid
   npm install framer-motion lucide-react use-sound
   ```
2. **CSS Global Wajib (Mencegah Zoom/Scroll Bawaan Browser PID):**
   ```css
   html, body, #root {
     width: 100vw;
     height: 100vh;
     overflow: hidden;
     touch-action: none; /* Matikan pinch-zoom & swipe back browser */
     user-select: none;  /* Matikan seleksi teks saat layar diusap */
     -webkit-user-select: none;
   }
   ```

---

## 3. Struktur Folder & Penamaan Assets

Pastikan seluruh aset gambar yang sudah di-*slice* (dipotong transparan `.png`) disimpan dengan struktur direktori yang konsisten agar mudah dipanggil secara dinamis oleh sistem:

```text
assets/
├── fonts/                          # File font .ttf / .otf
│   ├── BlackOpsOne-Regular.ttf     # Judul & Tombol Besar
│   ├── Orbitron-ExtraBold.ttf      # Timer Digital
│   └── ChakraPetch-Bold.ttf        # Instruksi Teka-Teki & Kartu Hukuman
│
├── sprites/
│   ├── characters/                 # 4 Karakter Tim Penjinak Bom (Full & Avatar)
│   │   ├── char_captain_full.png
│   │   ├── char_captain_avatar.png
│   │   ├── char_analyst_full.png
│   │   ├── char_analyst_avatar.png
│   │   ├── char_chill_full.png
│   │   ├── char_chill_avatar.png
│   │   ├── char_rookie_full.png
│   │   └── char_rookie_avatar.png
│   │
│   ├── ui_panels/                  # Bingkai miring & kontainer komik (9-Slice Ready)
│   │   ├── title_logo_main.png
│   │   ├── panel_module_red.png
│   │   ├── panel_module_cyan.png
│   │   ├── panel_module_yellow.png
│   │   ├── panel_card_magenta.png
│   │   ├── panel_timer_box.png
│   │   ├── banner_pass_bomb.png
│   │   └── bg_halftone_pattern.png
│   │
│   ├── ui_buttons/                 # Tombol & Keypad (Sertakan state normal/pressed)
│   │   ├── btn_play_red.png
│   │   ├── btn_start_cyan.png
│   │   ├── btn_ready_cyan.png
│   │   ├── btn_pass_bomb_round.png
│   │   └── keypad_0.png ... keypad_9.png
│   │
│   ├── modules/                    # Komponen interaktif di dalam modul
│   │   ├── fingerprint_idle.png
│   │   ├── fingerprint_active.png
│   │   ├── slider_track.png
│   │   ├── slider_handle.png
│   │   ├── wire_red_intact.png & wire_red_cut.png
│   │   ├── wire_blue_intact.png & wire_blue_cut.png
│   │   ├── wire_yellow_intact.png & wire_yellow_cut.png
│   │   ├── wire_green_intact.png & wire_green_cut.png
│   │   └── tool_pliers.png
│   │
│   ├── icons_cipher/               # Ikon belah ketupat untuk Crowd Cipher & Status
│   │   ├── cipher_bolt.png
│   │   ├── cipher_skull.png
│   │   ├── cipher_star.png
│   │   ├── cipher_gear.png
│   │   ├── cipher_lock.png
│   │   ├── cipher_target.png
│   │   ├── status_strike_off.png & status_strike_on.png
│   │   └── gesture_tap.png / gesture_hold.png / gesture_swipe.png / gesture_wipe.png
│   │
│   └── vfx/                        # Efek ledakan & gangguan layar
│       ├── bomb_main.png
│       ├── vfx_explosion_01.png & vfx_explosion_02.png
│       ├── vfx_ice_cube.png & vfx_ice_cracked.png
│       ├── vfx_smoke_dark.png & vfx_smoke_light.png
│       └── vfx_glass_shatter.png
│
└── audio/
    ├── bgm/
    │   ├── bgm_lobby_loop.ogg
    │   └── bgm_gameplay_tense.ogg
    └── sfx/
        ├── sfx_tick.wav
        ├── sfx_button_pop.wav
        ├── sfx_wire_cut.wav
        ├── sfx_ice_crack.wav
        ├── sfx_smoke_hiss.wav
        ├── sfx_pass_bomb_siren.wav
        ├── sfx_defused_win.wav
        └── sfx_explosion_bass.wav
```

---

## 4. Standar Gaya Visual & Tipografi (Comic Style Guide)

Untuk menjaga konsistensi estetika *Pop-Art Comic / Action Brawl* dan mencegah tampilan UI terlihat "belang" atau miring tidak sejajar:

### A. Palet Warna Resmi
| Peran UI | Kode HEX | Penggunaan |
| :--- | :--- | :--- |
| **Dark Slate BG** | `#1E2128` | Latar belakang utama *gameplay* agar elemen neon/komik kontras. |
| **Electric Cyan** | `#00D8E8` | *Background* Main Menu, tombol sekunder, & bingkai modul 1. |
| **Hazard Yellow** | `#FFD600` | *Banner* peringatan, tombol *Pass Bomb*, & *highlight* instruksi. |
| **Crimson Comic** | `#FF2A3C` | Tombol *PLAY*, *Timer* darurat, *Strike X*, & modul 2. |
| **Neon Magenta** | `#E024A8` | Aksesoris kartu hukuman & variasi simbol *Cipher*. |
| **Comic Ink Black** | `#0D0E12` | Wajib untuk *outline* (`4px–6px`) dan *hard drop shadow* (`X: +8px, Y: -8px`). |

### B. Aturan Kemiringan (*Skew Angle Standard*)
* Semua bingkai panel miring (*skewed frames*) menggunakan sudut kemiringan standar **`-6°` (atau `+6°` untuk variasi)**.
* **Aturan Emas Teks:** Teks instruksi soal di dalam modul **TIDAK BOLEH ikut dimiringkan** lebih dari `-3°` agar tetap mudah dibaca dalam hitungan detik oleh pemain yang panik. Hanya judul tombol besar (`PLAY`, `START`, `PASS BOMB`) yang mengikuti sudut kemiringan bingkainya.

### C. Hierarki Font
1. **Timer Utama:** `Orbitron ExtraBold` — Ukuran `160px` (4K) / `80px` (FHD). Wajib aktifkan **Tabular Figures / Monospace** agar lebar angka tidak bergetar saat milidetik berjalan.
2. **Judul & Tombol:** `Black Ops One` — Ukuran `64px–110px`, *All-Caps*, *Outline* hitam tebal + *Drop Shadow*.
3. **Instruksi Teka-Teki:** `Chakra Petch Bold` — Ukuran `42px–52px`, maksimal 2–3 baris, warna putih terang `#FFFFFF` dengan kata kunci jebakan berwarna `#FFD600` atau `#FF2A3C`.

---

## 5. Arsitektur Alur Permainan (State Machine)

Gunakan pola **Finite State Machine (FSM)** tunggal (`GameManager`) agar transisi antar-layar tidak pernah tumpang tindih (*overlap*) atau macet saat layar disentuh banyak orang sekaligus.

```text
[1. ATTRACT_MENU] ──(Tap PLAY)──► [2. PRE_ROUND_COUNTDOWN (3s)]
       ▲                                       │
       │                                (Timer == 0)
       │                                       ▼
(Auto-Reset 20s / Tap Done)          [3. ACTIVE_GAMEPLAY] ◄───┐
       │                                  │          │        │
       │                        (All Solved)   (Timer/3xFail) (Pass Bomb)
       │                            │                │        │
       │                            ▼                ▼        │
       ├────────────────── [4A. VICTORY_SCREEN]  [4B. EXPLOSION_VFX (2.5s)]
       │                                             │
       └────────────────── [5. PENALTY_CARD] ◄───────┘
```

### Guardrails Stabilitas State
* **Input Lock During Transition:** Saat berpindah dari `ACTIVE_GAMEPLAY` ke `VICTORY_SCREEN` atau `EXPLOSION_VFX`, **matikan seluruh collider/listener modul** pada frame yang sama agar sentuhan sisa tidak memicu dua *state* akhir secara bersamaan.
* **Idle Watchdog Timer:** Jika di `ACTIVE_GAMEPLAY` tidak ada sentuhan selama **15 detik** (pemain pergi meninggalkan PID), sistem memunculkan peringatan 5 detik sebelum otomatis kembali ke `ATTRACT_MENU`.

---

## 6. Aturan UI/UX & Multi-Touch PID (Anti-Bug & Anti-Misclick)

Layar PID memiliki karakteristik fisik yang berbeda dari ponsel atau tablet:

1. **Ergonomi Zona Layar (16:9 Landscape):**
   * **Top Zone (0% – 18% Atas):** Khusus *Strike Indicators*, *Digital Timer*, dan *Kamus Sandi Penonton (Crowd Cipher)*. **Dilarang menaruh tombol interaktif di sini** karena tidak terjangkau oleh pemain bertubuh pendek/anak-anak.
   * **Middle Work Zone (18% – 82% Tengah):** Area 3 Modul Teka-Teki dengan jarak antar-modul minimal **`80px` (4K)** agar dua pemain yang berdiri berdampingan tidak saling menyenggol.
   * **Bottom Control Zone (82% – 100% Bawah):** Tombol **PASS BOMB** di pojok kanan bawah dan *dialog* karakter pemandu di pojok kiri bawah.
2. **Ukuran Hitbox Minimum:**
   * Setiap tombol atau objek sentuh wajib memiliki area interaksi minimal **`140 x 140 px`** (pada 4K) / **`70 x 70 px`** (pada FHD).
3. **Anti-Ghost Touch & Anti-Spam:**
   * **Palm/Sleeve Rejection:** Abaikan input sentuhan dengan radius kontak terlalu besar (`radius > 160px`), **kecuali** saat efek sabotase **Smoke Screen (usap asap)** sedang aktif.
   * **Input Debounce (`150ms`):** Terapkan jeda `0.15 detik` setelah tombol pilihan ditekan agar getaran jari di layar IR tidak terbaca sebagai *double tap* yang langsung menghabiskan 3 nyawa (*Strike*).

---

## 7. Modul Teka-Teki & Mekanik Sabotase

### A. Aturan Pengacakan Modul (*Deck Shuffler*)
* Setiap ronde memilih **3 modul berbeda** dari kolam (*pool*) yang tersedia.
* Jika modul **Crowd Cipher** terpilih di salah satu slot, sistem otomatis menyalakan papan **Kamus Sandi Penonton** di zona kanan atas layar.

### B. Sistem Sabotase Berbasis Persentase Waktu
Agar ritme permainan selalu dinamis, sabotase dipicu secara otomatis berdasarkan sisa waktu utama (`remainingTime / totalTime`):
* **Trigger 1 (Sisa Waktu 65%):** Memicu **Smoke Screen** (mengusap layar untuk menghilangkan asap) *atau* **Cryo Freeze** (mengetuk blok es 5x hingga pecah).
* **Trigger 2 (Sisa Waktu 30%):** Memicu **Gravity Flip** (kontainer modul berputar `180°` selama 6 detik) *atau* **Fake System Glitch** (menggeser *pop-up error* keluar layar).
* *Catatan:* Saat sabotase **Cryo Freeze** atau **Smoke Screen** aktif, interaksi modul di bawahnya dikunci sementara hingga pemain membersihkan rintangannya.

---

## 8. Panel Admin Tersembunyi (Operator Mode)

Untuk memudahkan panitia acara mengatur tingkat kesulitan di lokasi tanpa membuka kode:

* **Cara Membuka:** Ketuk pojok kiri atas layar (area indikator *Strike*) sebanyak **5 kali berturut-turut dalam 2 detik**, lalu masukkan PIN default `0000`.
* **Pengaturan yang Tersedia:**
  * **Durasi Ronde:** `25 Detik (Chaos)` / `35 Detik (Standar)` / `45 Detik (Santai)`.
  * **Toggle Kartu Hukuman:** `ON / OFF` (Matikan jika acara bersifat korporat sangat formal).
  * **Toggle Tombol Pass Bomb:** `ON / OFF`.
  * **Reset Leaderboard:** Menghapus data skor harian sebelum sesi acara baru dimulai.
```

Dengan struktur ini, tim pengembang atau kamu sendiri bisa langsung menyusun proyek secara rapi tanpa khawatir *bug* sentuhan ganda, teks terpotong saat layar berputar, atau transisi *state* yang bertabrakan. 

Apakah kamu berencana membangun game ini menggunakan **Unity** atau **Web (HTML5/React/JS)** sehingga kita bisa langsung membuatkan *template* kode untuk *State Machine* dan *Multi-Touch Handler*-nya?