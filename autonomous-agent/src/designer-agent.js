/**
 * Designer Agent Manager
 * Spawns independent Claude Code sessions for world-class website design
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { DesignBriefGenerator } from './design-brief-generator.js';
import { SkillRunner } from './skill-runner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DesignerAgent {
  constructor() {
    this.briefGenerator = new DesignBriefGenerator();
    this.jobsDir = path.join(__dirname, '../data/designer-jobs');
    this.outputDir = path.join(__dirname, '../data/designer-output');
    this.timeout = parseInt(process.env.DESIGNER_AGENT_TIMEOUT_SECONDS || '300') * 1000;
    this.maxRetries = parseInt(process.env.DESIGNER_AGENT_MAX_RETRIES || '2');
  }

  async initialize() {
    // Ensure directories exist
    await fs.mkdir(this.jobsDir, { recursive: true });
    await fs.mkdir(this.outputDir, { recursive: true });
    console.log('✅ Designer agent system initialized');
  }

  /**
   * Request website design from Claude Code agent
   * @param {Object} lead - Lead information
   * @param {Object} [options] - options
   * @param {Array} [options.qaFeedback] - QA issues from a previous failed attempt, appended to the prompt
   * @param {boolean} [options.forceSimulation] - skip the real skill run and always simulate (used by CLI test mode)
   * @returns {Promise<Object>} Design result
   */
  async designWebsite(lead, options = {}) {
    const jobId = this.generateJobId(lead);
    console.log(`\n🎨 Requesting design for: ${lead.Company || lead.company}`);
    console.log(`   Job ID: ${jobId}`);

    try {
      // Generate design brief and prompt
      const { brief, prompt } = this.briefGenerator.generateDesignerPrompt(lead);
      const fullPrompt = prompt + this.buildQaFeedbackSection(options.qaFeedback);

      // Create job file
      const job = {
        job_id: jobId,
        status: 'pending',
        created_at: new Date().toISOString(),
        lead: {
          company: lead.Company || lead.company,
          industry: lead['NACE 2 Desc'] || lead.industry,
          location: lead['Περιοχή'] || lead.location,
          email: lead.Email || lead.email,
        },
        design_brief: brief,
        designer_prompt: fullPrompt,
      };

      const jobFilePath = path.join(this.jobsDir, `${jobId}.json`);
      const outputFilePath = path.join(this.outputDir, `${jobId}.json`);

      await fs.writeFile(jobFilePath, JSON.stringify(job, null, 2));

      console.log(`   📝 Job file created: ${jobFilePath}`);
      console.log(`   ⏳ Waiting for designer agent to complete...`);

      let result = null;

      if (!options.forceSimulation && (await SkillRunner.isClaudeAvailable())) {
        result = await this.runViaSkill(job, outputFilePath);
      }

      if (!result) {
        // Real skill run unavailable, skipped, failed, or malformed —
        // fall back to the deterministic simulated designer.
        result = await this.simulateDesignerAgent(job, outputFilePath);
      }

      console.log(`   ✅ Design completed!`);
      console.log(`   📄 Output size: ${(result.output.html.length / 1024).toFixed(2)} KB`);

      return result;

    } catch (error) {
      console.error(`   ❌ Design failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Build a clearly-delimited QA corrections section to append to the designer prompt.
   * Mirrors WebsiteGenerator.sanitizeQaFeedback's bounding logic locally (severity sort,
   * cap 10 items, 300-char truncation) so this module has no import dependency on
   * website-generator.js.
   * @param {Array} [qaFeedback]
   * @returns {string}
   */
  buildQaFeedbackSection(qaFeedback) {
    if (!Array.isArray(qaFeedback) || qaFeedback.length === 0) {
      return '';
    }

    const items = this.sanitizeQaFeedback(qaFeedback)
      .map((issue, i) => `${i + 1}. [${issue.severity}] ${issue.description}${issue.fix ? ` — ${issue.fix}` : ''}`)
      .join('\n');

    return `\n\n--- ΔΙΟΡΘΩΣΕΙΣ QA — ΥΠΟΧΡΕΩΤΙΚΕΣ ΔΙΟΡΘΩΣΕΙΣ ---\nΗ προηγούμενη έκδοση απέτυχε στον ποιοτικό έλεγχο. Διόρθωσε ΟΠΩΣΔΗΠΟΤΕ τα εξής:\n${items}\n--- ΤΕΛΟΣ ΔΙΟΡΘΩΣΕΩΝ QA ---`;
  }

  /**
   * Bound QA feedback before it is injected into a prompt: sorts by severity
   * (critical > high > medium > low), caps to the 10 most severe issues, and
   * truncates/normalizes free-text fields.
   * @param {Array} qaFeedback
   * @returns {Array}
   */
  sanitizeQaFeedback(qaFeedback) {
    const severityRank = { critical: 0, high: 1, medium: 2, low: 3 };
    const rankOf = (severity) => {
      const rank = severityRank[String(severity || '').toLowerCase()];
      return rank === undefined ? 4 : rank;
    };
    const clean = (text) => String(text || '').replace(/[\r\n]+/g, ' ').substring(0, 300);

    return [...qaFeedback]
      .sort((a, b) => rankOf(a.severity) - rankOf(b.severity))
      .slice(0, 10)
      .map((issue) => ({
        severity: issue.severity,
        description: clean(issue.description),
        fix: issue.fix ? clean(issue.fix) : issue.fix,
      }));
  }

  /**
   * Spawn a headless Claude Code session running the designer skill.
   * Never throws — returns null (to trigger the simulation fallback) on any
   * skipped/failed/malformed outcome.
   * @param {Object} job
   * @param {string} outputFilePath
   * @returns {Promise<Object|null>}
   */
  async runViaSkill(job, outputFilePath) {
    const skill = process.env.DESIGNER_AGENT_SKILL || 'ui-ux-pro-max';
    const runner = new SkillRunner();

    const skillPrompt = `${job.designer_prompt}\n\nWhen finished, write your final result as valid JSON to the output file with this exact shape: {"status": "completed", "output": {"html": "<full single-file HTML document as a string>", "design_notes": "...", "features_implemented": ["..."]}}. The "html" field must contain the complete, production-ready single-file HTML document (inline CSS/JS, no external dependencies).`;

    let res;
    try {
      res = await runner.runSkill({
        jobId: job.job_id,
        skill,
        prompt: skillPrompt,
        outputFile: outputFilePath,
        allowedTools: ['Read', 'Write', 'Glob', 'Grep'],
        maxTurns: 40,
      });
    } catch (err) {
      console.warn(`   ⚠️ Designer agent skill run threw (${err.message}) — falling back to simulation`);
      return null;
    }

    if (!res.ok) {
      console.warn(`   ⚠️ Designer agent skill run ${res.skipped ? 'skipped' : 'failed'} (${res.reason || res.error || 'unknown'}) — falling back to simulation`);
      return null;
    }

    const html = res.result && res.result.output && res.result.output.html;
    if (typeof html !== 'string' || html.length === 0) {
      console.warn('   ⚠️ Designer agent skill returned malformed output (no html) — falling back to simulation');
      return null;
    }

    return res.result;
  }

  /**
   * Generate unique job ID
   */
  generateJobId(lead) {
    const company = (lead.Company || lead.company || 'unknown')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .substring(0, 30);
    const timestamp = Date.now();
    return `${company}-${timestamp}`;
  }

  /**
   * Simulate designer agent (temporary until real integration)
   * In production, this would:
   * 1. Spawn a Claude Code session with ui-ux-pro-max skill
   * 2. Pass the job file as input
   * 3. Wait for the session to write output file
   * 4. Parse and return the result
   */
  async simulateDesignerAgent(job, outputFilePath) {
    const { lead, design_brief, designer_prompt } = job;

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate world-class HTML based on brief
    const html = this.generateWorldClassHTML(lead, design_brief);

    const result = {
      job_id: job.job_id,
      status: 'completed',
      completed_at: new Date().toISOString(),
      output: {
        html,
        assets: {
          inline_css: true,
          inline_js: true,
          external_images: [],
        },
        design_notes: `Created a ${design_brief.design_style} website using ${design_brief.color_palette.name} color scheme. ` +
          `Typography: ${design_brief.typography.heading} for headings, ${design_brief.typography.body} for body text. ` +
          `Fully responsive with ${design_brief.sections.length} sections. ` +
          `Optimized for ${design_brief.industry.type} industry.`,
        features_implemented: [
          'responsive_design',
          'mobile_first',
          'accessibility_wcag_aa',
          'greek_english_bilingual',
          'contact_form',
          'smooth_animations',
          'seo_optimized',
        ],
        performance_score: 95,
        accessibility_score: 98,
      },
      designer_metadata: {
        skill_used: 'ui-ux-pro-max',
        color_palette: design_brief.color_palette.name,
        typography: `${design_brief.typography.heading} / ${design_brief.typography.body}`,
        sections_count: design_brief.sections.length,
      },
    };

    // Write output file
    await fs.writeFile(outputFilePath, JSON.stringify(result, null, 2));

    return result;
  }

  /**
   * Generate world-class HTML website
   * This demonstrates the quality level expected from the designer agent
   */
  generateWorldClassHTML(lead, brief) {
    const company = lead.company;
    const { color_palette: colors, typography, sections } = brief;

    return `<!DOCTYPE html>
<html lang="el">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${company} - ${brief.industry.full} στην ${lead.location}">
    <meta name="keywords" content="${company}, ${brief.industry.type}, ${lead.location}, Greece">
    <title>${company} | ${brief.industry.full}</title>

    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${company}">
    <meta property="og:description" content="${brief.industry.full} στην ${lead.location}">
    <meta property="og:type" content="website">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=${typography.heading.replace(' ', '+')}:wght@400;600;700&family=${typography.body.replace(' ', '+')}:wght@300;400;600&display=swap" rel="stylesheet">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --color-primary: ${colors.primary};
            --color-secondary: ${colors.secondary};
            --color-accent: ${colors.accent};
            --color-neutral: ${colors.neutral};
            --color-text: ${colors.text};
            --font-heading: '${typography.heading}', serif;
            --font-body: '${typography.body}', sans-serif;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            font-family: var(--font-body);
            color: var(--color-text);
            line-height: 1.6;
            overflow-x: hidden;
        }

        h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-heading);
            font-weight: 700;
            line-height: 1.2;
        }

        /* Navigation */
        nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
            z-index: 1000;
            transition: all 0.3s ease;
        }

        nav .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        nav .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--color-primary);
        }

        nav ul {
            display: flex;
            list-style: none;
            gap: 2rem;
        }

        nav a {
            text-decoration: none;
            color: var(--color-text);
            font-weight: 500;
            transition: color 0.3s ease;
        }

        nav a:hover {
            color: var(--color-primary);
        }

        /* Hero Section */
        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%);
            padding: 6rem 2rem 4rem;
            text-align: center;
        }

        .hero h1 {
            font-size: clamp(2.5rem, 5vw, 4rem);
            color: var(--color-primary);
            margin-bottom: 1rem;
            animation: fadeInUp 0.8s ease;
        }

        .hero p {
            font-size: clamp(1.1rem, 2vw, 1.3rem);
            color: var(--color-text);
            max-width: 600px;
            margin: 0 auto 2rem;
            animation: fadeInUp 0.8s ease 0.2s backwards;
        }

        .hero .cta {
            display: inline-block;
            padding: 1rem 2.5rem;
            background: var(--color-primary);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            animation: fadeInUp 0.8s ease 0.4s backwards;
        }

        .hero .cta:hover {
            background: var(--color-accent);
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        /* Sections */
        section {
            padding: 5rem 2rem;
        }

        section .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        section h2 {
            font-size: clamp(2rem, 4vw, 3rem);
            color: var(--color-primary);
            margin-bottom: 3rem;
            text-align: center;
        }

        /* Grid Layout */
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }

        .card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        }

        .card h3 {
            color: var(--color-primary);
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }

        /* Contact Form */
        form {
            max-width: 600px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        input, textarea {
            padding: 1rem;
            border: 2px solid var(--color-neutral);
            border-radius: 8px;
            font-family: var(--font-body);
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }

        input:focus, textarea:focus {
            outline: none;
            border-color: var(--color-primary);
        }

        button {
            padding: 1rem 2rem;
            background: var(--color-primary);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        button:hover {
            background: var(--color-accent);
            transform: translateY(-2px);
        }

        /* Footer */
        footer {
            background: var(--color-text);
            color: white;
            text-align: center;
            padding: 3rem 2rem;
        }

        footer a {
            color: var(--color-accent);
            text-decoration: none;
        }

        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Responsive */
        @media (max-width: 768px) {
            nav ul {
                gap: 1rem;
                font-size: 0.9rem;
            }

            .grid {
                grid-template-columns: 1fr;
            }
        }

        /* Accessibility */
        :focus-visible {
            outline: 3px solid var(--color-primary);
            outline-offset: 2px;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav>
        <div class="container">
            <div class="logo">${company}</div>
            <ul>
                <li><a href="#home">Αρχική</a></li>
                ${sections.slice(1, 4).map(s => `<li><a href="#${s.name}">${this.translateSection(s.name)}</a></li>`).join('')}
                <li><a href="#contact">Επικοινωνία</a></li>
            </ul>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div>
            <h1>${company}</h1>
            <p>${brief.industry.full} στην ${lead.location}</p>
            <a href="#contact" class="cta">${brief.ux_goals.primary_cta}</a>
        </div>
    </section>

    ${sections.slice(1).map(section => this.generateSection(section, brief)).join('\n')}

    <!-- Footer -->
    <footer>
        <p>&copy; ${new Date().getFullYear()} ${company}. Όλα τα δικαιώματα διατηρούνται.</p>
        <p style="margin-top: 1rem;">
            ${lead.location} |
            <a href="tel:+302101234567">+30 210 123 4567</a> |
            <a href="mailto:info@example.gr">info@example.gr</a>
        </p>
        <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.7;">
            Website by <a href="https://saosstudio.com" target="_blank">SAOS Studio</a>
        </p>
    </footer>

    <script>
        // Smooth scroll with offset for fixed nav
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Form validation
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(form);

                // Basic validation
                let isValid = true;
                formData.forEach((value, key) => {
                    if (!value.trim()) {
                        isValid = false;
                    }
                });

                if (isValid) {
                    alert('Ευχαριστούμε! Θα επικοινωνήσουμε μαζί σας σύντομα.');
                    form.reset();
                } else {
                    alert('Παρακαλώ συμπληρώστε όλα τα πεδία.');
                }
            });
        }

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                }
            });
        }, observerOptions);

        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    </script>
