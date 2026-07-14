/**
 * Design Brief Generator
 * Creates comprehensive design briefs for the Claude Code designer agent
 */

export class DesignBriefGenerator {
  /**
   * Generate a world-class design brief for a lead
   * @param {Object} lead - Lead information from CRM
   * @returns {Object} Complete design brief
   */
  generateBrief(lead) {
    const company = lead.Company || lead.company || 'Business';
    const industry = this.parseIndustry(lead);
    const location = lead['Περιοχή'] || lead.location || 'Greece';

    const brief = {
      // Basic Information
      company,
      industry,
      location,

      // Design Strategy
      design_strategy: this.getDesignStrategy(industry),

      // Visual Identity
      color_palette: this.selectColorPalette(industry),
      typography: this.selectTypography(industry),
      design_style: this.selectDesignStyle(industry),

      // Content Structure
      sections: this.determineSections(industry),

      // User Experience
      ux_goals: this.defineUXGoals(industry),

      // Technical Requirements
      technical_requirements: this.getTechnicalRequirements(),

      // Greek Context
      greek_localization: this.getGreekLocalization(location),
    };

    return brief;
  }

  /**
   * Parse industry from NACE description
   */
  parseIndustry(lead) {
    const nace = lead['NACE 2 Desc'] || lead.industry || '';

    // Map NACE to simplified categories
    const industryMap = {
      'restaurant': { type: 'restaurant', keywords: ['restaurant', 'tavern', 'food', 'dining'] },
      'hotel': { type: 'hotel', keywords: ['hotel', 'accommodation', 'lodging', 'room'] },
      'healthcare': { type: 'healthcare', keywords: ['health', 'medical', 'clinic', 'doctor', 'pharmacy'] },
      'retail': { type: 'retail', keywords: ['shop', 'store', 'retail', 'market'] },
      'services': { type: 'services', keywords: ['service', 'repair', 'maintenance'] },
      'tourism': { type: 'tourism', keywords: ['tour', 'travel', 'excursion', 'activity'] },
      'cafe': { type: 'cafe', keywords: ['cafe', 'coffee', 'bar'] },
    };

    const naceLower = nace.toLowerCase();

    for (const [key, config] of Object.entries(industryMap)) {
      if (config.keywords.some(keyword => naceLower.includes(keyword))) {
        return { type: key, full: nace };
      }
    }

    return { type: 'general', full: nace };
  }

  /**
   * Get design strategy based on industry
   */
  getDesignStrategy(industry) {
    const strategies = {
      restaurant: {
        primary_goal: 'Entice visitors with visual appeal and make booking easy',
        emotion: 'Warmth, appetite appeal, authenticity',
        hierarchy: ['Hero image with signature dish', 'Menu highlights', 'Reservation CTA', 'Location'],
      },
      hotel: {
        primary_goal: 'Showcase rooms and amenities, drive direct bookings',
        emotion: 'Relaxation, luxury, comfort',
        hierarchy: ['Stunning property images', 'Room types', 'Booking engine', 'Amenities', 'Location'],
      },
      healthcare: {
        primary_goal: 'Build trust and make appointment booking simple',
        emotion: 'Trust, professionalism, care',
        hierarchy: ['Professional imagery', 'Services', 'Doctor profiles', 'Appointment booking', 'Contact'],
      },
      retail: {
        primary_goal: 'Showcase products and drive store visits or online orders',
        emotion: 'Excitement, discovery, value',
        hierarchy: ['Product showcase', 'Categories', 'Special offers', 'Store info', 'Contact'],
      },
      tourism: {
        primary_goal: 'Inspire wanderlust and make booking tours easy',
        emotion: 'Adventure, discovery, excitement',
        hierarchy: ['Destination imagery', 'Tour packages', 'Booking form', 'Reviews', 'Contact'],
      },
      cafe: {
        primary_goal: 'Create inviting atmosphere and showcase offerings',
        emotion: 'Coziness, community, quality',
        hierarchy: ['Ambiance images', 'Menu', 'Location', 'Hours', 'Contact'],
      },
      general: {
        primary_goal: 'Present business professionally and drive customer action',
        emotion: 'Trust, professionalism, reliability',
        hierarchy: ['Hero section', 'Services', 'About', 'Contact'],
      },
    };

    return strategies[industry.type] || strategies.general;
  }

