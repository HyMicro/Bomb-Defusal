import { DIFFICULTIES, MODULES, PLAYERS, timeForDifficulty } from '../config.js';

const ALL_MODULE_KEYS = Object.keys(MODULES);

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Shared mutable session — intentionally a singleton so scenes can transition
 * while keeping the same team, round config and score state.
 */
class GameSession {
  constructor() {
    this.players = [];
    this.difficultyKey = 'standard';
    this.difficulty = DIFFICULTIES.standard;
    this.moduleCount = 3;
    this.moduleKeys = [];
    this.roundNumber = 1;
    this.timeMax = 40;
    this.timeLeft = 40;
    this.strikes = 0;
    this.maxStrikes = 3;
    this.score = 0;
    this.solved = 0;
    this.sabotageCleared = 0;
    this.mistakes = 0;
    this.timeBonus = 0;
    this.passUsed = false;
    this.passOwner = null;
    this.result = null;
    this.resultReason = '';
    this.startedAt = 0;
    this.endedAt = 0;
    this.saved = false;
    this.demo = false;
    this.preview = null;
    this.stats = {};
  }

  create({ playerCount = 3, difficultyKey = 'standard', moduleKeys = null, demo = false, preview = null } = {}) {
    this.players = PLAYERS.slice(0, Math.max(2, Math.min(4, playerCount))).map((p, index) => ({
      ...p,
      index,
      contribution: 0,
      modules: [],
    }));
    this.difficultyKey = DIFFICULTIES[difficultyKey] ? difficultyKey : 'standard';
    this.difficulty = DIFFICULTIES[this.difficultyKey];
    this.moduleCount = this.difficulty.moduleCount;
    this.moduleKeys = moduleKeys || this.pickModules(this.difficultyKey, this.moduleCount);
    this.moduleKeys.forEach((key, index) => {
      const owner = this.players[index % this.players.length];
      owner.modules.push(index);
    });
    this.timeMax = timeForDifficulty(this.difficultyKey, this.players.length);
    this.timeLeft = this.timeMax;
    this.strikes = 0;
    this.maxStrikes = 3;
    this.score = 0;
    this.solved = 0;
    this.sabotageCleared = 0;
    this.mistakes = 0;
    this.timeBonus = 0;
    this.passUsed = false;
    this.passOwner = null;
    this.result = null;
    this.resultReason = '';
    this.startedAt = 0;
    this.endedAt = 0;
    this.saved = false;
    this.demo = demo;
    this.preview = preview;
    this.stats = {
      sabotageSeen: 0,
      sabotageCleared: 0,
      mistakes: 0,
      passAccepted: false,
      wiresCut: 0,
      touchCount: 0,
    };
    return this;
  }

  pickModules(difficultyKey, count) {
    let pool = shuffle(ALL_MODULE_KEYS);
    if (difficultyKey === 'chaos') {
      pool = ['cipher', ...shuffle(ALL_MODULE_KEYS.filter((k) => k !== 'cipher'))];
    }
    // Avoid two "read the UI" traps in the same round.
    const chosen = [];
    const trapGroup = new Set(['metaTrap', 'reverse']);
    for (const key of pool) {
      if (chosen.length >= count) break;
      if (trapGroup.has(key) && chosen.some((k) => trapGroup.has(k))) continue;
      chosen.push(key);
    }
    for (const key of pool) {
      if (chosen.length >= count) break;
      if (!chosen.includes(key)) chosen.push(key);
    }
    return chosen.slice(0, count);
  }

  ownerOfModule(index) {
    return this.players[index % this.players.length];
  }

  addContribution(player, points) {
    if (!player) return;
    player.contribution = Math.max(0, Math.round(player.contribution + points));
  }

  addScore(points, player = null, { contribution = true } = {}) {
    this.score = Math.max(0, Math.round(this.score + points));
    if (contribution && player) this.addContribution(player, points);
    return this.score;
  }

  addStrike() {
    this.strikes = Math.min(this.maxStrikes, this.strikes + 1);
    this.mistakes += 1;
    this.stats.mistakes = this.mistakes;
    return this.strikes >= this.maxStrikes;
  }

  moduleSolved(index) {
    this.solved = Math.min(this.moduleCount, this.solved + 1);
    const owner = this.ownerOfModule(index);
    this.addScore(800 * this.difficulty.scoreMult, owner);
    return owner;
  }

  get timePercent() {
    return this.timeMax > 0 ? Math.max(0, this.timeLeft / this.timeMax) : 0;
  }

  finalScore() {
    let bonus = Math.floor(Math.max(0, this.timeLeft) * 120 * this.difficulty.scoreMult);
    if (this.strikes === 0) bonus += 1500;
    bonus += this.sabotageCleared * 250;
    const score = Math.round(this.score + bonus);
    this.score = score;
    return score;
  }

  get mvp() {
    return [...this.players].sort((a, b) => b.contribution - a.contribution)[0] || null;
  }

  get supportPlayer() {
    return this.players.find((p) => p.modules.length === 0) || null;
  }
}

export const session = new GameSession();
