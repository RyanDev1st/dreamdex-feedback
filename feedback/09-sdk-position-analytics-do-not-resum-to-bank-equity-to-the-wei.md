# listPerpPositionAnalytics rows do not re-sum to MarginBank equity "to the wei" for 13 of 46 real accounts (off by 1 to 4 wei)
Severity: normal
Area: SDK

## Steps to reproduce
1. Read the Perps page https://somnia-platform-docs.vercel.app/markets/somnia-markets/typescript/perps , "What is this position actually doing?": the `perpPositionAnalytics` rows are "a direct port of `MarginBank._computePositionMetrics` ..., which is what lets the rows re-sum to the bank's own equity to the wei - a test pins that." Bank equity counts free collateral only.
2. Run `node repro/11-analytics-invariants.mjs`. It finds real accounts with open positions (`getPerpSideHolders`), reads `listPerpPositionAnalytics`, then reads `MarginBank.getAccountState` and `getAccountHealth` pinned to the rows' `asOfBlock` and checks `unlockedCollateralBalance + sum(equityContribution) == equity`.

## Expected
Zero difference at the same block.

## Actual
13 of 46 accounts differ, always by +1 to +4 wei (the SDK sum is larger than the bank's equity), at the same block, with all rows from one block. Reproduced on repeated runs with the same count. Likely a per-position vs aggregate rounding difference (funding ceil). Tiny in value, but it contradicts a documented exactness guarantee that keepers and scoring code may rely on for equality checks.

## Evidence
```
$ node repro/11-analytics-invariants.mjs
accounts with positions: 46
MISMATCH 0x5c693d3D7DaCFd71F6F70A0cB6010A773e004d68 block 29449237n bank equity 2999297347827901618514n collateral+sum(contrib) 2999297347827901618515n diff 1n rows 9 allRowsSameBlock true
MISMATCH 0x07EbD7715B2ED2ffe0D821002fD66f409EC67d79 block 29449250n bank equity 14466009243034486398n collateral+sum(contrib) 14466009243034486399n diff 1n rows 4 allRowsSameBlock true
MISMATCH 0x93f4Fde0E614b9b9EA78235773F4c49Bb0f71D29 ... diff 4n rows 12 allRowsSameBlock true
checked 46 accounts, 13 mismatches
```
Repro script: `node repro/11-analytics-invariants.mjs` (the set of accounts changes slightly over time; the mismatch count was 13 on each of the runs I made)

## Environment
SDK @somnia-chain/markets-sdk 0.32.1, Node v22, network Somnia Tokyo testnet (Hideki, chain 50383), MarginBank 0x478769E1177C0773c43A593DCCc4Ad15F15F1394, wallet 0xd2FeCA4Be0B81B15854ab3DD9Fd737d8307d0E36 (not used; third-party accounts are only read)
