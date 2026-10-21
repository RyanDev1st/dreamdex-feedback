# SDK client JSDoc: the same 17 @throws entries (with a meaningless sentence) are attached to 55 different methods
Severity: normal
Area: SDK

## Steps to reproduce
1. Open `node_modules/@somnia-chain/markets-sdk/dist/somniaMarketsClient.d.ts` and look at the JSDoc of `getMaxPerpOrderSize`, `getPerpRiskParams` or `previewPerpOrderMargin`.
2. Run `node repro/24-jsdoc-throws-boilerplate.mjs`.

## Expected
`@throws` lists the errors the method can actually raise (for `getPerpRiskParams`, an eth_call: `InvalidInputError`, `RpcError`).

## Actual
55 of the 128 documented methods carry an identical 17-entry list, each with the same sentence "A supplied RPC constructor or socket interrupts this chain read with this SDK error. The owning read retains its identity.", including `SignerRequiredError`, `BridgeLiquidityError`, `BridgeDeliveryTimeoutError`, `FillHistoryRestartRequiredError` and `CollateralOnWrongChainError` on pure perp reads. IDE tooltips and the generated API reference therefore give no usable error-handling guidance and hide which errors really matter (for example the unfunded-wallet case in feedback item 03).

## Evidence
```
$ node repro/24-jsdoc-throws-boilerplate.mjs
doc blocks with @throws: 128; blocks sharing the single most common @throws list: 55
that list has 17 entries, e.g.:
  @throws {InvalidInputError} A supplied RPC constructor or socket interrupts this chain read with this SDK error. The owning read retains its identity.
  @throws {NotConfiguredError} A supplied RPC constructor or socket interrupts this chain read with this SDK error. The owning read retains its identity.
getPerpRiskParams (one eth_call returning 8 numbers) documents 17 @throws: InvalidInputError, NotConfiguredError, NotSupportedError, SignerRequiredError, IndexerError, IndexerUnavailableError, IndexerWaitTimeoutError, RpcError, ContractRevertError, TransactionOutcomeUnknownError, FillHistoryRestartRequiredError, FillHistoryUnavailableError, IncompleteHistoryError, CollateralOnWrongChainError, BridgeLiquidityError, BridgeDeliveryTimeoutError, InvariantError
```
Repro script: `node repro/24-jsdoc-throws-boilerplate.mjs` (reads the installed .d.ts, no network)

## Environment
SDK @somnia-chain/markets-sdk 0.32.1, Node v22, network Somnia Tokyo testnet (Hideki, chain 50383), wallet 0xd2FeCA4Be0B81B15854ab3DD9Fd737d8307d0E36 (not used)
