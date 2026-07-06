// SAOS Studio Email Templates

function renderEmailTemplate(templateType, data) {
    if (templateType === 'cold-outreach') {
        return renderColdOutreachTemplate(data);
    } else if (templateType === 'follow-up') {
        return renderFollowUpTemplate(data);
    }
    return '';
}

function renderColdOutreachTemplate(data) {
    return `
<!DOCTYPE html>
<html lang="el">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SAOS Studio - Demo Website</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif; background-color: #f8fafc;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">

                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 32px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                                SAOS Studio
                            </h1>
                            <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                                Beautiful Websites for Greek Businesses
                            </p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 32px;">
                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #0f172a;">
                                Καλησπέρα σας,
                            </p>

                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #0f172a;">
                                Με λένε <strong>${data.senderName}</strong> και είμαι από το <strong>SAOS Studio</strong>.
                                Βρήκα το <strong>${data.clientName}</strong> και εντυπωσιάστηκα με την ποιότητα και τις κριτικές σας.
                            </p>

                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #0f172a;">
                                Μια τέτοια επιχείρηση αξίζει μια ιστοσελίδα που να αντικατοπτρίζει την ποιότητά της.
                                Αντί να σας στείλω ένα ακόμα διαφημιστικό email, <strong>σας έφτιαξα ήδη ένα δωρεάν preview</strong>
                                μιας νέας σελίδας — με τη δική σας επιχείρηση, animations και σύγχρονο, επαγγελματικό σχεδιασμό.
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; margin: 32px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="${data.demoUrl}"
                                           style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);">
                                            🌐 Δείτε το Demo Website
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #0f172a;">
                                Στο <strong>SAOS Studio</strong> φτιάχνουμε εντυπωσιακές, γρήγορες ιστοσελίδες για ελληνικές επιχειρήσεις —
                                <strong>κάτω από 500€</strong>, χωρίς κρυφές χρεώσεις και χωρίς μηνιαίες συνδρομές.
                                Αν σας αρέσει αυτό που είδατε, την κάνουμε δική σας μέσα σε λίγες μέρες.
                            </p>

                            ${data.additionalNotes ? `
                                <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 16px 20px; margin: 24px 0; border-radius: 4px;">
                                    <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #475569;">
                                        ${data.additionalNotes.replace(/\n/g, '<br>')}
                                    </p>
                                </div>
                            ` : ''}

                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #0f172a;">
                                Σκεφτείτε πόσοι πελάτες ψάχνουν στο Google πριν επισκεφτούν μια επιχείρηση —
                                μια επαγγελματική σελίδα σημαίνει περισσότερες κρατήσεις και περισσότερη εμπιστοσύνη.
                            </p>

                            <p style="margin: 0 0 8px 0; font-size: 16px; line-height: 1.6; color: #0f172a;">
                                Θα χαρώ πολύ να ακούσω τη γνώμη σας!
                            </p>

                            <p style="margin: 24px 0 0 0; font-size: 16px; line-height: 1.6; color: #0f172a;">
                                Με εκτίμηση,<br>
                                <strong>${data.senderName}</strong>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: #f8fafc; padding: 32px; border-top: 1px solid #e2e8f0;">
                            <table role="presentation" style="width: 100%;">
                                <tr>
                                    <td style="text-align: center;">
                                        <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #2563eb;">
                                            SAOS Studio
                                        </h2>

                                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">
                                            📧 <a href="mailto:${data.senderEmail}" style="color: #2563eb; text-decoration: none;">${data.senderEmail}</a>
                                        </p>

                                        <p style="margin: 0 0 16px 0; font-size: 14px; color: #64748b;">
                                            📱 <a href="tel:${data.senderPhone}" style="color: #2563eb; text-decoration: none;">${data.senderPhone}</a>
                                        </p>

                                        <div style="margin: 20px 0 0 0; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                                            <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                                                Beautiful websites for Greek businesses under €500<br>
                                                No subscriptions • Fast delivery • Professional design
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>

                <!-- Spacer -->
                <table role="presentation" style="max-width: 600px; margin: 20px auto 0 auto;">
                    <tr>
                        <td style="text-align: center; padding: 0 20px;">
                            <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
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

function renderFollowUpTemplate(data) {
    return `
<!DOCTYPE html>
<html lang="el">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SAOS Studio - Follow Up</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif; background-color: #f8fafc;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">

                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 32px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                                SAOS Studio
                            </h1>
                            <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                                Beautiful Websites for Greek Businesses
                            </p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 32px;">
                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #0f172a;">
                                Καλησπέρα και πάλι,
                            </p>

                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #0f172a;">
                                Είχα στείλει πριν μερικές μέρες ένα demo website για το <strong>${data.clientName}</strong>
                                και ήθελα να ρωτήσω αν είχατε την ευκαιρία να το δείτε.
                            </p>

                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #0f172a;">
                                Αν το χάσατε, μπορείτε να το δείτε εδώ:
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; margin: 32px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="${data.demoUrl}"
                                           style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);">
                                            🌐 Δείτε το Demo Website
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #0f172a;">
                                Είμαι στη διάθεσή σας για οποιαδήποτε ερώτηση ή αλλαγή θέλετε να κάνουμε.
                                Μπορώ να προσαρμόσω τελείως το design, τα χρώματα, το περιεχόμενο — ό,τι χρειάζεστε.
                            </p>

                            ${data.additionalNotes ? `
                                <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 16px 20px; margin: 24px 0; border-radius: 4px;">
                                    <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #475569;">
                                        ${data.additionalNotes.replace(/\n/g, '<br>')}
                                    </p>
                                </div>
                            ` : ''}

                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #0f172a;">
                                Θα χαρώ να ακούσω τη γνώμη σας!
                            </p>

                            <p style="margin: 24px 0 0 0; font-size: 16px; line-height: 1.6; color: #0f172a;">
                                Με εκτίμηση,<br>
                                <strong>${data.senderName}</strong>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: #f8fafc; padding: 32px; border-top: 1px solid #e2e8f0;">
                            <table role="presentation" style="width: 100%;">
                                <tr>
                                    <td style="text-align: center;">
                                        <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #2563eb;">
                                            SAOS Studio
                                        </h2>

                                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">
                                            📧 <a href="mailto:${data.senderEmail}" style="color: #2563eb; text-decoration: none;">${data.senderEmail}</a>
                                        </p>

                                        <p style="margin: 0 0 16px 0; font-size: 14px; color: #64748b;">
                                            📱 <a href="tel:${data.senderPhone}" style="color: #2563eb; text-decoration: none;">${data.senderPhone}</a>
                                        </p>

                                        <div style="margin: 20px 0 0 0; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                                            <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                                                Beautiful websites for Greek businesses under €500<br>
                                                No subscriptions • Fast delivery • Professional design
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}
