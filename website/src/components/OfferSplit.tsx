import { Check } from 'lucide-react'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

const ONE_TIME = [
  'Πληρώνετε μία φορά για την κατασκευή',
  'Η ιστοσελίδα και το domain είναι δικά σας',
  'Καμία υποχρεωτική μηνιαία χρέωση για να μείνει online',
]

const MONTHLY = [
  'Ξεκινά όποτε θέλετε, ακόμα και μήνες μετά',
  'Σταματά όποτε θέλετε, χωρίς ποινή',
  'Η ιστοσελίδα συνεχίζει να δουλεύει είτε έτσι είτε αλλιώς',
]

const TRUST = [
  'Χωρίς δέσμευση',
  'Γραπτή προσφορά πριν ξεκινήσουμε',
  'Δεν ζητάμε κάρτα',
]

/**
 * How the money works, stated immediately after the hero.
 *
 * Two panels rather than three equal cards, and deliberately unequal: the build
 * is the product, the subscription is optional. Giving them the same visual
 * weight would imply the site needs the subscription to function, which is the
 * thing small-business owners are most afraid of and the thing we most want to
 * disprove.
 *
 * No figures. Prices were withdrawn pending repricing, so these describe the
 * model and route to the quote form.
 */
export default function OfferSplit() {
  return (
    <div className="w-full">
      <SectionHeading
        size="lg"
        body="Δύο ξεχωριστά πράγματα, και μόνο το πρώτο είναι απαραίτητο. Δεν κλειδώνουμε την ιστοσελίδα σας πίσω από συνδρομή."
      >
        Πληρώνετε μία φορά για την κατασκευή. Το SEO είναι <em>δική σας επιλογή.</em>
      </SectionHeading>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <div className="flex h-full flex-col rounded-card bg-warm-soft p-8 sm:p-10">
            <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-warm-ink font-body">
              Εφάπαξ
            </span>
            <h3 className="mt-4 text-headline text-[clamp(1.5rem,2.8vw,2.1rem)]">
              Κατασκευή ιστοσελίδας
            </h3>
            <p className="mt-4 max-w-[46ch] text-[0.95rem] leading-[1.8] text-ink/70 font-body">
              Σχεδιασμός και υλοποίηση από το μηδέν, φτιαγμένα για την επιχείρησή σας.
              Παραδίδεται online, συνδεδεμένη και έτοιμη να φέρει πελάτες.
            </p>

            <ul className="mt-7 space-y-3">
              {ONE_TIME.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[0.92rem] leading-[1.7] text-ink font-body"
                >
                  <Check
                    aria-hidden
                    strokeWidth={3}
                    className="mt-1 h-4 w-4 flex-shrink-0 text-warm-dim"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="/services#anaptyxi"
              className="group mt-auto inline-flex items-center gap-2 pt-8 text-[0.87rem] font-bold text-ink transition-colors duration-200 hover:text-warm-ink"
            >
              Τι ακριβώς περιλαμβάνει
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="flex h-full flex-col rounded-card border border-border bg-bg p-8 sm:p-10">
            <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-muted font-body">
              Προαιρετικό
            </span>
            <h3 className="mt-4 text-headline text-[clamp(1.3rem,2.2vw,1.7rem)]">
              Μηνιαίο SEO
            </h3>
            <p className="mt-4 max-w-[40ch] text-[0.92rem] leading-[1.8] text-muted font-body">
              Για όσους θέλουν η σελίδα να ανεβαίνει στις αναζητήσεις με τον χρόνο.
            </p>

            <ul className="mt-7 space-y-3">
              {MONTHLY.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[0.9rem] leading-[1.7] text-muted font-body"
                >
                  <Check
                    aria-hidden
                    strokeWidth={3}
                    className="mt-1 h-4 w-4 flex-shrink-0 text-muted-2"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="/services#proothisi"
              className="group mt-auto inline-flex items-center gap-2 pt-8 text-[0.87rem] font-bold text-ink transition-colors duration-200 hover:text-warm-ink"
            >
              Πώς δουλεύει η συνδρομή
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </Reveal>
      </div>

      {/* Moved out of the hero, where it was a fourth text block competing with
          the CTA. Here it reads as terms attached to the offer. */}
      <ul className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-7 text-[0.83rem] font-semibold text-muted font-body">
        {TRUST.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <Check aria-hidden strokeWidth={3} className="h-3.5 w-3.5 text-warm-dim" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
