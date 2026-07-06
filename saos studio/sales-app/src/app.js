#!/usr/bin/env node
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { searchGoogleMaps, importLeads } from './scraper.js';
import { analyzeWebsite } from './analyzer.js';
import { generateDraft } from './drafter.js';
import { sendEmail, listTemplates } from './mailer.js';
import { addLead, listLeads, getDB, updateLead } from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

let config = {};
try {
  config = JSON.parse(await readFile(join(ROOT, 'config.json'), 'utf-8'));
} catch (e) {
  console.log('⚠️  config.json missing or invalid');
}

const args = process.argv.slice(2);
const cmd = args[0];
const flags = parseFlags(args.slice(1));

function parseFlags(arr) {
  const f = {};
  for (const a of arr) {
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      f[k] = v ?? true;
    }
  }
  return f;
}

function printHelp() {
  console.log(`
SAOS Sales Agent — Your automated lead machine

Commands:
  search "query" --city=City      Search Google Maps for leads
  add                             Interactive: add a lead manually
  analyze --lead=ID               Analyze a lead's website quality
  draft --lead=ID                 Generate AI website draft
  email --lead=ID --template=NAME Send cold email (templates: preview, nowebsite, followup)
  list --status=new               List leads (filter by status)
  stats                           Show pipeline stats
  help                            Show this message

Examples:
  node src/app.js search "restaurants in Thessaloniki" --city=Thessaloniki
  node src/app.js draft --lead=lead_abc123
  node src/app.js email --lead=lead_abc123 --template=preview
`);
}

async function main() {
  switch (cmd) {
    case 'search': {
      const query = args.slice(1).find(a => !a.startsWith('--'));
      if (!query) { console.log('Usage: search "restaurants in City"'); return; }
      const leads = await searchGoogleMaps(query, config);
      if (!leads.length) return;
      console.log('\nPreview:');
      leads.slice(0,5).forEach(l => console.log(`  • ${l.name} | ${l.city} | ${l.website || 'no site'} | ${l.phone || 'no phone'}`));
      console.log(`\nImport all ${leads.length}? (y/n)`);
      // In real CLI you'd use readline; here we auto-import for non-interactive use
      await importLeads(leads, flags.autoAnalyze === 'true');
      break;
    }
    
    case 'add': {
      // Simple manual add via flags for now
      const lead = {
        name: flags.name || 'Unknown Business',
        category: flags.category || 'local business',
        city: flags.city || '',
        address: flags.address || '',
        phone: flags.phone || '',
        email: flags.email || '',
        website: flags.website || '',
        rating: flags.rating ? parseFloat(flags.rating) : null,
        source: 'manual'
      };
      const res = await addLead(lead);
      if (res.success) {
        console.log(`✅ Added ${res.lead.id}`);
      } else {
        console.log('⚠️  Duplicate found');
      }
      break;
    }
    
    case 'analyze': {
      if (!flags.lead) { console.log('Usage: analyze --lead=ID'); return; }
      const { getLead } = await import('./db.js');
      const lead = await getLead(flags.lead);
      if (!lead) { console.log('Lead not found'); return; }
      const score = await analyzeWebsite(lead);
      console.log(`\nFinal score: ${score}/50`);
      break;
    }
    
    case 'draft': {
      if (!flags.lead) { console.log('Usage: draft --lead=ID'); return; }
      const { getLead } = await import('./db.js');
      const lead = await getLead(flags.lead);
      if (!lead) { console.log('Lead not found'); return; }
      await generateDraft(lead, config);
      break;
    }
    
    case 'email': {
      if (!flags.lead) { console.log('Usage: email --lead=ID --template=preview'); return; }
      const template = flags.template || 'preview';
      if (!listTemplates().includes(template)) {
        console.log('Templates:', listTemplates().join(', ')); return;
      }
      await sendEmail(flags.lead, template, config);
      break;
    }
    
    case 'list': {
      const leads = await listLeads({ status: flags.status, city: flags.city, minScore: flags.minScore, limit: flags.limit ? parseInt(flags.limit) : undefined });
      console.log(`\nFound ${leads.length} leads:\n`);
      leads.forEach(l => {
        const indicators = [];
        if (l.score >= 15) indicators.push('🔥');
        else if (l.score >= 8) indicators.push('🌡️');
        if (l.previewUrl) indicators.push('🎨');
        if (l.emailedAt) indicators.push('📧');
        console.log(`  ${indicators.join('') || '  '} [${l.status?.toUpperCase()}] ${l.name} | Score: ${l.score || '-'} | ${l.city} | ${l.website || 'no site'}`);
      });
      break;
    }
    
    case 'stats': {
      const db = await getDB();
      const byStatus = {};
      db.leads.forEach(l => { byStatus[l.status || 'new'] = (byStatus[l.status || 'new'] || 0) + 1; });
      console.log('\n📊 Pipeline Stats');
      console.log('─────────────────');
      console.log(`Total leads:     ${db.leads.length}`);
      Object.entries(byStatus).forEach(([s, c]) => console.log(`  ${s}: ${c}`));
      console.log(`\nEmails sent:     ${db.emailsSent} total`);
      console.log(`Emails today:    ${db.emailsSentToday}`);
      console.log(`Hot leads (15+): ${db.leads.filter(l => (l.score||0) >= 15).length}`);
      break;
    }
    
    case 'help':
    default:
      printHelp();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
