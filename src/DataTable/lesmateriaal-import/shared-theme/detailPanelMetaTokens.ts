import type { PaletteMode } from "@mui/material";

/**
 * Micro-label / section-heading foreground for detail + edit-detail panes.
 * Matches drawer mock `--fg-3` (graphite in dark, stone in light).
 */
export const DETAIL_PANEL_META_LABEL_HEX = {
  dark: "#616166",
  light: "#A6A6A8",
} as const;

export function detailPanelMetaLabelColor(mode: PaletteMode): string {
  return mode === "dark"
    ? DETAIL_PANEL_META_LABEL_HEX.dark
    : DETAIL_PANEL_META_LABEL_HEX.light;
}
