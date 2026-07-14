# SAOS Autonomous Agent - Architecture v2.0

## 🎯 Vision

A multi-agent system where the main orchestrator agent delegates website design to an independent Claude Code designer agent with world-class UI/UX capabilities, then handles deployment and CRM integration.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SAOS AUTONOMOUS AGENT                           │
│                     (Main Orchestrator)                             │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Daily Cycle Manager                                        │   │
│  │  • Runs at 9:00 AM                                         │   │
│  │  • Processes 10-50 leads per day                           │   │
│  │  • Coordinates all subsystems                              │   │
│  └────────────┬───────────────────────────────────────────────┘   │
│               │                                                     │
│  ┌────────────▼───────────┐      ┌──────────────────────────┐    │
│  │  Leads Manager          │      │  State Manager           │    │
│  │  • Load from CRM        │      │  • Daily stats           │    │
│  │  • Filter valid leads   │      │  • Processing state      │    │
│  │  • Track processed      │      │  • Error logs            │    │
│  └────────────┬───────────┘      └──────────────────────────┘    │
│               │                                                     │
│  ┌────────────▼──────────────────────────────────────────────┐   │
│  │  Website Designer Orchestrator                             │   │
│  │  • Spawns independent Claude Code sessions                 │   │
│  │  • Delegates to UI/UX expert agent                        │   │
│  │  • Collects designed websites                             │   │
│  │  • Validates output                                       │   │
│  └────────────┬──────────────────────────────────────────────┘   │
│               │                                                     │
│  ┌────────────▼──────────────────────────────────────────────┐   │
│  │  Deployment Manager                                        │   │
│  │  • Deploy to Netlify                                       │   │
│  │  • Get live URLs                                           │   │
│  │  • Handle errors                                           │   │
│  └────────────┬──────────────────────────────────────────────┘   │
│               │                                                     │
│  ┌────────────▼──────────────────────────────────────────────┐   │
│  │  Approval Queue Manager                                    │   │
│  │  • Store in SQLite                                         │   │
│  │  • Sync to CRM UI                                          │   │
│  │  • Track approval status                                   │   │
│  └────────────┬──────────────────────────────────────────────┘   │
│               │                                                     │
│  ┌────────────▼──────────────────────────────────────────────┐   │
│  │  Email Service                                             │   │
│  │  • Send via Gmail API                                      │   │
│  │  • Track sent emails                                       │   │
│  │  • Monitor replies                                         │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘

                              │
                              ▼
         ┌────────────────────────────────────────────┐
         │  CLAUDE CODE DESIGNER AGENT                │
         │  (Independent Session)                     │
         │                                            │
         │  Skills:                                   │
         │  • ui-ux-pro-max                          │
         │  • 161 color palettes                     │
         │  • 57 font pairings                       │
         │  • 50+ design styles                      │
         │  • Responsive design                      │
         │  • Accessibility (WCAG 2.1)               │
         │                                            │
         │  Input:                                   │
         │  • Company name                           │
         │  • Industry (NACE description)            │
         │  • Location                               │
         │  • Design brief                           │
         │                                            │
         │  Output:                                  │
         │  • Complete HTML/CSS/JS website           │
         │  • Fully responsive                       │
         │  • Production-ready                       │
         │  • World-class UI/UX                      │
         └────────────────────────────────────────────┘

                              │
                              ▼
                     ┌─────────────────┐
                     │   CRM UI        │
                     │  Approval Queue │
                     │  • Preview      │
                     │  • Approve      │
                     │  • Reject       │
                     └─────────────────┘
```

## 🔄 Workflow

### Phase 1: Lead Selection (9:00 AM Daily)
1. Load leads from CRM data
2. Filter for companies without websites
3. Select batch (10-50 leads based on limit)
4. Check daily quota

### Phase 2: Website Design (Delegated to Claude Code Agent)
```javascript
For each lead:
  1. Main agent prepares design brief:
     - Company: "Taverna Yannis"
     - Industry: "Restaurant - Traditional Greek Cuisine"
     - Location: "Santorini, Greece"
     - Target: "Tourists and locals looking for authentic dining"

  2. Spawn independent Claude Code session with ui-ux-pro-max skill

  3. Designer agent creates:
     - Modern, responsive website
     - Industry-appropriate design
     - Greek aesthetic (colors, typography)
     - Mobile-first approach
     - Accessibility compliant
     - SEO optimized

  4. Designer agent returns:
     - index.html (complete)
     - All assets embedded or provided
     - Design notes

  5. Main agent validates output
