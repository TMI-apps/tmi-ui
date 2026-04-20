# @tmi-apps/ui

Shared UI primitives for TMI apps (React 19 + MUI 7 + Vite stack).

**License:** [LICENSE](./LICENSE) (UNLICENSED — proprietary; all rights reserved).  
**Release notes:** [CHANGELOG.md](./CHANGELOG.md).

The library is a **pnpm workspace package** inside the `project-alpha-app` monorepo. Sibling apps can install it from disk (`file:`), from a pre-built tarball, or — once split to its own git repo — from a git URL or a private registry. There is no public npm publish target today.

## Contents

| Component         | Since   | Peer deps beyond core                                   |
| ----------------- | ------- | ------------------------------------------------------- |
| `ThumbnailPill`   | `0.1.0` | `react-router-dom` (when `to` prop is used)             |
| `VideoEmbedModal` | `0.2.0` | `@mui/icons-material` (uses `@mui/icons-material/Close`) |

For the full prop surface of each component, read its source — the exported types are the canonical contract:

- `ThumbnailPill` → [`src/ThumbnailPill/ThumbnailPill.tsx`](src/ThumbnailPill/ThumbnailPill.tsx), `ThumbnailPillProps`.
- `VideoEmbedModal` → [`src/VideoEmbedModal/VideoEmbedModal.tsx`](src/VideoEmbedModal/VideoEmbedModal.tsx), `VideoEmbedModalProps`.

## Peer dependencies

Your consuming app must already ship compatible **majors** of these. Mismatches should be reported to the source repo rather than patched with `--force`.

| Package               | Required range | Notes                                          |
| --------------------- | -------------- | ---------------------------------------------- |
| `react`               | `^19.2.0`      |                                                |
| `react-dom`           | `^19.2.0`      |                                                |
| `@mui/material`       | `^7.3.6`       |                                                |
| `@mui/icons-material` | `^7.3.6`       | Used by `VideoEmbedModal` (close button icon)  |
| `@emotion/react`      | `^11.14.0`     |                                                |
| `@emotion/styled`     | `^11.14.1`     |                                                |
| `react-router-dom`    | `^7.11.0`      | Used when `ThumbnailPill` receives a `to` prop |

If any package differs by a **major** version, stop and align versions (or ask the source repo to widen peer ranges). Do not `--force` the install.

## Install in another app

Three options, in order of increasing portability. Pick one and stick with it.

### Option A — `file:` install (recommended for active development)

Fastest iteration: any change to `packages/ui/` in the source repo becomes available after a `pnpm install` in the consumer. Requires both repos on the same machine.

From the consumer's repo root:

```bash
pnpm add file:../<relative-path>/project-alpha-app/packages/ui
```

pnpm runs the library's `prepare` script (`tsc -p tsconfig.build.json`) on install and generates `dist/` automatically.

### Option B — Tarball install (frozen snapshot)

Best when you want the consumer pinned to a known-good build. Requires the two repos to be on the same machine only at install time.

The source repo publishes a pre-built tarball at `packages/ui/tmi-apps-ui-<version>.tgz`. Copy it into the consumer (e.g. `vendor/`), then:

```bash
pnpm add ./vendor/tmi-apps-ui-<version>.tgz
```

No `prepare` step runs — the tarball already contains `dist/`. To upgrade, bring over a newer `.tgz`, `pnpm remove @tmi-apps/ui`, then `pnpm add ./vendor/tmi-apps-ui-<new>.tgz`. Filename changes with the version, so pnpm's content-addressed cache can't serve stale bytes.

### Option C — Git URL install (cross-machine)

Available once `packages/ui/` is split to its own GitHub repo (e.g. via `git subtree split --prefix=packages/ui -b release/ui`). Then consumers install with:

```bash
pnpm add git+https://github.com/<org>/tmi-ui.git#v<version>
```

**Not available today** without that extraction step.

## Upgrading to 0.2.0 (from any 0.1.x)

No existing `ThumbnailPill` props changed. `VideoEmbedModal` is new.

Before upgrading, ensure the consumer declares `@mui/icons-material` at a compatible major (see peer table). If missing:

```bash
pnpm add @mui/icons-material
```

Then follow the same path as your original install (`file:` → `pnpm install` in the consumer; tarball → copy new `.tgz` and reinstall).

## Verify the install

```bash
pnpm ls @tmi-apps/ui
# should show @tmi-apps/ui <version> with the install source (file path or tarball)
```

Also confirm `node_modules/@tmi-apps/ui/dist/index.js` and `node_modules/@tmi-apps/ui/dist/index.d.ts` exist.

## Smoke test (after upgrade or first install)

