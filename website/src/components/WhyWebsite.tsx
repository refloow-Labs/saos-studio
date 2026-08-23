import Reveal from './Reveal'
import EvaluationForm from './EvaluationForm'

/**
 * Why a small business needs a site at all.
 *
 * The objection this answers is real and specific: most Greek SMBs already have
 * a Google Business Profile and an Instagram, and genuinely do not see what a
 * website adds. Three concrete arguments, each about something the owner already
 * recognises from their own week.
 *
 * No statistics. Every "78% of customers research online" figure we could put
 * here would be borrowed from a study about a different market, or invented.
 * The arguments stand without them.
 */
const REASONS = [
  {
    num: '01',
    title: 'Ο πελάτης αποφασίζει πριν σας τηλεφωνήσει',
    body: 'Μέχρι να σηκώσετε το τηλέφωνο, έχει ήδη δει τρεις ακόμα επιλογές. Η ιστοσελίδα είναι η μόνη από αυτές που ελέγχετε εσείς: τι βλέπει πρώτο, τι καταλαβαίνει για τη δουλειά σας, πόσο εύκολο του κάνετε το επόμενο βήμα.',
  },
  {
    num: '02',
    title: 'Το προφίλ σας στο Google δείχνει πού είστε, όχι γιατί εσάς',
    body: 'Ένας χάρτης, ένα τηλέφωνο και μερικές φωτογραφίες. Δεν χωράει το μενού σας, οι υπηρεσίες σας, η ιστορία σας ή ο λόγος που οι πελάτες σας επιστρέφουν. Τα δύο δουλεύουν καλύτερα μαζί: η ιστοσελίδα ενισχύει και την εμφάνισή σας στις τοπικές αναζητήσεις.',
  },
  {
    num: '03',
    title: 'Το Instagram δεν είναι δικό σας',
    body: 'Ο λογαριασμός μπορεί να κλειδώσει, ο αλγόριθμος να αλλάξει, η προσέγγιση να πέσει από τη μια μέρα στην άλλη. Χτίζετε πάνω σε ξένο έδαφος. Το domain και η ιστοσελίδα σας μένουν δικά σας ό,τι και να γίνει.',
  },
]

export default function WhyWebsite() {
  return (
    <div className="w-full">
      <div className="max-w-3xl">
        <h2 className="text-headline text-[clamp(1.9rem,4.2vw,3.1rem)] max-w-[18ch]">
          Έχετε ήδη πελάτες. Το θέμα είναι πόσοι <em>δεν σας βρήκαν.</em>
        </h2>
      </div>

      <ol className="mt-14 space-y-12 md:space-y-16">
        {REASONS.map((reason, i) => (
          <Reveal as="li" key={reason.num} delay={i * 80}>
            <div className="grid gap-4 border-t border-white/15 pt-7 md:grid-cols-[5rem_1fr] md:gap-10">
              <span
                aria-hidden
                className="text-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-none text-warm"
              >
                {reason.num}
              </span>
              <div>
                <h3 className="text-[clamp(1.1rem,2vw,1.45rem)] font-extrabold leading-snug text-white">
                  {reason.title}
                </h3>
                <p className="mt-4 max-w-[62ch] text-[0.95rem] leading-[1.85] text-white/65 font-body">
                  {reason.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>

      {/*
        The free evaluation, attached to the argument rather than given its own
        section. It is the natural reply to "but I already have a website" and
        reads as a diagnostic offer here instead of a second competing pitch.
        `/#evaluation` is linked from the FAQ answer about existing sites.
      */}
      <Reveal className="mt-16">
        <div
          id="evaluation"
          className="scroll-mt-32 rounded-card border border-white/15 bg-white/5 p-7 sm:p-10"
        >
          <h3 className="text-[clamp(1.05rem,1.9vw,1.35rem)] font-extrabold leading-snug text-white max-w-[26ch]">
            Έχετε ήδη ιστοσελίδα; Δείτε δωρεάν τι την κρατάει πίσω.
          </h3>
          <p className="mt-3 max-w-[54ch] text-[0.9rem] leading-[1.8] text-white/60 font-body">
            Ταχύτητα φόρτωσης, εμφάνιση στο κινητό, βασικό SEO. Θα σας πούμε ειλικρινά αν
            αξίζει διόρθωση ή νέα κατασκευή, ακόμα κι αν η απάντηση σημαίνει μικρότερη
            δουλειά για εμάς.
          </p>
          <EvaluationForm onDark className="mt-7 max-w-2xl" />
        </div>
      </Reveal>
    </div>
  )
}
