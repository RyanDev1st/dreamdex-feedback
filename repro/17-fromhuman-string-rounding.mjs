// JSDoc of fromHuman (units.d.ts): "A number carrying more fraction digits than `decimals` is ROUNDED ... Pass a string when you need
// the exact value preserved or rejected instead."  What do strings with too many fraction digits actually do?
import { fromHuman, toHumanString } from '@somnia-chain/markets-sdk';
const cases = [['0.123456789', 8], ['0.000000005', 8], ['0.000000004', 8], ['1.999', 2], ['0.0000000000000000019', 18], ['100000.123', 1]];
for (const [str, dec] of cases) {
  let out; try { const raw = fromHuman(str, dec); out = `${raw}n  (= ${toHumanString(raw, dec)})`; } catch (e) { out = 'THROWS ' + e.constructor.name + ': ' + e.message; }
  console.log(`fromHuman(${JSON.stringify(str)}, ${dec}) -> ${out}`);
}
