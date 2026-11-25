/** Downloads the new comic font set and rebuilds assets/fonts/fonts.css. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fontDir = path.join(root, 'assets', 'fonts');
fs.mkdirSync(fontDir, { recursive: true });

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const url = 'https://fonts.googleapis.com/css2?family=Bungee&family=Fredoka+One&family=Luckiest+Guy&family=Varela+Round&display=swap';

const css = await (await fetch(url, { headers: { 'User-Agent': UA } })).text();
const blocks = [...css.matchAll(/\/\*\s*latin\s*\*\/\s*@font-face\s*{([^}]+)}/g)].map((m) => m[1]);
const faces = [];
for (const block of blocks) {
  const family = (block.match(/font-family:\s*'([^']+)'/) || [])[1];
  const weight = (block.match(/font-weight:\s*(\d+)/) || [])[1];
  const src = (block.match(/url\((https:[^)]+\.woff2)\)/) || [])[1];
  if (!family || !weight || !src) continue;
  const safe = family.replace(/\s+/g, '') + '-' + weight + '.woff2';
  const file = path.join(fontDir, safe);
  if (!fs.existsSync(file)) {
    const buf = Buffer.from(await (await fetch(src)).arrayBuffer());
    fs.writeFileSync(file, buf);
  }
  faces.push({ family, weight, file: safe });
}

const old = `
/* Legacy comic set retained for archive/docs. */
@font-face { font-family: 'Bangers'; src: url('Bangers-Regular.woff2') format('woff2'); font-display: swap; }
@font-face { font-family: 'Lilita One'; src: url('LilitaOne-Regular.woff2') format('woff2'); font-display: swap; }
@font-face { font-family: 'Nunito'; src: url('Nunito-ExtraBold.woff2') format('woff2'); font-weight: 800 900; font-display: swap; }
@font-face { font-family: 'Orbitron'; src: url('Orbitron-Bold.woff2') format('woff2'); font-weight: 700 900; font-display: swap; }
`;

const cssOut = faces.map(({ family, weight, file }) =>
  `@font-face { font-family: '${family}'; src: url('${file}') format('woff2'); font-weight: ${weight}; font-style: normal; font-display: swap; }`
).join('\n') + '\n' + old;

fs.writeFileSync(path.join(fontDir, 'fonts.css'), cssOut, 'utf8');
console.log(faces.map((f) => `${f.family} ${f.weight} -> ${f.file}`).join('\n'));
