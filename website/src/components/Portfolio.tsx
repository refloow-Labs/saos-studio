import { useState } from 'react'
import SectionOpener from './SectionOpener'
import Carousel from './Carousel'
import Reveal from './Reveal'
import ProjectPreviewModal from './ProjectPreviewModal'
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

      <ProjectPreviewModal project={preview} onClose={() => setPreview(null)} />
    </div>
  )
}
