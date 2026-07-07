// This script extracts feedback from the data structure
// Run in browser console: node extract-feedback.js

const fs = require('fs');

// Read the data file
const dataContent = fs.readFileSync('data.js', 'utf8');

// Extract clientsData array (simplified parsing)
console.log(`
==================================================
SAOS STUDIO - FEEDBACK EXTRACTION TOOL
==================================================

This tool needs to run in the browser to access localStorage.

Steps to extract feedback:
1. Open the CRM: open crm/index.html
2. Open Browser Console (F12 or Cmd+Opt+I)
3. Run this command:

console.log(JSON.stringify(localStorage.getItem('saos-feedback'), null, 2))

4. Copy the output and save it

Or use this comprehensive command:

const feedbackData = JSON.parse(localStorage.getItem('saos-feedback') || '[]');
const pendingFeedback = feedbackData
  .map(item => ({
    clientId: item.id,
    feedback: (item.feedback || []).filter(f => f.status === 'pending' || f.status === 'in-progress')
  }))
  .filter(item => item.feedback.length > 0);
  
console.log('PENDING FEEDBACK:', JSON.stringify(pendingFeedback, null, 2));
console.log('Total clients with pending feedback:', pendingFeedback.length);
console.log('Total pending items:', pendingFeedback.reduce((sum, item) => sum + item.feedback.length, 0));
