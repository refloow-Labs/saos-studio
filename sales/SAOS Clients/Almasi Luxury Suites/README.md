# Almasi Luxury Suites -- Demo Landing Page
*Built by SAOS Studio*

A single-file, production-quality demo landing page for **Almasi Luxury Suites**, a boutique guesthouse in Alexandroupoli, Greece. Built as a free sales preview to send to the business owner.

## Files

| File | Description |
|------|-------------|
| `index.html` | Self-contained landing page. No build step -- open directly in any browser. |
| `outreach.md` | Cold email (Greek), business description, and LinkedIn connection message. |
| `README.md` | This file. |

## How to view

Double-click `index.html`, or run a local server and open it. Everything (CSS, JS) is inline; only Google Fonts and Unsplash images load from CDNs. Fully responsive (mobile-first).

---

## Scrape status: N/A -- No Website

This lead has **no existing website**. All branding was inferred from the business type (boutique guesthouse) and location (Alexandroupoli, seaside city in Thrace, NE Greece).

### Confirmed real data used
- **Business name:** Almasi Luxury Suites
- **Type:** Guesthouse
- **Location:** El. Venizelou 40 (Ελ. Βενιζέλου 40), Alexandroupoli, Greece
- **Phone:** 698 099 9751 (from lead spreadsheet)
- **Google Rating:** 4.9 / 5 (8 reviews)
- **Web presence:** None (no website, the lead reason)

---

## Brand identity -- crafted for a boutique seaside guesthouse

Since no website or social media presence was found, the brand identity was designed to be distinctly different from the other Alexandroupoli accommodation demo (Avenue Luxury Apartments):

- **Palette:** Warm Mediterranean earth tones -- cream `#F6F1EB` base, terracotta `#C07B4A` as the signature accent, olive `#7B8B6A` for subtle organic warmth, warm charcoal `#2D2B28` for text. The palette evokes sun-baked stone, Mediterranean gardens, and golden-hour light. (Distinct from Avenue's navy/teal nautical palette.)
- **Fonts:** **Lora** (elegant serif with calligraphic roots, warm and readable) for headlines, **Outfit** (modern geometric sans with friendly curves) for body. A completely different pairing from Avenue (Playfair Display/DM Sans), Olympic Bakery (Fraunces/Manrope), and Galleria Armadoro (Cormorant Garamond/Jost).
- **Logo:** Text wordmark "Almasi" with "Luxury Suites · Alexandroupoli" subline, top-left sticky nav -- minimal, warm, guesthouse-appropriate.
- **Voice:** English, warm and personal, emphasizing intimacy, the "hidden gem" identity, and the meaning of "Almasi" (diamond). More personal/boutique than Avenue's modern-luxury-apartment tone.
- **Photography:** Unsplash stock -- luxury interiors, coastal scenery, Mediterranean food, nature -- to be replaced with real property photos in a client engagement.

---

## Mandatory design rules -- all implemented

- **Scroll animations:** IntersectionObserver-driven fade + slide + "pop" with staggered delays on all sections. Word-by-word headline reveals on key section headers.
- **Big sections & oversized headers:** clamp()-scaled Lora display up to ~9rem in hero, ~6.4rem in section headers.
- **Clean, light, airy aesthetic:** cream `#F6F1EB` background, generous whitespace, subtle paper-grain SVG texture overlay.
- **Sticky navbar, text wordmark top-left:** with blur-backdrop glass-morphism on scroll.
- **Powerful animated hero:** ken-burns zoom on hero image + staggered entrance animations (eyebrow, line-by-line headline, tagline, CTAs) + scroll parallax/fade + warm gradient overlay.
- **Unique to this client:** Terracotta/olive/cream palette (distinct from all other demos); "Almasi means diamond" brand story; boutique guesthouse personality (not hotel, not apartment); numbered experience cards; feature strip instead of marquee; editorial review cards.
- **Responsive & accessible:** mobile-first breakpoints, semantic HTML5 landmarks, aria-labels, `prefers-reduced-motion` support, hamburger mobile nav.

### Sections included
Hero (animated entrance + parallax) -> Feature Strip (4 key differentiators) -> About/Story ("Almasi means diamond") -> Suites (3 room types in asymmetric grid: wide + tall + full-width) -> Experience (dark section, 6 numbered experience cards) -> Explore Alexandroupoli (4 POI cards) -> Guest Reviews (3 editorial testimonials) -> CTA Banner (sunset call-to-action) -> Contact (split layout: image + info) -> Footer

---

## Image credits

All photos from **Unsplash** (free to use, no attribution required). CSS gradient overlays provide fallback behind every image.

| Slot | Unsplash photo ID |
|------|-------------------|
| Hero -- luxury resort room | photo-1566073771259-6a8506099945 |
| Story -- warm hotel interior | photo-1571896349842-33c89424de2d |
| Suite: Comfort | photo-1590490360182-c33d57733427 |
| Suite: Deluxe | photo-1611892440504-42a792e24d32 |
| Suite: Premium Sea View | photo-1582719478250-c89cae4dc85b |
| Explore: Lighthouse area | photo-1551882547-ff40c63fe5fa |
| Explore: City Beach | photo-1519046904884-53103b34b206 |
| Explore: Thracian Cuisine | photo-1504674900247-0877df9cc836 |
| Explore: Evros Delta | photo-1559827260-dc66d52bef19 |
| CTA Banner -- golden sunset | photo-1475924156734-496f6cac6ec1 |
| Contact -- hotel exterior | photo-1520250497591-112f2f40a3f4 |

URL pattern: `https://images.unsplash.com/<id>?auto=format&fit=crop&w=<width>&q=80`

---

## Differentiation from Avenue Luxury Apartments

Since both demos are accommodations in Alexandroupoli, key differentiators were intentionally designed:

| Element | Avenue Luxury Apartments | Almasi Luxury Suites |
|---------|------------------------|---------------------|
| Palette | Navy / teal / sand | Terracotta / olive / cream |
| Fonts | Playfair Display + DM Sans | Lora + Outfit |
| Personality | Modern luxury apartments | Boutique guesthouse, personal |
| Language | Greek | English |
| Unique element | Amenities grid | "Diamond" brand story + experience cards |
| Feature element | Standard marquee | Feature strip with icons |
| Room layout | 3 equal cards | Asymmetric grid (wide + tall + full-width) |
| All images | Different set | Completely different Unsplash IDs |

---

## Assumptions / placeholders

- **Suite types** (Comfort, Deluxe, Premium Sea View) and sizes (25/35/42 sqm) are plausible inferences for a boutique guesthouse -- to be confirmed with the owner.
- **Review testimonials** are representative composites from the 4.9 Google rating themes (cleanliness, hospitality, location) -- not verbatim quotes.
- **Experience features** (breakfast, concierge, wine hour, city guides, amenities, flexible check-in) are typical for quality guesthouses -- to be confirmed.
- **"Explore" distances** (8 min to lighthouse, 5 min to beach) are approximate based on the El. Venizelou 40 address location.
- All photography is stock placeholder -- replace with real property/room photos for client engagement.

---

## Tech notes
- **No build step / no dependencies.** Pure HTML + CSS + vanilla JS in one file (~40 KB).
- Google Fonts: Lora + Outfit.
- Animations are CSS-driven; JS handles only IntersectionObserver reveal, sticky-nav state, mobile menu toggle, and lightweight requestAnimationFrame hero parallax.
- `prefers-reduced-motion: reduce` disables all motion and shows content immediately.

---

*Demo built by **SAOS Studio** -- beautiful websites for Greek businesses, under EUR 500.*
