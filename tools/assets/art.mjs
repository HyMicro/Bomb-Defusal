import {
  C, S, svgDoc, linear, radial, glow, shadow, blur, frame, rounded, starPath,
  burstPath, hazardDefs, gridDefs, dotsDefs, screw, metalPipe, poly,
} from './lib.mjs';

export const artAssets = [];
const A = (relPath, svg, meta = {}) => artAssets.push({ path: relPath, svg, ...meta });

/* ================================================================== *
 *  BACKGROUNDS
 * ================================================================== */
function background(kind = 'menu') {
  const W = 1920, H = 1080;
  const game = kind === 'game';
  const defs = [
    linear('bg', game
      ? [[0, '#0C1020'], [.45, '#12182A'], [.72, '#0B0F1C'], [1, '#070A12']]
      : [[0, '#221A3A'], [.32, '#17172C'], [.68, '#0D1120'], [1, '#080B15']], { x1: .1, y1: 0, x2: .9, y2: 1 }),
    radial('purpleGlow', [[0, '#B55DDC', .28], [.55, '#6F2C99', .1], [1, '#6F2C99', 0]], { cx: .3, cy: .22, r: .58 }),
    radial('blueGlow', [[0, '#2B8BFF', .25], [.55, '#1453B8', .08], [1, '#1453B8', 0]], { cx: .78, cy: .3, r: .5 }),
    radial('redGlow', [[0, '#FF414D', .2], [1, '#FF414D', 0]], { cx: .55, cy: .02, r: .45 }),
    radial('floor', [[0, '#B55DDC', .18], [.4, '#3A2A5F', .12], [1, '#0A0E19', 0]], { cx: .5, cy: .55, r: .65 }),
    linear('metal', [[0, '#6A7794'], [.25, '#3E4A65'], [.6, '#252E44'], [1, '#151C2D']], { x1: 0, y1: 0, x2: 1, y2: 1 }),
    linear('metal2', [[0, '#4B5771'], [.35, '#2B344B'], [1, '#171E30']], { x1: 0, y1: 0, x2: 0, y2: 1 }),
    linear('pipe', [[0, '#8A96AF'], [.18, '#4C5870'], [.55, '#2A3348'], [.8, '#4C5870'], [1, '#1A2133']], { x1: 0, y1: 0, x2: 1, y2: 0 }),
    radial('lamp', [[0, '#FFE9A8', .85], [.3, '#FFC928', .3], [1, '#FFC928', 0]]),
    linear('panel', [[0, '#252F47'], [1, '#111827']], { x1: 0, y1: 0, x2: 1, y2: 1 }),
    radial('vignette', [[0, '#000000', 0], [.7, '#05070D', .18], [1, '#03050A', .8]]),
    linear('hazardFade', [[0, '#000', .75], [1, '#000', 0]], { x1: 0, y1: 0, x2: 0, y2: 1 }),
    gridDefs('grid', 90, '#7E8DB5', game ? .06 : .075),
    dotsDefs('dots', 24, '#C8B9E8', .13),
    hazardDefs('haz', 34, C.yellow, C.ink),
    blur('soft', 34),
    shadow('drop', 18, 20, .5),
    glow('neonP', C.purple, 18),
    glow('neonB', C.blue, 16),
  ].join('');

  const pipes = `
  <g opacity="${game ? .55 : .7}">
    <!-- LEFT PIPE STACK -->
    <path d="M100 0 V300 Q100 372 172 372 H280" stroke="${C.ink}" stroke-width="74" fill="none"/>
    <path d="M100 0 V300 Q100 372 172 372 H280" stroke="url(#pipe)" stroke-width="54" fill="none"/>
    <path d="M88 90 H112" stroke="#9AA6C1" stroke-width="4" opacity=".35"/>
    <g transform="translate(120 372)"><rect x="-46" y="-14" width="92" height="28" rx="8" fill="url(#metal2)" stroke="${C.ink}" stroke-width="5"/><circle cx="0" cy="0" r="18" fill="${C.ink}" stroke="#7C89A6" stroke-width="4"/><path d="M0-11V11M-11 0H11" stroke="${C.yellow}" stroke-width="4" stroke-linecap="round"/></g>
    <circle cx="88" cy="210" r="38" fill="url(#metal)" stroke="${C.ink}" stroke-width="6"/>
    <circle cx="88" cy="210" r="25" fill="#101624" stroke="#04060B" stroke-width="4"/>
    <path d="M74 214 A16 16 0 0 1 96 196" stroke="${C.green}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M88 208 V198" stroke="${C.red}" stroke-width="3" stroke-linecap="round"/>
    <!-- RIGHT PIPE STACK -->
    <path d="M1820 0 V250 Q1820 320 1748 320 H1600" stroke="${C.ink}" stroke-width="80" fill="none"/>
    <path d="M1820 0 V250 Q1820 320 1748 320 H1600" stroke="url(#pipe)" stroke-width="58" fill="none"/>
    <circle cx="1836" cy="440" r="45" fill="url(#metal)" stroke="${C.ink}" stroke-width="7"/>
    <circle cx="1836" cy="440" r="28" fill="#101624" stroke="#04060B" stroke-width="4"/>
    <path d="M1818 445 A20 20 0 0 1 1848 422" stroke="${C.blue}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M1770 440 H1820" stroke="${C.ink}" stroke-width="30"/>
    <path d="M1770 440 H1820" stroke="url(#pipe)" stroke-width="20"/>
    <g transform="translate(1560 320)"><rect x="-54" y="-16" width="108" height="32" rx="8" fill="url(#metal2)" stroke="${C.ink}" stroke-width="5"/><circle cx="0" cy="0" r="21" fill="${C.ink}" stroke="#7C89A6" stroke-width="4"/><path d="M0-13V13M-13 0H13" stroke="${C.yellow}" stroke-width="4" stroke-linecap="round"/></g>
    <path d="M60 780 C60 690 120 660 200 660 H300" stroke="${C.ink}" stroke-width="64" fill="none"/>
    <path d="M60 780 C60 690 120 660 200 660 H300" stroke="url(#pipe)" stroke-width="46" fill="none"/>
    <path d="M1860 800 C1860 700 1800 664 1710 664 H1600" stroke="${C.ink}" stroke-width="60" fill="none"/>
    <path d="M1860 800 C1860 700 1800 664 1710 664 H1600" stroke="url(#pipe)" stroke-width="42" fill="none"/>
  </g>`;

  const machinery = `
  <g opacity="${game ? .5 : .78}">
    <g transform="translate(20 640)" filter="url(#drop)">
      <path d="M0 80 L46 42 H280 L322 80 V410 H0 Z" fill="url(#panel)" stroke="${C.ink}" stroke-width="8"/>
      <rect x="26" y="112" width="270" height="130" rx="16" fill="#0A101C" stroke="#04060B" stroke-width="5"/>
      <path d="M42 200 L92 150 L132 174 L182 122 L232 160 L278 138" stroke="${C.blue}" stroke-width="4" fill="none" opacity=".7"/>
      <path d="M42 232 H278" stroke="#7E8BB0" stroke-width="2" opacity=".2"/>
      <g fill="${C.yellow}" opacity=".8"><circle cx="54" cy="292" r="9"/><circle cx="90" cy="292" r="9"/><circle cx="126" cy="292" r="9"/></g>
      <rect x="168" y="272" width="112" height="40" rx="8" fill="#0A101C" stroke="#05080F" stroke-width="4"/>
      <path d="M184 292 H226" stroke="${C.green}" stroke-width="5" stroke-linecap="round" opacity=".7"/>
      ${screw(30, 120)}${screw(290, 120)}${screw(30, 386)}${screw(290, 386)}
    </g>
    <g transform="translate(1570 690)" filter="url(#drop)">
      <path d="M0 40 H270 L320 84 V380 H0 Z" fill="url(#panel)" stroke="${C.ink}" stroke-width="8"/>
      <rect x="26" y="92" width="248" height="168" rx="16" fill="#0A101C" stroke="#04060B" stroke-width="5"/>
      <circle cx="150" cy="176" r="54" fill="none" stroke="#4A5877" stroke-width="10"/>
      <circle cx="150" cy="176" r="38" fill="none" stroke="${C.red}" stroke-width="6" stroke-dasharray="40 200"/>
      <path d="M150 176 L176 150" stroke="${C.yellow}" stroke-width="5" stroke-linecap="round"/>
      <g opacity=".5" fill="${C.steelLight}"><circle cx="54" cy="310" r="10"/><circle cx="88" cy="310" r="10"/><circle cx="122" cy="310" r="10"/></g>
      ${screw(30, 100)}${screw(290, 100)}${screw(30, 360)}${screw(290, 360)}
    </g>
    <g transform="translate(280 860) rotate(-6)" filter="url(#drop)">
      <path d="M0 40 L54 0 H226 L276 40 V150 H0 Z" fill="#202940" stroke="${C.ink}" stroke-width="7"/>
      <path d="M50 36 H228" stroke="#6B7794" stroke-width="3" opacity=".35"/>
      <rect x="78" y="58" width="112" height="44" rx="8" fill="url(#haz)" opacity=".85"/>
      <path d="M104 122 H196" stroke="${C.cream}" stroke-opacity=".2" stroke-width="4"/>
      <circle cx="36" cy="108" r="11" fill="${C.ink}" stroke="#697694" stroke-width="3"/>
      <circle cx="240" cy="108" r="11" fill="${C.ink}" stroke="#697694" stroke-width="3"/>
    </g>
    <g transform="translate(1450 855) rotate(4)" filter="url(#drop)">
      <path d="M0 44 L48 0 H216 L264 44 V144 H0 Z" fill="#1B2439" stroke="${C.ink}" stroke-width="7"/>
      <path d="M34 104 H228" stroke="#6B7794" stroke-width="3" opacity=".25"/>
      <rect x="95" y="58" width="70" height="36" rx="6" fill="#0A101C" stroke="#05080F" stroke-width="4"/>
      <path d="M109 76 H148" stroke="${C.purple}" stroke-width="4" opacity=".65"/>
    </g>
    <!-- vents -->
    <g transform="translate(1740 120)" opacity=".7">
      <circle cx="0" cy="0" r="66" fill="url(#metal2)" stroke="${C.ink}" stroke-width="7"/>
      <g stroke="#0A0F1B" stroke-width="8" stroke-linecap="round"><path d="M-38-20H38M-46 0H46M-38 20H38"/></g>
      <circle cx="0" cy="0" r="50" fill="none" stroke="#667390" stroke-width="3" opacity=".3"/>
    </g>
    <g transform="translate(620 90)" opacity=".45">
      <circle cx="0" cy="0" r="46" fill="url(#metal2)" stroke="${C.ink}" stroke-width="6"/>
      <g stroke="#0A0F1B" stroke-width="6" stroke-linecap="round"><path d="M-26-14H26M-32 2H32M-26 18H26"/></g>
    </g>
  </g>`;

  const lamps = `
  <g opacity="${game ? .35 : .6}">
    <g transform="translate(330 0)">
      <path d="M0 0 V84" stroke="${C.ink}" stroke-width="6"/>
      <path d="M-54 140 L0 84 L54 140 Z" fill="url(#metal2)" stroke="${C.ink}" stroke-width="6"/>
      <circle cx="0" cy="150" r="12" fill="${C.yellow}" filter="url(#neonP)"/>
      <ellipse cx="0" cy="240" rx="150" ry="170" fill="url(#lamp)" opacity=".3" filter="url(#soft)"/>
    </g>
    <g transform="translate(1600 0)">
      <path d="M0 0 V58" stroke="${C.ink}" stroke-width="6"/>
      <path d="M-44 108 L0 58 L44 108 Z" fill="url(#metal2)" stroke="${C.ink}" stroke-width="6"/>
      <circle cx="0" cy="118" r="10" fill="${C.yellow}" filter="url(#neonP)"/>
      <ellipse cx="0" cy="220" rx="130" ry="160" fill="url(#lamp)" opacity=".22" filter="url(#soft)"/>
    </g>
    <path d="M0 22 Q320 180 560 36 T1110 84 T1660 30 T1920 90" stroke="#0A0E18" stroke-width="8" fill="none" opacity=".7"/>
    <path d="M0 16 Q320 174 560 30 T1110 78 T1660 24 T1920 84" stroke="#3A4560" stroke-width="2" fill="none" opacity=".5"/>
  </g>`;

  const floor = `
  <g opacity="${game ? .22 : .35}">
    <path d="M960 610 L-280 1080 M960 610 L-80 1080 M960 610 L240 1080 M960 610 L560 1080 M960 610 L960 1080 M960 610 L1360 1080 M960 610 L1680 1080 M960 610 L2000 1080 M960 610 L2200 1080" stroke="#8B6CD9" stroke-width="2"/>
    <path d="M0 760 H1920 M0 840 H1920 M0 940 H1920 M0 1040 H1920" stroke="#8B6CD9" stroke-width="2"/>
  </g>`;

  const decor = `
  <!-- diagonal neon beams -->
  <g opacity="${game ? .2 : .32}">
    <path d="M-100 500 L400 0 H500 L-40 560 Z" fill="${C.purple}" opacity=".12"/>
    <path d="M1920 400 L1500 820 V880 L1920 460 Z" fill="${C.blue}" opacity=".1"/>
  </g>
  ${game ? `
  <g opacity=".18"><path d="M700 220 L1220 220 L1380 940 L540 940 Z" fill="${C.blue}" opacity=".08"/>
  <path d="M700 220 L1220 220 L1380 940 L540 940 Z" fill="none" stroke="${C.blue}" stroke-width="2" stroke-dasharray="10 18"/></g>` : `
  <g transform="translate(1180 510)" opacity=".12" filter="url(#soft)"><circle cx="0" cy="0" r="250" fill="${C.purple}"/></g>`}
  <!-- floating dust -->
  <g fill="${C.cream}" opacity=".28">
    <circle cx="240" cy="300" r="2"/><circle cx="410" cy="520" r="1.5"/><circle cx="700" cy="260" r="2.5"/><circle cx="1120" cy="460" r="1.5"/>
    <circle cx="1380" cy="220" r="2"/><circle cx="1660" cy="570" r="1.5"/><circle cx="870" cy="720" r="2"/><circle cx="1500" cy="880" r="2.5"/>
    <circle cx="330" cy="920" r="1.5"/><circle cx="1050" cy="940" r="2"/>
  </g>
  <g opacity=".5">
    <path d="M768 170 l8 24 24 8 -24 8 -8 24 -8-24 -24-8 24-8z" fill="${C.yellow}" opacity=".55"/>
    <path d="M1460 640 l5 15 15 5 -15 5 -5 15 -5-15 -15-5 15-5z" fill="${C.blue}" opacity=".5"/>
  </g>`;

  return svgDoc(W, H, `
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#purpleGlow)"/>
  <rect width="${W}" height="${H}" fill="url(#blueGlow)"/>
  <rect width="${W}" height="${H}" fill="url(#redGlow)" opacity="${game ? .8 : .45}"/>
  <rect width="${W}" height="${H}" fill="url(#floor)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)" opacity=".55"/>
  ${floor}
  ${pipes}
  ${machinery}
  ${lamps}
  ${decor}
  <!-- top + bottom structural rails -->
  <rect x="0" y="0" width="${W}" height="26" fill="url(#haz)"/>
  <rect x="0" y="26" width="${W}" height="12" fill="#0A0E18"/>
  <rect x="0" y="1048" width="${W}" height="32" fill="url(#haz)"/>
  <rect x="0" y="1034" width="${W}" height="14" fill="#0A0E18"/>
  <rect x="0" y="0" width="${W}" height="180" fill="url(#hazardFade)" opacity=".55"/>
  <!-- corner signal lights -->
  <g filter="url(#neonP)"><circle cx="42" cy="58" r="7" fill="${C.purple}"/><circle cx="1878" cy="58" r="7" fill="${C.blue}"/></g>
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
  `, { defs });
}
/**
 * Comic-panel background: ink page, one halftone burst, bold panel gutters,
 * a jagged "pow" frame behind the title area. Flat fills only — no busy props.
 */
