import {
  METRIC_ROWS,
  buildVerdict,
  metricLevel,
  type FindingLevel,
  type PageSpeedReport,
  type StrategyReport,
} from '../lib/pagespeed'

/**
 * Renders a `PageSpeedReport` in the same visual language as
 * `[SAOS] SEO REVIEW REPORT TEMPLATE/pagespeed-report-template.html` — the
 * hand-off report the team emails prospects — so a live, self-served result on
 * the site and the emailed PDF read as the same product. Colours are the
 * status semantics from that template (good/mid/poor), not the site's brand
 * accent, on purpose: they mean "pass/warn/fail" against Google's own
 * thresholds and must stay legible regardless of what `warm` is re-tinted to.
 */

const LEVEL_COLOUR: Record<FindingLevel, string> = {
  good: '#0F7B4F',
  mid: '#B45309',
  poor: '#B3261E',
}
const LEVEL_SOFT: Record<FindingLevel, string> = {
  good: '#E4F1EA',
  mid: '#FBEEDC',
  poor: '#F7E4E2',
}
const LEVEL_LABEL: Record<FindingLevel, string> = {
  good: 'Εντάξει',
  mid: 'Οριακό',
  poor: 'Αποτυγχάνει',
}

function scoreLevel(v: number): FindingLevel {
  if (v >= 90) return 'good'
  if (v >= 50) return 'mid'
  return 'poor'
}

function gr(n: number, decimals: number): string {
  return n.toFixed(decimals).replace('.', ',')
}

function Pill({ level, children }: { level: FindingLevel; children: React.ReactNode }) {
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold whitespace-nowrap"
      style={{ background: LEVEL_SOFT[level], color: LEVEL_COLOUR[level] }}
    >
      {children}
    </span>
  )
}

function Ring({ value, label }: { value: number; label: string }) {
  const level = scoreLevel(value)
  const colour = LEVEL_COLOUR[level]
  const r = 22
  const c = 2 * Math.PI * r
  return (
    <figure className="m-0 flex flex-col items-center gap-1.5">
      <svg width={58} height={58} viewBox="0 0 60 60" role="img" aria-label={`${label}: ${value} στα 100`}>
        <circle cx={30} cy={30} r={r} fill="none" stroke={colour} strokeOpacity={0.16} strokeWidth={4} />
        <circle
          cx={30}
          cy={30}
          r={r}
          fill="none"
          stroke={colour}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={`${((c * value) / 100).toFixed(1)} ${c.toFixed(1)}`}
          transform="rotate(-90 30 30)"
        />
        <text
          x={30}
          y={31}
          textAnchor="middle"
          dominantBaseline="central"
          fill={colour}
          fontFamily="Manrope, sans-serif"
          fontWeight={800}
          fontSize={16}
        >
          {value}
        </text>
      </svg>
      <figcaption className="text-center text-[0.68rem] font-bold leading-tight text-muted font-body">
        {label}
      </figcaption>
    </figure>
  )
}

