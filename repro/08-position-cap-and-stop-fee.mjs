// Docs: "Each account has a position cap per market, a tenth of the market's open interest cap on most markets."
// Docs: "Stop orders carry 0.15 STT each".
import { make } from './_env.mjs';
import { formatUnits } from 'viem';
const c = make().client;
const perps = await c.listPerpMarkets();
let tenth = 0;
for (const p of perps) {
  const r = await c.getPerpRiskParams(p.poolAddress);
  const ratio = Number(r.maxOpenInterest) / Number(r.maxPositionSize);
  if (Math.abs(ratio - 10) < 0.01) tenth++;
  console.log(p.baseSymbol.padEnd(9), 'maxOI', formatUnits(r.maxOpenInterest, p.baseDecimals).padEnd(14), 'maxPositionSize', formatUnits(r.maxPositionSize, p.baseDecimals).padEnd(14), 'OI/posCap =', ratio.toFixed(3));
}
console.log(`markets where cap == OI/10: ${tenth} of ${perps.length}`);
const p0 = perps[0];
console.log('stop-order STT payment (registry', p0.stopRegistry + '):', formatUnits(await c.getPerpStopOrderSomiPayment(p0.stopRegistry), 18), 'STT');
process.exit(0);
