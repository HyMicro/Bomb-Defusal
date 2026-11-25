import {
  loadSettings, saveSettings, resetLeaderboard, exportLeaderboardCSV, topLeaderboard, DEFAULT_SETTINGS,
} from '../core/storage.js';
import { audio } from '../core/audio.js';

/**
 * Hidden operator menu (DOM overlay).
 * Default PIN: 0000.  Unlocked via 5 taps in the top-left corner (2s window),
 * or via the visible PENGATURAN button on the attract screen (still PIN-locked).
 */
let root = null;
let unlocked = false;
let pinBuffer = '';
let settings = null;
let previewMode = false;

const $ = (sel, parent = document) => parent.querySelector(sel);

function createRoot() {
  root = document.getElementById('admin-root');
  root.innerHTML = `
  <div class="admin-backdrop"></div>
  <div class="admin-shell" role="dialog" aria-modal="true" aria-label="Operator menu">
    <div class="admin-head">
      <span class="admin-kicker">OPERATOR // BOM LAB</span>
      <h2 class="admin-title">PANEL <em>KONFIGURASI</em></h2>
      <button class="admin-close" type="button" aria-label="Tutup panel">✕</button>
    </div>
    <div class="admin-lock" id="admin-lock">
      <h3>KODE OPERATOR</h3>
      <p>Masukkan PIN untuk membuka pengaturan acara.</p>
      <div class="pin-dots" id="pin-dots"></div>
      <div class="pin-pad" id="pin-pad"></div>
      <div class="pin-error" id="pin-error"></div>
      <div class="admin-note">Akses khusus operator acara. Hubungi technical artist bila PIN tidak diketahui.</div>
    </div>
    <div class="admin-body" id="admin-body"></div>
  </div>`;
  $('.admin-close').addEventListener('click', close);
  $('.admin-backdrop').addEventListener('click', close);
  buildPin();
}

function buildPin() {
  const pad = $('#pin-pad');
  if (!pad) return;
  pad.innerHTML = '';
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'].forEach((label) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.addEventListener('click', () => {
      audio.unlock();
      audio.sfx('click');
      if (label === '⌫') pinBuffer = pinBuffer.slice(0, -1);
      else if (label === '✓') submitPin();
      else if (pinBuffer.length < 4) pinBuffer += label;
      renderPin();
      if (pinBuffer.length === 4 && label !== '⌫' && label !== '✓') {
        setTimeout(submitPin, 120);
      }
    });
    pad.appendChild(b);
  });
  renderPin();
}

function renderPin() {
  const dots = $('#pin-dots');
  if (!dots) return;
  dots.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const d = document.createElement('div');
    d.className = 'pin-dot';
    d.textContent = pinBuffer[i] ? '●' : '';
    dots.appendChild(d);
  }
}

function submitPin() {
  settings = loadSettings();
  if (pinBuffer === String(settings.pin || '0000')) {
    unlocked = true;
    pinBuffer = '';
    renderPin();
    $('#pin-error').textContent = '';
    renderBody();
    $('#admin-lock').style.display = 'none';
    $('#admin-body').classList.add('open');
    audio.sfx('select');
  } else {
    pinBuffer = '';
    renderPin();
    const err = $('#pin-error');
    err.textContent = 'PIN SALAH — COBA LAGI.';
    audio.sfx('error');
    const lock = $('#admin-lock');
    lock.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], { duration: 220 });
    setTimeout(() => { err.textContent = ''; }, 1600);
  }
}

function toggleRow(key, label, desc, current) {
  return `
  <div class="admin-row">
    <label>${label}<small>${desc}</small></label>
    <button class="admin-toggle" type="button" data-toggle="${key}" aria-pressed="${current ? 'true' : 'false'}" aria-label="${label}"></button>
  </div>`;
}

