# Niche Packs — Research υλικού (πλήρη ευρήματα)

**Ημερομηνία:** 2026-07-29 · Συνοδεύει το [`NICHE_PACKS_DESIGN.md`](NICHE_PACKS_DESIGN.md)
Τρία παράλληλα research streams: (Α) πηγές templates + δομές ανά niche, (Β) CSS/component στρατηγική, (Γ) inventory skills.

---

## Α. Πηγές templates (αξιολόγηση)

| Πηγή | Άδεια | Χρήση για εμάς |
|---|---|---|
| **BootstrapMade** | free tier με footer credit· Pro ~$29 | **#1 για δομική έμπνευση ανά niche** — Flavora (εστιατόριο), MediCare (ιατρείο), Constructify (κατασκευές), LuxEstate (ακίνητα), Travely (ταξιδιωτικό)· 84 one-page |
| **Start Bootstrap** | **MIT** | καθαρότερη άδεια — skeleton patterns που σηκώνονται νόμιμα αυτούσια |
| **HTML5UP** | CC-BY 3.0 | layout mechanics (heroes, alternating rows), όχι niche δομές |
| **Tooplate / TemplateMo** | free με όρους | δευτερεύουσες πηγές niche αναφορών (restaurant, hotel) |
| **One Page Love** | curation site | one-page UX patterns (anchor nav, sticky CTA) |
| **Astro themes / Tailwind Awesome / Cruip** | πολλά MIT | μοντέρνα οπτική γλώσσα (spacing, type scale)· inspiration only |
| **Nicepage / Free CSS** | μέτριες άδειες, bloated code | ΜΟΝΟ για να δεις «τι sections έχει το niche X» — ποτέ κώδικας |
| **Colorlib roundups** | — | τα άρθρα «best websites in niche X» = έτοιμη έρευνα κανονικών δομών |
| **Relume library** | free 30 components | **το πιο χρήσιμο αρχιτεκτονικά** — βλ. §Γ ταξινομία |

**Κόκκινες γραμμές αδειών (από stream Β):** Tailwind Plus/UI απαγορεύει ρητά χρήση σε site builders. Preline: «Fair Use License», επικίνδυνο. Every Layout: το βιβλίο copyrighted — υλοποιούμε τις τεχνικές, δεν αντιγράφουμε κώδικα. Επιτρεπτά quarries (MIT): HyperUI, Flowbite free, DaisyUI, Start Bootstrap, Open Props.

---

## Β. Κανονικές δομές sections ανά niche

Κοινά invariants όλων των packs: sticky nav με anchors + **τηλέφωνο πάνω δεξιά** (click-to-call κρίσιμο για ελληνικές ΜμΕ), footer με NAP + social + map link, mobile sticky CTA bar.

