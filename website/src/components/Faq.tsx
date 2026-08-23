import { useState } from 'react'
import { Plus } from 'lucide-react'
import SectionOpener from './SectionOpener'
import Reveal from './Reveal'
import { homeFaqs } from '../lib/faqs'

/**
 * «Συχνές ερωτήσεις» — the last objection-handling surface before the footer.
 *
 * Follows the APG disclosure pattern rather than a tab-style accordion: each
 * question is a `<button aria-expanded aria-controls>` inside an `<h3>`, and its
 * answer is a labelled region. Several can be open at once — people scanning an
 * FAQ compare answers, and forcing one open at a time makes that harder.
 *
 * Renders `homeFaqs()`, a six-question subset, **not** the full list — /faq now
 * carries all twelve. The homepage's FAQPage JSON-LD is built from exactly this
 * same subset, so the markup can never claim answers the page does not show.
 */
export default function Faq() {
  const [open, setOpen] = useState<Set<string>>(new Set())
  const faqs = homeFaqs()

  function toggle(slug: string) {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  const unverified = faqs.filter((f) => f.needsReview).length

  return (
    <div className="w-full">
      <SectionOpener
        word="ΕΡΩΤΗΣΕΙΣ"
        heading={
          <>
            Συχνές <em>ερωτήσεις.</em>
          </>
        }
        body="Οι έξι που μας ρωτούν συνηθέστερα. Δείτε όλες τις ερωτήσεις για κόστος, χρόνους, hosting και υποστήριξη."
        doodle="arrow"
      />

      <div className="mx-auto mt-14 max-w-3xl">
        <ul className="border-t border-border">
          {faqs.map((faq, i) => {
            const isOpen = open.has(faq.slug)
            const panelId = `faq-panel-${faq.slug}`
            const buttonId = `faq-${faq.slug}`

            return (
              <li key={faq.slug} id={buttonId} className="border-b border-border">
                <h3>
                  <button
                    type="button"
                    onClick={() => toggle(faq.slug)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                  >
                    <span className="flex items-start gap-5">
                      <span
                        aria-hidden
                        className="flex-shrink-0 pt-1 text-[0.75rem] font-extrabold text-muted"
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[1rem] font-bold leading-snug text-ink transition-colors duration-200 group-hover:text-warm-ink">
                        {faq.q}
                      </span>
                    </span>
                    <Plus
                      aria-hidden
                      strokeWidth={2.5}
                      className={`mt-0.5 h-5 w-5 flex-shrink-0 text-ink transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    />
                  </button>
                </h3>

                {/* Always rendered, collapsed with the `hidden` attribute rather
                    than conditional rendering. Google requires FAQPage answers to
                    exist on the page — omitting them from the DOM made the markup
                    describe content no crawler could find. `hidden` still keeps
                    them out of the accessibility tree and the reading order. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="pb-7 pl-10 pr-2"
                >
                  <p className="text-[0.92rem] leading-[1.8] text-muted font-body">{faq.a}</p>

                  {faq.needsReview && (
                    <span className="mt-3 inline-block rounded-full bg-warm-soft px-2.5 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-warm-ink font-body">
                      Προς επιβεβαίωση από τον ιδιοκτήτη
                    </span>
                  )}

                  {faq.link && (
                    <p className="mt-4">
                      <a
                        href={faq.link.href}
                        className="link-arrow text-[0.85rem] font-bold text-ink transition-colors duration-200 hover:text-warm-ink"
                      >
                        {faq.link.label} <span aria-hidden>→</span>
                      </a>
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ul>

        <Reveal className="mt-9 text-center">
          <a
            href="/faq"
            className="group link-arrow text-[0.88rem] font-bold text-ink transition-colors duration-200 hover:text-warm-ink"
          >
            Δείτε όλες τις συχνές ερωτήσεις
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </Reveal>

        {unverified > 0 && (
          <Reveal className="mt-6">
            <p className="text-center text-[0.78rem] leading-[1.7] text-muted font-body">
              {unverified} απαντήσεις περιέχουν στοιχεία που πρέπει να επιβεβαιωθούν πριν
              τη δημοσίευση (χρόνοι παράδοσης, όροι υποστήριξης, κριτήρια αποδοχής).
            </p>
          </Reveal>
        )}
      </div>
    </div>
  )
}
