# Integration Notes

Maintainer reference for resource routing and response conversion. Public contracts and request options are defined in [api.md](api.md).

## Resource routing

The transport base is `https://api.tracker.gg/api/v2/r6siege/standard`. Dedicated clients enable the headless Playwright renderer by default. On an HTTP access challenge, it opens `https://r6.tracker.network/r6siege/profile/{platform}/{username}/overview` in its own browser context. `browser: false` disables this handling. Platforms are `ubi`, `psn` and `xbl`; usernames are encoded as one path segment.

| Resource | Path after the base | Query and response details |
| --- | --- | --- |
| Profile and seasons | `profile/{platform}/{username}` | Profile metadata and recorded statistics segments |
| Recent matches | `matches/{platform}/{username}` | `next` query uses the cursor from response metadata |
| Operators | `profile/{platform}/{username}/segments/operator` | `sessionType=all&season=all`, or requested filters |
| Maps | `profile/{platform}/{username}/segments/map` | `sessionType=all&season=all`, or requested filters |
| Daily K/D | `profile/{platform}/{username}/stats/overview/KdRatio` | `view=day`; not exposed by the library |

These resources can change independently of the library. Validate response envelopes and filter attributes before domain conversion. An access challenge can activate a configured renderer, which reuses an isolated session for subsequent requests. Browser access remains dependent on the runtime and network environment.

The renderer defaults to full Chromium's modern headless mode. Derive the context User-Agent from the running browser, retaining its platform and version while using the regular Chrome identifier. Do not hard-code a browser version or import a personal browser session. Wait for the frontend's profile response, preserve denied navigation statuses, and distinguish response timeouts from missing browser runtimes. Discard rejected startup promises before accepting a later request.

Chromium installation and path discovery use `PLAYWRIGHT_BROWSERS_PATH=0` in isolated child processes. The runtime asks the resolved Playwright dependency for its executable path and launches that executable explicitly. This keeps binaries under `node_modules` and works when another library has already imported Playwright with a different cache location. Do not modify the host environment or rely on its current working directory to find dependencies.

## Response mappings

| Area | Mapping notes |
| --- | --- |
| Overview | Identity, levels, aliases, overall totals and lifetime playlist segments |
| Seasons | Recorded playlist totals, current and peak rank, and RP or historical MMR |
| Matches | Requesting player's outcome, map, playlist, timestamp, duration, score, combat metrics, operators and round details |
| Operators | Match and round counters, combat metrics, side, aces and team kills; coverage from Y8S1, excluding Arcade/Event |
| Maps | Match and round counters, attack/defense metrics, headshots and ESR; coverage from Y9S3, excluding Arcade/Event |
| Encounters and Trends | No public methods; require a validated response contract before adding support |

Supported playlists include Ranked, Unranked, Quick Match, Dual Front, Siege Cup, Arcade and Event. Preserve unknown playlist identifiers in `sourcePlaylist`.

The `pvp_quickplay` lifetime segment combines Unranked and Quick Match. Keep it combined, and return `null` for unavailable separate totals. An absent current-season segment also returns `null`; historical totals do not replace it.

The `aces` combat metric and `kills5K` multikill metric can carry different values. The operator table uses the multikill count, so `stats.aces` prioritizes `kills5K`. Keep both original keys in `metrics`.

Match responses can contain several players. Select the requesting player's segment by ID or identifier. Pagination retrieves one page per explicit call.

## Game references

- [Operation Daybreak notes](https://www.ubisoft.com/en-au/game/rainbow-six/siege/news-updates/seasons/daybreak) describe Unranked, Dual Front, Ranked and Siege Cup, along with career and operator statistics. Return only metrics available in the response.
- [Ranked 3.0 update](https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/5fzYRZKVVHqqRkkv3m4MyF/ranked-30-update) describes RP-based progression. Historical seasons can use MMR; retain each season's rank metadata and rating units.
