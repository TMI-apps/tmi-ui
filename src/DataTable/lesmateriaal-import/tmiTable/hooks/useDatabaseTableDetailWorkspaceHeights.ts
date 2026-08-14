import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMemo } from "react";

/**
 * Vertical bounds for **`TMITableWorkspace`** when the detail pane is **inline beside** the table (`lg+`).
 * Below `lg`, {@link TMITableWorkspace} shows detail in a `Drawer` instead and overrides sizing to
 * full-height table (`"100%"`) + `fillViewport` via layout context.
 *
 * Call sites **outside** `TMITableWorkspace` (no provider) still use this hook’s `down("lg")` tiers
 * so standalone table `maxHeight` matches the old stacked layout.
 */
export function useDatabaseTableDetailWorkspaceHeights(): {
  panelHeightPx: number | string;
  tableMaxHeightPx: number | string;
  fillViewport: boolean;
} {
  const theme = useTheme();
  const downSm = useMediaQuery(theme.breakpoints.down("sm"));
  const downMd = useMediaQuery(theme.breakpoints.down("md"));
  const downLg = useMediaQuery(theme.breakpoints.down("lg"));

  return useMemo(() => {
    if (downSm) {
      const h = 340;
      return { panelHeightPx: h, tableMaxHeightPx: h, fillViewport: false };
    }
    if (downMd) {
      const h = 420;
      return { panelHeightPx: h, tableMaxHeightPx: h, fillViewport: false };
    }
    if (downLg) {
      const h = 500;
      return { panelHeightPx: h, tableMaxHeightPx: h, fillViewport: false };
    }

    return {
      panelHeightPx: "100%",
      tableMaxHeightPx: "100%",
      fillViewport: true,
    };
  }, [downSm, downMd, downLg]);
}
