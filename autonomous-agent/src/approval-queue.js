import sqlite3 from 'sqlite3';
import { promisify } from 'util';

export class ApprovalQueue {
  constructor() {
    this.dbPath = './data/approval-queue.db';
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
          CREATE TABLE IF NOT EXISTS approval_queue (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lead_id TEXT,
            company TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            website_url TEXT,
            demo_url TEXT NOT NULL,
            website_data TEXT,
            status TEXT NOT NULL,
            notes TEXT,
            error_message TEXT,
            created_at TEXT NOT NULL,
            approved_at TEXT,
            sent_at TEXT,
            updated_at TEXT
          )
        `, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('✅ Approval queue database initialized');
            resolve();
          }
        });
      });
    });
  }

  async addToQueue(item) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO approval_queue
        (lead_id, company, email, phone, website_url, demo_url, website_data, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        item.leadId,
        item.company,
        item.email,
        item.phone,
        item.websiteUrl,
        item.demoUrl,
        JSON.stringify(item.websiteData),
        item.status,
        item.createdAt,
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );

      stmt.finalize();
    });
  }

  async getPendingApproval() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM approval_queue WHERE status = 'pending_approval' ORDER BY created_at DESC`,
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

  async getApproved() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM approval_queue WHERE status = 'approved' ORDER BY approved_at ASC`,
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

  async approve(id, notes = '') {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE approval_queue SET status = 'approved', notes = ?, approved_at = ?, updated_at = ? WHERE id = ?`,
        [notes, new Date().toISOString(), new Date().toISOString(), id],
        (err) => {
          if (err) {
            reject(err);
          } else {
            console.log(`✅ Website #${id} approved`);
            resolve();
          }
        }
      );
    });
  }

  async reject(id, reason = '') {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE approval_queue SET status = 'rejected', error_message = ?, updated_at = ? WHERE id = ?`,
        [reason, new Date().toISOString(), id],
        (err) => {
          if (err) {
            reject(err);
          } else {
            console.log(`❌ Website #${id} rejected`);
            resolve();
          }
        }
      );
    });
  }

  async markAsSent(id) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE approval_queue SET status = 'sent', sent_at = ?, updated_at = ? WHERE id = ?`,
        [new Date().toISOString(), new Date().toISOString(), id],
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

  async markAsFailed(id, errorMessage) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE approval_queue SET status = 'failed', error_message = ?, updated_at = ? WHERE id = ?`,
        [errorMessage, new Date().toISOString(), id],
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

  async addReply(reply) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE approval_queue SET status = 'replied', updated_at = ? WHERE email = ?`,
        [new Date().toISOString(), reply.from],
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

  async getStats() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT
          status,
          COUNT(*) as count
         FROM approval_queue
         GROUP BY status`,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const stats = {};
            rows.forEach(row => {
              stats[row.status] = row.count;
            });
            resolve(stats);
          }
        }
      );
    });
  }
}
