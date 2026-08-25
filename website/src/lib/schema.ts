/**
 * Schema.org JSON-LD, emitted into the prerendered <head> at build time.
 *
 * Served in the initial HTML rather than injected client-side: Google delays
 * processing of JS-injected structured data, and non-Google crawlers never see
 * it at all.
 *
 * Note there is deliberately no LocalBusiness node — the studio publishes no
 * postal address or phone number, and LocalBusiness without them is invalid.
 */

import {
  SITE_URL,
  SITE_NAME,
  SITE_LANG,
  CONTACT_EMAIL,
  BOOKING_URL,
  OG_IMAGE,
  canonicalFor,
  routes,
} from './seo'
import { faqs, homeFaqs, type Faq } from './faqs'
import { services } from './services'
import { processStages } from './process'
import { projects } from './projects'
import { team } from './story'

const ORG_ID = `${SITE_URL}/#organization`
const SITE_ID = `${SITE_URL}/#website`

/**
 * Service area, shared by the Organization and Service nodes so the two can
 * never disagree.
 *
 * Named administrative places rather than a `GeoCircle`. A circle is what Google
 * documents for service-area businesses, but it forces publishing a midpoint and
 * a radius — a quantitative claim, and this file's whole posture is to omit
 * rather than invent (no LocalBusiness node, no street address, no prices).
 * Named places are also what people actually type.
 *
 * «Ανατολική Μακεδονία και Θράκη» is repeated from `addressRegion` below on
 * purpose: same string, so the graph is internally consistent.
 *
 * Deliberately NOT a `LocalBusiness` / `ProfessionalService` node. Narrowing to
 * a service area is the classic trigger for adding one, and it stays forbidden
 * while the studio publishes no postal address or phone number.
 */
const AREA_SERVED = [
  {
    '@type': 'AdministrativeArea',
    name: 'Ανατολική Μακεδονία και Θράκη',
    containedInPlace: { '@type': 'Country', name: 'Greece' },
  },
  { '@type': 'AdministrativeArea', name: 'Έβρος' },
  { '@type': 'City', name: 'Αλεξανδρούπολη' },
  { '@type': 'City', name: 'Σαμοθράκη' },
]

function organization() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    alternateName: 'saos.studio',
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logos/logo-dark.png`,
    },
    image: `${SITE_URL}${OG_IMAGE}`,
    // Keep in step with public/llms.txt, which states the same thing in prose.
    // The two had already drifted into two wordings of the AI-speed claim; that
    // claim is no longer the positioning, so both were rewritten together.
    description:
      'Στούντιο σχεδιασμού ιστοσελίδων με έδρα τη Σαμοθράκη, το web division της Rhooa Labs. Μικρή ομάδα που κατασκευάζει ιστοσελίδες για μικρές επιχειρήσεις στη Θράκη, χωρίς μεσάζοντες.',
    // The studio takes its name from Σάος, the mountain on Samothraki. Stating
    // it explicitly helps search engines and AI models tie the brand name to the
    // place rather than reading it as an acronym.
    disambiguatingDescription:
      'Το όνομα SAOS προέρχεται από το όρος Σάος της Σαμοθράκης.',
    email: CONTACT_EMAIL,
    // SAOS Studio is the web division of Rhooa Labs. Stating the relationship
    // lets search engines and AI models resolve the two as one entity graph
    // rather than two unrelated companies that happen to share founders.
    parentOrganization: {
      '@type': 'Organization',
      name: 'Rhooa Labs',
      url: 'https://rhooalabs.com',
    },
    // Locality only — the studio publishes no street address, and inventing one
    // would be worse than omitting it.
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Σαμοθράκη',
      addressRegion: 'Ανατολική Μακεδονία και Θράκη',
      addressCountry: 'GR',
    },
    areaServed: AREA_SERVED,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: CONTACT_EMAIL,
      url: BOOKING_URL,
      availableLanguage: ['el', 'en'],
    },
  }
}

function website() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    inLanguage: SITE_LANG,
    publisher: { '@id': ORG_ID },
  }
}

/**
 * The Service node, deliberately without `offers`.
 *
 * It used to emit an AggregateOffer built from the tier prices. Those prices
 * were withdrawn pending repricing, and price markup must never outlive the
 * prices it describes — Google treats structured data that contradicts the page
 * as a violation. `hasOfferCatalog` lists what we do without asserting a price.
 * Restore `offers` only when `services.ts` carries real prices again.
 */
function serviceOffer() {
  return {
    '@type': 'Service',
    '@id': `${SITE_URL}/#service`,
    name: 'Σχεδιασμός και κατασκευή ιστοσελίδων',
    serviceType: 'Web design and development',
    provider: { '@id': ORG_ID },
    areaServed: AREA_SERVED,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Υπηρεσίες',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          description: s.summary,
        },
        // The services now live on /services, not as homepage anchors.
        url: `${SITE_URL}/services#${s.id}`,
      })),
    },
  }
}

