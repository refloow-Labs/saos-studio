import { useState } from 'react'
import { Plus } from 'lucide-react'
import Layout from '../components/Layout'
import Chapter from '../components/Chapter'
import PageHeader from '../components/PageHeader'
import { faqsByCategory, type Faq } from '../lib/faqs'

function Item({ faq, index }: { faq: Faq; index: number }) {
  const [open, setOpen] = useState(false)
  const panelId = `faq-panel-${faq.slug}`
  const buttonId = `faq-${faq.slug}`

  return (
    <li id={buttonId} className="scroll-mt-32 border-b border-border">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex w-full items-start justify-between gap-6 py-6 text-left"
        >
          <span className="flex items-start gap-5">
            <span
              aria-hidden
              className="flex-shrink-0 pt-1 text-[0.75rem] font-extrabold text-muted"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-[1rem] font-bold leading-snug text-ink transition-colors duration-200 group-hover:text-warm-ink">
              {faq.q}
            </span>
          </span>
          <Plus
            aria-hidden
            strokeWidth={2.5}
            className={`mt-0.5 h-5 w-5 flex-shrink-0 text-ink transition-transform duration-300 ${
              open ? 'rotate-45' : ''
            }`}
          />
        </button>
      </h3>

      {/* Always rendered, collapsed with the `hidden` attribute rather than
          conditional rendering. Google requires FAQPage answers to exist on the
          page, and this route marks up all twelve — omitting them from the DOM
          would have the JSON-LD describe content no crawler can find. `hidden`
          still keeps them out of the accessibility tree and the reading order. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className="pb-7 pl-10 pr-2"
      >
        <p className="max-w-[68ch] text-[0.92rem] leading-[1.8] text-muted font-body">{faq.a}</p>

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
}

export default function FaqPage() {
  const groups = faqsByCategory()

  return (
    <Layout>
      <Chapter id="faq-intro" tone="white" className="pt-36 md:pt-44">
        <PageHeader
          eyebrow="Συχνές ερωτήσεις"
          doodle="arrow"
          title={
            <>
              Ό,τι μας ρωτούν <em>πριν ξεκινήσουμε.</em>
            </>
          }
          lead="Κόστος, χρόνος, hosting, αλλαγές και υποστήριξη. Αν δεν βρίσκετε την απάντησή σας, ρωτήστε μας απευθείας."
        />

        <nav aria-label="Κατηγορίες ερωτήσεων" className="mt-10">
          <ul className="flex flex-wrap gap-3">
            {groups.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-[0.78rem] font-bold text-muted transition-colors duration-200 hover:border-border-hover hover:text-ink font-body"
                >
                  {g.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Chapter>

      <Chapter id="faq-list" tone="gray">
        <div className="mx-auto max-w-3xl space-y-14">
          {groups.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-32">
              <h2 className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-muted font-body">
                {group.label}
              </h2>
              <ul className="mt-5 border-t border-border">
                {group.items.map((faq, i) => (
                  <Item key={faq.slug} faq={faq} index={i} />
                ))}
              </ul>
            </section>
          ))}

          {/* See the matching note in components/Faq.tsx: the per-answer
              «Προς επιβεβαίωση» badge is the honest disclosure. An aggregate
              count of unverified answers is internal QA state, not visitor copy. */}
        </div>
      </Chapter>

      <Chapter id="faq-cta" tone="white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-headline text-[clamp(1.6rem,3.4vw,2.4rem)]">
            Δεν βρήκατε την <em>απάντησή σας;</em>
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] text-[0.95rem] leading-[1.8] text-muted font-body">
            Γράψτε μας την ερώτησή σας στη φόρμα προσφοράς και θα σας απαντήσουμε
            συγκεκριμένα για την περίπτωσή σας.
          </p>
          <a
            href="/request-a-quote"
            className="btn-accent mt-8 justify-center px-8 py-4 text-[0.9rem]"
          >
            Ρωτήστε μας <span aria-hidden>→</span>
          </a>
        </div>
      </Chapter>
    </Layout>
  )
}
