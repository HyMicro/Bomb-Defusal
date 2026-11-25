import { PuzzleBase } from './PuzzleBase.js';
import { CSS, FONT } from '../config.js';
import { txt, sparkBurst, floatText } from '../ui/factory.js';
import { audio } from '../core/audio.js';

/**
 * Module 2 — Meta UI Trap.
 * A: tap the word BOM inside the instruction, not the shiny BOM buttons.
 * B: tap the number that matches the last digit of the live timer.
 * C: drag the actual "GESER" block instead of the fake buttons.
 */
export class MetaUiTrap extends PuzzleBase {
  constructor(scene, ctx) {
    super(scene, { ...ctx, moduleKey: 'metaTrap', variant: ctx.variant || Phaser.Utils.Array.GetRandom(['A', 'B', 'C']) });
  }

  build() {
    if (this.variant === 'B') this.buildSerial();
    else if (this.variant === 'C') this.buildDragText();
    else this.buildTapWord();
  }

  dialogBase({ accent = 0xb55ddc, label = 'SYSTEM VERIFY // NODE 03' } = {}) {
    const s = this.scene;
    const g = s.add.graphics();
    g.fillStyle(0x070b13, 0.9).fillRoundedRect(36, 156, 488, 362, 18);
    g.lineStyle(2, 0x4a5673, 0.9).strokeRoundedRect(36, 156, 488, 362, 18);
    g.fillStyle(accent, 0.2).fillRoundedRect(48, 168, 464, 32, 8);
    g.lineStyle(1, accent, 0.5).strokeRoundedRect(48, 168, 464, 32, 8);
    this.content.add(g);
    this.content.add(txt(s, 64, 183, label, { size: 10.5, font: FONT.mono, color: '#BBC5DF', origin: 0, letterSpacing: 1.3 }));
    this.content.add(txt(s, 500, 183, '00/00', { size: 9.5, font: FONT.mono, color: CSS.green, origin: 1, letterSpacing: 0.7 }));
    const dots = s.add.graphics();
    [0, 1, 2].forEach((i) => dots.fillStyle(i === 0 ? CSS.red : '#59657F', 1).fillCircle(428 + i * 16, 184, 4));
    this.content.add(dots);
  }

  fakeButton(x, y, label, color, onClick) {
    const s = this.scene;
    const c = s.add.container(x, y);
    const g = s.add.graphics();
    g.fillStyle(0x06090f, 0.7).fillRoundedRect(-65, -38, 136, 84, 14);
    g.fillStyle(color, 1).fillRoundedRect(-67, -43, 134, 82, 14);
    g.lineStyle(4, 0x090d18, 1).strokeRoundedRect(-67, -43, 134, 82, 14);
    g.fillStyle(0xffffff, 0.25).fillRoundedRect(-55, -31, 110, 20, 7);
    const t = txt(s, 0, 3, label, { size: 23, font: FONT.display, color: '#130F0A' });
    c.add([g, t]);
    const zone = s.add.zone(0, 0, 150, 100).setOrigin(0.5).setInteractive({ useHandCursor: true });
    c.add(zone);
    zone.on('pointerdown', () => {
      if (this.solved || this.locked) return;
      audio.sfx('deny');
      s.tweens.add({ targets: c, x: x + 7, duration: 40, yoyo: true, repeat: 3, onComplete: () => { c.x = x; } });
      this._notify('TOMBOL PALSU! BACA JUDULNYA.', 'warn');
      onClick();
    });
    zone.on('pointerover', () => s.tweens.add({ targets: c, scale: 1.05, duration: 100 }));
    zone.on('pointerout', () => s.tweens.add({ targets: c, scale: 1, duration: 100 }));
    this.content.add(c);
    return c;
  }