function comicBackground(kind = 'menu') {
  const W = 1920, H = 1080;
  const game = kind === 'game';

  const defs = [
    linear('base', [[0, '#0E1930'], [.55, '#0C1728'], [1, '#080F1E']], { x1: 0, y1: 0, x2: .8, y2: 1 }),
    radial('warm', [[0, '#FFC93C', game ? .07 : .13], [.5, '#FFC93C', .03], [1, '#FFC93C', 0]], { cx: .25, cy: .32, r: .58 }),
    radial('cool', [[0, '#4C9BFF', game ? .055 : .085], [1, '#4C9BFF', 0]], { cx: .82, cy: .48, r: .55 }),
    radial('vignette', [[0, '#02040A', 0], [.6, '#02040A', .22], [1, '#02040A', .8]]),
    dotsDefs('halftoneY', 24, '#FFC93C', .2),
    dotsDefs('halftoneC', 18, '#FFF4DF', .09),
    dotsDefs('halftoneB', 30, '#4C9BFF', .13),
    `<radialGradient id="fadeTL" cx=".24" cy=".28" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".55" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
     <mask id="dotsTL"><rect width="${W}" height="${H}" fill="url(#fadeTL)"/></mask>
     <radialGradient id="fadeR" cx=".86" cy=".45" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".65"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
     <mask id="dotsR"><rect width="${W}" height="${H}" fill="url(#fadeR)"/></mask>
     <radialGradient id="fadeB" cx=".5" cy="1" r=".55"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
     <mask id="dotsB"><rect width="${W}" height="${H}" fill="url(#fadeB)"/></mask>
     <radialGradient id="fadeC" cx=".5" cy=".55" r=".42"><stop offset="0" stop-color="#fff" stop-opacity=".4"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
     <mask id="dotsC"><rect width="${W}" height="${H}" fill="url(#fadeC)"/></mask>`,
  ].join('');

  // Hand-drawn-ish rays from the title burst. Deterministic, so exports are stable.
  let rays = '';
  for (let i = 0; i < 34; i++) {
    const a = (i / 34) * Math.PI * 2 + .11;
    const len = 620 + (i % 5) * 55;
    const wide = .007 + (i % 3) * .003;
    const x1 = 470 + Math.cos(a - wide) * 210;
    const y1 = 400 + Math.sin(a - wide) * 210;
    const x2 = 470 + Math.cos(a + wide) * 210;
    const y2 = 400 + Math.sin(a + wide) * 210;
    const x3 = 470 + Math.cos(a) * len;
    const y3 = 400 + Math.sin(a) * len;
    rays += `<path d="M${S(x1)} ${S(y1)} L${S(x3)} ${S(y3)} L${S(x2)} ${S(y2)} Z" fill="#FFF4DF" opacity="${(i % 4 === 0 ? .05 : .028).toFixed(3)}"/>`;
  }

  const corner = (x, y, sx, sy, color = '#FFC93C') => `
    <path d="M${x} ${y + sy * 34} V${y} H${x + sx * 34}" stroke="${color}" stroke-width="4" stroke-opacity=".55" fill="none"/>
    <path d="M${x + sx * 8} ${y + sy * 50} V${y + sy * 8} H${x + sx * 50}" stroke="#05080F" stroke-width="9" fill="none"/>`;

  return svgDoc(W, H, `
  <rect width="${W}" height="${H}" fill="url(#base)"/>
  <rect width="${W}" height="${H}" fill="url(#warm)"/>
  <rect width="${W}" height="${H}" fill="url(#cool)"/>

  ${game ? `
    <rect x="0" y="0" width="${W}" height="190" fill="#070D18" opacity=".55"/>
    <rect x="0" y="900" width="${W}" height="180" fill="#070D18" opacity=".55"/>
    <rect width="${W}" height="${H}" fill="url(#halftoneC)" opacity=".8" mask="url(#dotsB)"/>
    <rect width="${W}" height="${H}" fill="url(#halftoneY)" opacity=".55" mask="url(#dotsC)"/>
    <g opacity=".55">
      <path d="M-60 300 L250 80" stroke="#FFF4DF" stroke-width="2" stroke-opacity=".06"/>
      <path d="M-60 380 L330 80" stroke="#FFF4DF" stroke-width="2" stroke-opacity=".05"/>
      <path d="M1650 1000 L2010 760" stroke="#FFF4DF" stroke-width="2" stroke-opacity=".06"/>
      <path d="M1740 1000 L2010 840" stroke="#FFF4DF" stroke-width="2" stroke-opacity=".05"/>
      <path d="M120 940 C420 760 660 900 930 760" stroke="#FFC93C" stroke-width="10" stroke-linecap="round" stroke-opacity=".035" fill="none"/>
      <path d="M990 320 C1230 180 1480 340 1810 190" stroke="#4C9BFF" stroke-width="10" stroke-linecap="round" stroke-opacity=".04" fill="none"/>
    </g>
  ` : `
    <path d="M1310 0 H1920 V1080 H1160 Z" fill="#0D1A2C" opacity=".92"/>
    <path d="M1310 0 V1080" stroke="#05080F" stroke-width="14"/>
    <path d="M1322 0 V1080" stroke="#FFF4DF" stroke-width="2" stroke-opacity=".10"/>
    <path d="M0 884 L620 1080 H0 Z" fill="#0C1828" opacity=".9"/>
    <path d="M0 884 L620 1080" stroke="#05080F" stroke-width="12"/>

    <g>${rays}</g>
    <path d="${burstPath(470, 400, 360, 300, 28, .8)}" fill="#12233C" opacity=".7" stroke="#05080F" stroke-width="10"/>
    <path d="${burstPath(470, 400, 345, 292, 28, .8)}" fill="none" stroke="#FFC93C" stroke-width="3" stroke-opacity=".5"/>

    <rect width="${W}" height="${H}" fill="url(#halftoneY)" opacity=".9" mask="url(#dotsTL)"/>
    <rect width="${W}" height="${H}" fill="url(#halftoneB)" opacity=".8" mask="url(#dotsR)"/>
    <rect width="${W}" height="${H}" fill="url(#halftoneC)" opacity=".5" mask="url(#dotsB)"/>

    <g opacity=".55">
      <path d="M90 1000 L370 760" stroke="#FFF4DF" stroke-width="8" stroke-linecap="round" stroke-opacity=".10"/>
      <path d="M150 1012 L430 772" stroke="#FFF4DF" stroke-width="4" stroke-linecap="round" stroke-opacity=".08"/>
      <path d="M1570 140 L1860 140" stroke="#FFC93C" stroke-width="3" stroke-opacity=".25"/>
      <path d="M1600 162 L1820 162" stroke="#FFC93C" stroke-width="2" stroke-opacity=".18"/>
    </g>
  `}

  <rect width="${W}" height="${H}" fill="url(#vignette)"/>

  <!-- comic page frame: thick ink gutter + chalk corner marks -->
  <rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="#05080F" stroke-width="26"/>
  <rect x="17" y="17" width="${W - 34}" height="${H - 34}" fill="none" stroke="#FFF4DF" stroke-width="2" stroke-opacity=".12"/>
  ${corner(36, 36, 1, 1)}
  ${corner(W - 36, 36, -1, 1)}
  ${corner(36, H - 36, 1, -1)}
  ${corner(W - 36, H - 36, -1, -1)}
  <rect x="0" y="0" width="${W}" height="4" fill="#FFC93C" opacity=".65"/>`, { defs });
}

A('backgrounds/bg-menu.svg', comicBackground('menu'), {
  group: 'Background', size: '1920×1080', format: 'SVG (+PNG @1x/@2x)', tags: ['background', 'menu', 'comic'],
  note: 'Comic-panel ink page: halftone burst, jagged pow frame, slanted side panel. Flat and calm.',
});
A('backgrounds/bg-game.svg', comicBackground('game'), {
  group: 'Background', size: '1920×1080', format: 'SVG (+PNG @1x/@2x)', tags: ['background', 'game', 'comic'],
  note: 'Quiet comic ink page for gameplay: edge halftones, dark centre, thin chalk frame.',
});

/* Subtle scanline / halftone overlay */
A('backgrounds/overlay-halftone.svg', svgDoc(1920, 1080, `
<rect width="1920" height="1080" fill="url(#dots)"/>
<rect width="1920" height="1080" fill="url(#scan)" opacity=".5"/>`, {
  defs: `${dotsDefs('dots', 18, '#FFFFFF', .08)}<pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect y="0" width="4" height="1" fill="#000" opacity=".18"/></pattern>`,
}), { group: 'Background', size: '1920×1080', format: 'SVG', tags: ['overlay', 'pattern'], note: 'Optional blend-mode overlay.' });

