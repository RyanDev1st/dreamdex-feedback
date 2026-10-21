// Write calls from a brand-new wallet with 0 STT and 0 USDso: what does the SDK say?
import { make, j, ADDRESS } from './_env.mjs';
import { parseUnits } from 'viem';
const m = make({ write: true });
const btc = (await m.client.listPerpMarkets()).find(p => p.baseSymbol === 'BTC');
console.log('wallet', m.walletAddress, 'STT', await m.client.getNativeBalance(ADDRESS));
const price = parseUnits('100000', btc.quoteDecimals), quantity = parseUnits('0.001', btc.baseDecimals);
const cases = {
  'claimPerpVoucher (docs sample)': () => m.trader.claimPerpVoucher({ marginBank: btc.marginBank }),
  'placePerpOrder (docs sample)': () => m.trader.placePerpOrder({ pool: btc.poolAddress, isBid: true, price, quantity }),
  'depositMargin 1 USDso': () => m.trader.depositMargin({ marginBank: btc.marginBank, amount: parseUnits('1', 18) }),
  'withdrawMargin 1 USDso': () => m.trader.withdrawMargin({ marginBank: btc.marginBank, amount: parseUnits('1', 18) }),
};
const first = (s, n) => String(s).split('\n').slice(0, 2).join(' | ').slice(0, n);
for (const [k, f] of Object.entries(cases)) {
  try { const r = await f(); console.log('OK  ', k, j(r).slice(0, 400)); }
  catch (e) {
    console.log('ERR ', k, '=>', e?.constructor?.name + ': ' + first(e?.message, 300));
    let x = e?.cause, d = 1;
    while (x && d < 6) { console.log('      cause' + d, x.constructor?.name, '|', String(x.details ?? x.message ?? x).replace(/\n/g, ' / ').slice(0, 160)); x = x.cause; d++; }
  }
}
process.exit(0);
