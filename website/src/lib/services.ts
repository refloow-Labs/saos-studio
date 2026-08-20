/**
 * Subscription tiers, shared between the pricing grid in `Services.tsx` and the
 * Offer JSON-LD built in `schema.ts`. Structured-data prices must match the
 * prices shown on the page, so both read this list.
 */

export interface ServiceTier {
  num: string
  tag: string
  name: string
  /** Display price, e.g. '€46'. `priceAmount` carries the machine-readable value. */
  price: string
  priceAmount: string
  period: string
  features: string[]
  featured: boolean
}

export const PRICE_CURRENCY = 'EUR'

export const services: ServiceTier[] = [
  {
    num: '01',
    tag: 'Δημοφιλέστερο',
    name: 'Premium',
    price: '€52',
    priceAmount: '52',
    period: '/μήνα',
    features: [
      'Όλα όσα περιλαμβάνει το Static',
      '+2 επιπλέον σελίδες',
      'Ενσωμάτωση Google Analytics',
      'Προχωρημένο SEO & ταχύτητα',
      'Σύνδεση social media',
      '3 γύροι αναθεώρησης',
      'Υποστήριξη καθόλη τη διάρκεια της συνδρομής',
    ],
    featured: false,
  },
  {
    num: '02',
    tag: 'Καλύτερη Αξία',
    name: 'Static',
    price: '€46',
    priceAmount: '46',
    period: '/μήνα',
    features: [
      'Custom σχεδιασμός μίας σελίδας',
      'Mobile-first υλοποίηση',
      'Φόρμα επικοινωνίας',
      'Βασική ρύθμιση SEO',
      'Σύνδεση domain & deployment',
      '2 γύροι αναθεώρησης',
      'Υποστήριξη καθόλη τη διάρκεια της συνδρομής',
    ],
    featured: true,
  },
  {
    num: '03',
    tag: 'Ολοκληρωμένο',
    name: 'Enterprise',
    price: '€83',
    priceAmount: '83',
    period: '/μήνα',
    features: [
      'Όλα όσα περιλαμβάνει το Premium',
      'Έως 8 σελίδες ή e-shop',
      'Σύστημα διαχείρισης (CMS)',
      'Ενσωμάτωση πληρωμών',
      'Πολυγλωσσική υποστήριξη',
      'Προτεραιότητα υποστήριξης',
    ],
    featured: false,
  },
]

/** Lowest advertised monthly price — used in the Offer's `lowPrice`. */
export const LOWEST_PRICE = services.reduce(
  (min, s) => (Number(s.priceAmount) < Number(min) ? s.priceAmount : min),
  services[0].priceAmount,
)
