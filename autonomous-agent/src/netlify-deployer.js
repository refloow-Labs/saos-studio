/**
 * Netlify Deployer
 * Thin client over the Netlify REST API for the "one site per client" deploy
 * flow: find-or-create the site, create a digest-based deploy, upload the
 * HTML only if Netlify says it's missing, then poll until the deploy is
 * ready. Used so outreach emails can embed a real, public https:// URL
 * instead of a local CRM path.
 */

import fetch from 'node-fetch';
import crypto from 'crypto';

const API_BASE = 'https://api.netlify.com/api/v1';
const RETRY_DELAYS_MS = [1000, 3000];
const POLL_INTERVAL_MS = 2000;

// Print the "not configured" warning at most once per process so a batch
// run doesn't spam the console.
let hasWarnedNotConfigured = false;

export class NetlifyDeployer {
  /**
   * @param {Object} [options]
   * @param {string} [options.token] - overrides NETLIFY_ACCESS_TOKEN
   * @param {Function} [options.fetchImpl] - overrides node-fetch, for testability
   * @param {number} [options.timeoutMs] - max time to poll a deploy for readiness (default 120000)
   */
  constructor(options = {}) {
    this.token = options.token ?? process.env.NETLIFY_ACCESS_TOKEN;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.timeoutMs = options.timeoutMs ?? 120000;
  }

  /** @returns {boolean} true only if a non-empty token is set */
  isConfigured() {
    return typeof this.token === 'string' && this.token.trim().length > 0;
  }

  /**
   * Read-only credential check (used by `npm run doctor`). Never throws.
   * @returns {Promise<{ok: boolean, email?: string, reason?: string}>}
   */
  async checkAccess() {
    if (!this.isConfigured()) {
      return { ok: false, reason: 'netlify-not-configured' };
    }
    try {
      const data = await this._request('/user', { method: 'GET' });
      return { ok: true, email: data?.email };
    } catch (err) {
      if (err && err.status === 401) {
        return { ok: false, reason: 'netlify-token-invalid' };
      }
      return { ok: false, reason: err?.message || 'unknown error' };
    }
  }

