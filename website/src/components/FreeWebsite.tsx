import { useState } from 'react'
import Doodle from './Doodle'
import ApplicationModal from './ApplicationModal'

/**
 * The page's main conversion point: apply for a free website.
 *
 * Deliberately short. This used to carry nine blocks — intro, who it is for,
 * what is included, what is not, acceptance rate, secondary link, CTA — which
 * is a page's worth of content in a section. All of it still exists, on
 * `/free-website`; what stays here is the offer, one line, and one action.
 *
 * The reasoning behind the split: the inclusion lists and the acceptance rate
 * are reassurance, and reassurance answers objections that a reader only has
 * once they are interested. Putting them in front of someone who has not yet
 * understood the offer makes an unusually generous thing read as a catch.
 *
 * Tone stays flat. The one honest limit — not every application is accepted —
 * stays in the section rather than moving to the page, because it is the one
 * fact a reader should not be able to miss before they click.
 */
export default function FreeWebsite() {
  const [open, setOpen] = useState(false)

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-card bg-break text-white on-dark px-8 py-12 sm:px-12 sm:py-14 lg:px-16">
        <Doodle
          variant="burst"
          className="absolute -top-2 right-6 hidden h-24 w-24 opacity-80 lg:block"
        />

        <div className="relative max-w-3xl">
          <h2 className="text-headline on-dark text-[clamp(1.9rem,4.6vw,3.1rem)]">
            Κάνε αίτηση για ένα <em>δωρεάν website.</em>
          </h2>

          <p className="mt-6 max-w-[64ch] text-[1rem] leading-[1.8] text-white/70 font-body">
            Δεν είναι διαγωνισμός ούτε δοκιμή: μια ιστοσελίδα που σχεδιάζουμε και
            κατασκευάζουμε χωρίς χρέωση, για επιχειρήσεις που επιλέγουμε κάθε μήνα.
          </p>

          <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="btn-accent w-full justify-center px-9 py-4 text-center text-[0.9rem] sm:w-auto"
            >
              Κάνε αίτηση σε 2 λεπτά <span aria-hidden>→</span>
            </button>

            <a
              href="/free-website"
              className="group link-arrow text-[0.88rem] font-bold text-white/75 transition-colors duration-200 hover:text-warm font-body"
            >
              Τι περιλαμβάνει και ποιοι επιλέγονται
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>

          {/* The honest limit stays here rather than moving to the page. The
              acceptance figure itself does not: it is still unconfirmed by the
              owner, so it lives on /free-website inside a Placeholder. */}
          <p className="mt-7 max-w-[72ch] text-[0.8rem] leading-[1.65] text-white/50 font-body">
            Χρειάζεται περίπου 2 λεπτά. Δεν ζητάμε κάρτα και δεν υπάρχει δέσμευση. Οι
            αιτήσεις αξιολογούνται με συγκεκριμένα κριτήρια και δεν γίνονται όλες δεκτές.
          </p>
        </div>
      </div>

      <ApplicationModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
