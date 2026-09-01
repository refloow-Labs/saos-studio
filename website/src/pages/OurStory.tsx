import Layout from '../components/Layout'
import Chapter from '../components/Chapter'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Doodle from '../components/Doodle'
import {
  bridge,
  mission,
  processSteps,
  team,
  values,
  vision,
} from '../lib/story'

const WHY_US = [
  {
    title: 'Μιλάτε με αυτούς που φτιάχνουν',
    desc: 'Δεν υπάρχει account manager ανάμεσα. Ο άνθρωπος που σχεδιάζει και ο άνθρωπος που κατασκευάζει είναι στην ίδια κουβέντα με εσάς, από την αρχή μέχρι το τέλος.',
  },
  {
    title: 'Λέμε όχι όταν δεν χρειάζεται',
    desc: 'Αν αυτό που ζητάτε δεν θα σας αποδώσει, θα σας το πούμε — ακόμα κι αν σημαίνει μικρότερο έργο για εμάς. Προτιμάμε έναν πελάτη που επιστρέφει από ένα μεγάλο τιμολόγιο.',
  },
  {
    title: 'Η ιστοσελίδα είναι δική σας',
    desc: 'Παραδίδουμε κωδικούς, domain και πρόσβαση. Δεν κρατάμε τίποτα όμηρο και δεν χρειάζεστε εμάς για να συνεχίσετε.',
  },
  {
    title: 'Καταλαβαίνουμε τη μικρή επιχείρηση',
    desc: 'Δεν έχετε τμήμα marketing ούτε χρόνο για meetings. Δουλεύουμε με αυτό δεδομένο: λίγες, σύντομες επαφές και ξεκάθαρα βήματα.',
  },
]

