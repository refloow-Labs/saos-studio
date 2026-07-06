# Desire Patisserie — Website

## Design Concept: "Le Salon Noir"

A dark, luxurious editorial experience inspired by vintage French patisserie packaging, Parisian salon culture, and the tactile elegance of gold-embossed chocolate boxes. The design evokes the refined atmosphere of a 1960s Kolonaki establishment while feeling contemporary and digital-native.

---

## Design Decisions

### Typography
- **Playfair Display** (display/headings): An ornate transitional serif with beautiful italics, chosen for its high contrast strokes that evoke luxury print editorial. Used for the hero title, section headings, and product card titles.
- **Cormorant Garamond** (body/accents): A refined Garamond-inspired serif with elegant proportions. Used for body copy, navigation labels, and smaller text. Its lighter weights provide beautiful readability against dark backgrounds.
- **Noto Serif** (fallback): Ensures Greek character support across all typography.

### Color Palette
- **Noir (#1a1714)**: Primary background — a warm charcoal with brown undertones, not a cold black
- **Espresso (#2a2219)**: Secondary background for alternating sections
- **Gold (#c9a96e)**: Primary accent — antique gold, not yellow-gold. Used sparingly for labels, lines, and hover states
- **Cream (#f5efe6)**: Primary text color — warm off-white, easier on the eyes than pure white
- **Rose Dust (#b8988a)**: Secondary text — a muted rose-brown for descriptions and supporting copy
- **Chocolate (#4a3728)**: Used in gradient placeholders for product imagery

### Layout & Structure
1. **Hero**: Full-viewport with centered typography, decorative border frame, and animated scroll indicator. Radial gradients create subtle depth without images.
2. **Products Grid**: 6 cards in a responsive grid (3-col → 2-col → 1-col). Each card has a hover-reveal description, numbered labels, and expanding gold accent lines.
3. **Parallax Divider**: A quote section between products and story, using `background-attachment: fixed` for parallax on desktop (gracefully falls back to static on mobile).
4. **Story Section**: Two-column editorial layout with large year watermark, multi-paragraph text, and a decorative image placeholder with gold border accent.
5. **Specialties Banner**: Horizontal specialty names with gold dot separators — creates visual rhythm and highlights signature items.
6. **Contact Section**: Two-column layout with stacked info blocks and a Google Maps embed. Map uses CSS filters (grayscale + sepia) to match the dark aesthetic, lightening on hover.
7. **Footer**: Minimal — logo, social icons, copyright. Separated by a gradient gold line.

### Interactions & Motion
- **Scroll-triggered animations**: Elements fade in and slide up as they enter the viewport (IntersectionObserver API). Staggered delays for grouped elements.
- **Product card hovers**: Background scales up, description text reveals, gold accent line expands — all with eased transitions.
- **Navigation links**: Underline grows from left on hover using `::after` pseudo-element.
- **Map filter**: Desaturated by default, gains color on hover for a reveal effect.
- **Sticky header**: Transparent on top, gains backdrop-blur glass effect on scroll.
- **Hero scroll indicator**: Gentle floating animation on the scroll-down line.

### Technical Details
- **Single file**: All HTML, CSS, and JS in one `index.html` — no build tools needed
- **No dependencies**: Only Google Fonts loaded externally
- **Responsive**: Three breakpoints (1024px, 768px, 480px) with mobile hamburger menu
- **Performance**: CSS-only parallax, lazy-loaded map iframe, passive scroll listeners
- **Accessibility**: Semantic HTML, ARIA labels on interactive elements, keyboard-navigable hamburger, print styles
- **Noise texture**: SVG-based grain overlay via `body::before` for analog warmth
- **Custom scrollbar**: Gold-themed thin scrollbar matching the design language
- **Greek language**: All UI text, headings, and content in Greek

### What Makes It Distinctive
- The warm-noir palette avoids the cliche "dark theme" trap by using brown-tinged blacks and rose-dust secondary colors
- Decorative border frame on the hero section references classic patisserie box design
- The noise/grain texture overlay adds analog warmth
- Typography pairing (Playfair + Cormorant) is classically French without being stereotypical
- Product cards use numbered labels (01-06) for editorial sophistication
- Map styling seamlessly integrates Google Maps into the dark aesthetic

---

## File Structure
```
desire-patisserie/
├── index.html    # Complete website (HTML + CSS + JS)
└── README.md     # This file
```

## How to View
Open `index.html` in any modern browser. No server required.
