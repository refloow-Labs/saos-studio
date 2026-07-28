#!/usr/bin/env node

// Read-only per-PC setup validator. Run via `npm run doctor`.
// It NEVER sends emails, calls OpenRouter, writes to data/*.db, or pushes to git.
// It NEVER prints any value read from .env — only key names and present/missing status.

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const REQUIRED_KEYS = [
  'OPENROUTER_API_KEY',
  'GMAIL_CLIENT_ID',
  'GMAIL_CLIENT_SECRET',
  'GMAIL_REFRESH_TOKEN',
  'SENDER_NAME',
  'SENDER_EMAIL',
];

const OPTIONAL_KEYS = ['GITHUB_TOKEN', 'SITES_REPO', 'QA_ENABLED', 'DESIGNER_AGENT_ENABLED'];

let okCount = 0;
let warnCount = 0;
let failCount = 0;

function ok(msg) {
  okCount += 1;
  console.log(`✅ ${msg}`);
}

function warn(msg) {
  warnCount += 1;
  console.log(`⚠️  ${msg}`);
}

function fail(msg) {
  failCount += 1;
  console.log(`❌ ${msg}`);
}

function section(title) {
  console.log(`\n--- ${title} ---`);
}

// --- 1. Node version ---
async function checkNodeVersion() {
  section('Node.js');
  const version = process.version; // e.g. v20.11.0
  const major = parseInt(version.slice(1).split('.')[0], 10);

  if (major < 18) {
    fail(`Node ${version} — απαιτείται τουλάχιστον Node 18 (συνιστάται 20+).`);
  } else if (major < 20) {
    warn(`Node ${version} — λειτουργεί, αλλά συνιστάται αναβάθμιση σε Node 20+.`);
  } else {
    ok(`Node ${version}`);
  }
}

// --- 2. Dependencies installed (sqlite3 must actually load) ---
async function checkDependencies() {
  section('Εξαρτήσεις (node_modules)');

  if (!fsSync.existsSync('node_modules')) {
    fail('Ο φάκελος node_modules δεν υπάρχει. Τρέξε: npm install');
    return;
  }
  ok('Ο φάκελος node_modules υπάρχει.');

  try {
    await import('sqlite3');
    ok('Το module sqlite3 φορτώνει κανονικά.');
  } catch (err) {
    fail(
      `Το native module sqlite3 δεν φορτώνει (${err.message}). ` +
        'Συνήθως συμβαίνει όταν το binary χτίστηκε σε άλλο OS (π.χ. macOS -> Windows). ' +
        'Διόρθωση: rm -rf node_modules/sqlite3 && npm install sqlite3'
    );
  }
}

// --- 3 & 4. .env present + required/optional keys ---
async function checkEnvFile() {
  section('.env');

  if (!fsSync.existsSync('.env')) {
    fail('Δεν βρέθηκε αρχείο .env. Αντέγραψε το .env.example: cp .env.example .env');
    return { present: false, parsed: {} };
  }
  ok('Το αρχείο .env υπάρχει.');

  const raw = await fs.readFile('.env', 'utf-8');
  const parsed = dotenv.parse(raw);
  return { present: true, parsed };
}

function checkRequiredKeys(parsed) {
  section('Απαιτούμενα κλειδιά (.env)');

  const missing = [];
  for (const key of REQUIRED_KEYS) {
    const value = parsed[key];
    if (value === undefined || value === '') {
      missing.push(key);
    }
  }

  if (missing.length === 0) {
    ok(`Όλα τα απαιτούμενα κλειδιά είναι ρυθμισμένα (${REQUIRED_KEYS.join(', ')}).`);
  } else {
    fail(`Λείπουν ή είναι κενά τα απαιτούμενα κλειδιά: ${missing.join(', ')}`);
  }

  return missing;
}

function checkOptionalKeys(parsed) {
  section('Προαιρετικά κλειδιά (.env)');

  const githubToken = parsed.GITHUB_TOKEN;
  const sitesRepo = parsed.SITES_REPO;

  if ((githubToken === undefined || githubToken === '') || (sitesRepo === undefined || sitesRepo === '')) {
    warn(
      'Λείπουν GITHUB_TOKEN ή SITES_REPO — ο συντονισμός ομάδας (GitHub) είναι ΑΠΕΝΕΡΓΟΣ: ' +
        'δεν θα υπάρχει προστασία από διπλά emails / διπλή δημιουργία sites μεταξύ συναδέλφων.'
    );
  } else {
    ok('GITHUB_TOKEN και SITES_REPO είναι ρυθμισμένα.');
  }

  const qaEnabled = parsed.QA_ENABLED;
  if (qaEnabled === undefined || qaEnabled === '') {
    warn('Το QA_ENABLED δεν είναι ρυθμισμένο — το QA gate θα είναι απενεργοποιημένο (default false).');
  } else {
    ok('Το QA_ENABLED είναι ρυθμισμένο.');
  }

  const designerEnabled = parsed.DESIGNER_AGENT_ENABLED;
  if (designerEnabled === undefined || designerEnabled === '') {
    warn(
      'Το DESIGNER_AGENT_ENABLED δεν είναι ρυθμισμένο — θα χρησιμοποιηθεί ο default website generator ' +
        '(default false).'
    );
  } else {
    ok('Το DESIGNER_AGENT_ENABLED είναι ρυθμισμένο.');
  }

  return { githubToken, sitesRepo };
}

