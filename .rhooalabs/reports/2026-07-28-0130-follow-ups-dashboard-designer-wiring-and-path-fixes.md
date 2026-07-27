# Follow-ups: dashboard, designer wiring, CLI enablement & path fixes

- **Date:** 2026-07-28 01:30
- **Project:** saos-studio
- **Status:** Completed-with-warnings

## 1. What you asked for

"Κάνε τα next steps" — execute the follow-ups recommended by the QA-gate run: install the claude CLI so the skill layers go live, fix the HIGH finding (fake success URL), build the parked dashboard view, fix the CRM sync path, wire DesignerAgent, and do the repo hygiene.

## 2. Plan executed

- [x] claude CLI v2.1.220 installed globally + added to user PATH; `SkillRunner.isClaudeAvailable()` now returns **true** (skill layers 3a/3b are live for future runs)
- [x] HIGH fix — `deployToNetlify` rethrows on save failure instead of returning a fake success URL
- [x] Dashboard view — Express server + offline Greek UI over the approval queue
- [x] CRM sync path fix — repo-relative, live-verified (6 drafts written to the real `crm/agent-drafts.json`)
- [x] DesignerAgent wiring — behind `DESIGNER_AGENT_ENABLED`, with QA-feedback pass-through and simulation fallback
- [x] Hygiene — `.env.example`, `.gitignore`, staged untracking of `node_modules`/`.env`/`*.db` (4,144 files)
- [x] **Unplanned (found during review):** three additional real bugs fixed — see §7

## 3. Changes

- `src/dashboard-server.js` — new: Express dashboard (127.0.0.1, `DASHBOARD_PORT`||4000); `/api/stats`, `/api/queue`, `/api/queue/:id/preview`, POST approve/reject, static UI. `npm run dashboard`
- `src/dashboard/{index.html,style.css,app.js}` — new: offline Greek UI — status counters, weekly stats, queue table with status chips, colour-coded QA badges, expandable QA issues, preview/approve/reject, 30s auto-refresh
- `src/approval-queue.js` — additive `getAll()` (excludes `website_data`) and `getById(id)`
- `src/sync-to-crm.js` — macOS Desktop path → repo-relative `../../crm`
- `src/website-generator.js` — rethrow on save failure; **Greek→Latin transliteration in `generateSiteName`** with hash fallback; **output dir moved to the repo's `crm/agent-drafts`**, overridable via new `CRM_DRAFTS_PATH`
- `src/agent.js` — `DESIGNER_AGENT_ENABLED` routing via `generateWebsite()`/`generateWebsiteViaDesignerAgent()` adapter; `--check-config` reports the active generator
- `src/designer-agent.js` — `designWebsite(lead, {qaFeedback, forceSimulation})`; real skill run via SkillRunner (`ui-ux-pro-max`, maxTurns 40) with simulation fallback; CLI `--test` mode
- `src/dashboard/app.js` — escaped the one unescaped interpolation (`formatDate` output)
- `.env` — `DESIGNER_AGENT_ENABLED` set to `false` (was `true` — see §7)
- `.env.example`, `.gitignore` — new
- `tests/` — 6 new tests (dashboard endpoints, designer CLI + simulation, `getAll`/`getById`, rethrow); rethrow test retargeted to `CRM_DRAFTS_PATH`

## 4. Tests

- Passed: **25** / Failed: 0
- New tests added this run: 6 (19 → 25)
- Coverage delta: n/a (no coverage tooling)

Known flake: Node's `--test` runner intermittently (~1/10-15 runs) reports an IPC deserialization error in `approval-queue.test.js` when sibling test files spawn real child processes. Never an assertion failure; a rerun is clean.

## 5. Behavioral verification

