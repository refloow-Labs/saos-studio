import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConsentStore } from '../lib/consent'
import { updateConsent, loadGA } from '../lib/gtag'
import CookieSettingsModal from './CookieSettingsModal'

/**
 * Bottom-fixed cookie banner. Shown until the user makes a decision.
 * After acceptance, syncs choice to gtag Consent Mode v2 and loads GA
 * if analytics was granted.
 */
export default function CookieConsent() {
  const { decided, analytics, marketing, acceptAll, rejectAll } =
    useConsentStore()
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Sync any change in consent to gtag + (lazy) load GA
  useEffect(() => {
    if (!decided) return
    updateConsent({ analytics, marketing })
    if (analytics === 'granted') loadGA()
  }, [decided, analytics, marketing])

  return (
    <>
      <AnimatePresence>
        {!decided && (
          <motion.div
            role="dialog"
            aria-label="Συγκατάθεση cookies"
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 32, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 1.4 }}
            className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-6 md:left-auto md:right-6 md:bottom-6 md:max-w-[440px] z-[150]"
          >
            <div className="relative p-6 md:p-7 bg-white rounded-card border border-border shadow-[0_28px_70px_-20px_rgba(0,0,0,0.28)]">
              <p className="text-[0.62rem] tracking-[0.18em] uppercase font-bold text-muted font-body mb-3">
                Cookies
              </p>
              <p className="text-ink/80 text-[0.85rem] leading-[1.7] font-body mb-5">
                Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία σας και
                να κατανοήσουμε πώς χρησιμοποιείται το site.{' '}
                <a
                  href="/privacy"
                  className="text-ink font-semibold underline underline-offset-4 decoration-ink/30 hover:decoration-ink transition-colors"
                >
                  Πολιτική απορρήτου
                </a>
                .
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={acceptAll}
                  className="btn-primary w-full justify-center px-5 py-3 text-[0.8rem]"
                >
                  Αποδοχή όλων
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={rejectAll}
                    className="flex-1 px-5 py-3 rounded-full border border-border-hover text-ink/80 text-[0.8rem] font-bold font-body transition-all duration-200 hover:border-ink hover:text-ink"
                  >
                    Απόρριψη
                  </button>
                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="flex-1 px-5 py-3 rounded-full border border-border text-muted text-[0.8rem] font-bold font-body transition-all duration-200 hover:border-ink/40 hover:text-ink"
                  >
                    Προτιμήσεις
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CookieSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  )
}
