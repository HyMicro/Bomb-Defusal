import { session } from '../core/session.js';
import { loadSettings, settingsBus } from '../core/storage.js';
import { audio } from '../core/audio.js';
import { TouchManager } from '../core/input.js';
import { RoundManager } from '../managers/RoundManager.js';
import { SabotageManager } from '../managers/SabotageManager.js';
import { createPuzzle } from '../puzzles/index.js';
import {
  txt, panel, button, imageButton, progressBar, timerDisplay, strikeRow, scorePlate,
  playerTag, confettiBurst, floatText, flashScreen,
  screenShake, goToScene, formatNumber, sparkBurst,
} from '../ui/factory.js';
import { CSS, FONT, THEME, MODULES, DIFFICULTIES, CIPHER_SYMBOLS, SABOTAGES } from '../config.js';

/**
 * ACTIVE DEFUSAL LOOP.
 * 3-column work zone + top status HUD + bottom progress/control rail.
 * Owns the touch manager, round clock, sabotage director and puzzle modules.
 */
export class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init(data) {
    this.entryData = data || {};
    this.preview = session.preview || this.entryData.preview || null;
    this.ending = false;
    this.idleWarned = false;
    this.__leaving = false;
    this.lastActivity = performance.now();
  }

  create() {
    this.settings = loadSettings();
    this.input.enabled = true;
    audio.setPrefs({ sound: this.settings.sound, music: this.settings.music });
    this.__audioClick = () => audio.sfx('click');

    if (!session.players.length) {
      session.create({ playerCount: 3, difficultyKey: this.settings.difficulty });
    }
    this.session = session;
    this.settings = loadSettings();
    this.preview = session.preview || this.preview;

    if (this.preview === 'gameplay' || this.preview === 'sabotage') {
      this.preparePreview();
    }

    this.add.image(960, 540, 'bg-game').setDisplaySize(1920, 1080).setDepth(0);
    if (this.textures.exists('overlay-halftone')) {
      this.add.image(960, 540, 'overlay-halftone').setDisplaySize(1920, 1080).setAlpha(0.18).setDepth(1);
    }
    this.createAmbience();

    this.workPivot = this.add.container(960, 588).setDepth(10);
    this.modules = [];
    this.playerTags = [];
    this.cipherBanner = null;
    this.createHud();
    this.buildModules();
    this.refreshProgress();
    this.refreshPlayerTags();
    this.updateScore(0, false);

    this.touch = new TouchManager(this, { players: session.players, depth: 98 });
    this.round = new RoundManager(this, {
      timeLimit: session.timeMax,
      difficultyKey: session.difficultyKey,
      sabotageEnabled: this.settings.sabotage,
      preview: !!this.preview,
    });
    this.round.moduleCount = session.moduleKeys.length;
    this.round.strikes = session.strikes;
    this.round.solved = 0;
    this.sabotage = new SabotageManager(this, { enabled: this.settings.sabotage, onCleared: null });

    this.lastPassCheck = 0;
    this.idleOverlay = null;
    this.cameras.main.fadeIn(360, 6, 9, 16);
    this.input.on('pointerdown', () => this.bumpActivity());

    this.round.start();
    if (this.preview) {
      this.round.paused = true;
      this.round.timeLeft = this.preview === 'sabotage' ? 22 : 32;
      this.session.timeLeft = this.round.timeLeft;
      this.round.strikes = 1;
      this.session.strikes = 1;
      this.session.score = this.preview === 'sabotage' ? 2140 : 3480;
      this.session.players.forEach((p, i) => { p.contribution = [1480, 1120, 880][i] || 0; });
      this.timer.setTime(this.round.timeLeft, false);
      this.timer.setStatus('STANDAR • 0/3 MODUL');
      this.strikeDisplay.set(1);
      this.strikeText.setText('1/3').setColor(CSS.text);
      this.scorePlate.setScore(this.session.score);
      this.refreshPlayerTags();
      this.modules.forEach((m) => m.demoState?.());
      this.passBombBtn.setDisabled(false);
      this.passCaption.setText('1× PER RONDE • HADIAH +5 DETIK');
      this.time.delayedCall(550, () => {
        if (this.preview === 'sabotage') {
          this.sabotage.open('smoke');
        }
      });
      this.time.delayedCall(250, () => {
        const p = { x: 1080, y: 540 };
        sparkBurst(this, p.x, p.y, 0xffc93c, 8, { scale: 0.3, speed: 130 });
      });
      this.time.delayedCall(900, () => { window.__BC_READY = true; hideBoot(); });
    } else {
      this.time.delayedCall(800, hideBoot);
    }

    this.time.delayedCall(350, () => this.refreshHudTextures());
    this.time.delayedCall(1400, () => this.refreshHudTextures());
    this.events.once('shutdown', () => this.cleanup());
    this.scale.on('resize', () => {});
  }

  refreshHudTextures() {
    if (!this.scorePlate || !this.sys.isActive()) return;
    this.scorePlate.setScore(session.score);
    this.refreshPlayerTags();
    this.timer.setTime(this.round?.timeLeft ?? session.timeLeft, false);
  }

  preparePreview() {
    session.demo = true;
    session.difficultyKey = 'standard';
    session.difficulty = DIFFICULTIES.standard;
    session.moduleKeys = ['wires', 'cipher', 'reverse'];
    session.moduleCount = 3;
    session.timeMax = 40;
    session.timeLeft = this.preview === 'sabotage' ? 22 : 32;
    session.players = session.players.slice(0, 3);
    const split = this.preview === 'sabotage' ? [980, 680, 480] : [1480, 1120, 880];
    session.players.forEach((p, i) => {
      p.modules = i < 3 ? [i] : [];
      p.contribution = split[i] || 0;
    });
    session.strikes = 1;
    session.score = this.preview === 'sabotage' ? 2140 : 3480;
  }

  createAmbience() {
    const embers = this.add.container(0, 0).setDepth(2).setAlpha(0.4);
    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(120, 1800);
      const y = Phaser.Math.Between(320, 1000);
      const img = this.add.image(x, y, 'fx-spark').setTint([0xffc93c, 0x4c9bff][i % 2])
        .setScale(0.04 + Math.random() * 0.06).setAlpha(0.18 + Math.random() * 0.22)
        .setBlendMode(Phaser.BlendModes.ADD);
      embers.add(img);
      this.tweens.add({
        targets: img, y: y - Phaser.Math.Between(30, 100), alpha: 0,
        duration: 4200 + Math.random() * 4000, repeat: -1, delay: Math.random() * 4000,
        onRepeat: () => { img.y = Phaser.Math.Between(320, 1000); img.alpha = 0.18 + Math.random() * 0.22; },
      });
    }
  }

  buildModules() {
    const count = session.moduleKeys.length;
    const xs = count === 2 ? [360, 1000] : [80, 680, 1280];
    const variants = { reverse: 'A' };
    session.moduleKeys.forEach((key, i) => {
      const owner = session.ownerOfModule(i);
      const puzzle = createPuzzle(key, this, {
        index: i,
        owner,
        variant: this.preview ? (variants[key] || undefined) : undefined,
        x: xs[i] - 960,
        y: 278 - 588,
        layer: this.workPivot,
        demo: !!this.preview,
        onSolved: (p) => this.handleModuleSolved(p),
        onMistake: (p, seconds, message) => this.handleModuleMistake(p, seconds, message),
        notify: (text, type) => this.notify(text, type),
      });
      this.modules.push(puzzle);
      this.tweens.add({ targets: puzzle.root, alpha: { from: 0, to: 1 }, duration: 240, delay: 100 + i * 70 });
    });
  }

  createHud() {
    this.hudDepth = 20;
    panel(this, 24, 12, 1872, 140, { depth: 18, fill: THEME.panelSoft, alpha: .96, radius: 16 });
    const topLine = this.add.graphics().setDepth(19);
    topLine.lineStyle(1, THEME.border, .9).lineBetween(44, 152, 1876, 152);
    topLine.fillStyle(THEME.yellow, .9).fillRoundedRect(28, 32, 4, 44, 2);

    // round chip
    const chipG = this.add.graphics().setDepth(19);
    chipG.fillStyle(THEME.panel, .96).fillRoundedRect(44, 26, 288, 50, 12);
    chipG.lineStyle(1, THEME.border, .85).strokeRoundedRect(44.5, 26.5, 287, 49, 12);
    this.add.text(58, 33, `RONDE ${String(session.roundNumber).padStart(2, '0')}`, {
      fontFamily: FONT.heading, fontSize: '17px', color: CSS.text, letterSpacing: .3,
    }).setDepth(20);
    this.add.text(58, 55, `${session.difficulty.label} • ${session.players.length} PEMAIN`, {
      fontFamily: FONT.body, fontSize: '9px', color: CSS.muted, letterSpacing: .7,
    }).setDepth(20);

    // players
    session.players.forEach((player, i) => {
      const tag = playerTag(this, 44 + i * 176, 94, player, { width: 168, height: 42 });
      tag.container.setDepth(20);
      this.playerTags.push(tag);
    });

    // timer
    this.timer = timerDisplay(this, 960, 76, { w: 430, h: 124, depth: 20 });
    this.timer.setTime(session.timeLeft, false);
    this.timer.setStatus(`${session.solved}/${session.moduleKeys.length} MODUL`);

    // score + lives
    this.scorePlate = scorePlate(this, 1490, 26, { w: 360, h: 62, depth: 20 });
    this.scorePlate.setScore(session.score);
    this.add.text(1490, 100, 'NYAWA', {
      fontFamily: FONT.body, fontSize: '9px', color: CSS.muted, letterSpacing: 1.2,
    }).setDepth(20);
    this.strikeDisplay = strikeRow(this, 1552, 112, { size: 22, max: 3, depth: 20 });
    this.strikeDisplay.set(session.strikes);
    this.strikeText = this.add.text(1864, 112, '0/3', {
      fontFamily: FONT.mono, fontSize: '12px', color: CSS.text,
    }).setOrigin(1, 0.5).setDepth(20);

    // bottom progress
    panel(this, 40, 926, 1180, 116, { depth: 18, fill: THEME.panelSoft, alpha: .96, radius: 16 });
    this.add.text(64, 942, 'PROGRESS MISI', {
      fontFamily: FONT.heading, fontSize: '14px', color: CSS.muted, letterSpacing: .8,
    }).setDepth(20);
    this.progressPercent = this.add.text(1196, 942, '0%', {
      fontFamily: FONT.mono, fontSize: '14px', color: CSS.red,
    }).setOrigin(1, 0).setDepth(20);
    this.progressBar = progressBar(this, 64, 974, 1130, 24, { depth: 20, segments: session.moduleKeys.length });
    this.progressText = this.add.text(64, 1008, '0 MODUL AMAN', {
      fontFamily: FONT.body, fontSize: '10px', color: CSS.dim, letterSpacing: .7,
    }).setDepth(20);

    // pass bomb
    panel(this, 1530, 926, 350, 116, { depth: 18, fill: 0x1b1406, border: 0xffc93c, alpha: 1, radius: 16 });
    this.passBombBtn = imageButton(this, {
      x: 1705, y: 964, key: 'ui-bomb', w: 310, h: 58, depth: 21,
      onClick: () => this.openPassBomb(), burstColor: 0xffc93c,
    });
    this.passBombBtn.setDisabled(true);
    this.passCaption = this.add.text(1705, 1008, '1× PER RONDE • BUTUH >8 DETIK', {
      fontFamily: FONT.body, fontSize: '9px', color: '#C9BBA4', letterSpacing: .4,
    }).setOrigin(0.5, 0).setDepth(20);

    // warning border
    this.dangerBorder = this.add.graphics().setDepth(60).setAlpha(0);
    this.dangerBorder.lineStyle(7, 0xff2028, 0.7).strokeRoundedRect(12, 12, 1896, 1056, 26);

    this.toast = null;
    this.toastTimer = null;
  }

  /* ------------------------------------------------------------------ */
  bumpActivity() {
    this.lastActivity = performance.now();
    if (this.idleWarned) {
      this.idleWarned = false;
      this.idleTween?.stop();
      this.idleTween = null;
      this.idleOverlay?.destroy();
      this.idleOverlay = null;
      this.notify('PEMAIN KEMBALI — LANJUTKAN!', 'info');
    }
  }

  update(time, delta) {
    if (!this.round) return;
    this.round.update(time, delta);
    if (!this.ending) {
      if (!this.round.paused || this.preview) this.sabotage?.update(delta);
      if (!this.preview && !this.round.paused && this.round.state === 'running') {
        for (const m of this.modules) m.update?.(time, delta);
      }
      this.updatePassButton();
      this.updateDanger(time);
      this.checkIdle(time);
    }
  }

  updateDanger(time) {
    if (!this.dangerBorder) return;
    if (this.round.timeLeft <= 10 && this.round.state === 'running' && !this.round.finished) {
      this.dangerBorder.setAlpha(0.18 + Math.abs(Math.sin(time / 240)) * 0.3);
    } else {
      this.dangerBorder.setAlpha(0);
    }
  }

  checkIdle(time) {
    if (this.preview || this.round?.finished || this.round?.paused) return;
    const idleFor = performance.now() - this.lastActivity;
    if (idleFor > 15000 && !this.idleWarned) {
      this.idleWarned = true;
      this.showIdleWarning();
    }
    if (idleFor > 20000 && this.idleWarned) {
      this.idleWarned = false;
      this.round.pause();
      this.notify('TIDAK ADA AKTIVITAS — KEMBALI KE MENU', 'warn');
      goToScene(this, 'Attract', {}, { fade: 380 });
    }
  }

  showIdleWarning() {
    if (this.idleOverlay) return;
    const c = this.add.container(960, 540).setDepth(110);
    const dim = this.add.rectangle(0, 0, 1920, 1080, 0x070b13, 0.55).setInteractive();
    const g = this.add.graphics();
    g.fillStyle(0x0e1524, 0.96).fillRoundedRect(-430, -130, 860, 260, 26);
    g.lineStyle(4, 0xffc93c, 0.9).strokeRoundedRect(-430, -130, 860, 260, 26);
    const title = txt(this, 0, -56, 'MASIH ADA ORANG?', { size: 52, font: FONT.display, color: CSS.yellow, stroke: CSS.ink, strokeThickness: 7 });
    const sub = txt(this, 0, 8, 'Sentuh layar untuk melanjutkan misi. Kios akan kembali ke menu jika tidak ada aktivitas.', {
      size: 15, font: FONT.body, color: '#C7D2E5', wrap: 700,
    });
    const count = txt(this, 0, 73, 'RESET OTOMATIS DALAM 5 DETIK', { size: 11, font: FONT.mono, color: '#FF7F85', letterSpacing: 1.5 });
    c.add([dim, g, title, sub, count]);
    c.setScale(0.85).setAlpha(0);
    this.tweens.add({ targets: c, alpha: 1, scale: 1, duration: 220, ease: 'Back.Out' });
    this.idleTween = this.tweens.addCounter({
      from: 5, to: 0, duration: 5000,
      onUpdate: (tw) => { if (count.active) count.setText(`RESET OTOMATIS DALAM ${Math.ceil(tw.getValue())} DETIK`); },
      onComplete: () => { this.idleTween = null; },
    });
    this.idleOverlay = c;
  }

  updatePassButton() {
    const now = performance.now();
    if (now - (this.lastPassCheck || 0) < 250) return;
    this.lastPassCheck = now;
    if (!this.passCaption) return;
    if (this.preview) {
      this.passBombBtn.setDisabled(false);
      this.passCaption.setText('1× PER RONDE • HADIAH +5 DETIK');
      return;
    }
    const can = this.round.canPassBomb() && this.settings.passBomb && !this.sabotage?.isActive && !this.ending;
    this.passBombBtn.setDisabled(!can);
    if (!this.settings.passBomb) this.passCaption.setText('NONAKTIF DI PENGATURAN');
    else if (this.session.passUsed) this.passCaption.setText('SUDAH DIPAKAI RONDE INI');
    else if (this.round.timeLeft <= 8) this.passCaption.setText('BUTUH SISA WAKTU > 8 DETIK');
    else if (this.sabotage?.isActive) this.passCaption.setText('SELESAIKAN GANGGUAN DULU');
    else this.passCaption.setText('1× PER RONDE • HADIAH +5 DETIK');
  }

  refreshPlayerTags() {
    if (!this.playerTags) return;
    session.players.forEach((p, i) => {
      const tag = this.playerTags[i];
      if (!tag) return;
      tag.score.setText(`${formatNumber(p.contribution)} PT`);
    });
  }

  refreshProgress() {
    if (!this.progressBar) return;
    const total = session.moduleKeys.length;
    const solved = Math.min(total, session.solved);
    const ratio = total ? solved / total : 0;
    const color = ratio >= 1 ? 0x45d6a0 : ratio > 0.5 ? 0xffc93c : 0x4c9bff;
    this.progressBar.setProgress(ratio, color);
    this.progressPercent.setText(`${Math.round(ratio * 100)}%`);
    this.progressText.setText(`${solved} DARI ${total} MODUL AMAN`);
    this.nodeDots?.forEach((node, i) => {
      const done = i < solved;
      node.dot.setFillStyle(done ? 0x45d6a0 : 0x263248, 1);
      node.label.setColor(done ? CSS.green : '#6C7A99');
    });
    if (this.timer) this.timer.setStatus(`${session.difficulty.label} • ${solved}/${total} MODUL`);
  }

  updateScore(points = 0, animate = true) {
    if (!this.scorePlate) return;
    this.scorePlate.setScore(session.score, animate);
    if (points > 0) this.scorePlate.popDelta(`+${formatNumber(points)}`, true);
    this.refreshPlayerTags();
  }

  /* ------------------------------------------------------------------ */
  onTimeChanged(timeLeft, urgent) {
    this.timer?.setTime(timeLeft, urgent);
    if (this.session) this.session.timeLeft = timeLeft;
  }

  onTick(timeLeft) {
    if (timeLeft <= 5) {
      this.timer?.pulse();
      this.cameras.main.shake(55, 0.0012);
    }
  }

  onTimeBonus(seconds) {
    floatText(this, 960, 210, `+${seconds} DETIK!`, CSS.green, { size: 30, up: 60 });
    this.timer?.pulse();
  }

  onRoundIntro() {
    if (this.preview) return;
    audio.sfx('countdown-go');
    const t = txt(this, 960, 540, 'MULAI!', {
      size: 150, font: FONT.display, color: CSS.yellow, stroke: CSS.ink, strokeThickness: 16,
    }).setDepth(120).setScale(0.5).setAlpha(0);
    t.setShadow(0, 14, CSS.red, 0, true, true);
    this.tweens.add({ targets: t, scale: 1, alpha: 1, duration: 260, ease: 'Back.Out' });
    this.tweens.add({ targets: t, alpha: 0, scale: 1.3, delay: 620, duration: 320, onComplete: () => t.destroy() });
  }

  onRoundStarted() {
    if (this.preview) {
      this.timer?.setTime(this.round?.timeLeft ?? session.timeLeft, false);
      return;
    }
    audio.startMusic();
    this.bumpActivity();
  }

  onRoundPaused(paused) {
    if (paused) this.sabotage?.pause?.();
  }

  onMusicIntensity(level) {
    if (level === 2) this.notify('DETAK JANTUNG NAIK — 10 DETIK TERSISA!', 'warn');
  }

  onStrike(strikes, seconds, message, player) {
    this.strikeDisplay.set(strikes);
    this.strikeDisplay.flash();
    this.strikeText.setText(`${strikes}/3`).setColor(strikes >= 2 ? CSS.red : CSS.cream);
    this.notify(message || `STRIKE ${strikes}/3 — ${seconds} DETIK HILANG!`, 'error');
    this.scorePlate.setScore(session.score);
    this.refreshPlayerTags();
  }

  handleModuleSolved(puzzle) {
    if (this.ending) return;
    if (puzzle.moduleKey === 'cipher') this.hideCipherBanner();
    const p = puzzle.worldPoint(280, 300);
    floatText(this, p.x, p.y, '+800', CSS.yellow, { size: 30, up: 80 });
    floatText(this, p.x, p.y + 44, '+3 DETIK', CSS.green, { size: 20, up: 62 });
    this.round.solveModule(puzzle);
    this.bumpActivity();
  }

  onModuleSolved(puzzle) {
    this.refreshProgress();
    this.refreshPlayerTags();
    this.updateScore(800 * session.difficulty.scoreMult);
  }

  handleModuleMistake(puzzle, seconds, message) {
    if (this.ending || this.round.finished) return;
    this.round.registerMistake(seconds, puzzle.owner, message);
    this.scorePlate.setScore(session.score);
    this.refreshPlayerTags();
    this.bumpActivity();
  }

  onSabotageCleared(type, success, player) {
    if (this.ending || this.round?.finished) return;
    if (success) {
      session.sabotageCleared += 1;
      session.stats.sabotageCleared = session.sabotageCleared;
      const pts = Math.round(250 * session.difficulty.scoreMult);
      session.addScore(pts, player);
      this.updateScore(pts);
      floatText(this, 960, 340, `GANGGUAN DIBERSIHKAN +${pts}`, CSS.green, { size: 24, up: 60 });
      this.notify(`${SABOTAGES[type]?.title || 'GANGGUAN'} DIBERSIHKAN! +${pts}`, 'success');
      this.refreshPlayerTags();
    } else {
      this.notify('GANGGUAN BERAKHIR SENDIRI — TETAP FOKUS!', 'warn');
    }
    this.bumpActivity();
  }

  triggerSabotage(type) {
    if (this.ending || this.round?.finished) return;
    this.sabotage?.trigger(type);
  }

  /* ------------------------------------------------------------------ */
  showCipherBanner(pairs, sequence) {
    this.hideCipherBanner(true);
    const c = this.add.container(960, 218).setDepth(82).setAlpha(0);
    const W = 1320, H = 76;
    const g = this.add.graphics();
    g.fillStyle(THEME.panelSoft, .98).fillRoundedRect(-W / 2, -H / 2, W, H, 14);
    g.lineStyle(1.5, THEME.border, 1).strokeRoundedRect(-W / 2 + .75, -H / 2 + .75, W - 1.5, H - 1.5, 14);
    g.fillStyle(THEME.yellow, .95).fillRoundedRect(-W / 2, -H / 2 + 10, 4, H - 20, 2);
    const meg = this.add.image(-W / 2 + 34, 0, 'icon-megaphone').setDisplaySize(24, 24).setTint(THEME.yellow);
    const title = txt(this, -W / 2 + 56, -16, 'KAMUS SANDI', { size: 13, font: FONT.heading, color: CSS.text, origin: 0, letterSpacing: .6 });
    const sub = txt(this, -W / 2 + 56, 8, 'TERIAKKAN ANGKA KE PEMAIN', { size: 8.5, font: FONT.mono, color: CSS.muted, origin: 0, letterSpacing: .8 });
    c.add([g, meg, title, sub]);
    const startX = -260;
    pairs.forEach((pair, i) => {
      const x = startX + i * 150;
      const icon = this.add.image(x - 28, 0, pair.icon).setDisplaySize(28, 28).setTint(i % 2 ? THEME.green : THEME.blue);
      const eq = txt(this, x + 4, 0, '=', { size: 12, font: FONT.mono, color: CSS.dim });
      const num = txt(this, x + 34, -1, String(pair.digit), { size: 24, font: FONT.mono, color: CSS.red });
      c.add([icon, eq, num]);
      if (i < pairs.length - 1) c.add(this.add.rectangle(x + 58, 0, 1, 32, THEME.border, .8));
    });
    this.cipherBanner = c;
    this.tweens.add({ targets: c, y: 218, alpha: 1, duration: 240, ease: 'Quad.Out' });
    return c;
  }

  hideCipherBanner(instant = false) {
    const c = this.cipherBanner;
    if (!c) return;
    this.cipherBanner = null;
    if (instant) c.destroy();
    else this.tweens.add({ targets: c, y: 196, alpha: 0, duration: 200, onComplete: () => c.destroy() });
  }

  notify(text, type = 'info') {
    this.toast?.destroy();
    if (this.toastTimer) this.toastTimer.remove(false);
    const color = type === 'error' ? CSS.red : type === 'warn' ? CSS.yellow : type === 'success' ? CSS.green : '#8CC6FF';
    const c = this.add.container(960, 246).setDepth(100);
    const label = txt(this, 0, 0, text, { size: 16, font: FONT.heading, color: CSS.cream, letterSpacing: 0.3, wrap: 820 });
    const w = Math.min(900, label.width + 58);
    const g = this.add.graphics();
    g.fillStyle(0x070b13, 0.92).fillRoundedRect(-w / 2, -22, w, 44, 12);
    g.lineStyle(2, color, 0.7).strokeRoundedRect(-w / 2, -22, w, 44, 12);
    g.fillStyle(color, 0.9).fillRoundedRect(-w / 2, -22, 6, 44, 3);
    c.add([g, label]);
    c.setAlpha(0).setY(236);
    this.tweens.add({ targets: c, alpha: 1, y: 246, duration: 140, ease: 'Quad.Out' });
    this.toast = c;
    this.toastTimer = this.time.delayedCall(1800, () => {
      if (!this.toast) return;
      this.tweens.add({ targets: this.toast, alpha: 0, y: 232, duration: 200, onComplete: () => { this.toast?.destroy(); this.toast = null; } });
    });
  }

  /* ------------------------------------------------------------------ */
  openPassBomb() {
    if (this.ending || this.passOverlay) return;
    if (!this.round.canPassBomb() || !this.settings.passBomb || this.sabotage?.isActive) {
      this.notify(this.settings.passBomb ? 'BELUM BISA DILEMPAR SEKARANG!' : 'FITUR LEMPAR BOM NONAKTIF', 'warn');
      return;
    }
    const s = this;
    const initiator = this.touch?.lastPlayer || session.players[0];
    session.passUsed = true;
    session.passOwner = initiator;
    this.passBombBtn.setDisabled(true);
    this.round.pause();
    audio.sfx('pass');
    const overlay = this.add.container(0, 0).setDepth(140);
    const dim = this.add.rectangle(960, 540, 1920, 1080, 0x05080f, .84).setInteractive();
    overlay.add(dim);
    const pg = this.add.graphics();
    pg.fillStyle(THEME.panel, 1).fillRoundedRect(410, 360, 1100, 430, 24);
    pg.lineStyle(2, THEME.yellow, .75).strokeRoundedRect(410, 360, 1100, 430, 24);
    const bombIcon = this.add.image(510, 440, 'cut-dial').setDisplaySize(88, 88);
    const title = txt(this, 590, 406, 'TARGET PENGGANTI DICARI!', {
      size: 38, font: FONT.display, color: CSS.red, origin: 0, stroke: CSS.ink, strokeThickness: 6,
    });
    const conditions = [
      'Tunjuk 1 orang yang MEMAKAI KACAMATA untuk maju!',
      'Tunjuk 1 orang yang BAJUNYA WARNA CERAH untuk maju!',
      'Tunjuk 1 orang yang DUDUK DI BARIS DEPAN untuk maju!',
      'Tunjuk 1 orang yang NAMANYA DIAWALI HURUF S untuk maju!',
      'Tunjuk 1 orang yang MEMAKAI JAM TANGAN untuk maju!',
    ];
    const condition = Phaser.Utils.Array.GetRandom(conditions);
    const sub = txt(this, 590, 470, condition, {
      size: 19, font: FONT.body, color: CSS.text, origin: 0, wrap: 860,
    });
    const note = txt(this, 590, 516, 'Dalam 5 detik, orang tersebut harus menyentuh tombol di bawah. Jika gagal: BOOM!', {
      size: 11, font: FONT.body, color: CSS.muted, origin: 0,
    });
    const count = txt(this, 960, 604, '5.0', { size: 62, font: FONT.mono, color: CSS.red });
    const accept = button(s, {
      x: 960, y: 714, w: 620, h: 92, label: 'SAYA TERIMA BOMNYA!', sub: '+5 DETIK UNTUK TIM', variant: 'success', fontSize: 26, subSize: 11,
      onClick: () => this.acceptPassBomb(overlay, initiator),
    });
    accept.container.setDepth(1);
    const cancel = txt(this, 960, 782, 'Yang menerima bom menjadi penerus permainan. Semua pemain tetap boleh membantu.', {
      size: 9.5, font: FONT.body, color: CSS.dim,
    });
    overlay.add([pg, bombIcon, title, sub, note, count, accept.container, cancel]);
    this.passOverlay = overlay;
    this.passRemaining = 5;
    this.passTimer = this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        this.passRemaining -= 0.1;
        if (this.passRemaining < 0) this.passRemaining = 0;
        count.setText(this.passRemaining.toFixed(1));
        count.setColor(this.passRemaining <= 2 ? CSS.yellow : CSS.red);
        if (this.passRemaining <= 0) this.failPassBomb();
      },
    });
    this.tweens.add({ targets: overlay, alpha: { from: 0, to: 1 }, duration: 180 });
  }

  acceptPassBomb(overlay, initiator) {
    if (this.ending) return;
    this.passTimer?.remove(false);
    this.passOverlay = null;
    overlay.destroy(true);
    this.round.addTime(5);
    this.round.resume();
    session.stats.passAccepted = true;
    session.addScore(300, this.touch?.lastPlayer || initiator);
    this.updateScore(300);
    audio.sfx('chime');
    this.confettiSmall();
    this.notify('BOM DITERIMA! +5 DETIK & +300 BONUS', 'success');
    this.bumpActivity();
  }

  failPassBomb() {
    if (this.ending) return;
    this.passTimer?.remove(false);
    if (this.passOverlay) {
      this.passOverlay.destroy(true);
      this.passOverlay = null;
    }
    this.round.resume();
    this.round.lose('BOM TIDAK DITERIMA SIAPA PUN');
  }

  confettiSmall() {
    for (let i = 0; i < 26; i++) {
      const x = Phaser.Math.Between(750, 1170);
      const img = this.add.image(x, 560, `fx-confetti-${(i % 3) + 1}`).setDepth(150).setTint([0xf2555f, 0xffc93c, 0x4c9bff, 0xb55ddc, 0x45d6a0][i % 5]);
      this.tweens.add({ targets: img, y: 1080, x: x + Phaser.Math.Between(-180, 180), angle: Phaser.Math.Between(-360, 360), alpha: 0, duration: 900 + Math.random() * 600, ease: 'Quad.In', onComplete: () => img.destroy() });
    }
  }

  /* ------------------------------------------------------------------ */
  onRoundWon() {
    if (this.ending) return;
    this.ending = true;
    this.sabotage?.destroy();
    this.hideCipherBanner(true);
    this.workPivot.rotation = 0;
    this.disableInteractions();
    this.passBombBtn?.setDisabled(true);
    audio.stopMusic();
    this.cameras.main.flash(220, 120, 255, 190);
    const rays = this.add.image(960, 540, 'fx-flash-rays').setDisplaySize(1400, 1400).setDepth(90).setAlpha(0.4).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: rays, angle: 25, duration: 1600, ease: 'Sine.InOut' });
    const title = txt(this, 960, 470, 'BOM DJINAKKAN!', {
      size: 118, font: FONT.display, color: CSS.green, stroke: CSS.ink, strokeThickness: 14,
    }).setDepth(100).setScale(0.4).setAlpha(0);
    title.setShadow(0, 12, '#0A3B29', 0, true, true);
    this.tweens.add({ targets: title, scale: 1, alpha: 1, duration: 380, ease: 'Back.Out' });
    const sub = txt(this, 960, 558, `SISA WAKTU ${this.timer.time.text} • SKOR ${formatNumber(session.score)}`, {
      size: 22, font: FONT.heading, color: CSS.cream, stroke: CSS.ink, strokeThickness: 5,
    }).setDepth(100).setAlpha(0);
    this.tweens.add({ targets: sub, alpha: 1, duration: 300, delay: 300 });
    confettiBurst(this, 90, { depth: 110 });
    audio.sfx('win');
    this.time.delayedCall(1550, () => goToScene(this, 'Victory', {}, { fade: 360 }));
  }

  onRoundLost(reason) {
    if (this.ending) return;
    this.ending = true;
    this.sabotage?.destroy();
    this.hideCipherBanner(true);
    this.workPivot.rotation = 0;
    this.disableInteractions();
    this.passBombBtn?.setDisabled(true);
    this.passTimer?.remove(false);
    this.passOverlay?.destroy(true);
    this.passOverlay = null;
    audio.stopMusic();
    flashScreen(this, 0xffffff, 180, 1);
    this.cameras.main.flash(140, 255, 255, 255);
    this.cameras.main.shake(700, 0.012);
    screenShake(this, 0.014, 800);
    const boom = this.add.image(960, 540, 'fx-explosion').setDisplaySize(1500, 1500).setDepth(120).setScale(0.25).setAlpha(0);
    this.tweens.add({ targets: boom, scale: 1.08, alpha: 1, duration: 520, ease: 'Cubic.Out' });
    this.tweens.add({ targets: boom, angle: 18, duration: 900 });
    this.time.delayedCall(420, () => {
      const crack = this.add.image(960, 540, 'fx-glass-crack').setDisplaySize(1920, 1080).setDepth(125).setAlpha(0);
      this.tweens.add({ targets: crack, alpha: 0.9, duration: 140 });
      for (let i = 0; i < 26; i++) {
        const shard = this.add.triangle(
          Phaser.Math.Between(260, 1660), Phaser.Math.Between(280, 820),
          0, 0, Phaser.Math.Between(-16, 16), Phaser.Math.Between(-24, 24), Phaser.Math.Between(-20, 20), Phaser.Math.Between(-20, 20),
          0xdff6ff, 0.55,
        ).setDepth(126);
        this.tweens.add({ targets: shard, x: shard.x + Phaser.Math.Between(-180, 180), y: shard.y + Phaser.Math.Between(140, 380), angle: Phaser.Math.Between(-180, 180), alpha: 0, duration: 600 + Math.random() * 500, ease: 'Cubic.Out', onComplete: () => shard.destroy() });
      }
    });
    const fail = txt(this, 960, 260, 'BOOM!', {
      size: 160, font: FONT.display, color: CSS.red, stroke: CSS.ink, strokeThickness: 16,
    }).setDepth(127).setScale(0.2).setAlpha(0);
    fail.setShadow(0, 12, CSS.yellow, 0, true, true);
    this.tweens.add({ targets: fail, scale: 1.12, alpha: 1, duration: 300, ease: 'Back.Out' });
    this.time.delayedCall(2700, () => goToScene(this, 'Defeat', { reason }, { fade: 420 }));
  }

  disableInteractions() {
    const block = this.add.rectangle(960, 540, 1920, 1080, 0x000000, 0.001).setDepth(115).setInteractive();
    this.modules.forEach((m) => m.disableAllInput?.());
    this.round.paused = true;
    void block;
  }

  cleanup() {
    try { this.touch?.destroy(); } catch { /* noop */ }
    try { this.sabotage?.destroy(); } catch { /* noop */ }
    this.hideCipherBanner(true);
    this.sabotage = null;
    this.touch = null;
    this.round = null;
    this.modules.forEach((m) => { try { m.close(); } catch { /* noop */ } });
    this.modules = [];
    this.toastTimer?.remove(false);
    this.idleTween?.stop();
    settingsBus.removeEventListener?.('change', this._settingsHandler);
  }
}

function hideBoot() {
  document.getElementById('boot-screen')?.classList.add('hidden');
}
