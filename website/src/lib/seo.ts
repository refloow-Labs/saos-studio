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
  /** Per-route social image; falls back to `OG_IMAGE`. */
  ogImage?: string
  /**
   * Label for this route's `BreadcrumbList` node. Omitted on `/`, which is the
   * breadcrumb root rather than an entry in it.
   */
  breadcrumb?: string
}

export const routes: RouteMeta[] = [
  {
    path: '/',
    file: 'index.html',
    title: 'SAOS Studio — Κατασκευή ιστοσελίδων για την επιχείρησή σας',
    description:
      'Σχεδιάζουμε websites που συνδυάζουν καθαρό design, ταχύτητα και πραγματική χρησιμότητα. Εφάπαξ κατασκευή ιστοσελίδας, με προαιρετικό μηνιαίο SEO για συνεχή ανάπτυξη.',
    priority: '1.0',
    changefreq: 'weekly',
  },
  {
    path: '/our-story',
    file: 'our-story/index.html',
    title: 'Η ιστορία μας — SAOS Studio',
    description:
      'Ποιοι είμαστε, γιατί ξεκινήσαμε και πώς δουλεύουμε. Μια μικρή ομάδα από τη Σαμοθράκη που φτιάχνει ιστοσελίδες για μικρές και μεσαίες επιχειρήσεις.',
    priority: '0.7',
    changefreq: 'monthly',
    breadcrumb: 'Η ιστορία μας',
  },
  {
    path: '/services',
    file: 'services/index.html',
    title: 'Υπηρεσίες — Κατασκευή ιστοσελίδων & SEO | SAOS Studio',
    description:
      'Κατασκευή ιστοσελίδας με εφάπαξ κόστος, μηνιαία συνδρομή SEO και custom πακέτα. Δείτε τι περιλαμβάνει κάθε υπηρεσία και ζητήστε προσφορά.',
    priority: '0.9',
    changefreq: 'monthly',
    breadcrumb: 'Υπηρεσίες',
  },
  {
    path: '/how-it-works',
    file: 'how-it-works/index.html',
    title: 'Πώς λειτουργεί — Η διαδικασία μας | SAOS Studio',
    description:
      'Από την πρώτη κουβέντα μέχρι τη δημοσίευση: προσφορά, σχεδιασμός, κατασκευή, διορθώσεις και launch. Δείτε βήμα βήμα τι συμβαίνει και πότε.',
    priority: '0.8',
    changefreq: 'monthly',
    breadcrumb: 'Πώς λειτουργεί',
  },
  {
    path: '/examples',
    file: 'examples/index.html',
    title: 'Έργα & παραδείγματα σχεδιασμού — SAOS Studio',
    description:
      'Δείγματα σχεδιασμού από εστίαση, φιλοξενία, υγεία και βραχυχρόνια μίσθωση. Δείτε το εύρος της δουλειάς μας και πώς προσεγγίζουμε κάθε κλάδο.',
    priority: '0.8',
    changefreq: 'monthly',
    breadcrumb: 'Έργα',
  },
  {
    path: '/reviews',
    file: 'reviews/index.html',
    title: 'Κριτικές πελατών — SAOS Studio',
    description:
      'Τι λένε οι πελάτες μας για τη συνεργασία, τον σχεδιασμό και τα αποτελέσματα.',
    priority: '0.6',
    changefreq: 'monthly',
    breadcrumb: 'Κριτικές',
  },
  {
    path: '/faq',
    file: 'faq/index.html',
    title: 'Συχνές ερωτήσεις — SAOS Studio',
    description:
      'Απαντήσεις για κόστος, χρόνο κατασκευής, hosting και domain, αλλαγές μετά την παράδοση, SEO και υποστήριξη.',
    priority: '0.7',
    changefreq: 'monthly',
    breadcrumb: 'Συχνές ερωτήσεις',
  },
  {
    path: '/request-a-quote',
    file: 'request-a-quote/index.html',
    title: 'Ζητήστε προσφορά — SAOS Studio',
    description:
      'Πείτε μας λίγα λόγια για την επιχείρηση και το project σας. Θα το εξετάσουμε και θα επικοινωνήσουμε σύντομα με πρόταση και κόστος.',
    priority: '0.9',
    changefreq: 'monthly',
    breadcrumb: 'Ζητήστε προσφορά',
  },
  {
    path: '/privacy',
    file: 'privacy/index.html',
    title: 'Πολιτική Απορρήτου — SAOS Studio',
    description:
      'Πώς η SAOS Studio συλλέγει, χρησιμοποιεί και προστατεύει τα προσωπικά σας δεδομένα, σύμφωνα με τον GDPR. Διαχείριση cookies και δικαιώματα χρηστών.',
    priority: '0.3',
    changefreq: 'yearly',
    breadcrumb: 'Πολιτική απορρήτου',
  },
  {
    path: '/terms',
    file: 'terms/index.html',
    title: 'Όροι χρήσης — SAOS Studio',
    description:
      'Οι όροι που διέπουν τη χρήση της ιστοσελίδας και τη συνεργασία με τη SAOS Studio.',
    priority: '0.2',
    changefreq: 'yearly',
    breadcrumb: 'Όροι χρήσης',
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
