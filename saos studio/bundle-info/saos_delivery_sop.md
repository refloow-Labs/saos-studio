# SAOS Studio — Website Delivery SOP

**Version:** 1.0  
**Owner:** Giannis / SAOS Studio  
**Stack:** Claude Code + Antigravity IDE + Netlify  
**Scope:** Landing page delivery for local Greek businesses

---

## Overview

This SOP covers the full lifecycle of delivering a client website — from cold outreach through to handoff and upsell. It is designed to be seamlessly executable by a single operator, automatable at key steps, and compliant with EU/GDPR requirements.

**Delivery target:** 3–5 working days from signed contract to live URL.

---

## Phase 1 — Lead & Outreach

**Goal:** Generate a qualified lead list and send personalized cold emails with a website preview.

**Steps:**

1. Run `node src/app.js search` with a target city and business category (e.g. "salon Athens"). The sales-app queries Google Maps via SerpAPI and populates the pipeline JSON with business name, address, phone, website status, and email where available.
2. For each lead, the app analyzes their existing site (or flags absence of one) and generates an AI-drafted homepage concept via OpenAI.
3. Dispatch the personalized cold email via Resend. Every email must include: your real business name and address, a clear subject line referencing the prospect's business, the AI preview or a teaser link, and a one-line unsubscribe option ("Reply STOP to opt out").
4. Set pipeline status to `outreach_sent`. Log timestamp.

**Rule:** Never pitch a client without a draft preview. The preview is the hook.

**Automation status:** Fully automatable. Human review only on batch quality-check (spot-check 5% of drafts before sending).

---

## Phase 2 — Client Intake

**Goal:** Collect all assets and information needed to build the site before work begins.

**Steps:**

1. Send the intake form link (hosted on your domain, not a third-party public link). Form collects: business name, tagline, services list, target customer description, preferred colors/font feel, existing assets.
2. Create a private Google Drive folder named `saos-[clientslug]-assets` (e.g. `saos-marousi-salon-assets`). Share the upload link with the client. They upload: logo files (SVG or high-res PNG preferred), photos, any existing copy they want kept.
3. Send the contract (from your `/documents` templates) and pro-forma invoice. Work does not begin until both are signed and payment is received or a deposit is confirmed.
4. On payment confirmation: create the project folder from the template (see Scalability pillar), set pipeline status to `in_progress`, and log the start date.

**Security rule:** Client assets live only in their isolated Drive folder. Never in your main SAOS repo. Never sent via email attachment.

---

## Phase 3 — Build

**Goal:** Produce a production-ready static landing page using Claude Code + Antigravity.

**Steps:**

1. Open Antigravity (your IDE) in the client project folder: `~/projects/saos-[clientslug]/`.
2. Load the SKILL file (`/saos-skill.md`) into the Claude Code session. This file defines your stack (HTML/CSS/JS + Tailwind), your component library, your design standards, and the SAOS quality bar.
3. Construct the build prompt from the intake form output. Use the structured prompt template (see `/templates/build-prompt.md`). Include: business name, tagline, services, palette, tone of voice, asset paths.
4. Run Claude Code to generate the full landing page. Review the output in Antigravity.
5. Execute the human refinement pass: copy polish, image placement, mobile layout check, link verification.
6. Complete the QA checklist before any preview is sent to the client.

**Build standard:** hero section → trust/social proof or service cards → CTA → footer. Single-page, static HTML/CSS/JS only. No CMS, no database, no server-side code. This keeps the site fast, portable, and trivially hostable.

**QA checklist (mandatory before client preview):**

- Page loads under 3 seconds on mobile (check via DevTools throttled)
- All images have alt text
- CTA button links to correct destination (phone, email, or form)
- No placeholder text ("Lorem ipsum") anywhere
- Mobile layout verified at 375px and 390px breakpoints
- Lighthouse Performance ≥ 85, Accessibility = 100
- All fonts load (no FOIT)
- Greek text renders correctly (check accented characters)

---

## Phase 4 — Deploy

**Goal:** Push the site live on Netlify with a custom domain and HTTPS.

**Steps:**

1. Initialize a private GitHub repository named `saos-[clientslug]`. Push the final build. Confirm `.env` is in `.gitignore` and no secrets are present in the commit history.
2. Connect the repo to a new Netlify site via the Netlify dashboard. Enable auto-deploy on push to `main`.
3. Add the `netlify.toml` security headers file (see Security pillar). Confirm it is present at root before first deploy.
4. Configure the client's custom domain: either obtain temporary DNS access from the client or send them the Netlify CNAME record with clear instructions. HTTPS is provisioned automatically by Netlify.
5. Run Lighthouse on the live URL. Record the scores in the project README. Target: Performance ≥ 90, Accessibility = 100, SEO ≥ 90.
6. Set pipeline status to `deployed`.

**Isolation rule:** Each client has their own Netlify site. Never deploy two clients under the same site. Your SAOS Studio marketing site is entirely separate.

---

## Phase 5 — Handoff & Close

**Goal:** Deliver the site to the client, execute revisions within scope, and close the project cleanly.

**Steps:**

