import { session } from '../core/session.js';
import { audio } from '../core/audio.js';
import { loadSettings, saveSettings } from '../core/storage.js';
import { txt, panel, iconButton, avatarBadge, imageButton, goToScene } from '../ui/factory.js';
import { CSS, FONT, THEME, PLAYERS, DIFFICULTIES, timeForDifficulty } from '../config.js';

/** Team + difficulty setup, reduced to essentials. */
export class TeamSelectScene extends Phaser.Scene {
  constructor() {
    super('TeamSelect');
  }

  init(data) {
    this.preview = data?.preview || null;
    this.__leaving = false;
    this.settings = loadSettings();
    this.selectedCount = 3;
    this.difficultyKey = this.settings.difficulty || 'standard';
  }

  create() {
    this.__audioClick = () => audio.sfx('click');
    this.input.enabled = true;
    this.add.image(960, 540, 'bg-menu').setDisplaySize(1920, 1080).setDepth(0);
    this.add.image(86, 76, 'logo-mark').setDisplaySize(64, 64).setDepth(5);
    this.add.text(132, 54, 'BOMB DEFUSAL', {
      fontFamily: FONT.heading, fontSize: '23px', color: CSS.text,
    }).setDepth(5);
    this.add.text(133, 82, 'CHAOS EDITION • Pilih tim, lalu jinakkan bom.', {
      fontFamily: FONT.body, fontSize: '10px', color: CSS.dim,
    }).setDepth(5);
    this.backBtn = iconButton(this, {
      x: 1840, y: 66, size: 54, icon: 'icon-back', variant: 'ghost', depth: 8,
      onClick: () => goToScene(this, 'Attract', {}, { fade: 220 }),
    });

    this.add.text(960, 138, 'PILIH PEMAIN', {
      fontFamily: FONT.heading, fontSize: '54px', color: CSS.text,
    }).setOrigin(.5).setDepth(8);
    this.add.text(960, 190, '2–4 pemain dalam satu tim. Semua tangan boleh membantu.', {
      fontFamily: FONT.body, fontSize: '14px', color: CSS.muted,
    }).setOrigin(.5).setDepth(8);

    this.buildDifficulty();
    this.buildCards();
    this.buildCta();

    this.cameras.main.fadeIn(240, 7, 13, 24);
    this.hideBoot();
    this.time.delayedCall(380, () => { window.__BC_READY = true; });
  }

  buildDifficulty() {
    const y = 256;
    this.diffButtons = [];
    ['casual', 'standard', 'chaos'].forEach((key, i) => {
      const diff = DIFFICULTIES[key];
      const cx = 960 + (i - 1) * 240;
      const c = this.add.container(cx, y).setDepth(9);
      const g = this.add.graphics();
      const led = this.add.image(-72, 0, i === 0 ? 'cut-btn-green' : i === 1 ? 'cut-btn-yellow' : 'cut-btn-red')
        .setDisplaySize(26, 24);
      const label = txt(this, -50, 0, diff.label, { size: 14, font: FONT.heading, color: CSS.muted, origin: 0 });
      const zone = this.add.zone(0, 0, 224, 52).setOrigin(.5).setInteractive({ useHandCursor: true });
      zone.on('pointerup', () => this.selectDifficulty(key));
      c.add([g, led, label, zone]);
      this.diffButtons.push({ key, c, g, label, led, w: 224, h: 52, accent: diff.color });
    });
    this.selectDifficulty(this.difficultyKey, true);
  }

  paintDifficultyChip(btn, selected) {
    btn.g.clear();
    if (selected) {
      btn.g.fillStyle(THEME.yellow, 1).fillRoundedRect(-btn.w / 2, -btn.h / 2, btn.w, btn.h, 12);
      btn.g.lineStyle(1.5, 0xffdf82, .95).strokeRoundedRect(-btn.w / 2 + .75, -btn.h / 2 + .75, btn.w - 1.5, btn.h - 1.5, 12);
    } else {
      btn.g.fillStyle(0xfff9ed, .98).fillRoundedRect(-btn.w / 2, -btn.h / 2, btn.w, btn.h, 12);
      btn.g.lineStyle(1.5, THEME.border, .65).strokeRoundedRect(-btn.w / 2 + .75, -btn.h / 2 + .75, btn.w - 1.5, btn.h - 1.5, 12);
    }
    btn.label.setColor(selected ? '#1B1406' : CSS.muted);
    btn.led.setAlpha(selected ? 1 : .4);
  }

  selectDifficulty(key, silent = false) {
    this.difficultyKey = key;
    if (!silent) audio.sfx('click');
    this.diffButtons.forEach((btn) => {
      this.paintDifficultyChip(btn, btn.key === key);
    });
    this.updateCta();
    this.cards?.forEach((card) => this.paintCard(card));
  }

