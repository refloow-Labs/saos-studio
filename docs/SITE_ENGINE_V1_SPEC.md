# Μηχανή παραγωγής sites — Spec υλοποίησης V1

**Για:** coding agent που θα υλοποιήσει το Στάδιο Α (demo sites).
**Προϋπόθεση ανάγνωσης:** [`SITE_ENGINE_REQUIREMENTS.md`](SITE_ENGINE_REQUIREMENTS.md) — οι απαιτήσεις D‑1…D‑10, S‑1…S‑13, N‑1…N‑9 αναφέρονται εδώ με τους κωδικούς τους.
**Αναθεώρηση 2026-07-29:** ενσωματώθηκαν οι αποφάσεις του design session ([`NICHE_PACKS_DESIGN.md`](NICHE_PACKS_DESIGN.md) §6): Pexels αντί Unsplash, per-section ContentPlan, pack-aware assembler, cost tracking, `LEADS_FILE`. Το design layer (niche packs) είναι V1.5 — το V1 χτίζεται με τον `generic` pack αλλά με το σωστό interface από την αρχή.

---

## 0. Η βασική αρχή — διάβασέ το πρώτο

> **Το LLM επιστρέφει ΔΕΔΟΜΕΝΑ. Ο κώδικας παράγει HTML.**

Σήμερα ζητάμε από το μοντέλο ολόκληρο HTML και ελπίζουμε να θυμηθεί `<title>`, `alt`, schema. Δεν τα θυμάται — μετρήθηκε: **0 αναφορές SEO** στο σημερινό prompt.

Στο V1 το μοντέλο γράφει **μόνο ελληνικό κείμενο σε JSON**. Ο assembler το ρίχνει σε πρότυπο που έχει ήδη μέσα του όλα τα S‑1…S‑13. Έτσι το SEO παύει να είναι πιθανότητα και γίνεται εγγύηση.

---

## 1. Τι υπάρχει ήδη — ΜΗΝ το ξαναχτίσεις

| Αρχείο | Τι κάνει | Χρήση στο V1 |
|---|---|---|
| `src/design-brief-generator.js` | κανόνες: κατηγορία → παλέτα, τυπογραφία, sections | **επαναχρησιμοποίησέ το** για design tokens |
| `src/qa-gate.js` | 4-layer έλεγχος + score + issues | επεκτείνεται με SEO layer |
| `src/skill-runner.js` | spawn headless coding agent | δεν χρειάζεται στο V1 |
| `src/netlify-deployer.js` | deploy μέσω Netlify API | **χρειάζεται αναδιάρθρωση** (§6) |
| `src/site-publisher.js` · `shared-ledger.js` | GitHub συντονισμός | ως έχει |
| `src/approval-queue.js` | ουρά έγκρισης (SQLite) | ως έχει |

---

## 2. Αρχιτεκτονική

```
lead { company, region, phone, email, category }
  │
  ├─[0] lead-normalizer.js   ΚΩΔΙΚΑΣ   ← ΔΙΟΡΘΩΝΕΙ ΤΟ BLOCKER (§3)
  │
  ├─[1] content-writer.js    LLM ×1     → JSON κειμένου (§4)
  │
  ├─[2] image-picker.js      ΚΩΔΙΚΑΣ+API → εικόνες ανά κατηγορία, με cache
  │
  ├─[3] seo-builder.js       ΚΩΔΙΚΑΣ    → title, meta, OG, JSON-LD, canonical, robots
  │
  ├─[4] site-assembler.js    ΚΩΔΙΚΑΣ    → single-file HTML
  │
  ├─[5] qa-gate.js           ΥΠΑΡΧΕΙ    → έλεγχος· αποτυχία ⇒ επιστροφή στο [1] με feedback
  │
  └─[6] netlify-deployer.js  ΑΝΑΔΙΑΡΘΡΩΣΗ → demo.<domain>/<slug>/
```

**Μία μόνο κλήση LLM ανά site** (βήμα 1). Όλα τα υπόλοιπα είναι ντετερμινιστικά ⇒ N‑4 (< $0,02/site) επιτυγχάνεται άνετα.

---

## 3. `src/lead-normalizer.js` — ΞΕΚΙΝΑ ΑΠΟ ΕΔΩ

