import { CSS, FONT, THEME, MODULES } from '../config.js';
import { txt, fitText, sparkBurst } from '../ui/factory.js';
import { audio } from '../core/audio.js';

/**
 * Shared card shell — simple metal rim from the supplied module frame,
 * one title, one meta line, a status footer. Content stays centre stage.
 */
export class PuzzleBase {
  constructor(scene, {
    index, owner, moduleKey, variant, x, y, layer, demo = false,
    onSolved, onMistake, notify,
  }) {
    this.scene = scene;
    this.index = index;
    this.owner = owner;
    this.moduleKey = moduleKey;
    this.meta = MODULES[moduleKey];
    this.variant = variant || 'A';
    this.x = x;
    this.y = y;
    this.layer = layer;
    this.demo = demo;
    this.locked = false;
    this.solved = false;
    this.active = false;
    this._onSolved = onSolved;
    this._onMistake = onMistake;
    this._notify = notify || (() => {});
    this._mistakeLockUntil = 0;
    this._cleanups = [];
    this.root = scene.add.container(x, y).setDepth(10);
    if (layer) layer.add(this.root);
    this.content = scene.add.container(0, 0);
    this.buildShell();
    this.root.add(this.content);
    this.build();
    this.setActive(true);
    this.activateVisuals();
  }

  drawCard(borderColor = THEME.border, fill = THEME.panel) {
    const g = this.card;
    g.clear();
    g.fillStyle(0x05090f, .55).fillRoundedRect(4, 4, 552, 612, 18);
    g.fillStyle(fill, 1).fillRoundedRect(0, 0, 560, 620, 18);
    g.lineStyle(1.5, borderColor, .85).strokeRoundedRect(.75, .75, 558.5, 618.5, 18);
    g.fillStyle(this.meta.accent, .9).fillRoundedRect(20, 0, 520, 3, 2);
    g.lineStyle(1, THEME.borderSoft, .9).lineBetween(52, 84, 508, 84);
    g.lineStyle(1, THEME.borderSoft, .9).lineBetween(52, 546, 508, 546);
  }

  buildShell() {
    const s = this.scene;
    this.frameImg = s.add.image(280, 310, 'cut-frame').setDisplaySize(584, 648);
    this.card = s.add.graphics();
    this.root.add([this.frameImg, this.card]);
    this.drawCard();

    this.titleText = txt(s, 52, 34, this.meta.title, {
      size: 19, font: FONT.heading, color: CSS.text, origin: 0,
    });
    fitText(this.titleText, 400, 13);
    this.root.add(this.titleText);
    this.metaLine = txt(s, 52, 61, `${this.meta.short}  ·  ${this.meta.hint}`, {
      size: 10, font: FONT.body, color: CSS.dim, origin: 0, letterSpacing: .2,
    });
    this.root.add(this.metaLine);

    this.ledGlow = s.add.circle(498, 40, 11, this.meta.accent, .14);
    this.led = s.add.circle(498, 40, 5, this.meta.accent, 1);
    this.root.add([this.ledGlow, this.led]);

    this.statusDot = s.add.circle(56, 566, 4, THEME.muted, 1);
    this.statusText = txt(s, 66, 566, 'AKTIF', {
      size: 10, font: FONT.body, color: CSS.muted, origin: 0, letterSpacing: .8,
    });
    this.ownerText = txt(s, 504, 566, this.owner.name, {
      size: 10, font: FONT.body, color: this.owner.css, origin: 1,
    });
    const ownerDot = s.add.circle(0, 566, 4, this.owner.color, 1);
    ownerDot.x = 504 - this.ownerText.width - 12;
    this.root.add([this.statusDot, this.statusText, this.ownerText, ownerDot]);
    this.ownerDot = ownerDot;

    this.flash = s.add.rectangle(280, 320, 500, 510, THEME.red, 0).setDepth(20);
    this.root.add(this.flash);
  }

  /** Subclass hook. */
  build() {}

  add(child) { this.content.add(child); return child; }

  instruction(text, { y = 140, size = 15, color = THEME.text, wrap = 430 } = {}) {
    const t = txt(this.scene, 280, y, text, {
      size, font: FONT.body, color, wrap, lineSpacing: 4,
    });
    fitText(t, wrap, 11);
    this.content.add(t);
    return t;
  }

  setActive(active) {
    this.active = active;
    if (this.solved) return;
    this.statusText.setText(active ? 'AKTIF' : 'SIAP');
    this.statusDot.setFillStyle(active ? this.meta.accent : THEME.dim, 1);
    this.statusText.setColor(active ? CSS.muted : CSS.dim);
  }

  activateVisuals() {
    this.root.setAlpha(0);
    this.scene.tweens.add({
      targets: this.root, alpha: 1, y: { from: this.y + 24, to: this.y },
      duration: 320, ease: 'Quad.Out', delay: this.index * 60,
    });
  }

  solve({ silent = false } = {}) {
    if (this.solved) return;
    this.solved = true;
    this.locked = true;
    this.disableAllInput();
    this.drawCard(THEME.green, THEME.panel);
    this.led.setFillStyle(THEME.green, 1);
    this.ledGlow.setFillStyle(THEME.green, .18);
    this.statusDot.setFillStyle(THEME.green, 1);
    this.statusText.setText('AMAN').setColor(CSS.green);
    this.content.setAlpha(.86);
    const p = this.worldPoint(522, 32);
    sparkBurst(this.scene, p.x, p.y, THEME.green, 8, { scale: .28, speed: 100 });
    audio.sfx('chime');
    if (!silent) this._onSolved?.(this);
  }

  worldPoint(lx, ly) {
    const m = this.root.getWorldTransformMatrix();
    return { x: m.a * lx + m.c * ly + m.tx, y: m.b * lx + m.d * ly + m.ty };
  }

  spawnAt(lx, ly, color, count = 6, opts = {}) {
    const p = this.worldPoint(lx, ly);
    sparkBurst(this.scene, p.x, p.y, color, count, opts);
    return p;
  }

  shake() {
    this.scene.tweens.add({ targets: this.root, x: this.x + 6, duration: 45, yoyo: true, repeat: 3, onComplete: () => { this.root.x = this.x; } });
    this.scene.cameras.main.shake(140, .005);
  }

  mistake(seconds = 3, message = 'SALAH! -3 DETIK') {
    if (this.solved) return false;
    const now = performance.now();
    if (now < this._mistakeLockUntil) return false;
    this._mistakeLockUntil = now + 700;
    this.scene.tweens.add({
      targets: this.flash, fillAlpha: .28, duration: 80, yoyo: true,
      onComplete: () => this.flash.setFillStyle(THEME.red, 0),
    });
    this.shake();
    this._notify(message, 'error');
    this._onMistake?.(this, seconds, message);
    return true;
  }

  disableAllInput() {
    const walk = (obj) => {
      if (obj.input) obj.disableInteractive();
      if (obj.list) obj.list.forEach(walk);
    };
    walk(this.root);
  }

  onCleanup(fn) {
    if (typeof fn === 'function') this._cleanups.push(fn);
  }

  runCleanups() {
    for (const fn of this._cleanups.splice(0)) {
      try { fn(); } catch { /* noop */ }
    }
  }

  close() {
    this.runCleanups();
    this.root.destroy(true);
  }

  update() {}
}
