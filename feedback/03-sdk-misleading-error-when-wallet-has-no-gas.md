# Write calls from a wallet with no STT fail as "reverted: Missing or invalid parameters" (ContractRevertError) although nothing was sent or reverted
Severity: normal
Area: SDK

## Steps to reproduce
1. Create a brand-new key with no STT on the Hideki testnet and construct the client as in the developer page "Connect" sample (with `privateKey`).
2. Run the documented Paper USDso sample: `await markets.trader.claimPerpVoucher({ marginBank: btc.marginBank })` (the page says "Any address can claim the 1,000 USDso perps credit once"). `getPerpVoucherEligibility` returns `eligible: true` for this address.
3. Run `node repro/05-unfunded-writes.mjs` (also tries placePerpOrder, depositMargin, withdrawMargin).

## Expected
An error saying the sender has no gas / does not exist on chain (an insufficient-funds style SDK error naming the sender), not a ContractRevertError that blames the call's parameters.

## Actual
Every write throws `ContractRevertError: ... claim reverted: Missing or invalid parameters. Double check you have provided the correct parameters.` The transaction was never mined: the RPC node rejected `eth_sendRawTransaction` with `account does not exist`, visible only three levels down the `cause` chain. `errorName` is unset. A new integrator following the docs in the documented order is sent debugging correct parameters. The sample code also does not say an unfunded address cannot even claim the voucher.

## Evidence
```
$ node repro/05-unfunded-writes.mjs
wallet 0xd2FeCA4Be0B81B15854ab3DD9Fd737d8307d0E36 STT 0n
ERR  claimPerpVoucher (docs sample) => ContractRevertError: @somnia-chain/markets-sdk: claim reverted: Missing or invalid parameters. | Double check you have provided the correct parameters.
      cause1 InvalidInputRpcError | account does not exist
      cause2 RpcRequestError | account does not exist
      cause3 Object | account does not exist
ERR  placePerpOrder (docs sample) => ContractRevertError: @somnia-chain/markets-sdk: placeOrder reverted: Missing or invalid parameters. | ...
ERR  depositMargin 1 USDso => ContractRevertError: @somnia-chain/markets-sdk: approve reverted: Missing or invalid parameters. | ...
```
Repro script: `node repro/05-unfunded-writes.mjs`

## Environment
SDK @somnia-chain/markets-sdk 0.32.1, Node v22, network Somnia Tokyo testnet (Hideki, chain 50383), wallet 0xd2FeCA4Be0B81B15854ab3DD9Fd737d8307d0E36 (0 STT, 0 USDso)