**Πρόβλημα:** το `leads-no-website.json` έχει πεδία πεζά (`company`, `region`, `phone`, `email`, `category`), ενώ ο κώδικας ζητάει `lead.Company`, `lead.Email`, `lead['Τηλέφωνο']`, `lead['NACE 2 Desc']`, `lead['Περιοχή']`. Το φίλτρο στο `leads-manager.js` απαιτεί `lead.Email` ⇒ **0 από 6.463 leads περνούν**. Επαληθευμένο τρέχοντας τον πραγματικό κώδικα.

```js
export function normalizeLead(raw)
// Δέχεται ΟΠΟΙΟΔΗΠΟΤΕ από τα δύο σχήματα (πεζά ή demo/κεφαλαία) και επιστρέφει:
// {
//   id, company, category, region, phone, email,
//   website: string|null,      // από 'Ιστοσελίδα Εταιρίας' αν υπάρχει
//   description: string|null,  // από 'Περιγραφή 1' αν υπάρχει
//   raw                        // το αρχικό αντικείμενο, για debugging
// }
// Κενή/άκυρη επωνυμία ή email ⇒ επιστρέφει null (ο caller το παραλείπει με log).
```

Κάλεσέ το μέσα στο `loadLeads()` του `leads-manager.js` και **ενημέρωσε το φίλτρο** να χρησιμοποιεί τα κανονικοποιημένα πεδία.

**Αποσύνδεση από το CRM (απόφαση 2026-07-29):** το μονοπάτι των leads γίνεται env-configurable — `LEADS_FILE` (default: το σημερινό `crm/leads-no-website.json`), ώστε ο agent να τρέχει αυτόνομα σε Docker/server χωρίς το `crm/` folder. Αντικατέστησε το hardcoded path στη γραμμή 11 του `leads-manager.js`.

**Προσοχή N‑6:** αν φορτωθούν leads αλλά επιλεγούν **0**, τύπωσε ρητή προειδοποίηση με τον λόγο. Το σημερινό bug ήταν αόρατο επί μήνες ακριβώς επειδή απέτυχε σιωπηλά.

**Acceptance:** `getNextLeads(10)` επιστρέφει 10 leads με μη κενά `company`/`email` από το πραγματικό αρχείο.

---

## 4. `src/content-writer.js` — η μοναδική κλήση LLM

```js
export class ContentWriter {
  constructor(options = {})   // env: OPENROUTER_API_KEY, CONTENT_MODEL (default ίδιο με σήμερα)
  async write(lead, { qaFeedback = null } = {})   // -> ContentPlan (παρακάτω)
}
```

**Το prompt δίνει στο μοντέλο:** επωνυμία, **ωμή κατηγορία** (όχι το 6-θέσιο bucket — 417 μοναδικές τιμές = 417 διαφορετικά keyword sets), περιοχή, τηλέφωνο, email.

**Ζητάει ΜΟΝΟ JSON** με αυτή τη δομή:

```jsonc
{
  "keywords": {
    "primary": "κατάστημα ενδυμάτων",          // από την κατηγορία
    "local":   "κατάστημα ενδυμάτων Αττική",   // primary + περιοχή
    "secondary": ["γυναικεία ρούχα", "..."]     // 3-6
  },
  "meta": {
    "titleCore":   "…",     // 25-35 χαρ. — ο assembler προσθέτει επωνυμία/περιοχή (S-1)
    "description": "…"      // 150-160 χαρ. ΑΚΡΙΒΩΣ, περιέχει το primary keyword (S-2)
  },
  "hero": { "headline": "…", "subheadline": "…", "cta": "…" },
  "sections": [
    { "id": "about",    "heading": "…", "paragraphs": ["…", "…"] },
    { "id": "services", "heading": "…", "items": [ { "title": "…", "text": "…" } ] },
    { "id": "why",      "heading": "…", "items": [ { "title": "…", "text": "…" } ] }
  ],
  "faq": [ { "q": "…", "a": "…" } ],           // 3-5 — βοηθά το SEO
  "imageQueries": ["clothing store interior", "…"]  // ΑΓΓΛΙΚΑ, για Unsplash
}
```

