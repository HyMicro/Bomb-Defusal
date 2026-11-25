import { SABOTAGES, CSS, FONT } from '../config.js';
import { txt, sparkBurst, screenShake, flashScreen } from '../ui/factory.js';
import { audio } from '../core/audio.js';

/**
 * Screen sabotage director.
 * One sabotage may be active at a time; extra triggers are queued.
 * All overlays are deliberately physical/touch-native, not modal buttons.
 */
export class SabotageManager {
  constructor(scene, { enabled = true, onCleared = null } = {}) {
    this.scene = scene;
    this.enabled = enabled;
    this.onCleared = onCleared;
    this.layer = scene.add.container(0, 0).setDepth(80);
    this.active = null;
    this.activeType = null;
    this.queue = [];
    this.elapsed = 0;
    this.autoMs = 0;
    this.completed = false;
    this.puffs = [];
    this.puffsCleared = 0;
    this.taps = 0;
    this.tapsNeeded = 6;
    this.handlers = [];
    this._onDown = this.onDown.bind(this);
    this._onMove = this.onMove.bind(this);
    this._onUp = this.onUp.bind(this);
    scene.input.on('pointerdown', this._onDown);
    scene.input.on('pointermove', this._onMove);
    scene.input.on('pointerup', this._onUp);
    scene.events.once('shutdown', () => this.destroy());
  }

  get isActive() { return !!this.active; }

  trigger(type) {
    if (!this.enabled) return false;
    if (this.scene.round?.state === 'won' || this.scene.round?.state === 'lost') return false;
    if (this.active) {
      if (this.queue.length < 3) this.queue.push(type);
      return false;
    }
    this.open(type);
    return true;
  }

  open(type) {
    if (!SABOTAGES[type]) type = 'glitch';
    this.activeType = type;
    this.elapsed = 0;
    this.completed = false;
    this.puffs = [];
    this.puffsCleared = 0;
    this.taps = 0;
    this.layer.removeAll(true);
    this.active = this.scene.add.container(0, 0);
    this.layer.add(this.active);
    this.hiddenCipher = this.scene.cipherBanner || null;
    if (this.hiddenCipher) this.hiddenCipher.setVisible(false);
    this.scene.session.stats.sabotageSeen = (this.scene.session.stats.sabotageSeen || 0) + 1;
    audio.sfx(type === 'ice' ? 'ice' : 'sabotage');
    if (type === 'smoke') this.buildSmoke();
    else if (type === 'ice') this.buildIce();
    else if (type === 'gravity') this.buildGravity();
    else this.buildGlitch();
  }

  banner(type, extra = '') {
    const s = this.scene;
    const meta = SABOTAGES[type];
    const c = s.add.container(960, 338).setDepth(20);
    const W = 920, H = 132;
    const g = s.add.graphics();
    g.fillStyle(0x0B1422, .97).fillRoundedRect(-W / 2, -H / 2, W, H, 16);
    g.lineStyle(1.5, meta.color, .65).strokeRoundedRect(-W / 2 + .75, -H / 2 + .75, W - 1.5, H - 1.5, 16);
    g.fillStyle(meta.color, .95).fillRoundedRect(-W / 2, -H / 2 + 14, 4, H - 28, 2);
    const icon = s.add.image(-W / 2 + 44, -6, meta.icon).setDisplaySize(38, 38).setTint(meta.color).setAlpha(0.95);
    const title = txt(s, -W / 2 + 76, -38, meta.title, { size: 26, font: FONT.heading, color: CSS.cream, origin: 0, letterSpacing: .4 });
    const sub = txt(s, -W / 2 + 76, -6, meta.sub, { size: 10, font: FONT.body, color: '#D8E2F2', origin: 0, letterSpacing: .5 });
    const counter = txt(s, W / 2 - 26, -38, extra, { size: 11, font: FONT.mono, color: CSS.yellow, origin: 1, letterSpacing: .8 });
    const barBg = s.add.graphics();
    barBg.fillStyle(0x05080f, .9).fillRoundedRect(-W / 2 + 76, 26, W - 120, 8, 4);
    barBg.lineStyle(1, 0xffffff, .1).strokeRoundedRect(-W / 2 + 76, 26, W - 120, 8, 4);
    const barFill = s.add.graphics();
    const hand = s.add.image(W / 2 - 48, -4, type === 'ice' ? 'icon-hand-tap' : type === 'glitch' ? 'icon-hand-drag' : 'icon-hand-swipe')
      .setDisplaySize(26, 26).setTint(meta.color).setAlpha(0.9);
    c.add([g, icon, title, sub, counter, barBg, barFill, hand]);
    this.active.add(c);
    return { container: c, title, sub, counter, barFill, barBg, hand, meta };
  }