- [x] Dashboard serves — met · temp-copy DBs, port 4187: `/api/stats` → 200 `{"queue":{"pending_approval":6},"weekly":[]}`; `/api/queue` → 200, 6 rows, **no `website_data` key**; `/` → 200 with "SAOS Agent Dashboard"
- [x] Preview resolves via repo-relative path — met · `/api/queue/3/preview` → 200, 21,726 bytes of real HTML; unknown id → 404
- [x] CRM sync repo-relative — met · `crm/agent-drafts.json` refreshed live ("Synced 6 drafts"); no `Desktop`/`/Users/` strings remain anywhere in `src/`
- [x] deployToNetlify rethrows — met · covered by a passing test that forces `ENOTDIR` via `CRM_DRAFTS_PATH`; `lastSavedHtmlPath` stays null
- [x] DESIGNER_AGENT_ENABLED switch — met · `--check-config` → `generator: website-generator`; with inline `=true` → `generator: designer-agent`; both exit 0, no DB/network writes
- [x] designer-agent CLI simulation — met · `--test "Verify Co,bakery"` → exit 0, 12.21 KB HTML written, no claude spawn
- [x] Skill layers available — met · `SkillRunner.isClaudeAvailable()` → **true**
- [x] Hygiene — met · `.env.example` documents all QA_*/DESIGNER_AGENT_*/DASHBOARD_PORT/CRM_DRAFTS_PATH keys with empty secret values; `.gitignore` covers node_modules, .env, data/qa-output, data/*.db

## 6. Senior review

The Senior and Verifier subagents could not complete this run (API session limit / classifier unavailability), so the orchestrator performed the critical review and verification directly. Findings below were found and fixed in that pass; a full independent Senior pass on this diff is a recommended follow-up.

- **Must-fix (resolved):** macOS Desktop output path in `website-generator.js` and `dashboard-server.js`; empty-slug collision in `generateSiteName`
- **Should-fix (resolved):** hardcoded output dir made configurable (`CRM_DRAFTS_PATH`), which also un-deadens the `CRM_*` config family; path containment check added to the dashboard's `deriveLocalHtmlPath`
- **Nits (resolved):** unescaped `formatDate` interpolation in the dashboard UI

## 7. Dead-code & bug findings

Found by the orchestrator during review of this run's diff — **all three fixed**:

- [HIGH] `src/website-generator.js:163` (pre-fix) — generated sites were written to `~/Desktop/SAOS Studio/crm/agent-drafts/`, a macOS-era location that **does not exist on this machine**, instead of the repo's `crm/agent-drafts/` that the CRM actually serves. The dashboard's preview endpoint faithfully mirrored the same wrong path. → both now repo-relative.
- [HIGH] `src/website-generator.js:206` (pre-fix) — `generateSiteName` stripped every non-`[a-z0-9]` character, so **purely Greek company names produced an empty slug**. The output dir collapsed to the `agent-drafts` root, meaning every Greek-named company overwrote `crm/agent-drafts/index.html` — the CRM's own listing page — and collided with each other. Live evidence in the DB: rows 4 and 6 have `demo_url = "agent-drafts//index.html"`. → Greek→Latin transliteration + `site-<sha1>` fallback; verified: `ΑΡΓΥΡΟΠΟΥΛΟΣ, ΝΙΚΟΛΑΟΣ & ΒΑΣΙΛΕΙΟΣ, Ι.Κ.Ε.` → `argyropoylos-nikolaos-vasileios-i-k-e`.
- [LOW] `src/dashboard/app.js:111` (pre-fix) — the only unescaped interpolation in a row template (`formatDate` output). Not attacker-controlled today (agent-written ISO timestamps) but inconsistent with the escaping applied everywhere else. → escaped.
- [INFO] `.env` had `DESIGNER_AGENT_ENABLED=true` — dead config until this run. With the flag now wired **and** the claude CLI installed, the next `npm start` would have begun spawning real (billable) Claude sessions unannounced. → set to `false`; you enable it deliberately.

## 8. Blockers surfaced this run

- No user-facing blockers. Two infrastructure interruptions: the Verifier subagent terminated on an API session limit and the Senior subagent could not launch; both stages were performed directly by the orchestrator instead.

## 9. Follow-ups suggested

1. **Independent Senior review of this diff** — the review was self-performed; a fresh pass (especially on `dashboard-server.js` auth posture and `designer-agent.js`'s live skill-spawn path) is worth doing when limits reset.
2. **Data cleanup:** existing queue rows 4 and 6 still carry the broken `demo_url = "agent-drafts//index.html"` from the old slug bug — repoint or regenerate them before sending anything to those two leads.
3. **Supervised first live run** of the skill layers: set `QA_ENABLED=true` (and optionally `DESIGNER_AGENT_ENABLED=true`) and watch one cycle, since both now spawn billable Claude sessions.
4. **Dashboard hardening** if it will ever be reachable beyond localhost: no auth today on POST approve/reject.
5. Still-deferred from the previous run: bounded stdout/stderr buffers in SkillRunner/QAGate; extract `processLead()` so the retry loop is testable; deduplicate `killProcessTree`/`spawnWithTimeout`.
6. **Commit hygiene:** the staged untracking of `node_modules`/`.env`/`*.db` (4,144 deletions) is ready — commit it together with the source changes, and consider `git gc` afterwards.
