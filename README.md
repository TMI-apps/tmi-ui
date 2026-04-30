# @tmi-apps/ui

Shared UI primitives for TMI apps (React 19 + MUI 7).

**Repository:** [TMI-apps/tmi-ui](https://github.com/TMI-apps/tmi-ui)  
**License:** [LICENSE](./LICENSE) (UNLICENSED — proprietary; all rights reserved).  
**Release notes:** [CHANGELOG.md](./CHANGELOG.md).

**Install from GitHub Packages** — see **[docs/installation.md](./docs/installation.md)** (`.npmrc`, auth, `pnpm add`). Per-app checklist: **[docs/consumer-setup.md](./docs/consumer-setup.md)**. Releases: **[docs/release-flow.md](./docs/release-flow.md)**.

## Contents


| Component               | Since   | Peer deps beyond core                                                                   |
| ----------------------- | ------- | --------------------------------------------------------------------------------------- |
| `ThumbnailPill`         | `0.1.0` | `react-router-dom` (when `to` prop is used)                                             |
| `VideoEmbedModal`       | `0.2.0` | `@mui/icons-material` (uses `@mui/icons-material/Close`)                                |
| `PersistentStepperList` | `0.4.0` | `@mui/icons-material` (expand + check); optional `theme.checklist` (see `src/theme.ts`) |
| `textToStepperItems`    | `0.4.0` | (parser only — no MUI)                                                                  |
| `usePersistentSteps`    | `0.4.0` | (hook only — `localStorage`)                                                            |


For the full prop surface of each component, read its source — the exported types are the canonical contract:

- `ThumbnailPill` → `[src/ThumbnailPill/ThumbnailPill.tsx](src/ThumbnailPill/ThumbnailPill.tsx)`, `ThumbnailPillProps`.
- `VideoEmbedModal` → `[src/VideoEmbedModal/VideoEmbedModal.tsx](src/VideoEmbedModal/VideoEmbedModal.tsx)`, `VideoEmbedModalProps`.

## Peer dependencies

Your consuming app must already ship compatible **majors** of these. Mismatches should be reported to this repository rather than patched with `--force`.


| Package               | Required range | Notes                                                         |
| --------------------- | -------------- | ------------------------------------------------------------- |
| `react`               | `^19.2.0`      |                                                               |
| `react-dom`           | `^19.2.0`      |                                                               |
| `@mui/material`       | `^7.3.6`       |                                                               |
| `@mui/icons-material` | `^7.3.6`       | Used by `VideoEmbedModal` and `PersistentStepperList` (icons) |
| `@emotion/react`      | `^11.14.0`     |                                                               |
| `@emotion/styled`     | `^11.14.1`     |                                                               |
| `react-router-dom`    | `^7.11.0`      | Used when `ThumbnailPill` receives a `to` prop                |


## Verify the install

```bash
pnpm ls @tmi-apps/ui
```

Confirm `node_modules/@tmi-apps/ui/dist/index.js` and `node_modules/@tmi-apps/ui/dist/index.d.ts` exist.

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

Modal that embeds a YouTube or Vimeo video in a responsive 16:9 iframe. Privacy-enhanced (`youtube-nocookie.com`) for YouTube, autoplays on open, and returns `null` when the URL cannot be resolved to a supported provider — so you can render it unconditionally.

```tsx
import { useState } from "react";
import { VideoEmbedModal } from "@tmi-apps/ui";

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

- `**theme.thumbnailPill`** *(optional)* — sizing for `ThumbnailPill` (defaults if omitted).
- `**theme.palette.primary.surface*`* / `**surfaceHover`** *(optional)* — low-opacity primary tints.

If your app redeclared these keys, **remove** the duplicate — conflicting augmentations cause TypeScript errors. Details and examples: previous sections in this README and MUI’s theme docs.

**This library does not ship a full `createTheme`:** each app builds its own theme and may pass the optional tokens above.

## Known limitations

- `**ThumbnailPill` uses `react-router-dom` `Link`** when `to` is set. Other routers: omit `to` and use `onClick` + `navigate(...)`.
- `**VideoEmbedModal` — YouTube and Vimeo only.**
- **Theme augmentation is global** when `@tmi-apps/ui` is imported.
- **Storybook / package-level tests** — follow-up; track in this repo’s issues if needed.

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


## Migration from `project-alpha-app`

Previously, `@tmi-apps/ui` lived under `project-alpha-app/packages/ui`. It now releases only from **this** repo. Use GitHub Packages (see [docs/installation.md](./docs/installation.md)); pin a semver range in your app after checking [Releases](https://github.com/TMI-apps/tmi-ui/releases). In-app: add `.npmrc` for `@tmi-apps` → `npm.pkg.github.com`, install the package, remove duplicate theme augmentations, and drop any `file:` or monorepo `workspace:` link to the old path.