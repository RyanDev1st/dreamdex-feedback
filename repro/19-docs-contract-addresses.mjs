// Docs "Contracts" table (developers/perps-testnet) vs SDK constant vs on-chain code.
import { make } from './_env.mjs';
import * as s from '@somnia-chain/markets-sdk';
const docs = {
  MarginBank: '0x478769E1177C0773c43A593DCCc4Ad15F15F1394', Collateral: '0xed7993A74dAe1e6656B704A424DcD8711aAf4F72',
  PerpPoolFactory: '0xE631fAEE547baeE07353E290f0562ea67d856560', LiquidationEngine: '0xA66d3C24Ad4a389d863846905D8173e1017e9F4D',
  InsuranceFund: '0x50826894D47C6D4f3BeA38BFDC7Dc5c5be171b80', VoucherDistributor: '0x2ACD9EFdA721450906bfE1bef3edE269636E42C4',
  OperatorPermissionsRegistry: '0x6B2FbfeD328FF5F20C0BE7D3C3437613aFFE8D3a' };
const pc = make().client.getViemClient();
console.log('SDK constant keys:', Object.keys(s.SOMNIA_HIDEKI_TESTNET_ADDRESSES).join(','));
console.log('SDK collateral (docs say it is NOT the perps collateral):', s.SOMNIA_HIDEKI_TESTNET_ADDRESSES.collateral);
const all = JSON.stringify(s.SOMNIA_HIDEKI_TESTNET_ADDRESSES).toLowerCase();
for (const [k, a] of Object.entries(docs)) {
  const code = await pc.getCode({ address: a });
  console.log(k.padEnd(28), a, 'code bytes:', code ? (code.length - 2) / 2 : 0, ' present in SDK constant:', all.includes(a.toLowerCase()));
}
process.exit(0);
