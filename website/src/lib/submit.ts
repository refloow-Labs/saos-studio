/**
 * The single seam between every form on the site and whatever eventually
 * receives its data.
 *
 * Posts to Netlify Forms — the three matching hidden forms declared in
 * `index.html` are what let Netlify's build-time HTML scan register them, so
 * a payload key with no matching hidden `<input name>` there is silently
 * dropped by Netlify even though this call still resolves `{ ok: true }`.
 * Every submission is also mirrored to localStorage, both as a dev-time
 * fallback (Netlify Forms only exists once deployed, not on `vite dev`) and
 * as a local record in case a submission is lost in transit.
 */

export type FormName = 'evaluation' | 'application' | 'quote'

export interface SubmitResult {
  ok: boolean
  /** Greek, already user-facing — components render this directly on failure. */
  error?: string
}

/** Payloads are open-ended; each form defines its own fields. */
export type SubmitPayload = Record<string, string>

const STORAGE_KEY = 'saos_pending_submissions_v1'

/**
 * User-facing Greek for the failure modes every form shares.
 *
 * These lived as literals in QuoteForm, ApplicationModal and EvaluationForm —
 * seven strings, each written out two or three times, already drifting (the
 * network-failure message existed in two wordings). They belong here rather
 * than in `components/form/Fields.tsx` because that module is JSX
 * presentational and `EvaluationForm` does not use it, and because the two
 * validators these messages describe — `isValidEmail` and `normaliseUrl` — are
 * defined immediately below.
 *
 * Keyed by what went wrong, not by which form asks. Form-specific wording stays
 * in the form: `ApplicationModal` asks for «το όνομα της επιχείρησης» where
 * `QuoteForm` asks for «την επωνυμία», and that difference is deliberate.
 */
export const FORM_ERRORS = {
  REQUIRED_NAME: 'Συμπληρώστε το όνομά σας.',
  REQUIRED_EMAIL: 'Συμπληρώστε το email σας.',
  REQUIRED_INDUSTRY: 'Επιλέξτε κλάδο.',
  INVALID_EMAIL: 'Το email δεν φαίνεται σωστό.',
  INVALID_URL: 'Η διεύθυνση δεν φαίνεται σωστή. Δοκιμάστε κάτι σαν example.gr',
  FIX_MARKED_FIELDS: 'Ελέγξτε τα πεδία που είναι σημειωμένα παρακάτω.',
  SUBMIT_FAILED: 'Κάτι πήγε στραβά. Δοκιμάστε ξανά σε λίγο.',
} as const

/**
 * Deliberately permissive. Anything stricter starts rejecting addresses that are
 * perfectly valid (apostrophes, plus-addressing, long TLDs), and the only real
 * check is whether a message arrives — which is the backend's job, not ours.
 * This catches typos and empty submits, nothing more.
 */
export function isValidEmail(value: string): boolean {
  const trimmed = value.trim()
  if (trimmed.length < 6 || trimmed.length > 254) return false
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(trimmed)
}

/**
 * Normalises a typed website into something fetchable. People type
 * "example.gr", not "https://example.gr". Returns null if it cannot be made
 * into a plausible URL, so callers can skip it rather than send garbage on.
 */
export function normaliseUrl(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const url = new URL(withScheme)
    // Reject "foo" — a hostname with no dot is not a public site.
    if (!url.hostname.includes('.')) return null
    return url.toString()
  } catch {
    return null
  }
}

function persistLocally(formName: FormName, payload: SubmitPayload): void {
  if (typeof localStorage === 'undefined') return
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as unknown[]
    existing.push({ formName, payload, at: new Date().toISOString() })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
  } catch {
    // A full or disabled localStorage must not fail the submission — the user
    // has done nothing wrong and the UI should still succeed.
  }
}

/**
 * Note for whoever changes the destination later: these payloads are personal
 * data under GDPR. The privacy policy has to describe Netlify Forms as the
 * destination and a retention period.
 */
export async function submit(
  formName: FormName,
  payload: SubmitPayload,
): Promise<SubmitResult> {
  persistLocally(formName, payload)

  try {
    const body = new URLSearchParams({ 'form-name': formName, ...payload })
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    // Netlify Forms is only live on a deployed site — `vite dev`/`preview`
    // has no processing step and answers every POST to `/` with the SPA's
    // own index.html (still `res.ok`), so this cannot fail locally. The
    // localStorage copy above is what dev relies on instead.
    if (!res.ok) return { ok: false, error: FORM_ERRORS.SUBMIT_FAILED }
    return { ok: true }
  } catch {
    return { ok: false, error: FORM_ERRORS.SUBMIT_FAILED }
  }
}
