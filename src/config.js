/** Global game constants — BOMB DEFUSAL: CHAOS EDITION */
export const GAME_W = 1920;
export const GAME_H = 1080;

export const COLORS = {
  red: 0xf2555f,
  yellow: 0xffc93c,
  blue: 0x4c9bff,
  purple: 0xb55ddc,
  green: 0x45d6a0,
  orange: 0xffb45e,
  navy: 0x0f1728,
  ink: 0x070c16,
  steel: 0x263248,
  cream: 0xfff4df,
  white: 0xffffff,
};

export const CSS = {
  red: '#F2555F', yellow: '#FFC93C', blue: '#4C9BFF', purple: '#B55DDC',
  green: '#45D6A0', orange: '#FFB45E', navy: '#0F1728', ink: '#070C16',
  steel: '#263248', cream: '#FFF4DF', muted: '#6B5A43', white: '#FFFFFF',
  text: '#1B1406', dim: '#8B785C',
};

/** Bright comic-paper UI tokens. Dark ink on cream panels; colored accents. */
export const THEME = {
  bg: 0xfff4df,
  panel: 0xfff4df,
  panelRaised: 0xffffff,
  panelSoft: 0xf3e3c5,
  border: 0x1b1406,
  borderSoft: 0xcbb18a,
  text: 0x1b1406,
  muted: 0x6b5a43,
  dim: 0x8b785c,
  yellow: 0xffc93c,
  blue: 0x4c9bff,
  red: 0xf2555f,
  green: 0x45d6a0,
  white: 0xffffff,
};

export const FONT = {
  display: 'Luckiest Guy',
  heading: 'Fredoka One',
  body: 'Varela Round',
  mono: 'Bungee',
};

export const PLAYERS = [
  { id: 0, key: 'ren', name: 'REN', avatar: 'avatar-ren', avatarCrop: 'avatar-ren', color: 0xff9a2a, css: '#FF9A2A', trait: 'PEMIMPIN' },
  { id: 1, key: 'kai', name: 'KAI', avatar: 'avatar-kai', avatarCrop: 'avatar-kai', color: 0x4c9bff, css: '#4C9BFF', trait: 'STRATEGIS' },
  { id: 2, key: 'mira', name: 'MIRA', avatar: 'avatar-mira', avatarCrop: 'avatar-mira', color: 0xff4f9a, css: '#FF4F9A', trait: 'ENERGI' },
  { id: 3, key: 'rin', name: 'RIN', avatar: 'avatar-rin', avatarCrop: 'avatar-rin', color: 0xc6f53c, css: '#C6F53C', trait: 'LIAR' },
];

export const DIFFICULTIES = {
  casual: {
    key: 'casual',
    label: 'SANTAI',
    tagline: 'UNTUK SEMUA UMUR',
    description: '2 modul • sabotase ringan • waktu lega',
    baseTime: 48,
    moduleCount: 2,
    sabotageAt: [0.62, 0.32],
    sabotagePool: ['smoke', 'ice', 'glitch'],
    scoreMult: 1,
    color: 0x45d6a0,
  },
  standard: {
    key: 'standard',
    label: 'STANDAR',
    tagline: 'EVENT & GATHERING',
    description: '3 modul • sabotase aktif • tempo pas',
    baseTime: 40,
    moduleCount: 3,
    sabotageAt: [0.65, 0.4, 0.2],
    sabotagePool: ['smoke', 'ice', 'gravity', 'glitch'],
    scoreMult: 1.2,
    color: 0xffc93c,
  },
  chaos: {
    key: 'chaos',
    label: 'CHAOS',
    tagline: 'KOMPETISI GILA',
    description: '3 modul • 4 sabotase • crowd cipher wajib',
    baseTime: 32,
    moduleCount: 3,
    sabotageAt: [0.72, 0.52, 0.32, 0.15],
    sabotagePool: ['smoke', 'ice', 'gravity', 'glitch'],
    scoreMult: 1.5,
    color: 0xf2555f,
  },
};

export function timeForDifficulty(difficultyKey, playerCount) {
  const diff = DIFFICULTIES[difficultyKey] || DIFFICULTIES.standard;
  const offset = playerCount === 2 ? 4 : playerCount === 4 ? -3 : 0;
  return diff.baseTime + offset;
}

