# Docs say 6 markets are outside the paper-USDso allowlist, but MarginBank.isVoucherMarketAllowed returns true for all 21
Severity: normal
Area: contracts

## Steps to reproduce
1. Read https://app.testnet.dreamdex.io/docs/trading/perps-testnet/margin-and-liquidations#paper-usdso ("You can open or increase positions only in the markets marked Yes ... The six newest markets are not on that list") and the "Paper USDso" column of the market table (No for 1000PEPE, LIT, PUMP, VVV, ZEC, ZRO). The developer page repeats: "increasing a position in a market outside the credit's allowlist reverts, and getMaxPerpOrderSize reports it as limitedBy: voucherBlocked".
2. Run `node repro/07-voucher-allowlist-vs-docs.mjs`. It calls `MarginBank.isVoucherMarketAllowed(pool)` (the function the SDK itself uses for `voucherMarketAllowed`) for every perp pool.

## Expected
`false` for the six markets documented as not allowed (or the docs list matches the contract).

## Actual
`true` for all 21 pools, so `getPerpLeverage().voucherMarketAllowed` and `previewPerpOrderMargin().voucherBlocked` also say those markets are allowed for voucher accounts. Either the docs list is stale or the allowlist is not configured as documented. Note: I could not place a real order (the testnet wallet has no STT, see REPORT.md), so I have not verified whether the pool reverts `VoucherMarketNotAllowed` in practice; the mismatch is between documentation and the contract view.

## Evidence
```
$ node repro/07-voucher-allowlist-vs-docs.mjs
ZRO       chain allowed = true  docs say allowed = false
LIT       chain allowed = true  docs say allowed = false
VVV       chain allowed = true  docs say allowed = false
1000PEPE  chain allowed = true  docs say allowed = false
PUMP      chain allowed = true  docs say allowed = false
ZEC       chain allowed = true  docs say allowed = false
TAO       chain allowed = true  docs say allowed = true
...
```
Repro script: `node repro/07-voucher-allowlist-vs-docs.mjs`

## Environment
SDK @somnia-chain/markets-sdk 0.32.1, Node v22, network Somnia Tokyo testnet (Hideki, chain 50383), MarginBank 0x478769E1177C0773c43A593DCCc4Ad15F15F1394, wallet 0xd2FeCA4Be0B81B15854ab3DD9Fd737d8307d0E36 (not used by this script)