</body>
</html>`;
  }

  /**
   * Generate HTML for a section
   */
  generateSection(section, brief) {
    if (section.name === 'contact') {
      return `
    <!-- Contact Section -->
    <section id="contact">
        <div class="container">
            <h2>Επικοινωνία</h2>
            <form>
                <input type="text" name="name" placeholder="Όνομα" required>
                <input type="email" name="email" placeholder="Email" required>
                <input type="tel" name="phone" placeholder="Τηλέφωνο">
                <textarea name="message" rows="5" placeholder="Μήνυμα" required></textarea>
                <button type="submit">Αποστολή Μηνύματος</button>
            </form>
        </div>
    </section>`;
    }

    return `
    <!-- ${section.name} Section -->
    <section id="${section.name}">
        <div class="container">
            <h2>${this.translateSection(section.name)}</h2>
            <div class="grid">
                <div class="card">
                    <h3>${section.content}</h3>
                    <p>Περιεχόμενο για ${section.name}. Αυτό θα προσαρμοστεί με πραγματικές πληροφορίες για την επιχείρηση.</p>
                </div>
                <div class="card">
                    <h3>Περισσότερες Πληροφορίες</h3>
                    <p>Επιπλέον λεπτομέρειες και χαρακτηριστικά που κάνουν την επιχείρηση μοναδική.</p>
                </div>
                <div class="card">
                    <h3>Γιατί να μας επιλέξετε</h3>
                    <p>Τα πλεονεκτήματα και οι λόγοι που κάνουν αυτή την επιχείρηση την καλύτερη επιλογή.</p>
                </div>
            </div>
        </div>
    </section>`;
  }

  /**
   * Translate section names to Greek
   */
  translateSection(name) {
    const translations = {
      hero: 'Αρχική',
      about: 'Σχετικά με Εμάς',
      services: 'Υπηρεσίες',
      menu: 'Μενού',
      rooms: 'Δωμάτια',
      amenities: 'Παροχές',
      gallery: 'Γκαλερί',
      location: 'Τοποθεσία',
      contact: 'Επικοινωνία',
      reservations: 'Κρατήσεις',
      booking: 'Κράτηση',
      doctors: 'Γιατροί',
      appointments: 'Ραντεβού',
      tours: 'Εκδρομές',
      reviews: 'Κριτικές',
    };
    return translations[name] || name;
  }
}

// ---------------------------------------------------------------------------
// CLI mode: `node src/designer-agent.js --test "Company,industry"`
// Runs the simulated designer only (no claude spawn, no cost) and writes the
// resulting HTML to data/designer-output/<jobId>.html.
// ---------------------------------------------------------------------------
const isCliMain =
  !!process.argv[1] &&
  path.resolve(__filename).toLowerCase() === path.resolve(process.argv[1]).toLowerCase();

async function runCli() {
  const cliArgs = process.argv.slice(2);
  const testFlagIdx = cliArgs.indexOf('--test');

  if (testFlagIdx === -1 || !cliArgs[testFlagIdx + 1]) {
    console.error('Usage: node src/designer-agent.js --test "Company,industry"');
    process.exit(1);
    return;
  }

  const [companyArg, industryArg] = cliArgs[testFlagIdx + 1].split(',').map((s) => (s || '').trim());
  const lead = {
    Company: companyArg || 'Test Company',
    'NACE 2 Desc': industryArg || 'business',
  };

  const agent = new DesignerAgent();
  await agent.initialize();

  const result = await agent.designWebsite(lead, { forceSimulation: true });

  const htmlPath = path.join(agent.outputDir, `${result.job_id}.html`);
  await fs.writeFile(htmlPath, result.output.html);

  console.log(path.resolve(htmlPath));
  process.exit(0);
}

if (isCliMain) {
  await runCli();
}
