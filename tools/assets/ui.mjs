import {
  C, S, svgDoc, linear, radial, glow, shadow, hex01, frame, rounded, starPath,
  hazardDefs, gridDefs, dotsDefs, screw,
} from './lib.mjs';

export const uiAssets = [];

const A = (relPath, svg, meta = {}) => uiAssets.push({ path: `ui/${relPath}`, svg, ...meta });

/* ------------------------------------------------------------------ *
 *  BUTTONS — 480 x 144, 4 visual states, 5 colourways
 * ------------------------------------------------------------------ */
const BUTTON_PALETTES = {
  primary: { base: C.yellow, light: C.yellowLight, dark: C.yellowDark, ink: '#241A05' },
  blue: { base: C.blue, light: C.blueLight, dark: C.blueDark, ink: '#06142B' },
  danger: { base: C.red, light: C.redLight, dark: C.redDark, ink: '#26040A' },
  success: { base: C.green, light: C.greenLight, dark: C.greenDark, ink: '#032116' },
  ghost: { base: '#26314A', light: '#3A4766', dark: '#111827', ink: C.cream, ghost: true },
  purple: { base: C.purple, light: C.purpleLight, dark: C.purpleDark, ink: '#1D0628' },
};

function buttonSvg(paletteKey, state, { w = 480, h = 144 } = {}) {
  const p = BUTTON_PALETTES[paletteKey];
  const defs = [
    linear('base', [[0, p.light], [.18, p.base], [.68, p.base], [1, p.dark]]),
    linear('lip', [[0, p.dark], [1, '#070A12']]),
    linear('glass', [[0, '#FFFFFF', .55], [.45, '#FFFFFF', .12], [1, '#FFFFFF', 0]]),
    linear('shine', [[0, '#FFFFFF', 0], [.5, '#FFFFFF', .3], [1, '#FFFFFF', 0]], { x1: 0, y1: 0, x2: 1, y2: 0 }),
    shadow('drop', 12, 12, .65),
    glow('hoverGlow', p.base, 18),
    paletteKey === 'ghost'
      ? `<clipPath id="clip"><rect x="10" y="8" width="${w - 20}" height="${h - 26}" rx="24"/></clipPath>`
      : `<clipPath id="clip"><rect x="10" y="8" width="${w - 20}" height="${h - 26}" rx="24"/></clipPath>`,
    hazardDefs('hatch', 22, '#8B96B1', '#6E7891'),
  ].join('');

  const disabled = state === 'disabled';
  const pressed = state === 'pressed';
  const hover = state === 'hover';
  const dy = pressed ? 8 : hover ? -2 : 0;
  const hatch = disabled
    ? `<rect x="10" y="8" width="${w - 20}" height="${h - 26}" rx="24" fill="url(#hatch)" opacity=".55" clip-path="url(#clip)"/>`
    : '';

  let content = `
  <ellipse cx="${w / 2}" cy="${h - 14}" rx="${w * .42}" ry="18" fill="#05070D" opacity=".55"/>
  <g filter="${hover && !disabled ? 'url(#hoverGlow)' : 'url(#drop)'}">
    ${hover && !disabled ? `<rect x="-8" y="-10" width="${w + 16}" height="${h + 4}" rx="38" fill="${p.base}" opacity=".22"/>` : ''}
    <g transform="translate(0 ${dy})">
      <rect x="10" y="20" width="${w - 20}" height="${h - 32}" rx="25" fill="${disabled ? '#3D4559' : 'url(#lip)'}" stroke="${C.ink}" stroke-width="6"/>
      <rect x="10" y="8" width="${w - 20}" height="${h - 32}" rx="25" fill="${disabled ? '#555E73' : 'url(#base)'}" stroke="${C.ink}" stroke-width="6"/>
      <rect x="18" y="15" width="${w - 36}" height="${(h - 44) * .44}" rx="17" fill="url(#glass)" opacity="${disabled ? .12 : .7}"/>
      <path d="M40 29 L${w - 76} 29" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="${disabled ? .12 : .38}"/>
      <path d="M50 ${h - 46} L${w - 50} ${h - 46}" stroke="${C.ink}" stroke-width="4" stroke-linecap="round" opacity=".22"/>
      ${pressed ? `<rect x="24" y="20" width="${w - 48}" height="${h - 54}" rx="20" fill="${C.ink}" opacity=".18"/>` : ''}
      ${!disabled ? `<circle cx="38" cy="${h - 34}" r="4" fill="${C.ink}" opacity=".35"/><circle cx="${w - 38}" cy="${h - 34}" r="4" fill="${C.ink}" opacity=".35"/>` : ''}
      ${hover && !disabled ? `<g opacity=".8"><path d="M${w - 64} 42 l7 13 -13 4z" fill="#FFFFFF" opacity=".55"/><path d="M${w - 42} 68 l4 8 -8 2z" fill="#FFFFFF" opacity=".35"/></g>` : ''}
      ${disabled ? `<g clip-path="url(#clip)"><rect x="10" y="8" width="${w - 20}" height="${h - 26}" rx="24" fill="url(#hatch)" opacity=".7"/></g>` : ''}
      <rect x="10" y="8" width="${w - 20}" height="${h - 32}" rx="25" fill="none" stroke="${pressed ? '#00000055' : '#FFFFFF33'}" stroke-width="2"/>
      <rect x="10" y="8" width="${w - 20}" height="${h - 32}" rx="25" fill="none" stroke="${C.ink}" stroke-width="3"/>
    </g>
  </g>`;

  if (paletteKey === 'ghost' && !disabled) {
    content += `<rect x="12" y="10" width="${w - 24}" height="${h - 36}" rx="23" fill="none" stroke="${C.steelLight}" stroke-width="2" stroke-dasharray="3 9" opacity=".55"/>`;
  }

  return svgDoc(w, h, content, { defs });
}

for (const key of Object.keys(BUTTON_PALETTES)) {
  for (const state of ['normal', 'hover', 'pressed', 'disabled']) {
    A(`buttons/btn-${key}-${state}.svg`, buttonSvg(key, state), {
      group: 'Button', size: '480×144', format: 'SVG', tags: ['button', key, state],
      note: '9-slice ready. Label/icon rendered at runtime.',
    });
  }
}

