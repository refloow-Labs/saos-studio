import { DatabaseSync } from 'node:sqlite';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../../data');
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(join(DATA_DIR, 'crm.db'));

// ── Schema ──
db.exec(`
  CREATE TABLE IF NOT EXISTS businesses (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    category    TEXT,
    address     TEXT,
    city        TEXT,
    phone       TEXT,
    email       TEXT,
    website     TEXT,
    gmbUrl      TEXT,
    rating      REAL,
    reviews     INTEGER,
    source      TEXT DEFAULT 'manual',
    status      TEXT DEFAULT 'new',
    score       INTEGER DEFAULT 0,
    notes       TEXT,
    createdAt   TEXT DEFAULT (datetime('now')),
    updatedAt   TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS assets (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    businessId  INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    type        TEXT NOT NULL,
    label       TEXT,
    url         TEXT,
    data        TEXT,
    extractedAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS projects (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    businessId  INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name        TEXT,
    prompt      TEXT,
    generatedUrl TEXT,
    deployedUrl  TEXT,
    vercelUrl   TEXT,
    status      TEXT DEFAULT 'draft',
    createdAt   TEXT DEFAULT (datetime('now')),
    updatedAt   TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS emails (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    businessId  INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    projectId   INTEGER REFERENCES projects(id) ON DELETE SET NULL,
    template    TEXT,
    subject     TEXT,
    body        TEXT,
    sentAt      TEXT,
    status      TEXT DEFAULT 'draft'
  );

  CREATE TABLE IF NOT EXISTS activities (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    type        TEXT,
    message     TEXT,
    meta        TEXT,
    createdAt   TEXT DEFAULT (datetime('now'))
  );
`);

// ── Helpers ──
function stmt(sql) { return db.prepare(sql); }

export function run(sql, params = {}) { return db.prepare(sql).run(params); }
export function all(sql, params = {}) { return db.prepare(sql).all(params); }
export function get(sql, params = {}) { return db.prepare(sql).get(params); }

export function insertBusiness(b) {
  const info = db.prepare(`
    INSERT INTO businesses (name, category, address, city, phone, email, website, gmbUrl, rating, reviews, source, status, score, notes)
    VALUES (:name, :category, :address, :city, :phone, :email, :website, :gmbUrl, :rating, :reviews, :source, :status, :score, :notes)
  `).run({
    name: b.name || '', category: b.category || '', address: b.address || '', city: b.city || '',
    phone: b.phone || '', email: b.email || '', website: b.website || '', gmbUrl: b.gmbUrl || '',
    rating: b.rating ?? null, reviews: b.reviews ?? null, source: b.source || 'manual',
    status: b.status || 'new', score: b.score || 0, notes: b.notes || ''
  });
  return info.lastInsertRowid;
}

export function updateBusiness(id, fields) {
  const keys = Object.keys(fields).filter(k => k !== 'id');
  if (!keys.length) return;
  const set = keys.map(k => `${k} = :${k}`).join(', ');
  db.prepare(`UPDATE businesses SET ${set}, updatedAt = datetime('now') WHERE id = :id`).run({ ...fields, id });
}

export function getBusiness(id) {
  return db.prepare('SELECT * FROM businesses WHERE id = ?').get(id);
}

export function listBusinesses({ status, city, search, limit = 100, offset = 0 } = {}) {
  let sql = 'SELECT * FROM businesses WHERE 1=1';
  const params = [];
  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (city) { sql += ' AND city LIKE ?'; params.push(`%${city}%`); }
  if (search) { sql += ' AND (name LIKE ? OR website LIKE ? OR city LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
  sql += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  return db.prepare(sql).all(...params);
}

export function countByStatus() {
  return db.prepare(`SELECT status, COUNT(*) as count FROM businesses GROUP BY status`).all();
}

export function addAsset(a) {
  const info = db.prepare(`INSERT INTO assets (businessId, type, label, url, data) VALUES (:businessId, :type, :label, :url, :data)`)
    .run({ businessId: a.businessId, type: a.type, label: a.label || '', url: a.url || '', data: a.data || '' });
  return info.lastInsertRowid;
}

export function getAssets(businessId, type) {
  let sql = 'SELECT * FROM assets WHERE businessId = ?';
  const params = [businessId];
  if (type) { sql += ' AND type = ?'; params.push(type); }
  sql += ' ORDER BY extractedAt DESC';
  return db.prepare(sql).all(...params);
}

export function deleteAssets(businessId, type) {
  db.prepare('DELETE FROM assets WHERE businessId = ? AND type = ?').run(businessId, type);
}

export function createProject(p) {
  const info = db.prepare(`INSERT INTO projects (businessId, name, prompt, status) VALUES (:businessId, :name, :prompt, :status)`)
    .run({ businessId: p.businessId, name: p.name || '', prompt: p.prompt || '', status: p.status || 'draft' });
  return info.lastInsertRowid;
}

export function updateProject(id, fields) {
  const keys = Object.keys(fields).filter(k => k !== 'id');
  if (!keys.length) return;
  const set = keys.map(k => `${k} = :${k}`).join(', ');
  db.prepare(`UPDATE projects SET ${set}, updatedAt = datetime('now') WHERE id = :id`).run({ ...fields, id });
}

export function getProject(id) {
  return db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
}

export function listProjects(businessId) {
  let sql = 'SELECT * FROM projects ORDER BY createdAt DESC';
  const params = [];
  if (businessId) { sql = 'SELECT * FROM projects WHERE businessId = ? ORDER BY createdAt DESC'; params.push(businessId); }
  return db.prepare(sql).all(...params);
}

export function logActivity(type, message, meta = {}) {
  db.prepare(`INSERT INTO activities (type, message, meta) VALUES (?, ?, ?)`).run(type, message, JSON.stringify(meta));
}

export function recentActivities(limit = 50) {
  return db.prepare('SELECT * FROM activities ORDER BY createdAt DESC LIMIT ?').all(limit);
}

export default db;
