import { BOOKING_URL } from '../lib/seo'

/**
 * Closing CTA. The FAQ that used to live here moved to `Faq.tsx` so the
 * accordion is its own section with its own `#faq` anchor.
 */
export default function Contact() {
  return (
    <div className="w-full">
      <div className="rounded-card bg-ink text-white on-dark px-7 sm:px-12 md:px-16 py-14 md:py-20 text-center">
        <h2 className="text-headline on-dark text-[clamp(2.2rem,5.5vw,4.2rem)]">
          Ας φτιάξουμε κάτι <em>όμορφο.</em>
        </h2>
        <p className="mt-5 mb-10 text-[0.95rem] font-medium text-white/60 font-body">
          Πείτε μας τι χρειάζεστε και θα σας απαντήσουμε με συγκεκριμένες προτάσεις.
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
