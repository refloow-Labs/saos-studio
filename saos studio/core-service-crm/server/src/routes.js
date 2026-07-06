import { Router } from 'express';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  listBusinesses, getBusiness, insertBusiness, updateBusiness,
  getAssets, addAsset, createProject, updateProject, getProject, listProjects,
  countByStatus, logActivity, recentActivities
} from './db.js';
import { extractAll, searchGoogleMaps } from './scraper.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
let config = {};
try {
  config = JSON.parse(readFileSync(join(__dirname, '../config.json'), 'utf-8'));
} catch (e) {
  config = { serpapi: { apiKey: '' } };
}

const router = Router();

// ── Dashboard ──
router.get('/stats', (req, res) => {
  const statusCounts = countByStatus();
  const projects = listProjects();
  const recent = recentActivities(10);
  res.json({ statusCounts, projectsTotal: projects.length, recent });
});

// ── Businesses ──
router.get('/businesses', (req, res) => {
  const { status, city, search, limit, offset } = req.query;
  const rows = listBusinesses({ status, city, search, limit: limit ? parseInt(limit) : 100, offset: offset ? parseInt(offset) : 0 });
  res.json(rows);
});

router.get('/businesses/:id', (req, res) => {
  const b = getBusiness(req.params.id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  const assets = getAssets(b.id);
  const projects = listProjects(b.id);
  res.json({ ...b, assets, projects });
});

router.post('/businesses', (req, res) => {
  const id = insertBusiness(req.body);
  logActivity('business', `Added business ${req.body.name}`, { businessId: id });
  res.json({ id });
});

router.patch('/businesses/:id', (req, res) => {
  updateBusiness(req.params.id, req.body);
  res.json({ success: true });
});

// ── Google Maps Import ──
router.post('/import/gmaps', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'query required' });
  try {
    const leads = await searchGoogleMaps(query, config);
    let added = 0, skipped = 0;
    for (const lead of leads) {
      // simple duplicate guard by website
      const existing = listBusinesses({ search: lead.website });
      if (existing.length > 0 && existing.some(b => b.website === lead.website)) { skipped++; continue; }
      insertBusiness({ ...lead, status: lead.website ? 'new' : 'no-website' });
      added++;
    }
    logActivity('import', `Imported ${added} from Google Maps: ${query}`, { added, skipped });
    res.json({ added, skipped, total: leads.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Scraping ──
router.post('/businesses/:id/scrape', async (req, res) => {
  const b = getBusiness(req.params.id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  try {
    const result = await extractAll(b);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Assets ──
router.get('/businesses/:id/assets', (req, res) => {
  const rows = getAssets(req.params.id, req.query.type);
  res.json(rows);
});

router.post('/businesses/:id/assets', (req, res) => {
  const id = addAsset({ businessId: req.params.id, ...req.body });
  res.json({ id });
});

// ── Projects ──
router.get('/projects', (req, res) => {
  res.json(listProjects(req.query.businessId));
});

router.get('/projects/:id', (req, res) => {
  const p = getProject(req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

router.post('/projects', (req, res) => {
  const id = createProject(req.body);
  logActivity('project', `Created project ${req.body.name}`, { projectId: id });
  res.json({ id });
});

router.patch('/projects/:id', (req, res) => {
  updateProject(req.params.id, req.body);
  res.json({ success: true });
});

// ── Prompt Builder ──
router.post('/prompt/build', (req, res) => {
  const { businessId, vibe, extraNotes, includeScreenshots } = req.body;
  const b = getBusiness(businessId);
  if (!b) return res.status(404).json({ error: 'Business not found' });
  const assets = getAssets(businessId);
  const meta = assets.filter(a => a.type === 'meta');
  const colors = assets.filter(a => a.type === 'color').map(a => a.data);
  const logo = assets.find(a => a.type === 'logo');

  const title = meta.find(m => m.label === 'Title')?.data || b.name;
  const description = meta.find(m => m.label === 'Description')?.data || '';

  let prompt = `Recreate the website for "${b.name}" as a premium, immersive 3D animated web experience.\n\n`;
  prompt += `BUSINESS INFO:\n- Name: ${b.name}\n- Category: ${b.category || 'local business'}\n- City: ${b.city || ''}\n`;
  prompt += `- Current tagline: ${title}\n- Current description: ${description}\n`;
  if (colors.length) prompt += `- Brand colors detected: ${colors.join(', ')}\n`;
  if (logo) prompt += `- Logo reference: ${logo.url}\n`;
  prompt += `\nDESIGN DIRECTION:\n`;
  prompt += vibe || 'Modern, cinematic, bold typography, smooth scroll-triggered 3D transitions, WebGL accents.';
  prompt += `\n\nTECH STACK:\nNext.js or Vite + React, Three.js / React Three Fiber for 3D elements, GSAP for animations, Tailwind CSS.\n`;
  prompt += `\nMUST KEEP:\n- All original business info, contact details, and key offerings.\n`;
  if (extraNotes) prompt += `\nEXTRA NOTES:\n${extraNotes}\n`;
  if (includeScreenshots) {
    const screens = assets.filter(a => a.type === 'screenshot');
    if (screens.length) prompt += `\nREFERENCE SCREENSHOTS:\n${screens.map(s => s.url).join('\n')}\n`;
  }
  prompt += `\nOUTPUT: A single-file or small multi-file deployable site ready for Vercel. Responsive. Performance optimized.`;

  res.json({ prompt, meta: { name: b.name, colors, logo: logo?.url } });
});

// ── Activities ──
router.get('/activities', (req, res) => {
  res.json(recentActivities(req.query.limit ? parseInt(req.query.limit) : 50));
});

export default router;
