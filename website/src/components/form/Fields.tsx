import type { ReactNode } from 'react'

/**
 * Form field primitives shared by `ApplicationModal` and `QuoteForm`.
 *
 * Extracted when the quote page landed: both forms need the same error styling,
 * the same `aria-invalid` / `aria-describedby` wiring and the same hint-plus-
 * error description order, and two copies of that would drift — the accessible
 * wiring is exactly the sort of detail that gets fixed in one place only.
 *
 * Each field owns its own label, hint, error and describedby composition. The
 * caller supplies an `id` (from `useId`) and the state; nothing here holds state
 * of its own, so both forms keep their own validation and submission flow.
 */

const base =
  'w-full rounded-2xl border bg-white px-4 py-3 text-[0.9rem] text-ink font-body outline-none transition-colors duration-200 placeholder:text-muted'

export const labelClass = 'block text-[0.82rem] font-extrabold text-ink mb-2'
export const errorClass = 'mt-1.5 text-[0.78rem] font-semibold text-warm-ink font-body'
export const hintClass = 'mt-1.5 text-[0.78rem] text-muted font-body'

function controlClass(hasError: boolean, extra = '') {
  return `${base} ${hasError ? 'border-warm-dim' : 'border-border focus:border-ink'} ${extra}`
}

/**
 * Hint first, then error. Screen readers announce descriptions in this order, and
 * hearing "optional" before "that address looks wrong" is the useful sequence.
 */
function describedBy(id: string, hint?: ReactNode, error?: string) {
  const parts = []
  if (hint) parts.push(`${id}-hint`)
  if (error) parts.push(`${id}-err`)
  return parts.length ? parts.join(' ') : undefined
}

interface Common {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: ReactNode
}

function Label({ id, label, required }: Pick<Common, 'id' | 'label' | 'required'>) {
  return (
    <label htmlFor={id} className={labelClass}>
      {label} {required && <span className="text-warm-ink">*</span>}
    </label>
  )
}

function Messages({ id, hint, error }: Pick<Common, 'id' | 'hint' | 'error'>) {
  return (
    <>
      {hint && (
        <p id={`${id}-hint`} className={hintClass}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className={errorClass}>
          {error}
        </p>
      )}
    </>
  )
}

interface TextFieldProps extends Common {
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'tel'
  inputMode?: 'text' | 'url' | 'email' | 'tel'
  autoComplete?: string
  placeholder?: string
  name: string
}

export function TextField({
  id,
  label,
  required,
  error,
  hint,
  value,
  onChange,
  type = 'text',
  inputMode,
  autoComplete,
  placeholder,
  name,
}: TextFieldProps) {
  return (
    <div>
      <Label id={id} label={label} required={required} />
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, hint, error)}
        placeholder={placeholder}
        className={controlClass(!!error)}
      />
      <Messages id={id} hint={hint} error={error} />
    </div>
  )
}

interface TextareaFieldProps extends Common {
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  name: string
}

export function TextareaField({
  id,
  label,
  required,
  error,
  hint,
  value,
  onChange,
  rows = 4,
  placeholder,
  name,
}: TextareaFieldProps) {
  return (
    <div>
      <Label id={id} label={label} required={required} />
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, hint, error)}
        placeholder={placeholder}
        className={controlClass(!!error, 'resize-y')}
      />
      <Messages id={id} hint={hint} error={error} />
    </div>
  )
}

interface SelectFieldProps extends Common {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  name: string
}

export function SelectField({
  id,
  label,
  required,
  error,
  hint,
  value,
  onChange,
  options,
  placeholder = 'Επιλέξτε…',
  name,
}: SelectFieldProps) {
  return (
    <div>
      <Label id={id} label={label} required={required} />
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, hint, error)}
        className={controlClass(!!error)}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <Messages id={id} hint={hint} error={error} />
    </div>
  )
}

interface RadioGroupFieldProps extends Common {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string; desc?: string }[]
  name: string
}

/**
 * A `fieldset`/`legend` group rather than a styled select.
 *
 * The choice here ("new site / redesign / SEO") changes what the whole enquiry
 * is about, so all three options should be visible at once rather than hidden
 * behind a dropdown. `id` goes on the first input so focus-to-first-error still
 * lands somewhere focusable.
 */
export function RadioGroupField({
  id,
  label,
  required,
  error,
  hint,
  value,
  onChange,
  options,
  name,
}: RadioGroupFieldProps) {
  return (
    <fieldset>
      <legend className={labelClass}>
        {label} {required && <span className="text-warm-ink">*</span>}
      </legend>
      <div
        className="grid gap-3 sm:grid-cols-3"
        aria-describedby={describedBy(id, hint, error)}
      >
        {options.map((o, i) => {
          // The first input carries the group's `id` so focus-to-first-error can
          // reach it; the rest get a derived one. The label must point at
          // whichever this option actually rendered.
          const optionId = i === 0 ? id : `${id}-${o.value}`
          const selected = value === o.value
          return (
            <label
              key={o.value}
              htmlFor={optionId}
              className={`flex cursor-pointer flex-col rounded-2xl border bg-white p-4 transition-colors duration-200 ${
                selected
                  ? 'border-ink ring-1 ring-ink'
                  : error
                    ? 'border-warm-dim'
                    : 'border-border hover:border-border-hover'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <input
                  id={optionId}
                  type="radio"
                  name={name}
                  value={o.value}
                  checked={selected}
                  onChange={() => onChange(o.value)}
                  aria-invalid={!!error}
                  className="h-4 w-4 flex-shrink-0 accent-warm"
                />
                <span className="text-[0.88rem] font-bold text-ink font-body">{o.label}</span>
              </span>
              {o.desc && (
                <span className="mt-1.5 pl-[1.65rem] text-[0.78rem] leading-[1.6] text-muted font-body">
                  {o.desc}
                </span>
              )}
            </label>
          )
        })}
      </div>
      <Messages id={id} hint={hint} error={error} />
    </fieldset>
  )
}
