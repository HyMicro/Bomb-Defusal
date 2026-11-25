/**
 * Local persistence: operator settings + daily leaderboard.
 * Everything is localStorage-backed so a PID can run fully offline.
 */
const SETTINGS_KEY = 'bc.settings.v2';
const LEADERBOARD_KEY = 'bc.leaderboard.v3';

export const DEFAULT_SETTINGS = {
  difficulty: 'standard',
  sound: true,
  music: true,
  penaltyCards: true,
  passBomb: true,
  sabotage: true,
  acoustic: false,
  haptics: true,
  pin: '0000',
  autoResetSeconds: 30,
  eventTitle: 'BOMB DEFUSAL // CHAOS EDITION',
  eventSubtitle: 'PID 1920×1080 • 2–4 PEMAIN',
  seeded: true,
};

function safeGet(key) {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function safeSet(key, value) {
  try { window.localStorage.setItem(key, value); return true; } catch { return false; }
}

export const settingsBus = new EventTarget();

export function loadSettings() {
  let parsed = {};
  try { parsed = JSON.parse(safeGet(SETTINGS_KEY) || '{}') || {}; } catch { parsed = {}; }
  const next = { ...DEFAULT_SETTINGS, ...parsed };
  // Migrate the old generic event label without wiping the operator's other settings.
  if (next.eventTitle === 'ICE BREAKING ARCADE') next.eventTitle = DEFAULT_SETTINGS.eventTitle;
  if (next.eventSubtitle === 'CHAOS LAB — PID 1920×1080') next.eventSubtitle = DEFAULT_SETTINGS.eventSubtitle;
  return next;
}

export function saveSettings(patch = {}) {
  const next = { ...loadSettings(), ...patch };
  safeSet(SETTINGS_KEY, JSON.stringify(next));
  settingsBus.dispatchEvent(new CustomEvent('change', { detail: next }));
  return next;
}

export function resetSettings() {
  safeSet(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  settingsBus.dispatchEvent(new CustomEvent('change', { detail: { ...DEFAULT_SETTINGS } }));
  return { ...DEFAULT_SETTINGS };
}

export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const SEED = [
  { initials: 'REN', score: 12480, timeLeft: 23.4, players: 3, difficulty: 'standard', strikes: 0 },
  { initials: 'KAI', score: 11220, timeLeft: 19.8, players: 2, difficulty: 'standard', strikes: 1 },
  { initials: 'MIR', score: 10850, timeLeft: 17.2, players: 4, difficulty: 'chaos', strikes: 1 },
  { initials: 'RIN', score: 9860, timeLeft: 14.6, players: 3, difficulty: 'standard', strikes: 2 },
  { initials: 'BOM', score: 8700, timeLeft: 11.1, players: 2, difficulty: 'casual', strikes: 0 },
];

function normalizeEntry(entry) {
  return {
    initials: String(entry.initials || 'BOM').slice(0, 3).toUpperCase(),
    score: Math.max(0, Math.round(Number(entry.score) || 0)),
    timeLeft: Math.max(0, Number(entry.timeLeft) || 0),
    players: Number(entry.players) || 3,
    difficulty: entry.difficulty || 'standard',
    strikes: Number(entry.strikes) || 0,
    date: entry.date || todayKey(),
    demo: !!entry.demo,
    savedAt: entry.savedAt || Date.now(),
  };
}

export function loadLeaderboard() {
  let all = [];
  try { all = JSON.parse(safeGet(LEADERBOARD_KEY) || '[]') || []; } catch { all = []; }
  if (!Array.isArray(all)) all = [];
  all = all.map(normalizeEntry).filter((e) => e.initials);
  const today = todayKey();
  const todays = all.filter((e) => e.date === today);
  const s = loadSettings();
  if (todays.length === 0 && s.seeded) {
    const seeded = SEED.map((e, i) => normalizeEntry({ ...e, date: today, demo: true, savedAt: Date.now() - i * 1000 }));
    all = [...all, ...seeded];
    safeSet(LEADERBOARD_KEY, JSON.stringify(all));
    return seeded;
  }
  return todays;
}

export function topLeaderboard(limit = 5) {
  return loadLeaderboard()
    .sort((a, b) => b.timeLeft - a.timeLeft || b.score - a.score)
    .slice(0, limit);
}

export function qualifiesForLeaderboard(timeLeft, limit = 5) {
  const top = topLeaderboard(limit);
  if (top.length < limit) return true;
  return timeLeft > top[top.length - 1].timeLeft;
}

export function addLeaderboardEntry(entry) {
  const e = normalizeEntry({ ...entry, date: todayKey() });
  e.demo = false;
  let all = [];
  try { all = JSON.parse(safeGet(LEADERBOARD_KEY) || '[]') || []; } catch { all = []; }
  if (!Array.isArray(all)) all = [];
  all.push(e);
  // Keep today's top 25 + all older daily data (trim to 250 rows for kiosk sanity).
  all = all.map(normalizeEntry).sort((a, b) => b.date.localeCompare(a.date) || b.timeLeft - a.timeLeft);
  if (all.length > 250) all = all.slice(0, 250);
  safeSet(LEADERBOARD_KEY, JSON.stringify(all));
  return e;
}

export function resetLeaderboard() {
  safeSet(LEADERBOARD_KEY, JSON.stringify([]));
}

export function exportLeaderboardCSV() {
  const rows = [['tanggal', 'inisial', 'skor', 'sisa_waktu_detik', 'pemain', 'kesulitan', 'strike', 'demo']];
  let all = [];
  try { all = JSON.parse(safeGet(LEADERBOARD_KEY) || '[]') || []; } catch { all = []; }
  all.map(normalizeEntry)
    .sort((a, b) => b.date.localeCompare(a.date) || b.timeLeft - a.timeLeft)
    .forEach((e) => rows.push([e.date, e.initials, e.score, e.timeLeft.toFixed(1), e.players, e.difficulty, e.strikes, e.demo ? 'contoh' : 'asli']));
  const csv = '\uFEFF' + rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bom-challenge-leaderboard-${todayKey()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
