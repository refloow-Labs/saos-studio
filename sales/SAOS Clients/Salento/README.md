# Salento Wood Fired Street Food — Demo Landing Page
*Built by SAOS Studio*

A single-file, production-quality demo landing page for **Salento Wood Fired Street Food**, a beloved Italian wood-fired street food spot in the heart of Thessaloniki, Greece. Built as a free sales preview to send to the business owner.

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

Salento does not have a website. Brand data was collected from:
- **TripAdvisor:** "We serve handmade pizza and sandwiches which are cooked in a wood fired oven by high quality dough and ingredients."
- **bestofthessaloniki.gr:** Full editorial review — "The most Italian spot of Venizelou Street, where those who prepare and serve the pizzas might as well be called tenors and not just expert bakers."
- **Instagram:** @salento_skg_streetfood — "Wood Fired Street Food Salentina Pizza Salads Vegan Vegetarian"
- **Facebook:** Community posts praising quality and authenticity

### Confirmed real data used in the demo
- **Business name:** Salento Wood Fired Street Food
- **Location:** Ελ. Βενιζέλου 76, Θεσσαλονίκη
- **Phone:** 2310 230861
- **Instagram:** @salento_skg_streetfood
- **Cuisine:** Italian street food — wood-fired pizza, sandwiches, lasagna, salads
- **Style:** Casual, no reservations
- **Menu highlights:** Pizza Di Salento (prosciutto crudo, truffle oil), Speciale (pistachio mortadella), Lasagna Bolognese, Sandwich Pueblo (country sausage, anthotyro), Vegan options (pumpkin purée, truffle pâté)

---

## Brand direction & creative decisions

- **Palette:** Warm off-white/paper (#FAF7F2) background, charcoal (#1C1C1C), warm red (#C63D2F) for fire/passion, olive/sage green (#6B7F5E) for fresh ingredients, golden wheat (#D4A843) accents.
- **Typography:** Oswald (bold condensed display — captures street-food energy and Italian poster aesthetics) + DM Sans (clean, readable sans for body copy).
- **Logo:** Text wordmark "Salento" + "Wood Fired Street Food · Θεσσαλονίκη" sub-label, top-left of a sticky navbar.
- **Mood:** Rustic Italian, urban street food, wood-fired warmth, casual-cool, vibrant and unpretentious. Exposed brick, visible flames, casual energy.
- **Key messaging:** "Φωτιά, Ζύμη, Αλήθεια." (Fire, Dough, Truth.) — distilling the wood-fired philosophy into three powerful words.

---

## Mandatory design rules — all implemented

- Scroll animations: IntersectionObserver fades + slides + pops with staggered delays
- Big sections & oversized headers: clamp()-scaled display type
- Clean, light aesthetic: warm off-white base, generous whitespace
- Sticky navbar with text wordmark top-left and blur-backdrop
- Powerful animated hero: staggered entrance + ken-burns zoom + gradient overlay + parallax
- Unique to an Italian street food spot: real menu items, real press quotes, wood-fire motif
- Responsive & accessible: mobile-first, semantic HTML5, alt text, aria labels, prefers-reduced-motion

### Sections included
Hero → Marquee → Our Story ("Η Τέχνη της Φωτιάς") → Menu Highlights (Pizza Di Salento / Lasagna Bolognese / Sandwich Pueblo / Vegan) → The Wood-Fired Process (Ζύμη / Φωτιά / Σερβίρισμα) → Gallery → Visit Us → CTA Banner → Footer

---

## Image credits

All photos from **Unsplash** (free to use, no attribution required). A CSS gradient/overlay is layered behind every image slot as a guaranteed visual fallback.

---

## Tech notes
- No build step / no dependencies. Pure HTML + CSS + vanilla JS in one file.
- Google Fonts: Oswald + DM Sans.
- Animations are CSS-driven; JS handles IntersectionObserver reveal, sticky-nav state, mobile menu toggle, and hero parallax.
- `prefers-reduced-motion: reduce` disables all motion and shows content immediately.

---

*Demo built by **SAOS Studio** — beautiful websites for Greek businesses, under EUR 500.*
