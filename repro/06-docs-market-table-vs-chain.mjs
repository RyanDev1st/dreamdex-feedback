// Cross-check the "Markets" table on https://app.testnet.dreamdex.io/docs/trading/perps-testnet with live on-chain values.
import { make, ADDRESS } from './_env.mjs';
import { formatUnits } from 'viem';
const doc = `BTC 20 5 0.1 0.00013 246.81545 Yes
ETH 20 5 0.01 0.004 3995.6125 Yes
HYPE 20 5 0.01 0.12 23812.72 Yes
SOL 20 5 0.01 0.1 47654.44 Yes
XRP 20 5 0.0001 6.9 344632 Yes
ADA 10 10 0.0001 46 2254678 Yes
AVAX 10 10 0.001 1.4 66672.2 Yes
BNB 10 10 0.001 0.014 693.975 Yes
DOGE 10 10 0.00001 120 5613590 Yes
LINK 10 10 0.001 0.9 42643.6 Yes
NEAR 10 10 0.0001 5.1 250410 Yes
SUI 10 10 0.0001 13 635009 Yes
XLM 10 10 0.0001 54 2677780 Yes
1000PEPE 5 20 0.0000001 2700 130285600 No
LIT 5 20 0.0001 2.8 138896.6 No
PUMP 5 20 0.000001 1800 87993700 No
TAO 5 20 0.001 0.044 2185.491 Yes
VVV 5 20 0.001 0.44 21786.14 No
WLD 5 20 0.0001 26 1264000 Yes
ZEC 5 20 0.001 0.009 420 No
ZRO 5 20 0.0001 5.1 250599.5 No`.split('\n').map(l => l.split(' '));
const c = make().client;
const perps = await c.listPerpMarkets();
const strip = (s) => s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
for (const [sym, lev, im, tick, min, oi, paper] of doc) {
  const p = perps.find(x => x.baseSymbol === sym);
  const r = await c.getPerpRiskParams(p.poolAddress);
  const lv = await c.getPerpLeverage({ marginBank: p.marginBank, pool: p.poolAddress, account: ADDRESS });
  const chain = {
    lev: 10000 / Number(r.initialMarginBps), im: Number(r.initialMarginBps) / 100,
    tick: strip(formatUnits(BigInt(p.tickSize), 18)), min: strip(formatUnits(BigInt(p.minQuantity), p.baseDecimals)),
    oi: strip(formatUnits(r.maxOpenInterest, p.baseDecimals)), paper: lv.voucherMarketAllowed ? 'Yes' : 'No',
  };
  const diffs = [];
  if (chain.lev != lev) diffs.push(`lev doc=${lev} chain=${chain.lev}`);
  if (chain.im != im) diffs.push(`IM% doc=${im} chain=${chain.im}`);
  if (chain.tick !== tick) diffs.push(`tick doc=${tick} chain=${chain.tick}`);
  if (chain.min !== min) diffs.push(`minSize doc=${min} chain=${chain.min}`);
  if (Number(chain.oi) !== Number(oi)) diffs.push(`OIcap doc=${oi} chain=${chain.oi}`);
  if (chain.paper !== paper) diffs.push(`paperUSDso doc=${paper} chain=${chain.paper}`);
  const oiNow = Number(formatUnits(BigInt(p.openInterest), p.baseDecimals));
  if (oiNow > Number(oi)) diffs.push(`current OI ${oiNow} already EXCEEDS the documented cap ${oi}`);
  console.log(sym.padEnd(9), diffs.length ? 'DIFF ' + diffs.join('; ') : 'match');
}
process.exit(0);
