import { PuzzleBase } from './PuzzleBase.js';
import { CSS, FONT } from '../config.js';
import { txt, sparkBurst } from '../ui/factory.js';
import { audio } from '../core/audio.js';

/**
 * Module 1 — Dual-Hand Anchor.
 * A: hold the left biometric scanner while dragging the lever fully right.
 * B: hold both scanners at the same time for 2.5 seconds.
 */
export class DualHandAnchor extends PuzzleBase {
  constructor(scene, ctx) {
    super(scene, { ...ctx, moduleKey: 'dualHand', variant: ctx.variant || (Math.random() < 0.55 ? 'A' : 'B') });
    this.buildVariant();
  }

  build() {
    this.holdLeft = false;
    this.holdRight = false;
    this.leftPointer = null;
    this.rightPointer = null;
    this.drag = null;
    this.progress = 0;
    this.solvedInternal = false;
    this.padLeft = null;
    this.padRight = null;
    this.handle = null;
    this.needle = null;
    this.electric = [];
  }

  buildVariant() {
    if (this.variant === 'B') this.buildStretch();
    else this.buildHoldDrag();
  }

  baseProgressBar(label) {
    const s = this.scene;
    this.progressLabel = txt(s, 88, 185, label, { size: 10.5, font: FONT.mono, color: CSS.muted, origin: 0, letterSpacing: 0.7 });
    this.progressPct = txt(s, 488, 185, '0%', { size: 13, font: FONT.mono, color: CSS.blue, origin: 1 });
    this.progressBg = s.add.graphics();
    this.progressBg.fillStyle(0x05080f, 0.9).fillRoundedRect(82, 204, 396, 20, 10);
    this.progressBg.lineStyle(2, 0x38445e, 0.8).strokeRoundedRect(82, 204, 396, 20, 10);
    this.progressBg.lineStyle(1, 0xffffff, 0.12).lineBetween(96, 208, 462, 208);
    this.progressFill = s.add.graphics();
    this.content.add([this.progressLabel, this.progressPct, this.progressBg, this.progressFill]);
  }

  drawProgress(ratio, color = 0x4c9bff) {
    const r = Phaser.Math.Clamp(ratio, 0, 1);
    this.progressFill.clear();
    if (r > 0.002) {
      this.progressFill.fillStyle(color, 1).fillRoundedRect(86, 208, 388 * r, 12, 6);
      this.progressFill.fillStyle(0xffffff, 0.35).fillRoundedRect(92, 210, Math.max(0, 388 * r - 12), 3, 2);
    }
    this.progressPct.setText(`${Math.round(r * 100)}%`).setColor(r > 0.99 ? CSS.green : CSS.blue);
  }

