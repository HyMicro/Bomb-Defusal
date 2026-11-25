/**
 * BOM CHALLENGE! modular SVG asset pack generator.
 * Run: node tools/generate-assets.mjs
 * Output: /assets/** + /assets/asset-manifest.json + /docs/asset-catalog.html
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { uiAssets } from './assets/ui.mjs';
import { artAssets } from './assets/art.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const assetsRoot = path.join(root, 'assets');

const all = [...uiAssets, ...artAssets];
const seen = new Set();

for (const asset of all) {
  if (seen.has(asset.path)) throw new Error(`Duplicate asset path: ${asset.path}`);
  seen.add(asset.path);
  const outPath = path.join(assetsRoot, asset.path);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, asset.svg, 'utf8');
}

const manifest = {
  name: 'BOMB DEFUSAL: CHAOS EDITION — UI & Art Asset Pack',
  version: '2.0.0',
  generated: new Date().toISOString(),
  palette: {
    red: '#FF414D', yellow: '#FFC928', blue: '#2B8BFF', purple: '#B55DDC',
    green: '#38D98A', darkNavy: '#141A2E', ink: '#090D18', cream: '#F6EAD6', orange: '#FFB73C',
  },
  fonts: {
    display: 'Bangers', heading: 'Lilita One', body: 'Nunito ExtraBold', digital: 'Orbitron',
  },
  assets: all.map(({ svg, ...rest }) => rest),
};
fs.writeFileSync(path.join(assetsRoot, 'asset-manifest.json'), JSON.stringify(manifest, null, 2));

/* Asset catalogue for visual QA. */
const groups = [...new Set(all.map((a) => a.group))];
const groupSections = groups.map((group) => {
  const items = all.filter((a) => a.group === group).map((a) => `
    <figure class="asset">
      <div class="asset-img"><img src="../../assets/${a.path}" alt="${a.path}" loading="lazy"></div>
      <figcaption><strong>${path.basename(a.path)}</strong><span>${a.size || ''}</span><small>${a.note || ''}</small></figcaption>
    </figure>`).join('');
  return `<section id="${group.toLowerCase().replace(/\s+/g, '-')}"><h2>${group}</h2><div class="grid">${items}</div></section>`;
}).join('\n');

const catalog = `<!DOCTYPE html>
<html lang="id"><head><meta charset="utf-8"><title>BOM CHALLENGE! — Asset Catalog</title>
<link rel="stylesheet" href="../../assets/fonts/fonts.css">
<style>
*{box-sizing:border-box}body{margin:0;background:#0b0f1c;color:#f6ead6;font-family:'Nunito',sans-serif}
header{padding:48px 5vw 24px;background:linear-gradient(120deg,#2a1d46,#111827);border-bottom:4px solid #ffc928}
h1{font-family:'Bangers',sans-serif;font-size:64px;letter-spacing:2px;margin:0;color:#ffc928;-webkit-text-stroke:2px #090d18;text-shadow:0 6px 0 #ff414d}
p.sub{color:#aeb9d6;max-width:850px;line-height:1.6;margin:12px 0 24px}
nav{display:flex;flex-wrap:wrap;gap:8px}nav a{color:#0b0f1c;background:#ffc928;padding:6px 12px;border-radius:99px;font-weight:900;text-decoration:none;font-size:12px;text-transform:uppercase;letter-spacing:.04em}
section{padding:32px 5vw 8px}h2{font-family:'Lilita One';font-size:22px;text-transform:uppercase;color:#2b8bff;letter-spacing:.08em;border-bottom:1px solid #303a55;padding-bottom:10px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:16px;margin-top:18px}
.asset{margin:0;background:#141a2e;border:1px solid #2d3852;border-radius:14px;overflow:hidden;display:flex;flex-direction:column;min-height:210px}
.asset-img{height:150px;display:grid;place-items:center;padding:14px;background:repeating-conic-gradient(#1a2134 0% 25%,#151b2c 0% 50%) 50%/24px 24px;overflow:hidden}
.asset-img img{max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 6px 10px rgba(0,0,0,.4))}
figcaption{padding:10px 12px;display:grid;gap:3px}
figcaption strong{font-size:11px;color:#f6ead6;word-break:break-word;font-family:'Orbitron'}
figcaption span{font-size:10px;color:#ffc928;font-family:'Orbitron'}
figcaption small{font-size:10px;color:#8f9bbd;line-height:1.45}
</style></head><body>
<header><h1>BOM CHALLENGE! ASSET PACK</h1><p class="sub">${all.length} modul aset SVG transparan. Katalog ini adalah QA sheet untuk melihat seluruh komponen terpisah. Palet: merah #FF414D, kuning #FFC928, biru elektrik #2B8BFF, ungu neon #B55DDC, dark navy #141A2E.</p><nav>${groups.map((g) => `<a href="#${g.toLowerCase().replace(/\s+/g, '-')}">${g}</a>`).join('')}</nav></header>
${groupSections}
<footer style="padding:32px 5vw;color:#6f7d9e;font-size:12px">Generated ${new Date().toLocaleString('id-ID')} · Fonts: Bangers, Lilita One, Nunito ExtraBold, Orbitron (OFL).</footer>
</body></html>`;
fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs', 'asset-catalog.html'), catalog);

console.log(`Generated ${all.length} SVG assets.`);
const counts = groups.map((g) => `${g}: ${all.filter((a) => a.group === g).length}`).join(' · ');
console.log(counts);
console.log(`Manifest: assets/asset-manifest.json`);
console.log(`Catalog:  docs/asset-catalog.html`);
