# QA & Testing skill gate in the autonomous-agent pipeline

- **Date:** 2026-07-27 17:11
- **Project:** saos-studio
- **Status:** Completed-with-warnings

## 1. What you asked for

Add a skill-driven QA & Testing stage to the autonomous agent's pipeline so generated demo websites are quality-checked (and auto-repaired) **before** they reach the approval queue / production outreach. Skills sourced from the internet (qa-test, playwright-skill) plus the already-installed ui-ux-pro-max. (Original wider request — dashboard view + skills integration — was narrowed by you to the QA gate first; the dashboard plan remains recorded in decisions.md.)

## 2. Plan executed

- [x] Task 1 — `src/skill-runner.js`: headless `claude -p` spawn wrapper (file-based JSON protocol, per-spawn `--mcp-config`, timeout kill, graceful skip when the CLI is unavailable, Windows ComSpec+stdin fallback for Node ≥20 `.cmd` EINVAL)
- [x] Task 2 — `src/qa-gate.js`: 4-layer QA gate — L1 deterministic HTML checks (placeholder leaks, meta/alt/anchors/Greek/size), L2 real-Chromium browser check via playwright-skill (console/page errors, failed requests, 375px overflow, screenshots), L3a functional via qa-test skill (Playwright MCP), L3b design review via ui-ux-pro-max; merged verdict `{score, pass, issues[], layers, skippedLayers}`; CLI `--test` mode
- [x] Task 3 — wiring: `agent.js` QA_ENABLED-gated flow generate → QA → pass ⇒ queue / fail ⇒ regenerate with QA feedback (≤ QA_MAX_RETRIES) ⇒ `qa_failed`; additive `qa_score`/`qa_status`/`qa_report` columns; `--check-config` flag; `.env` QA block appended

Skills installed to `autonomous-agent/.claude/skills/`: **qa-test** (adampaulwalker — reviewed, static markdown, Playwright MCP) and **playwright-skill** (lackeyjb v4.1.0 — reviewed, official playwright dep only; Chromium installed). **ui-ux-pro-max** already present as a global plugin.

## 3. Changes

- `autonomous-agent/src/skill-runner.js` — new: SkillRunner class (headless Claude Code session spawner)
- `autonomous-agent/src/qa-gate.js` — new: QAGate class + CLI (`node src/qa-gate.js --test <html> [--skip-skill-layers]`)
- `autonomous-agent/src/agent.js` — QA gate wiring in runDailyCycle, retry/feedback loop, `--check-config`
- `autonomous-agent/src/approval-queue.js` — idempotent ALTER TABLE migrations (qa_score, qa_status, qa_report); addToQueue accepts qa fields; migrations now fail loudly on real errors
- `autonomous-agent/src/website-generator.js` — `generate(lead, {qaFeedback})` appends sanitized «ΔΙΟΡΘΩΣΕΙΣ QA» section (severity-sorted, ≤10 issues, 300-char cap); `lastSavedHtmlPath` null-safe
- `autonomous-agent/.env` — appended QA block: `QA_ENABLED=false`, `QA_MIN_SCORE=80`, `QA_MAX_RETRIES=2`, `QA_TIMEOUT_SECONDS=300`, `QA_ADVERSARY=false`
- `autonomous-agent/package.json` — added `test:unit` script; sqlite3 reinstalled (Windows prebuilt binding — was a broken macOS binary)
- `autonomous-agent/tests/` — new: 4 test files, 19 tests (node:test, fully offline)
- `autonomous-agent/.claude/skills/{qa-test,playwright-skill}/` — the two vetted skills (committed by you in 20358e20)

## 4. Tests

- Passed: 19 / Failed: 0 (`npm run test:unit`, ~13s, includes one real headless-Chromium browser-layer test)
- New tests added: 19 (qa-gate 6, skill-runner 3, approval-queue 5, website-generator 5)
- Coverage delta: n/a (no coverage tooling in project)

## 5. Behavioral verification

- [x] CLI verdict — met · `node src/qa-gate.js --test <fixture> --skip-skill-layers` → valid JSON on stdout (logs on stderr), exit 0
- [x] Defect detection — met · seeded fixture (visible PLACEHOLDER, info@example.gr, no title) → pass:false, criticals present; clean Greek fixture with `placeholder="…"` form attributes → pass:true, score 100, zero false positives
- [x] Config switch, no side effects — met · `--check-config` prints qa_gate/generator/daily_limit, exits alone in ~0.5s, data/ untouched; `QA_ENABLED=true` inline flips to `enabled`
- [x] Additive schema — met · temp-DB PRAGMA shows qa_* columns; legacy insert (no qa fields) → NULLs; qa insert persists 42/'qa_failed'/JSON
- [x] Graceful degradation — met · with claude unresolvable, CLI still exits 0; functional+design in skippedLayers with reason; deterministic+browser still run (real Chromium, screenshots)
- [x] No outreach side effects — met · send path still selects only status='approved'; `qa_failed` rows can never be emailed

