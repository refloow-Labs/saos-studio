/**
 * "Η ιστορία μας" content.
 *
 * Adapted from the parent company's own Our Story page (rhooalabs.com/our-story),
 * retargeted from AI automation to websites. The mission, vision, values, process
 * and founder details below are first-party copy — not invented scaffolding — so
 * they are deliberately *not* wrapped in `Placeholder`. Anything that could not be
 * sourced is listed in `storyPlaceholders` instead.
 *
 * Lives in lib/ rather than in the component because the homepage section and the
 * future /our-story page must not drift apart.
 */

export interface ProcessStep {
  num: string
  label: string
  desc: string
}

export interface Value {
  title: string
  desc: string
}

export interface TeamMember {
  slug: string
  name: string
  role: string
  bio: string
}

/** The bridge: why an AI studio runs a web arm. */
export const bridge = {
  lead: 'Η SAOS Studio είναι το web division της Rhooa Labs.',
  body: 'Στη Rhooa Labs χτίζουμε συστήματα τεχνητής νοημοσύνης για επιχειρήσεις. Δουλεύοντας με μικρές και μεσαίες επιχειρήσεις, συναντούσαμε ξανά και ξανά το ίδιο: επιχειρήσεις με πραγματικούς πελάτες και σοβαρή δουλειά, που όμως online δεν φαίνονταν πουθενά — ή φαίνονταν χειρότερα απ’ ό,τι είναι. Η SAOS Studio γεννήθηκε ακριβώς γι’ αυτό.',
}

/** Verbatim from Rhooa Labs, retargeted to websites. */
export const mission = {
  heading: 'Σχεδιαστική σκέψη + engineering.',
  desc: 'Πριν γράψουμε μια γραμμή κώδικα, καταλαβαίνουμε πρώτα την επιχείρησή σας. Αποτυπώνουμε τις πραγματικές σας ανάγκες και μετά σχεδιάζουμε ακριβώς αυτό που χρειάζεστε. Όχι γενικά templates — ιστοσελίδες φτιαγμένες για εσάς.',
}

export const processSteps: ProcessStep[] = [
  {
    num: '01',
    label: 'Ανακάλυψη',
    desc: 'Καταλαβαίνουμε τι κάνει η επιχείρησή σας, ποιους θέλει να φτάσει και τι εμποδίζει σήμερα τους επισκέπτες να γίνουν πελάτες.',
  },
  {
    num: '02',
    label: 'Σχεδιασμός',
    desc: 'Σχεδιάζουμε μια ιστοσελίδα χτισμένη γύρω από τη δική σας δουλειά και τον δικό σας κλάδο — όχι ένα έτοιμο layout με αλλαγμένα χρώματα.',
  },
  {
    num: '03',
    label: 'Κατασκευή & Παράδοση',
    desc: 'Υλοποιούμε, δοκιμάζουμε σε κινητό και desktop, συνδέουμε domain και hosting, και μένουμε δίπλα σας μετά την παράδοση.',
  },
]

export const values: Value[] = [
  {
    title: 'Ανάληψη ευθύνης',
    desc: 'Μετράει το έργο, όχι ο τίτλος. Αναγνωρίζουμε τη δουλειά που παραδίδεται, όχι την ιεραρχία.',
  },
  {
    title: 'Πρωτοβουλία',
    desc: 'Σεβόμαστε τους ανθρώπους που δεν φοβούνται να δοκιμάσουν και να αναγνωρίσουν τα λάθη τους. Για εμάς η επιχειρηματικότητα είναι ένα παιχνίδι που το ευχαριστιέσαι.',
  },
  {
    title: 'Ελευθερία απόψεων',
    desc: 'Μιλάμε όταν διαφωνούμε. Οι καλύτερες αποφάσεις προκύπτουν από ειλικρινή διάλογο, όχι από σιωπηλή συμμόρφωση.',
  },
]

/** «Less is More» — the parent company's stated vision. */
export const vision = {
  title: 'Το όραμα',
  desc: 'Αξιοποιούμε την τεχνολογία για να εξοικονομούμε χρόνο, τόσο για εμάς όσο και για εσάς. Πιστεύουμε στη φιλοσοφία «Less is More», όπου η απλότητα, η ουσία και η έξυπνη αυτοματοποίηση δημιουργούν περισσότερο χώρο για όσα έχουν πραγματική αξία.',
}

/**
 * Roles as published in Rhooa Labs' own Organization schema. Photos are the
 * company's own, copied into public/team/ rather than hotlinked.
 */
export const team: TeamMember[] = [
  {
    slug: 'giannis-tambakis',
    name: 'Γιάννης Ταμπάκης',
    role: 'Strategy',
    bio: 'Ειδικεύεται στη στρατηγική και στον εντοπισμό ευκαιριών που μετατρέπουν την τεχνολογία σε πραγματικό αποτέλεσμα.',
  },
  {
    slug: 'konstantinos-delivasis',
    name: 'Κωνσταντίνος Δεληβασίλης',
    role: 'Engineering',
    bio: 'Αρχιτέκτονας συστημάτων που μεταφράζει τη στρατηγική σε αξιόπιστα, κλιμακούμενα ψηφιακά προϊόντα.',
  },
  {
    slug: 'konstantinos-malakis',
    name: 'Κωνσταντίνος Μαλάκης',
    role: 'Operations',
    bio: 'Γεφυρώνει το engineering με τις operations, χτίζοντας τις διαδικασίες που κρατούν την υλοποίηση αξιόπιστη.',
  },
]

/**
 * Facts the owner has to supply. Rendered through `Placeholder` so they cannot
 * ship unnoticed, and listed here so the register stays in one place.
 */
export const storyPlaceholders = {
  founded: 'Έτος ίδρυσης',
  delivered: 'Αριθμός ιστοσελίδων που έχουμε παραδώσει',
  timeline:
    'Τυπικός χρόνος παράδοσης ιστοσελίδας — το «2–4 εβδομάδες + 30 μέρες υποστήριξη» της Rhooa Labs αφορά AI έργα και δεν έχει επιβεβαιωθεί για websites',
}
