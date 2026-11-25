import { DIFFICULTIES, SABOTAGES } from '../config.js';
import { audio } from '../core/audio.js';
import { flashScreen, screenShake } from '../ui/factory.js';

/**
 * Authoritative round clock + win/lose + sabotage cadence.
 * Time is expressed in seconds. The scene reads state; UI updates are pushed
 * through small hooks so this class stays reusable/testable.
 */
export class RoundManager {
  constructor(scene, {
    timeLimit = 40,
    difficultyKey = 'standard',
    sabotageEnabled = true,
    preview = false,
  } = {}) {
    this.scene = scene;
    this.state = 'idle'; // idle | intro | running | won | lost
    this.preview = preview;
    this.timeLimit = timeLimit;
    this.timeMax = timeLimit;
    this.timeLeft = timeLimit;
    this.difficulty = DIFFICULTIES[difficultyKey] || DIFFICULTIES.standard;
    this.sabotageEnabled = sabotageEnabled;
    this.thresholds = [...this.difficulty.sabotageAt].sort((a, b) => b - a);
    this.triggered = new Set();
    this.paused = false;
    this.strikes = 0;
    this.maxStrikes = 3;
    this.solved = 0;
    this.moduleCount = scene.session?.moduleCount || 3;
    this.lastTickSlot = null;
    this.lastDisplaySecond = null;
    this.heartbeatAt = 0;
    this.lastMusicLevel = -1;
    this.sabotagePool = Phaser.Utils.Array.Shuffle([...this.difficulty.sabotagePool]);
    this.recentSabotage = null;
    this.finished = false;
    this.startedAt = 0;
    this.elapsed = 0;
  }

  start() {
    if (this.preview) {
      this.state = 'running';
      this.timeLeft = this.scene.session.timeLeft;
      this.timeMax = this.scene.session.timeMax;
      this.paused = true;
      this.startedAt = performance.now();
      this.lastDisplaySecond = Math.ceil(this.timeLeft);
      this.scene.onRoundStarted?.();
      this.scene.onTimeChanged?.(this.timeLeft, false);
      return;
    }
    if (this.state !== 'idle') return;
    this.state = 'intro';
    this.timeLeft = this.timeLimit;
    if (this.scene.session) this.scene.session.timeLeft = this.timeLeft;
    this.lastTickSlot = Math.ceil(this.timeLeft);
    this.lastDisplaySecond = Math.ceil(this.timeLeft);
    this.scene.onRoundIntro?.();
    this.scene.time.delayedCall(950, () => {
      if (this.state !== 'intro') return;
      this.state = 'running';
      this.startedAt = performance.now();
      audio.setMusicLevel(0, true);
      this.scene.onRoundStarted?.();
    });
  }

  pause() {
    if (this.state !== 'running' || this.paused) return;
    this.paused = true;
    this.scene.onRoundPaused?.(true);
  }

  resume() {
    if (this.state !== 'running' || !this.paused) return;
    this.paused = false;
    this.scene.onRoundPaused?.(false);
  }

  get running() { return this.state === 'running' && !this.paused && !this.finished; }

  get ratio() {
    return this.timeMax > 0 ? Math.max(0, this.timeLeft / this.timeMax) : 0;
  }

  update(time, delta) {
    if (this.state === 'intro') {
      // small grace window while the cards slide in
      return;
    }
    if (this.state !== 'running' || this.finished) return;
    if (this.paused) return;
    const dt = Math.min(80, delta) / 1000;
    this.elapsed += dt;
    this.timeLeft -= dt;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.scene.session.timeLeft = 0;
      this.scene.onTimeChanged?.(0, true);
      this.lose('WAKTU HABIS');
      return;
    }
    if (this.scene.session) this.scene.session.timeLeft = this.timeLeft;

    const urgent = this.timeLeft <= 10;
    const medium = this.timeLeft <= 20;
    // The HUD only renders whole seconds; updating a Phaser Text every frame
    // churns GPU textures for no visible gain.
    const displaySecond = Math.ceil(this.timeLeft);
    if (displaySecond !== this.lastDisplaySecond) {
      this.lastDisplaySecond = displaySecond;
      this.scene.onTimeChanged?.(this.timeLeft, urgent);
    }

    // adaptive audio
    const level = urgent ? 2 : medium ? 1 : 0;
    if (level !== this.lastMusicLevel) {
      this.lastMusicLevel = level;
      audio.setMusicLevel(level);
      this.scene.onMusicIntensity?.(level);
    }
    if (level === 2) {
      this.heartbeatAt += delta;
      if (this.heartbeatAt > 900) {
        this.heartbeatAt = 0;
        audio.sfx('heart');
      }
    }

