# Hovoli Armenian Family Restaurant — Demo Landing Page
*Built by SAOS Studio*

A single-file, production-quality demo landing page for **Hovoli Armenian Family Restaurant**, an authentic Armenian cuisine restaurant on the seafront of Alexandroupoli, Greece. Built as a free sales preview to send to the business owner.

## Files

| File | Description |
|------|-------------|
| `index.html` | Self-contained landing page. No build step — open directly in any browser. |
| `outreach.md` | Cold email (Greek), business description, and LinkedIn connection message. |
| `README.md` | This file. |

## How to view

Double-click `index.html`, or run a local server and open it. Everything (CSS, JS) is inline; only Google Fonts and Unsplash images load from CDNs. Fully responsive (mobile-first).

---

## Scrape status: ONLINE PRESENCE ONLY (no website)

Hovoli does not have a website. Brand data was collected from:
- **TripAdvisor:** 4.3/5, 313 reviews, #6 of 109 restaurants in Alexandroupoli, Travelers' Choice award
- **Google Maps:** 4.5 stars, 1,708 reviews
- **Facebook:** @hovolirestaurant — "Καλώς ήρθατε στο Hovoli Armenian Family Restaurant! Εδώ, στην καρδιά της Αλεξανδρούπολης, η παράδοση συναντά τη γεύση σε μια αυθεντική αρμένικη εμπειρία"
- **Instagram:** @hovoli, 371 posts
- **e-restaurants.gr:** Restaurant, Steak House; Cuisine: Meat, Armenian; Price range €15-25

### Confirmed real data used in the demo
- **Business name:** Hovoli Armenian Family Restaurant
- **Location:** Λεωφ. Μεγάλου Αλεξάνδρου 50, Αλεξανδρούπολη 681 32
- **Phone:** +30 2551 037777
- **Email:** hovoli@yahoo.gr
- **Hours:** 12:00 PM - 12:30 AM daily
- **Cuisine:** Armenian, Meat, BBQ/Grill
- **Price range:** €15-25 ($$ - $$$)
- **Features:** Vegetarian friendly, Gluten free options, Accepts AMEX/Visa/Mastercard/Diners
- **Atmosphere:** Large seafront terrace, soft listening music, family-friendly

---

## Brand direction & creative decisions

- **Palette:** Deep terracotta (#B34233) for Armenian warmth, cream (#F5F0E8) backgrounds, charcoal ink (#1A1A1A), Armenian gold (#C8933E) accents, olive green (#5C6B4F) for natural touches.
- **Typography:** Playfair Display (elegant display serif evoking heritage) + Manrope (clean modern sans for readability).
- **Logo:** Text wordmark "Hovoli" + "Armenian Family Restaurant · Αλεξανδρούπολη" sub-label, top-left of a sticky navbar.
- **Mood:** Warm, heritage-rich, authentic Armenian/Mediterranean, family atmosphere with coastal elegance.
- **Key messaging:** "Η Παράδοση Συναντά τη Γεύση" (Tradition Meets Taste) — celebrating the intersection of Armenian culinary tradition and modern Alexandroupoli.

---

## Mandatory design rules — all implemented

- Scroll animations: IntersectionObserver fades + slides + pops with staggered delays
- Big sections & oversized headers: clamp()-scaled display type
- Clean, light aesthetic: cream/warm base, generous whitespace
- Sticky navbar with text wordmark top-left and blur-backdrop
- Powerful animated hero: staggered entrance + ken-burns zoom + gradient overlay + parallax
- Unique to an Armenian seafront restaurant: real Greek copy, real reviews, warm palette
- Responsive & accessible: mobile-first, semantic HTML5, alt text, aria labels, prefers-reduced-motion

### Sections included
Hero → Marquee → Our Story (stats: 1700+ Reviews · 10+ Χρόνια · #6 στην Πόλη) → Menu Highlights (Κεμπάπ / Σουτζούκ / Mixed Grill / Σαλάτες) → Gallery → "Γιατί Hovoli" values → Visit Us (address, hours, contact) → CTA Banner → Footer

---

## Image credits

All photos from **Unsplash** (free to use, no attribution required). A CSS gradient/overlay is layered behind every image slot as a guaranteed visual fallback.

---

## Tech notes
- No build step / no dependencies. Pure HTML + CSS + vanilla JS in one file.
- Google Fonts: Playfair Display + Manrope.
- Animations are CSS-driven; JS handles IntersectionObserver reveal, sticky-nav state, mobile menu toggle, and hero parallax.
- `prefers-reduced-motion: reduce` disables all motion and shows content immediately.

---

*Demo built by **SAOS Studio** — beautiful websites for Greek businesses, under EUR 500.*
