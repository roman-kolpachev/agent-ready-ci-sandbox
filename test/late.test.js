import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lateFee, reminderSubject } from '../src/late.js';

test('lateFee is 0 within the grace period (day 14 is still free)', () => {
  assert.equal(lateFee(100000, 0), 0);
  assert.equal(lateFee(100000, 1), 0);
  assert.equal(lateFee(100000, 14), 0);
});

test('lateFee is 1.5% of the total in integer cents after the grace period', () => {
  assert.equal(lateFee(100000, 15), 1500);
  assert.equal(lateFee(100000, 90), 1500); // charged once, not per day
  assert.ok(Number.isInteger(lateFee(12345, 15)));
});

test('lateFee rounds half up to whole cents', () => {
  assert.equal(lateFee(100, 15), 2); // 1.5 -> 2
  assert.equal(lateFee(1234, 15), 19); // 18.51 -> 19
  assert.equal(lateFee(1230, 15), 18); // 18.45 -> 18
  assert.equal(lateFee(0, 15), 0);
});

test('lateFee is at most the cap of 5000 cents', () => {
  assert.equal(lateFee(333333, 15), 5000); // 4999.995 -> 5000
  assert.equal(lateFee(333266, 15), 4999); // 4998.99 -> 4999, just under the cap
  assert.equal(lateFee(1000000, 15), 5000);
  assert.equal(lateFee(Number.MAX_SAFE_INTEGER, 15), 5000);
});

test('lateFee rejects non-integer or negative totals', () => {
  assert.throws(() => lateFee(10.5, 15), RangeError);
  assert.throws(() => lateFee(-1, 15), RangeError);
});

test('reminderSubject uses the agreed wording', () => {
  assert.equal(
    reminderSubject('INV-1042', 14),
    'Reminder: invoice INV-1042 is 14 days overdue',
  );
  assert.equal(reminderSubject(7, 2), 'Reminder: invoice 7 is 2 days overdue');
});

test('reminderSubject says "1 day overdue" for exactly one day', () => {
  assert.equal(
    reminderSubject('INV-1042', 1),
    'Reminder: invoice INV-1042 is 1 day overdue',
  );
});
