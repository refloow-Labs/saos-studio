import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

export class EmailService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      'urn:ietf:wg:oauth:2.0:oob'
    );

    this.oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  async sendEmail(emailData) {
    const { to, subject, clientName, demoUrl, additionalNotes, senderName, senderEmail, senderPhone } = emailData;

    const emailHtml = this.generateEmailHtml({
      clientName,
      demoUrl,
      additionalNotes,
      senderName,
      senderEmail,
      senderPhone
    });

    const message = [
      `To: ${to}`,
      `From: ${senderName} <${senderEmail}>`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      '',
      emailHtml
    ].join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    try {
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage
        }
      });

      console.log(`  ✅ Email sent successfully (ID: ${response.data.id})`);
      return response.data;

    } catch (error) {
      console.error('  ❌ Failed to send email:', error.message);
      throw error;
    }
  }

  generateEmailHtml(data) {
    return `
<!DOCTYPE html>
<html lang="el">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SAOS Studio - Demo Website</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif; background-color: #fafafa;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);">

                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); padding: 48px 32px; text-align: center;">
                            <img src="https://saos.studio/logos/logo-white.png" alt="SAOS Studio" style="max-width: 180px; height: auto; margin-bottom: 16px;" />
                            <p style="margin: 0; color: rgba(255, 255, 255, 0.6); font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">
                                Σχεδιασμός Ιστοσελίδων
                            </p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 44px 36px;">
                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #0a0a0a;">
                                Καλησπέρα σας,
                            </p>

                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #0a0a0a;">
                                Με λένε <strong style="font-weight: 700;">${data.senderName}</strong> και είμαι από το <strong style="font-weight: 700;">SAOS Studio</strong>.
                                Βρήκα το <strong style="font-weight: 700;">${data.clientName}</strong> και εντυπωσιάστηκα με την ποιότητα και τις κριτικές σας.
                            </p>

                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #0a0a0a;">
                                Μια τέτοια επιχείρηση αξίζει μια ιστοσελίδα που να αντικατοπτρίζει την ποιότητά της.
                                Αντί να σας στείλω ένα ακόμα διαφημιστικό email, <strong style="font-weight: 700;">σας έφτιαξα ήδη ένα δωρεάν preview</strong>
                                μιας νέας σελίδας — με τη δική σας επιχείρηση, animations και σύγχρονο, επαγγελματικό σχεδιασμό.
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; margin: 36px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="${data.demoUrl}"
                                           style="display: inline-block; padding: 18px 48px; background: #0a0a0a; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: 700; font-size: 15px; letter-spacing: -0.3px; box-shadow: 0 2px 12px rgba(10, 10, 10, 0.15);">
                                            Δείτε το Demo Website →
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #0a0a0a;">
                                Στο <strong style="font-weight: 700;">SAOS Studio</strong> φτιάχνουμε όμορφες, γρήγορες ιστοσελίδες για φιλόδοξες ελληνικές επιχειρήσεις.
                                Ξεκινάμε από <strong style="font-weight: 700;">€46/μήνα</strong> με μηνιαία συνδρομή που ακυρώνεται ανά πάσα στιγμή.
                                Παραδίδεται σε μέρες, όχι μήνες.
                            </p>

                            ${data.additionalNotes ? `
                                <div style="background: #fafafa; border-left: 3px solid #0a0a0a; padding: 18px 22px; margin: 28px 0; border-radius: 6px;">
                                    <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #404040;">
                                        ${data.additionalNotes.replace(/\n/g, '<br>')}
                                    </p>
                                </div>
                            ` : ''}

                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #0a0a0a;">
                                Σκεφτείτε πόσοι πελάτες ψάχνουν στο Google πριν επισκεφτούν μια επιχείρηση —
                                μια επαγγελματική σελίδα σημαίνει περισσότερες κρατήσεις και περισσότερη εμπιστοσύνη.
                            </p>

                            <p style="margin: 0 0 8px 0; font-size: 16px; line-height: 1.6; color: #0a0a0a;">
                                Θα χαρώ πολύ να ακούσω τη γνώμη σας!
                            </p>

                            <p style="margin: 28px 0 0 0; font-size: 16px; line-height: 1.6; color: #0a0a0a;">
                                Με εκτίμηση,<br>
                                <strong style="font-weight: 700;">${data.senderName}</strong>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: #fafafa; padding: 36px; border-top: 1px solid #e5e5e5;">
                            <table role="presentation" style="width: 100%;">
                                <tr>
                                    <td style="text-align: center;">
                                        <h2 style="margin: 0 0 18px 0; font-size: 22px; font-weight: 800; color: #0a0a0a; letter-spacing: -0.5px;">
                                            SAOS Studio
                                        </h2>

                                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #737373;">
                                            📧 <a href="mailto:${data.senderEmail}" style="color: #0a0a0a; text-decoration: none; font-weight: 500;">${data.senderEmail}</a>
                                        </p>

                                        <p style="margin: 0 0 20px 0; font-size: 14px; color: #737373;">
                                            📱 <a href="tel:${data.senderPhone}" style="color: #0a0a0a; text-decoration: none; font-weight: 500;">${data.senderPhone}</a>
                                        </p>

                                        <div style="margin: 24px 0 0 0; padding-top: 24px; border-top: 1px solid #e5e5e5;">
                                            <p style="margin: 0; font-size: 12px; color: #a3a3a3; line-height: 1.6;">
                                                Όμορφος σχεδιασμός ιστοσελίδων για ελληνικές επιχειρήσεις<br>
                                                Από €46/μήνα • Γρήγορη παράδοση • Επαγγελματικό αποτέλεσμα
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>

                <!-- Spacer -->
                <table role="presentation" style="max-width: 600px; margin: 24px auto 0 auto;">
                    <tr>
                        <td style="text-align: center; padding: 0 20px;">
                            <p style="margin: 0; font-size: 11px; color: #a3a3a3; line-height: 1.5;">
                                Λάβατε αυτό το email επειδή η επιχείρησή σας δεν έχει ιστοσελίδα.<br>
                                Αν δεν ενδιαφέρεστε, μπορείτε να αγνοήσετε αυτό το μήνυμα.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
  }

  async checkReplies() {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread in:inbox',
        maxResults: 50
      });

      const messages = response.data.messages || [];
      const replies = [];

      for (const message of messages) {
        const details = await this.gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'full'
        });

        const headers = details.data.payload.headers;
        const from = headers.find(h => h.name === 'From')?.value;
        const subject = headers.find(h => h.name === 'Subject')?.value;
        const date = headers.find(h => h.name === 'Date')?.value;

        // Check if this is a reply to our demo emails
        if (subject && (subject.includes('Re:') || subject.includes('Σας έφτιαξα'))) {
          replies.push({
            messageId: message.id,
            from,
            subject,
            date,
            threadId: details.data.threadId
          });

          // Mark as read
          await this.gmail.users.messages.modify({
            userId: 'me',
            id: message.id,
            requestBody: {
              removeLabelIds: ['UNREAD']
            }
          });
        }
      }

      return replies;

    } catch (error) {
      console.error('  ❌ Failed to check replies:', error.message);
      return [];
    }
  }
}
