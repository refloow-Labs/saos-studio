// Append ΣΩΤΗΡΗΣ leads to data.js
const fs = require('fs');

// Read existing data.js
const dataJsContent = fs.readFileSync('data.js', 'utf-8');

// Read new leads
const newLeads = JSON.parse(fs.readFileSync('sotiris-leads.json', 'utf-8'));

// Find where the array ends (last closing bracket before ];)
const lastBracketIndex = dataJsContent.lastIndexOf('];');

// Insert new leads before the closing ];
const beforeArray = dataJsContent.substring(0, lastBracketIndex);
const newLeadsStr = ',\n' + newLeads.map(lead => '  ' + JSON.stringify(lead, null, 2).replace(/\n/g, '\n  ')).join(',\n');

const updatedContent = beforeArray + newLeadsStr + '\n];';

// Write back
fs.writeFileSync('data.js', updatedContent);

console.log('Successfully appended', newLeads.length, 'leads to data.js');
console.log('Total ΣΩΤΗΡΗΣ leads:', newLeads.length + 2, '(including 2 existing)');
