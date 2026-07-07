export default function FreeProposal() {
  return (
    <div className="w-full py-20 md:py-24">
      <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-ink via-ink to-[#1a1a1a] p-12 md:p-16 lg:p-20">
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Gradient glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-headline text-white text-[clamp(2.2rem,5.5vw,4.2rem)] mb-6">
            Πάρε ένα δωρεάν προσχέδιο, <em className="text-white/90">μέσα σε 2 ημέρες</em>
          </h2>

          {/* Subheadline */}
          <p className="text-white/70 text-[clamp(1rem,1.6vw,1.15rem)] leading-[1.7] max-w-[50ch] mx-auto mb-10 font-body">
            Συμπληρωσε την παρακάτω φόρμα και λάβε ένα δωρεάν προσχέδιο για την επιχείρησή σου μέσα σε 2 ημέρες.
          </p>

          {/* CTA Button */}
          <a
            href="https://forms.gle/1ZW6W27JMbZ9bzCD9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-9 py-4 bg-white text-ink text-[0.85rem] tracking-[0.12em] uppercase font-bold font-body rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-5 hover:bg-accent hover:text-white hover:shadow-[0_20px_50px_-15px_rgba(201,168,118,0.5)] transform hover:-translate-y-0.5"
          >
            Δωρεάν Προσχέδιο <span className="text-lg">→</span>
          </a>

          {/* Trust indicator */}
          <p className="text-white/40 text-[0.7rem] tracking-[0.16em] uppercase mt-8 font-medium font-body">
            Χωρίς υποχρέωση · Απάντηση εντός 48 ωρών
          </p>
        </div>
      </div>
    </div>
  )
}
