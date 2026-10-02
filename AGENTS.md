# AGENTS.md

## Mandatory Instructions

Before making changes, read and follow:

- `docs/standards/common/development-guidelines.md`

Treat it as mandatory repository-wide guidance.

For application-specific changes, also follow the closest applicable `AGENTS.md`:

- The repository root is the `r6s-stats-api` application. Read `docs/standards/r6s-stats-api/development.md` and `docs/standards/r6s-stats-api/coding-style.md` for implementation work.
- Also read `testing.md` for tests, `data.md` for fetching or cleaning, and `security-privacy.md` for browser or network changes, all under `docs/standards/r6s-stats-api/`.

## Hard Constraints

- Keep changes within the requested scope and preserve the repository license.
- Use en-US for development documentation and commit messages.

## Documentation Skill Prerequisite

The [project-standards skill](https://github.com/hmes98318/project-standards) governs how agents write and maintain development documentation.

Before creating or updating development documentation, including `AGENTS.md` and `docs/standards/`, agents must:

1. Ensure `project-standards` is installed and available to the current agent. Automatically install it from the official repository if it is missing.
2. Verify the installation against the official repository's latest default-branch revision. Automatically update outdated installations, including the skill's templates and scripts.
3. Read and apply the current `SKILL.md` before editing documentation.

Agents must perform installation and updates themselves. Do not begin documentation edits until the skill is available and confirmed current. If installation, updating, or freshness verification fails, report the blocker and keep documentation edits pending.

## Development Documentation

- Store development documentation under `docs/`.
- Review relevant documentation before development.
- For new features or changes to documented architecture, design, or behavior, update the relevant documentation first, then implement according to it.
- Prefer updating existing documentation over creating duplicate or conflicting documents.
- Keep documentation consistent with the current implementation, concise, and focused on information needed for development and maintenance.
- Write project development documentation in `en-US`.
- Keep all `AGENTS.md` files and files under `docs/standards/` in en-US.

## Instruction Precedence

Follow instructions in this order:

1. Explicit task requirements.
2. The closest applicable `AGENTS.md`.
3. This root `AGENTS.md`.
4. Documents referenced by the applicable `AGENTS.md`.
5. Existing implementation patterns that do not conflict with the above.

Scoped `AGENTS.md` files may specialize local rules but must not weaken repository-wide hard constraints.

## Commits

Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for all commit messages.

Write commit messages in `en-US` while keeping Conventional Commits types and scopes in English.
