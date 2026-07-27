#!/usr/bin/env node

import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApprovalQueue } from './approval-queue.js';
import { StateManager } from './state-manager.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DashboardServer {
  constructor() {
    this.port = parseInt(process.env.DASHBOARD_PORT || '4000', 10);
    this.host = '127.0.0.1';
    this.approvalQueue = new ApprovalQueue();
    this.stateManager = new StateManager();
    this.app = express();
    this.server = null;
  }

  async initialize() {
    console.log('🖥️  Initializing SAOS Dashboard Server...');

    await this.stateManager.initialize();
    await this.approvalQueue.initialize();

    this.setupRoutes();

    console.log('✅ Dashboard server initialized');
  }

  setupRoutes() {
    const app = this.app;

    app.use(express.json());

    // Static UI
    app.use('/', express.static(path.join(__dirname, 'dashboard')));

    app.get('/api/stats', async (req, res) => {
      try {
        const queue = await this.approvalQueue.getStats();
        const weekly = await this.stateManager.getWeeklyStats();
        res.json({ queue, weekly });
      } catch (error) {
        console.error('❌ Error building /api/stats:', error.message);
        res.status(500).json({ error: error.message });
      }
    });

    app.get('/api/queue', async (req, res) => {
      try {
        const rows = await this.approvalQueue.getAll();
        const items = rows.map((row) => ({
          ...row,
          qa_report: parseQaReport(row.qa_report)
        }));
        res.json(items);
      } catch (error) {
        console.error('❌ Error building /api/queue:', error.message);
        res.status(500).json({ error: error.message });
      }
    });

    app.get('/api/queue/:id/preview', async (req, res) => {
      try {
        const item = await this.approvalQueue.getById(req.params.id);
        if (!item) {
          res.status(404).send('Not found');
          return;
        }

        const html = await this.resolvePreviewHtml(item);
        if (!html) {
          res.status(404).send('Preview not found');
          return;
        }

        res.set('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
      } catch (error) {
        console.error('❌ Error building preview:', error.message);
        res.status(500).json({ error: error.message });
      }
    });

    app.post('/api/queue/:id/approve', async (req, res) => {
      try {
        await this.approvalQueue.approve(req.params.id, req.body?.notes || '');
        res.json({ ok: true, status: 'approved' });
      } catch (error) {
        console.error('❌ Error approving item:', error.message);
        res.status(500).json({ error: error.message });
      }
    });

    app.post('/api/queue/:id/reject', async (req, res) => {
      try {
        await this.approvalQueue.reject(req.params.id, req.body?.reason || '');
        res.json({ ok: true, status: 'rejected' });
      } catch (error) {
        console.error('❌ Error rejecting item:', error.message);
        res.status(500).json({ error: error.message });
      }
    });
  }

  /**
   * Resolve the HTML to preview for a queue item: prefer the locally saved
   * deployment file derived from demo_url, fall back to the website_data
   * column's embedded HTML.
   * @param {Object} item - full approval_queue row (from getById)
   * @returns {Promise<string|null>}
   */
  async resolvePreviewHtml(item) {
    const localPath = this.deriveLocalHtmlPath(item.demo_url);
    if (localPath) {
      try {
        return await fs.readFile(localPath, 'utf-8');
      } catch {
        // fall through to website_data
      }
    }

    if (item.website_data) {
      try {
        const parsed = JSON.parse(item.website_data);
        if (parsed && typeof parsed.html === 'string') {
          return parsed.html;
        }
      } catch {
        // website_data wasn't valid JSON — nothing more we can do
      }
    }

    return null;
  }

  /**
   * demo_url is saved as a path relative to the CRM's agent-drafts folder,
   * e.g. "agent-drafts/<site-name>/index.html" (see WebsiteGenerator.deployToNetlify).
   * @param {string} demoUrl
   * @returns {string|null}
   */
  deriveLocalHtmlPath(demoUrl) {
    if (!demoUrl || demoUrl.startsWith('http://') || demoUrl.startsWith('https://')) {
      return null;
    }

    const crmDir = path.join(__dirname, '../../crm');
    const resolved = path.resolve(crmDir, demoUrl);

    // demo_url comes from the DB; keep it inside the CRM folder.
    const rel = path.relative(path.resolve(crmDir), resolved);
    if (rel.startsWith('..') || path.isAbsolute(rel)) return null;

    return resolved;
  }

  async start() {
    await this.initialize();

    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, this.host, () => {
        console.log(`🚀 Dashboard running at http://${this.host}:${this.port}`);
        resolve();
      });
    });
  }

  async stop() {
    if (this.server) {
      await new Promise((resolve) => this.server.close(resolve));
    }
  }
}

/**
 * Parse a qa_report column value (JSON string or null) into an object.
 * @param {string|null} raw
 * @returns {Object|null}
 */
function parseQaReport(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Start the dashboard server
const isCliMain =
  !!process.argv[1] &&
  path.resolve(__filename).toLowerCase() === path.resolve(process.argv[1]).toLowerCase();

if (isCliMain) {
  const dashboard = new DashboardServer();

  dashboard.start().catch((error) => {
    console.error('❌ Failed to start dashboard server:', error);
    process.exit(1);
  });

  process.on('SIGINT', async () => {
    console.log('\n\n👋 Shutting down dashboard server...');
    await dashboard.stop();
    process.exit(0);
  });
}

export { DashboardServer };
