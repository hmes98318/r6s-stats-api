# Testing

The user-confirmed policy is intentionally small and uses test doubles.

| Surface                              | Requirement                     | Depth                                                                   | Dependency strategy                              |
| ------------------------------------ | ------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------ |
| Data cleaning and public API basics  | Required                        | Custom: simple tests of core successful behavior and important failures | Fabricated data                                  |
| HTTP protection, caching, and errors | Required                        | Custom: a small set of basic regression tests                           | Mock HTTP and renderer                           |
| Live upstream integration            | Not required in automated tests | Manual scripts only                                                     | Real requests when explicitly run by a developer |

- Use the built-in Node.js test runner. Disable real network access in HTTP mocks.
- Unit tests and CI must never make live upstream requests or launch a browser.
- Add or update only the small tests relevant to materially changed behavior; do not introduce coverage targets or exhaustive test matrices.
- Use fabricated fixtures in automated tests. Do not commit live player captures as test fixtures.
- Manual scripts must call the public library API, run directly as `.ts`, and remain outside test discovery and CI.
- Cache shared pages within a manual run and stop a live run promptly on access or rate-limit errors.
- Do not weaken type checking, linting, build, or packaging validation to satisfy the deliberately limited test policy.
