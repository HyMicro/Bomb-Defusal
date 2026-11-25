import { PuzzleBase } from './PuzzleBase.js';
import { CIPHER_SYMBOLS, CSS, FONT } from '../config.js';
import { txt, sparkBurst } from '../ui/factory.js';
import { audio } from '../core/audio.js';

/**
 * Module 5 — Crowd Cipher.
 * The symbol→digit dictionary is projected in the "crowd zone" at the top of
 * the PID, far enough away that spectators naturally shout the answer.
 */
export class CrowdCipher extends PuzzleBase {
  constructor(scene, ctx) {
    super(scene, { ...ctx, moduleKey: 'cipher' });
  }

  build() {
    this.entry = [];
    this.pairs = [];
    this.sequence = [];
    this.keys = [];
    this.banner = null;

    const digits = Phaser.Utils.Array.Shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 6);
    this.pairs = Phaser.Utils.Array.Shuffle([...CIPHER_SYMBOLS]).map((sym, i) => ({ ...sym, digit: digits[i] }));
    this.sequence = Phaser.Utils.Array.Shuffle([...this.pairs]).slice(0, 3);
    this.code = this.sequence.map((p) => String(p.digit)).join('');

    this.instruction('BACA SIMBOL INI, LALU COCOKKAN DENGAN KAMUS DI ZONA ATAS!', { y: 134, size: 14, color: CSS.muted });

    const s = this.scene;
    // top "look up" arrow rail
    const rail = s.add.graphics();
    rail.fillStyle(0x45d6a0, 0.08).fillRoundedRect(150, 152, 260, 34, 10);
    rail.lineStyle(1, 0x45d6a0, 0.35).strokeRoundedRect(150, 152, 260, 34, 10);
    const up = s.add.image(280, 162, 'icon-arrow-up').setDisplaySize(18, 18).setTint(0x45d6a0);
    this.content.add([rail, up]);
    this.content.add(txt(s, 280, 177, 'KAMUS ADA DI ATAS LAYAR — MINTA PENONTON MEMBANTU!', {
      size: 10, font: FONT.body, color: '#1B7A4A', letterSpacing: 0.4,
    }));

    // symbol sequence
    this.sequence.forEach((sym, i) => {
      const x = 178 + i * 102;
      const c = s.add.container(x, 232);
      const g = s.add.graphics();
      g.fillStyle(0x070c15, 0.95).fillRoundedRect(-40, -42, 80, 84, 12);
      g.lineStyle(2, 0x45d6a0, 0.6).strokeRoundedRect(-40, -42, 80, 84, 12);
      g.fillStyle(0x45d6a0, 0.12).fillRoundedRect(-34, -36, 68, 26, 6);
      const icon = s.add.image(0, 8, sym.icon).setDisplaySize(46, 46).setTint(i === 1 ? 0x8cc6ff : 0x9cffd0);
      c.add([g, icon]);
      this.content.add(c);
      if (i < 2) {
        this.content.add(txt(s, x + 55, 232, '→', { size: 20, font: FONT.body, color: CSS.dim }));
      }
    });

    // entry boxes
    this.entryBoxes = [];
    for (let i = 0; i < 3; i++) {
      const x = 200 + i * 80;
      const box = s.add.container(x, 318);
      const g = s.add.graphics();
      g.fillStyle(0x05080f, 0.95).fillRoundedRect(-31, -28, 62, 56, 9);
      g.lineStyle(2, 0x596783, 0.8).strokeRoundedRect(-31, -28, 62, 56, 9);
      const t = txt(s, 0, 0, '_', { size: 32, font: FONT.mono, color: CSS.yellow });
      box.add([g, t]);
      this.content.add(box);
      this.entryBoxes.push({ g, t, x });
    }
    this.backspace = s.add.container(470, 318);
    const bimg = s.add.graphics();
    bimg.fillStyle(0x0d1624, 1).fillCircle(0, 0, 29);
    bimg.lineStyle(1.5, 0x2c3a54, .95).strokeCircle(0, 0, 28.25);
    const bicon = s.add.image(0, 0, 'icon-back').setDisplaySize(24, 24).setAlpha(.85);
    const bz = s.add.zone(0, 0, 88, 88).setOrigin(0.5).setInteractive({ useHandCursor: true });
    bz.on('pointerdown', () => this.backspaceDigit());
    this.backspace.add([bimg, bicon, bz]);
    this.content.add(this.backspace);

