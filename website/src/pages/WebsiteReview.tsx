import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Gauge, Loader2 } from 'lucide-react'
import Layout from '../components/Layout'
import Chapter from '../components/Chapter'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import WebsiteReviewReport from '../components/WebsiteReviewReport'
import { normaliseUrl, FORM_ERRORS } from '../lib/submit'
import { runPageSpeedReport, PageSpeedError, type PageSpeedReport } from '../lib/pagespeed'
import { BOOKING_URL } from '../lib/seo'

type Status = 'idle' | 'loading' | 'success' | 'error'

/** Cycles while the two Lighthouse runs are in flight (10–30s each), so the
    wait reads as progress instead of a frozen page. */
const LOADING_LINES = [
  'Στέλνουμε το site σας στη Google για μέτρηση…',
  'Η Google ανοίγει το site σας σε κινητό και υπολογιστή…',
  'Μετράμε πόσο γρήγορα εμφανίζεται το περιεχόμενο…',
  'Ελέγχουμε προσβασιμότητα και SEO…',
  'Σχεδόν έτοιμο — συναρμολογούμε την αναφορά…',
]

export default function WebsiteReviewPage() {
  const fieldId = useId()
  const statusId = useId()
  const [site, setSite] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [report, setReport] = useState<PageSpeedReport | null>(null)
  const [lineIndex, setLineIndex] = useState(0)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status !== 'loading') return
    const t = setInterval(() => setLineIndex((i) => (i + 1) % LOADING_LINES.length), 3200)
    return () => clearInterval(t)
  }, [status])

  useEffect(() => {
    if (status === 'success' && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [status])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'loading') return

    const url = normaliseUrl(site)
    if (!url) {
      setStatus('error')
      setError(FORM_ERRORS.INVALID_URL)
      return
    }

    setStatus('loading')
    setError('')
    setLineIndex(0)

    try {
      const result = await runPageSpeedReport(url)
      setReport(result)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof PageSpeedError ? err.message : FORM_ERRORS.SUBMIT_FAILED)
    }
  }

  return (
    <Layout>
      <Chapter id="review-intro" tone="white" className="pt-36 md:pt-44">
        <PageHeader
          eyebrow="Δωρεάν εργαλείο"
          doodle="sparkle"
          title={
            <>
              Πόσο γρήγορο είναι το site σας, <em>στα αλήθεια;</em>
            </>
          }
          lead="Βάλτε τη διεύθυνσή σας. Ρωτάμε απευθείας τη Google — το ίδιο εργαλείο (pagespeed.web.dev) που χρησιμοποιεί και η ίδια η αναζήτηση — και σε λίγα δευτερόλεπτα βλέπετε την ίδια αναφορά που θα σας στέλναμε εμείς."
        />

        <Reveal className="mt-10">
          <form onSubmit={handleSubmit} noValidate className="w-full max-w-xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <label htmlFor={fieldId} className="sr-only">
                  Η ιστοσελίδα σας
                </label>
                <input
                  id={fieldId}
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="Η ιστοσελίδα σας — π.χ. example.gr"
                  value={site}
                  onChange={(e) => {
                    setSite(e.target.value)
                    if (status === 'error') setStatus('idle')
                  }}
                  disabled={status === 'loading'}
                  required
                  aria-invalid={status === 'error'}
                  aria-describedby={statusId}
                  className={`w-full rounded-full border bg-white px-6 py-4 text-[0.95rem] font-body text-ink outline-none transition-colors duration-200 placeholder:text-muted focus:border-ink disabled:opacity-60 ${
                    status === 'error' ? '!border-warm-dim' : 'border-border'
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-accent justify-center gap-2.5 whitespace-nowrap px-8 py-4 text-[0.9rem] disabled:opacity-80"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                    Γίνεται μέτρηση…
                  </>
                ) : (
                  <>
                    <Gauge aria-hidden className="h-4 w-4" />
                    Κάντε τη δωρεάν αξιολόγηση
                  </>
                )}
              </button>
            </div>

            <p
              id={statusId}
              role="status"
              aria-live="polite"
              className={`mt-4 min-h-[1.5rem] px-6 text-[0.85rem] leading-[1.6] font-body ${
                status === 'error' ? 'font-semibold text-warm-ink' : 'text-muted'
              }`}
            >
              {status === 'error' && error}
              {status === 'loading' && LOADING_LINES[lineIndex]}
              {status === 'idle' &&
                'Παίρνει γύρω στα 20–30 δευτερόλεπτα — η Google μετράει πραγματική φόρτωση, όχι εκτίμηση.'}
            </p>
          </form>
        </Reveal>
      </Chapter>

      {status === 'success' && report && (
        <Chapter id="review-results" tone="gray">
          <div ref={resultsRef}>
            <WebsiteReviewReport report={report} bookingUrl={BOOKING_URL} />
          </div>
        </Chapter>
      )}
    </Layout>
  )
}
