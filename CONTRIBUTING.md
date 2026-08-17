# Contributing to `@tmi-packages/ui`

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
- **Visibility** — Keep the GitHub repository **public** and the **`@tmi-packages/ui`** package on npm **public** for documented install flows.

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
5. Update [`README.md`](./README.md) (contents table, peers, smoke notes, **Integration ledger** for affected components) when consumers need to know.
6. Run **`pnpm changeset`** — typically **minor** for new API surface, **patch** for fixes; see [Public API and semver](#public-api-and-semver) if the change might alter existing call sites or defaults.

**Consumer integration:** process skill lives in [`.agents/skills/adopt-from-tmi-ui/`](./.agents/skills/adopt-from-tmi-ui/SKILL.md) (published in the npm tarball). Maintainer workflow skills stay under `.cursor/skills/`. **New or changed public export → add/update the matching Integration ledger row** in README. If README exceeds ~500 lines, split ledgers to `docs/ledgers/` (link from README) in a follow-up.

**Visual checks in a real app** are outside this repo: while developing, use **`pnpm link`** or a **`file:`** dependency from a consumer app (or an internal playground) so components run in full app context.

## Rules

- **No imports** from app layers: no data clients, no Airtable/Supabase types, no app path aliases (`@/…` from consumers). Runtime stays on declared **peerDependencies** (React, MUI, Emotion, router, TanStack table/virtual, dnd-kit).
- **Peer dependencies** — do not add runtime dependencies on things the app should own; use `peerDependencies` and document in `README.md`.
- **Public API** — only what `src/index.ts` exports (and documented theme tokens) is a consumer contract. Keep internals unexported. Prefer optional props, slots, or new exports over required new config. Consumer how-to for the table lives in [`README.md` § TMI table](./README.md#tmi-table).

## Public API and semver

This follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Extending an existing component is **not** breaking if old call sites and defaults still work.

| Changeset | Use when                                                        | Typical examples                                                                                                                                                        |
| --------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **patch** | Fix; no intended API or default change                          | Bugfix, docs-only SSOT updates, internal refactor with identical public behavior                                                                                        |
| **minor** | Additive; existing usage still type-checks and behaves the same | New component; new **optional** prop; new export; new theme token with a fallback; `@deprecated` on an old path while it still works                                    |
| **major** | Existing consumer code can fail at compile or runtime           | Rename/remove export or prop; optional → required; change a default apps already rely on; incompatible TypeScript shape; peer **major** bump without dual-range support |

**Do not** ship a silent default flip for new behavior. Prefer an opt-in flag (default off) in a **minor**, then change the default (or remove the old path) in the next **major**. Deprecate in a minor; remove in a major. Coordinate majors with consuming apps before merge.

Adding fields to **input** props is usually a minor. Changing **output** / callback payload shapes, or types consumers exhaustively switch on, often needs a major.

Consumers typically depend on `^1.x` plus a lockfile: they take patches and minors when **they** update; they do **not** take `2.0.0` until they bump the range. See [docs/consumer-setup.md](./docs/consumer-setup.md).

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
