# Destino Blue Hotel & Spa -- Website

## Overview
Single-page luxury hotel website for Destino Blue Hotel & Spa, a boutique property in Sidari, Corfu, Greece.

**Live file:** `index.html` (self-contained, no build step required)

---

## Design Decisions

### Aesthetic Direction
**Refined Mediterranean Luxury** -- editorial magazine meets five-star hotel brochure. The design prioritises generous whitespace, cinematic full-width sections, and an unhurried, spacious feel that mirrors the luxury hospitality experience.

### Typography
- **Display / Headings:** Cormorant Garamond (300, 400, 500 weights) -- a high-contrast serif with classical elegance that evokes Mediterranean heritage without feeling dated. Italic variants add editorial sophistication.
- **Body / UI:** DM Sans (300, 400, 500, 600 weights) -- a geometric sans-serif with excellent legibility and a contemporary feel that balances the classical display font.
- Google Fonts is the only external dependency.

### Color Palette
| Role | Color | Hex |
|------|-------|-----|
| Primary / Deep Blue | Aegean navy | `#0C2340` |
| Background | Clean white | `#FFFFFF` |
| Warm neutral | Sand beige | `#F5EDE0` |
| Accent | Turquoise | `#4ECDC4` |
| Secondary accent | Gold | `#C8A96E` |

The palette alternates between deep blue and sand sections, creating a visual rhythm reminiscent of sea and shore.

### Layout & Sections
1. **Navigation** -- Fixed, transparent-to-white on scroll with smooth transitions. Logo inverts filter on dark backgrounds.
2. **Hero** -- Full-viewport with animated gradient background, staggered text entrance animations, and a scroll indicator with animated line.
3. **Wave Dividers** -- SVG wave shapes between sections create organic flow, echoing the Ionian coastline.
4. **Intro/Welcome** -- Two-column grid with text and overlapping placeholder image boxes (ready for real photography).
5. **Rooms** -- Horizontal-scrolling card carousel with drag-to-scroll, navigation arrows, and hover lift effects. Each card has a unique gradient placeholder.
6. **Facilities** -- Three-column cards with circular icons, bottom-border reveal animation on hover.
7. **Experience Corfu** -- Asymmetric photo grid (4-column with spanning items) showcasing nearby attractions with overlay labels.
8. **Stats Bar** -- Animated counters using IntersectionObserver with easeOutQuart easing for a satisfying counting effect.
9. **Reviews** -- 2x2 grid of testimonial cards with large decorative quote marks and avatar initials.
10. **Newsletter** -- Dark section with centered signup form.
11. **Footer** -- Four-column layout with brand info, room links, helpful links, and contact details.

### Animations & Interactions
- **Scroll reveal:** IntersectionObserver-based fade-up animations with staggered delays per element.
- **Counter animation:** Numbers count up with easeOutQuart timing when scrolled into view.
- **Hero entrance:** Five-stage staggered animation (overline, title, location, buttons, scroll indicator).
- **Hover states:** Room cards lift with shadow expansion; facility cards reveal bottom accent border; experience grid items scale subtly.
- **Navigation:** Smooth background transition from transparent to frosted white with backdrop blur.
- **Room carousel:** Click arrows or drag to scroll; cursor changes to grab/grabbing.
- **Scroll indicator:** Animated turquoise line continuously flows through the scroll guide.

### Responsive Strategy
- **Desktop (1024px+):** Full multi-column layouts, horizontal room carousel, 4-column experience grid.
- **Tablet (768px-1024px):** 2-column facilities grid, 2-column experience grid, 2-column footer.
- **Mobile (<768px):** Single-column stacking, hamburger menu with slide-down panel, vertical newsletter form, simplified stats grid.

### Technical Notes
- Zero external dependencies beyond Google Fonts (no JavaScript libraries, no icon libraries).
- All icons are inline SVGs for zero network requests and crisp rendering at any size.
- CSS custom properties (variables) for consistent theming.
- Passive scroll listeners for performance.
- `scroll-snap-type` on room carousel for touch-friendly snapping.
- Image placeholders use CSS gradients -- swap with real photography by adding `<img>` tags or `background-image` URLs.
- Form submission handled with inline JS (prevents default, shows confirmation).

### Photo Integration
All image areas currently use gradient placeholders. To add real photography:
- **Hero:** Replace `.hero-bg` gradient with a `background-image` URL.
- **Intro images:** Add `<img>` tags inside `.intro-image-main` and `.intro-image-accent`.
- **Room cards:** Add `<img>` tags inside `.room-card-image` replacing `.room-card-image-bg`.
- **Experience grid:** Add `<img>` tags inside each `.experience-item` replacing `.experience-item-bg`.

---

## Brand Assets Used
- **Logo:** Loaded from `https://www.destinoblue.com/sites/default/files/destino-blue-logo-landscape.jpg`
- **Contact:** Phone (+30) 26630 99486, Email info@destinoblue.com
- **Location:** Sidari, Corfu 49081, Greece
- **Social:** Facebook, Instagram (@_destino_blue_), TripAdvisor

---

Built by SAOS Studio.