/* Round icon buttons — 144 × 144 */
function roundButtonSvg(paletteKey, state) {
  const p = BUTTON_PALETTES[paletteKey];
  const disabled = state === 'disabled';
  const pressed = state === 'pressed';
  const hover = state === 'hover';
  const defs = [
    linear('base', [[0, p.light], [.2, p.base], [.75, p.base], [1, p.dark]]),
    radial('dome', [[0, '#FFFFFF', .55], [.55, '#FFFFFF', .08], [1, '#000000', .22]]),
    shadow('drop', 8, 10, .6),
    glow('hg', p.base, 14),
    hazardDefs('hatch', 18, '#9AA4BD', '#6E7891'),
  ].join('');
  const dy = pressed ? 6 : 0;
  return svgDoc(144, 144, `
  <circle cx="72" cy="132" r="48" fill="#05070D" opacity=".5"/>
  <g transform="translate(0 ${dy})" filter="${hover ? 'url(#hg)' : 'url(#drop)'}">
    <circle cx="72" cy="80" r="58" fill="${disabled ? '#444D62' : 'url(#base)'}" stroke="${C.ink}" stroke-width="7"/>
    <circle cx="72" cy="76" r="54" fill="none" stroke="#FFFFFF" stroke-opacity=".25" stroke-width="3"/>
    <circle cx="72" cy="76" r="46" fill="url(#dome)"/>
    <path d="M38 54 C44 34 62 24 82 25" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity=".45"/>
    ${disabled ? `<circle cx="72" cy="76" r="54" fill="url(#hatch)" opacity=".65"/>` : ''}
    ${hover && !disabled ? `<circle cx="72" cy="76" r="64" fill="none" stroke="${p.light}" stroke-width="3" opacity=".55"/>` : ''}
  </g>`, { defs });
}
for (const key of ['primary', 'blue', 'ghost', 'danger']) {
  for (const state of ['normal', 'hover', 'pressed', 'disabled']) {
    A(`buttons/btn-round-${key}-${state}.svg`, roundButtonSvg(key, state), {
      group: 'Button', size: '144×144', format: 'SVG', tags: ['icon-button', key, state],
      note: 'Circular icon button. Icon sits centred at 72,76.',
    });
  }
}

/* Keypad key — 160 × 120 */
function keypadSvg(state) {
  const pressed = state === 'pressed';
  const hover = state === 'hover';
  const defs = [
    linear('key', [[0, '#3B4765'], [.2, '#2A3450'], [1, '#182036']]),
    linear('lip', [[0, '#0C1120'], [1, '#050810']]),
    shadow('drop', 8, 8, .55),
    glow('hg', C.blue, 12),
  ].join('');
  return svgDoc(160, 120, `
  <g transform="translate(0 ${pressed ? 6 : 0})" filter="${hover ? 'url(#hg)' : 'url(#drop)'}">
    <rect x="6" y="16" width="148" height="96" rx="18" fill="url(#lip)" stroke="${C.ink}" stroke-width="5"/>
    <rect x="6" y="6" width="148" height="96" rx="18" fill="url(#key)" stroke="${C.ink}" stroke-width="5"/>
    <rect x="14" y="12" width="132" height="36" rx="12" fill="#FFFFFF" opacity=".06"/>
    ${hover ? `<rect x="8" y="8" width="144" height="92" rx="16" fill="none" stroke="${C.blueLight}" stroke-width="3" opacity=".75"/>` : ''}
    <path d="M26 100 H134" stroke="#FFFFFF" stroke-width="2" opacity=".1" stroke-linecap="round"/>
  </g>`, { defs });
}
for (const state of ['normal', 'hover', 'pressed']) {
  A(`buttons/keypad-${state}.svg`, keypadSvg(state), {
    group: 'Button', size: '160×120', format: 'SVG', tags: ['keypad', state],
    note: 'Numeric keypad key. Digit label rendered at runtime.',
  });
}

/* ------------------------------------------------------------------ *
 *  PANELS & FRAMES
 * ------------------------------------------------------------------ */
function panelSvg(tone = 'dark') {
  const w = 240, h = 240;
  const fill = tone === 'dark' ? '#111828' : tone === 'metal' ? '#28324A' : '#1B2338';
  const defs = [
    linear('metal', [[0, '#6B7896'], [.16, '#48536E'], [.55, '#303A55'], [1, '#1A2236']], { x1: 0, y1: 0, x2: 1, y2: 1 }),
    linear('sheen', [[0, '#FFFFFF', .12], [.3, '#FFFFFF', .02], [1, '#FFFFFF', 0]]),
    shadow('drop', 6, 10, .5),
  ].join('');
  return svgDoc(w, h, `
  <rect x="4" y="6" width="232" height="228" rx="22" fill="#05080F" opacity=".7"/>
  <rect x="3" y="3" width="234" height="228" rx="22" fill="${fill}" stroke="${C.ink}" stroke-width="7"/>
  <rect x="12" y="12" width="216" height="210" rx="15" fill="none" stroke="url(#metal)" stroke-width="3" opacity=".8"/>
  <rect x="14" y="14" width="212" height="206" rx="14" fill="none" stroke="#000000" stroke-opacity=".55" stroke-width="2"/>
  <rect x="20" y="20" width="200" height="60" rx="12" fill="url(#sheen)"/>
  ${screw(24, 24, 5)}${screw(216, 24, 5)}${screw(24, 216, 5)}${screw(216, 216, 5)}
  <path d="M28 45 H70" stroke="${C.yellow}" stroke-width="4" stroke-linecap="round" opacity=".65"/>`, { defs });
}
A('panels/panel-dark.svg', panelSvg('dark'), { group: 'Panel', size: '240×240', format: 'SVG', tags: ['9-slice', 'panel'], note: 'Slices 52/52/52/52. Inner content safe area 30px.' });
A('panels/panel-metal.svg', panelSvg('metal'), { group: 'Panel', size: '240×240', format: 'SVG', tags: ['9-slice', 'panel', 'metal'], note: 'Slices 52/52/52/52.' });
A('panels/panel-inset.svg', panelSvg('inset'), { group: 'Panel', size: '240×240', format: 'SVG', tags: ['9-slice', 'panel', 'inset'], note: 'Slices 52/52/52/52.' });

