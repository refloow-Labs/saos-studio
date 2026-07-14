# SAOS Studio - Complete Business System

A comprehensive suite of tools for managing Greek business leads, generating custom websites, and running the SAOS Studio business.

## 📁 Project Structure

```
SAOS Studio/
├── crm/                      # Client Management System
│   ├── index.html           # Main CRM dashboard
│   ├── app.js               # Application logic
│   ├── data.js              # Client data (176 leads + clients)
│   ├── email-composer.html  # Email template editor
│   ├── email-templates.js   # Branded email templates
│   ├── agent-drafts/        # Draft website templates
│   └── assets/              # Images and resources
│
├── website/                  # SAOS Studio Business Website
│   ├── src/                 # Source files (React/TypeScript)
│   ├── public/              # Static assets
│   ├── dist/                # Production build
│   └── package.json         # Dependencies
│
├── autonomous-agent/         # Automated Website Generator
│   ├── src/                 # Agent source code
│   ├── data/                # Generated websites & queue
│   ├── .env                 # Configuration (API keys)
│   └── package.json         # Dependencies
│
├── scripts/                  # Startup Scripts
│   ├── start-crm.sh         # Launch CRM system
│   └── start-agent.sh       # Launch autonomous agent
│
└── docs/                     # Documentation
    ├── README.md            # This file
    ├── START_HERE.md        # Quick start guide
    └── HOW_TO_USE_SAOS_FEEDBACK.md
```

## 🚀 Quick Start

### 1. Start the CRM

```bash
cd "/Users/giannistambakis/Desktop/SAOS Studio"
./scripts/start-crm.sh
```