  /**
   * Deploy a single-file HTML site to Netlify. One Netlify site per client
   * (matched by slug), reused across re-deploys. Never throws for expected
   * failures (missing config, invalid token, network/5xx, deploy errors) —
   * only throws on programmer error (missing slug/html).
   * @param {Object} params
   * @param {string} params.slug - site slug, also used as the Netlify site name
   * @param {string} params.html - full HTML document to deploy as index.html
   * @param {string} [params.company] - for log messages only
   * @returns {Promise<{deployed: true, url: string, siteId: string, deployId: string, created: boolean}
   *                   |{deployed: false, reason: string}>}
   */
  async deploySite({ slug, html, company }) {
    if (!slug || !html) {
      throw new Error('NetlifyDeployer.deploySite requires both "slug" and "html"');
    }

    if (!this.isConfigured()) {
      warnNotConfiguredOnce();
      return { deployed: false, reason: 'netlify-not-configured' };
    }

    let site, created;
    try {
      ({ site, created } = await this.findOrCreateSite(slug));
    } catch (err) {
      return this._failure(err, 'find-or-create-site', company);
    }

    const sha1 = crypto.createHash('sha1').update(html, 'utf8').digest('hex');

    let deploy;
    try {
      deploy = await this._request(`/sites/${site.id}/deploys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: { '/index.html': sha1 } }),
      });
    } catch (err) {
      return this._failure(err, 'create-deploy', company);
    }

    if (Array.isArray(deploy.required) && deploy.required.includes(sha1)) {
      try {
        await this._request(`/deploys/${deploy.id}/files/index.html`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/octet-stream' },
          body: html,
        });
      } catch (err) {
        return this._failure(err, 'upload-file', company);
      }
    }

    let finalDeploy;
    try {
      finalDeploy = await this._pollDeploy(deploy.id);
    } catch (err) {
      return this._failure(err, 'poll-deploy', company);
    }

    const url = finalDeploy.ssl_url || finalDeploy.url || site.ssl_url || site.url;
    console.log(`🌐 NetlifyDeployer: deployed ${company || slug} → ${url}`);
    return { deployed: true, url, siteId: site.id, deployId: deploy.id, created };
  }

  /**
   * Find an existing Netlify site named `slug` (ours or, if not, create one).
   * @param {string} slug
   * @returns {Promise<{site: Object, created: boolean}>}
   * @private
   */
  async findOrCreateSite(slug) {
    try {
      const site = await this._request('/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: slug }),
      });
      return { site, created: true };
    } catch (err) {
      if (err.status !== 422) throw err;
    }

    // 422 = name already taken. It might be ours from a previous deploy —
    // look it up before assuming a collision with someone else's site.
    const existing = await this.findSiteByName(slug);
    if (existing) {
      return { site: existing, created: false };
    }

    // Genuinely taken by another Netlify account — disambiguate and retry once.
    const hash = crypto.createHash('sha1').update(slug).digest('hex').slice(0, 6);
    const altName = `${slug}-${hash}`;
    const site = await this._request('/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: altName }),
    });
    return { site, created: true };
  }

  /**
   * Paginate through this account's sites looking for an exact name match.
   * @param {string} slug
   * @returns {Promise<Object|null>}
   * @private
   */
  async findSiteByName(slug) {
    const perPage = 100;
    let page = 1;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const sites = await this._request(`/sites?per_page=${perPage}&page=${page}`, { method: 'GET' });
      const match = Array.isArray(sites) ? sites.find((s) => s.name === slug) : null;
      if (match) return match;
      if (!Array.isArray(sites) || sites.length < perPage) return null;
      page += 1;
    }
  }

  /**
   * Poll a deploy until it's ready, errored, or timeoutMs elapses.
   * @param {string} deployId
   * @returns {Promise<Object>} the ready deploy
   * @private
   */
  async _pollDeploy(deployId) {
    const start = Date.now();
    let lastState = null;

    while (Date.now() - start < this.timeoutMs) {
      const deploy = await this._request(`/deploys/${deployId}`, { method: 'GET' });

      if (deploy.state !== lastState) {
        console.log(`  ⏳ Netlify deploy ${deployId}: ${deploy.state}`);
        lastState = deploy.state;
      }

      if (deploy.state === 'ready') return deploy;
      if (deploy.state === 'error') {
        throw new Error(`deploy failed: ${deploy.error_message || 'unknown error'}`);
      }

      await sleep(POLL_INTERVAL_MS);
    }

    throw new Error(`timed out after ${this.timeoutMs}ms waiting for deploy ${deployId} to become ready`);
  }

  /**
   * Map a thrown error from `_request` into the public {deployed:false, reason} shape.
   * @private
   */
  _failure(err, context, company) {
    if (err && err.status === 401) {
      console.error(`❌ NetlifyDeployer: token invalid (401) — check NETLIFY_ACCESS_TOKEN${company ? ` (${company})` : ''}`);
      return { deployed: false, reason: 'netlify-token-invalid' };
    }
    console.warn(`⚠️ NetlifyDeployer: ${context} failed${company ? ` for ${company}` : ''}: ${err?.message || err}`);
    return { deployed: false, reason: `netlify-${context}-failed: ${err?.message || 'unknown error'}` };
  }

  /**
   * Low-level authenticated request. Retries on network error / 5xx
   * (1s, 3s), never for other 4xx. Throws on any non-2xx response or
   * exhausted network retries; the thrown Error carries `.status` when the
   * failure is HTTP-status-based (e.g. 401, 422).
   * @private
   */
  async _request(pathAndQuery, { method = 'GET', body, headers = {} } = {}) {
    const url = pathAndQuery.startsWith('http') ? pathAndQuery : `${API_BASE}${pathAndQuery}`;
    const reqHeaders = {
      'Authorization': `Bearer ${this.token}`,
      ...headers,
    };

    let lastError;
    for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
      let response;
      try {
        response = await this.fetchImpl(url, { method, headers: reqHeaders, body });
      } catch (networkErr) {
        lastError = networkErr;
        if (attempt < RETRY_DELAYS_MS.length) {
          await sleep(RETRY_DELAYS_MS[attempt]);
          continue;
        }
        throw new Error(`NetlifyDeployer: network error calling ${method} ${pathAndQuery}: ${networkErr.message}`);
      }

      if (response.status === 401) {
        throw Object.assign(
          new Error(`NetlifyDeployer: request rejected (401) — NETLIFY_ACCESS_TOKEN is invalid`),
          { status: 401 }
        );
      }

      if (response.status >= 500) {
        lastError = new Error(`NetlifyDeployer: server error ${response.status} calling ${method} ${pathAndQuery}`);
        if (attempt < RETRY_DELAYS_MS.length) {
          await sleep(RETRY_DELAYS_MS[attempt]);
          continue;
        }
        throw Object.assign(lastError, { status: response.status });
      }

      if (!response.ok) {
        let detail = response.statusText;
        try {
          const errBody = await response.json();
          detail = errBody.message || detail;
        } catch {
          // ignore — keep statusText
        }
        throw Object.assign(
          new Error(`NetlifyDeployer: request failed (${response.status}) calling ${method} ${pathAndQuery}: ${detail}`),
          { status: response.status }
        );
      }

      if (response.status === 204) return null;
      return await response.json();
    }

    throw lastError ?? new Error(`NetlifyDeployer: request failed calling ${method} ${pathAndQuery}`);
  }
}

/** Print the "NETLIFY_ACCESS_TOKEN not configured" warning at most once per process. */
function warnNotConfiguredOnce() {
  if (hasWarnedNotConfigured) return;
  hasWarnedNotConfigured = true;
  console.warn(
    '⚠️ NetlifyDeployer: NETLIFY_ACCESS_TOKEN not configured — skipping Netlify deploy ' +
    '(demo links will fall back to the local CRM path, which is not publicly reachable)'
  );
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