1. **ThumbnailPill** — Renders without console errors; `onClick` fires; `to` navigates (if using `react-router-dom`); tooltip shows on hover; `variant="appBar"` looks correct on a primary-colored top bar; thumbnail loads and placeholder shows when `thumbnail` is omitted.
2. **ThumbnailPill (0.1.2+ behaviour)** — Tooltip does not stick when moving the pointer onto it; circle padding is visually centred; bare-text pills have comfortable horizontal padding.
3. **VideoEmbedModal** — YouTube watch / short / embed URL opens in the modal, iframe autoplays, close (X) dismisses.
4. **VideoEmbedModal + Vimeo** — `vimeo.com/<id>` or `player.vimeo.com/video/<id>` works the same way.
5. **Unsupported URL** — Non-video URL: component returns `null`, no console errors.
6. **Localization** — If you pass `closeAriaLabel`, confirm the close button's `aria-label` in DevTools.

If something looks stale, run `pnpm install --force` in the consumer and hard-refresh the browser (Vite pre-bundle cache).

## Components

### `ThumbnailPill`

```tsx
import { ThumbnailPill } from "@tmi-apps/ui";

<ThumbnailPill
  title="Example"
  thumbnail="https://example.com/thumb.png"
  onClick={() => { /* ... */ }}
/>;
```

Full prop surface (`ThumbnailPillProps`):

- `title: string` (required)
- `thumbnail?: string` — image URL; if absent, `thumbnailPlaceholder` is shown
- `thumbnailPlaceholder?: ReactNode` — icon fallback
- `rightSlot?: ReactNode` — e.g. close button or status icon
- `tooltip?: string` — wraps the pill in a MUI `Tooltip`; supports multi-line text
- `thumbnailPosition?: "left" | "right"` (default `"left"`)
- `variant?: "default" | "appBar"` — `"appBar"` recolors for use on primary backgrounds
- `onClick?: () => void` — makes the pill clickable
- `to?: string` — renders as a `react-router-dom` `Link`
- `sx?: SxProps<Theme>` — MUI style overrides
- `maxWidth?: number | string`
- `disabled?: boolean`

### `VideoEmbedModal`

Modal that embeds a YouTube or Vimeo video in a responsive 16:9 iframe. Privacy-enhanced (`youtube-nocookie.com`) for YouTube, autoplays on open, and returns `null` when the URL can't be resolved to a supported provider — so you can render it unconditionally.

```tsx
import { useState } from "react";
import { VideoEmbedModal } from "@tmi-apps/ui";

const [open, setOpen] = useState(false);

<VideoEmbedModal
  open={open}
  onClose={() => setOpen(false)}
  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  title="Intro video"
  closeAriaLabel="Close" // override to localize, e.g. "Sluiten"
/>;
```

Full prop surface (`VideoEmbedModalProps`):

- `open: boolean` (required)
- `onClose: () => void` (required) — backdrop / Esc / close button handler
- `url: string` (required) — YouTube or Vimeo URL; unsupported → renders `null`
- `title: string` (required) — dialog header and iframe `title`
- `closeAriaLabel?: string` — accessible label for the close icon (default `"Close"`)

Supported URL shapes:

- YouTube: `youtube.com/watch?v=...`, `youtu.be/...`, `youtube.com/embed/...`
- Vimeo: `vimeo.com/<id>`, `player.vimeo.com/video/<id>`

Behaviour notes:

- YouTube uses `youtube-nocookie.com` (privacy-enhanced embed).
- Autoplay uses `autoplay=1`; some browsers may require user interaction before playback.
- Modal max width ~900 px on desktop; near full width below the `md` breakpoint.

## Theme integration

Importing anything from `@tmi-apps/ui` registers MUI module augmentation globally. You do **not** need a `declare module "@mui/material/styles"` block in the consumer for the tokens this library defines.

Currently augmented surface:

- **`theme.thumbnailPill`** *(optional)* — sizing bag for `ThumbnailPill`. If you omit it, the component uses sensible defaults (28 px thumbnail, 16 px icon, etc.). Example:

  ```ts
  thumbnailPill: {
    thumbnailSize: 28,
    iconSize: 16,
    titleFontSizeXs: 12,
    maxWidthAppBar: 25,
    pillMaxWidthAppBar: 35,
    pillBorderRadius: 2,
  }
  ```

- **`theme.palette.primary.surface`** / **`surfaceHover`** *(optional)* — low-opacity primary-tint backgrounds. Example:

  ```ts
  import { alpha } from "@mui/material/styles";

  palette: {
    primary: {
      main: "#E91E63",
      surface:      mode === "dark" ? alpha("#E91E63", 0.22) : alpha("#E91E63", 0.08),
      surfaceHover: mode === "dark" ? alpha("#E91E63", 0.32) : alpha("#E91E63", 0.12),
    },
  }
  ```

When these aren't set, components fall back to `alpha(primary.main, 0.08 / 0.12)` in both modes.

If your consumer already has a local `declare module "@mui/material/styles"` block that redeclares any of these keys, **remove it** — conflicting augmentations produce a TypeScript error.

## Known limitations (v0.2.0)

- **`ThumbnailPill` forces `react-router-dom`** when `to` is set (uses `Link`). Other routers: omit `to` and use `onClick` + `navigate(...)`. A future release may add a pluggable `LinkComponent` prop.
- **`VideoEmbedModal` supports YouTube and Vimeo only.** Other providers return `null`. Extend `VideoEmbedModal` in the source repo to add providers.
- **Embed URLs drop extra query params** (e.g. start time) — only the video ID is used to build the embed URL.
- **No package-level tests / Storybook yet** — planned once the surface grows.
- **Theme augmentation is global** — importing `@tmi-apps/ui` augments MUI `Theme` types for `thumbnailPill` and `primary.surface` / `surfaceHover` across the project.

