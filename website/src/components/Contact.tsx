import { BOOKING_URL } from '../lib/seo'

/**
 * Closing CTA — the homepage's one ask, and the only place on the page that
 * still carries the "no card, no commitment" reassurance. That line used to
 * appear eight times sitewide; it now appears here and directly beneath each of
 * the two forms, which is where it answers a live hesitation rather than
 * decorating a section.
 *
 * The old headline («Ας φτιάξουμε κάτι όμορφο») was cut for two reasons: it was
 * duplicated verbatim as the /our-story closer, and "something beautiful" is the
 * promise this studio explicitly does not make — /our-story argues that most
 * small businesses do not need an impressive site, they need one that works.
 *
 * The FAQ that used to live here moved to `Faq.tsx` so the accordion is its own
 * section with its own `#faq` anchor.
 */
export default function Contact() {
  return (
    <div className="w-full">
      <div className="rounded-card bg-ink text-white on-dark px-7 sm:px-12 md:px-16 py-14 md:py-20 text-center">
        <h2 className="text-headline on-dark text-[clamp(2.2rem,5.5vw,4.2rem)]">
          Πείτε μας τι <em>σας εμποδίζει.</em>
        </h2>
        <p className="mt-5 text-[0.95rem] font-medium text-white/60 font-body">
          Θα σας πούμε τι θα προτείναμε και τι θα κόστιζε, γραπτά, πριν
          δεσμευτείτε σε οτιδήποτε.
        </p>
        <p className="mt-3 mb-10 text-[0.85rem] font-medium text-white/45 font-body">
          Δύο λεπτά, χωρίς κάρτα και χωρίς δέσμευση.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/request-a-quote"
            className="btn-accent justify-center px-9 py-4 text-[0.9rem]"
          >
            Ζητήστε προσφορά <span aria-hidden>&rarr;</span>
          </a>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-on-dark justify-center px-9 py-4 text-[0.9rem]"
          >
            Κλείστε δωρεάν κλήση
          </a>
        </div>
      </div>
    </div>
  )
}
