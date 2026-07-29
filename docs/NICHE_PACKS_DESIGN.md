# Niche Packs — Σχεδιασμός design layer για τη μηχανή sites

**Έκδοση:** προσχέδιο 1 · 2026-07-29
**Σχετίζεται με:** [`SITE_ENGINE_REQUIREMENTS.md`](SITE_ENGINE_REQUIREMENTS.md) · [`SITE_ENGINE_V1_SPEC.md`](SITE_ENGINE_V1_SPEC.md)
**Κατάσταση:** design session σε εξέλιξη — research ενότητες συμπληρώνονται

---

## 1. Αποφάσεις που έχουν ληφθεί (2026-07-29)

| Ερώτημα | Απόφαση |
|---|---|
| Τι σημαίνει «niches» | Ομαδοποίηση των 417 κατηγοριών NACE των 6.463 leads σε ~15 design niches |
| Πώς φτιάχνονται τα templates | **Υβριδικό**: δομή/έμπνευση από online templates, αλλά ξαναχτίζονται ως δικά μας sections μέσα στο σύστημα design tokens |
| Πού τρέχουν τα Claude skills | **Μόνο offline (authoring)** — χτίζουν τα niche packs μία φορά· η γραμμή παραγωγής μένει ντετερμινιστική (σέβεται N‑2, N‑4) |
| Scope τώρα | Design + research υλικού, καθόλου κώδικας παραγωγής |

**Η βασική αρχή παραμένει** (από το V1 spec): το LLM γράφει **μόνο ελληνικό κείμενο σε JSON**· ο κώδικας παράγει το HTML. Τα niche packs είναι το **design layer** που καταναλώνει ο `site-assembler.js`.

---

## 2. Ταξινόμηση niches — data-driven

Ανάλυση του πραγματικού `crm/leads-no-website.json` (6.463 leads, 417 μοναδικές κατηγορίες· το top-40 καλύπτει το 61,5%). Πρωτότυπο keyword-mapping με 15 niches πέτυχε **90,4% κάλυψη**:

| # | Niche | Leads | Χαρακτήρας design |
|---|---|---|---|
| 1 | `xondriko` — Χονδρικό εμπόριο / B2B | 1.270 | εταιρικό, αξιοπιστία, κατάλογος προϊόντων, B2B CTA («ζητήστε προσφορά») |
| 2 | `kataskeves` — Κατασκευές / τεχνικά | 809 | portfolio έργων, trust badges, βαριά τυπογραφία |
| 3 | `lianiko` — Λιανικό εμπόριο | 516 | βιτρίνα, προϊόντα, ωράριο/τοποθεσία |
| 4 | `epaggelmatikes` — Επαγγελματικές υπηρεσίες | 475 | καθαρό/συντηρητικό, υπηρεσίες, πρόσωπα, ραντεβού |
| 5 | `akinita` — Ακίνητα | 437 | listings αισθητική, μεγάλες εικόνες |
| 6 | `estiasi` — Εστίαση / καφέ / μπαρ | 415 | food photography, μενού, ατμόσφαιρα |
| 7 | `energeia-viomix` — Ενέργεια / βιομηχανία | 410 | industrial εταιρικό, δυνατότητες, πιστοποιήσεις |
| 8 | `metafores` — Μεταφορές / logistics | 334 | στόλος, κάλυψη, διαδικασία |
| 9 | `filoxenia` — Ξενοδοχεία / καταλύματα | 288 | immersive εικόνες, δωμάτια, booking CTA |
| 10 | `trofima` — Παραγωγή τροφίμων / αγροτικά | 237 | προϊόν & προέλευση, storytelling |
| 11 | `ygeia` — Υγεία | 225 | καθαρό/ήρεμο, υπηρεσίες, ωράριο, ραντεβού |
| 12 | `tech-media` — Πληροφορική / διαφήμιση / media | 217 | μοντέρνο, bold, case studies |
| 13 | `autokinito` — Αυτοκίνητο (πώληση/συνεργεία/parts) | 150 | δυναμικό, υπηρεσίες, brands |
| 14 | `tourismos` — Ταξιδιωτικά γραφεία | 52 | προορισμοί, πακέτα, εμπιστοσύνη |
| 15 | `omorfia` — Κομμωτήρια / αισθητική / γυμναστήρια | ~25* | lifestyle, gallery, ραντεβού |
| 16 | `generic` — fallback | 623 | ουδέτερο εταιρικό pack |

