/**
 * Unit tests for src/website-generator.js
 *
 * generate() calls the real OpenRouter API, so it is never invoked here.
 * buildPrompt() is a pure method (no network/fs) and is tested directly.
 *
 * deployToNetlify() resolves its save location from
 * process.env.HOME || process.env.USERPROFILE joined with a fixed
 * 'Desktop/SAOS Studio/crm/agent-drafts/<siteName>' suffix — there is no
 * injectable output-dir option. To force a deterministic write failure
 * without ever touching the real CRM folder, the failure test points
 * HOME/USERPROFILE at a path where the *first* path segment is a plain
 * file (not a directory) inside a temp dir: fs.mkdir(..., {recursive:true})
 * then fails with ENOTDIR before any file is written, and the env vars are
 * restored in a finally block.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

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

test('deployToNetlify() rethrows when the save location is unwritable, and leaves lastSavedHtmlPath null', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'website-generator-test-'));
  const blockerFile = path.join(dir, 'drafts-blocker');
  await fs.writeFile(blockerFile, 'not a directory');

  const originalDraftsPath = process.env.CRM_DRAFTS_PATH;
  // deployToNetlify joins the site name onto CRM_DRAFTS_PATH — pointing it at
  // a *file* means that join can never be created as a directory, so
  // fs.mkdir(..., {recursive:true}) fails deterministically with ENOTDIR.
  process.env.CRM_DRAFTS_PATH = blockerFile;

  try {
    const gen = new WebsiteGenerator();
    const lead = { Company: 'Deploy Fail Co' };
    const websiteData = { html: '<html>deploy-fail</html>' };

    await assert.rejects(() => gen.deployToNetlify(websiteData, lead));
    assert.equal(gen.lastSavedHtmlPath, null);
  } finally {
    if (originalDraftsPath === undefined) {
      delete process.env.CRM_DRAFTS_PATH;
    } else {
      process.env.CRM_DRAFTS_PATH = originalDraftsPath;
    }
    await fs.rm(dir, { recursive: true, force: true });
  }
});
