import Layout from '../components/Layout'
import Chapter from '../components/Chapter'
import PageHeader from '../components/PageHeader'
import Placeholder from '../components/Placeholder'
import { CONTACT_EMAIL } from '../lib/seo'

/**
 * `/terms` — structure only.
 *
 * Terms and conditions are a legal instrument, not copy. Writing plausible-
 * sounding Greek commercial terms here would produce a document that reads as
 * binding while never having been reviewed by anyone qualified — worse than an
 * obviously unfinished page, because nobody would know to check it.
 *
 * So each section states what belongs in it and carries a `Placeholder`. The
 * sections themselves follow what Greek consumer and e-commerce law expects of a
 * commercial site, and are the right list for a lawyer to work through.
 */

const SECTIONS = [
  {
    id: 'stoicheia',
    title: 'Στοιχεία επιχείρησης',
    note: 'Επωνυμία, νομική μορφή, έδρα, ΑΦΜ/ΔΟΥ, ΓΕΜΗ, στοιχεία επικοινωνίας — υποχρεωτικά για εμπορική ιστοσελίδα στην Ελλάδα',
    body: 'Τα πλήρη στοιχεία της επιχείρησης, όπως απαιτούνται από την ελληνική νομοθεσία για εμπορικές ιστοσελίδες.',
  },
  {
    id: 'ypiresies',
    title: 'Αντικείμενο των υπηρεσιών',
    note: 'Ακριβής περιγραφή του τι περιλαμβάνει η κατασκευή και η συνδρομή SEO, και τι ρητά δεν περιλαμβάνεται',
    body: 'Τι ακριβώς παραδίδεται σε κάθε υπηρεσία, τι εξαιρείται, και πώς ορίζεται η ολοκλήρωση ενός έργου.',
  },
  {
    id: 'timologisi',
    title: 'Τιμολόγηση και πληρωμές',
    note: 'Τρόπος τιμολόγησης, προκαταβολή, χρόνοι πληρωμής, συνέπειες καθυστέρησης, ΦΠΑ — να συμπληρωθεί μαζί με τη νέα τιμολογιακή πολιτική',
    body: 'Πώς και πότε γίνεται η χρέωση για το εφάπαξ κόστος κατασκευής και για τη μηνιαία συνδρομή προώθησης.',
  },
  {
    id: 'akyrosi',
    title: 'Ακύρωση και υπαναχώρηση',
    note: 'Δικαίωμα υπαναχώρησης καταναλωτή, όροι διακοπής μηνιαίας συνδρομής, επιστροφές',
    body: 'Πότε και πώς μπορεί κάθε πλευρά να διακόψει τη συνεργασία, και τι ισχύει για ποσά που έχουν ήδη καταβληθεί.',
  },
  {
    id: 'pnevmatika',
    title: 'Πνευματικά δικαιώματα',
    note: 'Ποιος κατέχει τον σχεδιασμό, τον κώδικα, το περιεχόμενο και το domain μετά την παράδοση· άδειες τρίτων (γραμματοσειρές, εικόνες)',
    body: 'Σε ποιον ανήκει το παραδοτέο μετά την εξόφληση, και ποιες άδειες τρίτων συνοδεύουν το έργο.',
  },
  {
    id: 'ypochreoseis',
    title: 'Υποχρεώσεις του πελάτη',
    note: 'Παροχή υλικού, εγκρίσεις εντός προθεσμιών, ευθύνη για τη νομιμότητα του περιεχομένου που παρέχει',
    body: 'Τι χρειάζεται να παρέχει ο πελάτης για να προχωρήσει το έργο, και σε ποιον χρόνο.',
  },
  {
    id: 'eyth-yni',
    title: 'Περιορισμός ευθύνης',
    note: 'Όρια ευθύνης για διαθεσιμότητα, απώλεια δεδομένων, ενέργειες τρίτων παρόχων — απαιτείται νομικός έλεγχος',
    body: 'Τα όρια της ευθύνης μας, ιδίως για ζητήματα που εξαρτώνται από τρίτους παρόχους (hosting, domain, μηχανές αναζήτησης).',
  },
  {
    id: 'epilysi',
    title: 'Εφαρμοστέο δίκαιο και επίλυση διαφορών',
    note: 'Αρμόδια δικαστήρια, εναλλακτική επίλυση διαφορών καταναλωτών (πλατφόρμα ΗΕΔ)',
    body: 'Ποιο δίκαιο διέπει τη συνεργασία και πού επιλύονται τυχόν διαφορές.',
  },
]

export default function TermsPage() {
  return (
    <Layout>
      <Chapter id="terms" tone="white" className="pt-36 md:pt-44">
        <PageHeader
          eyebrow="Νομικά"
          title={
            <>
              Όροι <em>χρήσης.</em>
            </>
          }
          lead="Οι όροι που διέπουν τη χρήση της ιστοσελίδας και τη συνεργασία με τη SAOS Studio."
        />

        <div className="mt-10 max-w-[68ch]">
          <Placeholder
            note="Ολόκληρη η σελίδα όρων χρήσης εκκρεμεί. Απαιτείται σύνταξη και έλεγχος από νομικό πριν τη δημοσίευση — δεν συντάσσεται αυτόματα."
            className="p-5 text-[0.88rem] leading-[1.75] text-ink font-body"
          >
            <strong>Αυτή η σελίδα δεν έχει ακόμη οριστικοποιηθεί.</strong> Παρακάτω
            περιγράφονται οι ενότητες που θα περιλαμβάνει. Το τελικό κείμενο θα συνταχθεί
            και θα ελεγχθεί από νομικό πριν δημοσιευτεί. Μέχρι τότε, για οποιοδήποτε
            ερώτημα σχετικά με τους όρους συνεργασίας επικοινωνήστε μαζί μας απευθείας.
          </Placeholder>

          <p className="mt-6 text-[0.9rem] leading-[1.8] text-muted font-body">
            Ερωτήσεις;{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-bold text-ink underline transition-colors duration-200 hover:text-warm-ink"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>

        <ol className="mt-14 max-w-[68ch] space-y-10">
          {SECTIONS.map((section, i) => (
            <li key={section.id} id={section.id} className="scroll-mt-32">
              <h2 className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-muted font-body">
                {String(i + 1).padStart(2, '0')} — {section.title}
              </h2>
              <p className="mt-3 text-[0.93rem] leading-[1.8] text-ink font-body">
                {section.body}
              </p>
              <Placeholder
                note={section.note}
                className="mt-3 p-4 text-[0.82rem] leading-[1.7] font-body"
              >
                Προς σύνταξη από νομικό.
              </Placeholder>
            </li>
          ))}
        </ol>

        <p className="mt-14 text-[0.82rem] text-muted font-body">
          Δείτε επίσης την{' '}
          <a
            href="/privacy"
            className="font-bold text-ink underline transition-colors duration-200 hover:text-warm-ink"
          >
            Πολιτική Απορρήτου
          </a>
          .
        </p>
      </Chapter>
    </Layout>
  )
}
