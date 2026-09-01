/**
 * Client-side wrapper around Google's PageSpeed Insights (Lighthouse) API.
 *
 * There is no backend for this site (see `submit.ts`), so the call happens
 * straight from the visitor's browser to `googleapis.com` — the same origin
 * pagespeed.web.dev itself calls, and the endpoint answers with CORS enabled
 * for exactly this. `VITE_PAGESPEED_API_KEY` is optional: unauthenticated
 * calls work but share Google's public quota, so under real traffic a free
 * key from Google Cloud Console (PageSpeed Insights API) should be set in
 * Netlify's build environment.
 */

const ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'] as const

export type Strategy = 'mobile' | 'desktop'

export interface CategoryScores {
  perf: number
  a11y: number
  best: number
  seo: number
}

/** The five Core Web Vitals rows the report table shows, in native units. */
export interface CoreMetrics {
  lcp: number // seconds
  fcp: number // seconds
  si: number // seconds
  tbt: number // ms
  cls: number // unitless
}

export type FindingLevel = 'good' | 'mid' | 'poor'

export interface Opportunity {
  id: string
  level: FindingLevel
  title: string
  gain: string
  text: string
}

export interface OtherFinding {
  id: string
  level: FindingLevel
  title: string
  note: string
}

export interface StrategyReport {
  scores: CategoryScores
  metrics: CoreMetrics
  opportunities: Opportunity[]
  other: OtherFinding[]
}

export interface PageSpeedReport {
  url: string
  mobile: StrategyReport
  desktop: StrategyReport
}

export class PageSpeedError extends Error {}

/** Google's Lighthouse audit score is 0–1; the report table wants 0–100 ints. */
function pct(score: number | null | undefined): number {
  return Math.round((score ?? 0) * 100)
}

function scoreLevel(score: number | null | undefined): FindingLevel {
  const v = score ?? 0
  if (v >= 0.9) return 'good'
  if (v >= 0.5) return 'mid'
  return 'poor'
}

/**
 * Dynamic copy for the opportunity audits Lighthouse most commonly surfaces.
 * Keyed by audit id; `text` receives the audit's own savings figure so the
 * sentence stays accurate without us re-deriving it.
 */
