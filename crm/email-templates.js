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

function renderFollowUpTemplate(data) {
    return `
<!DOCTYPE html>
<html lang="el">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SAOS Studio - Follow Up</title>
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
                                Καλησπέρα και πάλι,
                            </p>

                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #0a0a0a;">
                                Είχα στείλει πριν μερικές μέρες ένα demo website για το <strong style="font-weight: 700;">${data.clientName}</strong>
                                και ήθελα να ρωτήσω αν είχατε την ευκαιρία να το δείτε.
                            </p>

                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #0a0a0a;">
                                Αν το χάσατε, μπορείτε να το δείτε εδώ:
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
                                Είμαι στη διάθεσή σας για οποιαδήποτε ερώτηση ή αλλαγή θέλετε να κάνουμε.
                                Μπορώ να προσαρμόσω τελείως το design, τα χρώματα, το περιεχόμενο — ό,τι χρειάζεστε.
                            </p>

                            ${data.additionalNotes ? `
                                <div style="background: #fafafa; border-left: 3px solid #0a0a0a; padding: 18px 22px; margin: 28px 0; border-radius: 6px;">
                                    <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #404040;">
                                        ${data.additionalNotes.replace(/\n/g, '<br>')}
                                    </p>
                                </div>
                            ` : ''}

                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #0a0a0a;">
                                Θα χαρώ να ακούσω τη γνώμη σας!
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
            </td>
        </tr>
    </table>
</body>
</html>`;
}
