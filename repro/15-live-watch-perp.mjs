// Docs (Perps page): "Perp pools emit the same order events, so watchMarket(pool), getLiveSpotOrderBook-style depth, getLiveFills ... just work."
import { make, j } from './_env.mjs';
const m = make(); const c = m.client;
const btc = (await c.listPerpMarkets()).find(p => p.baseSymbol === 'BTC');
const t0 = Date.now();
const w = await c.watchMarket(btc.poolAddress);
console.log('watchMarket resolved in', Date.now() - t0, 'ms; status =', c.getWatchStatus(btc.poolAddress));
let ticks = 0; c.subscribeLive(() => { ticks++; });
const tryit = (k, f) => { try { const r = f(); console.log('OK ', k, j(r).replace(/\s+/g, ' ').slice(0, 330)); } catch (e) { console.log('ERR', k, e?.constructor?.name + ': ' + String(e?.message).split('\n')[0].slice(0, 250)); } };
tryit('getLiveSpotOrderBook(perp pool)', () => c.getLiveSpotOrderBook(btc.poolAddress, { depth: 3 }));
tryit('getLiveBinaryOrderBook(perp pool)', () => c.getLiveBinaryOrderBook(btc.poolAddress, { depth: 3 }));
tryit('getLiveFills(perp pool)', () => c.getLiveFills(btc.poolAddress, { limit: 2 }));
tryit('getLiveMarketByPool(perp pool)', () => c.getLiveMarketByPool(btc.poolAddress));
tryit('getLiveStatus', () => c.getLiveStatus());
await new Promise(r => setTimeout(r, 12000));
console.log('subscribeLive callbacks in 12s:', ticks);
tryit('getLiveFills after 12s', () => c.getLiveFills(btc.poolAddress, { limit: 2 }));
w.stop();
process.exit(0);