/* Module frame — transparent centre */
function moduleFrame(accent = C.yellow) {
  const w = 560, h = 620;
  const defs = [
    linear('metal', [[0, '#697793'], [.18, '#46526E'], [.55, '#2B354F'], [.82, '#39455F'], [1, '#1D263A']], { x1: 0, y1: 0, x2: 1, y2: 1 }),
    linear('hot', [[0, accent], [1, accent === C.green ? '#0C8C55' : '#B57E00']]),
    glow('lg', accent, 14),
    shadow('drop', 14, 18, .55),
    hazardDefs('haz', 24, accent, C.ink),
  ].join('');
  return svgDoc(w, h, `
  <g filter="url(#drop)">
    <rect x="12" y="14" width="536" height="600" rx="30" fill="#070B15" opacity=".65"/>
    <rect x="10" y="8" width="540" height="598" rx="30" fill="none" stroke="url(#metal)" stroke-width="18"/>
    <rect x="10" y="8" width="540" height="598" rx="30" fill="none" stroke="${C.ink}" stroke-width="6"/>
    <rect x="24" y="22" width="512" height="76" rx="18" fill="#0B1120" opacity=".78"/>
    <path d="M24 94 H536" stroke="${C.ink}" stroke-width="5"/>
    <path d="M24 88 H536" stroke="${accent}" stroke-opacity=".45" stroke-width="2"/>
    <rect x="30" y="34" width="8" height="48" rx="4" fill="url(#hot)"/>
    <path d="M56 46 H336" stroke="#FFFFFF" stroke-opacity=".2" stroke-width="4" stroke-linecap="round"/>
    <path d="M56 60 H252" stroke="#FFFFFF" stroke-opacity=".1" stroke-width="3" stroke-linecap="round"/>
    <!-- LED housing -->
    <circle cx="500" cy="55" r="25" fill="#070B14" stroke="${C.ink}" stroke-width="5"/>
    <circle cx="500" cy="55" r="17" fill="${accent}" opacity=".28" filter="url(#lg)"/>
    <circle cx="500" cy="55" r="12" fill="#180B0C" stroke="#000" stroke-width="3"/>
    <!-- corner brackets -->
    <path d="M28 128 V108 H52 M508 108 H532 V128 M532 508 V528 H508 M52 528 H28 V508" stroke="${accent}" stroke-width="5" stroke-linecap="round" fill="none" opacity=".9"/>
    <!-- bottom grille -->
    <path d="M32 570 H528" stroke="${C.ink}" stroke-width="5"/>
    <path d="M40 588 H200" stroke="${accent}" stroke-width="4" stroke-linecap="round" opacity=".5"/>
    <rect x="474" y="574" width="50" height="12" rx="6" fill="url(#haz)" opacity=".85"/>
  </g>
  ${screw(31, 29, 6)}${screw(31, 589, 6)}${screw(529, 29, 6)}${screw(529, 589, 6)}`, { defs });
}
A('frames/frame-module.svg', moduleFrame(C.yellow), { group: 'Frame', size: '560×620', format: 'SVG', tags: ['module', 'fixed'], note: 'Transparent centre overlay. Header band at y=0–96.' });
A('frames/frame-module-solved.svg', moduleFrame(C.green), { group: 'Frame', size: '560×620', format: 'SVG', tags: ['module', 'solved'], note: 'Green accent state for solved module.' });

/* Timer plate */
function timerPlate() {
  const w = 560, h = 190;
  const defs = [
    linear('metal', [[0, '#7B879F'], [.12, '#4E5A74'], [.5, '#2B344B'], [.82, '#46526E'], [1, '#1B2336']], { x1: 0, y1: 0, x2: 1, y2: 1 }),
    linear('recess', [[0, '#1A090B'], [.5, '#0A0508'], [1, '#2B0A10']]),
    radial('led', [[0, '#FFB35C', .35], [.55, '#FF414D', .18], [1, '#FF414D', 0]]),
    linear('hot', [[0, C.red], [1, '#971524']]),
    glow('redGlow', C.red, 10),
    shadow('drop', 12, 16, .6),
  ].join('');
  return svgDoc(w, h, `
  <g filter="url(#drop)">
    <rect x="8" y="10" width="544" height="172" rx="26" fill="#05080F" opacity=".7"/>
    <rect x="6" y="6" width="548" height="172" rx="26" fill="url(#metal)" stroke="${C.ink}" stroke-width="7"/>
    <rect x="22" y="20" width="516" height="144" rx="18" fill="#111725" stroke="#000" stroke-width="4"/>
    <rect x="36" y="34" width="488" height="92" rx="13" fill="url(#recess)" stroke="#2E0A11" stroke-width="3"/>
    <rect x="42" y="40" width="476" height="80" rx="9" fill="url(#led)"/>
    <path d="M36 126 H524" stroke="url(#hot)" stroke-width="3" opacity=".8"/>
    <path d="M58 145 H218" stroke="#FFFFFF" stroke-opacity=".2" stroke-width="3" stroke-linecap="round"/>
    <path d="M342 145 H502" stroke="#FFFFFF" stroke-opacity=".12" stroke-width="3" stroke-linecap="round"/>
    <circle cx="522" cy="50" r="7" fill="${C.red}" filter="url(#redGlow)"/>
    <rect x="36" y="34" width="488" height="92" rx="13" fill="none" stroke="${C.red}" stroke-opacity=".3" stroke-width="2"/>
  </g>
  ${screw(24, 24, 6)}${screw(536, 24, 6)}${screw(24, 160, 6)}${screw(536, 160, 6)}`, { defs });
}
A('hud/timer-plate.svg', timerPlate(), { group: 'HUD', size: '560×190', format: 'SVG', tags: ['timer', 'chrome'], note: 'Render digits above plate. Safe LED area x=42–518, y=40–120.' });

