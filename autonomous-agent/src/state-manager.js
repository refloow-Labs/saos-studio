import sqlite3 from 'sqlite3';

export class StateManager {
  constructor() {
    this.dbPath = './data/agent-state.db';
    this.db = null;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }

        this.db.run(`
          CREATE TABLE IF NOT EXISTS daily_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL UNIQUE,
            websites_generated INTEGER DEFAULT 0,
            emails_sent INTEGER DEFAULT 0,
            replies_received INTEGER DEFAULT 0,
            created_at TEXT NOT NULL
          )
        `, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('✅ State manager database initialized');
            resolve();
          }
        });
      });
    });
  }

  async getTodayWebsiteCount() {
    const today = new Date().toISOString().split('T')[0];

    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT websites_generated FROM daily_stats WHERE date = ?`,
        [today],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row ? row.websites_generated : 0);
          }
        }
      );
    });
  }

  async incrementWebsiteCount() {
    const today = new Date().toISOString().split('T')[0];

    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO daily_stats (date, websites_generated, created_at)
         VALUES (?, 1, ?)
         ON CONFLICT(date) DO UPDATE SET websites_generated = websites_generated + 1`,
        [today, new Date().toISOString()],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async incrementEmailCount() {
    const today = new Date().toISOString().split('T')[0];

    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO daily_stats (date, emails_sent, created_at)
         VALUES (?, 1, ?)
         ON CONFLICT(date) DO UPDATE SET emails_sent = emails_sent + 1`,
        [today, new Date().toISOString()],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async getWeeklyStats() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM daily_stats
         WHERE date >= date('now', '-7 days')
         ORDER BY date DESC`,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
}
