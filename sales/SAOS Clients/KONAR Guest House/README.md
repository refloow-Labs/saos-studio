# KONAR Guest House — Demo Landing Page
*Built by SAOS Studio*

A single-file, production-quality demo landing page for **KONAR Guest House**, a boutique guesthouse in Alexandroupoli, Thrace, Greece. Built as a free sales preview to send to the business owner.

## Files

| File | Description |
|------|-------------|
| `index.html` | Self-contained landing page. No build step — open directly in any browser. |
| `outreach.md` | Cold email (Greek), business description, and LinkedIn connection message. |
| `README.md` | This file. |

## How to view

Double-click `index.html`, or run a local server and open it. Everything (CSS, JS) is inline; only Google Fonts and Unsplash images load from CDNs. Fully responsive (mobile-first).

---

## Research status: Google Maps only

The business has **no website**. Brand identity was inferred from:
- **Google Maps listing:** KONAR Guest House, Χαρ. Τρικούπη 4, Αλεξανδρούπολη
- **Google rating:** 5.0 (5 reviews)
- **Business type:** Guesthouse / boutique accommodation
- **Location context:** Alexandroupoli — seaside city in NE Greece (Thrace), known for the historic lighthouse, the Evros Delta, and Thracian cuisine

### Brand identity (inferred)
- **Palette:** Forest green (`#1B3D2F`) / gold accent (`#C5A55A`) / warm stone / cream — earthy, refined, fitting for a Thracian boutique guesthouse
- **Fonts:** Cormorant Garamond (serif display) + Inter (body sans) — an elegant yet modern pairing
- **Logo:** Clean text wordmark "KONAR" with "Guest House · Αλεξανδρούπολη" sub-label, top-left of sticky navbar
- **Tone:** Authentic hospitality, warmth, Thracian tradition meets modern comfort

---

## Sections

1. **Hero** — Full-screen hero with parallax image, staggered entrance animation, "Καλωσήρθατε στο KONAR" headline, booking + rooms CTAs
2. **Marquee** — Scrolling ticker with key selling points (5.0 Google, central location, free WiFi, breakfast, near lighthouse)
3. **About** — Brand story ("Φιλοξενία με ψυχή στη Θράκη"), 5.0 Google badge, key stats
4. **Rooms** — Grid of 3 room types (Superior, Deluxe Suite, Family) with hover overlays
5. **Experience** — Guest experience highlights (homemade breakfast, late checkout, central location)
6. **Explore** — Alexandroupoli attractions (lighthouse, Evros Delta, old town, Thracian cuisine)
7. **Location** — "Getting here" section with transport routes (airport, KTEL, beach, train station), interactive map card with animated pin
8. **Reviews** — Google review highlights
9. **CTA** — Full-width call to action with booking prompt
10. **Footer** — Links, address, social icons, SAOS Studio credit

---

## Mandatory design rules — all implemented

- Scroll animations: `IntersectionObserver` fades + slides + "pops" sections into view with staggered delays + animated counter for stats
- Big sections & oversized headers: `clamp()`-scaled display type up to hero size
- Clean, light, airy aesthetic: cream base, generous whitespace, paper-grain texture overlay
- Sticky navbar, text wordmark top-left: with blur-backdrop scrolled state
- Powerful animated hero: staggered entrance + ken-burns parallax zoom + gradient overlay + dual CTAs
- Mobile responsive: hamburger menu, grid reflows, tested at 560px/880px/1080px breakpoints
- Prefers-reduced-motion: all animations disabled when user preference is set
