/**
 * Unit tests for src/qa-gate.js
 *
 * Exercises the CLI entrypoint (`node src/qa-gate.js --test <file> --skip-skill-layers`)
 * against small HTML fixtures written to a temp dir, and parses the verdict
 * JSON printed to stdout. --skip-skill-layers disables layers 3a/3b
 * (the headless `claude` skill sessions) so this stays fully offline;
 * layer 1 (deterministic) always runs, and layer 2 (local headless
 * Chromium via the bundled playwright-skill) runs against a local static
 * file server only — no network access.
 *
 * Fixtures deliberately avoid <script>/external resources so layer 2
 * contributes zero issues for tests 1-4, keeping the deterministic-layer
 * assertions (and the score-arithmetic recomputation) predictable. A
 * single dedicated fixture is used for the optional browser-layer check.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const qaGateScript = path.join(projectRoot, 'src', 'qa-gate.js');
const qaOutputDir = path.join(projectRoot, 'data', 'qa-output');

const SEVERITY_DEDUCTIONS = { critical: 30, high: 15, medium: 7, low: 3 };

// Padding so every fixture comfortably clears the 2KB "empty/truncated" floor.
const GREEK_FILLER = 'Αυτή είναι μια πρόταση γεμίσματος περιεχομένου για τους σκοπούς της δοκιμής. '.repeat(20);

function slugify(str) {
  const slug = String(str || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return slug || 'unknown';
}

function buildCleanFixture() {
  return `<!DOCTYPE html>
<html lang="el">
<head>
<meta charset="UTF-8">
<title>Καθαρή Ιστοσελίδα Δοκιμής</title>
<meta name="description" content="Μια καθαρή ιστοσελίδα δοκιμής για το QA gate, χωρίς κανένα ελάττωμα.">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<nav>
<a href="#about">Σχετικά</a>
<a href="#services">Υπηρεσίες</a>
<a href="#contact">Επικοινωνία</a>
</nav>
<main>
<section id="about">
<h1>Καλώς ήρθατε στην επιχείρησή μας</h1>
<p>${GREEK_FILLER}</p>
<img src="team.jpg" alt="Η ομάδα της επιχείρησής μας">
</section>
<section id="services">
<h2>Οι Υπηρεσίες μας</h2>
<p>${GREEK_FILLER}</p>
<img src="service.jpg" alt="Μια από τις υπηρεσίες μας">
</section>
<section id="contact">
<h2>Επικοινωνήστε μαζί μας</h2>
<form>
<input type="text" name="name" placeholder="Το όνομά σας" required>
<input type="email" name="email" placeholder="Το email σας" required>
<textarea name="message" placeholder="Το μήνυμά σας"></textarea>
<button type="submit">Αποστολή</button>
</form>
</section>
</main>
<footer><p>&copy; 2026 Επιχείρηση Δοκιμής. Όλα τα δικαιώματα διατηρούνται.</p></footer>
</body>
</html>`;
}

function buildSeededDefectFixture() {
  return `<!DOCTYPE html>
<html lang="el">
<head>
<meta charset="UTF-8">
<meta name="description" content="Ελαττωματική δοκιμαστική σελίδα.">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<nav>
<a href="#about">Σχετικά</a>
<a href="#missing">Χαμένος Σύνδεσμος</a>
</nav>
<main>
<section id="about">
<h1>PLACEHOLDER</h1>
<p>${GREEK_FILLER}</p>
<p>Επικοινωνήστε μαζί μας: info@example.gr</p>
<img src="team.jpg" alt="Η ομάδα μας">
</section>
</main>
<footer><p>&copy; 2026 Δοκιμή</p></footer>
</body>
</html>`;
}

function buildTodoCommentFixture() {
  return `<!DOCTYPE html>
<html lang="el">
<head>
<meta charset="UTF-8">
<title>Σελίδα με Σχόλιο Προγραμματιστή</title>
<meta name="description" content="Σελίδα δοκιμής με ένα ακίνδυνο σχόλιο προγραμματιστή.">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<!-- TODO fix -->
<nav>
<a href="#about">Σχετικά</a>
</nav>
<main>
<section id="about">
<h1>Καλώς ήρθατε</h1>
<p>${GREEK_FILLER}</p>
</section>
<section>
<form>
<input type="text" name="name" placeholder="Όνομα">
<button type="submit">Αποστολή</button>
</form>
</section>
</main>
</body>
</html>`;
}

function buildBrowserErrorFixture() {
  return `<!DOCTYPE html>
<html lang="el">
<head>
<meta charset="UTF-8">
<title>Σελίδα με Σφάλμα JavaScript</title>
<meta name="description" content="Σελίδα δοκιμής που πετάει σφάλμα JavaScript κατά τη φόρτωση.">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<h1>Καλώς ήρθατε</h1>
<p>${GREEK_FILLER}</p>
<script>throw new Error('boom');</script>
</body>
</html>`;
}

/** Spawn `node src/qa-gate.js --test <fixturePath> --skip-skill-layers` and parse stdout as JSON. */
function runQaGateCli(fixturePath, extraArgs = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [qaGateScript, '--test', fixturePath, '--skip-skill-layers', ...extraArgs],
      { cwd: projectRoot, env: process.env }
    );

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });
    child.on('error', reject);
    child.on('exit', (code) => {
      let parsed = null;
      try {
        parsed = JSON.parse(stdout);
      } catch {
        // leave parsed as null; caller can inspect raw stdout/stderr
      }
      resolve({ code, stdout, stderr, parsed });
    });
  });
}

