import { Resend } from 'resend';
import { incrementEmailCount, updateLead, logActivity } from './db.js';

const TEMPLATES = {
  preview: (lead, config) => ({
    subject: `${lead.name} — I made you a website preview`,
    html: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;color:#e8e6e1;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;">
  <tr><td align="center" style="padding:48px 24px;">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="padding-bottom:32px;">
        <img src="https://saos.studio/logos/white-logo.png" alt="SAOS Studio" style="height:40px;opacity:0.9;">
      </td></tr>
      <tr><td style="font-family:Georgia,serif;font-size:28px;color:#e8e6e1;padding-bottom:20px;line-height:1.3;">
        Hi there,
      </td></tr>
      <tr><td style="font-size:16px;color:#8a8a8a;line-height:1.7;padding-bottom:24px;">
        I came across <strong style="color:#e8e6e1;">${lead.name}</strong> on Google Maps and noticed ${lead.website ? 'your website could use a refresh' : "you don't have a website yet"}.
      </td></tr>
      <tr><td style="font-size:16px;color:#8a8a8a;line-height:1.7;padding-bottom:32px;">
        I run <strong style="color:#c9a96e;">SAOS Studio</strong> — we design beautiful, professional websites for local businesses, delivered in under a week for under €500.
      </td></tr>
      <tr><td style="font-size:16px;color:#8a8a8a;line-height:1.7;padding-bottom:32px;">
        I liked the look of ${lead.name} so much that I put together a quick homepage draft just for you:
      </td></tr>
      <tr><td style="padding-bottom:32px;">
        <a href="${lead.previewUrl}" style="display:inline-block;padding:16px 36px;background:#c9a96e;color:#0a0a0a;text-decoration:none;font-size:14px;letter-spacing:0.1em;text-transform:uppercase;font-weight:500;">👉 Preview Your Free Draft</a>
      </td></tr>
      <tr><td style="font-size:14px;color:#555;line-height:1.6;padding-bottom:32px;">
        No strings attached. If you like the direction, I'd love to build out the full site. If not, no worries at all — consider it a compliment from one local business to another.
      </td></tr>
      <tr><td style="border-top:1px solid #1a1a1a;padding-top:24px;font-size:13px;color:#555;line-height:1.6;">
        ${config.business.signature.replace(/\n/g, '<br>')}
        <br><br>
        <a href="${config.business.website}" style="color:#555;">${config.business.website}</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
  }),
  
  nowebsite: (lead, config) => ({
    subject: `${lead.name} — missing out on customers?`,
    html: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;color:#e8e6e1;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;">
  <tr><td align="center" style="padding:48px 24px;">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="padding-bottom:32px;">
        <img src="https://saos.studio/logos/white-logo.png" alt="SAOS Studio" style="height:40px;opacity:0.9;">
      </td></tr>
      <tr><td style="font-family:Georgia,serif;font-size:28px;color:#e8e6e1;padding-bottom:20px;line-height:1.3;">
        Hi there,
      </td></tr>
      <tr><td style="font-size:16px;color:#8a8a8a;line-height:1.7;padding-bottom:24px;">
        I searched for <strong style="color:#e8e6e1;">${lead.name}</strong> today and couldn't find a website — just your Google Maps listing.
      </td></tr>
      <tr><td style="font-size:16px;color:#8a8a8a;line-height:1.7;padding-bottom:32px;">
        Most people check a website before visiting or calling. A simple, beautiful site builds trust before they even walk through your door.
      </td></tr>
      <tr><td style="padding-bottom:32px;">
        <a href="${lead.previewUrl}" style="display:inline-block;padding:16px 36px;background:#c9a96e;color:#0a0a0a;text-decoration:none;font-size:14px;letter-spacing:0.1em;text-transform:uppercase;font-weight:500;">👉 See Your Draft</a>
      </td></tr>
      <tr><td style="font-size:16px;color:#8a8a8a;line-height:1.7;padding-bottom:32px;">
        We build these in 3–5 days for a flat <strong style="color:#c9a96e;">€499</strong>. Happy to chat whenever you're free.
      </td></tr>
      <tr><td style="border-top:1px solid #1a1a1a;padding-top:24px;font-size:13px;color:#555;line-height:1.6;">
        ${config.business.signature.replace(/\n/g, '<br>')}
        <br><br>
        <a href="${config.business.website}" style="color:#555;">${config.business.website}</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
  }),

  followup: (lead, config) => ({
    subject: `Re: ${lead.name} — quick question`,
    html: `<p>Hi there,</p><p>Just bumping this to the top of your inbox. The draft I built for ${lead.name} is here if you want to take a look:</p><p><a href="${lead.previewUrl}">Preview your draft</a></p><p>Even if you're not ready now, I'd love your honest feedback.</p><p>${config.business.signature.replace(/\n/g, '<br>')}</p>`
  })
};

export async function sendEmail(leadId, templateName, config) {
  const apiKey = config.resend?.apiKey;
  if (!apiKey || apiKey.includes('your-resend')) {
    console.log('⚠️  Resend API key not configured. Set it in config.json');
    return { success: false, error: 'No API key' };
  }
  
  const { getLead } = await import('./db.js');
  const lead = await getLead(leadId);
  if (!lead) { console.log('❌ Lead not found'); return { success: false }; }
  if (!lead.previewUrl) { console.log('❌ No draft generated yet. Run: draft --lead=' + leadId); return { success: false }; }
  
  const tmpl = TEMPLATES[templateName] || TEMPLATES.preview;
  const { subject, html } = tmpl(lead, config);
  
  // Rate limit check
  const todayCount = await incrementEmailCount();
  if (todayCount > (config.email?.dailyLimit || 50)) {
    console.log(`⚠️  Daily email limit reached (${config.email.dailyLimit})`);
    return { success: false, error: 'Daily limit' };
  }
  
  console.log(`📧 Sending "${templateName}" to ${lead.name} (${todayCount}/${config.email?.dailyLimit || 50} today)`);
  
  try {
    const resend = new Resend(apiKey);
    // If no email, we can't send — but we'll still output the template for copy-paste
    if (!lead.email) {
      console.log('⚠️  No email on file. Copy this template and send manually:');
      console.log('--- SUBJECT ---');
      console.log(subject);
      console.log('--- HTML ---');
      console.log(html.slice(0, 800) + '...');
      await updateLead(leadId, { lastEmailTemplate: templateName, emailedAt: new Date().toISOString(), status: 'manual_send' });
      return { success: true, manual: true };
    }
    
    const result = await resend.emails.send({
      from: `${config.resend.fromName} <${config.resend.from}>`,
      to: lead.email,
      subject,
      html
    });
    
    await updateLead(leadId, {
      lastEmailTemplate: templateName,
      emailedAt: new Date().toISOString(),
      status: 'emailed',
      emailId: result.id
    });
    await logActivity(`Email sent to ${lead.name}: ${templateName}`);
    console.log(`✅ Email sent! ID: ${result.id}`);
    
    // Delay
    const delay = config.email?.delayBetweenMs || 5000;
    await new Promise(r => setTimeout(r, delay));
    
    return { success: true, id: result.id };
  } catch (e) {
    console.error('❌ Email failed:', e.message);
    return { success: false, error: e.message };
  }
}

export function listTemplates() {
  return Object.keys(TEMPLATES);
}
