import { useState } from 'react'
import { Check, X } from 'lucide-react'
import Reveal from './Reveal'
import Doodle from './Doodle'
import Placeholder from './Placeholder'
import ApplicationModal from './ApplicationModal'

const INCLUDED = [
  'Σχεδιασμός και κατασκευή μονοσέλιδης ιστοσελίδας',
  'Mobile-first υλοποίηση για σωστή εμφάνιση σε κάθε οθόνη',
  'Φόρμα επικοινωνίας και σύνδεση με τα κανάλια σας',
  'Βασική ρύθμιση SEO ώστε να σας βρίσκουν',
  'Τεχνική ρύθμιση: domain, DNS, SSL, deployment',
]

const NOT_INCLUDED = [
  'Κόστος domain και hosting, που πληρώνονται απευθείας στον πάροχο',
  'E-shop, σύστημα κρατήσεων ή πληρωμές',
  'Συγγραφή εκτενούς περιεχομένου ή επαγγελματική φωτογράφιση',
  'Συνεχής υποστήριξη μετά την παράδοση',
]


/**
 * The page's main conversion point: apply for a free website.
 *
 * Tone is deliberately flat. The offer is unusual enough that overselling it
 * reads as a catch — so the section states what is included, what is not, and
 * that most applications are declined, before it asks for anything.
 */
export default function FreeWebsite() {
  const [open, setOpen] = useState(false)

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-card bg-break text-white on-dark p-8 sm:p-12 lg:p-16">
        <Doodle
          variant="burst"
          className="absolute -top-2 right-6 hidden h-24 w-24 opacity-80 lg:block"
        />

        <div className="relative max-w-3xl">
          <h2 className="text-headline on-dark text-[clamp(2rem,5vw,3.4rem)]">
            Κάνε αίτηση για ένα <em>δωρεάν website.</em>
          </h2>

          <p className="mt-6 max-w-[58ch] text-[1rem] leading-[1.8] text-white/70 font-body">
            Κάθε μήνα επιλέγουμε μικρές επιχειρήσεις και τους φτιάχνουμε μια επαγγελματική
            ιστοσελίδα χωρίς χρέωση για τη σχεδίαση και την κατασκευή. Δεν είναι
            διαγωνισμός και δεν υπάρχει κρυφή χρέωση. Είναι ο τρόπος μας να δουλέψουμε με
            επιχειρήσεις που αξίζουν να φαίνονται σωστά online.
          </p>
        </div>

        {/* Who it is for */}
        <Reveal className="relative mt-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white/50 font-body">
              Σε ποιους απευθύνεται
            </h3>
            <p className="mt-3 max-w-[64ch] text-[0.92rem] leading-[1.8] text-white/80 font-body">
              Σε μικρές επιχειρήσεις και ελεύθερους επαγγελματίες που έχουν πραγματικούς
              πελάτες αλλά καμία ή πολύ κακή παρουσία online, και δεν έχουν τον
              προϋπολογισμό για μια κανονική κατασκευή.
            </p>
          </div>
        </Reveal>

        {/* Included / not included */}
        <div className="relative mt-8 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-warm font-body">
                Τι περιλαμβάνει
              </h3>
              <ul className="mt-4 space-y-3">
                {INCLUDED.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[0.88rem] leading-[1.65] text-white/85 font-body"
                  >
                    <Check aria-hidden className="mt-0.5 h-4 w-4 flex-shrink-0 text-warm" strokeWidth={3} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white/50 font-body">
                Τι δεν περιλαμβάνει
              </h3>
              <ul className="mt-4 space-y-3">
                {NOT_INCLUDED.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[0.88rem] leading-[1.65] text-white/60 font-body"
                  >
                    <X aria-hidden className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/35" strokeWidth={3} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Acceptance rate — the transparency beat. */}
        <Reveal className="relative mt-8">
          <Placeholder
            note="Ποσοστό αποδοχής αιτήσεων: να επιβεβαιωθεί από τον ιδιοκτήτη πριν δημοσιευτεί"
            className="p-5 text-[0.9rem] leading-[1.8] text-ink font-body"
          >
            Οι αιτήσεις αξιολογούνται με συγκεκριμένα κριτήρια και περίπου το{' '}
            <strong>20%</strong> των αιτήσεων γίνεται αποδεκτό. Δεν εγγυόμαστε αποδοχή.
            προτιμάμε να το πούμε από την αρχή παρά να σας αφήσουμε να περιμένετε.
          </Placeholder>
        </Reveal>

        <Reveal className="relative mt-10">
          <a
            href="/how-it-works"
            className="group link-arrow text-[0.88rem] font-bold text-white transition-colors duration-200 hover:text-warm"
          >
            Δείτε πώς λειτουργεί η διαδικασία
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </Reveal>

        <Reveal className="relative mt-11">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="btn-accent justify-center px-9 py-4 text-[0.9rem]"
            >
              Κάνε αίτηση τώρα <span aria-hidden>→</span>
            </button>
            <p className="text-[0.8rem] leading-[1.6] text-white/50 font-body">
              Χρειάζεται περίπου 2 λεπτά. Δεν ζητάμε κάρτα και δεν υπάρχει δέσμευση.
            </p>
          </div>
        </Reveal>
      </div>

      <ApplicationModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
