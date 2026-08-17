import { createTheme, type Theme } from "@mui/material/styles";
import { buildTmiPrimaryContainedTokens } from "../../../AutocompleteSelect/tmiPrimaryContained.js";
import { buildDetailPanelHeroTokens } from "../shared-theme/detailPanelHeroTheme.js";
import { workspaceDetailDrawerModalZ } from "../shared-theme/workspaceDetailDrawerZIndex.js";

/**
 * Extends a consumer MUI theme with TMI table tokens:
 * `detailPanelHero` (incl. stats-strip meta colors),
 * `tmiTableWorkspace.detailDrawerModalZ` (drawer stacking), and
 * `tmiPrimaryContained` (add-bar / primary row chrome).
 * Row hover/selection still comes from {@link getTableInteractionSkin} (palette-derived).
 */
export function createTmiTableTheme(base: Theme): Theme {
  const detailPanelHero = buildDetailPanelHeroTokens(base.palette.mode, {
    background: {
      default: base.palette.background.default,
      paper: base.palette.background.paper,
    },
    text: {
      primary: base.palette.text.primary,
      secondary: base.palette.text.secondary,
    },
    tableRowLine: base.palette.divider,
  });

  return createTheme(base, {
    detailPanelHero,
    tmiTableWorkspace: {
      detailDrawerModalZ: workspaceDetailDrawerModalZ(base),
    },
    tmiPrimaryContained: buildTmiPrimaryContainedTokens(
      base.palette.mode,
      base.palette.primary.main,
    ),
  });
}
