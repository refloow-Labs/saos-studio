import { Star } from 'lucide-react'
import SectionOpener from './SectionOpener'
import {
  reviews,
  formatReviewDate,
  initialsOf,
  REVIEWS_ARE_SAMPLES,
  type Review,
} from '../lib/reviews'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} στα 5 αστέρια`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden
          className={`h-4 w-4 ${i <= rating ? 'fill-warm text-warm' : 'fill-none text-ink/20'}`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="rounded-card border border-border bg-white p-6 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)]">
      <div className="flex items-start justify-between gap-3">
        <Stars rating={review.starRating} />
        {REVIEWS_ARE_SAMPLES && (
          <span className="flex-shrink-0 rounded-full bg-warm-soft px-2 py-0.5 text-[0.6rem] font-extrabold uppercase tracking-[0.1em] text-warm-ink font-body">
            Δείγμα
          </span>
        )}
      </div>

      <blockquote className="mt-4 text-[0.9rem] leading-[1.75] text-ink/80 font-body">
        {review.comment}
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        {/* Initials rather than a photo. A stock headshot on an invented review
            would make fabricated content look like a real, identifiable person. */}
        <span
          aria-hidden
          className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-surface-3 text-[0.72rem] font-extrabold text-ink font-body"
        >
          {initialsOf(review.author)}
        </span>
        <span className="min-w-0">
          <span className="block text-[0.85rem] font-extrabold text-ink leading-tight">
            {review.author}
          </span>
          <span className="block text-[0.72rem] text-muted font-body">
            {review.source} · {formatReviewDate(review.createTime)}
          </span>
        </span>
      </figcaption>
    </figure>
  )
}

/** Splits the reviews round-robin so the columns stay roughly equal in height. */
function columnsOf(items: Review[], count: number): Review[][] {
  const cols: Review[][] = Array.from({ length: count }, () => [])
  items.forEach((item, i) => cols[i % count].push(item))
  return cols
}

const COLUMN_COUNT = 3
/** Per-column drift durations. Different speeds stop the wall reading as a block. */
const SPEEDS = ['52s', '64s', '46s']

/**
 * «Τι λένε για εμάς» — a wall of review cards drifting slowly upward.
 *
 * Every review is invented; see the warning at the top of lib/reviews.ts. The
 * section says so in three places (banner, per-card badge, closing note) and no
 * `Review`/`AggregateRating` JSON-LD is emitted, because structured data for
 * fabricated reviews is a policy violation rather than merely misleading.
 */
export default function Reviews() {
  const columns = columnsOf(reviews, COLUMN_COUNT)

  return (
    <div className="w-full">
      <SectionOpener
        word="ΤΙ ΛΕΝΕ ΓΙΑ ΕΜΑΣ"
        heading={
          <>
            Οι πελάτες μας, με <em>δικά τους λόγια.</em>
          </>
        }
        doodle="circle"
      />

      {/* Fixed-height viewport with the columns drifting inside it. */}
      <div
        className="review-wall relative mt-12 h-[560px] overflow-hidden md:h-[620px]"
        style={{
          // Fades the cards out at both edges instead of clipping them flat.
          maskImage:
            'linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent)',
        }}
      >
        <div className="grid h-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {columns.map((column, ci) => (
            <div
              key={ci}
              /* The 2nd and 3rd columns only exist at wider breakpoints; the
                 grid hides them, so their cards are still in the DOM for
                 assistive tech via the first (non-duplicated) pass. */
              className={ci === 1 ? 'hidden sm:block' : ci === 2 ? 'hidden lg:block' : ''}
            >
              <div
                className={`review-column flex flex-col gap-5 ${ci === 1 ? 'is-reverse' : ''}`}
                style={{ ['--drift' as string]: SPEEDS[ci] }}
              >
                {column.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
                {/* Second pass makes the loop seamless. Hidden from the
                    accessibility tree so nothing is announced twice. */}
                <div aria-hidden className="flex flex-col gap-5">
                  {column.map((review) => (
                    <ReviewCard key={`${review.id}-loop`} review={review} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-10 text-center text-[0.82rem] text-muted font-body">
        Το ποντίκι πάνω από τις κριτικές σταματά την κίνηση.
      </p>
    </div>
  )
}
