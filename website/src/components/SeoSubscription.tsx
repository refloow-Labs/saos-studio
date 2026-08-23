import Reveal from './Reveal'
import Doodle from './Doodle'

const CYCLE = [
  {
    label: 'Βλέπουμε τι κινήθηκε',
    body: 'Ποιες αναζητήσεις σας έφεραν κόσμο τον προηγούμενο μήνα και ποιες όχι.',
  },
  {
    label: 'Διορθώνουμε ό,τι χάλασε',
    body: 'Νεκροί σύνδεσμοι, πτώση ταχύτητας, σελίδες που η Google σταμάτησε να διαβάζει.',
  },
  {
    label: 'Δουλεύουμε το περιεχόμενο',
    body: 'Βελτιώνουμε υπάρχουσες σελίδες ή προσθέτουμε νέες εκεί που υπάρχει ζήτηση.',
  },
  {
    label: 'Σας στέλνουμε τι έγινε',
    body: 'Μια αναφορά με πραγματικά νούμερα και τι προτείνουμε για τον επόμενο μήνα.',
  },
]

/**
 * The monthly SEO subscription, explained.
 *
 * The hard part of selling a subscription to a small business is that it sounds
 * like a subscription: something that quietly takes money forever. So this leads
 * with why it recurs (the work recurs), shows the actual monthly cycle, and says
 * plainly that no one can guarantee a ranking.
 *
 * Sticky left column against a scrolling right list. It is the only section on
 * the page using that structure, which is the point.
 */
export default function SeoSubscription() {
  return (
    <div className="w-full">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <div className="relative lg:sticky lg:top-32 lg:self-start">
          <Doodle
            variant="arrow"
            className="absolute -top-12 right-6 hidden h-16 w-16 rotate-12 opacity-90 lg:block"
          />

          <h2 className="text-headline text-[clamp(1.7rem,3.6vw,2.7rem)] max-w-[16ch]">
            Το SEO δεν τελειώνει. Γι' αυτό είναι <em>συνδρομή.</em>
          </h2>

          <p className="mt-6 max-w-[44ch] text-[0.96rem] leading-[1.85] text-muted font-body">
            Οι ανταγωνιστές σας ανανεώνουν τις σελίδες τους, η Google αλλάζει τον τρόπο που
            κατατάσσει, και οι αναζητήσεις των πελατών σας μετακινούνται. Μια εφάπαξ
            εργασία SEO σβήνει μέσα σε μήνες.
          </p>

          <p className="mt-5 max-w-[44ch] text-[0.9rem] leading-[1.8] text-ink font-body">
            Είναι εντελώς προαιρετικό. Η ιστοσελίδα σας λειτουργεί κανονικά χωρίς αυτό, και
            μπορείτε να ξεκινήσετε ή να σταματήσετε όποτε θέλετε.
          </p>

          <a
            href="/services#proothisi"
            className="group mt-8 inline-flex items-center gap-2 text-[0.88rem] font-bold text-ink transition-colors duration-200 hover:text-warm-ink"
          >
            Δείτε τι περιλαμβάνει
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>

        <div>
          <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-muted font-body">
            Κάθε μήνα
          </h3>

          <ol className="mt-6">
            {CYCLE.map((step, i) => (
              <Reveal as="li" key={step.label} delay={i * 70}>
                <div className="flex gap-6 border-t border-border py-7">
                  <span
                    aria-hidden
                    className="text-display text-[1.15rem] leading-none text-muted pt-1"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="text-[1rem] font-extrabold leading-tight text-ink">
                      {step.label}
                    </h4>
                    <p className="mt-2 max-w-[52ch] text-[0.89rem] leading-[1.75] text-muted font-body">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          {/* The honest limit. Stated here rather than buried, because everyone
              selling SEO to a small business promises a position and cannot
              deliver one. */}
          <Reveal>
            <p className="mt-4 border-l-2 border-warm pl-5 text-[0.88rem] leading-[1.8] text-muted font-body">
              Καμία εταιρεία δεν μπορεί να εγγυηθεί συγκεκριμένη θέση στη Google. Όποιος το
              υπόσχεται, δεν λέει την αλήθεια. Αυτό που εγγυόμαστε είναι η δουλειά και οι
              μετρήσεις που τη δείχνουν.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