  buildCards() {
    this.cards = [];
    const w = 330, h = 316, gap = 32;
    const start = 960 - (w * 3 + gap * 2) / 2;
    [2, 3, 4].forEach((count, i) => {
      const cx = start + i * (w + gap) + w / 2;
      const cy = 494;
      const c = this.add.container(cx, cy).setDepth(6);
      const bg = this.add.graphics();
      const number = txt(this, 0, -92, String(count), { size: 72, font: FONT.heading, color: CSS.text });
      const label = txt(this, 0, -34, 'PEMAIN', { size: 15, font: FONT.heading, color: CSS.muted, letterSpacing: 1.6 });
      const avatars = this.add.container(0, 30);
      for (let n = 0; n < count; n++) {
        const offset = (n - (count - 1) / 2) * (count === 2 ? 64 : count === 3 ? 60 : 56);
        const badge = avatarBadge(this, offset, 0, PLAYERS[n], count === 2 ? 62 : count === 3 ? 58 : 54, { number: false, ring: false });
        avatars.add(badge);
      }
      const time = txt(this, 0, 100, '', { size: 20, font: FONT.heading, color: CSS.blue });
      const check = this.add.image(w / 2 - 32, -h / 2 + 32, 'cut-check').setDisplaySize(30, 33);
      check.setAlpha(0);
      const zone = this.add.zone(0, 0, w, h).setOrigin(.5).setInteractive({ useHandCursor: true });
      zone.on('pointerup', () => this.selectCount(count));
      c.add([bg, number, label, avatars, time, check, zone]);
      const card = { count, c, bg, number, label, avatars, time, check, w, h };
      this.cards.push(card);
      this.paintCard(card);
    });
    this.selectCount(this.selectedCount, true);
  }

  paintCard(card) {
    const selected = card.count === this.selectedCount;
    card.c.setAlpha(1);
    this.tweens.add({ targets: card.c, scale: selected ? 1.02 : .97, duration: 160, ease: 'Quad.Out' });
    card.check.setAlpha(selected ? 1 : 0);
    card.number.setColor(selected ? CSS.red : CSS.text);
    card.bg.clear();
    card.bg.fillStyle(0x05080f, .35).fillRoundedRect(-card.w / 2 + 4, -card.h / 2 + 6, card.w, card.h, 18);
    card.bg.fillStyle(selected ? THEME.panelRaised : 0xfff9ed, .98).fillRoundedRect(-card.w / 2, -card.h / 2, card.w, card.h, 18);
    card.bg.lineStyle(selected ? 2 : 1, selected ? THEME.yellow : THEME.border, selected ? .95 : .8)
      .strokeRoundedRect(-card.w / 2 + .75, -card.h / 2 + .75, card.w - 1.5, card.h - 1.5, 18);
    card.time.setText(`${timeForDifficulty(this.difficultyKey, card.count)} detik`);
    card.time.setColor(selected ? CSS.blue : CSS.muted);
    card.label.setColor(selected ? CSS.muted : CSS.dim);
  }

  selectCount(count, silent = false) {
    this.selectedCount = count;
    if (!silent) audio.sfx('select');
    this.cards.forEach((card) => this.paintCard(card));
    this.updateCta();
  }

  buildCta() {
    const slab = this.add.graphics().setDepth(9);
    slab.fillStyle(0x1b1406, 1).fillRoundedRect(760, 766, 400, 72, 16);
    slab.lineStyle(3, THEME.yellow, .9).strokeRoundedRect(760, 766, 400, 72, 16);
    this.startBtn = imageButton(this, {
      x: 960, y: 800, key: 'ui-next', w: 380, h: 59, depth: 10,
      onClick: () => this.startBriefing(),
    });
    this.ctaSub = this.add.text(960, 842, '', {
      fontFamily: FONT.body, fontSize: '11px', color: CSS.muted, letterSpacing: .8,
    }).setOrigin(.5, 0).setDepth(8);
    this.updateCta();
    this.add.text(960, 872, 'Semua pemain berdiri berdampingan di depan layar.', {
      fontFamily: FONT.body, fontSize: '11px', color: CSS.dim,
    }).setOrigin(.5).setDepth(8);
  }

  updateCta() {
    if (!this.ctaSub) return;
    const diff = DIFFICULTIES[this.difficultyKey];
    const time = timeForDifficulty(this.difficultyKey, this.selectedCount);
    this.ctaSub.setText(`${this.selectedCount} PEMAIN • ${diff.label} • ${time} DETIK`);
  }

  startBriefing() {
    if (this.__leaving) return;
    audio.sfx('select');
    saveSettings({ difficulty: this.difficultyKey });
    session.create({ playerCount: this.selectedCount, difficultyKey: this.difficultyKey });
    session.preview = null;
    session.demo = false;
    goToScene(this, 'Story', {}, { fade: 240 });
  }

  hideBoot() {
    document.getElementById('boot-screen')?.classList.add('hidden');
  }
}
