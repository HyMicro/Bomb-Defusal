import { PuzzleBase } from './PuzzleBase.js';
import { CSS, FONT } from '../config.js';
import { txt, sparkBurst } from '../ui/factory.js';
import { audio } from '../core/audio.js';

/**
 * Module 3 — Reverse Psychology.
 * A: do NOT touch the giant red button for 4 seconds.
 * B: "Press now!" — unless the button is blue (small print trap).
 */
export class ReversePsychology extends PuzzleBase {
  constructor(scene, ctx) {
    super(scene, { ...ctx, moduleKey: 'reverse', variant: ctx.variant || (Math.random() < 0.55 ? 'A' : 'B') });
    this.startInternal();
  }

  build() {
    this.colorKey = 'red';
    this.internalMs = 0;
    this.internalMax = 4000;
    this.tapped = false;
    this.buttonBase = null;
    this.buttonZone = null;
    this.internalBar = null;
    this.internalLabel = null;
    this.countText = null;
    this.holdTarget = 4000;
  }

  startInternal() {
    if (this.variant === 'B') {
      this.colorKey = Math.random() < 0.45 ? 'blue' : (Math.random() < 0.5 ? 'red' : 'green');
      this.internalMax = this.colorKey === 'blue' ? 3200 : 99999;
      this.holdTarget = this.internalMax;
    }
    this.buildUI();
  }

  buildUI() {
    const s = this.scene;
    const isBlueTrap = this.variant === 'B' && this.colorKey === 'blue';
    const instruction = this.variant === 'A'
      ? 'JANGAN SENTUH TOMBOL MERAH SELAMA 4 DETIK!'
      : 'TEKAN SEKARANG!';
    this.instruction(instruction, { y: 142, size: 20, color: this.variant === 'A' ? CSS.red : CSS.text });
    if (this.variant === 'B') {
      this.content.add(txt(s, 280, 178, isBlueTrap ? '(kecuali jika warna tombolnya BIRU — tahan 3 detik)' : '(jika tombol BIRU, jangan tekan)', {
        size: 12, font: FONT.body, color: CSS.muted,
      }));
    }

    const texture = this.colorKey === 'blue' ? 'button-blue' : this.colorKey === 'green' ? 'button-green' : 'button-red';
    this.buttonBase = s.add.container(280, 352).setAngle(this.variant === 'B' ? -1.5 : 0);
    const glow = s.add.ellipse(0, 18, 402, 310, this.colorKey === 'blue' ? 0x4c9bff : this.colorKey === 'green' ? 0x45d6a0 : 0xf2555f, 0.1).setBlendMode(Phaser.BlendModes.ADD);
    const img = s.add.image(0, 0, texture).setDisplaySize(420, 310);
    const label = txt(s, 0, -28, this.variant === 'A' ? 'JANGAN DITEKAN!' : 'TEKAN SEKARANG!', {
      size: 35, font: FONT.display, color: this.variant === 'A' ? '#FFF4DF' : '#FFFFFF',
      stroke: CSS.ink, strokeThickness: 6,
    }).setAngle(this.variant === 'A' ? -4 : -2);
    const warning = txt(s, 0, 18, this.variant === 'A' ? 'TAHAN DIRI • 4 DETIK' : (isBlueTrap ? 'TUNGGU SAMPAI AMAN' : 'TOMBOL INI BUKAN BIRU'), {
      size: 11, font: FONT.mono, color: 'rgba(255,255,255,.8)', letterSpacing: 2,
    });
    this.buttonBase.add([glow, img, label, warning]);
    this.content.add(this.buttonBase);

    if (this.variant === 'B') {
      const chip = s.add.container(280, 508);
      const g = s.add.graphics();
      const c = this.colorKey === 'blue' ? 0x4c9bff : this.colorKey === 'green' ? 0x45d6a0 : 0xf2555f;
      g.fillStyle(0x070b13, 0.9).fillRoundedRect(-92, -17, 184, 34, 10);
      g.lineStyle(2, c, 0.8).strokeRoundedRect(-92, -17, 184, 34, 10);
      const ct = txt(s, 0, 0, `WARNA: ${this.colorKey === 'blue' ? 'BIRU' : this.colorKey === 'green' ? 'HIJAU' : 'MERAH'}`, {
        size: 12, font: FONT.mono, color: this.colorKey === 'blue' ? '#8CC6FF' : this.colorKey === 'green' ? '#9CFFD0' : '#FF8B92', letterSpacing: 0.7,
      });
      chip.add([g, ct]);
      this.content.add(chip);
      this.colorChip = chip;
    }

    if (this.internalMax < 99999) {
      this.internalBarBg = s.add.graphics();
      this.internalBarBg.fillStyle(0x05080f, 0.9).fillRoundedRect(92, 466, 376, 22, 11);
      this.internalBarBg.lineStyle(2, 0x39445d, 1).strokeRoundedRect(92, 466, 376, 22, 11);
      this.internalBar = s.add.graphics();
      this.internalLabel = txt(s, 280, 448, '', { size: 10, font: FONT.mono, color: CSS.yellow, letterSpacing: 2 });
      this.content.add([this.internalBarBg, this.internalBar, this.internalLabel]);
    } else {
      this.internalLabel = txt(s, 280, 466, 'TIDAK BIRU → TEKAN SEKARANG!', { size: 11, font: FONT.mono, color: CSS.yellow, letterSpacing: 1 });
      this.content.add(this.internalLabel);
    }

    this.buttonZone = s.add.zone(280, 352, 450, 350).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.content.add(this.buttonZone);
    this.buttonZone.on('pointerdown', () => this.pressButton());

    // decoy microcopy at the bottom
    this.content.add(txt(s, 280, 540, this.variant === 'A' ? 'JANGAN. SENTUH. APA. PUN.' : 'BACA KECIL-KECIL, JANGAN PANIK.', {
      size: 10, font: FONT.mono, color: CSS.muted, letterSpacing: 1,
    }));
    this.updateInternalUI();
  }

