import SectionLabel from './SectionLabel'

const services = [
  {
    num: '01',
    tag: 'Δημοφιλέστερο',
    name: 'Premium',
    price: '€500',
    features: [
      'Όλα όσα περιλαμβάνει το Static',
      '+2 επιπλέον σελίδες',
      'Ενσωμάτωση Google Analytics',
      'Προχωρημένο SEO & ταχύτητα',
      'Σύνδεση social media',
      '3 γύροι αναθεώρησης',
    ],
    featured: false,
  },
  {
    num: '02',
    tag: 'Καλύτερη Αξία',
    name: 'Static',
    price: '€299',
    features: [
      'Custom σχεδιασμός μίας σελίδας',
      'Mobile-first υλοποίηση',
      'Φόρμα επικοινωνίας',
      'Βασική ρύθμιση SEO',
      'Σύνδεση domain & deployment',
      '2 γύροι αναθεώρησης',
    ],
    featured: true,
  },
  {
    num: '03',
    tag: 'Ολοκληρωμένο',
    name: 'Enterprise',
    price: '€850',
    features: [
      'Όλα όσα περιλαμβάνει το Premium',
      'Έως 8 σελίδες ή e-shop',
      'Σύστημα διαχείρισης (CMS)',
      'Ενσωμάτωση πληρωμών',
      'Πολυγλωσσική υποστήριξη',
      'Προτεραιότητα υποστήριξης',
    ],
    featured: false,
  },
]

export default function Services() {
  return (
    <div id="services" className="w-full">
      <div className="max-w-2xl mb-14">
        <SectionLabel text="Τιμές" align="left" />
        <h2 className="text-headline text-[clamp(2.2rem,5vw,4rem)]">
          Τρεις τρόποι να ανεβάσετε την <em>εταιρεία</em> σας.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        {services.map((s) => (
          <div
            key={s.name}
            className={`relative p-8 md:p-9 rounded-card h-full flex flex-col transition-all duration-300 ${
              s.featured
                ? 'bg-ink text-white shadow-[0_28px_70px_-24px_rgba(0,0,0,0.5)]'
                : 'bg-white border border-border hover:border-border-hover'
            }`}
          >
            <div className="flex items-baseline justify-between mb-6">
              <span
                className={`text-[2.1rem] font-extrabold leading-none ${
                  s.featured ? 'text-white/20' : 'text-ink/10'
                }`}
              >
                {s.num}
              </span>
              <span
                className={`text-[0.62rem] tracking-[0.16em] uppercase font-bold font-body ${
                  s.featured ? 'text-white/70' : 'text-muted'
                }`}
              >
                {s.tag}
              </span>
            </div>

            <h3 className="text-[1.5rem] font-extrabold mb-3 leading-tight">{s.name}</h3>

            <div className="text-[2.9rem] font-extrabold leading-none mb-2">{s.price}</div>
            <p
              className={`text-[0.72rem] font-medium mb-7 ${
                s.featured ? 'text-white/50' : 'text-muted'
              }`}
            >
              εφάπαξ, χωρίς κρυφές χρεώσεις
            </p>

            <div
              className={`h-px mb-6 ${s.featured ? 'bg-white/15' : 'bg-border'}`}
            />

            <ul className="space-y-0 flex-1">
              {s.features.map((f) => (
                <li
                  key={f}
                  className={`py-2.5 text-[0.82rem] flex items-center gap-3 font-body font-medium ${
                    s.featured
                      ? 'text-white/85 border-b border-white/10'
                      : 'text-muted border-b border-border/70'
                  } last:border-b-0`}
                >
                  <span
                    className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${
                      s.featured ? 'bg-white/70' : 'bg-ink/40'
                    }`}
                  />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="https://calendly.com/tambakisgiannis/refloow-labs-discovery-call"
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-8 justify-center px-7 py-3.5 text-[0.82rem] ${
                s.featured ? 'btn-on-dark' : 'btn-outline'
              }`}
            >
              Ξεκινήστε <span aria-hidden>→</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
