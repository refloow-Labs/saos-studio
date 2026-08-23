import SectionHeading from './SectionHeading'
import Carousel from './Carousel'
import Reveal from './Reveal'
import { projects, type Project } from '../lib/projects'

/**
 * The homepage work teaser.
 *
 * A static grid rather than a carousel, and three cards rather than five. Two
 * reasons. The hero already carries a carousel of these same demos, so a second
 * one further down read as the same component twice; and a teaser whose job is
 * to send people to /examples does not need interaction of its own — everything
 * it shows should be visible at once.
 *
 * Every card links to /examples rather than opening a preview. The preview
 * dialog still exists, on /examples, where a visitor has arrived to browse.
 * Here the single destination keeps the section to one outcome.
 *
 * Ground stays dark: switching it to light would sit it directly against the
 * white reviews section below with nothing separating the two.
 */

/**
 * The five featured samples, ordered so the first cards shown span distinct
 * industries.
 *
 * Not cosmetic. Three of the five featured projects are «Εστίαση», so in
 * declaration order the two cards visible on load would both have been
 * restaurants while the subtitle promised a range. Leading with one project per
 * category puts that range on screen before anyone touches an arrow, and the
 * remainder follow behind it.
 */
function ordered(): Project[] {
  const seen = new Set<string>()
  const lead: Project[] = []
  const rest: Project[] = []
  for (const p of projects.filter((p) => p.featured)) {
    if (seen.has(p.category)) rest.push(p)
    else {
      seen.add(p.category)
      lead.push(p)
    }
  }
  return [...lead, ...rest]
}

export default function Portfolio() {
  const shown = ordered()

  return (
    <div className="w-full">
      {/*
        `SectionHeading`, not `SectionOpener`. The oversized ΕΡΓΑ banner word and
        its doodle were the section's third and fourth text blocks before a
        visitor reached a single preview, and the work is what this section is
        for. The banner device is not lost — it still opens «Τι λένε για εμάς»
        and «Συχνές ερωτήσεις», which is what keeps it reading as deliberate.
      */}
      <SectionHeading align="center" body="Από την εστίαση και τη φιλοξενία μέχρι την υγεία.">
        Δείγματα <em>σχεδιασμού</em>
      </SectionHeading>

      {/*
        Two cards at a time from `md` up, one below it. The width is
        `calc(50% - 0.625rem)` because the track's `gap-5` is 1.25rem: half the
        gap has to come off each slide or the second card is pushed out of view
        and the pair never sits flush.

        No `autoAdvanceMs`, so nothing moves on its own — navigation is manual
        by design. `loop` keeps both arrows live at the ends; `showCounter`
        makes it explicit that more samples exist than the two on screen.
        Dragging, swiping and momentum come free from the underlying scroll
        container, and the arrow keys work whenever the track has focus.
      */}
      <Carousel
        label="Δείγματα σχεδιασμού"
        onDark
        loop
        showCounter
        align="start"
        slideClassName="w-full md:w-[calc(50%-0.625rem)]"
        className="mt-14 md:mt-16"
        slides={shown.map((project) => (
          <a key={project.slug} href="/examples" className="group block">
            <div className="overflow-hidden rounded-card bg-white ring-1 ring-white/10 transition-all duration-300 group-hover:ring-white/30">
              <picture>
                <source srcSet={`/work/${project.slug}/thumb.webp`} type="image/webp" />
                <img
                  src={`/work/${project.slug}/thumb.jpg`}
                  alt={`Δείγμα σχεδιασμού ιστοσελίδας: ${project.name}, ${project.category}`}
                  width={1000}
                  height={625}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </picture>
            </div>

            {/* Names are rendered as authored, never uppercased. Greek drops
                the tonos in all-caps, so «Γη & Ύδωρ» would ship as «ΓΗ & ΥΔΩΡ». */}
            <h3 className="mt-5 text-center text-[1.02rem] font-extrabold leading-tight text-white">
              {project.name}
            </h3>
            <span className="mt-1.5 block text-center text-[0.8rem] font-semibold text-warm transition-opacity duration-200 group-hover:opacity-80 font-body">
              {project.category}
            </span>
          </a>
        ))}
      />

      <Reveal className="mt-14 flex justify-center">
        <a href="/examples" className="btn-on-dark px-8 py-3.5 text-[0.85rem]">
          Δείτε όλα τα δείγματα <span aria-hidden>→</span>
        </a>
      </Reveal>

      {/*
        Required disclosure — the businesses in public/work/ are invented, and
        the section may never imply otherwise (see the note atop lib/projects.ts).
        It sits below the CTA rather than above the grid: it is a footnote about
        the work, not an introduction to it, and two lines of caveat were the
        last thing standing between the heading and the previews. The full
        disclosure remains on /examples.
      */}
      <p className="mx-auto mt-10 max-w-[56ch] text-center text-[0.76rem] leading-[1.7] text-white/40 font-body">
        Δείγματα σχεδιασμού — οι επιχειρήσεις που εμφανίζονται σε αυτά είναι φανταστικές.
      </p>
    </div>
  )
}
