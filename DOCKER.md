# CRM σε Docker

Το CRM τρέχει σε container ώστε να δουλεύει το ίδιο σε **macOS και Windows**, χωρίς να
χρειάζεται Python ή οτιδήποτε άλλο εγκατεστημένο τοπικά. Τα υπόλοιπα (autonomous agent,
dashboard, Claude Code) τρέχουν κανονικά στο μηχάνημά σου, όπως πριν.

## Προϋπόθεση

Docker Desktop ([macOS](https://docs.docker.com/desktop/install/mac-install/) ·
[Windows](https://docs.docker.com/desktop/install/windows-install/)) — τίποτα άλλο.

## Χρήση

Από τη ρίζα του repo:

```bash
docker compose up -d      # ξεκίνα το CRM  → http://localhost:8080
docker compose down       # σταμάτα το
docker compose logs -f crm   # δες τι ζητάει ο browser (χρήσιμο για 404)
```

Το container ξαναξεκινά μόνο του μετά από restart του μηχανήματος. Για να το σταματήσεις
οριστικά, τρέξε `docker compose down`.

### Άλλη πόρτα

Αν το 8080 είναι πιασμένο, όρισε `CRM_PORT` πριν το `up`:

```bash
CRM_PORT=8090 docker compose up -d          # macOS / Linux
$env:CRM_PORT=8090; docker compose up -d    # Windows PowerShell
```

## Πώς είναι στημένο

- **Image:** `nginx:alpine` (~50MB) — δεν χτίζεται τίποτα, απλώς κατεβαίνει.
- **Live σύνδεση:** ο φάκελος `crm/` είναι mounted read-only μέσα στο container. Ό,τι
  γράφει ο agent στον host (`agent-drafts.json`, `agent-drafts/<site>/index.html`)
  εμφανίζεται **αμέσως** στο CRM — χωρίς rebuild ή restart.
- **UTF-8:** το nginx στέλνει ρητά `charset=utf-8` σε HTML/CSS/JS/JSON, ώστε τα ελληνικά
  να μη σπάνε.
- **Χωρίς cache** σε `agent-drafts.json` και `agent-drafts/`, ώστε τα νέα drafts να
  φαίνονται με απλό refresh.

Σχετικά αρχεία: [`docker-compose.yml`](docker-compose.yml) και
[`docker/crm.nginx.conf`](docker/crm.nginx.conf).

## Γνωστό θέμα: οι σύνδεσμοι portfolio (`localhost:8081`)

Το `crm/data.js` περιέχει 67 συνδέσμους της μορφής
`http://localhost:8081/sales/SAOS Clients/<πελάτης>/index.html`. Ο φάκελος `sales/`
**δεν υπάρχει σε αυτό το repo** — έμεινε στο παλιό μηχάνημα — οπότε αυτοί οι σύνδεσμοι
είναι ήδη νεκροί, ανεξάρτητα από το Docker. (Το παλιό `scripts/start-crm.sh` σήκωνε έναν
δεύτερο server στο 8081 ακριβώς γι' αυτά.)

Τα demo sites που παράγει ο agent **δεν** επηρεάζονται: είναι σχετικοί σύνδεσμοι μέσα στο
`agent-drafts/` και δουλεύουν κανονικά στο 8080.

Αν βρεθεί ο φάκελος `sales/`, πρόσθεσε ένα δεύτερο service που σερβίρει τη ρίζα του repo
στο 8081 και οι σύνδεσμοι ζωντανεύουν.
