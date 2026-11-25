/** Builds assets/exports/export-manifest.json from the PNG mirror. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'exports');
const assets = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.name.endsWith('.png')) continue;
    const data = fs.readFileSync(full);
    const rel = path.relative(root, full).split(path.sep).join('/');
    const svgRel = rel.replace(/\.png$/, '.svg');
    const svgPath = path.join(root, '..', svgRel);
    const hasSvg = fs.existsSync(svgPath);
    assets.push({
      path: rel,
      source: hasSvg ? `assets/${svgRel}` : `assets/exports/${rel}`,
      sourceType: hasSvg ? 'SVG' : 'PNG-master',
      width: data.readUInt32BE(16),
      height: data.readUInt32BE(20),
      sizeBytes: data.length,
      format: 'PNG',
      transparent: !rel.startsWith('backgrounds/bg-'),
    });
  }
}

walk(root);
assets.sort((a, b) => a.path.localeCompare(b.path));
const manifest = {
  name: 'BOM CHALLENGE! — PNG export mirror',
  count: assets.length,
  note: '1x PNG mirror of the modular source pack. Runtime UI assets use transparent backgrounds; full-bleed backgrounds are opaque. Source SVGs remain in /assets, PNG masters for avatars/logo in /assets/characters and /assets/brand.',
  assets,
};
fs.writeFileSync(path.join(root, 'export-manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Wrote ${assets.length} PNG export entries.`);
console.log(`SVG-sourced: ${assets.filter((a) => a.sourceType === 'SVG').length}, PNG masters: ${assets.filter((a) => a.sourceType === 'PNG-master').length}`);
