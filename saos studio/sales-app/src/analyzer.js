import puppeteer from 'puppeteer';
import { updateLead, logActivity } from './db.js';

export async function analyzeWebsite(lead) {
  let score = 0;
  const details = [];
  
  if (!lead.website) {
    score += 10;
    details.push('No website found');
    await saveAnalysis(lead, score, details);
    return score;
  }

  console.log(`🔬 Analyzing ${lead.website}...`);
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const res = await page.goto(lead.website, { waitUntil: 'networkidle2', timeout: 15000 });
    
    // Check HTTPS
    if (lead.website.startsWith('https://')) {
      score += 2; details.push('Has HTTPS');
    } else {
      score += 4; details.push('No HTTPS');
    }
    
    // Check responsive
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    const contentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    if (contentWidth > 400) {
      score += 6; details.push('Not mobile responsive');
    } else {
      score += 0; details.push('Mobile responsive');
    }
    
    // Check year in footer
    const html = await page.content();
    const currentYear = new Date().getFullYear();
    const yearMatch = html.match(/20\d{2}/g);
    if (yearMatch) {
      const years = yearMatch.map(Number).filter(y => y >= 2000 && y <= currentYear + 1);
      const maxYear = Math.max(...years);
      if (maxYear < currentYear - 2) {
        score += 6; details.push(`Copyright year outdated (${maxYear})`);
      } else {
        score += 1; details.push(`Copyright recent (${maxYear})`);
      }
    }
    
    // Check free subdomain
    if (/wixsite|weebly|wordpress\.com|squarespace|godaddysites|webnode/.test(lead.website)) {
      score += 5; details.push('Using free subdomain');
    }
    
    // Load speed rough check
    const timing = await page.evaluate(() => JSON.stringify(performance.timing));
    const t = JSON.parse(timing);
    const loadTime = t.loadEventEnd - t.navigationStart;
    if (loadTime > 5000) {
      score += 4; details.push(`Slow load (${Math.round(loadTime)}ms)`);
    }
    
    // Google Maps signals
    if (lead.rating && lead.rating >= 4.0) { score += 3; details.push('Good GMB rating'); }
    if (lead.reviews && lead.reviews > 10) { score += 2; details.push('Has GMB reviews'); }
    
  } catch (e) {
    score += 8;
    details.push(`Site unreachable (${e.message.slice(0,60)})`);
  } finally {
    if (browser) await browser.close();
  }
  
  await saveAnalysis(lead, score, details);
  console.log(`📊 Score for ${lead.name}: ${score}/50 — ${details.join('; ')}`);
  return score;
}

async function saveAnalysis(lead, score, details) {
  const status = score >= 15 ? 'hot' : (score >= 8 ? 'warm' : 'cold');
  await updateLead(lead.id, { score, analysis: details, status, analyzedAt: new Date().toISOString() });
  await logActivity(`Analyzed ${lead.name}: score ${score}`);
}