const OPPORTUNITY_COPY: Record<string, { title: string; text: (detail: string) => string }> = {
  'render-blocking-resources': {
    title: 'Πόροι που μπλοκάρουν την εμφάνιση',
    text: (d) =>
      `Πριν εμφανιστεί το πρώτο pixel, ο browser κατεβάζει αρχεία που δεν χρειάζονται για την πρώτη οθόνη${d}. Διόρθωση: ενσωμάτωση του κρίσιμου CSS και αναβολή των υπολοίπων.`,
  },
  'uses-optimized-images': {
    title: 'Ασυμπίεστες εικόνες',
    text: (d) =>
      `Οι εικόνες σερβίρονται χωρίς αρκετή συμπίεση${d}. Διόρθωση: επανακωδικοποίηση σε WebP/AVIF με ρεαλιστική ποιότητα.`,
  },
  'modern-image-formats': {
    title: 'Εικόνες σε παλιά μορφή',
    text: (d) =>
      `Οι εικόνες είναι σε JPEG/PNG αντί για μορφές νέας γενιάς${d}. Διόρθωση: μετατροπή σε WebP ή AVIF.`,
  },
  'uses-responsive-images': {
    title: 'Υπερμεγέθεις εικόνες',
    text: (d) =>
      `Οι εικόνες σερβίρονται σε ένα μέγεθος για όλες τις συσκευές${d}: το κινητό κατεβάζει εικόνα φτιαγμένη για μεγάλη οθόνη. Διόρθωση: ξεχωριστό μέγεθος ανά συσκευή.`,
  },
  'offscreen-images': {
    title: 'Εικόνες εκτός οθόνης φορτώνουν αμέσως',
    text: (d) =>
      `Εικόνες που ο επισκέπτης δεν βλέπει ακόμα κατεβαίνουν από την αρχή${d}. Διόρθωση: lazy loading.`,
  },
  'unused-javascript': {
    title: 'Αχρησιμοποίητη JavaScript',
    text: (d) =>
      `Κατεβαίνει κώδικας που η σελίδα δεν εκτελεί ποτέ${d}. Επιβαρύνει και το δίκτυο και τον επεξεργαστή του κινητού. Διόρθωση: αφαίρεση αχρησιμοποίητων βιβλιοθηκών.`,
  },
  'unused-css-rules': {
    title: 'Αχρησιμοποίητο CSS',
    text: (d) => `Στυλ που δεν εφαρμόζονται πουθενά στη σελίδα κατεβαίνουν ούτως ή άλλως${d}. Διόρθωση: αφαίρεση νεκρού CSS.`,
  },
  'unminified-javascript': {
    title: 'Μη ελαχιστοποιημένη JavaScript',
    text: (d) => `Ο κώδικας κατεβαίνει με σχόλια και κενά που δεν χρειάζεται ο browser${d}. Διόρθωση: minification στο build.`,
  },
  'unminified-css': {
    title: 'Μη ελαχιστοποιημένο CSS',
    text: (d) => `Το CSS κατεβαίνει χωρίς συμπίεση κώδικα${d}. Διόρθωση: minification στο build.`,
  },
  'uses-text-compression': {
    title: 'Χωρίς συμπίεση κειμένου',
    text: (d) => `Ο server στέλνει HTML/CSS/JS χωρίς gzip ή brotli${d}. Διόρθωση: ενεργοποίηση συμπίεσης στον server.`,
  },
  'server-response-time': {
    title: 'Αργή απάντηση του server',
    text: (d) => `Ο server χρειάζεται πολλή ώρα πριν στείλει το πρώτο byte${d}. Διόρθωση: caching ή αναβάθμιση φιλοξενίας.`,
  },
  redirects: {
    title: 'Ανακατευθύνσεις πριν τη σελίδα',
    text: (d) => `Ο browser περνάει από ενδιάμεσα redirect πριν φτάσει στη σελίδα${d}. Διόρθωση: σύνδεσμος κατευθείαν στον τελικό προορισμό.`,
  },
  'font-display': {
    title: 'Γραμματοσειρές που κρύβουν το κείμενο',
    text: () => `Το κείμενο μένει αόρατο μέχρι να φορτώσει η γραμματοσειρά. Διόρθωση: font-display: swap.`,
  },
  'dom-size': {
    title: 'Υπερβολικά μεγάλο DOM',
    text: () => `Η σελίδα έχει ασυνήθιστα πολλά στοιχεία HTML, κάτι που επιβαρύνει το rendering στο κινητό.`,
  },
}

