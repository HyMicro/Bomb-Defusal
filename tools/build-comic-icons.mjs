/**
 * Builds the comic UI icon set from Font Awesome Free solid paths.
 * Result: cream fill + thick ink outline. The cream part accepts Phaser tints,
 * while the ink outline stays black, so the icons still work with setTint().
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const iconDir = path.join(root, 'assets', 'icons');
const legacyDir = path.join(iconDir, 'legacy');

const MAP = {
  'icon-settings': 'gear',
  'icon-sound': 'volume-high',
  'icon-mute': 'volume-xmark',
  'icon-back': 'arrow-left',
  'icon-home': 'house',
  'icon-replay': 'rotate-right',
  'icon-help': 'circle-question',
  'icon-trophy': 'trophy',
  'icon-crown': 'crown',
  'icon-leaderboard': 'ranking-star',
  'icon-team': 'users',
  'icon-timer': 'stopwatch',
  'icon-bomb': 'bomb',
  'icon-wire': 'plug',
  'icon-hand-tap': 'hand-pointer',
  'icon-hand-hold': 'hand',
  'icon-hand-drag': 'hand-point-right',
  'icon-hand-swipe': 'hand-point-up',
  'icon-hand-multi': 'hands',
  'icon-snowflake': 'snowflake',
  'icon-smoke': 'smog',
  'icon-glitch': 'bug',
  'icon-alert': 'triangle-exclamation',
  'icon-check': 'check',
  'icon-cross': 'xmark',
  'icon-star': 'star',
  'icon-bolt': 'bolt',
  'icon-spark': 'wand-magic-sparkles',
  'icon-shield': 'shield-halved',
  'icon-key': 'key',
  'icon-lock': 'lock',
  'icon-eye': 'eye',
  'icon-arrow-right': 'arrow-right',
  'icon-arrow-up': 'arrow-up',
  'icon-plus': 'plus',
  'icon-minus': 'minus',
  'icon-pause': 'pause',
  'icon-mic': 'microphone',
  'icon-reset': 'arrow-rotate-left',
  'icon-close': 'xmark',
  'icon-heart': 'heart',
  'icon-flag': 'flag',
  'icon-clockw': 'clock',
  'icon-stopwatch': 'stopwatch',
  'icon-megaphone': 'bullhorn',
  'icon-csv': 'file-csv',
  'icon-map': 'map',
  'icon-wifi': 'wifi',
  'icon-play': 'play',
  'icon-music': 'music',
  'icon-info': 'circle-info',
};

fs.mkdirSync(legacyDir, { recursive: true });

const VER = '6.7.2';
const base = `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@${VER}/svgs/solid`;
let ok = 0;
for (const [key, fa] of Object.entries(MAP)) {
  const url = `${base}/${fa}.svg`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`missing ${fa} (${res.status}) for ${key}`);
    continue;
  }
  const raw = await res.text();
  let inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>[\s\S]*$/, '');
  inner = inner.replace(/<title>[\s\S]*?<\/title>/g, '').replace(/\s(fill|class|stroke|stroke-width|stroke-linejoin|stroke-linecap)="[^"]*"/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 512 512">
<g transform="translate(256 256) scale(0.84) translate(-256 -256)">
  <g fill="#070C16" stroke="#070C16" stroke-width="46" stroke-linejoin="round" stroke-linecap="round">${inner}</g>
  <g fill="#FFF4DF" stroke="none">${inner}</g>
</g>
</svg>`;
  const dst = path.join(iconDir, `${key}.svg`);
  if (fs.existsSync(dst) && !fs.existsSync(path.join(legacyDir, `${key}.svg`))) {
    fs.copyFileSync(dst, path.join(legacyDir, `${key}.svg`));
  }
  fs.writeFileSync(dst, svg, 'utf8');
  ok++;
}
console.log(`Wrote ${ok} comic icon SVGs.`);
