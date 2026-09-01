/**
 * The end-to-end process, from first contact to launch.
 *
 * Three descriptions of the same process previously coexisted at different
 * granularities: the three broad phases in `story.ts` (Ανακάλυψη / Σχεδιασμός /
 * Κατασκευή & Παράδοση), the four application steps hardcoded in
 * `FreeWebsite.tsx`, and prose scattered through the FAQ. `/how-it-works` needs
 * the full eight, so this file is the detailed source and `story.ts` keeps its
 * three as the summary view — they describe the same work, and the `phase` field
 * below records which detailed step belongs to which summary phase.
 *
 * Also feeds the `HowTo` JSON-LD in `schema.ts`, so `label` and `desc` must stay
 * readable on their own — a step whose description only makes sense next to the
 * one above it reads badly as structured data.
 */

export type ProcessPhase = 'discovery' | 'design' | 'build' | 'after'

export interface ProcessStage {
  num: string
  /** Anchor id, so a single step can be linked directly. */
  slug: string
  label: string
  desc: string
  /** What we need from you at this step, if anything. */
  youProvide?: string
  phase: ProcessPhase
  /** Not part of the fixed scope — flagged as optional in the UI. */
  optional?: boolean
}

export const processStages: ProcessStage[] = [
  {
    num: '01',
    slug: 'peite-mas',
    label: 'Μας λέτε για την επιχείρησή σας',
    desc: 'Συμπληρώνετε τη φόρμα προσφοράς — χρειάζεται περίπου δύο λεπτά. Μας λέτε τι κάνετε, τι χρειάζεστε και αν έχετε ήδη ιστοσελίδα. Αν προτιμάτε να μιλήσουμε, κλείνουμε μια σύντομη κλήση αντί για τη φόρμα.',
    youProvide: 'Λίγα λόγια για την επιχείρηση και το τι θέλετε να πετύχετε.',
    phase: 'discovery',
  },
  {
    num: '02',
    slug: 'protasi',
    label: 'Λαμβάνετε πρόταση',
    desc: 'Εξετάζουμε το αίτημά σας και επιστρέφουμε με συγκεκριμένη πρόταση: τι προτείνουμε να φτιαχτεί, τι περιλαμβάνει, πόσο θα κοστίσει και σε πόσο χρόνο. Χωρίς αοριστίες και χωρίς κρυφές χρεώσεις.',
    phase: 'discovery',
  },
  {
    num: '03',
    slug: 'egkrisi',
    label: 'Εγκρίνετε το έργο',
    desc: 'Διαβάζετε την πρόταση με την ησυχία σας και ρωτάτε ό,τι δεν είναι ξεκάθαρο. Αν κάτι δεν σας ταιριάζει, το προσαρμόζουμε. Ξεκινάμε μόνο αφού συμφωνήσετε γραπτώς στο τι θα γίνει και τι θα κοστίσει.',
    phase: 'discovery',
  },
  {
    num: '04',
    slug: 'schediasmos',
    label: 'Σχεδιασμός',
    desc: 'Σχεδιάζουμε την ιστοσελίδα γύρω από τη δική σας δουλειά — δομή σελίδων, ιεραρχία περιεχομένου, τυπογραφία και χρώματα. Βλέπετε τον σχεδιασμό πριν γραφτεί κώδικας, ώστε οι μεγάλες αλλαγές να γίνουν όσο είναι ακόμα φθηνές.',
    youProvide: 'Λογότυπο αν υπάρχει, κείμενα και φωτογραφίες.',
    phase: 'design',
  },
  {
    num: '05',
    slug: 'anaptyxi',
    label: 'Κατασκευή',
    desc: 'Υλοποιούμε τον σχεδιασμό σε πραγματική ιστοσελίδα: mobile-first, γρήγορη, με σωστή δομή SEO από την αρχή. Δοκιμάζουμε σε κινητό, tablet και desktop καθώς χτίζουμε, όχι στο τέλος.',
    phase: 'build',
  },
  {
    num: '06',
    slug: 'diorthoseis',
    label: 'Σχόλια και διορθώσεις',
    desc: 'Βλέπετε τη σελίδα σε πραγματική διεύθυνση και μας στέλνετε τα σχόλιά σας. Κάνουμε τις διορθώσεις και την ξαναδείχνουμε. Επαναλαμβάνουμε μέχρι να είστε ικανοποιημένοι — αυτό είναι μέρος του έργου, όχι έξτρα χρέωση.',
    youProvide: 'Τα σχόλιά σας, μαζεμένα σε έναν γύρο κάθε φορά.',
    phase: 'build',
  },
  {
    num: '07',
    slug: 'dimosiefsi',
    label: 'Δημοσίευση',
    desc: 'Συνδέουμε domain, ρυθμίζουμε DNS και SSL, δημοσιεύουμε και ελέγχουμε ότι όλα δουλεύουν στη ζωντανή διεύθυνση. Υποβάλλουμε τη σελίδα στη Google και σας παραδίδουμε τους κωδικούς — η ιστοσελίδα είναι δική σας.',
    phase: 'build',
  },
  {
    num: '08',
    slug: 'miniaio-seo',
    label: 'Προαιρετικό μηνιαίο SEO',
    desc: 'Αν θέλετε η σελίδα να ανεβαίνει στις αναζητήσεις με τον χρόνο, συνεχίζουμε με μηνιαία συνδρομή προώθησης. Είναι εντελώς προαιρετικό: η ιστοσελίδα λειτουργεί κανονικά χωρίς αυτό και μπορείτε να ξεκινήσετε ή να σταματήσετε όποτε θέλετε.',
    phase: 'after',
    optional: true,
  },
]

export const phaseLabels: Record<ProcessPhase, string> = {
  discovery: 'Πριν ξεκινήσουμε',
  design: 'Σχεδιασμός',
  build: 'Κατασκευή και παράδοση',
  after: 'Προώθηση',
}