## 6. Senior review

- **Must-fix (resolved):** (1) stale `lastSavedHtmlPath` could make QA review the previous lead's HTML → reset-to-null + falsy-htmlPath guard (queued as `qa_error`, lead never lost); (2) Chromium's automatic favicon.ico 404 scored −7 on every site and fed the generator an unfixable "correction" → server 204 + console filter; (round 2) ComSpec fallback double-escaped quotes, would break every real skill run once the CLI is installed → `windowsVerbatimArguments:true` + plain quoting, verified argv string
- **Should-fix (applied):** boundary-safe path-traversal guard; taskkill error-listener (crash risk); browser infra failures → skippedLayers instead of penalizing the site; temp .cjs cleanup; CLI stdout flush + guaranteed exit via write-callback; qaFeedback prompt sanitization/cap; loud migration failures; EINVAL vs ENOENT diagnosis with safe ComSpec/stdin fallback
- **Should-fix (deferred → follow-ups):** bounded stdout/stderr buffers; extract `processLead()` for testability (agent self-starts at module scope); gitignore for `data/qa-output/`, `.env`, `node_modules`; deduplicate killProcessTree/spawnWithTimeout across the two files
- **Nits (noted):** qa_error rows discard last known verdict; gate "fails open" on layer-1 only (logged via skippedLayers but nothing downstream reads it); `_claudeAvailable` cached for process lifetime; pre-existing per-initialize() sqlite connection leak; process.chdir in tests; agent.start() catch sets no exit code; "QA total attempts: 1" logged when QA never ran

## 7. Dead-code & bug findings

- [HIGH] `autonomous-agent/src/website-generator.js:178-183` — deployToNetlify's catch swallows write errors and returns a **fake success URL**; the row still enters the queue as `pending_approval` (with qaStatus `qa_error`) pointing at a demo file that was never written. Pre-existing swallow, now load-bearing for the QA flow.
- [MED] `autonomous-agent/src/skill-runner.js:334-366` — child stdout fully accumulated but never read (dead data collection, no fallback parse path)
- [LOW] `autonomous-agent/src/qa-gate.js:114` — `lead` param intentionally unused (`void lead`)
- [LOW] no `.env.example` documents the 5 new QA_* vars; QA gate silently no-ops unless you know to set `QA_ENABLED=true`

## 8. Blockers surfaced this run

- **Q:** Which QA skills should be vetted/installed? — **A:** All 3 recommended (qa-test + playwright-skill + wire ui-ux-pro-max)
- **Q:** Plan approval for the QA-gate build (Checkpoint 1)? — **A:** Approved ("commit first to my branch", then proceed); adversary mode default off
- (No subagent-raised blockers; the earlier dashboard/skills plan was redirected by you to "understanding first" and later narrowed to this QA-gate run.)

## 9. Follow-ups suggested

1. **Enable the skill layers:** install the claude CLI on PATH (e.g. `npm install -g @anthropic-ai/claude-code`) — today layers 3a/3b always skip (CLI unresolvable; something named `claude` on Git-Bash PATH exits 1). Then flip `QA_ENABLED=true` and do a supervised first run.
2. **Fix the HIGH finding:** deployToNetlify should propagate save failures instead of returning a fake URL (and the queue row should be `qa_error`-statused, not `pending_approval`-looking).
3. The deferred should-fixes above (buffers, processLead extraction, gitignore hygiene, helper dedup) + `.env.example` documenting the QA_* knobs.
4. Commit hygiene now: stage only `autonomous-agent/src/`, `tests/`, `package.json`, `package-lock.json`, `.env` — NOT the ~200 CRLF-churn `node_modules/**` modifications. Consider untracking `node_modules/` and `.env` entirely.
5. The original approved-but-parked plan: dashboard view (Express + SQLite JSON API + approve/reject UI showing qa_score/qa_report), CRM sync path fix, DesignerAgent wiring via SkillRunner.
6. QA browser artifacts (`data/qa-output/*.png/json`) accumulate in a git-tracked tree — add retention or gitignore.
