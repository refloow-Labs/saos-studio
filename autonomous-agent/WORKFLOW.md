# Autonomous Agent Workflow

## Complete Flow Diagram

\`\`\`
┌──────────────────────────────────────────────────────────────┐
│                    START: 9:00 AM Daily                      │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
           ┌─────────────────────────┐
           │   Load Leads from CSV   │
           │                         │
           │ • Read 40k leads list   │
           │ • Filter: No website    │
           │ • Filter: Valid email   │
           │ • Filter: Not processed │
           └────────────┬────────────┘
                        │
                        ▼
           ┌─────────────────────────┐
           │  Check Daily Limit      │
           │                         │
           │ Generated today: 12/50  │
           │ Remaining: 38           │
           └────────────┬────────────┘
                        │
                        ▼
           ┌─────────────────────────┐
           │  Get Next 10 Leads      │
           │                         │
           │ 1. L.D TRADING          │
           │ 2. ΚΡΙΜΑΤΟΓΛΟΥ          │
           │ 3. ACCESS TO GENOME     │
           │ ...                     │
           └────────────┬────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌───────────────┐              ┌────────────────┐
│  For Each     │              │   Parallel     │
│  Lead         │              │   Processing   │
└───────┬───────┘              └────────┬───────┘
        │                               │
        ▼                               ▼
┌─────────────────────────────────────────────┐
│         WEBSITE GENERATION PHASE            │
├─────────────────────────────────────────────┤
│                                             │
│  1. Detect Industry                         │
│     ├─ Parse NACE description              │
│     ├─ Match patterns (restaurant, hotel)  │
│     └─ Default: "Business"                 │
│                                             │
│  2. Build AI Prompt                         │
│     ├─ Company: "L.D TRADING"              │
│     ├─ Industry: "Clothing Retail"         │
│     ├─ Location: "Αττική"                  │
│     ├─ Design style: Modern, animated      │
│     └─ Tech: React + Three.js + Tailwind   │
│                                             │
│  3. Call Claude API                         │
│     ├─ Model: claude-sonnet-4-5            │
│     ├─ Max tokens: 4096                    │
│     └─ Response: Full HTML website         │
│                                             │
│  4. Deploy to Netlify                       │
│     ├─ Generate site name: "ld-trading"    │
│     ├─ Create Netlify site                 │
│     ├─ Upload HTML file                    │
│     └─ Get live URL                        │
│                                             │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │   Save to Queue      │
        │                      │
        │ • Company name       │
        │ • Email & phone      │
        │ • Demo URL           │
        │ • Status: pending    │
        │ • Created timestamp  │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Increment Counter    │
        │                      │
        │ Today: 13/50         │
        └──────────┬───────────┘
                   │
      ┌────────────┴─────────────┐
      │ More leads remaining?    │
      └────┬──────────────┬──────┘
          YES              NO
           │                │
           └──────┐    ┌────┘
                  │    │
                  ▼    ▼
        ┌──────────────────────┐
        │  Daily Cycle Complete│
        │                      │
        │ • 50 sites generated │
        │ • All in queue       │
        │ • Wait until tomorrow│
        └──────────────────────┘


┌──────────────────────────────────────────────────────────────┐
│              APPROVAL PHASE (Manual, in CRM)                 │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
           ┌─────────────────────────┐
           │  You Open CRM           │
           │                         │
           │ http://localhost:5173/  │
           │       approval-queue    │
           └────────────┬────────────┘
                        │
                        ▼
           ┌─────────────────────────┐
           │  View Pending Items     │
           │                         │
           │ [Card] L.D TRADING      │
           │  ├─ Status: Pending     │
           │  ├─ Email: ...@...gr    │
           │  ├─ Phone: 211...       │
           │  └─ [Review Button]     │
           └────────────┬────────────┘
                        │
                        ▼
           ┌─────────────────────────┐
           │  Click "Review"         │
           │                         │
           │ • Opens modal           │
           │ • Shows iframe preview  │
           │ • Full website visible  │
           └────────────┬────────────┘
                        │
            ┌───────────┴───────────┐
            │                       │
            ▼                       ▼
    ┌──────────────┐      ┌──────────────┐
    │   Approve    │      │    Reject    │
    │              │      │              │
    │ • Add notes  │      │ • Add reason │
    │ • Click OK   │      │ • Click OK   │
    └──────┬───────┘      └──────┬───────┘
           │                     │
           ▼                     ▼
    Status: approved      Status: rejected
           │                     │
           │                     └──→ [Done]
           │
           ▼
    [Ready to send]


┌──────────────────────────────────────────────────────────────┐
│           EMAIL SENDING PHASE (Every Hour)                   │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
           ┌─────────────────────────┐
           │  Check Approved Items   │
           │                         │
           │ Query: status=approved  │
           │ Found: 5 items          │
           └────────────┬────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌───────────────┐              ┌────────────────┐
│  For Each     │              │   Sequential   │
│  Approved     │              │   Sending      │
└───────┬───────┘              └────────┬───────┘
        │                               │
        ▼                               ▼
┌─────────────────────────────────────────────┐
│            EMAIL SENDING PROCESS            │
├─────────────────────────────────────────────┤
│                                             │
│  1. Prepare Email Data                      │
│     ├─ To: gadamidis@ldtrading.com.gr      │
│     ├─ Subject: Σας έφτιαξα ένα νέο site   │
│     ├─ Client: L.D TRADING                 │
│     ├─ Demo: https://ld-trading.netlify... │
│     └─ Notes: (from approval)              │
│                                             │
│  2. Generate HTML Email                     │
│     ├─ Professional template               │
│     ├─ SAOS branding                       │
│     ├─ CTA button to demo                  │
│     └─ Contact info in footer              │
│                                             │
│  3. Send via Gmail API                      │
│     ├─ Authenticate with OAuth             │
│     ├─ Encode message (base64)             │
│     ├─ Send through Gmail                  │
│     └─ Get message ID                      │
│                                             │
│  4. Update Status                           │
│     ├─ Mark as: sent                       │
│     ├─ Save sent_at timestamp              │
│     └─ Log activity in CRM                 │
│                                             │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │  Email Sent ✓        │
        │                      │
        │ Status: sent         │
        │ Sent at: 10:00       │
        └──────────────────────┘


┌──────────────────────────────────────────────────────────────┐
│         REPLY MONITORING (Every 30 Minutes)                  │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
           ┌─────────────────────────┐
           │  Check Gmail Inbox      │
           │                         │
           │ Query: is:unread        │
           │ Max: 50 messages        │
           └────────────┬────────────┘
                        │
                        ▼
           ┌─────────────────────────┐
           │  Filter Replies         │
           │                         │
           │ • Subject has "Re:"     │
           │ • Or "Σας έφτιαξα"      │
           │ • Get message details   │
           └────────────┬────────────┘
                        │
            ┌───────────┴───────────┐
            │                       │
            ▼                       ▼
    ┌──────────────┐      ┌──────────────┐
    │  Reply Found │      │  No Replies  │
    │              │      │              │
    │ From: ...    │      │ Continue...  │
    │ Subject: Re: │      └──────────────┘
    └──────┬───────┘
           │
           ▼
    ┌──────────────────┐
    │  Log Reply       │
    │                  │
    │ • Update queue   │
    │ • Mark as read   │
    │ • Status: replied│
    └──────┬───────────┘
           │
           ▼
    ┌──────────────────┐
    │  CRM Notification│
    │                  │
    │ "New reply from  │
    │  L.D TRADING"    │
    └──────────────────┘


┌──────────────────────────────────────────────────────────────┐
│                   CONTINUOUS MONITORING                      │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────┐
        │   Cron Schedules Active    │
        ├────────────────────────────┤
        │                            │
        │  9:00 AM → Generate (50)   │
        │  Every hour → Send emails  │
        │  Every 30min → Check replies│
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │      Statistics Tracked     │
        ├────────────────────────────┤
        │                            │
        │  Daily:                    │
        │  • Websites generated: 50  │
        │  • Emails sent: 35         │
        │  • Replies received: 3     │
        │                            │
        │  All Time:                 │
        │  • Total leads: 1,247      │
        │  • Conversion rate: 4.2%   │
        └────────────────────────────┘
\`\`\`

## Status Lifecycle

\`\`\`
pending_approval  →  approved  →  sent  →  replied
       ↓
    rejected
       ↓
     failed
\`\`\`

## Daily Timeline Example

\`\`\`
09:00 - Agent generates 50 websites
09:15 - All websites added to queue
10:00 - First hourly check (no approvals yet)
11:00 - Second hourly check (no approvals yet)
11:30 - You approve 10 websites in CRM
12:00 - Agent sends 10 emails
12:30 - Reply monitoring (no replies yet)
13:00 - Agent checks (no new approvals)
14:00 - You approve 15 more websites
14:30 - Reply monitoring finds 1 reply!
15:00 - Agent sends 15 emails
...
\`\`\`

## Error Handling

At each step, if something fails:
1. Error is logged
2. Status is marked as 'failed'
3. Error message is saved
4. Operation continues with next item
5. You can review failures in CRM

## Data Persistence

Everything is saved in SQLite:
- \`approval-queue.db\`: All websites and their status
- \`agent-state.db\`: Daily statistics and limits

## Manual Overrides

You can always:
- Approve/reject from CRM anytime
- Manually trigger email sends
- Restart the agent without losing state
- Query the database directly

---

This autonomous agent works 24/7, generating leads while you sleep! 🚀
