# Changelog

## 1.6.0

### Minor Changes

- [#11](https://github.com/TMI-apps/tmi-ui/pull/11) [`a6424d8`](https://github.com/TMI-apps/tmi-ui/commit/a6424d85b4b9cbdc651bb0ea3225f2010aa25cad) Thanks [@TomFranse](https://github.com/TomFranse)! - Export the AutocompleteSelect family (`AutocompleteSelectField`, `PrimaryContainedAutocompleteBar`, `MetadataFiltersBar`, `ListRowAddButton`, `RowStyleMultiSelect`, and related types).

  Add `theme.tmiPrimaryContained` via `createTmiTableTheme` so the primary add-bar and `ListRowAddButton` share one token. Wrap drawer/modal hosts with `PortaledOverlayStackProvider`. Minimum consumer version `^1.6.0`.

## 1.5.0

### Minor Changes

- [#9](https://github.com/TMI-apps/tmi-ui/pull/9) [`9dbaf78`](https://github.com/TMI-apps/tmi-ui/commit/9dbaf78d1416efaa817b76a2e0be1e012f18b00d) Thanks [@TomFranse](https://github.com/TomFranse)! - Publish adopt-from-tmi-ui agent skill in the npm tarball; add Integration ledgers for all public exports in README.

  Export `TMITableColumnDef`, `logTableLoadSummary`, `isTableLoadDebugEnabled`, `TABLE_LOAD_DEBUG_LOG_PREFIX`, and `TMITableLoadSettledPayload`. Widen `DatabaseViewer` column typing for pnpm peer identity. Remove legacy `debug:lesmateriaalTableLoad` localStorage key.

  Recopy `.agents/skills/adopt-from-tmi-ui` into consumer apps after every package bump.

## 1.4.0

### Minor Changes

- [#6](https://github.com/TMI-apps/tmi-ui/pull/6) [`e4541d8`](https://github.com/TMI-apps/tmi-ui/commit/e4541d845cd8ba5b37ff261143289f4b72f0b371) Thanks [@TomFranse](https://github.com/TomFranse)! - TMITable fills remaining workspace/standalone height when `maxHeight` is omitted. Pin with a number; opt out with `maxHeight={false}` for nested/content-sized tables. `useDatabaseViewerMaxHeight` is deprecated for this use case.

### Patch Changes

- [#6](https://github.com/TMI-apps/tmi-ui/pull/6) [`e4541d8`](https://github.com/TMI-apps/tmi-ui/commit/e4541d845cd8ba5b37ff261143289f4b72f0b371) Thanks [@TomFranse](https://github.com/TomFranse)! - Stretch TMITable body cells to a 48px bar so row action buttons (chevrons and others) fill the row hit target without `fullHeightInteractive`.

- [#6](https://github.com/TMI-apps/tmi-ui/pull/6) [`e4541d8`](https://github.com/TMI-apps/tmi-ui/commit/e4541d845cd8ba5b37ff261143289f4b72f0b371) Thanks [@TomFranse](https://github.com/TomFranse)! - Fix TMITable tree row-reorder grip so pointerdown reaches `@dnd-kit` (drag can start).

## 1.3.1

### Patch Changes

- [#7](https://github.com/TMI-apps/tmi-ui/pull/7) [`5b6cfcc`](https://github.com/TMI-apps/tmi-ui/commit/5b6cfccc65825de6a09ed737bc734b248bb57816) Thanks [@TomFranse](https://github.com/TomFranse)! - README is the TMI table public-API SSOT (extract-complete surface is 1.3.x). Documents Vite `optimizeDeps.include` (never exclude).

## 1.3.0

### Minor Changes

- [#5](https://github.com/TMI-apps/tmi-ui/pull/5) [`fe526a4`](https://github.com/TMI-apps/tmi-ui/commit/fe526a441cbe12ca0575dc82e55a1609945a307b) Thanks [@TomFranse](https://github.com/TomFranse)! - Export TMI table grid (`TMITable` / `DatabaseViewer`), overlay stack context, and grid utilities. `TMITable` no longer defaults to app `tableLoadDebug` logging.

## 1.2.0

### Minor Changes

- [#4](https://github.com/TMI-apps/tmi-ui/pull/4) [`a6b93f3`](https://github.com/TMI-apps/tmi-ui/commit/a6b93f3ad02a381a45b8dac6193438c93a26e507) Thanks [@TomFranse](https://github.com/TomFranse)! - Export TMI table Phase 3 public API (workspace, detail/hero shell, unsaved-changes dialog, optimistic feedback, and `createTmiTableTheme` workspace drawer z-index). Grid remains unexported.

## 1.1.0

### Minor Changes

- [#2](https://github.com/TMI-apps/tmi-ui/pull/2) [`12f5034`](https://github.com/TMI-apps/tmi-ui/commit/12f5034d04db828e92a18a6cad1953b9709c8b6f) Thanks [@TomFranse](https://github.com/TomFranse)! - Export TMI table Phase 2 public API (row satellites, column helper, table types, and `createTmiTableTheme`). Grid and workspace remain unexported.

## 1.0.0

### Major Changes

- [`550c771`](https://github.com/TMI-apps/tmi-ui/commit/550c7714d2482ea9cd19cd03af20d5870eb6b4a9) Thanks [@TilBardaga](https://github.com/TilBardaga)! - **BREAKING:** Publish under the npm scope **`@tmi-packages`** as **`@tmi-packages/ui`** (was `@tmi-apps/ui`) so the package name matches the npm organization. Consumers must update `package.json` and all `import` paths.

  Also includes: public **registry.npmjs.org** publishing (no GitHub Packages for this package), optional **`TAG_PUSH_TOKEN`** so tag pushes trigger **Publish**, and docs/handoff updates. Remove legacy `.npmrc` lines such as `@tmi-apps:registry=https://npm.pkg.github.com` when migrating.

## 0.4.6

### Patch Changes

- [`02ac313`](https://github.com/TMI-apps/tmi-ui/commit/02ac313b7d9e1526ba816feca72a0159a1334634) Thanks [@TilBardaga](https://github.com/TilBardaga)! - Publish to the **public npm registry** (registry.npmjs.org) instead of GitHub Packages. Consumers can install `@tmi-apps/ui` without GitHub Packages authentication. Maintainer setup: npm publish access for `@tmi-apps`, GitHub secret `NPM_TOKEN` and/or Trusted Publishing (OIDC); consuming apps should remove legacy `.npmrc` / `GH_PACKAGES_READ_TOKEN` if only needed for this package—see docs.

## 0.4.5

### Patch Changes

- [`00da4d3`](https://github.com/TMI-apps/tmi-ui/commit/00da4d3a0d53ac07b58c62af22dad06e0ffe272f) Thanks [@TilBardaga](https://github.com/TilBardaga)! - Automate git tag push after Version packages bumps version on main (fallback manual tag documented).

## 0.4.4

### Patch Changes

- [`fa90e9e`](https://github.com/TMI-apps/tmi-ui/commit/fa90e9e40bddb2161a9ff594864412d9e350140e) Thanks [@TilBardaga](https://github.com/TilBardaga)! - Open source under MIT (TMI Publishing B.V.). Add SECURITY policy; refresh README and docs for public distribution via GitHub Packages.

## 0.4.3

### Patch Changes

- [`a074ec0`](https://github.com/TMI-apps/tmi-ui/commit/a074ec023bf092d312107e19ea64c03419965ed0) Thanks [@TilBardaga](https://github.com/TilBardaga)! - Add Vitest, Testing Library, ESLint, Prettier, expanded CI, and package tests. Update contributor docs and Cursor workflow skills.

## 0.4.2

### Patch Changes

- [`f777549`](https://github.com/TMI-apps/tmi-ui/commit/f77754905968c28f15d2c6e9b5fb410faf412657) Thanks [@TilBardaga](https://github.com/TilBardaga)! - Improve GitHub Packages consumer docs (cross-repo CI auth, generic install), clarify CONTRIBUTING release checklist, align release-flow and README migration. Add optional Cursor agent skills (`plan`, `implement`, `finish`, `push`, `prime`) and `docs/jobs` for development plans.

## 0.4.1

### Patch Changes

- Emit **Node ESM-safe** relative imports in published `dist` (explicit `.js` extensions and `NodeNext` compile). Fixes Vitest/Node resolution without consumers inlining the package.

## 0.4.0

### Added

- `**PersistentStepperList`\*\* — Checklist with optional per-entity `localStorage` state; parse list-like `instructionText` into main and indented sub-steps; `labels` prop for progress and expand/collapse `aria` (defaults: English); optional `theme.checklist` sizing (see `src/theme.ts`).
- `**textToStepperItems` / `StepItem**` — Parse markdown-style lines to steps for use with the checklist.
- `**usePersistentSteps**` — Generic hook: `localStorage` key `scope:entityId:language`.
- `**PersistentStepperStepItem**` — Exported for advanced layout use.

## 0.3.0

### Minor Changes

- `[15049c4](https://github.com/TMI-apps/tmi-ui/commit/15049c4237499a7ad06c1ae6bcdb5fc8b5b59839)` Thanks [@TilBardaga](https://github.com/TilBardaga)! - **Package home is now this repository.**
  `@tmi-apps/ui` (package name at the time; now **`@tmi-packages/ui`**) is maintained and published from [TMI-apps/tmi-ui](https://github.com/TMI-apps/tmi-ui). Install from **GitHub Packages** (see [docs/installation.md](docs/installation.md)). No breaking changes to component APIs or peer dependency ranges.

All notable changes to `@tmi-packages/ui` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Documentation

- Initial setup: this package is developed and released from [TMI-apps/tmi-ui](https://github.com/TMI-apps/tmi-ui). Install via **GitHub Packages** — see [docs/installation.md](docs/installation.md). The `0.3.0` release will document the repository move in the changelog entry (applied by Changesets).

## [0.2.0] - 2026-04-20

### Added

- `**VideoEmbedModal` — Modal that embeds YouTube or Vimeo in a responsive 16:9 iframe (privacy-enhanced `youtube-nocookie.com` for YouTube, autoplay on open). Returns `null` for unsupported URLs. `closeAriaLabel` prop for localization (default `"Close"`).
- **Peer dependency:** `@mui/icons-material ^7.3.6` (close icon).

## [0.1.2] - 2026-04-19

### Fixed

- `**ThumbnailPill` tooltip — Uses `disableInteractive`, 600 ms delays, and `pointerEvents: "none"` so the tooltip does not stick when moving the pointer onto it.

## [0.1.1] - 2026-04-19

### Changed

- `**ThumbnailPill` — Reads optional `theme.palette.primary.surface` / `surfaceHover` with `alpha(primary.main, 0.08 / 0.12)` fallback.
- **Layout** — Circle-side padding 2 px for symmetry; bare-text sides without circle/`rightSlot` use 12 px horizontal padding.

## [0.1.0] - 2026-04-19

### Added

- Initial release: `**ThumbnailPill` with optional `react-router-dom` `Link` when `to` is set.
- MUI theme augmentation: `theme.thumbnailPill` sizing; optional `theme.palette.primary.surface` / `surfaceHover` on `PaletteColor`.
