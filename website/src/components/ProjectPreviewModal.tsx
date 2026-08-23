import { ExternalLink } from 'lucide-react'
import Modal from './Modal'
import { type Project } from '../lib/projects'

interface Props {
  /** The project to preview, or `null` when the dialog is closed. */
  project: Project | null
  onClose: () => void
}

/**
 * The live preview dialog for a demo site — the same body was written inline in
 * `Portfolio`, `Examples` and (once the hero gained a carousel) would have been
 * written a third time. Three near-identical copies of an iframe plus a header
 * row is exactly the kind of thing that drifts apart one copy at a time, so it
 * lives here once.
 *
 * Framing works because `netlify.toml` carves `/work/*` out of the sitewide
 * `X-Frame-Options: DENY` / `frame-ancestors 'none'` down to `SAMEORIGIN` /
 * `frame-ancestors 'self'`. Those headers do not exist on the dev server, so a
 * regression here only shows up in production.
 */
export default function ProjectPreviewModal({ project, onClose }: Props) {
  return (
    <Modal
      open={project !== null}
      onClose={onClose}
      title={project ? `Προεπισκόπηση — ${project.name}` : ''}
    >
      {project && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-3">
            <p className="text-[0.8rem] text-muted font-body">
              <span className="font-bold text-ink">{project.category}</span> ·{' '}
              {project.description}
            </p>
            <a
              href={`/work/${project.slug}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex-shrink-0 px-5 py-2 text-[0.75rem]"
            >
              Νέα καρτέλα <ExternalLink aria-hidden className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Same-origin static file, so it frames without any header dance.
              Keyed on the slug so switching projects remounts rather than
              leaving the previous demo on screen while the next one loads.
              Mounted only while the dialog is open — hidden iframes behind the
              carousel would be one extra page load per slide. */}
          <iframe
            key={project.slug}
            src={`/work/${project.slug}/`}
            title={`Προεπισκόπηση ιστοσελίδας: ${project.name}`}
            loading="lazy"
            className="h-[70svh] w-full border-0 bg-white"
          />
        </div>
      )}
    </Modal>
  )
}
