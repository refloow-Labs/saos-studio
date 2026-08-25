/**
 * Per-route SEO metadata — the single source of truth for titles, descriptions,
 * canonicals and indexability.
 *
 * Consumed at build time by `scripts/prerender.mjs` (which injects the head tags)
 * and `scripts/generate-sitemap.mjs` (which lists the indexable routes), both via
 * the SSR bundle. Keeping one list means the sitemap can never advertise a route
 * that the prerenderer marked noindex.
 */

import { REVIEWS_PUBLISHED } from './reviews'

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

/**
 * Held out of `routes` while `REVIEWS_PUBLISHED` is false, which is what keeps
 * `/reviews` out of the prerender, the sitemap and IndexNow simultaneously —
 * all three read this list. Kept as a named const rather than deleted so
 * republishing is a one-word change rather than a reconstruction.
 *
 * The old description claimed «Τι λένε οι πελάτες μας … και τα αποτελέσματα»
 * about nine invented reviews and zero measured results; it is rewritten here
 * so that a future republish does not restore the claim along with the route.
 */
const reviewsRoute: RouteMeta = {
  path: '/reviews',
  file: 'reviews/index.html',
  title: 'Κριτικές — SAOS Studio',
  description:
    'Τι λένε οι επιχειρήσεις που δούλεψαν μαζί μας για τη συνεργασία και το αποτέλεσμα.',
  priority: '0.6',
  changefreq: 'monthly',
  breadcrumb: 'Κριτικές',
}

export const routes: RouteMeta[] = [
  {
    path: '/',
    file: 'index.html',
    title: 'Κατασκευή ιστοσελίδων στην Αλεξανδρούπολη — SAOS Studio',
    description:
      'Ιστοσελίδες για μικρές επιχειρήσεις στη Θράκη. Πληρώνετε μία φορά για την κατασκευή και είναι δική σας — το μηνιαίο SEO είναι προαιρετικό.',
    priority: '1.0',
    changefreq: 'weekly',
  },
  {
    path: '/our-story',
    file: 'our-story/index.html',
    title: 'Η ιστορία μας — SAOS Studio',
    description:
      'Μια μικρή ομάδα από τη Σαμοθράκη και την Αλεξανδρούπολη. Μιλάτε απευθείας με αυτούς που σχεδιάζουν και χτίζουν — και σας λένε όταν χρειάζεστε λιγότερα.',
    priority: '0.7',
    changefreq: 'monthly',
    breadcrumb: 'Η ιστορία μας',
  },
  {
    path: '/services',
    file: 'services/index.html',
    title: 'Υπηρεσίες: κατασκευή ιστοσελίδων & SEO — SAOS Studio',
    description:
      'Κατασκευή ιστοσελίδας με εφάπαξ κόστος, προαιρετική μηνιαία συνδρομή SEO, ή ο συνδυασμός που χρειάζεστε. Δείτε αναλυτικά τι περιλαμβάνει το καθένα.',
    priority: '0.9',
    changefreq: 'monthly',
    breadcrumb: 'Υπηρεσίες',
  },
  {
    path: '/how-it-works',
    file: 'how-it-works/index.html',
    title: 'Πώς λειτουργεί — Η διαδικασία μας — SAOS Studio',
    description:
      'Από την πρώτη κουβέντα μέχρι τη δημοσίευση: προσφορά, σχεδιασμός, κατασκευή, διορθώσεις και launch. Δείτε βήμα βήμα τι συμβαίνει και πότε.',
    priority: '0.8',
    changefreq: 'monthly',
    breadcrumb: 'Πώς λειτουργεί',
  },
  {
    path: '/examples',
    file: 'examples/index.html',
    title: 'Δείγματα σχεδιασμού ιστοσελίδων — SAOS Studio',
    description:
      'Δείγματα σχεδιασμού από εστίαση, φιλοξενία, υγεία και βραχυχρόνια μίσθωση — σχεδιασμένα για να δείξουν εύρος, όχι έργα πελατών.',
    priority: '0.8',
    changefreq: 'monthly',
    breadcrumb: 'Έργα',
  },
  ...(REVIEWS_PUBLISHED ? [reviewsRoute] : []),
  {
    path: '/faq',
    file: 'faq/index.html',
    title: 'Συχνές ερωτήσεις για ιστοσελίδες — SAOS Studio',
    description:
      'Κόστος, χρόνος κατασκευής, hosting και domain, αλλαγές μετά την παράδοση, SEO και υποστήριξη. Δώδεκα ερωτήσεις που μας κάνουν πριν ξεκινήσουμε.',
    priority: '0.7',
    changefreq: 'monthly',
    breadcrumb: 'Συχνές ερωτήσεις',
  },
  {
    path: '/free-website',
    file: 'free-website/index.html',
    title: 'Δωρεάν website για μικρές επιχειρήσεις — SAOS Studio',
    description:
      'Κάθε μήνα κατασκευάζουμε μια ιστοσελίδα χωρίς χρέωση. Ποιοι μπορούν να κάνουν αίτηση, τι περιλαμβάνει και τι δεν περιλαμβάνει.',
    priority: '0.8',
    changefreq: 'monthly',
    breadcrumb: 'Δωρεάν website',
  },
  {
    path: '/request-a-quote',
    file: 'request-a-quote/index.html',
    title: 'Ζητήστε προσφορά για ιστοσελίδα — SAOS Studio',
    description:
      'Επτά σύντομες ερωτήσεις για την επιχείρησή σας. Λαμβάνετε γραπτή πρόταση με συγκεκριμένο κόστος και χρονοδιάγραμμα, χωρίς δέσμευση.',
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
      'Οι όροι που διέπουν τη χρήση της ιστοσελίδας και τη συνεργασία με τη SAOS Studio: αντικείμενο υπηρεσιών, τιμολόγηση, πνευματικά δικαιώματα και ευθύνη.',
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
