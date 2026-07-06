# Ritzi Fashion - Website

## Design Decisions

### Aesthetic Direction
The site adopts an ultra-luxury editorial menswear aesthetic, drawing from Italian fashion house heritage and the refined sensibility of Kolonaki, Athens. The design language is deliberately restrained yet dramatic — using deep blacks, subtle gold accents, and generous negative space to evoke the experience of stepping into a high-end boutique. The overall tone channels fashion editorial layouts: typographic hierarchy, cinematic atmosphere, and meticulous spatial composition. Every element breathes, nothing feels crowded, and the gold accents are used sparingly to maintain their preciousness.

### Color Palette
- **Rich Black (#0a0a0a)** — Primary background; creates the "dark room" gallery atmosphere essential to luxury presentation
- **Deep Black (#050505)** — Used for loader and alternating sections to add depth without contrast jumps
- **Off-White (#f5f2ed)** — Primary text color; warmer than pure white, referencing Italian parchment and aged linen
- **Cream (#ebe6de)** — Secondary warm tone for subtle differentiation
- **Muted Gold (#b8a06a)** — The signature accent; used for labels, highlights, interactive states, and decorative elements. Deliberately desaturated to avoid looking "cheap gold"
- **Gold Light (#d4c494)** — For pull-quotes and subtle highlights
- **Gold Dark (#96804a)** — For borders and secondary gold elements, adds tonal depth
- **Charcoal (#2a2a2a)** — Alternating section backgrounds; provides rhythm without breaking the dark atmosphere
- **Warm Grey (#8a8580)** — Secondary text; keeps hierarchy clear while staying warm-toned
- **Light Grey (#c5c0b8)** — Tertiary text and detail elements

### Typography
- **Cormorant Garamond** (Display/Headings) — A refined, high-contrast serif with roots in Claude Garamont's work. Its elegant italics and thin weights perfectly capture Italian tailoring sophistication. Used at large sizes with tight line-height for editorial impact.
- **Outfit** (Body/UI) — A geometric sans-serif with subtle warmth and excellent legibility at small sizes. Its light weights (200-300) complement the Cormorant without competing, while its clean letter-spacing at small caps makes it ideal for labels and navigation.

### Layout & Structure
1. **Loading Screen** — Minimal brand reveal with animated gold line; sets the pace and tone
2. **Shipping Banner** — Functional top bar with free shipping / returns info (gold background, builds trust immediately)
3. **Fixed Navigation** — Logo with gold accent on the "i", desktop nav links, E-Shop CTA button, hamburger for mobile; transitions to frosted-glass on scroll
4. **Full-Viewport Hero** — Three-line title with staggered reveal animation, gold italic accent on "Πολυτέλεια", scroll indicator; subtle grid pattern overlay adds texture
5. **Brands Showcase** — 2x4 grid of brand cards separated by 1px gold-tinted borders; each card shows brand name and origin city. Hover reveals radial gold glow
6. **Scrolling Marquee** — Horizontal infinite scroll announcing SS26 collection; creates visual rhythm between sections
7. **Product Categories Grid** — Four cards (Suits, Shoes, Accessories, Eveningwear) with unique gradient backgrounds, custom SVG icons, hover-reveal arrow indicators
8. **Brioni Bespoke Section** — Split layout with decorative visual panel (diagonal pinstripe pattern, large watermark text) alongside detailed bespoke service description
9. **About / Store History** — Two-column layout with editorial quote, founding narrative, and animated counter stats (40+ years, 8 fashion houses, 1 location)
10. **Contact Section** — Detailed contact information with icon boxes alongside a stylized map placeholder showing Kolonaki location
11. **Footer** — Brand name, social links (Facebook, Instagram), copyright, and utility links

### Key Design Details
- Film grain overlay (SVG noise filter at 2.5% opacity) across the entire viewport adds analog texture and prevents the "too clean digital" look
- Decorative gold horizontal rules between every section create visual cadence
- Loading animation uses a sliding gold line that sweeps across, setting a cinematic tone
- Hero uses layered backgrounds: gradient base + subtle grid pattern + radial vignette for depth
- All scroll-reveal animations use a custom exponential ease-out curve for luxurious motion feel
- Navigation transitions from transparent to frosted-glass (backdrop-filter blur) on scroll
- Mobile menu uses staggered fade-in animation for each link
- Brand cards use 1px separator grid technique (gap: 1px on colored background) for a refined jewelry-case effect
- Category cards have unique gradient colorways and custom SVG icons (not generic icon fonts)
- Bespoke section visual panel includes a 45-degree pinstripe pattern at very low opacity, referencing fabric patterns
- Counter animation on stats triggers on scroll intersection
- Hero content parallax: subtle upward scroll with fade for depth perception
- All interactive elements use the gold palette for hover states, maintaining brand consistency
- Scrollbar is custom-styled to match the gold/black palette
- Greek language throughout with bilingual touches (brand names in English/Italian, section subtitles)
- Responsive breakpoints at 600px, 768px, and 1024px with mobile-first approach

### Skipped / Notes
- Original site URL: http://www.ritzi.gr
- Client: NINO MODA ΑΝΩΝΥΜΗ ΕΜΠΟΡΙΚΗ ΑΝΤΙΠΡΟΣΩΠΕΥΤΙΚΗ ΚΑΙ ΕΙΣΑΓΩΓΙΚΗ ΕΤΑΙΡΕΙΑ ΕΝΔΥΜΑΤΩΝ ΜΟΝΟΠΡΟΣΩΠΗ ΑΕ
- Store hours shown are estimated typical Kolonaki retail hours; client should confirm
- Category and bespoke links point to ritzi.gr; update with specific product page URLs when available
- No product images used — the design uses gradient backgrounds and SVG icons as elegant placeholders that the client can replace with photography
- The "Since 1985" founding year is used based on the "40+ years" positioning; client should confirm exact founding date