\* Το πρωτότυπο regex χρειάζεται βελτίωση (π.χ. «κομμωτηρίων» δεν έπιασε)· μέρος του unmatched ουσιαστικά ανήκει σε υπάρχοντα niches (καθαρισμοί → υπηρεσίες, τυροκομία → τρόφιμα, παιδικοί σταθμοί → υγεία/εκπαίδευση).

**Συμπεράσματα:**
- Το βάρος πέφτει σε **B2B εταιρικά packs** (χονδρικό + κατασκευές + ενέργεια + μεταφορές = ~2.800 leads, 43%), όχι στα «κλασικά» local-business templates.
- Η ωμή κατηγορία (417 τιμές) συνεχίζει να πηγαίνει στο LLM για το κείμενο (spec §4) — το niche καθορίζει **μόνο** το design. Δύο επίπεδα: **niche → layout/tokens**, **category → περιεχόμενο/keywords**.
- Ο mapper (`niche-mapper.js`, μελλοντικό module) θα είναι ντετερμινιστικός πίνακας κατηγορία→niche (όχι regex στην παραγωγή — τα 417 mappings γράφονται μία φορά, ελέγχονται με το μάτι, μπαίνουν σε JSON).

---

## 3. Ανατομία του συστήματος (οριστικοποιημένη μετά το research)

**Το βασικό αρχιτεκτονικό μάθημα (Relume):** όχι μονολιθικά templates ανά industry, αλλά **ταξινομία section-types × variants**. Το section library είναι ΚΟΙΝΟ· το niche pack είναι μια *συνταγή* πάνω του + niche-specific components + ελληνικά trust signals.

```
site-engine/
  sections/                    # ΚΟΙΝΗ βιβλιοθήκη — JS functions (template literals)
    hero.js                    # 5-6 variants: split, cover, centered, card-overlap, gradient, no-photo
    services.js, about.js,     # 3-4 variants το καθένα
    gallery.js, reviews.js,
    faq.js, contact.js,
    hours-map.js, stats.js,
    footer.js, nav.js ...      # σύνολο ~15 types, ~70-90 variants
  components/                  # niche-specific: menu-list, room-card, listing-card,
                               # quote-form, booking-strip (mock), vehicle-card, subsidy-badges
  primitives.css               # layout primitives (stack/cluster/sidebar/switcher — Every Layout τεχνικές)
  packs/
    <niche>/pack.json          # ΣΥΝΤΑΓΗ:
      # - section recipe: διατεταγμένη λίστα (type, variant-pool, μεταθέσεις σειράς)
      # - components: ποια niche components μπαίνουν πού
      # - content schema per section: τι ζητάμε από το LLM (per-section => per-section QA retry)
      # - image-slot spec: πόσες/τι εικόνες, queries ανά κατηγορία
      # - tokens: 6-10 παλέτες + 4-6 font pairings (seed: ui-ux-pro-max CSVs) + jitter ranges
      # - CTA vocabulary: «Ζητήστε Προσφορά», «Κλείστε Ραντεβού», «Δείτε τη Συλλογή»…
      # - trust-signal slots: ΜΗΤΕ, ΕΟΠΥΥ, πτυχίο τάξης, Εξοικονομώ, efood/Wolt, Booking score
      # - jsonld: @type για S-5
  niche-map.json               # κατηγορία (417) -> niche (χειρόγραφο, reviewed)
```

