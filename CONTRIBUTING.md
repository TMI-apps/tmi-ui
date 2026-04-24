# Contributing to `@tmi-apps/ui`

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

- [ ] `pnpm type-check && pnpm build && pnpm verify:pack` pass locally
- [ ] `README.md` / `CHANGELOG.md` updated if the public API or behavior changed
- [ ] New theme tokens added to `src/theme.ts` with safe defaults in components
