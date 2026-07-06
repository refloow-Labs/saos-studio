# Galleria Armadoro — Landing Page Concept (SAOS Studio)

A single-file, production-quality landing-page concept built as a free sales preview for **Galleria Armadoro** (contemporary fine jewellery, Athens, Greece). Crafted by **SAOS Studio**.

## Files

- **index.html** — self-contained landing page. No build step. Opens directly in any modern browser.
- **outreach.md** — cold email (English), business description, and LinkedIn connection message.
- **README.md** — this file.
- `.firecrawl/` — raw scrape output used for enrichment (reference only; not part of the deliverable).

## What was built

A light, editorial, gallery-like landing page leaning into the brand's witty, sun-soaked voice:

1. **Sticky navbar** — text wordmark "Galleria Armadoro · Fine Jewellery · Athens" top-left; blurs/condenses on scroll; full mobile slide-in menu.
2. **Hero** — full-bleed editorial image with continuous **ken-burns** motion, masked-line entrance animation on load (tagline-as-headline "Jewellery you don't take off"), subtle scroll **parallax** + fade on the hero content, and dual CTAs.
3. **Marquee divider** — infinite scroll of brand keywords (Waterproof · Gold Vermeil · Sterling Silver · Made in Athens …).
4. **Brand story** — "Luxury that lives in the water" — waterproof everyday luxury, made in Greece; circular gold badge; image with hover scale.
5. **Signature collections** — asymmetric 12-col grid of cards that **pop in** (fade + slide + scale, staggered): Ear Stories, Kyma, Speira, Snake, Summer Brides (Bridal Edit). Hover reveals descriptions + animated corner button.
6. **The Craft / Materials** — gold vermeil, sterling silver & brass, waterproof-by-design, as numbered editorial spec rows.
7. **Lookbook** — dark "Jewellery in the Wild" section with a mixed-aspect gallery grid; captions use real product names (Gaga Hoops, Mini Tinas, Clara Ring, Gilda Bracelet, Two-Tone Allegras).
8. **Visit the gallery** — real Athens address (8 Ktena Str., 105 63 Athens), hours, WhatsApp, email, Maps + WhatsApp CTAs.
9. **Footer** — contact, shop/house columns, SAOS Studio credit.

### Mandatory design rules — coverage
- **Animated on scroll**: IntersectionObserver adds fade + slide + "pop" with staggered `data-delay` and word-by-word split headline reveals. ✓
- **Big sections & oversized editorial headers** (Cormorant Garamond display, up to ~10rem). ✓
- **Clean / light / airy**: ivory `#F7F4EF` background, near-black ink, refined gold `#C0A062`; generous whitespace; subtle film-grain texture. ✓
- **Text wordmark, top-left, sticky navbar**. ✓
- **Powerful animated hero**: load entrance + continuous ken-burns + scroll parallax + overlay + tagline headline & CTA. ✓
- **Unique / editorial / high-jewellery** — asymmetric grids, marquee, numbered specs, italic accents. ✓
- **Responsive & accessible**: mobile-first breakpoints, semantic HTML, alt text / aria-labels, `prefers-reduced-motion` honored, high contrast. ✓

## Typography & palette
- Display: **Cormorant Garamond** (high-contrast serif, italic gold accents).
- Body / labels: **Jost** (refined geometric sans, generous letter-spacing on labels).
- Palette: ivory `#F7F4EF`, paper `#FBFAF7`, ink `#16140F`, gold `#C0A062` / deep gold `#A8853F`.
- Loaded via Google Fonts CDN. No other build dependencies (vanilla JS only).

## Brand data & scrape status
- **Scrape: SUCCESS.** Source `https://galleria-armadoro.com` scraped via the firecrawl-scrape skill (home + contact page); site map pulled for collection slugs. Raw output saved under `.firecrawl/`.
- **Real details used from the scrape:**
  - Tagline: "Made for salty skin, late lunches and jewellery you don't take off."
  - Brand voice / section names: "Summer Ear Stories", "Jewellery in the Wild", "the stacks that made it out of the jewellery box", "Wrist Behaviour", "It's Complicated", "badly behaved plans", "Two-Tone Edit".
  - Real product names: Mini Tinas, Gaga Hoops, Vittoria Huggies, Clara Ring, Gilda Bracelet, Allegra (Two-Tone) hoops, Evil Eye Anklet.
  - Store address: **8 Ktena Str., 105 63 Athens, Greece**; Hours **Mon–Fri 10:00–17:00**; WhatsApp/phone **+30 694 555 3996**; Maps share link.
- **Assumptions / fallbacks:**
  - Email `achouliaras@galleriasilver.gr` taken from the brief (not re-surfaced on the contact page during scrape).
  - Collection descriptions (Kyma, Speira, Snake, Bridal) are written by SAOS as a fresh concept — they reflect the brand's themes but are not verbatim copy.
  - All photography is **stock placeholder** (Unsplash), to be swapped for Galleria Armadoro's own product/campaign imagery in a real engagement.
  - "Since · Athens" badge omits a founding year (unknown); a tasteful CSS gradient/overlay is the guaranteed fallback if any image fails to load.

## Image credits (Unsplash) — all verified HTTP 200

Format: `https://images.unsplash.com/<id>?auto=format&fit=crop&w=<width>&q=80`

| Slot | Photo ID |
| --- | --- |
| Hero (also lookbook) | photo-1515562141207-7a88fb7ce338 |
| Brand story portrait | photo-1603561591411-07134e71a2a9 |
| Collection — Ear Stories | photo-1611652022419-a9419f74343d |
| Collection — Kyma / lookbook | photo-1602173574767-37ac01994b2a |
| Collection — Speira / lookbook | photo-1599643478518-a784e5dc4c8f |
| Collection — Snake | photo-1535632066927-ab7c9ab60908 |
| Collection — Bridal | photo-1573408301185-9146fe634ad0 |
| Craft / materials | photo-1617038260897-41a1f14a8ca0 |
| Lookbook — Gaga Hoops | photo-1610694955371-d4a3e0ce4b52 |
| Lookbook — Clara Ring | photo-1605100804763-247f67b3557e |
| Visit — Athens / Mediterranean | photo-1500530855697-b586d89ba3ee |

11 unique images, all returning HTTP 200 (verified with `curl -sI`). Images are decorative/illustrative placeholders licensed under the Unsplash License.

## How to view
Open `index.html` directly in a browser (double-click), or serve locally:
```
cd "Galleria Armadoro" && python3 -m http.server 8000
# then visit http://localhost:8000
```

---
Concept and design by **SAOS Studio**. Not affiliated with Galleria Armadoro — this is an unsolicited free preview.
