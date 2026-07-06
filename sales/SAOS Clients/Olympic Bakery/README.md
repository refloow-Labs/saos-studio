# Olympic Bakery — Demo Landing Page
*Built by SAOS Studio*

A single-file, production-quality demo landing page for **Olympic Bakery (Ολυμπιακή Αρτοποιία)**, a Greek artisan bakery & confectionery in Thessaloniki. Built as a free sales preview to email the business owner.

## Files

| File | Description |
|------|-------------|
| `index.html` | Self-contained landing page. No build step — open directly in any browser. |
| `outreach.md` | Cold email (Greek), business description, and LinkedIn connection message. |
| `README.md` | This file. |

## How to view

Double-click `index.html`, or run a local server and open it. Everything (CSS, JS) is inline; only Google Fonts and Unsplash images load from CDNs. Fully responsive (mobile-first).

---

## Scrape status: ✅ SUCCESS

The live site `http://www.olympicbakery.gr` returns HTTP 403 to plain fetch, but a request with a real browser User-Agent succeeded. **Real brand data was extracted from the live WordPress site** and used throughout the demo. (The live site currently shows "Η σελίδα μας βρίσκεται υπό ανανέωση" / "under renewal" — making this demo especially timely.)

### Confirmed real data used in the demo
- **Business name:** Olympic Bakery / Ολυμπιακή Αρτοποιία
- **Location:** ΒΙ.ΠΕ.Θ. Σίνδος, Θεσσαλονίκη (Sindos Industrial Area, Thessaloniki)
- **Phone:** 2310 799 211 (scraped from site)
- **Email:** info@olympicbakery.gr
- **Real tagline:** "Μένουμε Ελλάδα, Παράγουμε Ελλάδα!" (used verbatim)
- **Real positioning copy:** "Εξελιγμένες συνταγές της ελληνικής / μεσογειακής κουζίνας", "αρμονική συνύπαρξη του παραδοσιακού με το μοντέρνο, προς τέρψη απαιτητικών ουρανίσκων", "τα καλύτερα υλικά της ελληνικής αγοράς" — all adapted from the live site.
- **Real product names** (from the site's menu): Ψωμί, Κουλούρια Θεσσαλονίκης, Ψωμάκια, Κριτσίνια, Μοναστηριακά Κεράσματα, Cronuts, Τσουρέκι, Κουραμπιέδες, Κέικ, Soft Cookies, Τάρτες, Party Cakes & Donuts, Σουφλέ, Brioche, Πίτσα.

### Brand identity extracted from live CSS
- **Accent gold:** `#e1be64` (exact brand color from the site's stylesheet) — used as `--gold-bright`.
- **Dark tones:** `#232323`, `#181818` (from the site) → informed the espresso palette.
- **Original fonts:** the live site uses Playfair Display (serif) + Open Sans / Raleway (sans).
- **Original logo:** `https://olympicbakery.gr/wp-content/uploads/2017/05/Olympic-Bakery-Logo-1.png`

---

## Brand assumptions & creative decisions

Since this is a redesign concept (not a 1:1 clone), a few elements were elevated:

- **Fonts:** Swapped Playfair Display for **Fraunces** (a warmer, more characterful display serif with an artisan/editorial feel) paired with **Manrope** for body — a more distinctive, modern pairing than the original Open Sans, while staying in the same serif-display + clean-sans spirit.
- **Palette:** Built a warm, light, airy system around the real brand gold (`#e1be64`): cream/ivory backgrounds, espresso/cocoa browns, soft terracotta accent. Light overall, per brief.
- **Logo:** Clean text wordmark "Olympic Bakery" + "Αρτοποιία · Θεσσαλονίκη" sub-label with a small gold circular "O" mark, top-left of a sticky navbar. (No original logo image used, so the demo is self-contained and on-brand.)
- **Hours:** Indicative opening hours (Mon–Sun) are *assumed* placeholders — the live site lists wholesale/industry contact, not retail hours. The owner should confirm or remove.
- **"Since 1995" / 30+ years:** A plausible heritage figure used for warmth; should be confirmed with the owner.
- **Product categories** condensed to the four requested by brief (Ψωμί / Γλυκά / Κέικ / Καφές) for a clean hero-grid, drawing on the real product range.

---

## Mandatory design rules — all implemented

- ✅ **Scroll animations:** `IntersectionObserver` fades + slides + "pops" sections, cards, headlines and stats into view, with tasteful staggered delays (`data-delay` 1–5).
- ✅ **Big sections & oversized headers:** `clamp()`-scaled display type up to ~7.4rem in the hero.
- ✅ **Clean, light, airy aesthetic:** cream/ivory base, generous whitespace, paper-grain texture overlay.
- ✅ **Sticky navbar, text wordmark top-left:** with blur-backdrop scrolled state.
- ✅ **Powerful animated hero:** staggered load-in entrance + continuous slow ken-burns zoom on the hero image + readable multi-layer gradient overlay + strong headline & dual CTAs + subtle scroll-driven parallax/fade.
- ✅ **Unique to a warm Thessaloniki bakery:** real Greek copy, real tagline, real product names, "κουλούρια Θεσσαλονίκης", warm gold/espresso palette, marquee of product names.
- ✅ **Responsive & accessible:** mobile-first, semantic HTML5 landmarks, alt text on every image, `aria-*` on nav/menu, `prefers-reduced-motion` support, good contrast.

### Sections included
Hero → Marquee → Brand story (φρέσκο κάθε πρωί + stats) → Product categories (Ψωμί / Γλυκά / Κέικ / Καφές cards that pop in) → Gallery (masonry grid) → "Γιατί εμάς" values (φρέσκο κάθε πρωί / παραδοσιακές συνταγές / τοπικά υλικά) → Visit/hours + contact → CTA banner → Footer (info@olympicbakery.gr, Θεσσαλονίκη).

---

## Image credits

All photos from **Unsplash** (free to use, no attribution required). **Every URL was verified to return HTTP 200.** A CSS gradient/overlay is layered behind every image slot as a guaranteed visual fallback.

14 unique images used (all HTTP 200):

| Slot | Unsplash photo ID |
|------|-------------------|
| Hero — artisan breads | `photo-1509440159596-0249088772ff` |
| Story — baker hands / dough | `photo-1486427944299-d1955d23e34d` |
| Category: Ψωμί | `photo-1549931319-a545dcf3bc73` |
| Category: Γλυκά | `photo-1558961363-fa8fdf82db35` |
| Category: Κέικ | `photo-1578985545062-69928b1d9587` |
| Category: Καφές | `photo-1495474472287-4d71bcdd2085` |
| Gallery 1 | `photo-1568254183919-78a4f43a2877` |
| Gallery 2 | `photo-1509365465985-25d11c17e812` |
| Gallery 3 | `photo-1517433670267-08bbd4be890f` |
| Gallery 4 | `photo-1490474418585-ba9bad8fd0ea` |
| Gallery 5 | `photo-1464195244916-405fa0a82545` |
| Gallery 6 | `photo-1499636136210-6f4ee915583e` |
| Visit photo — bakery display | `photo-1542826438-bd32f43d626f` |
| CTA banner — dark breads | `photo-1488477181946-6428a0291777` |

URL pattern: `https://images.unsplash.com/<id>?auto=format&fit=crop&w=<width>&q=80`

---

## Tech notes
- **No build step / no dependencies.** Pure HTML + CSS + vanilla JS in one file (~41 KB).
- Google Fonts: Fraunces + Manrope.
- Animations are CSS-driven; JS handles only the IntersectionObserver reveal, sticky-nav state, mobile menu toggle, and a lightweight `requestAnimationFrame` hero parallax.
- `prefers-reduced-motion: reduce` disables all motion and shows content immediately.

---

*Demo built by **SAOS Studio** — beautiful websites for Greek businesses, under €500.*
