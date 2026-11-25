import { session } from '../core/session.js';
import { audio } from '../core/audio.js';
import { txt, panel, avatarBadge, goToScene, sparkBurst } from '../ui/factory.js';
import { CSS, FONT, THEME, MODULES } from '../config.js';

/** STATE 2 — MISSION BRIEFING + 3…2…1 countdown. */
export class BriefingScene extends Phaser.Scene {
  constructor() {
    super('Briefing');
  }

  init(data) {
    this.preview = session.preview || data?.preview || null;
    this.started = false;
    this.countIndex = 0;
    this.__leaving = false;
  }

  create() {
    this.__audioClick = () => audio.sfx('click');
    this.input.enabled = true;
    audio.setMusicLevel(0, false);
    this.add.image(960, 540, 'bg-menu').setDisplaySize(1920, 1080).setDepth(0);

    this.add.text(86, 50, 'MISSION BRIEFING', {
      fontFamily: FONT.mono, fontSize: '10px', color: CSS.red, fontStyle: 'bold', letterSpacing: 3, stroke: CSS.cream, strokeThickness: 3,
    }).setDepth(6);
    this.add.text(86, 72, 'BOMB DEFUSAL: CHAOS EDITION', {
      fontFamily: FONT.heading, fontSize: '22px', color: CSS.text,
    }).setDepth(6);
    this.add.text(86, 102, `RONDE ${String(session.roundNumber).padStart(2, '0')} • ${session.difficulty.label} • ${session.players.length} PEMAIN`, {
      fontFamily: FONT.body, fontSize: '10px', color: CSS.muted, letterSpacing: 1,
    }).setDepth(6);

    this.buildCase();
    this.buildMissionPanel();
    this.buildCountdown();
    this.add.image(960, 1064, 'cut-hazard').setDisplaySize(1920, 24).setAlpha(.45).setDepth(4);

    this.cameras.main.fadeIn(300, 7, 13, 24);
    this.hideBoot();
    this.time.delayedCall(380, () => { window.__BC_READY = true; });

    if (this.preview === 'briefing') this.freezePreview();
    else this.time.delayedCall(500, () => this.startCountdown());
  }

  buildCase() {
    this.add.circle(400, 588, 260, THEME.yellow, .05).setDepth(2);
    const img = this.add.image(400, 592, 'bomb-case').setDisplaySize(460, 348).setDepth(6);
    this.tweens.add({ targets: img, y: 584, duration: 3200, yoyo: true, repeat: -1, ease: 'Sine.InOut' });

    const tag = this.add.container(400, 340).setDepth(7);
    const g = this.add.graphics();
    g.fillStyle(THEME.yellow, 1).fillRoundedRect(-228, -26, 456, 52, 10);
    g.lineStyle(2, 0x05080f, .9).strokeRoundedRect(-228, -26, 456, 52, 10);
    const t = txt(this, 0, 0, 'BOM AKTIF • TARGET: JINAKKAN', { size: 15, font: FONT.heading, color: '#1A1205', letterSpacing: .6 });
    tag.add([g, t]);

    this.add.text(400, 800, `${session.moduleKeys.length} MODUL • ${session.timeMax} DETIK`, {
      fontFamily: FONT.heading, fontSize: '20px', color: CSS.text,
      stroke: CSS.cream, strokeThickness: 4,
    }).setOrigin(.5).setDepth(7);
    this.add.text(400, 828, '3 STRIKE = BOOM', {
      fontFamily: FONT.mono, fontSize: '10px', color: CSS.red, letterSpacing: 1.2,
      stroke: CSS.cream, strokeThickness: 3,
    }).setOrigin(.5).setDepth(7);
    this.add.text(400, 904, 'Jangan tinggalkan layar. Penonton boleh membantu.', {
      fontFamily: FONT.body, fontSize: '11px', color: CSS.text,
      stroke: CSS.cream, strokeThickness: 3,
    }).setOrigin(.5).setDepth(7);
  }

