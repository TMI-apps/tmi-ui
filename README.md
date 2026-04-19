# @tmi-apps/ui

Shared UI primitives for TMI apps (React 19 + MUI 7 + Vite stack).

The library is a **pnpm workspace package** inside the `project-alpha-app` monorepo. Sibling apps can install it from disk (`file:`), from a pre-built tarball, or — once split to its own git repo — from a git URL. There is no public npm publish target today.

## Contents

| Component        | Since   | Peer deps beyond core         |
| ---------------- | ------- | ----------------------------- |
| `ThumbnailPill`  | `0.1.0` | `react-router-dom` (when `to` prop is used) |

For the full prop surface of each component, read its source — the exported types are the canonical contract:

- `ThumbnailPill` → [`src/ThumbnailPill/ThumbnailPill.tsx`](src/ThumbnailPill/ThumbnailPill.tsx), `ThumbnailPillProps`.

## Peer dependencies (core)

Your consuming app must already ship compatible majors of these. Mismatches should be reported to the source repo rather than patched with `--force`.

- `react ^19.2.0`
- `react-dom ^19.2.0`
- `@mui/material ^7.3.6`
- `@emotion/react ^11.14.0`
- `@emotion/styled ^11.14.1`
- `react-router-dom ^7.11.0` *(only needed by components that accept a `to` prop)*

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

No `prepare` step runs — the tarball already contains `dist/`. To upgrade, bring over a newer `.tgz`, `pnpm remove @tmi-apps/ui`, `pnpm add ./vendor/tmi-apps-ui-<new>.tgz`. Filename changes with the version, so pnpm's content-addressed cache can't serve stale bytes.

### Option C — Git URL install (cross-machine)

Available once `packages/ui/` is split to its own GitHub repo (e.g. via `git subtree split --prefix=packages/ui -b release/ui`). Then consumers install with:

```bash
pnpm add git+https://github.com/<org>/tmi-ui.git#v<version>
```

**Not available today** — requires the subtree split step first. See the source repo's todo list for the cross-machine plan (Stage A).

## Verify the install

```bash
pnpm ls @tmi-apps/ui
# should show @tmi-apps/ui <version> with the install source (file path or tarball)
```

Also confirm `node_modules/@tmi-apps/ui/dist/index.js` and `node_modules/@tmi-apps/ui/dist/index.d.ts` exist.

## Use a component

```tsx
import { ThumbnailPill } from "@tmi-apps/ui";

<ThumbnailPill
  title="Example"
  thumbnail="https://example.com/thumb.png"
  onClick={() => { /* ... */ }}
/>;
```

## Theme integration

Importing anything from `@tmi-apps/ui` registers MUI module augmentation globally. You do **not** need a `declare module "@mui/material/styles"` block in the consumer.

Currently augmented surface:

- **`theme.thumbnailPill`** *(optional)* — sizing bag for `ThumbnailPill`. If you omit it, the component uses sensible defaults (28 px thumbnail, 16 px icon, etc.). To match the source app exactly, add:

  ```ts
  // in createTheme({ ... }) options:
  thumbnailPill: {
    thumbnailSize: 28,
    iconSize: 16,
    titleFontSizeXs: 12,
    maxWidthAppBar: 25,
    pillMaxWidthAppBar: 35,
    pillBorderRadius: 2,
  }
  ```

- **`theme.palette.primary.surface`** / **`surfaceHover`** *(optional)* — low-opacity primary-tint backgrounds for chips, checklist hovers, and similar surfaces. If your app has a dark mode where primary-on-dark looks too faint, set these with mode-aware alpha values:

  ```ts
  import { alpha } from "@mui/material/styles";

  palette: {
    primary: {
      main: "#E91E63", // your existing primary
      surface:      mode === "dark" ? alpha("#E91E63", 0.22) : alpha("#E91E63", 0.08),
      surfaceHover: mode === "dark" ? alpha("#E91E63", 0.32) : alpha("#E91E63", 0.12),
    },
  }
  ```

  When these aren't set, components fall back to `alpha(primary.main, 0.08 / 0.12)` in both modes — the library still renders correctly.

If your consumer already has a local `declare module "@mui/material/styles"` block that redeclares any of these keys, **remove it** — the library now owns the shape and conflicting augmentations produce a TypeScript error.

## Versioning and upgrades

Standard semver:

- **MAJOR** — breaking prop / export changes. Source repo agents must request explicit user confirmation before bumping.
- **MINOR** — new components or non-breaking prop additions.
- **PATCH** — bug fixes.

Upgrade procedure depends on install option:

- **`file:`** — `pnpm install` in the consumer. That's it.
- **Tarball** — copy the new `*.tgz`, `pnpm remove @tmi-apps/ui`, then `pnpm add ./vendor/tmi-apps-ui-<new>.tgz`.
- **Git URL** — bump the tag / SHA in the install spec, then `pnpm install`.

After upgrade, do a quick smoke test of any pages that render components from this library. Public prop surfaces are kept stable within a major; visual refinements land in minor / patch.

## Contributing a new component

The source repo (`project-alpha-app`) includes a Cursor skill that drives the full promotion flow:

- `.cursor/skills/share-component/SKILL.md`

TL;DR when working inside the source repo:

1. Place the component under `packages/ui/src/<Name>/` (one folder per component, mirror the `ThumbnailPill` shape).
2. Add any new theme tokens to `packages/ui/src/theme.ts` via MUI module augmentation.
3. Export from `packages/ui/src/index.ts`.
4. Update callsites in `src/` to import from `@tmi-apps/ui`.
5. Bump `packages/ui/package.json` (MINOR for a new component).
6. `cd packages/ui && pnpm pack` — regenerates `dist/` and produces a fresh `*.tgz`. Delete the prior version's tarball in the same step.
7. Append a new block to the **Versions** section below and to `documentation/jobs/tmi-ui-chip-integration/HANDOFF.md`.
8. From the repo root: `pnpm type-check && pnpm arch:check && pnpm validate:structure`.

## Detailed consumer guide

For cross-repo integration specifics — install methods, dark-mode contrast tuning, known limitations, and the upgrade path between versions — see `documentation/jobs/tmi-ui-chip-integration/HANDOFF.md` in the source repo.

## Development (inside the source monorepo)

```bash
pnpm --filter @tmi-apps/ui build
```

The root app declares `"@tmi-apps/ui": "workspace:*"` in `package.json`, so local changes flow through on the next `pnpm install`.

## Versions

### 0.1.2

- **Tooltip no longer sticks.** `ThumbnailPill` tooltip uses `disableInteractive`, 600 ms `enterDelay` / `enterNextDelay`, and `pointerEvents: "none"` on both tooltip and popper. Moving the pointer from the pill onto the tooltip closes it, matching dense table row action icons.

### 0.1.1

- **Dark-mode contrast tokens.** `ThumbnailPill` now reads optional `theme.palette.primary.surface` / `surfaceHover` (with `alpha(primary.main, 0.08 / 0.12)` fallback).
- **Circle symmetry.** When a thumbnail/placeholder circle is on a side, that side's padding is 2 px so the circle is equidistant from top, bottom and outer edge.
- **Bare-text padding.** Sides without a circle or `rightSlot` pad to 12 px so text doesn't butt against the edge.

### 0.1.0 — `ThumbnailPill`

Horizontal pill with optional thumbnail, title, right slot, tooltip, and optional navigation via `react-router-dom` `Link` when `to` is set.
