# Install `@tmi-apps/ui` (npm)

`@tmi-apps/ui` is **open source** ([MIT](../LICENSE)). It is published to the **public npm registry** at [registry.npmjs.org](https://www.npmjs.com/) under the `@tmi-apps` scope.

**No** consumer `.npmrc` line is required to redirect `@tmi-apps` to another registry — installs use the default npm registry like any other public scoped package.

## 1. Install the package

```bash
pnpm add @tmi-apps/ui
```

That pulls the **latest** version. **Commit `package.json` and the lockfile** so installs are reproducible.

To **control how far upgrades go**, set an explicit range in `package.json` (for example `^0.8.3`) after checking [Releases](https://github.com/TMI-apps/tmi-ui/releases) or [the package on npm](https://www.npmjs.com/package/@tmi-apps/ui).

## 2. CI (GitHub Actions)

For a typical app, **`pnpm install` / `npm ci` need no token** for `@tmi-apps/ui` — the package is public on npm.

Use a normal dependency install step only:

```yaml
- run: pnpm install --frozen-lockfile
```

**If your repository still has** a root `.npmrc` that sets `@tmi-apps:registry=https://npm.pkg.github.com` **only** for historical GitHub Packages installs, **remove** that line (or the whole file) once every `@tmi-apps` dependency you use comes from npm — otherwise installs may still hit GitHub Packages. See [Consumer setup — Migrating from GitHub Packages](./consumer-setup.md#migrating-from-github-packages).

**Other private GitHub Packages** — If you still pull _other_ private packages from `npm.pkg.github.com`, keep only the mappings you need and ensure `NODE_AUTH_TOKEN` is set where those installs run; `@tmi-apps/ui` itself no longer requires `GH_PACKAGES_READ_TOKEN` or `read:packages` for npm-only consumers.

## 3. Local development

No PAT or `~/.npmrc` token is required for `@tmi-apps/ui` when using the public npm registry.

## 4. Migrating from GitHub Packages

If you previously used GitHub Packages for this library, follow [Consumer setup — Migrating from GitHub Packages](./consumer-setup.md#migrating-from-github-packages).

## 5. TypeScript / Vite

Ensure `tsconfig` uses a modern `moduleResolution` (e.g. `bundler` or `Node16`) so `exports` from the package resolve. Import:

```ts
import { ThumbnailPill, VideoEmbedModal } from "@tmi-apps/ui";
import "@tmi-apps/ui"; // if you rely on MUI theme augmentation from this package
```

## 6. Theme

This library **does not** ship a full MUI `createTheme`. It augments the theme (see [README – Theme integration](../README.md#theme-integration)). Your app must call `createTheme` and can optionally set `theme.thumbnailPill` and `palette.primary.surface` / `surfaceHover` — see the README. Do not redeclare the same `declare module "@mui/material/styles"` keys in the app; the library is the source of those augmentations.

## See also

- [Consumer setup](./consumer-setup.md) — per-app checklist
- [Release flow](./release-flow.md) — how versions are cut and published
