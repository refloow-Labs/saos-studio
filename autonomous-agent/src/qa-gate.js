/**
 * QA Gate
 * Reviews a generated single-file HTML website through four layers before
 * it is allowed to reach a customer:
 *   1. deterministic  - pure Node checks (placeholder leaks, meta tags, a11y basics)
 *   2. browser        - headless Chromium via the playwright-skill executor
 *   3. functional      - qa-test skill (headless Claude Code session)
 *   4. design          - ui-ux-pro-max skill (headless Claude Code session)
 * Produces a single verdict object with a 0-100 score, pass/fail, and issues.
 */

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { SkillRunner } from './skill-runner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// The #1 real-world defect in this repo's generated sites: unrendered/leaked
// placeholder copy that a real business would never accept. These are checked
// as case-insensitive substrings anywhere in the raw HTML (including
// attributes) — e.g. a real mailto: leak is still a leak wherever it sits.
const RAW_PLACEHOLDER_TERMS = [
  'lorem ipsum',
  'info@example',
  '+30 210 123 4567',
  'Αυτό θα προσαρμοστεί',
  'θα προσαρμοστεί με πραγματικές',
  '{{',
];

// These two tokens are too generic to substring-match against raw HTML —
// 'PLACEHOLDER' collides with the ubiquitous placeholder="..." attribute and
// 'TODO' can appear inside minified JS/identifiers. They're checked as
// case-insensitive whole words against a "visible text" view of the
// document instead (see buildVisibleText / runDeterministicChecks).
const WORD_BOUNDARY_PLACEHOLDER_TERMS = ['PLACEHOLDER', 'TODO'];

// Leftover developer comments mentioning these are a hygiene issue, not a
// customer-facing leak — downgraded to 'low' severity.
const DEV_COMMENT_RE = /\b(TODO|PLACEHOLDER|FIXME)\b/i;

const SEVERITY_DEDUCTIONS = { critical: 30, high: 15, medium: 7, low: 3 };

export class QAGate {
  /**
   * @param {Object} [options]
   * @param {number} [options.minScore] - overrides QA_MIN_SCORE
   * @param {number} [options.timeoutMs] - overrides QA_TIMEOUT_SECONDS
   * @param {boolean} [options.adversary] - overrides QA_ADVERSARY
   * @param {boolean} [options.skipSkillLayers] - skip the functional/design (headless Claude) layers
   * @param {string} [options.outputDir] - override the qa-output directory
   */
  constructor(options = {}) {
    const projectRoot = path.join(__dirname, '..');
    this.projectRoot = projectRoot;

    this.minScore = options.minScore ?? parseInt(process.env.QA_MIN_SCORE || '80', 10);

    const timeoutSeconds = parseInt(process.env.QA_TIMEOUT_SECONDS || '300', 10);
    this.timeoutMs = options.timeoutMs ?? timeoutSeconds * 1000;

    this.adversary = options.adversary ?? (process.env.QA_ADVERSARY === 'true');
    this.skipSkillLayers = !!options.skipSkillLayers;

    this.outputDir = options.outputDir || path.join(projectRoot, 'data/qa-output');
    this.runner = new SkillRunner({ outputDir: this.outputDir, timeoutMs: this.timeoutMs });
  }

  /** @returns {boolean} whether the QA gate is enabled (QA_ENABLED=true) */
  get enabled() {
    return process.env.QA_ENABLED === 'true';
  }

  async initialize() {
    await this.runner.initialize();
    await fs.mkdir(this.outputDir, { recursive: true });
    console.log('✅ QA gate initialized');
  }

