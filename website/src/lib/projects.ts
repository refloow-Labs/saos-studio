/**
 * The example sites shown in the "Έργα" carousel.
 *
 * IMPORTANT — these are **demonstration sites, not client work.** Every business
 * in `public/work/` is invented: the names, addresses, staff, opening hours,
 * review counts and testimonials were all fabricated to show design range, and
 * `public/llms.txt` says so explicitly. The section must present them as design
 * samples, and nothing here may be phrased as "our clients" or "real projects".
 *
 * Each demo also carries `<meta name="robots" content="noindex,follow">`.
 * `robots.txt` deliberately does *not* block `/work/*` — a crawler has to fetch
 * a page to see its noindex — so that meta tag is the only thing keeping these
 * out of the search index. Do not remove it.
 *
 * TODO(owner): replace with real delivered projects once there are some to show,
 * with the client's permission. At that point `isDemo` comes off and the section
 * heading changes.
 */

export interface Project {
  /** Directory under public/work/. */
  slug: string
  name: string
  /** One line on what the design had to do. */
  description: string
  /** Industry, shown as a small label. */
  category: string
  /** True where public/work/<slug>/full.{jpg,webp} exists. */
  hasFullCapture: boolean
  /**
   * Shown in the homepage carousel. The rest live in the «Παραδείγματα»
   * section below it, which is what the "δείτε τα υπόλοιπα" button reaches.
   */
  featured: boolean
  /**
   * The design breakdown shown on `/examples`.
   *
   * Deliberately **not** a case study in the usual sense: there is no client and
   * no campaign behind these, so there are no results to report. Anything
   * resembling traffic, conversion or revenue figures here would be fabricated.
   * `brief` states the design problem, `decisions` the choices made, and
   * `demonstrates` what the sample is meant to show.
   */
  caseStudy?: {
    brief: string
    decisions: string[]
    demonstrates: string
  }
}

export const projects: Project[] = [
  {
    slug: 'luxora-airbnb',
    featured: true,
    name: 'LUXORA',
    description:
      'Σελίδα κράτησης για πολυτελές κατάλυμα, με έμφαση στη φωτογραφία και σε ένα ξεκάθαρο κουμπί κράτησης.',
    category: 'Βραχυχρόνια μίσθωση',
    hasFullCapture: true,
  },
  {
    slug: 'salento',
    featured: true,
    name: 'Salento',
    description:
      'Έντονη, ζεστή παρουσίαση για street food, με μενού που διαβάζεται εύκολα από κινητό μέσα στο μαγαζί.',
    category: 'Εστίαση',
    hasFullCapture: true,
  },
  {
    slug: 'dental-home',
    featured: true,
    name: 'Dental Home',
    description:
      'Καθαρός, ήρεμος σχεδιασμός για οδοντιατρείο, με τις υπηρεσίες και το ραντεβού σε πρώτο πλάνο.',
    category: 'Υγεία',
    hasFullCapture: true,
  },
  {
    slug: 'almasi',
    featured: false,
    name: 'Almasi Luxury Suites',
    description:
      'Παρουσίαση καταλυμάτων με γκαλερί δωματίων και άμεση διαθεσιμότητα.',
    category: 'Φιλοξενία',
    hasFullCapture: true,
  },
  {
    slug: 'avenue',
    featured: false,
    name: 'Avenue Luxury Apartments',
    description:
      'Διαμερίσματα πολυτελείας με έμφαση στην τοποθεσία και στις παροχές.',
    category: 'Φιλοξενία',
    hasFullCapture: true,
  },
  {
    slug: 'ammos',
    featured: true,
    name: 'AMMOS Beach Bar',
    description:
      'Καλοκαιρινή ταυτότητα για beach bar, με πρόγραμμα και κρατήσεις ξαπλώστρας.',
    category: 'Εστίαση',
    hasFullCapture: true,
  },
  {
    slug: 'gi-kai-ydor',
    featured: true,
    name: 'Γη & Ύδωρ',
    description:
      'Εστιατόριο με παραδοσιακό χαρακτήρα: μενού, ιστορία και κρατήσεις σε μία σελίδα.',
    category: 'Εστίαση',
    hasFullCapture: true,
  },
  {
    slug: 'desire-patisserie',
    featured: false,
    name: 'Desire Patisserie',
    description:
      'Ζαχαροπλαστείο με έμφαση στο προϊόν και σε παραγγελίες κατόπιν επικοινωνίας.',
    category: 'Εστίαση',
    // No full.{jpg,webp} was captured for this one — the card falls back to thumb.
    hasFullCapture: false,
  },
]

/**
 * "Name — category" options for the application form's template-preference
 * field. Derived from `projects` rather than kept as a parallel list, so a demo
 * added or renamed here shows up there without a second edit.
 */
export const TEMPLATE_OPTIONS = projects.map((p) => `${p.name} — ${p.category}`)
