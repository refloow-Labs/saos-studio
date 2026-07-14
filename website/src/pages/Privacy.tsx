import { useConsentStore } from '../lib/consent'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

/**
 * Privacy & Cookie policy page. Plain editorial layout — same brand as the
 * main site but no animated gradient (this is a legal page, should be calm
 * and easy to read).
 *
 * NB: replace the placeholder contact email + studio details with the
 * actual ones before going live.
 */

const STUDIO = {
  name: 'SAOS Studio',
  city: 'Θεσσαλονίκη, Ελλάδα',
  email: 'saos.ventures@gmail.com',
}

export default function PrivacyPage() {
  const reopen = useConsentStore((s) => s.reopen)

  return (
    <>
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none bg-white" />
      <Navigation />

      <main className="relative px-6 md:px-12 pt-32 md:pt-40 pb-24" style={{ zIndex: 10 }}>
        <article className="max-w-[44rem] mx-auto">
          <p className="text-[0.6rem] tracking-[0.22em] uppercase font-semibold text-accent/70 font-body mb-6">
            Νομικά
          </p>

          <h1 className="font-display font-light leading-[1.1] tracking-[-0.02em] text-[clamp(2.4rem,5vw,3.6rem)] mb-10">
            Πολιτική απορρήτου & cookies
          </h1>

          <p className="text-muted text-[0.78rem] tracking-[0.05em] uppercase font-semibold font-body mb-12">
            Τελευταία ενημέρωση: Απρίλιος 2026
          </p>

          <Section title="1. Ποιοι είμαστε">
            <p>
              Το <strong className="text-text">{STUDIO.name}</strong> είναι μικρό
              στούντιο σχεδιασμού ιστοσελίδων με έδρα τη {STUDIO.city}. Υπεύθυνος
              επεξεργασίας δεδομένων είστε εσείς όταν χρησιμοποιείτε το site μας
              στη διεύθυνση <em className="text-accent not-italic">saosstudio.gr</em>.
            </p>
            <p>
              Για ερωτήσεις σχετικά με τα δεδομένα σας, επικοινωνήστε στο{' '}
              <a
                href={`mailto:${STUDIO.email}`}
                className="text-accent underline underline-offset-4 decoration-accent/40 hover:decoration-accent transition-colors"
              >
                {STUDIO.email}
              </a>
              .
            </p>
          </Section>

          <Section title="2. Τι δεδομένα συλλέγουμε">
            <p>
              Όταν επισκέπτεστε το site μας, μπορεί να συλλέξουμε τα εξής:
            </p>
            <ul>
              <li>
                <strong className="text-text/85">Τεχνικά δεδομένα</strong> — IP
                διεύθυνση (ανωνυμοποιημένη), τύπος browser, σύστημα, ώρα
                επίσκεψης.
              </li>
              <li>
                <strong className="text-text/85">Στατιστικά χρήσης</strong>{' '}
                (μόνο με τη συγκατάθεσή σας) — ποιες σελίδες είδατε, χρόνος
                παραμονής, source επίσκεψης. Συλλέγονται μέσω Google Analytics 4
                με ανωνυμοποίηση IP.
              </li>
              <li>
                <strong className="text-text/85">Στοιχεία επικοινωνίας</strong>{' '}
                — μόνο εάν εσείς επιλέξετε να μας στείλετε email ή να κλείσετε
                ραντεβού μέσω Calendly.
              </li>
            </ul>
            <p>
              Δεν συλλέγουμε ευαίσθητα προσωπικά δεδομένα ούτε οικονομικά
              στοιχεία.
            </p>
          </Section>

          <Section title="3. Νομική βάση">
            <p>
              Επεξεργαζόμαστε τα δεδομένα σας με βάση:
            </p>
            <ul>
              <li>
                <strong className="text-text/85">Τη συγκατάθεσή σας</strong>{' '}
                (Άρθρο 6.1.α GDPR) — για στατιστικά cookies, η οποία μπορεί να
                ανακληθεί οποιαδήποτε στιγμή.
              </li>
              <li>
                <strong className="text-text/85">Έννομο συμφέρον</strong>{' '}
                (Άρθρο 6.1.στ GDPR) — για βασική λειτουργικότητα και ασφάλεια
                του site.
              </li>
              <li>
                <strong className="text-text/85">Εκτέλεση σύμβασης</strong>{' '}
                (Άρθρο 6.1.β GDPR) — όταν μας προσλαμβάνετε για ένα project.
              </li>
            </ul>
          </Section>

          <Section title="4. Cookies που χρησιμοποιούμε">
            <p>
              Χρησιμοποιούμε δύο τύπους cookies:
            </p>
            <CookieTable />
          </Section>

          <Section title="5. Διαμοιρασμός δεδομένων">
            <p>
              Δεν πουλάμε τα δεδομένα σας. Τα μοιραζόμαστε μόνο με τους
              ακόλουθους παρόχους υπηρεσιών, αυστηρά για τους σκοπούς που
              αναφέρονται:
            </p>
            <ul>
              <li>
                <strong className="text-text/85">Google (Analytics)</strong> —
                στατιστικά επισκεψιμότητας. Δεδομένα μπορεί να μεταφερθούν σε
                ΗΠΑ υπό το EU-US Data Privacy Framework.
              </li>
              <li>
                <strong className="text-text/85">Calendly</strong> —
                προγραμματισμός ραντεβού, μόνο όταν επιλέγετε να κλείσετε call.
              </li>
              <li>
                <strong className="text-text/85">Netlify / Vercel</strong> —
                hosting του site (logs, χωρίς προσωπικά δεδομένα).
              </li>
            </ul>
          </Section>

          <Section title="6. Πόσο χρόνο κρατάμε τα δεδομένα">
            <p>
              Τα στατιστικά Google Analytics διατηρούνται για 14 μήνες. Emails
              πελατών διατηρούνται όσο χρειάζεται για το project συν 5 χρόνια
              για λογιστικούς σκοπούς. Τα cookies συγκατάθεσης διατηρούνται για
              12 μήνες.
            </p>
          </Section>

          <Section title="7. Τα δικαιώματά σας (GDPR)">
            <p>
              Έχετε δικαίωμα να:
            </p>
            <ul>
              <li>Ζητήσετε αντίγραφο των δεδομένων σας (πρόσβαση).</li>
              <li>Διορθώσετε ανακριβή δεδομένα.</li>
              <li>Ζητήσετε διαγραφή των δεδομένων σας (δικαίωμα στη λήθη).</li>
              <li>Περιορίσετε ή αντιταχθείτε στην επεξεργασία.</li>
              <li>Ζητήσετε φορητότητα των δεδομένων σας.</li>
              <li>Ανακαλέσετε τη συγκατάθεσή σας ανά πάσα στιγμή.</li>
              <li>
                Υποβάλετε καταγγελία στην Αρχή Προστασίας Δεδομένων
                Προσωπικού Χαρακτήρα (
                <a
                  href="https://www.dpa.gr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline underline-offset-4 decoration-accent/40 hover:decoration-accent transition-colors"
                >
                  dpa.gr
                </a>
                ).
              </li>
            </ul>
            <p>
              Για να ασκήσετε οποιοδήποτε από αυτά τα δικαιώματα, στείλτε email
              στο{' '}
              <a
                href={`mailto:${STUDIO.email}`}
                className="text-accent underline underline-offset-4 decoration-accent/40 hover:decoration-accent transition-colors"
              >
                {STUDIO.email}
              </a>
              . Απαντάμε εντός 30 ημερών.
            </p>
          </Section>

          <Section title="8. Διαχείριση cookies">
            <p>
              Μπορείτε να αλλάξετε τις προτιμήσεις σας για cookies οποιαδήποτε
              στιγμή:
            </p>
            <button
              onClick={() => {
                reopen()
                window.location.href = '/'
              }}
              className="mt-4 inline-flex items-center gap-3 px-7 py-3 border border-accent text-accent text-[0.66rem] tracking-[0.18em] uppercase font-semibold font-body transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-accent hover:text-bg hover:gap-5"
            >
              Αλλαγή προτιμήσεων cookies <span>→</span>
            </button>
          </Section>

          <Section title="9. Αλλαγές στην πολιτική">
            <p>
              Μπορεί να ενημερώνουμε αυτήν την πολιτική κατά καιρούς. Σε
              σημαντικές αλλαγές θα ζητήσουμε εκ νέου τη συγκατάθεσή σας.
            </p>
          </Section>

          <div className="mt-16 pt-8 border-t border-border flex items-center gap-4">
            <a
              href="/"
              className="text-[0.66rem] tracking-[0.18em] uppercase font-semibold text-muted/70 font-body hover:text-text transition-colors duration-300"
            >
              ← Επιστροφή στην αρχική
            </a>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-12">
      <h2 className="font-display font-light text-[1.6rem] md:text-[1.85rem] leading-tight tracking-[-0.01em] mb-5 text-text">
        {title}
      </h2>
      <div className="prose-content text-muted text-[0.95rem] leading-[1.85] font-body space-y-4 [&>ul]:list-none [&>ul]:pl-0 [&>ul>li]:py-1.5 [&>ul>li]:pl-5 [&>ul>li]:relative [&>ul>li:before]:content-['—'] [&>ul>li:before]:absolute [&>ul>li:before]:left-0 [&>ul>li:before]:text-accent/50">
        {children}
      </div>
    </section>
  )
}