function ScoreCard({ data, name, isFocus }: { data: StrategyReport['scores']; name: string; isFocus: boolean }) {
  return (
    <section
      className={`rounded-card border bg-white p-6 ${isFocus ? 'border-ink' : 'border-border'}`}
    >
      <div className="mb-5 flex items-center justify-between font-extrabold font-body">
        {name}
        {isFocus ? (
          <span className="rounded-full bg-ink px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-white">
            Η προτεραιότητα
          </span>
        ) : (
          <span className="text-[0.62rem] font-bold uppercase tracking-wider text-muted">Δευτερεύον</span>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        <Ring value={data.perf} label="Απόδοση" />
        <Ring value={data.a11y} label="Προσβασιμότητα" />
        <Ring value={data.best} label="Καλές πρακτικές" />
        <Ring value={data.seo} label="SEO" />
      </div>
    </section>
  )
}

interface Props {
  report: PageSpeedReport
  bookingUrl: string
}

export default function WebsiteReviewReport({ report, bookingUrl }: Props) {
  const verdict = buildVerdict(report)
  const fixes = report.mobile.opportunities.length ? report.mobile.opportunities : report.desktop.opportunities
  const other = report.mobile.other.length ? report.mobile.other : report.desktop.other

  return (
    <div className="mt-4">
      {/* Cover / scores */}
      <div className="rounded-card border border-border bg-bg p-6 sm:p-9">
        <div className="inline-block rounded-full border border-border px-3 py-1 text-[0.85rem] font-bold font-body">
          {report.url.replace(/^https?:\/\//, '')}
        </div>
        <h3 className="mt-5 text-headline text-[clamp(1.5rem,3.4vw,2.1rem)] max-w-[26ch]">
          {verdict.title}
        </h3>
        <p className="mt-4 max-w-[62ch] text-[1.02rem] leading-[1.75] text-muted font-body">
          {verdict.summary}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <ScoreCard data={report.mobile.scores} name="Κινητό" isFocus />
          <ScoreCard data={report.desktop.scores} name="Υπολογιστής" isFocus={false} />
        </div>

        <p className="mt-6 text-[0.8rem] text-muted font-body">
          Οι βαθμολογίες προέρχονται αυτούσιες από τη μηχανή αξιολόγησης της Google,{' '}
          <a href="https://pagespeed.web.dev" target="_blank" rel="noopener noreferrer" className="font-bold text-ink underline">
            pagespeed.web.dev
          </a>{' '}
          — όχι από δικά μας εργαλεία.
        </p>
      </div>

      {/* Verdict */}
      <div className="mt-6 rounded-card bg-ink p-7 text-white sm:p-9">
        <div className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/50">Η ετυμηγορία</div>
        <h3 className="mt-3 text-headline text-white text-[clamp(1.3rem,2.8vw,1.8rem)]">
          {verdict.verdictTitle.before}
          <em className="not-italic text-warm-light">{verdict.verdictTitle.emphasis}</em>
          {verdict.verdictTitle.after}
        </h3>
        <p className="mt-4 max-w-[62ch] text-[0.95rem] leading-[1.75] text-white/70 font-body">
          {verdict.verdictBody}
        </p>
      </div>

      {/* Metrics table */}
      <div className="mt-6">
        <div className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted">Τι μετράει η Google</div>
        <h3 className="mt-2 text-headline text-[clamp(1.3rem,2.8vw,1.8rem)]">
          Οι πέντε μετρήσεις πίσω από τη βαθμολογία
        </h3>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse font-body">
            <thead>
              <tr>
                {['Μέτρηση', 'Κινητό', 'Υπολογιστής', 'Στόχος', 'Κατάσταση'].map((h) => (
                  <th
                    key={h}
                    className="border-b border-border px-3 py-3 text-left text-[0.68rem] font-bold uppercase tracking-wider text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRIC_ROWS.map((row) => {
                const m = report.mobile.metrics[row.key]
                const d = report.desktop.metrics[row.key]
                const level = metricLevel(row, m)
                const show = (v: number) => `${gr(v, row.decimals)}${row.unit ? ' ' + row.unit : ''}`
                return (
                  <tr key={row.key}>
                    <td className="border-b border-border px-3 py-3">
                      <b className="block text-ink">{row.name}</b>
                      <small className="text-muted">{row.note}</small>
                    </td>
                    <td className="border-b border-border px-3 py-3 font-bold tabular-nums">{show(m)}</td>
                    <td className="border-b border-border px-3 py-3 font-bold tabular-nums">{show(d)}</td>
                    <td className="border-b border-border px-3 py-3 text-muted tabular-nums">
                      &lt; {gr(row.good, row.decimals)}
                      {row.unit ? ` ${row.unit}` : ''}
                    </td>
                    <td className="border-b border-border px-3 py-3">
                      <Pill level={level}>{LEVEL_LABEL[level]}</Pill>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fixes */}
      {fixes.length > 0 && (
        <div className="mt-10">
          <div className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted">Προτεραιότητες</div>
          <h3 className="mt-2 text-headline text-[clamp(1.3rem,2.8vw,1.8rem)]">Τι να διορθωθεί, με αυτή τη σειρά</h3>
          <div className="mt-6 flex flex-col gap-3.5">
            {fixes.map((f, i) => (
              <article
                key={f.id}
                className="rounded-[0.9rem] border border-border bg-white p-5 sm:p-6"
                style={{ borderLeft: `4px solid ${LEVEL_COLOUR[f.level]}` }}
              >
                <h4 className="text-[1.05rem] font-extrabold font-body">
                  {String(i + 1).padStart(2, '0')} · {f.title}
                </h4>
                <div className="mt-2 mb-3">
                  <Pill level={f.level}>{f.gain}</Pill>
                </div>
                <p className="max-w-[70ch] text-[0.9rem] leading-[1.7] text-muted font-body">{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Other findings */}
      {other.length > 0 && (
        <div className="mt-10">
          <div className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted">Πέρα από την ταχύτητα</div>
          <h3 className="mt-2 text-headline text-[clamp(1.3rem,2.8vw,1.8rem)]">Προσβασιμότητα και SEO</h3>
          <ul className="mt-6 grid gap-3">
            {other.map((o) => (
              <li key={o.id} className="grid grid-cols-[auto_1fr] items-start gap-3">
                <span
                  aria-hidden
                  className="mt-[0.4rem] h-2 w-2 rounded-full"
                  style={{ background: LEVEL_COLOUR[o.level] }}
                />
                <span className="font-body">
                  <b className="block text-ink">{o.title}</b>
                  <small className="text-muted">{o.note}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="mt-10 rounded-card bg-ink p-8 text-center text-white sm:p-10">
        <h3 className="text-headline text-white text-[clamp(1.4rem,3vw,1.9rem)]">Θέλετε να το διορθώσουμε;</h3>
        <p className="mx-auto mt-4 max-w-[46ch] text-[0.95rem] leading-[1.75] text-white/70 font-body">
          Η έκθεση είναι δωρεάν και δική σας. Αν προτιμάτε να το αναλάβουμε εμείς, κλείστε μια σύντομη κουβέντα και
          σας απαντάμε με χρονοδιάγραμμα και κόστος.
        </p>
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-on-dark mt-7 justify-center px-8 py-4 text-[0.9rem]"
        >
          Κλείστε μια κουβέντα 15 λεπτών <span aria-hidden>→</span>
        </a>
      </div>

      <p className="mt-6 text-[0.8rem] leading-[1.7] text-muted font-body">
        Μέτρηση με Google Lighthouse μέσω pagespeed.web.dev. Πρόκειται για εργαστηριακή μέτρηση — δείχνει τι πρέπει
        να διορθωθεί, με φυσιολογική διακύμανση ±5 μονάδων μεταξύ μετρήσεων.
      </p>
    </div>
  )
}
