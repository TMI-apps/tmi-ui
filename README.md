# @tmi-packages/ui

Shared UI primitives for React 19 + MUI 7.

**Maintained by TMI Publishing B.V.** · Source: [TMI-apps/tmi-ui](https://github.com/TMI-apps/tmi-ui)

**License:** [MIT](./LICENSE) · **Release notes:** [CHANGELOG.md](./CHANGELOG.md)

**Security:** [SECURITY.md](./SECURITY.md)

There is **no SLA** for issues or pull requests; responses are best-effort.

**Install from npm** — see **[docs/installation.md](./docs/installation.md)** (`pnpm add`). Per-app checklist: **[docs/consumer-setup.md](./docs/consumer-setup.md)**. Releases: **[docs/release-flow.md](./docs/release-flow.md)**.

## Contents

| Component               | Since    | Peer deps beyond core                                                                   |
| ----------------------- | -------- | --------------------------------------------------------------------------------------- |
| `ThumbnailPill`         | `0.1.0`  | `react-router-dom` (when `to` prop is used)                                             |
| `VideoEmbedModal`       | `0.2.0`  | `@mui/icons-material` (uses `@mui/icons-material/Close`)                                |
| `PersistentStepperList` | `0.4.0`  | `@mui/icons-material` (expand + check); optional `theme.checklist` (see `src/theme.ts`) |
| `textToStepperItems`    | `0.4.0`  | (parser only — no MUI)                                                                  |
| `usePersistentSteps`    | `0.4.0`  | (hook only — `localStorage`)                                                            |
| TMI table (Phase 2–3)   | `1.1.0`+ | `@tanstack/react-table`; `createTmiTableTheme` for hero + workspace drawer z-index      |

For the full prop surface of each component, read its source — the exported types are the canonical contract:

- `ThumbnailPill` → `[src/ThumbnailPill/ThumbnailPill.tsx](src/ThumbnailPill/ThumbnailPill.tsx)`, `ThumbnailPillProps`.
- `VideoEmbedModal` → `[src/VideoEmbedModal/VideoEmbedModal.tsx](src/VideoEmbedModal/VideoEmbedModal.tsx)`, `VideoEmbedModalProps`.
- TMI table Phase 2–3 (satellites, workspace, detail/hero shell, `createTmiTableTheme`) → `[src/DataTable/index.ts](src/DataTable/index.ts)`. Grid (`TMITable` / `DatabaseViewer`) stays unexported until a later ingest phase.

## Peer dependencies

Your consuming app must already ship compatible **majors** of these. Mismatches should be reported to this repository rather than patched with `--force`.

| Package                   | Required range | Notes                                                         |
| ------------------------- | -------------- | ------------------------------------------------------------- |
| `react`                   | `^19.2.0`      |                                                               |
| `react-dom`               | `^19.2.0`      |                                                               |
| `@mui/material`           | `^7.3.6`       |                                                               |
| `@mui/icons-material`     | `^7.3.6`       | Used by `VideoEmbedModal` and `PersistentStepperList` (icons) |
| `@emotion/react`          | `^11.14.0`     |                                                               |
| `@emotion/styled`         | `^11.14.1`     |                                                               |
| `react-router-dom`        | `^7.11.0`      | Used when `ThumbnailPill` receives a `to` prop                |
| `@tanstack/react-table`   | `^8.21.3`      | TMI table column helpers                                      |
| `@tanstack/react-virtual` | `3.13.24`      | Grid virtualization (public grid export later)                |
| `@dnd-kit/core`           | `^6.3.1`       | Row-reorder types / later grid                                |
| `@dnd-kit/sortable`       | `^10.0.0`      | Later grid                                                    |
| `@dnd-kit/utilities`      | `^3.2.2`       | Later grid                                                    |

## Verify the install

```bash
pnpm ls @tmi-packages/ui
```

Confirm `node_modules/@tmi-packages/ui/dist/index.js` and `node_modules/@tmi-packages/ui/dist/index.d.ts` exist.

## Smoke test (after upgrade or first install)

1. **ThumbnailPill** — Renders without console errors; `onClick` fires; `to` navigates (if using `react-router-dom`); tooltip shows on hover; `variant="appBar"` looks correct on a primary-colored top bar; thumbnail loads and placeholder shows when `thumbnail` is omitted.
2. **ThumbnailPill (0.1.2+ behaviour)** — Tooltip does not stick when moving the pointer onto it; circle padding is visually centred; bare-text pills have comfortable horizontal padding.
3. **VideoEmbedModal** — YouTube watch / short / embed URL opens in the modal, iframe autoplays, close (X) dismisses.
4. **VideoEmbedModal + Vimeo** — `vimeo.com/<id>` or `player.vimeo.com/video/<id>` works the same way.
5. **Unsupported URL** — Non-video URL: component returns `null`, no console errors.
6. **Localization** — If you pass `closeAriaLabel`, confirm the close button's `aria-label` in DevTools.

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

## Theme integration

Importing the package registers MUI module augmentation globally. You do **not** need a `declare module "@mui/material/styles"` block in the consumer for the tokens this library defines.

Currently augmented:

- **`theme.thumbnailPill`** _(optional)_ — sizing for `ThumbnailPill` (defaults if omitted).
- **`theme.palette.primary.surface`** / **`surfaceHover`** _(optional)_ — low-opacity primary tints.
- **`theme.detailPanelHero`** / **`theme.tmiTableWorkspace`** — filled by `createTmiTableTheme(baseTheme)` before rendering table workspace/hero.

If your app redeclared these keys, **remove** the duplicate — conflicting augmentations cause TypeScript errors. Details and examples: previous sections in this README and MUI’s theme docs.

**This library does not ship a full `createTheme`:** each app builds its own theme and may pass the optional tokens above. For TMI table workspace and detail heroes, wrap the app theme with `createTmiTableTheme`.

### TMI table workspace overlays (Decision #2)

`TMITableWorkspace` installs an internal overlay-stack provider around the detail drawer so portaled menus (column menu, scope popover) stack above the drawer. That provider is **not** a public export — keep a single overlay stack in the **app** for non-table UI (video dialogs, autocomplete outside the workspace).

For those app overlays, pass the same drawer z-index the workspace uses:

```ts
import {
  createTmiTableTheme,
  workspaceDetailDrawerModalZ,
} from "@tmi-packages/ui";

const theme = createTmiTableTheme(appTheme);
const hostModalZ =
  theme.tmiTableWorkspace.detailDrawerModalZ ??
  workspaceDetailDrawerModalZ(theme);
```

Do not import `TMITable` / `DatabaseViewer` from this package yet (Phase 4). `UnsavedChangesDialog` takes the consumer’s edit-session state; `useRecordEditSession` stays in the app.

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

- **MAJOR** — breaking API changes (coordinate with consumers).
- **MINOR** — new components or non-breaking additions.
- **PATCH** — bug fixes.

Full history: [CHANGELOG.md](./CHANGELOG.md).

## Quick reference

| What               | Where                |
| ------------------ | -------------------- |
| Source             | `src/`               |
| Build output       | `dist/` (gitignored) |
| Theme augmentation | `src/theme.ts`       |
| Verifying tarball  | `pnpm verify:pack`   |

## Migration from a vendored or monorepo copy

If you previously depended on a **local path**, **`workspace:`**, or **`file:`** link to this library inside another repository, switch to the published package instead. Install from [npm](https://www.npmjs.com/package/@tmi-packages/ui); pin a semver range after checking [Releases](https://github.com/TMI-apps/tmi-ui/releases). Run `pnpm add @tmi-packages/ui`, remove duplicate MUI theme augmentations, and remove the old vendored dependency. If you used GitHub Packages before, follow [docs/consumer-setup.md](./docs/consumer-setup.md#migrating-from-github-packages).
