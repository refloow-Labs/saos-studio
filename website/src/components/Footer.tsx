import { useConsentStore } from '../lib/consent'
import { REVIEWS_PUBLISHED } from '../lib/reviews'
import { CONTACT_EMAIL } from '../lib/seo'

interface FooterLink {
  label: string
  href?: string
  /**
   * Destination not built yet. Rendered as plain text with a «σύντομα» note
   * rather than a link, so review never hits a 404. Kept for the next unbuilt
   * destination — every entry below now has a real page.
   */
  pending?: boolean
}

const NAV: FooterLink[] = [
  { label: 'Αρχική', href: '/' },
  { label: 'Η ιστορία μας', href: '/our-story' },
  { label: 'Υπηρεσίες', href: '/services' },
  { label: 'Πώς λειτουργεί', href: '/how-it-works' },
  { label: 'Έργα', href: '/examples' },
]

const COMPANY: FooterLink[] = [
  // Omitted while `/reviews` is unpublished — see REVIEWS_PUBLISHED. The route
  // 404s in production, and netlify.toml has no SPA fallback to soften that.
  ...(REVIEWS_PUBLISHED ? [{ label: 'Κριτικές', href: '/reviews' }] : []),
  { label: 'Συχνές ερωτήσεις', href: '/faq' },
  { label: 'Ζητήστε προσφορά', href: '/request-a-quote' },
  { label: 'Δωρεάν website', href: '/#free-website' },
  { label: 'Δωρεάν έλεγχος ταχύτητας', href: '/website-review' },
]

const LEGAL: FooterLink[] = [
  { label: 'Πολιτική απορρήτου', href: '/privacy' },
  { label: 'Όροι χρήσης', href: '/terms' },
]

function LinkList({ items }: { items: FooterLink[] }) {
  return (
    <ul className="mt-5 flex flex-col gap-3 text-[0.85rem] font-semibold text-white/70 font-body">
      {items.map((item) => (
        <li key={item.label}>
          {item.pending ? (
            <span className="inline-flex items-center gap-2 text-white/35">
              {item.label}
              <span className="rounded-full border border-white/15 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.08em]">
                σύντομα
              </span>
            </span>
          ) : (
            <a href={item.href} className="transition-colors duration-200 hover:text-warm">
              {item.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  )
}

const HEADING = 'text-[0.7rem] tracking-[0.18em] uppercase font-bold text-white/40 font-body'

export default function Footer() {
  const reopen = useConsentStore((s) => s.reopen)

  return (
    <footer className="relative bg-ink text-white py-16 px-5 sm:px-8 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <a href="/" className="inline-flex items-center" aria-label="saos.studio — Αρχική">
              <img
                src="/logos/logo-white.png"
                width={1746}
                height={228}
                alt="saos.studio"
                className="h-6 w-auto"
              />
            </a>
            <p className="mt-5 max-w-[38ch] text-[0.85rem] leading-[1.7] text-white/50 font-body">
              Σχεδιάζουμε και κατασκευάζουμε ιστοσελίδες που φέρνουν πελάτες: γρήγορα,
              καθαρά και χωρίς περιττή πολυπλοκότητα.
            </p>
            <p className="mt-4 text-[0.8rem] leading-[1.7] text-white/40 font-body">
              Το web division της{' '}
              <a
                href="https://rhooalabs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white/60 underline transition-colors duration-200 hover:text-warm"
              >
                Rhooa Labs
              </a>
              .
            </p>
          </div>

          <nav aria-label="Πλοήγηση υποσέλιδου">
            <h2 className={HEADING}>Πλοήγηση</h2>
            <LinkList items={NAV} />
          </nav>

          <nav aria-label="Περισσότερα">
            <h2 className={HEADING}>Περισσότερα</h2>
            <LinkList items={COMPANY} />
            <h2 className={`${HEADING} mt-8`}>Νομικά</h2>
            <LinkList items={LEGAL} />
          </nav>

          <div>
            <h2 className={HEADING}>Επικοινωνία</h2>
            <ul className="mt-5 flex flex-col gap-3 text-[0.85rem] font-semibold text-white/70 font-body">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="transition-colors duration-200 hover:text-warm"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a href="tel:+306986693678" className="transition-colors duration-200 hover:text-warm">
                  +30 698 669 3678
                </a>
              </li>
            </ul>

            <h2 className={`${HEADING} mt-8`}>Social</h2>
            <ul className="mt-4 flex flex-col gap-3 text-[0.85rem] font-semibold text-white/70 font-body">
              <li>
                <a
                  href="https://www.instagram.com/saos.studio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200 hover:text-warm"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61591820069253"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200 hover:text-warm"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <span className="text-[0.75rem] font-medium text-white/40 font-body">
            © {new Date().getFullYear()} saos.studio. Με επιφύλαξη παντός δικαιώματος. Powered by
            Rhooa Labs.
          </span>
          <button
            type="button"
            onClick={reopen}
            className="text-[0.75rem] font-semibold text-white/60 transition-colors duration-200 hover:text-warm"
          >
            Ρυθμίσεις cookies
          </button>
        </div>
      </div>
    </footer>
  )
}
