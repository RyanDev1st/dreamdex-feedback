# Developer docs describe client.quotePerpClose, client.getPerpPositionsPage and client.getVenueHealth, which are not in the published SDK
Severity: major
Area: docs

## Steps to reproduce
1. `npm i --save-exact @somnia-chain/markets-sdk@0.32.1` (the version the dreamDEX perps developer page tells you to use; it is also npm dist-tag `latest`).
2. Read https://somnia-platform-docs.vercel.app/markets/somnia-markets/typescript/perps : section "Closing when the book is thin" shows `const q = await client.quotePerpClose({ pool, marginBank, account });` and says "On the exchange surface, `exchange.quotePerpClose(symbol)` quotes the connected wallet's position"; section "Every account at once" documents `client.getPerpPositionsPage({ pool, minSize, includeFlat, cursor })`.
3. Read https://somnia-platform-docs.vercel.app/markets/somnia-markets/typescript/how-to/check-venue-health : "`client.getVenueHealth()` returns a `status` of ok, degraded or down".
4. Run `node repro/02-documented-api-missing.mjs`.

## Expected
The methods exist on the client in the SDK version the docs target, so the documented code samples run.

## Actual
All four are `undefined`; copying the documented sample throws `TypeError: client.quotePerpClose is not a function`. They are also absent from the newest canary build (`npm pack @somnia-chain/markets-sdk@0.32.2-canary.38575926931.ge4550933d36d`, extract, then `grep -rE "quotePerpClose|getPerpPositionsPage|getVenueHealth" package/dist` finds nothing), so the docs describe an API that has not shipped in any published tag.

## Evidence
```
$ node repro/02-documented-api-missing.mjs
client.quotePerpClose: typeof = undefined   (documented at https://somnia-platform-docs.vercel.app/markets/somnia-markets/typescript/perps ("Closing when the book is thin"))
client.getPerpPositionsPage: typeof = undefined   (documented at same page ("Every account at once"))
client.getVenueHealth: typeof = undefined   (documented at https://somnia-platform-docs.vercel.app/markets/somnia-markets/typescript/how-to/check-venue-health)
exchange.quotePerpClose: typeof = undefined
$ npm view @somnia-chain/markets-sdk dist-tags.latest
0.32.1
```
Repro script: `node repro/02-documented-api-missing.mjs`

## Environment
SDK @somnia-chain/markets-sdk 0.32.1, Node v22, network Somnia Tokyo testnet (Hideki, chain 50383), wallet 0xd2FeCA4Be0B81B15854ab3DD9Fd737d8307d0E36 (read-only calls)
