import { useId, useState, type FormEvent } from 'react'
import { isValidEmail, normaliseUrl, submit } from '../lib/submit'

const PAGESPEED_BASE = 'https://pagespeed.web.dev/analysis?url='

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface Props {
  /** Renders light-on-dark. */
  onDark?: boolean
  className?: string
}

/**
 * The free-evaluation capture: a website address in, a PageSpeed analysis out.
 *
 * Extracted from the hero rather than written inline because the same form is
 * the natural closer for several sections further down the page.
 *
 * The website is the required field — it is the thing being evaluated, and
 * asking for it means the visitor gets a real result immediately instead of
 * being dropped on an empty tool. Email is optional and buys the follow-up
 * report, so the low-commitment path stays genuinely low-commitment.
 */
export default function EvaluationForm({ onDark = false, className = '' }: Props) {
  const siteId = useId()
  const emailId = useId()
  const statusId = useId()
  const emailHintId = useId()

  const [site, setSite] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [invalidField, setInvalidField] = useState<'site' | 'email' | null>(null)
  /** Set when the browser refused the new tab, so we can offer a real link. */
  const [blockedUrl, setBlockedUrl] = useState('')

  const busy = status === 'submitting' || status === 'success'

  function fail(field: 'site' | 'email', text: string) {
    setStatus('error')
    setInvalidField(field)
    setMessage(text)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (busy) return

    if (!site.trim()) {
      fail('site', 'Συμπληρώστε τη διεύθυνση της ιστοσελίδας σας.')
      return
    }

    const normalisedSite = normaliseUrl(site)
    if (!normalisedSite) {
      fail('site', 'Η διεύθυνση δεν φαίνεται σωστή. Δοκιμάστε κάτι σαν example.gr')
      return
    }

    // Optional — but if they typed something, it has to be usable.
    const trimmedEmail = email.trim()
    if (trimmedEmail && !isValidEmail(trimmedEmail)) {
      fail('email', 'Το email δεν φαίνεται σωστό. Ελέγξτε το ή αφήστε το κενό.')
      return
    }

    setInvalidField(null)
    setBlockedUrl('')

    /* Opened synchronously, before any await. A `window.open` that happens after
       an await has lost the user-gesture context and Safari and Firefox block it
       as a popup — the form would report success while nothing opened.

       No 'noopener' in the feature string on purpose: passing it makes
       window.open return null *by specification*, which is indistinguishable
       from the popup having been blocked. We need the handle to tell those two
       apart, so the opener reference is severed on the result instead. */
    const destination = PAGESPEED_BASE + encodeURIComponent(normalisedSite)
    const opened = window.open(destination, '_blank')
    if (opened) {
      try {
        opened.opener = null
      } catch {
        // Cross-origin restrictions in older browsers — not worth failing over.
      }
    }

    setStatus('submitting')
    setMessage('')

    const result = await submit('evaluation', {
      website: normalisedSite,
      email: trimmedEmail,
    })

    if (!result.ok) {
      fail('site', result.error ?? 'Κάτι πήγε στραβά. Δοκιμάστε ξανά σε λίγο.')
      return
    }

    // Never claim a tab opened when the browser refused it — offer the link instead.
    if (!opened) setBlockedUrl(destination)

    const openedLine = opened
      ? 'Η ανάλυση της Google άνοιξε σε νέα καρτέλα.'
      : 'Ο browser σας εμπόδισε το άνοιγμα νέας καρτέλας.'
    const followUpLine = trimmedEmail
      ? 'Θα κοιτάξουμε την ιστοσελίδα σας και θα σας στείλουμε αναλυτική αναφορά στο email σας.'
      : 'Αν θέλετε και αναλυτική αναφορά με το τι αξίζει να διορθώσετε, αφήστε μας ένα email.'

    setStatus('success')
    setMessage(`Έτοιμο! ${openedLine} ${followUpLine}`)
  }

  const fieldBase = `w-full rounded-full px-6 py-4 text-[0.95rem] font-body outline-none transition-colors duration-200 border disabled:opacity-60 ${
    onDark
      ? 'bg-white/10 border-white/15 text-white placeholder:text-white/40 focus:border-warm'
      : 'bg-white border-border text-ink placeholder:text-muted focus:border-ink'
  }`
  const errorRing = '!border-warm-dim'

  return (
    <form onSubmit={handleSubmit} noValidate className={`w-full max-w-xl ${className}`}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label htmlFor={siteId} className="sr-only">
              Η ιστοσελίδα σας
            </label>
            <input
              id={siteId}
              type="text"
              name="website"
              inputMode="url"
              autoComplete="url"
              placeholder="Η ιστοσελίδα σας — π.χ. example.gr"
              value={site}
              onChange={(e) => {
                setSite(e.target.value)
                if (status === 'error') setStatus('idle')
              }}
              disabled={busy}
              required
              aria-invalid={invalidField === 'site'}
              aria-describedby={statusId}
              className={`${fieldBase} ${invalidField === 'site' ? errorRing : ''}`}
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="btn-accent justify-center px-8 py-4 text-[0.9rem] whitespace-nowrap disabled:opacity-70"
          >
            {status === 'submitting' ? 'Γίνεται έλεγχος…' : 'Λάβετε δωρεάν αξιολόγηση'}
            {status !== 'submitting' && <span aria-hidden>→</span>}
          </button>
        </div>

        <div>
          <label htmlFor={emailId} className="sr-only">
            Email (προαιρετικό)
          </label>
          <input
            id={emailId}
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Email (προαιρετικό) — για να λάβετε πλήρη αναφορά"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === 'error') setStatus('idle')
            }}
            disabled={busy}
            aria-invalid={invalidField === 'email'}
            aria-describedby={`${emailHintId} ${statusId}`}
            className={`${fieldBase} text-[0.88rem] ${invalidField === 'email' ? errorRing : ''}`}
          />
          <p
            id={emailHintId}
            className={`mt-2 px-6 text-[0.78rem] leading-[1.6] font-body ${
              onDark ? 'text-white/50' : 'text-muted'
            }`}
          >
            Αφήστε το email σας μόνο αν θέλετε να σας στείλουμε αναλυτική αναφορά με το τι
            μπορείτε να βελτιώσετε.
          </p>
        </div>
      </div>

      {/* One live region for every outcome, so a screen reader announces
          validation errors, failures and success without moving focus. */}
      <p
        id={statusId}
        role="status"
        aria-live="polite"
        className={`mt-4 min-h-[1.5rem] text-[0.85rem] leading-[1.6] font-body ${
          status === 'error'
            ? onDark
              ? 'text-warm font-semibold'
              : 'text-warm-ink font-semibold'
            : onDark
              ? 'text-white/70'
              : 'text-muted'
        }`}
      >
        {message}
        {blockedUrl && (
          <>
            {' '}
            <a
              href={blockedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              Ανοίξτε την ανάλυση εδώ
            </a>
            .
          </>
        )}
      </p>
    </form>
  )
}
