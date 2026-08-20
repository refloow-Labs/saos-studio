import { useEffect, useState } from 'react'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Portfolio from './components/Portfolio'
import Services from './components/Services'
import FreeProposal from './components/FreeProposal'
import Approach from './components/Approach'
import Manifesto from './components/Manifesto'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Chapter from './components/Chapter'
import CookieConsent from './components/CookieConsent'
import PrivacyPage from './pages/Privacy'
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

/** Paths the app renders as real pages. Anything else is a 404. */
const KNOWN_PATHS = ['/', '/index.html', '/privacy', '/privacy/']

interface Props {
  /**
   * Route to render, supplied by the prerenderer. On the client this is omitted
   * and the route comes from `window.location` instead.
   */
  pathname?: string
}

export default function App({ pathname: ssrPathname }: Props = {}) {
  const clientPathname = usePathname()
  const pathname = ssrPathname ?? clientPathname

  if (pathname === '/privacy' || pathname === '/privacy/') {
    return (
      <>
        <PrivacyPage />
        <CookieConsent />
      </>
    )
  }

  if (!KNOWN_PATHS.includes(pathname)) {
    return (
      <>
        <NotFoundPage />
        <CookieConsent />
      </>
    )
  }

  return (
    <>
      <Navigation />

      <main className="relative">
        <Hero />

        <Chapter id="work" tone="gray">
          <Portfolio />
        </Chapter>

        <Chapter id="services-section" tone="white">
          <Services />
        </Chapter>

        <Chapter id="free-proposal-section" tone="gray">
          <FreeProposal />
        </Chapter>

        <Chapter id="approach-section" tone="white">
          <Approach />
        </Chapter>

        <Chapter id="manifesto-section" tone="white">
          <Manifesto />
        </Chapter>

        <Chapter id="contact-section" tone="gray">
          <Contact />
        </Chapter>
      </main>

      <Footer />
      <CookieConsent />
    </>
  )
}
