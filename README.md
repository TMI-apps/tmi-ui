# @tmi-packages/ui

Shared UI primitives for React 19 + MUI 7.

**Maintained by TMI Publishing B.V.** · Source: [TMI-apps/tmi-ui](https://github.com/TMI-apps/tmi-ui)

**License:** [MIT](./LICENSE) · **Release notes:** [CHANGELOG.md](./CHANGELOG.md)

**Security:** [SECURITY.md](./SECURITY.md)

There is **no SLA** for issues or pull requests; responses are best-effort.

**Install:** `pnpm add @tmi-packages/ui` — details in **[docs/installation.md](./docs/installation.md)**. Checklist: **[docs/consumer-setup.md](./docs/consumer-setup.md)** (includes **adopt skill** copy). **TMI table API:** [§ TMI table](#tmi-table). Releases: **[docs/release-flow.md](./docs/release-flow.md)**.

**Integrating in an app?** Copy `.agents/skills/adopt-from-tmi-ui` from this package into your app after install and every bump — see [consumer-setup](./docs/consumer-setup.md#5-adopt-skill-cursor).

Extract-complete table surface is **`1.3.x`**. Do not look for a `0.5.0` tag.

## Contents

| Component               | Since    | Peer deps beyond core                                                                   |
| ----------------------- | -------- | --------------------------------------------------------------------------------------- |
| `ThumbnailPill`         | `0.1.0`  | `react-router-dom` (when `to` prop is used)                                             |
| `VideoEmbedModal`       | `0.2.0`  | `@mui/icons-material` (uses `@mui/icons-material/Close`)                                |
| `PersistentStepperList` | `0.4.0`  | `@mui/icons-material` (expand + check); optional `theme.checklist` (see `src/theme.ts`) |
| `textToStepperItems`    | `0.4.0`  | (parser only — no MUI)                                                                  |
| `usePersistentSteps`    | `0.4.0`  | (hook only — `localStorage`)                                                            |
| TMI table (full grid)   | `1.3.0`+ | `@tanstack/react-table`, `@tanstack/react-virtual`, `@dnd-kit/*`; `createTmiTableTheme` |

Exported types are the contract (`dist/index.d.ts`, `src/index.ts`). Prop surfaces: `ThumbnailPill` / `VideoEmbedModal` source; TMI table → [§ TMI table](#tmi-table). Prefer `TMITable` over deprecated `DatabaseViewer`.

## Install

```bash
pnpm add @tmi-packages/ui
```

Public npm; no GitHub Packages token. Pin `^1.3.0` (or later `1.3.x`) for the grid.

### Vite

```ts
optimizeDeps: {
  include: ["@tmi-packages/ui"],
},
```

**Never** `exclude` this package. Excluding it pulls CJS `react-is` / a raw `.pnpm` MUI copy and named exports fail in `pnpm dev`.

## Peer dependencies

Your consuming app must already ship compatible **majors** of these. Mismatches should be reported to this repository rather than patched with `--force`.

| Package                   | Required range | Notes                                      |
| ------------------------- | -------------- | ------------------------------------------ |
| `react`                   | `^19.2.0`      |                                            |
| `react-dom`               | `^19.2.0`      |                                            |
| `@mui/material`           | `^7.3.6`       |                                            |
| `@mui/icons-material`     | `^7.3.6`       | `VideoEmbedModal`, `PersistentStepperList` |
| `@emotion/react`          | `^11.14.0`     |                                            |
| `@emotion/styled`         | `^11.14.1`     |                                            |
| `react-router-dom`        | `^7.11.0`      | `ThumbnailPill` with `to`                  |
| `@tanstack/react-table`   | `^8.21.3`      | `TMITable`                                 |
| `@tanstack/react-virtual` | `3.13.24`      | `TMITable` virtualization                  |
| `@dnd-kit/core`           | `^6.3.1`       | Row reorder (`TmiRowReorderDndProvider`)   |
| `@dnd-kit/sortable`       | `^10.0.0`      | Row reorder                                |
| `@dnd-kit/utilities`      | `^3.2.2`       | Row reorder                                |

## Verify the install

```bash
pnpm ls @tmi-packages/ui
```

Confirm `node_modules/@tmi-packages/ui/dist/index.js` and `node_modules/@tmi-packages/ui/dist/index.d.ts` exist.

## TMI table

This section is the **public-API SSOT** for the grid. Types in `dist/index.d.ts` win if this page lags.

### Integration ledger

Read with the [adopt skill](.agents/skills/adopt-from-tmi-ui/SKILL.md). Infer a profile (`browse-only` vs `workspace+detail`), wire package APIs below, then **skip-walk** every unwired row with the human.

| Capability | Package API | If skipped |
| ---------- | ----------- | ---------- |
| Browse grid | `TMITable` + `columns` + `serverInfinite` | Do not build a custom grid / fork TanStack in the app |
| Workspace shell | `TMITableWorkspace` (`leftHeader`, `table`, `detailPanel`) | Do not build a custom split layout |
| Client list | `staticClientVirtualizedList(n)` | Do not hand-roll infinite scroll for all-client data |
| Server infinite | `serverInfinite` (`TMITableServerInfinite`) | Do not paginate `data` inside the app table wrapper |
| Tree rows | `tree` / `getSubRows` | Do not build a parallel tree UI |
| Row reorder | `TmiRowReorderDndProvider` + `rowReorder` | Do not add a second DnD context for the grid |
| Row selection | `selection` / `enableRowSelection` | Do not build custom multi-select chrome (export stays app) |
| Filter prompt | `filterPromptActive` on workspace | Do not hide the table with ad-hoc empty states |
| Optimistic feedback | `OptimisticTableFeedbackProvider` | Do not duplicate pending-row snackbar logic |
| Detail hero / edit | `TMITableDetailEditPanel`, `DetailPanelHeroHeader` | Do not rebuild hero chrome |
| Overlay z-index | `usePortaledOverlayPopperZIndex` from **this package** | Do not add a second `PortaledOverlayStack` context |
| Vite dev | `optimizeDeps.include: ["@tmi-packages/ui"]` | Do not exclude the package |
| Fill height | omit `maxHeight` (or `false` for nested) | Do not call deprecated `useTMITableMaxHeight` for fill |
| Load debug | `debug.onTableLoadSettled: logTableLoadSummary` | Do not wrap `TMITable` in an app logger component |
| Theme | `createTmiTableTheme` | Do not duplicate hero/workspace theme keys |
| **Out of package** | edit session, xlsx export, feature columns, RPC | Stay in the app — do not move into wrappers |

### Public exports

| Area          | Symbols                                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Grid          | `TMITable`, `DatabaseViewer` (deprecated alias), `staticClientVirtualizedList`                                                                               |
| Workspace     | `TMITableWorkspace`, layout hooks/contexts (`useDatabaseViewerMaxHeight` / `useTMITableMaxHeight` deprecated for fill-height; omit `maxHeight` instead)      |
| Detail / hero | `TMITableDetailEditPanel`, `DetailPanelHeroHeader`, `DetailPanelHeroStatsStrip`, `DetailPanelSectionHeading`, `UnsavedChangesDialog`, `RecordWorkspaceShell` |
| Overlay       | `PortaledOverlayStackProvider`, `usePortaledOverlayPopperZIndex`, `useWorkspaceDrawerOverlayZIndex`, `workspaceDetailDrawerModalZ`                           |
| Reorder       | `TmiRowReorderDndProvider`                                                                                                                                   |
| Thumbnails    | `createAirtableAttachmentThumbnailColumn`, `TableRowThumbnailShell`, `AirtableAttachmentThumbnailCell`                                                       |
| Row actions   | `TableRowActionButton`                                                                                                                                       |
| Feedback      | `OptimisticTableFeedbackProvider`, `useOptimisticTableFeedback`, `TmiTableLocaleText`                                                                        |

### Theme

This package does **not** ship a full `createTheme`. Wrap **your** theme with `createTmiTableTheme` before workspace / hero UI. That fills `theme.detailPanelHero` and `theme.tmiTableWorkspace.detailDrawerModalZ`. Import `@tmi-packages/ui` once for MUI module augmentation. Do not redeclare those keys in the app.

```ts
import { createTheme } from "@mui/material/styles";
import { createTmiTableTheme } from "@tmi-packages/ui";
import "@tmi-packages/ui";

const theme = createTmiTableTheme(createTheme(/* your tokens */));
```

Optional elsewhere: `theme.thumbnailPill`, `palette.primary.surface` / `surfaceHover`, `theme.checklist`.

### Grid and `serverInfinite`

`TMITable` always takes `serverInfinite` (`TMITableServerInfinite`). Internally the grid uses TanStack Table with **`manualPagination: true`** and **`rowCount`** from that contract (`totalCount` / loaded rows). The table does not page `data` itself — you accumulate rows.

Client-only list:

```tsx
import { TMITable, staticClientVirtualizedList } from "@tmi-packages/ui";
import type { ColumnDef } from "@tanstack/react-table";

type Row = { id: string; name: string };

const columns: ColumnDef<Row>[] = [{ accessorKey: "name", header: "Name" }];

<TMITable
  data={rows}
  columns={columns}
  loading={false}
  error={null}
  getRowId={(r) => r.id}
  serverInfinite={staticClientVirtualizedList(rows.length)}
/>;
```

**Height:** omit `maxHeight` to fill remaining space in `TMITableWorkspace` / `RecordWorkspaceShell` (or the standalone breakpoint / `100%` slot the layout hook already uses — not a raw `100vh`). Pass a number to pin (`maxHeight={600}`). Pass `maxHeight={false}` for content-sized nested/dialog/compact tables so they do not stretch to the workspace. Virtualization still uses a real pixel/`100%` box when filling; do not treat omit as content auto-height.

`useDatabaseViewerMaxHeight` / `useTMITableMaxHeight` stay exported for one release but are **deprecated** for this use case.

Server infinite query: map to `{ hasNextPage, isFetchingNextPage, fetchNextPage, nextPageError, onRetryNextPage, totalLoaded, totalCount }`. Tree: `tree`. Reorder: wrap with `TmiRowReorderDndProvider` and pass `rowReorder`.

Body cells are a **48px** stretch band (`p: 0`). `TableRowActionButton` fills that height (chevrons, icon columns, custom actions). Default content keeps a 16px horizontal inset; set `meta.fullHeightInteractive`, `iconSurrogateCell`, or `isTreeColumn` to drop it. Do not set `fullHeightInteractive` on plain text columns.

### Workspace

```tsx
import { TMITableWorkspace } from "@tmi-packages/ui";

<TMITableWorkspace
  leftHeader={filters}
  table={<TMITable /* ... */ />}
  detailOpen={Boolean(selected)}
  detailPanel={selected ? <YourDetail record={selected} /> : null}
/>;
```

### Injection

| Knob                       | Default               | App                                                                               |
| -------------------------- | --------------------- | --------------------------------------------------------------------------------- |
| `debug.onTableLoadSettled` | **no-op**             | Pass `logTableLoadSummary` from the package when you want dev load summaries |
| `TmiTableLocaleText`       | English-ish built-ins | `OptimisticTableFeedbackProvider` / `UnsavedChangesDialog`                        |
| DnD                        | off                   | `TmiRowReorderDndProvider` + `rowReorder`                                         |

### Overlay

The package owns `PortaledOverlayStackProvider` (`TMITableWorkspace` mounts it around the detail drawer). Autocomplete / Popper must use **`usePortaledOverlayPopperZIndex` from this package** (same module instance). Re-export that module from an app path if you need a stable alias — **do not** keep a second React context. Modals above the drawer: `workspaceDetailDrawerModalZ(theme)`.

### Out of package

Stay in the app: edit session, Excel / selection-export orchestration, feature column defs, RPC / data fetching.

### Check

`pnpm type-check`, `pnpm build`, cold `pnpm dev`. Narrow-viewport autocomplete must sit **above** the detail drawer, not behind it.

## Smoke test (after upgrade or first install)

1. **ThumbnailPill** — Renders without console errors; `onClick` fires; `to` navigates (if using `react-router-dom`); tooltip shows on hover; `variant="appBar"` looks correct on a primary-colored top bar; thumbnail loads and placeholder shows when `thumbnail` is omitted.
2. **ThumbnailPill (0.1.2+ behaviour)** — Tooltip does not stick when moving the pointer onto it; circle padding is visually centred; bare-text pills have comfortable horizontal padding.
3. **VideoEmbedModal** — YouTube watch / short / embed URL opens in the modal, iframe autoplays, close (X) dismisses.
4. **VideoEmbedModal + Vimeo** — `vimeo.com/<id>` or `player.vimeo.com/video/<id>` works the same way.
5. **Unsupported URL** — Non-video URL: component returns `null`, no console errors.
6. **Localization** — If you pass `closeAriaLabel`, confirm the close button's `aria-label` in DevTools.
7. **TMI table** — Grid renders; `pnpm dev` starts without named-export errors; with workspace, drawer + autocomplete stacking is correct.

## Components

### `ThumbnailPill`

```tsx
import { ThumbnailPill } from "@tmi-packages/ui";

<ThumbnailPill
  title="Example"
  thumbnail="https://example.com/thumb.png"
  onClick={() => {
    /* ... */
  }}
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

### Integration ledger

| Capability | Package API | If skipped |
| ---------- | ----------- | ---------- |
| Navigation | `to` + `react-router-dom` | Use `onClick` + your router — do not fork `Link` styling |
| Click action | `onClick` | Do not wrap in a custom button component |
| App bar styling | `variant="appBar"` | Do not duplicate primary-surface pill CSS |
| Thumbnail | `thumbnail` / `thumbnailPlaceholder` | Do not build a second thumb shell |
| Tooltip | `tooltip` | Do not add a parallel tooltip wrapper |

### `VideoEmbedModal`

Modal that embeds a YouTube or Vimeo video in a responsive 16:9 iframe. Privacy-enhanced (`youtube-nocookie.com`) for YouTube, autoplays on open, and returns `null` when the URL cannot be resolved to a supported provider — so you can render it unconditionally.

```tsx
import { useState } from "react";
import { VideoEmbedModal } from "@tmi-packages/ui";

const [open, setOpen] = useState(false);

<VideoEmbedModal
  open={open}
  onClose={() => setOpen(false)}
  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  title="Intro video"
  closeAriaLabel="Close"
/>;
```

Full prop surface (`VideoEmbedModalProps`):

- `open: boolean` (required)
- `onClose: () => void` (required)
- `url: string` (required) — YouTube or Vimeo URL; unsupported → renders `null`
- `title: string` (required)
- `closeAriaLabel?: string` — default `"Close"`

Supported URL shapes:

- YouTube: `youtube.com/watch?v=...`, `youtu.be/...`, `youtube.com/embed/...`
- Vimeo: `vimeo.com/<id>`, `player.vimeo.com/video/<id>`

### Integration ledger

| Capability | Package API | If skipped |
| ---------- | ----------- | ---------- |
| Open / close | `open`, `onClose` | Do not build a second modal shell |
| URL providers | `url` (YouTube/Vimeo) | Do not embed iframes manually for supported URLs |
| Unsupported URL | component returns `null` | Do not try/catch around render — pass URL as-is |
| a11y label | `closeAriaLabel` | Do not omit close button labeling |

### `PersistentStepperList`

Checklist UI with optional per-entity `localStorage` via `usePersistentSteps`. Parse markdown-like lines with `textToStepperItems`.

```tsx
import {
  PersistentStepperList,
  textToStepperItems,
  usePersistentSteps,
} from "@tmi-packages/ui";
```

### Integration ledger

| Capability | Package API | If skipped |
| ---------- | ----------- | ---------- |
| Checklist UI | `PersistentStepperList` | Do not rebuild stepper chrome |
| Parsed steps | `textToStepperItems` | Do not duplicate line parser |
| Persisted state | `usePersistentSteps` | Do not add a second storage hook |
| Sizing tokens | `theme.checklist` (optional) | Component falls back to built-in defaults |

## Theme integration

Importing the package registers MUI module augmentation globally. You do **not** need a `declare module "@mui/material/styles"` block in the consumer for the tokens this library defines.

Currently augmented:

- **`theme.thumbnailPill`** _(optional)_ — sizing for `ThumbnailPill` (defaults if omitted).
- **`theme.palette.primary.surface`** / **`surfaceHover`** _(optional)_ — low-opacity primary tints.
- **`theme.detailPanelHero`** / **`theme.tmiTableWorkspace`** — filled by `createTmiTableTheme` ([§ TMI table](#tmi-table)).

If your app redeclared these keys, **remove** the duplicate — conflicting augmentations cause TypeScript errors.

## Known limitations

- **`ThumbnailPill`** uses **`react-router-dom`** `Link` when `to` is set. Other routers: omit `to` and use `onClick` + `navigate(...)`.
- **`VideoEmbedModal`** — YouTube and Vimeo only.
- **Theme augmentation is global** when `@tmi-packages/ui` is imported.
- **Storybook** — optional follow-up for visual docs. **Unit tests** live under `tests/`; run `pnpm test:run` locally (see [CONTRIBUTING.md](CONTRIBUTING.md)).

## Local development (this repository)

```bash
git clone https://github.com/TMI-apps/tmi-ui.git
cd tmi-ui
pnpm install
pnpm run build
pnpm verify:pack
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Versioning

Follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Extending an existing component does **not** break apps if existing props, exports, and defaults stay valid.

- **MAJOR** — breaking API or behavior (coordinate with consumers).
- **MINOR** — additive surface (new components, optional props, tokens with fallbacks).
- **PATCH** — bug fixes; docs-only consumer guidance; no intended contract change.

How to classify a change, deprecation, and opt-in vs default flips: [CONTRIBUTING.md — Public API and semver](./CONTRIBUTING.md#public-api-and-semver). Pipeline: [docs/release-flow.md](./docs/release-flow.md). History: [CHANGELOG.md](./CHANGELOG.md).

## Quick reference

| What               | Where                     |
| ------------------ | ------------------------- |
| Source             | `src/`                    |
| Build output       | `dist/` (gitignored)      |
| Theme augmentation | `src/theme.ts`            |
| TMI table API      | [§ TMI table](#tmi-table) |
| Adopt skill        | `.agents/skills/adopt-from-tmi-ui` (copy into app — [consumer-setup](./docs/consumer-setup.md#5-adopt-skill-cursor)) |
| Verifying tarball  | `pnpm verify:pack`        |

## Migration from a vendored or monorepo copy

If you previously depended on a **local path**, **`workspace:`**, or **`file:`** link to this library inside another repository, switch to the published package instead. Install from [npm](https://www.npmjs.com/package/@tmi-packages/ui); pin a semver range after checking [Releases](https://github.com/TMI-apps/tmi-ui/releases). Run `pnpm add @tmi-packages/ui`, remove duplicate MUI theme augmentations, and remove the old vendored dependency. If you used GitHub Packages before, follow [docs/consumer-setup.md](./docs/consumer-setup.md#migrating-from-github-packages).
