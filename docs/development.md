# Development

## Setup and commands

The published package requires Node.js 24.15.0 or newer. Use the latest Node.js 24 LTS release and npm for development and CI. Dependency versions are defined in [package.json](../package.json); keep TypeScript within the supported typescript-eslint compatibility range when upgrading the toolchain.

```sh
npm ci
npm run check
```

`npm run check` runs type checking, ESLint code and style checks, offline tests, and the library build. CI runs the same checks and inspects the package. Run `npm run build` before invoking `npm pack` or `npm publish` manually.

Playwright is a required runtime dependency. The `postinstall` lifecycle installs full Chromium with Playwright's hermetic mode (`PLAYWRIGHT_BROWSERS_PATH=0`). Binaries are owned by the resolved `playwright-core` dependency under `node_modules`, so reinstalling dependencies also recreates the browser installation. The install process fails if the browser download fails. CI sets `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` because offline checks use test doubles. npm installations that disable lifecycle scripts must run the package's install lifecycle before using its managed browser.

Playwright is pinned to `1.62.1`. The `1.63.0` downloader can abort before IPv4 fallback on networks with unreachable IPv6, as described in [the upstream issue](https://github.com/microsoft/playwright/issues/42769). Dependency upgrades include a fresh installation and managed headless browser startup check.

| Command | Purpose |
| --- | --- |
| `npm run typecheck` | Validate source, script and test types |
| `npm run lint` | Check JavaScript and TypeScript code and formatting |
| `npm run lint:fix` | Apply supported ESLint fixes |
| `npm test` | Run the small fabricated-data test suite |
| `npm run build` | Generate the distributable library |
| `npm run install:browser` | Install or restore the managed Chromium runtime |
| `npm pack --dry-run` | Inspect package contents |

Use an editor that supports `.editorconfig` for four-space indentation, UTF-8, LF line endings and whitespace settings. Code comments use JSDoc, and statements use semicolons. Markdown prose remains unwrapped.

## Structure and data flow

| Location | Responsibility |
| --- | --- |
| `src/client.ts` | Public functions, argument validation and resource selection |
| `src/transport.ts` | HTTP requests, bounded retries, request cadence, cache and coalescing |
| `src/browser.ts` | Isolated Playwright sessions and managed executable resolution |
| `install.mjs` | Published npm lifecycle entry for local browser installation |
| `src/normalize.ts` | Untrusted JSON validation and scalar normalization |
| `src/parsers.ts` | Response-to-domain conversion |
| `src/types.ts` | Public data contracts |
| `test/` | Fabricated offline fixtures and tests |
| `scripts/` | Manually invoked live checks |
| `docs/api.md` | API behavior, options and data semantics |
| `docs/integration.md` | Maintainer reference for routing and response mappings |
| `docs/standards/` | Development rules routed by `AGENTS.md` |

The client validates arguments and retrieves a resource through the transport. The transport handles access, caching and request limits; parsers convert validated responses into public types. Overview, playlist and season functions share the same profile retrieval. Cached responses retain their retrieval time, and caller mutations cannot alter cached data.

Dedicated clients prepare a headless browser renderer by default. HTTP requests run first, and an access challenge starts the isolated browser session. `browser: false` disables this handling; an injected renderer replaces the default. The shared client for named exports explicitly disables browser handling so it has no persistent browser resources to close.

Only `src/` is compiled to `dist/`, producing JavaScript, type declarations and source maps. Scripts and tests execute TypeScript directly with Node.js's native type stripping. The npm package includes the built library and public reference documentation. Fixtures, live scripts, local captures and maintainer integration notes stay in the repository.

The small npm lifecycle entry uses JavaScript because native TypeScript stripping is unavailable for dependencies inside `node_modules`. It invokes the resolved Playwright CLI with hermetic mode in a child process. Runtime path discovery uses Playwright's public `chromium.executablePath()` in the same isolated environment, then supplies that path to the launcher. Keep the host process environment unchanged; its Playwright imports may already be initialized.

When changing installation behavior, validate a packed npm dependency installation as well as repository scripts. Include the lifecycle entry in the package, keep Chromium binaries out of the tarball, and verify both module export styles without loading a browser.

## Offline tests

`npm test` discovers only `test/*.test.ts`. Tests use fabricated fixtures and an undici MockAgent with network access disabled. HTTP-only tests disable browser handling with `browser: false`. Browser startup and default-client fallback tests use Node.js module mocks for Playwright and browser-path subprocesses; the test command enables the required module-mocking flag. Unit tests and CI do not make live integration requests or launch a browser. Follow the testing scope and change obligations in `docs/standards/r6s-stats-api/testing.md`, routed by root `AGENTS.md`.

## Release publishing

The [npm publishing workflow](../.github/workflows/npm-publish.yml) runs on `release.created`. It runs `npm run check`, then builds and publishes through npm Trusted Publishing (OIDC). Draft releases do not trigger this event.

Update the version in `package.json` and `package-lock.json` before creating the release tag. The npm trusted publisher must use `npm-publish.yml` with `Allow npm publish` enabled.

## Manual live checks

Live scripts call public API functions, reuse a client during each run, and close it in `finally`. They are separate from unit tests and CI. The helper defaults to `ubi` / `waifu_-.` and uses `createClient()` without browser settings. Pass `--headed` only for interactive debugging; it supplies `headless: false`, and the flag can appear before or after the account arguments.

```sh
node scripts/test-scraping.ts ubi "waifu_-."
node scripts/test-cleaning.ts ubi "waifu_-."
node scripts/test-filters.ts ubi "waifu_-."
node scripts/test-live.ts ubi "waifu_-."
```

To show the browser while debugging, explicitly run:

```sh
node scripts/test-scraping.ts ubi "waifu_-." --headed
```

| Script | Purpose |
| --- | --- |
| `test-scraping.ts` | Retrieve one overview and print result metadata |
| `test-cleaning.ts` | Check normalized values across the public API |
| `test-filters.ts` | Check season and playlist filters and one pagination step |
| `test-live.ts` | Exercise the main functions and print compact summaries |

Run the script relevant to the change. Stop on access or rate-limit failures. Keep disposable captures under ignored `.local/` and use fabricated data for committed fixtures.
