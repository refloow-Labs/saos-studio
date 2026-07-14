import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConsentStore, ConsentCategory } from '../lib/consent'

interface Props {
  open: boolean
  onClose: () => void
}

interface CategoryRow {
  id: ConsentCategory
  title: string
  desc: string
  required?: boolean
}

const CATEGORIES: CategoryRow[] = [
  {
    id: 'necessary',
    title: 'Απαραίτητα',
    desc: 'Cookies που απαιτούνται για τη λειτουργία του site (συγκατάθεση, γλώσσα, ασφάλεια). Δεν μπορούν να απενεργοποιηθούν.',
    required: true,
  },
  {
    id: 'analytics',
    title: 'Στατιστικά',
    desc: 'Μας βοηθούν να καταλάβουμε πώς οι επισκέπτες χρησιμοποιούν το site (Google Analytics) — με ανωνυμοποιημένες IP.',
  },
  {
    id: 'marketing',
    title: 'Marketing',
    desc: 'Cookies για στοχευμένη διαφήμιση. Δεν χρησιμοποιούνται προς το παρόν.',
  },
]

export default function CookieSettingsModal({ open, onClose }: Props) {
  const { necessary, analytics, marketing, setCategory, saveAndClose } =
    useConsentStore()

  const values: Record<ConsentCategory, 'granted' | 'denied'> = {
    necessary,
    analytics,
    marketing,
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Ρυθμίσεις cookies"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div
            aria-hidden
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 32, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[560px] bg-white rounded-card border border-border shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)]"
          >
            {/* Header */}
            <div className="px-7 pt-7 pb-4 border-b border-border">
              <p className="text-[0.62rem] tracking-[0.18em] uppercase font-bold text-muted font-body mb-2">
                Cookies
              </p>
              <h2 className="font-display font-extrabold text-[1.6rem] leading-tight text-ink">
                Ρυθμίσεις απορρήτου
              </h2>
            </div>

            {/* Categories */}
            <div className="px-7 py-5 max-h-[60vh] overflow-y-auto">
              {CATEGORIES.map((cat, i) => (
                <div
                  key={cat.id}
                  className={`py-5 ${
                    i < CATEGORIES.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-5 mb-2">
                    <h3 className="font-display text-[1.05rem] font-normal text-text">
                      {cat.title}
                    </h3>
                    <Toggle
                      checked={values[cat.id] === 'granted'}
                      disabled={cat.required}
                      onChange={(checked) =>
                        setCategory(cat.id, checked ? 'granted' : 'denied')
                      }
                    />
                  </div>
                  <p className="text-muted text-[0.78rem] leading-[1.65] font-body pr-12">
                    {cat.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="px-7 pb-7 pt-3 flex flex-col sm:flex-row gap-2 border-t border-border">
              <button
                onClick={() => {
                  saveAndClose()
                  onClose()
                }}
                className="flex-1 px-5 py-3 bg-accent text-bg text-[0.66rem] tracking-[0.18em] uppercase font-semibold font-body transition-all duration-300 hover:bg-text"
              >
                Αποθήκευση επιλογών
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 border border-text/15 text-muted text-[0.66rem] tracking-[0.18em] uppercase font-semibold font-body transition-all duration-300 hover:border-text/30 hover:text-text/85"
              >
                Ακύρωση
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Toggle({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-300 flex-shrink-0 ${
        checked ? 'bg-accent' : 'bg-text/15'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-bg transition-transform duration-300 ${
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}
