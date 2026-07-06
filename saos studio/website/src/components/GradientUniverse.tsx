import { useEffect, useRef } from 'react'
import { useScrollStore } from '../store/scrollStore'

/**
 * Scroll-reactive animated gradient. Three layered radial gradients drift
 * continuously while their colours interpolate across five palettes tied to
 * the user's scroll progress. A grain texture sits inside the layer so the
 * gradient reads like a material, not a flat fill.
 *
 * All animation runs against CSS custom properties via rAF — no React
 * re-renders, no WebGL, no postprocessing. Lightweight and 60fps everywhere.
 */

type RGB = [number, number, number]
type Palette = { c1: RGB; c2: RGB; c3: RGB; tint: RGB }

const PALETTES: Palette[] = [
  // 0 — Hero · cool soft blue
  {
    c1: [158, 192, 216],
    c2: [60, 92, 130],
    c3: [10, 18, 32],
    tint: [232, 230, 225],
  },
  // 1 — Manifesto · cooler glass
  {
    c1: [184, 210, 230],
    c2: [40, 78, 120],
    c3: [6, 12, 24],
    tint: [220, 232, 244],
  },
  // 2 — Services · deeper steel
  {
    c1: [120, 158, 188],
    c2: [22, 44, 70],
    c3: [4, 8, 14],
    tint: [200, 212, 220],
  },
  // 3 — Practice · ink + ember edge
  {
    c1: [70, 90, 116],
    c2: [22, 22, 26],
    c3: [3, 4, 8],
    tint: [180, 175, 165],
  },
  // 4 — Invitation · warm reformed
  {
    c1: [245, 212, 168],
    c2: [128, 76, 48],
    c3: [16, 10, 8],
    tint: [248, 232, 210],
  },
]

const lerpRGB = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
]

const rgb = (c: RGB) => `rgb(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0})`
const rgba = (c: RGB, a: number) =>
  `rgba(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0}, ${a})`

function paletteAt(progress: number): Palette {
  const segments = PALETTES.length - 1
  const scaled = Math.max(0, Math.min(0.9999, progress)) * segments
  const i = Math.floor(scaled)
  const t = scaled - i
  // Smoothstep for gentler transitions between palettes
  const ts = t * t * (3 - 2 * t)
  const a = PALETTES[i]
  const b = PALETTES[i + 1] ?? PALETTES[i]
  return {
    c1: lerpRGB(a.c1, b.c1, ts),
    c2: lerpRGB(a.c2, b.c2, ts),
    c3: lerpRGB(a.c3, b.c3, ts),
    tint: lerpRGB(a.tint, b.tint, ts),
  }
}

const GRAIN_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 320'>
    <filter id='g'>
      <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch' seed='7'/>
      <feColorMatrix values='0 0 0 0 1
                             0 0 0 0 1
                             0 0 0 0 1
                             0 0 0 0.55 0'/>
    </filter>
    <rect width='100%' height='100%' filter='url(#g)'/>
  </svg>`,
)}`

export default function GradientUniverse() {
  const rootRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<number>(performance.now())

  useEffect(() => {
    let raf = 0
    const tick = (time: number) => {
      const el = rootRef.current
      if (el) {
        const progress = useScrollStore.getState().progress
        const pointerX = useScrollStore.getState().pointerX
        const pointerY = useScrollStore.getState().pointerY
        const t = (time - startRef.current) / 1000

        const p = paletteAt(progress)

        // Continuous drift for each gradient blob
        // Each one moves on its own slow orbit — independent frequencies keep
        // the composition from looping perceptibly.
        const x1 = 30 + Math.sin(t * 0.07) * 18 + pointerX * 4
        const y1 = 28 + Math.cos(t * 0.05) * 14 + pointerY * 3
        const x2 = 70 + Math.sin(t * 0.06 + 1.7) * 16 - pointerX * 5
        const y2 = 72 + Math.cos(t * 0.08 + 0.9) * 12 - pointerY * 4
        const x3 = 50 + Math.sin(t * 0.04 + 3.1) * 22
        const y3 = 50 + Math.cos(t * 0.03 + 2.2) * 18

        // The vertical drift adds to "descent" feeling as you scroll
        const drift = progress * 12

        el.style.setProperty('--g-x1', `${x1}%`)
        el.style.setProperty('--g-y1', `${y1 + drift}%`)
        el.style.setProperty('--g-x2', `${x2}%`)
        el.style.setProperty('--g-y2', `${y2 - drift * 0.6}%`)
        el.style.setProperty('--g-x3', `${x3}%`)
        el.style.setProperty('--g-y3', `${y3}%`)

        el.style.setProperty('--g-c1', rgba(p.c1, 0.32))
        el.style.setProperty('--g-c2', rgba(p.c2, 0.30))
        el.style.setProperty('--g-c3', rgba(p.c3, 0.85))
        el.style.setProperty('--g-tint', rgb(p.tint))

        // Vignette intensity grows in the ink chapter
        const vignette = 0.35 + Math.abs(progress - 0.65) * 0.4
        el.style.setProperty('--g-vignette', String(vignette))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Pointer parallax (skipped on touch via the (pointer:fine) media query in CSS)
  useEffect(() => {
    const setPointer = useScrollStore.getState().setPointer
    if (!window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      setPointer(x, y)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{
        // Initial values so first paint isn't a flash of unstyled content
        ['--g-x1' as string]: '30%',
        ['--g-y1' as string]: '28%',
        ['--g-x2' as string]: '70%',
        ['--g-y2' as string]: '72%',
        ['--g-x3' as string]: '50%',
        ['--g-y3' as string]: '50%',
        ['--g-c1' as string]: 'rgba(158,192,216,0.6)',
        ['--g-c2' as string]: 'rgba(60,92,130,0.45)',
        ['--g-c3' as string]: 'rgba(10,18,32,0.85)',
        ['--g-vignette' as string]: '0.4',
      }}
    >
      {/* Base color (deep) */}
      <div className="absolute inset-0" style={{ background: '#050505' }} />

      {/* Three drifting radial gradients, layered */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at var(--g-x1) var(--g-y1), var(--g-c1) 0%, transparent 60%),' +
            'radial-gradient(ellipse 60% 70% at var(--g-x2) var(--g-y2), var(--g-c2) 0%, transparent 65%),' +
            'radial-gradient(ellipse 110% 90% at var(--g-x3) var(--g-y3), var(--g-c3) 0%, transparent 70%)',
          transition: 'background-color 1s linear',
          willChange: 'background',
        }}
      />

      {/* Subtle saturated highlight — kept restrained so it never outshines content */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-screen"
        style={{
          background:
            'radial-gradient(ellipse 35% 30% at var(--g-x1) var(--g-y1), var(--g-c1) 0%, transparent 75%)',
          filter: 'blur(50px)',
          willChange: 'background, transform',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 65% at 50% 50%, transparent 40%, rgba(0,0,0,calc(var(--g-vignette) * 1)) 100%)',
        }}
      />

      {/* Material grain — gives the gradient surface tooth */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-[0.18]"
        style={{
          backgroundImage: `url("${GRAIN_SVG}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '320px 320px',
        }}
      />

      {/* Second, finer grain pass for richness */}
      <div
        className="absolute inset-0 mix-blend-soft-light opacity-[0.32]"
        style={{
          backgroundImage: `url("${GRAIN_SVG}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
        }}
      />
    </div>
  )
}
