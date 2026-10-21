# fromHuman() silently rounds string amounts that have too many decimals, although its docs say a string is preserved or rejected
Severity: major
Area: SDK

## Steps to reproduce
1. Read the JSDoc of `fromHuman` in `node_modules/@somnia-chain/markets-sdk/dist/units.d.ts`: numbers with too many fraction digits are rounded, "Pass a string when you need the exact value preserved or rejected instead."
2. Run `node repro/17-fromhuman-string-rounding.mjs`. It passes strings with more fraction digits than `decimals`.

## Expected
A string value that cannot be represented exactly at `decimals` is rejected (throws). Per the JSDoc the string path is "exact or rejected".

## Actual
Strings are silently rounded half-up exactly like numbers. `fromHuman("0.000000005", 8)` returns `1n` (a non-zero size created from a value that is not representable) and `fromHuman("1.999", 2)` returns `200n`. Because `fromHuman` is the documented way to build `placePerpOrder` price and quantity, an integrator who followed the advice (use a string to be safe) can still place a larger quantity than they computed.

## Evidence
```
$ node repro/17-fromhuman-string-rounding.mjs
fromHuman("0.123456789", 8) -> 12345679n  (= 0.12345679)
fromHuman("0.000000005", 8) -> 1n  (= 0.00000001)
fromHuman("0.000000004", 8) -> 0n  (= 0)
fromHuman("1.999", 2) -> 200n  (= 2)
fromHuman("0.0000000000000000019", 18) -> 2n  (= 0.000000000000000002)
fromHuman("100000.123", 1) -> 1000001n  (= 100000.1)
```
Repro script: `node repro/17-fromhuman-string-rounding.mjs` (pure function, no network)

## Environment
SDK @somnia-chain/markets-sdk 0.32.1, Node v22, network Somnia Tokyo testnet (Hideki, chain 50383), wallet 0xd2FeCA4Be0B81B15854ab3DD9Fd737d8307d0E36 (not used by this script)
