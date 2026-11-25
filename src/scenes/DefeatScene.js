import { session } from '../core/session.js';
import { audio } from '../core/audio.js';
import { loadSettings } from '../core/storage.js';
import {
  txt, panel, button, goToScene, formatNumber, formatTimeLeft,
} from '../ui/factory.js';
import { CSS, FONT, THEME, PENALTY_CARDS } from '../config.js';

/** STATE 4B / 5 — DETONATED + safe-for-public penalty card. */
export class DefeatScene extends Phaser.Scene {
  constructor() {
    super('Defeat');
  }

  init(data) {
    this.preview = session.preview || data?.preview || null;
    this.demo = session.demo || !!data?.demo;
    this.reason = data?.reason || session.resultReason || 'BOM MELEDAK';
    this.settings = loadSettings();
    this.autoSeconds = Number(this.settings.autoResetSeconds) || 30;
    this.penalty = this.settings.penaltyCards ? PENALTY_CARDS[this.demo ? 0 : Phaser.Math.Between(0, PENALTY_CARDS.length - 1)] : null;
    this.__leaving = false;
  }

  create() {
    this.__audioClick = () => audio.sfx('click');
    this.input.enabled = true;
    audio.stopMusic();
    this.add.image(960, 540, 'bg-game').setDisplaySize(1920, 1080).setDepth(0);
    this.add.rectangle(960, 540, 1920, 1080, 0xF2555F, 0.10).setDepth(1);
    this.add.image(960, 540, 'fx-glass-crack').setDisplaySize(1920, 1080).setDepth(3).setAlpha(0.28);
    this.add.image(250, 960, 'cut-cloud').setDisplaySize(560, 354).setAlpha(.18).setDepth(3).setTint(0x2A2F3A);
    this.add.image(900, 1010, 'cut-cloud').setDisplaySize(440, 278).setAlpha(.12).setDepth(3).setTint(0x2A2F3A);

    this.add.text(72, 44, 'MISSION FAILED // DETONATED', {
      fontFamily: FONT.mono, fontSize: '10px', color: CSS.red, letterSpacing: 2.2, stroke: CSS.cream, strokeThickness: 3,
    }).setDepth(10);
    this.add.text(72, 66, `${session.difficulty.label} • ${session.players.length} PEMAIN • RONDE ${String(session.roundNumber).padStart(2, '0')}`, {
      fontFamily: FONT.body, fontSize: '10px', color: CSS.text, letterSpacing: .9, stroke: CSS.cream, strokeThickness: 2,
    }).setDepth(10);
    this.add.text(1848, 44, `SKOR ${formatNumber(session.score)}`, {
      fontFamily: FONT.mono, fontSize: '11px', color: CSS.red, letterSpacing: 1.2,
      stroke: CSS.cream, strokeThickness: 3,
    }).setOrigin(1, 0).setDepth(10);

    this.add.image(220, 248, 'cut-boom').setDisplaySize(300, 295).setDepth(5);
    const title = txt(this, 392, 154, 'BOOM!', {
      size: 118, font: FONT.display, color: CSS.red, stroke: CSS.ink, strokeThickness: 14, origin: 0,
    }).setDepth(12);
    title.setShadow(0, 10, CSS.yellow, 0, true, true);
    this.tweens.add({ targets: title, scale: { from: .94, to: 1.02 }, angle: -1, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.add.text(396, 320, 'TIM GAGAL MENJINAKKAN BOM', {
      fontFamily: FONT.heading, fontSize: '19px', color: CSS.text, letterSpacing: .4,
    }).setDepth(12);
    this.add.text(396, 348, `ALASAN: ${this.reason.toUpperCase()}`, {
      fontFamily: FONT.mono, fontSize: '9px', color: '#B4232E', letterSpacing: 1, stroke: CSS.cream, strokeThickness: 3,
    }).setDepth(12);

    this.buildStats();
    if (this.penalty) this.buildPenaltyCard();
    else this.buildNoPenaltyCard();
    this.buildFooter();

    this.cameras.main.fadeIn(360, 7, 13, 24);
    this.hideBoot();
    this.time.delayedCall(450, () => { window.__BC_READY = true; });
    if (!this.demo) {
      this.time.addEvent({
        delay: 1000,
        loop: true,
        callback: () => {
          if (this.__leaving) return;
          this.autoSeconds--;
          if (this.autoLabel) this.autoLabel.setText(`KEMBALI KE MENU DALAM ${this.autoSeconds} DETIK`);
          if (this.autoSeconds <= 0) goToScene(this, 'Attract', {}, { fade: 360 });
        },
      });
    }
  }

  buildStats() {
    const x = 64, y = 380, w = 700, h = 500;
    panel(this, x, y, w, h, { depth: 10, fill: THEME.panel, alpha: .96, radius: 18 });
    this.add.text(x + 28, y + 22, 'BLACK BOX // HASIL RONDE', {
      fontFamily: FONT.mono, fontSize: '10px', color: CSS.muted, letterSpacing: 1.5,
    }).setDepth(12);
    const rows = [
      ['WAKTU TERSISA', formatTimeLeft(Math.max(0, session.timeLeft)), CSS.red],
      ['MODUL AMAN', `${session.solved}/${session.moduleCount}`, session.solved === session.moduleCount ? CSS.green : '#B45309'],
      ['STRIKE', `${session.strikes}/3`, CSS.red],
      ['SABOTASE', `${session.sabotageCleared} DIBERSIHKAN`, CSS.purple],
      ['SKOR TIM', formatNumber(session.score), CSS.red],
    ];
    rows.forEach(([label, value, color], i) => {
      const ry = y + 72 + i * 56;
      this.add.text(x + 30, ry, label, {
        fontFamily: FONT.body, fontSize: '11px', color: CSS.muted, letterSpacing: .8,
      }).setDepth(12);
      this.add.text(x + w - 30, ry - 5, value, {
        fontFamily: FONT.mono, fontSize: '19px', color,
      }).setOrigin(1, 0).setDepth(12);
      if (i < rows.length - 1) {
        this.add.rectangle(x + 30, ry + 33, w - 60, 1, THEME.border, .65).setOrigin(0, .5).setDepth(12);
      }
    });
    const contributions = session.players.map((p) => `${p.name} ${formatNumber(p.contribution)}`).join('  •  ');
    this.add.text(x + 30, y + h - 62, 'KONTRIBUSI', {
      fontFamily: FONT.mono, fontSize: '9px', color: CSS.muted, letterSpacing: 1,
    }).setDepth(12);
    this.add.text(x + 30, y + h - 42, contributions, {
      fontFamily: FONT.body, fontSize: '11px', color: CSS.muted,
    }).setDepth(12);
    this.add.text(x + w - 30, y + h - 42, 'TIDAK MASUK PAPAN SKOR', {
      fontFamily: FONT.mono, fontSize: '8.5px', color: '#8A6A5A', letterSpacing: .3,
    }).setOrigin(1, 0).setDepth(12);
  }

  buildPenaltyCard() {
    const card = this.add.container(1330, 596).setDepth(15).setAngle(-1.1);
    const frame = this.add.image(0, 0, 'cut-frame-penalty').setDisplaySize(740, 872);
    const paper = this.add.graphics();
    paper.fillStyle(0xF7EEDC, 1).fillRoundedRect(-270, -318, 540, 636, 6);
    paper.fillStyle(0xE8DCC3, 1).fillRect(-270, -318, 540, 6);
    const kicker = txt(this, -238, -292, 'MISI PENEBUSAN DOSA', {
      size: 31, font: FONT.display, color: '#1A1205', origin: 0,
    });
    const sub = txt(this, -238, -250, 'HUKUMAN RINGAN • SELESAIKAN DALAM 5–10 DETIK', {
      size: 9, font: FONT.body, color: '#7B6B55', origin: 0, letterSpacing: .6,
    });
    const rule = this.add.graphics();
    rule.lineStyle(2, 0x1A1205, .25).lineBetween(-238, -220, 238, -220);

    const iconDisc = this.add.circle(-196, -140, 56, 0x1A1205, .08);
    const icon = this.add.image(-196, -140, this.penalty.icon).setDisplaySize(70, 70).setTint(0x1A1205);
    const pTitle = txt(this, -116, -180, this.penalty.title, {
      size: 32, font: FONT.display, color: '#1A1205', origin: 0, wrap: 340,
    });
    const pText = txt(this, -238, -60, this.penalty.text, {
      size: 16, font: FONT.body, color: '#3A3226', origin: 0, wrap: 476, lineSpacing: 6, align: 'left',
    });
    const tape = this.add.graphics();
    tape.fillStyle(0xFFC93C, 1).fillRect(-250, 92, 500, 34);
    tape.lineStyle(2, 0x1A1205, .9).strokeRect(-250, 92, 500, 34);
    const tapeText = txt(this, 0, 109, 'TUNJUKKAN DI DEPAN LAYAR!', {
      size: 10, font: FONT.mono, color: '#241A05', letterSpacing: .8,
    });
    const replay = button(this, {
      x: 84, y: 228, w: 288, h: 78, label: 'MAIN LAGI', variant: 'primary', fontSize: 19, depth: 1,
      onClick: () => this.replay(),
    });
    const home = button(this, {
      x: -178, y: 228, w: 200, h: 78, label: 'LAYAR UTAMA', variant: 'ghost', fontSize: 12, depth: 1,
      onClick: () => this.home(),
    });
    card.add([frame, paper, kicker, sub, rule, iconDisc, icon, pTitle, pText, tape, tapeText, replay.container, home.container]);
    card.setScale(0.94).setAlpha(0);
    this.tweens.add({ targets: card, scale: 1, alpha: 1, duration: 380, ease: 'Back.Out', delay: 100 });
    this.penaltyCard = card;
    this.add.text(1330, 1046, 'KARTU HUKUMAN RINGAN & TIDAK MEMPERMALUKAN • BISA DINONAKTIFKAN DI ADMIN', {
      fontFamily: FONT.mono, fontSize: '8px', color: CSS.muted, letterSpacing: .5,
      stroke: CSS.cream, strokeThickness: 2,
    }).setOrigin(0.5).setDepth(12);
  }

  buildNoPenaltyCard() {
    const x = 880, y = 360, w = 940, h = 480;
    panel(this, x, y, w, h, { depth: 14, fill: THEME.panel, alpha: .96, radius: 18 });
    txt(this, x + w / 2, y + 88, 'MISI BERAKHIR', {
      size: 52, font: FONT.display, color: CSS.yellow, stroke: CSS.ink, strokeThickness: 8,
    }).setDepth(16);
    txt(this, x + w / 2, y + 152, 'Kartu hukuman dinonaktifkan oleh operator. Tidak apa-apa — bom memang licik.', {
      size: 13, font: FONT.body, color: CSS.muted, wrap: 720,
    }).setDepth(16);
    txt(this, x + w / 2, y + 238, formatNumber(session.score), {
      size: 68, font: FONT.heading, color: CSS.yellow,
    }).setDepth(16);
    txt(this, x + w / 2, y + 292, 'SKOR AKHIR TIM', { size: 9, font: FONT.mono, color: CSS.dim, letterSpacing: 2 }).setDepth(16);
    button(this, {
      x: x + w / 2 - 180, y: y + 388, w: 330, h: 82, label: 'COBA LAGI', variant: 'primary', fontSize: 21, depth: 16,
      onClick: () => this.replay(),
    });
    button(this, {
      x: x + w / 2 + 190, y: y + 388, w: 300, h: 82, label: 'LAYAR UTAMA', variant: 'ghost', fontSize: 16, depth: 16,
      onClick: () => this.home(),
    });
  }

  buildFooter() {
    this.add.image(960, 1064, 'cut-hazard').setDisplaySize(1920, 24).setAlpha(.4).setDepth(4);
    this.autoLabel = this.add.text(64, 1006, `KEMBALI KE MENU DALAM ${this.autoSeconds} DETIK`, {
      fontFamily: FONT.mono, fontSize: '9px', color: CSS.muted, letterSpacing: .7,
      stroke: CSS.cream, strokeThickness: 3,
    }).setDepth(12);
  }

  replay() {
    if (this.__leaving) return;
    audio.sfx('select');
    session.create({ playerCount: session.players.length, difficultyKey: session.difficultyKey });
    session.preview = null;
    session.demo = false;
    goToScene(this, 'Briefing', {}, { fade: 300 });
  }

  home() {
    if (this.__leaving) return;
    audio.sfx('back');
    session.preview = null;
    session.demo = false;
    goToScene(this, 'Attract', {}, { fade: 300 });
  }

  hideBoot() {
    document.getElementById('boot-screen')?.classList.add('hidden');
  }
}
