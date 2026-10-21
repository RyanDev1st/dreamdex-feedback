// Pure helper edge cases against their own JSDoc contracts (no network).
import * as s from '@somnia-chain/markets-sdk';
const t = (k, f) => { try { const r = f(); console.log('OK ', k.padEnd(52), '=>', typeof r === 'bigint' ? r + 'n' : JSON.stringify(r)); } catch (e) { console.log('ERR', k.padEnd(52), '=>', e?.constructor?.name + ': ' + String(e?.message).split('\n')[0].slice(0, 120)); } };
// fromHuman
t('fromHuman("0.1", 18)', () => s.fromHuman('0.1', 18));
t('fromHuman(0.1234567, 6)  [doc: 123457n]', () => s.fromHuman(0.1234567, 6));
t('fromHuman(1e-7, 18)', () => s.fromHuman(1e-7, 18));
t('fromHuman("1e-7", 18)', () => s.fromHuman('1e-7', 18));
t('fromHuman(1e21, 18)', () => s.fromHuman(1e21, 18));
t('fromHuman(-0.5, 8)', () => s.fromHuman(-0.5, 8));
t('fromHuman("-0.5", 8)', () => s.fromHuman('-0.5', 8));
t('fromHuman("abc", 8)', () => s.fromHuman('abc', 8));
t('fromHuman("", 8)', () => s.fromHuman('', 8));
t('fromHuman(NaN, 8)', () => s.fromHuman(NaN, 8));
t('fromHuman(Infinity, 8)', () => s.fromHuman(Infinity, 8));
t('fromHuman("0.123456789", 8)  [string: exact or reject]', () => s.fromHuman('0.123456789', 8));
t('fromHuman(0.5, 24)  (NEAR 24 decimals)', () => s.fromHuman(0.5, 24));
t('fromHuman(1.005, 2)', () => s.fromHuman(1.005, 2));
t('fromHuman(0.285, 2)', () => s.fromHuman(0.285, 2));
t('fromHuman(8.345, 2)', () => s.fromHuman(8.345, 2));
// toHuman
t('toHumanString(-5n, 8)', () => s.toHumanString(-5n, 8));
t('toHumanString(0n, 0)', () => s.toHumanString(0n, 0));
t('toHumanString(123n, 0)', () => s.toHumanString(123n, 0));
t('toHumanString(1n, 24)', () => s.toHumanString(1n, 24));
t('toHumanString(-1000000000000000000n, 18)', () => s.toHumanString(-1000000000000000000n, 18));
t('toHuman("abc", 8)', () => s.toHuman('abc', 8));
// grid
t('snapRawToGrid(5n, 0n, "down")', () => s.snapRawToGrid(5n, 0n, 'down'));
t('snapRawToGrid(-5n, 3n, "down")', () => s.snapRawToGrid(-5n, 3n, 'down'));
t('snapRawToGrid(-5n, 3n, "up")', () => s.snapRawToGrid(-5n, 3n, 'up'));
t('snapRawToGrid(5n, 3n, "sideways")', () => s.snapRawToGrid(5n, 3n, 'sideways'));
t('roundPriceToTick(0n, 10n, "down")', () => s.roundPriceToTick(0n, 10n, 'down'));
t('roundPriceToTick(5n, 10n, "up")', () => s.roundPriceToTick(5n, 10n, 'up'));
// funding
t('fundingRate8h(10n**15n, 0)', () => s.fundingRate8h(10n ** 15n, 0));
t('fundingRate8h(10n**15n, -1)', () => s.fundingRate8h(10n ** 15n, -1));
t('fundingRatePerInterval(8e14, 28800, 0)', () => s.fundingRatePerInterval(800000000000000n, 28800, 0));
t('fundingRatePerInterval(8e14, 28800, 3600) [100000000000000n]', () => s.fundingRatePerInterval(800000000000000n, 28800, 3600));
t('fundingRatePerInterval(8e14, 28800, 7200)', () => s.fundingRatePerInterval(800000000000000n, 28800, 7200));
t('fundingRatePerInterval(8e14, 28800, 28801)', () => s.fundingRatePerInterval(800000000000000n, 28800, 28801));
t('intervalsPerWindow(28800, 3600)', () => s.intervalsPerWindow(28800, 3600));
t('intervalsPerWindow(28800, 0)', () => s.intervalsPerWindow(28800, 0));
t('intervalsPerWindow(28800, 5000)', () => s.intervalsPerWindow(28800, 5000));
t('annualizedFundingRate(1e15, 28800)', () => s.annualizedFundingRate(10n ** 15n, 28800));
t('annualizedFundingRate(1e15, 0)', () => s.annualizedFundingRate(10n ** 15n, 0));
// liquidation price vs documented formula
const mk = 100000n * 10n ** 18n;
const inp = { size: 10n ** 8n, markPrice: mk, equity: 5000n * 10n ** 18n, mmBps: 250n, oneBase: 10n ** 8n };
console.log('perpLiquidationPrice inputs:', Object.keys(inp).join(','));
process.exit(0);