**Κανόνες στο prompt (γίνονται έλεγχοι):**
- Όλο το κείμενο **ελληνικά** (D‑1) — εξαίρεση μόνο το `imageQueries`
- **Απαγορεύεται** γενικόλογο κείμενο· κάθε πρόταση πρέπει να αφορά τη **συγκεκριμένη κατηγορία** (D‑2)
- Σύνολο **≥ 300 λέξεις** στα `paragraphs`/`items`/`faq` (D‑8)
- Απαγορεύονται: `lorem`, `placeholder`, `TODO`, «θα προσαρμοστεί», `info@example`
- Τα `sections` επιλέγονται **ανάλογα με την κατηγορία** — εστιατόριο ≠ συνεργείο (D‑7)

**Επικύρωση εξόδου:** έλεγξε το JSON με σχήμα. Αν λείπει πεδίο ή το κείμενο < 300 λέξεις, **ξαναζήτα μία φορά** με το σφάλμα ως feedback· μετά απέτυχε καθαρά.

**Per-section regeneration (απόφαση 2026-07-29):** πρόσθεσε `async rewriteSection(lead, contentPlan, sectionId, feedback)` που ξαναγράφει **ένα μόνο section** (στέλνει το υπάρχον ContentPlan ως context, ζητά JSON μόνο του section). Το QA gate, όταν το finding αφορά συγκεκριμένο section (π.χ. placeholder στο `services`), καλεί αυτό αντί για ολικό `write()` — φθηνότερο και δεν ρισκάρει να χαλάσει sections που πέρασαν. Ολικό rewrite μόνο για ολικά findings (π.χ. συνολικές λέξεις < 300, ομοιότητα S‑10).

**Στο retry του QA gate** το `qaFeedback` περνά αυτούσιο στο prompt (υπάρχει ήδη `sanitizeQaFeedback` στο `website-generator.js` — αντίγραψε τη λογική).

**Cost/token tracking (απόφαση 2026-07-29):** κάθε κλήση OpenRouter επιστρέφει `usage` στο response. Ο ContentWriter το επιστρέφει μαζί με το ContentPlan (`{ contentPlan, usage: { tokensIn, tokensOut, costUsd } }`)· ο caller τα γράφει στο SQLite ανά site (νέες στήλες ή πίνακας `llm_usage`: `lead_id, tokens_in, tokens_out, cost_usd, retries, created_at`) και αθροίζει στο `daily_stats`. Εμφάνιση: dashboard (:4000) + ημερήσιο report. Καλύπτει το κριτήριο αποδοχής N‑4 «κόστος/site μετρημένο».

---

## 5. Τα ντετερμινιστικά modules

### `src/image-picker.js` (D‑3, D‑4)
```js
export class ImagePicker {
  constructor(options = {})   // env: PEXELS_API_KEY
  isConfigured()
  async pick(imageQueries, { count = 4, category, seed })
  // -> [{ src, alt, width, height, credit }]   // src: data URI (WebP base64)
}
```
- **Pexels, ΟΧΙ Unsplash (απόφαση 2026-07-29):** το Unsplash API απαιτεί hotlinking + `download_location` ping — ασύμβατο με self-contained single-file HTML. Το Pexels επιτρέπει download/χρήση χωρίς hotlink mandate (200 req/h, 20k/μήνα — υπεραρκετά με cache). Credit γραμμή στο footer: «Φωτογραφίες: Pexels».
- **Cache ανά κατηγορία στο δίσκο** (`data/image-cache/<category-slug>/` + `index.json`): κατέβασμα 50-100 φωτό ανά κατηγορία **μία φορά**, όχι 6.463 κλήσεις. Resize ~1200px (hero) / ~600px (cards), **WebP q≈70, ενσωμάτωση ως base64 data URI** (~300-450 KB/σελίδα σύνολο).
- **Ντετερμινιστική επιλογή:** `seed` = hash(lead.id) → index στο cache, ώστε γείτονες ίδιας κατηγορίας να παίρνουν διαφορετικές φωτό και το ίδιο lead πάντα τις ίδιες (N‑5).
- `alt`: **ελληνικό**, περιγραφικό, με το primary keyword (D‑4) — παράγεται σε κώδικα, όχι από το API.
- Χωρίς κλειδί ⇒ επιστρέφει `[]` και ο assembler βγάζει την no-photo εκδοχή (gradient/SVG-pattern hero) (N‑6), με σημείωση στο verdict.
- Πάντα `loading="lazy"`, `width`/`height` (αποφυγή layout shift).

