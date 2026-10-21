// Docs (trader "Margin & Liquidations > Paper USDso" + market table) say 6 markets are NOT on the paper-USDso allowlist.
// Read the MarginBank directly: isVoucherMarketAllowed(pool).
import { createPublicClient, webSocket, parseAbi } from 'viem';
import { make } from './_env.mjs';
const c = make().client;
const perps = await c.listPerpMarkets();
const pc = c.getViemClient();
const abi = parseAbi(['function isVoucherMarketAllowed(address perpPool) view returns (bool)']);
const docsNo = ['1000PEPE', 'LIT', 'PUMP', 'VVV', 'ZEC', 'ZRO'];
for (const p of perps) {
  const allowed = await pc.readContract({ address: p.marginBank, abi, functionName: 'isVoucherMarketAllowed', args: [p.poolAddress] });
  console.log(p.baseSymbol.padEnd(9), 'chain allowed =', allowed, ' docs say allowed =', !docsNo.includes(p.baseSymbol));
}
process.exit(0);
