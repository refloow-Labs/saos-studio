import { Check } from 'lucide-react'
import SectionLabel from './SectionLabel'

const steps = [
  {
    num: '01',
    title: 'Ανακάλυψη',
    body: 'Μοιράζεστε το όραμα, το περιεχόμενο και το brand σας. Κάνουμε τις σωστές ερωτήσεις σε ένα σύντομο briefing 15 λεπτών.',
  },
  {
    num: '02',
    title: 'Πρόχειρο',
    body: 'Η τεχνητή νοημοσύνη δημιουργεί ένα πλήρες οπτικό πρόχειρο σε ώρες. Ελέγχετε τη δομή, την τυπογραφία και τη ροή.',
  },
  {
    num: '03',
    title: 'Τελειοποίηση',
    body: 'Άνθρωποι σχεδιαστές γυαλίζουν κάθε pixel. Αποστάσεις, ρυθμός και σχεδιασμός αλληλεπιδράσεων σε τελειότητα.',
  },
  {
    num: '04',
    title: 'Launch',
    body: 'Ανεβάζουμε, συνδέουμε το domain σας, ρυθμίζουμε το SEO και σας παραδίδουμε μια ιστοσελίδα έτοιμη να μετατρέψει.',
  },
]

const features = [
  'Custom design προσαρμοσμένο στον κλάδο σας',
  'Responsive σε όλες τις συσκευές',
  'Βελτιστοποίηση Google PageSpeed',
  'Βασική ρύθμιση on-page SEO',
  'Φόρμες επικοινωνίας & χάρτης',
  'Social links & meta tags',
  'Βοήθεια σύνδεσης domain',
  'Υποστήριξη 30 ημερών μετά το launch',
]

export default function Approach() {
  return (
    <div id="approach" className="relative w-full">
      {/* Steps */}
      <div className="max-w-2xl mb-14">
        <SectionLabel text="Πώς Δουλεύουμε" align="left" />
        <h2 className="text-headline text-[clamp(2.2rem,5vw,4rem)]">
          Από την ιδέα στο <em>live</em>, σε μία εβδομάδα.
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-x-14 gap-y-9 mb-28 md:mb-36">
        {steps.map((s) => (
          <div key={s.num} className="flex gap-5">
            <span className="flex-shrink-0 inline-flex items-center justify-center min-w-[3rem] h-12 px-3 rounded-2xl bg-surface-2 text-ink text-[1.05rem] font-extrabold">
              {s.num}
            </span>
            <div>
              <h4 className="text-[1.2rem] font-extrabold mb-1.5 text-ink">{s.title}</h4>
              <p className="text-muted text-[0.9rem] leading-[1.6] font-body">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Included + rationale */}
      <div id="pricing" className="max-w-2xl mb-14">
        <SectionLabel text="Τι Περιλαμβάνεται" align="left" />
        <h2 className="text-headline text-[clamp(2.2rem,5vw,4rem)]">
          Ποιότητα agency. Ταχύτητα <em>startup</em>. Τιμή freelancer.
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-8 md:p-10 rounded-card bg-white border border-border">
          <h3 className="text-[1.15rem] font-extrabold mb-6 text-ink">
            Κάθε πακέτο περιλαμβάνει
          </h3>
          <ul className="space-y-0">
            {features.map((f) => (
              <li
                key={f}
                className="py-3 flex items-center gap-4 text-muted text-[0.88rem] font-medium border-b border-border/70 last:border-b-0 font-body"
              >
                <Check className="w-4 h-4 text-ink flex-shrink-0" strokeWidth={2.5} />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-8 md:p-10 rounded-card bg-white border border-border flex flex-col justify-between">
          <div className="space-y-5">
            <p className="text-ink/80 text-[0.98rem] leading-[1.8] font-body">
              Τα παραδοσιακά agencies χρεώνουν €3.000–€10.000 για ό,τι παραδίδουμε σε
              μία εβδομάδα. Κόβουμε τα περιττά έξοδα — χωρίς fancy γραφεία, χωρίς account
              managers, χωρίς φουσκωμένα meetings. Μόνο σχεδιαστές, κώδικας και καφές.
            </p>
            <p className="text-muted text-[0.9rem] leading-[1.8] font-body">
              Κάθε site είναι χειροποίητα φινιρισμένο. Η AI μας πάει στο 80% σε χρόνο
              ρεκόρ. Το τελικό 20% — οι αποστάσεις, ο ρυθμός, η ψυχή — είναι όλα ανθρώπινα.
            </p>
          </div>
          <a
            href="https://calendly.com/tambakisgiannis/refloow-labs-discovery-call"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-9 px-8 py-4 text-[0.85rem] self-start"
          >
            Δωρεάν Εκτίμηση <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </div>
  )
}
