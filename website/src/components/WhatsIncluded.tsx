import { Smartphone, Gauge, Search, Mail, Globe } from 'lucide-react'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

const CELL = 'flex h-full flex-col rounded-card border border-border bg-bg p-7'
const ICON = 'h-5 w-5 text-warm-dim'
const TITLE = 'mt-4 text-[1.02rem] font-extrabold leading-tight text-ink'
const BODY = 'mt-2.5 text-[0.89rem] leading-[1.75] text-muted font-body'

/**
 * What a build actually includes.
 *
 * A bento rather than a feature row: the six items are not equal, and a grid of
 * six identical cards would say they are. The two design-led items get real
 * screenshots, speed gets the accent ground, and the technical setup runs full
 * width at the bottom because it is the one nobody thinks to ask about until it
 * goes wrong.
 *
 * Six items, six cells. No filler tile.
 */
export default function WhatsIncluded() {
  return (
    <div className="w-full">
      <SectionHeading
        size="lg"
        body="Χωρίς κρυφές χρεώσεις και χωρίς «αυτό είναι extra». Αν λείπει κάτι που χρειάζεστε, θα το δείτε στην προσφορά πριν ξεκινήσουμε."
      >
        Τι περιλαμβάνει η <em>κατασκευή.</em>
      </SectionHeading>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {/* 1 — design, the largest claim, gets the largest cell and a real capture */}
        <Reveal className="md:col-span-2">
          <div className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-bg">
            <div className="p-7">
              <h3 className="text-[clamp(1.1rem,1.9vw,1.4rem)] font-extrabold leading-tight text-ink">
                Σχεδιασμός φτιαγμένος για την επιχείρησή σας
              </h3>
              <p className="mt-3 max-w-[48ch] text-[0.91rem] leading-[1.75] text-muted font-body">
                Ξεκινάμε από το τι κάνετε και ποιον θέλετε να φτάσετε, όχι από ένα έτοιμο
                template με αλλαγμένα χρώματα. Βλέπετε τον σχεδιασμό πριν γραφτεί κώδικας.
              </p>
            </div>
            <div className="relative mt-auto h-48 overflow-hidden border-t border-border bg-white sm:h-56">
              <picture>
                <source srcSet="/work/dental-home/full.webp" type="image/webp" />
                <img
                  src="/work/dental-home/full.jpg"
                  alt="Δείγμα σχεδιασμού: ιστοσελίδα οδοντιατρείου"
                  width={820}
                  height={620}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-x-0 top-0 w-full"
                />
              </picture>
            </div>
          </div>
        </Reveal>

        {/* 2 — mobile, shown rather than asserted */}
        <Reveal delay={70}>
          <div className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-bg">
            <div className="p-7">
              <Smartphone aria-hidden className={ICON} strokeWidth={1.75} />
              <h3 className={TITLE}>Σωστό στο κινητό</h3>
              <p className={BODY}>
                Το κινητό δεν είναι η μικρή έκδοση της σελίδας. Είναι η κύρια, και
                σχεδιάζουμε πρώτα γι' αυτό.
              </p>
            </div>
            <div className="relative mt-auto h-40 overflow-hidden border-t border-border bg-white">
              <picture>
                <source srcSet="/work/ammos/full.webp" type="image/webp" />
                <img
                  src="/work/ammos/full.jpg"
                  alt="Δείγμα σχεδιασμού: ιστοσελίδα beach bar"
                  width={820}
                  height={620}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-x-0 top-0 w-full"
                />
              </picture>
            </div>
          </div>
        </Reveal>

        {/* 3 — speed, on the accent ground */}
        <Reveal delay={140}>
          <div className="flex h-full flex-col rounded-card bg-warm-soft p-7">
            <Gauge aria-hidden className="h-5 w-5 text-warm-dim" strokeWidth={1.75} />
            <h3 className={TITLE}>Ταχύτητα από την αρχή</h3>
            <p className="mt-2.5 text-[0.89rem] leading-[1.75] text-ink/70 font-body">
              Η ταχύτητα δεν είναι κάτι που διορθώνεται στο τέλος. Είναι απόφαση που
              παίρνουμε σε κάθε εικόνα και κάθε γραμμή κώδικα.
            </p>
          </div>
        </Reveal>

        {/* 4 */}
        <Reveal delay={210}>
          <div className={CELL}>
            <Search aria-hidden className={ICON} strokeWidth={1.75} />
            <h3 className={TITLE}>Βασική δομή SEO</h3>
            <p className={BODY}>
              Τίτλοι, επικεφαλίδες, sitemap, σήμανση που διαβάζει η Google και σύνδεση με το Search
              Console. Ό,τι χρειάζεται για να σας βρίσκουν από την πρώτη μέρα.
            </p>
          </div>
        </Reveal>

        {/* 5 */}
        <Reveal delay={280}>
          <div className={CELL}>
            <Mail aria-hidden className={ICON} strokeWidth={1.75} />
            <h3 className={TITLE}>Φόρμα που φτάνει σε εσάς</h3>
            <p className={BODY}>
              Συνδεδεμένη με το email σας και με τα κανάλια που ήδη χρησιμοποιείτε, ώστε
              κανένα μήνυμα να μη χάνεται.
            </p>
          </div>
        </Reveal>

        {/* 6 — the technical setup, full width */}
        <Reveal delay={350} className="md:col-span-3">
          <div className="flex h-full flex-col gap-5 rounded-card border border-border bg-surface p-7 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
            <div>
              <Globe aria-hidden className={ICON} strokeWidth={1.75} />
              <h3 className={TITLE}>Domain, hosting και δημοσίευση</h3>
              <p className="mt-2.5 max-w-[62ch] text-[0.89rem] leading-[1.75] text-muted font-body">
                Αναλαμβάνουμε όλη την τεχνική εγκατάσταση: σύνδεση domain, DNS, πιστοποιητικό
                SSL και δημοσίευση. Δεν μεταπωλούμε hosting, οπότε πληρώνετε τον πάροχο
                απευθείας και ο λογαριασμός παραμένει δικός σας.
              </p>
            </div>
            <a
              href="/services#anaptyxi"
              className="btn-outline flex-shrink-0 justify-center px-7 py-3.5 text-[0.85rem]"
            >
              Δείτε τι περιλαμβάνει <span aria-hidden>→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
