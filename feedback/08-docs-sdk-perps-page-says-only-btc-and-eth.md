# SDK docs perps page says perps are live only for BTC and ETH; the testnet has 21 perp markets
Severity: normal
Area: docs

## Steps to reproduce
1. Open https://somnia-platform-docs.vercel.app/markets/somnia-markets/typescript/perps (also in /llms-full.txt): first line "Perps are live on testnet: `BTC/USDSO:USDSO` and `ETH/USDSO:USDSO`".
2. Run `node repro/23-docs-stale-btc-eth-only.mjs`.

## Expected
The docs list (or do not enumerate) the markets the SDK returns; the dreamDEX docs say "All 21 markets are margined in USDso".

## Actual
`client.listPerpMarkets()` returns 21 markets. A reader of the SDK docs concludes only two exist. The symbol format in that sentence (`BTC/USDSO:USDSO`, upper case) also does not match the unified symbol the SDK uses (`BTC/USDso:USDso`).

## Evidence
```
$ node repro/23-docs-stale-btc-eth-only.mjs
docs line: Perps are live on testnet: `BTC/USDSO:USDSO` and `ETH/USDSO:USDSO`, backed by
listPerpMarkets() returns 21 markets: ZRO,LIT,VVV,1000PEPE,PUMP,ZEC,TAO,WLD,NEAR,XLM,AVAX,LINK,SUI,ADA,BNB,DOGE,XRP,HYPE,SOL,ETH,BTC
```
Repro script: `node repro/23-docs-stale-btc-eth-only.mjs`

## Environment
SDK @somnia-chain/markets-sdk 0.32.1, Node v22, network Somnia Tokyo testnet (Hideki, chain 50383), wallet 0xd2FeCA4Be0B81B15854ab3DD9Fd737d8307d0E36 (not used)
