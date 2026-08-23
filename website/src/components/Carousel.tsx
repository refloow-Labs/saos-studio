import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  /** Names the carousel for assistive tech, e.g. "Έργα μας". */
  label: string
  /** One entry per slide. */
  slides: ReactNode[]
  /** Width utilities applied to each slide (responsive basis). */
  slideClassName?: string
  /** Milliseconds between automatic advances. Omit to disable auto-play. */
  autoAdvanceMs?: number
  /**
   * `center` keeps the current slide in the middle of the track and pads the
   * ends so the first and last can reach it. `start` left-aligns.
   */
  align?: 'start' | 'center'
  /** Scales the current slide up slightly and dims the rest. */
  emphasizeActive?: boolean
  onDark?: boolean
  className?: string
  /**
   * Wrap around at both ends instead of stopping. The arrows stay enabled and
   * advancing past the last slide returns to the first.
   *
   * This is wrap-around, **not** seamless infinite translation — going from the
   * last slide to the first scrolls back across the track. Real infinite motion
   * needs cloned slides, which would fight the bounding-rect measuring below.
   * The auto-advance has always wrapped this way, so the arrows now simply
   * agree with it.
   */
  loop?: boolean
  /**
   * `below` keeps the arrows in the control row under the track. `overlay`
   * floats them over the track's left and right edges, vertically centred —
   * for a single large slide, where a control row reads as detached.
   */
  arrowPlacement?: 'below' | 'overlay'
  /** Shows a «3 / 5» counter beside the dots. */
  showCounter?: boolean
}

/**
 * A carousel built on native scroll-snap rather than a library.
 *
 * The scroll container does the actual work — that is what gives touch swipe,
 * trackpad gestures and momentum for free, and it degrades to a plain
 * horizontally scrollable list if JS never runs. The arrows and dots drive it
 * with `scrollTo`; they are controls over a scroller, not a state machine that
 * happens to render transforms.
 *
 * Accessibility follows the APG carousel pattern: a labelled region with
 * `aria-roledescription="carousel"`, each slide a labelled group, arrows and
 * dots as real buttons, and auto-play that stops on hover, on focus, when the
 * tab is hidden, and for anyone who has asked for reduced motion.
 */
