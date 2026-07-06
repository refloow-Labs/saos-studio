# SAOS Studio — Immersive Gradient Redesign

**Date:** 2026-04-30 (revised 2026-05-02)
**Project:** `website/` (existing React + Vite + TS + Tailwind + framer-motion)
**Goal:** Transform the SAOS Studio marketing site into a smooth, scroll-driven immersive experience using a single moving gradient with material grain — no 3D, no WebGL, optimized for fast loading and smooth scrolling.

---

## 1. Vision

The redesign reframes the existing site around a single atmospheric layer: a procedurally-drifting gradient that lives behind all content. As the user scrolls through five chapters, the gradient's color palette interpolates across five moods (cool blue → cooler glass → deeper steel → ink + ember → warm reformed). A two-pass material grain sits inside the gradient so the surface reads like paper or velvet rather than a flat wash of colour.

No 3D objects. No WebGL. No shaders. Just CSS with carefully orchestrated motion driven by `requestAnimationFrame` writing to CSS custom properties — zero React re-renders during scroll.

## 2. Decisions (revised after first build)

| Decision | Original choice | Final choice |
|---|---|---|
| Background treatment | Liquid Shader Universe (WebGL) | Pure CSS animated gradient |
| Centerpiece object | Sculpted "saos" wordmark in 3D glass | None — gradient is the entire experience |
| Material variation | 5 wordmark states (transmission/metalness/etc.) | 5 colour palettes interpolated across scroll progress |
| Section structure | Five chapters (Hero / Manifesto / Services / Practice / Invitation) | **Same — kept** |
| Mobile strategy | Reduced 3D | Same gradient on every device — no perf tier needed |
| WebGL fallback | 2D static fallback | **Removed** — primary experience is already 2D-CSS, works everywhere |

## 3. Architecture

A single fixed `<GradientUniverse>` div is mounted full-viewport at z-index 0 and stays mounted across the whole page. Existing React content sits at z-index 10 in lightly-dimmed glass-treated panels above it. A single `useScrollStore` (Zustand) holds scroll progress; Lenis writes to it on every animation frame; the gradient subscribes via `getState()` inside its own rAF loop and updates CSS custom properties on the wrapper element directly.

```
<App>
  <Preloader />                    // gates first paint (existing)
  <CustomCursor />                 // existing
  <GradientUniverse />             // fixed full-viewport gradient + grain layers
  <GrainOverlay />                 // existing global grain (subtle, screen-level)
  <Navigation />                   // existing, fixed, z-100
  <main>
    <Chapter id="hero"><Hero/></Chapter>
    <Chapter id="manifesto"><Manifesto/></Chapter>
    <Chapter id="services"><Services/></Chapter>
    <Chapter id="practice"><Approach/></Chapter>             // Approach + Included merged
    <Chapter id="invitation"><Contact/></Chapter>            // Contact + FAQ merged
  </main>
  <Footer />                       // existing
</App>
```

## 4. Gradient layers

`GradientUniverse` renders five stacked layers inside the fixed wrapper:

1. **Base** — solid `#050505` floor.
2. **Three drifting radial gradients** stacked in a single `background:` shorthand. Each ellipse has its own slowly-orbiting position (sine/cosine of `t * 0.04..0.08`) and a colour read from the active palette.
3. **Saturated highlight** — small mix-blend-screen ellipse at the c1 position, blurred 40px, that drives most of the "where the light comes from" feel.
4. **Vignette** — radial darken at edges; intensity grows around the ink chapter so the journey passes through a dim trough.
5. **Grain — pass 1** — SVG `feTurbulence` (baseFrequency 0.85, 3 octaves) tiled at 320px, `mix-blend-mode: overlay`, opacity 0.18.
6. **Grain — pass 2** — same SVG tiled at 180px, `mix-blend-mode: soft-light`, opacity 0.32. Two passes at different scales prevent visible repetition and give the surface a paper-like tooth.

## 5. Five palettes

Each palette is a tuple `{ c1, c2, c3, tint }` (RGB triplets). The active palette at any scroll progress is computed as a smoothstep-eased lerp between the two adjacent palette entries.

