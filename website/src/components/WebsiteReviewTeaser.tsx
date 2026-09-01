import Doodle from './Doodle'

/**
 * Compact lead-magnet CTA for /website-review. Mirrors FreeWebsite's shape —
 * one offer, one line, one action — rather than restating what the tool page
 * already explains in full.
 */
export default function WebsiteReviewTeaser() {
  return (
    <div className="relative overflow-hidden rounded-card border border-border bg-white px-8 py-12 sm:px-12 sm:py-14 lg:px-16">
      <Doodle
        variant="sparkle"
        className="absolute -top-2 right-6 hidden h-20 w-20 opacity-70 lg:block"
      />

      <div className="relative max-w-3xl">
        <h2 className="text-headline text-[clamp(1.7rem,4vw,2.6rem)]">
          Πόσο γρήγορο είναι το site σας, <em>στα αλήθεια;</em>
        </h2>

        <p className="mt-5 max-w-[62ch] text-[0.95rem] leading-[1.8] text-muted font-body">
          Δωρεάν εργαλείο: βάλτε τη διεύθυνσή σας και δείτε σε λίγα δευτερόλεπτα την ίδια
          μέτρηση ταχύτητας που κάνει η Google.
        </p>

        <div className="mt-8">
          <a href="/website-review" className="btn-accent px-8 py-3.5 text-[0.88rem]">
            Δωρεάν αξιολόγηση <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </div>
  )
}
