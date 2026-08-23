import { LayoutTemplate, TrendingUp, Puzzle, Check } from 'lucide-react'
import Layout from '../components/Layout'
import Chapter from '../components/Chapter'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { services, type ServiceIcon } from '../lib/services'

const icons: Record<ServiceIcon, typeof LayoutTemplate> = {
  build: LayoutTemplate,
  grow: TrendingUp,
  custom: Puzzle,
}

/**
 * `/services` — one page, three deep sections rather than three sub-routes.
 *
 * Each service keeps the `id` it already had (`#anaptyxi`, `#proothisi`,
 * `#custom`), because those anchors are what the `Offer.url` values in the
 * JSON-LD point at. Splitting into sub-routes would break that link and give
 * each page too little content to stand on.
 *
 * No prices anywhere. What the sections do carry is the *model* — εφάπαξ versus
 * μηνιαία συνδρομή versus κατόπιν προσφοράς — which is the distinction a visitor
 * needs before asking for a number.
 */
export default function ServicesPage() {
  return (
    <Layout>
      <Chapter id="services-intro" tone="white" className="pt-36 md:pt-44">
        <PageHeader
          eyebrow="Υπηρεσίες"
          doodle="arrow"
          title={
            <>
              Οι υπηρεσίες που <em>προσφέρουμε.</em>
            </>
          }
          lead="Από την κατασκευή μέχρι την προβολή. Διαλέξτε ό,τι χρειάζεστε — ή πείτε μας τι θέλετε να πετύχετε και το χτίζουμε μαζί."
        />

        {/* Jump list. Three deep sections is enough content that landing at the
            top and scrolling is a worse experience than choosing. */}
        <nav aria-label="Υπηρεσίες" className="mt-12">
          <ul className="grid gap-4 sm:grid-cols-3">
            {services.map((s) => {
              const Icon = icons[s.icon]
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="group flex h-full flex-col rounded-2xl border border-border bg-white p-5 transition-colors duration-200 hover:border-border-hover"
                  >
                    <span className="flex items-center gap-3">
                      <Icon aria-hidden className="h-5 w-5 text-warm-dim" strokeWidth={2} />
                      <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.14em] text-muted font-body">
                        {s.num}
                      </span>
                    </span>
                    <span className="mt-3 text-[0.95rem] font-extrabold leading-snug text-ink font-body">
                      {s.name}
                    </span>
                    <span className="mt-1.5 text-[0.78rem] font-semibold text-muted font-body">
                      {s.pricingLabel}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </Chapter>

      {services.map((service, index) => {
        const Icon = icons[service.icon]
        return (
          <Chapter
            key={service.id}
            id={service.id}
            tone={index % 2 === 0 ? 'gray' : 'white'}
          >
            <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <span className="flex items-center gap-3">
                  <Icon aria-hidden className="h-6 w-6 text-warm-dim" strokeWidth={2} />
                  <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-muted font-body">
                    {service.num}
                  </span>
                </span>

                <h2 className="mt-4 text-headline text-[clamp(1.7rem,3.4vw,2.5rem)]">
                  {service.name}
                </h2>

                <p className="mt-3 inline-flex rounded-full bg-warm-soft px-3 py-1.5 text-[0.74rem] font-extrabold uppercase tracking-[0.08em] text-warm-ink font-body">
                  {service.pricingLabel}
                </p>

                <p className="mt-5 max-w-[46ch] text-[0.95rem] leading-[1.8] text-muted font-body">
                  {service.summary}
                </p>

                <a
                  href="/request-a-quote"
                  className="btn-accent mt-7 justify-center px-7 py-3.5 text-[0.85rem]"
                >
                  {service.ctaLabel} <span aria-hidden>→</span>
                </a>
              </div>

              <div>
                <p className="max-w-[62ch] text-[1rem] leading-[1.85] text-ink font-body">
                  {service.detailLead}
                </p>

                <div className="mt-10 space-y-9">
                  {service.detailGroups.map((group, i) => (
                    <Reveal key={group.title} delay={i * 60}>
                      <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-muted font-body">
                        {group.title}
                      </h3>
                      <ul className="mt-4 space-y-3 border-t border-border pt-4">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-[0.92rem] leading-[1.7] text-ink font-body"
                          >
                            <Check
                              aria-hidden
                              strokeWidth={3}
                              className="mt-1 h-4 w-4 flex-shrink-0 text-warm-dim"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  ))}
                </div>

                {service.detailCaveat && (
                  <p className="mt-9 max-w-[62ch] border-l-2 border-warm pl-5 text-[0.87rem] leading-[1.8] text-muted font-body">
                    {service.detailCaveat}
                  </p>
                )}
              </div>
            </div>
          </Chapter>
        )
      })}

      <Chapter id="services-cta" tone="dark">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-headline text-[clamp(1.8rem,4vw,2.8rem)]">
            Δεν είστε σίγουροι τι <em>χρειάζεστε;</em>
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-[0.98rem] leading-[1.8] text-white/70 font-body">
            Οι περισσότερες επιχειρήσεις δεν είναι, και δεν πειράζει. Πείτε μας τι θέλετε
            να πετύχετε και θα σας προτείνουμε τι έχει νόημα — ακόμα κι αν αυτό σημαίνει
            λιγότερα από όσα σκεφτόσασταν.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/request-a-quote"
              className="btn-accent justify-center px-8 py-4 text-[0.9rem]"
            >
              Ζητήστε προσφορά <span aria-hidden>→</span>
            </a>
            <a
              href="/how-it-works"
              className="btn-on-dark justify-center px-8 py-4 text-[0.9rem]"
            >
              Δείτε πώς λειτουργεί
            </a>
          </div>
        </div>
      </Chapter>
    </Layout>
  )
}
