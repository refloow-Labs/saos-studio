import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  direction?: 'up' | 'left' | 'right' | 'scale'
  delay?: number
  className?: string
  duration?: number
}

/**
 * Static pass-through. The redesign is intentionally motion-free, so this no
 * longer animates — it just renders its children. Kept as a component (with the
 * old prop signature) so existing call sites don't need to change.
 */
export default function ScrollReveal({ children, className = '' }: Props) {
  return <div className={className}>{children}</div>
}