### `src/seo-builder.js` (S‑1…S‑13)
```js
export function buildSeo({ lead, contentPlan, baseUrl, slug, stage = 'demo' })
// -> { title, description, canonical, robots, openGraph, jsonLd, sitemapEntry }
```
- `title`: `<titleCore> | <company> — <region>`, **περικομμένο στους 60** (S‑1)
- `description`: 150‑160 χαρ. (S‑2)
- `canonical` / `og:url`: **`${baseUrl}/${slug}/`** — ποτέ καρφωμένο (S‑13)
- `robots`: `noindex, nofollow` για `stage==='demo'`, αλλιώς `index, follow` (S‑12)
- `jsonLd`: `LocalBusiness` με `name`, `telephone`, `email`, `areaServed`, `url`, `image`, και `@type` από χάρτη κατηγορίας→schema (`Restaurant`, `Store`, `HomeAndConstructionBusiness`, `MedicalBusiness`, `LodgingBusiness`, fallback `LocalBusiness`) (S‑5)

### `src/site-assembler.js` (S‑3, S‑4, S‑11, D‑5, D‑6, D‑9)
```js
export function assembleSite({ pack, contentPlan, images, seo, lead })
// -> { html, wordCount }
```
**Pack-aware από την αρχή (απόφαση 2026-07-29):** το `pack` είναι το niche pack manifest (βλ. [`NICHE_PACKS_DESIGN.md`](NICHE_PACKS_DESIGN.md) §3 — section recipe, tokens, variants, CTA vocabulary). **Στο V1 υλοποιείται ΕΝΑΣ pack: `packs/generic/`** (sections: hero, about, services, why, faq, contact· 1-2 variants· tokens από το υπάρχον `design-brief-generator.js`). Τα sections γράφονται ως JS functions (template literals) με tagged `html` helper που κάνει escape το LLM κείμενο. Η επιλογή variant/παλέτας γίνεται ντετερμινιστικά με seed από `lead.id`. Τα niche packs (estiasi, filoxenia, ygeia) έρχονται στο V1.5 **χωρίς αλλαγή του interface**.
- `<html lang="el">` (S‑3) · **ένα** `<h1>` = `hero.headline`, sections σε `<h2>` (S‑4)
- `<header> <main> <section> <footer>` (S‑11)
- Φόρμα **Netlify Forms**: `<form name="contact" method="POST" data-netlify="true">` + κρυφό `form-name` (D‑5) — η σημερινή φόρμα κάνει μόνο `alert()` και δεν στέλνει πουθενά
- `tel:` και `mailto:` σύνδεσμοι (D‑6)
- Design tokens από το υπάρχον `design-brief-generator.js`
- Inline CSS/JS, mobile-first, χωρίς οριζόντια κύλιση στα 375px (D‑9)
- Διακριτικό σήμα «προεπισκόπηση» όταν `stage==='demo'`

---

## 6. `src/netlify-deployer.js` — αναδιάρθρωση

**Σήμερα:** ένα Netlify site **ανά πελάτη**. **Απόφαση 2026‑07‑28:** ένα site, φάκελος ανά επιχείρηση — 6.463 sites σε έναν λογαριασμό είναι μοτίβο κατάχρησης.

```js
async deployDemo({ slug, html, assets = {} })
// ένα site (env: NETLIFY_DEMO_SITE_ID), deploy στο path `/<slug>/index.html`
// -> { deployed, url: `${baseUrl}/${slug}/` }
```
- Κράτα τη σωστή ροή digest που ήδη υπάρχει (`POST /deploys` με SHA1 → `PUT` μόνο τα `required` → poll μέχρι `ready`).
- Το deploy πρέπει να **διατηρεί** τα υπόλοιπα sites (N‑9): στείλε το πλήρες `files` manifest, ή χρησιμοποίησε ξεχωριστό deploy ανά φάκελο — τεκμηρίωσε ό,τι επιλέξεις.
- Καθολικό `robots.txt` με `Disallow: /` στη ρίζα του demo site.

