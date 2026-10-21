// listPerpPositions (indexer, "size is signed") vs getPerpPosition (chain) for accounts that hold positions.
import { make } from './_env.mjs';
const c = make().client;
const perps = await c.listPerpMarkets();
const accounts = new Set();
for (const sym of ['BTC', 'ETH', 'SOL']) {
  const p = perps.find(x => x.baseSymbol === sym);
  for (const isLong of [true, false]) (await c.getPerpSideHolders({ marginBank: p.marginBank, pool: p.poolAddress, isLong }, { pageSize: 40 })).holders.slice(0, 10).forEach(a => accounts.add(a));
}
let rows = 0, diffs = 0;
for (const account of accounts) {
  const idx = await c.listPerpPositions(account);
  for (const r of idx) {
    const chain = await c.getPerpPosition({ marginBank: perps[0].marginBank, pool: r.pool, account });
    rows++;
    if (BigInt(r.size) !== chain.size) { diffs++; console.log('DIFF', account, r.pool, 'indexer size', r.size, 'chain size', chain.size, 'indexer updatedAtBlock', r.updatedAtBlock); }
  }
}
console.log(`accounts ${accounts.size}, indexer rows compared ${rows}, size differences ${diffs}`);
process.exit(0);
