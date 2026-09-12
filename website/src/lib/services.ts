/**
 * The three services offered, shared between `Services.tsx` and the
 * `hasOfferCatalog` node in `schema.ts`.
 *
 * Deliberately **unpriced**. The previous €46/€52/€83 subscription tiers were
 * withdrawn in August 2026 while the packages are repriced, and the
 * `Offer`/`AggregateOffer` JSON-LD generated from them went with them —
 * publishing price markup for prices no longer honoured is a structured-data
 * violation, not merely stale copy. Restore both together, or neither.
 *
 * TODO(owner): supply the new package pricing.
 */

/** Keys map to lucide-react icons in `Services.tsx`. */
export type ServiceIcon = 'build' | 'grow' | 'custom'

/**
 * How the service is charged. Describing the *model* is what lets the pages read
 * as a real commercial offer while the figures are withdrawn — "εφάπαξ" versus
 * "μηνιαία συνδρομή" is the distinction customers actually need to understand
 * before they ask for a number.
 */
export type PricingModel = 'one-time' | 'subscription' | 'custom'

export interface ServiceDetailGroup {
  title: string
  items: string[]
}

export interface Service {
  num: string
  /** Anchor-safe id, also used as the React key. */
  id: string
  name: string
  /** One-line summary shown under the title. */
  summary: string
  benefits: string[]
  icon: ServiceIcon
  ctaLabel: string
  /** Visually promoted card. Exactly one should carry this. */
  featured: boolean
  pricingModel: PricingModel
  /** Short Greek label for the model, e.g. «Εφάπαξ κόστος». Never a figure. */
  pricingLabel: string
  /** Opening paragraph of this service's section on `/services`. */
  detailLead: string
  /** The deep breakdown rendered on `/services`. */
  detailGroups: ServiceDetailGroup[]
  /**
   * Honest caveat printed under the breakdown. Used where a group could
   * otherwise read as a promise — SEO goals are targets we work toward, and no
   * agency can guarantee a ranking.
   */
  detailCaveat?: string
}

/** Greek labels for the pricing models, for use outside the service cards. */
export const pricingModelLabels: Record<PricingModel, string> = {
  'one-time': 'Εφάπαξ κόστος',
  subscription: 'Μηνιαία συνδρομή',
  custom: 'Κόστος κατόπιν προσφοράς',
}

