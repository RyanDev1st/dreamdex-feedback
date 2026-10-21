import { make, j } from './_env.mjs';
const m = make();
const perps = await m.client.listPerpMarkets();
console.log('count', perps.length);
console.log(j(perps[0]));
console.log(perps.map(p => `${p.baseSymbol} bd=${p.baseDecimals} qd=${p.quoteDecimals}`).join('\n'));
const btc = perps.find(p => p.baseSymbol === 'BTC');
console.log(j(await m.client.getPerpSystemConfig(btc.marginBank)));
process.exit(0);
