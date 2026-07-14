import { ConsentValue } from './consent'

/**
 * Google Analytics 4 + Consent Mode v2 helpers.
 *
 * The gtag stub and default 'denied' consent state are inlined into
 * `index.html` so they execute before anything else. This file only provides
 * the small `updateConsent()` helper used by the cookie banner once the user
 * makes a choice.
 *
 * Set the GA Measurement ID via `VITE_GA_ID` in .env (e.g. G-XXXXXXXXXX).
 */

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined

export const isGAConfigured = () => !!GA_ID && GA_ID.startsWith('G-')

interface ConsentUpdate {
  analytics: ConsentValue
  marketing: ConsentValue
}

export function updateConsent({ analytics, marketing }: ConsentUpdate) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('consent', 'update', {
    analytics_storage: analytics,
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
  })
}

/**
 * Loads the GA script tag dynamically. Called once, only after the user has
 * granted analytics consent. Before that we keep the page completely script-
 * free so visitors who reject analytics never download a single GA byte.
 */
let gaLoaded = false
export function loadGA() {
  if (gaLoaded || !GA_ID || typeof window === 'undefined') return
  gaLoaded = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.gtag?.('js', new Date())
  window.gtag?.('config', GA_ID, {
    anonymize_ip: true,
    send_page_view: true,
  })
}
