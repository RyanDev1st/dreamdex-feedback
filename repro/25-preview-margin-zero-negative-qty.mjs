// previewPerpOrderMargin: "sufficient" for a zero / negative quantity (the pool would revert QuantityBelowMinimum).
// Other previews validate (getMaxPerpOrderSize: "price must be > 0"; previewPerpLiquidationPrice: "quantity must be > 0").
import { make, ADDRESS } from './_env.mjs';
const c = make().client;
const btc = (await c.listPerpMarkets()).find(p => p.baseSymbol === 'BTC');
const base = { pool: btc.poolAddress, marginBank: btc.marginBank, account: ADDRESS, isBid: true, price: 80000n * 10n ** 18n };
for (const q of [0n, -5n, -(10n ** 12n)]) {
  const r = await c.previewPerpOrderMargin({ ...base, quantity: q });
  console.log(`previewPerpOrderMargin quantity=${q}:`, JSON.stringify({ sufficient: r.sufficient, meetsInitialMargin: r.meetsInitialMargin, hasCollateralForLock: r.hasCollateralForLock, increasingQuantity: r.increasingQuantity + 'n', lockAmount: r.lockAmount + 'n' }));
}
try { await c.previewPerpLiquidationPrice({ ...base, quantity: 0n }); } catch (e) { console.log('previewPerpLiquidationPrice quantity=0 ->', e.constructor.name + ':', e.message); }
try { await c.getMaxPerpOrderSize({ ...base, price: 0n }); } catch (e) { console.log('getMaxPerpOrderSize price=0 ->', e.constructor.name + ':', e.message); }
// Same call, simulated on-chain from a real funded account: the pool itself rejects the zero quantity.
process.exit(0);
