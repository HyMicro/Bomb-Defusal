import { ASSET_KEYS } from '../config.js';
import { session } from '../core/session.js';

const EXTRA_KEYS = ['overlay-halftone', 'brand-logo'];

/** Raster UI cuts sourced from the supplied concept sheets (scripts/extract UI assets). */
const COMIC_ASSETS = {
  'cut-frame': 'frame-card',
  'cut-lcd': 'panel-lcd',
  'cut-x-red': 'x-red',
  'cut-x-off': 'x-off',
  'cut-dial': 'dial-bomb',
  'cut-play': 'btn-play',
  'cut-frame-penalty': 'frame-penalty',
  'cut-boom': 'fx-boom',
  'cut-cloud': 'fx-cloud',
  'cut-hazard': 'hazard',
  'cut-bubble-cloud': 'bubble-cloud',
  'ui-start-normal': 'ui-start-normal',
  'ui-start-hover': 'ui-start-hover',
  'ui-start-pressed': 'ui-start-pressed',
  'ui-start-disabled': 'ui-start-disabled',
  'ui-cara-normal': 'ui-cara-normal',
  'ui-cara-hover': 'ui-cara-hover',
  'ui-cara-pressed': 'ui-cara-pressed',
  'ui-cara-disabled': 'ui-cara-disabled',
  'ui-settings-normal': 'ui-settings-normal',
  'ui-settings-hover': 'ui-settings-hover',
  'ui-settings-pressed': 'ui-settings-pressed',
  'ui-settings-disabled': 'ui-settings-disabled',
  'ui-board-normal': 'ui-board-normal',
  'ui-board-hover': 'ui-board-hover',
  'ui-board-pressed': 'ui-board-pressed',
  'ui-board-disabled': 'ui-board-disabled',
  'ui-next': 'ui-next',
  'ui-retry': 'ui-retry',
  'ui-skip': 'ui-skip',
  'ui-bomb': 'ui-bomb',
  'ui-confirm': 'ui-confirm',
  'ui-cancel': 'ui-cancel',
  'cut-btn-red': 'btn-red',
  'cut-btn-yellow': 'btn-yellow',
  'cut-btn-green': 'btn-green',
  'cut-trophy': 'icon-trophy',
  'cut-check': 'icon-check',
  'cut-sound': 'icon-sound',
  'cut-mute': 'icon-mute',
};

/** Full-screen comic page backgrounds built from the supplied halftone panels. */
const BACKGROUND_ASSETS = {
  'bg-menu': 'bg-bright-page.png',
  'bg-game': 'bg-bright-game.png',
  'bg-pop': 'bg-bright-menu.png',
};


