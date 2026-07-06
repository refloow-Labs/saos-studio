# Desire Patisserie — Demo Landing Page
*Built by SAOS Studio*

A single-file, production-quality demo landing page for **Desire Patisserie**, an upscale Athenian patisserie in Kolonaki. Built as a free sales preview to email the business owner.

## Files

| File | Description |
|------|-------------|
| `index.html` | Self-contained landing page. No build step — open directly in any browser. |
| `outreach.md` | Cold email (Greek), business description, and LinkedIn connection message. |
| `README.md` | This file. |

## How to view

Double-click `index.html`. Everything (CSS, JS) is inline; only Google Fonts and Unsplash images load from CDNs. Fully responsive.

---

## Scrape status: ✅ PARTIAL SUCCESS

The live site `https://desire.com.gr` was scraped successfully.

### Confirmed real data used

- **Business name:** Desire Patisserie / DESIRE PATISSERIE Ι.Κ.Ε.
- **Address:** Δημοκρίτου 6, Αθήνα 106 71 (Kolonaki)
- **Phone:** +30 210 363 2333
- **Email:** desirekolonaki@gmail.com
- **Hours:** Mon–Sat 07:30–21:30 / Sun 09:00–20:00
- **Real tagline:** "Η Αθηναϊκή αστική ζαχαροπλαστική στα καλύτερά της" — used verbatim
- **Real product categories** (from live site navigation): Πάστες, Μίνι Γλυκά, Τούρτες, Σοκολατάκια, Βουτήματα–Είδη Φούρνου, Αλμυρά εδέσματα–Catering, Δώρα–Corporate Gifts
- **Social channels confirmed:** Instagram, Facebook, TripAdvisor, WhatsApp, Viber

---

## Brand direction

Since no visible CSS/logo file was retrievable from the live site (WordPress theme minified), brand identity was interpreted from business profile and neighborhood positioning:

- **Neighborhood:** Kolonaki — Athens' most upscale residential/commercial quarter, known for fashion boutiques, galleries, and refined dining
- **Palette:** Dusty rose (--rose: #f5ede8), ivory, champagne gold (#c9a96e / #e2c485), deep plum (#3b1f2b), bordeaux (#6b2d4a) — evoking French patisserie elegance
- **Typography:** Cormorant Garamond (display serif — classic, editorial, romantic) + DM Sans (body — clean, modern)
- **Vibe:** Refined, feminine, luxury-adjacent. The Kolonaki regulars who visit Desire expect visual sophistication matching the neighborhood.
- **Logo:** Circular "D" monogram in gold gradient + "Desire Patisserie / Κολωνάκι · Αθήνα" wordmark — top-left sticky nav

---

## Mandatory design rules — all implemented

- ✅ **Scroll animations:** IntersectionObserver reveals + pop-in on product cards, gallery, and value cards
- ✅ **Big sections & oversized headers:** `clamp()`-scaled display type up to ~7.8rem in hero
- ✅ **Clean, light aesthetic:** Dusty rose / ivory base, generous whitespace, subtle paper-grain overlay
- ✅ **Sticky navbar, logo top-left:** blur-backdrop on scroll
- ✅ **Powerful animated hero:** Ken Burns zoom on hero image (Unsplash pastry photography) + staggered entrance animations + hero parallax
- ✅ **Mobile responsive:** Hamburger menu, single-column stacking, fluid typography

### Sections included

Hero → Marquee → Brand story (history + stats: 30+ years, 60+ products, 07:30 opening) → Product grid (6 categories: Πάστες / Μίνι Γλυκά / Τούρτες / Σοκολατάκια / Αλμυρά & Catering / Corporate Gifts) → Gallery (masonry 6-item) → Values (χειροποίητα / υλικά / εμπιστοσύνη) → Contact & Hours → CTA banner → Footer

---

## Image credits

All from **Unsplash** (free to use, no attribution required):

| Slot | Unsplash photo |
|------|---------------|
| Hero — pastries display | `photo-1563729784474-d77dbb933a9e` |
| Story — patissier at work | `photo-1587668178277-295251f900ce` |
| Product: Πάστες | `photo-1571115764595-644a1f56a55c` |
| Product: Μίνι Γλυκά | `photo-1558618666-fcd25c85cd64` |
| Product: Τούρτες | `photo-1535141192574-5d4897c12636` |
| Product: Σοκολατάκια | `photo-1548907040-4baa42d10919` |
| Product: Αλμυρά | `photo-1509440159596-0249088772ff` |
| Product: Δώρα | `photo-1549488344-1f9b8d2bd1f3` |
| Gallery 1 | `photo-1486427944299-d1955d23e34d` |
| Gallery 2 | `photo-1612203985729-70726954388c` |
| Gallery 3 | `photo-1464195244916-405fa0a82545` |
| Gallery 4 | `photo-1606313564200-e75d5e30476c` |
| Gallery 5 | `photo-1563805042-7684c019e1cb` |
| Gallery 6 | `photo-1578985545062-69928b1d9587` |
| Visit photo | `photo-1467003909585-2f8a72700288` |
| CTA banner | `photo-1551024601-bec78aea704b` |

URL pattern: `https://images.unsplash.com/<id>?auto=format&fit=crop&w=<width>&q=80`

---

## Tech notes

- **No build step.** Pure HTML + CSS + vanilla JS in one file.
- Google Fonts: Cormorant Garamond + DM Sans.
- IntersectionObserver scroll reveal, sticky-nav state, mobile menu toggle, hero parallax via rAF.
- `prefers-reduced-motion: reduce` disables all motion.

---

*Demo built by **SAOS Studio** — beautiful websites for Greek businesses, under €500.*
