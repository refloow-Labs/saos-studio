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
} from './seo'
import { faqs } from './faqs'
import { services, PRICE_CURRENCY, LOWEST_PRICE } from './services'

const ORG_ID = `${SITE_URL}/#organization`
const SITE_ID = `${SITE_URL}/#website`

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
    description:
      'Στούντιο σχεδιασμού ιστοσελίδων με έδρα τη Σαμοθράκη. Συνδυάζει AI με ανθρώπινο σχεδιασμό, παραδίδοντας επαγγελματικά sites σε μέρες με συνδρομητικό μοντέλο.',
    // The studio takes its name from Σάος, the mountain on Samothraki. Stating
    // it explicitly helps search engines and AI models tie the brand name to the
    // place rather than reading it as an acronym.
    disambiguatingDescription:
      'Το όνομα SAOS προέρχεται από το όρος Σάος της Σαμοθράκης.',
    email: CONTACT_EMAIL,
    // Locality only — the studio publishes no street address, and inventing one
    // would be worse than omitting it.
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Σαμοθράκη',
      addressRegion: 'Ανατολική Μακεδονία και Θράκη',
      addressCountry: 'GR',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Greece',
    },
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

function serviceOffer() {
  return {
    '@type': 'Service',
    '@id': `${SITE_URL}/#service`,
    name: 'Σχεδιασμός και κατασκευή ιστοσελίδων με συνδρομή',
    serviceType: 'Web design and development',
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Greece' },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: PRICE_CURRENCY,
      lowPrice: LOWEST_PRICE,
      offerCount: String(services.length),
      offers: services.map((s) => ({
        '@type': 'Offer',
        name: s.name,
        price: s.priceAmount,
        priceCurrency: PRICE_CURRENCY,
        url: `${SITE_URL}/#services`,
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: s.priceAmount,
          priceCurrency: PRICE_CURRENCY,
          // Monthly subscription.
          billingDuration: 1,
          billingIncrement: 1,
          unitCode: 'MON',
        },
      })),
    },
  }
}

function faqPage(canonical: string) {
  return {
    '@type': 'FAQPage',
    '@id': `${canonical}#faq`,
    inLanguage: SITE_LANG,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
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
  const graph: unknown[] = [
    organization(),
    website(),
    webPage(path, title, description),
  ]

  // The pricing grid and the FAQ accordion both live on the homepage only.
  if (path === '/') {
    graph.push(serviceOffer(), faqPage(canonicalFor(path)))
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
}
