/** Shared SVG toolkit + art direction tokens for the BOM CHALLENGE! asset pack. */
export const C = {
  red: '#FF414D',
  redDark: '#B51F34',
  redLight: '#FF7A7F',
  yellow: '#FFC928',
  yellowDark: '#B98410',
  yellowLight: '#FFE58A',
  blue: '#2B8BFF',
  blueDark: '#1453B8',
  blueLight: '#8CC6FF',
  purple: '#B55DDC',
  purpleDark: '#6F2C99',
  purpleLight: '#E3A9FF',
  green: '#38D98A',
  greenDark: '#168A55',
  greenLight: '#A0FFD0',
  orange: '#FFB73C',
  ink: '#090D18',
  ink2: '#121828',
  navy: '#141A2E',
  navy2: '#1B2238',
  navy3: '#252E48',
  steel: '#303A55',
  steelLight: '#5A6684',
  cream: '#F6EAD6',
  white: '#FFFFFF',
  smoke: '#5B6274',
};

export const S = (n) => Number(n).toFixed(2).replace(/\.00$/, '');

export function svgDoc(w, h, body, { defs = '', extra = '' } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none"${extra}>
<defs>${defs}</defs>
${body}
</svg>`;
}

export function linear(id, stops, { x1 = 0, y1 = 0, x2 = 0, y2 = 1 } = {}) {
  return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops
    .map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`)
    .join('')}</linearGradient>`;
}

export function radial(id, stops, { cx = .5, cy = .5, r = .5 } = {}) {
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops
    .map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`)
    .join('')}</radialGradient>`;
}

export function glow(id, color, std = 12) {
  return `<filter id="${id}" x="-80%" y="-80%" width="260%" height="260%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="${std}" result="b"/>
    <feColorMatrix in="b" type="matrix" values="0 0 0 0 ${hex01(color)} 0 0 0 0 ${hex01(color)} 0 0 0 0 ${hex01(color)} 0 0 0 .85 0" result="g"/>
    <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>`;
}

export function shadow(id, dy = 10, blur = 14, opacity = .55) {
  return `<filter id="${id}" x="-40%" y="-40%" width="180%" height="190%">
    <feDropShadow dx="0" dy="${dy}" stdDeviation="${blur}" flood-color="#05070D" flood-opacity="${opacity}"/>
  </filter>`;
}

export function blur(id, std = 18) {
  return `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${std}"/></filter>`;
}

export function hex01(hex) {
  const v = hex.replace('#', '');
  return `${(parseInt(v.slice(0, 2), 16) / 255).toFixed(4)} ${(parseInt(v.slice(2, 4), 16) / 255).toFixed(4)} ${(parseInt(v.slice(4, 6), 16) / 255).toFixed(4)}`;
}

/** Fabrique de cadre / panneau. */
export function frame(w, h, {
  r = 24, fill = C.navy2, stroke = C.ink, sw = 6, inner = null, innerOpacity = .5,
  metal = false, rivets = true, inset = 12,
} = {}) {
  const defs = metal
    ? linear('metalFrame', [[0, C.steelLight], [.28, C.steel], [.62, '#1C2438'], [1, C.steel]], { x1: 0, y1: 0, x2: 1, y2: 1 })
    : '';
  const metalFill = metal ? 'url(#metalFrame)' : fill;
  let out = `<rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="${r}" fill="${C.ink}" opacity=".7"/>
<rect x="3" y="2" width="${w - 6}" height="${h - 9}" rx="${r}" fill="${metalFill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  if (inner) out += `<rect x="${inset}" y="${inset}" width="${w - inset * 2}" height="${h - inset * 2 - 3}" rx="${Math.max(4, r - 10)}" fill="${inner}" stroke="#000" stroke-opacity=".4" stroke-width="3"/>`;
  if (rivets) {
    const pts = [[inset + 8, inset + 8], [w - inset - 8, inset + 8], [inset + 8, h - inset - 8], [w - inset - 8, h - inset - 8]];
    for (const [x, y] of pts) {
      out += `<circle cx="${x}" cy="${y}" r="5.5" fill="#0B101D" stroke="#606C88" stroke-width="2"/><circle cx="${x - 1.5}" cy="${y - 1.5}" r="2" fill="#8D99B5" opacity=".55"/>`;
    }
  }
  return { out, defs };
}

export function rounded(x, y, w, h, r, fill, extra = '') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
}

export function poly(points, fill, extra = '') {
  return `<path d="M${points.map((p) => p.join(' ')).join(' L')} Z" fill="${fill}" ${extra}/>`;
}

export function starPath(cx, cy, outer, inner, points = 5, rotation = -Math.PI / 2) {
  let d = '';
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = rotation + (i * Math.PI) / points;
    d += `${i === 0 ? 'M' : 'L'}${S(cx + Math.cos(a) * r)} ${S(cy + Math.sin(a) * r)}`;
  }
  return `${d}Z`;
}

export function burstPath(cx, cy, outer, inner, spikes = 20, jitter = 0.82) {
  let d = '';
  for (let i = 0; i < spikes * 2; i++) {
    const a = (i / (spikes * 2)) * Math.PI * 2;
    const rr = i % 2 === 0 ? outer * (jitter + (i % 4) * .06) : inner;
    d += `${i === 0 ? 'M' : 'L'}${S(cx + Math.cos(a) * rr)} ${S(cy + Math.sin(a) * rr)}`;
  }
  return `${d}Z`;
}

export function hazardDefs(id, w = 26, color = C.yellow, dark = C.ink) {
  return `<pattern id="${id}" width="${w}" height="${w}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
<rect width="${w}" height="${w}" fill="${dark}"/><rect width="${w / 2}" height="${w}" fill="${color}"/></pattern>`;
}

export function gridDefs(id, size = 64, color = '#7484AD', opacity = .1) {
  return `<pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
<path d="M${size} 0 H0 V${size}" stroke="${color}" stroke-opacity="${opacity}" stroke-width="2"/></pattern>`;
}

export function dotsDefs(id, size = 26, color = '#8894B4', opacity = .16) {
  return `<pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
<circle cx="${size / 2}" cy="${size / 2}" r="2.2" fill="${color}" fill-opacity="${opacity}"/></pattern>`;
}

export function screw(x, y, r = 7) {
  return `<g><circle cx="${x}" cy="${y}" r="${r}" fill="#0A0E19" stroke="#5B6884" stroke-width="2"/><path d="M${x - r * .5} ${y - r * .5} L${x + r * .5} ${y + r * .5}" stroke="#7C88A5" stroke-width="2" stroke-linecap="round"/></g>`;
}

export function metalPipe(d, width = 40, base = C.steel, highlight = C.steelLight) {
  return `<path d="${d}" stroke="${C.ink}" stroke-width="${width + 10}" fill="none" stroke-linecap="round"/>
<path d="${d}" stroke="${base}" stroke-width="${width}" fill="none" stroke-linecap="round"/>
<path d="${d}" stroke="${highlight}" stroke-width="${width * .22}" fill="none" stroke-linecap="round" opacity=".5" transform="translate(-${width * .18} ${-width * .18})"/>`;
}
