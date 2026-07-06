# SAOS Studio — Project Overview

## What it is

SAOS Studio is an AI-accelerated web design studio. We deliver agency-quality websites for small businesses in days, not weeks, for under €500.

**Tagline:** Beautiful websites under €500. Built by AI, finished by humans.

**Positioning:**
> For small businesses that need a professional online presence, SAOS Studio is an AI-accelerated web design partner that delivers agency-quality websites in under a week for under €500.

## Offer

| Package | Price | Best for |
|---|---|---|
| Landing Page | €299 | Product launches, events, single services |
| Business Site (Flagship) | €499 | Most local businesses — hero offer |
| Growth Suite | €799 | Brands needing blog + analytics |

## Repo structure

```
saos studio/
├── bundle-info/            ← you are here (canonical brand + project bundle)
├── website/                Vite + React + Tailwind marketing site (deployed via Netlify)
├── sales-app/              Node.js CLI: lead gen, AI drafts, cold email pipeline
├── core-service-crm/       Express + React CRM for the 3D rebuild service
├── portfolio/              Standalone HTML portfolio (PDF-ready)
├── documents/              Legal & client-facing HTML templates
├── marketing/              Marketing & cold email strategy docs
├── logos/                  Source logos (dark + white)
└── LAUNCH_READINESS.md     48-hour launch checklist
```

## Sub-projects at a glance

### website/
The public marketing site at (planned) `saos.studio`. Stack: Vite, React, TypeScript, Tailwind. Already wired for Netlify deploys. Greek-language landing copy targeting Greek SMBs.

### sales-app/
Node.js CLI that:
1. Searches Google Maps via SerpAPI
2. Analyzes target websites
3. Generates AI homepage drafts via OpenAI
4. Sends personalized cold emails via Resend
5. Tracks the pipeline in JSON

Run with `node src/app.js <command>`. See [sales-app/README.md](../sales-app/README.md).

### core-service-crm/
Dedicated CRM for the 3D Website Rebuild service: scrapes target sites for assets/colors/screenshots, builds prompts for Claude/Kimi, and tracks projects through Draft → Generating → Deployed → Emailed → Closed. Stack: Express + better-sqlite3 + Puppeteer backend, Vite + React + Tailwind frontend.

## Status (as of 2026-04-29)

Pre-launch. Assets, systems, and strategy are built. Open items:
- Domain `saos.studio` purchase + Netlify deploy
- Business entity registration & VAT
- API key funding (OpenAI, Resend, SerpAPI)
- First 3 portfolio pieces (real clients)
- Google Business Profile, Instagram, LinkedIn

Full checklist: [LAUNCH_READINESS.md](LAUNCH_READINESS.md).

## Target customer

Local service businesses (restaurants, salons, clinics, gyms, trades), solo professionals (lawyers, accountants, photographers), and early-stage startups — typically owner-operators, 30–55, with no website or a poor one.

Full ICP and channels: [MARKETING_STRATEGY.md](MARKETING_STRATEGY.md).