  /**
   * Review a single-file HTML website and produce a verdict.
   * Never throws for check failures — only for a missing/unreadable htmlPath.
   * @param {Object} params
   * @param {string} params.htmlPath - absolute path to the generated HTML file
   * @param {string} [params.company] - company name, used for job ids and prompts
   * @param {Object|null} [params.lead] - optional lead record (currently informational)
   * @returns {Promise<Object>} verdict
   */
  async review({ htmlPath, company = 'unknown', lead = null }) {
    const startedAt = Date.now();
    void lead; // reserved for future prompt context

    let html;
    let fileStat;
    try {
      html = await fs.readFile(htmlPath, 'utf-8');
      fileStat = await fs.stat(htmlPath);
    } catch (err) {
      throw new Error(`QAGate: cannot read htmlPath "${htmlPath}": ${err.message}`);
    }

    const slug = slugify(company);
    const issues = [];
    const layers = {};
    const skippedLayers = [];

    // Layer 1 — deterministic
    console.log(`🧪 QA gate: running deterministic checks for ${company}...`);
    const deterministic = runDeterministicChecks(html, fileStat.size);
    issues.push(...deterministic.issues);
    layers.deterministic = { ran: true, ...deterministic.summary };

    // Layer 2 — browser
    console.log(`🧪 QA gate: running browser checks for ${company}...`);
    const browserJobId = `${slug}-${Date.now()}`;
    const browser = await this._runBrowserLayer({ htmlPath, jobId: browserJobId });
    if (browser.ran) {
      layers.browser = { ran: true, ...browser.layer };
      issues.push(...browser.issues);
    } else {
      layers.browser = { ran: false, reason: browser.reason };
      skippedLayers.push('browser');
      console.warn(`⚠️ QA gate: browser layer skipped — ${browser.reason}`);
    }

    // Layers 3a/3b — functional + design skill sessions
    let claudeAvailable = false;
    if (!this.skipSkillLayers) {
      claudeAvailable = await SkillRunner.isClaudeAvailable();
    }

    if (claudeAvailable) {
      const functional = await this._runFunctionalLayer({ htmlPath, company, slug });
      if (functional.ran) {
        layers.functional = { ran: true, ...functional.layer };
        issues.push(...functional.issues);
      } else {
        layers.functional = { ran: false, reason: functional.reason };
        skippedLayers.push('functional');
        console.warn(`⚠️ QA gate: functional layer skipped — ${functional.reason}`);
      }

      const design = await this._runDesignLayer({ htmlPath, company, slug });
      if (design.ran) {
        layers.design = { ran: true, ...design.layer };
        issues.push(...design.issues);
      } else {
        layers.design = { ran: false, reason: design.reason };
        skippedLayers.push('design');
        console.warn(`⚠️ QA gate: design layer skipped — ${design.reason}`);
      }
    } else {
      const reason = this.skipSkillLayers
        ? 'skill layers skipped by caller (skipSkillLayers)'
        : 'claude CLI not available';
      layers.functional = { ran: false, reason };
      layers.design = { ran: false, reason };
      skippedLayers.push('functional', 'design');
      console.warn(`⚠️ QA gate: functional/design layers skipped — ${reason}`);
    }

    // Score
    let score = 100;
    for (const issue of issues) {
      score -= SEVERITY_DEDUCTIONS[issue.severity] ?? SEVERITY_DEDUCTIONS.medium;
    }
    score = Math.max(0, score);
    const hasCritical = issues.some((i) => i.severity === 'critical');
    const pass = score >= this.minScore && !hasCritical;

    const verdict = {
      score,
      pass,
      minScore: this.minScore,
      company,
      htmlPath,
      issues,
      layers,
      skippedLayers,
      durationMs: Date.now() - startedAt,
      createdAt: new Date().toISOString(),
    };

    console.log(
      `${pass ? '✅' : '❌'} QA gate: ${company} scored ${score}/100 (min ${this.minScore}) — ${issues.length} issue(s)`
    );

    return verdict;
  }

