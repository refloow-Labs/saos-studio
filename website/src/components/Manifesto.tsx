import SectionLabel from './SectionLabel'

export default function Manifesto() {
  return (
    <div id="manifesto" className="w-full">
      <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
        {/* Left — heading */}
        <div>
          <SectionLabel text="Το Μανιφέστο μας" align="left" />
          <h2 className="text-headline text-[clamp(2.2rem,5vw,4rem)]">
            Ένας σπουδαίος σχεδιασμός δεν πρέπει να κοστίζει μια <em>περιουσία</em>.
          </h2>
        </div>

        {/* Right — body + stats */}
        <div className="space-y-5">
          <p className="text-[1.02rem] text-ink/80 leading-[1.8] font-body">
            Πιστεύουμε ότι κάθε επιχείρηση αξίζει μια ιστοσελίδα που να δείχνει σαν να
            κόστισε €10.000 — ακόμα κι αν δεν κόστισε.{' '}
            <strong className="text-ink font-bold" style={{ color: '#0a0a0a' }}>
              Το SAOS Studio
            </strong>{' '}
            συνδυάζει την ταχύτητα της σύγχρονης τεχνητής νοημοσύνης με την εκλεπτυσμένη
            αισθητική ανθρώπινων σχεδιαστών. Εντυπωσιακές ιστοσελίδες σε λιγότερο από μία
            εβδομάδα, σε κλάσμα της τιμής ενός agency.
          </p>
          <p className="text-[0.94rem] text-muted leading-[1.8] font-body">
            Χωρίς φουσκωμένες διαδικασίες. Χωρίς junior σχεδιαστές που μαθαίνουν με δικά
            σας έξοδα. Μόνο καθαρός κώδικας, έξυπνη τυπογραφία και στρατηγικές διατάξεις
            που μετατρέπουν τους επισκέπτες σε πελάτες.
          </p>

          <div className="border-t border-border pt-8 mt-8 grid grid-cols-2 gap-6">
            <div>
              <div className="text-[3rem] font-extrabold text-ink leading-none">€46</div>
              <p className="text-muted text-[0.78rem] mt-2 leading-snug font-medium">
                Μηνιαία τιμή για το Static πακέτο. Premium στα €52. Ακυρώστε ανά πάσα στιγμή.
              </p>
            </div>
            <div>
              <div className="text-[3rem] font-extrabold text-ink leading-none">7</div>
              <p className="text-muted text-[0.78rem] mt-2 leading-snug font-medium">
                Μέρες μέχρι το launch. Όχι εβδομάδες, όχι μήνες.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
