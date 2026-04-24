# Install `@tmi-apps/ui` (GitHub Packages)

`@tmi-apps/ui` is published to the GitHub org registry at `https://npm.pkg.github.com` under the `@tmi-apps` scope.

## 1. Point pnpm at the registry (committed in each app)

Add a root `.npmrc` in the consumer repository:

```ini
@tmi-apps:registry=https://npm.pkg.github.com
```

## 2. Authenticate

### CI (GitHub Actions, same org)

Use the default `GITHUB_TOKEN` with `packages: read`:

```yaml
permissions:
  contents: read
  packages: read

jobs:
  build:
    steps:
      - run: pnpm install --frozen-lockfile
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Local development

Create a [classic personal access token](https://github.com/settings/tokens) with **`read:packages`**. In your user `~/.npmrc` (do not commit tokens):

```ini
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

Set `GITHUB_PACKAGES_TOKEN` in your environment, or inline the token (keep it secret).

## 3. Install the package

```bash
pnpm add @tmi-apps/ui@^0.3.0
```

(Use the latest published version from this repo’s [Releases](https://github.com/TMI-apps/tmi-ui/releases) or the **Packages** sidebar.)

## 4. TypeScript / Vite

Ensure `tsconfig` uses a modern `moduleResolution` (e.g. `bundler` or `Node16`) so `exports` from the package resolve. Import:

```ts
import { ThumbnailPill, VideoEmbedModal } from "@tmi-apps/ui";
import "@tmi-apps/ui"; // if you rely on MUI theme augmentation from this package
```

## 5. Theme

This library **does not** ship a full MUI `createTheme`. It augments the theme (see [README – Theme integration](../README.md#theme-integration)). Your app must call `createTheme` and can optionally set `theme.thumbnailPill` and `palette.primary.surface` / `surfaceHover` — see the README. Do not redeclare the same `declare module "@mui/material/styles"` keys in the app; the library is the source of those augmentations.

## See also

- [Consumer setup](./consumer-setup.md) — per-app checklist
- [Release flow](./release-flow.md) — how versions are cut
