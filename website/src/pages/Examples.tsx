import { useMemo, useState } from 'react'
import Layout from '../components/Layout'
import Chapter from '../components/Chapter'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import ProjectPreviewModal from '../components/ProjectPreviewModal'
import ProjectCard from '../components/ProjectCard'
import { projects, type Project } from '../lib/projects'

const ALL = 'Όλα'

/**
 * `/examples` — every design sample, grouped by industry.
 *
 * These depict **invented businesses**. The names, addresses, staff and review
 * counts in `public/work/` were fabricated to show design range, and
 * `public/llms.txt` says so. The disclosure below is not boilerplate: without it
 * a page titled «Έργα» reads as a client list. Nothing here may be phrased as
 * "our clients", and no traffic, ranking or revenue figure appears anywhere —
 * there is no campaign behind these to measure.
 */
export default function ExamplesPage() {
  const [preview, setPreview] = useState<Project | null>(null)
  const [filter, setFilter] = useState(ALL)

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(projects.map((p) => p.category)))],
    [],
  )

  const visible = filter === ALL ? projects : projects.filter((p) => p.category === filter)

  return (
    <Layout>
      <Chapter id="examples-intro" tone="white" className="pt-36 md:pt-44">
        <PageHeader
          eyebrow="Έργα"
          doodle="burst"
          title={
            <>
              Δείγματα σχεδιασμού από <em>διαφορετικούς κλάδους.</em>
            </>
          }
          lead="Από εστίαση και φιλοξενία μέχρι υγεία και βραχυχρόνια μίσθωση. Πατήστε σε όποιο θέλετε για προεπισκόπηση της πλήρους σελίδας."
        />

        {/* The disclosure sits above the work, not in a footnote under it. */}
        <Reveal className="mt-9">
          <p className="max-w-[64ch] border-l-2 border-warm pl-5 text-[0.9rem] leading-[1.8] text-muted font-body">
            <span className="font-extrabold text-ink">
              Αυτά είναι δείγματα σχεδιασμού, όχι έργα πελατών.
            </span>{' '}
            Οι επιχειρήσεις που παρουσιάζονται είναι φανταστικές — τα ονόματα, οι
            διευθύνσεις και τα στοιχεία επικοινωνίας δημιουργήθηκαν για να δείξουμε το
            εύρος της δουλειάς μας. Δεν παρουσιάζουμε νούμερα επισκεψιμότητας ή
            αποτελεσμάτων, γιατί πίσω τους δεν υπάρχει πραγματική καμπάνια.
          </p>
        </Reveal>
      </Chapter>

      <Chapter id="paradeigmata" tone="gray">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="sr-only">Κατηγορίες έργων</h2>
          {categories.map((c) => {
            const active = c === filter
            return (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-[0.78rem] font-bold transition-colors duration-200 font-body ${
                  active
                    ? 'border-ink bg-ink text-white'
                    : 'border-border bg-white text-muted hover:border-border-hover hover:text-ink'
                }`}
              >
                {c}
              </button>
            )
          })}
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, i) => (
            <Reveal as="li" key={project.slug} delay={i * 70} className="h-full">
              <ProjectCard project={project} onPreview={setPreview} />
            </Reveal>
          ))}
        </ul>

        <p role="status" aria-live="polite" className="mt-8 text-[0.82rem] text-muted font-body">
          {visible.length} από {projects.length} δείγματα
          {filter !== ALL && ` στην κατηγορία «${filter}»`}.
        </p>
      </Chapter>

      {/* The case-study breakdowns that used to sit here have been removed.
          `caseStudy` is declared on Project but populated on none of the eight
          samples, and it never will be for these: there is no client and no
          campaign behind them, so a "brief" and "results" would be invented
          alongside the businesses. The layout is recoverable from git history if
          real client work ever earns the section. */}

      <Chapter id="examples-cta" tone="dark">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-headline text-[clamp(1.8rem,4vw,2.8rem)]">
            Θέλετε κάτι <em>δικό σας;</em>
          </h2>
          <p className="mx-auto mt-5 max-w-[50ch] text-[0.98rem] leading-[1.8] text-white/70 font-body">
            Πείτε μας για την επιχείρησή σας και θα σας δείξουμε τι θα προτείναμε — με
            συγκεκριμένο κόστος και χρονοδιάγραμμα.
          </p>
          <a
            href="/request-a-quote"
            className="btn-accent mt-9 justify-center px-8 py-4 text-[0.9rem]"
          >
            Ζητήστε προσφορά <span aria-hidden>→</span>
          </a>
        </div>
      </Chapter>

      <ProjectPreviewModal project={preview} onClose={() => setPreview(null)} />
    </Layout>
  )
}
