import { session } from './session.js';
import { sparkBurst, touchRipple } from '../ui/factory.js';

/**
 * Multi-touch manager.
 * - Accepts up to 10 simultaneous active pointers.
 * - Rejects "palm"/fabric ghost touches (large IR radius) before they reach
 *   any button, except during the Smoke Screen wipe.
 * - Provides per-player touch colour feedback and contribution attribution.
 */
export class TouchManager {
  constructor(scene, { players = null, depth = 96, ghostRadius = 92 } = {}) {
    this.scene = scene;
    this.players = players || session.players;
    this.depth = depth;
    this.ghostRadius = ghostRadius;
    this.active = new Map();
    this.lastPlayer = this.players[0] || null;
    this.effects = 0;
    this._down = this.onDown.bind(this);
    this._move = this.onMove.bind(this);
    this._up = this.onUp.bind(this);
    this.installPalmFilter();
    scene.input.on('pointerdown', this._down);
    scene.input.on('pointermove', this._move);
    scene.input.on('pointerup', this._up);
    scene.events.once('shutdown', () => this.destroy());
  }

  playerForX(x) {
    const n = Math.max(1, this.players.length);
    const idx = Phaser.Math.Clamp(Math.floor((x / 1920) * n), 0, n - 1);
    return this.players[idx] || this.players[0];
  }

  playerForPointer(pointer) {
    return this.active.get(pointer.id)?.player || this.playerForX(pointer.x);
  }

  ghostTouch(pointer) {
    const ev = pointer.event;
    const touch = ev?.changedTouches?.[0] || ev?.touches?.[0] || ev;
    if (!touch) return false;
    const rx = Number(touch.radiusX || touch.webkitRadiusX || 0);
    const ry = Number(touch.radiusY || touch.webkitRadiusY || 0);
    return Math.max(rx, ry) > this.ghostRadius;
  }

  /**
   * Swallow palm/sleeve presses before Phaser dispatches them to game objects,
   * otherwise a rejected touch would still press buttons and puzzle targets.
   * Only the Smoke Screen wipe accepts a palm; every other sabotage stays finger-only.
   * shortcut: patches Phaser InputPlugin.processDownEvents; revisit on engine upgrade.
   */
  installPalmFilter() {
    const input = this.scene.input;
    if (input.__bcPalmFilter) return;
    input.__bcPalmFilter = true;
    const original = input.processDownEvents;
    input.processDownEvents = (pointer) => {
      const manager = this.scene.touch;
      if (manager?.ghostTouch(pointer) && this.scene.sabotage?.activeType !== 'smoke') {
        if (session.stats) session.stats.ghostRejects = (session.stats.ghostRejects || 0) + 1;
        return;
      }
      return original.call(input, pointer);
    };
  }

  onDown(pointer) {
    if (this.scene.__inputBlocked) return;
    if (this.ghostTouch(pointer)) {
      if (session.stats) session.stats.ghostRejects = (session.stats.ghostRejects || 0) + 1;
      return;
    }
    const player = this.playerForX(pointer.x);
    this.lastPlayer = player;
    if (session.stats) session.stats.touchCount = (session.stats.touchCount || 0) + 1;
    this.active.set(pointer.id, { player, ring: null, lastSpark: 0 });
    if (this.effects < 28) {
      this.effects++;
      touchRipple(this.scene, pointer.x, pointer.y, player.color, { depth: this.depth, big: false });
      this.scene.time.delayedCall(500, () => { this.effects = Math.max(0, this.effects - 1); });

      const ringKey = `touch-ring-${player.key}`;
      if (this.scene.textures.exists(ringKey)) {
        const ring = this.scene.add.image(pointer.x, pointer.y, ringKey)
          .setDisplaySize(70, 70).setDepth(this.depth + 1).setAlpha(0.48).setBlendMode(Phaser.BlendModes.ADD);
        this.scene.tweens.add({ targets: ring, alpha: 0.22, duration: 160 });
        const entry = this.active.get(pointer.id);
        if (entry) entry.ring = ring;
      }
    }
    if (session.demo) return;
  }

  onMove(pointer) {
    const entry = this.active.get(pointer.id);
    if (!entry) return;
    if (entry.ring) entry.ring.setPosition(pointer.x, pointer.y);
    const now = performance.now();
    if (now - entry.lastSpark > 110) {
      entry.lastSpark = now;
      if (pointer.getDistance() > 8) {
        sparkBurst(this.scene, pointer.x, pointer.y, entry.player.color, 1, { scale: 0.18, speed: 35, depth: this.depth });
      }
    }
  }

  onUp(pointer) {
    const entry = this.active.get(pointer.id);
    if (!entry) return;
    if (entry.ring) {
      this.scene.tweens.add({ targets: entry.ring, alpha: 0, scale: 0.5, duration: 140, onComplete: () => entry.ring.destroy() });
    }
    this.active.delete(pointer.id);
  }

  get lastPlayerColor() {
    return this.lastPlayer?.css || '#FFC93C';
  }

  destroy() {
    const scene = this.scene;
    if (!scene || !scene.input) return;
    scene.input.off('pointerdown', this._down);
    scene.input.off('pointermove', this._move);
    scene.input.off('pointerup', this._up);
    for (const entry of this.active.values()) if (entry.ring) entry.ring.destroy();
    this.active.clear();
  }
}
