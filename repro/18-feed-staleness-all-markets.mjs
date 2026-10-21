// For every perp market: indexer row mark age vs on-chain feed verdict vs getMaxPerpOrderSize.priceable vs ticker perpState.
import { make, ADDRESS } from './_env.mjs';
const m = make(); const c = m.client;
await m.loadMarkets();
const perps = await c.listPerpMarkets();
const now = Math.floor(Date.now() / 1000);
for (const p of perps) {
  const fs = await c.getPerpFeedStatus(p.poolAddress);
  const mx = await c.getMaxPerpOrderSize({ pool: p.poolAddress, marginBank: p.marginBank, account: ADDRESS, isBid: true, price: BigInt(p.markPrice) });
  const tk = await m.fetchTicker(`${p.baseSymbol}/USDso:USDso`);
  const st = await c.getPerpState(p.poolAddress).then(() => 'ok', e => 'THROWS');
  console.log(p.baseSymbol.padEnd(9), 'rowMarkAge', String(now - Number(p.markPriceUpdatedAt)).padStart(5) + 's', 'feedOk', fs.markPriceOk, 'maxPriceable', mx.priceable, 'tickerPerpState', tk.perpState, 'getPerpState', st);
}
process.exit(0);
