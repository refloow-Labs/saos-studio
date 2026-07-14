# How to Use /saos-feedback Skill

## Overview

The `/saos-feedback` skill is now properly configured as a global Claude Code skill. It will automatically implement pending website feedback from your CRM.

## Setup Complete ✅

The skill has been properly structured:
- Location: `~/.claude/skills/saos-feedback/SKILL.md`
- Also available: `~/.claude/skills/saos-deploy/SKILL.md`

## How to Use

### Step 1: Add Feedback Through CRM

1. Open the CRM: `./start-crm.sh`
2. Click on any client with a website
3. In the website viewer, use the feedback panel on the right
4. Add feedback items with priority (low/medium/high)
5. Feedback is automatically saved to localStorage

### Step 2: Extract Feedback (Optional - for verification)

Open the feedback extraction tool to see what feedback exists:
```bash
open "/Users/giannistambakis/Desktop/SAOS Studio/crm/extract-feedback.html"
```

This will show you:
- Total clients with pending feedback
- Number of pending items
- Breakdown by priority (high/medium/low)
- Full JSON of all feedback

### Step 3: Run the Skill

In Claude Code, simply type:
```
/saos-feedback
```

The skill will:
1. 🔍 Scan the CRM for all pending feedback
2. 📊 Group by client and prioritize (high → medium → low)
3. 🛠️ Implement each feedback item:
   - Opens the client's website file
   - Makes the requested changes
   - Uses appropriate design skills (design-html, web-perf, etc.)
   - Tests the changes
4. ✅ Marks each item as "resolved"
5. 📝 Provides a summary report

## Example Workflow

### Adding Feedback

1. Open CRM → Click "Hovoli" client card
2. Website opens in viewer
3. In feedback panel, type: "Change hero background to warmer colors"
4. Set priority: High
5. Click "Add Feedback"

### Processing Feedback

Type in Claude Code:
```
/saos-feedback
```

Expected output:
```
🔍 Scanning CRM for pending feedback...

Found 3 clients with 7 pending items:
- Hovoli: 2 items (1 high, 1 medium)
- Almasi Luxury Suites: 3 items (2 high, 1 low)
- Olympic Bakery: 2 items (2 medium)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 Client: Hovoli
📍 File: sales/SAOS Clients/Hovoli/index.html

📝 Feedback #1 (HIGH):
"Change hero background to warmer colors"

🛠️  Implementing...
   → Opening website file
   → Using design-html skill
   → Updated hero section background gradient
   → Changed from cool blue to warm amber tones
   → Maintained existing animations
   → Tested responsive behavior
   ✅ Marked as resolved

📝 Feedback #2 (MEDIUM):
"Add phone number to header"

🛠️  Implementing...
   → Adding contact information to navbar
   → Phone: 2551 024364
   → Styled to match existing design
   → Mobile responsive
   ✅ Marked as resolved

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

... (continues for all clients)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Summary:
✅ 7 feedback items processed
✅ 3 websites updated
✅ All changes tested and working
✅ Feedback statuses updated in CRM

💡 You can now:
   1. Review changes in CRM at http://localhost:8080
   2. Mark sites for deployment
   3. Run /saos-deploy to publish
```

## Manual Workflow (If Skill Doesn't Load)

If the skill command doesn't work, you can manually process feedback:

### 1. Extract Feedback
```bash
open "/Users/giannistambakis/Desktop/SAOS Studio/crm/extract-feedback.html"
```

### 2. For Each Pending Item

Tell Claude Code:
```
I have feedback for client "Hovoli":
- Feedback: "Change hero background to warmer colors"
- Priority: high
- Website file: sales/SAOS Clients/Hovoli/index.html

Please implement this change and mark the feedback as resolved.
```

Claude will:
1. Open the website file
2. Make the changes
3. Test them
4. Update the feedback status

## Feedback Storage

Feedback is stored in browser localStorage:
- Key: `saos-feedback`
- Format: Array of client objects with feedback arrays
- Each feedback item has: id, text, priority, status, timestamps

To clear all feedback (for testing):
```javascript
// In browser console on CRM page:
localStorage.removeItem('saos-feedback');
```

## Tips

1. **Be specific in feedback**: "Change hero background color to #f59e0b" is better than "Make it look better"
2. **Set appropriate priority**: High = breaks functionality, Medium = improvements, Low = nice-to-have
3. **Use the viewer**: Always test websites in the CRM viewer after changes
4. **Batch processing**: Add all feedback first, then run `/saos-feedback` once
5. **Check results**: Refresh the website in CRM viewer to see changes

## Troubleshooting

### Skill not found
The skill might need a Claude Code restart to be recognized. In the meantime, use the manual workflow above.

### No feedback found
- Make sure you've added feedback through the CRM interface
- Open extract-feedback.html to verify feedback exists
- Check that you're using the same browser (same localStorage)

### Changes not visible
- Hard refresh the CRM: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Check that the HTTP server is running on port 8081
- Verify the website file was actually modified

## Next Steps

After processing feedback:
1. Review changes in CRM
2. Mark sites for deployment (click "Mark for Deployment" button)
3. Run `/saos-deploy` to push to Netlify
4. Share Netlify URLs with clients

---

**The /saos-feedback skill is ready to use and will save you hours of manual website updates!**
