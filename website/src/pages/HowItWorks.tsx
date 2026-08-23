import Layout from '../components/Layout'
import Chapter from '../components/Chapter'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Placeholder from '../components/Placeholder'
import { processStages, phaseLabels, type ProcessPhase } from '../lib/process'
import { storyPlaceholders } from '../lib/story'

/** Stages grouped by phase, preserving the order both arrays declare. */
function grouped() {
  const order: ProcessPhase[] = ['discovery', 'design', 'build', 'after']
  return order
    .map((phase) => ({
      phase,
      label: phaseLabels[phase],
      stages: processStages.filter((s) => s.phase === phase),
    }))
    .filter((g) => g.stages.length > 0)
}

export default function HowItWorksPage() {
  return (
    <Layout>
      <Chapter id="process-intro" tone="white" className="pt-36 md:pt-44">
        <PageHeader
          eyebrow="Πώς λειτουργεί"
          doodle="squiggle"
          title={
            <>
              Από την πρώτη κουβέντα μέχρι τη <em>δημοσίευση.</em>
            </>
          }
          lead="Οκτώ βήματα, χωρίς εκπλήξεις. Ξέρετε από την αρχή τι θα γίνει, πότε θα το δείτε και τι χρειαζόμαστε από εσάς σε κάθε στάδιο."
        />

        <Reveal className="mt-10">
          <Placeholder
            note={storyPlaceholders.timeline}
            className="max-w-[62ch] p-4 text-[0.85rem] leading-[1.75] font-body"
          >
            Τυπικός συνολικός χρόνος παράδοσης — προς επιβεβαίωση από τον ιδιοκτήτη πριν
            δημοσιευτεί συγκεκριμένο διάστημα.
          </Placeholder>
        </Reveal>
      </Chapter>

      {grouped().map((group, gi) => (
        <Chapter
          key={group.phase}
          id={`phase-${group.phase}`}
          tone={gi % 2 === 0 ? 'gray' : 'white'}
        >
          <h2 className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-muted font-body">
            {group.label}
          </h2>

          <ol className="mt-8 space-y-12">
            {group.stages.map((stage) => (
              <Reveal as="li" key={stage.slug} className="scroll-mt-32">
                <div id={stage.slug} className="grid gap-5 md:grid-cols-[6rem_1fr] md:gap-8">
                  <span
                    aria-hidden
                    className="text-display text-[clamp(2.2rem,5vw,3.4rem)] leading-none text-muted"
                  >
                    {stage.num}
                  </span>

                  <div>
                    <h3 className="text-headline text-[clamp(1.2rem,2.2vw,1.65rem)]">
                      {stage.label}
                      {stage.optional && (
                        <span className="ml-3 align-middle rounded-full bg-warm-soft px-2.5 py-1 text-[0.6rem] font-extrabold uppercase tracking-[0.1em] text-warm-ink font-body">
                          Προαιρετικό
                        </span>
                      )}
                    </h3>

                    <p className="mt-4 max-w-[64ch] text-[0.95rem] leading-[1.85] text-muted font-body">
                      {stage.desc}
                    </p>

                    {stage.youProvide && (
                      <p className="mt-4 max-w-[58ch] border-l-2 border-warm pl-4 text-[0.87rem] leading-[1.75] text-ink font-body">
                        <span className="font-extrabold">Τι χρειαζόμαστε από εσάς:</span>{' '}
                        {stage.youProvide}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </Chapter>
      ))}

      <Chapter id="process-cta" tone="dark">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-headline text-[clamp(1.8rem,4vw,2.8rem)]">
            Έτοιμοι να <em>ξεκινήσουμε;</em>
          </h2>
          <p className="mx-auto mt-5 max-w-[50ch] text-[0.98rem] leading-[1.8] text-white/70 font-body">
            Το πρώτο βήμα είναι δύο λεπτά. Δεν σας δεσμεύει σε τίποτα και θα λάβετε
            γραπτή πρόταση πριν αποφασίσετε.
          </p>
          <a
            href="/request-a-quote"
            className="btn-accent mt-9 justify-center px-8 py-4 text-[0.9rem]"
          >
            Ζητήστε προσφορά σε 2 λεπτά <span aria-hidden>→</span>
          </a>
        </div>
      </Chapter>
    </Layout>
  )
}
