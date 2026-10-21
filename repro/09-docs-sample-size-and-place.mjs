// Verbatim code from https://app.testnet.dreamdex.io/docs/developers/perps-testnet ("Size and place an order"), unfunded wallet.
import { make } from './_env.mjs';
const markets = make({ write: true });
const perps = await markets.client.listPerpMarkets();
const btc = perps.find((m) => m.baseSymbol === "BTC");
const account = markets.walletAddress;
import { parseUnits } from "viem";
const price = parseUnits("100000", btc.quoteDecimals);
const max = await markets.client.getMaxPerpOrderSize({
  pool: btc.poolAddress, marginBank: btc.marginBank, account, isBid: true, price,
});
const quantity = parseUnits("0.001", btc.baseDecimals);
console.log('mark', btc.markPrice, 'lot', btc.lotSize, 'min', btc.minQuantity, 'qty', quantity);
console.log('max', JSON.stringify(max, (_, v) => typeof v === 'bigint' ? v + 'n' : v));
if (!max.priceable) throw new Error("No live mark price to size against");
if (!max.placeable || quantity > max.maxQuantity) {
  throw new Error(`Order too large for this account: limited by ${max.limitedBy}`);
}
process.exit(0);
