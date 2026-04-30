# Consumer setup checklist

Use this when adding `@tmi-apps/ui` to a TMI app (e.g. project-alpha, MILA, lesmateriaal) or the boilerplate.

## 1. Preflight — peer major versions

Align these in the app before adding the dependency (see `package.json` peer ranges):

- `react` / `react-dom` ^19
- `@mui/material` / `@mui/icons-material` ^7
- `@emotion/react` / `@emotion/styled` ^11
- `react-router-dom` ^7 (if you use `ThumbnailPill` with `to=`)

## 2. Registry

Add committed `.npmrc` at the app root:

```ini
@tmi-apps:registry=https://npm.pkg.github.com
```

## 3. CI — token for install

`@tmi-apps/ui` is published from **tmi-ui**, not from your app repo. `**GITHUB_TOKEN` in your app’s workflows usually cannot read that package** (401/403). Follow **[installation.md § CI](./installation.md#2-authenticate)**: store a classic PAT with `read:packages` (and SSO authorization if needed) as `**GH_PACKAGES_READ_TOKEN`**, then:

```yaml
- run: pnpm install --frozen-lockfile
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GH_PACKAGES_READ_TOKEN }}
```

Only if your workflow runs in **the same repo that owns the package** (unusual for app consumers) can you use `secrets.GITHUB_TOKEN` with `permissions: packages: read` instead — see installation.md.

## 4. Install

```bash
pnpm add @tmi-apps/ui
```

(Same as [installation.md § Install](./installation.md#3-install-the-package): unpinned add = latest; then commit lockfile. Pin a `^x.y.z` range in `package.json` only when **your** team wants upgrade boundaries — see Releases on the tmi-ui repo.)

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

New apps created from the boilerplate should ship with the `.npmrc` line above and `@tmi-apps/ui` listed in `package.json` with whatever semver range the template maintainers choose (updated when **they** bump the dependency), plus a committed lockfile — not a version baked into **this** documentation.