export const services: Service[] = [
  {
    num: '01',
    id: 'anaptyxi',
    name: 'Ανάπτυξη ιστοσελίδων',
    summary:
      'Σύγχρονες, γρήγορες ιστοσελίδες που δείχνουν σωστά σε κάθε οθόνη και είναι εύκολες στη χρήση.',
    benefits: [
      'Σχεδιασμός από το μηδέν, χωρίς έτοιμα templates',
      'Σχεδιασμός πρώτα για το κινητό — σωστή εμφάνιση σε κινητό, tablet και desktop',
      'Ταχύτητα φόρτωσης ως προτεραιότητα, όχι ως extra',
      'Φόρμα επικοινωνίας και σύνδεση με τα κανάλια σας',
      'Σύνδεση domain, hosting στη Hostinger και δημοσίευση',
    ],
    icon: 'build',
    ctaLabel: 'Ζητήστε προσφορά',
    featured: false,
    pricingModel: 'one-time',
    pricingLabel: 'Εφάπαξ κόστος',
    detailLead:
      'Πληρώνετε μία φορά για την κατασκευή και η ιστοσελίδα είναι δική σας. Δεν υπάρχει υποχρεωτική μηνιαία συνδρομή για να παραμείνει online — μόνο το κόστος domain και hosting, που το πληρώνετε απευθείας στη Hostinger, τον μοναδικό πάροχο με τον οποίο συνεργαζόμαστε.',
    detailGroups: [
      {
        title: 'Σχεδιασμός και κατασκευή',
        items: [
          'Σχεδιασμός από το μηδέν με βάση τη δική σας επιχείρηση, όχι έτοιμο template',
          'Δομή σελίδων που ακολουθεί τον τρόπο που αποφασίζουν οι πελάτες σας',
          'Κείμενα και εικόνες τοποθετημένα ώστε να διαβάζονται, όχι απλώς να χωράνε',
          'Γύροι διορθώσεων πριν τη δημοσίευση μέχρι να είστε ικανοποιημένοι',
        ],
      },
      {
        title: 'Βελτιστοποίηση για κινητό',
        items: [
          'Σχεδιάζουμε πρώτα για το κινητό και μετά για τη μεγάλη οθόνη',
          'Σωστή εμφάνιση σε κινητό, tablet και desktop χωρίς οριζόντιο scroll',
          'Κουμπιά και φόρμες σε μέγεθος που πατιέται με το δάχτυλο',
          'Άμεση κλήση, οδηγίες χάρτη και μηνύματα με ένα πάτημα',
        ],
      },
      {
        title: 'Ταχύτητα',
        items: [
          'Συμπιεσμένες εικόνες σε σύγχρονα formats',
          'Ελαφρύς κώδικας χωρίς περιττές βιβλιοθήκες',
          'Μετρήσεις Core Web Vitals πριν την παράδοση',
          'Η ταχύτητα είναι προτεραιότητα από την αρχή, όχι διόρθωση στο τέλος',
        ],
      },
      {
        title: 'Βασική δομή SEO',
        items: [
          'Τίτλοι και περιγραφές ανά σελίδα, γραμμένοι για αναζήτηση και για ανθρώπους',
          'Καθαρή ιεραρχία επικεφαλίδων και σημασιολογικό HTML',
          'Structured data ώστε η Google να καταλαβαίνει τι κάνετε',
          'Sitemap, robots.txt και σύνδεση με Google Search Console',
        ],
      },
      {
        title: 'Τεχνική εγκατάσταση',
        items: [
          'Σύνδεση domain, ρύθμιση DNS και πιστοποιητικό SSL — στο hosting σας στη Hostinger',
          'Δημοσίευση σε αξιόπιστη υποδομή',
          'Φόρμα επικοινωνίας συνδεδεμένη με το email σας',
          'Σύνδεση με τα κανάλια που ήδη χρησιμοποιείτε',
        ],
      },
    ],
  },
  {
    num: '02',
    id: 'proothisi',
    name: 'Προώθηση ιστοσελίδων',
    summary:
      'Βοηθάμε την επιχείρησή σας να γίνει ορατή και να φέρει περισσότερους επισκέπτες που μετατρέπονται σε πελάτες.',
    benefits: [
      'Τεχνικό SEO — δομή, ταχύτητα, ευρετηρίαση',
      'Βελτιστοποίηση περιεχομένου για τις αναζητήσεις του κλάδου σας',
      'Τοπική προβολή και Google Business Profile',
      'Μετρήσεις και αναφορές με πραγματικά νούμερα',
      'Προτάσεις βελτίωσης με βάση τη συμπεριφορά των επισκεπτών',
    ],
    icon: 'grow',
    ctaLabel: 'Ζητήστε προσφορά',
    featured: false,
    pricingModel: 'subscription',
    pricingLabel: 'Μηνιαία συνδρομή',
    detailLead:
      'Το SEO δεν είναι εφάπαξ εργασία. Οι ανταγωνιστές σας ενημερώνουν τις σελίδες τους, η Google αλλάζει τον τρόπο που κατατάσσει και οι αναζητήσεις των πελατών σας μετακινούνται. Γι’ αυτό η προώθηση δουλεύει ως μηνιαία συνδρομή που μπορείτε να σταματήσετε όποτε θέλετε — όχι ως δέσμευση ετών.',
    detailGroups: [
      {
        title: 'Τι περιλαμβάνει',
        items: [
          'Τεχνικό SEO: δομή, ταχύτητα, ευρετηρίαση, διόρθωση σφαλμάτων crawl',
          'Βελτιστοποίηση περιεχομένου για τις αναζητήσεις του κλάδου σας',
          'Τοπική προβολή και διαχείριση του Google Business Profile',
          'Παρακολούθηση θέσεων για τις λέξεις-κλειδιά που σας ενδιαφέρουν',
          'Structured data και τεχνική υποστήριξη της σελίδας',
        ],
      },
      {
        title: 'Η μηνιαία διαδικασία',
        items: [
          'Έλεγχος απόδοσης του προηγούμενου μήνα και εντοπισμός τι κινήθηκε',
          'Τεχνικός έλεγχος για νέα σφάλματα, νεκρούς συνδέσμους ή πτώση ταχύτητας',
          'Εργασίες περιεχομένου: βελτίωση υπαρχουσών σελίδων ή προσθήκη νέων',
          'Ενημέρωση τοπικών καταχωρήσεων και απαντήσεις σε κριτικές',
          'Αναφορά με πραγματικά νούμερα και τι προτείνουμε για τον επόμενο μήνα',
        ],
      },
      {
        title: 'Τι στόχους θέτουμε',
        items: [
          'Περισσότερες εμφανίσεις στις αναζητήσεις που αφορούν την περιοχή σας',
          'Υψηλότερες θέσεις στους όρους που φέρνουν πραγματικούς πελάτες',
          'Περισσότερες κλήσεις, μηνύματα και οδηγίες χάρτη από το προφίλ σας',
          'Σταθερή τεχνική υγεία της σελίδας καθώς προσθέτετε περιεχόμενο',
        ],
      },
    ],
    detailCaveat:
      'Αυτοί είναι στόχοι που δουλεύουμε για να πετύχουμε, όχι εγγυήσεις. Καμία εταιρεία δεν μπορεί να εγγυηθεί συγκεκριμένη θέση στη Google — όποιος το υπόσχεται, δεν λέει την αλήθεια. Αυτό που εγγυόμαστε είναι η δουλειά και οι μετρήσεις που τη δείχνουν.',
  },
  {
    num: '03',
    id: 'custom',
    name: 'Custom-made πακέτο',
    summary:
      'Δεν ταιριάζουν όλες οι επιχειρήσεις σε ένα έτοιμο πακέτο. Συζητάμε τι χρειάζεστε και φτιάχνουμε τον συνδυασμό που σας ταιριάζει.',
    benefits: [
      'Ξεκινάμε από τους στόχους και τον προϋπολογισμό σας',
      'Συνδυασμός κατασκευής, προώθησης και υποστήριξης',
      'E-shop, CMS, πολυγλωσσικό ή ό,τι άλλο απαιτεί η δουλειά σας',
      'Ενσωμάτωση με τα εργαλεία που ήδη χρησιμοποιείτε',
      'Το τελικό πακέτο διαμορφώνεται μαζί σας, όχι από λίστα',
    ],
    icon: 'custom',
    ctaLabel: 'Ας το συζητήσουμε',
    featured: true,
    pricingModel: 'custom',
    pricingLabel: 'Κόστος κατόπιν προσφοράς',
    detailLead:
      'Οι περισσότερες επιχειρήσεις χρειάζονται κάτι ανάμεσα στα δύο προηγούμενα: μια ιστοσελίδα τώρα και προώθηση από τον τρίτο μήνα, ή ένα e-shop με λίγα προϊόντα, ή μια σελίδα σε δύο γλώσσες. Το custom πακέτο δεν είναι τρίτο επίπεδο — είναι ο συνδυασμός που χρειάζεστε.',
    detailGroups: [
      {
        title: 'Η ιστοσελίδα',
        items: [
          'Ό,τι περιλαμβάνει η ανάπτυξη ιστοσελίδων, στην έκταση που χρειάζεστε',
          'Περισσότερες σελίδες, ειδικές ενότητες ή πιο σύνθετη δομή',
          'Χρονοδιάγραμμα προσαρμοσμένο στο δικό σας πρόγραμμα',
        ],
      },
      {
        title: 'Το SEO',
        items: [
          'Μπορεί να ξεκινήσει μαζί με την κατασκευή ή αργότερα',
          'Ένταση ανάλογη με τον ανταγωνισμό στον κλάδο και την περιοχή σας',
          'Ενσωματωμένο στην ίδια συνεργασία, χωρίς δεύτερο συμβόλαιο',
        ],
      },
      {
        title: 'Επιπλέον δυνατότητες',
        items: [
          'E-shop με πληρωμές και διαχείριση παραγγελιών',
          'CMS ώστε να ενημερώνετε μόνοι σας περιεχόμενο, μενού ή τιμές',
          'Πολυγλωσσική έκδοση για πελάτες από το εξωτερικό',
          'Σύστημα κρατήσεων ή ραντεβού',
          'Ενσωμάτωση με τα εργαλεία που ήδη χρησιμοποιείτε',
        ],
      },
      {
        title: 'Πώς προκύπτει το κόστος',
        items: [
          'Ξεκινάμε από τους στόχους και τον προϋπολογισμό σας',
          'Καταλήγουμε σε συγκεκριμένο πακέτο με ανάλυση τι περιλαμβάνει',
          'Χωρίζουμε καθαρά το εφάπαξ κόστος από τυχόν μηνιαία',
          'Λαμβάνετε γραπτή προσφορά πριν δεσμευτείτε σε οτιδήποτε',
        ],
      },
    ],
  },
]
