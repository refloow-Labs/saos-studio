# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository shape

Three **independent** subprojects in one repo. There is no workspace or root
`package.json` — each has its own dependencies and is run from its own directory.

| Directory | What it is | Stack |
|---|---|---|
| `website/` | saos.studio marketing site | Vite + React 18 + TypeScript + Tailwind, prerendered |
| `autonomous-agent/` | Generates SMB demo sites from leads and emails them | Node ESM, cron, SQLite |
| `crm/` | Lead/client dashboard | Static HTML + vanilla JS, no build step |

`docs/`, `README.md`, `STRUCTURE.txt`, `COMPLETE_SUMMARY.md` and
`REORGANIZATION_SUMMARY.md` describe an older macOS layout — see *Landmines* below
before trusting any path in them.

## Commands

```bash
# website/
npm run dev              # Vite dev server, http://localhost:5173
npm run build            # tsc → client build → SSR build → prerender → sitemap
npm run preview          # serve dist/
npm run optimize-images  # re-encode public/work/ images (Python + Pillow)
npx tsc --noEmit         # typecheck alone — the only static check in the repo

# autonomous-agent/
npm start                # run the daily cycle + cron scheduler
npm run dev              # same under nodemon
npm run test:unit        # node --test tests/*.test.js
node --test tests/qa-gate.test.js    # a single test file
npm run setup            # one-time Gmail OAuth

# crm/ — no build; serve the directory statically
python3 -m http.server 8080
```

There is no linter or formatter configured anywhere in the repo. `website/`'s
`npm run build` runs `tsc` first, so type errors fail the build.

## website/ — the build is the important part

The site is a **prerendered** SPA, not a plain CSR app. `npm run build` runs four
stages and all of them matter:

1. `vite build` → client bundle + `dist/index.html` (used as the prerender template)
2. `vite build --ssr src/entry-server.tsx` → `dist-ssr/entry-server.js`
3. `scripts/prerender.mjs` → renders each route to real HTML with per-route head tags
4. `scripts/generate-sitemap.mjs` → `dist/sitemap.xml`

`src/entry-server.tsx` re-exports `src/lib/seo.ts`, `src/lib/schema.ts` and App's
`pagePaths` so the build scripts import route metadata **from the same compiled
bundle they render with**. Adding a route takes **two** edits:

1. add it to `routes` in `src/lib/seo.ts` (prerenderer and sitemap follow automatically),
2. add it to the `pages` map in `App.tsx`.

`App.tsx` hand-rolls routing off `window.location.pathname` — there is no router.
`normalisePath()` collapses trailing slashes and `/index.html`, then a `pages`
record maps path → component; anything unmatched renders `NotFound`.

This used to take *three* edits, the third being a hand-kept `KNOWN_PATHS` array,
and missing it had a nasty failure mode: the route prerendered correctly and then
**flipped to the 404 page on hydration** — served HTML right, visible page wrong,
build silent. The known paths are now derived from the `pages` keys, and
`prerender.mjs` throws if a route in `seo.ts` has no page entry, so the mistake
fails the build instead of shipping.

`index.html` contains `<!--seo-head-->…<!--/seo-head-->` markers. `prerender.mjs`
throws if they or `<div id="root"></div>` are missing, rather than silently
emitting a page with no metadata.

### Layout and content primitives

Compose new sections out of these rather than inventing parallel ones:

- `Chapter` — full-bleed section + `max-w-6xl` container. `tone: 'white' | 'gray' | 'dark'`
  owns the page's background alternation and its `py-24 md:py-32` vertical rhythm.
  `dark` also applies `on-dark`, which the headline styles key off.
- `SectionOpener` — oversized banner word (a `div`) + the real `h2` + optional body
  + optional doodle. Split so the outline reads as descriptive headings.
- `Doodle` — six inline-SVG hand-drawn marks, all `aria-hidden`, tinted from `warm`.
- `Reveal` — scroll reveal. The hidden state lives on a `data-reveal` attribute
  applied **only after mount**, so prerendered HTML is visible without JS. Never
  move that into a plain class.
- `Modal` — focus trap, Escape, scroll lock, return focus. Its effect keys on
  `open` alone and reads `onClose` through a ref, because every consumer passes an
  inline arrow; depending on `onClose` made the trap rebuild each render and steal
  focus mid-interaction.