This will:
- Launch the CRM dashboard on [http://localhost:8080](http://localhost:8080)
- Start a server for demo websites on [http://localhost:8081](http://localhost:8081)
- Automatically open the CRM in your browser

### 2. Start the Autonomous Agent

```bash
cd "/Users/giannistambakis/Desktop/SAOS Studio"
./scripts/start-agent.sh
```

First-time setup:
1. Install dependencies: `npm install`
2. Configure `.env` with your API keys:
   - Gmail OAuth credentials
   - Netlify access token
   - OpenRouter API key
3. Run setup: `npm run setup`

See [autonomous-agent/README.md](autonomous-agent/README.md) for detailed instructions.

### 3. Work on the Website

```bash
cd "/Users/giannistambakis/Desktop/SAOS Studio/website"
npm install
npm run dev
```

This starts the development server for the SAOS Studio business website.

## 📊 The Three Systems

### 1. CRM - Client Management System

**Purpose**: Manage all client leads, send professional emails, track projects

**Key Features**:
- 176 clients (108 new leads + 68 existing SAOS clients)
- Smart filtering by status, category, and search
- Professional email templates with live preview
- Client profiles with ratings and contact details
- Status tracking: New → Contacted → Demo Sent → In Progress → Completed

**Access**: [http://localhost:8080](http://localhost:8080) (after running `start-crm.sh`)

**Documentation**: [crm/README.md](crm/README.md)

### 2. Website - Business Website

**Purpose**: The public-facing SAOS Studio website

**Key Features**:
- Modern React/TypeScript application
- Tailwind CSS styling
- Responsive design
- Service showcase
- Contact forms
- Portfolio

**Technology Stack**:
- React + TypeScript
- Vite build system
- Tailwind CSS
- Deployed on Netlify

**Development**: `cd website && npm run dev`

### 3. Autonomous Agent - Website Generator

**Purpose**: Automatically generate custom websites for leads and send outreach emails

**Key Features**:
- Generates 50 professional websites per day using DeepSeek via OpenRouter
- Deploys to Netlify automatically
- Approval queue integrated into CRM
- Gmail integration for personalized emails
- Reply tracking and monitoring
- Configurable rate limits

**How It Works**:
1. **Daily Cycle (9:00 AM)**: Generate websites for leads without websites
2. **Approval Process**: Review and approve websites in CRM approval queue
3. **Email Sending (Hourly)**: Send personalized emails for approved websites
4. **Reply Monitoring (30 min)**: Track responses and log in CRM

**Access**: Approval queue at [http://localhost:4000/approval-queue](http://localhost:4000/approval-queue)

**Documentation**: [autonomous-agent/README.md](autonomous-agent/README.md)

## 🛠️ System Requirements

- **Node.js**: v18+ (for autonomous agent and website)
- **Python**: 3.x (for CRM local server)
- **Browser**: Chrome, Safari, or Firefox (latest versions)
- **Git**: For version control

## 🔑 API Keys & Configuration

### Required for Autonomous Agent:

1. **OpenRouter API Key**
   - Get from: [https://openrouter.ai/](https://openrouter.ai/)
   - Add to `autonomous-agent/.env` as `OPENROUTER_API_KEY`

2. **Netlify Access Token**
   - Get from: [https://app.netlify.com/](https://app.netlify.com/)
   - User Settings → Applications → Personal Access Tokens
   - Add to `autonomous-agent/.env` as `NETLIFY_ACCESS_TOKEN`

3. **Gmail OAuth Credentials**
   - Set up at: [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Enable Gmail API
   - Create OAuth 2.0 credentials
   - Run: `cd autonomous-agent && npm run setup`

### Required for Website Deployment:

- Netlify site configuration (already set up)

## 📝 Common Tasks

### View All Clients in CRM

```bash
./scripts/start-crm.sh
```

Then navigate to "All Clients" view.

### Generate New Websites

1. Ensure autonomous agent is configured
2. Run: `cd autonomous-agent && npm start`
3. Agent will generate websites automatically
4. Review in CRM approval queue

### Send Outreach Email

1. Open CRM
2. Select a client
3. Click "Send Email"
4. Choose template (Cold Outreach or Follow-up)
5. Preview and copy HTML
6. Paste into Gmail/Outlook

### Deploy Website Updates

```bash
cd website
npm run build
# Netlify auto-deploys from git push
```

## 🎯 Workflows

### New Lead → Demo Website → Outreach

1. **Import Lead**: Add to CRM or have agent discover from CSV
2. **Generate Website**: Agent creates custom demo automatically
3. **Review in Queue**: Check quality in CRM approval queue
4. **Approve**: Mark as approved for sending
5. **Agent Sends Email**: Automated outreach with demo link
6. **Track Response**: Monitor replies and update status

### Manual Client Project

1. **Create Website**: Design in your preferred tool
2. **Add to CRM**: Update client record with demo URL
3. **Send Email**: Use CRM email composer
4. **Track Progress**: Update status as project progresses
5. **Mark Complete**: Update to "Completed" when delivered

## 🔧 Troubleshooting

### CRM Won't Start

```bash
# Kill any existing servers
lsof -ti:8080 | xargs kill -9
lsof -ti:8081 | xargs kill -9

# Try again
./scripts/start-crm.sh
```

### Autonomous Agent Errors

```bash
# Check logs
cd autonomous-agent
tail -f logs/agent.log

# Verify environment
cat .env

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Website Build Issues

```bash
cd website
rm -rf node_modules dist
npm install
npm run build
```

## 📈 Statistics & Monitoring

### CRM Stats
- Total Clients: 176
- New Leads: 108
- Existing SAOS Clients: 68
- Categories: Food & Hospitality, Accommodation, Healthcare

### Autonomous Agent Stats
- Daily Website Limit: 50
- OpenRouter Model: `deepseek/deepseek-chat`
- Email Rate: Hourly for approved websites
- Reply Check: Every 30 minutes

View in database:
```bash
cd autonomous-agent
sqlite3 data/agent-state.db "SELECT * FROM daily_stats ORDER BY date DESC LIMIT 7;"
```

## 🚧 What's Been Removed

This workspace has been cleaned and reorganized. The following were removed:

- ❌ `sales-app/` (old desktop app - 53MB)
- ❌ `sales-app-web/` (old web version - 623MB)
- ❌ `marketing/` (outdated marketing docs)
- ❌ `core-service-crm/` (old CRM version)
- ❌ Screenshot images (*.png, *.jpeg)
- ❌ Temporary and duplicate files
- ❌ Old documentation files

**Total space freed**: ~700MB+

## 📚 Additional Documentation

- [CRM Documentation](crm/README.md)
- [Website Documentation](website/)
- [Autonomous Agent Documentation](autonomous-agent/README.md)
- [Quick Start Guide](docs/START_HERE.md)
- [Feedback System Guide](docs/HOW_TO_USE_SAOS_FEEDBACK.md)

## 🤝 Support

For questions or issues:
- Check the relevant README in each directory
- Review logs (CRM browser console, agent logs)
- Verify configuration files (.env, package.json)

---

**Built with ❤️ by SAOS Studio**

*Helping Greek businesses get online, one website at a time.*
