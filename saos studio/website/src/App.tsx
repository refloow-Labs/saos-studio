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

export default function App() {
  const pathname = usePathname()

  if (pathname === '/privacy' || pathname === '/privacy/') {
    return (
      <>
        <PrivacyPage />
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
