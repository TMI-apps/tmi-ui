/**
 * MUI theme augmentation for @tmi-packages/ui.
 * Imported for side effects from the package entry so consumers get the
 * augmented `Theme`, `ThemeOptions`, and `PaletteColor` types automatically.
 *
 * Added tokens:
 * - `theme.thumbnailPill.*` — ThumbnailPill sizing
 * - `theme.checklist.*` — PersistentStepperList spacing (optional; component falls back to built-in defaults)
 * - `theme.detailPanelHero` — table detail-hero tokens; apply via `createTmiTableTheme`
 * - `theme.tmiTableWorkspace.detailDrawerModalZ` — workspace detail-drawer stacking; apply via `createTmiTableTheme`
 * - `theme.tmiPrimaryContained` — primary gradient/shadow for Autocomplete add-bars; apply via `createTmiTableTheme`
 * - `theme.palette.primary.surface` / `surfaceHover` — mode-aware low-opacity
 *   brand tints for component backgrounds / hover states. Optional; components
 *   should fall back to `alpha(primary.main, ...)` if absent.
 */
import type { DetailPanelHeroTokens } from "./DataTable/lesmateriaal-import/shared-theme/detailPanelHeroTheme.js";

export {};

declare module "@mui/material/styles" {
  interface Theme {
    thumbnailPill: {
      thumbnailSize: number;
      iconSize: number;
      titleFontSizeXs: number;
      maxWidthAppBar: number;
      pillMaxWidthAppBar: number;
      pillBorderRadius: number;
    };
    /** Filled by `createTmiTableTheme`. Required on Theme after that factory runs. */
    detailPanelHero: DetailPanelHeroTokens;
    /** Filled by `createTmiTableTheme`. Workspace detail-drawer modal z-index. */
    tmiTableWorkspace: {
      detailDrawerModalZ: number;
    };
    /**
     * Filled by `createTmiTableTheme`. Primary contained chrome for
     * `PrimaryContainedAutocompleteBar` and `ListRowAddButton` `visualVariant="primary"`.
     */
    tmiPrimaryContained: {
      gradient: string;
      restShadow: string;
      activeShadow: string;
    };
    checklist?: {
      circleSize: number;
      mainStepGap: number;
      subStepGap: number;
      subItemsPl: number;
      subBulletSize: number;
      circleFontSize: number;
    };
  }

  interface ThemeOptions {
    thumbnailPill?: {
      thumbnailSize?: number;
      iconSize?: number;
      titleFontSizeXs?: number;
      maxWidthAppBar?: number;
      pillMaxWidthAppBar?: number;
      pillBorderRadius?: number;
    };
    checklist?: {
      circleSize?: number;
      mainStepGap?: number;
      subStepGap?: number;
      subItemsPl?: number;
      subBulletSize?: number;
      circleFontSize?: number;
    };
    detailPanelHero?: DetailPanelHeroTokens;
    tmiTableWorkspace?: {
      detailDrawerModalZ?: number;
    };
    tmiPrimaryContained?: {
      gradient?: string;
      restShadow?: string;
      activeShadow?: string;
    };
  }

  interface PaletteColor {
    /** Low-opacity brand tint for component backgrounds (mode-aware). */
    surface?: string;
    /** Low-opacity brand tint for component hover states (mode-aware). */
    surfaceHover?: string;
  }

  interface SimplePaletteColorOptions {
    surface?: string;
    surfaceHover?: string;
  }
}
