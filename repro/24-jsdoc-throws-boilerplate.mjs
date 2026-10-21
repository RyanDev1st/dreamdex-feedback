// Every client method's JSDoc lists the same ~20 @throws errors with the same sentence, regardless of what the method does.
import fs from 'node:fs';
const f = 'node_modules/@somnia-chain/markets-sdk/dist/somniaMarketsClient.d.ts';
const src = fs.readFileSync(f, 'utf8');
const blocks = src.split(/\n\s*\/\*\*/).slice(1);
const sig = new Map(); let withThrows = 0;
for (const b of blocks) {
  const thr = [...b.matchAll(/@throws \{(\w+)\} (.*)/g)];
  if (!thr.length) continue; withThrows++;
  const key = thr.map(t => t[1] + '|' + t[2]).join('\n');
  sig.set(key, (sig.get(key) || 0) + 1);
}
const [topKey, topCount] = [...sig.entries()].sort((a, b) => b[1] - a[1])[0];
const lines = topKey.split('\n');
console.log(`doc blocks with @throws: ${withThrows}; blocks sharing the single most common @throws list: ${topCount}`);
console.log(`that list has ${lines.length} entries, e.g.:`);
console.log(lines.slice(0, 2).map(l => '  @throws {' + l.replace('|', '} ')).join('\n'));
const idx = src.indexOf('    getPerpRiskParams(');
const target = src.slice(src.lastIndexOf('/**', idx), idx);
const names = [...target.matchAll(/@throws \{(\w+)\}/g)].map(m => m[1]);
console.log(`getPerpRiskParams (one eth_call returning 8 numbers) documents ${names.length} @throws:`, names.join(', '));
