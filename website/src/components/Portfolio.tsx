import SectionLabel from './SectionLabel'

interface Project {
  slug: string
  name: string
  tag: string
}

const projects: Project[] = [
  { slug: 'luxora-airbnb', name: 'LUXORA', tag: 'Ultra-Luxury Airbnb' },
  { slug: 'almasi', name: 'Almasi Luxury Suites', tag: 'Πολυτελή καταλύματα' },
  { slug: 'avenue', name: 'Avenue Luxury Apartments', tag: 'Διαμερίσματα πολυτελείας' },
  { slug: 'salento', name: 'Salento', tag: 'Wood-fired street food' },
  { slug: 'ammos', name: 'AMMOS Beach Bar', tag: 'Beach bar & εστίαση' },
  { slug: 'gi-kai-ydor', name: 'Γη & Ύδωρ', tag: 'Εστιατόριο' },
  { slug: 'dental-home', name: 'Dental Home', tag: 'Οδοντιατρείο' },
  { slug: 'desire-patisserie', name: 'Desire Patisserie', tag: 'Ζαχαροπλαστείο' },
]

export default function Portfolio() {
  return (
    <div className="w-full">
      <div className="max-w-2xl mb-14">
        <SectionLabel text="Έργα" align="left" />
        <h2 className="text-headline text-[clamp(2.2rem,5vw,4rem)]">
          Δουλειές που <em>μιλάνε</em> μόνες τους.
        </h2>
        <p className="mt-6 text-[1rem] text-muted leading-[1.7] font-body">
          Πραγματικές ιστοσελίδες, φτιαγμένες για πραγματικές επιχειρήσεις.
          Πατήστε σε οποιαδήποτε για να τη δείτε live.
        </p>
      </div>

      {/* Demos link to the directory form, not /work/<slug>/index.html — both
          resolve, and linking the suffixed one gave every demo a duplicate URL.
          Each demo page carries noindex, so these stay out of the index. */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <a
            key={p.slug}
            href={`/work/${p.slug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-card overflow-hidden bg-white border border-border transition-all duration-300 hover:border-border-hover hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.25)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-surface">
              <picture>
                <source srcSet={`/work/${p.slug}/thumb.webp`} type="image/webp" />
                <img
                  src={`/work/${p.slug}/thumb.jpg`}
                  alt={`${p.name} — ${p.tag}`}
                  width={1000}
                  height={625}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </picture>
            </div>
            <div className="flex items-center justify-between gap-4 px-6 py-5">
              <div>
                <h3 className="text-[1.05rem] font-extrabold text-ink leading-tight">
                  {p.name}
                </h3>
                <p className="text-[0.8rem] text-muted font-medium mt-0.5">{p.tag}</p>
              </div>
              <span className="flex-shrink-0 text-muted transition-all duration-300 group-hover:text-ink group-hover:translate-x-1">
                ↗
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