/* Score plate */
function scorePlate() {
  const w = 360, h = 112;
  const defs = [
    linear('metal', [[0, '#5E6B87'], [.25, '#303A55'], [1, '#171F33']], { x1: 0, y1: 0, x2: 1, y2: 1 }),
    radial('glow', [[0, C.purple, .25], [1, C.purple, 0]]),
    shadow('drop', 8, 10, .5),
  ].join('');
  return svgDoc(w, h, `
  <g filter="url(#drop)">
    <rect x="5" y="6" width="350" height="102" rx="18" fill="#05080F" opacity=".7"/>
    <rect x="4" y="4" width="352" height="100" rx="18" fill="url(#metal)" stroke="${C.ink}" stroke-width="6"/>
    <rect x="14" y="14" width="332" height="78" rx="12" fill="#0E1524" stroke="#000" stroke-width="3"/>
    <rect x="18" y="18" width="324" height="70" rx="9" fill="url(#glow)" opacity=".6"/>
    <path d="M28 84 H122" stroke="${C.purple}" stroke-width="3" stroke-linecap="round" opacity=".75"/>
    <path d="M240 32 H322" stroke="#FFFFFF" stroke-opacity=".15" stroke-width="3" stroke-linecap="round"/>
  </g>`, { defs });
}
A('hud/score-plate.svg', scorePlate(), { group: 'HUD', size: '360×112', format: 'SVG', tags: ['score'] });

/* Player chip */
function playerChip() {
  const w = 300, h = 88;
  const defs = [
    linear('metal', [[0, '#4C5872'], [1, '#202940']], { x1: 0, y1: 0, x2: 0, y2: 1 }),
    radial('avatar', [[0, '#2D3A5B'], [1, '#0A101E']]),
    shadow('drop', 5, 7, .45),
  ].join('');
  return svgDoc(w, h, `
  <g filter="url(#drop)">
    <rect x="4" y="5" width="292" height="78" rx="20" fill="#05080F" opacity=".65"/>
    <rect x="3" y="3" width="294" height="78" rx="20" fill="url(#metal)" stroke="${C.ink}" stroke-width="5"/>
    <rect x="10" y="10" width="280" height="64" rx="14" fill="#101726"/>
    <circle cx="46" cy="42" r="25" fill="url(#avatar)" stroke="${C.ink}" stroke-width="3"/>
    <path d="M18 76 C22 55 34 48 46 48 C58 48 70 55 74 76" fill="#2C3857" opacity=".8"/>
  </g>`, { defs });
}
A('hud/player-chip.svg', playerChip(), { group: 'HUD', size: '300×88', format: 'SVG', tags: ['player', 'chip'], note: 'Avatar crop sits at 46,42 r=25; name/score to the right.' });

/* Cipher ribbon (9-slice) */
function cipherRibbon() {
  const w = 1600, h = 120;
  const defs = [
    linear('metal', [[0, '#6C7994'], [.12, '#3B4761'], [.5, '#293249'], [.88, '#3B4761'], [1, '#1A2236']], { x1: 0, y1: 0, x2: 1, y2: 0 }),
    linear('screen', [[0, '#1A1230'], [.5, '#25133A'], [1, '#170F2B']], { x1: 0, y1: 0, x2: 1, y2: 1 }),
    glow('purple', C.purple, 16),
    hazardDefs('haz', 26, C.yellow, C.ink),
  ].join('');
  return svgDoc(w, h, `
  <rect x="6" y="8" width="${w - 12}" height="${h - 14}" rx="24" fill="#05080F" opacity=".7"/>
  <rect x="4" y="4" width="${w - 8}" height="${h - 12}" rx="24" fill="url(#metal)" stroke="${C.ink}" stroke-width="7"/>
  <rect x="26" y="20" width="${w - 52}" height="${h - 42}" rx="14" fill="url(#screen)" stroke="#000" stroke-width="4"/>
  <rect x="26" y="20" width="${w - 52}" height="${h - 42}" rx="14" fill="none" stroke="${C.purple}" stroke-opacity=".55" stroke-width="2"/>
  <path d="M52 88 H420" stroke="#FFFFFF" stroke-opacity=".08" stroke-width="3"/>
  <rect x="18" y="30" width="18" height="48" rx="6" fill="url(#haz)"/>
  <rect x="${w - 36}" y="30" width="18" height="48" rx="6" fill="url(#haz)"/>
  <g opacity=".8" transform="translate(44 38)">
    <path d="M0 22 L17 9 H44 L34 22 L44 35 H17 Z" fill="${C.purple}" opacity=".8" stroke="${C.ink}" stroke-width="3"/>
    <path d="M44 22 L58 8 V36 Z" fill="${C.yellow}" stroke="${C.ink}" stroke-width="3"/>
  </g>
  <g opacity=".8" transform="translate(${w - 132} 38) scale(-1 1)">
    <path d="M0 22 L17 9 H44 L34 22 L44 35 H17 Z" fill="${C.purple}" opacity=".8" stroke="${C.ink}" stroke-width="3"/>
    <path d="M44 22 L58 8 V36 Z" fill="${C.yellow}" stroke="${C.ink}" stroke-width="3"/>
  </g>`, { defs });
}
A('hud/cipher-ribbon.svg', cipherRibbon(), { group: 'HUD', size: '1600×120', format: 'SVG', tags: ['9-slice', 'crowd', 'cipher'], note: 'Slices 150/150/40/40; content safe area 90–1510 × 26–88.' });

/* Sabotage banner */
function sabotageBanner() {
  const w = 900, h = 160;
  const defs = [
    linear('red', [[0, '#B32033'], [.3, C.red], [.7, '#D62A3C'], [1, '#8E1426']], { x1: 0, y1: 0, x2: 1, y2: 1 }),
    linear('plate', [[0, '#5D6983'], [1, '#222B41']], { x1: 0, y1: 0, x2: 0, y2: 1 }),
    glow('rg', C.red, 12),
    hazardDefs('haz', 30, C.yellow, C.ink),
    shadow('drop', 14, 18, .6),
  ].join('');
  return svgDoc(w, h, `
  <g filter="url(#drop)">
    <path d="M36 24 H864 L886 80 L864 136 H36 L14 80 Z" fill="#080B14" opacity=".7" transform="translate(0 8)"/>
    <path d="M34 16 H866 L888 80 L866 144 H34 L12 80 Z" fill="url(#plate)" stroke="${C.ink}" stroke-width="8"/>
    <path d="M56 38 H844 L858 80 L844 122 H56 L42 80 Z" fill="url(#red)" stroke="#2A0308" stroke-width="4"/>
    <path d="M66 52 H834" stroke="#FFFFFF" stroke-opacity=".22" stroke-width="4" stroke-linecap="round"/>
    <rect x="26" y="40" width="42" height="80" rx="9" fill="url(#haz)"/>
    <rect x="832" y="40" width="42" height="80" rx="9" fill="url(#haz)"/>
    <g filter="url(#rg)"><circle cx="92" cy="80" r="26" fill="${C.yellow}" stroke="${C.ink}" stroke-width="5"/><path d="M92 58 V102 M70 80 H114" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/></g>
    <g transform="translate(808 54)"><path d="M24 0 L4 26 H20 L14 52 L42 18 H25 L34 0 Z" fill="${C.yellow}" stroke="${C.ink}" stroke-width="4"/></g>
  </g>`, { defs });
}
A('hud/sabotage-banner.svg', sabotageBanner(), { group: 'HUD', size: '900×160', format: 'SVG', tags: ['sabotage', 'banner'], note: 'Text safe area 130–780 × 52–112.' });

