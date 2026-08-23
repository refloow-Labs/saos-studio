import { ReactNode } from 'react'
import Doodle from './Doodle'

interface Props {
  /**
   * The huge banner word that opens the section ("ΕΡΓΑ", "ΤΙΜΕΣ"). Author it
   * already uppercase and without tonos — Greek drops accents in all-caps, and
   * doing that in the markup is safer than trusting `text-transform` to apply
   * the locale's casing rules.
   */
  word: string
  /** The descriptive sentence. This is the real `h2` — the banner word is not. */
  heading: ReactNode
  body?: ReactNode
  align?: 'center' | 'left'
  /** Adds a hand-drawn mark beside the banner word. */
  doodle?: 'burst' | 'underline' | 'arrow' | 'sparkle' | 'circle' | 'squiggle'
  className?: string
}

/**
 * The section opener used across the homepage: an oversized banner word, a
 * descriptive heading under it, optional body copy, optional doodle.
 *
 * Deliberately *not* one merged heading. The banner word is a `div` and the
 * sentence is the `h2`, so the document outline still reads as descriptive
 * headings ("Δουλειές που μιλάνε μόνες τους.") rather than a stack of one-word
 * labels — the banner is doing visual work, not structural work.
 */
export default function SectionOpener({
  word,
  heading,
  body,
  align = 'center',
  doodle,
  className = '',
}: Props) {
  const centered = align === 'center'
  return (
    <div
      className={`relative ${centered ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'} ${className}`}
    >
      {doodle && (
        <Doodle
          variant={doodle}
          strokeWidth={doodle === 'underline' || doodle === 'squiggle' ? 4 : 3}
          className={
            centered
              ? 'absolute -top-10 left-1/2 -translate-x-[10.5rem] w-20 h-20 hidden sm:block opacity-90 -rotate-12'
              : 'absolute -top-8 -left-14 w-20 h-20 hidden lg:block opacity-90 -rotate-12'
          }
        />
      )}

      <div className="text-display text-[clamp(2.6rem,7.5vw,5.5rem)]">{word}</div>

      <h2
        className={`text-headline text-[clamp(1.35rem,2.6vw,2.1rem)] mt-4 ${
          centered ? 'mx-auto max-w-[24ch]' : ''
        }`}
      >
        {heading}
      </h2>

      {body && (
        <p
          className={`mt-5 text-[0.98rem] leading-[1.75] font-body opacity-70 ${
            centered ? 'mx-auto max-w-[52ch]' : 'max-w-[52ch]'
          }`}
        >
          {body}
        </p>
      )}
    </div>
  )
}
