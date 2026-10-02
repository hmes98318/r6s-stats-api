# r6s-stats-api

A typed API client for Rainbow Six Siege player statistics. Retrieve player overviews, playlist and season totals, recent matches, operator performance and map statistics through a consistent API.

Requires **Node.js 24.15.0 or newer**. Platforms are `ubi`, `psn`, and `xbl`.

## Install

```sh
npm install r6s-stats-api
```

Playwright is a required runtime dependency and is installed automatically with this package. Installation downloads Chromium into its dependency directory under `node_modules`. Browser access uses this managed runtime without requiring a browser-path environment variable.

## Example

```ts
import {createClient} from 'r6s-stats-api';

const client = createClient();

/** Retrieve a player and release its browser resources after use. */
async function main(): Promise<void> {
    try {
        const overview = await client.getOverview('ubi', 'waifu_-.');
        console.log(overview.data.player);
        console.log(overview.data.overall?.stats);

        const ranked = await client.getRanked('ubi', 'waifu_-.', {
            season: 33,
        });
        console.log(ranked.data?.rank);

        const ace = await client.getOperator('ubi', 'waifu_-.', 'ace');
        console.log(ace.data?.stats);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
```

The example is TypeScript and runs directly with `node example.ts` in an ESM project. JavaScript callers omit the type annotations. Node.js 24 CommonJS callers can use `const {createClient} = require('r6s-stats-api');`.

`createClient()` enables background browser handling by default. Requests use HTTP first and start the browser only when an access challenge requires it. Set `browser: {headless: false}` only for interactive debugging, or `browser: false` for HTTP-only access. Reuse the client across calls and close it after the work is complete. Named functions such as `getOverview(platform, username)` use a shared HTTP-only client.

## Functions

| Function                                              | Returns in `result.data`                                                               |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `getOverview(platform, username)`                     | Identity, levels, aliases, overall statistics, lifetime playlists and recorded seasons |
| `getSeasons(platform, username, filters?)`            | Recorded season statistics, optionally filtered by playlist or season ID               |
| `getPlaylist(platform, username, playlist, options?)` | Current-season, selected-season or lifetime playlist statistics                        |
| `getRanked(platform, username, options?)`             | Ranked statistics                                                                      |
| `getUnranked(platform, username, options?)`           | Unranked statistics                                                                    |
| `getQuickMatch(platform, username, options?)`         | Quick Match statistics                                                                 |
| `getMatches(platform, username, options?)`            | One match page with a next-page cursor                                                 |
| `getOperators(platform, username, filters?)`          | Operator match/round statistics, side and image                                        |
| `getOperator(platform, username, operator, filters?)` | One operator or `null`                                                                 |
| `getMaps(platform, username, filters?)`               | Map statistics and image                                                               |

All functions are available on a dedicated client and as named HTTP-only exports. Each returns `{source, sourceUrl, fetchedAt, data}`. Complete options, types, filtering, errors and data semantics are documented in [the API reference](docs/api.md).

## Data conventions

- Counters and ratios are numbers, percentages use the 0–100 scale, durations use seconds, and timestamps use UTC ISO strings.
- Missing statistics are `null`; recorded zeroes remain `0`.
- Match wins and round wins remain separate. RP and historical MMR retain their units and rank metadata.
- Lifetime **Unranked + Quick Match** totals stay combined. Retrieve them with `getPlaylist(platform, username, 'unranked-and-quick-match', {season: 'all'})`; unavailable separate lifetime totals return `null`.
- Playlist methods default to the current season. No recorded current-season segment returns `null`; historical data is not substituted.
- Operator data covers Y8S1 onward, and map data covers Y9S3 onward. Both exclude Arcade and Event.
- Additional metrics remain available in `metrics` with normalized values, units and display text.

Encounters and Trends are not supported.

## Errors and request behavior

```ts
import {getOverview, R6StatsError} from 'r6s-stats-api';

getOverview('ubi', 'waifu_-.').catch((error: unknown) => {
    if (error instanceof R6StatsError) {
        console.error(error.code, error.status, error.retryAfterMs);
    }
});
```

Requests have timeouts, an 8 MiB response limit, a bounded cache, request coalescing and a default one-second cadence. Transient retries are limited and respect `Retry-After`. An access challenge switches the client to its isolated browser renderer unless browser handling is disabled. Call `close()` to release the browser and cached data.

## Development

Use the latest Node.js 24 LTS release for repository development.

```sh
npm ci
npm run check
```

Unit tests use fabricated fixtures and disable real network access. Run a manual live check directly from TypeScript:

```sh
node scripts/test-live.ts ubi "waifu_-."
```

Manual live scripts use a headless browser and are excluded from unit tests and CI. Pass `--headed` only for interactive debugging. See [development documentation](docs/development.md) for commands, configuration and project structure. Coding style follows the Google TypeScript Style Guide with four-space indentation, semicolons, JSDoc comments, ESLint and `.editorconfig`.

## Breaking changes from v1

The implementation was replaced. The former `general`, `casual`, `rank`, `deathmatch` and `operator` functions, `pc` platform alias, string-formatted counters and handwritten declaration files are removed. Use the named functions and generated types. No v1 compatibility layer is included.

## License

[MIT](LICENSE). Rainbow Six Siege is a Ubisoft trademark. This library is not endorsed by Ubisoft.
