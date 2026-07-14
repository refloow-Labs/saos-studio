# SAOS Autonomous Agent

An intelligent autonomous agent that generates custom website demos for SMBs and sends personalized outreach emails.

## Features

- **Automated Website Generation**: Creates 50 professional websites per day using DeepSeek via OpenRouter
- **Netlify Deployment**: Automatically deploys generated websites to Netlify
- **CRM Integration**: Approval queue integrated into your existing CRM
- **Gmail Integration**: Sends personalized emails through your Gmail account
- **Reply Tracking**: Monitors and logs email replies
- **Rate Limiting**: Configurable daily limits to avoid overwhelming recipients

## Architecture

```
┌─────────────────┐
│   Agent Core    │  ← Runs daily cycles, manages state
└────────┬────────┘
         │
    ┌────┴──────────────────────────────┐
    │                                   │
┌───▼──────────┐              ┌────────▼────────┐
│   Website    │              │     Email       │
│  Generator   │              │    Service      │
│              │              │                 │
│ • OpenRouter │              │ • Gmail API     │
│ • Netlify    │              │ • HTML Template │
└───┬──────────┘              └────────┬────────┘
    │                                  │
    └─────────────┬────────────────────┘
                  │
         ┌────────▼────────┐
         │  Approval Queue │
         │                 │
         │ • SQLite DB     │
         │ • CRM UI        │
         └─────────────────┘
```

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
cd "saos studio/autonomous-agent"
npm install
\`\`\`

### 2. Configure Environment Variables

Copy the example environment file:

\`\`\`bash
cp .env.example .env
\`\`\`

Then edit `.env` and fill in your credentials:

#### Gmail API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API
4. Create OAuth 2.0 credentials (Desktop app)
5. Download the credentials JSON
6. Run the Gmail authorization flow:

\`\`\`bash
node src/setup-gmail.js
\`\`\`

This will open a browser to authorize the app and save your refresh token.

#### Netlify API Setup

1. Go to [Netlify](https://app.netlify.com/)
2. Navigate to User Settings → Applications → Personal Access Tokens
3. Generate a new access token
4. Copy the token to your `.env` file

#### OpenRouter API Setup

1. Get your API key from [OpenRouter](https://openrouter.ai/)
2. Sign up and go to Keys section
3. Generate a new API key
4. Add it to `.env` as `OPENROUTER_API_KEY`
5. (Optional) Change model in `.env` - default is `deepseek/deepseek-chat`

### 3. Configure Leads CSV

Make sure your leads CSV path is correct in `.env`:

\`\`\`
LEADS_CSV_PATH=../../../Rhooa Labs 40k Leads List - Master copy.csv
\`\`\`

The CSV should have these columns:
- `Company` - Company name
- `Email` - Contact email
- `Τηλέφωνο` - Phone number
- `Ιστοσελίδα Εταιρίας` - Existing website (if any)
- `Περιοχή` - Location
- `NACE 2 Desc` - Industry description

### 4. Start the Agent

\`\`\`bash
npm start
\`\`\`

Or for development with auto-restart:

\`\`\`bash
npm run dev
\`\`\`

## How It Works

### Daily Cycle (Runs at 9:00 AM)

1. **Load Leads**: Reads from CSV, filters companies without websites
2. **Generate Websites**: Uses Claude API to create custom designs (batch of 10-50 per day)
3. **Deploy to Netlify**: Uploads generated websites and gets live URLs
4. **Add to Approval Queue**: Stores in SQLite database for review

### Approval Process (CRM UI)

1. Navigate to **Approval Queue** in your CRM
2. Review generated websites (preview iframe)
3. Add optional notes or customization requests
4. Click **Approve** or **Reject**

### Email Sending (Runs every hour)

1. **Check Approved**: Looks for approved websites in queue
2. **Send Emails**: Uses Gmail API with professional template
3. **Track Status**: Marks as sent, logs any errors

### Reply Monitoring (Runs every 30 minutes)

1. **Check Inbox**: Scans for new replies
2. **Match Threads**: Links replies to original emails
3. **Log Activity**: Records in CRM for follow-up

## Configuration

### Daily Limits

Edit `.env` to change the daily website generation limit:

\`\`\`
DAILY_WEBSITE_LIMIT=50
\`\`\`

### Email Template

The email template is defined in [src/email-service.js](src/email-service.js). You can customize:
- Subject line
- Body content
- CTA button text
- Footer branding

### Website Generation Prompt

The prompt sent to Claude is in [src/website-generator.js](src/website-generator.js). You can customize:
- Design style
- Industry-specific layouts
- Color schemes
- Animation preferences

## Database Schema

### approval_queue table

\`\`\`sql
CREATE TABLE approval_queue (
  id INTEGER PRIMARY KEY,
  lead_id TEXT,
  company TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  website_url TEXT,
  demo_url TEXT NOT NULL,
  website_data TEXT,
  status TEXT NOT NULL,  -- pending_approval, approved, sent, rejected, failed
  notes TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL,
  approved_at TEXT,
  sent_at TEXT,
  updated_at TEXT
);
\`\`\`

### daily_stats table

\`\`\`sql
CREATE TABLE daily_stats (
  id INTEGER PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  websites_generated INTEGER DEFAULT 0,
  emails_sent INTEGER DEFAULT 0,
  replies_received INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);
\`\`\`

## CRM Integration

The approval queue is accessible at:

\`\`\`
http://localhost:4000/approval-queue
\`\`\`

API endpoints:
- `GET /api/approval-queue?filter=pending` - Get items by status
- `POST /api/approval-queue/:id/approve` - Approve website
- `POST /api/approval-queue/:id/reject` - Reject website

## Monitoring

### Check Agent Status

\`\`\`bash
# View logs
tail -f logs/agent.log

# Check database
sqlite3 data/approval-queue.db "SELECT status, COUNT(*) FROM approval_queue GROUP BY status;"
\`\`\`

### View Statistics

\`\`\`bash
sqlite3 data/agent-state.db "SELECT * FROM daily_stats ORDER BY date DESC LIMIT 7;"
\`\`\`

## Troubleshooting

### Gmail API Errors

If you get authentication errors:
1. Check that your refresh token is valid
2. Make sure Gmail API is enabled in Google Cloud Console
3. Verify OAuth consent screen is configured

### Netlify Deployment Fails

If deployments fail:
1. Verify your Netlify access token
2. Check API rate limits
3. Ensure generated HTML is valid

### Website Generation Issues

If Claude API fails:
1. Check your Anthropic API key
2. Verify you have sufficient credits
3. Review the prompt in `website-generator.js`

## Production Deployment

### Running as a Service (PM2)

\`\`\`bash
npm install -g pm2
pm2 start src/agent.js --name saos-agent
pm2 save
pm2 startup
\`\`\`

### Using Docker

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
CMD ["node", "src/agent.js"]
\`\`\`

\`\`\`bash
docker build -t saos-agent .
docker run -d --env-file .env --name saos-agent saos-agent
\`\`\`

## Safety & Best Practices

1. **Rate Limiting**: The agent respects daily limits to avoid spam
2. **Opt-out**: Emails include unsubscribe language
3. **Error Handling**: Failed operations are logged and retried
4. **Data Privacy**: All data stored locally in SQLite
5. **Manual Approval**: Human review required before sending

## Support

For issues or questions:
- Check the logs in `logs/agent.log`
- Review the database: `data/approval-queue.db`
- Contact: giannis@saosstudio.com

---

Built with ❤️ by SAOS Studio
