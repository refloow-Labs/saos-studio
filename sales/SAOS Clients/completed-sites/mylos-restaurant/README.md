# Mylos "Keratas" Restaurant - Website

## Design Decisions

### Aesthetic Direction
Rustic Mediterranean elegance with a romantic, historic sensibility. The design evokes the feeling of arriving at a candlelit Venetian-era stone courtyard on a warm Cretan evening -- aged textures, warm light, and an unhurried sense of centuries unfolding. The visual language draws from parchment, stone walls, vineyard terraces, and the golden glow of oil lamps, all rendered with a refined editorial restraint that lets the atmosphere breathe. Dark sections alternate with warm cream backgrounds to create a rhythm of intimacy and openness, mirroring the experience of moving through the restaurant's garden rooms and mill interiors.

### Color Palette
- **Warm Terracotta** (#c2703e) -- Primary accent; evokes clay, earth, Mediterranean warmth
- **Deep Olive** (#3d4a2d) -- Secondary tone; vine leaves, garden greenery, Cretan hills
- **Cream Parchment** (#f5eed6) -- Light background; aged paper, sunlit stone
- **Wine Red** (#6b2737) -- Dramatic accent; Cretan wine, rich evening atmosphere
- **Warm Stone** (#d4c5a9) -- Neutral text/border; weathered limestone, old walls
- **Gold Accent** (#c9a84c) -- Ornamental highlights; candlelight, heritage, quality
- **Warm Black** (#1a1510) -- Deep backgrounds; night sky over the terrace
- **Charcoal** (#2c2418) -- Primary text; warm, never harsh

### Typography
- **Display/Headings**: Cormorant Garamond -- A high-contrast serif with strong calligraphic roots, lending historical weight and Mediterranean elegance. Used at light (300) and medium (500) weights for dramatic contrast.
- **Body Text**: Crimson Pro -- A refined, highly readable serif with warmth and character that complements the display face without competing. Weight 300 for an airy, sophisticated feel.
- **Labels/Navigation**: Josefin Sans -- A geometric sans-serif with vintage character, used exclusively in very small sizes (0.65-0.8rem) with wide letter-spacing for wayfinding elements, creating a subtle contrast to the serif-dominant design.

### Layout & Structure
1. **Immersive Hero** -- Full-viewport dark section with layered atmospheric gradients simulating candlelight, decorative mill-wheel SVG icon, staggered reveal animations, and a parallax-like scroll effect on the glow elements. Greek subtitle provides bilingual texture.
2. **History Section** -- Two-column grid with a decorative image frame (offset double-border treatment) and flowing narrative text. Large faded "1960" year creates depth. Scroll-reveal on all elements.
3. **Menu Highlights Grid** -- Six specialty dishes in a 3-column grid with 1px gold divider lines, numbered items, Greek names in italic gold, and hover states with top-line accent reveal. Dark background with radial gradient atmosphere.
4. **Atmosphere / The Mill** -- Feature list with circular icon borders paired with a main image frame and overlapping accent image. Closing quote block with oversized decorative quotation mark. Dotted background texture.
5. **Location / Find Us** -- Two-column with contact details (icon + label + content) and a map placeholder featuring a pulsing pin marker and coordinates display. Dark background with subtle radial glow.
6. **Guest Reviews** -- Three testimonial cards with quotation marks, 5-star ratings, avatar initials, and source labels. Light background, hover-lift effect.
7. **Reservation CTA** -- Wine-dark background with decorative inset border, dual action buttons (primary gold, secondary outlined), and hours display. Radial gradient atmosphere.
8. **Footer** -- Four-column layout with brand description, navigation, contact info, hours, and social media icon links. Minimal, warm styling.

### Key Design Details
- Grain overlay (SVG noise filter) applied globally at 3% opacity for aged-paper texture across all sections
- Custom mill-wheel SVG icons used as decorative motifs throughout (hero, history, atmosphere)
- Candlelight glow effect: three radial gradient circles with staggered flicker animations and mouse-follow interaction on desktop
- Scroll-reveal animations with staggered delays (IntersectionObserver-based, one-shot) for all content sections
- Hero parallax: content fades and shifts on scroll, glow elements move at different speeds
- Mobile-responsive: hamburger menu with full-screen overlay, single-column stacking, adjusted spacing
- All SVG icons inline -- zero external dependencies beyond Google Fonts
- Decorative offset borders on image frames for a "framed photograph" effect
- Stone-wall texture pattern (CSS repeating gradients) in hero section
- Gold accent used sparingly for highlights, dividers, and interactive elements to maintain premium feel
- Navigation backdrop-blur effect when scrolled, with smooth transition

### Skipped / Notes
- Original site URL: http://www.mylosrestaurant.gr
- Client: MYLOS TOURISTS KAI EMPORS (trades as Mylos "Keratas" Restaurant)
- Image placeholders use decorative SVG compositions (mill wheel, building, landscape motifs) -- ready for replacement with actual photography
- Map section uses a styled placeholder with pulsing pin and coordinates -- can be replaced with an embedded Google Maps iframe
- Review testimonials are representative composites -- should be replaced with actual guest reviews
- Social media links point to known handles (Facebook: mylostoukerata, Instagram: mylos__restaurant); YouTube and Tripadvisor link to root domains pending actual URLs
