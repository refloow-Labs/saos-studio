import Carousel from './Carousel'
import Doodle from './Doodle'
import HeroShowcaseCard from './HeroShowcaseCard'
import MountSaos from './MountSaos'
import { projects } from '../lib/projects'

/**
 * The page's opening statement and primary conversion.
 *
 * Centred composition on a dark ground, with the Mount Saos ridgeline drawn
 * behind it. The mountain is not decoration: the studio is local to Samothraki
 * and Alexandroupoli — `schema.ts` publishes a Σαμοθράκη locality and a Thrace
 * service area — so the silhouette, the badge and the subhead all make the same
 * claim. The headline no longer carries the geography; it carries the argument,
 * and the region moved to the line beneath it.
 *
 * Five deliberate layers, back to front:
 *
 *   0  the `break` ground, with a soft radial lift toward `break-2`
 *   1  <MountSaos> — the ridgeline, anchored to the carousel
 *   2  atmospheric gradients: darker at the top so the headline stays legible,
 *      fading back to the ground at the bottom
 *   3  the content column — badge, headline, supporting line, CTAs
 *   4  the showcase carousel (view-only), covering the ridge's base
 *
 * Layers 3 and 4 carry `relative z-10`; everything below is `aria-hidden` and
 * `pointer-events-none`, so the drawing can never intercept a click or reach
 * the accessibility tree.
 *
 * `on-dark` on the root is load-bearing rather than cosmetic: `index.css` maps
 * `.on-dark .text-headline` to white and `.on-dark .text-headline em` to the
 * warm accent, which is where the headline's emphasis colour comes from.
 *
 * Nothing here is wrapped in `Reveal`. This is above the fold on every screen,
 * and the previous hero deliberately kept its LCP content static too.
 */
export default function Hero() {
  const featured = projects.filter((p) => p.featured)

  return (
    <section
      className="on-dark relative isolate w-full overflow-hidden bg-break text-white"
      aria-labelledby="hero-heading"
    >
      {/* Layer 0 — a soft off-centre lift so the flat near-black reads as a
          lit space rather than a swatch. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(115% 78% at 50% 8%, #1E1A14 0%, #14110C 58%, #14110C 100%)',
        }}
      />

      {/* Layer 2 — atmosphere. The top wash protects headline contrast; the
          bottom one lands the drawing back into the page ground so there is no
          seam where the hero meets the next section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-break via-break/70 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-break to-transparent"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-20 pt-32 sm:px-8 md:px-12 md:pb-24 md:pt-36">
        {/* Layer 3 — content. */}
        <div className="flex flex-col items-center text-center">
          {/*
            A positioning badge, not a rating badge. REDESIGN.md rules out
            fabricated authority — award badges, client counts, rating
            aggregates — and the reviews in `lib/reviews.ts` are invented
            samples that deliberately emit no Review/AggregateRating JSON-LD.
            So this carries something true and checkable instead of a number
            that would have to be retracted later.
          */}
          <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-[0.72rem] font-semibold tracking-[0.01em] text-white/80 font-body sm:text-[0.78rem]">
            <Doodle variant="sparkle" className="h-4 w-4 flex-shrink-0" strokeWidth={4} />
            Στούντιο από τη Σαμοθράκη &amp; την Αλεξανδρούπολη
          </p>

          {/*
            The headline makes the argument; it does not name the category. That
            job moved to the subhead, the <title> and the h2s further down, which
            is where the «κατασκευή ιστοσελίδων» keyword now lives. The previous
            wording («Ανάπτυξη και προώθηση ιστοσελίδων στη Βόρεια Ελλάδα») was a
            label: true, searchable, and making no case to anyone already
            unhappy with the site they have.

            «Τηλέφωνα» is deliberate and concrete — it is what a tradesperson in
            Alexandroupoli actually wants from a website, and it sets up the
            contrast that does the arguing.

            Mixed case with the tonos intact — never text-transform. Greek drops
            the tonos in all-caps, which is why banner words elsewhere on the
            site are authored uppercase in the markup instead.
          */}
          <h1
            id="hero-heading"
            className="text-headline mt-7 max-w-[17ch] text-balance text-[clamp(2.05rem,5.6vw,4.4rem)]"
          >
            Μια ιστοσελίδα που φέρνει <em>τηλέφωνα</em>. Όχι εντυπώσεις.
          </h1>

          {/* text-white/70, not text-muted: #6B6257 on #14110C fails contrast
              badly. This clears AA comfortably.

              Three sentences rather than one, so the measure widens to ~64ch —
              REDESIGN.md caps body copy around 65ch — and the type steps down
              slightly. At the old size and width this ran to six centred lines
              and started competing with the headline. */}
          <p className="mt-9 max-w-[64ch] text-[clamp(0.94rem,1.15vw,1.06rem)] leading-[1.8] text-white/70 font-body">
            Κατασκευή και προώθηση ιστοσελίδων για μικρές επιχειρήσεις στη Θράκη.{' '}
            <span className="font-semibold text-white">
              Μιλάτε απευθείας με τους ανθρώπους που θα σχεδιάσουν και θα χτίσουν
              τη δική σας.
            </span>{' '}
            Χωρίς μεσάζοντες και χωρίς πακέτα που δεν καταλαβαίνετε τι
            περιλαμβάνουν.
          </p>

          <div className="mt-12 flex w-full flex-col items-center gap-5 sm:w-auto md:mt-14">
            <a
              href="/request-a-quote"
              className="btn-accent w-full justify-center px-6 py-4 text-center text-[0.95rem] sm:w-auto sm:px-9"
            >
              Ζητήστε γραπτή προσφορά <span aria-hidden>→</span>
            </a>

            <a
              href="/how-it-works"
              className="group link-arrow text-[0.88rem] font-bold text-white/60 transition-colors duration-200 hover:text-white font-body"
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

        {/* Layers 1 and 4 — the mountain, then the showcase over it.

            The ridge is anchored to the carousel rather than to the section,
            and its height is derived from the viewport WIDTH. Both matter. A
            percentage of the section height gave the svg a box far taller than
            its own 3.43:1 viewBox, and `slice` then zoomed the drawing until
            only one stray segment of ridge was left on screen.

            `43vw` is not arbitrary: it is exactly 1/2.32, the artwork's own
            aspect, so at desktop widths `slice` scales the drawing without
            cropping it at all. The 280px floor makes the box proportionally
            taller on a phone, which crops inward to the summit — a natural
            crop rather than a squashed mountain. The 760px ceiling stops it
            growing without limit on an ultrawide display.

            The lift is what creates the composition: the peak clears the card
            by roughly 300px on desktop, while the card covers the mountain's
            base. That overlap is where the depth comes from.

            `w-screen` + centring breaks it out of the max-w-6xl column to full
            bleed; the section's `overflow-hidden` clips it. */}
        <div className="relative mt-14 md:mt-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-[max(140px,min(27vw,480px))] left-1/2 -z-10 h-[max(280px,min(43vw,760px))] w-screen -translate-x-1/2 text-warm"
          >
            <MountSaos className="h-full w-full" />
          </div>

          <Carousel
            label="Δείγματα σχεδιασμού"
            onDark
            loop
            arrowPlacement="overlay"
            showCounter
            align="start"
            autoAdvanceMs={5000}
            slideClassName="w-full"
            slides={featured.map((project, i) => (
              <HeroShowcaseCard
                key={project.slug}
                project={project}
                priority={i === 0}
              />
            ))}
          />
        </div>
      </div>
    </section>
  )
}
