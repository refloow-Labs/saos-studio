# TELEX Store - Website

## Design Decisions

### Aesthetic Direction
High-fashion editorial aesthetic inspired by Net-a-Porter and luxury fashion e-commerce, adapted with Mediterranean warmth for a Cretan context. The design prioritizes generous white space, typographic hierarchy, and restrained elegance over visual clutter.

### Color Palette
- **Off-white/Cream (#f5f3ef):** Primary background, evoking natural linen and warmth
- **Charcoal (#2c2c2c):** Primary text and dark sections, softer than pure black
- **Muted Gold (#b8a88a):** Accent color suggesting understated luxury
- **Pure Black (#1a1a1a):** Footer and loader, for maximum contrast

### Typography
- **Cormorant Garamond (300-700):** All headings and display text. Its thin serifs and high contrast evoke editorial fashion magazines.
- **Montserrat (200-700):** Body text and UI labels. Clean geometric sans-serif that pairs well with the serif without competing.

### Layout Structure
1. **Announcement Bar** - Persistent sale/shipping info in charcoal
2. **Sticky Navigation** - Frosted glass effect with centered logo
3. **Editorial Hero** - Full-viewport with rotating brand names in CSS-only animation
4. **Brand Marquee** - Continuous CSS scroll ticker with all 17+ brands
5. **Men/Women Split** - Two large editorial cards with hover parallax
6. **Featured Products** - 4-column grid with quick-view hover overlay
7. **Why TELEX** - Three-column feature strip (shipping, exchanges, phone orders)
8. **Outlet/Sale** - Dark charcoal section with oversized watermark typography
9. **Editorial Story** - Asymmetric two-column with golden ratio composition
10. **Lifestyle Quote** - Centered Mediterranean philosophy statement
11. **Location & Contact** - Map placeholder with pulsing pin + full contact details
12. **Newsletter** - Minimal email capture form
13. **Footer** - 4-column layout with social links

### Technical Details
- Single HTML file, zero external dependencies (except Google Fonts CDN)
- CSS-only brand marquee animation (no JavaScript)
- CSS-only brand name rotator in hero
- Intersection Observer API for scroll-reveal animations
- Responsive breakpoints at 1024px, 900px, 768px, and 500px
- Custom cursor trail with mix-blend-mode (desktop only)
- Frosted glass navigation with backdrop-filter
- Page loader with timed reveal
- Smooth anchor scrolling with nav offset calculation
- All content in Greek language

### Performance
- No images (placeholder patterns used, ready for real product photography)
- Minimal JavaScript (~100 lines, no libraries)
- CSS transitions use GPU-accelerated properties (transform, opacity)
- Passive scroll listeners where applicable
- Font preconnect for faster Google Fonts loading

### Brand Accommodation
All 17 specified brands appear in the marquee. Product cards feature representative brand/product combinations. The design scales to accommodate the 30+ brand portfolio.

---
Built by SAOS Studio
