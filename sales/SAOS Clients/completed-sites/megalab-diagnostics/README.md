# MEGALAB Diagnostics - Website

## Design Decisions

### Aesthetic Direction
Clinical precision meets patient warmth. The design channels a modern diagnostic laboratory that feels approachable rather than sterile — think scientific rigor expressed through clean geometry, confident color, and clear information hierarchy. The navy hero section establishes authority and trust, while teal accents and coral highlights create a healthcare identity that is distinctive without being cold.

### Color Palette
- **Deep teal (#0d6e6e)**: Primary brand color — used for CTAs, icons, interactive elements, and accent backgrounds. Conveys medical trust and scientific expertise
- **Navy (#1a2744)**: Hero and footer backgrounds, primary text color — provides depth and gravitas
- **Warm coral (#e8725a)**: Accent color for badges, highlights, and visual punctuation — adds warmth and draws attention to key actions
- **White (#ffffff)**: Primary content background — clean and clinical
- **Light gray (#f4f7f9)**: Card backgrounds and alternate sections — subtle contrast without harshness
- **Gray scale (#edf1f4 to #637382)**: Supporting text and borders — layered typographic hierarchy

### Typography
- **Instrument Serif** (display): All section headings and location names — an elegant serif with character that avoids generic medical blandness. The italic variant adds warmth to the hero statement
- **DM Sans** (body): All body text, labels, navigation, and buttons — a geometric sans-serif with excellent legibility and modern medical feel. Good Greek character support
- **JetBrains Mono** (accent): Section labels, phone numbers, and data-like elements — reinforces the precision/laboratory motif without feeling cold

### Layout & Structure
1. Fixed navbar with scroll-aware background blur and teal-to-coral gradient scroll progress bar
2. Full-viewport navy hero with staggered reveal animations, decorative DNA helix motif, and floating molecular circles
3. Trust bar with four key differentiators (Certified Labs, Fast Results, Home Sampling, App Results)
4. Services grid (2x2) with four diagnostic departments — each card has corner accent, icon with coral dot, and tag chips
5. Teal check-up section with glassmorphic program cards (4 check-up types) and dot-pattern background texture
6. EOPYY insurance badge section — compact, high-signal with dashed border badge motif
7. Locations grid (4x4, responsive) — 8 location cards with pin icons, addresses, and clickable phone numbers. HQ card distinguished with coral accent
8. Navy app section with CSS phone mockup showing realistic lab results data, feature checklist, and store badges
9. Four-column footer with brand info, service links, information links, and HQ contact details

### Key Design Details
- Teal-to-coral gradient scroll progress bar at page top
- Logo mark: teal square with coral corner triangle — simple, memorable, medical-geometric
- DNA double helix decorative element in hero (teal and coral node pairs with gradient bridges)
- Floating molecular circle outlines with gentle drift animation in hero background
- Subtle grid overlay patterns on dark sections for scientific texture
- Service card corner has expanding circle on hover
- Each service icon has a small coral dot accent (bottom-right) echoing the logo mark
- Location cards highlight Gerakas HQ with coral pin and label badge
- Phone mockup in app section shows realistic Greek lab result data with green/coral value indicators
- Section labels use monospace font with coral dot prefix — reinforces lab/data aesthetic
- Intersection Observer drives staggered reveal, left-slide, and right-slide animations
- Counter animation on hero stats with easeOutQuart easing
- Back-to-top button with teal background and hover lift

### Technical Notes
- Single self-contained HTML file, no external dependencies except Google Fonts
- Fully responsive with breakpoints at 480px, 768px, and 1024px
- Mobile navigation with animated hamburger toggle and overlay
- CSS custom properties for easy theme adjustment
- All content in Greek language
- Smooth scroll with fixed navbar offset compensation
- Intersection Observer for performant scroll-triggered animations
- Passive scroll listener for navbar and progress bar performance
- All phone numbers are clickable tel: links
- Email is a clickable mailto: link

### Skipped / Notes
- Original site URL: http://www.megalab.info
- Client: MEGALAB ΙΔΙΩΤΙΚΑ ΔΙΑΓΝΩΣΤΙΚΑ ΕΡΓΑΣΤΗΡΙΑ - ΚΕΝΤΡΑ Α.Ε.
