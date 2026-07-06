import { ReactNode } from 'react'

interface Props {
  id: string
  children: ReactNode
  className?: string
  tone?: 'white' | 'gray'
}

/**
 * A full-bleed content section. Alternates a white or light-gray background
 * and holds a centered max-width container. Static, generous vertical rhythm.
 */
export default function Chapter({ id, children, className = '', tone = 'white' }: Props) {
  return (
    <section
      id={id}
      className={`relative w-full ${
        tone === 'gray' ? 'bg-surface' : 'bg-bg'
      } px-5 sm:px-8 md:px-12 py-24 md:py-32 ${className}`}
    >
      <div className="relative w-full max-w-6xl mx-auto">{children}</div>
    </section>
  )
}
