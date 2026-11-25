const fs = require('fs');
const path = require('path');
const f = 'C:/Users/Lenovo/.local/share/opencode/tool-output/tool_20cc395ea00107PPVpqbDvnrkd';
const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/);
const line = lines.find((l) => l.startsWith('{"icon-'));
if (!line) { console.log('no json'); process.exit(1); }
const data = JSON.parse(line);
const dir = 'assets/exports/icons';
fs.mkdirSync(dir, { recursive: true });
let n = 0;
for (const [k, v] of Object.entries(data)) {
  fs.writeFileSync(path.join(dir, k + '.png'), Buffer.from(v.split(',')[1], 'base64'));
  n++;
}
console.log('wrote', n, 'png');
