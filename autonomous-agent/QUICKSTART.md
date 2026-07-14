# Quick Start Guide

Get the autonomous agent running in 5 minutes.

## Prerequisites

- Node.js 20+ installed
- Gmail account
- Netlify account
- OpenRouter API key

## Step 1: Install Dependencies

\`\`\`bash
cd "saos studio/autonomous-agent"
npm install
\`\`\`

## Step 2: Configure Environment

\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` and add your credentials (see below for how to get them).

## Step 3: Set Up Gmail OAuth

\`\`\`bash
node src/setup-gmail.js
\`\`\`

Follow the prompts to authorize the app. This will automatically update your `.env` file.

## Step 4: Start the Agent

\`\`\`bash
npm start
\`\`\`

The agent will:
- Generate websites immediately on first run
- Add them to the approval queue
- Schedule future runs for 9:00 AM daily

## Step 5: Open CRM to Approve

\`\`\`bash
cd ../core-service-crm
npm run dev
\`\`\`

Then open: http://localhost:5173/approval-queue

Review and approve websites. Once approved, the agent will send emails automatically.

---

## Getting Your Credentials

### Gmail OAuth (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "SAOS Agent"
3. Enable Gmail API: APIs & Services → Library → Gmail API → Enable
4. Create credentials: APIs & Services → Credentials → Create OAuth Client ID
5. Choose "Desktop app"
6. Download JSON and copy `client_id` and `client_secret` to `.env`
7. Run `node src/setup-gmail.js` to get refresh token

### Netlify Token (2 minutes)

1. Go to [Netlify](https://app.netlify.com/)
2. User Settings → Applications → Personal Access Tokens
3. Click "New access token"
4. Name it "SAOS Agent" and copy to `.env`

### OpenRouter API Key (1 minute)

1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up or log in
3. Navigate to Keys section
4. Generate a new API key
5. Copy to `.env` as `OPENROUTER_API_KEY`

**Note**: OpenRouter gives you access to DeepSeek and many other models. The default is set to `deepseek/deepseek-chat` which is cost-effective and powerful.

---

## Verify It's Working

### Check the logs:

\`\`\`bash
# Agent should print:
# ✅ Agent initialized successfully
# 🚀 Starting daily cycle...
# 🔨 Generating website for: [Company Name]
# ✅ Website generated and added to approval queue
\`\`\`

### Check the database:

\`\`\`bash
sqlite3 data/approval-queue.db "SELECT id, company, status FROM approval_queue LIMIT 5;"
\`\`\`

### Open CRM:

Navigate to http://localhost:5173/approval-queue - you should see generated websites.

---

## Troubleshooting

**"Missing credentials" error:**
- Make sure you copied `.env.example` to `.env`
- Double-check all credentials are filled in

**Gmail authentication fails:**
- Run `node src/setup-gmail.js` again
- Make sure OAuth consent screen is configured
- Enable Gmail API in Google Cloud Console

**Websites not generating:**
- Check your Anthropic API key
- Verify you have API credits
- Look at the agent logs for errors

**Can't see approval queue in CRM:**
- Make sure CRM is running: `npm run dev` in core-service-crm
- Check browser console for errors
- Verify approval queue database exists

---

## Next Steps

1. **Test with one lead**: Edit the CSV to only have 1-2 test entries
2. **Approve a website**: Use the CRM approval queue
3. **Send a test email**: Wait for the hourly email check, or restart the agent
4. **Monitor replies**: Check the CRM for reply notifications

---

## Production Checklist

Before using this in production:

- [ ] Test with a few leads first
- [ ] Verify email template looks good
- [ ] Check that websites deploy correctly
- [ ] Review and customize the email copy
- [ ] Set appropriate daily limits
- [ ] Add monitoring/alerting
- [ ] Consider using PM2 or Docker for reliability

---

Need help? Check [README.md](README.md) for detailed documentation.
