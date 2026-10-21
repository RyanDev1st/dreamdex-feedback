// Pagination: pages of N via limit/offset must equal one big call; ids unique; limit above server cap behaviour.
import { make } from './_env.mjs';
const c = make().client;
const perps = await c.listPerpMarkets(); const btc = perps.find(p => p.baseSymbol === 'BTC');
const reads = {
  listPerpFees: (o) => c.listPerpFees(o),
  listLiquidations: (o) => c.listLiquidations(o),
  getFundingRateHistory: (o) => c.getFundingRateHistory(btc.poolAddress, o),
  getOpenInterestHistory: (o) => c.getOpenInterestHistory(btc.poolAddress, o),
  listPerpOrderRejections: (o) => c.listPerpOrderRejections(o),
};
for (const [k, f] of Object.entries(reads)) {
  try {
    const big = await f({ limit: 120, offset: 0 });
    const paged = []; for (let off = 0; off < 120; off += 40) paged.push(...await f({ limit: 40, offset: off }));
    const ids = paged.map(r => r.id); const dup = ids.length - new Set(ids).size;
    const same = JSON.stringify(big.map(r => r.id)) === JSON.stringify(ids);
    const huge = await f({ limit: 100000, offset: 0 });
    console.log(k.padEnd(26), 'big', big.length, 'paged', paged.length, 'dups', dup, 'sameOrderAsBig', same, '| limit=100000 returned', huge.length);
  } catch (e) { console.log(k, 'ERR', String(e.message).split('\n')[0].slice(0, 200)); }
}
process.exit(0);
