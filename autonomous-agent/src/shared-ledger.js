/**
 * Shared Ledger
 * Records which email recipients have already been sent an outreach email,
 * using the shared GitHub repo as the single coordination point across every
 * PC running the agent — so the same recipient never gets emailed twice.
 */

import { GitHubStore } from './github-store.js';

// Print the "not configured" warning at most once per process so a 50-lead
// batch doesn't spam the console.
let hasWarnedNotConfigured = false;

export class SharedLedger {
  /**
   * @param {Object} [options]
   * @param {GitHubStore} [options.store] - inject a GitHubStore (e.g. for tests)
   */
  constructor(options = {}) {
    this.store = options.store ?? new GitHubStore(options);
  }

  /** @returns {boolean} whether GitHub is configured for the shared ledger */
  isConfigured() {
    return this.store.isConfigured();
  }

  /**
   * Deterministic ledger key for an email address.
   * @param {string} email
   * @returns {string}
   */
  static ledgerKey(email) {
    const key = String(email)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    if (!key) {
      throw new Error(`SharedLedger.ledgerKey: could not derive a key from email "${email}"`);
    }
    return key;
  }

  /**
   * Whether an email has already been recorded as sent.
   * IMPORTANT: if the GitHub call fails (network/API error, not a clean 404),
   * this throws rather than returning false — callers MUST treat a throw as
   * "unknown → do not send" to avoid duplicate emails. Only a clean 404
   * (file does not exist) resolves to false.
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  async wasSent(email) {
    if (!this.isConfigured()) {
      warnOnce();
      return false;
    }
    const key = SharedLedger.ledgerKey(email);
    return this.store.exists(`ledger/sent/${key}.json`);
  }

  /**
   * @param {string} email
   * @returns {Promise<Object|null>} the parsed sent record, or null if not sent
   */
  async getSentRecord(email) {
    if (!this.isConfigured()) {
      warnOnce();
      return null;
    }
    const key = SharedLedger.ledgerKey(email);
    return this.store.getJson(`ledger/sent/${key}.json`);
  }

  /**
   * Record that an email has been sent. Does not overwrite an existing record.
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.company
   * @param {string|null} [params.slug]
   * @param {string|null} [params.subject]
   * @returns {Promise<{recorded: boolean, path?: string, reason?: string, existing?: Object}>}
   */
  async recordSent({ email, company, slug = null, subject = null }) {
    if (!this.isConfigured()) {
      warnOnce();
      return { recorded: false, reason: 'github-not-configured' };
    }

    const key = SharedLedger.ledgerKey(email);
    const filePath = `ledger/sent/${key}.json`;

    let existing;
    try {
      existing = await this.store.getJson(filePath);
    } catch (err) {
      console.error(`❌ SharedLedger: failed to check existing record for "${email}": ${err.message}`);
      return { recorded: false, reason: `check-failed: ${err.message}` };
    }

    if (existing) {
      return { recorded: false, reason: 'already-recorded', existing };
    }

    const record = {
      email: String(email).trim().toLowerCase(),
      company,
      slug,
      subject,
      sentAt: new Date().toISOString(),
      sentBy: resolveSentBy(),
    };

    try {
      const result = await this.store.putFile(filePath, JSON.stringify(record, null, 2), `Record sent: ${company} <${email}>`);
      console.log(`✅ SharedLedger: recorded sent email for ${email}`);
      return { recorded: true, path: result.path };
    } catch (err) {
      console.error(`❌ SharedLedger: failed to record sent for "${email}": ${err.message}`);
      return { recorded: false, reason: `record-failed: ${err.message}` };
    }
  }
}

/**
 * Resolve the identity to record as the sender.
 * @returns {string}
 */
function resolveSentBy() {
  return process.env.SENDER_EMAIL || process.env.USER || process.env.USERNAME || 'unknown';
}

/** Print the "GitHub not configured" warning at most once per process. */
function warnOnce() {
  if (hasWarnedNotConfigured) return;
  hasWarnedNotConfigured = true;
  console.warn('⚠️ SharedLedger: GITHUB_TOKEN/SITES_REPO not configured — skipping shared duplicate-send check');
}
