/**
 * Site Publisher
 * Publishes generated single-file HTML sites to the shared GitHub sites repo
 * so that every PC running the agent can check "does a site already exist
 * for this company?" before generating a new one.
 */

import { GitHubStore } from './github-store.js';

// Print the "not configured" warning at most once per process so a 50-lead
// batch doesn't spam the console.
let hasWarnedNotConfigured = false;

export class SitePublisher {
  /**
   * @param {Object} [options]
   * @param {GitHubStore} [options.store] - inject a GitHubStore (e.g. for tests)
   */
  constructor(options = {}) {
    this.store = options.store ?? new GitHubStore(options);
  }

  /** @returns {boolean} whether GitHub is configured for publishing */
  isConfigured() {
    return this.store.isConfigured();
  }

  /**
   * @param {string} slug
   * @returns {Promise<boolean>} true if `sites/<slug>/index.html` already exists in the repo
   */
  async siteExists(slug) {
    if (!this.isConfigured()) {
      warnOnce();
      return false;
    }
    return this.store.exists(`sites/${slug}/index.html`);
  }

  /**
   * Publish a site's HTML and metadata to the shared repo. Never throws when
   * GitHub is not configured — returns { published: false, reason } instead.
   * @param {Object} params
   * @param {string} params.slug
   * @param {string} params.html
   * @param {string} params.company
   * @param {Object|null} [params.lead]
   * @param {number|null} [params.qaScore]
   * @param {string|null} [params.qaStatus]
   * @returns {Promise<{published: boolean, path?: string, htmlUrl?: string, reason?: string}>}
   */
  async publishSite({ slug, html, company, lead = null, qaScore = null, qaStatus = null }) {
    if (!this.isConfigured()) {
      warnOnce();
      return { published: false, reason: 'github-not-configured' };
    }

    const htmlPath = `sites/${slug}/index.html`;
    const metaPath = `sites/${slug}/meta.json`;

    let existed;
    try {
      existed = await this.store.exists(htmlPath);
    } catch (err) {
      console.error(`❌ SitePublisher: failed to check existing site for "${slug}": ${err.message}`);
      return { published: false, reason: `check-failed: ${err.message}` };
    }

    const commitVerb = existed ? 'Update' : 'Add';
    const commitMessage = `${commitVerb} site: ${company} (${slug})`;

    try {
      const htmlResult = await this.store.putFile(htmlPath, html, commitMessage);

      const meta = {
        slug,
        company,
        industry: lead?.industry ?? lead?.Industry ?? lead?.['NACE 2 Desc'] ?? null,
        location: lead?.location ?? lead?.Location ?? lead?.City ?? null,
        email: lead?.email ?? lead?.Email ?? null,
        publishedAt: new Date().toISOString(),
        publishedBy: resolvePublishedBy(),
        qaScore,
        qaStatus,
      };
      await this.store.putFile(metaPath, JSON.stringify(meta, null, 2), commitMessage);

      console.log(`✅ SitePublisher: published ${company} → ${htmlResult.path}`);
      return { published: true, path: htmlResult.path, htmlUrl: htmlResult.htmlUrl };
    } catch (err) {
      console.error(`❌ SitePublisher: failed to publish "${slug}": ${err.message}`);
      return { published: false, reason: `publish-failed: ${err.message}` };
    }
  }
}

/**
 * Resolve the identity to record as the publisher of a site.
 * @returns {string}
 */
function resolvePublishedBy() {
  return process.env.SENDER_EMAIL || process.env.USER || process.env.USERNAME || 'unknown';
}

/** Print the "GitHub not configured" warning at most once per process. */
function warnOnce() {
  if (hasWarnedNotConfigured) return;
  hasWarnedNotConfigured = true;
  console.warn('⚠️ SitePublisher: GITHUB_TOKEN/SITES_REPO not configured — skipping shared site-exists check/publish');
}
