// Process 40k leads and filter those without websites
const fs = require('fs');
const csvPath = '/Users/giannistambakis/Desktop/Rhooa Labs 40k Leads List - Master copy.csv';

// Read CSV file
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n');
const headers = lines[0].split(',');

console.log('Total lines:', lines.length);
console.log('Headers:', headers);

// Find indices
const companyIdx = headers.findIndex(h => h.includes('Company'));
const regionIdx = headers.findIndex(h => h.includes('Περιοχή'));
const phoneIdx = headers.findIndex(h => h.includes('Τηλέφωνο'));
const emailIdx = headers.findIndex(h => h.includes('Email'));
const websiteIdx = headers.findIndex(h => h.includes('Ιστοσελίδα'));
const naceDescIdx = headers.findIndex(h => h.includes('NACE 2 Desc'));

console.log('Column indices:', { companyIdx, regionIdx, phoneIdx, emailIdx, websiteIdx, naceDescIdx });

let noWebsiteCount = 0;
let validLeads = [];

for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    const columns = line.split(',');
    const website = columns[websiteIdx] || '';
    
    // Check if no website or placeholder
    const hasNoWebsite = !website || 
                        website.trim() === '' || 
                        website.includes('intl-tel-input') ||
                        website.includes('cloudflare');
    
    if (hasNoWebsite) {
        noWebsiteCount++;
        
        const company = columns[companyIdx] || '';
        const region = columns[regionIdx] || '';
        const phone = columns[phoneIdx] || '';
        const email = columns[emailIdx] || '';
        const category = columns[naceDescIdx] || '';
        
        if (company.trim()) {
            validLeads.push({
                company: company.replace(/"/g, ''),
                region: region.replace(/"/g, ''),
                phone: phone.replace(/"/g, ''),
                email: email.replace(/"/g, ''),
                category: category.replace(/"/g, ''),
            });
        }
    }
}

console.log('\nResults:');
console.log('Leads without website:', noWebsiteCount);
console.log('Valid leads to add:', validLeads.length);
console.log('\nFirst 5 leads:');
console.log(JSON.stringify(validLeads.slice(0, 5), null, 2));

// Save to JSON for processing
fs.writeFileSync('leads-no-website.json', JSON.stringify(validLeads, null, 2));
console.log('\nSaved to leads-no-website.json');
