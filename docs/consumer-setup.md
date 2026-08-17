# Consumer setup checklist

Use this when adding `@tmi-packages/ui` to **your application** (or your team’s app template / boilerplate).

## 1. Preflight — peer major versions

Align these in the app before adding the dependency (see `package.json` peer ranges):

- `react` / `react-dom` ^19
- `@mui/material` / `@mui/icons-material` ^7
- `@emotion/react` / `@emotion/styled` ^11
- `react-router-dom` ^7 (if you use `ThumbnailPill` with `to=`)
- `@tanstack/react-table` ^8.21 (TMI table satellites / column helpers)
- `@tanstack/react-virtual` 3.13.x and `@dnd-kit/*` (needed when you adopt the grid; already peer-declared)

For the **TMI table**, see **[README — TMI table](../README.md#tmi-table)** (`createTmiTableTheme`, Vite `optimizeDeps.include`, overlay z-index, `serverInfinite`).

## 2. Registry

**Default npm registry** — `@tmi-packages/ui` is **public** on [npm](https://www.npmjs.com/package/@tmi-packages/ui). You **do not** need a committed `.npmrc` that maps **`@tmi-packages`** (or any scope) to GitHub Packages for this package.

## 3. CI

Use an ordinary install step (no `GH_PACKAGES_READ_TOKEN` required for this package):

```yaml
- run: pnpm install --frozen-lockfile
```

## 4. Install

```bash
pnpm add @tmi-packages/ui
```

(Same as [installation.md § Install](./installation.md#1-install-the-package): unpinned add = latest; then commit lockfile. Pin a `^x.y.z` range in `package.json` when **your** team wants upgrade boundaries — see Releases on the tmi-ui repo.)

`^1.2.0` allows later **1.x** patches and minors (new optional API, bugfixes) and **does not** install **2.0.0**. A lockfile keeps the exact version until the app runs an update. Majors require an explicit range bump and a compile/UI pass. Library classification rules: [CONTRIBUTING.md — Public API and semver](../CONTRIBUTING.md#public-api-and-semver).

## 5. MUI types — no duplicate augmentations

If the app had local `declare module "@mui/material/styles"` blocks for `thumbnailPill` or `primary.surface` / `surfaceHover`, **remove** those duplicates. Import the library for side effects where you bootstrap MUI types (e.g. next to your existing MUI type imports):

```ts
import "@tmi-packages/ui";
```

## 6. Vendored copies

If the app had a local copy of `ThumbnailPill` / `VideoEmbedModal`, delete it and import from `@tmi-packages/ui`.

## 7. Verify

- `pnpm type-check && pnpm build`
- Quick UI: render `ThumbnailPill` and a `VideoEmbedModal` on a dev route.

## Boilerplate

Team templates should list `@tmi-packages/ui` in `package.json` with whatever semver range template maintainers choose (updated when **they** bump the dependency), plus a committed lockfile — not a version baked into **this** documentation.

## Migrating from `@tmi-apps/ui` or GitHub Packages

The published npm name is **`@tmi-packages/ui`** (scope **`@tmi-packages`**, matching the npm org).

If the app used the old name **`@tmi-apps/ui`** or installed from **GitHub Packages**:

1. In **`package.json`**, depend on **`@tmi-packages/ui`** instead of `@tmi-apps/ui`.
2. Replace imports: `from "@tmi-apps/ui"` → `from "@tmi-packages/ui"` and `import "@tmi-apps/ui"` → `import "@tmi-packages/ui"`.
3. **Remove** from the app root `.npmrc` the line **`@tmi-apps:registry=https://npm.pkg.github.com`** (legacy) **if** nothing else needs it. If you still use **other** packages from GitHub Packages, keep only the mappings you need.
4. **Remove** the `GH_PACKAGES_READ_TOKEN` secret (and install `NODE_AUTH_TOKEN`) **if** it was only used for this library’s **old** GitHub Packages install.
5. Run **`pnpm install`**, refresh the lockfile, **`pnpm build`**, and tests.

## See also

- [installation.md](./installation.md) — install details and CI edge cases
- [README — TMI table](../README.md#tmi-table) — grid public API
