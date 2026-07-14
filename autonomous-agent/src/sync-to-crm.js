#!/usr/bin/env node

/**
 * Syncs agent drafts to CRM
 * Reads from approval-queue.db and writes to a JSON file the CRM can read
 */

import sqlite3 from 'sqlite3';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = './data/approval-queue.db';

async function syncToCRM() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                reject(err);
                return;
            }

            db.all('SELECT * FROM approval_queue ORDER BY created_at DESC', async (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    // Use absolute path to CRM folder
                    const homeDir = process.env.HOME || process.env.USERPROFILE;
                    const outputFile = path.join(homeDir, 'Desktop', 'SAOS Studio', 'crm', 'agent-drafts.json');

                    await fs.writeFile(outputFile, JSON.stringify(rows, null, 2));
                    console.log(`✅ Synced ${rows.length} drafts to CRM`);
                    console.log(`   📄 ${outputFile}`);
                    resolve(rows);
                } catch (writeErr) {
                    reject(writeErr);
                } finally {
                    db.close();
                }
            });
        });
    });
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    syncToCRM().catch(console.error);
}

export { syncToCRM };
