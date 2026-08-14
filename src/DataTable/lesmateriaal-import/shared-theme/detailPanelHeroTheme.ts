import type { PaletteMode } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { detailPanelMetaLabelColor } from "./detailPanelMetaTokens.js";

/** Subset of app palette rows used to derive hero tokens (matches `getTokens` in defaultTheme). */
export type DetailPanelHeroPaletteSlice = {
  background: { default: string; paper: string };
  text: { primary: string; secondary: string };
  tableRowLine: string;
};

/**
 * Visual tokens for `DetailPanelHeroHeader` (detail drawers + stack panes).
 * Declared on the MUI theme so light/dark stay consistent with the rest of the app.
 */
export interface DetailPanelHeroTokens {
  overlay: {
    iconButtonPx: number;
    iconBorderRadiusPx: number;
    iconBg: string;
    iconBorder: string;
    iconColor: string;
    /** Disabled rail icons: MUI stacks `action.disabled` × `disabledOpacity`; override reads clearly on frosted hero. */
    iconDisabledColor: string;
    iconHoverBg: string;
    railInsetPx: number;
    backdropBlurPx: number;
  };
  hero: {
    minHeightPx: number;
    /** Image readability overlay: weakest darken at hero top (“clear” cover). */
    gradientTopAlpha: number;
    /** Mid-hero darken (lighter than peak so big title/subtitle stay relatively open). */
    gradientMidAlpha: number;
    /** Stop % (`0–100`) between top and peak. */
    gradientMidStopPercent: number;
    /** Strongest darken near hero bottom / stats handoff seam. */
    gradientPeakAlpha: number;
    /** Stop % (`0–100`) for peak darkness (just above fading to transparent toward hero bottom). */
    gradientPeakStopPercent: number;
    fallbackBg: string;
    contentPaddingTopPx: number;
    titleBlockPaddingX: { xs: number; sm: number };
    bottomSlotPaddingTopPx: number;
    /** Space below the status / version row inside the hero (before stats strip overlap). */
    bottomSlotMarginBottomPx: number;
    /** Bottom padding of the hero text column (above stats straddle). */
    contentPaddingBottomPx: number;
    /**
     * Gaussian blur on the hero cover image (small optimised thumbnails pixelate at full width).
     * Paired with {@link thumbnailUpscale} so soft edges stay outside the clipped hero.
     */
    thumbnailBlurPx: number;
    /** Scale > 1 applied with the blur so the visible rect stays filled after filtering. */
    thumbnailUpscale: number;
    /** Mask on the photo/placeholder stack — long fade so the image dissolves lower on the pane. */
    imageFadeMask: string;
  };
  /**
   * Full-bleed panel-colored layer between scrolling body and the hero image.
   * Tighter vertical fade than `hero.imageFadeMask` so body content is swallowed earlier, roughly behind the status row.
   */
  contentScrim: {
    fadeMask: string;
  };
  bottomMeta: {
    mutedFg: string;
    separatorColor: string;
  };
  /** Hero bottom status row (inline with version control) — matches drawer mock `.status-bar` / `.sep`. */
  statusBar: {
    gapPx: number;
    rowGapPx: number;
    fontSizePx: number;
    fontWeight: number;
    /** Primary label color on the hero (mock: rgba(255,255,255,0.85)). */
    primaryFg: string;
    /** Line height for status row labels (mock body-ui rhythm). */
    labelLineHeight: number;
    /** Status dot diameter (mock `.status-live .pulse` and `StatusIndicator`). */
    indicatorDotPx: number;
    /** Dot separators between segments (mock: 3px, rgba(255,255,255,0.35)). */
    sepSizePx: number;
    sepBg: string;
    /** “Versies: …” control — matches mock `.versions-btn`. */
    versionsButton: {
      border: string;
      bg: string;
      hoverBg: string;
      minHeightPx: number;
      fontSizePx: number;
      fontWeight: number;
      endIconSizePx: number;
      horizontalPaddingPx: number;
      maxWidthPx: number;
      borderRadiusPx: number;
      lineHeight: number;
    };
    /** Pulsing ring for hero `Live` status (mock `.status-live .pulse`). */
    livePulse: {
      ringSpreadPx: number;
      shadowStartAlpha: number;
      durationSec: number;
    };
    /**
     * Status dot + tinted labels when `heroMetaRow` (`StatusIndicator` on cover).
     * Values match MUI **`palette.mode: 'dark'`** `success.main` / `warning.main` / `text.disabled`
     * (`#66bb6a`, `#ffa726`, …) so the header stays on dark‑mode semantics while the global app toggles theme.
     */
    heroStatusSemantics: {
      successMain: string;
      warningMain: string;
      defaultDot: string;
    };
  };
  statsStrip: {
    /**
     * Bottom clearance reserved inside the hero when a stats strip is present.
     * The strip is visually centered on the hero/body boundary with translateY(-50%);
     * this prevents dynamic stats heights from colliding with title/status content.
     */
    overlapSafeZonePx: number;
    paddingYPx: number;
    paddingXPx: number;
    /** Horizontal padding inside each stat cell (mock `.stat`: 16px). */
    cellPaddingXPx: number;
    borderRadiusPx: number;
    background: string;
    /** Card outline (mock `.stats`: 1px solid rgba(255,255,255,0.10)). */
    border: string;
    /** Vertical rules between cells (mock `.stat`: border-right 1px rgba(255,255,255,0.06)). */
    itemSeparatorBorder: string;
    shadow: string;
    labelColor: string;
    valueColor: string;
    minItemMinWidthPx: number;
    /** Label + value weight in strip (mock `.stat` / semibold). */
    statFontWeight: number;
    /**
     * Max lines for the value row before ellipsis; full value on hover via tooltip when truncated.
     */
    valueMaxLines: number;
    /**
     * Hard cap on strip card height so the straddling card cannot grow into the scroll body.
     * Sized for strip padding + label + {@link valueMaxLines} of body2 + edit-mode cell vertical padding.
     */
    maxHeightPx: number;
  };
  scrollBody: {
    paddingTopPx: number;
    paddingXPx: number;
    paddingBottomPx: number;
  };
}

