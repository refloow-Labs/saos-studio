# Dental Home – Brand Direction & Build Notes

## Business Overview

**Practice:** Dental Home  
**Doctor:** Δρ. Ηρακλής Αδάκτυλος (Dr. Iraklis Adaktylos)  
**Location:** Αλεξανδρούπολη (Alexandroupoli), Evros, Greece  
**Google Rating:** 5.0 ⭐ | 320+ reviews  
**Current Website:** None  
**Online Presence:** Google Maps listing only  

This is one of the highest-reviewed dental practices in the Alexandroupoli area, operating entirely on word-of-mouth. The absence of a website is a significant growth gap.

---

## Design Direction

### Color Palette
| Role | Color | Notes |
|------|-------|-------|
| Primary dark | `#0B1F3A` (deep navy) | Trust, professionalism, medical authority |
| Accent teal | `#0F7EA0` / `#17C5E8` | Health, cleanliness, modernity |
| Background | `#F5F8FB` (off-white) | Clinical freshness, openness |
| Text | `#0D1B2E` | High contrast, readable |

Rationale: Navy signals trust and expertise (think hospitals, banks). Teal bridges the gap toward vitality and healthcare. The combination reads as "premium local clinic" rather than "generic health template."

### Typography
- **Playfair Display** (headings) — serif warmth, local prestige, personal touch
- **Inter** (body) — clean, modern, highly legible at small sizes

### Hero Section
Animated gradient hero with layered CSS orbs (filter: blur) creating a soft, premium depth effect. No stock hero images in the hero itself — the visual interest comes from the gradient and the floating clinic photo card on desktop.

### Scroll Animations
Intersection Observer API (no library dependency). Elements fade up with staggered delays per section. Hero content animates in on DOMContentLoaded with sequential delays per child element.

### Photo Usage
Unsplash CDN links for:
- Hero card: `photo-1606811841689` (modern dental chair)
- About section: `photo-1588776814546` (dentist working)

Both are royalty-free for demo purposes. For production, replace with actual clinic photos.

---

## What Was Built

### `/index.html`
Fully self-contained landing page (inline CSS + vanilla JS). Sections:
1. **Navbar** — Fixed, blur backdrop, scroll-aware shadow, CTA button
2. **Hero** — Full-viewport gradient with animated orbs, floating image card, review bubble, stat counters
3. **About Dr. Adaktylos** — Two-column with photo, badge overlay, credential list
4. **Services** — 3-column grid with hover effects: General, Cosmetic, Orthodontics, Implants, Periodontics, Pediatric
5. **Why Choose Us** — Dark navy section, 5-star rating showcase, 5 feature callouts
6. **Testimonials** — 3-card grid with fabricated-but-typical Google review style
7. **Contact & CTA** — Split layout: contact info + prominent appointment CTA box
8. **Footer** — Simple, professional

### `/outreach.md`
- Greek cold email (personalized, demo-first approach)
- English business description (1 paragraph, pitch-ready)
- LinkedIn cold message (conversational, no hard sell)

### `/README.md`
This file.

---

## Production Checklist (if taken forward)

- [ ] Replace placeholder phone number with actual number
- [ ] Get actual clinic address for contact section
- [ ] Replace Unsplash photos with real clinic/doctor photos
- [ ] Add real Google Maps embed
- [ ] Wire up appointment form (Calendly, WhatsApp, or simple email form)
- [ ] Add proper meta tags (OG, description, title)
- [ ] Register a domain (e.g. `dentalhome-alexandroupoli.gr`)
- [ ] Set up Google Analytics
- [ ] Submit to Google Search Console

---

## SAOS Studio Demo Context

This page was created as a SAOS Studio demo to illustrate the value of a professional web presence for local Greek businesses with strong offline reputation but no digital presence. Target use case: approaching high-rated local professionals who are missing out on organic web discovery.