function assetPath(key) {
  if (key === 'logo-lockup') return 'assets/brand/logo-lockup.png';
  if (key === 'logo-mark') return 'assets/brand/logo-mark.svg';
  if (key.startsWith('avatar-')) return `assets/characters/${key}.png`;
  if (key.startsWith('portrait-')) return `assets/characters/${key}.png`;
  if (key.startsWith('bg-')) return `assets/backgrounds/${key}.svg`;
  if (key === 'overlay-halftone') return 'assets/backgrounds/overlay-halftone.svg';
  if (key === 'caution-tape') return 'assets/ui/caution-tape.svg';
  if (key.startsWith('char-')) return `assets/characters/${key}.svg`;
  if (key.startsWith('bomb-')) return `assets/bomb/${key}.svg`;
  if (key.startsWith('icon-')) return `assets/icons/${key}.svg`;
  if (key.startsWith('symbol-')) return `assets/puzzles/${key}.svg`;
  if (['puzzle-scanner', 'lever-track', 'lever-handle', 'button-red', 'button-blue', 'button-green',
    'wire-red', 'wire-blue', 'wire-yellow', 'wire-green', 'wire-white', 'scissors',
    'glitch-popup', 'vu-meter'].includes(key)) return `assets/puzzles/${key}.svg`;
  if (key.startsWith('gesture-')) return `assets/ui/gestures/${key}.svg`;
  if (key.startsWith('btn-') || key.startsWith('keypad-')) return `assets/ui/buttons/${key}.svg`;
  if (key.startsWith('frame-')) return `assets/ui/frames/${key}.svg`;
  if (key.startsWith('panel-')) return `assets/ui/panels/${key}.svg`;
  if (['timer-plate', 'score-plate', 'player-chip', 'leader-row', 'cipher-ribbon', 'sabotage-banner',
    'progress-track', 'progress-fill-green', 'progress-fill-yellow', 'progress-fill-red',
    'strike-on', 'strike-off', 'round-chip', 'tag-blue', 'tag-red', 'hazard-strip',
    'caution-tape'].includes(key) || key.startsWith('touch-ring-')) return `assets/ui/hud/${key}.svg`;
  if (key.startsWith('fx-')) return `assets/fx/${key}.svg`;
  return `assets/${key}`;
}

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    const params = new URLSearchParams(window.location.search);
    // Runtime optimisation: the PNG mirror avoids 175 SVG rasterisations on cold boot.
    // Use ?assets=svg for vector-native experiments/4K exports.
    const usePngRuntime = params.get('assets') !== 'svg';
    this.usePngRuntime = usePngRuntime;
    const fill = document.getElementById('boot-fill');
    const tip = document.getElementById('boot-tip');
    const tips = [
      [0.15, 'Memanaskan sumbu bom...'],
      [0.35, 'Menyambungkan kabel logika...'],
      [0.58, 'Membangunkan penonton...'],
      [0.78, 'Mengkalibrasi layar sentuh...'],
      [0.94, 'Mengunci panel PID...'],
    ];
    this.load.on('progress', (value) => {
      if (fill) fill.style.width = `${Math.max(4, Math.round(value * 100))}%`;
      if (tip) {
        const match = [...tips].reverse().find(([t]) => value >= t);
        if (match) tip.textContent = match[1];
      }
    });
    this.load.on('loaderror', (file) => {
      console.warn('Asset failed to load:', file?.src || file?.key);
    });

    const keys = [...new Set([...ASSET_KEYS, ...EXTRA_KEYS, ...Object.keys(COMIC_ASSETS)])];
    for (const key of keys) {
      if (key === 'brand-logo') {
        this.load.image(key, 'assets/brand/bomb-defusal-logo.png');
        continue;
      }
      if (COMIC_ASSETS[key]) {
        this.load.image(key, `assets/ui/comic/${COMIC_ASSETS[key]}.png`);
        continue;
      }
      if (BACKGROUND_ASSETS[key]) {
        this.load.image(key, `assets/backgrounds/${BACKGROUND_ASSETS[key]}`);
        continue;
      }
      const svgPath = assetPath(key);
      const pngPath = svgPath.endsWith('.svg')
        ? svgPath.replace('assets/', 'assets/exports/').replace(/\.svg$/, '.png')
        : svgPath;
      // Two full-screen backgrounds stay vector: rasterising them at boot is
      // cheap and keeps the comic linework sharp at 4K.
      if (key.startsWith('bg-')) this.load.svg(key, svgPath);
      else if (key === 'logo-lockup' || key.startsWith('avatar-') || key.startsWith('portrait-')) this.load.image(key, pngPath);
      else if (usePngRuntime) this.load.image(key, pngPath);
      else this.load.svg(key, svgPath);
    }
  }

  create() {
    const fontWait = document.fonts?.ready || Promise.resolve();
    fontWait.then(() => {
      this.time.delayedCall(90, () => this.route());
    });
  }

  route() {
    const params = new URLSearchParams(window.location.search);
    const preview = params.get('preview');
    window.__PREVIEW__ = preview || null;
    window.__CAPTURE__ = params.get('capture') === '1';
    if (!preview) {
      session.preview = null;
      session.demo = false;
      this.scene.start('Attract');
      return;
    }
    if (preview === 'menu' || preview === 'admin') {
      session.preview = preview;
      this.scene.start('Attract', { preview });
      return;
    }
    if (preview === 'team') {
      session.preview = 'team';
      this.scene.start('TeamSelect', { preview });
      return;
    }
    session.create({ playerCount: 3, difficultyKey: 'standard' });
    session.preview = preview;
    session.demo = true;
    if (preview === 'story') {
      this.scene.start('Story');
      return;
    }
    if (preview === 'briefing') {
      this.scene.start('Briefing');
      return;
    }
    if (preview === 'gameplay' || preview === 'sabotage') {
      session.moduleKeys = ['wires', 'cipher', 'reverse'];
      session.moduleCount = 3;
      session.timeMax = 40;
      session.timeLeft = preview === 'sabotage' ? 22 : 32;
      session.strikes = 1;
      session.score = preview === 'sabotage' ? 2140 : 3480;
      const split = preview === 'sabotage' ? [980, 680, 480] : [1480, 1120, 880];
      session.players.forEach((p, i) => { p.contribution = split[i] || 0; });
      this.scene.start('Game');
      return;
    }
    if (preview === 'victory') {
      session.timeMax = 40;
      session.timeLeft = 23.4;
      session.result = 'win';
      session.resultReason = 'SEMUA MODUL AMAN';
      session.strikes = 0;
      session.solved = session.moduleCount;
      session.sabotageCleared = 2;
      session.score = 10240;
      session.timeBonus = 9;
      session.saved = false;
      session.players.forEach((p, i) => { p.contribution = [4100, 3440, 2700][i] || 0; });
      this.scene.start('Victory', { demo: true });
      return;
    }
    if (preview === 'defeat') {
      session.timeMax = 40;
      session.timeLeft = 0;
      session.result = 'lose';
      session.resultReason = '3 STRIKE';
      session.strikes = 3;
      session.solved = 2;
      session.score = 5260;
      session.players.forEach((p, i) => { p.contribution = [2100, 1750, 1410][i] || 0; });
      this.scene.start('Defeat', { demo: true, card: true });
      return;
    }
    this.scene.start('Attract');
  }
}
