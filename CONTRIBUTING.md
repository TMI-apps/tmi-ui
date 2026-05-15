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
- **Visibility** — Keep the GitHub repository **public** and the **`@tmi-apps/ui`** package on npm **public** for documented install flows.

Release mechanics: [docs/release-flow.md](./docs/release-flow.md).

## Structure

- One folder per component under `src/<ComponentName>/`.
- Export from `src/index.ts`.
- **Tests:** co-located logic is covered from `tests/**/*.test.{ts,tsx}` (imports use the same `*.js` specifiers as production code).
- MUI theme augmentation lives in `src/theme.ts` (side-effect import from the package entry). Any new token must be declared there and components must fall back if the token is missing.

## Participating

1. Branch from **`main`** (for example `feature/<name>`), commit, open a **PR** to `main`.
2. Keep **CI green** (see the PR checklist below).
3. For user-facing or release-worthy changes, add a **Changeset** on the branch before merge (`pnpm changeset` — semver intent).

External contributors without direct repo access: **fork** and open a PR as usual.

## Adding a component

1. Create **`src/<ComponentName>/`** with the component and a barrel **`index.ts`** where it helps exports.
2. Export the component and public **types** from [`src/index.ts`](./src/index.ts) (same `*.js` import specifiers as the rest of this package).
3. Add tests under **`tests/<Name>.test.tsx`** (or `.ts` for non-React logic).
4. Optional **MUI theme tokens:** extend [`src/theme.ts`](./src/theme.ts) only; components must **degrade gracefully** when tokens are absent.
5. Update [`README.md`](./README.md) (contents table, peers, smoke notes) when consumers need to know.
6. Run **`pnpm changeset`** — typically **minor** for new API surface, **patch** for fixes.

**Visual checks in a real app** are outside this repo: while developing, use **`pnpm link`** or a **`file:`** dependency from a consumer app (or an internal playground) so components run in full app context.

## Rules

- **No imports** from app layers: no data clients, no Airtable/Supabase types, no app path aliases (`@/…` from consumers). This package only uses React, MUI, Emotion, and `react-router-dom` (peer).
- **Peer dependencies** — do not add runtime dependencies on things the app should own; use `peerDependencies` and document in `README.md`.

## Releases

1. Add a **Changeset**: `pnpm changeset` (patch / minor / major).
2. Open a PR to `main`.
3. After merge, the **Version packages** workflow updates `package.json` and `CHANGELOG.md`, then **pushes the `vX.Y.Z` tag** automatically (when a bump commit was created).
4. **Fallback only** — if tagging failed, push the tag manually (see [docs/release-flow.md](docs/release-flow.md#manual-tag-fallback-only)).
5. The **Publish** workflow publishes to **npm** (registry.npmjs.org) on the tag push.

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
