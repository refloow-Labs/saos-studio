# Kelari Pro — Demo Landing Page
*Built by SAOS Studio*

A single-file, production-quality demo landing page for **Kelari Pro (ΚΕΛΛΑΡΙ)**, a wine bar restaurant in Alexandroupoli, Thrace, Greece. Built as a free sales preview to send to the business owner.

## Files

| File | Description |
|------|-------------|
| `index.html` | Self-contained landing page. No build step — open directly in any browser. |
| `outreach.md` | Cold email (Greek), business description, and LinkedIn connection message. |
| `README.md` | This file. |

## How to view

Double-click `index.html`, or run a local server and open it. Everything (CSS, JS) is inline; only Google Fonts and Unsplash images load from CDNs. Fully responsive (mobile-first).

---

## Research status: Facebook page scraped

Data extracted from **facebook.com/p/Kelari-Pro-100047763373526/**:

### Confirmed real data used in the demo
- **Business name:** Kelari Pro / ΚΕΛΛΑΡΙ
- **Type:** Wine Bar Restaurant
- **Location:** Κανάρη & Δικαστηρίων, Αλεξανδρούπολη
- **Phone:** 2551 032086
- **Email:** siklafidisvlasis@gmail.com
- **Facebook followers:** 6,000+
- **Recommendation rate:** 98% (295 reviews)
- **Price range:** $$ (mid-range)
- **Features:** Curbside pickup available

### Brand identity (inferred from business type + data)
- **Palette:** Deep burgundy (`#4A1022`) / charcoal / warm gold (`#C4A265`) / cream — rich, atmospheric, fitting for a wine bar
- **Fonts:** Playfair Display (serif display) + DM Sans (body sans) — elegant yet legible
- **Logo:** Clean text wordmark "Kelari" with "Wine Bar · Restaurant" sub-label, top-left of sticky navbar
- **Tone:** Sophisticated yet warm, wine-focused, community-driven

---

## Sections

1. **Hero** — Full-screen hero with atmospheric wine bar photo, parallax, staggered entrance, "Κρασί, γεύσεις & ατμόσφαιρα" headline
2. **Marquee** — Scrolling ticker (Wine Bar, 98% Σύσταση, 6K+ Followers, 295 Κριτικές, etc.)
3. **About** — Brand story ("Ένα κελάρι γεμάτο ψυχή"), 98% recommendation badge, key stats
4. **Menu Highlights** — 3-card grid (Κρέατα, Θαλασσινά, Ορεκτικά) with hover overlays
5. **Wine / Κάβα** — Wine cellar section with Greek + international wines, pairing expertise
6. **Atmosphere** — 4-photo gallery (interior, bar, evening, outdoor)
7. **Reviews** — 3 review cards with star ratings
8. **CTA** — Full-width booking prompt with phone + email
9. **Footer** — Navigation, contact details, hours, social links, SAOS Studio credit

---

## Mandatory design rules — all implemented

- Scroll animations: `IntersectionObserver` fades + slides + "pops" with staggered delays
- Big sections & oversized headers: `clamp()`-scaled display type
- Clean, light, airy aesthetic: cream base (wine sections dark for contrast), generous whitespace, paper grain
- Sticky navbar, text wordmark top-left: with blur-backdrop scrolled state
- Powerful animated hero: staggered entrance + ken-burns parallax + gradient overlay + dual CTAs
- Mobile responsive: hamburger menu, grid reflows at 560/880/1080px breakpoints
- Prefers-reduced-motion: all animations disabled when user preference is set
