// eth_call simulation (no tx, no key needed) of PerpPool.placeOrder from a REAL funded account, with edge inputs.
// Shows how reverts decode in the SDK (decodeRevert) vs the raw selector.
import { make } from './_env.mjs';
import * as s from '@somnia-chain/markets-sdk';
import { parseAbi } from 'viem';
const c = make().client; const pc = c.getViemClient();
const perps = await c.listPerpMarkets();
const btc = perps.find(p => p.baseSymbol === 'BTC');
const FROM = process.argv[2] ?? '0x5c693d3D7DaCFd71F6F70A0cB6010A773e004d68';
const abi = parseAbi(['function placeOrder(bool isBid,uint64 userData,uint256 price,uint256 quantity,uint64 expireTimestampNs,uint8 orderType,uint8 selfMatchingOption,address builder,uint96 builderFeeBpsTimes1k) returns (bool success,uint128 orderId)']);
const Z = '0x0000000000000000000000000000000000000000';
const mk = BigInt(btc.markPrice); const tick = BigInt(btc.tickSize);
const al = (p) => p - (p % tick);
const lot = BigInt(btc.lotSize), min = BigInt(btc.minQuantity);
const run = async (label, o) => {
  const a = { isBid: true, userData: 0n, price: al(mk * 90n / 100n), quantity: min, expire: 2n ** 63n, type: 0, smo: 0, builder: Z, fee: 0n, ...o };
  try {
    const r = await pc.simulateContract({ address: btc.poolAddress, abi, functionName: 'placeOrder', account: FROM, gas: 10_000_000n,
      args: [a.isBid, a.userData, a.price, a.quantity, a.expire, a.type, a.smo, a.builder, a.fee] });
    console.log('OK     ', label.padEnd(34), JSON.stringify(r.result, (_, v) => typeof v === 'bigint' ? v + 'n' : v));
  } catch (e) {
    let raw = e?.walk?.((x) => x?.data)?.data ?? e?.cause?.data ?? e?.cause?.cause?.data;
    const d = s.decodeRevert(e);
    console.log('REVERT ', label.padEnd(34), 'errorName=', d.errorName ?? '(none)', '| raw=', typeof raw === 'string' ? raw.slice(0, 74) : raw, '| msg=', String(d.message).split('\n')[0].slice(0, 110));
  }
};
await run('resting bid 10% under mark (valid)', {});
await run('quantity 0', { quantity: 0n });
await run('quantity below min', { quantity: min - lot });
await run('quantity off-lot', { quantity: min + 1n });
await run('price 0 limit', { price: 0n });
await run('price off-tick', { price: al(mk) + 1n });
await run('price 1 tick', { price: tick });
await run('huge price (2^255)', { price: 2n ** 255n });
await run('huge quantity (2^200)', { quantity: 2n ** 200n });
await run('expired timestamp (1ns)', { expire: 1n });
await run('orderType 4 (invalid)', { type: 4 });
await run('selfMatching 2 (invalid)', { smo: 2 });
await run('IOC far below touch (no fill)', { isBid: true, type: 2, price: al(mk * 50n / 100n) });
await run('PostOnly bid 20% above mark', { type: 3, price: al(mk * 120n / 100n) });
await run('builder != 0, fee 0', { builder: '0x0000000000000000000000000000000000000001' });
await run('builder fee > 0, builder 0', { fee: 10n });
await run('bid price 150% of mark (band)', { price: al(mk * 150n / 100n) });
await run('ask price 50% of mark (band)', { isBid: false, price: al(mk * 50n / 100n) });
process.exit(0);
