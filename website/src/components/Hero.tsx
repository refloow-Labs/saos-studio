import Doodle from './Doodle'

/**
 * The page's opening statement and primary conversion.
 *
 * Asymmetric split rather than a stacked centre column: copy left, a real site
 * we designed on the right. A studio that builds websites should show one in the
 * first screen. The previous version was type over white with a doodle, which
 * asked the visitor to take the craft on trust.
 *
 * Text elements are capped at three (headline, subtext, CTAs). The eyebrow and
 * the three trust ticks that used to sit here were doing a different job and
 * moved to the offer section directly below, where they have room to be read
 * rather than skimmed past on the way to the button.
 */
export default function Hero() {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative mx-auto grid min-h-[92svh] w-full max-w-6xl items-center gap-12 px-5 pb-16 pt-24 sm:px-8 md:px-12 lg:grid-cols-[1.3fr_0.85fr] lg:gap-14">
        <div className="relative">
          <Doodle
            variant="sparkle"
            className="absolute -top-14 -left-8 hidden h-20 w-20 rotate-12 opacity-80 lg:block"
          />

          <h1 className="text-headline text-[clamp(2rem,3.6vw,2.85rem)] max-w-[24ch]">
            Η online παρουσία που αξίζει η <em>επιχείρησή σας.</em>
          </h1>

          <p className="mt-7 max-w-[46ch] text-[clamp(1rem,1.3vw,1.12rem)] leading-[1.75] text-muted font-body">
            Σχεδιάζουμε websites που συνδυάζουν καθαρό design, ταχύτητα και πραγματική
            χρησιμότητα.{' '}
            <span className="font-semibold text-ink">
              Εφάπαξ κατασκευή, με προαιρετικό μηνιαίο SEO.
            </span>
          </p>

          <div className="mt-9 flex flex-col items-start gap-5">
            <a
              href="/request-a-quote"
              className="btn-accent w-full justify-center text-center px-6 py-4 text-[0.95rem] sm:w-auto sm:px-9"
            >
              Ζητήστε προσφορά σε 2 λεπτά <span aria-hidden>→</span>
            </a>

            <a
              href="/how-it-works"
              className="group link-arrow text-[0.88rem] font-bold text-muted transition-colors duration-200 hover:text-ink font-body"
            >
              Δείτε πώς λειτουργεί
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>

        {/*
          A real capture of a site we designed, not a div-built mock browser.
          `full.webp` is the full-page screenshot already in public/work/, shown
          top-anchored so the fold of the design is what reads.

          Rendered at every breakpoint rather than `hidden lg:block`: a
          CSS-hidden image is still downloaded, so the mobile visitor was paying
          for a picture they never saw. On small screens it sits below the CTA
          and is partly in view, which is a better hero than type alone anyway.
        */}
        <div className="relative">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-card border border-border bg-white lg:aspect-[4/5]">
            <picture>
              <source srcSet="/work/salento/full.webp" type="image/webp" />
              <img
                src="/work/salento/full.jpg"
                alt="Δείγμα σχεδιασμού: ιστοσελίδα εστιατορίου street food"
                width={820}
                height={620}
                decoding="async"
                /* Lowercase on purpose. React 18 does not recognise the
                   camelCase `fetchPriority` prop and drops it with a warning;
                   the spread passes the real HTML attribute through. */
                {...{ fetchpriority: 'high' }}
                className="absolute inset-x-0 top-0 w-full"
              />
            </picture>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