export default function OurStoryPage() {
  return (
    <Layout>
      <Chapter id="story-intro" tone="white" className="pt-36 md:pt-44">
        <PageHeader
          eyebrow="Η ιστορία μας"
          doodle="underline"
          title={
            <>
              Μια μικρή ομάδα που <em>χτίζει</em> πράγματα που δουλεύουν.
            </>
          }
          lead={bridge.lead}
        />

        <Reveal className="mt-8">
          <p className="max-w-[64ch] text-[1rem] leading-[1.85] text-muted font-body">
            {bridge.body}
          </p>
        </Reveal>
      </Chapter>

      {/* Why we started — the bridge copy expanded into its own beat. */}
      <Chapter id="giati-xekinisame" tone="gray">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <h2 className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-muted font-body">
              Γιατί ξεκινήσαμε
            </h2>
            <p className="mt-5 text-headline text-[clamp(1.5rem,3vw,2.2rem)] max-w-[18ch]">
              {mission.heading}
            </p>
          </div>

          <div>
            <p className="max-w-[62ch] text-[1rem] leading-[1.85] text-ink font-body">
              {mission.desc}
            </p>
            <p className="mt-6 max-w-[62ch] text-[0.95rem] leading-[1.85] text-muted font-body">
              Οι περισσότερες μικρές επιχειρήσεις δεν χρειάζονται μια εντυπωσιακή
              ιστοσελίδα. Χρειάζονται μία που φορτώνει γρήγορα στο κινητό, λέει καθαρά τι
              κάνουν, και κάνει εύκολο το επόμενο βήμα — μια κλήση, μια κράτηση, ένα
              μήνυμα. Αυτό είναι το πρόβλημα που λύνουμε.
            </p>
          </div>
        </div>
      </Chapter>

      {/* Our approach — the three-phase summary. The eight detailed steps live
          on /how-it-works; these three are the shape, not the checklist. */}
      <Chapter id="proseggisi" tone="white">
        <div className="relative mb-10 flex items-center gap-4">
          <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-muted font-body">
            Η προσέγγισή μας
          </h2>
          <span aria-hidden className="h-px flex-1 bg-border" />
          <Doodle variant="squiggle" strokeWidth={4} className="h-4 w-16 opacity-80" />
        </div>

        <ol className="grid gap-6 md:grid-cols-3">
          {processSteps.map((step, i) => (
            <Reveal as="li" key={step.num} delay={i * 90}>
              <div className="h-full rounded-card border border-border bg-bg p-7">
                <span className="inline-flex items-center justify-center rounded-full bg-warm-soft px-3 py-1 text-[0.72rem] font-extrabold text-ink font-body">
                  {step.num}
                </span>
                <h3 className="mt-5 text-[1.05rem] font-extrabold leading-tight text-ink">
                  {step.label}
                </h3>
                <p className="mt-3 text-[0.9rem] leading-[1.75] text-muted font-body">
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-10">
          <a
            href="/how-it-works"
            className="group link-arrow text-[0.88rem] font-bold text-ink transition-colors duration-200 hover:text-warm-ink"
          >
            Δείτε αναλυτικά και τα οκτώ βήματα
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </Reveal>
      </Chapter>

      {/* Values */}
      <Chapter id="axies" tone="gray">
        <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-muted font-body">
          Οι αξίες μας
        </h2>
        <ul className="mt-9 grid gap-8 md:grid-cols-3">
          {values.map((value, i) => (
            <Reveal as="li" key={value.title} delay={i * 90}>
              <h3 className="text-[1rem] font-extrabold leading-tight text-ink">
                {value.title}
              </h3>
              <p className="mt-3 text-[0.9rem] leading-[1.75] text-muted font-body">
                {value.desc}
              </p>
            </Reveal>
          ))}
        </ul>
      </Chapter>

      {/* Why clients work with us */}
      <Chapter id="giati-emas" tone="white">
        <h2 className="text-headline text-[clamp(1.6rem,3.2vw,2.4rem)] max-w-[20ch]">
          Γιατί οι πελάτες δουλεύουν <em>μαζί μας.</em>
        </h2>

        <ul className="mt-11 grid gap-8 md:grid-cols-2 md:gap-10">
          {WHY_US.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 80}>
              <div className="border-t border-border pt-5">
                <h3 className="text-[1.02rem] font-extrabold leading-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[52ch] text-[0.91rem] leading-[1.8] text-muted font-body">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Chapter>

      {/* Vision */}
      <Chapter id="orama" tone="dark">
        <div className="mx-auto max-w-3xl">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/40 font-body">
            {vision.title}
          </p>
          <p className="mt-5 text-[1.05rem] leading-[1.8] text-white/85 font-body md:text-[1.15rem]">
            {vision.desc}
          </p>
        </div>
      </Chapter>

      {/* Team */}
      <Chapter id="omada" tone="white">
        <h2 className="text-headline text-center text-[clamp(1.4rem,2.8vw,2.1rem)]">
          Οι άνθρωποι πίσω από τη SAOS
        </h2>

        <ul className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
          {team.map((member, i) => (
            <Reveal as="li" key={member.slug} delay={i * 90} className="text-center">
              <div className="mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-card border border-border bg-surface">
                <picture>
                  <source srcSet={`/team/${member.slug}.webp`} type="image/webp" />
                  <img
                    src={`/team/${member.slug}.jpg`}
                    alt={`${member.name} — ${member.role}`}
                    width={640}
                    height={640}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </picture>
              </div>
              <h3 className="mt-5 text-[1rem] font-extrabold leading-tight text-ink">
                {member.name}
              </h3>
              <p className="mt-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-warm-ink font-body">
                {member.role}
              </p>
              <p className="mt-3 text-[0.86rem] leading-[1.7] text-muted font-body">
                {member.bio}
              </p>
            </Reveal>
          ))}
        </ul>

      </Chapter>

      <Chapter id="story-cta" tone="gray">
        <div className="mx-auto max-w-2xl text-center">
          {/* Argues from this page specifically — the reader has just read how
              the team works and what it refuses to do. The generic closer that
              used to be here was identical to the homepage one. */}
          <h2 className="text-headline text-[clamp(1.6rem,3.4vw,2.4rem)]">
            Αν σας ταιριάζει ο τρόπος που <em>δουλεύουμε.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] text-[0.95rem] leading-[1.8] text-muted font-body">
            Πείτε μας τι χρειάζεστε. Αν δεν είμαστε οι κατάλληλοι για τη δουλειά,
            θα σας το πούμε από την πρώτη κουβέντα.
          </p>
          <a
            href="/request-a-quote"
            className="btn-accent mt-8 justify-center px-8 py-4 text-[0.9rem]"
          >
            Ζητήστε προσφορά <span aria-hidden>→</span>
          </a>
        </div>
      </Chapter>
    </Layout>
  )
}