/* ================================================================== *
 *  CHARACTERS — 600 × 760 transparent busts
 * ================================================================== */
const OUT = C.ink;
const stroke = (w = 10) => `stroke="${OUT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

function eyes({ cx1 = 238, cx2 = 362, cy = 326, iris = '#243154', look = [0, 0], lashes = false, lid = 0 } = {}) {
  const eye = (x) => `
    <ellipse cx="${x}" cy="${cy}" rx="51" ry="${56 - lid}" fill="#FFFBF0" ${stroke(9)}/>
    <ellipse cx="${x + look[0]}" cy="${cy + look[1]}" rx="24" ry="27" fill="${iris}"/>
    <ellipse cx="${x + look[0]}" cy="${cy + look[1]}" rx="11" ry="13" fill="#080B13"/>
    <circle cx="${x + look[0] - 8}" cy="${cy + look[1] - 10}" r="8" fill="#FFF" opacity=".95"/>
    <circle cx="${x + look[0] + 9}" cy="${cy + look[1] + 9}" r="4" fill="#FFF" opacity=".55"/>
    <path d="M${x - 46} ${cy - 38} Q${x - 20} ${cy - 54} ${x + 44} ${cy - 36}" stroke="${OUT}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  return `
  ${eye(cx1)}${eye(cx2)}
  <path d="M${cx1 - 60} ${cy - 92} Q${cx1 - 18} ${cy - 118} ${cx1 + 40} ${cy - 88}" stroke="${OUT}" stroke-width="13" fill="none" stroke-linecap="round"/>
  <path d="M${cx2 - 40} ${cy - 88} Q${cx2 + 20} ${cy - 116} ${cx2 + 62} ${cy - 82}" stroke="${OUT}" stroke-width="13" fill="none" stroke-linecap="round"/>
  ${lashes ? `<path d="M${cx1 - 54} ${cy - 20} l-18-12 M${cx1 - 56} ${cy + 10} l-20 2 M${cx2 + 54} ${cy - 20} l18-12 M${cx2 + 56} ${cy + 10} l20 2" stroke="${OUT}" stroke-width="8" stroke-linecap="round"/>` : ''}`;
}

function blush(x1 = 168, x2 = 432, y = 410) {
  return `<ellipse cx="${x1}" cy="${y}" rx="38" ry="18" fill="#E8797B" opacity=".32"/><ellipse cx="${x2}" cy="${y}" rx="38" ry="18" fill="#E8797B" opacity=".32"/>`;
}

function bodyBase({ outfit, outfitDark, outfitLight, shirt, accent }) {
  return `
  <ellipse cx="300" cy="742" rx="232" ry="20" fill="#05070D" opacity=".22"/>
  <path d="M70 760 C82 638 162 584 246 566 L354 566 C438 584 518 638 530 760 Z" fill="${outfit}" ${stroke(11)}/>
  <path d="M70 760 C82 638 162 584 246 566 L354 566 C438 584 518 638 530 760 Z" fill="none" stroke="${outfitDark}" stroke-width="4" opacity=".55"/>
  <path d="M246 566 C254 622 232 680 190 760 M354 566 C346 622 368 680 410 760" stroke="${outfitDark}" stroke-width="5" fill="none" opacity=".55"/>
  <path d="M246 566 C258 620 258 664 240 760 H360 C342 664 342 620 354 566 Z" fill="${shirt}" stroke="${OUT}" stroke-width="6"/>
  <path d="M246 566 L300 652 L354 566" fill="${outfitLight}" stroke="${OUT}" stroke-width="6"/>
  <path d="M262 568 L300 638 L338 568" fill="${shirt}" opacity=".9"/>
  <circle cx="408" cy="660" r="28" fill="${accent}" ${stroke(6)}/>
  <path d="M396 660 l9 9 16-20" stroke="${OUT}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M90 720 C128 690 164 674 202 668 M510 720 C472 690 436 674 398 668" stroke="${outfitLight}" stroke-width="6" fill="none" opacity=".35"/>`;
}

function neckHead({ skin, skinShadow }) {
  return `
  <path d="M244 470 H356 V548 C356 574 334 590 300 590 C266 590 244 574 244 548 Z" fill="${skin}" ${stroke(10)}/>
  <path d="M258 505 H342 V552 C342 572 322 584 300 584 C278 584 258 572 258 552 Z" fill="${skinShadow}" opacity=".55"/>
  <ellipse cx="300" cy="316" rx="186" ry="198" fill="${skin}" ${stroke(11)}/>
  <ellipse cx="118" cy="344" rx="33" ry="44" fill="${skin}" ${stroke(9)}/>
  <ellipse cx="482" cy="344" rx="33" ry="44" fill="${skin}" ${stroke(9)}/>
  <ellipse cx="134" cy="350" rx="14" ry="24" fill="${skinShadow}" opacity=".55"/>
  <ellipse cx="466" cy="350" rx="14" ry="24" fill="${skinShadow}" opacity=".55"/>
  <path d="M300 318 c-6 24 -14 54 -4 68 8 10 28 6 32 -4" stroke="${skinShadow}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".75"/>`;
}

function charBara() {
  const skin = '#F0B184', skinShadow = '#C88355';
  return svgDoc(600, 760, `
  <g filter="url(#charShadow)">
    <!-- hair back -->
    <path d="M300 96 C158 96 76 214 96 364 C110 466 168 484 196 444 L164 302 L436 302 L404 444 C432 484 490 466 504 364 C524 214 442 96 300 96Z" fill="#222A44" ${stroke(11)}/>
    <!-- headphones band -->
    <path d="M132 300 C124 156 206 72 300 72 C394 72 476 156 468 300" stroke="${OUT}" stroke-width="28" fill="none"/>
    <path d="M132 300 C124 156 206 72 300 72 C394 72 476 156 468 300" stroke="${C.blue}" stroke-width="16" fill="none"/>
    <path d="M158 280 C154 174 218 104 300 104" stroke="${C.blueLight}" stroke-width="5" fill="none" opacity=".5"/>
    ${bodyBase({ outfit: C.red, outfitDark: '#A61F33', outfitLight: '#FF7A7F', shirt: C.cream, accent: C.yellow })}
    ${neckHead({ skin, skinShadow })}
    <!-- face -->
    ${eyes({ iris: '#243154', look: [2, -1] })}
    ${blush(164, 436, 424)}
    <path d="M278 384 c8 8 36 8 44 0" stroke="${skinShadow}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M228 428 C254 476 346 476 372 428 C352 462 248 462 228 428Z" fill="#3A1820" ${stroke(7)}/>
    <path d="M244 432 C268 446 332 446 356 432 C338 454 262 454 244 432Z" fill="#FFF8E8"/>
    <path d="M258 440 C276 448 324 448 342 440" stroke="#D78586" stroke-width="4" fill="none" opacity=".7"/>
    <path d="M190 462 l10 6 M410 462 l-10 6" stroke="${skinShadow}" stroke-width="4" stroke-linecap="round" opacity=".55"/>
    <g fill="#B06542" opacity=".65"><circle cx="172" cy="388" r="3"/><circle cx="188" cy="404" r="2.5"/><circle cx="158" cy="408" r="2.2"/><circle cx="424" cy="392" r="3"/><circle cx="440" cy="408" r="2.4"/></g>
    <!-- hair fringe -->
    <path d="M118 300 C118 204 196 126 300 126 C384 126 456 174 480 252 C432 208 406 206 372 220 C360 178 326 158 292 164 C274 202 244 222 208 232 C184 210 152 214 134 238 C126 258 120 276 118 300Z" fill="#2A3554" ${stroke(10)}/>
    <path d="M166 206 C204 178 234 168 268 166 M330 154 C370 158 406 178 428 206" stroke="#4A5F8C" stroke-width="6" fill="none" stroke-linecap="round" opacity=".55"/>
    <!-- goggles -->
    <g transform="rotate(-2 300 214)">
      <path d="M140 206 C210 180 390 180 460 206" stroke="${OUT}" stroke-width="20" fill="none"/>
      <path d="M140 206 C210 180 390 180 460 206" stroke="${C.yellow}" stroke-width="12" fill="none"/>
      <g>
        <circle cx="228" cy="206" r="54" fill="${C.blueDark}" ${stroke(10)}/>
        <circle cx="228" cy="206" r="42" fill="${C.blue}" stroke="${C.yellow}" stroke-width="12"/>
        <path d="M202 186 C210 172 226 166 242 168" stroke="#FFF" stroke-width="6" fill="none" stroke-linecap="round" opacity=".6"/>
      </g>
      <g>
        <circle cx="372" cy="206" r="54" fill="${C.blueDark}" ${stroke(10)}/>
        <circle cx="372" cy="206" r="42" fill="${C.blue}" stroke="${C.yellow}" stroke-width="12"/>
        <path d="M346 186 C354 172 370 166 386 168" stroke="#FFF" stroke-width="6" fill="none" stroke-linecap="round" opacity=".6"/>
      </g>
      <path d="M282 206 H318" stroke="${C.yellow}" stroke-width="14"/>
      <path d="M156 196 l-24 10 M444 196 l24 10" stroke="${C.yellow}" stroke-width="10" stroke-linecap="round"/>
    </g>
    <!-- headphone cups -->
    <g>
      <rect x="90" y="294" width="78" height="126" rx="34" fill="${C.blue}" ${stroke(10)}/>
      <rect x="104" y="310" width="46" height="92" rx="20" fill="#1B4FA8"/>
      <circle cx="129" cy="356" r="17" fill="${C.yellow}" ${stroke(5)}/>
      <path d="M112 318 C120 308 136 306 148 312" stroke="#8CC6FF" stroke-width="5" fill="none" opacity=".65"/>
    </g>
    <g>
      <rect x="432" y="294" width="78" height="126" rx="34" fill="${C.blue}" ${stroke(10)}/>
      <rect x="450" y="310" width="46" height="92" rx="20" fill="#1B4FA8"/>
      <circle cx="471" cy="356" r="17" fill="${C.yellow}" ${stroke(5)}/>
    </g>
    <!-- jacket details -->
    <path d="M164 616 H236 M364 616 H438" stroke="${C.yellow}" stroke-width="8" stroke-linecap="round"/>
    <path d="M206 690 l22 66 M394 690 l-22 66" stroke="#7E1828" stroke-width="4" opacity=".5"/>
    <path d="M84 706 C128 680 158 668 198 660" stroke="#FF7A7F" stroke-width="5" fill="none" opacity=".55"/>
    <path d="M258 640 h84" stroke="#7E1828" stroke-width="3" opacity=".6"/>
  </g>`, {
    defs: `${shadow('charShadow', 18, 22, .38)}`,
  });
}

