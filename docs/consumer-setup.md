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

In every workflow that runs `pnpm install` / `npm ci`, set:

```yaml
permissions:
  packages: read

env:
  NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

on the `pnpm install` step (same pattern as in [installation.md](./installation.md)).

## 4. Install

```bash
pnpm add @tmi-apps/ui@^0.3.0
```

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

New apps created from the boilerplate should ship with the `.npmrc` line above and a pinned `^0.3.0` (or current) version so `git clone` + `pnpm install` works after the developer sets `~/.npmrc` for local installs.
