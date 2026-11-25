import { session } from '../core/session.js';
import { audio } from '../core/audio.js';
import {
  loadSettings, topLeaderboard, qualifiesForLeaderboard, addLeaderboardEntry,
} from '../core/storage.js';
import {
  txt, panel, button, imageButton, confettiBurst, goToScene, formatNumber,
  formatTimeLeft, sparkBurst,
} from '../ui/factory.js';
import { CSS, FONT, THEME } from '../config.js';

/** STATE 4A — DEFUSED / WIN + leaderboard initials entry. */
export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('Victory');
  }

  init(data) {
    this.preview = session.preview || data?.preview || null;
    this.demo = session.demo || !!data?.demo;
    this.entryOpen = false;
    this.entryLetters = [];
    this.savedEntry = null;
    this.autoSeconds = 30;
    this.saving = false;
    this.__leaving = false;
  }

  create() {
    this.settings = loadSettings();
    this.autoSeconds = Number(this.settings.autoResetSeconds) || 30;
    this.__audioClick = () => audio.sfx('click');
    this.input.enabled = true;
    audio.stopMusic();
    audio.setMusicLevel(0, false);

    this.add.image(960, 540, 'bg-game').setDisplaySize(1920, 1080).setDepth(0);
    this.add.rectangle(960, 540, 1920, 1080, 0x45d6a0, 0.10).setDepth(1);

    this.add.text(72, 44, 'MISSION COMPLETE // DEFUSED', {
      fontFamily: FONT.mono, fontSize: '10px', color: '#1B7A4A', letterSpacing: 2.2,
    }).setDepth(10);
    this.add.text(72, 66, `RONDE ${String(session.roundNumber).padStart(2, '0')} • ${session.difficulty.label} • ${session.players.length} PEMAIN`, {
      fontFamily: FONT.body, fontSize: '10px', color: CSS.muted, letterSpacing: .9,
      stroke: CSS.cream, strokeThickness: 3,
    }).setDepth(10);
    this.add.text(1848, 44, `SKOR ${formatNumber(session.score)}`, {
      fontFamily: FONT.mono, fontSize: '11px', color: CSS.red, letterSpacing: 1.2,
      stroke: CSS.cream, strokeThickness: 3,
    }).setOrigin(1, 0).setDepth(10);

    this.add.circle(154, 232, 74, THEME.green, .16).setDepth(4);
    this.add.image(154, 232, 'cut-check').setDisplaySize(104, 112).setDepth(5);
    this.title = txt(this, 240, 170, 'BOM DJINAKKAN!', {
      size: 74, font: FONT.display, color: CSS.green, stroke: CSS.ink, strokeThickness: 11, origin: 0,
    }).setDepth(10);
    this.title.setShadow(0, 7, '#0B5A38', 0, true, true);
    this.tweens.add({ targets: this.title, scale: { from: 0.88, to: 1 }, duration: 380, ease: 'Back.Out' });
    this.add.text(244, 278, `SISA WAKTU ${formatTimeLeft(session.timeLeft)}  •  ${session.solved}/${session.moduleCount} MODUL AMAN  •  ${session.strikes} STRIKE`, {
      fontFamily: FONT.heading, fontSize: '17px', color: CSS.text,
    }).setDepth(10);

    this.buildStats();
    this.leaderboardContainer = null;
    this.rebuildLeaderboard();
    this.buildButtons();

    confettiBurst(this, 60, { depth: 8, duration: 3400 });
    audio.sfx('win');
    this.cameras.main.fadeIn(320, 7, 13, 24);
    this.hideBoot();
    this.time.delayedCall(450, () => { window.__BC_READY = true; });

    if (!this.demo && !session.saved && this.qualifies()) {
      this.time.delayedCall(1600, () => this.openInitials());
    }

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.demo || this.entryOpen || this.__leaving) return;
        this.autoSeconds--;
        if (this.autoLabel) this.autoLabel.setText(`KEMBALI KE MENU DALAM ${this.autoSeconds} DETIK`);
        if (this.autoSeconds <= 0) goToScene(this, 'Attract', {}, { fade: 360 });
      },
    });
  }

  qualifies() {
    return qualifiesForLeaderboard(session.timeLeft, 5);
  }

  buildStats() {
    const x = 74, y = 326, w = 840, h = 548;
    panel(this, x, y, w, h, { depth: 10, fill: THEME.panel, alpha: .96, radius: 18 });
    this.add.text(x + 30, y + 24, 'RAPOR DEFUSAL', {
      fontFamily: FONT.mono, fontSize: '10px', color: CSS.muted, letterSpacing: 1.6,
    }).setDepth(12);
    const rows = [
      ['WAKTU TERSISA', formatTimeLeft(session.timeLeft), CSS.blue],
      ['MODUL AMAN', `${session.solved}/${session.moduleCount}`, CSS.green],
      ['STRIKE', `${session.strikes}/3`, session.strikes === 0 ? CSS.green : CSS.red],
      ['SABOTASE DIBERSIHKAN', `${session.sabotageCleared}`, CSS.purple],
      ['BONUS WAKTU', `+${Math.round(session.timeBonus || 0)} DETIK`, '#B45309'],
    ];
    rows.forEach(([label, value, color], i) => {
      const ry = y + 76 + i * 56;
      this.add.text(x + 32, ry, label, {
        fontFamily: FONT.body, fontSize: '11px', color: CSS.muted, letterSpacing: .8,
      }).setDepth(12);
      this.add.text(x + w - 32, ry - 4, value, {
        fontFamily: FONT.mono, fontSize: '20px', color,
      }).setOrigin(1, 0).setDepth(12);
      if (i < rows.length - 1) {
        this.add.rectangle(x + 32, ry + 33, w - 64, 1, THEME.border, .7).setOrigin(0, .5).setDepth(12);
      }
    });
    const scoreY = y + 388;
    const sg = this.add.graphics().setDepth(11);
    sg.fillStyle(THEME.panelRaised, .9).fillRoundedRect(x + 22, scoreY, w - 44, 124, 14);
    sg.lineStyle(1, THEME.yellow, .35).strokeRoundedRect(x + 22, scoreY, w - 44, 124, 14);
    this.add.text(x + 44, scoreY + 16, 'SKOR AKHIR TIM', {
      fontFamily: FONT.body, fontSize: '10px', color: CSS.muted, letterSpacing: 1.3,
    }).setDepth(12);
    this.add.text(x + w - 44, scoreY + 34, formatNumber(session.score), {
      fontFamily: FONT.heading, fontSize: '42px', color: CSS.red,
    }).setOrigin(1, 0).setDepth(12);
    const mvp = session.mvp;
    if (mvp) {
      this.add.text(x + 44, scoreY + 84, `MVP: ${mvp.name} • ${formatNumber(mvp.contribution)} POIN`, {
        fontFamily: FONT.body, fontSize: '10px', color: CSS.green, letterSpacing: .4,
      }).setDepth(12);
    }
    const contributions = session.players
      .map((p) => `${p.name} ${formatNumber(p.contribution)}`)
      .join('   •   ');
    this.add.text(x + 44, scoreY + 102, contributions, {
      fontFamily: FONT.mono, fontSize: '10px', color: CSS.dim, letterSpacing: .2,
    }).setDepth(12);
  }

  rebuildLeaderboard() {
    this.leaderboardContainer?.destroy(true);
    const c = this.add.container(0, 0).setDepth(10);
    this.leaderboardContainer = c;
    const list = topLeaderboard(5);
    const x = 990, y = 300, w = 856, h = 574;
    const p = panel(this, x, y, w, h, { depth: 10, fill: THEME.panel, alpha: .96, radius: 18 });
    c.add(p);
    const trophy = this.add.image(x + 44, y + 42, 'cut-trophy').setDisplaySize(34, 40);
    const t1 = txt(this, x + 72, y + 20, 'HALL OF FAME HARI INI', { size: 21, font: FONT.heading, color: CSS.text, origin: 0 });
    const t2 = txt(this, x + 72, y + 50, 'TOP 5 SISA WAKTU TERBESAR', { size: 9, font: FONT.mono, color: CSS.muted, origin: 0, letterSpacing: .8 });
    c.add([trophy, t1, t2]);
    const listStart = y + 88;
    if (!list.length) {
      c.add(txt(this, x + w / 2, y + 260, 'BELUM ADA SKOR HARI INI.\nJADILAH LEGENDA PERTAMA!', { size: 13, font: FONT.body, color: CSS.dim, lineSpacing: 6 }));
    }
    list.forEach((entry, i) => {
      const ry = listStart + i * 82;
      const isNew = this.savedEntry && entry.savedAt === this.savedEntry.savedAt;
      if (isNew) {
        const hi = this.add.graphics();
        hi.fillStyle(THEME.green, .1).fillRoundedRect(x + 24, ry - 2, w - 48, 72, 10);
        hi.lineStyle(1.5, THEME.green, .6).strokeRoundedRect(x + 24, ry - 2, w - 48, 72, 10);
        c.add(hi);
      }
      c.add(txt(this, x + 52, ry + 34, String(i + 1), { size: 22, font: FONT.heading, color: i === 0 ? CSS.red : CSS.muted }));
      c.add(txt(this, x + 116, ry + 14, entry.initials, { size: 22, font: FONT.heading, color: CSS.red, origin: 0, letterSpacing: 1.4 }));
      c.add(txt(this, x + 116, ry + 42, `${entry.players}P • ${entry.difficulty.toUpperCase()}`, { size: 9, font: FONT.body, color: CSS.dim, origin: 0, letterSpacing: .3 }));
      c.add(txt(this, x + w - 240, ry + 16, formatTimeLeft(entry.timeLeft), { size: 17, font: FONT.mono, color: CSS.blue, origin: 0 }));
      c.add(txt(this, x + w - 240, ry + 42, 'SISA WAKTU', { size: 8, font: FONT.mono, color: CSS.muted, origin: 0, letterSpacing: .3 }));
      c.add(txt(this, x + w - 40, ry + 30, formatNumber(entry.score), { size: 15, font: FONT.mono, color: CSS.text, origin: 1 }));
      if (i < list.length - 1) {
        const line = this.add.graphics();
        line.lineStyle(1, THEME.border, .6).lineBetween(x + 24, ry + 72, x + w - 24, ry + 72);
        c.add(line);
      }
    });

    if (!this.demo && !session.saved && this.qualifies()) {
      c.add(txt(this, x + w / 2, y + h - 26, 'SKOR LAYAK MASUK TOP 5 — INISIAL DIMINTA SEBENTAR LAGI', {
        size: 9, font: FONT.mono, color: '#8BE8BC', letterSpacing: .7,
      }));
    } else if (session.saved) {
      c.add(txt(this, x + w / 2, y + h - 26, 'SKOR TERSIMPAN DI PAPAN HARI INI', { size: 9.5, font: FONT.mono, color: '#8BE8BC', letterSpacing: .6 }));
    }
  }

  buildButtons() {
    this.replayBtn = imageButton(this, {
      x: 1090, y: 958, key: 'ui-retry', w: 290, h: 68, depth: 15,
      onClick: () => this.replay(),
    });
    this.homeBtn = button(this, {
      x: 1480, y: 958, w: 320, h: 86, label: 'LAYAR UTAMA', icon: 'icon-home', variant: 'ghost', fontSize: 17, depth: 15, iconScale: .45,
      onClick: () => this.home(),
    });
    this.autoLabel = this.add.text(74, 1006, `KEMBALI KE MENU DALAM ${this.autoSeconds} DETIK`, {
      fontFamily: FONT.mono, fontSize: '9px', color: CSS.muted, letterSpacing: .7,
      stroke: CSS.cream, strokeThickness: 3,
    }).setDepth(15);
    this.add.image(960, 1064, 'cut-hazard').setDisplaySize(1920, 24).setAlpha(.4).setDepth(4);
  }

  replay() {
    if (this.__leaving) return;
    audio.sfx('select');
    session.create({ playerCount: session.players.length, difficultyKey: session.difficultyKey });
    session.saved = false;
    session.preview = null;
    session.demo = false;
    goToScene(this, 'Briefing', {}, { fade: 300 });
  }

  home() {
    if (this.__leaving) return;
    audio.sfx('back');
    session.preview = null;
    session.demo = false;
    goToScene(this, 'Attract', {}, { fade: 300 });
  }

  openInitials() {
    if (this.entryOpen || session.saved || this.saving) return;
    if (this.demo) {
      sparkBurst(this, 960, 540, 0x45d6a0, 10, { scale: 0.3, speed: 120 });
      return;
    }
    if (!this.qualifies()) return;
    this.entryOpen = true;
    this.entryLetters = [];
    audio.sfx('select');
    const overlay = this.add.container(0, 0).setDepth(140);
    const dim = this.add.rectangle(960, 540, 1920, 1080, 0x05080f, .86).setInteractive();
    overlay.add(dim);
    const card = this.add.container(960, 540);
    const g = this.add.graphics();
    g.fillStyle(THEME.panel, 1).fillRoundedRect(-660, -360, 1320, 720, 24);
    g.lineStyle(1.5, THEME.border, 1).strokeRoundedRect(-659, -359, 1318, 718, 24);
    g.fillStyle(THEME.yellow, .9).fillRoundedRect(-630, -320, 4, 62, 2);
    card.add(g);
    card.add(txt(this, -604, -320, 'MASUK TOP 5 HARI INI!', { size: 34, font: FONT.display, color: CSS.red, origin: 0 }));
    card.add(txt(this, -604, -270, `MASUKKAN 3 INISIAL UNTUK SKOR ${formatNumber(session.score)}`, { size: 10, font: FONT.mono, color: CSS.muted, origin: 0, letterSpacing: 1.2 }));

    const slotObjs = [];
    const slots = [];
    for (let i = 0; i < 3; i++) {
      const x = -100 + i * 100;
      const box = this.add.container(x, -164);
      const bg = this.add.graphics();
      const letter = txt(this, 0, 0, '_', { size: 52, font: FONT.display, color: CSS.red });
      box.add([bg, letter]);
      card.add(box);
      slots.push(letter);
      slotObjs.push(bg);
    }
    this.slotLetters = slots;
    this.slotBgs = slotObjs;

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    alphabet.forEach((letter, i) => {
      const row = Math.floor(i / 9);
      const col = i % 9;
      const countInRow = row === 2 ? 8 : 9;
      const x = -(countInRow - 1) * 66 + col * 132;
      const y = -20 + row * 96;
      const k = this.add.container(x, y);
      const bg = this.add.graphics();
      bg.fillStyle(THEME.panelSoft, 1).fillRoundedRect(-46, -30, 92, 60, 8);
      bg.lineStyle(1, THEME.border, .95).strokeRoundedRect(-45.5, -29.5, 91, 59, 8);
      const lt = txt(this, 0, -1, letter, { size: 23, font: FONT.heading, color: CSS.text });
      const z = this.add.zone(0, 0, 100, 68).setOrigin(0.5).setInteractive({ useHandCursor: true });
      z.on('pointerdown', () => {
        if (this.entryLetters.length >= 3) return;
        audio.sfx('click');
        this.entryLetters.push(letter);
        this.refreshSlots();
        k.setScale(.94);
      });
      z.on('pointerup', () => k.setScale(1));
      k.add([bg, lt, z]);
      card.add(k);
    });

    const save = button(this, {
      x: 250, y: 300, w: 360, h: 82, label: 'SIMPAN SKOR', variant: 'success', fontSize: 21,
      onClick: () => this.saveScore(),
    });
    save.setDisabled(true);
    this.saveBtn = save;
    const skip = button(this, {
      x: -250, y: 300, w: 280, h: 82, label: 'LEWATI', variant: 'ghost', fontSize: 18,
      onClick: () => this.closeInitials(true),
    });
    const backspace = button(this, {
      x: 580, y: -164, w: 150, h: 86, label: 'HAPUS', variant: 'ghost', fontSize: 15,
      onClick: () => this.backspace(),
    });
    card.add([save.container, skip.container, backspace.container]);
    overlay.add(card);
    this.refreshSlots();
    card.setScale(0.94).setAlpha(0);
    this.tweens.add({ targets: card, scale: 1, alpha: 1, duration: 200, ease: 'Back.Out' });
    this.initialsOverlay = overlay;
    this.initialsCard = card;
  }

  refreshSlots() {
    for (let i = 0; i < 3; i++) {
      const l = this.entryLetters[i] || '_';
      this.slotLetters[i].setText(l);
      this.slotLetters[i].setColor(this.entryLetters[i] ? CSS.red : CSS.dim);
      const bg = this.slotBgs[i];
      bg.clear();
      bg.fillStyle(THEME.panelSoft, 1).fillRoundedRect(-44, -46, 88, 92, 10);
      bg.lineStyle(2, this.entryLetters[i] ? THEME.green : THEME.border, this.entryLetters[i] ? .9 : .7)
        .strokeRoundedRect(-44, -46, 88, 92, 10);
    }
    this.saveBtn?.setDisabled(this.entryLetters.length < 3);
  }

  backspace() {
    if (!this.entryLetters.length) return;
    audio.sfx('back');
    this.entryLetters.pop();
    this.refreshSlots();
  }

  saveScore() {
    if (this.entryLetters.length < 3 || this.saving) return;
    this.saving = true;
    const initials = this.entryLetters.join('');
    this.savedEntry = addLeaderboardEntry({
      initials,
      score: session.score,
      timeLeft: session.timeLeft,
      players: session.players.length,
      difficulty: session.difficultyKey,
      strikes: session.strikes,
    });
    session.saved = true;
    session.initials = initials;
    audio.sfx('solve');
    sparkBurst(this, 960, 540, 0x45d6a0, 24, { scale: 0.4, speed: 260 });
    this.closeInitials(false);
    this.rebuildLeaderboard();
  }

  closeInitials(skip = false) {
    if (!this.entryOpen) return;
    this.entryOpen = false;
    this.initialsOverlay?.destroy(true);
    this.initialsOverlay = null;
    this.autoSeconds = 30;
    if (skip) {
      session.saved = true;
      this.rebuildLeaderboard();
    }
  }

  hideBoot() {
    document.getElementById('boot-screen')?.classList.add('hidden');
  }
}