function charNara() {
  const skin = '#D79563', skinShadow = '#AA6C3F';
  return svgDoc(600, 760, `
  <g filter="url(#charShadow)">
    <!-- hijab back / drape -->
    <path d="M300 86 C174 86 92 192 112 360 C126 480 110 540 86 620 H514 C490 540 474 480 488 360 C508 192 426 86 300 86Z" fill="${C.yellow}" ${stroke(11)}/>
    <path d="M300 86 C174 86 92 192 112 360 C126 480 110 540 86 620 H160 C144 520 158 430 152 356 C148 226 210 148 300 148 C390 148 452 226 448 356 C442 430 456 520 440 620 H514 C490 540 474 480 488 360 C508 192 426 86 300 86Z" fill="#E2AA18" opacity=".55"/>
    ${bodyBase({ outfit: C.purple, outfitDark: '#6F2C99', outfitLight: C.purpleLight, shirt: C.cream, accent: C.yellow })}
    ${neckHead({ skin, skinShadow })}
    <!-- hijab face frame -->
    <path d="M300 112 C196 112 132 194 138 330 C142 424 206 494 300 500 C394 494 458 424 462 330 C468 194 404 112 300 112Z" fill="${C.yellow}" ${stroke(10)}/>
    <path d="M300 136 C214 136 164 204 168 330 C172 408 224 464 300 470 C376 464 428 408 432 330 C436 204 386 136 300 136Z" fill="${skin}" ${stroke(9)}/>
    <path d="M132 286 C100 300 82 344 94 392 C100 414 118 432 146 438 C128 402 124 350 138 300 Z" fill="${C.yellow}" ${stroke(8)}/>
    <path d="M468 286 C500 300 518 344 506 392 C500 414 482 432 454 438 C472 402 476 350 462 300 Z" fill="${C.yellow}" ${stroke(8)}/>
    <path d="M124 330 C120 366 128 400 146 420 M476 330 C480 366 472 400 454 420" stroke="#B98410" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>
    <path d="M168 322 C176 220 224 162 300 162 C376 162 424 220 432 322 C396 254 356 230 300 230 C244 230 204 254 168 322Z" fill="${C.purple}" ${stroke(7)}/>
    <path d="M168 332 C180 240 230 186 300 186 C370 186 420 240 432 332" stroke="${C.yellow}" stroke-width="5" fill="none" opacity=".35"/>
    <path d="M138 342 C130 410 138 462 160 510" stroke="#B98410" stroke-width="7" fill="none" opacity=".6"/>
    <path d="M462 342 C470 410 462 462 440 510" stroke="#B98410" stroke-width="7" fill="none" opacity=".6"/>
    <!-- face -->
    ${eyes({ cx1: 234, cx2: 366, cy: 334, iris: '#5A3A23', look: [-1, 0], lashes: true })}
    ${blush(186, 414, 424)}
    <path d="M286 392 c10 6 18 6 28 0" stroke="${skinShadow}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M258 432 C276 456 324 456 342 432 C330 448 270 448 258 432Z" fill="#5A2330" ${stroke(6)}/>
    <path d="M270 436 C286 444 314 444 330 436" stroke="#FFF7E6" stroke-width="6" stroke-linecap="round"/>
    <circle cx="414" cy="390" r="4" fill="#7B4A2C"/>
    <path d="M172 458 C186 468 202 470 216 466" stroke="${skinShadow}" stroke-width="4" fill="none" opacity=".45"/>
    <!-- hijab folds + pin -->
    <path d="M206 138 C176 186 162 244 164 312 M394 138 C424 186 438 244 436 312" stroke="#B98410" stroke-width="6" fill="none" stroke-linecap="round" opacity=".55"/>
    <path d="M130 566 C190 600 410 600 470 566" stroke="#B98410" stroke-width="7" fill="none" opacity=".5"/>
    <g transform="translate(440 290) rotate(18)"><path d="${starPath(0, 0, 24, 11)}" fill="${C.purple}" ${stroke(4)}/></g>
    <path d="M252 588 C264 616 336 616 348 588" stroke="${C.yellow}" stroke-width="5" fill="none" opacity=".6"/>
    <!-- jacket -->
    <path d="M164 620 C210 650 390 650 436 620" stroke="${C.yellow}" stroke-width="5" fill="none" opacity=".35"/>
    <path d="M186 692 h70 M344 692 h70" stroke="#C9A6E8" stroke-width="5" stroke-linecap="round" opacity=".55"/>
  </g>`, { defs: shadow('charShadow', 18, 22, .38) });
}

function charDimas() {
  const skin = '#C88756', skinShadow = '#976036', hair = '#4A2C1D';
  return svgDoc(600, 760, `
  <g filter="url(#charShadow)">
    <!-- hair back -->
    <path d="M300 92 C180 92 84 190 102 344 C112 438 150 480 174 450 C150 390 148 330 160 280 L440 280 C452 330 450 390 426 450 C450 480 488 438 498 344 C516 190 420 92 300 92Z" fill="${hair}" ${stroke(11)}/>
    ${bodyBase({ outfit: C.blue, outfitDark: '#1453B8', outfitLight: C.blueLight, shirt: C.yellow, accent: C.cream })}
    ${neckHead({ skin, skinShadow })}
    <!-- hair top -->
    <path d="M108 300 C98 190 178 116 300 112 C414 108 500 186 492 306 C476 266 452 240 424 224 C410 190 366 164 318 172 C298 198 272 214 244 222 C210 202 178 206 152 232 C134 254 118 274 108 300Z" fill="${hair}" ${stroke(10)}/>
    <path d="M148 238 C186 190 242 162 300 158 C354 154 404 174 438 210" stroke="#7C5034" stroke-width="9" fill="none" stroke-linecap="round" opacity=".65"/>
    <path d="M184 176 C196 150 218 140 238 138 M300 126 C330 116 366 122 386 138" stroke="${hair}" stroke-width="20" stroke-linecap="round"/>
    <!-- face -->
    ${eyes({ cx1: 238, cx2: 362, cy: 328, iris: '#3A2A20', look: [-2, 0] })}
    ${blush(170, 430, 420)}
    <path d="M288 384 c10 8 26 8 36 0" stroke="${skinShadow}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <!-- glasses -->
    <g>
      <circle cx="238" cy="330" r="73" fill="#BFE4FF" opacity=".16"/>
      <circle cx="238" cy="330" r="73" fill="none" stroke="${OUT}" stroke-width="10"/>
      <circle cx="362" cy="330" r="73" fill="#BFE4FF" opacity=".16"/>
      <circle cx="362" cy="330" r="73" fill="none" stroke="${OUT}" stroke-width="10"/>
      <path d="M311 330 C320 318 336 318 345 330" stroke="${OUT}" stroke-width="9" fill="none"/>
      <path d="M165 324 L114 312 M435 324 L486 312" stroke="${OUT}" stroke-width="9" stroke-linecap="round"/>
      <path d="M198 298 C210 284 228 278 244 282 M322 298 C334 284 352 278 368 282" stroke="#FFF" stroke-width="5" fill="none" stroke-linecap="round" opacity=".75"/>
      <path d="M190 354 C198 370 214 378 230 380" stroke="#8BC6FF" stroke-width="4" fill="none" opacity=".55"/>
    </g>
    <!-- mouth buck teeth -->
    <path d="M234 430 C256 464 344 466 366 430 C350 456 250 456 234 430Z" fill="#4A1E24" ${stroke(6)}/>
    <path d="M272 444 H294 V462 H272 Z M306 444 H328 V462 H306 Z" fill="#FFF8E8" ${stroke(4)}/>
    <path d="M342 444 C352 442 358 438 362 432" stroke="#FFF8E8" stroke-width="6" stroke-linecap="round"/>
    <path d="M178 384 l34 6 M422 390 l-34 6" stroke="${skinShadow}" stroke-width="4" stroke-linecap="round" opacity=".45"/>
    <!-- headphones around neck -->
    <path d="M188 558 C172 660 198 704 300 704 C402 704 428 660 412 558" stroke="${OUT}" stroke-width="24" fill="none"/>
    <path d="M188 558 C172 660 198 704 300 704 C402 704 428 660 412 558" stroke="${C.cream}" stroke-width="13" fill="none"/>
    <g><rect x="158" y="660" width="78" height="86" rx="28" fill="${C.yellow}" ${stroke(8)}/><rect x="172" y="674" width="50" height="58" rx="18" fill="#B98410"/></g>
    <g><rect x="364" y="660" width="78" height="86" rx="28" fill="${C.yellow}" ${stroke(8)}/><rect x="378" y="674" width="50" height="58" rx="18" fill="#B98410"/></g>
    <!-- hoodie details -->
    <path d="M208 580 C250 608 350 608 392 580" stroke="#8CC6FF" stroke-width="6" fill="none" opacity=".5"/>
    <path d="M204 680 V740 M396 680 V740" stroke="#1453B8" stroke-width="6" opacity=".6"/>
  </g>`, { defs: shadow('charShadow', 18, 22, .38) });
}

function charKira() {
  const skin = '#F4C6A4', skinShadow = '#C9906D', hair = '#8E2144';
  return svgDoc(600, 760, `
  <g filter="url(#charShadow)">
    <!-- ponytail -->
    <path d="M420 160 C548 154 574 300 522 406 C496 460 458 484 424 474 C468 430 480 382 462 334 C448 294 430 274 392 260 Z" fill="${hair}" ${stroke(11)}/>
    <path d="M458 186 C522 218 526 326 486 402" stroke="#D94271" stroke-width="9" fill="none" stroke-linecap="round" opacity=".6"/>
    <path d="M446 160 C470 156 490 168 500 188" stroke="#4A1024" stroke-width="8" fill="none" opacity=".5"/>
    <!-- hair back -->
    <path d="M300 94 C178 94 88 192 104 356 C114 452 154 488 182 450 L168 296 L432 296 L418 450 C446 488 486 452 496 356 C512 192 422 94 300 94Z" fill="${hair}" ${stroke(11)}/>
    ${bodyBase({ outfit: C.green, outfitDark: C.greenDark, outfitLight: C.greenLight, shirt: C.purple, accent: C.yellow })}
    ${neckHead({ skin, skinShadow })}
    <!-- fringe -->
    <path d="M108 298 C102 190 176 116 292 112 C398 108 488 178 494 286 C466 232 432 212 398 204 C388 160 340 142 296 154 C276 190 248 216 212 236 C184 218 154 218 132 238 C120 256 112 276 108 298Z" fill="${hair}" ${stroke(10)}/>
    <path d="M198 158 C246 144 292 154 322 184 C354 156 396 156 430 180" stroke="#D94271" stroke-width="8" fill="none" stroke-linecap="round" opacity=".65"/>
    <path d="M132 258 C168 218 212 198 260 192" stroke="#4A1024" stroke-width="7" fill="none" opacity=".5"/>
    <!-- hair tie -->
    <g transform="translate(430 190) rotate(-20)"><rect x="-32" y="-14" width="64" height="28" rx="14" fill="${C.yellow}" ${stroke(7)}/><path d="M-18-14V14M0-14V14M18-14V14" stroke="#B98410" stroke-width="4"/></g>
    <!-- face -->
    ${eyes({ cx1: 238, cx2: 362, cy: 330, iris: '#1F5A3A', look: [3, 0], lashes: true })}
    ${blush(172, 428, 420)}
    <path d="M288 386 c10 6 24 6 34 0" stroke="${skinShadow}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M238 430 C266 458 336 458 364 426 C354 454 280 468 238 430Z" fill="#571824" ${stroke(6)}/>
    <path d="M252 434 C278 446 328 444 350 430" stroke="#FFF8E8" stroke-width="7" stroke-linecap="round"/>
    <path d="M360 428 c8 4 14 2 18-4" stroke="#FFF8E8" stroke-width="5" stroke-linecap="round"/>
    <g transform="translate(118 372)"><circle r="9" fill="${C.yellow}" ${stroke(4)}/><circle cy="28" r="6" fill="${C.blue}" ${stroke(3)}/></g>
    <!-- eyebrow scar -->
    <path d="M406 268 l16 8" stroke="${skinShadow}" stroke-width="5" stroke-linecap="round" opacity=".7"/>
    <!-- jacket details -->
    <path d="M190 682 h84 M360 682 h84" stroke="${C.yellow}" stroke-width="5" stroke-linecap="round" opacity=".5"/>
    <g transform="translate(426 604)"><path d="${starPath(0, 0, 30, 14)}" fill="${C.purple}" ${stroke(4)}/></g>
    <path d="M256 596 L300 612 L344 596" stroke="${C.yellow}" stroke-width="5" fill="none" opacity=".5"/>
    <path d="M166 626 C210 654 390 654 434 626" stroke="#168A55" stroke-width="5" fill="none" opacity=".55"/>
    <!-- fingers / headphones? collar zipper -->
    <path d="M300 596 V732" stroke="${OUT}" stroke-width="5" opacity=".28"/>
    <path d="M310 612 L318 712" stroke="#D8EFE3" stroke-width="3" opacity=".4"/>
  </g>`, { defs: shadow('charShadow', 18, 22, .38) });
}

for (const [id, fn, meta] of [
  ['bara', charBara, { name: 'Bara', role: 'Pemimpin panik yang berani', colors: '#FF414D · #FFC928' }],
  ['nara', charNara, { name: 'Nara', role: 'Otak tenang di balik hijab', colors: '#FFC928 · #B55DDC' }],
  ['dimas', charDimas, { name: 'Dimas', role: 'Analis kabel & spek teknis', colors: '#2B8BFF · #FFC928' }],
  ['kira', charKira, { name: 'Kira', role: 'Refleks cepat, mulut pedas', colors: '#38D98A · #FF414D' }],
]) {
  A(`characters/char-${id}.svg`, fn(), {
    group: 'Character', size: '600×760', format: 'SVG (+PNG @1x/@2x)', tags: ['avatar', id],
    note: `Bust portrait — ${meta.name}. ${meta.role}. Palette ${meta.colors}.`,
  });
}

/* ================================================================== *
 *  BOMB PROPS
 * ================================================================== */
