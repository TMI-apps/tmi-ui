# Contributing to `@tmi-apps/ui`

Optional **Cursor** workflow (plan / implement / finish / push / prime): see [.cursor/rules/INDEX.md](.cursor/rules/INDEX.md).

## Licensing and organization

This project is published under the **MIT License** (see [LICENSE](./LICENSE)); copyright **TMI Publishing B.V.**

Maintainers must ensure **organizational intellectual-property approval** applies before releasing substantive changes under this license (employees, contractors, and third-party snippets/fonts/icons must not conflict with MIT distribution).

## Security

- [Security policy](./SECURITY.md) — report vulnerabilities privately; do not post secrets or credentials in issues or discussions.

## Contributions (no CLA)

We **do not** use a Contributor License Agreement (CLA). By submitting a pull request, you agree your contributions are licensed under the **same MIT license** as this repository.

## Maintainer notes — GitHub settings

Align the hosted repository with these expectations:

- **`main`** — branch protection: pull requests required, required status checks (CI).
- **Publish workflow** — restrict **workflow_dispatch** on publish workflows to maintainers where possible.
- **Visibility** — keep the GitHub repository and **`@tmi-apps/ui`** GitHub Packages artifact **public** for documented install flows.

Release mechanics: [docs/release-flow.md](./docs/release-flow.md).

## Structure

- One folder per component under `src/<ComponentName>/`.
- Export from `src/index.ts`.
- **Tests:** co-located logic is covered from `tests/**/*.test.{ts,tsx}` (imports use the same `*.js` specifiers as production code).
- MUI theme augmentation lives in `src/theme.ts` (side-effect import from the package entry). Any new token must be declared there and components must fall back if the token is missing.

## Rules

- **No imports** from app layers: no data clients, no Airtable/Supabase types, no app path aliases (`@/…` from consumers). This package only uses React, MUI, Emotion, and `react-router-dom` (peer).
- **Peer dependencies** — do not add runtime dependencies on things the app should own; use `peerDependencies` and document in `README.md`.

## Releases

1. Add a **Changeset**: `pnpm changeset` (patch / minor / major).
2. Open a PR to `main`.
3. After merge, the **Version packages** workflow updates `package.json` and `CHANGELOG.md`.
4. **Tag** the release commit: `git tag vX.Y.Z && git push origin vX.Y.Z` (see [docs/release-flow.md](docs/release-flow.md)).
5. The **Publish** workflow publishes to GitHub Packages on the tag push.

## PR checklist

**What this is:** reminders for a **pull request** (after your feature commits are on a branch).

**Relation to `finish`:** The Cursor **finish** skill is the same _moment_ as “commit on your machine”: it adds a changeset when needed, runs a staging gate, and suggests the same checks as below before that commit. The PR checklist is the _human_ bar before review—same checks, plus PR-specific items.

Before opening / merging a PR:

- Quality gates (run locally; on Windows prefer separate lines instead of `&&`):
  ```bash
  pnpm type-check
  pnpm type-check:test
  pnpm lint
  pnpm format:check
  pnpm test:run
  pnpm run build
  pnpm verify:pack
  ```
- **README.md** — update when consumers would notice (new props, peers, install/auth, components).
- **CHANGELOG.md** — you normally **do not** hand-edit a new release block on a feature branch. A **Changeset** (`.changeset/*.md`) describes the semver intent; after merge to `main`, **Version packages** updates `CHANGELOG.md` and `package.json` (see [docs/release-flow.md](docs/release-flow.md)). Only touch `CHANGELOG.md` yourself if the team uses a different convention for a one-off.
- **Theme** — new tokens in `src/theme.ts` with safe defaults in components.