const OTHER_COPY: Record<string, { title: string; note: string }> = {
  'color-contrast': {
    title: 'Ανεπαρκής αντίθεση χρωμάτων',
    note: 'Κείμενο που δεν διαβάζεται εύκολα στον ήλιο ή από χρήστη με μειωμένη όραση.',
  },
  'heading-order': {
    title: 'Επικεφαλίδες εκτός ιεραρχίας',
    note: 'Η σειρά H1-H2-H3 σπάει. Επηρεάζει τους αναγνώστες οθόνης και τη Google.',
  },
  'link-name': {
    title: 'Σύνδεσμοι χωρίς περιγραφικό κείμενο',
    note: 'Σύνδεσμοι που λένε «εδώ». Η Google δεν μαθαίνει τίποτα από αυτούς.',
  },
  'image-alt': {
    title: 'Εικόνες χωρίς εναλλακτικό κείμενο',
    note: 'Αναγνώστες οθόνης και η Google δεν μαθαίνουν τι δείχνει η εικόνα.',
  },
  viewport: {
    title: 'Χωρίς σωστό viewport για κινητό',
    note: 'Η σελίδα δεν προσαρμόζεται σωστά σε μικρές οθόνες.',
  },
  'meta-description': {
    title: 'Χωρίς meta description',
    note: 'Η Google εμφανίζει τυχαίο απόσπασμα κειμένου στα αποτελέσματα αναζήτησης.',
  },
  'document-title': {
    title: 'Τίτλος σελίδας λείπει ή είναι γενικός',
    note: 'Ο τίτλος είναι αυτό που βλέπει πρώτο ο χρήστης στα αποτελέσματα Google.',
  },
  'is-on-https': {
    title: 'Χωρίς HTTPS',
    note: 'Browsers και η Google υποβαθμίζουν sites χωρίς πιστοποιητικό ασφαλείας.',
  },
  'crawlable-anchors': {
    title: 'Σύνδεσμοι που η Google δεν μπορεί να ακολουθήσει',
    note: 'Κάποιοι σύνδεσμοι δεν είναι κανονικά href και χάνονται από το indexing.',
  },
}

interface LighthouseAuditRef {
  id: string
  weight: number
}

interface LighthouseAudit {
  score: number | null
  numericValue?: number
  displayValue?: string
  details?: { overallSavingsMs?: number; overallSavingsBytes?: number }
}

interface LighthouseResult {
  categories: Record<string, { score: number | null; auditRefs: LighthouseAuditRef[] }>
  audits: Record<string, LighthouseAudit>
}

interface PsiResponse {
  lighthouseResult?: LighthouseResult
  error?: { message?: string }
}

function detailFor(audit: LighthouseAudit): string {
  const ms = audit.details?.overallSavingsMs
  const bytes = audit.details?.overallSavingsBytes
  if (ms && ms >= 50) return `, κέρδος έως ${(ms / 1000).toFixed(1).replace('.', ',')} s`
  if (bytes && bytes >= 10_000) return `, κέρδος ${Math.round(bytes / 1024)} KiB`
  return ''
}

function gainLabel(audit: LighthouseAudit): string {
  const ms = audit.details?.overallSavingsMs
  const bytes = audit.details?.overallSavingsBytes
  if (ms && ms >= 50) return `Κέρδος έως ${(ms / 1000).toFixed(1).replace('.', ',')} s`
  if (bytes && bytes >= 10_000) return `Κέρδος ${Math.round(bytes / 1024)} KiB`
  return 'Βελτίωση απόδοσης'
}

function extract(lh: LighthouseResult): StrategyReport {
  const { audits, categories } = lh

  const scores: CategoryScores = {
    perf: pct(categories.performance?.score),
    a11y: pct(categories.accessibility?.score),
    best: pct(categories['best-practices']?.score),
    seo: pct(categories.seo?.score),
  }

  const metrics: CoreMetrics = {
    lcp: (audits['largest-contentful-paint']?.numericValue ?? 0) / 1000,
    fcp: (audits['first-contentful-paint']?.numericValue ?? 0) / 1000,
    si: (audits['speed-index']?.numericValue ?? 0) / 1000,
    tbt: audits['total-blocking-time']?.numericValue ?? 0,
    cls: audits['cumulative-layout-shift']?.numericValue ?? 0,
  }

  const opportunities: Opportunity[] = Object.entries(OPPORTUNITY_COPY)
    .map(([id, copy]) => {
      const audit = audits[id]
      if (!audit || audit.score === null || audit.score >= 0.9) return null
      const savingsMs = audit.details?.overallSavingsMs ?? 0
      const savingsBytes = audit.details?.overallSavingsBytes ?? 0
      if (savingsMs < 50 && savingsBytes < 10_000 && id !== 'font-display' && id !== 'dom-size') {
        return null
      }
      return {
        id,
        level: scoreLevel(audit.score),
        title: copy.title,
        gain: gainLabel(audit),
        text: copy.text(detailFor(audit)),
        savingsMs,
      }
    })
    .filter((o): o is Opportunity & { savingsMs: number } => o !== null)
    .sort((a, b) => b.savingsMs - a.savingsMs)
    .slice(0, 4)
    .map(({ savingsMs: _savingsMs, ...rest }) => rest)

  const other: OtherFinding[] = Object.entries(OTHER_COPY)
    .map(([id, copy]) => {
      const audit = audits[id]
      if (!audit || audit.score === null) return null
      return { id, level: scoreLevel(audit.score), title: copy.title, note: copy.note }
    })
    .filter((o): o is OtherFinding => o !== null)

  // Keep the failing/borderline ones plus one confirmed pass, same balance the
  // static template struck — an all-red list reads as an attack, not a report.
  const bad = other.filter((o) => o.level !== 'good')
  const good = other.find((o) => o.level === 'good')
  const finalOther = good ? [...bad.slice(0, 4), good] : bad.slice(0, 5)

  return { scores, metrics, opportunities, other: finalOther }
}

