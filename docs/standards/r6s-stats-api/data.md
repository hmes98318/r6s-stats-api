# Data Access and Cleaning

- Retrieve only public R6 Siege player statistics through the configured integration. Keep platforms restricted to `ubi`, `psn`, and `xbl` and encode each username as one URL segment.
- Bound timeouts, response size, retries, request cadence, and cache size. Coalesce concurrent requests for the same resource.
- Respect `Retry-After`; do not retry an access challenge repeatedly.
- Enable browser handling by default for dedicated clients, and start the browser only when HTTP encounters an access challenge. Allow callers to disable browser handling explicitly. Default browser sessions and manual live scripts to headless execution; allow headed mode only through an explicit developer debugging option. Never open a visible window automatically after an access failure. Reuse the isolated session and close it when the client closes.
- Keep managed browser binaries within their Playwright dependency under `node_modules`. Install and resolve the same runtime without changing the host application's environment. Download browsers during installation rather than statistics API calls; permit explicit download skipping for offline checks.
- Normalize counters to finite numbers, percentages to the 0–100 scale, durations to seconds, and valid timestamps to UTC ISO strings.
- Preserve missing values as `null`. Preserve real zeroes. Never invent missing statistics or silently split combined playlists.
- Keep round-based operator statistics separate from match-based playlist statistics, and retain the source's coverage limits.
- Distinguish RP and historical MMR; do not infer rank names from hard-coded rating thresholds.
- Reject malformed upstream data with a typed error. Keep raw extra metrics available without changing their meaning.
- Reference `docs/api.md` for public contracts and `docs/integration.md` for endpoint and response mapping details.
