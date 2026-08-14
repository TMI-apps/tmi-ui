import { alpha, type Theme } from "@mui/material/styles";
import { TABLE_ROW_CORNER_RADIUS_PX } from "./defaultTheme.js";
import {
  fileDropTargetActiveBackground,
  fileDropTargetHoverBackground,
  fileDropTargetLightweightHoverBackground,
} from "./fileDropTarget.js";
import {
  searchFieldMutedBackground,
  searchFieldMutedBackgroundLightweight,
  searchFieldMutedHoverBackground,
} from "./interactiveSurfaces.js";

export type TableInteractionSkinPreset = "default" | "lightweight";

export interface TableInteractionSkin {
  rowBackground: string;
  rowHoverBackground: string;
  rowSelectedBackground: string;
  rowSelectedHoverBackground: string;
  rowDragBackground: string;
  rowDragHoverBackground: string;
  rowMinHeightPx: number;
  rowBorderRadiusPx: number;
  iconSurrogateHoverBackground: string;
}

function buildDefaultSkin(theme: Theme): TableInteractionSkin {
  return {
    rowBackground: searchFieldMutedBackground(theme),
    rowHoverBackground: searchFieldMutedHoverBackground(theme),
    rowSelectedBackground: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity,
    ),
    rowSelectedHoverBackground: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity +
        theme.palette.action.hoverOpacity * 0.5,
    ),
    rowDragBackground: fileDropTargetActiveBackground(theme, "default"),
    rowDragHoverBackground: fileDropTargetHoverBackground(theme),
    rowMinHeightPx: 36,
    rowBorderRadiusPx: TABLE_ROW_CORNER_RADIUS_PX,
    iconSurrogateHoverBackground: alpha(
      theme.palette.primary.main,
      theme.palette.action.hoverOpacity * 1.5,
    ),
  };
}

function buildLightweightSkin(theme: Theme): TableInteractionSkin {
  return {
    rowBackground: searchFieldMutedBackgroundLightweight(theme),
    rowHoverBackground: searchFieldMutedHoverBackground(theme),
    rowSelectedBackground: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity,
    ),
    rowSelectedHoverBackground: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity +
        theme.palette.action.hoverOpacity * 0.5,
    ),
    rowDragBackground: fileDropTargetActiveBackground(theme, "lightweight"),
    rowDragHoverBackground: fileDropTargetLightweightHoverBackground(theme),
    rowMinHeightPx: 34,
    rowBorderRadiusPx: TABLE_ROW_CORNER_RADIUS_PX,
    iconSurrogateHoverBackground: alpha(
      theme.palette.primary.main,
      theme.palette.action.hoverOpacity,
    ),
  };
}

export function getTableInteractionSkin(
  theme: Theme,
  preset: TableInteractionSkinPreset,
): TableInteractionSkin {
  if (preset === "lightweight") return buildLightweightSkin(theme);
  return buildDefaultSkin(theme);
}
