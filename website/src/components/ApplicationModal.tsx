import { useId, useState, type FormEvent } from 'react'
import { CheckCircle2 } from 'lucide-react'
import Modal from './Modal'
import { TextField, TextareaField, SelectField } from './form/Fields'
import { INDUSTRIES } from '../lib/industries'
import { isValidEmail, normaliseUrl, submit } from '../lib/submit'

interface Props {
  open: boolean
  onClose: () => void
}

type FieldName = 'name' | 'industry' | 'reason' | 'website' | 'contact' | 'email' | 'extra'
type Status = 'idle' | 'submitting' | 'success' | 'error'

const EMPTY: Record<FieldName, string> = {
  name: '',
  industry: '',
  reason: '',
  website: '',
  contact: '',
  email: '',
  extra: '',
}

export default function ApplicationModal({ open, onClose }: Props) {
  const ids = {
    name: useId(),
    industry: useId(),
    reason: useId(),
    website: useId(),
    contact: useId(),
    email: useId(),
    extra: useId(),
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
    if (!values.industry) next.industry = 'Επιλέξτε κλάδο.'
    if (!values.reason.trim()) next.reason = 'Πείτε μας λίγα λόγια για τον λόγο της αίτησης.'
    if (!values.contact.trim()) next.contact = 'Πείτε μας πώς να επικοινωνήσουμε μαζί σας.'
    if (!values.email.trim()) next.email = 'Συμπληρώστε το email σας.'
    else if (!isValidEmail(values.email)) next.email = 'Το email δεν φαίνεται σωστό.'
    // Website is optional on purpose — not having one is a reason to apply.
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

    const result = await submit('application', {
      ...values,
      website: normaliseUrl(values.website) ?? '',
    })

    if (!result.ok) {
      setStatus('error')
      setFormError(result.error ?? 'Κάτι πήγε στραβά. Δοκιμάστε ξανά σε λίγο.')
      return
    }

    setStatus('success')
  }

  function handleClose() {
    onClose()
    // Reset only after a completed application, so a mis-click does not wipe a
    // half-filled form the user meant to come back to.
    if (status === 'success') {
      setValues({ ...EMPTY })
      setErrors({})
      setStatus('idle')
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={status === 'success' ? 'Η αίτησή σας στάλθηκε' : 'Αίτηση για δωρεάν website'}
      size="max-w-2xl"
    >
      {status === 'success' ? (
        <div className="px-6 py-10 text-center sm:px-10">
          <CheckCircle2 aria-hidden className="mx-auto h-12 w-12 text-warm" strokeWidth={1.5} />
          <h3 className="mt-5 text-headline text-[1.4rem]">Ευχαριστούμε!</h3>
          <p className="mx-auto mt-4 max-w-[46ch] text-[0.92rem] leading-[1.8] text-muted font-body">
            Λάβαμε την αίτησή σας. Θα τη διαβάσουμε προσεκτικά και θα επικοινωνήσουμε μαζί
            σας με email — είτε γίνει δεκτή είτε όχι.
          </p>
          <p className="mx-auto mt-4 max-w-[46ch] text-[0.85rem] leading-[1.7] text-muted font-body">
            Δεν γίνονται όλες οι αιτήσεις δεκτές. Αν η δική σας δεν επιλεγεί, θα σας
            προτείνουμε εναλλακτικές.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="btn-primary mt-8 justify-center px-8 py-3.5 text-[0.85rem]"
          >
            Κλείσιμο
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="px-6 py-6 sm:px-8">
          <p className="text-[0.88rem] leading-[1.75] text-muted font-body">
            Επτά σύντομες ερωτήσεις. Όσο πιο συγκεκριμένοι είστε, τόσο καλύτερα μπορούμε να
            αξιολογήσουμε την αίτηση.
          </p>

          <div className="mt-6 space-y-5">
            <TextField
              id={ids.name}
              name="name"
              label="Ποιος είστε;"
              required
              autoComplete="name"
              placeholder="Ονοματεπώνυμο και επιχείρηση"
              value={values.name}
              onChange={(v) => set('name', v)}
              error={errors.name}
            />

            <SelectField
              id={ids.industry}
              name="industry"
              label="Σε ποιον κλάδο δραστηριοποιείστε;"
              required
              options={INDUSTRIES}
              value={values.industry}
              onChange={(v) => set('industry', v)}
              error={errors.industry}
            />

            <TextareaField
              id={ids.reason}
              name="reason"
              label="Γιατί θέλετε να κάνετε αίτηση;"
              required
              rows={4}
              placeholder="Τι θέλετε να πετύχετε και τι σας εμποδίζει σήμερα;"
              value={values.reason}
              onChange={(v) => set('reason', v)}
              error={errors.reason}
            />

            <TextField
              id={ids.website}
              name="website"
              label="Έχετε ήδη ιστοσελίδα;"
              inputMode="url"
              autoComplete="url"
              placeholder="π.χ. example.gr"
              value={values.website}
              onChange={(v) => set('website', v)}
              error={errors.website}
              hint="Προαιρετικό. Αν δεν έχετε, αφήστε το κενό — δεν είναι μειονέκτημα."
            />

            <TextField
              id={ids.contact}
              name="contact"
              label="Πώς μπορούμε να επικοινωνήσουμε μαζί σας;"
              required
              autoComplete="tel"
              placeholder="Τηλέφωνο, Viber, WhatsApp ή ό,τι σας βολεύει"
              value={values.contact}
              onChange={(v) => set('contact', v)}
              error={errors.contact}
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
              id={ids.extra}
              name="extra"
              label="Κάτι άλλο που θα θέλατε να ξέρουμε;"
              rows={3}
              placeholder="Προαιρετικό"
              value={values.extra}
              onChange={(v) => set('extra', v)}
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

          <div className="mt-2 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.78rem] leading-[1.6] text-muted font-body">
              Θα σας απαντήσουμε με email, είτε η αίτηση γίνει δεκτή είτε όχι.
            </p>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="btn-accent justify-center px-8 py-3.5 text-[0.85rem] disabled:opacity-70"
            >
              {status === 'submitting' ? 'Αποστολή…' : 'Στείλτε την αίτηση'}
              {status !== 'submitting' && <span aria-hidden>→</span>}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
