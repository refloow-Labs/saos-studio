/**
 * FAQ content, shared between the visible accordion in `Faq.tsx` and the
 * FAQPage JSON-LD built in `schema.ts`. Google requires the marked-up answers to
 * match what the user actually sees, so both read this one source.
 *
 * Each entry carries a `slug`, used as the accordion item's anchor id so a
 * single question can be linked directly (`/#faq-hosting-domain`). The same
 * slugs are the intended URLs if these later become individual articles.
 *
 * `needsReview` marks answers containing a claim only the owner can confirm —
 * delivery times, acceptance criteria, support terms. They render with a small
 * badge so nothing unverified ships silently.
 */

/**
 * Groups on `/faq`. Declared in display order.
 *
 * `support` currently has no questions. It stays declared rather than deleted
 * because the FAQ page renders only non-empty groups — so the category appears
 * the moment the owner supplies a support question, without a code change.
 */
export type FaqCategory =
  | 'website'
  | 'pricing'
  | 'seo'
  | 'hosting'
  | 'revisions'
  | 'timelines'
  | 'support'

export const faqCategories: { id: FaqCategory; label: string }[] = [
  { id: 'website', label: 'Κατασκευή ιστοσελίδας' },
  { id: 'pricing', label: 'Κόστος και προσφορά' },
  { id: 'seo', label: 'SEO και προώθηση' },
  { id: 'hosting', label: 'Hosting και domain' },
  { id: 'revisions', label: 'Αλλαγές και αναθεωρήσεις' },
  { id: 'timelines', label: 'Χρονοδιαγράμματα' },
  { id: 'support', label: 'Υποστήριξη' },
]

export interface Faq {
  /** Anchor id and future article slug. */
  slug: string
  q: string
  a: string
  /** Group this question appears under on `/faq`. */
  category: FaqCategory
  /** Contains a business claim the owner still has to confirm. */
  needsReview?: boolean
  /** Optional in-page link rendered after the answer. */
  link?: { href: string; label: string }
  /**
   * Shown in the shortened FAQ block on the homepage. The homepage FAQPage
   * JSON-LD is built from exactly this subset — marking up twelve answers where
   * six are rendered is the markup/content mismatch this file exists to avoid.
   */
  onHome?: boolean
}

/** The questions rendered — and marked up — on the homepage. */
export function homeFaqs(): Faq[] {
  return faqs.filter((f) => f.onHome)
}

/** Questions grouped for `/faq`, empty groups dropped. */
export function faqsByCategory(): { id: FaqCategory; label: string; items: Faq[] }[] {
  return faqCategories
    .map((c) => ({ ...c, items: faqs.filter((f) => f.category === c.id) }))
    .filter((g) => g.items.length > 0)
}

