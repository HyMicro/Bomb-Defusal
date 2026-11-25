import { PuzzleBase } from './PuzzleBase.js';
import { CSS, FONT, WIRE_COLORS } from '../config.js';
import { txt, sparkBurst } from '../ui/factory.js';
import { audio } from '../core/audio.js';

const MARKER_GLYPH = { SEGITIGA: '▲', KOTAK: '■', LINGKARAN: '●', SILANG: '✕', BINTANG: '★' };

/**
 * Module 4 — Logic Wire Cutter.
 * A bank of rule cards is generated against the current wire layout, so every
 * answer is verifiably unique. Swipe any wire vertically/diagonally to cut it.
 */
export class LogicWireCutter extends PuzzleBase {
  constructor(scene, ctx) {
    super(scene, { ...ctx, moduleKey: 'wires' });
  }

  build() {
    this.wires = [];
    this.swipes = new Map();
    this.cutCount = 0;
    this.rule = null;
    const s = this.scene;

    // wires presented left-to-right
    const keys = Phaser.Utils.Array.Shuffle(['red', 'blue', 'yellow', 'green', 'white']);
    const xs = [105, 192.5, 280, 367.5, 455];
    keys.forEach((key, i) => {
      const meta = WIRE_COLORS[key];
      const shadow = s.add.rectangle(xs[i] + 2, 405, 56, 250, 0x05070d, 0.3);
      const img = s.add.image(xs[i], 405, meta.texture).setDisplaySize(55, 248);
      const labelColor = { red: '#B4232E', blue: '#1550C0', yellow: '#8A6200', green: '#1B7A4A', white: '#6B5A43' }[key];
      const label = txt(s, xs[i], 534, `${MARKER_GLYPH[meta.marker]} ${meta.name}`, {
        size: 10, font: FONT.body, color: labelColor, letterSpacing: 0.3,
      });
      label.setShadow(0, 1, '#05070D', 2);
      const zone = s.add.zone(xs[i], 402, 84, 276).setOrigin(0.5).setInteractive({ useHandCursor: true });
      const wire = { key, meta, img, zone, label, x: xs[i], cut: false, shadow };
      this.wires.push(wire);
      this.content.add([shadow, img, label, zone]);
      this.bindWire(wire);
    });

    this.rule = this.makeRule();
    this.drawRulePanel(this.rule);

    this.scissorsIcon = s.add.image(280, 300, 'scissors').setDisplaySize(86, 72).setAlpha(0.18).setDepth(60);
    this.content.add(this.scissorsIcon);
    s.tweens.add({ targets: this.scissorsIcon, x: 330, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

    const onUp = (pointer) => this.finishSwipe(pointer);
    s.input.on('pointerup', onUp);
    this.onCleanup(() => s.input.off('pointerup', onUp));
    const onMove = (pointer) => this.moveSwipe(pointer);
    s.input.on('pointermove', onMove);
    this.onCleanup(() => s.input.off('pointermove', onMove));
  }

  bindWire(wire) {
    const s = this.scene;
    wire.zone.on('pointerdown', (pointer) => {
      if (this.locked || this.solved || wire.cut) return;
      const sc = s.add.image(pointer.x, pointer.y, 'scissors').setDisplaySize(92, 78).setDepth(80).setAngle(-25);
      const trail = s.add.graphics().setDepth(79);
      this.swipes.set(pointer.id, { wire, startX: pointer.x, startY: pointer.y, dist: 0, sc, trail });
      audio.sfx('whoosh');
      sparkBurst(s, pointer.x, pointer.y, 0xffc93c, 4, { scale: 0.2, speed: 80 });
    });
  }

  moveSwipe(pointer) {
    const swipe = this.swipes.get(pointer.id);
    if (!swipe) return;
    const dx = pointer.x - swipe.startX;
    const dy = pointer.y - swipe.startY;
    swipe.dist = Math.max(swipe.dist, Math.hypot(dx, dy));
    swipe.sc.setPosition(pointer.x, pointer.y);
    swipe.sc.setAngle(Phaser.Math.RadToDeg(Math.atan2(dy, dx)) - 25);
    swipe.trail.clear();
    swipe.trail.lineStyle(4, 0xffc93c, 0.6).lineBetween(swipe.startX, swipe.startY, pointer.x, pointer.y);
    swipe.trail.lineStyle(1, 0xffffff, 0.35).lineBetween(swipe.startX, swipe.startY, pointer.x, pointer.y);
  }

  finishSwipe(pointer) {
    const swipe = this.swipes.get(pointer.id);
    if (!swipe) return;
    this.swipes.delete(pointer.id);
    swipe.sc.destroy();
    swipe.trail.destroy();
    if (this.locked || this.solved) return;
    if (swipe.dist < 44) {
      this._notify('SWIPE LEBIH JAUH UNTUK MEMOTONG!', 'warn');
      return;
    }
    this.cutWire(swipe.wire, pointer.x, pointer.y);
  }

  cutWire(wire, atX = wire.x, atY = 405) {
    if (wire.cut || this.locked || this.solved) return;
    wire.cut = true;
    wire.zone.disableInteractive();
    this.cutCount += 1;
    if (this.scene.session?.stats) this.scene.session.stats.wiresCut = (this.scene.session.stats.wiresCut || 0) + 1;
    const s = this.scene;
    const slash = s.add.graphics().setDepth(70);
    slash.lineStyle(8, 0xfff6d6, 0.95).lineBetween(atX - 55, atY - 12, atX + 55, atY + 12);
    slash.lineStyle(2, 0xf2555f, 0.9).lineBetween(atX - 46, atY - 8, atX + 46, atY + 8);
    s.tweens.add({ targets: slash, alpha: 0, duration: 380, onComplete: () => slash.destroy() });
    s.tweens.add({ targets: wire.img, alpha: 0.23, angle: 3, duration: 200 });
    wire.img.setTint(0x59647f);
    wire.label.setAlpha(0.35);
    sparkBurst(s, atX, atY, 0xffc93c, 14, { scale: 0.34, speed: 180 });
    s.tweens.add({ targets: this.scissorsIcon, alpha: 0, duration: 100 });
    if (wire.key === this.rule.targetKey) {
      audio.sfx('chime');
      this.solve();
    } else {
      audio.sfx('error');
      this.mistake(3, `KABEL ${wire.meta.name} BUKAN JAWABANNYA! -3 DETIK`);
      if (this.rule.targetKey) this._notify(`BACA LAGI: ${WIRE_COLORS[this.rule.targetKey].name}`, 'warn');
    }
  }

  drawRulePanel(rule) {
    const s = this.scene;
    const g = s.add.graphics();
    g.fillStyle(0x070b13, 0.92).fillRoundedRect(32, 144, 496, 122, 14);
    g.lineStyle(2, 0x6a7898, 0.5).strokeRoundedRect(32, 144, 496, 122, 14);
    g.fillStyle(0xffc93c, 0.8).fillRoundedRect(32, 144, 6, 122, 3);
    const tag = txt(s, 50, 157, `ATURAN ${String(Phaser.Math.Between(10, 89))} // BACA TELITI`, {
      size: 9.5, font: FONT.mono, color: '#96A3BF', origin: 0, letterSpacing: 0.7,
    });
    const target = txt(s, 512, 157, '1 TARGET', { size: 9, font: FONT.mono, color: CSS.yellow, origin: 1, letterSpacing: 0.7 });
    this.content.add([g, tag, target]);

    const maxW = 442;
    const baseSize = 16;
    const lineH = 23;
    const words = [];
    for (const token of rule.tokens) {
      if (!token.text) continue;
      token.text.split(/\s+/).filter(Boolean).forEach((word) => {
        words.push({ ...token, text: word });
      });
    }
    const objs = words.map((w) => {
      const t = txt(s, 0, 0, w.text, {
        size: w.size || baseSize, font: w.font || FONT.body,
        color: w.color || CSS.cream, origin: 0, alpha: w.alpha ?? 1,
      });
      if (w.stroke) t.setStroke(w.stroke, w.strokeThickness || 4);
      return { w, t };
    });
    const lines = [];
    let line = [];
    let width = 0;
    const space = 5;
    for (const item of objs) {
      const add = item.t.width + (line.length ? space : 0);
      if (line.length && width + add > maxW) {
        lines.push(line);
        line = [item];
        width = item.t.width;
      } else {
        line.push(item);
        width += add;
      }
    }
    if (line.length) lines.push(line);
    const startY = 176;
    lines.forEach((ln, i) => {
      const lineWidth = ln.reduce((sum, o, idx) => sum + o.t.width + (idx ? space : 0), 0);
      let x = 280 - lineWidth / 2;
      const y = startY + i * lineH;
      ln.forEach((o) => {
        o.t.setPosition(x, y);
        x += o.t.width + space;
        this.content.add(o.t);
      });
    });
  }

  makeRule() {
    const wires = this.wires;
    const colorAt = (i) => wires[i]?.key;
    const idx = (key) => wires.findIndex((w) => w.key === key);
    const T = (text, opts = {}) => ({ text, ...opts });
    const CNAME = (key, ink = null, size = 16) => ({
      text: WIRE_COLORS[key].name,
      color: ink || WIRE_COLORS[key].css,
      font: FONT.heading,
      size,
    });
    const EMPH = (text) => ({ text, color: CSS.yellow, font: FONT.heading, size: 16 });
    const rules = [];
    const add = (fn) => { try { const r = fn(); if (r && r.targetKey && wires.some((w) => w.key === r.targetKey)) rules.push(r); } catch { /* skip */ } };

    add(() => {
      const target = Phaser.Utils.Array.GetRandom(wires).key;
      const shown = wires.map((w) => w.key).filter((k) => k !== target);
      const misInk = { red: CSS.blue, blue: CSS.yellow, yellow: CSS.green, green: CSS.purple, white: CSS.red };
      const tokens = [T('Potong kabel yang warnanya '), EMPH('TIDAK'), T(' tertulis di sini: ')];
      shown.forEach((k, i) => {
        tokens.push(CNAME(k, misInk[k], 16));
        if (i < shown.length - 1) tokens.push(T(' • '));
      });
      return { id: 'MISSING', tokens, targetKey: target };
    });

    add(() => ({ id: 'SECOND_RIGHT', tokens: [T('Potong kabel '), EMPH('KEDUA'), T(' dari '), EMPH('KANAN'), T('.')], targetKey: colorAt(3) }));

    add(() => ({ id: 'YELLOW_FIRST', tokens: [T('Ada kabel '), CNAME('yellow'), T('? Potong kabel '), EMPH('PALING KIRI'), T('. Tidak? Potong kabel '), CNAME('blue'), T('.')], targetKey: colorAt(0) }));

    add(() => ({ id: 'FOUR_LETTERS', tokens: [T('Potong kabel yang nama warnanya berjumlah '), EMPH('4 HURUF'), T(' (B-I-R-U).')], targetKey: 'blue' }));

    add(() => ({ id: 'MIDDLE', tokens: [T('Potong kabel '), EMPH('PALING TENGAH'), T(' dari lima kabel ini.')], targetKey: colorAt(2) }));

    add(() => ({ id: 'STROOP', tokens: [T('Potong kabel yang warnanya sama dengan '), { text: 'HIJAU', color: CSS.red, font: FONT.heading, size: 21 }, T(' — abaikan warna tintanya!')], targetKey: 'green' }));

    add(() => ({ id: 'STAR', tokens: [T('Cari penanda '), EMPH('BINTANG ★'), T(' pada ujung kabel, lalu potong kabel itu.')], targetKey: 'white' }));

    add(() => {
      const bi = idx('blue');
      if (bi < 0 || bi >= wires.length - 1) return null;
      return { id: 'RIGHT_OF_BLUE', tokens: [T('Potong kabel tepat di '), EMPH('KANAN'), T(' kabel '), CNAME('blue'), T('.')], targetKey: colorAt(bi + 1) };
    });
    add(() => {
      const wi = idx('white');
      if (wi <= 0) return null;
      return { id: 'LEFT_OF_WHITE', tokens: [T('Potong kabel tepat di '), EMPH('KIRI'), T(' kabel '), CNAME('white'), T('.')], targetKey: colorAt(wi - 1) };
    });
    add(() => {
      const fi = wires.findIndex((w) => w.key !== 'red' && w.key !== 'blue');
      if (fi < 0) return null;
      return { id: 'NOT_RED_BLUE', tokens: [T('Dari kiri, potong kabel pertama yang '), EMPH('BUKAN MERAH'), T(' dan '), EMPH('BUKAN BIRU'), T('.')], targetKey: colorAt(fi) };
    });
    add(() => ({ id: 'WHITE_RIGHT', tokens: [T('Ada kabel '), CNAME('white'), T('? Potong kabel '), EMPH('PALING KANAN'), T('. Tidak ada? Potong '), CNAME('green'), T('.')], targetKey: wires[wires.length - 1].key }));
    add(() => ({ id: 'THIRD_LEFT', tokens: [T('Potong kabel urutan '), EMPH('KETIGA'), T(' dari kiri.')], targetKey: colorAt(2) }));
    add(() => {
      let fi = -1;
      for (let i = wires.length - 1; i >= 0; i--) if (wires[i].key !== 'white') { fi = i; break; }
      if (fi < 0) return null;
      return { id: 'RIGHT_NOT_WHITE', tokens: [T('Dari kanan, potong kabel pertama yang '), EMPH('BUKAN PUTIH'), T('.')], targetKey: colorAt(fi) };
    });
    add(() => ({ id: 'TRIANGLE', tokens: [T('Cari penanda '), EMPH('SEGITIGA ▲'), T(' di tengah kabel, lalu potong kabel itu.')], targetKey: 'red' }));
    add(() => {
      const fi = wires.findIndex((w) => w.key !== 'white');
      if (fi < 0) return null;
      return { id: 'LEFT_NOT_WHITE', tokens: [T('Dari kiri, potong kabel pertama yang '), EMPH('BUKAN PUTIH'), T('.')], targetKey: colorAt(fi) };
    });
    add(() => ({ id: 'SECOND_LEFT', tokens: [T('Potong kabel urutan '), EMPH('KEDUA'), T(' dari kiri.')], targetKey: colorAt(1) }));

    return Phaser.Utils.Array.GetRandom(rules);
  }

  demoState() {
    if (!this.wires.length) return;
    const wrong = this.wires.find((w) => w.key !== this.rule.targetKey && ['white', 'green', 'red'].includes(w.key));
    if (wrong) {
      wrong.img.setAlpha(0.24).setTint(0x59647f).setAngle(3);
      wrong.label.setAlpha(0.35);
      wrong.cut = true;
      wrong.zone.disableInteractive();
    }
    this.scissorsIcon.setAlpha(0.85).setPosition(300, 320).setDisplaySize(86, 72);
    this.scene.tweens.killTweensOf(this.scissorsIcon);
  }
}
