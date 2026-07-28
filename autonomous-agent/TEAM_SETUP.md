# Οδηγός εγκατάστασης για νέο μέλος της ομάδας

Αυτός ο οδηγός είναι για να στήσεις τον **autonomous agent** σε ένα καινούργιο μηχάνημα
(macOS ή Windows). Ο agent τρέχει **τοπικά** σε κάθε PC· το CRM τρέχει σε Docker και τα
παραγόμενα sites συγχρονίζονται μέσω ενός κοινόχρηστου GitHub repo, ώστε να μην ξαναστέλνει
κανείς email στον ίδιο παραλήπτη ή να ξαναδημιουργεί το ίδιο site.

## 1. Προαπαιτούμενα

- **Node.js 20+** — [nodejs.org](https://nodejs.org/) (ελάχιστο 18, αλλά συνιστάται 20+)
- **Docker Desktop** — [macOS](https://docs.docker.com/desktop/install/mac-install/) ·
  [Windows](https://docs.docker.com/desktop/install/windows-install/) — για το CRM
- **git**

Επιβεβαίωσε ότι είναι εγκατεστημένα:

```bash
node --version
docker --version
git --version
```

## 2. Clone το repo

```bash
git clone <URL-του-repo> saos-studio
cd saos-studio/autonomous-agent
```

## 3. Εγκατάσταση εξαρτήσεων

```bash
npm install
```

> Αν αργότερα δεις σφάλμα σχετικό με `sqlite3` (π.χ. μετά από `git pull` ή αντιγραφή
> `node_modules` από άλλο μηχάνημα), δες τον πίνακα troubleshooting παρακάτω.

## 4. Ρύθμιση `.env`

Αντέγραψε το template:

```bash
cp .env.example .env        # macOS / Linux / Git Bash
copy .env.example .env      # Windows CMD / PowerShell
```

Άνοιξε το `.env` και συμπλήρωσε:

| Μεταβλητή | Τι βάζεις |
|---|---|
| `OPENROUTER_API_KEY` | Το OpenRouter API key σου (χρησιμοποιείται για τη δημιουργία sites) |
| `GMAIL_CLIENT_ID` / `GMAIL_CLIENT_SECRET` | Από ένα OAuth client στο Google Cloud Console (Desktop app) |
| `GMAIL_REFRESH_TOKEN` | **Μην το γράφεις χειροκίνητα** — παράγεται στο βήμα 6 (`npm run setup`) |
| `SENDER_NAME` / `SENDER_EMAIL` / `SENDER_PHONE` | Τα στοιχεία σου, όπως θα εμφανίζονται στα emails |
| `GITHUB_TOKEN` | Το personal access token σου — δες βήμα 5 |
| `SITES_REPO` | `owner/name` του κοινόχρηστου repo με τα sites (π.χ. `saos-labs/team-sites`) |
| `SITES_BRANCH` | Συνήθως `main` (default) |

Τα υπόλοιπα κλειδιά (`QA_ENABLED`, `DESIGNER_AGENT_ENABLED`, όρια κ.λπ.) έχουν λογικά
defaults — άλλαξέ τα μόνο αν ξέρεις τι κάνεις.

## 5. Δημιουργία GitHub Personal Access Token (PAT)

Το PAT χρησιμοποιείται ΜΟΝΟ για να διαβάζει/γράφει στο κοινόχρηστο repo με τα sites, ώστε
η ομάδα να ξέρει ποια sites έχουν ήδη δημιουργηθεί και σε ποιους έχει ήδη σταλεί email.

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. **Generate new token**
3. **Repository access:** επίλεξε μόνο το repo των sites (`SITES_REPO`)
4. **Permissions → Repository permissions → Contents:** `Read and write`
5. Δημιούργησε το token και επικόλλησέ το στο `.env`, στο `GITHUB_TOKEN`

> Αν προτιμάς classic token, χρειάζεται scope `repo`. Χωρίς δικαίωμα εγγραφής (`push`)
> στο repo, ο συντονισμός ομάδας δεν θα δουλεύει — το `npm run doctor` (βήμα 7) θα το
> εντοπίσει.

**Ποτέ μην κάνεις commit το `.env`** — είναι ήδη στο `.gitignore`.

## 6. Ρύθμιση Gmail (OAuth)

```bash
npm run setup
```

Θα σου δώσει ένα link για να εξουσιοδοτήσεις την εφαρμογή· μετά θα γράψει αυτόματα το
`GMAIL_REFRESH_TOKEN` στο `.env` σου.

## 7. Επικύρωση με `npm run doctor`

```bash
npm run doctor
```

Αυτό είναι ένα **read-only** εργαλείο — δεν στέλνει emails, δεν καλεί το OpenRouter, δεν
γράφει στη βάση, δεν κάνει push. Ελέγχει:

- Έκδοση Node
- Ότι το `node_modules` υπάρχει και ότι το native module `sqlite3` όντως φορτώνει
- Ότι υπάρχει `.env` και ότι έχουν τιμή τα απαιτούμενα κλειδιά
- Πρόσβαση στο κοινόχρηστο GitHub repo (αν έχεις βάλει `GITHUB_TOKEN`/`SITES_REPO`)
- Ότι υπάρχει `GMAIL_REFRESH_TOKEN`
- Ότι ο φάκελος `data/` είναι εγγράψιμος
- Playwright (browser layer του QA gate), Docker, Claude CLI

Στο τέλος τυπώνει μια σύνοψη (πόσα ✅ / ⚠️ / ❌) και τι να διορθώσεις. Τρέξε το ξανά μετά
από κάθε διόρθωση μέχρι να μην έχεις ❌.

## 8. Εκκίνηση του CRM (Docker)

Από τη **ρίζα** του repo (όχι μέσα στο `autonomous-agent/`):

```bash
docker compose up -d      # CRM στο http://localhost:8080
```

Λεπτομέρειες, άλλαξη πόρτας, troubleshooting: δες [`../DOCKER.md`](../DOCKER.md).

## 9. Εκκίνηση του dashboard

Μέσα στο `autonomous-agent/`:

```bash
npm run dashboard
```

Το dashboard σου δείχνει την κατάσταση του agent (στατιστικά, ουρά έγκρισης, κ.λπ.)
χωρίς να εκτελεί κάποιο κύκλο.

## ⚠️ ΠΡΟΣΟΧΗ πριν τρέξεις `npm start`

Το `npm start` **δεν είναι δοκιμαστικό**. Ξεκινάει αμέσως έναν πραγματικό κύκλο του agent
που:

- δημιουργεί πραγματικά websites για leads,
- **στέλνει πραγματικά emails** σε πραγματικούς παραλήπτες.

Το πρώτο σου run πρέπει να γίνει **υπό επίβλεψη** (μαζί με κάποιον έμπειρο συνάδελφο),
αφού πρώτα έχεις τρέξει `npm run doctor` χωρίς ❌ και έχεις επιβεβαιώσει τις τιμές
(`DAILY_WEBSITE_LIMIT`, `WEBSITES_PER_BATCH`, `SENDER_EMAIL`) στο `.env` σου.

## Αντιμετώπιση προβλημάτων

| Πρόβλημα | Αιτία | Λύση |
|---|---|---|
| Σφάλμα φόρτωσης `sqlite3` (native binding) | Το `node_modules` αντιγράφηκε/χτίστηκε σε άλλο OS (π.χ. macOS → Windows) | `rm -rf node_modules/sqlite3 && npm install sqlite3` |
| `docker compose up -d` αποτυγχάνει επειδή η πόρτα 8080 είναι κατειλημμένη | Κάτι άλλο ήδη ακούει στο 8080 | Όρισε άλλη πόρτα: `CRM_PORT=8090 docker compose up -d` (macOS/Linux) ή `$env:CRM_PORT=8090; docker compose up -d` (Windows PowerShell) — δες [`../DOCKER.md`](../DOCKER.md) |
| Το `npm run doctor` λέει "το token δεν μπορεί να γράψει σε αυτό το repo" | Το PAT δημιουργήθηκε χωρίς δικαίωμα `Contents: Read and write` | Ξαναδημιούργησε το fine-grained token με το σωστό permission (βήμα 5) |
| Το `npm run doctor` προειδοποιεί για `GMAIL_REFRESH_TOKEN` | Δεν έχει τρέξει ποτέ το OAuth flow σε αυτό το μηχάνημα | Τρέξε `npm run setup` (βήμα 6) |