async function runStrategy(url: string, strategy: Strategy): Promise<StrategyReport> {
  const key = import.meta.env.VITE_PAGESPEED_API_KEY as string | undefined
  const params = new URLSearchParams({ url, strategy })
  for (const c of CATEGORIES) params.append('category', c)
  if (key) params.set('key', key)

  let res: Response
  try {
    res = await fetch(`${ENDPOINT}?${params.toString()}`)
  } catch {
    throw new PageSpeedError('Δεν καταφέραμε να επικοινωνήσουμε με το εργαλείο της Google. Δοκιμάστε ξανά.')
  }

  const body = (await res.json().catch(() => null)) as PsiResponse | null
  if (!res.ok || !body?.lighthouseResult) {
    const reason = body?.error?.message ?? ''
    if (res.status === 429 || /quota|rate limit/i.test(reason)) {
      // Without VITE_PAGESPEED_API_KEY, Google's default per-project quota for
      // this endpoint is 0/day — every call fails with exactly this. A free
      // key from Google Cloud Console (enable "PageSpeed Insights API") set
      // as a Netlify build env var is required before this tool works at all,
      // not just for reliability under load.
      throw new PageSpeedError('Το εργαλείο έχει φτάσει το όριο ερωτημάτων της Google για σήμερα. Δοκιμάστε ξανά αργότερα.')
    }
    if (/document request|dns|no such host/i.test(reason)) {
      throw new PageSpeedError('Η Google δεν κατάφερε να φορτώσει αυτή τη διεύθυνση. Ελέγξτε ότι είναι σωστή και δημόσια προσβάσιμη.')
    }
    throw new PageSpeedError('Η ανάλυση απέτυχε. Δοκιμάστε ξανά σε λίγο.')
  }

  return extract(body.lighthouseResult)
}

/** Runs the mobile and desktop analyses in parallel — each takes 10–30s alone. */
export async function runPageSpeedReport(url: string): Promise<PageSpeedReport> {
  const [mobile, desktop] = await Promise.all([runStrategy(url, 'mobile'), runStrategy(url, 'desktop')])
  return { url, mobile, desktop }
}

/** Google's mobile thresholds — used for both strategies, same as the PDF template. */
export const METRIC_ROWS: {
  key: keyof CoreMetrics
  name: string
  note: string
  unit: string
  good: number
  poor: number
  decimals: number
}[] = [
  { key: 'lcp', name: 'Largest Contentful Paint', note: 'Πότε εμφανίζεται το κύριο περιεχόμενο', unit: 's', good: 2.5, poor: 4.0, decimals: 1 },
  { key: 'fcp', name: 'First Contentful Paint', note: 'Πότε εμφανίζεται το πρώτο pixel', unit: 's', good: 1.8, poor: 3.0, decimals: 1 },
  { key: 'si', name: 'Speed Index', note: 'Πόσο γρήγορα γεμίζει οπτικά η σελίδα', unit: 's', good: 3.4, poor: 5.8, decimals: 1 },
  { key: 'tbt', name: 'Total Blocking Time', note: 'Πόσο μένει κολλημένη στο άγγιγμα', unit: 'ms', good: 200, poor: 600, decimals: 0 },
  { key: 'cls', name: 'Cumulative Layout Shift', note: 'Πόσο αναπηδά το layout στο φόρτωμα', unit: '', good: 0.1, poor: 0.25, decimals: 2 },
]

