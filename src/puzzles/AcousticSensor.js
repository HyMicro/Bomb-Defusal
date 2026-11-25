import { PuzzleBase } from './PuzzleBase.js';
import { CSS, FONT } from '../config.js';
import { txt, sparkBurst } from '../ui/factory.js';
import { audio } from '../core/audio.js';

/**
 * Module 6 — Acoustic Sensor (simulated tap/VU mode).
 * A: rapidly tap the meter to imitate a crowd shout ("JINAK!").
 * B: stay completely silent — physically do not touch — for 3 seconds.
 *
 * Real microphone input is an optional hardware extension; this build uses the
 * PID touch surface so it works on every panel without permissions.
 */
export class AcousticSensor extends PuzzleBase {
  constructor(scene, ctx) {
    super(scene, { ...ctx, moduleKey: 'acoustic', variant: ctx.variant || (Math.random() < 0.55 ? 'A' : 'B') });
  }

  build() {
    this.power = 0;
    this.silence = 0;
    this.taps = 0;
    this.lastTap = 0;
    if (this.variant === 'B') this.buildSilence();
    else this.buildShout();
  }

  baseMeter() {
    const s = this.scene;
    this.meter = s.add.image(280, 360, 'vu-meter').setDisplaySize(430, 265);
    this.content.add(this.meter);
    this.levelBar = s.add.graphics();
    this.content.add(this.levelBar);
    this.levelText = txt(s, 280, 506, '0%', { size: 21, font: FONT.mono, color: CSS.green, letterSpacing: 1 });
    this.content.add(this.levelText);
    this.pad = s.add.zone(280, 360, 440, 300).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.content.add(this.pad);
    this.ticks = 22;
  }

  drawMeter(ratio) {
    const r = Phaser.Math.Clamp(ratio, 0, 1);
    this.levelBar.clear();
    const x = 88;
    const y = 444;
    const w = 384;
    const h = 20;
    this.levelBar.fillStyle(0x05080f, 0.95).fillRoundedRect(x, y, w, h, 7);
    if (r > 0.005) {
      const color = r > 0.8 ? 0xf2555f : r > 0.55 ? 0xffc93c : 0x45d6a0;
      this.levelBar.fillStyle(color, 1).fillRoundedRect(x + 4, y + 4, (w - 8) * r, h - 8, 4);
      this.levelBar.fillStyle(0xffffff, 0.25).fillRoundedRect(x + 10, y + 6, Math.max(0, (w - 8) * r - 12), 3, 2);
    }
    this.levelBar.lineStyle(2, 0x59657f, 0.65).strokeRoundedRect(x, y, w, h, 7);
    this.levelText?.setText(`${Math.round(r * 100)}%`).setColor(r > 0.8 ? CSS.red : r > 0.55 ? CSS.yellow : CSS.green);
  }

  buildShout() {
    const s = this.scene;
    this.instruction('KETUK CEPAT ATAU TERIAKKAN “JINAK!” BERSAMA PENONTON!', { y: 138, size: 15 });
    this.baseMeter();
    const mic = s.add.image(280, 388, 'icon-mic').setDisplaySize(66, 66).setTint(0x45d6a0).setAlpha(0.9);
    this.content.add(mic);
    this.scene.tweens.add({ targets: mic, scale: 1.1, duration: 420, yoyo: true, repeat: -1 });
    this.content.add(txt(s, 280, 316, 'KETUK DI SINI', { size: 11, font: FONT.mono, color: CSS.muted, letterSpacing: 1.4 }));
    this.content.add(txt(s, 280, 534, 'SIMULASI SENSOR • 10 KETUKAN CEPAT', { size: 9.5, font: FONT.mono, color: CSS.dim, letterSpacing: 0.6 }));
    this.tapLabel = txt(s, 490, 358, '×0', { size: 13, font: FONT.mono, color: CSS.yellow, origin: 1 });
    this.content.add(this.tapLabel);

    this.pad.on('pointerdown', () => {
      if (this.locked || this.solved) return;
      const now = performance.now();
      if (now - this.lastTap < 55) return;
      this.lastTap = now;
      this.taps += 1;
      this.power = Math.min(1, this.power + 0.105);
      audio.sfx('spark');
      this.scene.tweens.add({ targets: this.meter, scaleX: 1.03, scaleY: 1.03, duration: 55, yoyo: true });
      const wp = this.worldPoint(280, 400);
      sparkBurst(this.scene, wp.x + Phaser.Math.Between(-100, 100), wp.y + Phaser.Math.Between(-15, 35), 0x45d6a0, 3, { scale: 0.22, speed: 90 });
      if (this.power >= 1) {
        this.drawMeter(1);
        this.solve();
      }
    });
    this.drawMeter(0);
  }

  buildSilence() {
    const s = this.scene;
    this.instruction('DIAM TOTAL! JANGAN SENTUH SELAMA 3 DETIK.', { y: 138, size: 17, color: CSS.blue });
    this.baseMeter();
    this.content.add(txt(s, 280, 390, 'HENING', { size: 42, font: FONT.display, color: CSS.blue, letterSpacing: 3 }));
    this.content.add(txt(s, 280, 432, 'JANGAN SENTUH LAYAR', { size: 11, font: FONT.mono, color: CSS.muted, letterSpacing: 2 }));
    this.content.add(txt(s, 280, 534, 'PENONTON SERING ISENG — BERTAHAN!', { size: 9.5, font: FONT.mono, color: CSS.dim, letterSpacing: 0.6 }));
    this.silenceLabel = txt(s, 280, 486, '0.0 / 3.0 DETIK', { size: 11, font: FONT.mono, color: CSS.muted, letterSpacing: 1 });
    this.content.add(this.silenceLabel);
    this.pad.on('pointerdown', () => {
      if (this.locked || this.solved) return;
      this.silence = 0;
      audio.sfx('deny');
      this.scene.tweens.add({ targets: this.meter, x: 288, duration: 35, yoyo: true, repeat: 3, onComplete: () => { this.meter.x = 280; } });
      this.mistake(2, 'ADA SUARA/SENTUHAN! RESET HENING. -2 DETIK');
      this.scene.tweens.add({ targets: this.levelText, alpha: 0.3, duration: 80, yoyo: true, repeat: 2 });
    });
    this.drawMeter(0);
  }

  update(time, delta) {
    if (this.solved || this.locked) return;
    if (this.variant === 'A') {
      this.power = Math.max(0, this.power - (Math.min(64, delta) / 1000) * 0.045);
      this.drawMeter(this.power);
      if (this.tapLabel) this.tapLabel.setText(`×${this.taps}`);
    } else {
      this.silence += Math.min(64, delta);
      const r = Math.min(1, this.silence / 3000);
      this.drawMeter(1 - r * 0.45);
      if (this.silenceLabel) this.silenceLabel.setText(`${(this.silence / 1000).toFixed(1)} / 3.0 DETIK`).setColor(r >= 1 ? CSS.green : CSS.muted);
      if (this.silence >= 3000) this.solve();
    }
  }

  demoState() {
    if (this.variant === 'A') {
      this.power = 0.62;
      this.taps = 6;
      if (this.tapLabel) this.tapLabel.setText('×6');
      this.drawMeter(0.62);
    } else {
      this.silence = 1800;
      this.drawMeter(0.72);
      if (this.silenceLabel) this.silenceLabel.setText('1.8 / 3.0 DETIK');
    }
  }
}
