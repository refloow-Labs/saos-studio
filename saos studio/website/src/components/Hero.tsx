export default function Hero() {
  return (
    <div className="relative w-full min-h-[92svh] flex flex-col justify-center max-w-6xl mx-auto px-5 sm:px-8 md:px-12 pt-28 pb-20">
      {/* Main headline — big, bold, mixed-case Greek */}
      <h1 className="text-headline text-[clamp(2.9rem,8.5vw,6.5rem)] max-w-[16ch]">
        Νέα σελίδα σε μέρες, <em>όχι μήνες.</em>
      </h1>

      {/* Subtitle */}
      <p className="mt-8 text-[clamp(1rem,1.4vw,1.2rem)] text-muted max-w-[46ch] leading-[1.7] font-body">
        Όμορφος σχεδιασμός ιστοσελίδων με επίκεντρο την απόδοση, για φιλόδοξες
        επιχειρήσεις. Παραδίδεται σε μέρες, όχι μήνες. Από €299.
      </p>

      {/* CTAs */}
      <div className="mt-11 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <a
          href="https://calendly.com/tambakisgiannis/refloow-labs-discovery-call"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary justify-center px-9 py-4 text-[0.9rem]"
        >
          Ξεκινήστε το Project <span aria-hidden>→</span>
        </a>
        <a href="#work" className="btn-outline justify-center px-9 py-4 text-[0.9rem]">
          Δείτε τα Έργα μας
        </a>
      </div>
    </div>
  )
}
