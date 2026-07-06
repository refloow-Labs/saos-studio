# Avenue Luxury Apartments — Demo Landing Page
*Built by SAOS Studio*

A single-file, production-quality demo landing page for **Avenue Luxury Apartments**, luxury short-term rental apartments in Alexandroupoli, Greece. Built as a free sales preview to send to the business owner.

## Files

| File | Description |
|------|-------------|
| `index.html` | Self-contained landing page. No build step — open directly in any browser. |
| `outreach.md` | Cold email (Greek), business description, and LinkedIn connection message. |
| `README.md` | This file. |

## How to view

Double-click `index.html`, or run a local server and open it. Everything (CSS, JS) is inline; only Google Fonts and Unsplash images load from CDNs. Fully responsive (mobile-first).

---

## Scrape status: N/A — No Website

This lead has **no existing website**. All branding was inferred from the business type (luxury apartments) and location (Alexandroupoli, seaside city in Thrace, NE Greece).

### Confirmed real data used
- **Business name:** Avenue Luxury Apartments
- **Location:** Λεωφ. Μάκρης 58, Αλεξανδρούπολη 681 00
- **Phone:** 697 657 4915 (from lead spreadsheet)
- **Google Rating:** 4.5 / 5 (130 reviews)
- **Category:** Accommodation / Luxury Apartments

---

## Brand identity — inferred for a seaside luxury property

Since no website or social media presence was found, the brand identity was crafted to reflect:

- **Palette:** Deep midnight navy (#0C1A2B) as the anchor dark, ocean teal (#2A7B88) as the signature accent, warm sand (#E6D9C7) and cream (#FAF8F5) for light sections, copper (#B87D5E) for subtle warmth. The palette evokes Aegean sea + coastal stone + golden hour.
- **Fonts:** **Playfair Display** (editorial serif, luxury connotation) for headlines, **DM Sans** (modern geometric sans) for body — a pairing distinct from both Olympic Bakery (Fraunces/Manrope) and Galleria Armadoro (Cormorant Garamond/Jost).
- **Logo:** Text wordmark "Avenue Luxury" with "Apartments · Αλεξανδρούπολη" subline, top-left sticky nav — clean, minimal, hospitality-appropriate.
- **Voice:** Greek language throughout (lang="el"), warm but polished, emphasizing comfort, location, and local exploration.
- **Photography:** Unsplash stock — luxury interiors, coastal Mediterranean scenery, food, nature — to be replaced with real property photos in a client engagement.

---

## Mandatory design rules — all implemented

- ✅ **Scroll animations:** IntersectionObserver-driven fade + slide + "pop" with staggered delays
- ✅ **Big sections & oversized headers:** clamp()-scaled Playfair Display up to ~6.8rem in hero
- ✅ **Clean, light, airy aesthetic:** cream/sand base, generous whitespace, subtle paper-grain texture
- ✅ **Sticky navbar, text wordmark top-left:** with blur-backdrop glass-morphism on scroll
- ✅ **Powerful animated hero:** ken-burns zoom on hero image + staggered entrance animations + scroll parallax/fade + dual CTAs
- ✅ **Unique to this client:** Hospitality-specific sections (suites showcase, amenities grid, explore-the-city POIs, guest reviews), navy/teal/sand palette, Αλεξανδρούπολη-specific content (Lighthouse, beach, Evros Delta, Thracian cuisine)
- ✅ **Responsive & accessible:** mobile-first, semantic HTML5, aria-labels, prefers-reduced-motion support, hamburger mobile nav

### Sections included
Hero (animated entrance + parallax) → Marquee (scrolling feature strip) → About/Story (property intro + stats) → Suites (3 apartment types with hover reveals) → Amenities (6 features with icons, dark section) → Explore Alexandroupoli (4 POI cards) → Guest Reviews (3 testimonials) → CTA Banner (booking call-to-action with sunset background) → Footer (contact, links, socials)

---

## Image credits

All photos from **Unsplash** (free to use, no attribution required). CSS gradient overlays provide fallback behind every image.

| Slot | Unsplash photo ID |
|------|-------------------|
| Hero — luxury apartment | photo-1582719508461-905c673771fd |
| About — modern interior | photo-1600607687939-ce8a6c25118c |
| Suite: Deluxe Studio | photo-1631049307264-da0ec9d70304 |
| Suite: Superior Apartment | photo-1522771739844-6a9f6d5f14af |
| Suite: Premium Suite | photo-1560448204-e02f11c3d0e2 |
| Amenities — living room | photo-1600585154340-be6161a56a0c |
| Explore: Lighthouse | photo-1501446529957-6226bd447c46 |
| Explore: Beach | photo-1507525428034-b723cf961d3e |
| Explore: Gastronomy | photo-1414235077428-338989a2e8c0 |
| Explore: Evros Delta | photo-1476514525535-07fb3b4ae5f1 |
| CTA — sunset sea | photo-1506929562872-bb421503ef21 |

URL pattern: `https://images.unsplash.com/<id>?auto=format&fit=crop&w=<width>&q=80`

---

## Assumptions / placeholders

- **Apartment types** (Deluxe Studio, Superior Apartment, Premium Suite) are plausible inferences for a luxury apartments business — to be confirmed with the owner.
- **Review testimonials** are representative composites from the 130 Google reviews theme (cleanliness, location, hospitality) — not verbatim quotes.
- **Amenities** (WiFi, smart check-in, parking, kitchen, A/C, Smart TV) are standard for the category — to be confirmed.
- **"Explore" distances** (5 min to lighthouse, 3 min to beach) are approximate based on the Λεωφ. Μάκρης 58 address.
- All photography is stock placeholder — replace with real property/room photos for client engagement.

---

## Tech notes
- **No build step / no dependencies.** Pure HTML + CSS + vanilla JS in one file (~40 KB).
- Google Fonts: Playfair Display + DM Sans.
- Animations are CSS-driven; JS handles only IntersectionObserver reveal, sticky-nav state, mobile menu toggle, and lightweight requestAnimationFrame hero parallax.
- `prefers-reduced-motion: reduce` disables all motion and shows content immediately.

---

*Demo built by **SAOS Studio** — beautiful websites for Greek businesses, under EUR 500.*
