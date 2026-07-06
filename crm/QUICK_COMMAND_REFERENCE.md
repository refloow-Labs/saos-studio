# ⚡ Quick Command Reference

## SAOS Studio CRM Commands

---

## 🚀 Start CRM

```bash
cd "/Users/giannistambakis/Desktop/SAOS Studio"
./start-crm.sh
```

Opens CRM at: http://localhost:8080

---

## 🤖 Process Feedback with AI

In Claude Code, type:

```
/saos-feedback
```

**What it does:**
- Scans CRM for pending feedback
- Implements all changes automatically
- Uses expert design skills
- Marks feedback as resolved
- Reports progress in real-time

---

## 💬 Add Feedback

1. Click client with website
2. Type feedback in right panel
3. Set priority (Low/Medium/High)
4. Click "Add Feedback"

---

## ➕ Add New Client

1. Click "+ Add Client" button
2. Fill in business name (required)
3. Add other details (optional)
4. Click "Add Client"

---

## 🎯 Quick Actions

| Action | How To |
|--------|--------|
| **Search** | Type in search box at top |
| **Filter Status** | Use dropdowns in Advanced Filters |
| **Filter Category** | Click category in sidebar |
| **Export Data** | Click "Export" button |
| **Send Email** | Click "Send Email" button |
| **View Website** | Click client card with website |
| **Close Viewer** | Press Esc or click X |
| **Mark Progress** | Click "Start Work" button |
| **Resolve** | Click "Mark Resolved" button |

---

## 📁 File Locations

```
CRM Dashboard:
/Users/giannistambakis/Desktop/SAOS Studio/crm/index.html

Client Websites:
/Users/giannistambakis/Desktop/SAOS Studio/sales/SAOS Clients/[CLIENT_NAME]/

AI Skill:
~/.claude/skills/saos-feedback.md

Documentation:
/Users/giannistambakis/Desktop/SAOS Studio/crm/FEEDBACK_SYSTEM_GUIDE.md
```

---

## 🔥 Daily Workflow

```
Morning:
./start-crm.sh

Review Sites:
- Click through clients
- Add feedback as you spot issues
- Set priorities

End of Day:
/saos-feedback (in Claude Code)

Result:
All changes implemented automatically! ✅
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Esc` | Close website viewer |
| `Cmd+Shift+R` | Hard refresh |
| `Cmd+F` | Focus search (browser default) |

---

## 🆘 Quick Troubleshooting

**Feedback not saving?**
→ Check localStorage enabled, hard refresh

**Skill not working?**
→ Type exact: `/saos-feedback`

**Website viewer blank?**
→ Check both servers running (8080 + 8081)

**Data not showing?**
→ Hard refresh: Cmd+Shift+R

---

## 📊 Priority Guide

**🔴 High**
- Blocking issues
- Client requests
- Broken features

**🟡 Medium**
- Content updates
- Styling tweaks
- Performance

**🟢 Low**
- Polish
- Nice-to-haves
- Experiments

---

## 💡 Pro Tips

1. **Batch feedback** throughout day
2. **Process once** at end of day
3. **Set clear priorities** for AI
4. **Review results** before delivery
5. **Export regularly** as backup

---

**Main Command:** `/saos-feedback` 🚀

That's all you need to remember!