/* Leaderboard row */
function leaderRow() {
  const w = 520, h = 72;
  const defs = [
    linear('row', [[0, '#1B2438'], [1, '#111726']], { x1: 0, y1: 0, x2: 1, y2: 1 }),
    linear('gold', [[0, C.yellowLight], [.5, C.yellow], [1, C.yellowDark]], { x1: 0, y1: 0, x2: 0, y2: 1 }),
    shadow('drop', 4, 6, .4),
  ].join('');
  return svgDoc(w, h, `
  <g filter="url(#drop)">
    <rect x="2" y="4" width="${w - 4}" height="${h - 8}" rx="14" fill="#06090F" opacity=".6"/>
    <rect x="2" y="2" width="${w - 4}" height="${h - 8}" rx="14" fill="url(#row)" stroke="#0A0E18" stroke-width="4"/>
    <rect x="8" y="8" width="56" height="48" rx="10" fill="url(#gold)" opacity=".9"/>
    <path d="M78 28 H420" stroke="#FFFFFF" stroke-opacity=".12" stroke-width="3"/>
    <path d="M78 46 H340" stroke="#FFFFFF" stroke-opacity=".07" stroke-width="2"/>
  </g>`, { defs });
}
A('hud/leader-row.svg', leaderRow(), { group: 'HUD', size: '520×72', format: 'SVG', tags: ['leaderboard', 'row'], note: 'Rank plate at 8–64, name/score rendered to the right.' });

/* Round chip */
function roundChip() {
  const w = 300, h = 68;
  const defs = [
    linear('fill', [[0, C.yellow], [1, C.orange]], { x1: 0, y1: 0, x2: 1, y2: 0 }),
    linear('dark', [[0, '#1A2236'], [1, '#0B101C']], { x1: 0, y1: 0, x2: 0, y2: 1 }),
    shadow('drop', 5, 6, .45),
  ].join('');
  return svgDoc(w, h, `
  <g filter="url(#drop)">
    <path d="M18 8 H282 L294 34 L282 60 H18 L6 34 Z" fill="url(#dark)" stroke="${C.ink}" stroke-width="5"/>
    <path d="M18 8 H112 L104 60 H18 L6 34 Z" fill="url(#fill)"/>
    <path d="M18 8 H112 L104 60 H18 L6 34 Z" fill="none" stroke="${C.ink}" stroke-width="4"/>
    <path d="M122 22 H272" stroke="#FFFFFF" stroke-opacity=".18" stroke-width="3" stroke-linecap="round"/>
  </g>`, { defs });
}
A('hud/round-chip.svg', roundChip(), { group: 'HUD', size: '300×68', format: 'SVG', tags: ['round'], note: 'Left flag area holds round number; right area status text.' });

/* Progress track + fills */
function progressTrack() {
  const w = 900, h = 44;
  const defs = [
    linear('rail', [[0, '#0A0F1B'], [.5, '#070B14'], [1, '#111828']], { x1: 0, y1: 0, x2: 0, y2: 1 }),
    linear('rim', [[0, '#5B6884'], [.5, '#2C354A'], [1, '#404D69']], { x1: 0, y1: 0, x2: 0, y2: 1 }),
    shadow('drop', 4, 8, .45),
  ].join('');
  return svgDoc(w, h, `
  <g filter="url(#drop)">
    <rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="18" fill="url(#rim)" stroke="${C.ink}" stroke-width="5"/>
    <rect x="14" y="13" width="${w - 28}" height="${h - 26}" rx="9" fill="url(#rail)" stroke="#000" stroke-width="2"/>
    <path d="M26 22 H${w - 26}" stroke="#FFFFFF" stroke-opacity=".06" stroke-width="2"/>
  </g>`, { defs });
}
A('hud/progress-track.svg', progressTrack(), { group: 'HUD', size: '900×44', format: 'SVG', tags: ['9-slice', 'progress'], note: 'Slices 34/34/14/14. Fill bar is rendered at runtime for value changes.' });

function progressFill(color) {
  const w = 900, h = 44;
  const defs = [
    linear('fill', [[0, color, .9], [.5, '#FFFFFF', .85], [1, color, 1]], { x1: 0, y1: 0, x2: 0, y2: 1 }),
    glow('g', color, 8),
  ].join('');
  return svgDoc(w, h, `
  <rect x="14" y="13" width="${w - 28}" height="${h - 26}" rx="9" fill="${color}"/>
  <rect x="14" y="13" width="${w - 28}" height="${h - 26}" rx="9" fill="url(#fill)" opacity=".75"/>
  <path d="M24 19 H${w - 24}" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>
  <rect x="14" y="13" width="${w - 28}" height="${h - 26}" rx="9" fill="none" stroke="#FFFFFF" stroke-opacity=".25" stroke-width="2"/>`, { defs });
}
for (const [name, color] of [['green', C.green], ['yellow', C.yellow], ['red', C.red]]) {
  A(`hud/progress-fill-${name}.svg`, progressFill(color), { group: 'HUD', size: '900×44', format: 'SVG', tags: ['progress', name], note: 'Crop from left based on mission progress.' });
}