- `Carousel` — native `scroll-snap`, no library. Measures with bounding rects, not
  `offsetLeft`. In `align="center"` the centring offset is a **margin on the first
  and last slide**: as padding on the scroller it shrank the content box that the
  percentage-width slides resolve against, collapsing them to slivers.
- `Placeholder` — loud dashed marker for anything invented. Sets its own text
  colour because its ground is always cream.

### Data modules feeding both page and JSON-LD

`src/lib/` holds the content that must not drift between the rendered page and the
structured data: `faqs.ts`, `services.ts`, `story.ts`, `projects.ts`, `reviews.ts`,
`process.ts` (the eight delivery stages, feeding the `HowTo` node), `industries.ts`,
plus `seo.ts` (route metadata), `schema.ts` (JSON-LD `@graph`), `submit.ts`
(the single form backend seam), `consent.ts` and `gtag.ts`.

`schema.ts` keys its per-route nodes off a `path → nodes` map: `/services` carries
the `Service`/`hasOfferCatalog`, `/how-it-works` a `HowTo`, `/examples` an
`ItemList` of `CreativeWork` (never `LocalBusiness` — the demos depict invented
companies), `/our-story` an `AboutPage` with `Person` nodes, `/request-a-quote` a
`ContactPage`, and every non-home route a `BreadcrumbList` built from
`route.breadcrumb`. **`/reviews` deliberately gets none of it** — see below.

- **`submit.ts` is the only integration point for forms.** Both the hero evaluation
  form and the application modal call `submit(formName, payload)`. It currently
  persists to localStorage behind a marked `BACKEND INTEGRATION POINT` block.
- **Pricing was withdrawn** (Aug 2026) pending repricing. `services.ts` carries no
  prices and `schema.ts` emits `hasOfferCatalog` with **no `Offer` prices** and no
  `AggregateOffer`. Restore both together or neither — price markup must never
  outlive the prices it describes.
- **FAQ answer panels stay in the DOM**, collapsed with the `hidden` attribute.
  Rendering them conditionally removed all twelve answers from the prerendered
  HTML while the `FAQPage` JSON-LD still claimed them.
- **The homepage FAQ is a six-question subset** (`homeFaqs()`), and its `FAQPage`
  JSON-LD is built from that same subset while `/faq` marks up all twelve. Passing
  the full list to `faqPage()` on `/` would have the markup describe six answers a
  crawler cannot find there. `faqPage(canonical, items)` takes the items for this
  reason — do not make it read `faqs` directly again.

### Honesty constraints (not style preferences)

- **The eight demos in `public/work/` depict fabricated businesses** — invented
  names, addresses, staff, review counts and testimonials, some health-adjacent.
  `public/llms.txt` states this. They are presented as *design samples*, never as
  client work, and their contact details and ratings must never be reused as real.
- **Each demo carries `<meta name="robots" content="noindex,follow">` and must keep
  it.** `robots.txt` intentionally does *not* disallow `/work/*`: a crawler has to
  fetch a page to see its noindex, and blocking the path would leave the URLs
  indexable as bare entries. The meta tag is the only thing keeping them out.
- **Reviews in `reviews.ts` are invented.** They are labelled as samples in the UI
  and emit **no `Review` / `AggregateRating` JSON-LD** — fabricated review markup is
  a policy violation that can earn a manual action. `REVIEWS_ARE_SAMPLES` gates the
  labels.
- Business, contact and legal details are `Placeholder` until the owner supplies
  them. `llms.txt` explicitly tells AI crawlers the old €46/€52/€83 figures are
  withdrawn and must not be quoted.

### Constraints that are easy to break and expensive to debug

- **`base` must stay `'/'`** in `vite.config.ts`. A relative base makes nested
  routes request `/<route>/assets/*.js`, which the host answers with HTML — and
  browsers refuse HTML for a module script, producing a blank page.
- **`netlify.toml` deliberately has no SPA fallback.** Every reachable route is a
  real prerendered file; unmatched paths get `dist/404.html` with a genuine 404.
