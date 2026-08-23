import { useId, useState, type FormEvent } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { TextField, TextareaField, SelectField, RadioGroupField } from './form/Fields'
import { INDUSTRIES } from '../lib/industries'
import { isValidEmail, normaliseUrl, submit } from '../lib/submit'
import { CONTACT_EMAIL, BOOKING_URL } from '../lib/seo'

type FieldName = 'name' | 'business' | 'industry' | 'need' | 'website' | 'email' | 'project'
type Status = 'idle' | 'submitting' | 'success' | 'error'

const EMPTY: Record<FieldName, string> = {
  name: '',
  business: '',
  industry: '',
  need: '',
  website: '',
  email: '',
  project: '',
}

/**
 * Single choice, not checkboxes. The three answers lead to genuinely different
 * conversations, and a visitor who wants two of them says so in the description
 * field — which keeps the form at the length the CTA promises.
 */
const NEEDS = [
  { value: 'new', label: 'Νέα ιστοσελίδα', desc: 'Δεν έχω ιστοσελίδα σήμερα.' },
  { value: 'redesign', label: 'Redesign', desc: 'Έχω, αλλά θέλει ανανέωση.' },
  { value: 'seo', label: 'SEO', desc: 'Θέλω να με βρίσκουν περισσότεροι.' },
]

/**
 * The quote request — the destination of the hero's primary CTA.
 *
 * Seven fields, deliberately. The button promises two minutes, and every field
 * added past that point is one the visitor answers by closing the tab. Anything
 * we still need to know we can ask in the reply.
 */