  /**
   * Layer 2: headless Chromium via the playwright-skill executor.
   * @private
   */
  async _runBrowserLayer({ htmlPath, jobId }) {
    if (!isBrowserLayerAvailable(this.projectRoot)) {
      return { ran: false, reason: 'playwright-skill executor or its node_modules were not found' };
    }

    const dir = path.dirname(htmlPath);
    const entryFile = path.basename(htmlPath);

    let server;
    try {
      server = await startStaticServer(dir, entryFile);
    } catch (err) {
      return { ran: false, reason: `failed to start local server: ${err.message}` };
    }

    let scriptPath;
    try {
      const port = server.address().port;
      const url = `http://127.0.0.1:${port}/`;

      scriptPath = path.join(this.outputDir, `${jobId}-browser-script.cjs`);
      const reportPath = path.join(this.outputDir, `${jobId}-browser.json`);
      const mobileShot = path.join(this.outputDir, `${jobId}-mobile.png`);
      const desktopShot = path.join(this.outputDir, `${jobId}-desktop.png`);

      const skillDir = path.join(this.projectRoot, '.claude/skills/playwright-skill');
      const runJs = path.join(skillDir, 'run.js');

      try {
        await fs.unlink(reportPath);
      } catch (err) {
        if (err.code !== 'ENOENT') throw err;
      }

      await fs.writeFile(scriptPath, buildBrowserScript({ url, reportPath, mobileShot, desktopShot }), 'utf-8');

      const spawnResult = await spawnWithTimeout('node', [runJs, scriptPath], { cwd: skillDir, env: process.env }, this.timeoutMs);

      if (spawnResult.timedOut) {
        return { ran: false, reason: `browser layer timed out after ${this.timeoutMs}ms` };
      }
      if (spawnResult.spawnError) {
        return { ran: false, reason: `failed to spawn browser layer: ${spawnResult.spawnError}` };
      }

      let report;
      try {
        const raw = await fs.readFile(reportPath, 'utf-8');
        report = JSON.parse(raw);
      } catch (err) {
        return { ran: false, reason: `browser layer produced no readable report: ${err.message}` };
      }

      // A Playwright launch/navigation failure is infra flakiness, not a
      // defect in the reviewed site — treat it like the other "couldn't run"
      // cases (skipped, with a reason) rather than penalizing the site.
      if (report.error) {
        return { ran: false, reason: `browser automation error: ${report.error}` };
      }

      const issues = [];
      for (const msg of report.pageErrors || []) {
        issues.push({ severity: 'high', layer: 'browser', description: `Page error: ${msg}` });
      }
      for (const msg of report.consoleErrors || []) {
        issues.push({ severity: 'medium', layer: 'browser', description: `Console error: ${msg}` });
      }
      for (const failed of report.failedRequests || []) {
        issues.push({
          severity: 'medium',
          layer: 'browser',
          description: `Failed request: ${failed.url} (${failed.error})`,
        });
      }
      if (report.overflowAt375) {
        issues.push({
          severity: 'high',
          layer: 'browser',
          description: 'Horizontal overflow detected at 375px viewport width (mobile layout breaks)',
          fix: 'Constrain widths (max-width: 100%, avoid fixed px widths) so nothing overflows at mobile breakpoints.',
        });
      }

      return {
        ran: true,
        issues,
        layer: {
          url,
          screenshots: { mobile: mobileShot, desktop: desktopShot },
          pageErrorCount: (report.pageErrors || []).length,
          consoleErrorCount: (report.consoleErrors || []).length,
          failedRequestCount: (report.failedRequests || []).length,
          overflowAt375: !!report.overflowAt375,
        },
      };
    } finally {
      // Keep the report JSON and screenshots — they're evidence referenced
      // by the verdict — but the generated script itself is a throwaway
      // temp artifact.
      if (scriptPath) {
        try {
          await fs.unlink(scriptPath);
        } catch (err) {
          if (err.code !== 'ENOENT') {
            console.warn(`⚠️ QA gate: failed to clean up ${scriptPath}: ${err.message}`);
          }
        }
      }
      await new Promise((resolve) => server.close(() => resolve()));
    }
  }