// --- 5. GitHub access (only if GITHUB_TOKEN + SITES_REPO are set) ---
async function checkGithubAccess(githubToken, sitesRepo) {
  section('Πρόσβαση GitHub (κοινόχρηστο repo sites)');

  if (!githubToken || !sitesRepo) {
    warn('GITHUB_TOKEN/SITES_REPO δεν είναι ρυθμισμένα — παραλείπεται ο έλεγχος (συντονισμός ομάδας ανενεργός).');
    return;
  }

  try {
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default;

    const response = await fetch(`https://api.github.com/repos/${sitesRepo}`, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'saos-autonomous-agent-doctor',
      },
    });

    const rateRemaining = response.headers.get('x-ratelimit-remaining');

    if (!response.ok) {
      fail(`Το repo ${sitesRepo} δεν είναι προσβάσιμο (HTTP ${response.status}). Έλεγξε το token και το SITES_REPO.`);
      return;
    }

    const data = await response.json();
    ok(`Το repo ${sitesRepo} είναι προσβάσιμο.`);

    if (data?.permissions?.push === true) {
      ok('Το token έχει δικαίωμα εγγραφής (push) στο repo.');
    } else {
      fail('Το token ΔΕΝ μπορεί να γράψει σε αυτό το repo (permissions.push=false). Χρειάζεται Contents read+write.');
    }

    if (rateRemaining !== null) {
      ok(`GitHub API rate limit remaining: ${rateRemaining}`);
    }
  } catch (err) {
    fail(`Αποτυχία σύνδεσης με το GitHub API: ${err.message}`);
  }
}

// --- 6. Gmail refresh token ---
function checkGmail(parsed) {
  section('Gmail');

  const refreshToken = parsed.GMAIL_REFRESH_TOKEN;
  if (refreshToken === undefined || refreshToken === '') {
    warn('Δεν βρέθηκε GMAIL_REFRESH_TOKEN. Τρέξε: npm run setup');
  } else {
    ok('Το GMAIL_REFRESH_TOKEN είναι ρυθμισμένο.');
  }
}

// --- 7. Data directory writable ---
async function checkDataDirectory() {
  section('Φάκελος data/');

  if (!fsSync.existsSync('data')) {
    fail('Ο φάκελος data/ δεν υπάρχει.');
    return;
  }
  ok('Ο φάκελος data/ υπάρχει.');

  const testFile = path.join('data', '.doctor-write-test');
  try {
    await fs.writeFile(testFile, 'doctor check');
    await fs.unlink(testFile);
    ok('Ο φάκελος data/ είναι εγγράψιμος.');
  } catch (err) {
    fail(`Ο φάκελος data/ δεν είναι εγγράψιμος: ${err.message}`);
  }
}

// --- 8. QA gate deps (Chromium via Playwright skill) ---
function checkQaGateDeps() {
  section('QA Gate — Playwright (Chromium)');

  const playwrightPath = path.join('.claude', 'skills', 'playwright-skill', 'node_modules', 'playwright');
  if (fsSync.existsSync(playwrightPath)) {
    ok('Το Playwright skill (Chromium layer) είναι εγκατεστημένο.');
  } else {
    warn(
      'Δεν βρέθηκε .claude/skills/playwright-skill/node_modules/playwright — το browser layer του QA gate ' +
        'θα παραλειφθεί.'
    );
  }
}

// --- 9. Docker ---
function runCommand(cmd, args, timeoutMs) {
  return new Promise((resolve) => {
    const child = execFile(cmd, args, { timeout: timeoutMs }, (err, stdout) => {
      if (err) {
        resolve({ ok: false });
      } else {
        resolve({ ok: true, stdout: stdout?.toString().trim() });
      }
    });
    child.on('error', () => resolve({ ok: false }));
  });
}

async function checkDocker() {
  section('Docker (CRM)');

  const result = await runCommand('docker', ['--version'], 5000);
  if (result.ok) {
    ok(`Docker διαθέσιμο: ${result.stdout}`);
  } else {
    warn('Δεν βρέθηκε εντολή docker στο PATH. Δες το ../DOCKER.md για οδηγίες εγκατάστασης του CRM.');
  }
}

// --- 10. Claude CLI ---
async function checkClaudeCli() {
  section('Claude CLI');

  const result = await runCommand('claude', ['--version'], 5000);
  if (result.ok) {
    ok(`Claude CLI διαθέσιμο: ${result.stdout}`);
  } else {
    warn('Δεν βρέθηκε εντολή claude στο PATH — τα layers του QA skill που το χρειάζονται θα παραλειφθούν.');
  }
}

async function main() {
  console.log('🩺 SAOS Autonomous Agent — Doctor\n');
  console.log('Έλεγχος ρύθμισης αυτού του μηχανήματος (μόνο ανάγνωση, καμία πραγματική ενέργεια).');

  await checkNodeVersion();
  await checkDependencies();

  const { parsed } = await checkEnvFile();
  checkRequiredKeys(parsed);
  const { githubToken, sitesRepo } = checkOptionalKeys(parsed);
  await checkGithubAccess(githubToken, sitesRepo);
  checkGmail(parsed);
  await checkDataDirectory();
  checkQaGateDeps();
  await checkDocker();
  await checkClaudeCli();

  console.log('\n=================================');
  console.log(`Σύνοψη: ${okCount} ✅ · ${warnCount} ⚠️ · ${failCount} ❌`);

  if (failCount === 0 && warnCount === 0) {
    console.log('Το σύστημα είναι πλήρως έτοιμο.');
  } else if (failCount === 0) {
    console.log('Το σύστημα είναι έτοιμο. Δες τα ⚠️ παραπάνω για προαιρετικές βελτιώσεις.');
  } else {
    console.log('Το σύστημα ΔΕΝ είναι έτοιμο. Διόρθωσε τα ❌ παραπάνω πριν τρέξεις `npm start`.');
  }
  console.log('=================================\n');

  process.exit(failCount === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('❌ Απρόσμενο σφάλμα στο doctor:', err);
  process.exit(1);
});
