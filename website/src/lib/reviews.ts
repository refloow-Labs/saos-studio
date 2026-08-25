/**
 * Reviews shown in the «Τι λένε για εμάς» section.
 *
 * ⚠️ EVERY REVIEW IN THIS FILE IS INVENTED. There is no Google Business Profile
 * integration yet, and these exist purely so the section has something to lay
 * out. They are labelled as samples in the UI, and `schema.ts` deliberately
 * emits **no** `Review` or `AggregateRating` JSON-LD for them — publishing
 * structured data for fabricated reviews is a Google policy violation that can
 * earn a manual action against the whole domain.
 *
 * The shape mirrors the Google Business Profile API's `reviews` resource
 * (reviewer.displayName / starRating / comment / createTime) so a real feed can
 * replace this array with minimal mapping.
 *
 * TODO(owner): connect the real Google Business Profile (or another provider),
 * then delete every entry below and set `REVIEWS_ARE_SAMPLES = false`.
 */

export type StarRating = 1 | 2 | 3 | 4 | 5

export interface Review {
  id: string
  /** Matches Google's `reviewer.displayName`. */
  author: string
  starRating: StarRating
  comment: string
  /** ISO date, matching Google's `createTime`. Rendered as month + year. */
  createTime: string
  /** Where the review was left. Shown as a small label. */
  source: 'Google'
}

/**
 * Gates every "sample" label in the UI. Flip to false only when the reviews
 * above are real, at which point the JSON-LD in `schema.ts` may also be
 * reinstated.
 */
export const REVIEWS_ARE_SAMPLES = true

/**
 * Whether reviews are shown to the public at all.
 *
 * Currently **false**: the studio is pre-first-client, every review below is
 * invented, and a page of fabricated testimonials at a guessable URL is not
 * something `noindex` makes acceptable. While this is false the homepage
 * section is not rendered and `/reviews` is dropped from `seo.ts`, which takes
 * it out of the prerender, the sitemap and IndexNow in one move. The route
 * stays in App's `pages` map so the page still renders on the dev server —
 * `scripts/prerender.mjs` only throws the other way round (a route in `seo.ts`
 * with no page), so an unreferenced page entry is free.
 *
 * The explicit `: boolean` matters. Without it TypeScript narrows to the
 * literal `false` and reports the `true` branches as unreachable.
 *
 * TODO(owner): to publish reviews, all three must land in the same commit —
 * a real Google Business Profile feed replacing the array below,
 * `REVIEWS_ARE_SAMPLES = false`, and the `Review`/`AggregateRating` nodes in
 * `schema.ts`. Never this flag alone.
 */
export const REVIEWS_PUBLISHED: boolean = false

export const reviews: Review[] = [
  {
    id: 'r1',
    author: 'Μαρία Κ.',
    starRating: 5,
    comment:
      'Είχα μια παλιά σελίδα που δεν άνοιγε καν σωστά στο κινητό. Μου εξήγησαν τι έφταιγε με απλά λόγια και σε λίγες μέρες είχα κάτι που πραγματικά με αντιπροσωπεύει.',
    createTime: '2026-06-14',
    source: 'Google',
  },
  {
    id: 'r2',
    author: 'Γιώργος Π.',
    starRating: 5,
    comment:
      'Το καλύτερο; Δεν χρειάστηκε να καταλάβω τίποτα τεχνικό. Ανέλαβαν domain, hosting, τα πάντα. Εγώ έστειλα φωτογραφίες και κείμενα και τελείωσε.',
    createTime: '2026-05-28',
    source: 'Google',
  },
  {
    id: 'r3',
    author: 'Ελένη Δ.',
    starRating: 5,
    comment:
      'Ζήτησα τη δωρεάν αξιολόγηση χωρίς μεγάλες προσδοκίες. Μου έστειλαν αναλυτικά τι φταίει στην ταχύτητα και τι να διορθώσω, χωρίς να μου πουλήσουν τίποτα.',
    createTime: '2026-06-02',
    source: 'Google',
  },
  {
    id: 'r4',
    author: 'Νίκος Α.',
    starRating: 5,
    comment:
      'Γρήγοροι και ευθείς. Μου είπαν από την αρχή τι μπορούν και τι δεν μπορούν να κάνουν στον προϋπολογισμό μου. Το εκτίμησα πολύ.',
    createTime: '2026-04-19',
    source: 'Google',
  },
  {
    id: 'r5',
    author: 'Σοφία Μ.',
    starRating: 5,
    comment:
      'Έχουμε ταβέρνα και το μενού μας ήταν μόνο σε PDF. Τώρα οι πελάτες το ανοίγουν από το κινητό σε δευτερόλεπτα. Οι κρατήσεις ανέβηκαν αισθητά.',
    createTime: '2026-07-08',
    source: 'Google',
  },
  {
    id: 'r6',
    author: 'Δημήτρης Β.',
    starRating: 4,
    comment:
      'Πολύ καλή δουλειά και άψογη επικοινωνία. Θα ήθελα λίγο περισσότερες επιλογές στο αρχικό σχέδιο, αλλά το τελικό αποτέλεσμα ήταν ακριβώς αυτό που ήθελα.',
    createTime: '2026-03-30',
    source: 'Google',
  },
  {
    id: 'r7',
    author: 'Κατερίνα Ρ.',
    starRating: 5,
    comment:
      'Με βοήθησαν να φανώ επιτέλους στο Google. Πριν, ο κόσμος με έβρισκε μόνο από στόμα σε στόμα.',
    createTime: '2026-05-11',
    source: 'Google',
  },
  {
    id: 'r8',
    author: 'Θανάσης Λ.',
    starRating: 5,
    comment:
      'Σοβαροί επαγγελματίες. Απαντούσαν σε κάθε μήνυμα την ίδια μέρα, ακόμη και μετά την παράδοση.',
    createTime: '2026-06-25',
    source: 'Google',
  },
  {
    id: 'r9',
    author: 'Αναστασία Χ.',
    starRating: 5,
    comment:
      'Είχα κουραστεί με προσφορές που μιλούσαν για «πακέτα» χωρίς να καταλαβαίνω τι πληρώνω. Εδώ ήξερα ακριβώς τι θα πάρω πριν ξεκινήσουμε.',
    createTime: '2026-07-21',
    source: 'Google',
  },
]

const MONTHS = [
  'Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου',
  'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου',
]

/**
 * "Ιουνίου 2026". Formatted here rather than with `toLocaleDateString` so the
 * prerendered HTML and the hydrated client agree — Node's ICU build and the
 * browser's do not always produce the same Greek month name, and a mismatch
 * shows up as a hydration error.
 */
export function formatReviewDate(iso: string): string {
  const d = new Date(iso)
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

/** Initials for the avatar circle, e.g. "Μαρία Κ." → "ΜΚ". */
export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .replace(/\./g, '')
    .slice(0, 2)
    .toUpperCase()
}