- `netlify.toml` sets `X-Frame-Options: DENY` and `frame-ancestors 'none'` sitewide,
  which blocks framing **even same-origin**. The project preview modal frames
  `/work/*`, so that path has its own header block with `SAMEORIGIN` /
  `frame-ancestors 'self'`, and the sitewide `frame-src` includes `'self'`. None of
  these headers exist on the dev server, so framing bugs only appear in production.
- **`src/main.tsx` uses `hydrateRoot`**, not `createRoot`. In dev this logs a
  hydration mismatch warning because `index.html` ships an empty `#root`; that is
  expected, not a bug.
- Styling is split three ways and all three matter: colour and font tokens in
  `tailwind.config.js`, reusable component classes in the `@layer components` block
  of `src/index.css`, and section shells in `Chapter.tsx`. Restyle through those
  rather than sprinkling one-off utilities. Note a Tailwind utility beats the
  component layer, so a `text-*` class at a call site overrides a component class's
  colour.
- The palette is monochrome plus **one** accent, `warm` (`#FDB226`), reserved for
  conversion CTAs, focus rings, emphasis inside dark breaks, and doodles. `.btn-accent`
  sets black text because `#FDB226` behind white fails contrast.
- Content is Greek (`lang="el"`). Manrope is self-hosted in `public/fonts/` with
  `unicode-range` per subset; do not reintroduce the Google Fonts stylesheet.
  Banner words are authored uppercase **in the markup**, never via `text-transform`
  — Greek drops the tonos in all-caps.
- `website/REDESIGN.md` is the current design spec and supersedes the older
  "static, monochrome, no motion" one. Read it before any visual change.
- `framer-motion` is still a dependency but survives in only two files
  (`CookieConsent.tsx`, `CookieSettingsModal.tsx`). Motion elsewhere is CSS-only —
  scroll-snap carousels, one `IntersectionObserver` per revealed element — and
  everything degrades under `prefers-reduced-motion`. Do not add an animation
  library.

CSP in `netlify.toml` is currently `Content-Security-Policy-Report-Only` pending
production verification. Promote it by renaming the key, not by rewriting the value.

### Verifying visual work

A clean `tsc` and correct prerendered markup prove nothing about layout — collapsed
flex widths, invisible text and broken focus all typecheck fine. To check rendering,
drive the snap Chromium at `/snap/bin/chromium`:

- Put a temporary page in `public/` that iframes `/` (same origin, so its DOM and
  computed styles are readable), then `--dump-dom` it for measurements or
  `--screenshot` it for a visual. Delete the page afterwards.
- Under `--virtual-time-budget`, `IntersectionObserver` does not fire reliably and
  `scroll-behavior: smooth` prevents scripted scrolling from completing. Inject
  `html{scroll-behavior:auto}` and force `[data-reveal]` visible in the harness —
  these are headless artefacts, not site bugs.
- The snap Chromium **cannot write into hidden directories**; point `--screenshot`
  at a non-hidden path. `website/.shots/` is gitignored but unusable for this reason.

## autonomous-agent/ — pipeline and the skill bridge

`src/agent.js` is the orchestrator. Per lead, the cycle is:

```
leads-manager (CSV) → website-generator (OpenRouter) → netlify-deployer
                            ↓
                        qa-gate ──fail──→ regenerate with feedback (≤ QA_MAX_RETRIES)
                            ↓ pass
                     approval-queue (SQLite) → email-service (Gmail) → sync-to-crm
```

Two things here are not obvious from any single file:

**The QA gate shells out to Claude Code.** `src/skill-runner.js` spawns *headless
`claude` CLI sessions* that run a named skill and write a JSON verdict to a file,
which Node then reads. `src/qa-gate.js` layers four checks — deterministic Node
checks, headless Chromium via `playwright-skill`, the `qa-test` skill, and the
`ui-ux-pro-max` skill — into one 0–100 score.

`qa-test` and `playwright-skill` are committed under
`autonomous-agent/.claude/skills/`. **`ui-ux-pro-max` is not in the repo** — it
resolves from the user-level `~/.claude/skills/`, so the design-review layer
silently depends on the operator's machine. The agent's behaviour therefore depends
on the `claude` CLI being installed and on those skill definitions, not just on the JS.
`SkillRunner` probes CLI availability and caches the result, feeding prompts via
stdin so LLM-authored text never reaches a shell command line.

