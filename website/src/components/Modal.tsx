import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  /** Accessible name for the dialog. Rendered unless `hideTitle`. */
  title: string
  /** Keep the title for assistive tech but omit it visually. */
  hideTitle?: boolean
  children: ReactNode
  /** Tailwind max-width utility for the panel. */
  size?: string
  className?: string
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'

/**
 * Accessible dialog: focus trap, Escape to close, backdrop click, body scroll
 * lock, and focus returned to whatever opened it.
 *
 * Shared by the project preview and the application form so the two cannot
 * drift apart — a half-correct focus trap in one of them is exactly the kind of
 * bug that never shows up in manual testing but strands keyboard users.
 */
export default function Modal({
  open,
  onClose,
  title,
  hideTitle = false,
  children,
  size = 'max-w-5xl',
  className = '',
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const titleId = useId()

  /* Consumers pass `onClose` as an inline arrow, so its identity changes on
     every render of the parent. Reading it through a ref keeps the effect below
     keyed on `open` alone — otherwise the trap tore itself down and rebuilt on
     each render, stealing focus back to the panel and firing the return-focus
     cleanup in the middle of an interaction. */
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!open) return

    returnFocusRef.current = document.activeElement as HTMLElement | null

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab') return

      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (!nodes?.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Focus the panel itself rather than the first control, so a screen reader
    // announces the dialog's name before its contents.
    panelRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      returnFocusRef.current?.focus?.()
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
      onMouseDown={(e) => {
        // Only a press that both starts and ends on the backdrop closes it —
        // otherwise a drag that ends outside the panel dismisses the dialog.
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div aria-hidden className="absolute inset-0 bg-ink/70 backdrop-blur-sm" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative w-full ${size} max-h-[90svh] flex flex-col overflow-hidden rounded-card bg-white shadow-2xl outline-none ${className}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <h2
            id={titleId}
            className={`text-[1rem] font-extrabold text-ink leading-tight ${
              hideTitle ? 'sr-only' : ''
            }`}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Κλείσιμο"
            className="ml-auto inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border text-ink transition-colors duration-200 hover:bg-surface"
          >
            <X aria-hidden className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
