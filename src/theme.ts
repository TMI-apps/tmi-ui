/**
 * MUI theme augmentation for @tmi-apps/ui.
 * Imported for side effects from the package entry so consumers get the
 * augmented `Theme`, `ThemeOptions`, and `PaletteColor` types automatically.
 *
 * Added tokens:
 * - `theme.thumbnailPill.*` — ThumbnailPill sizing
 * - `theme.checklist.*` — PersistentStepperList spacing (optional; component falls back to built-in defaults)
 * - `theme.palette.primary.surface` / `surfaceHover` — mode-aware low-opacity
 *   brand tints for component backgrounds / hover states. Optional; components
 *   should fall back to `alpha(primary.main, ...)` if absent.
 */
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
