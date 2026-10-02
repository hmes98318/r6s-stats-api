# Development

- Use Node.js 24 LTS and stable dependencies compatible with its supported runtime.
- Build this project as an npm library. Do not introduce an HTTP server unless explicitly requested.
- Use undici for HTTP requests. Keep browser challenge handling controlled by client configuration and isolated from parsing and public API behavior.
- Declare Playwright as a runtime dependency so consumers receive it with the package.
- Prefer established modules and built-in Node.js APIs over additional abstractions. Verify package compatibility before upgrading the compiler or linter together.
- Use modern NodeNext module resolution, strict TypeScript checking, and syntax compatible with native Node.js type stripping. Consult the [Node.js TypeScript documentation](https://nodejs.org/docs/latest-v24.x/api/typescript.html) and [TSConfig reference](https://www.typescriptlang.org/tsconfig/).
- Keep runtime imports explicit and use `.ts` extensions in source. Rewrite relative extensions only when building the distributed JavaScript library.
- Do not use top-level await in the published library. Keep declaration output aligned with the public exports.
- Run the configured type check, ESLint, offline tests, build, and package inspection before completing changes to the library.
- Keep development scripts under `scripts/`, name them in kebab-case, and execute their TypeScript source directly with Node.js.
- Never restore obsolete v1 code or compatibility functions without an explicit requirement.
- Keep API contracts and implementation notes in `docs/`, outside the standards tree.
- Keep README and public API documentation focused on capabilities, setup and usage. Place integration endpoints and response mapping details in `docs/integration.md` for maintainers.
- Keep development documentation focused on workflows and maintenance. Omit dated verification logs, sample-account test results and one-time setup reports.
