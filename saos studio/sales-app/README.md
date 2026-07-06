# SAOS Sales Agent

The automated lead generation and outreach engine for SAOS Studio.

## What It Does

1. **Finds leads** — Search Google Maps by category + city
2. **Analyzes websites** — Checks if their site is outdated, broken, or missing
3. **Generates AI drafts** — Creates a custom homepage preview for each lead
4. **Sends cold emails** — Personalized emails with preview links via Resend
5. **Tracks pipeline** — JSON-based CRM with scoring and status management

## Quick Start

```bash
cd sales-app
npm install
```

### 1. Configure API Keys

Edit `config.json`:
- `openai.apiKey` — Get from [platform.openai.com](https://platform.openai.com)
- `resend.apiKey` — Get from [resend.com](https://resend.com) (verify your domain first)
- `serpapi.apiKey` — Get from [serpapi.com](https://serpapi.com) (optional, for Google Maps search)
- Fill in your business details under `business`

### 2. Search for Leads

```bash
node src/app.js search "restaurants in Thessaloniki" --city=Thessaloniki
```

### 3. Analyze a Lead

```bash
node src/app.js analyze --lead=lead_abc123
```

### 4. Generate AI Draft

```bash
node src/app.js draft --lead=lead_abc123
```

This creates an HTML file in `./previews/` with a banner saying "Preview by SAOS Studio."

### 5. Send Cold Email

```bash
node src/app.js email --lead=lead_abc123 --template=preview
```

Templates: `preview`, `nowebsite`, `followup`

### 6. View Pipeline

```bash
node src/app.js stats
node src/app.js list --status=hot
```

## Manual Mode (No API Keys)

You can use the app without SerpAPI by adding leads manually:

```bash
node src/app.js add --name="Café Vero" --city=Athens --phone="+30..." --website="https://..." --category=restaurant
```

Then run `analyze`, `draft`, and `email` as normal.

## Hosting Previews

The app generates local HTML files. To send live preview links:

1. Drag the `./previews/` folder to [Netlify Drop](https://app.netlify.com/drop) (free)
2. Update `config.json`: `"previewBaseURL": "https://your-site.netlify.app"`
3. Re-generate drafts (or move existing files to the host)

## Daily Workflow

```bash
# Morning: find new leads
node src/app.js search "hair salons in Athens" --city=Athens

# Midday: analyze and draft the hottest ones
node src/app.js list --status=new --minScore=10
node src/app.js draft --lead=lead_abc123

# Afternoon: send emails
node src/app.js email --lead=lead_abc123 --template=preview

# End of day: check stats
node src/app.js stats
```

## File Structure

```
sales-app/
├── config.json          # API keys & business info
├── data/
│   ├── leads.json       # Your CRM database
│   └── activity.log     # Audit trail
├── previews/            # Generated AI draft HTML files
├── src/
│   ├── app.js           # CLI entrypoint
│   ├── db.js            # JSON database
│   ├── scraper.js       # Google Maps search
│   ├── analyzer.js      # Website quality check
│   ├── drafter.js       # AI draft generation
│   └── mailer.js        # Email sending
└── package.json
```

## Compliance Notes

- Only email business addresses publicly listed
- Include unsubscribe/opt-out path
- Include physical address in email footer (edit mailer.js)
- Honor GDPR requests immediately
- Don't misrepresent the draft as commissioned work

---

*Built by SAOS Studio. Ship fast. Sell faster.*
