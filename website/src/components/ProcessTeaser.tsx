import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

/**
 * The delivery process, condensed to four beats.
 *
 * `/how-it-works` carries all eight stages. Reproducing them here would make the
 * homepage a duplicate of that page and bury the four things a visitor actually
 * needs to know before enquiring: that they see a price first, see a design
 * before code, get revisions, and own the result.
 *
 * Laid out as a horizontal run with a connecting rule, so it reads as a sequence
 * rather than four more cards.
 */
const BEATS = [
  {
    label: 'Μας λέτε τι χρειάζεστε',
    body: 'Δύο λεπτά στη φόρμα, ή μια σύντομη κλήση αν προτιμάτε.',
  },
  {
    label: 'Λαμβάνετε γραπτή προσφορά',
    body: 'Τι θα φτιαχτεί, πόσο κοστίζει, σε πόσο χρόνο. Πριν δεσμευτείτε.',
  },
  {
    label: 'Σχεδιάζουμε και χτίζουμε',
    body: 'Βλέπετε τον σχεδιασμό πριν γραφτεί κώδικας και στέλνετε σχόλια.',
  },
  {
    label: 'Δημοσιεύουμε',
    body: 'Συνδέουμε domain και SSL, και σας παραδίδουμε τους κωδικούς.',
  },
]

export default function ProcessTeaser() {
  return (
    <div className="w-full">
      <SectionHeading
        size="lg"
        body="Ξέρετε από την αρχή τι θα γίνει και πότε. Καμία δουλειά δεν ξεκινά πριν συμφωνήσετε γραπτώς στο κόστος."
      >
        Πώς <em>δουλεύουμε.</em>
      </SectionHeading>

      <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {BEATS.map((beat, i) => (
          <Reveal as="li" key={beat.label} delay={i * 80}>
            <div className="relative">
              {/* Connecting rule, drawn only between items on the wide layout. */}
              <span aria-hidden className="block h-px w-full bg-border" />
              <span
                aria-hidden
                className="absolute -top-[3px] left-0 block h-[7px] w-[7px] rounded-full bg-warm"
              />

              {/* `text-muted`, not `text-muted-2`: measured on the rendered page,
                  muted-2 (#9A9186) at this size sits at 2.73:1 on the surface
                  ground, well under AA. muted (#6B6257) measures 5.26:1. */}
              <span
                aria-hidden
                className="mt-6 block text-[0.7rem] font-extrabold tracking-[0.14em] text-muted font-body"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <h3 className="mt-3 text-[1.02rem] font-extrabold leading-tight text-ink">
                {beat.label}
              </h3>
              <p className="mt-2.5 max-w-[34ch] text-[0.89rem] leading-[1.75] text-muted font-body">
                {beat.body}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>

      <Reveal className="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
        <a href="/how-it-works" className="btn-outline flex-shrink-0 px-8 py-3.5 text-[0.85rem]">
          Δείτε και τα οκτώ βήματα <span aria-hidden>→</span>
        </a>

        {/* The one line of "who we are" left on the homepage. The story section
            moved to /our-story; without something here, "we" is never named. */}
        <p className="max-w-[42ch] text-[0.85rem] leading-[1.75] text-muted font-body">
          Είμαστε μια μικρή ομάδα από τη Σαμοθράκη, το web division της Rhooa Labs.{' '}
          <a
            href="/our-story"
            className="font-bold text-ink underline underline-offset-4 transition-colors duration-200 hover:text-warm-ink"
          >
            Η ιστορία μας
          </a>
          .
        </p>
      </Reveal>
    </div>
  )
}
