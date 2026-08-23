import { Maximize2 } from 'lucide-react'
import type { Project } from '../lib/projects'

interface Props {
  project: Project
  /** Opens the in-page preview. Omit to make the card a plain link. */
  onPreview?: (project: Project) => void
  onDark?: boolean
}

/**
 * One example card. Shared by the homepage carousel and the «Παραδείγματα» grid.
 *
 * Rendered as a real `<a href>` even when it opens a modal: that keeps
 * middle-click, ⌘-click and no-JS working, and the click handler only
 * intercepts a plain left click.
 */
export default function ProjectCard({ project, onPreview, onDark = false }: Props) {
  const src = project.hasFullCapture ? 'full' : 'thumb'

  return (
    <a
      href={`/work/${project.slug}/`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (!onPreview) return
        // Let the browser handle modified clicks — new tab, new window, download.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        onPreview(project)
      }}
      className={`group flex h-full flex-col rounded-card overflow-hidden transition-colors duration-300 ${
        onDark
          ? 'bg-white/5 ring-1 ring-white/10 hover:ring-white/25'
          : 'bg-white border border-border hover:border-border-hover'
      }`}
    >
      <div
        className={`relative overflow-hidden bg-white ${
          project.hasFullCapture ? 'aspect-[820/620]' : 'aspect-[16/10]'
        }`}
      >
        <picture>
          <source srcSet={`/work/${project.slug}/${src}.webp`} type="image/webp" />
          <img
            src={`/work/${project.slug}/${src}.jpg`}
            alt={`Δείγμα σχεδιασμού: ${project.name} — ${project.category}`}
            width={820}
            height={620}
            loading="lazy"
            decoding="async"
            className={
              project.hasFullCapture
                ? 'demo-scroll absolute inset-x-0 top-0 w-full h-auto'
                : 'w-full h-full object-cover object-top'
            }
          />
        </picture>
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t ${
            onDark ? 'from-break/80' : 'from-ink/25'
          } to-transparent`}
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span
          className={`text-[0.68rem] tracking-[0.16em] uppercase font-bold font-body ${
            onDark ? 'text-warm' : 'text-warm-ink'
          }`}
        >
          {project.category}
        </span>
        <h3
          className={`mt-2 text-[1.05rem] font-extrabold leading-tight ${
            onDark ? 'text-white' : 'text-ink'
          }`}
        >
          {project.name}
        </h3>
        <p
          className={`mt-2 flex-1 text-[0.85rem] leading-[1.7] font-body ${
            onDark ? 'text-white/55' : 'text-muted'
          }`}
        >
          {project.description}
        </p>
        <span
          className={`mt-5 inline-flex items-center gap-2 text-[0.8rem] font-bold transition-colors duration-200 ${
            onDark
              ? 'text-white/70 group-hover:text-warm'
              : 'text-ink/70 group-hover:text-warm-ink'
          }`}
        >
          {onPreview ? 'Προεπισκόπηση' : 'Δείτε το δείγμα'}
          <Maximize2 aria-hidden className="h-3.5 w-3.5" />
        </span>
      </div>
    </a>
  )
}