  buildHoldDrag() {
    const s = this.scene;
    this.instruction('TAHAN SENSOR KIRI, LALU GESER TUAS MERAH KE KANAN!', { y: 144, size: 16 });
    this.baseProgressBar('SINKRONISASI DUA TANGAN');

    // biometric scanner
    this.scanner = s.add.image(150, 334, 'puzzle-scanner').setDisplaySize(212, 212);
    this.scannerRing = s.add.circle(150, 334, 94, 0x45d6a0, 0).setStrokeStyle(4, 0x45d6a0, 0.35);
    this.holdLabel = txt(s, 150, 462, 'TANGAN KIRI — TAHAN', { size: 10, font: FONT.body, color: '#1B7A4A', letterSpacing: 1 });
    this.zoneLeft = s.add.zone(150, 334, 204, 204).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.arc = s.add.image(272, 314, 'fx-electric').setDisplaySize(220, 72).setAlpha(0.18).setBlendMode(Phaser.BlendModes.ADD);
    this.content.add([this.scanner, this.scannerRing, this.holdLabel, this.arc, this.zoneLeft]);

    // lever track
    this.leverTrack = s.add.image(397, 452, 'lever-track').setDisplaySize(280, 76);
    this.leverZone = s.add.zone(397, 452, 280, 96).setOrigin(0.5);
    this.handle = s.add.image(329, 420, 'lever-handle').setDisplaySize(65, 101);
    this.handle.setInteractive({ useHandCursor: true, draggable: false });
    this.handleBase = { x: 329, y: 420 };
    this.handleMin = 318;
    this.handleMax = 478;
    this.dragLabel = txt(s, 397, 514, 'TANGAN KANAN — GESER KE KANAN', { size: 10, font: FONT.body, color: '#B45309', letterSpacing: 1 });
    this.lock = s.add.image(280, 350, 'icon-lock').setDisplaySize(26, 26).setAlpha(0.22).setTint(0x4c9bff);
    this.content.add([this.leverTrack, this.leverZone, this.handle, this.dragLabel, this.lock]);

    this.zoneLeft.on('pointerdown', (pointer) => {
      if (this.locked || this.solved) return;
      this.holdLeft = true;
      this.leftPointer = pointer.id;
      audio.sfx('spark');
      this.scanner.setTint(0xb9ffe0);
      this.scannerRing.setStrokeStyle(5, 0x45d6a0, 0.95);
      this.holdLabel.setText('TANGAN KIRI — TERKUNCI').setColor(CSS.green);
      this.scene.tweens.add({ targets: this.scannerRing, scale: 1.1, alpha: 0.9, duration: 180, yoyo: true });
      this.checkSolved();
    });

    const onUp = (pointer) => {
      if (this.leftPointer === pointer.id) {
        this.holdLeft = false;
        this.leftPointer = null;
        this.scanner.clearTint();
        this.scannerRing.setStrokeStyle(4, 0x45d6a0, 0.35).setScale(1);
        this.holdLabel.setText('TANGAN KIRI — TAHAN').setColor(CSS.green);
        if (!this.solvedInternal && this.drag) this.snapBack();
      }
      if (this.drag && this.drag.pointerId === pointer.id) this.endDrag(pointer);
    };
    s.input.on('pointerup', onUp);
    this.onCleanup(() => s.input.off('pointerup', onUp));

    this.handle.on('pointerdown', (pointer) => {
      if (this.locked || this.solved || this.drag) return;
      this.drag = { pointerId: pointer.id, startPointerX: pointer.x, startHandleX: this.handle.x };
      this.rightPointer = pointer.id;
      this.handle.setTint(0xffd8d8);
      audio.sfx('click');
    });

    const onMove = (pointer) => {
      if (!this.drag || this.drag.pointerId !== pointer.id) return;
      const dx = pointer.x - this.drag.startPointerX;
      this.handle.x = Phaser.Math.Clamp(this.drag.startHandleX + dx, this.handleMin, this.handleMax);
      const ratio = (this.handle.x - this.handleMin) / (this.handleMax - this.handleMin);
      this.drawProgress(ratio * (this.holdLeft ? 1 : 0.55), this.holdLeft ? 0x45d6a0 : 0xffb45e);
      if (!this.holdLeft && ratio > 0.7) this._notify('TAHAN SENSOR KIRI DULU!', 'warn');
      this.checkSolved();
    };
    s.input.on('pointermove', onMove);
    this.onCleanup(() => s.input.off('pointermove', onMove));

    this.onCleanup(() => {
      this.holdLeft = false;
      this.drag = null;
    });
  }

  endDrag(pointer) {
    if (!this.drag) return;
    if (this.solvedInternal || this.locked) {
      this.drag = null;
      this.rightPointer = null;
      return;
    }
    const ratio = (this.handle.x - this.handleMin) / (this.handleMax - this.handleMin);
    const held = this.holdLeft;
    this.drag = null;
    this.rightPointer = null;
    this.handle.clearTint();
    if (ratio >= 0.96 && held) {
      this.solveNow();
      return;
    }
    if (ratio > 0.5) this._notify(held ? 'TARIK SAMPAI UJUNG!' : 'TANGAN KIRI TERLEPAS — TUAS MENTAL!', 'warn');
    this.snapBack();
  }

