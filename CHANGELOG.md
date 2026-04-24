# Changelog

All notable changes to `@tmi-apps/ui` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Documentation

- Initial setup: this package is developed and released from [TMI-apps/tmi-ui](https://github.com/TMI-apps/tmi-ui). Install via **GitHub Packages** — see [docs/installation.md](docs/installation.md). The `0.3.0` release will document the repository move in the changelog entry (applied by Changesets).

## [0.2.0] - 2026-04-20

### Added

- **`VideoEmbedModal`** — Modal that embeds YouTube or Vimeo in a responsive 16:9 iframe (privacy-enhanced `youtube-nocookie.com` for YouTube, autoplay on open). Returns `null` for unsupported URLs. `closeAriaLabel` prop for localization (default `"Close"`).
- **Peer dependency:** `@mui/icons-material ^7.3.6` (close icon).

## [0.1.2] - 2026-04-19

### Fixed

- **`ThumbnailPill` tooltip** — Uses `disableInteractive`, 600 ms delays, and `pointerEvents: "none"` so the tooltip does not stick when moving the pointer onto it.

## [0.1.1] - 2026-04-19

### Changed

- **`ThumbnailPill`** — Reads optional `theme.palette.primary.surface` / `surfaceHover` with `alpha(primary.main, 0.08 / 0.12)` fallback.
- **Layout** — Circle-side padding 2 px for symmetry; bare-text sides without circle/`rightSlot` use 12 px horizontal padding.

## [0.1.0] - 2026-04-19

### Added

- Initial release: **`ThumbnailPill`** with optional `react-router-dom` `Link` when `to` is set.
- MUI theme augmentation: `theme.thumbnailPill` sizing; optional `theme.palette.primary.surface` / `surfaceHover` on `PaletteColor`.
