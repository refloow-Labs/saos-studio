/**
 * The single seam between every form on the site and whatever eventually
 * receives its data.
 *
 * Right now there is no backend. Submissions are kept in localStorage so the UI
 * has real success and error states to exercise during review, and so nothing is
 * silently dropped while the site is being built. Both the hero evaluation form
 * and the application modal call `submit()` — wiring a real destination is one
 * edit here, with no change to any component.
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
 * ---------------------------------------------------------------------------
 * BACKEND INTEGRATION POINT
 * ---------------------------------------------------------------------------
 * Replace the body below with a real call. The contract the UI depends on:
 *
 *   - resolves `{ ok: true }`  → the form shows its success state
 *   - resolves `{ ok: false, error }` → `error` is rendered verbatim, in Greek
 *   - never throws
 *
 * A Netlify Function, a form endpoint, an email service or a CRM webhook all
 * fit without touching a component. Example shape:
 *
 *   const res = await fetch('/.netlify/functions/submit', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ formName, ...payload }),
 *   })
 *   if (!res.ok) return { ok: false, error: 'Κάτι πήγε στραβά. Δοκιμάστε ξανά.' }
 *   return { ok: true }
 *
 * Note for whoever wires this up: these payloads are personal data under GDPR.
 * The privacy policy has to describe the destination and the retention period
 * before this goes live.
 * ---------------------------------------------------------------------------
 */
export async function submit(
  formName: FormName,
  payload: SubmitPayload,
): Promise<SubmitResult> {
  persistLocally(formName, payload)

  // Stands in for network latency so the loading state is actually visible
  // during review. Remove along with the rest of this placeholder body.
  await new Promise((resolve) => setTimeout(resolve, 600))

  return { ok: true }
}
