import { session } from '../core/session.js';
import { audio } from '../core/audio.js';
import {
  txt, panel, imageButton, goToScene,
} from '../ui/factory.js';
import { CSS, FONT, THEME } from '../config.js';

const POOLS = {
  ren: [
    'Chaos Lab. Bom aktif. Kita punya satu kesempatan.',
    'Setiap modul aman menambah tiga detik. Jangan buang waktu.',
    'Semua tangan boleh bantu. Kita jinakkan bareng-bareng.',
  ],
  kai: [
    'Aku sudah baca skemanya. Tiga modul, satu timer, nol ruang panik.',
    'Jangan percaya layar. Lab ini suka berbohong.',
    'Kalau ada yang aneh, baca instruksinya dua kali.',
  ],
  mira: [
    'Nol ruang panik? Berarti aku teriak sekarang.',
    'Aku pegang ritmenya. Kalian pegang kabelnya.',
    'Kalau bom meledak, aku sudah siap pose superhero.',
  ],
  rin: [
    'Aku bawa gunting. Semoga bukan kabel yang salah.',
    'Kalau ada tombol merah, bukan aku yang sentuh.',
    'Ayo selesaikan sebelum aku bosan.',
  ],
};

/** Short pre-mission story. Speakers alternate through the selected party. */
export class StoryScene extends Phaser.Scene {
  constructor() {
    super('Story');
  }

  init() {
    this.lineIndex = 0;
    this.typing = null;
    this.typingText = '';
    this.__leaving = false;
  }

  create() {
    this.__audioClick = () => audio.sfx('click');
    this.input.enabled = true;

    this.add.image(960, 540, 'bg-pop').setDisplaySize(1920, 1080).setDepth(0);
    this.add.rectangle(960, 540, 1920, 1080, 0xfff4df, .12).setDepth(1);
    this.add.text(64, 42, 'PRE-MISSION // CHAOS LAB', {
      fontFamily: FONT.mono, fontSize: '10px', color: CSS.red, letterSpacing: 2.2, stroke: CSS.cream, strokeThickness: 3,
    }).setDepth(8);
    this.add.text(64, 64, 'SEBELUM BOM DINYALAKAN', {
      fontFamily: FONT.heading, fontSize: '22px', color: CSS.text,
    }).setDepth(8);

    this.buildParty();
    this.buildPortrait();
    this.buildDialogue();
    this.buildLines();

    this.skipBtn = imageButton(this, {
      x: 1755, y: 76, key: 'ui-skip', w: 220, h: 51, depth: 90,
      onClick: () => this.finish(),
    });
    this.input.on('pointerup', (pointer) => {
      if (pointer.x >= 1620 && pointer.y <= 150) this.finish();
      else this.advance();
    });

    this.showLine(0);
    this.cameras.main.fadeIn(300, 7, 13, 24);
    this.hideBoot();
    this.time.delayedCall(400, () => { window.__BC_READY = true; });
  }

  buildParty() {
    panel(this, 52, 96, 530, 88, { depth: 7, fill: THEME.panel, alpha: 1, radius: 16 });
    this.chips = [];
    const players = session.players;
    players.forEach((p, i) => {
      const x = 92 + i * 122;
      const c = this.add.container(x, 128).setDepth(9);
      const ring = this.add.circle(0, 0, 27, 0x05080f, .9).setStrokeStyle(2, p.color, .85);
      const img = this.add.image(0, 0, p.avatarCrop).setDisplaySize(50, 50);
      const name = txt(this, 0, 36, p.name, { size: 11, font: FONT.heading, color: CSS.text, letterSpacing: .5 });
      c.add([ring, img, name]);
      this.chips.push({ p, c, ring, img });
    });
  }

