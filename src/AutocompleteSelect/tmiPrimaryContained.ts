import type { CSSObject, PaletteMode, Theme } from "@mui/material/styles";
import { getTableInteractionSkin } from "../DataTable/lesmateriaal-import/shared-theme/tableInteractionSkin.js";

export interface TmiPrimaryContainedTokens {
  gradient: string;
  restShadow: string;
  activeShadow: string;
}

/** Defaults for `createTmiTableTheme` and runtime fallback when the factory was not used. */
export function buildTmiPrimaryContainedTokens(
  mode: PaletteMode,
  primaryMain: string,
): TmiPrimaryContainedTokens {
  return {
    gradient: primaryMain,
    restShadow:
      mode === "dark"
        ? "0 3px 5px 2px rgba(0, 0, 0, 0.4)"
        : "0 2px 6px 2px rgba(0, 0, 0, 0.12)",
    activeShadow:
      mode === "dark"
        ? "0 2px 4px 1px rgba(0, 0, 0, 0.5)"
        : "0 1px 3px 1px rgba(0, 0, 0, 0.16)",
  };
}

export function resolveTmiPrimaryContained(
  theme: Theme,
): TmiPrimaryContainedTokens {
  return (
    theme.tmiPrimaryContained ??
    buildTmiPrimaryContainedTokens(
      theme.palette.mode,
      theme.palette.primary.main,
    )
  );
}

/**
 * Outer shell shared by `PrimaryContainedAutocompleteBar`,
 * `ListRowAddButton` `visualVariant="primary"`, and the TMITable create row.
 */
export function tmiPrimaryContainedRowShellSx(
  theme: Theme,
  options?: { heightPx?: number },
): CSSObject {
  const skin = getTableInteractionSkin(theme, "lightweight");
  const contained = resolveTmiPrimaryContained(theme);
  const h = options?.heightPx ?? skin.rowMinHeightPx;
  const r = `${skin.rowBorderRadiusPx}px`;
  return {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 0,
    width: "100%",
    minHeight: h,
    minWidth: 0,
    m: 0,
    padding: 0,
    borderRadius: r,
    overflow: "hidden",
    boxSizing: "border-box" as const,
    boxShadow: contained.restShadow,
    background: contained.gradient,
    backgroundSize: "200% 200%",
    backgroundPosition: "0% 50%",
    color: theme.palette.common.white,
    textTransform: "none" as const,
    fontSize: theme.typography.body2.fontSize ?? "0.875rem",
    fontWeight:
      theme.typography.body2.fontWeight ??
      theme.typography.fontWeightRegular ??
      400,
    lineHeight: 1,
  };
}
