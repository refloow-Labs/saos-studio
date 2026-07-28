/**
 * GitHub Store
 * Thin client over the GitHub Contents API (no local clone / git CLI).
 * Used as the single shared coordination layer across every PC running the
 * agent: it lets us check whether a file already exists in a shared repo
 * and read/write small JSON/HTML files there.
 */

import fetch from 'node-fetch';

const API_BASE = 'https://api.github.com';
const REPO_RE = /^[\w.-]+\/[\w.-]+$/;
const RETRY_DELAYS_MS = [500, 1500];

export class GitHubStore {
  /**
   * @param {Object} [options]
   * @param {string} [options.token] - overrides GITHUB_TOKEN
   * @param {string} [options.repo] - overrides SITES_REPO ("owner/name")
   * @param {string} [options.branch] - overrides SITES_BRANCH (default 'main')
   * @param {Function} [options.fetchImpl] - overrides node-fetch, for testability
   */
  constructor(options = {}) {
    this.token = options.token ?? process.env.GITHUB_TOKEN;
    this.repo = options.repo ?? process.env.SITES_REPO;
    this.branch = options.branch ?? process.env.SITES_BRANCH ?? 'main';
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  /** @returns {boolean} true only if both token and repo are set and repo looks like "owner/name" */
  isConfigured() {
    return !!(this.token && this.repo && REPO_RE.test(this.repo));
  }

  /**
   * @param {string} filePath - repo-relative path
   * @returns {boolean} true if the file exists, false on a clean 404
   */
  async exists(filePath) {
    try {
      await this._getContents(filePath);
      return true;
    } catch (err) {
      if (err.notFound) return false;
      throw err;
    }
  }

  /**
   * @param {string} filePath - repo-relative path
   * @returns {Promise<Object|null>} parsed JSON content, or null on a clean 404
   */
  async getJson(filePath) {
    let entry;
    try {
      entry = await this._getContents(filePath);
    } catch (err) {
      if (err.notFound) return null;
      throw err;
    }
    const raw = Buffer.from(entry.content, entry.encoding || 'base64').toString('utf8');
    return JSON.parse(raw);
  }

  /**
   * Create or update a file. Fetches the existing sha first so updates
   * don't get rejected by GitHub.
   * @param {string} filePath - repo-relative path
   * @param {string} content - utf8 file content
   * @param {string} message - commit message
   * @returns {Promise<{path: string, htmlUrl: string, sha: string, created: boolean}>}
   */
  async putFile(filePath, content, message) {
    const safePath = normalizePath(filePath);
    let existingSha = null;
    try {
      const existing = await this._getContents(safePath);
      existingSha = existing.sha;
    } catch (err) {
      if (!err.notFound) throw err;
    }

    const created = !existingSha;
    const result = await this._put(safePath, content, message, existingSha);
    return {
      path: result.content?.path ?? safePath,
      htmlUrl: result.content?.html_url ?? null,
      sha: result.content?.sha ?? null,
      created,
    };
  }

  /**
   * @param {string} dirPath - repo-relative directory path
   * @returns {Promise<Array<{name: string, path: string, type: string}>>} [] if the directory doesn't exist (404)
   */
  async listDir(dirPath) {
    let entries;
    try {
      entries = await this._getContents(dirPath);
    } catch (err) {
      if (err.notFound) return [];
      throw err;
    }
    const list = Array.isArray(entries) ? entries : [entries];
    return list.map((e) => ({ name: e.name, path: e.path, type: e.type }));
  }

  /**
   * @returns {Promise<{ok: boolean, repo: string, canPush: boolean, reason?: string}>}
   */
  async checkAccess() {
    if (!this.isConfigured()) {
      return { ok: false, repo: this.repo ?? null, canPush: false, reason: 'GITHUB_TOKEN/SITES_REPO not configured' };
    }
    try {
      const data = await this._request(`/repos/${this.repo}`, { method: 'GET' });
      const canPush = !!(data && data.permissions && data.permissions.push);
      return { ok: true, repo: this.repo, canPush };
    } catch (err) {
      return { ok: false, repo: this.repo, canPush: false, reason: err.message };
    }
  }

  /**
   * GET the Contents API entry (or array of entries for a directory) for a path.
   * @private
   */
  async _getContents(filePath) {
    const safePath = normalizePath(filePath);
    return this._request(`/repos/${this.repo}/contents/${encodePath(safePath)}?ref=${encodeURIComponent(this.branch)}`, {
      method: 'GET',
    });
  }

  /**
   * PUT (create/update) a file's contents. Retries once on a 409 sha conflict
   * by re-fetching the current sha and trying again.
   * @private
   */
  async _put(filePath, content, message, sha) {
    const body = {
      message,
      content: Buffer.from(content, 'utf8').toString('base64'),
      branch: this.branch,
    };
    if (sha) body.sha = sha;

    try {
      return await this._request(`/repos/${this.repo}/contents/${encodePath(filePath)}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
    } catch (err) {
      if (err.status === 409) {
        let freshSha = null;
        try {
          const existing = await this._getContents(filePath);
          freshSha = existing.sha;
        } catch (refetchErr) {
          if (!refetchErr.notFound) {
            throw new Error(`GitHubStore: sha conflict on "${filePath}" and re-fetch failed: ${refetchErr.message}`);
          }
        }
        try {
          return await this._request(`/repos/${this.repo}/contents/${encodePath(filePath)}`, {
            method: 'PUT',
            body: JSON.stringify({ ...body, sha: freshSha ?? undefined }),
          });
        } catch (retryErr) {
          throw new Error(`GitHubStore: sha conflict on "${filePath}" persisted after re-fetch+retry: ${retryErr.message}`);
        }
      }
      throw err;
    }
  }

  /**
   * Low-level request with auth headers, 404→notFound marking, and a small
   * retry for 5xx/network errors (never for other 4xx).
   * @private
   */
  async _request(pathAndQuery, { method, body } = {}) {
    if (!this.isConfigured()) {
      throw new Error('GitHubStore: not configured (missing GITHUB_TOKEN or SITES_REPO)');
    }

    const url = `${API_BASE}${pathAndQuery}`;
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'saos-autonomous-agent',
    };
    if (body) headers['Content-Type'] = 'application/json';

    let lastError;
    for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
      let response;
      try {
        response = await this.fetchImpl(url, { method, headers, body });
      } catch (networkErr) {
        lastError = networkErr;
        if (attempt < RETRY_DELAYS_MS.length) {
          await sleep(RETRY_DELAYS_MS[attempt]);
          continue;
        }
        throw new Error(`GitHubStore: network error calling ${method} ${pathAndQuery}: ${networkErr.message}`);
      }

      if (response.status === 404) {
        const err = new Error(`GitHubStore: not found — ${method} ${pathAndQuery}`);
        err.notFound = true;
        err.status = 404;
        throw err;
      }

      if (response.status === 401) {
        throw new Error('GitHubStore: request rejected (401) — GITHUB_TOKEN is invalid or expired');
      }
      if (response.status === 403) {
        const remaining = response.headers.get('x-ratelimit-remaining');
        if (remaining === '0') {
          throw new Error('GitHubStore: request rejected (403) — GitHub API rate limit exceeded');
        }
        throw new Error('GitHubStore: request rejected (403) — GITHUB_TOKEN lacks permission for this repo');
      }
      if (response.status === 409) {
        const err = new Error(`GitHubStore: sha conflict (409) — ${method} ${pathAndQuery}`);
        err.status = 409;
        throw err;
      }

      if (response.status >= 500) {
        lastError = new Error(`GitHubStore: server error ${response.status} calling ${method} ${pathAndQuery}`);
        if (attempt < RETRY_DELAYS_MS.length) {
          await sleep(RETRY_DELAYS_MS[attempt]);
          continue;
        }
        throw lastError;
      }

      if (!response.ok) {
        let detail = response.statusText;
        try {
          const errBody = await response.json();
          detail = errBody.message || detail;
        } catch {
          // ignore — keep statusText
        }
        throw new Error(`GitHubStore: request failed (${response.status}) calling ${method} ${pathAndQuery}: ${detail}`);
      }

      if (response.status === 204) return null;
      return await response.json();
    }

    throw lastError ?? new Error(`GitHubStore: request failed calling ${method} ${pathAndQuery}`);
  }
}

/**
 * Reject leading '/' and '..' path segments; return the path unchanged otherwise.
 * @param {string} filePath
 * @returns {string}
 */
function normalizePath(filePath) {
  const p = String(filePath ?? '');
  if (p.startsWith('/')) {
    throw new Error(`GitHubStore: path must not start with "/": "${p}"`);
  }
  const segments = p.split('/');
  if (segments.some((seg) => seg === '..' || seg === '.')) {
    throw new Error(`GitHubStore: path must not contain "." or ".." segments: "${p}"`);
  }
  return p;
}

/**
 * URL-encode each path segment individually (preserving the '/' separators).
 * @param {string} filePath
 * @returns {string}
 */
function encodePath(filePath) {
  return filePath.split('/').map(encodeURIComponent).join('/');
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