function bombHero(mood = 'panik') {
  const defused = mood === 'defused';
  const accent = defused ? C.green : C.yellow;
  const W = 560, H = 640;
  const face = defused
    ? `<path d="M198 298 Q226 270 254 298" stroke="${OUT}" stroke-width="13" fill="none" stroke-linecap="round"/>
       <path d="M306 298 Q334 270 362 298" stroke="${OUT}" stroke-width="13" fill="none" stroke-linecap="round"/>
       <path d="M240 360 Q280 404 320 360" fill="#2A1020" ${stroke(8)}/>
       <path d="M254 366 Q280 388 306 366" fill="#FFF8E8"/>`
    : `<ellipse cx="224" cy="308" rx="48" ry="54" fill="#FFF8E8" ${stroke(9)}/>
       <ellipse cx="336" cy="308" rx="48" ry="54" fill="#FFF8E8" ${stroke(9)}/>
       <ellipse cx="238" cy="316" rx="20" ry="24" fill="#171021"/>
       <ellipse cx="322" cy="316" rx="20" ry="24" fill="#171021"/>
       <circle cx="232" cy="308" r="6" fill="#FFF"/>
       <circle cx="316" cy="308" r="6" fill="#FFF"/>
       <path d="M158 228 Q196 200 238 218" stroke="${OUT}" stroke-width="14" fill="none" stroke-linecap="round"/>
       <path d="M302 218 Q346 196 386 224" stroke="${OUT}" stroke-width="14" fill="none" stroke-linecap="round"/>
       <path d="M230 368 Q280 416 330 368 Q280 440 230 368Z" fill="#2A1020" ${stroke(7)}/>
       <path d="M250 374 Q280 392 310 374" fill="#FFF8E8"/>
       <path d="M188 376 C178 400 190 418 208 418" stroke="#7CC4FF" stroke-width="8" fill="none" stroke-linecap="round" opacity=".8"/>`;

  return svgDoc(W, H, `
  <g filter="url(#bombShadow)">
    <ellipse cx="290" cy="590" rx="180" ry="30" fill="#05070D" opacity=".4"/>
    <!-- body -->
    <circle cx="280" cy="356" r="208" fill="url(#ball)" stroke="${OUT}" stroke-width="14"/>
    <circle cx="280" cy="356" r="208" fill="none" stroke="${C.purple}" stroke-opacity=".25" stroke-width="3"/>
    <!-- hazard band clipped -->
    <clipPath id="ballClip"><circle cx="280" cy="356" r="200"/></clipPath>
    <g clip-path="url(#ballClip)">
      <path d="M40 452 H520 L500 500 H20 Z" fill="url(#haz)"/>
      <path d="M40 512 H520" stroke="#05070D" stroke-width="8" opacity=".3"/>
      <path d="M36 190 C120 120 230 92 348 116" stroke="#FFFFFF" stroke-width="26" stroke-linecap="round" opacity=".09"/>
      <path d="M106 266 C134 238 166 222 202 212" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" opacity=".18"/>
    </g>
    <!-- face -->
    ${face}
    <!-- sweat / sparkle -->
    <path d="M404 230 C424 254 422 276 404 282 C386 276 384 254 404 230Z" fill="#8CC6FF" ${stroke(5)} opacity=".85"/>
    <g ${defused ? '' : 'filter="url(#hotGlow)"'}>
      <circle cx="382" cy="458" r="10" fill="${accent}"/>
    </g>
    <!-- cap -->
    <path d="M194 184 C218 134 342 134 366 184 L358 214 H202 Z" fill="url(#metal)" ${stroke(11)}/>
    <rect x="222" y="158" width="116" height="34" rx="12" fill="#0E1421" stroke="#05070D" stroke-width="6"/>
    <path d="M240 176 H320" stroke="${accent}" stroke-width="5" stroke-linecap="round" opacity=".7"/>
    ${screw(212, 190, 6)}${screw(348, 190, 6)}
    <!-- fuse -->
    <path d="M280 146 C276 104 312 88 326 54" stroke="${OUT}" stroke-width="26" fill="none" stroke-linecap="round"/>
    <path d="M280 146 C276 104 312 88 326 54" stroke="#D29A4B" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M292 132 C288 108 310 96 320 74" stroke="#FFE0A8" stroke-width="4" fill="none" opacity=".6"/>
    ${defused
      ? `<g opacity=".5"><circle cx="338" cy="42" r="12" fill="#7E869C"/><path d="M340 22 C356 6 378 14 374 32" stroke="#9AA3B8" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="360" cy="18" r="7" fill="#C5CCDC" opacity=".5"/></g>`
      : `<g filter="url(#hotGlow)"><path d="${burstPath(340, 38, 42, 17, 8)}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/><circle cx="340" cy="38" r="13" fill="#FFF6C9"/></g>`}
    <!-- arms -->
    <path d="M96 356 C52 330 38 286 54 252" stroke="${OUT}" stroke-width="38" fill="none" stroke-linecap="round"/>
    <path d="M96 356 C52 330 38 286 54 252" stroke="#242C42" stroke-width="24" fill="none" stroke-linecap="round"/>
    <circle cx="52" cy="240" r="30" fill="${C.cream}" ${stroke(9)}/>
    <path d="M36 220 C34 206 44 196 56 198" stroke="#FFF" stroke-width="4" fill="none" opacity=".4"/>
    <path d="M466 344 C508 374 520 420 502 462" stroke="${OUT}" stroke-width="38" fill="none" stroke-linecap="round"/>
    <path d="M466 344 C508 374 520 420 502 462" stroke="#242C42" stroke-width="24" fill="none" stroke-linecap="round"/>
    <circle cx="502" cy="474" r="28" fill="${C.cream}" ${stroke(9)}/>
    <!-- legs -->
    <path d="M214 548 L204 596" stroke="${OUT}" stroke-width="34" stroke-linecap="round"/>
    <path d="M214 548 L204 596" stroke="#242C42" stroke-width="20" stroke-linecap="round"/>
    <path d="M340 548 L354 596" stroke="${OUT}" stroke-width="34" stroke-linecap="round"/>
    <path d="M340 548 L354 596" stroke="#242C42" stroke-width="20" stroke-linecap="round"/>
    <path d="M164 604 C182 590 210 592 230 604 C230 622 208 630 188 626 C172 624 162 616 164 604Z" fill="${C.red}" ${stroke(7)}/>
    <path d="M332 604 C352 590 382 592 400 606 C398 624 376 632 354 626 C338 622 328 614 332 604Z" fill="${C.red}" ${stroke(7)}/>
    <!-- tiny face on bomb? no -->
    <path d="M170 402 C154 414 150 432 160 446" stroke="#FFFFFF" stroke-opacity=".14" stroke-width="8" fill="none" stroke-linecap="round"/>
  </g>`, {
    defs: `${linear('ball', [[0, '#65708F'], [.2, '#343E58'], [.55, '#171D2D'], [1, '#080B13']], { x1: .2, y1: .1, x2: .85, y2: .9 })}
    ${linear('metal', [[0, '#8390AA'], [.3, '#3A445C'], [1, '#161D2E']])}
    ${radial('hot', [[0, '#FFF3B0'], [.35, '#FFC928'], [.7, '#FF7A2E'], [1, '#FF414D', 0]])}
    ${glow('hotGlow', '#FF9C32', 14)}
    ${shadow('bombShadow', 24, 26, .48)}
    ${hazardDefs('haz', 34, C.yellow, C.ink)}`,
  });
}
A('bomb/bomb-hero.svg', bombHero('panik'), {
  group: 'Bomb Prop', size: '560×640', format: 'SVG (+PNG @1x/@2x)', tags: ['bomb', 'mascot'],
  note: 'Hero bomb mascot for Attract / Briefing.',
});
A('bomb/bomb-defused.svg', bombHero('defused'), {
  group: 'Bomb Prop', size: '560×640', format: 'SVG', tags: ['bomb', 'defused'],
  note: 'Happier defused state for Victory screens.',
});

function bombCase() {
  const W = 820, H = 620;
  return svgDoc(W, H, `
  <g filter="url(#caseShadow)">
    <ellipse cx="410" cy="588" rx="330" ry="28" fill="#05070D" opacity=".42"/>
    <!-- lid -->
    <path d="M112 188 L176 78 H650 L714 188 Z" fill="url(#lid)" stroke="${OUT}" stroke-width="12"/>
    <path d="M190 170 L232 102 H594 L636 170 Z" fill="#0B1120" stroke="#05080F" stroke-width="8"/>
    <rect x="248" y="120" width="308" height="34" rx="10" fill="#1A2438" stroke="#05080F" stroke-width="5"/>
    <path d="M270 138 H348" stroke="${C.green}" stroke-width="5" stroke-linecap="round" opacity=".8"/>
    <path d="M370 138 H420" stroke="${C.red}" stroke-width="5" stroke-linecap="round" opacity=".8"/>
    <path d="M444 138 H520" stroke="${C.yellow}" stroke-width="5" stroke-linecap="round" opacity=".5"/>
    <g stroke="${C.yellow}" stroke-width="4" stroke-linecap="round" opacity=".65"><path d="M134 150 l22-36 M158 158 l22-36 M182 166 l22-36"/></g>
    ${screw(150, 160, 7)}${screw(670, 160, 7)}
    <!-- hinges -->
    <path d="M206 188 H280 M540 188 H614" stroke="${OUT}" stroke-width="18"/>
    <path d="M206 188 H280 M540 188 H614" stroke="#6B7796" stroke-width="10"/>
    <!-- body -->
    <path d="M70 206 H750 L790 286 V548 H30 V286 Z" fill="url(#case)" stroke="${OUT}" stroke-width="14"/>
    <path d="M30 286 H790" stroke="${OUT}" stroke-width="8"/>
    <path d="M52 300 H768 V528 H52 Z" fill="#0A101C" stroke="#05080F" stroke-width="7"/>
    <!-- slots -->
    <g>
      <rect x="76" y="328" width="212" height="168" rx="16" fill="#111A2C" stroke="#2B3750" stroke-width="5"/>
      <rect x="92" y="344" width="180" height="96" rx="10" fill="#080D17" stroke="#000" stroke-width="4"/>
      <path d="M112 372 H192 M112 392 H164" stroke="${C.blue}" stroke-width="4" opacity=".4" stroke-linecap="round"/>
      <circle cx="250" cy="466" r="9" fill="${C.blue}"/>
      <g fill="${C.steel}">${[0, 1, 2].map((i) => `<rect x="${100 + i * 22}" y="458" width="12" height="18" rx="3"/>`).join('')}</g>
    </g>
    <g>
      <rect x="304" y="328" width="212" height="168" rx="16" fill="#111A2C" stroke="#2B3750" stroke-width="5"/>
      <rect x="320" y="344" width="180" height="96" rx="10" fill="#080D17" stroke="#000" stroke-width="4"/>
      <path d="M344 388 l18-18 18 28 22-38 26 28" stroke="${C.red}" stroke-width="4" fill="none" opacity=".5" stroke-linecap="round"/>
      <circle cx="478" cy="466" r="9" fill="${C.yellow}"/>
      <g fill="${C.steel}">${[0, 1, 2].map((i) => `<rect x="${328 + i * 22}" y="458" width="12" height="18" rx="3"/>`).join('')}</g>
    </g>
    <g>
      <rect x="532" y="328" width="212" height="168" rx="16" fill="#111A2C" stroke="#2B3750" stroke-width="5"/>
      <rect x="548" y="344" width="180" height="96" rx="10" fill="#080D17" stroke="#000" stroke-width="4"/>
      <g fill="${C.green}" opacity=".55"><circle cx="584" cy="376" r="8"/><circle cx="622" cy="376" r="8"/><circle cx="660" cy="376" r="8"/></g>
      <path d="M566 414 H710" stroke="${C.steelLight}" stroke-width="4" opacity=".3"/>
      <circle cx="706" cy="466" r="9" fill="${C.green}"/>
    </g>
    <!-- latch + handle -->
    <rect x="366" y="248" width="88" height="54" rx="12" fill="#1A2236" stroke="${OUT}" stroke-width="8"/>
    <path d="M388 260 V288" stroke="${C.yellow}" stroke-width="10" stroke-linecap="round"/>
    <path d="M408 260 V288" stroke="${C.yellow}" stroke-width="10" stroke-linecap="round"/>
    <path d="M330 500 C330 476 352 468 410 468 C468 468 490 476 490 500" stroke="${OUT}" stroke-width="18" fill="none"/>
    <path d="M330 500 C330 476 352 468 410 468 C468 468 490 476 490 500" stroke="#77839E" stroke-width="10" fill="none"/>
    <g transform="translate(690 506) rotate(-8)"><rect x="-40" y="-28" width="80" height="56" rx="8" fill="url(#haz)" stroke="${OUT}" stroke-width="6"/></g>
    <!-- wires spilling -->
    <path d="M736 232 C812 262 804 328 760 354" stroke="${C.blue}" stroke-width="14" stroke-linecap="round"/>
    <path d="M760 354 C780 380 806 386 806 418" stroke="${C.blue}" stroke-width="14" stroke-linecap="round"/>
    <path d="M60 232 C-14 270 24 336 68 344" stroke="${C.red}" stroke-width="14" stroke-linecap="round"/>
    <path d="M68 344 C42 380 50 416 28 446" stroke="${C.red}" stroke-width="14" stroke-linecap="round"/>
    ${screw(54, 310, 8)}${screw(766, 310, 8)}${screw(54, 520, 8)}${screw(766, 520, 8)}
    <path d="M120 290 H694" stroke="#FFFFFF" stroke-opacity=".07" stroke-width="3"/>
    <path d="M84 538 H220" stroke="${C.yellow}" stroke-width="5" stroke-linecap="round" opacity=".4"/>
  </g>`, {
    defs: `${linear('lid', [[0, '#4B5771'], [.3, '#242D43'], [1, '#141A2A']], { x1: 0, y1: 0, x2: 1, y2: 1 })}
    ${linear('case', [[0, '#5B6884'], [.1, '#2E3850'], [.6, '#1C2437'], [1, '#101624']], { x1: 0, y1: 0, x2: 1, y2: 1 })}
    ${shadow('caseShadow', 26, 28, .5)}
    ${hazardDefs('haz', 26, C.yellow, C.ink)}`,
  });
}
A('bomb/bomb-case.svg', bombCase(), {
  group: 'Bomb Prop', size: '820×620', format: 'SVG (+PNG @1x/@2x)', tags: ['bomb', 'case', 'briefing'],
  note: 'Open defusal case for Mission Briefing / results.',
});

/* ================================================================== *
 *  PUZZLE OBJECTS
 * ================================================================== */
function scanner() {
  const W = 300;
  return svgDoc(W, W, `
  <circle cx="150" cy="150" r="138" fill="#05080F" opacity=".35"/>
  <circle cx="150" cy="150" r="132" fill="url(#pad)" stroke="${OUT}" stroke-width="9"/>
  <circle cx="150" cy="150" r="112" fill="#0A1522" stroke="#38D98A" stroke-opacity=".25" stroke-width="3"/>
  <g stroke="${OUT}" stroke-width="5" opacity=".8">
    <path d="M150 28 V48 M150 252 V272 M28 150 H48 M252 150 H272 M64 64 L78 78 M236 64 L222 78 M64 236 L78 222 M236 236 L222 222"/>
  </g>
  <g stroke="${C.cyan || '#5FE6FF'}" stroke-width="2" stroke-opacity=".3"><circle cx="150" cy="150" r="96" stroke-dasharray="2 12"/><circle cx="150" cy="150" r="72" stroke-dasharray="2 10"/></g>
  <g fill="none" stroke="${C.green}" stroke-width="7" stroke-linecap="round" filter="url(#fingerGlow)">
    <path d="M122 206 C108 184 112 168 124 150 C136 132 134 114 122 104 C112 96 96 102 94 116 C92 136 112 146 124 132"/>
    <path d="M138 210 C128 190 134 174 146 158 C158 142 160 120 150 108 C142 98 126 100 122 114"/>
    <path d="M154 210 C150 192 158 176 170 162 C180 150 184 132 180 120"/>
    <path d="M170 204 C174 184 184 170 194 158"/>
    <path d="M108 156 C118 174 130 180 144 178"/>
  </g>
  <circle cx="150" cy="150" r="120" fill="none" stroke="${C.green}" stroke-width="2" stroke-dasharray="3 14" opacity=".5"/>
  <circle cx="246" cy="54" r="9" fill="${C.green}" filter="url(#fingerGlow)"/>
  <circle cx="150" cy="150" r="56" fill="${C.green}" opacity=".04"/>`, {
    defs: `${linear('pad', [[0, '#4B5874'], [.35, '#242E45'], [1, '#101625']], { x1: .2, y1: .1, x2: .8, y2: .9 })}
    ${glow('fingerGlow', C.green, 8)}`,
  });
}
A('puzzles/puzzle-scanner.svg', scanner(), {
  group: 'Puzzle Object', size: '300×300', format: 'SVG', tags: ['dual-hand', 'scanner'],
  note: 'Biometric pad. Fingerprint is a fixed visual; game overlays progress.',
});

function leverTrack() {
  return svgDoc(420, 110, `
  <rect x="6" y="22" width="408" height="72" rx="28" fill="#0A101C" stroke="${OUT}" stroke-width="8"/>
  <rect x="24" y="38" width="372" height="38" rx="18" fill="#05080F" stroke="#000" stroke-width="4"/>
  <path d="M44 57 H376" stroke="${C.steelLight}" stroke-width="2" opacity=".25"/>
  <g stroke="${C.steelLight}" stroke-width="3" opacity=".4">${Array.from({ length: 19 }, (_, i) => `<path d="M42 ${44 + i * 0.6} v${10 - i * 0.3}" transform="translate(${i * 18} 0)"/>`).join('')}</g>
  <path d="M22 22 L62 22 L48 44 L22 44 Z" fill="${C.yellow}" stroke="${OUT}" stroke-width="5"/>
  <path d="M398 22 L358 22 L372 44 L398 44 Z" fill="${C.red}" stroke="${OUT}" stroke-width="5"/>
  ${screw(20, 82, 6)}${screw(400, 82, 6)}
  <path d="M180 98 H240" stroke="${C.cream}" stroke-opacity=".18" stroke-width="4" stroke-linecap="round"/>`);
}
A('puzzles/lever-track.svg', leverTrack(), { group: 'Puzzle Object', size: '420×110', format: 'SVG', tags: ['dual-hand', 'slider'], note: 'Rail + end caps. Handle moves x=40–380.' });

function leverHandle() {
  return svgDoc(110, 170, `
  <ellipse cx="55" cy="148" rx="38" ry="10" fill="#05070D" opacity=".4"/>
  <path d="M38 130 V82 H72 V130 Z" fill="url(#steel)" stroke="${OUT}" stroke-width="7"/>
  <path d="M34 92 H76 L82 116 H28 Z" fill="#5A6684" stroke="${OUT}" stroke-width="6"/>
  <path d="M30 82 V54 C30 30 44 16 55 16 C66 16 80 30 80 54 V82 Z" fill="${C.red}" stroke="${OUT}" stroke-width="8"/>
  <path d="M42 70 V50 C42 36 48 28 55 28 C62 28 68 36 68 50 V70 Z" fill="#B51F34" opacity=".55"/>
  <path d="M42 38 C46 28 52 24 58 24" stroke="#FF9A9F" stroke-width="6" stroke-linecap="round" opacity=".8"/>
  <path d="M40 100 H70 M40 112 H70" stroke="#1A2236" stroke-width="4" opacity=".55"/>
  <circle cx="55" cy="58" r="5" fill="${C.yellow}" stroke="${OUT}" stroke-width="3"/>`, {
    defs: `${linear('steel', [[0, '#8995AE'], [.4, '#4A5670'], [1, '#232C42']], { x1: 0, y1: 0, x2: 1, y2: 0 })}`,
  });
}
A('puzzles/lever-handle.svg', leverHandle(), { group: 'Puzzle Object', size: '110×170', format: 'SVG', tags: ['dual-hand', 'handle'], note: 'Drag handle render origin at top-left; pointer anchor ~ (55,120).' });

function bigButton(color, light, dark) {
  const W = 460, H = 340;
  return svgDoc(W, H, `
  <ellipse cx="230" cy="300" rx="205" ry="26" fill="#05070D" opacity=".4"/>
  <path d="M36 270 C36 314 424 314 424 270 L414 224 H46 Z" fill="url(#base)" stroke="${OUT}" stroke-width="11"/>
  <path d="M50 222 C50 172 410 172 410 222 L410 232 H50 Z" fill="#35405A" stroke="${OUT}" stroke-width="8"/>
  <ellipse cx="230" cy="226" rx="166" ry="56" fill="${dark}" stroke="${OUT}" stroke-width="11"/>
  <ellipse cx="230" cy="214" rx="150" ry="46" fill="${color}" ${''} stroke="${light}" stroke-width="9"/>
  <ellipse cx="230" cy="189" rx="146" ry="54" fill="${dark}" stroke="${OUT}" stroke-width="9"/>
  <ellipse cx="230" cy="170" rx="142" ry="50" fill="${color}" stroke="${OUT}" stroke-width="10"/>
  <ellipse cx="230" cy="166" rx="126" ry="39" fill="url(#gloss)"/>
  <ellipse cx="230" cy="166" rx="126" ry="39" fill="none" stroke="${light}" stroke-width="3" opacity=".65"/>
  <path d="M130 152 C156 132 208 126 250 132" stroke="#FFFFFF" stroke-width="11" stroke-linecap="round" opacity=".45"/>
  <path d="M90 244 C150 266 312 266 370 242" stroke="#000" stroke-width="5" fill="none" opacity=".28"/>
  <g fill="${C.yellow}"><circle cx="92" cy="286" r="5"/><circle cx="112" cy="286" r="5"/><circle cx="132" cy="286" r="5"/></g>`, {
    defs: `${linear('base', [[0, '#4E5B77'], [.35, '#2C354C'], [1, '#151C2D']], { x1: 0, y1: 0, x2: 0, y2: 1 })}
    ${radial('gloss', [[0, '#FFFFFF', .42], [.6, '#FFFFFF', .06], [1, '#000000', .2]], { cx: .38, cy: .32, r: .7 })}`,
  });
}
A('puzzles/button-red.svg', bigButton(C.red, C.redLight, '#B51F34'), { group: 'Puzzle Object', size: '460×340', format: 'SVG', tags: ['button', 'red'], note: 'Big arcade button.' });
A('puzzles/button-blue.svg', bigButton(C.blue, C.blueLight, '#1453B8'), { group: 'Puzzle Object', size: '460×340', format: 'SVG', tags: ['button', 'blue'], note: 'Big arcade button — trap variant.' });
A('puzzles/button-green.svg', bigButton(C.green, C.greenLight, '#168A55'), { group: 'Puzzle Object', size: '460×340', format: 'SVG', tags: ['button', 'green'], note: 'Big arcade button.' });

function wire(name, color, light, pattern) {
  const W = 110, H = 540;
  return svgDoc(W, H, `
  <path d="M55 28 C30 90 80 132 55 200 C30 268 80 310 55 378 C30 446 80 486 55 512" stroke="${OUT}" stroke-width="42" fill="none" stroke-linecap="round"/>
  <path d="M55 28 C30 90 80 132 55 200 C30 268 80 310 55 378 C30 446 80 486 55 512" stroke="${color}" stroke-width="28" fill="none" stroke-linecap="round"/>
  <path d="M55 28 C30 90 80 132 55 200 C30 268 80 310 55 378 C30 446 80 486 55 512" stroke="${light}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".6" transform="translate(-6 0)"/>
  ${pattern}
  <g>
    <rect x="26" y="6" width="58" height="48" rx="12" fill="url(#plug)" stroke="${OUT}" stroke-width="6"/>
    <rect x="40" y="14" width="30" height="22" rx="5" fill="#0A101C"/>
    <path d="M48 42 H62" stroke="${C.cream}" stroke-width="4" opacity=".35"/>
  </g>
  <g>
    <rect x="26" y="486" width="58" height="48" rx="12" fill="url(#plug)" stroke="${OUT}" stroke-width="6"/>
    <path d="M44 504 H66 M44 516 H66" stroke="${C.ink}" stroke-width="4" opacity=".45"/>
  </g>`, {
    defs: `${linear('plug', [[0, '#7A869F'], [.4, '#434F69'], [1, '#202941']], { x1: 0, y1: 0, x2: 1, y2: 0 })}
    ${patternDefs(name)}`,
  });
}
function patternDefs(name) {
  const base = {
    red: `<pattern id="wirePattern" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><rect width="18" height="18" fill="none"/><rect width="7" height="18" fill="#B51F34" opacity=".8"/></pattern>`,
    blue: `<pattern id="wirePattern" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(90)"><rect width="20" height="20" fill="none"/><rect width="20" height="4" fill="#1453B8" opacity=".65"/></pattern>`,
    yellow: `<pattern id="wirePattern" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="2.5" fill="#B98410" opacity=".8"/></pattern>`,
    green: `<pattern id="wirePattern" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M0 10 L10 0 M10 20 L20 10" stroke="#168A55" stroke-width="4" opacity=".7"/></pattern>`,
    white: `<pattern id="wirePattern" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#9AA4BA" opacity=".45"/><rect x="10" y="10" width="10" height="10" fill="#9AA4BA" opacity=".45"/></pattern>`,
  }[name];
  const marker = {
    red: `<path d="M55 246 l18 30 h-36z" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/>`,
    blue: `<rect x="40" y="259" width="30" height="30" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/>`,
    yellow: `<circle cx="55" cy="274" r="18" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/>`,
    green: `<path d="M37 256 l36 36 M73 256 l-36 36" stroke="${C.cream}" stroke-width="9" stroke-linecap="round"/>`,
    white: `<path d="${starPath(55, 274, 20, 9)}" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>`,
  }[name];
  return `${base}<path d="M55 28 C30 90 80 132 55 200 C30 268 80 310 55 378 C30 446 80 486 55 512" stroke="url(#wirePattern)" stroke-width="26" fill="none" stroke-linecap="round" opacity=".85"/>${marker}`;
}
A('puzzles/wire-red.svg', wire('red', C.red, C.redLight), { group: 'Puzzle Object', size: '110×540', format: 'SVG', tags: ['wire', 'red'], note: 'Colour-blind marker: triangle + diagonal stripe.' });
A('puzzles/wire-blue.svg', wire('blue', C.blue, C.blueLight), { group: 'Puzzle Object', size: '110×540', format: 'SVG', tags: ['wire', 'blue'], note: 'Colour-blind marker: square + straight line.' });
A('puzzles/wire-yellow.svg', wire('yellow', C.yellow, C.yellowLight), { group: 'Puzzle Object', size: '110×540', format: 'SVG', tags: ['wire', 'yellow'], note: 'Colour-blind marker: circle + dots.' });
A('puzzles/wire-green.svg', wire('green', C.green, C.greenLight), { group: 'Puzzle Object', size: '110×540', format: 'SVG', tags: ['wire', 'green'], note: 'Colour-blind marker: X + zigzag.' });
A('puzzles/wire-white.svg', wire('white', C.cream, '#FFFFFF'), { group: 'Puzzle Object', size: '110×540', format: 'SVG', tags: ['wire', 'white'], note: 'Colour-blind marker: star + checker.' });

