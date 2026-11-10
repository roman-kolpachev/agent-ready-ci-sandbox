import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reminderSubject } from '../src/late.js';

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
