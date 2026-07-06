import { useConsentStore } from '../lib/consent'

export default function Footer() {
  const reopen = useConsentStore((s) => s.reopen)

  return (
    <footer className="relative bg-ink py-14 px-5 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
        {/* Left — logo */}
        <a href="#" className="flex items-center" aria-label="saos.studio — Home">
          <img src="/logos/logo-white.png" alt="saos.studio" className="h-6 w-auto" />
        </a>

        {/* Center — nav links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-white/60 text-[0.72rem] font-bold">
          <a href="#work" className="hover:text-white transition-colors duration-200">Έργα</a>
          <a href="#services" className="hover:text-white transition-colors duration-200">Υπηρεσίες</a>
          <a href="#contact" className="hover:text-white transition-colors duration-200">Επικοινωνία</a>
          <a href="/privacy" className="hover:text-white transition-colors duration-200">Απόρρητο</a>
          <button
            onClick={reopen}
            className="hover:text-white transition-colors duration-200 cursor-pointer font-bold"
          >
            Cookies
          </button>
        </div>

        {/* Right — copyright */}
        <span className="text-white/40 text-[0.7rem] font-medium">
          © {new Date().getFullYear()} saos.studio
        </span>
      </div>
    </footer>
  )
}
