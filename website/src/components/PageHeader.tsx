import type { ReactNode } from 'react'
import Doodle from './Doodle'

interface Props {
  /** Small uppercase label above the title. */
  eyebrow: string
  /** The page's `h1`. Every route has exactly one. */
  title: ReactNode
  lead?: ReactNode
  doodle?: 'burst' | 'underline' | 'arrow' | 'sparkle' | 'circle' | 'squiggle'
  children?: ReactNode
}

/**
 * The opening block of a subpage.
 *
 * Distinct from `SectionOpener`, which is a *section* opener: that one renders an
 * oversized banner word plus an `h2` and is used repeatedly down a page. This
 * renders the page's single `h1` and appears once, at the top. Using
 * `SectionOpener` here would have given each page a banner word where its title
 * should be, and no `h1` at all.
 *
 * Sits inside a `Chapter` with extra top padding, since the fixed nav overlaps
 * the first screen.
 */
export default function PageHeader({ eyebrow, title, lead, doodle, children }: Props) {
  return (
    <div className="relative">
      {doodle && (
        <Doodle
          variant={doodle}
          strokeWidth={doodle === 'underline' || doodle === 'squiggle' ? 4 : 3}
          className="absolute -top-8 -left-10 hidden h-20 w-20 -rotate-12 opacity-90 lg:block"
        />
      )}

      <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-muted font-body">
        {eyebrow}
      </p>

      <h1 className="mt-5 text-headline text-[clamp(2.1rem,5.2vw,3.6rem)] max-w-[20ch]">
        {title}
      </h1>

      {lead && (
        <p className="mt-6 max-w-[58ch] text-[clamp(1rem,1.3vw,1.1rem)] leading-[1.75] text-muted font-body">
          {lead}
        </p>
      )}

      {children}
    </div>
  )
}