function CookieTable() {
  const rows = [
    {
      cat: 'Απαραίτητα',
      name: 'saos_consent_v1',
      purpose: 'Αποθήκευση των επιλογών συγκατάθεσής σας.',
      duration: '12 μήνες',
    },
    {
      cat: 'Στατιστικά',
      name: '_ga, _ga_*',
      purpose: 'Google Analytics — μέτρηση επισκεψιμότητας με ανωνυμοποιημένη IP.',
      duration: '14 μήνες',
    },
  ]
  return (
    <div className="mt-4 border border-border overflow-hidden">
      {/* Desktop: 4-column table */}
      <div className="hidden md:grid grid-cols-[1fr_1.4fr_2fr_1fr] gap-0 text-[0.7rem] tracking-[0.1em] uppercase text-muted/70 bg-bg/50 border-b border-border">
        <div className="px-4 py-3">Κατηγορία</div>
        <div className="px-4 py-3">Όνομα</div>
        <div className="px-4 py-3">Σκοπός</div>
        <div className="px-4 py-3">Διάρκεια</div>
      </div>
      {rows.map((r, i) => (
        <div
          key={r.name}
          className={`text-[0.78rem] text-text/80 ${
            i < rows.length - 1 ? 'border-b border-border' : ''
          }`}
        >
          {/* Desktop row */}
          <div className="hidden md:grid grid-cols-[1fr_1.4fr_2fr_1fr] gap-0">
            <div className="px-4 py-4 text-accent/80">{r.cat}</div>
            <div className="px-4 py-4 font-mono text-[0.72rem]">{r.name}</div>
            <div className="px-4 py-4 leading-[1.6]">{r.purpose}</div>
            <div className="px-4 py-4 text-muted">{r.duration}</div>
          </div>
          {/* Mobile stacked card */}
          <div className="md:hidden p-4 space-y-2">
            <div className="text-[0.6rem] tracking-[0.18em] uppercase text-accent/80">
              {r.cat}
            </div>
            <div className="font-mono text-[0.72rem] text-text/85">{r.name}</div>
            <p className="text-[0.78rem] leading-[1.65] text-text/75">
              {r.purpose}
            </p>
            <div className="text-[0.6rem] tracking-[0.18em] uppercase text-muted/70 pt-1">
              Διάρκεια — {r.duration}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