function scissors() {
  return svgDoc(190, 160, `
  <g transform="rotate(-18 95 80)" filter="url(#scShadow)">
    <path d="M44 34 L136 118" stroke="${OUT}" stroke-width="34" stroke-linecap="round"/>
    <path d="M44 34 L136 118" stroke="#DDE6F4" stroke-width="18" stroke-linecap="round"/>
    <path d="M146 34 L54 118" stroke="${OUT}" stroke-width="34" stroke-linecap="round"/>
    <path d="M146 34 L54 118" stroke="#AEBACD" stroke-width="18" stroke-linecap="round"/>
    <path d="M52 40 L128 108" stroke="#FFFFFF" stroke-width="4" opacity=".55"/>
    <circle cx="95" cy="80" r="17" fill="${C.yellow}" stroke="${OUT}" stroke-width="6"/>
    <circle cx="95" cy="80" r="6" fill="#0A101C"/>
    <path d="M22 96 C10 76 20 58 40 56 C50 56 58 62 62 70" stroke="${C.red}" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M168 96 C180 76 170 58 150 56 C140 56 132 62 128 70" stroke="${C.red}" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M20 94 C14 80 18 68 30 62" stroke="#FF9A9F" stroke-width="4" fill="none" opacity=".6"/>
  </g>`, { defs: shadow('scShadow', 8, 10, .4) });
}
A('puzzles/scissors.svg', scissors(), { group: 'Puzzle Object', size: '190×160', format: 'SVG', tags: ['wire-cutter', 'tool'], note: 'Cursor follows finger while swiping.' });

