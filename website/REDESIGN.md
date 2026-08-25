# SAOS Studio — Design spec

**Supersedes** the July 2026 "rentalview in black" spec, which mandated a fully static,
strictly monochrome page. That is no longer the brief: the site is being reconstructed as a
conversion-focused funnel with carousels, an application modal and subtle scroll motion.
Where the two disagree, this document wins.

Layout principles are informed by thefreewebsiteguys.com — **section order and CTA cadence
only**. No text, markup, imagery, colour or component design is taken from it.

## The offer this site sells

Two entry points, in ascending order of commitment:

1. **Free website evaluation** — email field in the hero, redirects to PageSpeed Insights.
2. **Free website application** — a modal form, with a stated (~20%) acceptance rate.

Paid services are presented **without prices**. See risk R1 in the reconstruction plan:
`src/lib/services.ts` still holds the old €46/€52/€83 tiers and feeds the `AggregateOffer`
JSON-LD. It has not been removed, and that decision is still open.

## Palette

| Token | Value | Role |
|---|---|---|
| `bg` | `#ffffff` | page |
| `surface` | `#f5f5f4` | alternating light sections |
| `break` / `break-2` | `#0a0a0a` / `#161616` | full-bleed dark colour breaks |
| `ink` / `text` | `#0a0a0a` | body + headings |
| `muted` | `#6b7280` | secondary text |
| `border` | `rgba(0,0,0,0.08)` | hairlines |
| **`warm`** | **`#FDB226`** | **the single accent** |
| `warm-dim` / `warm-soft` | `#E89F14` / `#FFF4DC` | accent hover / accent ground |

Black remains the structural colour. `warm` is the page's one non-monochrome signal and is
reserved for **conversion CTAs, focus rings, emphasis words inside dark breaks, and the
hand-drawn doodles**. It is never a background for body text: `#FDB226` behind white text
fails contrast, which is why `.btn-accent` sets black text.

Dark breaks must stay outnumbered by light sections or the rhythm stops reading as a break.

## Typography

Manrope only, self-hosted in `public/fonts/` with `unicode-range` per subset. Do **not**
reintroduce the Google Fonts stylesheet.

- `.text-display` — oversized Greek banner word ("ΕΡΓΑ"). Authored uppercase **in the
  markup**, never via `text-transform`: Greek drops the tonos in all-caps and browser locale
  casing is not worth trusting.
- `.text-headline` — section h2s. Weight 800, tight tracking, mixed-case with tonos preserved.
  `<em>` renders muted gray on light, `warm` inside a dark break.
- Body 400/500 at `1.75` leading, measure capped around 65ch.

## Components

Restyle **through** these three layers, not with one-off utilities:
tokens in `tailwind.config.js` → classes in the `@layer components` block of `src/index.css`
→ section shells in `src/components/Chapter.tsx`.

- `Chapter` — full-bleed section + `max-w-6xl` container. `tone: 'white' | 'gray' | 'dark'`.
  Owns the page's background alternation and its `py-24 md:py-32` vertical rhythm.
- `SectionOpener` — banner word (a `div`) + the real `h2` + optional body + optional doodle.
  Kept separate so the document outline reads as descriptive headings, not one-word labels.
- `Doodle` — six inline-SVG hand-drawn marks, all `aria-hidden`, tinted from `warm`.
- `Reveal` — scroll reveal. Hidden state lives on a `data-reveal` attribute applied only
  after mount, so prerendered HTML is visible without JS.
- `Placeholder` — loud dashed marker for anything invented. Not stripped in production.
- Buttons: `.btn-primary` (black), `.btn-accent` (warm — the conversion CTA),
  `.btn-outline`, `.btn-on-dark`. All pills.
- Cards: `rounded-card` (1.5rem), hairline border, shadow only inside dark breaks.

## Motion

CSS only. **No animation library** — `framer-motion` survives solely in `CookieConsent.tsx`
and `CookieSettingsModal.tsx` and should not spread. Reveals use one `IntersectionObserver`
per element, carousels use native `scroll-snap`. Everything degrades under
`@media (prefers-reduced-motion: reduce)`, where reveals become instant rather than absent.

## Accessibility floor

Every interactive element has a visible `:focus-visible` ring (3px `warm`, 3px offset).
Skip link to `#main` on every page. Carousels: real focusable children, arrows and dots,
`aria-roledescription="carousel"`, auto-advance pausing on hover **and** focus. Forms: real
`<label>`s, `aria-invalid` + `aria-describedby`, and `aria-live` status regions covering
loading, success and error.

## Homepage section order

Hero (free evaluation) → Η ιστορία μας → Υπηρεσίες → Έργα → Τι λένε για εμάς →
Δωρεάν website + application modal → Συχνές ερωτήσεις → Footer.

## Honesty constraints

These are not style preferences.

- **The eight demos in `public/work/` are fabricated businesses** — invented names,
  addresses, staff and review counts, as `public/llms.txt` states. They are presented as
  design samples, never as real client work. Each keeps its `noindex,follow` meta tag;
  `robots.txt` deliberately does not block `/work/*`, so that tag is the only thing keeping
  them out of the index.
- **No fabricated authority.** No award badges, invented client counts or rating aggregates.
- **Reviews are switched off entirely** while they are invented — `REVIEWS_PUBLISHED`
  in `src/lib/reviews.ts` hides the homepage section and unpublishes `/reviews`.
  Fabricated review markup is a structured-data violation that can earn a manual action,
  and `noindex` is not sufficient: the content must not be fetchable.
- Business, contact and legal details are `Placeholder` until the owner supplies them.

## Build constraints that predate this spec

- `base` stays `'/'` in `vite.config.ts`.
- `netlify.toml` has **no** SPA fallback; every route is a real prerendered file.
- `src/main.tsx` uses `hydrateRoot`.
- Adding a route takes **two** edits: an entry in `routes` in `src/lib/seo.ts`, and an
  entry in the `pages` map in `App.tsx`. It used to take three — the third being the path
  in a hand-kept `KNOWN_PATHS` array — and missing it prerendered the route correctly and
  then flipped it to the 404 page on hydration, with nothing in the build complaining.
  `KNOWN_PATHS` is now derived from the `pages` keys, and `scripts/prerender.mjs` fails the
  build if a declared route has no page entry.
- FAQ and service data live in `src/lib/` because both the page and the JSON-LD read them.