1. Send the client a Netlify deploy preview URL with a short Loom screen recording (2–3 minutes) walking through the site. This elevates the perceived quality of the delivery significantly.
2. Collect feedback. Maximum two revision rounds are included in the package — this is stated in the contract. Log all requested changes in the project doc.
3. Execute revisions in Antigravity, push to `main`. Netlify auto-deploys. Repeat for round two if needed.
4. On final client approval: transfer the Netlify site to the client's own Netlify account (free tier is sufficient for static landing pages), or keep it under a dedicated SAOS client-hosting account if they are on a maintenance retainer. Transfer GitHub repo ownership.
5. Send the handoff document: live URL, login credentials (Netlify + GitHub), what is included in the site, how to request future changes, and your contact details for support.
6. Remove your own admin access from all client accounts. Log the removal date in the project doc.
7. 48 hours after handoff: send the upsell email. Offer the Growth Suite (€799 — blog + analytics) or a monthly maintenance retainer.
8. Set pipeline status to `closed`. Archive the project folder.

---

## Security Pillar

### Core principle

Blast radius = zero. If any single client relationship goes wrong — a dispute, a credential leak, a data request — it must not affect any other client.

### Repository & file isolation

- One private GitHub repo per client: `saos-[clientslug]`
- One private Drive folder per client: `saos-[clientslug]-assets`
- Neither is ever shared with another client
- `.env`, `config.local.*`, and `node_modules` are gitignored on every repo from day one
- On project close: transfer repo ownership, delete or transfer Drive folder, remove your own access

### Secrets management

- All API keys (SerpAPI, Resend, OpenAI, Netlify) live in `.env` locally or in Netlify environment variables
- Never hardcoded in source files
- Never committed to git — not even once
- Use 1Password or Bitwarden as the single source of truth for all credentials
- Rotate keys immediately if a repo is ever accidentally made public

### GDPR (EU / Greece)

You operate as a data controller under GDPR, supervised by the Hellenic Data Protection Authority (HDPA).

**Lawful basis for cold outreach:** Legitimate interest (B2B outreach). Document a one-page Legitimate Interest Assessment (LIA).

**Every cold email must include:** business name and address, reason for contact, and a clear opt-out mechanism. Honor opt-outs within 30 days by deleting the record from the pipeline JSON.

**Retention policy:** Active client data is retained for the duration of the contract plus 3 years (Greek commercial law). Opted-out leads are deleted promptly.

**Processors:** Google Drive, Resend, Netlify, SerpAPI. Verify each has a Data Processing Agreement (DPA) or operates under Standard Contractual Clauses (SCCs) annually.

**Required documentation:**

- Privacy policy on `saos.studio` (what you collect, why, how long, who processes it, how to exercise rights)
- Record of Processing Activities (ROPA) — a simple spreadsheet listing each data category, purpose, legal basis, and retention period
- Legitimate Interest Assessment (one page)

### Netlify.toml security headers

Every client site must include this file at the project root before the first deploy:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

---

## Automation Pillar

| Step | Tool | Automation level |
|---|---|---|
| Lead scraping | sales-app + SerpAPI | Full |
| Homepage draft generation | sales-app + OpenAI | Full |
| Cold email dispatch | sales-app + Resend | Full |
| Pipeline status tracking | pipeline JSON | Full |
| Project folder creation | bash template script | Full |
| Netlify deploy | GitHub push → auto-deploy | Full |
| QA checklist | Manual | Human gate |
| Client review | Manual | Human gate |
| Revision execution | Antigravity + Claude Code | Human-assisted |
| Handoff document | Template | Semi-automated |
| Upsell email | Resend template | Full |

---

## Scalability Pillar

### Project folder template

Every project is initialized from the same template:

```
saos-[clientslug]/
├── .gitignore
├── netlify.toml
├── README.md          ← generated from template on intake
├── QA_CHECKLIST.md    ← filled during Phase 3
├── HANDOFF.md         ← filled during Phase 5
├── src/
│   ├── index.html
│   ├── style.css
│   └── main.js
└── assets/            ← copied from Drive folder at build time
```

### SKILL file

The SKILL file (`/saos-skill.md`) is the multiplier. It defines the full design system, component library, copy tone, and quality standards. Every Claude Code session starts by loading it. Updating the SKILL file instantly upgrades every future project.

### Parallel delivery

Claude Code sessions are stateless — each project runs independently. Multiple projects can be in active build simultaneously with no interference. The bottleneck is human review time, not tooling.

---

## Documentation Pillar

Every project produces four mandatory documents:

| Document | Created at | Contents |
|---|---|---|
| `README.md` | Phase 2 (intake) | Client name, project slug, start date, package, asset locations, pipeline status |
| `QA_CHECKLIST.md` | Phase 3 (build) | All checklist items marked pass/fail, Lighthouse scores, tester name, date |
| `HANDOFF.md` | Phase 5 (close) | Live URL, credentials, scope summary, revision log, access removal log |
| Pipeline JSON entry | Phase 1 (outreach) | Full lifecycle status trail with timestamps |

---

## Pricing Reference

| Package | Price | Includes |
|---|---|---|
| Landing Page | €299 | Single page, 2 revision rounds, Netlify deploy |
| Business Site (Flagship) | €499 | Multi-section, contact form, 2 revision rounds |
| Growth Suite | €799 | Flagship + blog setup + Google Analytics |

---

*SAOS Studio — AI-accelerated web design. Built by AI, finished by humans.*
