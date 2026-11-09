import { test } from 'node:test';
import assert from 'node:assert/strict';

// KAN-12: a deliberately failing test, to see a red build in Jira
test('KAN-12: red on purpose', () => {
  assert.equal(1, 2);
});