function glitchPopup() {
  const W = 780, H = 300;
  return svgDoc(W, H, `
  <g filter="url(#glDrop)">
    <rect x="22" y="28" width="736" height="244" rx="18" fill="${C.blue}" opacity=".25" transform="translate(-10 4)"/>
    <rect x="22" y="28" width="736" height="244" rx="18" fill="${C.red}" opacity=".2" transform="translate(10 0)"/>
    <rect x="18" y="24" width="744" height="244" rx="18" fill="#F6EAD6" stroke="${OUT}" stroke-width="9"/>
    <path d="M18 56 H762 V0 H18 Z" fill="${C.red}" stroke="${OUT}" stroke-width="6"/>
    <g stroke="${C.ink}" stroke-width="4" opacity=".65"><path d="M18 108 H762 M18 164 H762 M18 220 H762"/></g>
    <g opacity=".22" fill="#0A101C"><rect x="18" y="110" width="744" height="6"/><rect x="18" y="166" width="744" height="6"/><rect x="18" y="222" width="744" height="6"/></g>
    <rect x="54" y="74" width="86" height="42" rx="8" fill="${C.ink}" opacity=".8"/>
    <path d="M68 90 H114 M68 102 H98" stroke="${C.yellow}" stroke-width="4" opacity=".8"/>
    <g fill="#0A101C" opacity=".55"><rect x="54" y="182" width="356" height="10" rx="5"/><rect x="54" y="204" width="280" height="10" rx="5"/></g>
    <rect x="596" y="70" width="126" height="46" rx="9" fill="${C.ink}"/>
    <path d="M644 84 L628 100 H644 L636 114 L662 92 H646 L654 84Z" fill="${C.yellow}"/>
    <g transform="translate(596 180)"><rect width="126" height="42" rx="8" fill="${C.steel}" stroke="${OUT}" stroke-width="4"/><path d="M18 21 H108" stroke="${C.cream}" stroke-width="4" stroke-linecap="round" opacity=".5"/></g>
    <path d="M18 268 H762" stroke="${C.blue}" stroke-width="4" opacity=".4"/>
  </g>`, { defs: shadow('glDrop', 16, 20, .5) });
}
A('puzzles/glitch-popup.svg', glitchPopup(), { group: 'Puzzle Object', size: '780×300', format: 'SVG', tags: ['sabotage', 'glitch'], note: 'Fake system error modal; text rendered at runtime.' });

function vuMeter() {
  return svgDoc(520, 320, `
  <rect x="6" y="6" width="508" height="308" rx="24" fill="url(#vuFrame)" stroke="${OUT}" stroke-width="8"/>
  <rect x="28" y="28" width="464" height="264" rx="14" fill="#080D18" stroke="#000" stroke-width="4"/>
  <g opacity=".25" stroke="${C.steelLight}" stroke-width="2">${Array.from({ length: 25 }, (_, i) => `<path d="M${44 + i * 17} 246 V${226 - i * 2}"/>`).join('')}</g>
  <path d="M50 236 C150 210 300 160 470 120" stroke="${C.steel}" stroke-width="4" fill="none" stroke-dasharray="4 8"/>
  <circle cx="84" cy="258" r="38" fill="#101726" stroke="${C.ink}" stroke-width="5"/>
  <path d="M70 262 A18 18 0 0 1 100 244" stroke="${C.green}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M84 258 L98 244" stroke="${C.yellow}" stroke-width="4" stroke-linecap="round"/>
  <g fill="${C.green}"><rect x="286" y="62" width="10" height="16" rx="2"/><rect x="302" y="56" width="10" height="22" rx="2"/><rect x="318" y="48" width="10" height="30" rx="2"/></g>
  <g fill="${C.red}"><rect x="398" y="44" width="10" height="22" rx="2"/><rect x="414" y="38" width="10" height="28" rx="2"/><rect x="430" y="30" width="10" height="36" rx="2"/></g>
  ${screw(24, 24, 6)}${screw(496, 24, 6)}${screw(24, 296, 6)}${screw(496, 296, 6)}`, {
    defs: `${linear('vuFrame', [[0, '#66728C'], [.2, '#3A4560'], [1, '#1B2234']], { x1: 0, y1: 0, x2: 1, y2: 1 })}`,
  });
}
A('puzzles/vu-meter.svg', vuMeter(), { group: 'Puzzle Object', size: '520×320', format: 'SVG', tags: ['acoustic', 'meter'], note: 'VU meter chassis; needle and fill are runtime graphics.' });

/* ================================================================== *
 *  FX
 * ================================================================== */
A('fx/fx-spark.svg', svgDoc(128, 128, `
<g filter="url(#g)"><path d="${burstPath(64, 64, 60, 12, 4, .9)}" fill="${C.yellow}"/><path d="${burstPath(64, 64, 32, 7, 4, .9)}" fill="#FFFBE8"/></g>`, {
  defs: glow('g', C.yellow, 10),
}), { group: 'FX', size: '128×128', format: 'SVG', tags: ['particle', 'spark'], note: 'Touch feedback / cut spark. Additive blend.' });

A('fx/fx-smoke.svg', svgDoc(512, 512, `
<g filter="url(#soft)">
  <circle cx="196" cy="266" r="150" fill="url(#smoke)"/>
  <circle cx="318" cy="214" r="126" fill="url(#smoke)"/>
  <circle cx="346" cy="330" r="134" fill="url(#smoke)"/>
  <circle cx="158" cy="356" r="104" fill="url(#smoke)"/>
  <circle cx="256" cy="166" r="102" fill="url(#smoke)"/>
  <ellipse cx="256" cy="400" rx="190" ry="68" fill="#4D5465" opacity=".65"/>
</g>`, {
  defs: `${radial('smoke', [[0, '#AAB2C2', .95], [.55, '#737C8E', .88], [1, '#3D4351', .0]], { cx: .45, cy: .35, r: .65 })}${blur('soft', 7)}`,
}), { group: 'FX', size: '512×512', format: 'SVG', tags: ['sabotage', 'smoke'], note: 'Layer 20–30 instances for Smoke Screen.' });

A('fx/fx-smoke-dark.svg', svgDoc(512, 512, `
<g filter="url(#soft)">
  <circle cx="188" cy="272" r="150" fill="url(#smoke)"/>
  <circle cx="330" cy="220" r="130" fill="url(#smoke)"/>
  <circle cx="356" cy="342" r="126" fill="url(#smoke)"/>
  <circle cx="164" cy="368" r="100" fill="url(#smoke)"/>
  <circle cx="252" cy="168" r="110" fill="url(#smoke)"/>
</g>`, {
  defs: `${radial('smoke', [[0, '#6A7180', .95], [.6, '#393E4B', .9], [1, '#171B24', 0]], { cx: .45, cy: .35, r: .65 })}${blur('soft', 7)}`,
}), { group: 'FX', size: '512×512', format: 'SVG', tags: ['sabotage', 'smoke'], note: 'Dark smoke variant.' });

A('fx/fx-ice.svg', svgDoc(1700, 760, `
<rect x="0" y="0" width="1700" height="760" fill="url(#ice)" opacity=".7"/>
<rect x="0" y="0" width="1700" height="760" fill="url(#crystals)" opacity=".5"/>
<g stroke="#DFF7FF" stroke-opacity=".45" stroke-width="3" fill="none">
  <path d="M60 90 L260 240 L240 460 L90 620 M260 240 L520 180 L700 360 L620 600 L420 700 M700 360 L980 220 L1180 380 L1300 620 M1180 380 L1460 260 L1640 420 M1300 620 L1560 700"/>
  <path d="M520 180 L480 40 M980 220 L1010 60 M420 700 L360 740 M1180 380 L1200 740"/>
  <path d="M260 240 L300 440 L500 380 M700 360 L620 540 L880 520 M1300 620 L1240 460"/>
</g>
<g fill="#FFFFFF" opacity=".12"><path d="M100 100 L180 130 L120 220 Z"/><path d="M1480 100 L1600 160 L1500 240 Z"/><path d="M800 620 L900 700 L780 740 Z"/></g>
<rect x="0" y="0" width="1700" height="760" fill="none" stroke="#AEEBFF" stroke-width="18" stroke-opacity=".25"/>`, {
  defs: `${linear('ice', [[0, '#9CE7FF', .55], [.45, '#4CA6D8', .18], [1, '#8FD8FF', .42]])}
  <pattern id="crystals" width="180" height="180" patternUnits="userSpaceOnUse"><path d="M0 90 L90 0 L180 90 L90 180 Z" fill="none" stroke="#DFF8FF" stroke-opacity=".18" stroke-width="2"/></pattern>`,
}), { group: 'FX', size: '1700×760', format: 'SVG (+PNG)', tags: ['sabotage', 'ice'], note: 'Cryo Freeze overlay for work zone.' });

