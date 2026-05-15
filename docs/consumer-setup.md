# Consumer setup checklist

Use this when adding `@tmi-apps/ui` to **your application** (or your team’s app template / boilerplate).

## 1. Preflight — peer major versions

Align these in the app before adding the dependency (see `package.json` peer ranges):

- `react` / `react-dom` ^19
- `@mui/material` / `@mui/icons-material` ^7
- `@emotion/react` / `@emotion/styled` ^11
- `react-router-dom` ^7 (if you use `ThumbnailPill` with `to=`)

## 2. Registry

**Default npm registry** — `@tmi-apps/ui` is **public** on [npm](https://www.npmjs.com/package/@tmi-apps/ui). You **do not** need a committed `.npmrc` that maps `@tmi-apps` to GitHub Packages.

## 3. CI

Use an ordinary install step (no `GH_PACKAGES_READ_TOKEN` required for this package):

```yaml
- run: pnpm install --frozen-lockfile
```

## 4. Install

```bash
pnpm add @tmi-apps/ui
```

(Same as [installation.md § Install](./installation.md#1-install-the-package): unpinned add = latest; then commit lockfile. Pin a `^x.y.z` range in `package.json` when **your** team wants upgrade boundaries — see Releases on the tmi-ui repo.)

## 5. MUI types — no duplicate augmentations

If the app had local `declare module "@mui/material/styles"` blocks for `thumbnailPill` or `primary.surface` / `surfaceHover`, **remove** those duplicates. Import the library for side effects where you bootstrap MUI types (e.g. next to your existing MUI type imports):

```ts
import "@tmi-apps/ui";
```

## 6. Vendored copies

If the app had a local copy of `ThumbnailPill` / `VideoEmbedModal`, delete it and import from `@tmi-apps/ui`.

## 7. Verify

- `pnpm type-check && pnpm build`
- Quick UI: render `ThumbnailPill` and a `VideoEmbedModal` on a dev route.

## Boilerplate

Team templates should list `@tmi-apps/ui` in `package.json` with whatever semver range template maintainers choose (updated when **they** bump the dependency), plus a committed lockfile — not a version baked into **this** documentation.

## Migrating from GitHub Packages

If the app previously installed `@tmi-apps/ui` from GitHub Packages, update as follows:

1. **Remove** from the app root `.npmrc` the line `@tmi-apps:registry=https://npm.pkg.github.com` **if** it was only needed for `@tmi-apps/ui`. If you still use **other** packages from that registry, keep the file but adjust scope/registry lines so `@tmi-apps/ui` resolves from npm (often: drop the global `@tmi-apps` override, or rely on individual package lock entries).
2. **Remove** the `GH_PACKAGES_READ_TOKEN` secret (and `NODE_AUTH_TOKEN` wiring for install) **if** it was only used so CI could read `@tmi-apps/ui` from GitHub Packages.
3. Run **`pnpm install`** and refresh the lockfile; run **`pnpm build`** and tests.

## See also

- [installation.md](./installation.md) — install details and CI edge cases