export function metricLevel(row: (typeof METRIC_ROWS)[number], value: number): FindingLevel {
  if (value <= row.good) return 'good'
  if (value <= row.poor) return 'mid'
  return 'poor'
}

/** Greek plain-language headline + body for the report's dark "verdict" section. */
export function buildVerdict(report: PageSpeedReport): {
  title: string
  summary: string
  /** Split rather than HTML — the number is ours, but never risk treating any
      interpolated string as markup. */
  verdictTitle: { before: string; emphasis: string; after: string }
  verdictBody: string
} {
  const m = report.mobile
  const d = report.desktop
  const lcpM = m.metrics.lcp.toFixed(1).replace('.', ',')
  const lcpD = d.metrics.lcp.toFixed(1).replace('.', ',')
  const mobileGood = m.scores.perf >= 90
  const desktopGood = d.scores.perf >= 90

  let title: string
  if (mobileGood && desktopGood) {
    title = 'Το site σας είναι γρήγορο, και στον υπολογιστή και στο κινητό.'
  } else if (desktopGood && !mobileGood) {
    title = 'Το site σας είναι γρήγορο στον υπολογιστή και αργό στο κινητό.'
  } else if (mobileGood && !desktopGood) {
    title = 'Το site σας είναι γρήγορο στο κινητό — κάτι ασυνήθιστο για τον υπολογιστή χρειάζεται έλεγχο.'
  } else {
    title = 'Το site σας χρειάζεται δουλειά, και στον υπολογιστή και στο κινητό.'
  }

  const summary = mobileGood
    ? `Η απόδοση είναι καλή και στις δύο συσκευές. Στο κινητό το κύριο περιεχόμενο εμφανίζεται στα ${lcpM} δευτερόλεπτα.`
    : `Στον υπολογιστή η απόδοση είναι ${desktopGood ? 'σχεδόν άριστη' : 'σε επεξεργασία'}. Στο κινητό το κύριο περιεχόμενο εμφανίζεται στα ${lcpM} δευτερόλεπτα. Επειδή η πλειοψηφία των επισκεπτών έρχεται από κινητό, αυτό είναι το νούμερο που μετράει.`

  const verdictTitle = mobileGood
    ? { before: 'Ο επισκέπτης από κινητό βλέπει το περιεχόμενο σε ', emphasis: `${lcpM} δευτερόλεπτα`, after: '.' }
    : { before: 'Ο επισκέπτης από κινητό περιμένει ', emphasis: `${lcpM} δευτερόλεπτα`, after: ' πριν δει οτιδήποτε.' }

  const verdictBody = mobileGood
    ? `Η Google θεωρεί αποδεκτό το όριο των 2,5 δευτερολέπτων και το site σας το πιάνει άνετα. Ό,τι απομένει παρακάτω είναι λεπτομέρειες, όχι πρόβλημα.`
    : `Η Google θεωρεί αποδεκτό το όριο των 2,5 δευτερολέπτων· ο υπολογιστής το πιάνει στα ${lcpD}. Δεν φταίει ο σχεδιασμός ή το περιεχόμενο — φταίει το πώς φορτώνουν οι εικόνες και ο κώδικας. Διορθώνεται χωρίς να αλλάξει τίποτα από αυτά που βλέπει ο επισκέπτης.`

  return { title, summary, verdictTitle, verdictBody }
}