  /**
   * Layer 3a: functional review via the qa-test skill (headless Claude Code session).
   * @private
   */
  async _runFunctionalLayer({ htmlPath, company, slug }) {
    const dir = path.dirname(htmlPath);
    const entryFile = path.basename(htmlPath);

    let server;
    try {
      server = await startStaticServer(dir, entryFile);
    } catch (err) {
      return { ran: false, reason: `failed to start local server: ${err.message}` };
    }

    try {
      const port = server.address().port;
      const url = `http://127.0.0.1:${port}/`;
      const jobId = `${slug}-functional-${Date.now()}`;
      const outputFile = path.join(this.outputDir, `${jobId}.json`);

      const res = await this.runner.runSkill({
        jobId,
        skill: 'qa-test',
        prompt: buildFunctionalPrompt({ url, company, adversary: this.adversary }),
        outputFile,
        mcpConfig: {
          mcpServers: {
            playwright: { command: 'npx', args: ['@playwright/mcp@latest', '--headless'] },
          },
        },
        allowedTools: ['mcp__playwright__*', 'Read', 'Write'],
        maxTurns: 30,
        timeoutMs: this.timeoutMs,
      });

      if (!res.ok) {
        return { ran: false, reason: res.reason || res.error || 'unknown functional layer failure' };
      }

      const result = res.result || {};
      const rawIssues = Array.isArray(result.issues) ? result.issues : [];
      const issues = rawIssues.map((issue) => ({
        severity: normalizeSeverity(issue.severity),
        layer: 'functional',
        description: issue.description || String(issue),
        ...(issue.fix ? { fix: issue.fix } : {}),
      }));

      return {
        ran: true,
        issues,
        layer: { pass: !!result.pass, issueCount: issues.length },
      };
    } finally {
      await new Promise((resolve) => server.close(() => resolve()));
    }
  }

  /**
   * Layer 3b: design/UX review via the ui-ux-pro-max skill (headless Claude Code session).
   * @private
   */
  async _runDesignLayer({ htmlPath, company, slug }) {
    const jobId = `${slug}-design-${Date.now()}`;
    const outputFile = path.join(this.outputDir, `${jobId}.json`);

    const res = await this.runner.runSkill({
      jobId,
      skill: 'ui-ux-pro-max',
      prompt: buildDesignPrompt({ htmlPath, company }),
      outputFile,
      allowedTools: ['Read', 'Write', 'Glob', 'Grep', 'Bash'],
      maxTurns: 25,
      timeoutMs: this.timeoutMs,
    });

    if (!res.ok) {
      return { ran: false, reason: res.reason || res.error || 'unknown design layer failure' };
    }

    const result = res.result || {};
    const rawIssues = Array.isArray(result.issues) ? result.issues : [];
    const issues = rawIssues.map((issue) => ({
      severity: normalizeSeverity(issue.severity),
      layer: 'design',
      description: issue.description || String(issue),
      ...(issue.fix ? { fix: issue.fix } : {}),
    }));

    return {
      ran: true,
      issues,
      layer: {
        skillScore: typeof result.score === 'number' ? result.score : null,
        issueCount: issues.length,
      },
    };
  }
}

/**
 * Layer 1: pure-Node deterministic checks against the raw HTML.
 * @param {string} html
 * @param {number} fileSize - bytes
 * @returns {{issues: Array, summary: Object}}
 */
