import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import SectionOpener from './SectionOpener'
import Carousel from './Carousel'
import Reveal from './Reveal'
import Modal from './Modal'
import ProjectCard from './ProjectCard'
import { projects, type Project } from '../lib/projects'

export default function Portfolio() {
  const [preview, setPreview] = useState<Project | null>(null)
  const featured = projects.filter((p) => p.featured)

  return (
    <div className="w-full">
      <SectionOpener
        word="ΕΡΓΑ"
        heading={
          <>
            Μερικά από τα <em>έργα</em> μας.
          </>
        }
        body="Δείγματα σχεδιασμού που φτιάξαμε για να δείξουμε το εύρος της δουλειάς μας, από εστίαση και φιλοξενία μέχρι υγεία. Πατήστε σε όποιο θέλετε για προεπισκόπηση."
        doodle="burst"
      />

      {/* The honesty line. These are invented businesses, and the section must
          never imply otherwise — see the note at the top of lib/projects.ts. */}
      <Reveal className="mt-6">
        <p className="mx-auto max-w-[62ch] text-center text-[0.8rem] leading-[1.7] text-white/45 font-body">
          Σημείωση: πρόκειται για δείγματα σχεδιασμού. Οι επιχειρήσεις, τα στοιχεία
          επικοινωνίας και οι κριτικές που εμφανίζονται σε αυτά είναι φανταστικά.
        </p>
      </Reveal>

      <Carousel
        label="Δείγματα σχεδιασμού"
        onDark
        align="center"
        emphasizeActive
        autoAdvanceMs={4000}
        slideClassName="w-[80%] sm:w-[52%] lg:w-[38%]"
        className="mt-10 md:mt-14"
        slides={featured.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            onPreview={setPreview}
            onDark
          />
        ))}
      />

      {/* Was `#paradeigmata`, the grid that used to sit directly below. That grid
          is now /examples, where all eight live with their category filter. */}
      <Reveal className="mt-12 flex justify-center">
        <a href="/examples" className="btn-on-dark px-8 py-3.5 text-[0.85rem]">
          Δείτε όλα τα έργα μας <span aria-hidden>→</span>
        </a>
      </Reveal>

      <Modal
        open={preview !== null}
        onClose={() => setPreview(null)}
        title={preview ? `Προεπισκόπηση: ${preview.name}` : ''}
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

            {/* Same-origin static file, so it frames without any header dance.
                Loaded only while the dialog is open — mounting eight hidden
                iframes with the carousel would be eight extra page loads. */}
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
    </div>
  )
}
