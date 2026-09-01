import { useState } from 'react'
import Modal from './Modal'
import EvaluationForm from './EvaluationForm'
import MountSaos from './MountSaos'

/**
 * The free-evaluation ask.
 *
 * One idea, stated once: a good-looking site is not the point — bringing
 * visits, bookings and customers is. Everything else has been cut. This
 * replaced three numbered arguments plus an inline form, which together ran to
 * most of a screen and buried the one action the section exists to prompt.
 *
 * Two things here are load-bearing and easy to remove by accident:
 *
 * `id="evaluation"` is linked from `lib/faqs.ts` as `/#evaluation` (the answer
 * about taking on an existing site). Renaming it silently breaks that link —
 * nothing in the build checks cross-page anchors.
 *
 * The CTA opens `EvaluationForm` in a dialog rather than embedding it. This
 * section is the form's only route into the site, so dropping the form
 * altogether would strand the whole free-evaluation funnel; putting it in a
 * dialog keeps the section to a single action while leaving the funnel intact.
 *
 * The component and its `#giati-website` chapter id keep their old names on
 * purpose — renaming files and anchors for a copy change is churn with a real
 * chance of breaking an inbound link.
 */
export default function WhyWebsite() {
  const [open, setOpen] = useState(false)

  return (
    <div id="evaluation" className="relative isolate w-full scroll-mt-32 overflow-hidden">
      {/*
        The hero's ridgeline again, at roughly half its strength and anchored
        low so it sits under the copy rather than behind it. Decorative only.
        Width is the content column rather than the viewport: a `w-screen`
        break-out would need its own clipping ancestor, and this is background
        texture, not a composition element.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-[14%] -z-10 h-[max(170px,min(26vw,360px))] text-warm"
      >
        <MountSaos className="h-full w-full" opacity={0.1} />
      </div>

      <div className="mx-auto flex max-w-[44rem] flex-col items-center text-center">
        {/* `.on-dark` comes from Chapter tone="dark", which renders the heading
            white and the <em> in the warm accent. */}
        <h2 className="text-headline text-[clamp(1.9rem,4.4vw,3.15rem)]">
          <em>Δωρεάν</em> αξιολόγηση της υπάρχουσας σελίδας σας.
        </h2>

        {/* Four sentences, so the measure widens toward the ~65ch cap in
            REDESIGN.md and the type steps down; at the previous 50ch it ran to
            eight centred lines and stopped reading as a single thought. The
            closing line is emphasised because it is the one that sets up the
            button underneath it.

            This is the one place on the homepage that states the positioning
            outright. It is deliberately not repeated in the modal below, on
            /services or on /reviews — it used to appear six times sitewide and
            read as a tic rather than a promise. */}
        <p className="mt-6 max-w-[62ch] text-[clamp(0.95rem,1.2vw,1.08rem)] leading-[1.8] text-white/70 font-body">
          Οι περισσότερες παλιές ιστοσελίδες δεν θέλουν πέταμα. Θέλουν να
          φορτώνουν γρήγορα στο κινητό, να λένε καθαρά τι κάνετε και να κάνουν
          εύκολο το επόμενο βήμα για τον πελάτη σας.{' '}
          <span className="font-semibold text-white">
            Αξιολογούμε δωρεάν τι χρειάζεστε και σχεδιάζουμε μαζί την επόμενη
            σας ψηφιακή εικόνα.
          </span>
        </p>

        {/* Full width on mobile so the long Greek label has room to sit on one
            line; it wraps rather than overflowing if it still cannot. */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-accent mt-10 w-full justify-center px-7 py-4 text-center text-[0.9rem] sm:w-auto sm:px-9 sm:text-[0.95rem]"
        >
          Λάβετε δωρεάν αξιολόγηση της ιστοσελίδας <span aria-hidden>→</span>
        </button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Δωρεάν αξιολόγηση ιστοσελίδας"
        size="max-w-2xl"
      >
        <div className="px-6 py-6 sm:px-8">
          <p className="max-w-[54ch] text-[0.9rem] leading-[1.8] text-muted font-body">
            Ανοίγουμε αμέσως την ανάλυση της Google για τη σελίδα σας: ταχύτητα
            φόρτωσης, εμφάνιση στο κινητό, βασικά τεχνικά. Αν αφήσετε και email,
            τη διαβάζουμε εμείς και σας στέλνουμε τι αξίζει να διορθώσετε — και
            τι μπορείτε να αφήσετε όπως είναι.
          </p>
          <EvaluationForm className="mt-6" />
        </div>
      </Modal>
    </div>
  )
}
