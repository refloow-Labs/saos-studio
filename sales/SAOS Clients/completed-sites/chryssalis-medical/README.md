# Chryssalis Medical Spa - Website

## Design Decisions

### Aesthetic Direction
Luxury medical spa aesthetic inspired by high-end beauty clinics in affluent Athens suburbs. The design evokes serenity, exclusivity, and clinical precision — refined rather than flashy.

### Color Palette
- **Rich black/charcoal (#1a1a1a)**: Primary dark sections for sophistication and contrast
- **Gold/champagne (#c9a96e)**: Accent color throughout — borders, labels, icons, CTAs — conveying luxury
- **Warm white (#faf8f5)**: Light section backgrounds that feel warmer than pure white
- **Soft rose (#f2e6df)**: Subtle blush tones in image placeholders and decorative cards
- **Cream (#f5f0e8)**: Secondary light background for visual rhythm between sections

### Typography
- **Playfair Display** (display serif): All headings — elegant, editorial quality with good Greek support
- **Cormorant Garamond** (accent serif): Introductory text, quotes, phone numbers — adds a refined secondary voice
- **Outfit** (body sans-serif): All body text, labels, buttons — modern, clean, highly legible at small sizes

### Layout & Structure
Alternating dark/light sections create visual rhythm:
1. Dark hero with cinematic presence and staggered reveal animations
2. Light about section with offset image frame and floating stat badge
3. Dark services grid (3-column, responsive to 2 then 1)
4. Cream process section with connected step indicators
5. Dark stats bar with animated counters
6. Light "why us" section with asymmetric visual grid
7. Cream blog section with 4-column card layout
8. Dark appointment CTA with decorative diamond shapes
9. Light contact section with form
10. Black footer with 4-column layout

### Key Design Details
- Gold corner accents frame the hero section
- Subtle grain texture overlay on dark backgrounds
- Gold gradient line used as a recurring decorative motif
- Service cards have top-border reveal animation on hover
- Section labels use a leading gold line before text
- Offset image frames with gold border accent
- CSS-only scroll-triggered parallax on the hero (where supported)
- Counter animations with easeOutQuart easing for stat numbers

### Technical Notes
- Single HTML file, no external dependencies except Google Fonts
- Fully responsive across all breakpoints (480px, 768px, 1024px, 1200px)
- Mobile navigation with animated hamburger icon
- Intersection Observer for scroll-triggered reveal animations
- CSS custom properties for easy theme adjustments
- All content in Greek language
- Smooth scroll with navbar offset compensation
- Form with visual submission feedback

### Image Placeholders
Decorative SVG patterns and gradient backgrounds serve as image placeholders. Replace with actual photography for production deployment.