export default function QuoteForm() {
  const ids = {
    name: useId(),
    business: useId(),
    industry: useId(),
    need: useId(),
    website: useId(),
    email: useId(),
    project: useId(),
  }
  const statusId = useId()

  const [values, setValues] = useState({ ...EMPTY })
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [formError, setFormError] = useState('')

  function set(field: FieldName, value: string) {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const next: Partial<Record<FieldName, string>> = {}
    if (!values.name.trim()) next.name = 'Συμπληρώστε το όνομά σας.'
    if (!values.business.trim()) next.business = 'Συμπληρώστε την επωνυμία της επιχείρησης.'
    if (!values.industry) next.industry = 'Επιλέξτε κλάδο.'
    if (!values.need) next.need = 'Επιλέξτε τι χρειάζεστε.'
    if (!values.email.trim()) next.email = 'Συμπληρώστε το email σας.'
    else if (!isValidEmail(values.email)) next.email = 'Το email δεν φαίνεται σωστό.'
    if (!values.project.trim()) next.project = 'Πείτε μας λίγα λόγια για το project.'
    // Website stays optional — not having one is the most common reason to ask.
    if (values.website.trim() && !normaliseUrl(values.website))
      next.website = 'Η διεύθυνση δεν φαίνεται σωστή. Δοκιμάστε κάτι σαν example.gr'
    return next
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return

    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) {
      setStatus('error')
      setFormError('Ελέγξτε τα πεδία που είναι σημειωμένα παρακάτω.')
      // Move focus to the first problem so keyboard users are not left hunting.
      const first = (Object.keys(found) as FieldName[])[0]
      document.getElementById(ids[first])?.focus()
      return
    }

    setStatus('submitting')
    setFormError('')

    const result = await submit('quote', {
      ...values,
      need: NEEDS.find((n) => n.value === values.need)?.label ?? values.need,
      website: normaliseUrl(values.website) ?? '',
    })

    if (!result.ok) {
      setStatus('error')
      setFormError(result.error ?? 'Κάτι πήγε στραβά. Δοκιμάστε ξανά σε λίγο.')
      return
    }

    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="rounded-card border border-border bg-white p-8 text-center sm:p-12">
        <CheckCircle2 aria-hidden className="mx-auto h-12 w-12 text-warm" strokeWidth={1.5} />
        <h2 className="mt-5 text-headline text-[clamp(1.4rem,2.4vw,1.9rem)]">Ευχαριστούμε!</h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-[0.95rem] leading-[1.8] text-muted font-body">
          Θα εξετάσουμε το project σας και θα επικοινωνήσουμε σύντομα.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="/examples" className="btn-outline justify-center px-8 py-3.5 text-[0.85rem]">
            Δείτε τα έργα μας
          </a>
          <a href="/how-it-works" className="btn-primary justify-center px-8 py-3.5 text-[0.85rem]">
            Πώς λειτουργεί <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-card border border-border bg-white p-6 sm:p-9"
    >
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id={ids.name}
            name="name"
            label="Όνομα"
            required
            autoComplete="name"
            placeholder="Ονοματεπώνυμο"
            value={values.name}
            onChange={(v) => set('name', v)}
            error={errors.name}
          />
          <TextField
            id={ids.business}
            name="business"
            label="Επωνυμία επιχείρησης"
            required
            autoComplete="organization"
            placeholder="Πώς λέγεται η επιχείρησή σας"
            value={values.business}
            onChange={(v) => set('business', v)}
            error={errors.business}
          />
        </div>

        <SelectField
          id={ids.industry}
          name="industry"
          label="Κλάδος δραστηριότητας"
          required
          options={INDUSTRIES}
          value={values.industry}
          onChange={(v) => set('industry', v)}
          error={errors.industry}
        />

        <RadioGroupField
          id={ids.need}
          name="need"
          label="Τι χρειάζεστε"
          required
          options={NEEDS}
          value={values.need}
          onChange={(v) => set('need', v)}
          error={errors.need}
          hint="Αν χρειάζεστε παραπάνω από ένα, πείτε μας το στην περιγραφή παρακάτω."
        />

        <TextField
          id={ids.website}
          name="website"
          label="Ιστοσελίδα"
          inputMode="url"
          autoComplete="url"
          placeholder="π.χ. example.gr"
          value={values.website}
          onChange={(v) => set('website', v)}
          error={errors.website}
          hint="Προαιρετικό. Αν δεν έχετε, αφήστε το κενό."
        />

        <TextField
          id={ids.email}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          label="Email"
          required
          placeholder="name@example.gr"
          value={values.email}
          onChange={(v) => set('email', v)}
          error={errors.email}
        />

        <TextareaField
          id={ids.project}
          name="project"
          label="Σύντομη περιγραφή του project"
          required
          rows={4}
          placeholder="Τι θέλετε να πετύχετε και τι σας εμποδίζει σήμερα;"
          value={values.project}
          onChange={(v) => set('project', v)}
          error={errors.project}
        />
      </div>

      <p
        id={statusId}
        role="status"
        aria-live="polite"
        className="mt-5 min-h-[1.25rem] text-[0.82rem] font-semibold text-warm-ink font-body"
      >
        {formError}
      </p>

      <div className="mt-2 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.78rem] leading-[1.6] text-muted font-body max-w-[38ch]">
          Δεν ζητάμε κάρτα και δεν υπάρχει δέσμευση. Θα λάβετε απάντηση με email.
        </p>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn-accent justify-center px-8 py-3.5 text-[0.88rem] disabled:opacity-70"
        >
          {status === 'submitting' ? 'Αποστολή…' : 'Στείλτε το αίτημα'}
          {status !== 'submitting' && <span aria-hidden>→</span>}
        </button>
      </div>

      {/*
        Fallback channels, shown alongside the form rather than after it fails.
        `submit()` currently has no backend — it persists locally and always
        reports success — so a visitor whose enquiry matters should be able to
        reach a real inbox without depending on it. Remove this block only once
        the backend in lib/submit.ts is wired and verified.
      */}
      <p className="mt-6 text-[0.8rem] leading-[1.7] text-muted font-body">
        Προτιμάτε να μιλήσουμε; Στείλτε μας email στο{' '}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-bold text-ink underline transition-colors duration-200 hover:text-warm-ink"
        >
          {CONTACT_EMAIL}
        </a>{' '}
        ή{' '}
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-ink underline transition-colors duration-200 hover:text-warm-ink"
        >
          κλείστε μια σύντομη κλήση
        </a>
        .
      </p>
    </form>
  )
}