---

## 7. QA gate — νέο SEO layer

Πρόσθεσε στο `qa-gate.js` layer που ελέγχει **S‑1…S‑13** και επιστρέφει `seoScore` χωριστά από το γενικό score. Παραβίαση S‑1/S‑2/S‑5 ⇒ `high`. Παραβίαση D‑2 (placeholder) ⇒ `critical` (υπάρχει ήδη).

**S‑10 (μοναδικότητα):** σύγκρινε το ορατό κείμενο με τα προηγούμενα sites **ίδιας κατηγορίας** (κράτα δείγματα σε `data/content-fingerprints.json`). Ομοιότητα > 70% ⇒ `high` και αναγέννηση. Αρκεί απλός shingle/Jaccard — μην τραβήξεις βιβλιοθήκη.

---

## 8. Μεταβλητές περιβάλλοντος (νέες)

```bash
CONTENT_MODEL=              # μοντέλο για το κείμενο
PEXELS_API_KEY=             # εικόνες (απόφαση 2026-07-29: όχι Unsplash — hotlink mandate)
LEADS_FILE=                 # μονοπάτι leads JSON (default: crm/leads-no-website.json)
NETLIFY_DEMO_SITE_ID=       # το ΕΝΑ demo site
DEMO_BASE_URL=              # π.χ. https://demo.saosstudio.gr
SITE_STAGE=demo             # demo | production
MIN_WORD_COUNT=300
MAX_CONTENT_SIMILARITY=0.70
```
Πρόσθεσέ τα στο `.env.example` **με σχόλια** και στους ελέγχους του `npm run doctor`.

---

## 9. Σειρά υλοποίησης

1. `lead-normalizer.js` + διόρθωση `leads-manager.js` — **τίποτα δεν δουλεύει χωρίς αυτό**
2. `content-writer.js` + επικύρωση σχήματος
3. `seo-builder.js` + `site-assembler.js` (χωρίς εικόνες — παράγουν ήδη έγκυρο site)
4. `image-picker.js` με cache
5. SEO layer στο QA gate
6. Αναδιάρθρωση `netlify-deployer.js`
7. Σύνδεση στο `agent.js` πίσω από `SITE_ENGINE_V2=true`, με το παλιό μονοπάτι να παραμένει λειτουργικό

---

## 10. Κριτήρια αποδοχής

- [ ] `getNextLeads(10)` επιστρέφει 10 πραγματικά leads (σήμερα: 0)
- [ ] CLI: `node src/site-engine.js --lead <id>` παράγει HTML **χωρίς email/deploy**
- [ ] Παραγόμενο site: `npm run test:unit` πράσινο **και** QA gate `pass:true` με `seoScore ≥ 90`
- [ ] Έλεγχος δείγματος 20 sites από **διαφορετικές** κατηγορίες: καμία ομοιότητα > 70%
- [ ] Κάθε `<img>` έχει ελληνικό `alt`· κάθε site ≥ 300 λέξεις· ακριβώς ένα `<h1>`
- [ ] Το JSON‑LD περνά από validator· `robots` = `noindex` σε `SITE_STAGE=demo`
- [ ] Χωρίς `PEXELS_API_KEY` το site παράγεται κανονικά με τη no-photo εκδοχή (N‑6)
- [ ] Κόστος ανά site μετρημένο και < $0,02 (N‑4) — `tokens_in/tokens_out/cost_usd` ανά site στο SQLite, ορατά στο dashboard και στο ημερήσιο report
- [ ] `LEADS_FILE` env var λειτουργεί: ο agent τρέχει με leads JSON εκτός του `crm/` folder
- [ ] Το ίδιο lead παράγει πάντα το ίδιο site (ίδιο variant/παλέτα/εικόνες — seed από `lead.id`, N‑5)

---

## 11. Τι ΔΕΝ αγγίζεις

`email-service.js` · `shared-ledger.js` · `approval-queue.js` (εκτός αν χρειαστεί νέα στήλη) · `docker-compose.yml` · `Dockerfile` · τα υπάρχοντα 25 tests — πρέπει να παραμείνουν πράσινα.
