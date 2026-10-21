// Invariants the docs promise, checked against real accounts that hold positions (read-only).
// (a) getPerpPositionAnalytics rows re-sum to the bank's equity "to the wei" (docs: Perps > "What is this position actually doing?")
// Bank equity counts FREE collateral only (docs), so: unlockedCollateral + sum(equityContribution) must equal getAccountHealth.equity, read at the rows' block.
import { make } from './_env.mjs';
import { parseAbi } from 'viem';
const c = make().client;
const perps = await c.listPerpMarkets();
const accounts = new Map();
for (const sym of ['BTC', 'ETH', 'SOL', 'XRP']) {
  const p = perps.find(x => x.baseSymbol === sym);
  for (const isLong of [true, false]) {
    try {
      const h = await c.getPerpSideHolders({ marginBank: p.marginBank, pool: p.poolAddress, isLong }, { pageSize: 50 });
      for (const a of h.holders.slice(0, 6)) accounts.set(a, p);
    } catch (e) { console.log('sideholders err', sym, isLong, String(e.message).split('\n')[0].slice(0, 200)); }
  }
}
console.log('accounts with positions:', accounts.size);
let bad = 0, n = 0;
for (const [account, p] of accounts) {
  try {
    const rows = await c.listPerpPositionAnalytics({ marginBank: p.marginBank, account });
    const blk = rows[0].asOfBlock;
    // pin the bank reads to the SAME block the analytics rows were read at
    const pc = c.getViemClient();
    const bank = { address: p.marginBank, abi: parseAbi(['function getAccountHealth(address) view returns (int256 equity,uint256 imReq,uint256 mmReq,uint256 cmReq)','function getAccountState(address) view returns ((int256 unlockedCollateralBalance,uint256 lockedCollateral,address[] activePerpPools))']) };
    const [health, st] = await Promise.all([
      pc.readContract({ ...bank, functionName: 'getAccountHealth', args: [account], blockNumber: blk }),
      pc.readContract({ ...bank, functionName: 'getAccountState', args: [account], blockNumber: blk })]);
    const sumContrib = rows.reduce((s, r) => s + (r.equityContribution ?? 0n), 0n);
    const collateral = st.unlockedCollateralBalance; // bank equity counts free collateral only (locked excluded, see docs)
    const calc = collateral + sumContrib;
    const mar = { equity: health[0] };
    n++;
    const diff = calc - mar.equity;
    if (diff !== 0n) { bad++; console.log('MISMATCH', account, 'block', blk, 'bank equity', mar.equity, 'collateral+sum(contrib)', calc, 'diff', diff, 'rows', rows.length, 'allRowsSameBlock', rows.every(r => r.asOfBlock === blk)); }
  } catch (e) { console.log('ERR', account, String(e.constructor.name), String(e.message).split('\n')[0].slice(0, 220)); }
}
console.log(`checked ${n} accounts, ${bad} mismatches`);
process.exit(0);
