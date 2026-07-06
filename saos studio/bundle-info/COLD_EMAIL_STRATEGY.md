# SAOS Studio — Cold Email Strategy
## The "Draft First, Sell Second" System

---

## Philosophy

Don't ask for a meeting. **Show them the future.**

The biggest mistake in cold outreach is asking for time. Business owners are busy. Instead, we do the work upfront: find a business with a bad/no website, generate a beautiful AI draft homepage for *their brand*, and email them a preview link.

**The psychology:** When someone sees their own business name on a gorgeous website mockup, curiosity beats skepticism. They click. They imagine. They reply.

---

## The Workflow

```
FIND → ANALYZE → DRAFT → EMAIL → FOLLOW UP → CLOSE
```

### Step 1: FIND (Google Maps Leads)
- Search: "[business type] in [city]" (e.g., "restaurants in Thessaloniki")
- Extract: Name, address, phone, website URL, rating, photos
- Filter: Only businesses with **no website** or a **clearly outdated/broken site**
- Tools: Our custom sales-app scraper, or manual + SerpAPI

### Step 2: ANALYZE (Quality Check)
For businesses WITH a website, run a quick heuristic:
- Is it mobile-responsive? (Viewport check)
- Does it load in <3s? (Basic timing)
- Is the copyright year < current year - 2?
- Is it HTTP (not HTTPS)?
- Does it use a generic builder subdomain? (e.g., wixsite.com)
- Score 0–10. Below 4 = prime target.

### Step 3: DRAFT (AI Mockup Generation)
- Input: Business name, type, city, any photos from Google Maps
- AI prompt engineering to generate a single-page HTML draft
- Brand colors extracted from Google Maps photos or industry defaults
- Include: Hero with business name, services section, about snippet, contact/map area
- Output: Hosted preview URL (Netlify Drop, Cloudflare Pages, or local server)

### Step 4: EMAIL (The Hook)
Personalized, short, image-driven email with the preview link.

### Step 5: FOLLOW UP
- Day 3: Friendly bump
- Day 7: "Closing the loop" email
- Day 14: Final value-add (free tip, not a sales pitch)

### Step 6: CLOSE
- Discovery call (15 min)
- Confirm scope & package
- 50% deposit to start

---

## Email Templates

### Template A: The Preview (Primary)
> **Subject:** [Business Name] — I made you a website preview
>
> Hi [First Name],
>
> I came across [Business Name] on Google Maps and noticed your website [could use a refresh / wasn't loading / doesn't exist yet].
>
> I run SAOS Studio — we design beautiful, professional websites for local businesses, usually delivered in under a week for under €500.
>
> I liked the look of [Business Name] so much that I took 20 minutes and put together a quick homepage draft just for you:
>
> 👉 **[Preview your free draft](https://preview-link.com)**
>
> No strings attached. If you like the direction, I'd love to build out the full site. If not, no worries at all — consider it a compliment from one local business to another.
>
> Best,  
> [Your Name]  
> SAOS Studio  
> [Phone] | [Website]

### Template B: The No-Website Hook
> **Subject:** [Business Name] — missing out on customers?
>
> Hi [First Name],
>
> I searched for [Business Name] today and couldn't find a website — just your Google Maps listing.
>
> I built a quick homepage draft to show you what your online presence could look like:
>
> 👉 **[See your draft](https://preview-link.com)**
>
> Most people check a website before visiting or calling. A simple, beautiful site builds trust before they even walk through your door.
>
> We build these in 3–5 days for a flat €499. Happy to chat whenever you're free.
>
> Best,  
> [Your Name]

### Template C: Follow-Up (Day 3)
> **Subject:** Re: [Business Name] — quick question
>
> Hi [First Name],
>
> Just bumping this to the top of your inbox in case it got buried.
>
> The draft I built for [Business Name] is here if you want to take a look: [Link]
>
> Even if you're not ready now, I'd love your honest feedback.
>
> [Your Name]

### Template D: Follow-Up (Day 7 — Value Add)
> **Subject:** One tip for [Business Name]'s Google listing
>
> Hi [First Name],
>
> I noticed [Business Name]'s Google Maps photos could use an update — businesses with 10+ recent photos get 42% more direction requests.
>
> Small thing, big impact.
>
> Also, in case you missed it — here's that site draft I built: [Link]
>
> [Your Name]

---

## Subject Line A/B Tests

| Version | Type |
|---------|------|
| [Business Name] — I made you a website preview | **Curiosity + Personal** |
| Your website vs. your competitor's | **Competitive** |
| Quick draft for [Business Name] | **Direct** |
| 5 min read: your online first impression | **Value** |
| [Business Name] looks great — your site could too | **Compliment** |

**Rule:** Never use "web design services" or "cheap websites" in the subject line. Triggers spam filters and screams sales.

---

## Lead Scoring

| Signal | Points |
|--------|--------|
| No website at all | +10 |
| Website broken / not loading | +8 |
| Copyright year < 2020 | +6 |
| Not mobile-responsive | +6 |
| HTTP only (no SSL) | +4 |
| On free subdomain (wixsite, etc.) | +5 |
| High Google Maps rating (>4.0) | +3 |
| Has photos on GMB | +2 |
| Recently claimed GMB listing | +2 |

**Target score > 15 for priority outreach.**

---

## Daily Outreach Quota

| Activity | Quantity |
|----------|----------|
| New leads researched | 20 |
| AI drafts generated | 5–10 |
| Cold emails sent | 30–50 |
| Follow-ups sent | 10–20 |
| Discovery calls | 1–3 |

**Time estimate:** 3–4 hours/day. Batch research in the morning. Draft at lunch. Send in afternoon.

---

## Tools & Costs

| Tool | Purpose | Est. Cost |
|------|---------|-----------|
| SerpAPI / Outscraper | Google Maps data | $50/mo |
| OpenAI API | Draft generation | $20–$40/mo |
| Netlify / Vercel | Preview hosting | Free |
| Resend / Mailgun | Email sending | $10–$20/mo |
| Hunter.io / Apollo | Email finding | $50/mo (optional) |
| Our Sales App | Orchestration | Built in-house |

---

## Legal & Ethical Notes

- **GDPR Compliance:** Only email business addresses publicly listed (e.g., from GMB, website). Never scrape personal emails.
- **Unsubscribe:** Always include an easy way to opt out. Honor immediately.
- **CAN-SPAM / CASL:** Include physical business address in email footer.
- **Transparency:** Be honest that it's a draft. Don't claim they commissioned it.

---

*This strategy turns cold outreach into warm conversation. The draft is the handshake.*
