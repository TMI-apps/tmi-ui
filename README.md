# @tmi-apps/ui

Shared UI primitives for TMI apps (same boilerplate stack: React, MUI, Vite).

## Versions

### 0.1.2

- Tooltip no longer sticks: `ThumbnailPillTooltipWrap` now uses `disableInteractive`, `enterDelay` / `enterNextDelay` of 600 ms, and `pointerEvents: "none"` on both the tooltip and its popper. Matches the behaviour of dense table row action icons — moving the pointer from the pill onto the tooltip closes it instead of keeping it open.

### 0.1.1

- Dark-mode contrast: component now reads optional `theme.palette.primary.surface` / `surfaceHover` tokens and falls back to `alpha(primary.main, 0.08 / 0.12)` if they're not set. Consumers who want the boosted dark-mode background should define these tokens in their theme.
- Circle symmetry: when a thumbnail / placeholder circle is rendered on a side, that side's padding is `2 px` so the circle is equidistant from the pill's top, bottom and outer edge.
- Bare-text padding: when a side has no circle and (for the right side) no `rightSlot`, padding on that side is `12 px` so text doesn't butt against the edge. Sides with a `rightSlot` keep the original `4 px` default.

### 0.1.0 — `ThumbnailPill`

Horizontal pill with optional thumbnail, title, right slot, tooltip, and optional navigation via `react-router-dom` `Link` when `to` is set.

### Theme

The component reads sizing from `theme.thumbnailPill`. Importing this package registers MUI `Theme` / `ThemeOptions` augmentation for `thumbnailPill`.

Default dimensions are inlined in the component if the theme omits `thumbnailPill`.

### Peer dependencies

Align versions with your app (same majors as the starter):

- `react`, `react-dom`
- `@mui/material`
- `@emotion/react`, `@emotion/styled`
- `react-router-dom` (used when `to` is passed)

## Use in this monorepo

The app depends on `workspace:*`. After `pnpm install`, the package `prepare` script builds `dist/`.

```tsx
import { ThumbnailPill } from "@tmi-apps/ui";
```

Ensure your theme includes `thumbnailPill` sizing (see `THUMBNAIL_PILL_SIZING` in the app’s `defaultTheme`) or rely on defaults.

## Use from another repo on your PC (file install)

From the consumer app (pnpm example):

```bash
pnpm add file:../project-alpha-app/packages/ui
```

Adjust the relative path. On install, `prepare` runs `tsc` and produces `dist/`. Peers must already exist in the consumer.

## Upgrade paths

1. **Git URL:** split `packages/ui` to its own repo (e.g. `git subtree split --prefix=packages/ui -b release/ui`) and install with  
   `pnpm add git+https://github.com/TMI-apps/tmi-ui.git#main` (or a tag/SHA).
2. **GitHub Packages:** add `publishConfig` to this package and an `.npmrc` in consumers; publish semver versions.

## Development

```bash
pnpm --filter @tmi-apps/ui build
```
