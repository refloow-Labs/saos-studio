/**
 * Hand-drawn accent marks.
 *
 * The reference site (thefreewebsiteguys.com) breaks up its very flat, very
 * geometric sections with loose marker doodles — a scribbled burst behind a
 * card, a swoosh under a word. They do the work of stopping the page reading
 * as a template without adding another typeface or another colour.
 *
 * Inline SVG rather than image files on purpose: no extra requests, no CSP
 * exception, and they inherit `text-warm` so the whole set re-tints from one
 * token in tailwind.config.js.
 *
 * Every mark is decorative — `aria-hidden` throughout, never load-bearing for
 * meaning. Paths are deliberately irregular (uneven stroke lengths, curves that
 * do not close) so they read as drawn rather than plotted.
 */

import type { ReactElement } from 'react'

type Variant = 'burst' | 'underline' | 'arrow' | 'sparkle' | 'circle' | 'squiggle'

interface Props {
  variant: Variant
  className?: string
  /** Stroke weight. Bigger marks want a heavier stroke to stay legible. */
  strokeWidth?: number
}

const paths: Record<Variant, { box: string; render: (w: number) => ReactElement }> = {
  /* Radiating petal/leaf cluster — the mark behind the first card in the
     reference's examples section. */
  burst: {
    box: '0 0 120 110',
    render: (w) => (
      <g strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M60 96C57 79 55 60 58 41" />
        <path d="M58 41c-7 9-11 22-11 34 8-7 13-19 11-34Z" />
        <path d="M60 62c-10-4-19-13-24-24 12 1 22 10 24 24Z" />
        <path d="M62 60c11-3 21-11 27-21-12-1-24 7-27 21Z" />
        <path d="M61 44c-6-8-9-19-8-30 9 6 12 18 8 30Z" />
        <path d="M64 46c8-6 14-16 16-27-10 3-17 14-16 27Z" />
        <path d="M59 78c-9-2-18-8-24-17 11-2 21 5 24 17Z" />
      </g>
    ),
  },

  /* Loose double swoosh for underlining a word. */
  underline: {
    box: '0 0 200 26',
    render: (w) => (
      <g strokeWidth={w} strokeLinecap="round" fill="none">
        <path d="M6 15c30-7 66-10 101-9 30 1 60 4 88 9" />
        <path d="M20 22c37-5 78-7 118-5" />
      </g>
    ),
  },

  /* Curved arrow, the kind drawn in a margin to point at something. */
  arrow: {
    box: '0 0 110 90',
    render: (w) => (
      <g strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M8 10c26 4 47 17 60 36 6 9 10 20 11 32" />
        <path d="M64 70c6 5 11 8 15 10M79 80c1-7 3-13 6-19" />
      </g>
    ),
  },

  /* Four-point sparkle for punctuating a number or a claim. */
  sparkle: {
    box: '0 0 60 60',
    render: (w) => (
      <g strokeWidth={w} strokeLinecap="round" fill="none">
        <path d="M30 6c1 10 3 17 7 21 4 4 11 6 21 7-10 1-17 3-21 7-4 4-6 11-7 21-1-10-3-17-7-21-4-4-11-6-21-7 10-1 17-3 21-7 4-4 6-11 7-21Z" />
      </g>
    ),
  },

  /* Hand-drawn ellipse, drawn round twice, for circling a price or a word. */
  circle: {
    box: '0 0 220 90',
    render: (w) => (
      <g strokeWidth={w} strokeLinecap="round" fill="none">
        <path d="M112 8C58 6 14 22 11 45c-3 24 40 39 100 37 52-2 96-19 98-40 2-19-32-32-83-34" />
        <path d="M196 15c9 6 14 13 13 21-3 21-46 37-97 39" />
      </g>
    ),
  },

  /* Scribbled zigzag — filler energy under a heading or beside a stat. */
  squiggle: {
    box: '0 0 160 30',
    render: (w) => (
      <g strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M6 20c9-11 18-11 26 0s17 11 26 0 17-11 26 0 17 11 26 0 17-11 26 0" />
      </g>
    ),
  },
}

export default function Doodle({ variant, className = '', strokeWidth = 3 }: Props) {
  const mark = paths[variant]
  return (
    <svg
      viewBox={mark.box}
      className={`pointer-events-none select-none text-warm ${className}`}
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {mark.render(strokeWidth)}
    </svg>
  )
}
