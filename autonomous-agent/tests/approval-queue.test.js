/**
 * Unit tests for src/approval-queue.js
 *
 * ApprovalQueue hardcodes its SQLite path as './data/approval-queue.db'
 * (relative to process.cwd()). To keep tests fully isolated from the
 * real project's data/approval-queue.db, each test runs against a fresh
 * temp directory (with its own data/ subfolder) as the process cwd.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { ApprovalQueue } from '../src/approval-queue.js';

/** Run `fn` with process.cwd() pointed at a fresh temp dir containing a data/ folder. */
async function withTempCwd(fn) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'approval-queue-test-'));
  await fs.mkdir(path.join(dir, 'data'), { recursive: true });
  const previousCwd = process.cwd();
  process.chdir(dir);
  try {
    return await fn(dir);
  } finally {
    process.chdir(previousCwd);
    await fs.rm(dir, { recursive: true, force: true });
  }
}

function closeDb(db) {
  return new Promise((resolve) => db.close(() => resolve()));
}

function getTableInfo(db) {
  return new Promise((resolve, reject) => {
    db.all('PRAGMA table_info(approval_queue)', (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

function getRowById(db, id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM approval_queue WHERE id = ?', [id], (err, row) => (err ? reject(err) : resolve(row)));
  });
}

test('initialize() creates the DB with qa_score/qa_status/qa_report columns', async () => {
  await withTempCwd(async () => {
    const queue = new ApprovalQueue();
    await queue.initialize();

    const columns = await getTableInfo(queue.db);
    const names = columns.map((c) => c.name);

    assert.ok(names.includes('qa_score'), 'expected qa_score column');
    assert.ok(names.includes('qa_status'), 'expected qa_status column');
    assert.ok(names.includes('qa_report'), 'expected qa_report column');

    await closeDb(queue.db);
  });
});

test('initialize() twice does not error (migration is idempotent)', async () => {
  await withTempCwd(async () => {
    const queue = new ApprovalQueue();
    await queue.initialize();
    const firstDb = queue.db; // initialize() opens a fresh connection each call
    await assert.doesNotReject(() => queue.initialize());

    const columns = await getTableInfo(queue.db);
    const names = columns.map((c) => c.name);
    assert.ok(names.includes('qa_score'));
    assert.ok(names.includes('qa_status'));
    assert.ok(names.includes('qa_report'));

    // Close both connections (Windows keeps an exclusive lock on the file
    // otherwise, which breaks the temp-dir cleanup in withTempCwd).
    await closeDb(firstDb);
    await closeDb(queue.db);
  });
});

test('addToQueue without qa fields persists a row with NULL qa_* columns', async () => {
  await withTempCwd(async () => {
    const queue = new ApprovalQueue();
    await queue.initialize();

    const id = await queue.addToQueue({
      company: 'Test Co',
      email: 'test@testco.gr',
      phone: '2101234567',
      websiteUrl: null,
      demoUrl: 'http://example.com/demo',
      websiteData: { html: '<html></html>' },
      status: 'pending_approval',
      createdAt: new Date().toISOString(),
    });

    const row = await getRowById(queue.db, id);
    assert.equal(row.company, 'Test Co');
    assert.equal(row.qa_score, null);
    assert.equal(row.qa_status, null);
    assert.equal(row.qa_report, null);

    await closeDb(queue.db);
  });
});

test('addToQueue with qaScore/qaStatus/qaReport(object) persists them, qa_report as JSON string', async () => {
  await withTempCwd(async () => {
    const queue = new ApprovalQueue();
    await queue.initialize();

    const qaReport = { score: 85, pass: true, issues: [{ severity: 'low', description: 'minor nit' }] };

    const id = await queue.addToQueue({
      company: 'QA Passed Co',
      email: 'qa@passedco.gr',
      phone: '2109876543',
      websiteUrl: null,
      demoUrl: 'http://example.com/demo-qa',
      websiteData: { html: '<html></html>' },
      status: 'pending_approval',
      createdAt: new Date().toISOString(),
      qaScore: 85,
      qaStatus: 'qa_passed',
      qaReport,
    });

    const row = await getRowById(queue.db, id);
    assert.equal(row.qa_score, 85);
    assert.equal(row.qa_status, 'qa_passed');
    assert.equal(typeof row.qa_report, 'string');
    assert.deepEqual(JSON.parse(row.qa_report), qaReport);

    await closeDb(queue.db);
  });
});

test("getStats() reflects a 'qa_failed' row", async () => {
  await withTempCwd(async () => {
    const queue = new ApprovalQueue();
    await queue.initialize();

    await queue.addToQueue({
      company: 'QA Failed Co',
      email: 'qa@failedco.gr',
      phone: '2105551234',
      websiteUrl: null,
      demoUrl: 'http://example.com/demo-fail',
      websiteData: { html: '<html></html>' },
      status: 'qa_failed',
      createdAt: new Date().toISOString(),
      qaScore: 42,
      qaStatus: 'qa_failed',
      qaReport: { score: 42, pass: false, issues: [{ severity: 'critical', description: 'leaked placeholder' }] },
    });
    await queue.addToQueue({
      company: 'Pending Co',
      email: 'pending@co.gr',
      phone: '2105559999',
      websiteUrl: null,
      demoUrl: 'http://example.com/demo-pending',
      websiteData: { html: '<html></html>' },
      status: 'pending_approval',
      createdAt: new Date().toISOString(),
    });

    const stats = await queue.getStats();
    assert.equal(stats.qa_failed, 1);
    assert.equal(stats.pending_approval, 1);

    await closeDb(queue.db);
  });
});
