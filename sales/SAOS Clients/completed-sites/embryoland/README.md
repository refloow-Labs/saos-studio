# EMBRYOLAND - Website Design Decisions

## Concept: "The Warmth of Life"
An organic, nurturing aesthetic that communicates trust, warmth, and scientific excellence for a leading IVF clinic. The design balances medical professionalism with emotional warmth, reflecting the deeply personal journey of fertility treatment.

## Color Palette
- **Sage green** (#8FAE8B) as the primary brand color -- conveys life, growth, and calm
- **Warm cream** (#FBF7F0) backgrounds -- avoids clinical white, feels welcoming
- **Soft coral** (#E8957A) for CTAs and accents -- warmth, life energy, draws the eye without aggression
- **Deep sage** (#5C7A56) for authority and text contrast
- All colors chosen to feel nurturing rather than clinical

## Typography
- **Playfair Display** (serif) for headings -- elegant, warm, trustworthy. Its italic form carries emotional weight for the tagline
- **DM Sans** for body text -- rounded, friendly sans-serif that reads clearly at all sizes without feeling cold
- This pairing avoids the generic medical-site feel while maintaining professionalism

## Layout & Sections
1. **Navigation**: Fixed, with glassmorphism on scroll. Clean logo + links with coral CTA button
2. **Hero**: Full-viewport with animated organic orbs and cell-like floating elements (embryology motif). Stats bar at bottom with animated counters. Strong emotional tagline with italic emphasis on "life"
3. **About**: Two-column with animated concentric rings illustration (cell/embryo reference). ISO badge overlay. Feature grid with checkmark items
4. **Services**: 3-column card grid with hover animations (top-border reveal, icon color shift, lift). Each card has a relevant SVG icon
5. **Doctors**: Horizontal scroll carousel with snap scrolling. Lead doctor (Dr. Kanakas) has a coral badge. All 9 doctors included
6. **Testimonials**: Dark sage background with glassmorphic cards. 4 testimonials from London, Australia, Greece, and Germany (reflecting multilingual reach). Star ratings included
7. **International**: World map SVG with pulsing dots. Language badges with flag emojis. Stats row
8. **Contact**: Two-column with info cards and embedded Google Maps. Phone, email, address, and hours
9. **Certifications**: Horizontal badge row with ISO and recognition items
10. **Footer**: 4-column grid with brand, services, clinic, and contact info. Social icons

## Visual Effects & Motion
- **Scroll reveal**: IntersectionObserver-driven fade-up animations with staggered delays
- **Floating orbs**: Large blurred gradient circles in the hero that drift slowly -- creates organic depth
- **Cell motif**: CSS-only circles with borders that float and rotate, referencing embryology without being literal
- **Counter animation**: Numbers count up when scrolled into view using eased cubic function
- **Hover states**: Cards lift with shadow enhancement, service icons change color, nav links get underline reveal
- **Noise texture**: Subtle full-page grain overlay for organic warmth

## Technical Details
- Single `index.html` with embedded CSS and vanilla JS
- No external dependencies except Google Fonts
- Fully responsive with breakpoints at 1024px, 768px, and 480px
- Mobile hamburger menu with animated transition
- Scroll-snap on doctor carousel
- Custom scrollbar styling
- Smooth scroll behavior for anchor links
- Greek text throughout as primary language
- Semantic HTML with ARIA labels for accessibility

## Greek Language
All content is in Greek with the exception of one German testimonial (to showcase multilingual capability). Section labels, navigation, and all UI copy are in Greek to authentically represent this Athens-based institution.