  buildTapWord() {
    const s = this.scene;
    this.dialogBase({ accent: 0xb55ddc });
    this.content.add(txt(s, 280, 220, 'PROTOKOL DEFUSAL', { size: 12, font: FONT.mono, color: '#8E9AB8', letterSpacing: 3 }));
    this.content.add(txt(s, 280, 254, 'TEKAN KATA', { size: 20, font: FONT.body, color: CSS.cream }));
    const word = txt(s, 280, 308, 'BOM', {
      size: 62, font: FONT.display, color: CSS.yellow, stroke: CSS.ink, strokeThickness: 9,
    }).setShadow(0, 5, CSS.red, 0, true, true);
    this.content.add(word);
    this.content.add(txt(s, 280, 358, 'UNTUK MENJINAKKAN MODUL INI!', { size: 16, font: FONT.body, color: CSS.cream }));

    const underline = s.add.graphics();
    underline.lineStyle(3, 0xffc93c, 0.55).lineBetween(242, 340, 318, 340);
    this.content.add(underline);
    this.scene.tweens.add({ targets: word, scale: 1.035, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

    const wordZone = s.add.zone(280, 305, 170, 100).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.content.add(wordZone);
    wordZone.on('pointerover', () => word.setTint(0xffffff));
    wordZone.on('pointerout', () => word.clearTint());
    wordZone.on('pointerdown', () => {
      if (this.locked || this.solved) return;
      audio.sfx('click');
      this.spawnAt(280, 305, 0xffc93c, 12, { scale: 0.35, speed: 160 });
      s.tweens.add({ targets: word, scale: 1.35, alpha: 0.2, duration: 320 });
      this.solve();
    });

    this.content.add(txt(s, 280, 390, 'ATAU PILIH TOMBOL DI BAWAH:', { size: 10, font: FONT.mono, color: '#71809F', letterSpacing: 1 }));
    this.fakeButton(140, 456, 'BOM 1', CSS.red, () => this.mistake(3, 'BUKAN TOMBOL MONCOLOKNYA! -3 DETIK'));
    this.fakeButton(280, 456, 'BOM 2', CSS.yellow, () => this.mistake(3, 'BACA LAGI JUDULNYA! -3 DETIK'));
    this.fakeButton(420, 456, 'BOM 3', CSS.green, () => this.mistake(3, 'MASIH SALAH! -3 DETIK'));
  }

  buildSerial() {
    const s = this.scene;
    this.dialogBase({ accent: 0x4c9bff, label: 'SERIAL MATCH // LIVE TIMER' });
    this.content.add(txt(s, 280, 226, 'TEKAN ANGKA = DIGIT TERAKHIR TIMER', {
      size: 17, font: FONT.body, color: CSS.cream, wrap: 430,
    }));
    const display = s.add.graphics();
    display.fillStyle(0x05080f, 0.9).fillRoundedRect(196, 264, 168, 78, 14);
    display.lineStyle(2, 0x4c9bff, 0.55).strokeRoundedRect(196, 264, 168, 78, 14);
    this.content.add(display);
    this.content.add(txt(s, 280, 300, '?', { size: 50, font: FONT.mono, color: '#53658A' }));
    this.content.add(txt(s, 280, 354, 'LIHAT TIMER BOM DI ATAS!', { size: 9, font: FONT.mono, color: '#7E8CA9', letterSpacing: 1 }));

    const keys = [];
    const makeKey = (n, i) => {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const x = 104 + col * 88;
      const y = 402 + row * 74;
      const c = s.add.container(x, y);
      const img = s.add.graphics();
      const paint = (pressed = false) => {
        img.clear();
        img.fillStyle(pressed ? 0x18243a : 0x0d1624, 1).fillRoundedRect(-38, -31, 76, 62, 9);
        img.lineStyle(1.5, pressed ? 0x4c9bff : 0x2c3a54, pressed ? .9 : .8).strokeRoundedRect(-38, -31, 76, 62, 9);
      };
      paint();
      const label = txt(s, 0, -2, String(n), { size: 28, font: FONT.display, color: CSS.cream });
      const zone = s.add.zone(0, 0, 86, 72).setOrigin(0.5).setInteractive({ useHandCursor: true });
      c.add([img, label, zone]);
      zone.on('pointerover', () => paint());
      zone.on('pointerout', () => { paint(); label.setY(-2); });
      zone.on('pointerdown', () => {
        if (this.locked || this.solved) return;
        paint(true);
        label.setY(0);
        audio.sfx('click');
        this.pressDigit(n);
      });
      zone.on('pointerup', () => {
        paint();
        label.setY(-2);
      });
      this.content.add(c);
      keys.push({ c, img, label, zone, paint });
    };
    for (let i = 0; i < 10; i++) makeKey(i, i);
    this.content.add(txt(s, 280, 540, 'TEPAT WAKTU • JANGAN PANIK', { size: 9, font: FONT.mono, color: '#6C7A99', letterSpacing: 1 }));
    this.keys = keys;
  }

  pressDigit(n) {
    if (this.solved || this.locked) return;
    const now = performance.now();
    const current = Math.floor((this.scene.round?.timeLeft ?? 0)) % 10;
    if (current === n) {
      this.solve();
      return;
    }
    this.mistake(3, `ANGKA ${n} SALAH! LIHAT DETIK TERAKHIR. -3 DETIK`);
    this.shake();
  }

  buildDragText() {
    const s = this.scene;
    this.dialogBase({ accent: 0xffc93c, label: 'DRAG PROTOCOL // MISDIRECTION' });
    this.content.add(txt(s, 280, 224, 'GESER TULISAN "GESER" KE SAMPING KANAN!', {
      size: 17, font: FONT.body, color: CSS.cream, wrap: 430,
    }));
    this.content.add(txt(s, 280, 264, 'Tombol di bawah tidak akan berfungsi.', {
      size: 11, font: FONT.body, color: '#8B97B3',
    }));

    const handle = s.add.container(210, 338).setAngle(-2);
    const tape = s.add.graphics();
    tape.fillStyle(0x9f7a0b, 0.7).fillRoundedRect(-102, -36, 216, 86, 12);
    tape.fillStyle(0xffc93c, 1).fillRoundedRect(-108, -44, 216, 84, 12);
    tape.lineStyle(4, 0x090d18, 1).strokeRoundedRect(-108, -44, 216, 84, 12);
    tape.lineStyle(2, 0xffffff, 0.35).lineBetween(-90, -29, 88, -29);
    const label = txt(s, 0, -2, 'GESER', { size: 45, font: FONT.display, color: '#171006', letterSpacing: 2 });
    const hand = s.add.image(120, 36, 'icon-hand-drag').setDisplaySize(38, 38).setAlpha(0.5);
    handle.add([tape, label, hand]);
    this.content.add(handle);
    this.dragHandle = handle;
    this.dragStartX = 210;
    this.dragX = 210;
    const zone = s.add.zone(0, 0, 240, 110).setOrigin(0.5).setInteractive({ useHandCursor: true });
    handle.add(zone);
    let drag = null;
    zone.on('pointerdown', (pointer) => {
      if (this.locked || this.solved) return;
      drag = { id: pointer.id, start: pointer.x, base: handle.x };
      handle.setAngle(0);
      audio.sfx('click');
    });
    const move = (pointer) => {
      if (!drag || drag.id !== pointer.id) return;
      handle.x = Phaser.Math.Clamp(drag.base + (pointer.x - drag.start), 150, 420);
      this.dragX = handle.x;
      if (handle.x - this.dragStartX > 170) {
        drag = null;
        this.zoneSolved = true;
        this.spawnAt(280, 338, 0xffc93c, 16, { scale: 0.4, speed: 220 });
        s.tweens.add({ targets: handle, x: 430, duration: 150, ease: 'Quad.Out' });
        this.solve();
      }
    };
    const up = (pointer) => {
      if (!drag || drag.id !== pointer.id) return;
      drag = null;
      if (this.solved) return;
      this._notify('BELUM CUKUP JAUH — GESER LEBIH KESAMPING!', 'warn');
      s.tweens.add({ targets: handle, x: 210, duration: 260, ease: 'Back.In', onComplete: () => handle.setAngle(-2) });
    };
    s.input.on('pointermove', move);
    s.input.on('pointerup', up);
    this.onCleanup(() => { s.input.off('pointermove', move); s.input.off('pointerup', up); });

    this.content.add(txt(s, 280, 428, 'TOMBOL PALSU:', { size: 9, font: FONT.mono, color: '#687793', letterSpacing: 1 }));
    ['KIRI', 'ATAS', 'BAWAH'].forEach((labelText, i) => {
      const x = 160 + i * 120;
      const c = s.add.container(x, 486);
      const g = s.add.graphics();
      g.fillStyle(0x171f31, 1).fillRoundedRect(-48, -24, 96, 50, 10);
      g.lineStyle(2, 0x4c5875, 0.7).strokeRoundedRect(-48, -24, 96, 50, 10);
      const t = txt(s, 0, 0, labelText, { size: 13, font: FONT.body, color: '#71809E' });
      const fz = s.add.zone(0, 0, 120, 64).setOrigin(0.5).setInteractive();
      fz.on('pointerdown', () => {
        if (this.solved) return;
        audio.sfx('deny');
        this._notify('TOMBOL PALSU TIDAK BISA DIPAKSA!', 'warn');
        s.tweens.add({ targets: c, x: x + 4, duration: 35, yoyo: true, repeat: 2, onComplete: () => { c.x = x; } });
      });
      c.add([g, t, fz]);
      this.content.add(c);
    });
    this.content.add(txt(s, 280, 532, 'GESER BLOK KUNING, BUKAN TOMBOL.', { size: 9, font: FONT.mono, color: '#7D8AA6', letterSpacing: 1 }));
  }

  demoState() {
    if (this.variant === 'C' && this.dragHandle) {
      this.dragHandle.x = 300;
      this.dragHandle.setAngle(-1);
    }
    if (this.variant === 'B' && this.keys) {
      this.keys[7].paint(true);
    }
  }
}
