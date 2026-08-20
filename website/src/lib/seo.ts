/**
 * Per-route SEO metadata — the single source of truth for titles, descriptions,
 * canonicals and indexability.
 *
 * Consumed at build time by `scripts/prerender.mjs` (which injects the head tags)
 * and `scripts/generate-sitemap.mjs` (which lists the indexable routes), both via
 * the SSR bundle. Keeping one list means the sitemap can never advertise a route
 * that the prerenderer marked noindex.
 */

export const SITE_URL = 'https://saos.studio'
export const SITE_NAME = 'SAOS Studio'
export const SITE_LOCALE = 'el_GR'
export const SITE_LANG = 'el'
export const CONTACT_EMAIL = 'saos.ventures@gmail.com'
export const BOOKING_URL =
  'https://calendly.com/tambakisgiannis/refloow-labs-discovery-call'

/** Default social preview image, generated into `public/og-default.png`. */
export const OG_IMAGE = '/og-default.png'

export interface RouteMeta {
  /** URL path as served. */
  path: string
  /** Output file, relative to the build directory. */
  file: string
  title: string
  description: string
  /** Excluded from the sitemap and marked `noindex` in the head. */
  noindex?: boolean
  /** Sitemap priority; omitted for noindex routes. */
  priority?: string
  changefreq?: string
}

export const routes: RouteMeta[] = [
  {
    path: '/',
    file: 'index.html',
    title: 'SAOS Studio — Επαγγελματικές Ιστοσελίδες από €46/μήνα',
    description:
      'Όμορφες, επαγγελματικές ιστοσελίδες σχεδιασμένες από AI και εκλεπτυσμένες από ανθρώπινο χέρι. Συνδρομητικά πακέτα από €46/μήνα — παράδοση σε μέρες, όχι μήνες.',
    priority: '1.0',
    changefreq: 'weekly',
  },
  {
    path: '/privacy',
    file: 'privacy/index.html',
    title: 'Πολιτική Απορρήτου — SAOS Studio',
    description:
      'Πώς η SAOS Studio συλλέγει, χρησιμοποιεί και προστατεύει τα προσωπικά σας δεδομένα, σύμφωνα με τον GDPR. Διαχείριση cookies και δικαιώματα χρηστών.',
    priority: '0.3',
    changefreq: 'yearly',
  },
  {
    // Netlify serves this file for any unmatched path, with a real 404 status.
    path: '/404',
    file: '404.html',
    title: 'Η σελίδα δεν βρέθηκε — SAOS Studio',
    description: 'Η σελίδα που ζητήσατε δεν υπάρχει ή έχει μετακινηθεί.',
    noindex: true,
  },
]

/** Absolute canonical URL for a route path. */
export function canonicalFor(path: string): string {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
}

/** Routes that belong in the XML sitemap. */
export function indexableRoutes(): RouteMeta[] {
  return routes.filter((r) => !r.noindex)
}
