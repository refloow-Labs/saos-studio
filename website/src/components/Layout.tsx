import { ReactNode } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'
import CookieConsent from './CookieConsent'

interface Props {
  children: ReactNode
  /** Extra classes on `<main>`. Pages that are not a stack of `Chapter`s use this. */
  mainClassName?: string
  /**
   * Set by pages that open with a dark full-bleed hero, so the transparent nav
   * switches to its light wordmark and links. Only the homepage passes it.
   */
  navOverDark?: boolean
}

/**
 * The page shell every route renders inside: navigation, the `#main` landmark
 * the skip link targets, footer, consent banner.
 *
 * Extracted when the site went multi-page. Previously `/privacy` and `/404` each
 * hand-rolled this stack and the homepage assembled it inline, so the three
 * could — and did — drift apart. Nine more pages repeating it was not viable.
 *
 * The skip link itself lives in `Navigation`, which renders it as its first
 * child so it is the first thing in the tab order on every page.
 */
export default function Layout({ children, mainClassName = '', navOverDark = false }: Props) {
  return (
    <>
      <Navigation overDark={navOverDark} />
      <main id="main" className={`relative ${mainClassName}`}>
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </>
  )
}