A('fx/fx-glass-crack.svg', svgDoc(1920, 1080, `
<g fill="none" stroke="#EAF7FF" stroke-opacity=".75" stroke-linecap="round">
  <path d="M960 560 L820 380 L790 220 M960 560 L1100 360 L1160 180 M960 560 L760 620 L540 560 L380 620 M960 560 L1160 660 L1380 620 L1540 700 M960 560 L920 760 L1020 940 M960 560 L820 760 L700 900 M960 560 L1040 720 L1260 840" stroke-width="5"/>
  <path d="M960 560 L880 470 L900 300 M960 560 L1040 460 L1060 280 M960 560 L840 540 L660 470 M960 560 L1080 540 L1240 460" stroke-width="2.5" opacity=".7"/>
  <g stroke-width="2" opacity=".4">
    <path d="M380 620 L420 700 L520 760 L540 860"/>
    <path d="M1380 620 L1320 720 L1380 820"/>
    <path d="M790 220 L720 180 L680 120"/>
    <path d="M1160 180 L1220 120"/>
    <path d="M1020 940 L980 1040 L1020 1080"/>
  </g>
</g>
<g fill="#BFE9FF" opacity=".08">
  <path d="M960 560 L820 380 L760 620 L840 760 Z"/>
  <path d="M960 560 L1100 360 L1160 660 L1040 720 Z"/>
  <path d="M960 560 L760 620 L540 560 L660 470 Z"/>
</g>
<circle cx="960" cy="560" r="38" fill="#FFFFFF" opacity=".12"/>
<circle cx="960" cy="560" r="12" fill="#FFFFFF" opacity=".3"/>`), {
  group: 'FX', size: '1920×1080', format: 'SVG (+PNG)', tags: ['defeat', 'glass'], note: 'Glass shatter overlay for detonation.',
});

A('fx/fx-explosion.svg', svgDoc(1400, 1400, `
<g filter="url(#eg)">
  <path d="${burstPath(700, 700, 640, 280, 24, .72)}" fill="#4B1B6B" opacity=".85"/>
  <path d="${burstPath(700, 700, 540, 250, 22, .76)}" fill="${C.red}"/>
  <path d="${burstPath(700, 700, 430, 210, 20, .78)}" fill="${C.orange}"/>
  <path d="${burstPath(700, 700, 330, 170, 18, .8)}" fill="${C.yellow}"/>
  <path d="${burstPath(700, 700, 220, 130, 14, .76)}" fill="#FFF6C7"/>
  <path d="${burstPath(700, 700, 98, 60, 9, .84)}" fill="#FFFFFF"/>
</g>
<g fill="${C.ink}" opacity=".75">
  <path d="M240 360 l60 20 -44 44z"/><path d="M1060 240 l36 70 -74 4z"/><path d="M1130 900 l54 28 -40 46z"/><path d="M340 960 l30 58 -62-2z"/>
</g>
<g stroke="${C.yellow}" stroke-width="10" stroke-linecap="round" opacity=".9">
  <path d="M140 700 H300 M1100 700 H1260 M700 120 V260 M700 1140 V1280"/>
  <path d="M280 280 l96 96 M1024 1024 l96 96 M1120 280 l-96 96 M280 1120 l96-96"/>
</g>
<g fill="#FFFFFF" opacity=".55"><circle cx="440" cy="440" r="9"/><circle cx="960" cy="380" r="7"/><circle cx="500" cy="940" r="8"/><circle cx="1040" cy="980" r="6"/><circle cx="700" cy="700" r="12"/></g>`, {
  defs: `${glow('eg', C.orange, 24)}`,
}), { group: 'FX', size: '1400×1400', format: 'SVG (+PNG)', tags: ['explosion', 'defeat'], note: 'Comic detonation burst. Scale to 1.6× viewport.' });

A('fx/fx-shockwave.svg', svgDoc(600, 600, `
<circle cx="300" cy="300" r="250" fill="none" stroke="#FFF4C4" stroke-width="18" opacity=".8"/>
<circle cx="300" cy="300" r="210" fill="none" stroke="${C.yellow}" stroke-width="8" opacity=".6"/>
<circle cx="300" cy="300" r="160" fill="none" stroke="${C.orange}" stroke-width="4" opacity=".45" stroke-dasharray="4 14"/>`), {
  group: 'FX', size: '600×600', format: 'SVG', tags: ['impact', 'ring'], note: 'Impact ring; scale/fade at runtime.',
});

A('fx/fx-flame.svg', svgDoc(280, 360, `
<path d="M140 20 C200 120 250 170 230 260 C216 326 170 350 140 340 C110 350 64 326 50 260 C30 170 80 120 140 20Z" fill="url(#flame)"/>
<path d="M140 110 C176 170 198 204 186 254 C178 290 158 308 140 304 C122 308 102 290 94 254 C82 204 104 170 140 110Z" fill="#FFE06A" opacity=".9"/>
<path d="M140 190 C158 220 164 244 156 260 C150 274 146 278 140 276 C134 278 130 274 124 260 C116 244 122 220 140 190Z" fill="#FFFBE8"/>`, {
  defs: `${radial('flame', [[0, '#FFF2A8'], [.4, '#FFC928'], [.72, '#FF7A2E'], [1, '#FF414D', .2]], { cx: .5, cy: .75, r: .7 })}`,
}), { group: 'FX', size: '280×360', format: 'SVG', tags: ['fire'], note: 'Flame particle.' });

A('fx/fx-electric.svg', svgDoc(520, 180, `
<g filter="url(#el)">
  <path d="M10 100 L88 82 L130 118 L196 54 L260 108 L330 34 L392 100 L456 60 L510 88" stroke="#8FE7FF" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10 100 L88 82 L130 118 L196 54 L260 108 L330 34 L392 100 L456 60 L510 88" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<g fill="${C.blueLight}" opacity=".55"><circle cx="88" cy="82" r="6"/><circle cx="260" cy="108" r="5"/><circle cx="392" cy="100" r="6"/></g>`, {
  defs: glow('el', '#59D8FF', 14),
}), { group: 'FX', size: '520×180', format: 'SVG', tags: ['link', 'electric'], note: 'Arc between two held sensors.' });

for (let i = 0; i < 3; i++) {
  A(`fx/fx-confetti-${i + 1}.svg`, svgDoc(64, 36, `
<g transform="rotate(${i * 12 - 12} 32 18)">
  <rect x="6" y="8" width="52" height="20" rx="5" fill="${[C.red, C.yellow, C.blue][i]}" stroke="${OUT}" stroke-width="3"/>
  <path d="M14 14 H36" stroke="#FFF" stroke-width="3" stroke-linecap="round" opacity=".45"/>
</g>`), { group: 'FX', size: '64×36', format: 'SVG', tags: ['confetti', 'victory'], note: 'Confetti particle; add purple/green variants at runtime.' });
}

A('fx/fx-flash-rays.svg', svgDoc(1400, 1400, `
<g opacity=".85">
  ${Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2;
    const w = .05 + (i % 3) * .014;
    return `<path d="M700 700 L${700 + Math.cos(a - w) * 690} ${700 + Math.sin(a - w) * 690} L${700 + Math.cos(a + w) * 690} ${700 + Math.sin(a + w) * 690} Z" fill="${i % 2 ? '#FFFFFF' : C.yellow}" opacity="${i % 2 ? .18 : .3}"/>`;
  }).join('')}
</g>
<circle cx="700" cy="700" r="360" fill="url(#core)" opacity=".55"/>`, {
  defs: radial('core', [[0, '#FFFFFF', .9], [.35, C.yellow, .4], [1, C.yellow, 0]]),
}), { group: 'FX', size: '1400×1400', format: 'SVG', tags: ['victory', 'rays'], note: 'Rotating victory flash behind logo.' });

A('fx/fx-speedlines.svg', svgDoc(1600, 900, `
<g stroke="#FFFFFF" stroke-linecap="round">
  ${Array.from({ length: 26 }, (_, i) => {
    const y = 60 + i * 31;
    const len = 120 + ((i * 53) % 340);
    return `<path d="M${-40 + (i % 5) * 80} ${y} H${len}" stroke-width="${2 + (i % 3)}" stroke-opacity="${.08 + (i % 4) * .05}"/>`;
  }).join('')}
</g>`), { group: 'FX', size: '1600×900', format: 'SVG', tags: ['speed', 'motion'], note: 'Subtle anime speed lines overlay.' });

/* ================================================================== *
 *  BRAND EMBLEM (text-free)
 * ================================================================== */
A('brand/logo-mark.svg', svgDoc(640, 640, `
<g filter="url(#lShadow)">
  <path d="${burstPath(320, 320, 300, 170, 22, .8)}" fill="${C.yellow}" stroke="${OUT}" stroke-width="12"/>
  <path d="${burstPath(320, 320, 240, 155, 18, .84)}" fill="${C.red}"/>
  <circle cx="320" cy="336" r="158" fill="#161B2D" stroke="${OUT}" stroke-width="14"/>
  <path d="M196 190 C236 126 404 126 444 190 L432 226 H208 Z" fill="url(#cap)" stroke="${OUT}" stroke-width="12"/>
  <path d="M320 142 C316 92 360 72 378 30" stroke="${OUT}" stroke-width="30" fill="none" stroke-linecap="round"/>
  <path d="M320 142 C316 92 360 72 378 30" stroke="#D29A4B" stroke-width="16" fill="none" stroke-linecap="round"/>
  <g filter="url(#lGlow)"><path d="${burstPath(386, 24, 52, 20, 8)}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="4"/></g>
  <circle cx="320" cy="336" r="150" fill="none" stroke="${C.purple}" stroke-opacity=".3" stroke-width="4"/>
  <path d="M200 386 C208 448 432 448 440 386" stroke="${C.yellow}" stroke-width="38" opacity=".9" clip-path="url(#roundClip)"/>
  <clipPath id="roundClip"><circle cx="320" cy="336" r="150"/></clipPath>
  <g>
    <ellipse cx="266" cy="310" rx="34" ry="40" fill="#FFF8E8" stroke="${OUT}" stroke-width="7"/>
    <ellipse cx="374" cy="310" rx="34" ry="40" fill="#FFF8E8" stroke="${OUT}" stroke-width="7"/>
    <ellipse cx="276" cy="318" rx="14" ry="17" fill="#171021"/>
    <ellipse cx="364" cy="318" rx="14" ry="17" fill="#171021"/>
    <path d="M282 390 Q320 424 358 390" fill="#2A1020" stroke="${OUT}" stroke-width="7"/>
    <path d="M298 396 Q320 410 342 396" fill="#FFF8E8"/>
  </g>
  <path d="M194 236 C250 210 390 210 446 236" stroke="#FFFFFF" stroke-opacity=".18" stroke-width="8" stroke-linecap="round"/>
</g>`, {
  defs: `${radial('cap', [[0, '#7A87A2'], [.4, '#3A445C'], [1, '#141B2B']], { cx: .4, cy: .2, r: .8 })}
  ${glow('lGlow', C.orange, 16)}${shadow('lShadow', 18, 20, .45)}`,
}), { group: 'Brand', size: '640×640', format: 'SVG (+PNG)', tags: ['logo-mark', 'emblem'], note: 'Icon-only brand mark. Full wordmark is PNG (see brand/logo-lockup.png).' });

A('ui/caution-tape.svg', svgDoc(512, 64, `
<rect width="512" height="64" fill="url(#haz)"/>
<path d="M0 8 H512" stroke="#FFFFFF" stroke-opacity=".15" stroke-width="3"/>
<path d="M0 58 H512" stroke="#000" stroke-opacity=".3" stroke-width="4"/>`, {
  defs: hazardDefs('haz', 36, C.yellow, C.ink),
}), { group: 'HUD', size: '512×64', format: 'SVG', tags: ['tile', 'hazard'], note: 'Repeat horizontally for event theming.' });