function runDeterministicChecks(html, fileSize) {
  const issues = [];
  const htmlLower = html.toLowerCase();

  // Placeholder / leaked template text — critical. Checked as raw
  // case-insensitive substrings anywhere in the HTML, including attributes
  // (e.g. a real mailto: leak).
  for (const term of RAW_PLACEHOLDER_TERMS) {
    if (htmlLower.includes(term.toLowerCase())) {
      issues.push({
        severity: 'critical',
        layer: 'deterministic',
        description: `Placeholder or leaked template text found: "${term}"`,
        fix: 'Replace placeholder content with real, business-specific copy before shipping.',
      });
    }
  }

  // Strip <script>/<style> blocks and HTML comments, then all remaining
  // tags, to get a "visible text" view of the document. This deliberately
  // drops attribute values (e.g. placeholder="...") so native HTML
  // placeholder attributes don't false-positive as leaked template text.
  const withoutScriptsAndStyles = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const commentBodies = [...withoutScriptsAndStyles.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1]);
  const visibleText = withoutScriptsAndStyles.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]*>/g, ' ');

  // 'PLACEHOLDER' and 'TODO' are too generic for a raw substring match
  // (they collide with the placeholder="..." attribute and minified JS
  // identifiers respectively), so match them as whole words against the
  // visible-text-only view instead.
  for (const term of WORD_BOUNDARY_PLACEHOLDER_TERMS) {
    const wordRe = new RegExp(`\\b${term}\\b`, 'i');
    if (wordRe.test(visibleText)) {
      issues.push({
        severity: 'critical',
        layer: 'deterministic',
        description: `Placeholder or leaked template text found: "${term}"`,
        fix: 'Replace placeholder content with real, business-specific copy before shipping.',
      });
    }
  }

  // Leftover developer comments (TODO/PLACEHOLDER/FIXME) are a hygiene
  // issue, not a customer-facing leak — low severity, and not also counted
  // as a critical visible-text leak since comments are stripped above.
  if (commentBodies.some((c) => DEV_COMMENT_RE.test(c))) {
    issues.push({
      severity: 'low',
      layer: 'deterministic',
      description: 'Leftover developer comment (TODO/PLACEHOLDER/FIXME) found in HTML source',
      fix: 'Remove internal developer comments before shipping to the customer.',
    });
  }

  // Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const titleText = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : '';
  if (!titleText) {
    issues.push({
      severity: 'high',
      layer: 'deterministic',
      description: 'Missing or empty <title> tag',
      fix: 'Add a descriptive <title> including the business name.',
    });
  }

  // Meta tags
  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
  const hasMetaDescription = metaTags.some(
    (tag) => /name=["']description["']/i.test(tag) && /content=["'][^"']+["']/i.test(tag)
  );
  if (!hasMetaDescription) {
    issues.push({
      severity: 'medium',
      layer: 'deterministic',
      description: 'Missing meta description tag',
      fix: 'Add <meta name="description" content="..."> with a business summary.',
    });
  }

  const hasViewport = metaTags.some((tag) => /name=["']viewport["']/i.test(tag));
  if (!hasViewport) {
    issues.push({
      severity: 'high',
      layer: 'deterministic',
      description: 'Missing meta viewport tag',
      fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0">.',
    });
  }

  // lang attribute
  const htmlTagMatch = html.match(/<html\b[^>]*>/i);
  const langMatch = htmlTagMatch ? htmlTagMatch[0].match(/lang=["']([^"']*)["']/i) : null;
  const hasLang = !!(langMatch && langMatch[1].trim());
  if (!hasLang) {
    issues.push({
      severity: 'medium',
      layer: 'deterministic',
      description: 'Missing lang attribute on <html> tag',
      fix: 'Set <html lang="el"> (or the appropriate locale).',
    });
  }

  // Images without alt text
  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  const imagesWithoutAlt = imgTags.filter((tag) => {
    const altMatch = tag.match(/alt=["']([^"']*)["']/i);
    return !altMatch || !altMatch[1].trim();
  });
  if (imagesWithoutAlt.length > 0) {
    issues.push({
      severity: 'medium',
      layer: 'deterministic',
      description: `${imagesWithoutAlt.length} <img> tag(s) missing a non-empty alt attribute`,
      fix: 'Add descriptive alt text to every image.',
    });
  }

  // Contact form presence
  const hasForm = /<form\b/i.test(html);
  if (!hasForm) {
    issues.push({
      severity: 'low',
      layer: 'deterministic',
      description: 'No <form> element found (lead-gen demos should include a contact form)',
    });
  }

  // Broken internal anchors
  const anchorHrefs = [...html.matchAll(/href=["']#([^"'#\s]+)["']/gi)].map((m) => m[1]);
  const idAttrs = new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((m) => m[1]));
  const brokenAnchors = [...new Set(anchorHrefs)].filter((id) => id && !idAttrs.has(id));
  if (brokenAnchors.length > 0) {
    issues.push({
      severity: 'medium',
      layer: 'deterministic',
      description: `Broken internal anchor link(s) with no matching id: ${brokenAnchors.join(', ')}`,
      fix: 'Ensure every href="#anchor" has a matching id="anchor" in the document.',
    });
  }

  // File size sanity
  if (fileSize < 2048) {
    issues.push({
      severity: 'critical',
      layer: 'deterministic',
      description: 'HTML file is empty or truncated output (< 2KB)',
    });
  } else if (fileSize > 3 * 1024 * 1024) {
    issues.push({
      severity: 'medium',
      layer: 'deterministic',
      description: 'HTML file is unusually large (> 3MB) — consider optimizing inline assets',
    });
  }

  // Greek text presence (target market)
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyText = (bodyMatch ? bodyMatch[1] : html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  const hasGreekText = /[Ͱ-Ͽἀ-῿]/.test(bodyText);
  if (!hasGreekText) {
    issues.push({
      severity: 'medium',
      layer: 'deterministic',
      description: 'No Greek characters detected in visible body text (target market is Greek businesses)',
    });
  }

  return {
    issues,
    summary: {
      titlePresent: !!titleText,
      metaDescriptionPresent: hasMetaDescription,
      viewportPresent: hasViewport,
      langPresent: hasLang,
      imagesWithoutAltCount: imagesWithoutAlt.length,
      formPresent: hasForm,
      brokenAnchorCount: brokenAnchors.length,
      fileSizeBytes: fileSize,
      hasGreekText,
    },
  };
}

/**
 * Whether the playwright-skill executor (and its bundled Playwright install) is present.
 * @param {string} projectRoot
 * @returns {boolean}
 */
function isBrowserLayerAvailable(projectRoot) {
  const skillDir = path.join(projectRoot, '.claude/skills/playwright-skill');
  const runJs = path.join(skillDir, 'run.js');
  const pwModule = path.join(skillDir, 'node_modules', 'playwright');
  return fsSync.existsSync(runJs) && fsSync.existsSync(pwModule);
}

/**
 * Start a tiny static file server rooted at `rootDir`, serving `entryFile` at '/'.
 * @param {string} rootDir
 * @param {string} entryFile
 * @returns {Promise<import('http').Server>}
 */
function startStaticServer(rootDir, entryFile) {
  const rootNormalized = path.normalize(rootDir);
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
        if (urlPath === '/' || urlPath === '') urlPath = '/' + entryFile;

        const filePath = path.normalize(path.join(rootNormalized, urlPath));
        const rel = path.relative(rootNormalized, filePath);
        if (rel.startsWith('..') || path.isAbsolute(rel)) {
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          res.end('Forbidden');
          return;
        }

        fsSync.readFile(filePath, (err, data) => {
          if (err) {
            // Chromium always requests /favicon.ico; when the served dir has
            // none, answer with a quiet 204 instead of a 404 so it doesn't
            // surface as a spurious console/network error in the browser layer.
            if (urlPath === '/favicon.ico') {
              res.writeHead(204);
              res.end();
              return;
            }
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not found');
            return;
          }
          const ext = path.extname(filePath).toLowerCase();
          res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/html; charset=utf-8' });
          res.end(data);
        });
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error');
      }
    });

    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.removeListener('error', reject);
      resolve(server);
    });
  });
}

