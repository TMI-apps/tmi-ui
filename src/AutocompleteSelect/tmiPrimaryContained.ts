import type { PaletteMode, Theme } from "@mui/material/styles";

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
