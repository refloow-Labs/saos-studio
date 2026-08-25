# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Small businesses and sole traders in **Thrace — Alexandroupoli, Samothraki and the
surrounding region**. Confirmed by the owner as the primary market; the studio is
local to it rather than serving Greece at large.

Typical situation: the business has real customers and real trade, but little or
no presence online, or a presence that represents it worse than it deserves. There
is no marketing person and no time. Decisions are made by one owner-operator, often
between other jobs.

The job they are hiring the site to do: be findable, and be credible to someone who
is deciding between them and two or three alternatives before making contact.

Sectors seen in the enquiry forms and demo range: hospitality (hotels, rooms,
short-lets), food service (café, restaurant, bar), health and wellbeing, retail,
trades and services, freelancers, education.

## Product Purpose

Design and build websites for those businesses, and optionally keep them visible in
search afterwards. Success is the business receiving enquiries — calls, bookings,
messages — that it would not otherwise have received.

## Positioning

**A small team you talk to directly, that tells you when you need less.** The
differentiator the owner stands behind is direct access to the people who design and
build, and advice that is honest against the studio's own short-term interest.

> **Resolved (Aug 2026) — stated position.** The site used to lead with "AI for
> speed, human designer for quality, days instead of months", which is *not* the
> same claim as the one above. The owner chose the small-team/honesty position, and
> the AI-speed framing has been removed from the three places it was load-bearing:
> `public/llms.txt`, the `Organization` description in `src/lib/schema.ts`, and the
> FAQ answer `giati-oikonomikoi`. AI is no longer part of the pitch — the remaining
> mentions in `story.ts` describe Rhooa Labs, the parent company, and are accurate.

> **Resolved (Aug 2026) — service area is regional.** `schema.ts` now publishes an
> `areaServed` array of named administrative places (Ανατολική Μακεδονία και Θράκη,
> Έβρος, Αλεξανδρούπολη, Σαμοθράκη) instead of `Country/Greece`, and the copy in
> `Hero.tsx`, `index.html`, `seo.ts` and `llms.txt` says Θράκη rather than Ελλάδα or
> Βόρεια Ελλάδα. Deliberately **not** a `GeoCircle` — that would require publishing
> a midpoint and radius, and deliberately still **not** a `LocalBusiness` node,
> which stays forbidden while no address or phone is published.

## Operating Context

- Enquiries arrive from an owner who may prefer phone, Viber or WhatsApp over email;
  the application form asks for whichever channel suits them.
- Clients frequently arrive without material: no logo, no written copy, no usable
  photography. Guiding them to assemble it is part of the work.
- Their customers browse predominantly on phones.
- Everything customer-facing is Greek (`lang="el"`). English appears only inside two
  demo samples.
- Hosting and domain are bought by the client directly from a provider; the studio
  configures but does not resell them.

## Capabilities and Constraints

- **Two commercial models.** A one-time build (the product), and an optional monthly
  SEO subscription that can start or stop at any time. A custom package combines
  them plus e-shop, CMS, multilingual or booking features.
- **Prices are withdrawn and unpublished** (August 2026, pending repricing). The
  former €46/€52/€83 tiers must not be quoted anywhere, including by AI crawlers —
  `public/llms.txt` says so explicitly. Structured data carries no `Offer` price and
  no `AggregateOffer`.
- **Free website evaluation.** A visitor submits a URL and is sent to Google
  PageSpeed Insights; a written report optionally follows.
- **Free website programme.** Applications for a no-charge build, with stated
  acceptance criteria. The ~20% acceptance rate is unconfirmed and rendered as a
  `Placeholder`.
- **No form backend.** Every form calls `submit()` in `src/lib/submit.ts`, which
  persists to `localStorage` and always resolves success. The integration seam is
  documented in that file. Until it is wired, submissions are lost, and the quote
  page carries email and Calendly as a working fallback.
- **The site is prerendered static.** Eleven routes are real HTML files; there is no
  SPA fallback and `base` stays `'/'`. Adding a route means an entry in
  `src/lib/seo.ts` and one in the `pages` map in `src/App.tsx`; the build fails if
  they disagree.
- Terminology as published: «Ανάπτυξη ιστοσελίδων», «Προώθηση ιστοσελίδων»,
  «Custom-made πακέτο».

## Brand Commitments

- **SAOS** comes from Σάος, the mountain on Samothraki. It is not an acronym, and
  `schema.ts` states this so search engines and models resolve it as a place name.
- The studio is the **web division of Rhooa Labs** (`rhooalabs.com`), stated as a
  `parentOrganization` relationship rather than as two separate companies.
- Contact: `saos.ventures@gmail.com`; discovery calls via the Calendly link in
  `src/lib/seo.ts`. Languages Greek and English.
- Named team of three, with real photographs in `public/team/`.
- Voice: plain, unhyped, and willing to state its own limits in public — the SEO
  section says outright that nobody can guarantee a Google ranking.
- Greek banner words are authored uppercase **in the markup**, never via
  `text-transform`, because Greek drops the tonos in all-caps.

## Evidence on Hand

**There is no real proof yet. The studio is pre-first-client.** Confirmed by the
owner. Future work must not present any of the following as genuine, and must not
invent replacements:

- The eight demos in `public/work/` depict **fabricated businesses** — invented
  names, addresses, staff, opening hours, review counts and testimonials. They are
  presented as design samples only, each carries `noindex,follow`, and
  `public/llms.txt` discloses it.
- The nine reviews in `src/lib/reviews.ts` are **invented**, and are no longer
  shown anywhere: `REVIEWS_PUBLISHED = false` hides the homepage strip and
  unpublishes the `/reviews` route entirely. **No `Review` or `AggregateRating`
  JSON-LD is emitted anywhere**, and none may be added until real reviews exist.
- Unconfirmed and rendered as `Placeholder`: year founded, number of sites
  delivered, typical delivery timeline. The free-programme **acceptance rate was
  removed outright** — a hard «20%» inside a dashed box still reads as a claim,
  and the owner never confirmed it. Selectivity is stated without a number.
- Not yet supplied: business phone, social profiles, and the Greek statutory
  business details (επωνυμία, έδρα, ΑΦΜ/ΔΟΥ, ΓΕΜΗ) that a commercial site must
  publish. `/terms` is structure only and needs a lawyer.

## Product Principles

1. **Never claim what cannot be shown.** With no client work yet, honest absence
   beats invented proof; every gap ships as a visible `Placeholder` rather than
   plausible filler.
2. **Tell the customer when they need less.** Advice against the studio's own
   short-term interest is the position, so the product must be able to say "this
   won't help you" and still convert.
3. **The client owns what they paid for.** Credentials, domain and site are handed
   over; nothing is held hostage as retention.
4. **Speak to an owner, not a marketing department.** Few, short interactions and
   plainly named steps; no jargon that assumes in-house expertise.
5. **Local specificity beats national generality.** The market is a region, not a
   country, and the product should read as though it knows the place.

## Accessibility & Inclusion

- **WCAG 2.2 AA is the working floor**, verified by measurement rather than
  assumption: text contrast is sampled against actually-rendered pixels, and pointer
  targets are checked against SC 2.5.8 including its spacing exception.
- `prefers-reduced-motion` must degrade to an *intentional* alternative — reveals
  become instant rather than absent — never a blanket animation kill.
- Mobile-first is an accessibility requirement here, not a preference: the audience's
  own customers browse on phones.
- Greek is the primary language and must render correctly, including the tonos rule
  above.
