import { session } from '../core/session.js';
import { audio } from '../core/audio.js';
import { loadSettings, saveSettings, topLeaderboard } from '../core/storage.js';
import {
  txt, button, panel, imageButton, goToScene, formatTimeLeft, formatNumber,
} from '../ui/factory.js';
import { CSS, FONT, THEME, EVENTS, PLAYERS } from '../config.js';

const START_STATES = {
  normal: 'ui-start-normal', hover: 'ui-start-hover',
  pressed: 'ui-start-pressed', disabled: 'ui-start-disabled',
};
const CARA_STATES = {
  normal: 'ui-cara-normal', hover: 'ui-cara-hover',
  pressed: 'ui-cara-pressed', disabled: 'ui-cara-disabled',
};
const SETTINGS_STATES = {
  normal: 'ui-settings-normal', hover: 'ui-settings-hover',
  pressed: 'ui-settings-pressed', disabled: 'ui-settings-disabled',
};
const BOARD_STATES = {
  normal: 'ui-board-normal', hover: 'ui-board-hover',
  pressed: 'ui-board-pressed', disabled: 'ui-board-disabled',
};

/**
 * Attract / main menu — comic-panel stack on the left, hero cast card on the right.
 * Navigation mirrors the reference flow: PLAY → OPTIONS → HELP → LEADERBOARD.
 */
export class AttractScene extends Phaser.Scene {
  constructor() {
    super('Attract');
  }

  init(data) {
    this.preview = data?.preview || null;
    this.adminTaps = [];
    this.helpOpen = false;
    this.leaderboardOpen = false;
    this.__leaving = false;
  }

