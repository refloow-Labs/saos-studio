import Layout from '../components/Layout'
import Chapter from '../components/Chapter'
import PageHeader from '../components/PageHeader'
import QuoteForm from '../components/QuoteForm'
import Reveal from '../components/Reveal'

const REASSURANCE = [
  {
    title: 'Απαντάμε σε κάθε αίτημα',
    desc: 'Είτε πιστεύουμε ότι ταιριάζουμε είτε όχι. Αν δεν είμαστε οι κατάλληλοι, θα σας το πούμε.',
  },
  {
    title: 'Γραπτή προσφορά',
    desc: 'Θα λάβετε συγκεκριμένο κόστος και χρονοδιάγραμμα πριν δεσμευτείτε σε οτιδήποτε.',
  },
  {
    title: 'Καμία δέσμευση',
    desc: 'Το αίτημα δεν σας δεσμεύει. Δεν ζητάμε κάρτα και δεν υπάρχει κρυφή χρέωση.',
  },
]

export default function RequestQuotePage() {
  return (
    <Layout>
      <Chapter id="quote" tone="white" className="pt-36 md:pt-44">
        <PageHeader
          eyebrow="Ζητήστε προσφορά"
          doodle="underline"
          title={
            <>
              Πείτε μας για το <em>project σας.</em>
            </>
          }
          lead="Επτά σύντομες ερωτήσεις — χρειάζεται περίπου δύο λεπτά. Θα εξετάσουμε το αίτημά σας και θα επικοινωνήσουμε με συγκεκριμένη πρόταση και κόστος."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <QuoteForm />

          <aside className="lg:pt-2">
            <h2 className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-muted font-body">
              Τι να περιμένετε
            </h2>
            <ul className="mt-6 space-y-7">
              {REASSURANCE.map((item, i) => (
                <Reveal as="li" key={item.title} delay={i * 80}>
                  <h3 className="text-[0.95rem] font-extrabold text-ink font-body">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.87rem] leading-[1.75] text-muted font-body">
                    {item.desc}
                  </p>
                </Reveal>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
              <h3 className="text-[0.9rem] font-extrabold text-ink font-body">
                Δεν είστε σίγουροι τι χρειάζεστε;
              </h3>
              <p className="mt-2 text-[0.85rem] leading-[1.75] text-muted font-body">
                Συμπληρώστε τη φόρμα ούτως ή άλλως και γράψτε το στην περιγραφή. Μέρος της
                δουλειάς μας είναι να σας βοηθήσουμε να το ξεκαθαρίσετε.
              </p>
              <a
                href="/services"
                className="mt-4 link-arrow text-[0.85rem] font-bold text-ink transition-colors duration-200 hover:text-warm-ink"
              >
                Δείτε τις υπηρεσίες <span aria-hidden>→</span>
              </a>
            </div>
          </aside>
        </div>
      </Chapter>
    </Layout>
  )
}
