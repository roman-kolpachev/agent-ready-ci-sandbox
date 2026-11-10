import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vatTotal, formatVat } from '../src/vat.js';

test('lines 1000 and 2550 cents at 19% give 675 cents (674.5 rounded half away from zero)', () => {
  assert.equal(vatTotal([1000, 2550], 19), 675);
});

test('no lines give 0 cents', () => {
  assert.equal(vatTotal([], 19), 0);
  assert.equal(Object.is(vatTotal([], 19), 0), true);
});

test('a refund line (negative cents) lowers the VAT', () => {
  const withoutRefund = vatTotal([1000, 2550], 19);
  const withRefund = vatTotal([1000, 2550, -550], 19);
  assert.ok(withRefund < withoutRefund);
  assert.equal(withRefund, 570); // 3000 × 19% = 570
});

test('VAT is rounded once on the total, not per line', () => {
  // Two lines of 2 cents at 25%: per line 0.5 → 1 each = 2; on the total 4 × 25% = 1.
  assert.equal(vatTotal([2, 2], 25), 1);
});

test('negative totals round half away from zero', () => {
  assert.equal(vatTotal([-1000, -2550], 19), -675);
  assert.equal(formatVat([-1000, -2550], 19, 'EUR'), '-6.75 EUR');
});

test('zero rate and zero lines', () => {
  assert.equal(vatTotal([1000], 0), 0);
  assert.equal(formatVat([0], 19, 'EUR'), '0.00 EUR');
});

test('rates with decimals are exact', () => {
  assert.equal(vatTotal([10000], 7.7), 770);
  assert.equal(vatTotal([1000], 5.5), 55);
});

test('large amounts stay exact', () => {
  assert.equal(vatTotal([123456789012], 19), 23456789912); // 23456789912.28
  assert.equal(formatVat([123456789012], 19, 'EUR'), '234,567,899.12 EUR');
});

test('formatVat shows the amount with the currency code, such as 6.75 EUR', () => {
  assert.equal(formatVat([1000, 2550], 19, 'EUR'), '6.75 EUR');
  assert.equal(formatVat([1000], 19, 'USD'), '1.90 USD');
  assert.equal(formatVat([650000], 19, 'EUR'), '1,235.00 EUR');
});

test('rejects floats, bad rates and bad currency codes', () => {
  assert.throws(() => vatTotal([10.5], 19), TypeError);
  assert.throws(() => vatTotal('1000', 19), TypeError);
  assert.throws(() => vatTotal([1000], -1), RangeError);
  assert.throws(() => vatTotal([1000], NaN), RangeError);
  assert.throws(() => vatTotal([1000], 19.123), RangeError);
  assert.throws(() => formatVat([1000], 19, 'eur'), TypeError);
});
