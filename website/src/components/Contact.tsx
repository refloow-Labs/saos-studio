import { useState } from 'react'
import SectionLabel from './SectionLabel'
import { faqs } from '../lib/faqs'

export default function Contact() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div id="contact" className="w-full">
      {/* Black CTA card */}
      <div className="rounded-card bg-ink text-white px-7 sm:px-12 md:px-16 py-14 md:py-20 text-center">
        <h2 className="text-headline text-[clamp(2.2rem,5.5vw,4.2rem)] text-white">
          Ας φτιάξουμε κάτι <span className="text-white/45">όμορφο.</span>
        </h2>
        <p className="text-white/60 text-[0.95rem] font-medium mt-5 mb-10">
          Απάντηση εντός 24 ωρών. Χωρίς δέσμευση.
        </p>
        <a
          href="https://calendly.com/tambakisgiannis/refloow-labs-discovery-call"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-on-dark px-10 py-4 text-[0.9rem]"
        >
          Κλείστε Δωρεάν Κλήση <span aria-hidden>→</span>
        </a>
      </div>

      {/* FAQ */}
      <div id="faq" className="max-w-3xl mx-auto mt-24 md:mt-32">
        <div className="text-center mb-12">
          <SectionLabel text="Συχνές Ερωτήσεις" />
          <h3 className="text-headline text-[clamp(1.8rem,4vw,2.8rem)]">
            Ερωτήσεις; <em>Απαντήσεις.</em>
          </h3>
        </div>

        <div className="border-t border-border">
          {faqs.map((f, i) => {
            const isOpen = openIndex === i
            return (
              <div key={i} className="border-b border-border">
                <button
                  className="w-full py-6 flex items-start justify-between text-left gap-6 group"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-5">
                    <span className="text-[0.75rem] text-muted-2 font-extrabold pt-1 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[1rem] font-bold leading-snug text-ink">
                      {f.q}
                    </span>
                  </div>
                  <span
                    className={`flex-shrink-0 mt-0.5 text-ink text-xl leading-none transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <p className="pl-10 pb-6 text-muted text-[0.9rem] leading-[1.75] font-body">
                    {f.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
