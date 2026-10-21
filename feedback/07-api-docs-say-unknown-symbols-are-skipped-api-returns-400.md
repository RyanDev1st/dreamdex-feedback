# HTTP API docs say unknown or malformed symbols are silently skipped and the response is [], but the API returns 400 invalid_param
Severity: normal
Area: API

## Steps to reproduce
1. Read https://app.testnet.dreamdex.io/docs/developers/http-api/market-data : "Unknown or malformed symbols are silently skipped rather than erroring"; the comma-separated example "# Wrong - parsed as one literal symbol ... which matches no market and is silently skipped, so the response is []"; and for GET /v0/tickers "unknown symbols are silently skipped". The trading page says the same for GET /v0/orders.
2. Run `node repro/22-http-api-symbols-not-skipped.mjs` (public staging API, no auth).

## Expected
HTTP 200 with `[]` / the known markets only, as documented.

## Actual
HTTP 400 `invalid_param` with `unknown market symbols`, on /orderbooks and /tickers, including when one valid and one unknown symbol are passed. The behaviour is arguably better than documented, but integrators who rely on the doc (for example filtering a user's watchlist against the API) will break, and the doc's "response is []" debugging hint is wrong.

## Evidence
```
$ node repro/22-http-api-symbols-not-skipped.mjs
GET /orderbooks?symbols=SOMI:USDso,WETH:USDso
  -> HTTP 400 {"context":{"invalid_symbols":["SOMI:USDso,WETH:USDso"]},"description":"unknown market symbols: SOMI:USDso,WETH:USDso","name":"invalid_param","status":400}
GET /orderbooks?symbols=FOO:USDso
  -> HTTP 400 {"context":{"invalid_symbols":["FOO:USDso"]},"description":"unknown market symbols: FOO:USDso","name":"invalid_param","status":400}
GET /tickers?symbols=SOMI:USDso&symbols=FOO:USDso
  -> HTTP 400 {"context":{"invalid_symbols":["FOO:USDso"]},"description":"unknown market symbols: FOO:USDso","name":"invalid_param","status":400}
```
Repro script: `node repro/22-http-api-symbols-not-skipped.mjs` (equivalent: `curl "https://stg.api.dreamdex.io/v0/orderbooks?symbols=FOO:USDso"`)

## Environment
Staging REST API https://stg.api.dreamdex.io/v0 (Somnia Shannon testnet per the docs), SDK not involved (repo pins @somnia-chain/markets-sdk 0.32.1, Somnia Tokyo testnet for the rest of the report), wallet 0xd2FeCA4Be0B81B15854ab3DD9Fd737d8307d0E36 (not used)
