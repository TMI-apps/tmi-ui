# Contributing to `@tmi-apps/ui`

Optional **Cursor** workflow (plan / implement / finish / push / prime): see [.cursor/rules/INDEX.md](.cursor/rules/INDEX.md).

## Structure

- One folder per component under `src/<ComponentName>/`.
- Export from `src/index.ts`.
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
**Relation to `finish`:** The Cursor **`finish`** skill is the same *moment* as “commit on your machine”: it adds a changeset when needed, runs a staging gate, and suggests the three checks below before that commit. The PR checklist is the *human* bar before review—same checks, plus PR-specific items.

Before opening / merging a PR:

- Quality gates (run locally; on Windows you can run these as three separate commands if `&&` gives trouble):

  ```bash
  pnpm type-check
  pnpm run build
  pnpm verify:pack
  ```

- **README.md** — update when consumers would notice (new props, peers, install/auth, components).
- **`CHANGELOG.md`** — you normally **do not** hand-edit a new release block on a feature branch. A **Changeset** (`.changeset/*.md`) describes the semver intent; after merge to `main`, **Version packages** updates `CHANGELOG.md` and `package.json` (see [docs/release-flow.md](docs/release-flow.md)). Only touch `CHANGELOG.md` yourself if the team uses a different convention for a one-off.
- **Theme** — new tokens in `src/theme.ts` with safe defaults in components.