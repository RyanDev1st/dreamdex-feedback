// Dev helper: compare identifiers named in docs against the real SDK surface.
import fs from 'node:fs';
import * as s from '@somnia-chain/markets-sdk';
import { hidekiTestnet } from '@somnia-chain/markets-sdk/chains';
const m = new s.SomniaMarkets({ chain: hidekiTestnet, indexerUrl: 'https://hideki-dev.smk.somnia.host/v1/graphql', addresses: s.SOMNIA_HIDEKI_TESTNET_ADDRESSES, privateKey: '0x' + '11'.repeat(32) });
const names = o => { const r = new Set(); for (let p = o; p && p !== Object.prototype; p = Object.getPrototypeOf(p)) Object.getOwnPropertyNames(p).forEach(n => r.add(n)); return r; };
const mk=(o)=>({has:(n)=>typeof o[n]!=='undefined'});
export const client = mk(m.client), trader = mk(m.trader), ex = mk(m), top = new Set(Object.keys(s));
const src = process.argv[2];
const txt = fs.readFileSync(src, 'utf8');
for (const [pre, set] of [['client', client], ['trader', trader], ['exchange', ex], ['markets', ex]]) {
  const re = new RegExp(String.raw`\b${pre}\.(\w+)`, 'g'); let x; const miss = new Map();
  while ((x = re.exec(txt))) if (!set.has(x[1])) miss.set(x[1], (miss.get(x[1]) || 0) + 1);
  console.log(pre, 'missing:', [...miss.keys()].join(' '));
}
const re2 = /`(\w*[Pp]erp\w*)/g; let y; const mm = new Set();
while ((y = re2.exec(txt))) { const n = y[1]; if (!client.has(n) && !trader.has(n) && !top.has(n) && !ex.has(n) && /^[a-z]/.test(n)) mm.add(n); }
console.log('perp-ish names not in SDK:', [...mm].join(' '));
process.exit(0);
