import { ReactNode, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { useScrollStore } from '../store/scrollStore'

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const setProgress = useScrollStore((s) => s.setProgress)

  useEffect(() => {
    // Disable browser scroll restoration so each load starts at the hero
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    if (!window.location.hash) window.scrollTo(0, 0)

    const lenis = new Lenis({
      duration: 0.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      lerp: 0.22,
    })
    lenisRef.current = lenis

    let raf = 0
    const tick = (time: number) => {
      lenis.raf(time)
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      setProgress(p)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const id = anchor.getAttribute('href')
      if (!id || id === '#') return
      const el = document.querySelector(id) as HTMLElement | null
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el, { offset: -80 })
    }
    document.addEventListener('click', onAnchorClick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onAnchorClick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [setProgress])

  return <>{children}</>
}
