import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { updateLead, logActivity } from './db.js';

const PREVIEW_TEMPLATE = (business, htmlContent) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${business.name} — Preview by SAOS Studio</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,-apple-system,sans-serif;background:#0a0a0a;color:#e8e6e1;line-height:1.6}
.preview-banner{position:fixed;top:0;left:0;right:0;z-index:9999;background:rgba(201,169,110,0.95);color:#0a0a0a;padding:12px 24px;display:flex;justify-content:space-between;align-items:center;font-size:0.85rem}
.preview-banner a{color:#0a0a0a;font-weight:600}
.preview-banner button{background:#0a0a0a;color:#c9a96e;border:none;padding:8px 18px;cursor:pointer;font-size:0.8rem;letter-spacing:0.05em}
main{padding-top:56px}
</style>
</head>
<body>
<div class="preview-banner">
  <span>👋 This is a free preview for <strong>${business.name}</strong> by SAOS Studio</span>
  <div style="display:flex;gap:12px;align-items:center;">
    <a href="mailto:hello@saos.studio?subject=I love the ${encodeURIComponent(business.name)} preview">Get this site → hello@saos.studio</a>
    <button onclick="window.print()">Save PDF</button>
  </div>
</div>
<main>
${htmlContent}
</main>
</body>
</html>`;

export async function generateDraft(lead, config) {
  console.log(`🤖 Generating draft for ${lead.name}...`);
  
  const prompt = buildPrompt(lead);
  const htmlContent = await callAI(prompt, config);
  if (!htmlContent) return null;
  
  const outDir = config.drafts?.outputDir || './previews';
  if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });
  
  const fileName = `preview-${lead.id}.html`;
  const filePath = join(outDir, fileName);
  const fullHtml = PREVIEW_TEMPLATE(lead, htmlContent);
  await writeFile(filePath, fullHtml);
  
  const previewUrl = config.drafts?.previewBaseURL
    ? `${config.drafts.previewBaseURL}/${fileName}`
    : `file://${filePath}`;
  
  await updateLead(lead.id, {
    draftPath: filePath,
    previewUrl,
    draftGeneratedAt: new Date().toISOString(),
    status: 'draft_ready'
  });
  await logActivity(`Draft generated for ${lead.name}: ${previewUrl}`);
  console.log(`✅ Draft saved: ${filePath}`);
  console.log(`🔗 Preview URL: ${previewUrl}`);
  return { filePath, previewUrl };
}

function buildPrompt(lead) {
  const industry = lead.category || 'local business';
  return `You are an elite web designer. Create a single, complete, beautiful HTML homepage for a ${industry} called "${lead.name}".

BUSINESS INFO:
- Name: ${lead.name}
- Type: ${industry}
- Location: ${lead.city || lead.address || 'Local area'}
- Rating: ${lead.rating || 'N/A'} on Google Maps

DESIGN REQUIREMENTS:
- Dark, minimalist, luxurious aesthetic (#0a0a0a background, #e8e6e1 text, #c9a96e gold accent)
- Editorial typography (large serif headings, clean sans-serif body)
- Responsive, mobile-first CSS embedded in a <style> tag
- Sections: Hero (big name + tagline), About/Story, Services, Contact/Location placeholder, Footer
- Use CSS Grid and Flexbox. No external dependencies. No images (use CSS gradients and shapes)
- Add subtle hover animations and transitions
- Include a call-to-action: "Call Now" and "Visit Us" buttons
- The HTML should be the content INSIDE <main> only (no <html>, <head>, or <body> tags)
- Make it feel like a €5,000 agency designed it

Output ONLY the raw HTML content (the inner main content). Do not wrap in markdown code blocks.`;
}

async function callAI(prompt, config) {
  const apiKey = config.openai?.apiKey;
  const model = config.openai?.model || 'gpt-4o-mini';
  const baseURL = config.openai?.baseURL || 'https://api.openai.com/v1';
  
  if (!apiKey || apiKey.includes('your-openai')) {
    console.log('⚠️  OpenAI key not configured. Set it in config.json');
    return fallbackHTML();
  }
  
  try {
    const res = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are a senior frontend developer and web designer specializing in luxury, minimalist dark-themed websites.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 3500
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'AI request failed');
    let content = data.choices[0].message.content;
    // Strip markdown code fences if present
    content = content.replace(/```html\n?/g, '').replace(/```\n?/g, '');
    return content.trim();
  } catch (e) {
    console.error('AI error:', e.message);
    return fallbackHTML();
  }
}

function fallbackHTML() {
  return `<section style="min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:80px 24px;background:linear-gradient(135deg,#0a0a0a,#151210);">
    <div>
      <h1 style="font-family:Georgia,serif;font-size:clamp(2.5rem,6vw,4.5rem);font-weight:300;color:#e8e6e1;margin-bottom:24px;">Your New Website</h1>
      <p style="color:#6e6e6e;max-width:480px;margin:0 auto 40px;font-size:1.1rem;">This is a preview placeholder. Configure your OpenAI API key to generate real drafts.</p>
      <a href="mailto:hello@saos.studio" style="display:inline-block;padding:14px 32px;border:1px solid #c9a96e;color:#c9a96e;text-decoration:none;font-size:0.8rem;letter-spacing:0.1em;text-transform:uppercase;">Contact SAOS Studio</a>
    </div>
  </section>`;
}