  snapBack() {
    if (this.handle.x <= this.handleMin + 1) return;
    audio.sfx('deny');
    this.scene.tweens.add({
      targets: this.handle, x: this.handleMin, duration: 260, ease: 'Back.In',
      onUpdate: () => {
        const ratio = (this.handle.x - this.handleMin) / (this.handleMax - this.handleMin);
        this.drawProgress(ratio * 0.55, 0xffb45e);
      },
      onComplete: () => this.drawProgress(0),
    });
  }

  checkSolved() {
    if (this.solvedInternal || this.locked) return;
    const ratio = (this.handle.x - this.handleMin) / (this.handleMax - this.handleMin);
    if (ratio >= 0.96 && this.holdLeft) {
      this.solveNow();
    }
  }

  solveNow() {
    if (this.solvedInternal) return;
    this.solvedInternal = true;
    this.rightPointer = null;
    this.holdLeft = false;
    this.drawProgress(1, 0x45d6a0);
    this.arc.setAlpha(0.9);
    this.spawnAt(240, 350, 0x45d6a0, 14, { scale: 0.35, speed: 180 });
    this.solve();
  }

  /* ---------------- Variant B: stretch & hold ---------------- */
  buildStretch() {
    const s = this.scene;
    this.instruction('RENTANGKAN KEDUA TANGAN — TAHAN DUA SENSOR SELAMA 2,5 DETIK!', { y: 144, size: 16 });
    this.baseProgressBar('RENTANGAN SENSOR');

    this.padLeft = s.add.image(145, 340, 'puzzle-scanner').setDisplaySize(204, 204);
    this.padRight = s.add.image(415, 340, 'puzzle-scanner').setDisplaySize(204, 204);
    this.ringLeft = s.add.circle(145, 340, 90, 0x4c9bff, 0).setStrokeStyle(4, 0x4c9bff, 0.35);
    this.ringRight = s.add.circle(415, 340, 90, 0x4c9bff, 0).setStrokeStyle(4, 0x4c9bff, 0.35);
    this.electric = s.add.image(280, 334, 'fx-electric').setDisplaySize(200, 82).setAlpha(0.14).setBlendMode(Phaser.BlendModes.ADD);
    this.leftZone = s.add.zone(145, 340, 200, 210).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.rightZone = s.add.zone(415, 340, 200, 210).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.leftLabel = txt(s, 145, 458, 'TANGAN KIRI', { size: 11, font: FONT.body, color: CSS.blue, letterSpacing: 1 });
    this.rightLabel = txt(s, 415, 458, 'TANGAN KANAN', { size: 11, font: FONT.body, color: CSS.purple, letterSpacing: 1 });
    this.centerCounter = txt(s, 280, 486, '0.0 / 2.5 DETIK', { size: 13, font: FONT.mono, color: '#8FA0C4', letterSpacing: 1 });
    this.content.add([this.padLeft, this.padRight, this.ringLeft, this.ringRight, this.electric,
      this.leftZone, this.rightZone, this.leftLabel, this.rightLabel, this.centerCounter]);

    this.holdLeft = false;
    this.holdRight = false;
    this.leftPointers = new Set();
    this.rightPointers = new Set();
    this.holdMs = 0;

    const downL = (pointer) => {
      if (this.locked || this.solved) return;
      this.leftPointers.add(pointer.id);
      this.holdLeft = true;
      audio.sfx('spark');
      this.ringLeft.setFillStyle(0x4c9bff, 0.25).setStrokeStyle(5, 0x4c9bff, 1);
      this.padLeft.setTint(0xcfe9ff);
      this.leftZone.setScale(1.03);
      this.scene.tweens.add({ targets: this.leftLabel, scale: 1.12, duration: 120, yoyo: true });
    };
    const downR = (pointer) => {
      if (this.locked || this.solved) return;
      this.rightPointers.add(pointer.id);
      this.holdRight = true;
      audio.sfx('spark');
      this.ringRight.setFillStyle(0xb55ddc, 0.25).setStrokeStyle(5, 0xb55ddc, 1);
      this.padRight.setTint(0xe9ccff);
      this.rightZone.setScale(1.03);
      this.scene.tweens.add({ targets: this.rightLabel, scale: 1.12, duration: 120, yoyo: true });
    };
    this.leftZone.on('pointerdown', downL);
    this.rightZone.on('pointerdown', downR);
    const up = (pointer) => {
      if (this.leftPointers.delete(pointer.id)) {
        this.holdLeft = this.leftPointers.size > 0;
        if (!this.holdLeft) {
          this.ringLeft.setFillStyle(0x4c9bff, 0).setStrokeStyle(4, 0x4c9bff, 0.35);
          this.padLeft.clearTint(); this.leftZone.setScale(1);
        }
      }
      if (this.rightPointers.delete(pointer.id)) {
        this.holdRight = this.rightPointers.size > 0;
        if (!this.holdRight) {
          this.ringRight.setFillStyle(0xb55ddc, 0).setStrokeStyle(4, 0xb55ddc, 0.35);
          this.padRight.clearTint(); this.rightZone.setScale(1);
        }
      }
    };
    s.input.on('pointerup', up);
    this.onCleanup(() => s.input.off('pointerup', up));
  }

