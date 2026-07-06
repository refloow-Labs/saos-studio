# Core Service CRM

A dedicated CRM + monitoring + scraper dashboard for the SAOS Studio **3D Website Rebuild** service.

## What it does

- **Lead Management**: Import businesses from Google Maps, store contact info & links.
- **Asset Scraper**: Crawls a business website to extract:
  - Logo / favicon / OG image
  - Brand colors (from inline styles & meta tags)
  - Meta title & description
  - Desktop & mobile screenshots
- **Prompt Builder**: One-click generate a structured prompt for Claude / Kimi that includes all scraped materials so you can generate a cooler 3D animated replacement website.
- **Pipeline Tracker**: Track projects from Draft → Generating → Deployed → Emailed → Closed.
- **Activity Log**: Everything that happens is logged.

## Architecture

```
core-service-crm/
├── server/           Express + better-sqlite3 + Puppeteer
│   ├── src/
│   │   ├── db.js      (schema & queries)
│   │   ├── scraper.js (website scraping & screenshots)
│   │   ├── routes.js  (REST API)
│   │   └── index.js   (entry point)
│   └── config.json    (SerpAPI key)
└── client/           Vite + React + Tailwind
    └── src/
        ├── pages/
        │   ├── Dashboard.tsx
        │   ├── Leads.tsx
        │   ├── LeadDetail.tsx
        │   ├── NewLead.tsx
        │   ├── Pipeline.tsx
        │   └── PromptBuilder.tsx
        └── components/
            └── Sidebar.tsx
```

## Setup

```bash
cd core-service-crm
npm install
```

Add your SerpAPI key to `server/config.json` (optional — only needed for Google Maps search).

## Run (dev)

```bash
npm run dev
```

- API: http://localhost:4000
- Client: http://localhost:3000 (proxies `/api` to backend)

## Build for production

```bash
npm run build
npm start
```

## Workflow

1. Go to **Leads** → search & import from Google Maps or add manually.
2. Open a lead → hit **Scrape Assets**.
3. Go to **Prompt Builder** → select the lead → generate prompt.
4. Copy the prompt → paste into Claude / Kimi → get a 3D site.
5. Deploy to Vercel → update the project in **Pipeline**.
6. Draft & send the cold email with the new link attached.
