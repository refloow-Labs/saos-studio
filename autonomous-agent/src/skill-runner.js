/**
 * Skill Runner
 * Spawns headless Claude Code sessions that execute a named skill
 * (e.g. qa-test, playwright-skill, ui-ux-pro-max) and write a JSON
 * result to an output file, so the Node agent can orchestrate LLM skill work.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * SkillRunner spawns headless `claude` CLI sessions to run a named skill
 * against a prompt, waiting for the session to write its JSON verdict to
 * an output file, then reads and returns that result.
 */
export class SkillRunner {
  /** Cached result of the `claude --version` availability probe. */
  static _claudeAvailable = null;
  /**
   * Cached flag: on this machine, direct `spawn('claude', ...)` fails with
   * EINVAL (seen on Node >= 20 / Windows when spawning a .cmd shim without
   * a shell) but a `cmd.exe /d /s /c "claude ..."` wrapper works. When true,
   * runSkill routes through that wrapper and feeds the prompt via stdin so
   * no LLM-authored text ever reaches a shell command line.
   */
  static _viaComSpec = false;
  /** Last known reason the CLI was judged unavailable, e.g. 'ENOENT' | 'EINVAL'. */
  static _unavailableReason = null;

  /**
   * @param {Object} [options]
   * @param {string} [options.jobsDir] - directory for audit job records
   * @param {string} [options.outputDir] - directory where sessions write results
   * @param {number} [options.timeoutMs] - default per-job timeout in ms
   */
  constructor(options = {}) {
    const projectRoot = path.join(__dirname, '..');
    this.jobsDir = options.jobsDir || path.join(projectRoot, 'data/qa-jobs');
    this.outputDir = options.outputDir || path.join(projectRoot, 'data/qa-output');
    this.timeoutMs = options.timeoutMs || parseInt(process.env.QA_TIMEOUT_SECONDS || '300') * 1000;
    this.projectRoot = projectRoot;
  }

  async initialize() {
    await fs.mkdir(this.jobsDir, { recursive: true });
    await fs.mkdir(this.outputDir, { recursive: true });
    console.log('✅ Skill runner system initialized');
  }

