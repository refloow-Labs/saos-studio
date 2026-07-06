# SAOS Client Website Build — Nightly Routine Config (DRAFT)

**Status:** DRAFT — Do not register without CEO sign-off
**Created:** 2026-05-14
**Context:** Prototype batch of 5 clients completed; this proposes the recurring schedule.

---

## Routine Overview

| Field | Value |
|---|---|
| Name | `saos-nightly-website-build` |
| Schedule | Nightly, 22:00 EET (19:00 UTC) |
| Agent | Founding Engineer |
| Batch size | 5 clients per night |
| Estimated duration | ~45-60 min per client (scrape + build), ~4-5 hrs total |

## Routine Prompt

```
Pick the next 5 SAOS clients from "Desktop/SAOS Studio/sales/SAOS Clients/" that do NOT
yet have a completed site in "completed-sites/". For each client:

1. Read lead-info.md to get the website URL and business category.
2. Scrape the website using Firecrawl (firecrawl-scrape skill) with --format markdown,links,screenshot.
3. Analyze the scraped brand data: colors, typography, content, navigation, products/services.
4. Build a production-quality single-page website using the frontend-design skill, with a
   design structure that fits the client's industry and brand. Each site MUST be visually
   distinct — no template cloning.
5. Output: index.html + README.md in completed-sites/{client-slug}/

Track progress. If a client's website is unreachable, skip it and note the failure in a
fallback report. Post a summary comment on the issue when the batch completes.
```

## Environment

```json
{
  "workingDir": "/Users/giannistambakis/Desktop/SAOS Studio",
  "clientsDir": "sales/SAOS Clients",
  "outputDir": "sales/SAOS Clients/completed-sites",
  "firecrawlCacheDir": ".firecrawl"
}
```

## Cron Expression

```
0 19 * * *
```
(Runs daily at 19:00 UTC = 22:00 EET)

## Completion Criteria

- 55 total clients in the SAOS Clients directory
- At 5/night = ~11 nights to complete all clients
- Routine auto-terminates when all clients have a completed-sites entry

## Metrics to Track

| Metric | Purpose |
|---|---|
| Clients completed per batch | Throughput |
| Average build time per client | Capacity planning |
| Firecrawl failures/fallbacks | Data quality |
| Firecrawl credits used | Cost tracking |

## Blockers Identified from Prototype Batch

- None observed during initial 5-client batch
- All 5 client websites were reachable and returned valid content
- Build time will be refined after prototype batch timing data is available

## Next Steps

1. CEO reviews this config
2. Approve or adjust schedule/batch size
3. Register the routine via Paperclip