  drawBannerProgress(banner, ratio, color = CSS.red) {
    if (!banner) return;
    banner.barFill.clear();
    const r = Phaser.Math.Clamp(ratio, 0, 1);
    if (r > 0) banner.barFill.fillStyle(Phaser.Display.Color.HexStringToColor(color).color, 1).fillRoundedRect(-386, 27, 772 * r, 6, 3);
  }

  buildSmoke() {
    const s = this.scene;
    const dim = s.add.rectangle(960, 540, 1920, 1080, 0x070b13, 0.32);
    this.active.add(dim);
    const puffs = [];
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(130, 1790);
      const y = Phaser.Math.Between(405, 720);
      const size = Phaser.Math.Between(250, 390);
      const dark = i % 3 === 0;
      const img = s.add.image(x, y, dark ? 'fx-smoke-dark' : 'fx-smoke')
        .setDisplaySize(size, size * 0.82).setAlpha(dark ? 0.6 : 0.72)
        .setTint(dark ? 0x59606e : 0x8d93a2)
        .setAngle(Phaser.Math.Between(-20, 20));
      this.active.add(img);
      puffs.push({ img, cleared: false, x, y, radius: size * 0.27 });
    }
    this.puffs = puffs;
    const banner = this.banner('smoke', '0% BERSIH');
    this.bannerRef = banner;
    this.autoMs = 16000;
    // Invisible blocker above visuals but below banner; banner remains visible.
    const blocker = s.add.rectangle(960, 540, 1920, 1080, 0xffffff, 0.001).setInteractive();
    this.active.add(blocker);
    this.active.bringToTop(banner.container);
  }

  onDown(pointer) {
    if (!this.active) return;
    if (this.activeType === 'ice') this.iceTap(pointer);
    if (this.activeType === 'smoke') this.wipeAt(pointer.x, pointer.y, pointer);
    if (this.activeType === 'gravity') return;
    if (this.activeType === 'glitch') this.onGlitchDown(pointer);
  }

  onMove(pointer) {
    if (!this.active) return;
    if (this.activeType === 'smoke' && pointer.isDown) this.wipeAt(pointer.x, pointer.y, pointer);
    if (this.activeType === 'glitch') this.onGlitchMove(pointer);
  }

  onUp(pointer) {
    if (this.activeType === 'glitch') this.onGlitchUp(pointer);
  }

  wipeAt(x, y, pointer) {
    if (this.completed) return;
    let any = false;
    for (const p of this.puffs) {
      if (p.cleared) continue;
      if (Math.hypot(p.x - x, p.y - y) < p.radius + 95) {
        p.cleared = true;
        this.puffsCleared++;
        any = true;
        this.scene.tweens.add({ targets: p.img, alpha: 0, scale: 1.2, duration: 260, ease: 'Quad.Out', onComplete: () => p.img.destroy() });
      }
    }
    if (any) {
      sparkBurst(this.scene, x, y, 0xdfe6f2, 2, { scale: 0.2, speed: 60 });
      audio.sfx('spark');
      const ratio = this.puffsCleared / this.puffs.length;
      if (this.bannerRef) {
        this.bannerRef.counter.setText(`${Math.round(ratio * 100)}% BERSIH`);
        this.drawBannerProgress(this.bannerRef, ratio, CSS.green);
      }
      if (ratio >= 0.8) this.finish(true);
    }
  }

  buildIce() {
    const s = this.scene;
    const dim = s.add.rectangle(960, 540, 1920, 1080, 0x06131f, 0.32);
    this.active.add(dim);
    const ice = s.add.image(960, 590, 'fx-ice').setDisplaySize(1780, 680).setDepth(2);
    this.active.add(ice);
    const frost = s.add.rectangle(960, 590, 1780, 680, 0x9fe8ff, 0.04);
    this.active.add(frost);
    this.bannerRef = this.banner('ice', 'KETUKAN 0/6');
    this.autoMs = 15000;
    this.iceCracks = s.add.graphics().setDepth(3);
    this.active.add(this.iceCracks);
    const blocker = s.add.rectangle(960, 540, 1920, 1080, 0xffffff, 0.001).setInteractive();
    this.active.add(blocker);
    this.active.bringToTop(this.bannerRef.container);
    screenShake(this.scene, 0.003, 200);
  }

  iceTap(pointer) {
    if (this.completed) return;
    if (performance.now() - (this.lastIceTap || 0) < 80) return;
    this.lastIceTap = performance.now();
    this.taps++;
    this.scene.tweens.add({ targets: this.active, x: { from: 5, to: 0 }, y: { from: -3, to: 0 }, duration: 60 });
    const x = pointer.x;
    const y = pointer.y;
    this.iceCracks.lineStyle(4, 0xe9fbff, 0.8).beginPath();
    this.iceCracks.moveTo(x, y);
    for (let i = 0; i < 3; i++) {
      const a = Math.random() * Math.PI * 2;
      const len = 40 + Math.random() * 100;
      this.iceCracks.lineTo(x + Math.cos(a) * len * 0.5, y + Math.sin(a) * len * 0.5);
      this.iceCracks.lineTo(x + Math.cos(a + 0.3) * len, y + Math.sin(a + 0.3) * len);
    }
    this.iceCracks.strokePath();
    sparkBurst(this.scene, x, y, 0x9fe8ff, 6, { scale: 0.3, speed: 130 });
    audio.sfx('ice');
    if (this.bannerRef) this.bannerRef.counter.setText(`KETUKAN ${this.taps}/6`);
    this.drawBannerProgress(this.bannerRef, this.taps / 6, CSS.blue);
    if (this.taps >= this.tapsNeeded) this.shatterIce();
  }

  shatterIce() {
    if (this.completed) return;
    this.completed = true;
    audio.sfx('ice');
    flashScreen(this.scene, 0xe6fbff, 180, 0.75);
    screenShake(this.scene, 0.009, 380);
    for (let i = 0; i < 24; i++) {
      const shard = this.scene.add.triangle(
        Phaser.Math.Between(200, 1720), Phaser.Math.Between(300, 850),
        Phaser.Math.Between(-18, 18), Phaser.Math.Between(-22, 22),
        Phaser.Math.Between(-20, 20), Phaser.Math.Between(-20, 20),
        Phaser.Math.Between(-20, 20), Phaser.Math.Between(-20, 20),
        0xbfefff, 0.75,
      ).setDepth(85);
      this.scene.tweens.add({
        targets: shard,
        x: shard.x + Phaser.Math.Between(-240, 240),
        y: shard.y + Phaser.Math.Between(160, 400),
        angle: Phaser.Math.Between(-220, 220), alpha: 0,
        duration: 500 + Math.random() * 500, ease: 'Cubic.Out', onComplete: () => shard.destroy(),
      });
    }
    this.scene.time.delayedCall(350, () => this.finish(true));
  }

  buildGravity() {
    const s = this.scene;
    this.bannerRef = this.banner('gravity', '7.0 DETIK');
    this.autoMs = 7000;
    audio.sfx('sabotage');
    screenShake(this.scene, 0.006, 250);
    const pivot = this.scene.workPivot;
    if (pivot) {
      const target = pivot.rotation + Math.PI;
      s.tweens.add({ targets: pivot, rotation: target, duration: 900, ease: 'Cubic.InOut' });
    }
    const arrows = s.add.graphics().setDepth(15).setAlpha(0.25);
    for (let i = 0; i < 3; i++) {
      arrows.lineStyle(4, 0xb55ddc, 0.8).strokeCircle(960, 588, 380 + i * 42, 0.2, 5.2);
    }
    this.active.add(arrows);
    s.tweens.add({ targets: arrows, angle: 180, duration: 7000, ease: 'Linear' });
    this.active.bringToTop(this.bannerRef.container);
  }

  buildGlitch() {
    const s = this.scene;
    const dim = s.add.rectangle(960, 540, 1920, 1080, 0x0a0410, 0.56);
    this.active.add(dim);
    const noise = s.add.graphics();
    for (let i = 0; i < 18; i++) {
      noise.fillStyle([0xf2555f, 0x4c9bff, 0xb55ddc][i % 3], 0.08).fillRect(0, Phaser.Math.Between(0, 1080), 1920, Phaser.Math.Between(1, 5));
    }
    this.active.add(noise);
    this.bannerRef = this.banner('glitch', 'REBOOT PENDING');
    this.autoMs = 14000;
    const blocker = s.add.rectangle(960, 540, 1920, 1080, 0xffffff, 0.001).setInteractive();
    this.active.add(blocker);
    const popup = s.add.container(960, 560).setDepth(30);
    const plate = s.add.image(0, 0, 'glitch-popup').setDisplaySize(720, 277);
    const title = txt(s, 0, -52, 'SISTEM ERROR', { size: 30, font: FONT.heading, color: CSS.red, stroke: CSS.ink, strokeThickness: 4, letterSpacing: 1 });
    const sub = txt(s, 0, -12, 'GESER POP-UP KE ATAS UNTUK REBOOT', { size: 13, font: FONT.body, color: '#2A3244' });
    const arrow = s.add.image(0, 46, 'icon-hand-drag').setDisplaySize(46, 46).setTint(0x1b2232).setAngle(-90);
    const z = s.add.zone(0, 0, 720, 290).setOrigin(0.5).setInteractive({ useHandCursor: true });
    popup.add([plate, title, sub, arrow, z]);
    this.active.add(popup);
    this.glitchPopup = popup;
    this.glitchDrag = null;
    z.on('pointerdown', (pointer) => {
      if (!this.active) return;
      this.glitchDrag = { id: pointer.id, startY: pointer.y, baseY: popup.y };
      audio.sfx('click');
    });
    this.scene.tweens.add({ targets: noise, alpha: { from: 0.2, to: 0.9 }, duration: 90, yoyo: true, repeat: -1 });
  }

  onGlitchDown(pointer) {
    if (!this.glitchPopup) return;
    const dx = Math.abs(pointer.x - 960);
    const dy = Math.abs(pointer.y - 560);
    if (dx > 370 || dy > 160) return;
    if (this.glitchDrag) return;
    this.glitchDrag = { id: pointer.id, startY: pointer.y, baseY: this.glitchPopup.y };
  }

  onGlitchMove(pointer) {
    if (!this.glitchPopup || !this.glitchDrag || this.glitchDrag.id !== pointer.id) return;
    this.glitchPopup.y = Math.min(560, this.glitchDrag.baseY + (pointer.y - this.glitchDrag.startY));
  }

  onGlitchUp(pointer) {
    if (!this.glitchPopup || !this.glitchDrag || this.glitchDrag.id !== pointer.id) return;
    const draggedUp = this.glitchDrag.baseY - this.glitchPopup.y > 100;
    this.glitchDrag = null;
    if (draggedUp) {
      audio.sfx('whoosh');
      this.scene.tweens.add({ targets: this.glitchPopup, y: -340, alpha: 0, duration: 240, ease: 'Back.In' });
      this.finish(true);
    } else {
      this.scene.tweens.add({ targets: this.glitchPopup, y: 560, duration: 200, ease: 'Back.Out' });
    }
  }

  update(delta) {
    if (!this.active || this.completed) return;
    this.elapsed += delta;
    if (this.activeType === 'gravity') {
      const remain = Math.max(0, this.autoMs - this.elapsed);
      if (this.bannerRef) this.bannerRef.counter.setText(`${(remain / 1000).toFixed(1)} DETIK`);
      this.drawBannerProgress(this.bannerRef, remain / this.autoMs, CSS.purple);
      if (remain <= 0) {
        this.completed = true;
        const pivot = this.scene.workPivot;
        if (pivot) {
          const target = Math.round(pivot.rotation / (Math.PI * 2)) * Math.PI * 2;
          this.scene.tweens.add({ targets: pivot, rotation: target, duration: 900, ease: 'Cubic.InOut', onComplete: () => this.finish(true) });
        } else this.finish(true);
      }
      return;
    }
    // auto-timeout safety: sabotage should never soft-lock a kiosk round
    if (this.elapsed >= this.autoMs) {
      this.finish(false);
      return;
    }
    if (this.activeType === 'ice') this.drawBannerProgress(this.bannerRef, Math.max(this.taps / 6, 1 - this.elapsed / this.autoMs), CSS.blue);
    else if (this.activeType !== 'smoke' && this.activeType !== 'glitch') {
      this.drawBannerProgress(this.bannerRef, 1 - this.elapsed / this.autoMs, CSS.yellow);
    }
    if (this.activeType === 'glitch' && this.bannerRef) this.bannerRef.counter.setText(`${Math.max(0, 1 - this.elapsed / this.autoMs * 100).toFixed(0)}%`);
  }

  finish(success) {
    if (!this.active) return;
    const type = this.activeType;
    const player = this.scene.touch?.lastPlayer || this.scene.session.players[0];
    if (success) {
      audio.sfx('chime');
      flashScreen(this.scene, type === 'ice' ? 0xbfefff : type === 'gravity' ? 0xb55ddc : 0xfff4df, 140, 0.28);
    } else {
      this.scene.notify?.('GANGGUAN BERAKHIR OTOMATIS', 'warn');
    }
    const layer = this.active;
    this.active = null;
    this.activeType = null;
    this.completed = false;
    this.glitchPopup = null;
    this.glitchDrag = null;
    this.scene.tweens.add({ targets: layer, alpha: 0, duration: 280, onComplete: () => layer.destroy() });
    this.bannerRef = null;
    this.scene.onSabotageCleared?.(type, success, player);
    if (this.hiddenCipher?.active) this.hiddenCipher.setVisible(true);
    this.hiddenCipher = null;
    if (this.queue.length) {
      const next = this.queue.shift();
      this.scene.time.delayedCall(850, () => {
        if (!this.scene.round || this.scene.round.state === 'won' || this.scene.round.state === 'lost') return;
        this.open(next);
      });
    }
  }

  destroy() {
    if (this.scene?.input) {
      this.scene.input.off('pointerdown', this._onDown);
      this.scene.input.off('pointermove', this._onMove);
      this.scene.input.off('pointerup', this._onUp);
    }
    this.layer?.destroy(true);
    this.layer = null;
    this.active = null;
  }
}
