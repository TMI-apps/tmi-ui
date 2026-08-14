import type { SxProps, Theme } from "@mui/material/styles";
import { detailPanelMetaLabelColor } from "../shared-theme/detailPanelMetaTokens.js";

/** @deprecated Prefer theme `detailPanelHero.hero.minHeightPx` from {@link createAppThemeOptions}. */
export const DETAIL_HERO_MIN_HEIGHT_PX = 220;

/** Shared detail hero title/subtitle line clamps (multiline ellipsis). */
export const DETAIL_HERO_TITLE_LINE_CLAMP = 3;
export const DETAIL_HERO_SUBTITLE_LINE_CLAMP = 2;

/**
 * Frosted circular icon buttons on detail heroes (drawers + stack panes).
 * Colours come from `theme.detailPanelHero.overlay` (see `defaultTheme.ts`).
 */
export function detailHeroOverlayIconButtonSx(theme: Theme) {
  const h = theme.detailPanelHero.overlay;
  return {
    color: h.iconColor,
    p: 0.5,
    width: h.iconButtonPx,
    height: h.iconButtonPx,
    borderRadius: `${h.iconBorderRadiusPx}px`,
    bgcolor: h.iconBg,
    border: `1px solid ${h.iconBorder}`,
    backdropFilter: `blur(${h.backdropBlurPx}px)`,
    WebkitBackdropFilter: `blur(${h.backdropBlurPx}px)`,
    transition: "background-color 120ms ease",
    "&:hover": { bgcolor: h.iconHoverBg },
    "&.Mui-disabled": {
      opacity: 1,
      color: h.iconDisabledColor,
      WebkitTextFillColor: h.iconDisabledColor,
      bgcolor: h.iconBg,
      border: `1px solid ${h.iconBorder}`,
    },
  } as const;
}

export function detailHeroClampSx(lines: number) {
  return {
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical" as const,
    WebkitLineClamp: lines,
    wordBreak: "break-word" as const,
  };
}

/**
 * Micro-labels for detail bodies and hero stats (Tijdsduur, Materialen, etc.):
 * uppercase, tracked, same foreground as `theme.detailPanelHero.statsStrip.labelColor`.
 */
export function detailFieldLabelSx(theme: Theme): SxProps<Theme> {
  const labelColor =
    theme.detailPanelHero?.statsStrip?.labelColor ??
    detailPanelMetaLabelColor(theme.palette.mode);
  return {
    fontFamily: theme.typography.fontFamily,
    fontSize: "0.6875rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    lineHeight: 1.35,
    textTransform: "uppercase" as const,
    color: labelColor,
  } as const;
}
