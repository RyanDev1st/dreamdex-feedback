import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Load DREAMDEX_* from the volute .env (or the real environment). Never printed.
const p = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../.env');
if (fs.existsSync(p)) for (const l of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
  const m = l.match(/^(DREAMDEX_[A-Z_]+)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}
import { SomniaMarkets, SOMNIA_HIDEKI_TESTNET_ADDRESSES } from '@somnia-chain/markets-sdk';
import { hidekiTestnet } from '@somnia-chain/markets-sdk/chains';
export const INDEXER = 'https://hideki-dev.smk.somnia.host/v1/graphql';
export function make({ write = false } = {}) {
  return new SomniaMarkets({ chain: hidekiTestnet, indexerUrl: INDEXER, addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES,
    ...(write ? { privateKey: process.env.DREAMDEX_TESTNET_PRIVATE_KEY } : {}) });
}
export const ADDRESS = process.env.DREAMDEX_TESTNET_ADDRESS;
export const j = (x) => JSON.stringify(x, (_, v) => typeof v === 'bigint' ? v.toString() + 'n' : v, 2);
