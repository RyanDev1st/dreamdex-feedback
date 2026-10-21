// SDK docs perps page says perps are live for only BTC and ETH; the chain/SDK serve 21 perp markets.
import { make } from './_env.mjs';
const txt = await (await fetch('https://somnia-platform-docs.vercel.app/llms-full.txt')).text();
const i = txt.indexOf('URL: /markets/somnia-markets/typescript/perps');
console.log('docs line:', txt.slice(i, i + 400).split('\n').find(l => l.startsWith('Perps are live on testnet')));
const perps = await make().client.listPerpMarkets();
console.log(`listPerpMarkets() returns ${perps.length} markets:`, perps.map(p => p.baseSymbol).join(','));
process.exit(0);
