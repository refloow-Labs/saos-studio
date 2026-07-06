# James Joyce Irish Pub & Restaurant - Website

## Design Decisions

### Aesthetic Direction
**Dark Literary Pub** - A moody, warm atmosphere evoking the interior of a traditional Irish pub. The design avoids bright, modern web conventions in favor of a rich, textured experience that feels like stepping through the door of The Joyce itself.

### Color Palette
- **Dark Wood (#2C1810 / #1A0E09):** Primary background colors mimicking aged mahogany bar tops and wood paneling
- **Deep Emerald (#1B4332):** Accent backgrounds for the drinks section, referencing Ireland's green without being literal
- **Warm Amber (#D4A853):** All highlights, headings, borders, and interactive elements - inspired by whiskey in a glass and the warm glow of pub lighting
- **Cream (#F5ECD7):** Body text, chosen over white for warmth and readability against dark backgrounds

### Typography
- **Playfair Display** (headings): A transitional serif with high contrast and elegant italics, chosen to evoke the literary tradition of James Joyce. The ornate display weight creates a sense of occasion fitting for a pub named after one of literature's greatest figures.
- **Cormorant Garamond** (body): A refined serif with excellent legibility at body sizes, pairing well with Playfair while maintaining a literary, editorial tone.
- **Libre Baskerville** (labels/accents): Used for small caps, navigation, and section labels - its sturdy construction reads well at small sizes while maintaining serif elegance.

### Texture & Atmosphere
- **CSS wood-grain pattern:** Subtle repeating linear gradients create a faint wood-grain texture across the entire page without loading any images
- **Film grain overlay:** An SVG-based noise filter at very low opacity adds organic warmth and prevents the flat digital look
- **Dark vignette on hero:** Radial gradient darkening the edges creates a cinematic, intimate feeling
- **Corner ornaments on menu card:** Pure CSS decorative corners evoke traditional pub menu cards and old-world print design

### Layout Architecture
1. **Hero:** Full-viewport dark section with ornate typography, logo, and the pub's philosophy quote. Parallax scrolling effect on content with opacity fade.
2. **Our Story:** Asymmetric two-column editorial layout - text-heavy left column with a bordered image placeholder right. Blockquote styling with amber left border.
3. **Menu:** Centered "menu card" with double border (outer + inner), corner ornaments, and two-column food layout with dotted price leaders - styled after physical pub menu cards.
4. **Drinks:** Three-card grid on deep green background highlighting beer, whiskey, and cocktails with emoji icons and hover lift effects.
5. **Award:** Centered badge/plaque design with double border treatment, prominently displaying the Restaurant Guru 2023 award.
6. **Gallery:** CSS masonry layout (columns property) with varying-height placeholder boxes, each labeled with a scene description.
7. **Experience:** Four-column grid with single-pixel gap borders creating a window-pane effect, highlighting live sports, music, events, and Sunday roast.
8. **Contact:** Three-column layout with address, phone/email/social, and hours, followed by a full-width map placeholder.
9. **Footer:** Minimal bar with copyright, social links, and SAOS Studio credit.

### Interactions & Motion
- **Scroll reveal:** IntersectionObserver-based fade-up animations with staggered delays for sequential element appearances
- **Hero parallax:** Content moves slightly on scroll with opacity fade for depth
- **Navigation transform:** Transparent on hero, darkens with blur and shadow on scroll, logo scales down
- **Hover states:** Drink cards lift with border brightening; gallery items illuminate their labels; nav links get animated underlines; experience grid items get green tint backgrounds
- **Mobile menu:** Animated hamburger-to-X transformation with full-screen overlay

### Responsive Strategy
- **Desktop (1024px+):** Full multi-column layouts, masonry gallery in 3 columns
- **Tablet (768-1024px):** Experience grid drops to 2 columns, gallery to 2 columns
- **Mobile (768px and below):** All grids collapse to single column, mobile nav overlay, reduced padding, menu card items stack vertically at smallest sizes

### Technical Choices
- Single HTML file with embedded CSS and JavaScript - zero external dependencies beyond Google Fonts
- No JavaScript framework - vanilla JS for scroll effects and mobile menu
- CSS custom properties for consistent theming
- No images required (logo loaded from existing domain) - all textures are pure CSS
- Semantic HTML5 structure
- Accessibility: ARIA label on nav toggle, proper heading hierarchy, link focus states inherited from browser defaults

### Brand Alignment
The design deliberately avoids the clean, bright aesthetic common to restaurant websites. Instead, it channels the actual experience of being in an Irish pub: warm, dark, intimate, slightly rough-around-the-edges but welcoming. The literary serif typography honors the James Joyce namesake, while the amber-on-dark color scheme captures the glow of a well-lit bar in a dim room.