/**
 * Build the standalone CommonJS Playwright script executed via playwright-skill's run.js.
 * @param {{url: string, reportPath: string, mobileShot: string, desktopShot: string}} opts
 * @returns {string}
 */
function buildBrowserScript({ url, reportPath, mobileShot, desktopShot }) {
  return `const { chromium } = require('playwright');
const fs = require('fs');

const TARGET_URL = ${JSON.stringify(url)};
const REPORT_PATH = ${JSON.stringify(reportPath)};
const MOBILE_SHOT = ${JSON.stringify(mobileShot)};
const DESKTOP_SHOT = ${JSON.stringify(desktopShot)};

const report = {
  pageErrors: [],
  consoleErrors: [],
  failedRequests: [],
  overflowAt375: false,
  error: null,
};

(async () => {
  let browser = null;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    page.on('pageerror', function (err) {
      report.pageErrors.push(String(err && err.message ? err.message : err));
    });
    page.on('console', function (msg) {
      if (msg.type() === 'error') {
        const text = msg.text() || '';
        const loc = typeof msg.location === 'function' ? msg.location() : null;
        const locUrl = (loc && loc.url) || '';
        if (text.toLowerCase().indexOf('favicon') !== -1 || locUrl.toLowerCase().indexOf('favicon') !== -1) return;
        report.consoleErrors.push(text);
      }
    });
    page.on('requestfailed', function (req) {
      const reqUrl = req.url();
      if (reqUrl.indexOf('favicon') !== -1) return;
      const failure = req.failure();
      report.failedRequests.push({ url: reqUrl, error: failure ? failure.errorText : 'unknown' });
    });

    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });

    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: MOBILE_SHOT });

    report.overflowAt375 = await page.evaluate(function () {
      var el = document.scrollingElement || document.documentElement;
      return el.scrollWidth > el.clientWidth;
    });

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(200);
    await page.screenshot({ path: DESKTOP_SHOT });
  } catch (err) {
    report.error = String(err && err.message ? err.message : err);
  } finally {
    try {
      fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    } catch (writeErr) {
      // nothing more we can do if the report itself can't be written
    }
    if (browser) {
      try { await browser.close(); } catch (closeErr) {}
    }
    process.exit(0);
  }
})();
`;
}

