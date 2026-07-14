import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class LeadsManager {
  constructor() {
    // Use CRM leads data from crm/leads-no-website.json
    this.leadsPath = path.join(__dirname, '../../crm/leads-no-website.json');
    this.leads = [];
    this.processedLeads = new Set();
  }

  async loadLeads() {
    console.log('📂 Loading leads from CRM data...');

    try {
      const content = await fs.readFile(this.leadsPath, 'utf-8');
      const leadsData = JSON.parse(content);

      // Handle both array and object formats
      this.leads = Array.isArray(leadsData) ? leadsData : Object.values(leadsData);

      // Ensure each lead has an ID
      this.leads = this.leads.map((lead, index) => ({
        id: lead.id || index + 1,
        ...lead
      }));

      console.log(`✅ Loaded ${this.leads.length} leads from CRM`);

    } catch (error) {
      console.error('❌ Failed to load leads:', error.message);
      console.log('   ℹ️  Will try to use demo data instead...');

      // Fallback to demo data if CRM file doesn't exist
      this.leads = this.createDemoLeads();
      console.log(`✅ Using ${this.leads.length} demo leads`);
    }
  }

  /**
   * Create demo leads for testing
   */
  createDemoLeads() {
    return [
      {
        id: 1,
        Company: 'Taverna Yannis',
        'NACE 2 Desc': 'Restaurant - Traditional Greek Cuisine',
        'Περιοχή': 'Santorini',
        Email: 'info@tavernayannis.gr',
        'Τηλέφωνο': '+30 2286 012345',
        'Ιστοσελίδα Εταιρίας': '',
      },
      {
        id: 2,
        Company: 'Aegean Luxury Suites',
        'NACE 2 Desc': 'Hotels and similar accommodation',
        'Περιοχή': 'Mykonos',
        Email: 'reservations@aegeanluxury.gr',
        'Τηλέφωνο': '+30 2289 023456',
        'Ιστοσελίδα Εταιρίας': '',
      },
      {
        id: 3,
        Company: 'Athens Medical Center',
        'NACE 2 Desc': 'General medical practice activities',
        'Περιοχή': 'Athens',
        Email: 'info@athensmedical.gr',
        'Τηλέφωνο': '+30 210 3456789',
        'Ιστοσελίδα Εταιρίας': '',
      },
    ];
  }

  async getNextLeads(count) {
    const availableLeads = this.leads.filter(lead => {
      // Filter criteria:
      // 1. Not already processed
      // 2. Has a valid email
      // 3. Either has no website or a placeholder website
      return (
        !this.processedLeads.has(lead.id) &&
        lead.Email &&
        lead.Email.includes('@') &&
        (!lead['Ιστοσελίδα Εταιρίας'] ||
         lead['Ιστοσελίδα Εταιρίας'].includes('cloudflare') ||
         lead['Ιστοσελίδα Εταιρίας'] === '')
      );
    });

    const selectedLeads = availableLeads.slice(0, count);

    // Mark as processed
    selectedLeads.forEach(lead => {
      this.processedLeads.add(lead.id);
    });

    return selectedLeads;
  }

  async markLeadAsFailed(leadId, reason) {
    console.log(`  ⚠️  Lead #${leadId} marked as failed: ${reason}`);
    // In a production system, you'd log this to a database
  }

  getStats() {
    return {
      total: this.leads.length,
      processed: this.processedLeads.size,
      remaining: this.leads.length - this.processedLeads.size
    };
  }
}