    this.content.add(txt(s, 280, 360, 'KETIK 3 ANGKA DI KEYPAD', { size: 9.5, font: FONT.mono, color: CSS.dim, letterSpacing: 0.7 }));

    // keypad
    for (let n = 0; n < 10; n++) {
      const col = n % 5;
      const row = Math.floor(n / 5);
      const x = 88 + col * 96;
      const y = 418 + row * 70;
      const c = s.add.container(x, y);
      const img = s.add.graphics();
      const paint = (pressed = false) => {
        img.clear();
        img.fillStyle(pressed ? 0x18243a : 0x0d1624, 1).fillRoundedRect(-42, -30, 84, 60, 10);
        img.lineStyle(1.5, pressed ? 0x4c9bff : 0x2c3a54, pressed ? .9 : .8).strokeRoundedRect(-42, -30, 84, 60, 10);
      };
      paint();
      const t = txt(s, 0, -2, String(n), { size: 28, font: FONT.display, color: CSS.cream });
      const zone = s.add.zone(0, 0, 90, 70).setOrigin(0.5).setInteractive({ useHandCursor: true });
      c.add([img, t, zone]);
      zone.on('pointerover', () => paint());
      zone.on('pointerout', () => { paint(); t.setY(-2); });
      zone.on('pointerdown', () => {
        paint(true);
        t.setY(0);
        this.addDigit(n);
      });
      zone.on('pointerup', () => { paint(); t.setY(-2); });
      this.content.add(c);
      this.keys.push({ c, img, t, zone, paint });
    }

    if (this.scene.showCipherBanner) {
      this.banner = this.scene.showCipherBanner(this.pairs, this.sequence);
      this.onCleanup(() => this.scene.hideCipherBanner?.());
    }

    this.updateEntryUI();
  }

  addDigit(n) {
    if (this.locked || this.solved) return;
    if (this.entry.length >= 3) return;
    audio.sfx('click');
    this.entry.push(String(n));
    this.updateEntryUI();
    this.spawnAt(280, 318, 0x45d6a0, 3, { scale: 0.2, speed: 70 });
    if (this.entry.length === 3) {
      this.scene.time.delayedCall(120, () => this.checkCode());
    }
  }

  backspaceDigit() {
    if (this.locked || this.solved) return;
    if (!this.entry.length) return;
    audio.sfx('back');
    this.entry.pop();
    this.updateEntryUI();
  }

  updateEntryUI() {
    this.entryBoxes.forEach((b, i) => {
      b.t.setText(this.entry[i] || '_');
      b.t.setColor(this.entry[i] ? CSS.yellow : '#52607b');
      b.g.clear();
      b.g.fillStyle(0x05080f, 0.95).fillRoundedRect(-31, -28, 62, 56, 9);
      b.g.lineStyle(2, this.entry[i] ? 0x45d6a0 : 0x596783, this.entry[i] ? 0.8 : 0.6).strokeRoundedRect(-31, -28, 62, 56, 9);
    });
  }

  checkCode() {
    if (this.solved || this.locked) return;
    const guess = this.entry.join('');
    if (guess === this.code) {
      audio.sfx('chime');
      this.spawnAt(280, 260, 0x45d6a0, 18, { scale: 0.36, speed: 190 });
      this.scene.hideCipherBanner?.();
      this.scene.time.delayedCall(260, () => this.solve());
      return;
    }
    this.mistake(3, 'SANDI SALAH! COBA LAGI DENGAN BANTUAN PENONTON. -3 DETIK');
    this.scene.tweens.add({ targets: this.entryBoxes.map((b) => b.t), x: '+=5', duration: 45, yoyo: true, repeat: 3 });
    this.scene.time.delayedCall(450, () => {
      if (this.solved) return;
      this.entry = [];
      this.updateEntryUI();
    });
  }

  demoState() {
    this.entry = [this.code[0], this.code[1]];
    this.updateEntryUI();
  }
}
