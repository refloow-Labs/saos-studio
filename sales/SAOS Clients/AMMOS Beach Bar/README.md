# AMMOS Beach Bar — Demo Landing Page
*Built by SAOS Studio*

A single-file, production-quality demo landing page for **AMMOS Beach Bar** (ΑΝΑΤΟΛΙΚΕΣ ΑΚΤΕΣ Ι.Κ.Ε.), a seasonal beach bar on Kos island, Dodecanese. Built as a free sales preview to email the business owner.

## Files

| File | Description |
|------|-------------|
| `index.html` | Self-contained landing page. No build step — open directly in any browser. |
| `outreach.md` | Cold email (Greek), business description, and LinkedIn connection message. |
| `README.md` | This file. |

## How to view

Double-click `index.html`. Everything (CSS, JS) is inline; only Google Fonts and Unsplash images load from CDNs. Fully responsive.

---

## Scrape status: ❌ FALLBACK (category branding applied)

The original website `http://www.anatolikesaktesike.eu` is down (ECONNREFUSED). Category branding was applied per the scrape-fallbacks SOP.

### Known real data used

- **Business name:** AMMOS Beach Bar (brand name extracted from company description: "εκμετάλλευση beach bar «AMMOS»")
- **Company:** ΑΝΑΤΟΛΙΚΕΣ ΑΚΤΕΣ Ι.Κ.Ε.
- **Region:** Δωδεκάνησα — Kos island (area code 2242 = Kos)
- **Phone:** 2242 024 641 / 2242 048 306
- **Email:** drososg@otenet.gr
- **Category:** Bars/beverage service (NACE 5630)
- **Scale:** ~€996k revenue, 6 staff — a solid established beach business

---

## Brand direction

Since no live site was scrapable, brand identity was built from category intelligence and the brand name:

- **"AMMOS"** means "sand" in Greek — the brand name itself is the entire mood board: beach, Aegean, summer freedom
- **Palette:** Sandy warm (#f5ede0), Aegean ocean blue (#1a6985 / #0d4359), coral sunset (#e07a42 / #f0a06a), ivory — a coastal Mediterranean palette that communicates both relaxation and sophistication
- **Typography:** Playfair Display (display serif — classic, resort-grade elegance) + Plus Jakarta Sans (body — modern, clean)
- **Vibe:** Upscale beach relaxation. Not a nightclub, not a kiosk — a premium daybed-and-cocktail beach bar experience. Think Mykonos beach club energy adapted for the Dodecanese family-tourism market.
- **Logo:** Circular "A" monogram in teal-to-deep-sea gradient + "AMMOS / Beach Bar · Κως" — top-left sticky nav
- **Season:** Explicitly seasonal (May–October) — the site copy and hours section reflect this accurately

---

## Mandatory design rules — all implemented

- ✅ **Scroll animations:** IntersectionObserver reveals + pop-in on menu cards and value cards, staggered delays
- ✅ **Big sections & oversized headers:** `clamp()` up to ~8rem in hero
- ✅ **Clean, light aesthetic:** Sandy/ivory base, ocean accents, coastal grain overlay
- ✅ **Sticky navbar, logo top-left:** blur-backdrop on scroll
- ✅ **Powerful animated hero:** Ken Burns zoom on Aegean beach photography + staggered hero entrance animations + parallax on scroll
- ✅ **Mobile responsive:** Hamburger menu, single-column stacking, fluid typography

### Sections included

Hero (Aegean beach) → Marquee (Cocktails / Juices / Snacks / etc.) → Brand story (10+ years, 40+ drinks, seasonal operation) → Menu cards (Cocktails / Juices & Smoothies / Μεζέδες & Snacks) → Gallery (6-item beach imagery) → Experience values (Sunrise to Sunset / Music / Fresh & Local) → Contact & Hours (seasonal schedule) → CTA banner (sunset photography) → Footer

---

## Image credits

All from **Unsplash** (free to use):

| Slot | Unsplash photo |
|------|---------------|
| Hero — Aegean beach | `photo-1507525428034-b723cf961d3e` |
| Story — beach bar | `photo-1544551763-46a013bb70d5` |
| Menu: Cocktails | `photo-1551024709-8f23befc6f87` |
| Menu: Juices | `photo-1589733955941-5eeaf752f6dd` |
| Menu: Snacks | `photo-1565299624946-b28f40a0ae38` |
| Gallery 1 — sunset | `photo-1519046904884-53103b34b206` |
| Gallery 2 — cocktail | `photo-1536939459926-301728717817` |
| Gallery 3 — sea | `photo-1473116763249-2faaef81ccda` |
| Gallery 4 — drinks | `photo-1621227311069-a69af879a70f` |
| Gallery 5 — umbrellas | `photo-1533777857889-4be7c70b33f7` |
| Gallery 6 — beach bar | `photo-1530103862676-de8c9debad1d` |
| Visit photo | `photo-1559827291-72ee739d0d9a` |
| CTA banner — sunset | `photo-1506905925346-21bda4d32df4` |

URL pattern: `https://images.unsplash.com/<id>?auto=format&fit=crop&w=<width>&q=80`

---

## Tech notes

- **No build step.** Pure HTML + CSS + vanilla JS in one file.
- Google Fonts: Playfair Display + Plus Jakarta Sans.
- IntersectionObserver scroll reveal, sticky-nav, mobile menu, hero parallax via rAF.
- `prefers-reduced-motion: reduce` disables all motion.

---

*Demo built by **SAOS Studio** — beautiful websites for Greek businesses, under €500.*