/* Strike pips */
function strikePip(on) {
  const size = 72;
  const defs = [
    radial('base', on ? [[0, '#513049'], [1, '#170E1E']] : [[0, '#232B3D'], [1, '#0B101A']]),
    radial('hot', on ? [[0, C.yellow], [.55, C.red], [1, C.red, 0]] : [[0, '#59637A'], [1, '#59637A', 0]]),
    shadow('drop', 5, 6, .5),
  ].join('');
  return svgDoc(size, size, `
  <g filter="url(#drop)">
    <path d="M36 4 L64 20 V52 L36 68 L8 52 V20 Z" fill="url(#base)" stroke="${C.ink}" stroke-width="5"/>
    <circle cx="36" cy="38" r="22" fill="url(#hot)" ${on ? 'opacity=".55"' : 'opacity=".25"'}/>
    <path d="M24 30 C18 34 18 42 24 46 C30 50 42 50 48 46 C54 42 54 34 48 30 Z" fill="${on ? '#16101A' : '#3A4358'}" stroke="${C.ink}" stroke-width="4"/>
    <path d="M36 28 C38 22 43 18 48 17" stroke="${on ? C.yellow : '#59637A'}" stroke-width="4" stroke-linecap="round"/>
    <path d="M26 36 l6 6 -6 6 M46 36 l-6 6 6 6" stroke="${on ? C.cream : '#727D95'}" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  </g>`, { defs });
}
A('hud/strike-on.svg', strikePip(true), { group: 'HUD', size: '72×72', format: 'SVG', tags: ['strike', 'alive'], note: 'Available life / strike.' });
A('hud/strike-off.svg', strikePip(false), { group: 'HUD', size: '72×72', format: 'SVG', tags: ['strike', 'lost'], note: 'Consumed life / strike.' });

/* Small decorative tags */
function tagSvg(labelColor = C.blue) {
  const w = 240, h = 54;
  const defs = linear('fill', [[0, labelColor], [1, '#0D1424']], { x1: 0, y1: 0, x2: 1, y2: 0 });
  return svgDoc(w, h, `
  <path d="M8 8 H214 L232 27 L214 46 H8 L20 27 Z" fill="url(#fill)" stroke="${C.ink}" stroke-width="4"/>
  <path d="M20 16 H200" stroke="#FFFFFF" stroke-opacity=".25" stroke-width="2" stroke-linecap="round"/>`, { defs });
}
A('hud/tag-blue.svg', tagSvg(C.blue), { group: 'HUD', size: '240×54', format: 'SVG', tags: ['tag'], note: 'Small status tag.' });
A('hud/tag-red.svg', tagSvg(C.red), { group: 'HUD', size: '240×54', format: 'SVG', tags: ['tag'], note: 'Small status tag.' });

/* Rounded progress / deco arrows */
function cornerBracket(color = C.yellow) {
  const s = 160;
  return svgDoc(s, s, `
  <path d="M14 60 V14 H60" stroke="${C.ink}" stroke-width="16" fill="none"/>
  <path d="M14 60 V14 H60" stroke="${color}" stroke-width="8" fill="none"/>
  <path d="M28 62 V28 H62" stroke="#FFFFFF" stroke-opacity=".2" stroke-width="3" fill="none"/>`);
}
A('frames/corner-yellow.svg', cornerBracket(C.yellow), { group: 'Frame', size: '160×160', format: 'SVG', tags: ['corner', 'decor'], note: 'Rotate/flip for four corners.' });
A('frames/corner-blue.svg', cornerBracket(C.blue), { group: 'Frame', size: '160×160', format: 'SVG', tags: ['corner', 'decor'], note: 'Rotate/flip for four corners.' });

/* ------------------------------------------------------------------ *
 *  ICONS — 96 × 96, pure white line-art, tintable
 * ------------------------------------------------------------------ */
