import { useEffect, useState } from 'react'

const links = [
  { label: 'Έργα', href: '#work' },
  { label: 'Υπηρεσίες', href: '#services' },
  { label: 'Προσέγγιση', href: '#approach' },
  { label: 'Τιμές', href: '#pricing' },
  { label: 'Επικοινωνία', href: '#contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] grid grid-cols-3 items-center transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-border py-3.5 px-5 md:px-12'
          : 'py-6 px-5 md:px-12'
      }`}
    >
      {/* Left — logo */}
      <a href="#" className="relative z-10 justify-self-start flex items-center" aria-label="saos.studio — Home">
        <img
          src="/logos/logo-dark.png"
          alt="saos.studio"
          className={`w-auto transition-all duration-300 ${scrolled ? 'h-5' : 'h-6'}`}
        />
      </a>

      {/* Center — nav links */}
      <ul className="hidden md:flex items-center justify-center gap-9">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="group relative text-[0.78rem] tracking-[0.02em] font-semibold text-muted transition-colors duration-200 hover:text-ink font-body"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-ink transition-all duration-300 group-hover:w-full" />
            </a>
          </li>
        ))}
      </ul>

      {/* Right — CTA (desktop) / hamburger (mobile) */}
      <div className="col-start-3 justify-self-end flex items-center">
        <a
          href="https://calendly.com/tambakisgiannis/refloow-labs-discovery-call"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex btn-primary px-6 py-2.5 text-[0.75rem]"
        >
          Κλείστε Κλήση
        </a>

        <button
          className="md:hidden relative z-10 -mr-2 flex h-10 w-10 items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 right-0 h-[2px] bg-ink transition-all duration-300 ${
                mobileOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-[5px]'
              }`}
            />
            <span
              className={`absolute left-0 right-0 h-[2px] bg-ink transition-all duration-300 ${
                mobileOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-[5px]'
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-border py-8 px-6 md:hidden">
          <ul className="flex flex-col gap-5">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-[0.95rem] font-bold text-ink font-body"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-6 border-t border-border">
            <a
              href="https://calendly.com/tambakisgiannis/refloow-labs-discovery-call"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-6 py-3 text-[0.8rem]"
              onClick={() => setMobileOpen(false)}
            >
              Κλείστε Κλήση →
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