  /**
   * Select color palette based on industry
   */
  selectColorPalette(industry) {
    const palettes = {
      restaurant: {
        name: 'Mediterranean Warmth',
        primary: '#D2691E', // Warm terracotta
        secondary: '#F4A460', // Sandy brown
        accent: '#228B22', // Greek olive
        neutral: '#F5F5DC', // Beige
        text: '#2F4F4F', // Dark slate
        usage: 'Warm, inviting colors that evoke Greek cuisine and hospitality',
      },
      hotel: {
        name: 'Aegean Luxury',
        primary: '#4A90E2', // Aegean blue
        secondary: '#FFFFFF', // Pure white
        accent: '#FFD700', // Gold
        neutral: '#F8F9FA', // Off-white
        text: '#1A1A1A', // Near black
        usage: 'Clean, luxurious palette inspired by Greek islands',
      },
      healthcare: {
        name: 'Medical Trust',
        primary: '#0077BE', // Medical blue
        secondary: '#FFFFFF', // Clean white
        accent: '#00A86B', // Healthy green
        neutral: '#F0F4F8', // Light gray-blue
        text: '#333333', // Charcoal
        usage: 'Professional, trustworthy colors for healthcare',
      },
      cafe: {
        name: 'Coffee & Comfort',
        primary: '#6F4E37', // Coffee brown
        secondary: '#F5DEB3', // Wheat
        accent: '#D4AF37', // Golden
        neutral: '#FFF8DC', // Cornsilk
        text: '#3E2723', // Dark brown
        usage: 'Warm, cozy palette for cafe atmosphere',
      },
      tourism: {
        name: 'Adventure Blue',
        primary: '#1E88E5', // Vibrant blue
        secondary: '#FFA726', // Sunset orange
        accent: '#26A69A', // Teal
        neutral: '#FAFAFA', // Almost white
        text: '#212121', // Very dark gray
        usage: 'Energetic colors that inspire adventure',
      },
      general: {
        name: 'Professional Modern',
        primary: '#2C3E50', // Navy
        secondary: '#3498DB', // Blue
        accent: '#E74C3C', // Red accent
        neutral: '#ECF0F1', // Light gray
        text: '#2C3E50', // Navy
        usage: 'Clean, professional palette for business',
      },
    };

    return palettes[industry.type] || palettes.general;
  }

  /**
   * Select typography based on industry
   */
  selectTypography(industry) {
    const typography = {
      restaurant: {
        heading: 'Playfair Display',
        body: 'Lato',
        accent: 'Dancing Script',
        rationale: 'Elegant serif for headings, clean sans-serif for readability',
      },
      hotel: {
        heading: 'Montserrat',
        body: 'Open Sans',
        accent: 'Cormorant Garamond',
        rationale: 'Modern, luxury-appropriate, highly readable',
      },
      healthcare: {
        heading: 'Roboto',
        body: 'Roboto',
        accent: 'Roboto Slab',
        rationale: 'Professional, clean, accessible',
      },
      cafe: {
        heading: 'Merriweather',
        body: 'Source Sans Pro',
        accent: 'Pacifico',
        rationale: 'Friendly, welcoming, cozy feel',
      },
      tourism: {
        heading: 'Poppins',
        body: 'Nunito',
        accent: 'Lobster',
        rationale: 'Modern, friendly, adventure-inspiring',
      },
      general: {
        heading: 'Inter',
        body: 'Inter',
        accent: 'Inter',
        rationale: 'Clean, modern, highly readable',
      },
    };

    return typography[industry.type] || typography.general;
  }

  /**
   * Select design style based on industry
   */
  selectDesignStyle(industry) {
    const styles = {
      restaurant: 'Modern Mediterranean with warm imagery',
      hotel: 'Luxury minimalism with hero imagery',
      healthcare: 'Clean, professional, trust-building',
      cafe: 'Cozy, artisanal, community-focused',
      tourism: 'Dynamic, image-heavy, adventure-inspiring',
      retail: 'Product-focused, clean grid layouts',
      general: 'Modern business with clear hierarchy',
    };

    return styles[industry.type] || styles.general;
  }

  /**
   * Determine page sections based on industry
   */
  determineSections(industry) {
    const sections = {
      restaurant: [
        { name: 'hero', content: 'Full-width hero with signature dish image and name' },
        { name: 'about', content: 'Story of the restaurant, cuisine type' },
        { name: 'menu', content: 'Menu highlights or categories' },
        { name: 'gallery', content: 'Food and restaurant ambiance photos' },
        { name: 'reservations', content: 'Booking CTA or contact form' },
        { name: 'location', content: 'Map, address, hours' },
        { name: 'contact', content: 'Phone, email, social media' },
      ],
      hotel: [
        { name: 'hero', content: 'Stunning property image with booking CTA' },
        { name: 'rooms', content: 'Room types with images and features' },
        { name: 'amenities', content: 'Hotel facilities and services' },
        { name: 'gallery', content: 'Property photos' },
        { name: 'location', content: 'Map, nearby attractions' },
        { name: 'booking', content: 'Booking form or link to booking engine' },
        { name: 'contact', content: 'Contact information' },
      ],
      healthcare: [
        { name: 'hero', content: 'Professional medical imagery with trust message' },
        { name: 'services', content: 'Medical services offered' },
        { name: 'doctors', content: 'Doctor profiles and specializations' },
        { name: 'appointments', content: 'Appointment booking' },
        { name: 'location', content: 'Clinic address and directions' },
        { name: 'contact', content: 'Phone, emergency contact' },
      ],
      cafe: [
        { name: 'hero', content: 'Cozy cafe atmosphere image' },
        { name: 'menu', content: 'Coffee, food, and drink offerings' },
        { name: 'about', content: 'Cafe story and philosophy' },
        { name: 'gallery', content: 'Interior and product photos' },
        { name: 'location', content: 'Address, hours, map' },
        { name: 'contact', content: 'Social media, phone' },
      ],
      tourism: [
        { name: 'hero', content: 'Stunning destination image' },
        { name: 'tours', content: 'Tour packages and experiences' },
        { name: 'gallery', content: 'Experience photos' },
        { name: 'booking', content: 'Tour booking form' },
        { name: 'reviews', content: 'Customer testimonials' },
        { name: 'contact', content: 'Contact and social media' },
      ],
      general: [
        { name: 'hero', content: 'Professional hero section' },
        { name: 'services', content: 'Services or products' },
        { name: 'about', content: 'Company information' },
        { name: 'contact', content: 'Contact form and information' },
      ],
    };

    return sections[industry.type] || sections.general;
  }

