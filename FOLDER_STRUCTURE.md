# SAOS Studio - Folder Organization Guide

This document explains the new organized structure of your SAOS Studio workspace.

## 📁 New Folder Structure

```
SAOS Studio/
│
├── crm/                              # ⭐ NEW - Your Client Management System
│   ├── index.html                    # Main CRM dashboard
│   ├── app.js                        # CRM application logic
│   ├── data.js                       # All client data (176 clients)
│   ├── email-composer.html           # Email template editor
│   ├── email-templates.js            # Branded email templates
│   └── README.md                     # CRM documentation
│
├── clients/                          # ⭐ ORGANIZED - All client projects
│   ├── active/                       # Currently working on
│   ├── completed/                    # Finished & delivered
│   └── leads/                        # New leads to contact
│
├── sales/                            # Original sales materials
│   └── SAOS Clients/                 # Your existing client folders (68 clients)
│       ├── Hovoli/
│       ├── AMMOS Beach Bar/
│       └── ...
│
├── templates/                        # ⭐ RECOMMENDED - Reusable website templates
│   ├── restaurant/
│   ├── hotel/
│   └── healthcare/
│
├── assets/                           # ⭐ RECOMMENDED - Shared assets
│   ├── branding/                     # SAOS Studio logos, colors
│   ├── images/                       # Stock photos
│   └── fonts/                        # Custom fonts
│
├── saos studio/                      # Main SAOS website project
│   └── sales-app-web/
│
├── Greece_Local_Leads_NoWebsite.xlsx # Original leads database (108 leads)
├── FOLDER_STRUCTURE.md               # This file
└── .DS_Store
```

## 🎯 How to Use This Structure

### Daily Workflow

1. **Start your day in the CRM**
   ```bash
   open "/Users/giannistambakis/Desktop/SAOS Studio/crm/index.html"
   ```

2. **Check "New Leads" section**
   - Filter by category you want to work on
   - Click a client to see details

3. **Create demo websites**
   - Work in `sales/SAOS Clients/[Client Name]/`
   - Or create new in `clients/active/[Client Name]/`

4. **Send outreach emails**
   - Use CRM's email composer
   - Track sent emails in client notes

5. **Move completed projects**
   - From `clients/active/` to `clients/completed/`
   - Update status in CRM

### Organizing Your Clients

#### Option A: Keep Current Structure (Recommended for now)
Keep working in `sales/SAOS Clients/` as you have been. The CRM already tracks all these clients.

#### Option B: Reorganize by Status (Future improvement)
```
clients/
├── leads/              # Not yet contacted (from Excel)
├── active/            # Currently working on
└── completed/         # Finished websites
```

### Client Folder Template

When creating a new client project, use this structure:

```
clients/active/[Client Name]/
├── index.html          # Demo website
├── README.md           # Project notes & business info
├── outreach.md         # Email copy & outreach strategy
├── assets/            # Images, logos specific to client
└── notes.txt          # Development notes
```

## 🔍 Finding Things Quickly

### Through the CRM
- **Search box**: Type client name, city, or business type
- **Filters**: Status (new, contacted, demo-sent, etc.)
- **Categories**: Food & Hospitality, Accommodation, Healthcare

### Through Finder
- All client websites: `sales/SAOS Clients/`
- New leads data: `Greece_Local_Leads_NoWebsite.xlsx`
- CRM system: `crm/`

## 📊 Data Sources

### The CRM combines:
1. **108 new leads** from `Greece_Local_Leads_NoWebsite.xlsx`
2. **68 existing clients** from `sales/SAOS Clients/`
3. **Total: 176 clients** to manage

### Data sync:
- CRM data file: `crm/data.js` (auto-generated)
- To refresh: Re-run the Python data extraction script

## 🗂️ Recommended Next Steps

### 1. Create Templates Folder (Optional but helpful)
Save time by creating reusable templates:

```bash
mkdir -p "/Users/giannistambakis/Desktop/SAOS Studio/templates/restaurant"
mkdir -p "/Users/giannistambakis/Desktop/SAOS Studio/templates/hotel"
mkdir -p "/Users/giannistambakis/Desktop/SAOS Studio/templates/healthcare"
```

Copy your best demo websites as starting points.

### 2. Create Assets Folder (Optional)
Organize shared resources:

```bash
mkdir -p "/Users/giannistambakis/Desktop/SAOS Studio/assets/branding"
mkdir -p "/Users/giannistambakis/Desktop/SAOS Studio/assets/images"
mkdir -p "/Users/giannistambakis/Desktop/SAOS Studio/assets/fonts"
```

### 3. Archive Old Files
Move completed projects from `sales/SAOS Clients/completed-sites/` if needed.

## 💡 Tips

### File Naming
- Use dashes for folders: `my-client-name`
- Keep names simple and searchable
- Avoid special characters

### Documentation
- Always include a README.md in each client folder
- Document outreach attempts
- Save all communications

### Backups
- Regular backups of `sales/SAOS Clients/`
- Export CRM data periodically
- Keep Excel file updated

## 🚀 Quick Commands

```bash
# Open CRM
open "/Users/giannistambakis/Desktop/SAOS Studio/crm/index.html"

# Start local server for CRM
cd "/Users/giannistambakis/Desktop/SAOS Studio/crm" && python3 -m http.server 8080

# Open SAOS Clients folder
open "/Users/giannistambakis/Desktop/SAOS Studio/sales/SAOS Clients"

# Search for a client
cd "/Users/giannistambakis/Desktop/SAOS Studio/sales/SAOS Clients" && ls | grep -i "search-term"
```

## 📝 Notes

- The CRM doesn't modify your original files
- All data is stored in `crm/data.js`
- Email templates are fully customizable
- You can continue working in your current structure

---

**This organization system is designed to scale as you take on more clients!** 🎉
