# SAOS Studio - Client Management System

A comprehensive CRM and project management system designed specifically for managing Greek business leads and client website projects.

## Features

### 📊 Dashboard & Overview
- **All-in-one view** of 176 clients (108 new leads + 68 existing SAOS clients)
- **Smart filtering** by status, category, and custom search
- **Real-time statistics** showing active projects, demos sent, and completed websites
- **Clean, modern UI** optimized for desktop and mobile

### 👥 Client Management
- **Detailed client profiles** with business information, ratings, and contact details
- **Status tracking**: New → Contacted → Demo Sent → In Progress → Completed
- **Category organization**: Food & Hospitality, Accommodation, Healthcare
- **Quick access** to Google Maps, phone, and business details

### 📧 Email System
- **Branded email templates** (Cold Outreach & Follow-up)
- **Live preview** as you compose
- **Dynamic variables** for personalization
- **One-click copy** to clipboard (ready to paste into any email client)
- **Fully responsive** HTML emails that work everywhere

### 🌐 Website Tracking
- Links to demo websites for 67 clients
- Quick access to project folders
- Website preview integration
- Outreach materials and documentation tracking

### 📝 Communications & Notes
- Timeline view of all client interactions
- Custom notes for each client
- Outreach status tracking
- Communication history

## Quick Start

### 1. Open the CRM

Simply open [index.html](./index.html) in your browser:

```bash
open /Users/giannistambakis/Desktop/SAOS\ Studio/crm/index.html
```

Or use a local server (recommended):

```bash
cd "/Users/giannistambakis/Desktop/SAOS Studio/crm"
python3 -m http.server 8080
# Then open: http://localhost:8080
```

### 2. Browse Your Clients

- **All Clients**: See everyone in one view
- **New Leads**: 108 businesses from Greece that need websites
- **In Progress**: Active client projects
- **Completed**: Finished demo websites

### 3. Send Professional Emails

1. Click "Send Email" or select a client and click their email button
2. Choose a template (Cold Outreach or Follow-up)
3. Fill in client details and demo URL
4. Preview live in real-time
5. Click "Copy Email HTML"
6. Paste into your email client (Gmail, Outlook, etc.)

## File Structure

```
crm/
├── index.html              # Main dashboard
├── app.js                  # Application logic
├── data.js                 # All client data (auto-generated)
├── email-composer.html     # Email template editor
├── email-templates.js      # Branded email templates
└── README.md              # This file
```

## Data Sources

### New Leads (108 clients)
Imported from: `Greece_Local_Leads_NoWebsite.xlsx`
- Business name, type, and category
- Location (city, address)
- Contact information (phone)
- Google ratings and reviews
- Web presence status

### Existing SAOS Clients (68 clients)
Imported from: `sales/SAOS Clients/`
- Demo websites already created
- Outreach materials prepared
- Project documentation
- Website files and assets

## Customization

### Update Your Contact Information

Edit in [email-composer.html](./email-composer.html):

```javascript
// Lines 217-219
document.getElementById('senderName').value = "Your Name";
document.getElementById('senderEmail').value = "your@email.com";
document.getElementById('senderPhone').value = "+30 XXX XXX XXXX";
```

### Add New Email Templates

1. Open [email-templates.js](./email-templates.js)
2. Create a new function (e.g., `renderProposalTemplate`)
3. Add it to the `renderEmailTemplate` switch
4. Add the template option to the composer UI

### Update Client Data

The data file is auto-generated from your Excel and SAOS Clients folders. To refresh:

```bash
# Re-run the data extraction script (see main generation script)
```

## Tips & Best Practices

### Email Workflow
1. **Cold Outreach**: Send to new leads with their demo website
2. **Follow-up**: Check in after 3-5 days if no response
3. **Track everything**: Add notes after each communication

### Status Progression
- **New** → First contact not yet made
- **Contacted** → Initial email sent
- **Demo Sent** → Website preview shared
- **In Progress** → Active conversation/development
- **Completed** → Website delivered and launched

### Search & Filter
- Search by business name, city, or type
- Filter by status to focus on specific stages
- Use category filters for specialized outreach

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Safari
- ✅ Firefox
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Technical Details

- **Pure HTML/CSS/JS** - No build process required
- **No backend needed** - All data is client-side
- **Responsive design** - Works on all screen sizes
- **Modern styling** - Clean, professional interface
- **Fast & lightweight** - Loads instantly

## Future Enhancements

Potential additions:
- Export to PDF reports
- Email integration with Gmail API
- Analytics dashboard
- Task reminders and follow-up scheduling
- Invoice generation
- Contract templates

## Support

For questions or issues:
- Check the inline comments in the code
- Review the browser console for errors
- Verify file paths are correct for your system

---

**Built with ❤️ for SAOS Studio**
*Helping Greek businesses get online, one website at a time.*
