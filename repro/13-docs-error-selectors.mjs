// Verify every "0xSELECTOR Name(args)" pair in the developer docs (errors page) equals keccak256("Name(argTypes)")[:4].
import fs from 'node:fs';
import { toFunctionSelector } from 'viem';
const url = 'https://app.testnet.dreamdex.io/docs/developers/contracts/errors';
let html = await (await fetch(url)).text();
const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/\s+/g, ' ');
const re = /(0x[0-9a-fA-F]{8})\s+([A-Za-z0-9_]+)\(([^)]*)\)/g;
let m, n = 0, bad = 0; const seen = new Set();
while ((m = re.exec(text))) {
  const [, sel, name, args] = m;
  const types = args.split(',').map(s => s.trim().split(/\s+/)[0]).filter(Boolean).join(',');
  const sig = `${name}(${types})`;
  let calc; try { calc = toFunctionSelector(sig); } catch { continue; }
  const key = sel + sig; if (seen.has(key)) continue; seen.add(key); n++;
  if (calc.toLowerCase() !== sel.toLowerCase()) { bad++; console.log('MISMATCH doc', sel, sig, '-> keccak gives', calc); }
}
console.log(`checked ${n} selector/signature pairs, ${bad} mismatches`);
