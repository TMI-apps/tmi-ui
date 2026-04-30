# Install `@tmi-apps/ui` (GitHub Packages)

`@tmi-apps/ui` is published to the GitHub org registry at `https://npm.pkg.github.com` under the `@tmi-apps` scope.

## 1. Point pnpm at the registry (committed in each app)

Add a root `.npmrc` in the consumer repository:

```ini
@tmi-apps:registry=https://npm.pkg.github.com
```

## 2. Authenticate

### CI (GitHub Actions)

**Consumer app in a different repository** — this is the normal case for `@tmi-apps/ui`: the package is built and published from [TMI-apps/tmi-ui](https://github.com/TMI-apps/tmi-ui), while your app (e.g. project-alpha-app) lives in its own repo. The workflow’s default **`GITHUB_TOKEN` is scoped only to that workflow’s repository**. It does **not** grant read access to packages whose publication is tied to another repo, so `pnpm install` / `npm ci` often fails with **401** or **403** when pulling `@tmi-apps/ui`.

Use a **repository or org secret** that holds a token able to read GitHub Packages for your org, conventionally named `GH_PACKAGES_READ_TOKEN`:

1. Create a [classic personal access token](https://github.com/settings/tokens) with at least **`read:packages`**. If auth still fails, add scope **`repo`** (or whatever your org requires) and, for SAML-enabled orgs, [**authorize the PAT for SSO**](https://docs.github.com/en/enterprise-cloud@latest/authentication/authenticating-with-saml-single-sign-on/authorizing-a-personal-access-token-for-use-with-saml-single-sign-on).
2. In the **consumer** repo: **Settings → Secrets and variables → Actions** → add `GH_PACKAGES_READ_TOKEN` (value = the PAT).
3. On the step that installs dependencies:

```yaml
- run: pnpm install --frozen-lockfile
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GH_PACKAGES_READ_TOKEN }}
```

Do not commit tokens. Relying on `GITHUB_TOKEN` alone is **not** enough for this cross-repo install pattern.

**CI in the same repository that owns the package** (e.g. workflows inside `tmi-ui` that only install public/dev deps, or a monorepo where the package and consumer share one repo and the token can read that package). Then `GITHUB_TOKEN` with `packages: read` can be sufficient:

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
pnpm add @tmi-apps/ui
```

That pulls the **latest** version your token can read. **Commit `package.json` and the lockfile** so installs are reproducible.

To **control how far upgrades go**, set an explicit range in `package.json` yourself (for example `^0.8.3` to accept patches/minors on the 0.8 line) after checking [Releases](https://github.com/TMI-apps/tmi-ui/releases) or the repo **Packages** tab. Those numbers live in the **consumer app**, not in this doc — you should **not** have to edit these markdown files every time `tmi-ui` ships a new version.

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