- **Επιλογή variants ντετερμινιστική** με seed από `lead.id`: hero variant, παλέτα (+ OKLCH hue jitter με `color-mix()`), τυπογραφία, μετάθεση σειράς, εικόνες (hash → index ώστε γείτονες ίδιου niche να μην πάρουν ίδιες φωτό). Αναπαραγώγιμο ⇒ idempotent (N‑5).
- **Μοναδικότητα (S‑10):** 6 heroes × 8 παλέτες × 5 fonts × 3 σειρές ≈ 720 σκελετοί/niche. Το σωστό μέτρο είναι per-viewer: ο επισκέπτης συγκρίνει ~5-10 sites ίδιου niche/περιοχής — αρκεί να μη συμπίπτουν hero+παλέτα, και το LLM κείμενο + εικόνες κάνουν τα υπόλοιπα.
- **Κοινά invariants** όλων των packs: sticky nav με τηλέφωνο πάνω δεξιά (click-to-call), footer NAP, mobile sticky CTA bar.
- Τα **trust-signal slots** είναι ό,τι πιο διαφοροποιητικό έχουμε έναντι γενικών AI builders — κανένας δεν ξέρει τι είναι το ΜΗΤΕ ή το «Εξοικονομώ».

## 4. Ροή authoring (offline, με skills)

1. Research δομής ανά niche (online templates ως έμπνευση — υβριδικό μοντέλο).
2. Claude Code + `ui-ux-pro-max` σχεδιάζει το pack (sections, tokens) — μία φορά ανά niche.
3. QA του pack: render με δείγμα ContentPlan, έλεγχος D‑9 (375px), Lighthouse, S‑1…S‑13 μέσω assembler.
4. Το pack μπαίνει στο repo ως στατικό asset — η παραγωγή δεν καλεί ποτέ Claude.

## 5. Research

### 5.1 Inventory skills: ui-ux-pro-max (ολοκληρώθηκε)

