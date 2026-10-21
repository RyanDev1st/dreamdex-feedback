# Perps docs "Open interest cap" table and "a tenth of the OI cap" claim do not match the on-chain risk parameters; live OI already exceeds the documented cap
Severity: normal
Area: docs

## Steps to reproduce
1. Open https://app.testnet.dreamdex.io/docs/trading/perps-testnet , table "Markets", column "Open interest cap" (BTC 246.81545 BTC, XRP 344,632 XRP, ...). The developer page https://app.testnet.dreamdex.io/docs/developers/perps-testnet says an account position cap is "a tenth of the market's open interest cap on most markets".
2. Run `node repro/06-docs-market-table-vs-chain.mjs` (compares every table row to `getPerpRiskParams`, the market row and current open interest).
3. Run `node repro/08-position-cap-and-stop-fee.mjs` (ratio of `maxOpenInterest` to `maxPositionSize` per market).

## Expected
The documented cap equals the contract's `maxOpenInterest`, current open interest never exceeds it, and the position cap is a tenth of it on most markets.

## Actual
- `getPerpRiskParams(pool).maxOpenInterest` is 2x to 4x the documented cap on 20 of 21 markets (only TAO matches), e.g. BTC doc 246.81545 vs chain 493.6309, XRP doc 344,632 vs chain 1,378,528.
- Live open interest already exceeds the documented cap on BTC (294.2 BTC vs 246.8) and XRP (1,064,193 vs 344,632).
- `maxOpenInterest / maxPositionSize` is exactly 10 on only 1 of 21 markets (TAO); it is 40 on 6 markets, about 20 on 12, 4 on ZEC, 4.936 on BTC. The documented table divided by 10 equals `maxPositionSize` on most markets, so the table seems to show a different value from the `maxOpenInterest` the contract exposes. (The page says figures "can be retuned at any time", but a column that is a fixed multiple off on nearly every market looks like a wrong source field, not retuning.)

## Evidence
```
$ node repro/06-docs-market-table-vs-chain.mjs
BTC       DIFF OIcap doc=246.81545 chain=493.6309; current OI 294.21347 already EXCEEDS the documented cap 246.81545
ETH       DIFF OIcap doc=3995.6125 chain=7991.225
XRP       DIFF OIcap doc=344632 chain=1378528; current OI 1064193 already EXCEEDS the documented cap 344632
ZEC       DIFF OIcap doc=420 chain=1680; paperUSDso doc=No chain=Yes
TAO       match
$ node repro/08-position-cap-and-stop-fee.mjs
ZRO       maxOI 1002398        maxPositionSize 25059.9       OI/posCap = 40.000
ZEC       maxOI 1680           maxPositionSize 420           OI/posCap = 4.000
TAO       maxOI 2185.491       maxPositionSize 218.549       OI/posCap = 10.000
BTC       maxOI 493.6309       maxPositionSize 100           OI/posCap = 4.936
markets where cap == OI/10: 1 of 21
```
Repro scripts: `node repro/06-docs-market-table-vs-chain.mjs`, `node repro/08-position-cap-and-stop-fee.mjs`. (The other columns of the table, max leverage, initial margin, tick and min size, all match the chain.)

## Environment
SDK @somnia-chain/markets-sdk 0.32.1, Node v22, network Somnia Tokyo testnet (Hideki, chain 50383), wallet 0xd2FeCA4Be0B81B15854ab3DD9Fd737d8307d0E36 (read-only calls)
