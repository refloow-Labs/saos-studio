import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import SectionLabel from './SectionLabel'

const categories = [
  {
    title: 'Hospitality',
    desc: 'Restaurants, cafés, hotels — reservation flows and atmosphere-first layouts.',
    gradient: 'from-[#1a1510] to-[#0f0f0f]',
    accent: '#c9a96e',
  },
  {
    title: 'Architecture',
    desc: 'Studios and galleries — image-forward portfolios with editorial pacing.',
    gradient: 'from-[#10151a] to-[#0f0f0f]',
    accent: '#8fa8c9',
  },
  {
    title: 'Wellness',
    desc: 'Spas, clinics, fitness — calming aesthetics with clear service hierarchy.',
    gradient: 'from-[#1a1015] to-[#0f0f0f]',
    accent: '#c98fa8',
  },
  {
    title: 'Retail',
    desc: 'Boutiques and local brands — product showcase with conversion in mind.',
    gradient: 'from-[#151a10] to-[#0f0f0f]',
    accent: '#a8c98f',
  },
]

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative py-32 md:py-44 px-6 md:px-12 bg-surface border-y border-border overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-20">
          <SectionLabel text="Capabilities" />
          <ScrollReveal delay={0.1}>
            <h2 className="font-display font-light text-[clamp(2rem,4vw,3.5rem)] leading-[1.15]">
              Built for any <em className="text-accent italic">industry</em>.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="mt-4 text-muted max-w-xl mx-auto">
              No templates. Every site is designed from a blank canvas tailored to your field, voice, and goals.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {categories.map((c, i) => (
            <ScrollReveal key={c.title} delay={0.1 * (i + 1)}>
              <motion.div
                className="group relative aspect-[16/10] border border-border overflow-hidden cursor-pointer"
                whileHover="hover"
                initial="rest"
              >
                {/* Background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`}
                  variants={{
                    rest: { scale: 1 },
                    hover: { scale: 1.05 },
                  }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Accent orb */}
                <motion.div
                  className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] opacity-20"
                  style={{ background: c.accent }}
                  variants={{
                    rest: { opacity: 0.15, scale: 1 },
                    hover: { opacity: 0.3, scale: 1.2 },
                  }}
                  transition={{ duration: 0.8 }}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                  <motion.div
                    variants={{
                      rest: { y: 0, opacity: 1 },
                      hover: { y: -4, opacity: 1 },
                    }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span
                      className="inline-block text-[0.65rem] tracking-[0.15em] uppercase border px-2.5 py-1 mb-4"
                      style={{ color: c.accent, borderColor: `${c.accent}40` }}
                    >
                      {c.title}
                    </span>
                    <h4 className="font-display text-[1.6rem] font-normal mb-1">{c.title}</h4>
                    <motion.p
                      className="text-muted text-[0.85rem] max-w-sm"
                      variants={{
                        rest: { opacity: 0.7, y: 0 },
                        hover: { opacity: 1, y: 0 },
                      }}
                    >
                      {c.desc}
                    </motion.p>
                  </motion.div>
                </div>

                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent"
                  variants={{
                    rest: { opacity: 0.6 },
                    hover: { opacity: 0.9 },
                  }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