/** Remove any files this run's browser layer wrote into the real project's data/qa-output. */
async function cleanupQaOutputArtifacts(slugPrefix) {
  let entries = [];
  try {
    entries = await fs.readdir(qaOutputDir);
  } catch {
    return;
  }
  await Promise.all(
    entries
      .filter((name) => name.startsWith(slugPrefix))
      .map((name) => fs.rm(path.join(qaOutputDir, name), { force: true }))
  );
}

let fixturesDir;
const runs = {};

before(async () => {
  fixturesDir = await fs.mkdtemp(path.join(os.tmpdir(), 'qa-gate-test-'));

  const cleanPath = path.join(fixturesDir, 'clean-fixture.html');
  const defectPath = path.join(fixturesDir, 'seeded-defect.html');
  const todoPath = path.join(fixturesDir, 'todo-comment-only.html');

  await fs.writeFile(cleanPath, buildCleanFixture(), 'utf-8');
  await fs.writeFile(defectPath, buildSeededDefectFixture(), 'utf-8');
  await fs.writeFile(todoPath, buildTodoCommentFixture(), 'utf-8');
  // The browser layer's local static server serves all fixtures from this same
  // directory; without a favicon.ico, Chromium's automatic favicon request 404s
  // and is reported as a "Console error" issue, polluting the exact-issue-count
  // assertion below. Serve an empty one so that noise doesn't leak into layer 1's
  // otherwise-deterministic issue set.
  await fs.writeFile(path.join(fixturesDir, 'favicon.ico'), Buffer.alloc(0));

  runs.clean = { fixturePath: cleanPath, ...(await runQaGateCli(cleanPath)) };
  runs.defect = { fixturePath: defectPath, ...(await runQaGateCli(defectPath)) };
  runs.todo = { fixturePath: todoPath, ...(await runQaGateCli(todoPath)) };
  runs.missing = await runQaGateCli(path.join(fixturesDir, 'does-not-exist.html'));
});

after(async () => {
  await cleanupQaOutputArtifacts(slugify('clean-fixture'));
  await cleanupQaOutputArtifacts(slugify('seeded-defect'));
  await cleanupQaOutputArtifacts(slugify('todo-comment-only'));
  await cleanupQaOutputArtifacts(slugify('browser-error-fixture'));
  if (fixturesDir) {
    await fs.rm(fixturesDir, { recursive: true, force: true });
  }
});

test('clean Greek fixture: pass:true, no critical issues, placeholder attributes do not trigger leaks', () => {
  const { code, parsed, stderr } = runs.clean;
  assert.equal(code, 0, `expected exit 0, stderr: ${stderr}`);
  assert.ok(parsed, 'expected valid JSON verdict on stdout');

  assert.equal(parsed.pass, true);
  const criticals = parsed.issues.filter((i) => i.severity === 'critical');
  assert.equal(criticals.length, 0, `expected no critical issues, got: ${JSON.stringify(criticals)}`);

  // Native placeholder="..." attributes must not be misread as leaked "PLACEHOLDER" text.
  const leakIssues = parsed.issues.filter((i) => /placeholder or leaked template text/i.test(i.description));
  assert.equal(leakIssues.length, 0, `expected no placeholder-leak issues, got: ${JSON.stringify(leakIssues)}`);
});