  update(time, delta) {
    if (this.variant !== 'B' || this.solved || this.locked) return;
    const dt = Math.min(64, delta);
    if (this.holdLeft && this.holdRight) {
      this.holdMs += dt;
      this.electric.setAlpha(0.5 + Math.random() * 0.4);
      this.arcPulse = (this.arcPulse || 0) + dt;
      if (this.arcPulse > 180) {
        this.arcPulse = 0;
        this.spawnAt(280 + Phaser.Math.Between(-65, 65), 300 + Phaser.Math.Between(-40, 40), 0x8fe7ff, 2, { scale: 0.22, speed: 70 });
      }
    } else {
      this.holdMs = Math.max(0, this.holdMs - dt * 1.35);
      this.electric.setAlpha(0.14);
    }
    const ratio = Math.min(1, this.holdMs / 2500);
    this.drawProgress(ratio, this.holdLeft && this.holdRight ? 0x45d6a0 : 0x4c9bff);
    this.centerCounter.setText(`${(this.holdMs / 1000).toFixed(1)} / 2.5 DETIK`)
      .setColor(ratio >= 1 ? CSS.green : '#8FA0C4');
    if (this.leftLabel) this.leftLabel.setColor(this.holdLeft ? CSS.green : CSS.blue);
    if (this.rightLabel) this.rightLabel.setColor(this.holdRight ? CSS.green : CSS.purple);
    if (this.holdMs >= 2500) {
      this.drawProgress(1, 0x45d6a0);
      this.electric.setAlpha(1);
      this.spawnAt(280, 334, 0x45d6a0, 18, { scale: 0.4, speed: 220 });
      this.solve();
      return;
    }
    if (this.holdLeft && this.holdRight) {
      this.electric.setAlpha(0.35 + Math.random() * 0.35);
    }
  }

  demoState() {
    if (this.variant === 'A' && this.handle) {
      this.handle.x = this.handleMax - 22;
      this.holdLeft = true;
      this.leftPointer = -1;
      this.scanner.setTint(0xb9ffe0);
      if (this.scannerRing) this.scannerRing.setStrokeStyle(5, 0x45d6a0, 0.9);
      if (this.holdLabel) this.holdLabel.setText('TANGAN KIRI — TERKUNCI');
      this.drawProgress(0.82);
      if (this.arc) this.arc.setAlpha(0.5);
    } else if (this.variant === 'B') {
      this.holdLeft = true;
      this.holdRight = true;
      this.holdMs = 1620;
      if (this.ringLeft) this.ringLeft.setFillStyle(0x4c9bff, 0.25).setStrokeStyle(5, 0x4c9bff, 1);
      if (this.ringRight) this.ringRight.setFillStyle(0xb55ddc, 0.25).setStrokeStyle(5, 0xb55ddc, 1);
      if (this.padLeft) this.padLeft.setTint(0xcfe9ff);
      if (this.padRight) this.padRight.setTint(0xe9ccff);
      this.drawProgress(0.65);
      if (this.electric) this.electric.setAlpha(0.65);
    }
  }
}
