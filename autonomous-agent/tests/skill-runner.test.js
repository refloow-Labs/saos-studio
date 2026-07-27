/**
 * Unit tests for src/skill-runner.js
 *
 * Fully offline: never invokes the real `claude` CLI. The "unavailable"
 * path is exercised by monkey-patching the cached static availability
 * flag directly, so runSkill short-circuits before any spawn happens.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { SkillRunner } from '../src/skill-runner.js';

test('module shape: SkillRunner export, instance methods, static probe', () => {
  assert.equal(typeof SkillRunner, 'function');

  const instance = new SkillRunner({ jobsDir: os.tmpdir(), outputDir: os.tmpdir() });
  assert.equal(typeof instance.runSkill, 'function');
  assert.equal(typeof instance.initialize, 'function');
  assert.equal(typeof SkillRunner.isClaudeAvailable, 'function');
});

test('runSkill throws (rejects) on missing jobId/skill/prompt', async () => {
  const instance = new SkillRunner({ jobsDir: os.tmpdir(), outputDir: os.tmpdir() });

  await assert.rejects(() => instance.runSkill(undefined), /jobId/);
  await assert.rejects(() => instance.runSkill({}), /jobId/);
  await assert.rejects(() => instance.runSkill({ jobId: 'job-a' }), /skill/);
  await assert.rejects(() => instance.runSkill({ jobId: 'job-a', skill: 'qa-test' }), /prompt/);
});

test('unavailable claude CLI => fast {ok:false, skipped:true} without spawning or writing a job file', async (t) => {
  // Monkey-patch the cached static availability probe so runSkill never
  // attempts to spawn the real `claude` CLI.
  const original = SkillRunner._claudeAvailable;
  SkillRunner._claudeAvailable = false;
  t.after(() => {
    SkillRunner._claudeAvailable = original;
  });

  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'skill-runner-test-'));
  const jobsDir = path.join(dir, 'jobs');
  const outputDir = path.join(dir, 'output');
  await fs.mkdir(jobsDir, { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });

  const instance = new SkillRunner({ jobsDir, outputDir });
  const result = await instance.runSkill({ jobId: 'job-1', skill: 'qa-test', prompt: 'do something' });

  assert.deepEqual(result, {
    ok: false,
    skipped: true,
    reason: 'claude-cli-unavailable',
    jobId: 'job-1',
  });

  // The job-record write happens only after the availability check passes,
  // so a fast/skipped return should never have created a job file.
  await assert.rejects(() => fs.access(path.join(jobsDir, 'job-1.json')));

  await fs.rm(dir, { recursive: true, force: true });
});
