import Layout from '../components/Layout'

/**
 * Rendered for any path the app doesn't recognise. Prerendered to `dist/404.html`,
 * which Netlify serves — with a real 404 status — for unmatched URLs. Before this
 * existed, the SPA fallback answered every URL with the homepage at status 200.
 */
export default function NotFoundPage() {
  return (
    <Layout mainClassName="px-6 md:px-12 pt-32 md:pt-40 pb-24 min-h-[60svh] flex items-center">
      <div className="max-w-[44rem] mx-auto w-full">
          <p className="text-[0.6rem] tracking-[0.22em] uppercase font-semibold text-accent/70 font-body mb-6">
            Σφάλμα 404
          </p>

          <h1 className="text-headline text-[clamp(2.4rem,6vw,4rem)] mb-8">
            Η σελίδα δεν <em>βρέθηκε.</em>
          </h1>

          <p className="text-muted text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.7] font-body max-w-[46ch] mb-11">
            Η διεύθυνση που ζητήσατε δεν υπάρχει ή έχει μετακινηθεί. Επιστρέψτε στην
            αρχική σελίδα ή δείτε τα έργα μας.
          </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <a href="/" className="btn-primary justify-center px-9 py-4 text-[0.9rem]">
            Αρχική σελίδα <span aria-hidden>→</span>
          </a>
          <a href="/examples" className="btn-outline justify-center px-9 py-4 text-[0.9rem]">
            Δείτε τα Έργα μας
          </a>
        </div>
      </div>
    </Layout>
  )
}