  /**
   * Check whether the `claude` CLI is available on this machine.
   * Result is cached after the first call. On Windows, if a direct spawn
   * fails with EINVAL (rather than ENOENT), a single literal
   * `cmd.exe /d /s /c "claude --version"` probe is attempted before giving
   * up — this covers a known Node >= 20 quirk spawning .cmd shims without
   * a shell, without ever enabling shell:true for the real skill run.
   * @returns {Promise<boolean>}
   */
  static async isClaudeAvailable() {
    if (SkillRunner._claudeAvailable !== null) {
      return SkillRunner._claudeAvailable;
    }

    const probe = (cmd, args = ['--version'], verbatim = false) => new Promise((resolve) => {
      let child;
      try {
        child = spawn(cmd, args, { shell: false, windowsVerbatimArguments: verbatim });
      } catch (err) {
        resolve({ ok: false, code: err.code || null });
        return;
      }

      const timer = setTimeout(() => {
        killProcessTree(child);
        resolve({ ok: false, code: 'TIMEOUT' });
      }, 10000);

      child.on('error', (err) => {
        clearTimeout(timer);
        resolve({ ok: false, code: err.code || null });
      });

      child.on('exit', (code) => {
        clearTimeout(timer);
        resolve({ ok: code === 0, code: code === 0 ? null : `EXIT_${code}` });
      });
    });

    let outcome = await probe('claude');

    if (!outcome.ok && outcome.code === 'ENOENT') {
      outcome = await probe('claude.cmd');
    }

    if (!outcome.ok && outcome.code === 'EINVAL') {
      // Fixed literal command, no user/LLM input — version probe only.
      // windowsVerbatimArguments:true so libuv passes the /c string through
      // as-is (it contains a space); cmd.exe /s then only strips the
      // outermost quotes, which is what we want here.
      const comSpecOutcome = await probe(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', 'claude --version'], true);
      if (comSpecOutcome.ok) {
        SkillRunner._claudeAvailable = true;
        SkillRunner._viaComSpec = true;
        SkillRunner._unavailableReason = null;
        return true;
      }
      outcome = comSpecOutcome.code ? comSpecOutcome : outcome;
    }

    SkillRunner._claudeAvailable = outcome.ok;
    SkillRunner._viaComSpec = false;
    SkillRunner._unavailableReason = outcome.ok ? null : (outcome.code || 'UNKNOWN');
    return SkillRunner._claudeAvailable;
  }

  /**
   * Run a named skill in a headless Claude Code session.
   * Never throws for expected failures (CLI unavailable, timeout, non-zero exit,
   * missing/invalid output) — only throws for programmer errors like a missing jobId.
   * @param {Object} job
   * @param {string} job.jobId - filesystem-safe unique job identifier
   * @param {string} job.skill - name of the skill to invoke, e.g. 'qa-test'
   * @param {string} job.prompt - full instruction for the headless session
   * @param {string} [job.outputFile] - absolute path the session must write JSON to
   * @param {Object|null} [job.mcpConfig] - MCP config to pass via --mcp-config
   * @param {string[]} [job.allowedTools] - tools to pass via --allowedTools
   * @param {number} [job.maxTurns] - max turns, default 25
   * @param {string} [job.cwd] - working directory for the spawn, default project root
   * @param {number} [job.timeoutMs] - per-job timeout override
   * @returns {Promise<Object>} result envelope, see class docs
   */
  async runSkill(job) {
    if (!job || !job.jobId) {
      throw new Error('SkillRunner.runSkill: job.jobId is required');
    }
    if (!job.skill) {
      throw new Error('SkillRunner.runSkill: job.skill is required');
    }
    if (!job.prompt) {
      throw new Error('SkillRunner.runSkill: job.prompt is required');
    }

    const { jobId, skill } = job;

    if (!(await SkillRunner.isClaudeAvailable())) {
      const reason = SkillRunner._unavailableReason || 'UNKNOWN';
      console.warn(`⚠️ SkillRunner: claude CLI not available (${reason}) — skipping skill layers`);
      return { ok: false, skipped: true, reason: 'claude-cli-unavailable', jobId };
    }

    const outputFile = job.outputFile || path.join(this.outputDir, `${jobId}.json`);
    const cwd = job.cwd || this.projectRoot;
    const maxTurns = job.maxTurns || 25;
    const timeoutMs = job.timeoutMs || this.timeoutMs;

    // 1. Write job record for audit, mirroring the designer-jobs pattern.
    const jobRecord = {
      jobId,
      skill,
      createdAt: new Date().toISOString(),
      prompt: job.prompt,
    };
    const jobFilePath = path.join(this.jobsDir, `${jobId}.json`);
    await fs.writeFile(jobFilePath, JSON.stringify(jobRecord, null, 2));

    // 2. Delete any pre-existing output so stale results can't be read.
    try {
      await fs.unlink(outputFile);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    // 3. Optionally write MCP config.
    let mcpConfigPath = null;
    if (job.mcpConfig) {
      mcpConfigPath = path.join(this.jobsDir, `${jobId}.mcp.json`);
      await fs.writeFile(mcpConfigPath, JSON.stringify(job.mcpConfig, null, 2));
    }

    const fullPrompt = `Use the ${skill} skill for the following task. When finished, write your final result as valid JSON to the file: ${outputFile} (overwrite if it exists). Task:\n${job.prompt}`;

    console.log(`🧰 SkillRunner: launching ${skill} (job ${jobId})...`);

    const startedAt = Date.now();
    const spawnResult = await spawnClaude({
      fullPrompt,
      maxTurns,
      mcpConfigPath,
      allowedTools: job.allowedTools,
      cwd,
      env: process.env,
      timeoutMs,
    });
    const durationMs = Date.now() - startedAt;

    if (spawnResult.skipped) {
      const reason = spawnResult.code || SkillRunner._unavailableReason || 'UNKNOWN';
      console.warn(`⚠️ SkillRunner: claude CLI not available (${reason}) — skipping skill layers`);
      return { ok: false, skipped: true, reason: 'claude-cli-unavailable', jobId };
    }

    if (spawnResult.timedOut) {
      console.error(`❌ SkillRunner: ${skill} (job ${jobId}) timed out after ${timeoutMs}ms`);
      return {
        ok: false,
        skipped: false,
        jobId,
        error: `Skill session timed out after ${timeoutMs}ms`,
        stderrTail: tail(spawnResult.stderr),
        durationMs,
        exitCode: spawnResult.exitCode,
      };
    }

    if (spawnResult.exitCode !== 0) {
      console.error(`❌ SkillRunner: ${skill} (job ${jobId}) exited with code ${spawnResult.exitCode}`);
      return {
        ok: false,
        skipped: false,
        jobId,
        error: `Process exited with code ${spawnResult.exitCode}`,
        stderrTail: tail(spawnResult.stderr),
        durationMs,
        exitCode: spawnResult.exitCode,
      };
    }

    // 4. Read and parse the output file.
    let result;
    try {
      const raw = await fs.readFile(outputFile, 'utf-8');
      result = JSON.parse(raw);
    } catch (err) {
      console.error(`❌ SkillRunner: ${skill} (job ${jobId}) produced no valid output — ${err.message}`);
      return {
        ok: false,
        skipped: false,
        jobId,
        error: `Failed to read/parse output file: ${err.message}`,
        stderrTail: tail(spawnResult.stderr),
        durationMs,
        exitCode: spawnResult.exitCode,
      };
    }

    console.log(`✅ SkillRunner: ${skill} (job ${jobId}) completed in ${(durationMs / 1000).toFixed(1)}s`);
    return { ok: true, jobId, result, durationMs, exitCode: spawnResult.exitCode };
  }
}

/**
 * Build the argv for a direct (non-shell) spawn of the `claude` CLI.
 * The prompt is passed inline via `-p <prompt>` — safe here because
 * shell:false + array args mean it never touches a shell command line.
 */
function buildDirectArgs({ fullPrompt, maxTurns, mcpConfigPath, allowedTools }) {
  const args = [
    '-p', fullPrompt,
    '--output-format', 'json',
    '--max-turns', String(maxTurns),
    '--permission-mode', 'acceptEdits',
  ];
  if (mcpConfigPath) {
    args.push('--mcp-config', mcpConfigPath);
  }
  if (allowedTools && allowedTools.length > 0) {
    args.push('--allowedTools', allowedTools.join(','));
  }
  return args;
}

/**
 * Build the cmd.exe command-line string for the ComSpec fallback mode
 * (used when a direct spawn fails with EINVAL on Windows).
 * The prompt is NEVER interpolated here — it is written to the child's
 * stdin instead, so no LLM-authored text ever enters a shell command line.
 * Only fixed flags and generated file paths (defensively quote-wrapped)
 * are included.
 */
function buildComSpecArgs({ maxTurns, mcpConfigPath, allowedTools }) {
  // Plain "..." wrapping — cmd.exe /s strips only the first and last quote
  // character and does not honor backslash-escaped inner quotes, so no
  // escaping is applied here. Windows paths cannot contain '"' anyway, and
  // this is only ever called with our own generated jobsDir/outputDir paths.
  const quote = (s) => `"${String(s)}"`;
  const parts = [
    'claude',
    '-p',
    '--output-format', 'json',
    '--max-turns', String(maxTurns),
    '--permission-mode', 'acceptEdits',
  ];
  if (mcpConfigPath) {
    parts.push('--mcp-config', quote(mcpConfigPath));
  }
  if (allowedTools && allowedTools.length > 0) {
    parts.push('--allowedTools', quote(allowedTools.join(',')));
  }
  return ['/d', '/s', '/c', parts.join(' ')];
}

/**
 * Spawn the `claude` CLI, enforcing a hard timeout that kills the process
 * tree. Retries `claude.cmd` on ENOENT. On EINVAL (Windows/Node >= 20
 * spawning a .cmd shim without a shell), falls back to a `cmd.exe` wrapper
 * with the prompt delivered via stdin instead of argv/command-line text.
 * @param {Object} opts
 * @param {string} opts.fullPrompt
 * @param {number} opts.maxTurns
 * @param {string|null} opts.mcpConfigPath
 * @param {string[]|undefined} opts.allowedTools
 * @param {string} opts.cwd
 * @param {NodeJS.ProcessEnv} opts.env
 * @param {number} opts.timeoutMs
 * @returns {Promise<{skipped?: boolean, code?: string|null, timedOut?: boolean, exitCode: number|null, stdout: string, stderr: string}>}
 */
async function spawnClaude(opts) {
  const { fullPrompt, maxTurns, mcpConfigPath, allowedTools, cwd, env, timeoutMs } = opts;

  const runOnce = (cmd, args, stdinContent, verbatim = false) => new Promise((resolve) => {
    let child;
    try {
      child = spawn(cmd, args, { cwd, env, shell: false, windowsVerbatimArguments: verbatim });
    } catch (err) {
      resolve({
        enoent: err.code === 'ENOENT',
        einval: err.code === 'EINVAL',
        code: err.code || null,
        exitCode: null,
        stdout: '',
        stderr: '',
      });
      return;
    }

    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let settled = false;

    const timer = setTimeout(() => {
      timedOut = true;
      killProcessTree(child);
    }, timeoutMs);

    child.stdout?.on('data', (d) => { stdout += d.toString(); });
    child.stderr?.on('data', (d) => { stderr += d.toString(); });

    child.on('error', (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({
        enoent: err.code === 'ENOENT',
        einval: err.code === 'EINVAL',
        code: err.code || null,
        exitCode: null,
        stdout,
        stderr,
        timedOut,
      });
    });

    child.on('exit', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ enoent: false, einval: false, code: null, exitCode: code, stdout, stderr, timedOut });
    });

    if (stdinContent !== undefined && child.stdin) {
      // Guard against EPIPE if the child exits before consuming stdin.
      child.stdin.on('error', () => {});
      child.stdin.write(stdinContent);
      child.stdin.end();
    }
  });

  const runViaComSpec = () => {
    const comSpecArgs = buildComSpecArgs({ maxTurns, mcpConfigPath, allowedTools });
    // windowsVerbatimArguments:true — same reasoning as the EINVAL probe in
    // isClaudeAvailable(): the /c string has embedded spaces/quotes and must
    // reach cmd.exe unmangled by libuv's default argument re-escaping.
    return runOnce(process.env.ComSpec || 'cmd.exe', comSpecArgs, fullPrompt, true);
  };

  // Fast path: a prior probe already learned direct spawn fails with EINVAL
  // on this machine — go straight to the stdin-based ComSpec wrapper.
  if (process.platform === 'win32' && SkillRunner._viaComSpec) {
    const outcome = await runViaComSpec();
    if (outcome.exitCode === null && (outcome.enoent || outcome.einval)) {
      return { skipped: true, exitCode: null, stdout: '', stderr: '', code: outcome.code };
    }
    return outcome;
  }

  const directArgs = buildDirectArgs({ fullPrompt, maxTurns, mcpConfigPath, allowedTools });
  let outcome = await runOnce('claude', directArgs);

  if (outcome.exitCode === null && outcome.enoent) {
    outcome = await runOnce('claude.cmd', directArgs);
  }

  if (outcome.exitCode === null && outcome.einval && process.platform === 'win32') {
    const comSpecOutcome = await runViaComSpec();
    if (comSpecOutcome.exitCode !== null || (!comSpecOutcome.enoent && !comSpecOutcome.einval)) {
      // Learn for subsequent calls in this process.
      SkillRunner._viaComSpec = true;
    }
    outcome = comSpecOutcome;
  }

  if (outcome.exitCode === null && (outcome.enoent || outcome.einval)) {
    return { skipped: true, exitCode: null, stdout: '', stderr: '', code: outcome.code };
  }

  return outcome;
}

/**
 * Kill a spawned process and its children.
 * @param {import('child_process').ChildProcess} child
 */
function killProcessTree(child) {
  if (!child || !child.pid) return;
  if (process.platform === 'win32') {
    const killer = spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { shell: false });
    // Without this, an error event on the fire-and-forget killer (e.g. the
    // target already exited) would be an unhandled 'error' event and crash
    // the whole agent process — precisely on the timeout path.
    killer.on('error', () => {});
  } else {
    try {
      child.kill('SIGKILL');
    } catch {
      // process may already have exited
    }
  }
}

/**
 * Return the trailing ~2000 characters of a string.
 * @param {string} str
 * @returns {string}
 */
function tail(str) {
  if (!str) return '';
  return str.length > 2000 ? str.slice(-2000) : str;
}
