import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DB_PATH = join(ROOT, 'data', 'leads.json');
const LOG_PATH = join(ROOT, 'data', 'activity.log');

async function ensureDir(p) {
  const d = dirname(p);
  if (!existsSync(d)) await mkdir(d, { recursive: true });
}

export async function getDB() {
  await ensureDir(DB_PATH);
  if (!existsSync(DB_PATH)) return { leads: [], emailsSent: 0, emailsSentToday: 0, lastResetDate: new Date().toISOString().slice(0,10) };
  const raw = await readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

export async function saveDB(db) {
  await ensureDir(DB_PATH);
  await writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

export function generateId() {
  return 'lead_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export async function addLead(lead) {
  const db = await getDB();
  // Check for duplicate by phone or website
  const dup = db.leads.find(l => l.phone === lead.phone || (l.website && l.website === lead.website));
  if (dup) return { success: false, existing: dup };
  lead.id = generateId();
  lead.createdAt = new Date().toISOString();
  lead.status = lead.status || 'new';
  lead.score = lead.score || 0;
  db.leads.push(lead);
  await saveDB(db);
  await logActivity(`Added lead: ${lead.name} (${lead.id})`);
  return { success: true, lead };
}

export async function updateLead(id, updates) {
  const db = await getDB();
  const idx = db.leads.findIndex(l => l.id === id);
  if (idx === -1) return null;
  db.leads[idx] = { ...db.leads[idx], ...updates, updatedAt: new Date().toISOString() };
  await saveDB(db);
  return db.leads[idx];
}

export async function getLead(id) {
  const db = await getDB();
  return db.leads.find(l => l.id === id) || null;
}

export async function listLeads(filter = {}) {
  const db = await getDB();
  let leads = db.leads;
  if (filter.status) leads = leads.filter(l => l.status === filter.status);
  if (filter.minScore) leads = leads.filter(l => (l.score || 0) >= filter.minScore);
  if (filter.city) leads = leads.filter(l => (l.city || '').toLowerCase().includes(filter.city.toLowerCase()));
  if (filter.limit) leads = leads.slice(0, filter.limit);
  return leads;
}

export async function logActivity(msg) {
  await ensureDir(LOG_PATH);
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  await writeFile(LOG_PATH, line, { flag: 'a' });
}

export async function incrementEmailCount() {
  const db = await getDB();
  const today = new Date().toISOString().slice(0,10);
  if (db.lastResetDate !== today) {
    db.emailsSentToday = 0;
    db.lastResetDate = today;
  }
  db.emailsSentToday++;
  db.emailsSent++;
  await saveDB(db);
  return db.emailsSentToday;
}
