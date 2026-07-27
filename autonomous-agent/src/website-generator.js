import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

export class WebsiteGenerator {
  constructor() {
    this.openrouterApiKey = process.env.OPENROUTER_API_KEY;
    this.openrouterModel = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat';
    this.netlifyToken = process.env.NETLIFY_ACCESS_TOKEN;
    // Absolute path of the last HTML file saved to disk by deployToNetlify()
    this.lastSavedHtmlPath = null;
  }

  async generate(lead, options = {}) {
    console.log(`  🎨 Generating website design for ${lead.Company}...`);

    const industry = this.detectIndustry(lead['NACE 2 Desc']);
    const prompt = this.buildPrompt(lead, industry, options.qaFeedback);

    try {
      // Call OpenRouter API with DeepSeek model to generate website
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openrouterApiKey}`,
          'HTTP-Referer': 'https://saosstudio.com',
          'X-Title': 'SAOS Autonomous Agent'
        },
        body: JSON.stringify({
          model: this.openrouterModel,
          messages: [{
            role: 'user',
            content: prompt
          }],
          max_tokens: 8000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const generatedHtml = this.extractHtml(data.choices[0].message.content);

      return {
        html: generatedHtml,
        company: lead.Company,
        industry: industry,
        description: lead['Περιγραφή 1'] || '',
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('  ❌ Website generation failed:', error.message);
      throw error;
    }
  }

  buildPrompt(lead, industry, qaFeedback) {
    const qaFeedbackSection = (Array.isArray(qaFeedback) && qaFeedback.length > 0)
      ? `\n\nΔΙΟΡΘΩΣΕΙΣ QA — Η προηγούμενη έκδοση απέτυχε στον ποιοτικό έλεγχο. Διόρθωσε ΟΠΩΣΔΗΠΟΤΕ τα εξής:\n` +
        this.sanitizeQaFeedback(qaFeedback)
          .map((issue, i) => `${i + 1}. [${issue.severity}] ${issue.description}${issue.fix ? ` — ${issue.fix}` : ''}`).join('\n')
      : '';

    return `You are a professional web designer. Create a beautiful, modern single-page website for this Greek business:

Company: ${lead.Company}
Industry: ${industry}
Description: ${lead['Περιγραφή 1'] || 'N/A'}
Location: ${lead['Περιοχή'] || 'Greece'}
Phone: ${lead['Τηλέφωνο'] || ''}
Email: ${lead.Email || ''}
Existing Website: ${lead['Ιστοσελίδα Εταιρίας'] || 'None'}

Create a complete, production-ready HTML page with:
- Modern, clean design with animations
- Responsive layout (mobile-friendly)
- Professional color scheme matching the industry
- Hero section with compelling headline
- Services/Products section
- About section
- Contact section with CTA
- Smooth scrolling and subtle animations
- All text in Greek
- Inline CSS and JavaScript (single file)
- No external dependencies

Use modern design trends: glassmorphism, subtle gradients, smooth animations, and professional typography.
${qaFeedbackSection}
Return ONLY the complete HTML code, nothing else.`;
  }

  // Bounds QA feedback before it is injected into the LLM prompt: sorts by
  // severity (critical > high > medium > low), caps to the 10 most severe
  // issues, and truncates/normalizes free-text fields to avoid unbounded
  // prompt growth from an adversarial or malformed QA report.
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
        fix: issue.fix ? clean(issue.fix) : issue.fix
      }));
  }

  detectIndustry(naceDesc) {
    const industries = {
      'εστιατόρι|ταβέρνα|φαγητ': 'Restaurant',
      'ξενοδοχ|τουρισ': 'Hotel',
      'ενδυμ|ρουχ': 'Clothing',
      'ιατρ|υγεί|νοσοκομ|κλινικ': 'Healthcare',
      'δομικ|κατασκευ|τεχνικ': 'Construction',
      'εμπόρ|λιανικ': 'Retail',
      'διαγνωστικ|εργαστηρ': 'Laboratory'
    };

    const desc = (naceDesc || '').toLowerCase();
    for (const [pattern, industry] of Object.entries(industries)) {
      const regex = new RegExp(pattern);
      if (regex.test(desc)) {
        return industry;
      }
    }

    return 'Business';
  }

  extractHtml(text) {
    // Extract HTML from Claude's response
    const htmlMatch = text.match(/```html\n([\s\S]*?)\n```/) ||
                     text.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);

    if (htmlMatch) {
      return htmlMatch[1] || htmlMatch[0];
    }

    return text;
  }

  async deployToNetlify(websiteData, lead) {
    console.log('  💾 Saving website locally...');
    this.lastSavedHtmlPath = null;

    try {
      const siteName = this.generateSiteName(lead.Company);

      // Use absolute path to CRM folder
      const homeDir = process.env.HOME || process.env.USERPROFILE;
      const crmDir = path.join(homeDir, 'Desktop', 'SAOS Studio', 'crm', 'agent-drafts');
      const outputDir = path.join(crmDir, siteName);

      await fs.mkdir(outputDir, { recursive: true });
      const htmlPath = path.join(outputDir, 'index.html');
      await fs.writeFile(htmlPath, websiteData.html);
      this.lastSavedHtmlPath = htmlPath;

      // Return local path that CRM can open
      const localUrl = `agent-drafts/${siteName}/index.html`;
      console.log(`  ✅ Saved to: ${outputDir}`);
      console.log(`  📄 CRM URL: ${localUrl}`);

      return localUrl;

    } catch (error) {
      console.error('  ❌ Failed to save website:', error.message);
      console.error('  Error details:', error);
      // Return fallback
      return `agent-drafts/${this.generateSiteName(lead.Company)}/index.html`;
    }
  }

  async createAndUploadZip(dir, siteId) {
    // For simplicity, we'll use Netlify's file upload API
    const indexPath = path.join(dir, 'index.html');
    const content = await fs.readFile(indexPath, 'utf-8');

    const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.netlifyToken}`
      },
      body: JSON.stringify({
        files: {
          '/index.html': content
        }
      })
    });

    return response.json();
  }

  generateSiteName(companyName) {
    return companyName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
  }
}
