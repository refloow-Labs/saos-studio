/**
 * Unit tests for src/website-generator.js
 *
 * generate() calls the real OpenRouter API, so it is never invoked here.
 * buildPrompt() is a pure method (no network/fs) and is tested directly.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { WebsiteGenerator } from '../src/website-generator.js';

const lead = {
  Company: 'Test Co',
  'Περιγραφή 1': 'Μια δοκιμαστική επιχείρηση',
  'Περιοχή': 'Αθήνα',
  'Τηλέφωνο': '2101234567',
  Email: 'test@testco.gr',
  'Ιστοσελίδα Εταιρίας': '',
};

test('buildPrompt without qaFeedback does not include the QA corrections section', () => {
  const gen = new WebsiteGenerator();
  const prompt = gen.buildPrompt(lead, 'Retail', undefined);

  assert.ok(!prompt.includes('ΔΙΟΡΘΩΣΕΙΣ QA'));
  assert.ok(prompt.includes('Test Co'));
  assert.ok(prompt.includes('Retail'));
});

test('buildPrompt with an empty qaFeedback array also omits the QA section (edge case)', () => {
  const gen = new WebsiteGenerator();
  const prompt = gen.buildPrompt(lead, 'Retail', []);

  assert.ok(!prompt.includes('ΔΙΟΡΘΩΣΕΙΣ QA'));
});

test('buildPrompt with qaFeedback appends a numbered ΔΙΟΡΘΩΣΕΙΣ QA section with severity and fix', () => {
  const gen = new WebsiteGenerator();
  const qaFeedback = [
    { severity: 'high', description: 'Missing contact form validation', fix: 'Add client-side validation' },
  ];
  const prompt = gen.buildPrompt(lead, 'Retail', qaFeedback);

  assert.ok(prompt.includes('ΔΙΟΡΘΩΣΕΙΣ QA'));
  assert.ok(
    prompt.includes('1. [high] Missing contact form validation — Add client-side validation'),
    'expected the numbered issue line with severity and fix to be present'
  );
});

test('buildPrompt with multiple qaFeedback issues numbers each item', () => {
  const gen = new WebsiteGenerator();
  const qaFeedback = [
    { severity: 'critical', description: 'Placeholder email leaked' },
    { severity: 'medium', description: 'Broken anchor link', fix: 'Add matching id attribute' },
  ];
  const prompt = gen.buildPrompt(lead, 'Retail', qaFeedback);

  assert.ok(prompt.includes('1. [critical] Placeholder email leaked'));
  assert.ok(prompt.includes('2. [medium] Broken anchor link — Add matching id attribute'));
});

test('constructor exposes lastSavedHtmlPath, initialized to null', () => {
  const gen = new WebsiteGenerator();
  assert.ok('lastSavedHtmlPath' in gen);
  assert.equal(gen.lastSavedHtmlPath, null);
});