  /**
   * Define UX goals based on industry
   */
  defineUXGoals(industry) {
    return {
      primary_cta: this.getPrimaryCTA(industry),
      mobile_optimization: 'Mobile-first design, touch-friendly elements',
      accessibility: 'WCAG 2.1 AA compliance, keyboard navigation, screen reader friendly',
      performance: 'Fast loading, optimized images, minimal dependencies',
      seo: 'Semantic HTML, meta tags, structured data',
    };
  }

  /**
   * Get primary CTA based on industry
   */
  getPrimaryCTA(industry) {
    const ctas = {
      restaurant: 'Book a Table / Make Reservation',
      hotel: 'Book Now / Check Availability',
      healthcare: 'Book Appointment / Contact Us',
      cafe: 'Visit Us / View Menu',
      tourism: 'Book Tour / Get Quote',
      retail: 'Shop Now / Visit Store',
      general: 'Contact Us / Learn More',
    };

    return ctas[industry.type] || ctas.general;
  }

  /**
   * Get technical requirements
   */
  getTechnicalRequirements() {
    return {
      format: 'Single-file HTML with embedded CSS and minimal JS',
      responsive: 'Mobile (320px+), Tablet (768px+), Desktop (1024px+)',
      browsers: 'Modern browsers (Chrome, Firefox, Safari, Edge)',
      assets: 'Use placeholder images or free stock photos',
      forms: 'Functional contact forms with validation',
      animations: 'Subtle, performance-friendly animations',
      no_dependencies: 'Avoid external dependencies where possible',
    };
  }

  /**
   * Get Greek localization requirements
   */
  getGreekLocalization(location) {
    return {
      language: 'Bilingual - Greek and English',
      content: 'Default to Greek with English toggle option',
      fonts: 'Support Greek characters',
      cultural: 'Incorporate Greek aesthetic elements subtly',
      location_emphasis: `Highlight ${location} location prominently`,
    };
  }

  /**
   * Generate complete prompt for Claude Code designer agent
   */
  generateDesignerPrompt(lead) {
    const brief = this.generateBrief(lead);

    const prompt = `You are a world-class UI/UX designer creating a professional website for a Greek business.

**Client Information:**
- Company: ${brief.company}
- Industry: ${brief.industry.full}
- Location: ${brief.location}

**Design Strategy:**
${JSON.stringify(brief.design_strategy, null, 2)}

**Visual Identity:**

Color Palette: ${brief.color_palette.name}
- Primary: ${brief.color_palette.primary} (${brief.color_palette.usage})
- Secondary: ${brief.color_palette.secondary}
- Accent: ${brief.color_palette.accent}
- Neutral: ${brief.color_palette.neutral}
- Text: ${brief.color_palette.text}

Typography:
- Headings: ${brief.typography.heading}
- Body: ${brief.typography.body}
- Accent: ${brief.typography.accent}
Rationale: ${brief.typography.rationale}

Design Style: ${brief.design_style}

**Page Sections:**
${brief.sections.map((s, i) => `${i + 1}. ${s.name.toUpperCase()}: ${s.content}`).join('\n')}

**UX Requirements:**
- Primary CTA: ${brief.ux_goals.primary_cta}
- Mobile: ${brief.ux_goals.mobile_optimization}
- Accessibility: ${brief.ux_goals.accessibility}
- Performance: ${brief.ux_goals.performance}
- SEO: ${brief.ux_goals.seo}

**Technical Requirements:**
${JSON.stringify(brief.technical_requirements, null, 2)}

**Greek Context:**
${JSON.stringify(brief.greek_localization, null, 2)}

**Task:**
Create a complete, production-ready website that:
1. Implements all sections listed above
2. Uses the specified color palette and typography
3. Is fully responsive (mobile-first)
4. Is accessible (WCAG 2.1 AA)
5. Has smooth, subtle animations
6. Includes functional contact form with validation
7. Uses placeholder images where needed
8. Is delivered as a single HTML file with embedded CSS and JS

The website should be visually stunning, professional, and perfectly suited for the industry and location.`;

    return {
      brief,
      prompt,
    };
  }
}