const iconPaths = {
  play: '<path d="M8 5 L19 12 L8 19 Z" fill="#FFF" stroke="none"/>',
  settings: '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2.4" fill="#FFF"/><circle cx="16" cy="12" r="2.4" fill="#FFF"/><circle cx="7" cy="18" r="2.4" fill="#FFF"/>',
  sound: '<path d="M4 9 H8 L13 5 V19 L8 15 H4 Z"/><path d="M16 9c2 1.7 2 4.3 0 6M18.5 6.5c3.5 3.5 3.5 8.5 0 12"/>',
  mute: '<path d="M4 9 H8 L13 5 V19 L8 15 H4 Z"/><path d="M16 9l5 6M21 9l-5 6"/>',
  music: '<path d="M9 18V6l10-2v11"/><ellipse cx="6.5" cy="18" rx="3" ry="2.4" fill="#FFF"/><ellipse cx="16.5" cy="15" rx="3" ry="2.4" fill="#FFF"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 10.5V17"/><circle cx="12" cy="7.4" r="1.2" fill="#FFF" stroke="none"/>',
  back: '<path d="M20 12H5M11 6l-6 6 6 6"/>',
  home: '<path d="M3 11 L12 3 L21 11"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-6h4v6"/>',
  replay: '<path d="M20 8v5h-5"/><path d="M19 13a7.5 7.5 0 1 0-2 5.2"/>',
  help: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v5M12 16v5M3 12h5M16 12h5"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4"/><path d="M12 13v4M8 21h8M9 21c0-2 1.3-4 3-4s3 2 3 4"/>',
  crown: '<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/><path d="M6 21h12"/>',
  leaderboard: '<path d="M4 20V12h4v8M10 20V5h4v15M16 20v-5h4v5"/><path d="M3 20h18"/>',
  team: '<circle cx="8" cy="8" r="3.2"/><circle cx="16" cy="8" r="3.2"/><path d="M2 20c0-4 2.6-6.4 6-6.4S14 16 14 20M10 20c0-4 2.6-6.4 6-6.4s6 2.4 6 6.4"/>',
  timer: '<circle cx="12" cy="13" r="7.5"/><path d="M12 9v4l2.5 2M9 2h6M12 2v3"/>',
  bomb: '<circle cx="11" cy="14" r="6.5"/><path d="M15 8l3-3M18 5c1-2 3-1 3.5.5M9 14l1.5 1.5M13 14l1.5 1.5M11 12v4"/>',
  wire: '<path d="M4 6c4 0 4 4 8 4s4-4 8-4M4 18c4 0 4-4 8-4s4 4 8 4"/><rect x="2" y="3" width="4" height="6" rx="1"/><rect x="18" y="15" width="4" height="6" rx="1"/>',
  'hand-tap': '<path d="M10 12V5.6a1.7 1.7 0 0 1 3.4 0V11M13.4 10.5V9a1.6 1.6 0 0 1 3.2 0v2M16.6 11V9.7a1.5 1.5 0 0 1 3 0V15c0 3.7-2.4 6.3-6 6.3h-1c-1.7 0-3.2-.8-4.2-2.1l-3-3.8c-.7-1 .4-2.4 1.4-1.7l1.8 1.3V10a1.6 1.6 0 0 1 3.2 0v1.2"/><path d="M12 2.2c-4 0-7 3-7 7"/>',
  'hand-hold': '<path d="M10 12V5.6a1.7 1.7 0 0 1 3.4 0V11M13.4 10.5V9a1.6 1.6 0 0 1 3.2 0v2M16.6 11V9.7a1.5 1.5 0 0 1 3 0V15c0 3.7-2.4 6.3-6 6.3h-1c-1.7 0-3.2-.8-4.2-2.1l-3-3.8c-.7-1 .4-2.4 1.4-1.7l1.8 1.3V10a1.6 1.6 0 0 1 3.2 0v1.2"/><circle cx="12" cy="5" r="2.4" stroke-dasharray="2 2"/>',
  'hand-drag': '<path d="M10 12V5.6a1.7 1.7 0 0 1 3.4 0V11M13.4 10.5V9a1.6 1.6 0 0 1 3.2 0v2M16.6 11V9.7a1.5 1.5 0 0 1 3 0V15c0 3.7-2.4 6.3-6 6.3h-1c-1.7 0-3.2-.8-4.2-2.1l-3-3.8c-.7-1 .4-2.4 1.4-1.7l1.8 1.3V10a1.6 1.6 0 0 1 3.2 0v1.2"/><path d="M3 5h7M7 2l3 3-3 3"/>',
  'hand-swipe': '<path d="M10 12V5.6a1.7 1.7 0 0 1 3.4 0V11M13.4 10.5V9a1.6 1.6 0 0 1 3.2 0v2M16.6 11V9.7a1.5 1.5 0 0 1 3 0V15c0 3.7-2.4 6.3-6 6.3h-1c-1.7 0-3.2-.8-4.2-2.1l-3-3.8c-.7-1 .4-2.4 1.4-1.7l1.8 1.3V10a1.6 1.6 0 0 1 3.2 0v1.2"/><path d="M2 7c3-3 6-3 8 0M3 11c2-1.7 4-1.7 6 0"/>',
  'hand-multi': '<circle cx="7" cy="8" r="4"/><circle cx="17" cy="8" r="4"/><circle cx="7" cy="18" r="4"/><circle cx="17" cy="18" r="4"/><circle cx="7" cy="8" r="1.2" fill="#FFF"/><circle cx="17" cy="8" r="1.2" fill="#FFF"/><circle cx="7" cy="18" r="1.2" fill="#FFF"/><circle cx="17" cy="18" r="1.2" fill="#FFF"/>',
  snowflake: '<path d="M12 2v20M3.3 7l17.4 10M20.7 7L3.3 17"/><path d="M9 4l3 2 3-2M9 20l3-2 3 2M4.5 9.5l.4 3.5-3 1.5M19.5 9.5l-.4 3.5 3 1.5M4.5 14.5l-2.6 2.4M19.5 14.5l2.6 2.4"/>',
  smoke: '<path d="M4 17c-2 0-3-1.6-2.4-3.3C2.2 12 3.7 11.4 5 12c.2-2.6 2.4-4.6 5-4.6 1.7 0 3.2.8 4.1 2.1.4-.2.9-.2 1.4-.2 2.4 0 4.3 1.9 4.3 4.3 0 1.5-.7 2.8-1.8 3.6H4z"/><path d="M7 20h11"/>',
  glitch: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M6 9h8M8 13h11M5 17h6M15 9h3M18 13h1"/>',
  alert: '<path d="M12 3L22 20H2z"/><path d="M12 9v5"/><circle cx="12" cy="17.4" r="1" fill="#FFF" stroke="none"/>',
  check: '<path d="M4 12.5l5 5L20 6"/>',
  cross: '<path d="M5 5l14 14M19 5L5 19"/>',
  star: '<path d="M12 2l2.9 6.2 6.8.9-5 4.7 1.3 6.7L12 17.3 6 20.5l1.3-6.7-5-4.7 6.8-.9z" fill="#FFF" stroke="none"/>',
  bolt: '<path d="M13 2L5 14h6l-1 8 9-13h-6z" fill="#FFF" stroke="none"/>',
  spark: '<path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" fill="#FFF"/>',
  shield: '<path d="M12 2l8 3v6c0 5-3.4 8.6-8 11-4.6-2.4-8-6-8-11V5z"/><path d="M8.5 12l2.5 2.5 5-5"/>',
  key: '<circle cx="8" cy="9" r="4"/><path d="M11 12l8 8M16 17l2-2M14 15l2-2"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15" r="1.4" fill="#FFF"/>',
  eye: '<path d="M2 12c2.5-4.5 5.8-6.5 10-6.5S19.5 7.5 22 12c-2.5 4.5-5.8 6.5-10 6.5S4.5 16.5 2 12z"/><circle cx="12" cy="12" r="3.2"/>',
  'arrow-right': '<path d="M4 12h15M13 6l6 6-6 6"/>',
  'arrow-up': '<path d="M12 21V6M6 12l6-6 6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1" fill="#FFF"/><rect x="14" y="4" width="4" height="16" rx="1" fill="#FFF"/>',
  mic: '<rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"/>',
  reset: '<path d="M4 4v6h6"/><path d="M4.7 10A8 8 0 1 1 4 14"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  heart: '<path d="M12 21S3 15.4 3 9.4A5.3 5.3 0 0 1 12 5a5.3 5.3 0 0 1 9 4.4C21 15.4 12 21 12 21z"/>',
  flag: '<path d="M5 22V3"/><path d="M5 4c4-2 7 2 11 0v8c-4 2-7-2-11 0"/>',
  clockw: '<path d="M12 7v5l3 2"/><circle cx="12" cy="12" r="9"/>',
  stopwatch: '<circle cx="12" cy="13" r="7"/><path d="M12 9v4l2 2M10 2h4M12 2v4"/><path d="M18 6l2-2"/>',
  megaphone: '<path d="M4 10v4l11 5V5z"/><path d="M15 8h3a4 4 0 0 1 0 8h-3M7 14l1 6h4l-1-5"/>',
  map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
  csv: '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6M9 8h2"/>',
  wifi: '<path d="M2 8c6-5 14-5 20 0M5 12c4-3.4 10-3.4 14 0M8.5 16c2-1.7 5-1.7 7 0"/><circle cx="12" cy="20" r="1.4" fill="#FFF" stroke="none"/>',
};
for (const [name, inner] of Object.entries(iconPaths)) {
  const body = `<g transform="scale(4)" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none">${inner}</g>`;
  uiAssets.push({
    path: `icons/icon-${name}.svg`,
    svg: svgDoc(96, 96, body),
    group: 'Icon', size: '96×96', format: 'SVG', tags: ['icon', name, 'tintable'],
    note: 'White line icon — tint at runtime.',
  });
}

