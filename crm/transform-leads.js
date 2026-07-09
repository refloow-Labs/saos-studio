// Transform leads to CRM format
const fs = require('fs');

const leads = JSON.parse(fs.readFileSync('leads-no-website.json', 'utf-8'));

// Map categories to our CRM categories
function mapCategory(naceDesc) {
    const lower = naceDesc.toLowerCase();
    if (lower.includes('εστια') || lower.includes('τροφ') || lower.includes('κρέα') ||
        lower.includes('γαλακτ') || lower.includes('ποτ')) {
        return 'Food & Hospitality';
    }
    if (lower.includes('ξενοδοχ') || lower.includes('τουρ') || lower.includes('κατάλυμα')) {
        return 'Accommodation';
    }
    if (lower.includes('υγεί') || lower.includes('ιατρ') || lower.includes('φαρμακ') || lower.includes('διαγνωστ')) {
        return 'Healthcare';
    }
    return 'Other';
}

// Map regions to Nomos
function mapNomos(region) {
    const nomoi = {
        'Αττική': 'Αττική',
        'Θεσσαλονίκη': 'Θεσσαλονίκη',
        'Εύβοια': 'Εύβοια',
        'Σέρρες': 'Σέρρες',
        'Ζάκυνθος': 'Ζάκυνθος',
        'Κορινθία': 'Κορινθία',
        'Δράμα': 'Δράμα',
        'Φλώρινα': 'Φλώρινα',
        'Χαλκιδική': 'Χαλκιδική',
        'Κιλκίς': 'Κιλκίς',
        'Λασίθι': 'Λασίθι',
        'Δωδεκάνησα': 'Δωδεκάνησα',
        'Ηράκλειο': 'Ηράκλειο',
        'Ρέθυμνο': 'Ρέθυμνο',
        'Χανιά': 'Χανιά',
        'Κέρκυρα': 'Κέρκυρα'
    };
    return nomoi[region] || region;
}

const crmLeads = leads.map((lead, index) => ({
    id: `sotiris-lead-${index + 1}`,
    name: lead.company,
    type: lead.category,
    category: mapCategory(lead.category),
    city: lead.region,
    nomos: mapNomos(lead.region),
    address: '',
    phone: lead.phone,
    rating: null,
    reviews: null,
    webPresence: 'No website',
    googleMaps: '',
    outreachStatus: null,
    notes: null,
    source: 'rhooa-labs-40k',
    status: 'new',
    assignedTo: 'ΣΩΤΗΡΗΣ',
    email: lead.email,
    communications: [],
    websiteUrl: null,
    lastContact: null,
    createdDate: new Date().toISOString().split('T')[0]
}));

console.log('Transformed', crmLeads.length, 'leads');
console.log('\nSample lead:');
console.log(JSON.stringify(crmLeads[0], null, 2));

// Save
fs.writeFileSync('sotiris-leads.json', JSON.stringify(crmLeads, null, 2));
console.log('\nSaved to sotiris-leads.json');
console.log('Total leads for ΣΩΤΗΡΗΣ:', crmLeads.length);
