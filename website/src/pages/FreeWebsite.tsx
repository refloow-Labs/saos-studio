import { Check, X } from 'lucide-react'
import Layout from '../components/Layout'
import Chapter from '../components/Chapter'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'

/**
 * `/free-website` — the detail behind the homepage offer.
 *
 * Exists because the homepage section that used to carry all of this had grown
 * into nine blocks. The offer and one action stayed there; eligibility,
 * inclusions, exclusions and the selection rate moved here, where a reader who
 * is already interested can actually read them.
 *
 * The lists below came verbatim from the old `FreeWebsite` section. The one
 * thing that did not survive is the «20%» acceptance rate: it was never
 * confirmed by the owner, and a `Placeholder` wrapper does not stop a hard
 * figure from reading as a claim. The selectivity is stated without a number.
 */

const INCLUDED = [
  'Σχεδιασμός και κατασκευή μονοσέλιδης ιστοσελίδας',
  'Σχεδιασμός πρώτα για το κινητό, ώστε να δείχνει σωστά σε κάθε οθόνη',
  'Φόρμα επικοινωνίας και σύνδεση με τα κανάλια σας',
  'Βασική ρύθμιση SEO ώστε να σας βρίσκουν',
  'Τεχνική ρύθμιση: domain, DNS, πιστοποιητικό SSL και δημοσίευση',
]

const NOT_INCLUDED = [
  'Κόστος domain και hosting, που πληρώνονται απευθείας στον πάροχο',
  'E-shop, σύστημα κρατήσεων ή πληρωμές',
  'Συγγραφή εκτενούς περιεχομένου ή επαγγελματική φωτογράφιση',
  'Συνεχής υποστήριξη μετά την παράδοση',
]

const STEPS = [
  {
    title: 'Κάνετε αίτηση',
    body: 'Έξι ερωτήσεις για την επιχείρησή σας και το πώς να σας βρούμε.',
  },
  {
    title: 'Την εξετάζουμε',
    body: 'Με τα κριτήρια που περιγράφονται παρακάτω — όχι με σειρά προτεραιότητας και όχι με κλήρωση.',
  },
  {
    title: 'Απαντάμε είτε έτσι είτε αλλιώς',
    body: 'Θα μάθετε την απόφαση και τον λόγο της, ακόμα κι αν είναι αρνητική.',
  },
  {
    title: 'Σχεδιάζουμε και παραδίδουμε',
    body: 'Η ιστοσελίδα παραδίδεται online, συνδεδεμένη και έτοιμη να δεχτεί επισκέπτες.',
  },
]