    // mechanical tick, twice as fast in the final 10 seconds
    const slot = urgent ? Math.floor(this.timeLeft * 2) : Math.ceil(this.timeLeft);
    if (slot !== this.lastTickSlot) {
      this.lastTickSlot = slot;
      audio.sfx('tick', { urgent });
      this.scene.onTick?.(this.timeLeft);
    }

    // scheduled saboteur interruptions
    if (this.sabotageEnabled) {
      for (const threshold of this.thresholds) {
        if (this.ratio <= threshold && !this.triggered.has(threshold)) {
          this.triggered.add(threshold);
          const type = this.pickSabotage();
          if (type) {
            this.recentSabotage = type;
            this.scene.triggerSabotage?.(type);
          }
        }
      }
    }
  }

  pickSabotage() {
    let pool = this.sabotagePool.filter((t) => t !== this.recentSabotage);
    if (!pool.length) {
      this.sabotagePool = Phaser.Utils.Array.Shuffle([...this.difficulty.sabotagePool]);
      pool = this.sabotagePool.filter((t) => t !== this.recentSabotage);
    }
    if (!pool.length) return null;
    const type = Phaser.Utils.Array.GetRandom(pool);
    this.sabotagePool = this.sabotagePool.filter((t) => t !== type);
    return type;
  }

  solveModule(puzzle) {
    if (this.finished) return;
    this.solved++;
    if (this.scene.session) {
      this.scene.session.moduleSolved(puzzle.index);
      this.scene.session.timeBonus += 3;
      this.scene.session.solved = this.solved;
    }
    this.timeLeft += 3;
    if (this.scene.session) this.scene.session.timeLeft = this.timeLeft;
    this.scene.onModuleSolved?.(puzzle);
    this.scene.onTimeChanged?.(this.timeLeft, this.timeLeft <= 10);
    if (this.solved >= this.moduleCount) {
      this.win();
    }
  }

  registerMistake(seconds = 3, player = null, message = '') {
    if (this.finished) return;
    this.timeLeft = Math.max(0, this.timeLeft - seconds);
    if (this.scene.session) {
      this.scene.session.timeLeft = this.timeLeft;
      this.scene.session.addScore(-120);
    }
    const maxed = this.scene.session ? this.scene.session.addStrike() : (this.strikes = Math.min(this.maxStrikes, this.strikes + 1)) >= this.maxStrikes;
    this.strikes = this.scene.session?.strikes ?? this.strikes;
    audio.sfx('strike');
    flashScreen(this.scene, 0xff2028, 120, 0.28);
    screenShake(this.scene, 0.008, 220);
    this.scene.onStrike?.(this.strikes, seconds, message, player);
    this.scene.onTimeChanged?.(this.timeLeft, this.timeLeft <= 10);
    if (maxed) {
      this.lose('3 STRIKE');
      return;
    }
    if (this.timeLeft <= 0) {
      this.lose('WAKTU HABIS');
    }
  }

  addTime(seconds) {
    if (this.finished) return;
    this.timeLeft = Math.max(0, this.timeLeft + seconds);
    if (this.scene.session) {
      this.scene.session.timeLeft = this.timeLeft;
      this.scene.session.timeBonus += seconds;
    }
    this.scene.onTimeChanged?.(this.timeLeft, this.timeLeft <= 10);
    this.scene.onTimeBonus?.(seconds);
  }

  canPassBomb() {
    return this.state === 'running' && !this.paused && !this.finished &&
      this.timeLeft > 8 && !!this.scene.session && !this.scene.session.passUsed;
  }

  win() {
    if (this.finished) return;
    this.finished = true;
    this.state = 'won';
    const s = this.scene.session;
    if (s) {
      s.result = 'win';
      s.resultReason = 'SEMUA MODUL AMAN';
      s.endedAt = performance.now();
      s.finalScore();
      s.passed = true;
    }
    audio.setMusicLevel(0);
    audio.sfx('win');
    this.scene.onRoundWon?.();
  }

  lose(reason = 'BOM MELEDAK') {
    if (this.finished) return;
    this.finished = true;
    this.state = 'lost';
    const s = this.scene.session;
    if (s) {
      s.result = 'lose';
      s.resultReason = reason;
      s.endedAt = performance.now();
    }
    audio.stopMusic();
    audio.sfx('explosion');
    this.scene.onRoundLost?.(reason);
  }
}