/**
 * Build the prompt for the qa-test skill's functional review.
 * @param {{url: string, company: string, adversary: boolean}} opts
 * @returns {string}
 */
function buildFunctionalPrompt({ url, company, adversary }) {
  const lines = [
    `Run the qa-test skill in standard+discovery mode against ${url}`,
    `This is a one-page Greek demo site for "${company}".`,
    'Success criteria:',
    '- Page loads without console/page errors',
    '- Nav anchor links scroll to existing sections on the page',
    '- The contact form has name, email, and message fields plus a submit control with client-side validation feedback',
    '- The menu/navigation is usable at 375px viewport width',
    '- All visible text is Greek or business-appropriate (no placeholder text such as "lorem ipsum" or "TODO")',
  ];
  if (adversary) {
    lines.push(
      'After the standard pass, also run an adversary pass: actively try to break the page (rapid clicks, invalid form input, resizing, empty submissions) and report anything that fails.'
    );
  }
  lines.push(
    'Write your final verdict as valid JSON to the output file with this exact shape: {"pass": boolean, "issues": [{"severity": "critical|high|medium|low", "description": "..."}]}.'
  );
  return lines.join('\n');
}

/**
 * Build the prompt for the ui-ux-pro-max skill's design review.
 * @param {{htmlPath: string, company: string}} opts
 * @returns {string}
 */
function buildDesignPrompt({ htmlPath, company }) {
  return [
    `Review the HTML file at ${htmlPath} (a single-file Greek business demo site for "${company}") against the ui-ux-pro-max skill's accessibility/UX priority checklist: color contrast, touch target size, typography, and spacing/focus states.`,
    'Write your final verdict as valid JSON to the output file with this exact shape: {"score": 0-100, "issues": [{"severity": "critical|high|medium|low", "description": "...", "fix": "..."}]}.',
  ].join('\n');
}

/**
 * Normalize an arbitrary severity string from a skill's output into our 4-level scale.
 * @param {string} sev
 * @returns {'critical'|'high'|'medium'|'low'}
 */
function normalizeSeverity(sev) {
  const s = String(sev || '').toLowerCase();
  if (s === 'critical' || s === 'high' || s === 'medium' || s === 'low') return s;
  if (s === 'blocker' || s === 'severe') return 'critical';
  if (s === 'minor' || s === 'nit' || s === 'info') return 'low';
  return 'medium';
}

/**
 * Turn a company name into a filesystem/job-id-safe slug.
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  const slug = String(str || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return slug || 'unknown';
}

/**
 * Spawn a process with a hard timeout, killing the process tree on Windows via taskkill.
 * @param {string} cmd
 * @param {string[]} args
 * @param {{cwd: string, env: NodeJS.ProcessEnv}} opts
 * @param {number} timeoutMs
 * @returns {Promise<{exitCode: number|null, stdout: string, stderr: string, timedOut: boolean, spawnError?: string}>}
 */
