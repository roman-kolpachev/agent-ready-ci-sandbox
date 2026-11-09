import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../src/slugify.js';

test('lowercases and joins words with a dash', () => {
  assert.equal(slugify('Hello, World!'), 'hello-world');
});

test('collapses runs of spaces, dashes and punctuation into one dash', () => {
  assert.equal(slugify('a   b'), 'a-b');
  assert.equal(slugify('a -- b'), 'a-b');
  assert.equal(slugify('a!?,.;b'), 'a-b');
  assert.equal(slugify('Fix: login -- broken (again)'), 'fix-login-broken-again');
});

test('has no dash at the start or the end', () => {
  assert.equal(slugify('  --Hello--  '), 'hello');
  assert.equal(slugify('!!!Release v2.0!!!'), 'release-v2-0');
});

test('strips accents from letters', () => {
  assert.equal(slugify('Crème brûlée'), 'creme-brulee');
  assert.equal(slugify('Ångström Ñandú'), 'angstrom-nandu');
});

test('returns an empty string when there are no letters or digits', () => {
  assert.equal(slugify(''), '');
  assert.equal(slugify('   '), '');
  assert.equal(slugify('!@#$%^&*() -- ...'), '');
});

test('KAN-11: a title of spaces only gives an empty string', () => {
  assert.equal(slugify('   '), '');
});
