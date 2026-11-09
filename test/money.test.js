import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatMoney } from '../src/money.js';

test('1234.5 in EUR (123450 cents) shows as 1,234.50 EUR', () => {
  assert.equal(formatMoney(123450, 'EUR'), '1,234.50 EUR');
});

test('negative amounts show a minus sign before the number', () => {
  assert.equal(formatMoney(-123450, 'EUR'), '-1,234.50 EUR');
  assert.equal(formatMoney(-5, 'EUR'), '-0.05 EUR');
  assert.equal(formatMoney(-100, 'USD'), '-1.00 USD');
});

test('zero shows as 0.00 EUR', () => {
  assert.equal(formatMoney(0, 'EUR'), '0.00 EUR');
  assert.equal(formatMoney(-0, 'EUR'), '0.00 EUR');
});

test('large amounts get a separator every three digits', () => {
  assert.equal(formatMoney(123456789012, 'EUR'), '1,234,567,890.12 EUR');
  assert.equal(formatMoney(Number.MAX_SAFE_INTEGER, 'EUR'), '90,071,992,547,409.91 EUR');
  assert.equal(formatMoney(10n ** 20n, 'EUR'), '1,000,000,000,000,000,000.00 EUR');
});

test('small amounts keep two decimals', () => {
  assert.equal(formatMoney(5, 'EUR'), '0.05 EUR');
  assert.equal(formatMoney(100000, 'EUR'), '1,000.00 EUR');
  assert.equal(formatMoney(99999, 'EUR'), '999.99 EUR');
});

test('rejects floats and non-numbers, since money is integer cents', () => {
  assert.throws(() => formatMoney(1234.5, 'EUR'), TypeError);
  assert.throws(() => formatMoney(NaN, 'EUR'), TypeError);
  assert.throws(() => formatMoney('123450', 'EUR'), TypeError);
});

test('rejects a currency that is not a three-letter ISO code', () => {
  assert.throws(() => formatMoney(100, 'eur'), TypeError);
  assert.throws(() => formatMoney(100, '€'), TypeError);
  assert.throws(() => formatMoney(100), TypeError);
});