  pressButton() {
    if (this.locked || this.solved) return;
    if (this.variant === 'A') {
      audio.sfx('error');
      this.internalMs = 0;
      this.scene.tweens.add({ targets: this.buttonBase, scale: 0.94, duration: 70, yoyo: true });
      this.spawnTouchedX();
      if (this.mistake(5, 'JANGAN DITEKAN! -5 DETIK & 1 STRIKE')) {
        this._notify('TUNGGU 4 DETIK TANPA MENYENTUH!', 'warn');
        this.updateInternalUI();
      }
    } else if (this.colorKey === 'blue') {
      audio.sfx('error');
      this.internalMs = 0;
      this.scene.tweens.add({ targets: this.buttonBase, scale: 0.94, duration: 70, yoyo: true });
      this.spawnTouchedX();
      this.mistake(3, 'TOMBOL BIRU = JANGAN DITEKAN! -3 DETIK');
      this.updateInternalUI();
    } else {
      audio.sfx('chime');
      this.spawnAt(280, 350, this.colorKey === 'green' ? 0x45d6a0 : 0xf2555f, 18, { scale: 0.4, speed: 220 });
      this.scene.tweens.add({ targets: this.buttonBase, scale: 1.1, alpha: 0.25, duration: 280 });
      this.solve();
    }
  }

  spawnTouchedX() {
    const s = this.scene;
    const x = s.add.image(280, 352, 'icon-cross').setDisplaySize(86, 86).setTint(0xf2555f).setAlpha(0);
    this.content.add(x);
    s.tweens.add({ targets: x, alpha: 1, scale: 1.2, duration: 100, yoyo: true, hold: 120, onComplete: () => x.destroy() });
  }

  update(time, delta) {
    if (this.solved || this.locked) return;
    if (this.variant === 'A' || (this.variant === 'B' && this.colorKey === 'blue')) {
      this.internalMs += Math.min(64, delta);
      if (this.internalMs >= this.internalMax) {
        this.internalMs = this.internalMax;
        this.updateInternalUI();
        this.solve();
        return;
      }
      if (this.colorKey === 'blue') this.holdTarget = this.internalMax;
      this.updateInternalUI();
    }
  }

  updateInternalUI() {
    if (!this.internalBar) {
      if (this.internalLabel && this.variant === 'B' && this.colorKey !== 'blue') {
        this.internalLabel.setText('TIDAK BIRU → TEKAN SEKARANG!');
      }
      return;
    }
    const r = this.internalMax > 0 ? Phaser.Math.Clamp(this.internalMs / this.internalMax, 0, 1) : 0;
    this.internalBar.clear();
    const w = 368 * r;
    const done = r >= 1;
    if (w > 2) {
      this.internalBar.fillStyle(done ? 0x45d6a0 : 0xffc93c, 1).fillRoundedRect(96, 470, w, 14, 7);
      this.internalBar.fillStyle(0xffffff, 0.3).fillRoundedRect(101, 472, Math.max(0, w - 10), 3, 2);
    }
    this.internalLabel.setText(done ? 'AMAN!' : `TAHAN DIRI ${(Math.max(0, this.internalMax - this.internalMs) / 1000).toFixed(1)} DETIK`)
      .setColor(done ? CSS.green : CSS.yellow);
  }

  demoState() {
    if (this.variant === 'A') {
      this.internalMs = 2680;
      this.updateInternalUI();
    } else if (this.colorKey === 'blue') {
      this.internalMs = 1900;
      this.updateInternalUI();
    }
  }
}
