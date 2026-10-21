# dreamDEX Perps feedback

Reproducible bug reports for the dreamDEX Perps testnet (SDK `@somnia-chain/markets-sdk` 0.32.1, docs, HTTP API) for the paid Feedback track. Every item in `feedback/` names the Node script in `repro/` that reproduces it, with real captured output. Read-only scripts need no funds. The wallet key is generated once into the parent volute `.env` (`DREAMDEX_TESTNET_ADDRESS` / `DREAMDEX_TESTNET_PRIVATE_KEY`) and read from the environment at runtime; it is never printed or committed.

Run: `npm install`, then `node repro/<script>.mjs` (Node 22). `repro/_env.mjs` loads the env and builds the client; `docs-src/` (gitignored) holds the downloaded doc pages used for checking.

| File | Title | Severity | Area |
| --- | --- | --- | --- |
| feedback/01-docs-document-sdk-apis-that-do-not-exist.md | Docs describe quotePerpClose, getPerpPositionsPage, getVenueHealth that are not in the published SDK | major | docs |
| feedback/02-sdk-fromhuman-string-input-is-rounded-not-rejected.md | fromHuman() rounds over-precise strings although docs say exact or rejected | major | SDK |
| feedback/03-sdk-misleading-error-when-wallet-has-no-gas.md | Unfunded wallet writes fail as "reverted: Missing or invalid parameters" | normal | SDK |
| feedback/04-sdk-previewperpordermargin-accepts-zero-and-negative-quantity.md | previewPerpOrderMargin says sufficient for quantity 0 / negative | normal | SDK |
| feedback/05-docs-open-interest-cap-table-does-not-match-chain.md | Docs OI cap table and "a tenth" claim do not match chain; live OI exceeds documented cap | normal | docs |
| feedback/06-docs-paper-usdso-allowlist-vs-chain.md | Docs say 6 markets outside paper-USDso allowlist, chain says all allowed | normal | contracts |
| feedback/07-api-docs-say-unknown-symbols-are-skipped-api-returns-400.md | HTTP API docs say unknown symbols are skipped, API returns 400 | normal | API |
| feedback/08-docs-sdk-perps-page-says-only-btc-and-eth.md | SDK docs say perps live only for BTC and ETH, 21 exist | normal | docs |
| feedback/09-sdk-position-analytics-do-not-resum-to-bank-equity-to-the-wei.md | Position analytics rows re-sum off by 1-4 wei on 13 of 46 accounts | normal | SDK |
| feedback/10-sdk-jsdoc-throws-list-is-copy-pasted-boilerplate.md | Same 17 @throws entries copy-pasted on 55 methods | normal | SDK |

