import { BootScene } from './scenes/BootScene.js';
import { AttractScene } from './scenes/AttractScene.js';
import { TeamSelectScene } from './scenes/TeamSelectScene.js';
import { StoryScene } from './scenes/StoryScene.js';
import { BriefingScene } from './scenes/BriefingScene.js';
import { GameScene } from './scenes/GameScene.js';
import { VictoryScene } from './scenes/VictoryScene.js';
import { DefeatScene } from './scenes/DefeatScene.js';
import { audio } from './core/audio.js';
import { loadSettings } from './core/storage.js';
import { initAdmin } from './ui/admin.js';

const FONT_SPECS = [
  '400 40px "Luckiest Guy"',
  '400 24px "Fredoka One"',
  '400 24px "Varela Round"',
  '400 24px Bungee',
];

function hideFatalError(message) {
  const boot = document.getElementById('boot-screen');
  if (!boot) return;
  const tip = document.getElementById('boot-tip');
  if (tip) {
    tip.style.color = '#FF9AA0';
    tip.textContent = `GAGAL MEMUAT: ${message}`;
  }
  document.getElementById('boot-fill')?.style.setProperty('background', '#F2555F');
}

async function boot() {
  initAdmin();
  const settings = loadSettings();
  audio.setPrefs({ sound: settings.sound, music: settings.music });

  try {
    if (document.fonts) {
      await Promise.all(FONT_SPECS.map((spec) => document.fonts.load(spec)));
      await document.fonts.ready;
    }
  } catch (error) {
    console.warn('Font load warning:', error);
  }

  document.addEventListener('contextmenu', (event) => event.preventDefault());
  document.addEventListener('gesturestart', (event) => event.preventDefault());
  document.addEventListener('dblclick', (event) => event.preventDefault());

  window.addEventListener('pointerdown', () => {
    audio.unlock();
  }, { passive: true });
  window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'f' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
      else document.exitFullscreen?.().catch(() => {});
    }
    audio.unlock();
  });

  const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1920,
    height: 1080,
    backgroundColor: '#070A12',
    transparent: false,
    antialias: true,
    pixelArt: false,
    roundPixels: false,
    disableContextMenu: true,
    banner: false,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1920,
      height: 1080,
    },
    render: {
      antialias: true,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false,
    },
    input: {
      activePointers: 10,
      smoothFactor: 0,
      windowEvents: true,
      touch: true,
      mouse: true,
    },
    audio: {
      noAudio: true,
    },
    scene: [BootScene, AttractScene, TeamSelectScene, StoryScene, BriefingScene, GameScene, VictoryScene, DefeatScene],
  };

  try {
    const game = new Phaser.Game(config);
    window.BC_GAME = game;
    game.events.once('ready', () => {
      window.__BC_READY = true;
    });
  } catch (error) {
    console.error(error);
    hideFatalError(error?.message || 'Phaser gagal dimulai');
  }
}

boot();