| Niche | Ροή sections (σειρά scroll) | Ιδιαίτερα patterns / trust signals |
|---|---|---|
| **Εστίαση** | Hero (food photo, CTA Κράτηση+Μενού) → Story strip (οικογενειακή παράδοση) → Menu highlights (κατηγορίες+τιμές, όχι πλήρες μενού) → Signature πιάτα → Gallery → Reviews → Ωράριο+χάρτης → Φόρμα κράτησης | price-dot-leader lists· badges efood/Wolt/Box· daily specials slot |
| **Ξενοδοχεία** | Hero + mock booking strip → Intro → Room cards (φωτό, χωρητικότητα, amenity icons, από-τιμή) → Amenities grid → Περιοχή/αποστάσεις → Gallery → Reviews (Booking score badge) → Direct-booking benefits («Καλύτερη τιμή εγγυημένα») → Φόρμα | sticky Book now· amenity icon vocabulary· 5-7 nav items max |
| **Κατασκευές** | Hero (CTA Ζητήστε Προσφορά) → Services grid → **Portfolio έργων** (τύπος, περιοχή, έτος· before/after) → Stats counters (έτη, έργα, m²) → Διαδικασία 3-4 βημάτων → Πιστοποιήσεις (εργοληπτικό πτυχίο, ISO) → Testimonials → Quote form | before/after· numbered timeline· «πτυχίο τάξης X» |
| **Χονδρικό/B2B** | Hero (τι διανέμει + περιοχή, CTA Κατάλογος+Συνεργασία) → **Κατηγορίες προϊόντων grid** → **Logo wall brands** → Γιατί εμάς (στόλος, stock, πίστωση, min order) → Κάλυψη (νομοί) → About+stats (SKUs, πελάτες) → CTA «Άνοιγμα λογαριασμού χονδρικής» → Επικοινωνία+πωλητής | χωρίς δημόσιες τιμές· PDF κατάλογος· quote workflow |
| **Ιατρεία** | Hero (πορτρέτο, ειδικότητα+πόλη, CTA Ραντεβού+τηλ.) → Υπηρεσίες/παθήσεις → **Βιογραφικό** (σπουδές, ιατρικός σύλλογος) → Χώρος → **Ταμεία & πρακτικά** (ΕΟΠΥΥ, ωράριο) → Testimonials (διακριτικά) → FAQ → Ραντεβού | CTA ραντεβού ×3· μπλε/λευκή παλέτα· το τηλέφωνο κυριαρχεί στην Ελλάδα |
| **Λιανικό** | Hero (lifestyle, CTA Δείτε τη Συλλογή) → Featured products (χωρίς καλάθι) → Κατηγορίες tiles → Story → Instagram-style gallery → Visit us (βιτρίνα+ωράριο+χάρτης) | IG ως κύριο CTA· sale banner slot· έμφαση στο κατάστημα |
| **Επαγγ. υπηρεσίες** | Hero (outcome headline, CTA Δωρεάν Συμβουλευτική) → Υπηρεσίες → **Who-we-serve segmentation** (ελ. επαγγελματίες/ΑΕ-ΕΠΕ/ατομικές) → About+credentials (ΟΕΕ) → Διαδικασία → Stats → Testimonials → FAQ → Φόρμα | segmentation cards· εποχικό banner (δηλώσεις) |
| **Μεταφορές** | Hero (στόλος, CTA Προσφορά) → Υπηρεσίες (FTL/LTL, ψυγεία, ADR) → **Κάλυψη/δρομολόγια** → Στόλος (specs) → Trust row (CMR, GPS, %) → Stats → Πελάτες/κλάδοι → **Δομημένη quote form** (από, προς, φορτίο, βάρος) | quote form ≠ γενική φόρμα· 24/7 τηλέφωνο |
| **Ακίνητα** | Hero + mock search strip (περιοχή/τύπος/τιμή) → Featured listings (τιμή-πρώτη, m², δωμάτια, badge Πώληση/Ενοικίαση) → Υπηρεσίες → About agent → Περιοχές tiles → «Πουλήστε το ακίνητό σας» funnel → Testimonials | listing card anatomy· διπλά CTAs (αγοραστές/ιδιοκτήτες) |
| **Τρόφιμα/αρτοποιία** | Hero (προϊόν close-up, heritage headline) → Κατηγορίες tiles → **Η ιστορία μας** (γενιές) → Signature προϊόντα → Daily-fresh strip → Gallery → Custom orders CTA (τούρτες) → Καταστήματα+ωράρια | ζεστή παλέτα· heritage timeline «3η γενιά»· χονδρική σε καφέ ως 2ο CTA |
| **Αυτοκίνητο** | Hero (CTA Ραντεβού+τηλ.) → Υπηρεσίες (service, φανοποιείο, ΚΤΕΟ prep) → Brands logo row → Trust row (γνήσια ανταλλακτικά, εγγύηση) → [dealers: vehicle cards] → Gallery/before-after → Reviews → Booking | φόρμα με μάρκα/μοντέλο· roadside τηλέφωνο strip |
| **Ταξιδιωτικά** | Hero (carousel προορισμών) → Πακέτα cards (διάρκεια, από-τιμή, ημερομηνίες) → Κατηγορίες → Γιατί εμείς (δόσεις, συνοδοί) → About → Testimonials → Προσφορές strip → Inquiry form | seasonal urgency («Πάσχα 2027»)· **ΜΗΤΕ** ως trust signal |
| **Ενέργεια** | Hero (benefit: «Μειώστε το ρεύμα έως 90%», CTA Δωρεάν Μελέτη) → Υπηρεσίες (net-metering, αντλίες, EV) → **Savings numbers** (payback) → 4 βήματα (…σύνδεση ΔΕΔΔΗΕ) → **Επιδοτήσεις** («Εξοικονομώ», «Φωτοβολταϊκά στη Στέγη») → Έργα με kW specs → Πιστοποιήσεις → Φόρμα μελέτης | ROI-led· subsidy badges = ελληνικός conversion μοχλός |