```

### Phase 3: Deployment
1. Create Netlify site
2. Upload website files
3. Get live URL
4. Test deployment

### Phase 4: Approval Queue
1. Store in SQLite database
2. Sync to CRM UI
3. Human reviews in approval queue
4. Approve or reject

### Phase 5: Email Outreach (Hourly)
1. Check for approved websites
2. Send personalized emails via Gmail
3. Track delivery
4. Monitor replies (every 30 min)

## 🎨 Designer Agent Capabilities

The independent Claude Code designer agent has access to:

### Design Styles (50+)
- Glassmorphism
- Claymorphism
- Minimalism
- Brutalism
- Neumorphism
- Bento grid
- Dark mode
- Skeuomorphism
- Flat design
- Material design

### Color Palettes (161)
- Industry-specific schemes
- Greek-inspired palettes
- Accessibility-first colors
- Brand-appropriate combinations

### Font Pairings (57)
- Google Fonts integration
- Industry-appropriate typography
- Readability optimized
- Multi-language support (Greek/English)

### Components
- Hero sections
- Navigation bars
- Contact forms
- Image galleries
- Testimonials
- Call-to-action buttons
- Footer sections
- Social media integration

### Technical Excellence
- Responsive breakpoints (mobile, tablet, desktop)
- WCAG 2.1 AA accessibility
- SEO meta tags
- Open Graph tags
- Performance optimized
- Cross-browser compatible
- Touch-friendly interactions

## 🔌 Agent-to-Agent Communication Protocol

### Method 1: File-based Communication (Current Implementation)

```javascript
// Main agent creates job file
{
  "job_id": "job_2026_07_10_001",
  "status": "pending",
  "created_at": "2026-07-10T20:00:00Z",
  "lead": {
    "company": "Taverna Yannis",
    "industry": "Restaurant - Traditional Greek Cuisine",
    "location": "Santorini, Greece",
    "email": "info@tavernayannis.gr"
  },
  "design_brief": {
    "style": "modern-mediterranean",
    "color_scheme": "warm-greek-sunset",
    "key_features": ["menu", "gallery", "reservations", "contact"],
    "tone": "welcoming, authentic, family-friendly"
  }
}

// Designer agent reads job, creates website, writes result
{
  "job_id": "job_2026_07_10_001",
  "status": "completed",
  "completed_at": "2026-07-10T20:05:00Z",
  "output": {
    "html": "<!DOCTYPE html>...",
    "assets": {
      "inline_css": true,
      "inline_js": true,
      "external_images": []
    },
    "design_notes": "Used warm Mediterranean palette with sunset oranges...",
    "features_implemented": ["responsive", "dark-mode", "contact-form"]
  }
}
```

### Method 2: Process-based Communication (Future)

```javascript
// Main agent spawns designer agent as child process
const designer = spawn('claude-code', [
  '--skill', 'ui-ux-pro-max',
  '--input', 'job-001.json',
  '--output', 'result-001.json'
]);

designer.on('exit', (code) => {
  const result = readJSON('result-001.json');
  procesDesignedWebsite(result);
});
```

## 📊 Database Schema

### approval_queue
```sql
CREATE TABLE approval_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id TEXT UNIQUE NOT NULL,
  lead_id TEXT,
  company TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  location TEXT,
  industry TEXT,
  website_url TEXT,
  demo_url TEXT,
  website_html TEXT,
  design_notes TEXT,
  status TEXT NOT NULL, -- pending_approval, approved, sent, rejected, failed
  notes TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL,
  approved_at TEXT,
  sent_at TEXT,
  updated_at TEXT,

  -- Designer agent metadata
  designer_session_id TEXT,
  design_style TEXT,
  design_duration_seconds INTEGER
);
```

### designer_jobs
```sql
CREATE TABLE designer_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id TEXT UNIQUE NOT NULL,
  lead_id TEXT,
  company TEXT NOT NULL,
  status TEXT NOT NULL, -- pending, in_progress, completed, failed
  design_brief TEXT,
  created_at TEXT NOT NULL,
  started_at TEXT,
  completed_at TEXT,
  error_message TEXT,

  -- Input
  input_file_path TEXT,

  -- Output
  output_file_path TEXT,
  html_size_bytes INTEGER,

  -- Performance
  duration_seconds INTEGER,
  retries INTEGER DEFAULT 0
);
```

## 🚀 Implementation Plan

### Step 1: Create Designer Agent System
- `src/designer-agent.js` - Spawn and manage Claude Code sessions
- `src/design-brief-generator.js` - Create prompts for designer
- `data/designer-jobs/` - Job queue directory

### Step 2: Update Main Agent
- `src/website-orchestrator.js` - Replace direct generation with delegation
- `src/agent.js` - Add designer job management

### Step 3: Implement Communication
- File-based job queue system
- Result validation and parsing
- Error handling and retries

### Step 4: CRM Integration
- Update approval queue schema
- Add designer metadata to CRM UI
- Show design notes in preview

### Step 5: Testing & Optimization
- Test with real leads
- Measure quality vs. speed
- Fine-tune prompts
- Add monitoring

## 🎯 Success Metrics

- **Design Quality**: 9/10+ (human review score)
- **Response Rate**: >5% (email open + reply)
- **Processing Time**: <5 minutes per website
- **Deployment Success**: >95%
- **Approval Rate**: >80% (minimal rejections)

## 🔧 Configuration

All configurable via `.env`:
```bash
DESIGNER_AGENT_ENABLED=true
DESIGNER_AGENT_SKILL=ui-ux-pro-max
DESIGNER_AGENT_TIMEOUT_SECONDS=300
DESIGNER_AGENT_MAX_RETRIES=2
```

---

**Next Steps**: Implement the designer agent system with world-class UI/UX capabilities.
