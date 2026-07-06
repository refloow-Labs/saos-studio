import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
// Global fetch available in Node 18+
import { getAssets, addAsset, deleteAssets, logActivity } from './db.js';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, '../../data/assets');

async function ensureDir(p) {
  const d = dirname(p);
  if (!existsSync(d)) await mkdir(d, { recursive: true });
}

export async function fetchMeta(website) {
  try {
    const res = await fetch(website, { timeout: 10000 });
    const html = await res.text();
    const $ = cheerio.load(html);
    const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || '';
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
    const ogImage = $('meta[property="og:image"]').attr('content') || '';
    const themeColor = $('meta[name="theme-color"]').attr('content') || '';
    const favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || '';
    const resolvedFavicon = favicon ? new URL(favicon, website).href : '';
    const resolvedOgImage = ogImage ? new URL(ogImage, website).href : '';

    // Try to find logo image
    let logoUrl = '';
    const logoSelectors = [
      'img[alt*="logo" i]', 'img[src*="logo" i]', 'img[class*="logo" i]',
      'a img', 'header img', '.brand img', '#logo img'
    ];
    for (const sel of logoSelectors) {
      const src = $(sel).first().attr('src');
      if (src) { logoUrl = new URL(src, website).href; break; }
    }

    // Extract inline styles for colors
    const colors = new Set();
    if (themeColor) colors.add(themeColor);
    $('[style*="color"], [style*="background"]').each((_, el) => {
      const style = $(el).attr('style') || '';
      const matches = style.match(/(#[0-9a-fA-F]{3,8}|rgb[a]?\([^)]+\))/g);
      if (matches) matches.forEach(c => colors.add(c));
    });
    $('link[rel="stylesheet"]').each((_, el) => {
      // We won't fetch all CSS to keep it fast; inline is enough for now
    });

    return {
      title,
      description,
      ogImage: resolvedOgImage,
      favicon: resolvedFavicon,
      logoUrl: logoUrl || resolvedOgImage || resolvedFavicon,
      colors: Array.from(colors).slice(0, 12)
    };
  } catch (e) {
    console.error('fetchMeta error', e.message);
    return { title: '', description: '', ogImage: '', favicon: '', logoUrl: '', colors: [] };
  }
}

export async function captureScreenshot(website, businessId) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(website, { waitUntil: 'networkidle2', timeout: 20000 });
    const path = join(ASSETS_DIR, `${businessId}_desktop.png`);
    await ensureDir(path);
    await page.screenshot({ path, fullPage: false });

    // Mobile
    await page.setViewport({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    const mobilePath = join(ASSETS_DIR, `${businessId}_mobile.png`);
    await page.screenshot({ path: mobilePath, fullPage: false });

    return { desktop: `/assets/${businessId}_desktop.png`, mobile: `/assets/${businessId}_mobile.png` };
  } catch (e) {
    console.error('Screenshot error', e.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

export async function extractAll(business) {
  const website = business.website;
  if (!website) return { error: 'No website' };

  // Clear old meta/text assets
  deleteAssets(business.id, 'meta');
  deleteAssets(business.id, 'text');
  deleteAssets(business.id, 'color');

  const meta = await fetchMeta(website);

  // Store meta
  addAsset({ businessId: business.id, type: 'meta', label: 'Title', data: meta.title });
  addAsset({ businessId: business.id, type: 'meta', label: 'Description', data: meta.description });
  addAsset({ businessId: business.id, type: 'meta', label: 'OG Image', url: meta.ogImage });
  addAsset({ businessId: business.id, type: 'meta', label: 'Favicon', url: meta.favicon });

  if (meta.logoUrl) {
    addAsset({ businessId: business.id, type: 'logo', label: 'Logo', url: meta.logoUrl });
  }

  meta.colors.forEach(c => {
    addAsset({ businessId: business.id, type: 'color', label: 'Extracted', data: c });
  });

  // Screenshot
  const screens = await captureScreenshot(website, business.id);
  if (screens) {
    addAsset({ businessId: business.id, type: 'screenshot', label: 'Desktop', url: screens.desktop });
    addAsset({ businessId: business.id, type: 'screenshot', label: 'Mobile', url: screens.mobile });
  }

  logActivity('scrape', `Scraped ${business.name}`, { businessId: business.id });

  return { meta, screens };
}

export async function searchGoogleMaps(query, config = {}) {
  if (!config.serpapi?.apiKey || config.serpapi.apiKey.includes('your-serpapi')) {
    throw new Error('SerpAPI key not configured in server/config.json');
  }
  const params = new URLSearchParams({ engine: 'google_maps', q: query, api_key: config.serpapi.apiKey, type: 'search', hl: 'en' });
  const res = await fetch(`https://serpapi.com/search?${params}`);
  if (!res.ok) throw new Error(`SerpAPI ${res.status}`);
  const data = await res.json();
  const results = data.local_results || [];
  return results.map(r => ({
    name: r.title,
    address: r.address,
    city: extractCity(r.address),
    phone: r.phone,
    website: cleanUrl(r.website),
    rating: r.rating,
    reviews: r.reviews,
    category: r.type,
    gmbUrl: r.place_id ? `https://www.google.com/maps/place/?q=place_id:${r.place_id}` : null,
    source: 'serpapi'
  }));
}

function cleanUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.includes('.')) return 'https://' + url;
  return null;
}

function extractCity(address) {
  if (!address) return '';
  const parts = address.split(',').map(s => s.trim());
  return parts[parts.length - 2] || parts[parts.length - 1] || '';
}
