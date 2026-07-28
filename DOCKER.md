# CRM σε Docker

Το CRM τρέχει σε container ώστε να δουλεύει το ίδιο σε **macOS και Windows**, χωρίς να
χρειάζεται Python ή οτιδήποτε άλλο εγκατεστημένο τοπικά. Πλέον και ο **autonomous agent**
και το **dashboard** τρέχουν κι αυτά σε container (δες [παρακάτω](#agent-και-dashboard-σε-docker)) — το μόνο που τρέχει ακόμα
τοπικά είναι το Claude Code.

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

---

# Agent και Dashboard σε Docker

Ο autonomous agent και το dashboard τρέχουν πλέον κι αυτά σε container, χτισμένα από το
ίδιο [`autonomous-agent/Dockerfile`](autonomous-agent/Dockerfile). Έτσι όλη η ομάδα
(macOS + Windows) τρέχει **τον ίδιο runtime** — όχι έναν agent που δουλεύει στο Mac σου
και σκάει στα Windows ενός συναδέλφου.

## Γιατί το χρειαζόμασταν (τι έσπαγε πριν)

- **`sqlite3` είναι native module.** Ένα binary χτισμένο σε macOS σκάει σε Windows με
  `"not a valid Win32 application"` (και το αντίστροφο). Χτίζοντάς το *μέσα* στο image,
  όλοι τρέχουν το ίδιο, σωστό binary — μόνιμα.
- **Το QA gate χρειάζεται πραγματικό Chromium.** Πριν έπρεπε να εγκατασταθεί χειροκίνητα
  σε κάθε μηχάνημα (`.claude/skills/playwright-skill/node_modules`). Τώρα είναι ήδη μέσα
  στο image.
- **Line endings.** Το `node_modules` είναι tracked στο git repo αυτό. Το `npm install`
  σε Windows ξαναγράφει ~200 αρχεία με CRLF, γεμίζοντας κάθε diff με θόρυβο. Με το
  install να τρέχει μόνο μέσα στο container (και με το [`.gitattributes`](.gitattributes)
  να κανονικοποιεί σε LF), αυτό σταματάει.
- **Το παλιό `scripts/start-crm.sh` ήταν macOS-only** (`lsof`, `open`, hardcoded
  `/Users/giannistambakis/...`) — έχει ήδη αντικατασταθεί από το `crm` container· το
  ίδιο ισχύει τώρα και για την εκκίνηση του agent.

## Χρήση

Ο agent είναι **opt-in** (πίσω από `profiles: ["agent"]`) γιατί στέλνει **πραγματικά
emails** σε πραγματικά leads. Ένα απλό `docker compose up` δεν πρέπει ποτέ να τον
ξεκινήσει κατά λάθος:

```bash
docker compose --profile agent up -d agent   # ξεκίνα τον agent (στέλνει emails!)
docker compose --profile agent logs -f agent
docker compose --profile agent down
```

Το dashboard είναι **default-on** — μόνο διαβάζει/γράφει στην τοπική approval queue
(SQLite), δεν στέλνει ποτέ email — οπότε ξεκινάει κανονικά μαζί με το CRM:

```bash
docker compose up -d              # crm + dashboard  → http://localhost:4000
docker compose up -d dashboard    # μόνο το dashboard, αν το crm τρέχει ήδη
```

## Rebuild μετά από νέο κώδικα

Το image χτίζεται μία φορά και μετά τρέχει από cache· αν κάνεις `git pull` και άλλαξε
κώδικας (ή το `package.json`), χρειάζεται rebuild πριν το επόμενο `up`:

```bash
docker compose build agent dashboard
docker compose --profile agent up -d agent
docker compose up -d dashboard
```

## Πού μένουν τα δεδομένα

Το SQLite state (`data/agent-state.db`) και τα παραγόμενα demo sites (`crm/agent-drafts/`)
ζουν σε **bind mounts** από τον host — όχι μέσα στο container:

- `./autonomous-agent/data` → `/app/data` (agent + dashboard, ίδιο volume ώστε να
  βλέπουν την ίδια ουρά εγκρίσεων)
- `./crm` → `/crm` μέσα στον agent, με `CRM_DRAFTS_PATH=/crm/agent-drafts` ώστε να
  γράφει στον **ίδιο** φάκελο που σερβίρει το `crm` container

Άρα ένα `docker compose build` ή ακόμα και ένα `docker rm` του container **δεν χάνει
τίποτα** — τα δεδομένα μένουν στον host disk.

Σχετικό αρχείο: [`autonomous-agent/Dockerfile`](autonomous-agent/Dockerfile).
