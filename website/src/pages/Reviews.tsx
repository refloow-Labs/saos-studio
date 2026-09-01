import { Star } from 'lucide-react'
import Layout from '../components/Layout'
import Chapter from '../components/Chapter'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import {
  reviews,
  formatReviewDate,
  initialsOf,
  REVIEWS_ARE_SAMPLES,
  type Review,
} from '../lib/reviews'

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${rating} στα 5 αστέρια`}
    >
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
    <figure className="h-full rounded-card border border-border bg-white p-6">
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
          <span className="block text-[0.85rem] font-extrabold leading-tight text-ink">
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

/**
 * `/reviews` — the page structure, with the social proof still to come.
 *
 * Every review below is invented (see the warning at the top of lib/reviews.ts).
 * A whole page of fabricated testimonials is a bigger claim than the homepage
 * strip, so the disclosure is the first thing after the heading, each card keeps
 * its «Δείγμα» badge, and the schema for this route emits **no** `Review` or
 * `AggregateRating` node — that markup goes in the same commit that replaces
 * these with real Google reviews, never before.
 *
 * The static grid here is deliberate: the homepage uses a drifting wall, and
 * repeating that effect on a dedicated page makes the reviews harder to read
 * rather than more impressive.
 */
export default function ReviewsPage() {
  return (
    <Layout>
      <Chapter id="reviews-intro" tone="white" className="pt-36 md:pt-44">
        <PageHeader
          eyebrow="Κριτικές"
          doodle="circle"
          title={
            <>
              Οι πελάτες μας, με <em>δικά τους λόγια.</em>
            </>
          }
        />

      </Chapter>

      <Chapter id="kritikes" tone="gray">
        <h2 className="sr-only">Κριτικές πελατών</h2>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal as="li" key={review.id} delay={i * 60} className="h-full">
              <ReviewCard review={review} />
            </Reveal>
          ))}
        </ul>
      </Chapter>

      <Chapter id="reviews-cta" tone="dark">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-headline text-[clamp(1.8rem,4vw,2.8rem)]">
            Θέλετε να είστε ο <em>επόμενος;</em>
          </h2>
          <p className="mx-auto mt-5 max-w-[50ch] text-[0.98rem] leading-[1.8] text-white/70 font-body">
            Πείτε μας για την επιχείρησή σας και θα σας πούμε ειλικρινά τι θα προτείναμε.
          </p>
          <a
            href="/request-a-quote"
            className="btn-accent mt-9 justify-center px-8 py-4 text-[0.9rem]"
          >
            Ζητήστε προσφορά <span aria-hidden>→</span>
          </a>
        </div>
      </Chapter>
    </Layout>
  )
}
