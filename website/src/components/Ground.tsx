import { SWEEPS, SWEEP_VIEWBOX } from '../lib/sweeps'

interface Props {
  /**
   * Stable placement key. The same string always produces the same sweeps.
   *
   * This is load-bearing, not a convenience: `src/main.tsx` uses `hydrateRoot`,
   * so anything random at render time would differ between the prerendered HTML
   * and the client pass and blow up as a hydration mismatch. Placement is
   * therefore hashed from the section id rather than drawn from `Math.random`.
   */
  seed: string
  /**
   * `single` is safe under any content. `double` overlaps two sweeps, which
   * multiplies to roughly #FAC97D and drops muted text to 3.9:1 -- under AA.
   * Only use it on sections whose text is all `ink`: a headline and a button.
   */
  density?: 'single' | 'double'
  className?: string
}

/** FNV-1a. Small, stable, and not seeded by anything environmental. */
function hash(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Pulls successive small integers out of one hash without another pass. */
function pick(h: number, shift: number, range: number): number {
  return ((h >>> shift) & 0xff) % range
}

interface Placement {
  path: string
  top: number
  left: number
  width: number
  height: number
  flip: boolean
}

function place(seed: string, density: 'single' | 'double'): Placement[] {
  const h = hash(seed)
  const out: Placement[] = [
    {
      path: SWEEPS[pick(h, 0, SWEEPS.length)],
      top: 6 + pick(h, 4, 14),
      left: -8 + pick(h, 8, 12),
      width: 78 + pick(h, 12, 26),
      height: 26 + pick(h, 16, 14),
      flip: pick(h, 20, 2) === 1,
    },
  ]
  if (density === 'double') {
    out.push({
      // +1 so the second stroke is never the same outline as the first.
      path: SWEEPS[(pick(h, 0, SWEEPS.length) + 1) % SWEEPS.length],
      top: 48 + pick(h, 6, 20),
      left: 4 + pick(h, 10, 24),
      width: 62 + pick(h, 14, 30),
      height: 22 + pick(h, 18, 12),
      flip: pick(h, 22, 2) === 1,
    })
  }
  return out
}

/**
 * Highlighter sweeps behind a section.
 *
 * Broad amber marker strokes with ragged edges, the same gesture as the
 * emphasis underline but at page scale, so the ground and the typography are
 * one idea rather than two.
 *
 * Three things make this cheap enough to sit on every section:
 *
 * - The ragged edge is baked. It comes out of `scripts/generate-sweeps.mjs` as
 *   plain path data, not an `feTurbulence` filter. A full-viewport SVG filter
 *   rasterises at render size and is genuinely slow on low-end Android.
 * - `mix-blend-mode: multiply` gives the overlap darkening a real marker has,
 *   for free, instead of hand-picking a third colour for the crossing.
 * - Nothing animates, so there is no `prefers-reduced-motion` branch to get
 *   wrong and nothing repaints on scroll.
 *
 * `preserveAspectRatio="none"` stretches each stroke to its box. The edge noise
 * is low frequency enough that this reads as a wider or narrower marker rather
 * than as a distorted image.
 */
export default function Ground({ seed, density = 'single', className = '' }: Props) {
  const sweeps = place(seed, density)
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {sweeps.map((s, i) => (
        <svg
          key={i}
          viewBox={SWEEP_VIEWBOX}
          preserveAspectRatio="none"
          className="absolute text-warm mix-blend-multiply"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.width}%`,
            height: `${s.height}%`,
            transform: s.flip ? 'scaleX(-1)' : undefined,
          }}
        >
          <path d={s.path} fill="currentColor" fillOpacity={0.34} />
        </svg>
      ))}
    </div>
  )
}
