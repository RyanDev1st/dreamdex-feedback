# previewPerpOrderMargin reports sufficient: true for quantity 0 and for negative quantities (with a negative lockAmount)
Severity: normal
Area: SDK

## Steps to reproduce
1. Run `node repro/25-preview-margin-zero-negative-qty.mjs`.

## Expected
Input validation like the sibling reads: `previewPerpLiquidationPrice` throws `quantity must be > 0` and `getMaxPerpOrderSize` throws `price must be > 0`. A pre-trade preview must not report sufficient for an order the pool rejects (the pool reverts `QuantityBelowMinimum(0, 13000)` for quantity 0, see `node repro/14-simulate-place-order-edge.mjs`).

## Actual
`previewPerpOrderMargin` returns `sufficient: true`, `meetsInitialMargin: true`, `hasCollateralForLock: true` for quantity 0n, -5n and -10^12n. For negative quantities `increasingQuantity` and `lockAmount` are negative, i.e. the preview models an order that releases collateral. An integrator whose size calculation underflows gets a green light from the pre-trade check.

## Evidence
```
$ node repro/25-preview-margin-zero-negative-qty.mjs
previewPerpOrderMargin quantity=0: {"sufficient":true,"meetsInitialMargin":true,"hasCollateralForLock":true,"increasingQuantity":"0n","lockAmount":"0n"}
previewPerpOrderMargin quantity=-5: {"sufficient":true,"meetsInitialMargin":true,"hasCollateralForLock":true,"increasingQuantity":"-5n","lockAmount":"-199999999999999n"}
previewPerpOrderMargin quantity=-1000000000000: {"sufficient":true,"meetsInitialMargin":true,"hasCollateralForLock":true,"increasingQuantity":"-1000000000000n","lockAmount":"-39999999999999999999999999n"}
previewPerpLiquidationPrice quantity=0 -> InvalidInputError: @somnia-chain/markets-sdk: quantity must be > 0
getMaxPerpOrderSize price=0 -> InvalidInputError: @somnia-chain/markets-sdk: price must be > 0
```
Repro script: `node repro/25-preview-margin-zero-negative-qty.mjs`

## Environment
SDK @somnia-chain/markets-sdk 0.32.1, Node v22, network Somnia Tokyo testnet (Hideki, chain 50383), wallet 0xd2FeCA4Be0B81B15854ab3DD9Fd737d8307d0E36
