/**
 * Unit/integration tests for src/dashboard-server.js
 *
 * DashboardServer hardcodes its DB paths as './data/approval-queue.db' and
 * './data/agent-state.db' (relative to process.cwd()), so it is exercised
 * here as a real child process spawned with cwd pointed at a temp directory
 * that contains COPIES of the real project DBs (never the real files).
 * A known row is inserted into the copy (via ApprovalQueue, chdir'd into
 * the temp dir) before the server starts, so the approve/preview
 * assertions have a deterministic id to work with regardless of what the
 * real data/approval-queue.db currently contains.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

import { ApprovalQueue } from '../src/approval-queue.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const dashboardServerPath = path.join(projectRoot, 'src', 'dashboard-server.js');

function closeDb(db) {
  return new Promise((resolve) => db.close(() => resolve()));
}

/**
 * Env for a spawned `node` grandchild, stripped of the vars Node's own
 * `--test` runner uses to talk to *this* file's worker process. Left in
 * place, a freshly spawned Node process can end up participating in that
 * same channel and corrupt the test reporter stream for the whole run
 * (surfaces as "Unable to deserialize cloned data..." in an unrelated
 * test file).
 */
function childEnv(extra = {}) {
  const env = { ...process.env, ...extra };
  delete env.NODE_TEST_CONTEXT;
  delete env.NODE_TEST_WORKER_ID;
  return env;
}

/** Insert one known queue row into the temp-dir copy of approval-queue.db and return its id. */
async function seedKnownRow(tempDir) {
  const previousCwd = process.cwd();
  process.chdir(tempDir);
  try {
    const queue = new ApprovalQueue();
    await queue.initialize(); // idempotent migration against the copied DB
    const id = await queue.addToQueue({
      company: 'Dashboard Test Co',
      email: 'dashboard-test@co.gr',
      phone: '2107778888',
      websiteUrl: null,
      demoUrl: 'http://example.com/demo-dashboard-test',
      websiteData: { html: '<html>dashboard-test</html>' },
      status: 'pending_approval',
      createdAt: new Date().toISOString(),
    });
    await closeDb(queue.db);
    return id;
  } finally {
    process.chdir(previousCwd);
  }
}

async function fetchWithRetry(url, { retries = 25, delayMs = 200 } = {}) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url);
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

/**
 * Start the dashboard server as a child process on the given port, waiting
 * until it responds or fails. Returns { child, port, failedWithAddrInUse }.
 */
function startServerOnce(tempDir, port) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [dashboardServerPath], {
      cwd: tempDir,
      env: childEnv({ DASHBOARD_PORT: String(port) }),
      // stdout is never read (only stderr, to sniff EADDRINUSE) — 'ignore'
      // it rather than opening an unused pipe/handle.
      stdio: ['ignore', 'ignore', 'pipe'],
    });

    let stderrBuf = '';
    let settled = false;
    child.stderr.on('data', (d) => { stderrBuf += d.toString(); });
    child.on('exit', () => {
      if (!settled) {
        settled = true;
        resolve({ child, port, exited: true, addrInUse: /EADDRINUSE/.test(stderrBuf) });
      }
    });

    (async () => {
      try {
        await fetchWithRetry(`http://127.0.0.1:${port}/api/stats`, { retries: 30, delayMs: 200 });
        if (!settled) {
          settled = true;
          resolve({ child, port, exited: false, addrInUse: false });
        }
      } catch {
        if (!settled) {
          settled = true;
          resolve({ child, port, exited: false, addrInUse: /EADDRINUSE/.test(stderrBuf), timedOut: true });
        }
      }
    })();
  });
}

function killChild(child) {
  if (!child || child.killed || child.exitCode !== null) return;
  if (process.platform === 'win32') {
    try {
      // Use the fully-qualified path rather than relying on PATH containing
      // System32 (not guaranteed in every shell this test may run under).
      const systemRoot = process.env.SystemRoot || process.env.WINDIR || 'C:\\Windows';
      const taskkillPath = path.join(systemRoot, 'System32', 'taskkill.exe');
      spawn(taskkillPath, ['/pid', String(child.pid), '/T', '/F'], { shell: false, stdio: 'ignore' }).on('error', () => {});
    } catch {
      // ignore
    }
  } else {
    try {
      child.kill('SIGKILL');
    } catch {
      // ignore
    }
  }
}