/**
 * Takes the questions to mark up rather than reading `faqs` directly.
 *
 * The homepage renders a six-question subset and `/faq` renders all twelve.
 * Emitting the full list on both would have the homepage's markup describe six
 * answers a crawler cannot find there — the mismatch this module's parity rule
 * exists to prevent. Callers pass exactly what their page renders.
 */
function faqPage(canonical: string, items: Faq[]) {
  return {
    '@type': 'FAQPage',
    '@id': `${canonical}#faq`,
    inLanguage: SITE_LANG,
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

/**
 * The delivery process as a HowTo.
 *
 * No `totalTime`: the honest answer varies by project and the only figure we
 * have — Rhooa Labs' «2–4 εβδομάδες» — is flagged in `story.ts` as unconfirmed
 * for websites. A guessed duration in structured data is a claim, not a hint.
 */
function howTo(canonical: string) {
  return {
    '@type': 'HowTo',
    '@id': `${canonical}#howto`,
    name: 'Πώς κατασκευάζουμε την ιστοσελίδα σας',
    description:
      'Η διαδικασία από το πρώτο μήνυμα μέχρι τη δημοσίευση: προσφορά, έγκριση, σχεδιασμός, κατασκευή, διορθώσεις, launch και προαιρετικό μηνιαίο SEO.',
    inLanguage: SITE_LANG,
    step: processStages.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.label,
      text: s.desc,
      url: `${canonical}#${s.slug}`,
    })),
  }
}

/**
 * The demo sites as an ItemList.
 *
 * `CreativeWork`, not `Product` or `LocalBusiness`: these depict invented
 * businesses, and emitting business markup for them would assert that eight
 * companies exist. No rating or review node appears here for the same reason.
 */
function examplesList(canonical: string) {
  return {
    '@type': 'ItemList',
    '@id': `${canonical}#examples`,
    name: 'Δείγματα σχεδιασμού',
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        name: p.name,
        description: p.description,
        genre: p.category,
        url: `${SITE_URL}/work/${p.slug}/`,
        creator: { '@id': ORG_ID },
      },
    })),
  }
}

function aboutPage(canonical: string) {
  return {
    '@type': 'AboutPage',
    '@id': `${canonical}#about`,
    mainEntity: { '@id': ORG_ID },
    inLanguage: SITE_LANG,
    about: team.map((m) => ({
      '@type': 'Person',
      name: m.name,
      jobTitle: m.role,
      description: m.bio,
      worksFor: { '@id': ORG_ID },
      image: `${SITE_URL}/team/${m.slug}.jpg`,
    })),
  }
}

function contactPage(canonical: string) {
  return {
    '@type': 'ContactPage',
    '@id': `${canonical}#contact`,
    inLanguage: SITE_LANG,
    mainEntity: { '@id': ORG_ID },
  }
}

/**
 * Two levels only — the site is flat, so every page hangs directly off the home
 * page. Built from `route.breadcrumb`, which is absent on `/` because the home
 * page is the root of the trail rather than an entry in it.
 */
function breadcrumb(path: string, canonical: string) {
  const label = routes.find((r) => r.path === path)?.breadcrumb
  if (!label) return null
  return {
    '@type': 'BreadcrumbList',
    '@id': `${canonical}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Αρχική', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: label, item: canonical },
    ],
  }
}

function webPage(path: string, title: string, description: string) {
  const canonical = canonicalFor(path)
  return {
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    inLanguage: SITE_LANG,
    isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID },
  }
}

/**
 * The full @graph for a route. Returns a JSON string ready to drop inside a
 * <script type="application/ld+json"> tag.
 */
export function schemaFor(path: string, title: string, description: string): string {
  const canonical = canonicalFor(path)
  const graph: unknown[] = [
    organization(),
    website(),
    webPage(path, title, description),
  ]

  /*
   * Per-route nodes. Every entry here must correspond to content the route
   * actually renders — structured data that describes something absent from the
   * page is a violation, not an optimisation.
   *
   * `/reviews` has no entry here and needs none: the route is currently held
   * out of `seo.ts` entirely (`REVIEWS_PUBLISHED`), and the prerenderer only
   * ever calls this function for routes in that list, so `schemaFor('/reviews')`
   * is unreachable in the build. Do not read its absence as "reviews get base
   * nodes only" — there is no such page in production.
   *
   * The rule that outlives the flag: `Review`/`AggregateRating` markup for
   * invented reviews is the kind of thing that earns a manual action against
   * the whole domain. Add those nodes in the same commit that replaces the
   * samples with real ones and republishes the route, never before and never
   * separately.
   */
  const perRoute: Record<string, () => unknown[]> = {
    '/': () => [faqPage(canonical, homeFaqs())],
    '/services': () => [serviceOffer()],
    '/how-it-works': () => [howTo(canonical)],
    '/examples': () => [examplesList(canonical)],
    '/our-story': () => [aboutPage(canonical)],
    '/faq': () => [faqPage(canonical, faqs)],
    '/request-a-quote': () => [contactPage(canonical)],
  }

  graph.push(...(perRoute[path]?.() ?? []))

  const crumbs = breadcrumb(path, canonical)
  if (crumbs) graph.push(crumbs)

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
}