## Versioning and upgrades

Standard semver:

- **MAJOR** — breaking prop / export changes (requires explicit confirmation in the source repo before publishing).
- **MINOR** — new components or non-breaking prop additions.
- **PATCH** — bug fixes.

Upgrade procedure:

- **`file:`** — `pnpm install` in the consumer.
- **Tarball** — copy the new `*.tgz`, reinstall.
- **Git URL** — bump tag / SHA, then `pnpm install`.

History: [CHANGELOG.md](./CHANGELOG.md).

## Quick reference (inside `project-alpha-app`)

| What               | Where                                             |
| ------------------ | ------------------------------------------------- |
| Library source     | `packages/ui/src/`                                |
| Built output       | `packages/ui/dist/` (generated, git-ignored)      |
| Tarball (example)  | `packages/ui/tmi-apps-ui-0.2.0.tgz` (git-ignored) |
| Peer deps          | `packages/ui/package.json` (`peerDependencies`)   |
| Theme augmentation | `packages/ui/src/theme.ts`                        |

## Maintainers: verify pack contents

From `packages/ui/` (or `pnpm --filter @tmi-apps/ui verify:pack` from the monorepo root):

```bash
pnpm verify:pack
```

Asserts the tarball includes `dist/**`, `package.json`, `README.md`, `LICENSE`, and `CHANGELOG.md`.

## Isolated install smoke (optional)

From a **temporary directory outside the monorepo**, verify `prepare` and types resolve without app path aliases:

```bash
mkdir ../tmi-ui-consumer-smoke && cd ../tmi-ui-consumer-smoke
pnpm init
pnpm add react react-dom @mui/material @emotion/react @emotion/styled @mui/icons-material react-router-dom typescript
pnpm add file:../project-alpha-app/packages/ui
```

Confirm `node_modules/@tmi-apps/ui/dist/index.d.ts` exists and a one-line `import { ThumbnailPill } from "@tmi-apps/ui"` type-checks with a minimal `tsconfig.json` (`moduleResolution: "bundler"` or `node16`, `jsx: react-jsx`).

## Contributing a new component

The source repo includes a Cursor skill for the full promotion flow:

- `.cursor/skills/share-component/SKILL.md`

TL;DR:

1. Place the component under `packages/ui/src/<Name>/` (mirror the `ThumbnailPill` folder shape).
2. Add any new theme tokens to `packages/ui/src/theme.ts`.
3. Export from `packages/ui/src/index.ts`.
4. Update app callsites to import from `@tmi-apps/ui`.
5. Bump `packages/ui/package.json` (MINOR for a new component; PATCH for fixes).
6. Update [CHANGELOG.md](./CHANGELOG.md) and the **Versions** section below.
7. `pnpm pack` in `packages/ui/` — refresh `*.tgz`; remove older tarballs if you vendor by filename.
8. From the repo root: `pnpm type-check && pnpm arch:check && pnpm validate:structure`.

Historical job notes for chip integration (source repo only): `documentation/jobs/tmi-ui-chip-integration/HANDOFF.md`.

## Development (inside the source monorepo)

```bash
pnpm --filter @tmi-apps/ui build
```

The root app declares `"@tmi-apps/ui": "workspace:*"` in `package.json`, so local changes flow through on the next `pnpm install`.

## Versions

### 0.2.0 — `VideoEmbedModal`

- **New component.** `VideoEmbedModal` embeds YouTube or Vimeo videos in a responsive 16:9 iframe (privacy-enhanced `youtube-nocookie.com` for YouTube, autoplay on open). Returns `null` for unsupported URLs, so it's safe to render unconditionally.
- **Localizable close button.** `closeAriaLabel` prop (defaults to `"Close"`).
- **New peer dep.** `@mui/icons-material ^7.3.6` — consumed for the close button icon.

### 0.1.2

- **Tooltip no longer sticks.** `ThumbnailPill` tooltip uses `disableInteractive`, 600 ms `enterDelay` / `enterNextDelay`, and `pointerEvents: "none"` on both tooltip and popper.

### 0.1.1

- **Dark-mode contrast tokens.** `ThumbnailPill` reads optional `theme.palette.primary.surface` / `surfaceHover` (with `alpha(primary.main, 0.08 / 0.12)` fallback).
- **Circle symmetry.** When a thumbnail/placeholder circle is on a side, that side's padding is 2 px so the circle is equidistant from top, bottom and outer edge.
- **Bare-text padding.** Sides without a circle or `rightSlot` pad to 12 px so text doesn't butt against the edge.

### 0.1.0 — `ThumbnailPill`

Horizontal pill with optional thumbnail, title, right slot, tooltip, and optional navigation via `react-router-dom` `Link` when `to` is set.