**`src/designer-agent.js` and `src/design-brief-generator.js` are not wired in.**
Nothing imports them; `agent.js` uses `website-generator.js`. Treat them as a
parallel/unfinished path and do not assume changes there affect the running agent.

State is SQLite under `data/`, opened via **relative** paths (`./data/agent-state.db`,
`./data/approval-queue.db`). The agent must be run with `autonomous-agent/` as the
working directory or it will create or miss databases silently.

Lead objects come from CSV with **Greek column names used verbatim as keys** —
e.g. `lead['Τηλέφωνο']`, `lead['Ιστοσελίδα Εταιρίας']`, alongside `lead.Company`.

## crm/

No build and no module system: `index.html` loads `data.js`, `agent-drafts.js` and
`app.js` as plain `<script>` tags that communicate through globals. `data.js` is a
~4.7 MB generated file of lead records — treat it as data, not source. The agent
feeds this UI by writing `agent-drafts.json` from `sync-to-crm.js`.

## Landmines

- **`node_modules/` is committed** (~7,300 files per subproject) and dependency
  changes therefore show up as very large diffs.
  - **`website/` is fine on Linux and must NOT be reinstalled.** Both platform
    variants are committed side by side (`@rollup/rollup-linux-x64-gnu` *and*
    `@rollup/rollup-darwin-arm64`; `@esbuild/linux-x64` *and* `@esbuild/darwin-arm64`),
    so `npm run dev` and `npm run build` work as-is. Running `npm install` would
    rewrite the tree and likely prune the darwin binaries the macOS machine needs.
    The stale Mach-O at `node_modules/esbuild/bin/esbuild` is harmless — Vite uses
    the JS API, which resolves the platform package first.
  - **`autonomous-agent/` is the one that breaks:** its `sqlite3` was installed on
    macOS and throws `invalid ELF header` on Linux. Fix with
    `npm install --legacy-peer-deps` in that directory only. This is why
    `tests/approval-queue.test.js` fails; the other three test files pass (13 tests).
    A fresh failure there is an environment problem before it is a code problem.
- **A long-running Vite dev server can miss newly created files.** Tailwind's JIT
  then never generates utilities used only in that file, and the section renders
  unstyled while the classes look correct in the source and in `dist/`. Restart the
  dev server before concluding the code is wrong.
- **Hardcoded macOS paths** to `/Users/giannistambakis/Desktop/SAOS Studio` remain
  in `scripts/start-crm.sh`, `autonomous-agent/src/sync-to-crm.js` (which also
  builds a path from `$HOME/Desktop`), `README.md` and several docs. They are
  broken on this checkout. `scripts/start-crm.sh` will not work as written.
- `website/dist/` and `dist-ssr/` are gitignored; Netlify builds from source.
- **The deployed site can lag the repo by entire commits.** Diagnose from the
  live host, not from source, before concluding the code is wrong. The signature
  of a stale pre-prerender deploy is unmistakable: `/`, `/robots.txt`,
  `/sitemap.xml` and any nonexistent path all return **HTTP 200 with the same
  ~1.7 KB empty-shell HTML** (`lang="en"`, `<div id="root"></div>`, relative
  `./assets/` links). `curl -s https://saos.studio/sitemap.xml | head` settles it.
- **Headless Chromium `--screenshot` always renders from the top of the
  document.** Injecting `window.scrollTo(...)` before the capture changes nothing.
  To capture below the fold, shift the document instead (`body { position: relative;
  top: -900px }`), capture fixed-height slices, and stitch them; hide
  `position: fixed`/`sticky` elements on every slice after the first or the header
  repeats down the image.
- `__cap*.html` / `__capture.html` files inside `public/work/<slug>/` are screenshot
  scaffolding. They are untracked, not gitignored, and safe to delete.

## Deployment

`website/` deploys to Netlify from `netlify.toml` (`npm run build`, publish `dist`).
Generated demo sites deploy to Netlify via the agent's `netlify-deployer.js`.
After deploying the website, `npm run indexnow` (from `website/`) pings IndexNow —
it verifies the key file over HTTP first, so it only works against the live site.

External services: OpenRouter (`OPENROUTER_API_KEY`, default model
`deepseek/deepseek-chat`), Netlify API, Gmail API via OAuth. All configured through
`autonomous-agent/.env`.