  buildMissionPanel() {
    const x = 760, y = 150, w = 1030, h = 756;
    panel(this, x, y, w, h, { depth: 5, fill: THEME.panel, alpha: .97, radius: 20 });
    this.add.graphics().fillStyle(THEME.yellow, .9).fillRoundedRect(x + 28, y + 26, 4, 52, 2).setDepth(7);
    this.add.text(x + 46, y + 24, 'OBJEKTIF UTAMA', {
      fontFamily: FONT.mono, fontSize: '10px', color: CSS.muted, letterSpacing: 1.6,
    }).setDepth(7);
    this.add.text(x + 46, y + 46, `JINAKKAN ${session.moduleKeys.length} MODUL`, {
      fontFamily: FONT.display, fontSize: '38px', color: CSS.text, letterSpacing: .6,
    }).setDepth(7);
    this.add.text(x + 46, y + 96, `dalam ${session.timeMax} detik. Setiap modul aman memberi +3 detik.`, {
      fontFamily: FONT.body, fontSize: '13px', color: CSS.muted,
    }).setDepth(7);

    session.moduleKeys.forEach((key, i) => {
      const meta = MODULES[key];
      const ry = y + 140 + i * 92;
      const row = this.add.graphics().setDepth(7);
      row.fillStyle(THEME.panelSoft, 1).fillRoundedRect(x + 34, ry, w - 68, 78, 12);
      row.lineStyle(1, THEME.borderSoft, .9).strokeRoundedRect(x + 34.5, ry + .5, w - 69, 77, 12);
      row.fillStyle(meta.accent, .85).fillRoundedRect(x + 34, ry + 12, 3, 54, 2);
      this.add.text(x + 58, ry + 15, meta.short, {
        fontFamily: FONT.heading, fontSize: '18px', color: CSS.text,
      }).setDepth(8);
      this.add.text(x + 58, ry + 41, meta.desc, {
        fontFamily: FONT.body, fontSize: '11.5px', color: CSS.dim,
      }).setDepth(8);
      this.add.image(x + w - 74, ry + 39, meta.icon).setDisplaySize(26, 26).setTint(meta.accent).setDepth(8);
      this.add.text(x + w - 100, ry + 16, `M0${i + 1}`, {
        fontFamily: FONT.mono, fontSize: '9px', color: CSS.dim, origin: 1, letterSpacing: .6,
      }).setDepth(8);
    });

    this.add.text(x + 46, y + 432, 'TIM ANDA', {
      fontFamily: FONT.mono, fontSize: '10px', color: CSS.muted, letterSpacing: 1.6,
    }).setDepth(7);
    session.players.forEach((player, i) => {
      const px = x + 100 + i * 190;
      avatarBadge(this, px, y + 502, player, 76, { number: true, depth: 9 });
      this.add.text(px, y + 552, player.name, {
        fontFamily: FONT.heading, fontSize: '17px', color: player.css,
      }).setOrigin(.5).setDepth(9);
      this.add.text(px, y + 574, player.modules.length ? `MODUL ${player.modules.map((n) => n + 1).join(' & ')}` : 'SUPPORT', {
        fontFamily: FONT.body, fontSize: '9px', color: CSS.dim, letterSpacing: .4,
      }).setOrigin(.5).setDepth(9);
    });

    const noteY = y + 624;
    const note = this.add.graphics().setDepth(7);
    note.fillStyle(THEME.panelSoft, 1).fillRoundedRect(x + 34, noteY, w - 68, 98, 12);
    note.lineStyle(1, THEME.red, .35).strokeRoundedRect(x + 34.5, noteY + .5, w - 69, 97, 12);
    note.fillStyle(THEME.red, .8).fillRoundedRect(x + 34, noteY + 14, 3, 70, 2);
    this.add.text(x + 56, noteY + 13, 'PERINGATAN SABOTASE', {
      fontFamily: FONT.mono, fontSize: '10px', color: '#FF9AA0', letterSpacing: 1.1,
    }).setDepth(8);
    this.add.text(x + 56, noteY + 36, 'Asap • Es • Gravity Flip • Glitch muncul saat timer menurun.', {
      fontFamily: FONT.body, fontSize: '12px', color: CSS.muted,
    }).setDepth(8);
    this.add.text(x + 56, noteY + 60, 'Gunakan telapak tangan, bukan satu jari. Tombol LEMPAR BOM ada di kanan bawah.', {
      fontFamily: FONT.body, fontSize: '11px', color: CSS.dim,
    }).setDepth(8);
  }

