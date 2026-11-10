import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyDiscount } from '../src/discount.js';

test('SPRING10 takes 10% off the total', () => {
  assert.equal(applyDiscount(10000, 'SPRING10'), 9000);
});

test('SPRING10 rounds the discount half up to whole cents', () => {
  assert.equal(applyDiscount(5, 'SPRING10'), 4); // 0.5 cent discount -> 1
  assert.equal(applyDiscount(15, 'SPRING10'), 13); // 1.5 -> 2
  assert.equal(applyDiscount(14, 'SPRING10'), 13); // 1.4 -> 1
  assert.equal(applyDiscount(12345, 'SPRING10'), 11110); // 1234.5 -> 1235
});

test('LOYAL5 takes a fixed 500 cents off', () => {
  assert.equal(applyDiscount(10000, 'LOYAL5'), 9500);
  assert.equal(applyDiscount(501, 'LOYAL5'), 1);
});

test('an unknown code throws "Unknown discount code"', () => {
  assert.throws(() => applyDiscount(10000, 'NOPE'), { message: 'Unknown discount code' });
  assert.throws(() => applyDiscount(10000, 'spring10'), { message: 'Unknown discount code' });
  assert.throws(() => applyDiscount(10000, ''), { message: 'Unknown discount code' });
  assert.throws(() => applyDiscount(10000, undefined), { message: 'Unknown discount code' });
  assert.throws(() => applyDiscount(10000, 'toString'), { message: 'Unknown discount code' });
});

test('the result is never below 0', () => {
  assert.equal(applyDiscount(499, 'LOYAL5'), 0);
  assert.equal(applyDiscount(500, 'LOYAL5'), 0);
  assert.equal(applyDiscount(-100, 'LOYAL5'), 0);
  assert.equal(applyDiscount(-100, 'SPRING10'), 0);
});

test('a zero total stays 0', () => {
  assert.equal(applyDiscount(0, 'SPRING10'), 0);
  assert.equal(applyDiscount(0, 'LOYAL5'), 0);
});

test('large amounts stay exact integers', () => {
  assert.equal(applyDiscount(100_000_000_000, 'SPRING10'), 90_000_000_000);
  assert.equal(applyDiscount(100_000_000_000, 'LOYAL5'), 99_999_999_500);
  const r = applyDiscount(Number.MAX_SAFE_INTEGER - 4, 'SPRING10');
  assert.ok(Number.isSafeInteger(r));
});

test('a total that is not integer cents throws a TypeError', () => {
  assert.throws(() => applyDiscount(100.5, 'SPRING10'), TypeError);
  assert.throws(() => applyDiscount('10000', 'SPRING10'), TypeError);
  assert.throws(() => applyDiscount(NaN, 'LOYAL5'), TypeError);
});
