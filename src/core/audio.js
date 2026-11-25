/**
 * Tiny procedural adaptive audio engine (Web Audio API).
 * No external audio files — robust for offline PID installs.
 *
 * BGM: 110 BPM → 135 BPM (<20s) → 165 BPM + heartbeat (<10s)
 */
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicBus = null;
    this.sfxBus = null;
    this.ready = false;
    this.armed = false;
    this.musicEnabled = true;
    this.soundEnabled = true;
    this.musicOn = false;
    this.level = 0;
    this.step = 0;
    this.nextTime = 0;
    this.timer = null;
    this.bpm = 110;
    this.lastSfx = 0;
    this.noiseBuffer = null;
  }

  ensure() {
    if (this.ready) return true;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return false;
    try {
      this.ctx = new Ctx();
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -16;
      comp.knee.value = 24;
      comp.ratio.value = 4;
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.9;
      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = 0.22;
      this.sfxBus = this.ctx.createGain();
      this.sfxBus.gain.value = 0.68;
      this.musicBus.connect(this.master);
      this.sfxBus.connect(this.master);
      this.master.connect(comp);
      comp.connect(this.ctx.destination);
      this.ready = true;
      return true;
    } catch {
      return false;
    }
  }

  async unlock() {
    if (!this.ensure()) return;
    if (this.ctx.state === 'suspended') {
      try { await this.ctx.resume(); } catch { /* ignore */ }
    }
    this.armed = true;
    if (this.musicEnabled && this.musicOn) this.startMusic();
  }

  setPrefs({ sound, music } = {}) {
    if (typeof sound === 'boolean') this.soundEnabled = sound;
    if (typeof music === 'boolean') this.musicEnabled = music;
    if (this.ready) {
      this.musicBus.gain.setTargetAtTime(this.musicEnabled ? 0.22 : 0, this.ctx.currentTime, 0.1);
      this.sfxBus.gain.setTargetAtTime(this.soundEnabled ? 0.68 : 0, this.ctx.currentTime, 0.05);
    }
    if (!this.musicEnabled) this.stopMusic();
  }

  setMusicLevel(level = 0, startIfNeeded = false) {
    this.level = Phaser.Math.Clamp(level, 0, 2);
    this.bpm = [126, 148, 172][this.level];
    if (startIfNeeded && this.musicEnabled) {
      this.musicOn = true;
      if (this.armed) this.startMusic();
    }
  }

  startMusic() {
    this.musicOn = true;
    if (!this.armed) return;
    if (!this.ensure() || !this.musicEnabled) return;
    if (this.timer) return;
    this.nextTime = this.ctx.currentTime + 0.08;
    this.step = 0;
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    this.timer = setInterval(() => this.scheduler(), 30);
  }

  stopMusic() {
    this.musicOn = false;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  scheduler() {
    if (!this.ready || !this.musicOn) return;
    const lookahead = 0.12;
    while (this.nextTime < this.ctx.currentTime + lookahead) {
      this.scheduleStep(this.step, this.nextTime);
      const bpm = this.bpm;
      const secondsPerStep = 60 / bpm / 2;
      this.nextTime += secondsPerStep;
      this.step = (this.step + 1) % 16;
    }
  }

  scheduleStep(step, when) {
    const bus = this.musicBus;
    if (!bus) return;
    const lvl = this.level;
    const barStep = step % 16;
    const root = [110, 110, 98, 82.4][Math.floor(barStep / 4)];

    // Bouncy walking bass: root on every other 8th, octave lift at the turnarounds.
    if (barStep % 2 === 0) {
      const oct = (barStep === 6 || barStep === 14) ? 2 : 1;
      this.tone({ freq: (root / 2) * oct, type: 'triangle', gain: lvl === 2 ? 0.3 : 0.2, dur: 0.16, when, bus, filter: 420 });
    }
    // Cartoon brass stabs on the off-beats.
    if (barStep === 3 || barStep === 7 || barStep === 11 || barStep === 15) {
      [root * 2, root * 2 * 1.26].forEach((f, i) => this.tone({
        freq: f, type: 'square', gain: lvl === 2 ? 0.04 : 0.028, dur: 0.07, when: when + i * 0.006, bus, filter: 2200,
      }));
    }
    // Pluck melody / tension arp.
    const scale = [220, 261.63, 329.63, 392, 440, 523.25];
    const pattern = lvl === 0 ? [0, 2, 4, 2, 1, 3, 5, 3] : lvl === 1 ? [0, 2, 1, 4, 2, 5, 3, 4] : [5, 3, 4, 2, 5, 1, 4, 2];
    if (barStep % 2 === 0) {
      this.tone({ freq: scale[pattern[(step / 2) % 8]] * (lvl === 2 ? 2 : 1), type: 'square', gain: lvl === 2 ? 0.045 : 0.035, dur: 0.09, when, bus, filter: 2400 });
    }
    // Comic percussion: kick, clap/snare, hats.
    if (barStep === 0 || barStep === 8 || (lvl === 2 && barStep === 6)) this.kick(when);
    if (barStep === 4 || barStep === 12) {
      this.noise({ when, dur: 0.09, gain: lvl === 2 ? 0.09 : 0.06, bus, freq: 2400, type: 'bandpass' });
      this.tone({ freq: 190, type: 'triangle', gain: 0.06, dur: 0.08, when, bus, filter: 900 });
    }
    if (barStep % 2 === 1) this.noise({ when, dur: 0.025, gain: lvl === 2 ? 0.035 : 0.018, bus, freq: 7000, type: 'highpass' });
    if (lvl === 2 && (barStep === 2 || barStep === 10)) this.tone({ freq: 58, type: 'sine', gain: 0.25, dur: 0.18, when, bus, filter: 120 });
    // A little rubber-hose "boing" once per bar keeps the comic flavour.
    if (barStep === 14 && lvl < 2) this.tone({ freq: 300, type: 'sine', gain: 0.035, dur: 0.16, when, bus, filter: 1200, slideTo: 880 });
  }

  tone({ freq = 440, type = 'sine', gain = 0.1, dur = 0.15, when = 0, bus = null, filter = 0, slideTo = null }) {
    if (!this.ready) return;
    const t = when || this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, freq), t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = osc;
    if (filter) {
      const f = this.ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = filter;
      node.connect(f);
      node = f;
    }
    node.connect(g);
    g.connect(bus || this.sfxBus);
    osc.start(t);
    osc.stop(t + dur + 0.03);
  }

  noise({ when = 0, dur = 0.15, gain = 0.1, bus = null, freq = 1200, type = 'lowpass' } = {}) {
    if (!this.ready) return;
    const t = when || this.ctx.currentTime;
    if (!this.noiseBuffer) {
      const len = Math.floor(this.ctx.sampleRate * 1.6);
      this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(Math.max(0.0002, gain), t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(bus || this.sfxBus);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  kick(when) {
    this.tone({ freq: 120, slideTo: 42, type: 'sine', gain: 0.28, dur: 0.2, when, bus: this.musicBus, filter: 180 });
  }

  sfx(name, opts = {}) {
    if (!this.ready || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    if (name !== 'type') {
      if (now - this.lastSfx < 0.025 && name !== 'tick') return;
      this.lastSfx = now;
    }
    switch (name) {
      case 'click':
        this.tone({ freq: 560, slideTo: 820, type: 'triangle', gain: 0.055, dur: 0.055, filter: 3200 });
        this.noise({ dur: 0.02, gain: 0.018, freq: 3600, type: 'highpass' });
        break;
      case 'type':
        this.tone({ freq: 1500 + Math.random() * 900, type: 'square', gain: 0.016, dur: 0.018, filter: 5000 });
        break;
      case 'trigger':
        this.tone({ freq: 190, slideTo: 95, type: 'triangle', gain: 0.18, dur: 0.2, filter: 900 });
        this.noise({ dur: 0.1, gain: 0.07, freq: 2600, type: 'bandpass' });
        [440, 660].forEach((f, i) => this.tone({ freq: f, type: 'square', gain: 0.075, dur: 0.14, when: now + 0.015 + i * 0.07, filter: 3000 }));
        break;
      case 'select':
        this.tone({ freq: 440, type: 'triangle', gain: 0.1, dur: 0.08 });
        this.tone({ freq: 660, type: 'triangle', gain: 0.09, dur: 0.1, when: now + 0.07 });
        break;
      case 'back':
        this.tone({ freq: 420, type: 'triangle', gain: 0.08, dur: 0.1, slideTo: 260 });
        break;
      case 'tick':
        this.tone({ freq: opts.urgent ? 1480 : 1100, type: 'square', gain: opts.urgent ? 0.055 : 0.035, dur: 0.028, filter: 5000 });
        break;
      case 'chime':
        [523.25, 659.25, 783.99].forEach((f, i) => this.tone({ freq: f, type: 'triangle', gain: 0.095, dur: 0.22, when: now + i * 0.07 }));
        break;
      case 'solve':
        [392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone({ freq: f, type: 'triangle', gain: 0.11, dur: 0.28, when: now + i * 0.06 }));
        this.noise({ dur: 0.18, gain: 0.05, freq: 5000, type: 'highpass' });
        break;
      case 'error':
        this.tone({ freq: 180, type: 'sawtooth', gain: 0.16, dur: 0.18, slideTo: 90, filter: 1200 });
        this.noise({ dur: 0.1, gain: 0.06, freq: 500 });
        break;
      case 'strike':
        this.tone({ freq: 110, type: 'sawtooth', gain: 0.24, dur: 0.42, slideTo: 55, filter: 900 });
        this.noise({ dur: 0.2, gain: 0.08, freq: 600 });
        break;
      case 'sabotage':
        this.noise({ dur: 0.8, gain: 0.18, freq: 400, type: 'lowpass' });
        this.tone({ freq: 64, type: 'sawtooth', gain: 0.12, dur: 0.5, slideTo: 40, filter: 500 });
        break;
      case 'ice':
        this.noise({ dur: 0.5, gain: 0.14, freq: 4200, type: 'highpass' });
        [2200, 2800, 1800].forEach((f, i) => this.tone({ freq: f, type: 'sine', gain: 0.07, dur: 0.3, when: now + i * 0.08 }));
        break;
      case 'whoosh':
        this.noise({ dur: 0.3, gain: 0.12, freq: 1400, type: 'bandpass' });
        break;
      case 'spark':
        this.tone({ freq: 2400, type: 'square', gain: 0.035, dur: 0.035, filter: 6000 });
        break;
      case 'countdown':
        this.tone({ freq: 520, type: 'square', gain: 0.11, dur: 0.12, filter: 2400 });
        break;
      case 'countdown-go':
        this.tone({ freq: 820, type: 'square', gain: 0.14, dur: 0.3, filter: 3000 });
        this.tone({ freq: 1230, type: 'triangle', gain: 0.1, dur: 0.35, when: now + 0.06 });
        break;
      case 'explosion':
        this.noise({ dur: 1.5, gain: 0.5, freq: 300, type: 'lowpass' });
        this.tone({ freq: 85, type: 'sine', gain: 0.38, dur: 1.2, slideTo: 28, filter: 160 });
        this.tone({ freq: 55, type: 'sawtooth', gain: 0.22, dur: 0.8, slideTo: 30 });
        break;
      case 'win':
        [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => this.tone({ freq: f, type: 'triangle', gain: 0.14, dur: 0.55, when: now + i * 0.11 }));
        this.noise({ dur: 0.6, gain: 0.06, freq: 5200, type: 'highpass' });
        break;
      case 'pass':
        this.tone({ freq: 330, type: 'triangle', gain: 0.12, dur: 0.16 });
        this.tone({ freq: 495, type: 'triangle', gain: 0.12, dur: 0.2, when: now + 0.12 });
        break;
      case 'deny':
        this.tone({ freq: 150, type: 'square', gain: 0.08, dur: 0.12, filter: 600 });
        break;
      case 'heart':
        this.tone({ freq: 58, type: 'sine', gain: 0.18, dur: 0.14, filter: 120 });
        this.tone({ freq: 52, type: 'sine', gain: 0.13, dur: 0.12, when: now + 0.18, filter: 120 });
        break;
      default:
        break;
    }
  }
}

export const audio = new AudioEngine();
