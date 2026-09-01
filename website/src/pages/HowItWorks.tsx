import {
  MessageCircle,
  FileText,
  CheckCircle2,
  Palette,
  Code2,
  RefreshCw,
  Rocket,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import Layout from '../components/Layout'
import Chapter from '../components/Chapter'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { processStages, phaseLabels, type ProcessPhase } from '../lib/process'

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

/** One icon per stage, keyed by slug — a visual anchor `processStages` (the
 * schema.org HowTo source) has no reason to carry itself. */
const STAGE_ICON: Record<string, LucideIcon> = {
  'peite-mas': MessageCircle,
  protasi: FileText,
  egkrisi: CheckCircle2,
  schediasmos: Palette,
  anaptyxi: Code2,
  diorthoseis: RefreshCw,
  dimosiefsi: Rocket,
  'miniaio-seo': TrendingUp,
}

const PHASE_ORDER: ProcessPhase[] = ['discovery', 'design', 'build', 'after']

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

        {/* Overview stepper — the four phases at a glance, each linking to its
            chapter below. Read top-to-bottom on mobile, left-to-right on
            desktop; the connecting line is one element behind all four dots so
            it never needs to be redrawn per breakpoint. */}
        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute left-[1.1rem] top-2 h-[calc(100%-1rem)] w-px bg-border sm:left-0 sm:top-[1.1rem] sm:h-px sm:w-full"
          />
          <ol className="relative flex flex-col gap-6 sm:flex-row sm:justify-between sm:gap-4">
            {PHASE_ORDER.map((phase, i) => (
              <li key={phase} className="flex items-center gap-4 sm:flex-col sm:items-center sm:gap-3 sm:text-center">
                <a
                  href={`#phase-${phase}`}
                  className="group flex items-center gap-4 sm:flex-col sm:gap-3"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-warm text-[0.8rem] font-extrabold text-white ring-4 ring-bg transition-transform duration-200 group-hover:scale-110">
                    {i + 1}
                  </span>
                  <span className="text-[0.82rem] font-bold text-ink font-body sm:max-w-[10ch]">
                    {phaseLabels[phase]}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
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

          {/* Vertical timeline: a single rail behind every icon node in this
              phase, each node linking to its own anchor. The rail is measured
              off the icon column (2.75rem wide, centred) rather than a fixed
              offset, so it lines up regardless of font metrics. */}
          <ol className="relative mt-10">
            <div
              aria-hidden
              className="absolute left-[1.375rem] top-3 bottom-3 w-px bg-border"
            />
            {group.stages.map((stage) => {
              const Icon = STAGE_ICON[stage.slug] ?? CheckCircle2
              return (
                <Reveal as="li" key={stage.slug} className="scroll-mt-32">
                  <div id={stage.slug} className="relative grid gap-5 pb-12 last:pb-0 md:grid-cols-[2.75rem_1fr] md:gap-8">
                    <div className="relative flex md:flex-col md:items-center">
                      <span className="relative z-10 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-warm-soft text-warm-ink ring-4 ring-bg">
                        <Icon aria-hidden className="h-5 w-5" strokeWidth={2} />
                      </span>
                      <span
                        aria-hidden
                        className="ml-3 text-display text-[1.3rem] leading-none text-muted md:ml-0 md:mt-2"
                      >
                        {stage.num}
                      </span>
                    </div>

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
              )
            })}
          </ol>
        </Chapter>
      ))}

      <Chapter id="process-cta" tone="dark">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-headline text-[clamp(1.8rem,4vw,2.8rem)]">
            Τώρα ξέρετε ακριβώς τι <em>θα γίνει.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-[50ch] text-[0.98rem] leading-[1.8] text-white/70 font-body">
            Μένει μόνο το πρώτο βήμα. Δεν σας δεσμεύει σε τίποτα και σταματάει
            εδώ αν η πρόταση δεν σας πείσει.
          </p>
          <a
            href="/request-a-quote"
            className="btn-accent mt-9 justify-center px-8 py-4 text-[0.9rem]"
          >
            Ζητήστε γραπτή προσφορά <span aria-hidden>→</span>
          </a>
        </div>
      </Chapter>
    </Layout>
  )
}
