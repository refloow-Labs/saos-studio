import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Element to render. Use `li`, `section` etc. where the outline needs it. */
  as?: ElementType
  /** Stagger, in ms, for items revealed as a group. */
  delay?: number
  className?: string
}

/**
 * Fades content up as it scrolls into view.
 *
 * The site is prerendered, so the default state has to be *visible*: the static
 * HTML carries no `data-reveal` attribute at all, and only gains one once this
 * component has mounted in a browser that supports IntersectionObserver. A
 * reader with JS disabled, or a crawler that does not execute our bundle, sees
 * ordinary content rather than a page of invisible divs.
 *
 * One observer per element, disconnected after it fires — reveals never replay,
 * so scrolling back up does not re-animate the page.
 */
export default function Reveal({ children, as, delay = 0, className = '' }: Props) {
  const Tag = (as ?? 'div') as ElementType
  const ref = useRef<HTMLElement>(null)
  const [state, setState] = useState<'hidden' | 'shown' | null>(null)

  useEffect(() => {
    // Bail out to plain visible content where the API is unavailable.
    if (typeof IntersectionObserver === 'undefined') return

    const el = ref.current
    if (!el) return

    setState('hidden')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        window.setTimeout(() => setState('shown'), delay)
      },
      // Fires a little before the element reaches the viewport edge, so the
      // animation is already underway by the time it is properly in view.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <Tag ref={ref} data-reveal={state ?? undefined} className={className}>
      {children}
    </Tag>
  )
}
