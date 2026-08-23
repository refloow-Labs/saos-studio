import type { ReactNode } from 'react'

interface Props {
  /** The section's `h2`. */
  children: ReactNode
  body?: ReactNode
  align?: 'left' | 'center'
  /** Widen past the default measure for short, punchy headings. */
  size?: 'md' | 'lg'
  className?: string
}

/**
 * A section heading with no banner word.
 *
 * The counterpart to `SectionOpener`, which pairs an oversized Greek banner word
 * with the `h2`. That opener is the site's signature, and using it on every
 * section was turning the page into one repeated rhythm: banner, centred
 * heading, centred paragraph, content. Nine times.
 *
 * The banner word is now rationed to three sections (Έργα, Τι λένε για εμάς,
 * Ερωτήσεις) where it marks a real gear change. Everything else opens with this:
 * the headline alone, usually left-aligned, doing the work a label was doing.
 */
export default function SectionHeading({
  children,
  body,
  align = 'left',
  size = 'md',
  className = '',
}: Props) {
  const centered = align === 'center'
  return (
    <div className={`${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`}>
      <h2
        className={`text-headline ${
          size === 'lg'
            ? 'text-[clamp(1.9rem,4.2vw,3.1rem)]'
            : 'text-[clamp(1.6rem,3.2vw,2.4rem)]'
        } max-w-[20ch] ${centered ? 'mx-auto' : ''}`}
      >
        {children}
      </h2>

      {body && (
        <p
          className={`mt-5 text-[0.98rem] leading-[1.8] font-body opacity-70 max-w-[54ch] ${
            centered ? 'mx-auto' : ''
          }`}
        >
          {body}
        </p>
      )}
    </div>
  )
}