**Ελληνική αγορά:** πολλές κορυφαίες ταβέρνες δεν έχουν καν site (επιβεβαιώνει την ευκαιρία των leads)· το «οικογενειακή ιστορία» section είναι ο συναισθηματικός πυρήνας. Reference sites: technek.gr, arsis.com.gr, teka-ae.gr (κατασκευές)· sophiasuites-santorini.com (boutique φιλοξενία).

---

## Γ. Μαθήματα από AI builders — η ταξινομία

- **Relume (το κλειδί):** όχι templates ανά industry, αλλά **ταξινομία section-types × variants** (Hero 1-Ν, CTA 1-Ν, FAQ 1-Ν...). Flow: περιγραφή → sitemap → wireframe από variants. ➜ Το pack μας = (συνταγή σειράς section-types) + (επιλογή variants) + (niche-specific components: menu-list, room-card, listing-card, quote-form).
- **10Web:** industry taxonomy με long-tail granularity (Logistics ≠ Warehouse) — τα 15 niches μας μπορεί να θέλουν sub-variants (ταβέρνα vs fine dining) αργότερα.
- **Durable:** μόνο όνομα+πόλη+industry → σχεδόν σταθερή δομή, η διαφοροποίηση ζει στο copy+εικόνες. Επικυρώνει το «LLM γράφει μόνο ελληνικό JSON».
- **Mixo:** **per-section regeneration** ως μονάδα iteration ➜ το JSON schema του content-writer να είναι per-section, ώστε το QA retry να αναγεννά ένα section, όχι όλο το site.
- **Wix ADI:** per-industry λειτουργικά widgets ➜ στα demos τα μιμούμαστε με mock widgets (booking strip, search strip, quote form).

**Σύνθεση — schema του pack:**
```
niche pack = {
  section recipe          # διατεταγμένη λίστα (section-type, variant-pool)
  niche components        # menu-list, room-card, listing-card, quote-form…
  content schema/section  # τι πρέπει να γεμίσει το LLM (per-section)
  image-slot spec         # πόσες/τι είδους εικόνες ανά section
  palette/typography      # presets από ui-ux-pro-max CSVs + jitter ranges
  CTA vocabulary (ελλ.)   # «Ζητήστε Προσφορά», «Κλείστε Ραντεβού»…
  trust-signal slots      # ΜΗΤΕ, ΕΟΠΥΥ, πτυχίο τάξης, Εξοικονομώ, efood/Wolt, Booking score
}
```
Τα **trust-signal slots** είναι το πιο ελληνικό και πιο διαφοροποιητικό στοιχείο έναντι κάθε γενικού builder.

---

## Δ. CSS/component στρατηγική & εικόνες — σύνοψη αποφάσεων

(Πλήρης ανάλυση στο §5.3 του design doc.) Πρωτεύουσα: vanilla CSS custom properties + CUBE δομή + Every-Layout-inspired primitives + Open Props τιμές + plain JS template literals με escaping `html` tag. Fallback: Tailwind v4 offline per pack. Εικόνες: **Pexels** (όχι Unsplash — hotlink mandate), category cache 50-100 φωτό/niche, WebP→base64, deterministic pick με hash(lead.id), «no-photo» tier με gradient/SVG heroes.

## Ε. Inventory ui-ux-pro-max — σύνοψη

(Πλήρη paths/σχήματα στο §5.1 του design doc.) 3-way join 161 industries (products/colors/ui-reasoning CSV) + landing.csv (34 section orders) + styles.csv (84, με CSS vars) + typography.csv (73 pairings, copy-paste imports) + google-fonts.csv (1.923, φίλτρο ελληνικού subset). Εργαλεία: `search.py` (BM25 CLI), `design_system.py` (πλήρες design system σε MD). Χρειάζεται alias table `niche → Product Type`.
