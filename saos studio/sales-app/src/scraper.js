// Google Maps lead finder via SerpAPI or manual CSV import
import { addLead, logActivity } from './db.js';

function cleanUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.includes('.')) return 'https://' + url;
  return null;
}

export async function searchGoogleMaps(query, config) {
  if (!config.serpapi?.apiKey || config.serpapi.apiKey.includes('your-serpapi')) {
    console.log('⚠️  SerpAPI key not configured. Use manual mode: npm run add');
    return [];
  }
  const params = new URLSearchParams({
    engine: 'google_maps',
    q: query,
    api_key: config.serpapi.apiKey,
    type: 'search',
    hl: 'en'
  });
  const url = `https://serpapi.com/search?${params}`;
  console.log(`🔍 Searching: ${query}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`SerpAPI error: ${res.status}`);
  const data = await res.json();
  const results = data.local_results || [];
  console.log(`📍 Found ${results.length} places`);
  const leads = [];
  for (const r of results) {
    const lead = {
      name: r.title,
      address: r.address,
      city: extractCity(r.address),
      phone: r.phone,
      website: cleanUrl(r.website),
      rating: r.rating,
      reviews: r.reviews,
      category: r.type,
      gmbUrl: r.place_id ? `https://www.google.com/maps/place/?q=place_id:${r.place_id}` : null,
      source: 'serpapi',
      query
    };
    leads.push(lead);
  }
  return leads;
}

function extractCity(address) {
  if (!address) return '';
  const parts = address.split(',').map(s => s.trim());
  return parts[parts.length - 2] || parts[parts.length - 1] || '';
}

export async function importLeads(leads, autoAnalyze = false) {
  let added = 0; let skipped = 0;
  for (const lead of leads) {
    const result = await addLead(lead);
    if (result.success) {
      added++;
      if (autoAnalyze) {
        const { analyzeWebsite } = await import('./analyzer.js');
        const score = await analyzeWebsite(result.lead);
        result.lead.score = score;
        const { updateLead } = await import('./db.js');
        await updateLead(result.lead.id, { score, status: score >= 15 ? 'hot' : 'new' });
      }
    } else {
      skipped++;
    }
  }
  await logActivity(`Imported ${added} leads, skipped ${skipped}`);
  console.log(`✅ Added ${added}, skipped ${skipped}`);
  return { added, skipped };
}