  buildCountdown() {
    const c = this.add.container(400, 592).setDepth(30);
    const ring = this.add.circle(0, 0, 138, 0x070b13, .58).setStrokeStyle(4, THEME.yellow, .9);
    const ring2 = this.add.circle(0, 0, 128, 0x000000, 0).setStrokeStyle(1.5, 0xffffff, .15);
    this.countText = txt(this, 0, -10, '3', {
      size: 142, font: FONT.display, color: CSS.yellow, stroke: CSS.ink, strokeThickness: 12,
    });
    this.countText.setShadow(0, 8, CSS.red, 0, true, true);
    this.countLabel = txt(this, 0, 104, 'BERSIAP...', { size: 11, font: FONT.mono, color: CSS.cream, letterSpacing: 2.2 });
    this.countPips = [];
    for (let i = 0; i < 3; i++) {
      const p = this.add.circle(-22 + i * 22, 130, 5, THEME.border, 1).setStrokeStyle(1, 0x05080f);
      this.countPips.push(p);
    }
    c.add([ring, ring2, this.countText, this.countLabel, ...this.countPips]);
    this.countContainer = c;
    this.countRing = ring;
    this.tweens.add({ targets: c, scale: 1.015, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }

  startCountdown() {
    if (this.started) return;
    this.started = true;
    const sequence = ['3', '2', '1', 'MULAI!'];
    const step = () => {
      if (this.countIndex >= sequence.length) return;
      const value = sequence[this.countIndex];
      const isGo = value === 'MULAI!';
      this.countText.setText(value);
      this.countText.setFontSize(isGo ? 82 : 142).setColor(isGo ? CSS.green : CSS.yellow);
      this.countLabel.setText(isGo ? 'BOM AKTIF!' : `KALIBRASI ${this.countIndex + 1}/3`);
      this.countPips.forEach((p, i) => p.setFillStyle(i < this.countIndex ? THEME.green : THEME.border, 1));
      this.countContainer.setScale(0.76).setAlpha(0.6);
      this.tweens.add({ targets: this.countContainer, scale: 1, alpha: 1, duration: 200, ease: 'Back.Out' });
      this.tweens.add({ targets: this.countRing, scale: { from: 0.9, to: 1.06 }, alpha: { from: 1, to: 0.35 }, duration: 650, ease: 'Quad.Out' });
      sparkBurst(this, 400, 592, isGo ? THEME.green : THEME.yellow, 8, { scale: 0.24, speed: 130 });
      audio.sfx(isGo ? 'countdown-go' : 'countdown');
      this.countIndex++;
      if (isGo) this.time.delayedCall(820, () => this.launchGame());
      else this.time.delayedCall(880, step);
    };
    step();
  }

  freezePreview() {
    this.started = true;
    this.countIndex = 1;
    this.countText.setText('2');
    this.countLabel.setText('KALIBRASI 2/3');
    this.countPips.forEach((p, i) => p.setFillStyle(i < 1 ? THEME.green : THEME.border, 1));
  }

  launchGame() {
    if (this.__leaving) return;
    session.startedAt = performance.now();
    goToScene(this, 'Game', {}, { fade: 260 });
  }

  hideBoot() {
    document.getElementById('boot-screen')?.classList.add('hidden');
  }
}
