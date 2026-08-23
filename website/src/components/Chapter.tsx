import { ReactNode } from 'react'
import Ground from './Ground'

interface Props {
  id: string
  children: ReactNode
  className?: string
  /**
   * `white` / `gray` are the two light tones the page alternates between.
   * `dark` is a full-bleed colour break — a section that inverts to near-black
   * and runs edge to edge, the device the reference site uses to stop a long
   * light page reading as one undifferentiated scroll. Use it sparingly: the
   * rhythm only works while the breaks stay outnumbered by the light sections.
   */
  tone?: 'white' | 'gray' | 'dark' | 'wash'
  /**
   * Highlighter sweeps behind the section. Off by default: the device only
   * reads as deliberate while most sections do without it.
   *
   * `double` overlaps two strokes, which multiplies past the point where muted
   * text still passes AA. Reserve it for sections whose copy is a headline and
   * a button. See Ground.tsx.
   */
  sweep?: boolean | 'double'
}

const tones: Record<NonNullable<Props['tone']>, string> = {
  white: 'bg-bg',
  gray: 'bg-surface',
  // The lightest rung of the ground ladder. Carries running text at 17.5:1,
  // unlike `warm` at full chroma, which cannot.
  wash: 'bg-wash',
  // `on-dark` is the hook the headline styles in index.css key off, so any
  // `.text-headline` inside a break flips to white with a warm emphasis word.
  dark: 'bg-break text-white on-dark',
}

/**
 * A full-bleed content section holding a centered max-width container.
 * Static, generous vertical rhythm.
 */
export default function Chapter({
  id,
  children,
  className = '',
  tone = 'white',
  sweep = false,
}: Props) {
  return (
    <section
      id={id}
      className={`relative w-full ${tones[tone]} px-5 sm:px-8 md:px-12 py-24 md:py-32 ${className}`}
    >
      {/* Sweeps multiply against the section's own ground, so they are skipped
          on `dark`: amber at 34% over near-black is invisible, and lifting the
          opacity to compensate turns the stroke muddy rather than bright. */}
      {sweep && tone !== 'dark' && (
        <Ground seed={id} density={sweep === 'double' ? 'double' : 'single'} />
      )}
      <div className="relative z-10 w-full max-w-6xl mx-auto">{children}</div>
    </section>
  )
}