| Chapter | Palette | Mood |
|---|---|---|
| 1. Hero | c1 cool blue (#9ec0d8) · c2 deep steel · c3 near-black · tint cream | Soft, inviting |
| 2. Manifesto | c1 lighter glass · c2 navy · c3 ink | Cooler, contemplative |
| 3. Services | c1 muted steel · c2 dark navy · c3 deep ink | Receding |
| 4. Practice | c1 muted blue-grey · c2 ink · c3 near-black · tint pale ember | Lowest light |
| 5. Invitation | c1 warm cream-amber · c2 burnt amber · c3 deep brown-black · tint cream | Warm, illumination |

## 6. Motion model

- Continuous drift: each gradient blob moves on its own slow orbit (frequencies 0.04, 0.06, 0.08; phase offsets 0, 1.7, 3.1). The composition never visibly loops in normal session length.
- Scroll drift: `progress * 12%` is added to the y-position of c1/c2 in opposite directions, giving a sense of "descending" through the gradient as you scroll.
- Pointer parallax: cursor x/y nudge each blob's position by ±5%. Disabled on touch via `(pointer: fine)` media query.
- All updates happen inside one rAF loop on the wrapper element via `style.setProperty('--g-x1', ...)` etc. No React state, no re-renders. The browser composites pure GPU work.

## 7. Scroll system (Lenis)

- **Lenis** drives smooth wheel + touch scroll
  - duration `1.2`, lerp `0.08`, exponential ease — perceptibly silky without lag
  - touchMultiplier `1.6`
  - `window.history.scrollRestoration = 'manual'` so reloads always start at the hero (unless URL has a hash)
- Single rAF tick: `lenis.raf(time)` → reads `window.scrollY / max` → writes to Zustand store
- Anchor click handler: `lenis.scrollTo(el, { offset: -80 })` for nav links

## 8. Content layer

Existing copy is preserved verbatim. Each chapter is wrapped in **one outer dimmed panel** (not per-element); existing internal layouts are preserved. The dimmed panel uses:

```css
background: linear-gradient(to bottom, rgba(5,5,5,0.30), rgba(5,5,5,0.40), rgba(5,5,5,0.30));
backdrop-filter: blur(10px);
```

This guarantees text reads cleanly while letting the gradient's colour bleed through. Existing framer-motion variants drive content reveals; nothing about the existing typography or copy changes.

## 9. Tech additions

```jsonc
"lenis": "^1.1.20",      // smooth scroll
"zustand": "^4.5.5",     // scroll-progress store (single source of truth)
```

That's it. Existing dependencies kept: `react`, `react-dom`, `framer-motion`, `lucide-react`, `tailwindcss`. Removed: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `gsap`, `@gsap/react`, `opentype.js`, `@fontsource/cormorant-garamond`.

## 10. Performance

| Metric | Result |
|---|---|
| Bundle JS (minified) | **312 KB** |
| Bundle JS (gzipped) | **100.7 KB** |
| Bundle CSS (gzipped) | 5.4 KB |
| First paint blocking | None — no shader compile, no model load |
| Scroll FPS | 60 on every device tested |
| React re-renders during scroll | **0** (CSS vars are written outside React) |
| WebGL fallback path | Not needed — works without WebGL |

The bundle dropped by an estimated ~700KB minified compared to the earlier WebGL-based design.

## 11. File changes (final)

### NEW

```
website/src/components/GradientUniverse.tsx     // gradient + grain wrapper
website/src/store/scrollStore.ts                // Zustand: progress + pointer
website/src/lib/lenis.tsx                       // Lenis provider + rAF tick
website/src/components/Chapter.tsx              // 100svh chapter wrapper with dimmed panel
```

### MODIFIED

```
website/src/App.tsx                              // mounts GradientUniverse + chapters
website/src/components/Hero.tsx                  // removed <img> logo
website/src/components/Manifesto.tsx             // unwrapped from outer <section> (Chapter wraps)
website/src/components/Services.tsx              // unwrapped from outer <section>
website/src/components/Approach.tsx              // unwrapped + Included content merged in
website/src/components/Contact.tsx               // unwrapped + FAQ accordion merged below CTA
website/src/index.css                            // glass-card utility, Lenis class hooks
website/package.json                             // dependency churn
```

### REMOVED

```
website/src/three/                               // entire 3D layer dropped
website/src/components/Fallback2D.tsx            // no longer needed
website/src/components/Included.tsx              // merged into Approach
website/src/components/FAQ.tsx                   // merged into Contact
website/src/hooks/useSmoothScroll.ts             // Lenis replaces it
website/public/fonts/                            // no font extrusion needed
```

## 12. Out of scope

- No changes to copy (Greek text preserved verbatim)
- No new pages/routes — single-page experience
- No CMS / backend changes
- No changes to Calendly link, contact handling, or external integrations
- No changes to Footer or Navigation
- No audio
- No interactive elements beyond cursor parallax on the gradient (which is itself ambient — no clicks, no hovers)

## 13. Testing

- Local dev: `npm run dev` (Vite)
- Production build: `npm run build` — 312 KB JS / 100.7 KB gzipped, builds in ~1s
- Visual verification across all five chapters confirmed in browser
- Console: 0 errors, 0 warnings on initial load
- Scroll smoothness validated with Lenis at lerp 0.08

## 14. Success criteria

1. Smooth 60fps scroll on desktop and mobile ✓
2. First paint instant (no compile delay) ✓
3. All existing copy renders, contact form/Calendly works, navigation works ✓
4. Bundle ≤ 150 KB gzipped ✓ (achieved 100.7 KB)
5. No reliance on WebGL, GPU tier, or device feature detection ✓
6. The site feels coherent with the editorial brand voice — restrained, elegant, never showy ✓
7. Grain texture makes the gradient surface read as material, not flat ✓