/** Dark overlay on hero thumbnails: light top → mid → peak near stats seam → transparent at hero bottom. */
export function heroReadabilityGradientCss(
  black: string,
  hero: Pick<
    DetailPanelHeroTokens["hero"],
    | "gradientTopAlpha"
    | "gradientMidAlpha"
    | "gradientMidStopPercent"
    | "gradientPeakAlpha"
    | "gradientPeakStopPercent"
  >,
): string {
  const top = alpha(black, hero.gradientTopAlpha);
  const mid = alpha(black, hero.gradientMidAlpha);
  const peak = alpha(black, hero.gradientPeakAlpha);
  return `linear-gradient(to bottom, ${top} 0%, ${mid} ${hero.gradientMidStopPercent}%, ${peak} ${hero.gradientPeakStopPercent}%, transparent 100%)`;
}

/* Light and dark surfaces differ: scrim-on-photo remains readable in both modes. */
/* eslint-disable-next-line complexity -- parallel light/dark token branches */
export function buildDetailPanelHeroTokens(
  mode: PaletteMode,
  C: DetailPanelHeroPaletteSlice,
): DetailPanelHeroTokens {
  const isDark = mode === "dark";
  const scrim = isDark ? "rgb(7, 6, 20)" : "rgb(18, 18, 30)";
  return {
    overlay: {
      iconButtonPx: 36,
      iconBorderRadiusPx: 18,
      iconBg: alpha(scrim, isDark ? 0.55 : 0.45),
      iconBorder: alpha("#ffffff", isDark ? 0.08 : 0.38),
      iconColor: "#FFFFFF",
      // Frosted hero: avoid MUI disabled icon × disabledOpacity (near-invisible). Use muted white only.
      iconDisabledColor: alpha("#ffffff", isDark ? 0.58 : 0.48),
      iconHoverBg: alpha(scrim, isDark ? 0.85 : 0.7),
      railInsetPx: 16,
      backdropBlurPx: 8,
    },
    hero: {
      minHeightPx: 220,
      gradientTopAlpha: isDark ? 0.16 : 0.2,
      gradientMidAlpha: isDark ? 0.42 : 0.48,
      gradientMidStopPercent: 48,
      gradientPeakAlpha: isDark ? 0.84 : 0.88,
      gradientPeakStopPercent: 82,
      fallbackBg: alpha(isDark ? "#0a0a12" : "#1a1a24", isDark ? 0.92 : 0.88),
      contentPaddingTopPx: 56,
      /** Match detail scroll gutter (drawer mock body uses 28px horizontal). */
      titleBlockPaddingX: { xs: 24, sm: 28 },
      bottomSlotPaddingTopPx: 10,
      /** Space below live/edit/version row before hero bottom padding (stats straddles there). */
      bottomSlotMarginBottomPx: 10,
      contentPaddingBottomPx: 12,
      thumbnailBlurPx: 3,
      thumbnailUpscale: 1.08,
      imageFadeMask:
        "linear-gradient(to bottom, #000 0%, #000 70%, rgba(0,0,0,0.75) 80%, rgba(0,0,0,0.35) 90%, transparent 100%)",
    },
    contentScrim: {
      fadeMask:
        "linear-gradient(to bottom, #000 0%, #000 85%, rgba(0,0,0,0.96) 90%, rgba(0,0,0,0.55) 95%, transparent 100%)",
    },
    bottomMeta: {
      mutedFg: alpha(C.text.primary, isDark ? 0.72 : 0.75),
      separatorColor: alpha(C.text.primary, isDark ? 0.22 : 0.18),
    },
    statusBar: {
      gapPx: 14,
      rowGapPx: 10,
      fontSizePx: 12,
      fontWeight: 600,
      primaryFg: alpha("#ffffff", 0.85),
      labelLineHeight: 1.45,
      indicatorDotPx: 8,
      sepSizePx: 3,
      sepBg: alpha("#ffffff", 0.35),
      versionsButton: {
        border: alpha("#ffffff", 0.15),
        bg: alpha("#ffffff", 0.1),
        hoverBg: alpha("#ffffff", 0.16),
        minHeightPx: 26,
        fontSizePx: 12,
        fontWeight: 600,
        endIconSizePx: 12,
        horizontalPaddingPx: 10,
        maxWidthPx: 220,
        borderRadiusPx: 9999,
        lineHeight: 1,
      },
      livePulse: {
        ringSpreadPx: 8,
        shadowStartAlpha: 0.65,
        durationSec: 2,
      },
      heroStatusSemantics: {
        successMain: "#66bb6a",
        warningMain: "#ffa726",
        defaultDot: "rgba(255, 255, 255, 0.5)",
      },
    },
    statsStrip: {
      /** Clears title/meta from the stats card when it grows; keep modest to avoid a tall meta↔stats gap. */
      overlapSafeZonePx: 36,
      paddingYPx: 14,
      paddingXPx: 4,
      cellPaddingXPx: 16,
      borderRadiusPx: 14,
      background: C.background.paper,
      border: `1px solid ${alpha(C.text.primary, isDark ? 0.12 : 0.12)}`,
      itemSeparatorBorder: `1px solid ${alpha(C.text.primary, isDark ? 0.06 : 0.08)}`,
      shadow: isDark
        ? "0 12px 40px rgba(0,0,0,0.22)"
        : "0 10px 32px rgba(7, 6, 20, 0.08)",
      /** Mock `.stat .k` / `--fg-3` — shared with {@link detailFieldLabelSx}. */
      labelColor: detailPanelMetaLabelColor(mode),
      valueColor: C.text.primary,
      minItemMinWidthPx: 72,
      statFontWeight: 600,
      valueMaxLines: 2,
      maxHeightPx: (() => {
        const paddingYPx = 14;
        const valueMaxLines = 2;
        const captionLinePx = Math.ceil(12 * 1.3);
        const valueMarginTopPx = 2;
        const valueLineBoxPx = 20;
        return (
          paddingYPx * 2 +
          captionLinePx +
          valueMarginTopPx +
          valueMaxLines * valueLineBoxPx +
          6
        );
      })(),
    },
    /** Drawer mock `.body`: padding 24px 28px (vertical / horizontal). */
    scrollBody: {
      /**
       * Initial / fallback top inset before {@link DetailPanelHeroHeader} measures the painted hero bottom;
       * `TMITableDetailEditPanel` then uses the measured value for `pt`.
       */
      paddingTopPx: 268,
      paddingXPx: 28,
      paddingBottomPx: 24,
    },
  };
}

declare module "@mui/material/styles" {
  interface Theme {
    detailPanelHero: DetailPanelHeroTokens;
  }
  interface ThemeOptions {
    detailPanelHero?: DetailPanelHeroTokens;
  }
}