async function rmWithRetry(dir) {
  for (let i = 0; i < 5; i++) {
    try {
      await fs.rm(dir, { recursive: true, force: true });
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
}

test('DashboardServer: /api/stats, /api/queue, approve, unknown preview 404, static UI', async (t) => {
  // A brief stagger before spawning a grandchild `node` process: when every
  // *.test.js worker file starts at once, spawning here in the same instant
  // as other files' own startup has occasionally (rarely) corrupted an
  // unrelated file's `--test` reporter channel on Windows ("Unable to
  // deserialize cloned data..."). Not a fix, just a mitigation of the race
  // window — see the equivalent note in tests/designer-agent.test.js.
  await new Promise((r) => setTimeout(r, 300));

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'dashboard-test-'));
  await fs.mkdir(path.join(tempDir, 'data'), { recursive: true });

  await fs.copyFile(
    path.join(projectRoot, 'data', 'approval-queue.db'),
    path.join(tempDir, 'data', 'approval-queue.db')
  );
  await fs.copyFile(
    path.join(projectRoot, 'data', 'agent-state.db'),
    path.join(tempDir, 'data', 'agent-state.db')
  );

  const knownId = await seedKnownRow(tempDir);

  const firstPort = 4190 + Math.floor(Math.random() * 300);
  let outcome = await startServerOnce(tempDir, firstPort);

  if (outcome.exited || outcome.timedOut) {
    // Retry once with a different ephemeral port (e.g. the first was in use).
    killChild(outcome.child);
    const secondPort = firstPort + 1000;
    outcome = await startServerOnce(tempDir, secondPort);
  }

  const { child, port } = outcome;
  t.after(async () => {
    killChild(child);
    await new Promise((r) => setTimeout(r, 300));
    await rmWithRetry(tempDir);
  });

  assert.ok(!outcome.exited && !outcome.timedOut, 'expected dashboard server to become ready');

  const base = `http://127.0.0.1:${port}`;

  // GET /api/stats
  const statsRes = await fetch(`${base}/api/stats`);
  assert.equal(statsRes.status, 200);
  const stats = await statsRes.json();
  assert.ok('queue' in stats, 'expected stats.queue');
  assert.ok('weekly' in stats, 'expected stats.weekly');

  // GET /api/queue
  const queueRes = await fetch(`${base}/api/queue`);
  assert.equal(queueRes.status, 200);
  const queueRows = await queueRes.json();
  assert.ok(Array.isArray(queueRows));
  assert.ok(queueRows.length > 0, 'expected at least the seeded row');
  for (const row of queueRows) {
    assert.ok(!('website_data' in row), 'expected /api/queue rows to exclude website_data');
  }
  const seededRow = queueRows.find((r) => r.id === knownId);
  assert.ok(seededRow, 'expected the seeded row to be present in /api/queue');
  assert.equal(seededRow.status, 'pending_approval');

  // POST /api/queue/:id/approve
  const approveRes = await fetch(`${base}/api/queue/${knownId}/approve`, { method: 'POST' });
  assert.equal(approveRes.status, 200);
  const approveBody = await approveRes.json();
  assert.equal(approveBody.ok, true);

  const queueAfterRes = await fetch(`${base}/api/queue`);
  const queueAfter = await queueAfterRes.json();
  const approvedRow = queueAfter.find((r) => r.id === knownId);
  assert.ok(approvedRow, 'expected the seeded row to still be present');
  assert.equal(approvedRow.status, 'approved');

  // GET /api/queue/:id/preview for an id that does not exist
  const previewRes = await fetch(`${base}/api/queue/999999999/preview`);
  assert.equal(previewRes.status, 404);

  // GET / — static UI
  const rootRes = await fetch(`${base}/`);
  assert.equal(rootRes.status, 200);
  assert.ok((rootRes.headers.get('content-type') || '').includes('text/html'));
});