export const MODULES = {
  dualHand: {
    key: 'dualHand',
    title: 'DUAL-HAND ANCHOR',
    short: 'SENSOR GANDA',
    icon: 'icon-hand-multi',
    accent: 0x4c9bff,
    hint: 'BUTUH 2 TANGAN',
    desc: 'Tahan dua sensor dan rentangkan tangan selebar layar.',
  },
  metaTrap: {
    key: 'metaTrap',
    title: 'META UI TRAP',
    short: 'JEBAKAN UI',
    icon: 'icon-glitch',
    accent: 0xb55ddc,
    hint: 'BACA DENGAN TELITI',
    desc: 'Jangan percaya tombol mencolok. Baca judulnya.',
  },
  reverse: {
    key: 'reverse',
    title: 'REVERSE PSYCHOLOGY',
    short: 'TOMBOL PSIKOLOGI',
    icon: 'icon-alert',
    accent: 0xf2555f,
    hint: 'TAHAN DIRI',
    desc: 'Kadang menang berarti tidak menyentuh apa pun.',
  },
  wires: {
    key: 'wires',
    title: 'LOGIC WIRE CUTTER',
    short: 'POTONG KABEL',
    icon: 'icon-wire',
    accent: 0xffc93c,
    hint: 'SWIPE UNTUK MEMOTONG',
    desc: 'Baca aturan, potong kabel yang tepat dengan satu usapan.',
  },
  cipher: {
    key: 'cipher',
    title: 'CROWD CIPHER',
    short: 'SANDI PENONTON',
    icon: 'icon-team',
    accent: 0x45d6a0,
    hint: 'MINTA BANTUAN PENONTON',
    desc: 'Kamus sandi ada di zona atas — penonton bisa membantu.',
  },
  acoustic: {
    key: 'acoustic',
    title: 'ACOUSTIC SENSOR',
    short: 'SENSOR SUARA',
    icon: 'icon-mic',
    accent: 0x4c9bff,
    hint: 'KETUK / TERIAK',
    desc: 'Isi meter suara, atau jaga keheningan total.',
  },
};

export const PENALTY_CARDS = [
  { icon: 'icon-trophy', title: 'POSE SUPERHERO', text: 'Berdiri gaya superhero paling keren di depan layar selama 5 detik. Penonton boleh memotret!' },
  { icon: 'icon-bolt', title: 'SLOW MOTION', text: 'Berjalan kembali ke tempat duduk dengan gerakan slow motion sinematik selama 5 detik.' },
  { icon: 'icon-team', title: 'HIGH-FIVE TRIO', text: 'Tos (high-five) kepada 3 orang terdekat dalam waktu 5 detik. Cepat sebelum waktu habis!' },
  { icon: 'icon-mic', title: 'MUKA DATAR', text: 'Ucapkan “Saya berjanji tidak akan panik lagi” dengan ekspresi paling datar. Tanpa senyum!' },
  { icon: 'icon-star', title: 'TIGA MAKANAN “S”', text: 'Sebutkan 3 nama makanan berawalan huruf S dalam waktu 4 detik. Contoh: sate, soto, sambal.' },
  { icon: 'icon-sound', title: 'SIRINE AMBULANS', text: 'Tirukan suara sirine ambulans atau efek ledakan bom selama 3 detik. Dengar suaranya, bukan lihat!' },
  { icon: 'icon-crown', title: 'KEPALA TEPUK', text: 'Tepuk kepala sendiri 3 kali sambil bilang “Bom ini terlalu pintar untukku.” Cepat dan lucu!' },
  { icon: 'icon-spark', title: 'TARIAN ROBOT', text: 'Lakukan gerakan robot selama 5 detik. Bebas gaya, yang penting penonton terhibur.' },
  { icon: 'icon-bomb', title: 'HITUNG MUNDUR', text: 'Hitung mundur dari 5 ke 1 dengan suara paling dramatis, lalu teriak “BOOM!” di akhir.' },
];

export const WIRE_COLORS = {
  red: { name: 'MERAH', letters: 5, marker: 'SEGITIGA', css: '#F2555F', texture: 'wire-red' },
  blue: { name: 'BIRU', letters: 4, marker: 'KOTAK', css: '#4C9BFF', texture: 'wire-blue' },
  yellow: { name: 'KUNING', letters: 6, marker: 'LINGKARAN', css: '#FFC93C', texture: 'wire-yellow' },
  green: { name: 'HIJAU', letters: 5, marker: 'SILANG', css: '#45D6A0', texture: 'wire-green' },
  white: { name: 'PUTIH', letters: 5, marker: 'BINTANG', css: '#FFF4DF', texture: 'wire-white' },
};