/* Symbol tokens for Crowd Cipher (white, tintable) */
const symbolShapes = {
  triangle: '<path d="M12 4 L22 20 H2 Z" fill="#FFF"/>',
  diamond: '<path d="M12 2 L22 12 L12 22 L2 12 Z" fill="#FFF"/>',
  circle: '<circle cx="12" cy="12" r="9" fill="#FFF"/>',
  square: '<rect x="4" y="4" width="16" height="16" rx="2" fill="#FFF"/>',
  star: `<path d="${starPath(12, 12, 9.5, 4.2)}" fill="#FFF"/>`,
  plus: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" fill="#FFF"/>',
  wave: '<path d="M2 14c3-8 6-8 9 0s6 8 9 0" stroke="#FFF" stroke-width="3.5" fill="none" stroke-linecap="round"/>',
  hex: '<path d="M7 3h10l5 9-5 9H7l-5-9z" fill="#FFF"/>',
};
for (const [name, inner] of Object.entries(symbolShapes)) {
  uiAssets.push({
    path: `puzzles/symbol-${name}.svg`,
    svg: svgDoc(96, 96, `<g transform="scale(4)">${inner}</g>`),
    group: 'Puzzle Object', size: '96×96', format: 'SVG', tags: ['symbol', name, 'tintable'],
    note: 'Crowd Cipher symbol — tint per slot.',
  });
}

/* Gesture cards — 240 × 180 */
function gestureSvg(kind) {
  const w = 240, h = 180;
  const icon = iconPaths[`hand-${kind}`] || iconPaths['hand-tap'];
  const arrow = {
    tap: '<path d="M176 58c12 12 12 30 0 42" stroke="#FFC928" stroke-width="4" stroke-linecap="round" opacity=".7"/><path d="M168 54l8 4-2 8" stroke="#FFC928" stroke-width="4" stroke-linecap="round" opacity=".7"/>',
    hold: '<circle cx="172" cy="84" r="22" stroke="#FFC928" stroke-width="3" stroke-dasharray="4 8" opacity=".55"/><circle cx="172" cy="84" r="12" stroke="#FFC928" stroke-width="3" opacity=".4"/>',
    drag: '<path d="M118 158 H208" stroke="#FFC928" stroke-width="4" stroke-linecap="round"/><path d="M200 150l10 8-10 8" stroke="#FFC928" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
    swipe: '<path d="M120 152c28 10 60 2 84-18" stroke="#FFC928" stroke-width="4" stroke-linecap="round" opacity=".8"/><path d="M196 126l10 4-4 10" stroke="#FFC928" stroke-width="4" stroke-linecap="round" opacity=".8"/>',
  }[kind] || '';
  return svgDoc(w, h, `
  <rect x="4" y="4" width="232" height="172" rx="22" fill="#111828" stroke="#2B3651" stroke-width="4"/>
  <g transform="translate(46 25) scale(4.2)" stroke="#F6EAD6" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none">${icon}</g>
  ${arrow}
  <path d="M20 148 H220" stroke="#FFFFFF" stroke-opacity=".08" stroke-width="2"/>`, {
    defs: `<linearGradient id="gtint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26314A"/><stop offset="1" stop-color="#0D1321"/></linearGradient>`,
  });
}
for (const kind of ['tap', 'hold', 'drag', 'swipe', 'multi']) {
  A(`gestures/gesture-${kind}.svg`, gestureSvg(kind), {
    group: 'Gesture', size: '240×180', format: 'SVG', tags: ['gesture', kind],
    note: 'Onboarding / help overlay illustration.',
  });
}

/* Touch cursor rings — 160 × 160 */
for (const [name, color] of [['red', C.red], ['yellow', C.yellow], ['blue', C.blue], ['purple', C.purple], ['green', C.green]]) {
  A(`hud/touch-ring-${name}.svg`, svgDoc(160, 160, `
  <circle cx="80" cy="80" r="36" fill="none" stroke="${color}" stroke-width="6" opacity=".9"/>
  <circle cx="80" cy="80" r="48" fill="none" stroke="${color}" stroke-width="2" opacity=".4" stroke-dasharray="4 8"/>
  <circle cx="80" cy="80" r="10" fill="${color}" opacity=".35"/>
  <path d="M80 16 V34 M80 126 V144 M16 80 H34 M126 80 H144" stroke="${color}" stroke-width="4" stroke-linecap="round" opacity=".75"/>`), {
    group: 'HUD', size: '160×160', format: 'SVG', tags: ['touch', name], note: 'Per-player touch cursor / ripple.',
  });
}

/* Hazard strip tile */
A('hud/hazard-strip.svg', svgDoc(256, 40, `<rect width="256" height="40" fill="url(#haz)"/><rect x="0" y="0" width="256" height="4" fill="#FFF" opacity=".12"/>`, {
  defs: hazardDefs('haz', 40, C.yellow, C.ink),
}), { group: 'HUD', size: '256×40', format: 'SVG', tags: ['tile', 'hazard'], note: 'Repeat horizontally.' });
