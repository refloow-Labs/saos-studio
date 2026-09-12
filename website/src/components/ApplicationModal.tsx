import { useId, useState, type FormEvent } from 'react'
import { CheckCircle2, Globe2 } from 'lucide-react'
import Modal from './Modal'
import { TextField, SelectField } from './form/Fields'
import { INDUSTRIES } from '../lib/industries'
import { TEMPLATE_OPTIONS } from '../lib/projects'
import { FORM_ERRORS, isValidEmail, normaliseUrl, submit } from '../lib/submit'

interface Props {
  open: boolean
  onClose: () => void
}

type FieldName = 'business' | 'name' | 'industry' | 'email' | 'contact' | 'website' | 'template'
type Status = 'idle' | 'submitting' | 'success' | 'error'

const EMPTY: Record<FieldName, string> = {
  business: '',
  name: '',
  industry: '',
  email: '',
  contact: '',
  website: '',
  template: '',
}

/**
 * Onboarding for the free-website application.
 *
 * Kept to the basics on purpose. The CTA promises two minutes, and the previous
 * version asked seven questions including two free-text boxes — which is nearer
 * five minutes and asks an owner to write an essay before we have so much as
 * their name. Everything here is answerable from memory in a few seconds.
 *
 * The two open questions that were dropped ("why are you applying", "anything
 * else") were the ones informing selection. That conversation now happens after
 * first contact, where it is a conversation rather than a form field — we reply
 * to every application either way, so there is always a chance to ask.
 *
 * Fields sit in a two-column grid from `sm` up, so the form reads as short as
 * it is rather than as a tall stack.
 *
 * The exclusions note is load-bearing: the homepage section no longer lists what
 * the offer excludes, so without this an applicant could reach submit having
 * never seen that hosting is not covered.
 */
export default function ApplicationModal({ open, onClose }: Props) {
  const ids = {
    business: useId(),
    name: useId(),
    industry: useId(),
    email: useId(),
    contact: useId(),
    website: useId(),
    template: useId(),
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
    if (!values.business.trim()) next.business = 'Συμπληρώστε την επωνυμία της επιχείρησης.'
    if (!values.name.trim()) next.name = FORM_ERRORS.REQUIRED_NAME
    if (!values.industry) next.industry = FORM_ERRORS.REQUIRED_INDUSTRY
    if (!values.email.trim()) next.email = FORM_ERRORS.REQUIRED_EMAIL
    else if (!isValidEmail(values.email)) next.email = FORM_ERRORS.INVALID_EMAIL
    if (!values.contact.trim()) next.contact = 'Πείτε μας πώς να επικοινωνήσουμε μαζί σας.'
    // Website is optional on purpose — not having one is a reason to apply.
    if (values.website.trim() && !normaliseUrl(values.website))
      next.website = FORM_ERRORS.INVALID_URL
    return next
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return

    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) {
      setStatus('error')
      setFormError(FORM_ERRORS.FIX_MARKED_FIELDS)
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
      setFormError(result.error ?? FORM_ERRORS.SUBMIT_FAILED)
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
            σας — είτε γίνει δεκτή είτε όχι.
          </p>
          <p className="mx-auto mt-4 max-w-[46ch] text-[0.85rem] leading-[1.7] text-muted font-body">
            Δεν γίνονται όλες οι αιτήσεις δεκτές. Αν η δική σας δεν επιλεγεί, θα σας
            προτείνουμε εναλλακτικές.
          </p>
          <p className="mx-auto mt-4 max-w-[46ch] text-[0.85rem] leading-[1.7] text-muted font-body">
            Αν γίνει δεκτή, το μόνο βήμα από εσάς είναι να ανοίξετε λογαριασμό
            hosting στη <strong className="text-ink">Hostinger</strong> — σας
            καθοδηγούμε βήμα-βήμα, με απλά λόγια, και αναλαμβάνουμε εμείς όλη την
            τεχνική εγκατάσταση.
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
            Μόνο τα βασικά — χρειάζεται περίπου 2 λεπτά. Τα υπόλοιπα τα συζητάμε αν
            προχωρήσουμε.
          </p>

          {/* The one thing an applicant must not discover after they have
              already applied: design and deployment are free, hosting is not,
              and hosting always means Hostinger — never a different provider,
              never bundled into our price. Stated once, plainly, before the
              fields rather than buried in a bullet list. */}
          <div className="mt-5 flex gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 sm:px-5">
            <Globe2 aria-hidden strokeWidth={2} className="mt-0.5 h-4 w-4 flex-shrink-0 text-warm-ink" />
            <p className="text-[0.8rem] leading-[1.7] text-muted font-body">
              Ο σχεδιασμός, η κατασκευή σε WordPress και η δημοσίευση είναι εντελώς
              δωρεάν — μαζί με φόρμα επικοινωνίας και βασικά εργαλεία SEO, όλα έτοιμα
              από την πρώτη μέρα. Το μόνο που πληρώνετε εσείς είναι το hosting, πάντα
              μέσω <strong className="text-ink">Hostinger</strong> — του μοναδικού
              πάροχου με τον οποίο συνεργαζόμαστε.
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
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

            <TextField
              id={ids.name}
              name="name"
              label="Ονοματεπώνυμο"
              required
              autoComplete="name"
              placeholder="Όνομα και επώνυμο"
              value={values.name}
              onChange={(v) => set('name', v)}
              error={errors.name}
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

            {/* Owners here often prefer Viber or WhatsApp to email, so the field
                asks for whichever channel suits them rather than a phone number. */}
            <TextField
              id={ids.contact}
              name="contact"
              label="Τηλέφωνο ή Viber / WhatsApp"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Ό,τι σας βολεύει"
              value={values.contact}
              onChange={(v) => set('contact', v)}
              error={errors.contact}
            />

            <SelectField
              id={ids.industry}
              name="industry"
              label="Κλάδος"
              required
              options={INDUSTRIES}
              value={values.industry}
              onChange={(v) => set('industry', v)}
              error={errors.industry}
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
              hint="Προαιρετικό — αν δεν έχετε, δεν είναι μειονέκτημα."
            />

            <SelectField
              id={ids.template}
              name="template"
              label="Στιλ που σας αρέσει"
              options={TEMPLATE_OPTIONS}
              value={values.template}
              onChange={(v) => set('template', v)}
              error={errors.template}
              placeholder="Δεν είμαι σίγουρος/η ακόμα"
              hint="Δείτε παραδείγματα στο saos.studio/examples — προαιρετικό, το αποφασίζουμε μαζί."
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
              Απαντάμε είτε η αίτηση γίνει δεκτή είτε όχι.{' '}
              <a href="/free-website" className="font-semibold text-ink underline">
                Τι περιλαμβάνει
              </a>
              .
            </p>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="btn-accent flex-shrink-0 justify-center px-8 py-3.5 text-[0.85rem] disabled:opacity-70"
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
