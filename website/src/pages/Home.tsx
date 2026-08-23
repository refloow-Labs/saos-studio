import Layout from '../components/Layout'
import Chapter from '../components/Chapter'
import Hero from '../components/Hero'
import OfferSplit from '../components/OfferSplit'
import WhyWebsite from '../components/WhyWebsite'
import WhatsIncluded from '../components/WhatsIncluded'
import SeoSubscription from '../components/SeoSubscription'
import Portfolio from '../components/Portfolio'
import Reviews from '../components/Reviews'
import ProcessTeaser from '../components/ProcessTeaser'
import FreeWebsite from '../components/FreeWebsite'
import Faq from '../components/Faq'
import Contact from '../components/Contact'

/**
 * The homepage.
 *
 * Argument order, not feature order: what it costs (offer) → why you need one at
 * all (why) → what you get (included) → what the optional part is (seo) → proof
 * of the work (examples) → proof of the people (reviews) → how it runs (process)
 * → the alternative route in (free website) → objections (faq) → the ask.
 *
 * Two things this page deliberately does not do any more. It no longer carries a
 * story section or a full services grid: /our-story and /services own those, and
 * duplicating them here made the homepage a table of contents for itself. And it
 * no longer opens every section with a banner word. `SectionOpener` is now spent
 * on exactly three sections (Έργα, Τι λένε για εμάς, Ερωτήσεις) where the page
 * changes gear; the rest open with `SectionHeading`, headline only. Six
 * identically-shaped section openers read as a template, however good each one
 * is on its own.
 *
 * Tone alternation keeps the two dark breaks apart (positions 3 and 6) and
 * outnumbered by light sections, per REDESIGN.md.
 *
 * Highlighter sweeps land on three of the ten sections. That ratio is the whole
 * device: a mark on every section is a texture, a mark on a few is a decision.
 * `contact` gets the overlapping pair because all of its copy sits inside a
 * near-black card, so the darker crossing never lands under running text.
 */
export default function HomePage() {
  return (
    /* navOverDark: the hero is a dark full-bleed section, and the nav is
       transparent until scrolled — without this its near-black wordmark and
       links sit invisibly on top of it. */
    <Layout navOverDark>
      <Hero />

      <Chapter id="offer" tone="gray">
        <OfferSplit />
      </Chapter>

      <Chapter id="giati-website" tone="dark">
        <WhyWebsite />
      </Chapter>

      <Chapter id="ti-perilamvanei" tone="white" sweep>
        <WhatsIncluded />
      </Chapter>

      <Chapter id="seo" tone="gray">
        <SeoSubscription />
      </Chapter>

      <Chapter id="work" tone="dark">
        <Portfolio />
      </Chapter>

      <Chapter id="reviews" tone="white">
        <Reviews />
      </Chapter>

      <Chapter id="diadikasia" tone="gray" sweep>
        <ProcessTeaser />
      </Chapter>

      <Chapter id="free-website" tone="white">
        <FreeWebsite />
      </Chapter>

      <Chapter id="faq" tone="gray">
        <Faq />
      </Chapter>

      <Chapter id="contact" tone="white" sweep="double">
        <Contact />
      </Chapter>
    </Layout>
  )
}
