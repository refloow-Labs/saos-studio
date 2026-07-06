# 🚀 Quick Start Guide - SAOS Studio CRM

## Open the CRM (Choose one method)

### Method 1: Direct File Open (Simplest)
```bash
open /Users/giannistambakis/Desktop/SAOS\ Studio/crm/index.html
```

Just double-click `index.html` or run the command above.

### Method 2: Local Server (Recommended)
```bash
cd "/Users/giannistambakis/Desktop/SAOS Studio/crm"
python3 -m http.server 8080
```

Then open: **http://localhost:8080**

---

## ✅ First Steps

### 1. Explore Your Dashboard
- **176 total clients** loaded automatically
- **108 new leads** from Greece Excel file
- **68 existing SAOS clients** with demo websites

### 2. Try the Navigation
- Click **"All Clients"** - see everyone
- Click **"New Leads"** - 108 businesses to contact
- Click **"In Progress"** - active projects
- Click **"Completed"** - finished demos (67 websites)

### 3. Use the Search
Type in the search box:
- Business names (e.g., "Hovoli")
- Cities (e.g., "Alexandroupoli")
- Types (e.g., "Restaurant", "Hotel")

### 4. View Client Details
- Click any client card
- See full business information
- View communications history
- Access website demos
- Add notes

### 5. Send Your First Email
1. Click a client to open details
2. Click **"Send Email"** button
3. Choose "Cold Outreach" template
4. Fill in demo URL
5. Preview the email in real-time
6. Click **"Copy Email HTML"**
7. Paste into Gmail/Outlook

---

## 📧 Email Templates

### Cold Outreach Template
Perfect for first contact:
- Professional SAOS Studio branding
- Greek language content
- Personalized with client name
- Demo website CTA button
- Your contact information

### Follow-up Template
For checking in:
- Gentler tone
- References previous email
- Reminder about demo website
- Offer to make changes

---

## 🎯 Common Tasks

### Find a Specific Client
Use the search box at the top - searches name, city, type, and category.

### Filter by Category
Click category in sidebar:
- **Food & Hospitality** - Restaurants, cafes, bakeries
- **Accommodation** - Hotels, guesthouses, apartments
- **Healthcare** - Medical centers, labs, clinics

### Filter by Status
Use the filter buttons:
- **All** - Everyone
- **New** - Not contacted yet
- **Contacted** - Initial email sent
- **Demo Sent** - Website shared
- **In Progress** - Active conversation
- **Completed** - Website delivered

### Export Your Data
Click **"Export"** button in top bar to download JSON file with all client data.

### Update Client Notes
1. Open client detail
2. Click **"Notes"** tab
3. Type your notes
4. Click **"Save Notes"**

---

## 💡 Pro Tips

### Organize Your Workflow
1. Start with "New Leads"
2. Send cold outreach emails
3. Move to "Contacted" status
4. Track in Communications tab
5. Follow up after 3-5 days
6. Update status as you progress

### Use the Statistics
Dashboard shows:
- Total clients
- Active projects
- Demos sent
- Completed websites

Track your progress at a glance!

### Quick Access to Websites
For existing SAOS clients:
- Click client
- Go to "Website" tab
- Click "Open Website" to view demo
- Click "Open Project Folder" to edit

### Email Best Practices
1. Always personalize with client name
2. Include specific demo URL
3. Add custom notes for unique selling points
4. Copy HTML and paste (preserves formatting)
5. Test in your email client first

---

## 🔧 Troubleshooting

### CRM won't load
- Check that all files are in `/SAOS Studio/crm/` folder
- Make sure `data.js` exists
- Try using local server method instead of direct file open

### Client data missing
- Verify `Greece_Local_Leads_NoWebsite.xlsx` exists
- Check `sales/SAOS Clients/` folder is intact
- Data file is at `crm/data.js`

### Email template not working
- Make sure you filled in all required fields
- Check that "Copy" worked (try paste in a text editor first)
- Some email clients may need manual formatting

### Search not finding clients
- Check spelling
- Try partial matches
- Clear search and try category filters instead

---

## 📱 Mobile Access

The CRM works on mobile browsers!
- Responsive design adapts to screen size
- Touch-friendly buttons and cards
- Swipe-friendly navigation

Just open `index.html` from your phone's browser.

---

## 🎨 Customization

### Update Your Info in Emails
Edit [email-composer.html](./email-composer.html) lines 217-219:
```javascript
document.getElementById('senderName').value = "Your Name";
document.getElementById('senderEmail').value = "your@email.com";
document.getElementById('senderPhone').value = "+30 XXX XXX XXXX";
```

### Change Colors/Branding
Edit CSS variables in [index.html](./index.html):
```css
:root {
    --primary: #2563eb;  /* Main brand color */
    --success: #10b981;  /* Success/completed color */
    ...
}
```

---

## 🆘 Need Help?

1. Check [README.md](./README.md) for detailed documentation
2. Check [FOLDER_STRUCTURE.md](../FOLDER_STRUCTURE.md) for organization guide
3. Review code comments in the files
4. Check browser console for errors (F12)

---

## ⚡ Keyboard Shortcuts

- **Cmd/Ctrl + F** - Focus search box
- **Esc** - Close client detail view
- **Cmd/Ctrl + Click** - Open link in new tab

---

**You're ready to go! Start managing your clients like a pro.** 🎉

Open the CRM: `open /Users/giannistambakis/Desktop/SAOS\ Studio/crm/index.html`
