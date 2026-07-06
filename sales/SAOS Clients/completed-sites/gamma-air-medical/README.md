# Gamma Air Medical - Website

## Design Decisions

### Aesthetic Direction
Aviation command-center aesthetic: dark, authoritative, and precision-engineered. The design communicates the gravity of emergency medical transport while projecting global operational capability. Every element reinforces trust -- this is a company you'd call in a life-or-death situation.

### Typography
**Barlow Condensed** (display) and **Barlow** (body) -- a typeface family designed for mechanical/industrial contexts. The condensed variant gives headers a commanding, instrument-panel feel while remaining highly legible. Uppercase display text with tight letter-spacing evokes aviation communications and control tower readouts.

### Color Palette
- **Deep navy (#0a1628)** -- primary background, conveys authority and night-sky depth
- **Sky blue (#4a90d9)** -- accent for data, links, and UI elements; references aviation/sky
- **Red (#c0392b)** -- emergency urgency, medical cross, and primary CTAs
- **White/grays** -- content hierarchy and readability

### Layout & Visual Elements
- **Radar/globe SVG** in the hero section with animated sweep -- communicates global reach and active monitoring
- **Flight path lines** with pulsing endpoint dots -- suggests active routes and real-time operations
- **Medical cross with concentric rings** in mission section -- blends medical and radar/tracking imagery
- **3x3 services grid** with numbered cards and custom SVG icons -- clean, scannable, professional
- **Certifications bar** as a horizontal trust strip between services and team

### Key Features
- Sticky red "CALL NOW" bar with live-status indicator (green pulsing dot)
- All animations use Intersection Observer for scroll-triggered reveals
- Fully responsive with mobile hamburger menu
- Zero external dependencies beyond Google Fonts
- All icons are inline SVGs (no icon libraries)
- Contact form with service selector dropdown
- Smooth scroll navigation with active section highlighting

### Technical Notes
- Single HTML file with embedded CSS and JavaScript
- CSS custom properties for consistent theming
- No stock photos -- all visuals are CSS gradients, geometric patterns, and SVG illustrations
- Form submission is client-side only (visual confirmation); backend integration required for production
