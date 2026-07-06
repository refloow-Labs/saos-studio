# Ktima 28 - Website

## Design Concept: "Golden Hour"

A romantic, dreamy landing page inspired by the magical golden hour of outdoor Greek weddings — that moment when sunset light washes over garden ceremonies, fairy lights begin to glow, and everything feels warm and celebratory. The design evokes floral softness, champagne toasts, and the emotional warmth of a love story unfolding.

---

## Design Decisions

### Aesthetic Direction
Romantic warmth with editorial refinement. The page flows like a wedding invitation — from a dramatic sunset-gradient hero through soft ivory sections, a sage-green quote break, and warm blush contact area. Each section has distinct character while maintaining cohesion through the blush-champagne-sage palette. The design is elegant but never cold — it celebrates love with genuine warmth rather than sterile luxury.

### Color Palette
- **Blush (#f0ddd5)**: Primary warm accent — used in backgrounds, card gradients, and the contact section
- **Champagne Gold (#c5a55a)**: Signature accent — labels, dividers, script headings, hover states, CTAs
- **Deep Sage (#4a6741)**: Nature accent — the parallax quote section uses a sage-to-forest gradient evoking garden greenery
- **Ivory (#faf8f2)**: Primary background — warm off-white, softer than pure white
- **Ivory Warm (#f5f0e6)**: Alternating section background for depth
- **Charcoal (#2c2c2c)**: Text color — warm charcoal rather than pure black
- **Rose (#c9908a)**: Supporting accent in gradients and petal animations

### Typography
- **Great Vibes** (script/calligraphic): Used for decorative headings and the logo. A flowing calligraphic script that evokes hand-lettered wedding invitations — romantic without being kitschy.
- **Cormorant Garamond** (display serif): Section titles and large headings. A refined high-contrast serif with beautiful proportions, lending editorial gravitas.
- **Lora** (body serif): Section subtitles and italic quotes. A well-balanced contemporary serif with calligraphic roots.
- **Outfit** (body sans): All body copy, labels, navigation, and UI text. A geometric sans-serif with friendly rounded terminals — clean and modern without being generic.

### Layout & Structure
1. **Hero**: Full-viewport sunset gradient (charcoal to blush through golden tones) with floating petal particle animation, calligraphic title, parallax scroll effect on content, and animated scroll indicator
2. **About Section**: Two-column grid with an arch-topped decorative image placeholder and storytelling text. Includes animated stat counters (400 guests / 28 km / 365 days)
3. **Parallax Quote**: Sage-green break section with the brand promise quote in large italic serif. Deep green gradient with golden radial glow overlay
4. **Wedding Services**: 3-column card grid (6 cards) with hover lift effects, animated gold top-border reveal, and icon circles that shift gradient on hover
5. **Baptism Section**: Two-column with a 2x2 card grid (organic border-radius shapes in pastel gradients) and feature list with decorative bullets
6. **Chapel Section**: Full-width split layout — gradient visual on left with cross symbol, content on right. No standard section padding — edge-to-edge impact
7. **Amenities Grid**: 4-column showcase (8 items) with rounded cards, hover lift, and animated bottom-line accent
8. **Extra Services**: Dark charcoal banner with centered wrap layout of service names separated by gold diamond ornaments
9. **Casa28 Section**: Rounded card banner with visual + info split. Minimal aesthetic to reflect the venue's character
10. **CTA Banner**: Full-width champagne gold gradient with script heading and action button
11. **Contact Section**: Two-column with stacked contact details (icon circles + info) and embedded Google Maps with desaturation filter
12. **Footer**: Dark charcoal with script logo, navigation links, company legal name, and SAOS Studio credit

### Key Design Details
- Floating petal particles in the hero section (20 petals with randomized size, color, position, and animation timing)
- Linen-like subtle cross-pattern texture overlay on the entire page via SVG data URI
- Hero parallax: content translates and fades as user scrolls past
- Stat counter animation: numbers count up from 0 when scrolled into view
- Service cards: gold top border scales in from center on hover
- Baptism cards: asymmetric border-radius (one rounded corner per card) creating organic shapes
- Chapel section: edge-to-edge split without standard section padding for dramatic impact
- Custom scrollbar: thin champagne-gold thumb on ivory track
- Sticky header: transparent over hero, gains ivory glass-blur background on scroll
- Mobile hamburger: animated three-line to X transition
- All scroll animations use IntersectionObserver with staggered delays
- Smooth scroll with header offset compensation for anchor links
- Print styles strip interactive elements and reduce padding

### Skipped / Notes
- Original site URL: http://www.ktima28.gr
- Client: ΝΑΓΙΑ ΜΟΝΟΠΡΟΣΩΠΗ Ι.Κ.Ε.
- No real photographs were available; gradient placeholders with decorative text labels are used throughout
- Map embed uses approximate coordinates for the 28th km Athens-Lamia Highway location
- Casa28 is presented as a secondary mention rather than a full section, matching its supporting role
- Planning for 2026 & 2027 weddings is mentioned in the CTA banner
