import { useMemo, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import Layout from '../components/Layout'
import Chapter from '../components/Chapter'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Modal from '../components/Modal'
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

      {/* Case-study breakdowns. `caseStudy` is unpopulated for now, so this
          renders nothing rather than inventing briefs — see projects.ts. */}
      {projects.some((p) => p.caseStudy) && (
        <Chapter id="case-studies" tone="white">
          <h2 className="text-headline text-[clamp(1.6rem,3.2vw,2.4rem)] max-w-[20ch]">
            Πώς σκεφτήκαμε <em>κάθε δείγμα.</em>
          </h2>
          <div className="mt-12 space-y-16">
            {projects
              .filter((p) => p.caseStudy)
              .map((p) => (
                <Reveal key={p.slug}>
                  <article className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
                    <div>
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-warm-ink font-body">
                        {p.category}
                      </span>
                      <h3 className="mt-2 text-headline text-[clamp(1.3rem,2.4vw,1.8rem)]">
                        {p.name}
                      </h3>
                    </div>
                    <div>
                      <h4 className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-muted font-body">
                        Το ζητούμενο
                      </h4>
                      <p className="mt-3 max-w-[60ch] text-[0.93rem] leading-[1.8] text-ink font-body">
                        {p.caseStudy!.brief}
                      </p>

                      <h4 className="mt-7 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-muted font-body">
                        Σχεδιαστικές αποφάσεις
                      </h4>
                      <ul className="mt-3 space-y-2.5">
                        {p.caseStudy!.decisions.map((d) => (
                          <li
                            key={d}
                            className="max-w-[60ch] border-l border-border pl-4 text-[0.9rem] leading-[1.75] text-muted font-body"
                          >
                            {d}
                          </li>
                        ))}
                      </ul>

                      <h4 className="mt-7 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-muted font-body">
                        Τι δείχνει
                      </h4>
                      <p className="mt-3 max-w-[60ch] text-[0.9rem] leading-[1.8] text-muted font-body">
                        {p.caseStudy!.demonstrates}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
          </div>
        </Chapter>
      )}

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

      <Modal
        open={preview !== null}
        onClose={() => setPreview(null)}
        title={preview ? `Προεπισκόπηση — ${preview.name}` : ''}
      >
        {preview && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-3">
              <p className="text-[0.8rem] text-muted font-body">
                <span className="font-bold text-ink">{preview.category}</span> ·{' '}
                {preview.description}
              </p>
              <a
                href={`/work/${preview.slug}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex-shrink-0 px-5 py-2 text-[0.75rem]"
              >
                Νέα καρτέλα <ExternalLink aria-hidden className="h-3.5 w-3.5" />
              </a>
            </div>
            <iframe
              key={preview.slug}
              src={`/work/${preview.slug}/`}
              title={`Προεπισκόπηση ιστοσελίδας: ${preview.name}`}
              loading="lazy"
              className="h-[70svh] w-full border-0 bg-white"
            />
          </div>
        )}
      </Modal>
    </Layout>
  )
}
