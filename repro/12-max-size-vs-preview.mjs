// Docs: getMaxPerpOrderSize "binary-searches the forward rule (previewPerpOrderMargin), so the two cannot disagree".
// Read-only: use real funded accounts found via getPerpSideHolders. maxQuantity must be sufficient, maxQuantity+lot must not (unless another cap binds).
import { make } from './_env.mjs';
const c = make().client;
const perps = await c.listPerpMarkets();
const btc = perps.find(x => x.baseSymbol === 'BTC');
const h = await c.getPerpSideHolders({ marginBank: btc.marginBank, pool: btc.poolAddress, isLong: true }, { pageSize: 30 });
let bad = 0, n = 0;
for (const account of h.holders.slice(0, 12)) {
  for (const isBid of [true, false]) {
    try {
      const mk = BigInt(btc.markPrice);
      const price = isBid ? mk + mk / 20n : mk - mk / 20n;
      const tick = BigInt(btc.tickSize); const pr = price - (price % tick);
      const args = { pool: btc.poolAddress, marginBank: btc.marginBank, account, isBid, price: pr };
      const mx = await c.getMaxPerpOrderSize(args);
      if (!mx.placeable) { console.log(account, isBid ? 'bid' : 'ask', 'placeable=false limitedBy', mx.limitedBy); continue; }
      const at = await c.previewPerpOrderMargin({ ...args, quantity: mx.maxQuantity });
      const over = await c.previewPerpOrderMargin({ ...args, quantity: mx.maxQuantity + BigInt(btc.lotSize) });
      n++;
      const ok = at.sufficient && !over.sufficient;
      if (!ok) { bad++; console.log('DISAGREE', account, isBid ? 'bid' : 'ask', 'max', mx.maxQuantity, 'limitedBy', mx.limitedBy, 'sufficient@max', at.sufficient, 'sufficient@max+lot', over.sufficient, 'block', mx.asOfBlock, at.asOfBlock, over.asOfBlock); }
    } catch (e) { console.log('ERR', account, String(e.constructor.name), String(e.message).split('\n')[0].slice(0, 200)); }
  }
}
console.log(`checked ${n}, disagreements ${bad}`);
process.exit(0);