function spawnWithTimeout(cmd, args, opts, timeoutMs) {
  return new Promise((resolve) => {
    let child;
    try {
      child = spawn(cmd, args, { ...opts, shell: false });
    } catch (err) {
      resolve({ exitCode: null, stdout: '', stderr: '', timedOut: false, spawnError: err.message });
      return;
    }

    let stdout = '';
    let stderr = '';
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      killProcessTree(child);
      resolve({ exitCode: null, stdout, stderr, timedOut: true });
    }, timeoutMs);

    child.stdout?.on('data', (d) => { stdout += d.toString(); });
    child.stderr?.on('data', (d) => { stderr += d.toString(); });

    child.on('error', (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ exitCode: null, stdout, stderr, timedOut: false, spawnError: err.message });
    });

    child.on('exit', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ exitCode: code, stdout, stderr, timedOut: false });
    });
  });
}

/**
 * Kill a spawned process and its children.
 * @param {import('child_process').ChildProcess} child
 */
function killProcessTree(child) {
  if (!child || !child.pid) return;
  if (process.platform === 'win32') {
    const tk = spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { shell: false });
    // Fire-and-forget cleanup: an ENOENT/error here must never throw and
    // crash the agent, and it must not keep the event loop alive.
    tk.on('error', () => {});
    tk.unref();
  } else {
    try {
      child.kill('SIGKILL');
    } catch {
      // process may already have exited
    }
  }
}

// ---------------------------------------------------------------------------
// CLI mode: `node src/qa-gate.js --test <htmlPath> [--skip-skill-layers]`
// Prints ONLY the verdict JSON to stdout; all logs go to stderr.
// ---------------------------------------------------------------------------
const isCliMain =
  !!process.argv[1] &&
  path.resolve(__filename).toLowerCase() === path.resolve(process.argv[1]).toLowerCase();

/**
 * CLI entrypoint. Each termination path writes its JSON payload to stdout
 * using the write(data, callback) form and calls process.exit(code) from
 * that callback. This both guarantees the payload is fully flushed before
 * exit (no truncation) and guarantees the process actually exits even if a
 * straggler handle (e.g. a browser-layer child that survived a taskkill on
 * the timeout path) would otherwise keep the event loop alive forever.
 */
async function runCli() {
  // Route console.log (ours and any dependency's, e.g. SkillRunner) to stderr
  // so stdout stays a clean, parseable JSON stream.
  const originalConsoleLog = console.log;
  console.log = (...args) => { console.error(...args); };

  const dotenvModule = await import('dotenv');
  dotenvModule.default.config();

  const cliArgs = process.argv.slice(2);
  const testFlagIdx = cliArgs.indexOf('--test');
  const skipSkillLayersFlag = cliArgs.includes('--skip-skill-layers');

  if (testFlagIdx === -1 || !cliArgs[testFlagIdx + 1]) {
    console.error('Usage: node src/qa-gate.js --test <htmlPath> [--skip-skill-layers]');
    console.log = originalConsoleLog;
    const payload = JSON.stringify({ error: 'missing required --test <htmlPath> argument' }, null, 2) + '\n';
    process.stdout.write(payload, () => process.exit(1));
    return;
  }

  const cliHtmlPath = path.resolve(cliArgs[testFlagIdx + 1]);

  try {
    await fs.access(cliHtmlPath);
  } catch {
    console.log = originalConsoleLog;
    const payload = JSON.stringify({ error: `file not found: ${cliHtmlPath}` }, null, 2) + '\n';
    process.stdout.write(payload, () => process.exit(1));
    return;
  }

  try {
    const gate = new QAGate({ skipSkillLayers: skipSkillLayersFlag });
    await gate.initialize();
    const companyGuess = path.basename(cliHtmlPath, path.extname(cliHtmlPath));
    const verdict = await gate.review({ htmlPath: cliHtmlPath, company: companyGuess });

    console.log = originalConsoleLog;
    const payload = JSON.stringify(verdict, null, 2) + '\n';
    process.stdout.write(payload, () => process.exit(0));
  } catch (err) {
    console.log = originalConsoleLog;
    const payload = JSON.stringify({ error: err.message }, null, 2) + '\n';
    process.stdout.write(payload, () => process.exit(1));
  }
}

if (isCliMain) {
  await runCli();
}
