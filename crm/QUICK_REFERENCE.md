# ⚡ SAOS Studio CRM - Quick Reference

## 🚀 Start Everything

```bash
cd "/Users/giannistambakis/Desktop/SAOS Studio"
./start-crm.sh
```

Opens: http://localhost:8080

---

## 🤖 AI Commands (in Claude Code)

| Command | What It Does |
|---------|--------------|
| `/saos-feedback` | Process all pending website feedback |
| `/saos-deploy` | Deploy all marked sites to Netlify |

---

## 💬 Feedback Workflow

1. **Add Feedback**: Click client → Type in feedback panel → Set priority → Add
2. **Process**: Type `/saos-feedback` in Claude Code
3. **Verify**: Check website for changes
4. **Mark Resolved**: Automatic after AI implementation

---

## 🚀 Deployment Workflow

1. **Mark**: Click client → Scroll to Deployment → Mark for Deployment
2. **Deploy**: Type `/saos-deploy` in Claude Code
3. **Share**: Copy URL → Send to client

---

## 🎯 Quick Actions

| Want To | Do This |
|---------|---------|
| **Search** | Type in top search box |
| **Filter** | Use Advanced Filters section |
| **Add Client** | Click "+ Add Client" button |
| **View Website** | Click client card |
| **Add Feedback** | Type in feedback panel (right) |
| **Mark for Deploy** | Scroll to Deployment section |
| **Export Data** | Click "Export" button |
| **Send Email** | Click "Send Email" button |

---

## 📊 Status Colors

### Feedback Status
- 🟡 **Pending** - Not started
- 🔵 **In Progress** - Working on it
- 🟢 **Resolved** - Complete

### Deployment Status
- ⚪ **Not Deployed** - Fresh site
- 🟡 **Marked** - Ready to deploy
- 🔵 **Deploying** - In progress
- 🟢 **Deployed** - Live!
- 🔴 **Failed** - Error (retry)

---

## ⚡ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Esc` | Close viewer |
| `Cmd+Shift+R` | Hard refresh |
| `Cmd+F` | Search (browser) |

---

## 🔧 One-Time Setup

### Netlify Authentication

```bash
netlify login
```

Use: **saos.ventures@gmail.com**

Verify:
```bash
netlify status
```

---

## 💡 Pro Tips

### Batch Everything
- Mark multiple sites → Deploy all at once
- Add feedback throughout day → Process at end

### Priority Guide
- 🔴 **High**: Urgent, blocking
- 🟡 **Medium**: Important, soon
- 🟢 **Low**: Nice-to-have

### Daily Workflow
```
Morning: Review sites, add feedback
Midday: /saos-feedback (implement changes)
Afternoon: Mark sites, /saos-deploy
Evening: Share URLs with clients
```

---

## 🆘 Quick Fixes

| Problem | Solution |
|---------|----------|
| Data not showing | `Cmd+Shift+R` |
| Feedback not saving | Check localStorage |
| Netlify auth error | `netlify login` |
| Skill not working | Type exact command |
| Servers not running | `./start-crm.sh` |

---

## 📁 Important Files

```
CRM: /Desktop/SAOS Studio/crm/index.html
Clients: /Desktop/SAOS Studio/sales/SAOS Clients/
Skills: ~/.claude/skills/
```

---

## 📞 Main Commands

```bash
# Start CRM
./start-crm.sh

# AI Commands (Claude Code)
/saos-feedback
/saos-deploy

# Netlify
netlify login
netlify status
netlify sites:list
```

---

## 🎯 Your Complete System

```
CRM Dashboard
    ↓
Review Websites → Add Feedback
    ↓
/saos-feedback → Changes Implemented
    ↓
Mark for Deployment
    ↓
/saos-deploy → Live on Netlify
    ↓
Share with Clients → Done! ✅
```

---

**Time to Value:**
- Feedback → Implementation: 2-5 minutes
- Marked → Deployed: ~45 seconds
- Total workflow: Professional & Fast!

---

*Keep this handy for daily use!*