export const CIPHER_SYMBOLS = [
  { key: 'triangle', icon: 'symbol-triangle', label: 'SEGITIGA' },
  { key: 'diamond', icon: 'symbol-diamond', label: 'BERLIAN' },
  { key: 'circle', icon: 'symbol-circle', label: 'LINGKARAN' },
  { key: 'square', icon: 'symbol-square', label: 'KOTAK' },
  { key: 'star', icon: 'symbol-star', label: 'BINTANG' },
  { key: 'hex', icon: 'symbol-hex', label: 'HEKSAGON' },
];

export const SABOTAGES = {
  smoke: { key: 'smoke', title: 'SMOKE SCREEN!', sub: 'GOSOK LAYAR DENGAN TELAPAK TANGAN', color: 0xd9dde7, icon: 'icon-smoke' },
  ice: { key: 'ice', title: 'CRYO FREEZE!', sub: 'KETUK LAYAR 6× UNTUK MEMECAHKAN ES', color: 0x8ce4ff, icon: 'icon-snowflake' },
  gravity: { key: 'gravity', title: 'GRAVITY FLIP!', sub: 'JANGAN PANIK — SEMUA TERBALIK 7 DETIK', color: 0xb55ddc, icon: 'icon-replay' },
  glitch: { key: 'glitch', title: 'SYSTEM GLITCH!', sub: 'GESER POP-UP KE ATAS UNTUK REBOOT', color: 0xf2555f, icon: 'icon-glitch' },
};

export const EVENTS = {
  title: 'ICE BREAKING ARCADE',
  venue: 'CHAOS LAB — PID 1920×1080',
  tagline: '2–4 PEMAIN • MULTI-TOUCH • 45–60 DETIK',
};

export const ASSET_KEYS = [
  'bg-menu', 'bg-game', 'bg-pop', 'logo-mark',
  'avatar-ren', 'avatar-kai', 'avatar-mira', 'avatar-rin',
  'portrait-ren', 'portrait-kai', 'portrait-mira', 'portrait-rin',
  'bomb-case',
  'touch-ring-red', 'touch-ring-yellow', 'touch-ring-blue', 'touch-ring-purple', 'touch-ring-green',
  'puzzle-scanner', 'lever-track', 'lever-handle', 'button-red', 'button-blue', 'button-green',
  'wire-red', 'wire-blue', 'wire-yellow', 'wire-green', 'wire-white', 'scissors',
  'glitch-popup', 'vu-meter',
  'symbol-triangle', 'symbol-diamond', 'symbol-circle', 'symbol-square', 'symbol-star', 'symbol-hex',
  'fx-spark', 'fx-smoke', 'fx-smoke-dark', 'fx-ice', 'fx-glass-crack', 'fx-explosion',
  'fx-shockwave', 'fx-flame', 'fx-electric', 'fx-confetti-1', 'fx-confetti-2', 'fx-confetti-3',
  'fx-flash-rays', 'fx-speedlines',
  'icon-play', 'icon-settings', 'icon-sound', 'icon-mute', 'icon-music', 'icon-info', 'icon-back',
  'icon-home', 'icon-replay', 'icon-help', 'icon-trophy', 'icon-crown', 'icon-leaderboard', 'icon-team',
  'icon-timer', 'icon-bomb', 'icon-wire', 'icon-hand-tap', 'icon-hand-hold', 'icon-hand-drag',
  'icon-hand-swipe', 'icon-hand-multi', 'icon-snowflake', 'icon-smoke', 'icon-glitch', 'icon-alert',
  'icon-check', 'icon-cross', 'icon-star', 'icon-bolt', 'icon-spark', 'icon-shield', 'icon-key',
  'icon-lock', 'icon-eye', 'icon-arrow-right', 'icon-arrow-up', 'icon-plus', 'icon-minus', 'icon-pause',
  'icon-mic', 'icon-reset', 'icon-close', 'icon-heart', 'icon-flag', 'icon-clockw', 'icon-stopwatch',
  'icon-megaphone', 'icon-csv', 'icon-map', 'icon-wifi',
];