test('seeded-defect fixture: pass:false, >= 2 critical issues, broken-anchor + missing-title issues present', () => {
  const { code, parsed, stderr } = runs.defect;
  assert.equal(code, 0, `expected exit 0, stderr: ${stderr}`);
  assert.ok(parsed, 'expected valid JSON verdict on stdout');

  assert.equal(parsed.pass, false);

  const criticals = parsed.issues.filter((i) => i.severity === 'critical');
  assert.ok(criticals.length >= 2, `expected >= 2 critical issues, got ${criticals.length}: ${JSON.stringify(criticals)}`);

  const hasBrokenAnchor = parsed.issues.some((i) => /broken internal anchor/i.test(i.description));
  assert.ok(hasBrokenAnchor, `expected a broken-anchor issue, got: ${JSON.stringify(parsed.issues)}`);

  const hasMissingTitle = parsed.issues.some((i) => /missing or empty <title>/i.test(i.description));
  assert.ok(hasMissingTitle, `expected a missing-title issue, got: ${JSON.stringify(parsed.issues)}`);
});

test('"<!-- TODO fix -->" comment only: exactly one low "developer comment" issue, pass:true', () => {
  const { code, parsed, stderr } = runs.todo;
  assert.equal(code, 0, `expected exit 0, stderr: ${stderr}`);
  assert.ok(parsed, 'expected valid JSON verdict on stdout');

  assert.equal(parsed.pass, true);
  assert.equal(parsed.issues.length, 1, `expected exactly one issue, got: ${JSON.stringify(parsed.issues)}`);
  assert.equal(parsed.issues[0].severity, 'low');
  assert.ok(/developer comment/i.test(parsed.issues[0].description));
});

test('missing file: stdout is {error}, exit code 1', () => {
  const { code, parsed, stdout } = runs.missing;
  assert.equal(code, 1);
  assert.ok(parsed, `expected valid JSON on stdout, got: ${stdout}`);
  assert.ok(typeof parsed.error === 'string' && parsed.error.length > 0);
});

test('score arithmetic: verdict.score == 100 - sum(deductions), pass matches score/critical rule', () => {
  for (const key of ['clean', 'defect', 'todo']) {
    const { parsed } = runs[key];
    const expectedScore = Math.max(
      0,
      100 - parsed.issues.reduce((sum, issue) => sum + (SEVERITY_DEDUCTIONS[issue.severity] ?? SEVERITY_DEDUCTIONS.medium), 0)
    );
    assert.equal(parsed.score, expectedScore, `[${key}] score mismatch; issues: ${JSON.stringify(parsed.issues)}`);

    const hasCritical = parsed.issues.some((i) => i.severity === 'critical');
    const expectedPass = expectedScore >= parsed.minScore && !hasCritical;
    assert.equal(parsed.pass, expectedPass, `[${key}] pass mismatch`);
  }
});

test('browser layer: page.on("pageerror") produces a high-severity issue', { timeout: 60000 }, async (t) => {
  const runJs = path.join(projectRoot, '.claude', 'skills', 'playwright-skill', 'run.js');
  const pwModule = path.join(projectRoot, '.claude', 'skills', 'playwright-skill', 'node_modules', 'playwright');
  if (!fsSync.existsSync(runJs) || !fsSync.existsSync(pwModule)) {
    t.skip('playwright-skill executor or its node_modules are not present in this environment');
    return;
  }

  const fixturePath = path.join(fixturesDir, 'browser-error-fixture.html');
  await fs.writeFile(fixturePath, buildBrowserErrorFixture(), 'utf-8');

  const { code, parsed, stderr } = await runQaGateCli(fixturePath);
  assert.equal(code, 0, `expected exit 0, stderr: ${stderr}`);
  assert.ok(parsed, 'expected valid JSON verdict on stdout');

  if (!parsed.layers.browser || !parsed.layers.browser.ran) {
    t.skip(`browser layer did not run in this environment: ${JSON.stringify(parsed.layers.browser)}`);
    return;
  }

  assert.equal(parsed.layers.browser.ran, true);
  const pageErrorIssue = parsed.issues.find(
    (i) => i.layer === 'browser' && i.severity === 'high' && /page error/i.test(i.description)
  );
  assert.ok(pageErrorIssue, `expected a high-severity page-error issue, got: ${JSON.stringify(parsed.issues)}`);
  assert.ok(/boom/.test(pageErrorIssue.description));
});