function renderBody() {
  settings = loadSettings();
  const board = topLeaderboard(5);
  const body = $('#admin-body');
  if (!body) return;
  const presetInfo = {
    casual: '52–56 detik • 2 modul • sabotase ringan',
    standard: '36–44 detik • 3 modul • sabotase aktif',
    chaos: '29–36 detik • 3 modul • 4 gangguan • cipher wajib',
  }[settings.difficulty] || '';
  body.innerHTML = `
  <div class="admin-grid">
    <div class="admin-card">
      <h4>Preset Ronde</h4>
      <div class="admin-row">
        <label>Mode kesulitan<small>${presetInfo}</small></label>
        <select class="admin-select" id="admin-difficulty">
          <option value="casual" ${settings.difficulty === 'casual' ? 'selected' : ''}>SANTAI</option>
          <option value="standard" ${settings.difficulty === 'standard' ? 'selected' : ''}>STANDAR</option>
          <option value="chaos" ${settings.difficulty === 'chaos' ? 'selected' : ''}>CHAOS</option>
        </select>
      </div>
      ${toggleRow('sabotage', 'Sabotase layar', 'Asap, es, gravity flip, glitch.', settings.sabotage)}
      ${toggleRow('penaltyCards', 'Kartu hukuman', 'Tampilkan tantangan ringan setelah kalah.', settings.penaltyCards)}
      ${toggleRow('passBomb', 'Tombol Lempar Bom', 'Satu kali per ronde, hadiah +5 detik.', settings.passBomb)}
      ${toggleRow('acoustic', 'Sensor suara (opsional)', 'Untuk PID dengan mikrofon. Simulasi tap selalu aktif.', settings.acoustic)}
      <div class="admin-note">Perubahan langsung disimpan di perangkat ini. Ronde berikutnya memakai preset terbaru.</div>
    </div>
    <div class="admin-card">
      <h4>Audio & Tampilan</h4>
      ${toggleRow('sound', 'Efek suara', 'Klik, tick, ledakan, dan umpan balik.', settings.sound)}
      ${toggleRow('music', 'Musik adaptif', 'Tempo naik saat waktu menipis.', settings.music)}
      <div class="admin-row">
        <label>Auto reset kios<small>Kembali ke attract setelah hasil.</small></label>
        <select class="admin-select" id="admin-autoreset">
          ${[15, 20, 30, 45, 60].map((n) => `<option value="${n}" ${Number(settings.autoResetSeconds) === n ? 'selected' : ''}>${n} detik</option>`).join('')}
        </select>
      </div>
      <div class="admin-note">Runtime PNG cache: boot ±2× lebih cepat dari mode SVG. Resolusi kanvas 1920×1080 (FIT 16:9); PID 4K melakukan upscale. Mode vektor: tambahkan <code>?assets=svg</code>.</div>
    </div>
    <div class="admin-card">
      <h4>Branding Acara</h4>
      <div class="admin-row">
        <label>Nama acara<small>Muncul di attract mode.</small></label>
        <input class="admin-select" id="admin-event-title" value="${escapeAttr(settings.eventTitle)}" maxlength="40" style="min-width:320px;max-width:100%">
      </div>
      <div class="admin-row">
        <label>Sub-judul<small>Lokasi / sesi acara.</small></label>
        <input class="admin-select" id="admin-event-sub" value="${escapeAttr(settings.eventSubtitle)}" maxlength="60" style="min-width:320px;max-width:100%">
      </div>
      <div class="admin-note">Brand resmi memakai <code>assets/brand/bomb-defusal-logo.png</code>. Field di atas hanya mengganti label acara.</div>
      <div class="admin-actions">
        <button class="admin-btn primary" type="button" id="admin-save">SIMPAN & TUTUP</button>
        <button class="admin-btn" type="button" id="admin-reload">MUAT ULANG APLIKASI</button>
      </div>
    </div>
    <div class="admin-card">
      <h4>Data Harian</h4>
      <div class="admin-row">
        <label>Leaderboard hari ini<small>${board.length} entri • ${new Date().toLocaleDateString('id-ID')}</small></label>
        <button class="admin-btn" type="button" id="admin-export">EXPORT CSV</button>
      </div>
      <div class="admin-actions">
        <button class="admin-btn danger" type="button" id="admin-reset-board">RESET SKOR HARI INI</button>
        <button class="admin-btn danger" type="button" id="admin-reset-settings">RESET PENGATURAN</button>
      </div>
      <div class="admin-note">PIN operator dapat diubah melalui konfigurasi <code>bc.settings.v2</code>.</div>
    </div>
  </div>
  <div class="admin-toast" id="admin-toast"></div>`;

  body.querySelectorAll('[data-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.toggle;
      const next = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(next));
      settings = saveSettings({ [key]: next });
      if (key === 'sound' || key === 'music') audio.setPrefs({ sound: settings.sound, music: settings.music });
      audio.unlock();
      audio.sfx('click');
      toast(`${key} ${next ? 'diaktifkan' : 'dinonaktifkan'}`);
    });
  });
  $('#admin-difficulty')?.addEventListener('change', (e) => {
    settings = saveSettings({ difficulty: e.target.value });
    toast('Preset kesulitan diperbarui.');
    renderBody();
  });
  $('#admin-autoreset')?.addEventListener('change', (e) => {
    settings = saveSettings({ autoResetSeconds: Number(e.target.value) });
    toast('Auto reset diperbarui.');
  });
  $('#admin-event-title')?.addEventListener('change', (e) => {
    settings = saveSettings({ eventTitle: e.target.value.slice(0, 40) });
    toast('Nama acara disimpan.');
  });
  $('#admin-event-sub')?.addEventListener('change', (e) => {
    settings = saveSettings({ eventSubtitle: e.target.value.slice(0, 60) });
    toast('Sub-judul disimpan.');
  });
  $('#admin-export')?.addEventListener('click', () => {
    exportLeaderboardCSV();
    toast('Leaderboard diekspor sebagai CSV.');
  });
  $('#admin-save')?.addEventListener('click', close);
  $('#admin-reload')?.addEventListener('click', () => window.location.reload());
  $('#admin-reset-board')?.addEventListener('click', () => {
    resetLeaderboard();
    toast('Skor harian direset.');
    renderBody();
  });
  $('#admin-reset-settings')?.addEventListener('click', () => {
    settings = saveSettings({
      difficulty: 'standard', sound: true, music: true, penaltyCards: true,
      passBomb: true, sabotage: true, acoustic: false, autoResetSeconds: 30,
      eventTitle: DEFAULT_SETTINGS.eventTitle, eventSubtitle: DEFAULT_SETTINGS.eventSubtitle,
    });
    toast('Pengaturan dikembalikan ke default.');
    renderBody();
  });
}

function toast(text) {
  const t = $('#admin-toast');
  if (!t) return;
  t.textContent = text;
  t.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

function escapeAttr(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

export function openAdmin(options = {}) {
  if (!root) createRoot();
  settings = loadSettings();
  previewMode = !!options.preview;
  root.classList.add('open');
  unlocked = !!options.unlock || unlocked;
  if (unlocked) {
    $('#admin-lock').style.display = 'none';
    $('#admin-body').classList.add('open');
    renderBody();
  } else {
    $('#admin-lock').style.display = '';
    $('#admin-body').classList.remove('open');
    pinBuffer = '';
    renderPin();
  }
  if (options.unlock && options.preview) {
    const body = $('#admin-body');
    if (body && !body.dataset.previewNote) {
      body.dataset.previewNote = '1';
    }
  }
  audio.sfx('select');
}

export function close() {
  if (!root) return;
  root.classList.remove('open');
  audio.sfx('back');
  window.dispatchEvent(new CustomEvent('bc:refresh'));
}

export function initAdmin() {
  window.BCAdmin = { open: openAdmin, close };
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root?.classList.contains('open')) close();
  });
}