export default function Carousel({
  label,
  slides,
  slideClassName = 'w-[85%] sm:w-[46%] lg:w-[31%]',
  autoAdvanceMs,
  align = 'start',
  emphasizeActive = false,
  onDark = false,
  className = '',
  loop = false,
  arrowPlacement = 'below',
  showCounter = false,
}: Props) {
  const scrollerRef = useRef<HTMLUListElement>(null)
  const regionId = useId()
  const [active, setActive] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [paused, setPaused] = useState(false)
  /** Side padding that lets the first and last slide reach the centre. */
  const [edgePad, setEdgePad] = useState(0)

  const measure = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const items = Array.from(el.children) as HTMLElement[]
    if (!items.length) return

    /* Measured from bounding rects rather than offsetLeft: offsetLeft is
       relative to the nearest positioned ancestor, which is not necessarily
       this scroller, and the centre padding below shifts that origin anyway. */
    const box = el.getBoundingClientRect()
    const anchor = align === 'center' ? box.left + box.width / 2 : box.left

    let nearest = 0
    let best = Infinity
    items.forEach((item, i) => {
      const r = item.getBoundingClientRect()
      const point = align === 'center' ? r.left + r.width / 2 : r.left
      const distance = Math.abs(point - anchor)
      if (distance < best) {
        best = distance
        nearest = i
      }
    })

    setActive(nearest)
    setAtStart(el.scrollLeft <= 2)
    // 2px slack: fractional layout widths mean scrollLeft rarely lands exactly.
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2)

    if (align === 'center') {
      // getBoundingClientRect excludes margin, so this stays stable once set.
      const slide = items[0].getBoundingClientRect().width
      const next = Math.max(0, (box.width - slide) / 2)
      setEdgePad((prev) => (Math.abs(prev - next) > 1 ? next : prev))
    }
  }, [align])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    measure()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [measure])

  /* The first measure runs before the centring margins exist, so it picks the
     slide nearest the middle of an un-padded track — index 1 rather than 0.
     Re-measure once the margin lands. `measure` only writes edgePad when it
     moves by more than a pixel, so this settles instead of looping. */
  useEffect(() => {
    if (align === 'center') measure()
  }, [edgePad, align, measure])

  const goTo = useCallback(
    (index: number) => {
      const el = scrollerRef.current
      if (!el) return
      const items = Array.from(el.children) as HTMLElement[]
      if (!items.length) return
      // Modulo twice so a -1 from the prev arrow lands on the last slide rather
      // than going negative.
      const resolved = loop
        ? ((index % items.length) + items.length) % items.length
        : Math.max(0, Math.min(index, items.length - 1))
      const target = items[resolved]
      if (!target) return

      const box = el.getBoundingClientRect()
      const r = target.getBoundingClientRect()
      const delta =
        align === 'center'
          ? r.left + r.width / 2 - (box.left + box.width / 2)
          : r.left - box.left

      el.scrollTo({ left: el.scrollLeft + delta, behavior: 'smooth' })
    },
    [align, loop],
  )

  // Auto-advance. Wraps back to the start once the last slide is fully in view.
  useEffect(() => {
    if (!autoAdvanceMs || paused) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = window.setInterval(() => {
      if (document.hidden) return
      const el = scrollerRef.current
      if (!el) return
      const done = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2
      goTo(done ? 0 : active + 1)
    }, autoAdvanceMs)

    return () => window.clearInterval(id)
  }, [autoAdvanceMs, paused, active, goTo])

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goTo(active + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goTo(active - 1)
    }
  }

  const overlay = arrowPlacement === 'overlay'

  const arrowBase = `inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
    overlay
      ? // Floated over the track, so it needs its own ground to stay legible
        // against whatever screenshot happens to sit behind it.
        onDark
        ? 'border-white/20 bg-break/70 text-white backdrop-blur-md hover:enabled:bg-break/90'
        : 'border-border bg-bg/80 text-ink backdrop-blur-md hover:enabled:bg-bg'
      : onDark
        ? 'border-white/20 text-white hover:enabled:bg-white/10'
        : 'border-border text-ink hover:enabled:bg-surface'
  }`

  // With `loop` the ends are reachable in both directions, so the arrows never
  // go dead.
  const prevDisabled = loop ? false : atStart
  const nextDisabled = loop ? false : atEnd

  const prevButton = (
    <button
      type="button"
      onClick={() => goTo(active - 1)}
      disabled={prevDisabled}
      aria-controls={regionId}
      aria-label="Προηγούμενο"
      className={arrowBase}
    >
      <ChevronLeft aria-hidden className="h-5 w-5" />
    </button>
  )

  const nextButton = (
    <button
      type="button"
      onClick={() => goTo(active + 1)}
      disabled={nextDisabled}
      aria-controls={regionId}
      aria-label="Επόμενο"
      className={arrowBase}
    >
      <ChevronRight aria-hidden className="h-5 w-5" />
    </button>
  )

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className={`relative ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative">
        {overlay && (
          <>
            <div className="absolute left-2 top-1/2 z-10 -translate-y-1/2 md:left-4">
              {prevButton}
            </div>
            <div className="absolute right-2 top-1/2 z-10 -translate-y-1/2 md:right-4">
              {nextButton}
            </div>
          </>
        )}

        <ul
          ref={scrollerRef}
          id={regionId}
          tabIndex={0}
          onKeyDown={onKeyDown}
          aria-label={`${label} — χρησιμοποιήστε τα βελάκια για πλοήγηση`}
          className="no-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth py-4"
        >
          {slides.map((slide, i) => (
            <li
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} από ${slides.length}`}
              data-current={i === active}
              style={
                align === 'center'
                  ? {
                      marginLeft: i === 0 ? edgePad : undefined,
                      marginRight: i === slides.length - 1 ? edgePad : undefined,
                    }
                  : undefined
              }
              className={`shrink-0 transition-[transform,opacity] duration-500 ease-out ${
                align === 'center' ? 'snap-center' : 'snap-start'
              } ${
                emphasizeActive && i !== active
                  ? 'scale-[0.93] opacity-60'
                  : 'scale-100 opacity-100'
              } ${slideClassName}`}
            >
              {slide}
            </li>
          ))}
        </ul>
      </div>

      <div
        className={`mt-7 flex items-center gap-6 ${
          overlay ? 'justify-center' : 'justify-between'
        }`}
      >
        {!overlay && (
          <div className="flex items-center gap-3">
            {prevButton}
            {nextButton}
          </div>
        )}

        {showCounter && (
          <p
            aria-hidden
            className={`text-[0.78rem] font-bold tabular-nums font-body ${
              onDark ? 'text-white/60' : 'text-muted'
            }`}
          >
            {active + 1} / {slides.length}
          </p>
        )}

        <ol
          className={`flex flex-wrap items-center gap-2 ${
            overlay ? 'justify-center' : 'justify-end'
          }`}
        >
          {slides.map((_, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-controls={regionId}
                aria-current={i === active}
                aria-label={`Μετάβαση στο ${i + 1} από ${slides.length}`}
                className={`block h-2 rounded-full transition-all duration-300 ${
                  i === active
                    ? 'w-7 bg-warm'
                    : onDark
                      ? 'w-2 bg-white/25 hover:bg-white/50'
                      : 'w-2 bg-ink/20 hover:bg-ink/40'
                }`}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
