// Docs (developers/http-api/market-data, /trading): "Unknown or malformed symbols are silently skipped rather than erroring ... the response is []".
// Live testnet API (https://stg.api.dreamdex.io/v0) -- public, no auth.
const B = 'https://stg.api.dreamdex.io/v0';
const get = async (p) => { const r = await fetch(B + p); const t = await r.text(); console.log(`GET ${p}\n  -> HTTP ${r.status} ${t.slice(0, 220)}`); };
await get('/orderbooks?symbols=SOMI:USDso,WETH:USDso');   // doc: "Wrong -- ... matches no market and is silently skipped, so the response is []"
await get('/orderbooks?symbols=FOO:USDso');               // doc: unknown symbols silently skipped
await get('/tickers?symbols=SOMI:USDso&symbols=FOO:USDso');// doc: unknown symbols silently skipped
