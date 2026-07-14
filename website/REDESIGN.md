# SAOS Studio — Redesign spec ("rentalview in black")

Approved 2026-07-02. Full aesthetic pivot from dark editorial → clean, static, light,
bold-Greek, high-contrast. Black where the reference uses blue. Keep React structure
and existing Greek copy.

## Palette (light)
- Page bg `#ffffff`; alt sections `#f5f5f4`
- Text near-black `#0a0a0a`; muted `#6b7280`
- Accent = **black `#0a0a0a`**
- CTA cards = solid black, white text, white pill button
- Borders `rgba(0,0,0,0.08)`

## Typography
- Single family: **Manrope** (400/500/600/700/800). Drop Cormorant, Roboto Flex, Syne.
- Headings: Manrope 800, mixed-case (NOT all-caps), tonos preserved, tight leading,
  large. Emphasis (`<em>`) rendered muted gray for a monochrome two-tone echo of the
  reference's colored headline segment.

## Static
- Remove GradientUniverse, GrainOverlay, Preloader, Lenis smooth-scroll.
- ScrollReveal → static pass-through (no motion). Strip Framer entrance/hover animations.
- Alternating white / light-gray sections, generous whitespace, rounded corners.
- Approach section → numbered `01 / 02 …` chips like the reference.

## Portfolio (new "Έργα" section)
- Copy each client `index.html` → `public/work/<slug>/index.html`
  (almasi, ammos, avenue, dental-home, gi-kai-ydor, salento).
- Grid of 6 cards: screenshot thumbnail + name + tag; opens `/work/<slug>/` in new tab.
- Add nav + footer link.

## Section order
Hero → Portfolio → Services → Approach → Manifesto → Contact → Footer

## Out of scope
Instagram account (deferred by user). Logo unchanged (new one coming); use dark logo on
light bg.
