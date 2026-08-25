import { useEffect, useRef, useState } from 'react'
import { REVIEWS_PUBLISHED } from '../lib/reviews'

/**
 * Real routes, not homepage anchors.
 *
 * These used to be absolute hashes (`/#services`) because every section lived on
 * the homepage and the nav still had to work from /privacy and /404. Each now
 * has its own prerendered page.
 *
 * «Κριτικές» is absent from the desktop bar for layout reasons — six labels plus
 * the CTA overflows it in Greek — and is currently absent from the mobile panel
 * too, because `/reviews` is unpublished while the testimonials are invented.
 * See REVIEWS_PUBLISHED.
 */
const links = [
  { label: 'Η ιστορία μας', href: '/our-story' },
  { label: 'Υπηρεσίες', href: '/services' },
  { label: 'Πώς λειτουργεί', href: '/how-it-works' },
  { label: 'Έργα', href: '/examples' },
  { label: 'Συχνές ερωτήσεις', href: '/faq' },
]

/** The primary conversion, now a real page rather than a modal trigger. */
const CTA = {
  label: 'Ζητήστε προσφορά',
  href: '/request-a-quote',
}

/** Matches `normalisePath` in App.tsx — trailing slashes must not defeat `aria-current`. */
function isCurrent(href: string, pathname: string): boolean {
  const strip = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p)
  return strip(href) === strip(pathname)
}

interface Props {
  /**
   * Set by pages whose first section is a dark full-bleed hero. The bar is
   * transparent until scrolled, so over a dark ground the default near-black
   * wordmark and links are invisible.
   */
  overDark?: boolean
}

export default function Navigation({ overDark = false }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Empty during SSR, so no link is marked current in the prerendered HTML and
  // the attribute appears on hydration. `aria-current` is an enhancement for
  // screen readers rather than something the markup has to ship with.
  const [pathname, setPathname] = useState('')
  useEffect(() => setPathname(window.location.pathname), [])

  // Observed sentinel rather than a scroll listener. The listener fired on every
  // scroll frame and called setState, re-rendering the nav continuously all the
  // way down a long page; the observer fires twice, at the crossing.
  const sentinelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = sentinelRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Escape closes, focus returns to the button that opened the panel, and Tab is
  // held inside the panel while it is open — otherwise focus walks off into the
  // page behind an overlay the user cannot see.
  useEffect(() => {
    if (!mobileOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (e.key !== 'Tab') return

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button')
      if (!focusables?.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [mobileOpen])

  /*
   * Only while the bar is still transparent AND the mobile panel is shut. Once
   * the bar turns solid white on scroll it must revert to the dark wordmark, and
   * an open mobile panel is a white sheet — leaving the bar transparent above it
   * would hang white markup off nothing.
   *
   * `scrolled` is false during SSR, so the prerendered homepage ships the light
   * treatment, which is the correct first paint over a dark hero. No flash on
   * hydration.
   */
  const light = overDark && !scrolled && !mobileOpen

  return (
    <>
      <a href="#main" className="skip-link font-body">
        Μετάβαση στο περιεχόμενο
      </a>

      {/* Sits 40px down the document, outside the fixed nav so it scrolls away.
          Once it leaves the viewport the nav has been scrolled past. */}
      <div
        ref={sentinelRef}
        aria-hidden
        className="pointer-events-none absolute top-10 left-0 h-px w-px"
      />

      <nav
        aria-label="Κύρια πλοήγηση"
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between gap-6 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-border py-3.5 px-5 sm:px-8 md:px-12'
            : 'py-6 px-5 sm:px-8 md:px-12'
        }`}
      >
        <a
          href="/"
          className="relative z-10 flex flex-shrink-0 items-center"
          aria-label="saos.studio — Αρχική"
        >
          {/* Both variants are the same 1746×228 artwork, so swapping the src
              cannot shift layout. */}
          <img
            src={light ? '/logos/logo-white.png' : '/logos/logo-dark.png'}
            width={1746}
            height={228}
            alt="saos.studio"
            className={`w-auto transition-all duration-300 ${scrolled ? 'h-5' : 'h-6'}`}
          />
        </a>

        <ul className="hidden lg:flex items-center justify-center gap-7 xl:gap-8">
          {links.map((l) => {
            const current = isCurrent(l.href, pathname)
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={current ? 'page' : undefined}
                  className={`group relative whitespace-nowrap text-[0.78rem] tracking-[0.02em] font-semibold transition-colors duration-200 font-body ${
                    light
                      ? current
                        ? 'text-white hover:text-white'
                        : 'text-white/75 hover:text-white'
                      : current
                        ? 'text-ink hover:text-ink'
                        : 'text-muted hover:text-ink'
                  }`}
                >
                  {l.label}
                  <span
                    aria-hidden
                    className={`absolute -bottom-1 left-0 h-[1.5px] bg-warm transition-all duration-300 group-hover:w-full ${
                      current ? 'w-full' : 'w-0'
                    }`}
                  />
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex flex-shrink-0 items-center">
          <a
            href={CTA.href}
            className="hidden lg:inline-flex btn-accent px-6 py-2.5 text-[0.75rem]"
          >
            {CTA.label} <span aria-hidden>→</span>
          </a>

          <button
            ref={toggleRef}
            type="button"
            /* -mr-2.5, not -mr-2. The 44px hit area is required, but it is the
                 24px glyph inside it that the eye aligns to. Pulling the button
                 10px past the padding line lands the glyph's right edge exactly
                 on the padding, level with the logo's left edge; at -8px it sat
                 2px short and the bar read very slightly lopsided. Measured, not
                 assumed. */
            className="lg:hidden relative z-10 -mr-2.5 flex h-11 w-11 items-center justify-center"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <span aria-hidden className="relative block h-4 w-6">
              <span
                className={`absolute left-0 right-0 h-[2px] transition-all duration-300 ${
                  light ? 'bg-white' : 'bg-ink'
                } ${
                  mobileOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-[5px]'
                }`}
              />
              <span
                className={`absolute left-0 right-0 h-[2px] transition-all duration-300 ${
                  light ? 'bg-white' : 'bg-ink'
                } ${
                  mobileOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-[5px]'
                }`}
              />
            </span>
          </button>
        </div>

        {mobileOpen && (
          <div
            id="mobile-menu"
            ref={panelRef}
            className="absolute top-full left-0 right-0 max-h-[calc(100svh-100%)] overflow-y-auto bg-white border-b border-border py-8 px-6 lg:hidden"
          >
            <ul className="flex flex-col gap-5">
              {[
                ...links,
                ...(REVIEWS_PUBLISHED
                  ? [{ label: 'Κριτικές', href: '/reviews' }]
                  : []),
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    aria-current={isCurrent(l.href, pathname) ? 'page' : undefined}
                    className="block text-[1rem] font-bold text-ink font-body aria-[current=page]:text-warm-ink"
                    onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-border">
              <a
                href={CTA.href}
                className="btn-accent px-6 py-3 text-[0.85rem]"
                onClick={() => setMobileOpen(false)}
              >
                {CTA.label} <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