  create() {
    this.settings = loadSettings();
    audio.setPrefs({ sound: this.settings.sound, music: this.settings.music });
    audio.setMusicLevel(0, true);
    this.__audioClick = () => audio.sfx('click');
    this.input.enabled = true;

    const bg = this.add.image(960, 540, 'bg-pop').setDisplaySize(1920, 1080).setDepth(0);
    this.tweens.add({ targets: bg, scale: { from: 1, to: 1.035 }, duration: 12000, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

    this.buildHeader();
    this.buildBrand();
    this.buildMenuPanel();
    this.buildCast();
    this.setupAdminHotspot();

    this.cameras.main.fadeIn(260, 7, 13, 24);
    this.hideBoot();
    this.time.delayedCall(420, () => { window.__BC_READY = true; });

    if (this.preview === 'admin') {
      this.time.delayedCall(700, () => window.BCAdmin?.open({ unlock: true, preview: true }));
    }

    this.input.on('pointerdown', () => { if (!this.helpOpen && !this.leaderboardOpen) audio.unlock(); });
    this._onAdminRefresh = () => {
      if (this.sys?.isActive?.()) this.scene.restart({ preview: null });
    };
    window.addEventListener('bc:refresh', this._onAdminRefresh, { once: true });
    this.events.once('shutdown', () => {
      window.removeEventListener('bc:refresh', this._onAdminRefresh);
      this.helpModal?.destroy(true);
      this.leaderboardModal?.destroy(true);
      this.helpModal = null;
      this.leaderboardModal = null;
    });
  }

  buildHeader() {
    const hg = this.add.graphics().setDepth(7);
    hg.fillStyle(THEME.bg, .94).fillRoundedRect(46, 24, 310, 42, 10);
    hg.lineStyle(1.5, THEME.border, .65).strokeRoundedRect(46, 24, 310, 42, 10);
    this.add.text(64, 33, (this.settings.eventTitle || EVENTS.title).toUpperCase(), {
      fontFamily: FONT.mono, fontSize: '10px', color: CSS.ink, fontStyle: 'bold', letterSpacing: 1.4,
    }).setDepth(8);
    this.add.text(64, 51, (this.settings.eventSubtitle || EVENTS.venue).toUpperCase(), {
      fontFamily: FONT.body, fontSize: '9px', color: CSS.muted, letterSpacing: .6,
    }).setDepth(8);
    this.soundIcon = this.add.image(1842, 52, this.settings.sound ? 'cut-sound' : 'cut-mute')
      .setDisplaySize(44, 38).setDepth(8).setInteractive({ useHandCursor: true });
    this.soundIcon.on('pointerup', () => this.toggleSound());
  }

  toggleSound() {
    this.settings = saveSettings({ sound: !this.settings.sound, music: !this.settings.sound });
    audio.setPrefs({ sound: this.settings.sound, music: this.settings.music });
    audio.sfx('select');
    this.soundIcon.setTexture(this.settings.sound ? 'cut-sound' : 'cut-mute').setDisplaySize(44, 38);
  }

  buildBrand() {
    this.brand = this.add.image(70, 68, 'brand-logo').setOrigin(0, 0).setDisplaySize(620, 251).setDepth(6);
    this.brand.setAlpha(0).setY(82);
    this.tweens.add({ targets: this.brand, alpha: 1, y: 68, duration: 480, ease: 'Back.Out' });
    this.add.text(86, 332, 'CHAOS EDITION', {
      fontFamily: FONT.mono, fontSize: '15px', color: CSS.ink, letterSpacing: 2.4,
      stroke: CSS.cream, strokeThickness: 4,
    }).setDepth(6);
    this.add.text(88, 356, '2–4 PEMAIN · SATU LAYAR · 45–60 DETIK', {
      fontFamily: FONT.body, fontSize: '12px', color: CSS.text, letterSpacing: .5,
      stroke: CSS.cream, strokeThickness: 4,
    }).setDepth(6);
  }

  buildMenuPanel() {
    panel(this, 70, 392, 640, 594, { depth: 4, fill: 0x0a111d, alpha: .94, radius: 22 });
    this.add.graphics().setDepth(5).lineStyle(2, THEME.yellow, .35).strokeRoundedRect(82, 404, 616, 570, 18);

    this.mainButton = imageButton(this, {
      x: 390, y: 478, states: START_STATES, w: 450, h: 105, depth: 10,
      onClick: () => this.startFlow(),
    });
    this.caraButton = imageButton(this, {
      x: 390, y: 604, states: CARA_STATES, w: 330, h: 94, depth: 10,
      onClick: () => this.openHelp(),
    });
    this.settingsButton = imageButton(this, {
      x: 390, y: 712, states: SETTINGS_STATES, w: 330, h: 94, depth: 10,
      onClick: () => window.BCAdmin?.open(),
    });
    this.boardButton = imageButton(this, {
      x: 390, y: 820, states: BOARD_STATES, w: 330, h: 94, depth: 10,
      onClick: () => this.openLeaderboard(),
    });

    this.add.text(390, 902, 'SENTUH MULAI MISI — AJAK 2–4 PEMAIN', {
      fontFamily: FONT.body, fontSize: '10px', color: '#D9C7A6', letterSpacing: .8,
    }).setOrigin(0.5, 0).setDepth(8);
    this.add.text(64, 1030, '10-POINT MULTI-TOUCH  ·  PID 1920×1080', {
      fontFamily: FONT.mono, fontSize: '9px', color: CSS.text, letterSpacing: .7,
      stroke: CSS.cream, strokeThickness: 3,
    }).setDepth(8);

    [this.mainButton, this.caraButton, this.settingsButton, this.boardButton].forEach((btn, i) => {
      btn.container.setAlpha(0);
      btn.container.x -= 24;
      this.tweens.add({
        targets: btn.container, alpha: 1, x: btn.container.x + 24,
        duration: 360, delay: 260 + i * 80, ease: 'Back.Out',
      });
    });
  }

  buildCast() {
    const card = this.add.container(1450, 536).setDepth(6);
    const shadow = this.add.rectangle(16, 20, 576, 800, 0x05080f, .55);
    const frame = this.add.rectangle(0, 0, 576, 800, 0x05080f, 1).setStrokeStyle(6, THEME.yellow, .9);
    const portrait = this.add.image(0, 0, 'portrait-ren').setDisplaySize(548, 768);
    const badge = this.add.container(-262, -366);
    const bg = this.add.graphics();
    bg.fillStyle(THEME.yellow, 1).fillRoundedRect(-70, -18, 140, 36, 9);
    bg.lineStyle(2, 0x05080f, .9).strokeRoundedRect(-70, -18, 140, 36, 9);
    const label = txt(this, 0, 0, 'THE LEADER', { size: 12, font: FONT.heading, color: '#1B1406', letterSpacing: .8 });
    badge.add([bg, label]);
    card.add([shadow, frame, portrait, badge]);
    card.setAngle(-1.4);
    card.setAlpha(0); card.x += 60;
    this.tweens.add({ targets: card, alpha: 1, x: 1450, duration: 520, delay: 120, ease: 'Back.Out' });
    this.tweens.add({ targets: card, y: 528, angle: -0.6, duration: 4200, yoyo: true, repeat: -1, ease: 'Sine.InOut', delay: 800 });

    // Small cast strip under the hero card.
    PLAYERS.slice(1).forEach((p, i) => {
      const x = 1250 + i * 116;
      this.add.circle(x, 972, 30, 0x05080f, .9).setStrokeStyle(2, p.color, .9).setDepth(8);
      this.add.image(x, 972, p.avatarCrop).setDisplaySize(56, 56).setDepth(9);
      this.add.text(x, 1006, p.name, {
        fontFamily: FONT.heading, fontSize: '11px', color: CSS.ink, letterSpacing: .4,
      }).setOrigin(0.5, 0).setDepth(9);
    });
  }

  openLeaderboard() {
    if (this.leaderboardOpen) return;
    this.leaderboardOpen = true;
    audio.sfx('select');
    const overlay = this.add.container(0, 0).setDepth(120);
    const dim = this.add.rectangle(960, 540, 1920, 1080, 0xFFF4DF, .86).setInteractive();
    dim.on('pointerup', () => this.closeLeaderboard());
    overlay.add(dim);
    const card = this.add.container(960, 540);
    const g = this.add.graphics();
    g.fillStyle(0x1B1406, .18).fillRoundedRect(-450 + 12, -310 + 14, 900, 620, 24);
    g.fillStyle(THEME.panel, 1).fillRoundedRect(-450, -310, 900, 620, 24);
    g.lineStyle(3, THEME.border, .92).strokeRoundedRect(-448.5, -308.5, 897, 617, 24);
    card.add(g);
    card.add(this.add.image(-396, -256, 'cut-trophy').setDisplaySize(34, 40));
    card.add(txt(this, -360, -276, 'TOP 5 HARI INI', { size: 26, font: FONT.heading, color: CSS.text, origin: 0 }));
    card.add(txt(this, -360, -240, 'SISA WAKTU TERBESAR — PAPAN HARIAN', { size: 10, font: FONT.mono, color: CSS.dim, origin: 0, letterSpacing: .8 }));
    const list = topLeaderboard(5);
    if (!list.length) card.add(txt(this, 0, 0, 'BELUM ADA SKOR HARI INI.', { size: 14, font: FONT.body, color: CSS.dim }));
    list.forEach((entry, i) => {
      const ry = -184 + i * 82;
      const line = this.add.graphics();
      line.lineStyle(1, THEME.borderSoft, .7).lineBetween(-396, ry + 60, 396, ry + 60);
      card.add(line);
      card.add(txt(this, -388, ry + 22, `${i + 1}`, { size: 23, font: FONT.heading, color: i === 0 ? CSS.yellow : CSS.muted }));
      card.add(txt(this, -330, ry + 6, entry.initials, { size: 24, font: FONT.heading, color: CSS.red, origin: 0, letterSpacing: 1.2 }));
      card.add(txt(this, -330, ry + 34, `${entry.players}P • ${entry.difficulty.toUpperCase()}`, { size: 9, font: FONT.body, color: CSS.dim, origin: 0 }));
      card.add(txt(this, 190, ry + 12, formatTimeLeft(entry.timeLeft), { size: 18, font: FONT.mono, color: CSS.blue, origin: 0 }));
      card.add(txt(this, 380, ry + 22, formatNumber(entry.score), { size: 17, font: FONT.mono, color: CSS.text, origin: 1 }));
    });
    const close = button(this, {
      x: 0, y: 268, w: 240, h: 70, label: 'TUTUP', variant: 'ghost', fontSize: 18,
      onClick: () => this.closeLeaderboard(),
    });
    card.add(close.container);
    overlay.add(card);
    card.setAlpha(0).setScale(.96);
    this.tweens.add({ targets: card, alpha: 1, scale: 1, duration: 200, ease: 'Back.Out' });
    this.leaderboardModal = overlay;
  }

  closeLeaderboard() {
    if (!this.leaderboardOpen) return;
    this.leaderboardOpen = false;
    const overlay = this.leaderboardModal;
    this.leaderboardModal = null;
    if (overlay) this.tweens.add({ targets: overlay, alpha: 0, duration: 140, onComplete: () => overlay.destroy(true) });
  }

  setupAdminHotspot() {
    const zone = this.add.zone(0, 0, 90, 90).setOrigin(0).setDepth(200).setInteractive();
    zone.on('pointerup', () => {
      const now = performance.now();
      this.adminTaps = [...this.adminTaps.filter((t) => now - t < 2000), now];
      if (this.adminTaps.length >= 5) {
        this.adminTaps = [];
        audio.sfx('select');
        window.BCAdmin?.open();
      }
    });
  }

  startFlow() {
    if (this.helpOpen || this.leaderboardOpen || this.__leaving) return;
    audio.unlock();
    audio.sfx('trigger');
    session.preview = null;
    session.demo = false;
    goToScene(this, 'TeamSelect', {}, { fade: 240 });
  }

  openHelp() {
    if (this.helpOpen || this.leaderboardOpen || this.__leaving) return;
    this.helpOpen = true;
    audio.sfx('select');
    const overlay = this.add.container(0, 0).setDepth(120);
    const dim = this.add.rectangle(960, 540, 1920, 1080, 0xFFF4DF, .86).setInteractive();
    dim.on('pointerup', () => this.closeHelp());
    overlay.add(dim);

    const card = this.add.container(960, 540);
    const g = this.add.graphics();
    g.fillStyle(0x1B1406, .18).fillRoundedRect(-500 + 12, -290 + 14, 1000, 580, 24);
    g.fillStyle(THEME.panel, 1).fillRoundedRect(-500, -290, 1000, 580, 24);
    g.lineStyle(3, THEME.border, .92).strokeRoundedRect(-498.5, -288.5, 997, 577, 24);
    const block = this.add.rectangle(0, 0, 1000, 580, 0x000000, .001).setInteractive();
    const bubble = this.add.image(-282, -220, 'cut-bubble-cloud').setDisplaySize(400, 136);
    const title = txt(this, -282, -234, 'CARA BERMAIN', { size: 30, font: FONT.heading, color: '#1A1205' });
    const sub = txt(this, -282, -202, 'Sentuh dan selesaikan.', { size: 11, font: FONT.body, color: '#3B2A08' });
    card.add([g, block, bubble, title, sub]);

    const rows = [
      ['icon-hand-multi', '2–4 pemain', 'Berdiri berdampingan. Semua orang boleh menyentuh semua modul.'],
      ['icon-hand-tap', 'Selesaikan 3 modul', 'Setiap modul aman memberi +3 detik. Baca instruksi singkat di layar.'],
      ['icon-hand-swipe', 'Hadapi sabotase', 'Gosok asap, ketuk es, atau hadapi layar terbalik. Jangan diam.'],
      ['cut-dial', 'Lempar bom', 'Sekali per ronde: tunjuk orang lain untuk mengambil alih.'],
    ];
    rows.forEach(([icon, heading, body], i) => {
      const ry = -148 + i * 82;
      const disc = this.add.circle(-408, ry + 16, 24, THEME.panelRaised, 1).setStrokeStyle(2, THEME.border, .9);
      const ic = this.add.image(-408, ry + 16, icon);
      if (icon === 'cut-dial') ic.setDisplaySize(34, 34); else ic.setDisplaySize(28, 28);
      const h = txt(this, -368, ry, heading, { size: 19, font: FONT.heading, color: CSS.text, origin: 0 });
      const b = txt(this, -368, ry + 27, body, { size: 12, font: FONT.body, color: CSS.muted, origin: 0 });
      card.add([disc, ic, h, b]);
    });

    const close = button(this, {
      x: 0, y: 238, w: 250, h: 74, label: 'MENGERTI', variant: 'primary', fontSize: 18,
      onClick: () => this.closeHelp(),
    });
    card.add(close.container);
    overlay.add(card);
    card.setAlpha(0).setScale(.96);
    this.tweens.add({ targets: card, alpha: 1, scale: 1, duration: 180, ease: 'Back.Out' });
    this.helpModal = overlay;
  }

  closeHelp() {
    if (!this.helpOpen) return;
    this.helpOpen = false;
    const overlay = this.helpModal;
    this.helpModal = null;
    if (overlay) this.tweens.add({ targets: overlay, alpha: 0, duration: 140, onComplete: () => overlay.destroy(true) });
  }

  hideBoot() {
    document.getElementById('boot-screen')?.classList.add('hidden');
  }
}