export const faqs: Faq[] = [
  {
    slug: 'giati-oikonomikoi',
    q: 'Γιατί είστε τόσο οικονομικοί σε σχέση με την υπόλοιπη αγορά;',
    a: 'Επειδή είμαστε μικροί και δεν έχουμε τα έξοδα ενός γραφείου. Δεν πληρώνετε account manager, δεν πληρώνετε meetings που δεν χρειάζονταν, δεν πληρώνετε ώρες που δεν παρήγαγαν τίποτα. Μιλάτε απευθείας με τους ανθρώπους που κάνουν τη δουλειά. Χρησιμοποιούμε και σύγχρονα εργαλεία εκεί που γλιτώνουν χρόνο, αλλά την κάθε παράδοση την ελέγχει άνθρωπος πριν φύγει.',
    category: 'pricing',
    onHome: true,
  },
  {
    slug: 'pleonektima',
    q: 'Ποιο είναι το μοναδικό σας πλεονέκτημα;',
    a: 'Ξεκινάμε από την επιχείρησή σας και όχι από ένα template. Πριν γράψουμε κώδικα, καταλαβαίνουμε τι κάνετε, ποιους θέλετε να φτάσετε και τι σας εμποδίζει σήμερα. Είμαστε μικρή ομάδα και συμμετέχουμε προσωπικά σε κάθε στάδιο. Δεν θα σας περάσουν από τρία διαφορετικά τμήματα.',
    category: 'website',
  },
  {
    slug: 'google-maps-vs-website',
    q: 'Η επιχείρησή μου εμφανίζεται ήδη στο Google Maps. Γιατί χρειάζομαι website;',
    a: 'Το Google Maps δείχνει πού είστε· η ιστοσελίδα δείχνει γιατί να σας επιλέξουν. Στο προφίλ σας δεν ελέγχετε τι βλέπει ο πελάτης, δεν μπορείτε να παρουσιάσετε αναλυτικά τις υπηρεσίες ή το μενού σας και δεν έχετε δικό σας κανάλι επικοινωνίας. Τα δύο δουλεύουν καλύτερα μαζί: το website ενισχύει και την εμφάνισή σας στις τοπικές αναζητήσεις.',
    category: 'website',
    onHome: true,
  },
  {
    slug: 'xronos-kataskevis',
    q: 'Πόσο χρόνο χρειάζεται η κατασκευή μιας ιστοσελίδας;',
    a: 'Μια απλή, μονοσέλιδη παρουσίαση ολοκληρώνεται συνήθως σε μέρες και όχι σε μήνες, εφόσον έχουμε έγκαιρα το υλικό σας. Μεγαλύτερα έργα με πολλές σελίδες, e-shop ή ειδικές λειτουργίες χρειάζονται περισσότερο. Θα σας δώσουμε συγκεκριμένο χρονοδιάγραμμα πριν ξεκινήσουμε.',
    category: 'timelines',
    needsReview: true,
    onHome: true,
  },
  {
    slug: 'ti-perilamvanei-website',
    q: 'Τι περιλαμβάνει ένα website;',
    a: 'Σχεδιασμό προσαρμοσμένο στην επιχείρησή σας, mobile-first υλοποίηση ώστε να δείχνει σωστά σε κάθε οθόνη, φόρμα επικοινωνίας, βασική ρύθμιση SEO για να σας βρίσκουν, και την πλήρη τεχνική εγκατάσταση: σύνδεση domain, DNS, SSL και δημοσίευση.',
    category: 'website',
    onHome: true,
  },
  {
    slug: 'allages-meta-tin-paradosi',
    q: 'Μπορώ να ζητήσω αλλαγές μετά την παράδοση;',
    a: 'Ναι. Κάθε έργο περιλαμβάνει γύρους αναθεώρησης πριν τη δημοσίευση, ώστε να φτάσουμε στο αποτέλεσμα που θέλετε. Μετά την παράδοση, μικρότερες ενημερώσεις γίνονται κατόπιν συνεννόησης.',
    category: 'revisions',
    needsReview: true,
  },
  {
    slug: 'hosting-kai-domain',
    q: 'Χρειάζομαι hosting και domain;',
    a: 'Ναι, και τα δύο είναι απαραίτητα για να είναι η σελίδα σας online. Δεν μεταπωλούμε hosting: σας προτείνουμε τους κατάλληλους παρόχους για τις ανάγκες και τον προϋπολογισμό σας και αναλαμβάνουμε όλη την τεχνική ρύθμιση. Το κόστος τους το πληρώνετε απευθείας στον πάροχο και παραμένουν δικά σας.',
    category: 'hosting',
    onHome: true,
  },
  {
    slug: 'proothisi-istoselidas',
    q: 'Τι περιλαμβάνει η προώθηση ιστοσελίδας;',
    a: 'Τεχνικό SEO για τη δομή και την ταχύτητα της σελίδας, βελτιστοποίηση του περιεχομένου για τις αναζητήσεις του κλάδου σας, φροντίδα της τοπικής σας προβολής και του Google Business Profile, και τακτικές μετρήσεις ώστε να βλέπετε τι αποδίδει. Η προώθηση είναι συνεχής διαδικασία, όχι εφάπαξ ενέργεια.',
    category: 'seo',
    onHome: true,
  },
  {
    slug: 'pos-kano-aitisi',
    q: 'Πώς μπορώ να κάνω αίτηση για το δωρεάν website;',
    a: 'Συμπληρώνετε μια σύντομη φόρμα με έξι ερωτήσεις: πώς λέγεται η επιχείρηση, ποιος είστε, σε ποιον κλάδο δραστηριοποιείστε, αν έχετε ήδη ιστοσελίδα και πώς μπορούμε να επικοινωνήσουμε μαζί σας. Χρειάζεται περίπου δύο λεπτά και θα λάβετε απάντηση με email είτε η αίτηση γίνει δεκτή είτε όχι.',
    category: 'pricing',
    // Absolute, not a bare hash: this answer is now rendered on /faq as well as
    // the homepage, where `#free-website` would jump to nothing.
    link: { href: '/#free-website', label: 'Δείτε το δωρεάν πακέτο' },
  },
  {
    slug: 'kritiria-apodoxis',
    q: 'Ποια είναι τα κριτήρια αποδοχής;',
    a: 'Κοιτάμε αν πρόκειται για μικρή επιχείρηση ή ελεύθερο επαγγελματία με πραγματική δραστηριότητα, πόσο θα άλλαζε μια σωστή ιστοσελίδα την καθημερινότητά σας, και πόσο ξεκάθαρο είναι τι χρειάζεστε. Δεν γίνονται όλες οι αιτήσεις δεκτές και δεν εγγυόμαστε αποδοχή.',
    category: 'pricing',
    needsReview: true,
  },
  {
    slug: 'ti-chreiazeste-apo-emena',
    q: 'Τι χρειάζεστε από εμένα για να ξεκινήσουμε;',
    a: 'Το λογότυπό σας αν υπάρχει, το περιεχόμενο που θέλετε να προβληθεί (κείμενα και φωτογραφίες) και μια σύντομη κουβέντα για να καταλάβουμε την επιχείρησή σας. Αν δεν έχετε έτοιμο υλικό, μπορούμε να σας καθοδηγήσουμε τι χρειάζεται.',
    category: 'website',
    link: { href: '/how-it-works', label: 'Δείτε πώς λειτουργεί' },
  },
  {
    slug: 'yparxousa-istoselida',
    q: 'Μπορείτε να αναλάβετε μια υπάρχουσα ιστοσελίδα;',
    a: 'Ναι. Πολλές φορές η υπάρχουσα σελίδα χρειάζεται βελτιώσεις σε ταχύτητα, εμφάνιση στο κινητό ή SEO και όχι πλήρη ανακατασκευή. Ξεκινήστε με τη δωρεάν αξιολόγηση: θα δείτε τι φταίει και θα σας πούμε ειλικρινά αν αξίζει διόρθωση ή νέα κατασκευή.',
    category: 'website',
    // Was `#main`, which pointed at the hero while the evaluation form lived
    // there. The form now has its own homepage section.
    link: { href: '/#evaluation', label: 'Ζητήστε δωρεάν αξιολόγηση' },
  },
]
