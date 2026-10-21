import { make, j, ADDRESS } from './_env.mjs';
const m = make(); const c = m.client;
const btc = (await c.listPerpMarkets()).find(p => p.baseSymbol === 'BTC');
const base = { pool: btc.poolAddress, marginBank: btc.marginBank, account: ADDRESS };
const E18 = 10n ** 18n;
const cases = {
  'max zero price': () => c.getMaxPerpOrderSize({ ...base, isBid: true, price: 0n }),
  'max negative price': () => c.getMaxPerpOrderSize({ ...base, isBid: true, price: -1n }),
  'max huge price (2^256)': () => c.getMaxPerpOrderSize({ ...base, isBid: true, price: 2n ** 256n }),
  'max off-tick price': () => c.getMaxPerpOrderSize({ ...base, isBid: true, price: 100000n * E18 + 1n }),
  'max pool=zero address': () => c.getMaxPerpOrderSize({ ...base, pool: '0x0000000000000000000000000000000000000000', isBid: true, price: 100000n * E18 }),
  'max pool="not-an-address"': () => c.getMaxPerpOrderSize({ ...base, pool: 'not-an-address', isBid: true, price: 100000n * E18 }),
  'max price as number': () => c.getMaxPerpOrderSize({ ...base, isBid: true, price: 100000 }),
  'preview qty zero': () => c.previewPerpOrderMargin({ ...base, isBid: true, quantity: 0n, price: 100000n * E18 }),
  'preview qty negative': () => c.previewPerpOrderMargin({ ...base, isBid: true, quantity: -5n, price: 100000n * E18 }),
  'preview qty huge': () => c.previewPerpOrderMargin({ ...base, isBid: true, quantity: 2n ** 255n, price: 100000n * E18 }),
  'preview qty off-lot': () => c.previewPerpOrderMargin({ ...base, isBid: true, quantity: 1234567n, price: 100000n * E18 }),
  'preview qty with 18 decimals (docs wrong-scale pitfall)': () => c.previewPerpOrderMargin({ ...base, isBid: true, quantity: 10n ** 17n, price: 100000n * E18 }),
  'liqprice qty zero': () => c.previewPerpLiquidationPrice({ ...base, isBid: true, quantity: 0n, price: 100000n * E18 }),
  'closepnl qty huge': () => c.previewPerpClosePnl({ ...base, quantity: 10n ** 30n }),
  'closepnl qty negative': () => c.previewPerpClosePnl({ ...base, quantity: -1n }),
  'getPerpMarket bad id': () => c.getPerpMarket('0xdeadbeef'),
  'getPerpMarket unknown id': () => c.getPerpMarket('0x0000000000000000000000000000000000000001'),
  'getPerpMarket empty': () => c.getPerpMarket(''),
  'getPerpState zero addr': () => c.getPerpState('0x0000000000000000000000000000000000000000'),
  'getMarginAccount bad account': () => c.getMarginAccount(btc.marginBank, '0x123'),
  'getAccountEquity bad scope': () => c.getAccountEquity(ADDRESS, { scope: 'bogus', marginBank: btc.marginBank }),
  'getAccountEquity spot scope (docs: NotSupportedError)': () => c.getAccountEquity(ADDRESS, { scope: 'spot' }),
  'getAccountEquity blockNumber future': () => c.getAccountEquity(ADDRESS, { scope: 'perps', marginBank: btc.marginBank, blockNumber: 10n ** 12n }),
  'getAccountEquity blockNumber 0': () => c.getAccountEquity(ADDRESS, { scope: 'perps', marginBank: btc.marginBank, blockNumber: 0n }),
  'getMarginEvents limit -1': () => c.getMarginEvents(ADDRESS, { limit: -1 }),
  'getMarginEvents limit 100000': () => c.getMarginEvents(ADDRESS, { limit: 100000 }),
  'getMarginEvents inverted block range': () => c.getMarginEvents(ADDRESS, { sinceBlock: 10n, toBlock: 5n }),
  'getCandles interval 0': () => c.getCandles(btc.poolAddress, 0, { limit: 2 }),
  'getCandles interval -5': () => c.getCandles(btc.poolAddress, -5, { limit: 2 }),
  'getCandles interval 7': () => c.getCandles(btc.poolAddress, 7, { limit: 2 }),
  'getCandles limit 0': () => c.getCandles(btc.poolAddress, 60, { limit: 0 }),
  'getFundingRateHistory limit 0': () => c.getFundingRateHistory(btc.poolAddress, { limit: 0 }),
  'getFundingRateHistory limit -1': () => c.getFundingRateHistory(btc.poolAddress, { limit: -1 }),
  'getFundingRateHistory offset huge': () => c.getFundingRateHistory(btc.poolAddress, { limit: 2, offset: 10 ** 9 }),
  'getBookTops unknown market': () => c.getBookTops(['0x0000000000000000000000000000000000000001']),
  'getBookTops empty': () => c.getBookTops([]),
};
const only = process.argv[2];
for (const [k, f] of Object.entries(cases)) {
  if (only && !k.includes(only)) continue;
  try { const r = await f(); console.log('OK  ', k, '=>', j(r).replace(/\s+/g, ' ').slice(0, only ? 1500 : 230)); }
  catch (e) { console.log('ERR ', k, '=>', e?.constructor?.name + '/' + e?.name + ': ' + String(e?.message).split('\n')[0].slice(0, 260)); }
}
process.exit(0);
