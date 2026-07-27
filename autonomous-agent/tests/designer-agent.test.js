/**
 * Unit/integration tests for src/designer-agent.js
 *
 * DesignerAgent resolves its jobs/output directories as
 * path.join(__dirname, '../data/designer-jobs') / '../data/designer-output'
 * — i.e. relative to the *module* location, not process.cwd() — so unlike
 * the other test files there is no cwd trick available to sandbox these
 * paths into a temp dir. Both the CLI test-mode invocation and the direct
 * designWebsite({forceSimulation:true}) unit test are therefore run
 * against the real data/designer-jobs and data/designer-output folders,
 * and every file they create is deleted again in this test's cleanup
 * (matched by the exact jobId each call reports), leaving any
 * pre-existing files in those folders untouched.
 *
 * Neither path ever exercises a real `claude` CLI spawn: CLI `--test`
 * mode and this test's direct call both pass forceSimulation:true, which
 * short-circuits designWebsite() before it ever calls
 * SkillRunner.isClaudeAvailable().
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

import { DesignerAgent } from '../src/designer-agent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const designerAgentPath = path.join(projectRoot, 'src', 'designer-agent.js');

async function rmIfExists(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

test('CLI --test mode: simulated design, exit 0, prints an existing non-empty .html path', async (t) => {
  // A brief stagger before spawning a grandchild `node` process: when every
  // *.test.js worker file starts at once, spawning here in the same instant
  // as other files' own startup has occasionally (rarely) corrupted an
  // unrelated file's `--test` reporter channel on Windows ("Unable to
  // deserialize cloned data..."). Not a fix, just a mitigation of the race
  // window — see the equivalent note in tests/dashboard.test.js.
  await new Promise((r) => setTimeout(r, 300));

  const env = { ...process.env };
  delete env.DESIGNER_AGENT_SKILL;
  // Node's own `--test` runner communicates with this file's worker process
  // over an fd/handle identified via these env vars. If they leak into a
  // freshly spawned `node` grandchild, that grandchild's Node runtime tries
  // to participate in the same channel and corrupts the test reporter
  // stream (surfaces as "Unable to deserialize cloned data..." in a later
  // test). Strip them so the child is a plain, unrelated Node process.
  delete env.NODE_TEST_CONTEXT;
  delete env.NODE_TEST_WORKER_ID;

  const { code, stdout } = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [designerAgentPath, '--test', 'Test Co,plumber'], {
      cwd: projectRoot,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });
    child.on('error', reject);
    child.on('exit', (code) => resolve({ code, stdout, stderr }));
  });

  assert.equal(code, 0, `expected exit code 0, got ${code}`);

  const lines = stdout.trim().split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const htmlPath = lines[lines.length - 1];
  assert.ok(htmlPath.endsWith('.html'), `expected last stdout line to be an .html path, got: ${htmlPath}`);

  const jobId = path.basename(htmlPath, '.html');

  t.after(async () => {
    await rmIfExists(htmlPath);
    await rmIfExists(path.join(projectRoot, 'data', 'designer-output', `${jobId}.json`));
    await rmIfExists(path.join(projectRoot, 'data', 'designer-jobs', `${jobId}.json`));
  });

  const stat = await fs.stat(htmlPath);
  assert.ok(stat.isFile());
  assert.ok(stat.size > 0, 'expected the produced HTML file to be non-empty');

  const html = await fs.readFile(htmlPath, 'utf-8');
  assert.ok(html.includes('Test Co'), 'expected the generated HTML to mention the company name');
});

test('designWebsite({forceSimulation:true}) returns non-empty HTML and injects qaFeedback into the job prompt', async () => {
  const agent = new DesignerAgent();
  await agent.initialize();

  const lead = { Company: 'QA Feedback Test Co', 'NACE 2 Desc': 'plumber', 'Περιοχή': 'Αθήνα' };
  const qaFeedback = [
    { severity: 'critical', description: 'UNIQUE_QA_TEST_MARKER_XYZ', fix: 'fix the unique marker issue' },
  ];

  const result = await agent.designWebsite(lead, { forceSimulation: true, qaFeedback });

  let jobId;
  try {
    assert.equal(result.status, 'completed');
    assert.equal(typeof result.output.html, 'string');
    assert.ok(result.output.html.length > 0, 'expected non-empty output.html');

    jobId = result.job_id;
    assert.ok(jobId, 'expected a job_id on the result');

    const jobFilePath = path.join(agent.jobsDir, `${jobId}.json`);
    const jobRaw = await fs.readFile(jobFilePath, 'utf-8');
    const job = JSON.parse(jobRaw);

    assert.ok(
      job.designer_prompt.includes('UNIQUE_QA_TEST_MARKER_XYZ'),
      'expected qaFeedback description text to appear in the job designer_prompt'
    );
    assert.ok(job.designer_prompt.includes('ΔΙΟΡΘΩΣΕΙΣ QA'), 'expected the QA corrections section header');
  } finally {
    if (jobId) {
      await rmIfExists(path.join(agent.jobsDir, `${jobId}.json`));
      await rmIfExists(path.join(agent.outputDir, `${jobId}.json`));
    }
  }
});
