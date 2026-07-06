# SAOS Studio — Brand Guide

## Logo

Two primary marks live in [logos/](logos/):

| File | When to use |
|---|---|
| `dark-logo.png` | On light backgrounds (white, cream, light gray) |
| `white-logo.png` | On dark backgrounds (the default site background `#050505`) |

**Clearspace:** keep at minimum the height of the wordmark's tallest letter clear on every side.
**Don't:** recolor, stretch, drop-shadow, place on busy photography without a scrim, or rebuild from screenshots.

## Color palette

The website uses a near-black editorial palette with a single muted blue accent. Source of truth: [website/tailwind.config.js](../website/tailwind.config.js).

| Token | Hex | Usage |
|---|---|---|
| `bg` | `#050505` | Page background |
| `surface` | `#0a0a0a` | Cards, sections |
| `surface-2` | `#0f0f0f` | Elevated surfaces |
| `surface-3` | `#141414` | Higher elevation |
| `surface-4` | `#1a1a1a` | Highest elevation |
| `text` | `#e8e6e1` | Primary text (warm off-white) |
| `muted` | `#6e6e6e` | Secondary text |
| `accent` | `#9ec0d8` | Primary accent (muted dusty blue) |
| `accent-dim` | `#6a8fa8` | Accent hover / secondary accent |
| `border` | `rgba(255,255,255,0.04)` | Subtle dividers |
| `border-hover` | `rgba(255,255,255,0.08)` | Hover state for borders |

## Typography

Loaded from Google Fonts.

| Role | Family | Notes |
|---|---|---|
| Display / headlines | **Cormorant Garamond** (300–600, italic 300/400) | Editorial serif. Use for hero headlines and section titles. |
| Body / UI | **Syne** (400–700) | Geometric sans. Use for body, buttons, navigation. |

Pairing rule: serif sets the tone, sans does the work. Don't mix in a third family.

## Voice & tone

**Tone:** confident but warm, expert but approachable, editorial but clear.

**Do:**
- Use elegant, refined language
- Show, don't tell — visuals beat adjectives
- Be direct about pricing
- Speak to outcomes ("more customers", "better credibility")

**Don't:**
- Use buzzwords ("synergy", "disrupt", "leverage")
- Sound like a cheap freelancer
- Over-explain the AI — it's a tool, not the product
- Apologize for the price being low

## Message hierarchy

1. **Headline:** Beautiful websites under €500
2. **Sub:** Agency quality. Delivered in days.
3. **Proof:** Portfolio + process + testimonials
4. **CTA:** Email us / Book a call

## Email & social handle conventions

- Primary email: `hello@saos.studio` (planned)
- Domain: `saos.studio` (planned)
- Social handle: `@saosstudio` (or closest available)
- Bio template: *"Beautiful websites under €500. Built by AI, finished by humans."*

## Motion

The website uses subtle, slow animations (see Tailwind config keyframes): mesh background drifts (20s), fade-up on scroll (1s, easeOutCubic-ish), gentle 6s float on accents. **Rule:** motion should feel editorial, never "techy" — no bounces, no spring physics, no rapid loops.
