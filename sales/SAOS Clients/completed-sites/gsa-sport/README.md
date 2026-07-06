# GSA Sport - Website Design

## Client
GSA Sport by GEPAWORLD I.K.E. - Greek athletic sportswear brand based in Athens.

## Design Decisions

### Aesthetic Direction
Bold, high-energy athletic brand identity modeled after premium sportswear brands (Nike, Under Armour) but with distinctly Greek character. The site uses aggressive geometric shapes, diagonal clip-paths, and a dark palette to convey power and performance.

### Color Palette
- **Primary Black (#000)** and **Charcoal (#1a1a1a)**: Dark foundation creates premium, athletic feel
- **Electric Orange (#ff6b00)**: High-contrast accent for energy, CTAs, and brand identity
- **White**: Typography contrast and clean readability

### Typography
- **Oswald (700)**: Bold condensed display font for all headers -- creates the aggressive, sporty headline style
- **Barlow Condensed (600-800)**: Labels, navigation, CTAs -- military-precision utility text
- **Barlow (300-700)**: Body copy -- clean, modern, highly readable

### Layout & Geometry
- Diagonal clip-path sections create dynamic visual flow between content blocks
- Angled card corners (polygon clip-paths) throughout for brand consistency
- Overlapping sections with negative margins for visual continuity
- CSS-only geometric background patterns (repeating diagonal lines, rotated shapes)

### Sections
1. **Hero**: Full-viewport with animated text reveal, geometric background shapes, side stats
2. **Ticker**: Scrolling marquee with key brand messages
3. **Categories**: Three major cards (Men/Women/Kids) with gradient backgrounds and hover effects
4. **Team Partnerships**: Olympiacos B.C., Anadolu Efes, Peristeri B.C. showcase
5. **Products**: Four product highlight cards with badges and pricing
6. **Socks Collection**: Split layout -- 9-type grid + feature list
7. **Mix & Match Offers**: Three offer cards on orange diagonal section
8. **Newsletter**: Email signup with inline form
9. **Footer**: Four-column layout with navigation, social links, legal

### Technical Details
- Single HTML file, no external dependencies (except Google Fonts)
- CSS-only animations: scroll reveals, hover transitions, parallax
- Responsive breakpoints at 1024px, 768px, 480px
- Custom scrollbar styled to brand
- Noise texture overlay for visual depth
- Custom cursor effect on desktop
- Loading screen with animated progress bar
- Counter animation on hero stats
- All content in Greek language

### Performance
- No images used (emoji-based icons, CSS gradients for visuals)
- Minimal JavaScript (scroll handlers use passive listeners)
- CSS animations use transform/opacity for GPU acceleration
- Fonts loaded via Google Fonts with display=swap

## File
- `index.html` - Complete single-page website