export default function FreeWebsitePage() {
  return (
    <Layout>
      <Chapter id="free-website-intro" tone="white" className="pt-36 md:pt-44">
        <PageHeader
          eyebrow="Δωρεάν website"
          doodle="burst"
          title={
            <>
              Ένα δωρεάν website για όσους το <em>χρειάζονται.</em>
            </>
          }
          lead="Κάθε μήνα κρατάμε μια θέση για μια επιχείρηση που θα ωφελούνταν πραγματικά από μια σωστή ιστοσελίδα αλλά δεν μπορεί να την πληρώσει. Χωρίς χρέωση και χωρίς αντάλλαγμα."
        />

        <Reveal className="mt-10">
          <p className="max-w-[64ch] text-[0.96rem] leading-[1.85] text-muted font-body">
            Κάποιες επιχειρήσεις έχουν πραγματικούς πελάτες και πραγματική δουλειά από
            πίσω, αλλά τίποτα online που να το δείχνει — συνήθως επειδή η κατασκευή είναι
            το έξοδο που δεν χωράει ποτέ στον προϋπολογισμό. Κρατάμε ένα μέρος από τον
            χρόνο μας κάθε μήνα ακριβώς γι' αυτές.
          </p>
        </Reveal>
      </Chapter>

      <Chapter id="poioi" tone="gray">
        <h2 className="text-headline text-[clamp(1.6rem,3.2vw,2.4rem)] max-w-[20ch]">
          Ποιοι μπορούν να κάνουν <em>αίτηση.</em>
        </h2>
        <Reveal className="mt-6">
          <p className="max-w-[64ch] text-[0.96rem] leading-[1.85] text-muted font-body">
            Μικρές επιχειρήσεις και ελεύθεροι επαγγελματίες που έχουν πραγματικούς πελάτες
            αλλά καμία ή πολύ κακή παρουσία online, και δεν έχουν τον προϋπολογισμό για μια
            κανονική κατασκευή.
          </p>
        </Reveal>
      </Chapter>

      <Chapter id="diadikasia" tone="white">
        <h2 className="text-headline text-[clamp(1.6rem,3.2vw,2.4rem)] max-w-[20ch]">
          Από την αίτηση στην <em>παράδοση.</em>
        </h2>

        <ol className="mt-10">
          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 70}>
              <div className="flex gap-6 border-t border-border py-7">
                <span
                  aria-hidden
                  className="text-display text-[1.15rem] leading-none text-muted pt-1"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-[1rem] font-extrabold leading-tight text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[56ch] text-[0.89rem] leading-[1.75] text-muted font-body">
                    {step.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </Chapter>

      <Chapter id="ti-perilamvanei" tone="gray">
        <h2 className="text-headline text-[clamp(1.6rem,3.2vw,2.4rem)] max-w-[22ch]">
          Τι περιλαμβάνει και τι <em>δεν περιλαμβάνει.</em>
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-card border border-border bg-bg p-7 sm:p-8">
              <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-warm-ink font-body">
                Τι περιλαμβάνει
              </h3>
              <ul className="mt-5 space-y-3">
                {INCLUDED.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[0.9rem] leading-[1.7] text-ink font-body"
                  >
                    <Check
                      aria-hidden
                      strokeWidth={3}
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-warm-dim"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="h-full rounded-card border border-border bg-bg p-7 sm:p-8">
              <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-muted font-body">
                Τι δεν περιλαμβάνει
              </h3>
              <ul className="mt-5 space-y-3">
                {NOT_INCLUDED.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[0.9rem] leading-[1.7] text-muted font-body"
                  >
                    <X
                      aria-hidden
                      strokeWidth={3}
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-2"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Chapter>

      <Chapter id="epilogi" tone="white">
        <h2 className="text-headline text-[clamp(1.6rem,3.2vw,2.4rem)] max-w-[20ch]">
          Πώς γίνεται η <em>επιλογή.</em>
        </h2>

        {/* The «20%» acceptance rate that used to sit here has been removed, not
            moved. A hard figure inside a Placeholder still reads as a claim to
            anyone who does not parse the dashed border, and the owner has never
            confirmed it. What is true without it — that not everyone is accepted
            and that we say so up front — is the part that does the work anyway.
            Restore a number only with a real one. */}
        <Reveal className="mt-8">
          <p className="max-w-[64ch] text-[0.92rem] leading-[1.8] text-muted font-body">
            Οι αιτήσεις αξιολογούνται με τα κριτήρια που περιγράφονται παραπάνω,
            όχι με σειρά προτεραιότητας και όχι με κλήρωση. Δεν γίνονται όλες
            δεκτές και δεν εγγυόμαστε αποδοχή — προτιμάμε να το πούμε από την
            αρχή παρά να σας αφήσουμε να περιμένετε.
          </p>
        </Reveal>
      </Chapter>

      <Chapter id="free-website-cta" tone="dark">
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className="text-headline text-[clamp(1.7rem,3.6vw,2.6rem)]">
            Αν η κατασκευή είναι το έξοδο που δεν <em>χωράει ποτέ.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-[50ch] text-[0.98rem] leading-[1.8] text-white/70 font-body">
            Αυτός είναι ακριβώς ο λόγος που κρατάμε μια θέση κάθε μήνα. Πείτε μας
            για την επιχείρησή σας.
          </p>
          {/* The application form is a modal on the homepage section, so this
              routes back to it rather than duplicating ApplicationModal here. */}
          <a
            href="/#free-website"
            className="btn-accent mt-9 justify-center px-9 py-4 text-[0.9rem]"
          >
            Κάντε αίτηση <span aria-hidden>→</span>
          </a>
        </div>
      </Chapter>
    </Layout>
  )
}
