import { make, j, ADDRESS } from './_env.mjs';
const m = make(); const c = m.client;
const perps = await c.listPerpMarkets();
const btc = perps.find(p => p.baseSymbol === 'BTC');
const ref = { marginBank: btc.marginBank, pool: btc.poolAddress, account: ADDRESS };
const calls = {
  getPerpMarket: () => c.getPerpMarket(btc.id),
  getPerpState: () => c.getPerpState(btc.poolAddress),
  getPerpFeedStatus: () => c.getPerpFeedStatus(btc.poolAddress),
  getPerpFundingPremium: () => c.getPerpFundingPremium(btc.poolAddress),
  getPerpPosition: () => c.getPerpPosition(ref),
  getMarginAccount: () => c.getMarginAccount(btc.marginBank, ADDRESS),
  getAccountHealth: () => c.getAccountHealth(btc.marginBank, ADDRESS),
  getAccountEquity: () => c.getAccountEquity(ADDRESS, { scope: 'perps', marginBank: btc.marginBank }),
  listAccountEquities: () => c.listAccountEquities([ADDRESS], { scope: 'perps', marginBank: btc.marginBank }),
  getLiquidationPrice: () => c.getLiquidationPrice(ref),
  getPerpLeverage: () => c.getPerpLeverage(ref),
  getPerpPositionAnalytics: () => c.getPerpPositionAnalytics(ref),
  listPerpPositionAnalytics: () => c.listPerpPositionAnalytics({ marginBank: btc.marginBank, account: ADDRESS }),
  getMaxPerpOrderSize: () => c.getMaxPerpOrderSize({ pool: btc.poolAddress, marginBank: btc.marginBank, account: ADDRESS, isBid: true, price: 100000n * 10n ** 18n }),
  previewPerpClosePnl: () => c.previewPerpClosePnl({ pool: btc.poolAddress, marginBank: btc.marginBank, account: ADDRESS }),
  getPerpRiskParams: () => c.getPerpRiskParams(btc.poolAddress),
  getPerpHealthSnapshot: () => c.getPerpHealthSnapshot(btc.poolAddress),
  getPerpMaxLeverage: () => c.getPerpMaxLeverage(ref),
  getPerpVoucherCampaign: () => c.getPerpVoucherCampaign(btc.marginBank),
  getPerpVoucherEligibility: () => c.getPerpVoucherEligibility(btc.marginBank, ADDRESS),
  getPerpVoucher: () => c.getPerpVoucher(btc.marginBank, ADDRESS),
  listPerpPositions: () => c.listPerpPositions(ADDRESS),
  listPerpOrderHistory: () => c.listPerpOrderHistory(ADDRESS),
  getFundingPayments: () => c.getFundingPayments(ADDRESS),
  getMarginEvents: () => c.getMarginEvents(ADDRESS),
  listLiquidations: () => c.listLiquidations({ limit: 2 }),
  getFundingRateHistory: () => c.getFundingRateHistory(btc.poolAddress, { limit: 2 }),
  listFundingRateHistory: () => c.listFundingRateHistory(btc.poolAddress, { limit: 2 }),
  getOpenInterestHistory: () => c.getOpenInterestHistory(btc.poolAddress, { limit: 2 }),
  getCandles: () => c.getCandles(btc.poolAddress, 60, { limit: 2 }),
  listPerpFees: () => c.listPerpFees({ limit: 2 }),
  listPerpOrderRejections: () => c.listPerpOrderRejections({ limit: 2 }),
  getBookTops: () => c.getBookTops([btc.id]),
  getOpenOrders: () => c.getOpenOrders(ADDRESS),
  listTradeablePerpPools: () => c.listTradeablePerpPools({ marginBank: btc.marginBank }),
  listPerpPoolStatuses: () => c.listPerpPoolStatuses({ marginBank: btc.marginBank }),
  getInsuranceFundState: async () => c.getInsuranceFundState((await c.getPerpSystemConfig(btc.marginBank)).insuranceFund),
  getLiquidationEngineConfig: async () => c.getLiquidationEngineConfig((await c.getPerpSystemConfig(btc.marginBank)).liquidationEngine),
  getPerpPortfolio: () => c.getPerpPortfolio(ADDRESS),
  listPerpStopOrders: () => c.listPerpStopOrders({ account: ADDRESS }),
};
const only = process.argv[2];
for (const [k, f] of Object.entries(calls)) {
  if (only && only !== k) continue;
  try { const r = await f(); const s = j(r).replace(/\s+/g, ' '); console.log('OK  ', k, s.slice(0, only ? 3000 : 260)); }
  catch (e) { console.log('FAIL', k, e?.name + ': ' + String(e?.message).split('\n')[0].slice(0, 300)); }
}
process.exit(0);