Το plugin `ui-ux-pro-max` v2.6.2 (`C:\Users\kasde\.claude\plugins\cache\ui-ux-pro-max-skill\ui-ux-pro-max\2.6.2\.claude\skills\`) περιέχει **έτοιμη πρώτη ύλη για τα niche packs — δεν χρειάζεται scraping**:

**Ο πυρήνας: 3 CSV με 161 γραμμές, κλειδωμένα στο ΙΔΙΟ `Product Type` (verified 3-way join):**

| Αρχείο | Δίνει ανά industry/niche |
|---|---|
| `data/products.csv` | keywords, primary/secondary style, landing pattern, color focus, considerations |
| `data/colors.csv` | **17 συγκεκριμένα hex tokens** (shadcn ονοματολογία: primary/accent/background/muted/border...), WCAG-checked |
| `data/ui-reasoning.csv` | pattern, style priority, effects, **decision rules (JSON)**, anti-patterns |

**Δεύτερο hop (join με όνομα):** `landing.csv` (34 patterns — **έτοιμη σειρά sections**, π.χ. «1. Hero, 2. Value prop, 3. Features, 4. CTA, 5. Footer»), `styles.csv` (84 styles με CSS custom-property defaults + implementation checklist), `typography.csv` (73 font pairings με **copy-paste `@import` + Tailwind config**), `ux-guidelines.csv` (99 κανόνες με good/bad code), `google-fonts.csv` (1.923 fonts).

**Κάλυψη των niches μας:** τα 161 product types περιλαμβάνουν Restaurant/Food Service, Hotel/Hospitality, Real Estate, Construction/Architecture, Automotive/Car Dealership, Legal, Dental, Home Services (Plumber/Electrician), Bakery/Cafe, Logistics/Delivery, Agriculture/Farm — δηλαδή σχεδόν 1-προς-1 αντιστοίχιση με τον πίνακα του §2. Χρειάζεται **alias table** `niche → Product Type` (χειροκίνητο, μικρό).

**Εργαλεία:** `scripts/search.py` (BM25 CLI πάνω στα CSV, με dials variance/motion/density) και `design_system.py` (παράγει πλήρες design system σε Markdown). Μπορούν να τρέξουν **offline στο authoring** για να παράγουν το `pack.json` + `tokens.css` κάθε pack σχεδόν μηχανικά.

➡️ **Συνέπεια για το σχέδιο:** το βήμα 2 του §4 (authoring) γίνεται πολύ φθηνότερο — τα tokens/typography/section-order κάθε pack ξεκινούν από τα CSV, και το χειροποίητο μέρος περιορίζεται στα HTML section variants.

### 5.2 Πηγές templates + δομή sections ανά niche (ολοκληρώθηκε)

Πλήρη ευρήματα στο [`NICHE_PACKS_RESEARCH.md`](NICHE_PACKS_RESEARCH.md): αξιολόγηση 14 πηγών, **κανονικές δομές sections για 13 niches** (ο πυρήνας του υλικού — έτοιμες συνταγές ανά niche με ελληνικά trust signals), και μαθήματα από τα per-industry συστήματα των AI builders (Relume/10Web/Durable/Mixo). Σύνοψη:
- **BootstrapMade** (niche templates) + **Colorlib roundups** ⇒ τι sections χρειάζεται κάθε niche· **Start Bootstrap (MIT)** ⇒ νόμιμα skeletons· **Relume** ⇒ η ταξινομία section-types × variants που υιοθετήσαμε στο §3.
- **Durable** αποδεικνύει ότι industry-keyed copy πάνω σε μικρό δομικό πυρήνα αρκεί για αξιόπιστα SMB demos — επικύρωση του «LLM γράφει μόνο JSON».
- **Mixo** ⇒ per-section regeneration: το ContentPlan schema να είναι per-section ώστε το QA retry να αναγεννά μεμονωμένο section (βελτίωση έναντι του V1 spec §4 που ξαναζητά όλο το JSON).

### 5.3 Στρατηγική CSS/component library + templating engine (ολοκληρώθηκε)

**Σύσταση (πρωτεύουσα): hand-rolled semantic HTML sections + vanilla CSS custom properties** ως σύστημα tokens, οργανωμένα κατά CUBE CSS, με layout primitives εμπνευσμένα από Every Layout (δικές μας υλοποιήσεις — το βιβλίο είναι copyrighted, οι τεχνικές όχι) και τιμές tokens από **Open Props** (MIT). Rendering: **plain JS template literals** ως συναρτήσεις-sections (`heroSplit({tokens, content, variant})`) με tagged `html` helper για auto-escaping του LLM κειμένου. Γιατί:
- Μόνη επιλογή όπου το per-site theming είναι string substitution χωρίς build στην παραγωγή (ο σκληρός μας περιορισμός).
- Ελάχιστο βάρος: ~8-15 KB minified CSS ανά σελίδα, όλο δικό μας.
- Μηδενικό license exposure σε κλίμακα 6.463 sites.
- Claude Code γράφει/refactor-άρει plain JS+CSS καλύτερα από κάθε DSL· το JSON contract τυποποιείται μέχρι τα section props.

**Fallback:** Tailwind v4 compiled offline ανά pack (theme ως CSS vars ώστε το per-site jitter να δουλεύει χωρίς recompile) — μόνο αν το authoring σε vanilla CSS αποδειχθεί αργό.

**Άδειες — κόκκινες γραμμές:** Tailwind Plus/UI **απαγορεύεται ρητά** για site builders· Preline επικίνδυνο (Fair Use License). Επιτρεπτά ως *οπτική αναφορά μόνο* (quarry, όχι dependency): HyperUI, Flowbite free, DaisyUI (όλα MIT — αξίζει αντιγραφή της token-based theming αρχιτεκτονικής του DaisyUI).

**Μαθηματικά μοναδικότητας (S‑10):** το σωστό μέτρο είναι per-viewer (κανείς δεν βλέπει 6.463 sites — συγκρίνει ~5-10 ίδιου niche/περιοχής). Προϋπολογισμός variants: hero 5-6 layouts, λοιπά sections 3-4, παλέτες 6-10/niche **+ συνεχές hue jitter με `color-mix()`/OKLCH** (seed από lead.id), τυπογραφία 4-6 pairings/niche **με πλήρες ελληνικό subset** (Inter, Manrope, Noto Sans/Serif, Commissioner, Literata), 2-3 μεταθέσεις σειράς sections. ≈ **720 διακριτοί σκελετοί ανά niche**· σύνολο authoring: **~70-90 section variants** (2-3 εβδομάδες offline δουλειάς, όχι Relume-scale). Prior art: WordPress theme.json style variations = ακριβώς layout variants × token skins.

**Εικόνες — ΑΛΛΑΓΗ έναντι του V1 spec:** το Unsplash API **απαιτεί hotlinking** + `download_location` ping — ασύμβατο με self-contained single-file HTML. Σύσταση: **Pexels** (χωρίς hotlink mandate, δωρεάν εμπορική χρήση, 200 req/h — αρκεί με category cache). Στρατηγική: offline job κατεβάζει 50-100 curated φωτό ανά niche, resize 1200px hero / 600px cards, **WebP q≈70 ως base64 data URIs** (~300-450 KB/σελίδα), deterministic επιλογή με hash(lead.id) ώστε γείτονες ίδιου niche να παίρνουν διαφορετικές. Επιπλέον tier «no-photo» variants (gradient/SVG-pattern heroes) για <60 KB εκδοχή + έξτρα ποικιλία. Credit γραμμή στο footer («Φωτογραφίες: Pexels»).

## 6. Προτάσεις προς απόφαση (research ολοκληρωμένο)

| # | Ερώτημα | Απόφαση | Κατάσταση |
|---|---|---|---|
| 1 | Πιλοτικά packs | **`estiasi` (415) + `filoxenia` (288) + `ygeia` (225)** — επιλογή χρήστη: οι πιο «εμπορικοί» κλάδοι (αγοράζουν sites ευκολότερα, καλύτερο conversion σε πληρωμένα έργα). `generic` fallback για όλα τα υπόλοιπα niches μέχρι να χτιστούν. | ✅ εγκρίθηκε 2026-07-29 |
| 2 | Variants ανά section | 5-6 hero, 3-4 λοιπά, 6-10 παλέτες + OKLCH jitter, 4-6 fonts (ελληνικό subset), 2-3 μεταθέσεις ⇒ ~720 σκελετοί/niche. Σύνολο ~70-90 authored variants. | ✅ από research |
| 3 | CSS στρατηγική | Vanilla tokens + CUBE + template literals (καμία εξάρτηση, βλ. §5.3). Fallback: Tailwind v4 offline. | ✅ εγκρίθηκε 2026-07-29 |
| 4 | `design-brief-generator.js` | Απορροφάται: οι κανόνες κατηγορία→παλέτα/τυπογραφία μεταφέρονται στα `pack.json`, εμπλουτισμένοι από τα ui-ux-pro-max CSV. Παραμένει μόνο όσο ζει το παλιό μονοπάτι (`SITE_ENGINE_V2` flag). | ✅ εγκρίθηκε 2026-07-29 |
| 5 | Εικόνες | **Pexels αντί Unsplash** (το Unsplash API απαιτεί hotlinking — ασύμβατο με single-file)· category cache· WebP base64· no-photo tier. **Απαιτεί διόρθωση του V1 spec §5.** | ✅ εγκρίθηκε 2026-07-29 |
| 6 | Per-section regeneration | Το ContentPlan schema γίνεται per-section ώστε QA retry να αναγεννά μεμονωμένα sections. Μικρή τροποποίηση του V1 spec §4. | ✅ εγκρίθηκε 2026-07-29 |

## 7. Τελικό plan υλοποίησης

**Φάση 0 — Ενημέρωση specs** *(μικρή, χωρίς κώδικα)*
Ενσωμάτωση των εγκεκριμένων αλλαγών στο `SITE_ENGINE_V1_SPEC.md`: Pexels στο `image-picker.js`, per-section ContentPlan schema στο `content-writer.js`, interface `assembleSite({ pack, contentPlan, images, seo, lead })` ώστε ο assembler να χτιστεί εξαρχής pack-aware (έστω με έναν `generic` pack). Έξοδος: spec έτοιμο για coding agent χωρίς rework.

Επιπλέον (αποφάσεις 2026-07-29):
- **Cost/token tracking in-app**: ο `content-writer.js` καταγράφει `tokens_in`, `tokens_out`, `cost_usd` ανά κλήση (το OpenRouter τα επιστρέφει στο `usage` κάθε response) → SQLite (`agent-state.db`, ανά site + άθροισμα στο `daily_stats`) → εμφάνιση στο dashboard και στο ημερήσιο report. Καλύπτει το κριτήριο αποδοχής «κόστος/site μετρημένο < $0,02». *Απορρίφθηκαν*: LiteLLM proxy (άσκοπο σε αυτή τη φάση — ίδιες τιμές tokens, +€5/μήνα VPS· επανεξέταση όταν πληθύνουν agents/μοντέλα) και self-hosted LLM (12-35× ακριβότερο στην κλίμακά μας, αδύναμα ελληνικά).
- **Αποσύνδεση από το CRM**: το μονοπάτι leads γίνεται env-configurable (`LEADS_FILE`, default το σημερινό `crm/leads-no-website.json`) στο πλαίσιο της δουλειάς του `lead-normalizer.js`, ώστε ο agent να τρέχει αυτόνομα (Docker/server) χωρίς το CRM folder.

**Φάση 1 — V1 engine** *(/build με το RhooaLabs pipeline)*
Η σειρά του spec §9 ως έχει: lead-normalizer (ξεμπλοκάρει τα 6.463 leads) → content-writer → seo-builder + assembler με `generic` pack → image-picker (Pexels) → SEO layer στο QA gate → netlify-deployer αναδιάρθρωση → `SITE_ENGINE_V2=true` flag. DoD: τα κριτήρια αποδοχής του spec §10.

**Φάση 2 — Θεμέλια του design layer** *(offline authoring, Claude Code + skills)*
1. `niche-map.json`: 417 κατηγορίες → 16 niches (χειρόγραφο review, ξεκινά από το regex πρωτότυπο).
2. Alias table niche → ui-ux-pro-max Product Type + εξαγωγή tokens (παλέτες/typography/landing patterns) από τα CSV.
3. `primitives.css` + κοινή βιβλιοθήκη sections (~15 types) με 2-3 variants αρχικά.

**Φάση 3 — Πιλοτικά packs: estiasi, filoxenia, ygeia**
Ανά pack: section recipe από το research (§Β του RESEARCH doc) + niche components (menu-list / room-card + booking strip mock / ταμεία-ωράριο card) + CTA vocabulary + trust-signal slots + 6-10 παλέτες + 4-6 fonts. QA: render × 20 πραγματικά leads/niche, S‑10 ομοιότητα < 70%, D‑9 στα 375px, seoScore ≥ 90.

**Φάση 4 — Rollout**
Pexels cache για τα 3 niches (50-100 φωτό/niche) → παραγωγή demo batch → approval queue → επέκταση σε επόμενα packs με σειρά προτεραιότητας leads (xondriko, kataskeves, akinita...).
