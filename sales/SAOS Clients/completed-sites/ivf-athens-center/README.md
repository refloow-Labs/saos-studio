# IVF Athens Center - Website

## Design Decisions

### Aesthetic Direction
"Hope is Born" -- A warm, emotionally resonant design that balances clinical authority with nurturing empathy. The aesthetic avoids sterile medical coldness in favor of organic curves, soft gradients, and a sense of light and possibility. The design evokes the feeling of a fertility journey: anticipation, trust, and the quiet joy of new beginnings. Subtle grain textures, floating organic blobs, and gentle animations create an atmosphere of living, breathing warmth rather than static professionalism.

### Color Palette
- **Soft Rose / Blush** `#f2e0d8` -- Primary warm accent, used in backgrounds, hero circle, card icons. Evokes tenderness and femininity.
- **Rose Light** `#f8efe9` -- Lighter variant for subtle backgrounds and gradients.
- **Deep Plum** `#4a2040` -- Dominant brand color for headings, navigation, buttons, and the journey section. Conveys depth, trust, and sophistication.
- **Plum Light** `#6b3a5e` -- Hover states and accent gradients.
- **Warm Cream** `#faf6f0` -- Primary page background. Creates warmth without yellowness.
- **Sage Green** `#7a9e7e` -- Service card icons and technology tags. Represents life, growth, and health.
- **Gentle Gold** `#c9a85c` -- Section labels, star ratings, certification badges, timeline markers. Signals excellence and quality.

### Typography
- **Headings**: Cormorant Garamond (serif) -- An elegant, editorial serif with beautiful italics. Light/regular weights create a refined, hopeful tone that distinguishes the brand from clinical competitors.
- **Body**: DM Sans -- A contemporary geometric sans-serif with excellent readability. Clean and modern without being generic (avoids Inter/Roboto/Arial).
- Font pairing creates a deliberate contrast: the warmth of the serif invites emotion while the sans-serif grounds it in professionalism.

### Layout & Structure
1. **Navigation** -- Fixed, glassmorphism on scroll, with mobile hamburger menu and full-screen overlay
2. **Hero** -- Split layout: emotional headline with italic emphasis + large circular visual element with floating trust badges (AI, Embryoscope, Psychology). Organic gradient blobs and grain texture create atmosphere.
3. **Why Us** -- 4-column grid: People, Innovation, Integrated Care, Results. Cards with gold top-border reveal on hover.
4. **Services** -- 3-column grid, 8 service cards with sage green icons. Hover lifts with subtle gradient overlay.
5. **8-Step Journey** -- Full plum background with radial gradient accents. Vertical timeline with gold numbered markers. Creates visual weight and section contrast.
6. **Technology** -- 3 centered cards (Embryoscope, AI Selection, RI Witness) with plum icons and sage tags.
7. **Certification Banner** -- Horizontal trust signals strip (TUV, RI Witness, 25+ years, multilingual).
8. **Testimonials** -- Carousel with touch support, auto-rotation, dot navigation. Large serif italic quotes.
9. **Team** -- Split layout: photo placeholder with gold accent + doctor info with stats.
10. **FAQ** -- Accordion with animated expand/collapse and rotating plus icon.
11. **Contact** -- Split: info cards (address, phone, email) with social icons + embedded Google Map.
12. **Footer** -- Dark plum, 4-column grid with brand, services, center links, contact.

### Key Design Details
- Organic floating gradient blobs in hero with parallax scroll effect
- Grain/noise texture overlay for tactile depth
- Curved SVG divider between hero and next section
- Staggered reveal animations using IntersectionObserver (no library dependencies)
- Floating badge elements around hero circle with gentle bobbing animation
- Pulsing ring animations on the hero stat circle
- Gold underline highlight on italic hero text
- Touch-enabled testimonial carousel with swipe detection
- Scroll-to-top button appears after 600px scroll
- FAQ accordion with smooth max-height transitions
- All animations use custom cubic-bezier easing (ease-out-expo) for natural motion
- Fully responsive: mobile-first breakpoints at 600px and 900px
- Self-contained: zero external dependencies beyond Google Fonts
- Greek language throughout with proper Unicode support
- Semantic HTML with ARIA attributes for accessibility

### Skipped / Notes
- Original site URL: http://www.ivfathenscenter.gr
- Client: ΑΘΑΝΑΣΙΟΥ
- Photo placeholders used for team section (SVG icon in rose gradient frame)
- Map embed uses approximate coordinates for Leoforos Kifisias 5, Marousi
- Social media links point to assumed profile URLs (@ivfathenscenter)
- Multilingual versions (EN, FR, IT) not included -- Greek version only as specified
