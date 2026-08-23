import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  /**
   * What the owner has to supply, in plain words. Shown on hover and read by
   * screen readers, and used as the entry in PLACEHOLDERS.md.
   */
  note: string
  /** Render inline (inside a sentence) rather than as a block. */
  inline?: boolean
  className?: string
}

/**
 * Wraps content that is invented scaffolding and must be replaced before launch.
 *
 * Deliberately loud: a dashed amber outline on a tinted ground, impossible to
 * skim past during review. The brief is explicit that nothing may be quietly
 * fabricated — sample reviews, business details and legal text all pass through
 * here so "we forgot to swap that out" cannot happen silently.
 *
 * The marker styling is not stripped in production on purpose. If a placeholder
 * ever reaches the live site it should be embarrassing on the page rather than
 * invisible to everyone except the next person to read the source.
 */
export default function Placeholder({ children, note, inline = false, className = '' }: Props) {
  const Tag = inline ? 'span' : 'div'
  return (
    <Tag
      className={`placeholder-mark ${inline ? 'inline' : 'block'} ${className}`}
      data-placeholder={note}
      title={`Placeholder — ${note}`}
    >
      <span className="sr-only">Placeholder προς αντικατάσταση: {note}. </span>
      {children}
    </Tag>
  )
}
