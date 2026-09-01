import { useEffect, useState, type ComponentType } from 'react'
import HomePage from './pages/Home'
import OurStoryPage from './pages/OurStory'
import ServicesPage from './pages/Services'
import HowItWorksPage from './pages/HowItWorks'
import ExamplesPage from './pages/Examples'
import ReviewsPage from './pages/Reviews'
import FaqPage from './pages/Faq'
import FreeWebsitePage from './pages/FreeWebsite'
import WebsiteReviewPage from './pages/WebsiteReview'
import RequestQuotePage from './pages/RequestQuote'
import PrivacyPage from './pages/Privacy'
import TermsPage from './pages/Terms'
import NotFoundPage from './pages/NotFound'

function usePathname() {
  const [pathname, setPathname] = useState(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname,
  )
  useEffect(() => {
    const onPop = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  return pathname
}

/**
 * Collapse the variants a path can arrive in to the single form used as a key in
 * `pages`: no trailing slash, no `/index.html`, never empty.
 *
 * Netlify serves `/services` and `/services/` as the same file, and the client
 * then sees whichever the visitor typed. Normalising once here is why the map
 * below lists each route only as its canonical path.
 */
function normalisePath(raw: string): string {
  let path = raw.split('?')[0].split('#')[0]
  if (path.endsWith('/index.html')) path = path.slice(0, -'index.html'.length)
  if (path.length > 1 && path.endsWith('/')) path = path.replace(/\/+$/, '')
  return path === '' ? '/' : path
}

/**
 * Every path the app renders as a real page.
 *
 * This map is the single source of truth. `KNOWN_PATHS` used to be a hand-kept
 * array alongside a chain of `if`s, which made adding a route three coordinated
 * edits — and missing the third had a nasty failure mode: the route prerendered
 * correctly, then flipped to the 404 page the moment React hydrated. Served HTML
 * right, visible page wrong, and nothing in the build complained.
 *
 * Deriving the known paths from these keys removes that class of bug. The build
 * additionally asserts (via `pagePaths`, re-exported through entry-server) that
 * every indexable route in `seo.ts` has an entry here, so a route declared in
 * one place and forgotten in the other fails the build instead of shipping.
 */
const pages: Record<string, ComponentType> = {
  '/': HomePage,
  '/our-story': OurStoryPage,
  '/services': ServicesPage,
  '/how-it-works': HowItWorksPage,
  '/examples': ExamplesPage,
  // Retained deliberately while `/reviews` is unpublished. The route is held out
  // of `routes` in seo.ts, which is what removes it from the prerender, the
  // sitemap and IndexNow; prerender.mjs only throws the other way round (a route
  // with no page entry), so keeping this costs nothing and lets the page still
  // render on the dev server for preview. See REVIEWS_PUBLISHED in lib/reviews.
  '/reviews': ReviewsPage,
  '/faq': FaqPage,
  '/free-website': FreeWebsitePage,
  '/website-review': WebsiteReviewPage,
  '/request-a-quote': RequestQuotePage,
  '/privacy': PrivacyPage,
  '/terms': TermsPage,
  '/404': NotFoundPage,
}

/** Consumed by `scripts/prerender.mjs` to verify the route table is fully wired. */
export const pagePaths = Object.keys(pages)

interface Props {
  /**
   * Route to render, supplied by the prerenderer. On the client this is omitted
   * and the route comes from `window.location` instead.
   */
  pathname?: string
}

export default function App({ pathname: ssrPathname }: Props = {}) {
  const clientPathname = usePathname()
  const Page = pages[normalisePath(ssrPathname ?? clientPathname)] ?? NotFoundPage
  return <Page />
}
