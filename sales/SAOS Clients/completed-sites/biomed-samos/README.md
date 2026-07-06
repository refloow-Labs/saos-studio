# BIOMED Samos -- Diagnostic Center Website

## Design Decisions

### Aesthetic Direction
**Mediterranean Medical** -- a clean, trustworthy healthcare aesthetic that bridges the warmth of an Aegean island clinic with the precision of modern diagnostics. The design avoids cold clinical sterility in favor of a calming, approachable professionalism.

### Color Palette
- **Deep Medical Blue (#0C2D48 to #1A5276)**: Primary brand color conveying trust, authority, and medical credibility
- **Bright Blue (#2E86C1)**: Accent color for interactive elements and highlights
- **Teal (#148F77)**: Secondary accent evoking health and vitality; used in gradient pairings with blue
- **Health Green (#1E8449)**: Reserved for EOPYY badge and free prevention screening callouts
- **Warm neutrals**: Off-whites and soft grays to keep the layout breathable

### Typography
- **Source Serif 4** (display): A refined optical-size serif that brings editorial gravitas to headings without feeling stiff. Chosen over generic sans-serif display fonts to differentiate from typical medical site templates.
- **Libre Franklin** (body): A humanist sans-serif with excellent Greek character support and warm readability at small sizes.

### Layout & Structure
1. **Hero** with Aegean-gradient background, layered radial gradients, decorative medical cross SVG, and wave separator
2. **Why BIOMED** -- three trust pillars (reliability, speed, care) in hoverable cards
3. **Services** -- four key offerings in two-column card layout
4. **Exams** -- four-column grid of exam categories
5. **Prevention** -- dark gradient section highlighting free screening programs, visually distinct to draw attention
6. **Doctor Profile** -- asymmetric two-column layout with gradient portrait placeholder and credentials
7. **Lab Gallery** -- masonry-style grid with gradient cards and pattern overlays (no placeholder images)
8. **Partnerships** -- horizontal logo strip for Medisyn, Bioiatriki, Labnet
9. **Contact** -- split layout with info cards + embedded Google Map
10. **Footer** -- four-column with navigation, services, and contact info

### Visual Techniques (No External Images)
- CSS gradients and radial gradients for all visual areas
- Inline SVG illustrations (stethoscope, medical cross, DNA helix hints, pulse line)
- SVG noise texture overlay for subtle paper-like depth
- Wave separator between hero and content
- Geometric pattern overlays on lab gallery cards

### Motion & Interaction
- IntersectionObserver-based scroll reveal with staggered delays
- Hero elements animate in sequence (badge, title, subtitle, CTA, stats)
- Card hover states with top-border reveal, lift effect, and background gradient transitions
- Smooth scrolling with scroll-padding for fixed nav offset
- Navbar blur/opacity transition on scroll
- Scroll-to-top button with fade-in

### Technical
- Single HTML file, fully self-contained
- No external dependencies except Google Fonts
- Responsive at 1024px, 768px, and 480px breakpoints
- Mobile hamburger menu with overlay
- CSS custom properties for theming consistency
- Semantic HTML with accessibility labels
- Lazy-loaded iframe map

### Language
All content is in Greek (el), reflecting the local audience of Samos island residents and visitors.

---

**Client:** BIOMED I.K.E.  
**Built by:** SAOS Studio  
