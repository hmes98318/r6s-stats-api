# Version 2 API

## Client and results

Create a reusable `R6StatsClient` with `createClient(options?)`. Background browser handling is enabled by default; creating a client does not launch a browser. All statistics methods accept `(platform, username, ...)`. Supported platforms are `ubi`, `psn`, and `xbl`. Names are validated and encoded as a single path segment.

Each method returns `Promise<TrackerResult<T>>` containing `data` and the metadata fields `source`, `sourceUrl` and `fetchedAt`. `fetchedAt` is the original retrieval time in UTC ISO format, including for cached responses; it does not indicate when game statistics last changed.

| Method                                                | Data                    | Behavior                                                                                 |
| ----------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------- |
| `getOverview(platform, username)`                     | `PlayerOverview`        | Public identity, levels, aliases, lifetime overall and recorded playlist/season segments |
| `getSeasons(platform, username, filters?)`            | `StatsSegment[]`        | Recorded seasons; optional `playlist` and numeric `season` filters                       |
| `getPlaylist(platform, username, playlist, options?)` | `StatsSegment \| null`  | Current season by default; numeric `season` or `'all'` for a lifetime segment            |
| `getRanked(platform, username, options?)`             | `StatsSegment \| null`  | Ranked shortcut                                                                          |
| `getUnranked(platform, username, options?)`           | `StatsSegment \| null`  | Unranked shortcut                                                                        |
| `getQuickMatch(platform, username, options?)`         | `StatsSegment \| null`  | Quick Match shortcut                                                                     |
| `getMatches(platform, username, options?)`            | `MatchPage`             | One page of recent matches, with optional `next` cursor                                  |
| `getOperators(platform, username, filters?)`          | `OperatorStats[]`       | Operators, side, image and normalized match/round metrics                                |
| `getOperator(platform, username, operator, filters?)` | `OperatorStats \| null` | One operator by slug, case-insensitive                                                   |
| `getMaps(platform, username, filters?)`               | `MapStats[]`            | Maps, image and normalized match/round metrics                                           |

The methods are also exported as named functions using a shared HTTP-only client. Use a dedicated client when browser rendering or resource cleanup is needed. Call `close()` on dedicated clients after use. New calls after closing fail with `CLIENT_CLOSED`.

## Statistics

`StatsSegment` contains `type`, `name`, `playlist`, `sourcePlaylist`, `season`, `stats`, `rank`, `peakRank`, and `metrics`.

- `stats` is a fixed set of match counters, round counters, combat counters, K/D, win percentages, headshot percentage, kills per match, and `timePlayedSeconds`.
- Round wins and match wins are separate properties. `stats.winPercentage` describes matches and `stats.roundWinPercentage` describes rounds.
- `metrics` preserves all source metric keys with normalized scalar values, original display values, units and percentiles. It includes extra metrics without expanding the fixed core contract.
- `stats.aces` uses the `kills5K` multikill count when present, otherwise the `aces` metric. Both keys remain in `metrics` and can carry different values.
- A missing or invalid numeric value is `null`; a source-provided zero remains `0`. Percentages use the 0–100 scale. Durations use seconds and may retain fractional seconds.
- Rank information carries the source rank name, image, numeric tier, points, and `pointsType: 'rp' | 'mmr' | null`. Ranks are not calculated from hard-coded thresholds.
- Supported playlist names are `ranked`, `unranked`, `quick-match`, `unranked-and-quick-match`, `dual-front`, `siege-cup`, `arcade`, and `event`. Unknown source playlists remain available as `sourcePlaylist` with `playlist: null`.
- `'all'` uses a recorded lifetime segment. When only combined Unranked/Quick Match totals are available, requesting either separate lifetime segment returns `null`; request `unranked-and-quick-match` to retrieve the combined segment.
- A current season without a recorded segment returns `null`. `getSeasons` returns recorded segments only.

`OperatorStats` and `MapStats` include both the fixed `stats` object and complete `metrics`. Operators declare coverage from `Y8S1`, and maps from `Y9S3`; Arcade and Event are excluded from these sources.

`MatchPage` includes `matches` and `next`. Each match contains its source ID, playlist, map, outcome, timestamp, duration, team round score, operator names and normalized statistics. It selects the requesting player's segment rather than another player's statistics. Pagination fetches one page per explicit call.

Encounters and Trends are not included in version 2.0.0.

## Transport options

Playwright is a required runtime dependency installed with `r6s-stats-api`. Dedicated clients enable headless browser handling by default. The `browser` option customizes or disables it.

- `timeoutMs`: HTTP and browser fetch timeout; default 20,000, valid range 1–120,000.
- `cacheTtlMs`: successful response cache lifetime; default 60,000, valid range 0–3,600,000. Maximum 100 cached responses.
- `minRequestIntervalMs`: serialized upstream request cadence; default 1,000, valid range 0–60,000.
- `retries`: additional transient retries; default 1, maximum 2. `Retry-After` is respected across the client's requests. Delays above 5 seconds are returned to the caller as an error instead of sleeping or retrying early; further uncached requests fail during the cooldown.
- `dispatcher`: optional undici dispatcher, useful for a proxy configured by the caller or an offline MockAgent.
- `browser`: `BrowserOptions` or `false`. Omission enables Playwright rendering with `headless: true`; `false` disables browser handling. Set `headless: false` only for interactive debugging. `channel` defaults to `'chromium'`, using the managed full Chromium runtime with its modern headless mode; `'chrome'` and `'msedge'` select installed vendor browsers.
- `renderer`: an injected `TrackerRenderer` that replaces the default renderer for custom rendering or fabricated tests. It cannot be combined with a `browser` options object.

Requests use undici first. An access challenge starts the client's browser renderer and switches subsequent requests to it unless browser handling is disabled. The renderer reuses an isolated context without the developer's browser profile or saved credentials. Close the client to release its browser. HTTP and browser response bodies are limited to 8 MiB.

The npm install lifecycle downloads Chromium into `playwright-core/.local-browsers` inside the resolved dependency's directory. Browser startup resolves this same installation, including when npm nests dependencies. No browser-path environment variable is required, and the library does not change the application's environment. Browser downloads occur during installation, outside API calls.

Use the default background browser handling with a dedicated client:

```ts
const client = createClient();

try {
    const overview = await client.getOverview('ubi', 'waifu_-.');
    console.log(overview.data.player);
} finally {
    await client.close();
}
```

For interactive debugging, explicitly create the client with `createClient({browser: {headless: false}})`. Access failures never switch a background browser into a visible window automatically. Headless execution can still encounter access challenges; persistent failures return `ACCESS_DENIED`.

Browser startup preserves a denied navigation's HTTP status. A profile response timeout after a successful navigation returns `TIMEOUT`; a missing browser runtime returns `BROWSER_UNAVAILABLE`. Failed startup is discarded so a later call can create a fresh session.

## Errors

Failures throw `R6StatsError`, with `code`, nullable `status`, and nullable `retryAfterMs`:

`INVALID_ARGUMENT`, `PLAYER_NOT_FOUND`, `ACCESS_DENIED`, `RATE_LIMITED`, `UPSTREAM_ERROR`, `PARSE_ERROR`, `TIMEOUT`, `RESPONSE_TOO_LARGE`, `BROWSER_UNAVAILABLE`, or `CLIENT_CLOSED`.

Errors do not include complete upstream bodies or session headers. If a site challenge persists in the configured browser, return `ACCESS_DENIED` instead of fabricating data or retrying indefinitely.