  buildPortrait() {
    this.portraitCard = this.add.container(1510, 500).setDepth(6);
    this.portraitShadow = this.add.rectangle(14, 18, 520, 730, 0x05080f, .55);
    this.portraitFrame = this.add.rectangle(0, 0, 520, 730, 0x05080f, 1).setStrokeStyle(6, THEME.yellow, .9);
    this.portrait = this.add.image(0, 0, 'portrait-ren').setDisplaySize(494, 692);
    this.portraitTag = this.add.graphics();
    this.portraitName = txt(this, -210, -334, 'REN', { size: 13, font: FONT.mono, color: CSS.yellow, origin: 0, letterSpacing: 1.6 });
    this.portraitCard.add([this.portraitShadow, this.portraitFrame, this.portrait, this.portraitTag, this.portraitName]);
    this.portraitCard.setAngle(-1);
    this.tweens.add({ targets: this.portraitCard, y: 492, duration: 3600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }

  buildDialogue() {
    panel(this, 64, 724, 1180, 248, { depth: 12, fill: THEME.panel, alpha: .97, radius: 22 });
    this.namePlate = this.add.container(104, 698).setDepth(16);
    this.nameBg = this.add.graphics();
    this.nameText = txt(this, 0, 0, 'REN', { size: 18, font: FONT.heading, color: '#1B1406' });
    this.namePlate.add([this.nameBg, this.nameText]);

    this.dialogueText = txt(this, 112, 786, '', {
      size: 24, font: FONT.body, color: CSS.text, origin: 0, wrap: 1080, lineSpacing: 8, align: 'left',
    }).setDepth(16);
    this.progressText = txt(this, 1210, 752, '1 / 5', { size: 10, font: FONT.mono, color: CSS.muted, origin: 1, letterSpacing: .8 }).setDepth(16);
    this.hintText = txt(this, 1210, 944, 'KETUK UNTUK LANJUT  →', { size: 10, font: FONT.mono, color: CSS.muted, origin: 1, letterSpacing: .8 }).setDepth(16);
    this.arrow = this.add.text(1218, 942, '▶', {
      fontFamily: FONT.body, fontSize: '10px', color: CSS.yellow,
    }).setOrigin(1, 1).setDepth(16).setAlpha(0);
    this.tweens.add({ targets: this.arrow, alpha: 1, duration: 420, yoyo: true, repeat: -1 });
    this.dots = [];
    for (let i = 0; i < 9; i++) {
      const d = this.add.circle(150 + i * 18, 958, 3, THEME.border, 1).setDepth(16);
      this.dots.push(d);
    }
  }

  buildLines() {
    const keys = session.players.map((p) => p.key);
    this.lines = [];
    for (let round = 0; round < 2; round++) {
      for (const key of keys) {
        this.lines.push({ key, text: POOLS[key][round] });
      }
    }
    this.lines.push({ key: 'ren', text: POOLS.ren[2] });
    this.dots.forEach((d, i) => d.setVisible(i < this.lines.length));
    this.portraitTag.clear();
  }

  showLine(index) {
    const line = this.lines[index];
    if (!line) { this.finish(); return; }
    const player = session.players.find((p) => p.key === line.key) || session.players[0];
    this.lineIndex = index;

    this.portrait.setTexture(`portrait-${player.key}`);
    this.portraitName.setText(player.name);
    this.portraitName.setColor(player.css);
    this.nameText.setText(player.name);
    this.nameText.setColor('#1B1406');
    this.nameBg.clear();
    this.nameBg.fillStyle(player.color, 1).fillRoundedRect(-78, -22, 156, 44, 10);
    this.nameBg.lineStyle(2, 0x05080f, .9).strokeRoundedRect(-78, -22, 156, 44, 10);
    this.namePlate.setScale(0.92).setAlpha(.8);
    this.tweens.add({ targets: this.namePlate, scale: 1, alpha: 1, duration: 160, ease: 'Back.Out' });
    this.portraitCard.setScale(0.97);
    this.tweens.add({ targets: this.portraitCard, scale: 1, duration: 220, ease: 'Back.Out' });

    this.chips.forEach(({ p, c, ring, img }) => {
      const active = p.key === player.key;
      c.setAlpha(active ? 1 : .8);
      c.setScale(active ? 1.1 : .92);
      ring.setStrokeStyle(active ? 3 : 2, p.color, active ? 1 : .4);
      img.setAlpha(active ? 1 : .9);
    });

    this.progressText.setText(`${index + 1} / ${this.lines.length}`);
    this.dots.forEach((d, i) => d.setFillStyle(i <= index ? player.color : THEME.border, 1));

    this.dialogueText.setText('');
    this.typingText = line.text;
    let char = 0;
    this.typing?.remove(false);
    this.typing = this.time.addEvent({
      delay: 22,
      loop: true,
      callback: () => {
        char += 2;
        this.dialogueText.setText(this.typingText.slice(0, char));
        if (char % 6 === 0) audio.sfx('type');
        if (char >= this.typingText.length) {
          this.dialogueText.setText(this.typingText);
          this.typing?.remove(false);
          this.typing = null;
          this.arrow.setVisible(true);
        }
      },
    });
    this.arrow.setVisible(false);
    audio.sfx(index === 0 ? 'trigger' : 'click');
  }

  advance() {
    if (this.__leaving) return;
    if (this.typing) {
      this.typing.remove(false);
      this.typing = null;
      this.dialogueText.setText(this.typingText);
      this.arrow.setVisible(true);
      return;
    }
    if (this.lineIndex >= this.lines.length - 1) { this.finish(); return; }
    this.showLine(this.lineIndex + 1);
  }

  finish() {
    if (this.__leaving) return;
    this.typing?.remove(false);
    audio.sfx('trigger');
    goToScene(this, 'Briefing', {}, { fade: 260 });
  }

  hideBoot() {
    document.getElementById('boot-screen')?.classList.add('hidden');
  }
}
