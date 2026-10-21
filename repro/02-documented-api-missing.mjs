// Which client/exchange methods named in the official docs do not exist in @somnia-chain/markets-sdk@0.32.1 (npm "latest")?
import * as s from '@somnia-chain/markets-sdk';
import { hidekiTestnet } from '@somnia-chain/markets-sdk/chains';
const m = new s.SomniaMarkets({ chain: hidekiTestnet, indexerUrl: 'https://hideki-dev.smk.somnia.host/v1/graphql', addresses: s.SOMNIA_HIDEKI_TESTNET_ADDRESSES });
const docs = {
  'client.quotePerpClose': 'https://somnia-platform-docs.vercel.app/markets/somnia-markets/typescript/perps ("Closing when the book is thin")',
  'client.getPerpPositionsPage': 'same page ("Every account at once")',
  'client.getVenueHealth': 'https://somnia-platform-docs.vercel.app/markets/somnia-markets/typescript/how-to/check-venue-health',
};
for (const [k, where] of Object.entries(docs)) {
  const [, name] = k.split('.');
  console.log(`${k}: typeof = ${typeof m.client[name]}   (documented at ${where})`);
}
console.log('exchange.quotePerpClose: typeof =', typeof m.quotePerpClose);
process.exit(0);
