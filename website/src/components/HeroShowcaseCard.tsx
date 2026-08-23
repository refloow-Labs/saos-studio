import type { Project } from '../lib/projects'

interface Props {
  project: Project
  /**
   * The first slide is the only one worth fetching eagerly — it is the one in
   * view at first paint and a plausible LCP candidate. The rest stay lazy so
   * the hero costs one screenshot, not five.
   */
  priority?: boolean
}

/**
 * One slide of the hero showcase — the large rounded preview under the CTA.
 *
 * Deliberately bare: the screenshot alone, with no caption, no link and no
 * preview dialog. The hero shows *that* the work looks good; «Έργα» further
 * down the page, and `/examples`, are where a visitor reads about it and opens
 * one. Keeping the first screen to a single obvious next step leaves the accent
 * CTA uncontested.
 *
 * The project's name and category still reach assistive tech through the image
 * `alt`, which also keeps the wording in design-sample language — `projects.ts`
 * is emphatic that these are invented businesses, never client work.
 *
 * A fixed `aspect-[16/10]` box means every slide is exactly the same height, so
 * advancing the carousel never shifts layout.
 */
export default function HeroShowcaseCard({ project, priority = false }: Props) {
  const src = project.hasFullCapture ? 'full' : 'thumb'

  return (
    <div className="group relative aspect-[16/10] overflow-hidden rounded-card bg-white ring-1 ring-white/10">
      <picture>
        <source srcSet={`/work/${project.slug}/${src}.webp`} type="image/webp" />
        <img
          src={`/work/${project.slug}/${src}.jpg`}
          alt={`Δείγμα σχεδιασμού: ${project.name} — ${project.category}`}
          width={820}
          height={620}
          decoding="async"
          loading={priority ? 'eager' : 'lazy'}
          /* Lowercase on purpose. React 18 does not recognise the camelCase
             `fetchPriority` prop and drops it with a warning; the spread passes
             the real HTML attribute through. */
          {...(priority ? { fetchpriority: 'high' } : {})}
          className={
            project.hasFullCapture
              ? 'demo-scroll absolute inset-x-0 top-0 h-auto w-full'
              : 'h-full w-full object-cover object-top'
          }
        />
      </picture>

      {/* Lands the bright screenshot back into the dark hero instead of ending
          on a hard edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-break/80 to-transparent"
      />
    </div>
  )
}
