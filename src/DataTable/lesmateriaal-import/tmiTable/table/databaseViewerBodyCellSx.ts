import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import type { Cell } from "@tanstack/react-table";
import type { DatabaseViewerColumnMeta } from "../../shared-types/tmiTableMeta.types.js";
import { TABLE_ROW_CORNER_RADIUS_PX } from "../../shared-theme/defaultTheme.js";
import { FILE_DROP_TARGET_BORDER_WIDTH_PX } from "../../shared-theme/fileDropTarget.js";
import {
  getTableInteractionSkin,
  type TableInteractionSkinPreset,
} from "../../shared-theme/tableInteractionSkin.js";
import {
  getDatabaseViewerColumnWidthCssValue,
  getDatabaseViewerIconSurrogateWidthSx,
} from "./databaseViewerColumnSizeStyle.js";
import { getPinnedCellSx } from "./databaseViewerTableModelUtils.js";
import {
  DATABASE_VIEWER_TREE_ROW_INDENT_SPACING_UNITS,
  getDatabaseViewerTreeRowIndentCss,
} from "./databaseViewerTableStyles.js";

const fullHeightCellInnerBaseSx = {
  position: "absolute",
  inset: 0,
  display: "flex",
  zIndex: 1,
} as const;

function getDatabaseViewerDataCellCornerRadius(
  isFirst: boolean,
  isLast: boolean,
): number | string {
  if (isFirst) {
    return `${TABLE_ROW_CORNER_RADIUS_PX}px 0 0 ${TABLE_ROW_CORNER_RADIUS_PX}px`;
  }
  if (isLast) {
    return `0 ${TABLE_ROW_CORNER_RADIUS_PX}px ${TABLE_ROW_CORNER_RADIUS_PX}px 0`;
  }
  return 0;
}

function getDatabaseViewerDragAfterSx(
  isFirst: boolean,
  isLast: boolean,
): SxProps<Theme> {
  return {
    content: '""',
    position: "absolute",
    inset: 0,
    boxSizing: "border-box",
    borderRadius: "inherit",
    border: `${FILE_DROP_TARGET_BORDER_WIDTH_PX}px dashed`,
    borderColor: "primary.main",
    pointerEvents: "none",
    ...(isFirst && !isLast && { borderRight: "none" }),
    ...(isLast && !isFirst && { borderLeft: "none" }),
    ...(!isFirst && !isLast && { borderLeft: "none", borderRight: "none" }),
  };
}

function viewerIconColumnWidthConstraints(
  meta: DatabaseViewerColumnMeta | undefined,
  columnWidthCss: string,
): { minWidth: number; maxWidth: string } | undefined {
  if (!meta?.iconSurrogateCell) return undefined;
  return getDatabaseViewerIconSurrogateWidthSx(columnWidthCss);
}

function viewerFullHeightCellBandSx(
  meta: DatabaseViewerColumnMeta | undefined,
): { p: 0; position: "relative"; height: number } | undefined {
  if (!meta?.fullHeightInteractive && !meta?.rowThumbnailCell) return undefined;
  return {
    p: 0,
    position: "relative",
    height: 48,
  };
}

/** Single-line ellipsis for body and tree cells (non-wrapping text). */
export const databaseViewerCellSingleLineEllipsisSx = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
} as const satisfies Record<string, unknown>;

function viewerCellTextFlowSx(
  meta: DatabaseViewerColumnMeta | undefined,
): Record<string, unknown> {
  if (meta?.wrapCellContent) {
    return {
      overflow: "visible",
      textOverflow: "unset",
      whiteSpace: "normal",
      verticalAlign: "middle",
    };
  }
  return { ...databaseViewerCellSingleLineEllipsisSx };
}

function viewerDragOverSx(params: {
  meta: DatabaseViewerColumnMeta | undefined;
  isDragOver: boolean;
  isFirst: boolean;
  isLast: boolean;
}): Record<string, unknown> | undefined {
  const { meta, isDragOver, isFirst, isLast } = params;
  if (!isDragOver) return undefined;
  return {
    ...(meta?.fullHeightInteractive ? {} : { position: "relative" }),
    "&::after": getDatabaseViewerDragAfterSx(isFirst, isLast),
  };
}

function getDatabaseViewerRowSavePendingShadow(theme: Theme): string {
  return `inset 3px 0 0 ${alpha(theme.palette.primary.main, 0.28)}`;
}

function getDatabaseViewerTreeRowIndentPx(
  theme: Theme,
  rowDepth: number,
): number {
  const indent = theme.spacing(
    rowDepth * DATABASE_VIEWER_TREE_ROW_INDENT_SPACING_UNITS,
  );
  const parsed = Number.parseFloat(indent);
  return Number.isFinite(parsed) ? parsed : 0;
}

function cellContainsTreeRowGraphicStart(params: {
  theme: Theme;
  rowDepth: number;
  cellStartPx: number;
  cellWidthPx: number;
}): boolean {
  const { theme, rowDepth, cellStartPx, cellWidthPx } = params;
  const indentPx = getDatabaseViewerTreeRowIndentPx(theme, rowDepth);
  return indentPx >= cellStartPx && indentPx < cellStartPx + cellWidthPx;
}

function viewerCellPaintSx(params: {
  isFirst: boolean;
  isLast: boolean;
  cellStartPx: number;
  cellWidthPx: number;
  rowDepth: number;
  rowSavePending: boolean;
  treeRowIndentBoundaryIndex: number;
}): Record<string, unknown> {
  const {
    isFirst,
    isLast,
    cellStartPx,
    cellWidthPx,
    rowDepth,
    rowSavePending,
    treeRowIndentBoundaryIndex,
  } = params;
  const hasTreeRowIndent = rowDepth > 0 && treeRowIndentBoundaryIndex >= 0;
  if (!hasTreeRowIndent) {
    return {
      backgroundColor: "var(--dbv-row-bg)",
      ...(isFirst && rowSavePending
        ? {
            boxShadow: (theme: Theme) =>
              getDatabaseViewerRowSavePendingShadow(theme),
          }
        : {}),
    };
  }

  return {
    backgroundColor: "transparent",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      bottom: 0,
      left: (theme: Theme) => {
        const indentPx = getDatabaseViewerTreeRowIndentPx(theme, rowDepth);
        return `${Math.max(0, indentPx - cellStartPx)}px`;
      },
      right: 0,
      borderRadius: (theme: Theme) =>
        getDatabaseViewerDataCellCornerRadius(
          cellContainsTreeRowGraphicStart({
            theme,
            rowDepth,
            cellStartPx,
            cellWidthPx,
          }),
          isLast,
        ),
      backgroundColor: "var(--dbv-row-bg)",
      pointerEvents: "none",
      ...(rowSavePending
        ? {
            boxShadow: (theme: Theme) =>
              cellContainsTreeRowGraphicStart({
                theme,
                rowDepth,
                cellStartPx,
                cellWidthPx,
              })
                ? getDatabaseViewerRowSavePendingShadow(theme)
                : undefined,
          }
        : {}),
    },
  };
}

export function getDatabaseViewerBodyTableCellSx<TData extends object>(params: {
  cell: Cell<TData, unknown>;
  index: number;
  cellStartPx: number;
  visibleCellCount: number;
  isDragOver: boolean;
  rowDepth: number;
  rowSavePending: boolean;
  treeRowIndentBoundaryIndex: number;
  leadingContentShiftDepth: number;
}): SxProps<Theme> {
  const {
    cell,
    index,
    cellStartPx,
    visibleCellCount,
    isDragOver,
    rowDepth,
    rowSavePending,
    treeRowIndentBoundaryIndex,
    leadingContentShiftDepth,
  } = params;
  const meta = cell.column.columnDef.meta as
    | DatabaseViewerColumnMeta
    | undefined;
  const isFirst = index === 0;
  const isLast = index === visibleCellCount - 1;
  const columnWidthCss = getDatabaseViewerColumnWidthCssValue(
    cell.column.id,
    () => cell.column.getSize(),
  );
  const cellWidthPx = cell.column.getSize();

  const iconSx = viewerIconColumnWidthConstraints(meta, columnWidthCss);
  const heightBandSx = viewerFullHeightCellBandSx(meta);

  return {
    width: columnWidthCss,
    ...(iconSx ?? {}),
    ...(heightBandSx ?? {}),
    ...viewerCellTextFlowSx(meta),
    ...(leadingContentShiftDepth > 0 ? { overflow: "visible" } : {}),
    ...viewerCellPaintSx({
      isFirst,
      isLast,
      cellStartPx,
      cellWidthPx,
      rowDepth,
      rowSavePending,
      treeRowIndentBoundaryIndex,
    }),
    borderBottom: "none",
    borderRadius: getDatabaseViewerDataCellCornerRadius(isFirst, isLast),
    ...(viewerDragOverSx({ meta, isDragOver, isFirst, isLast }) ?? {}),
    ...getPinnedCellSx(cell.column),
  };
}

export interface DatabaseViewerFullHeightCellInnerSxOptions {
  meta: DatabaseViewerColumnMeta | undefined;
  interactionSkinPreset: TableInteractionSkinPreset;
  leadingContentShiftDepth: number;
  clipLeadingRowCorner: boolean;
}

export function getDatabaseViewerFullHeightCellInnerSx({
  meta,
  interactionSkinPreset,
  leadingContentShiftDepth,
  clipLeadingRowCorner,
}: DatabaseViewerFullHeightCellInnerSxOptions): SxProps<Theme> {
  const leadingShiftSx =
    leadingContentShiftDepth > 0
      ? {
          transform: (theme: Theme) =>
            `translateX(${getDatabaseViewerTreeRowIndentCss(leadingContentShiftDepth)(theme)})`,
        }
      : {};
  const leadingCornerSx = clipLeadingRowCorner
    ? {
        borderRadius: `${TABLE_ROW_CORNER_RADIUS_PX}px 0 0 ${TABLE_ROW_CORNER_RADIUS_PX}px`,
        overflow: "hidden",
      }
    : {};
  if (meta?.isTreeColumn) {
    return fullHeightCellInnerBaseSx;
  }
  if (meta?.rowThumbnailCell) {
    return {
      ...fullHeightCellInnerBaseSx,
      ...leadingShiftSx,
      ...leadingCornerSx,
    };
  }
  if (meta?.iconSurrogateCell) {
    return {
      ...fullHeightCellInnerBaseSx,
      ...leadingShiftSx,
      ...leadingCornerSx,
      alignItems: "center",
      justifyContent: "center",
      transition: (t) =>
        t.transitions.create(["background-color"], {
          duration: t.transitions.duration.short,
        }),
      "&:hover": {
        bgcolor: (theme) =>
          getTableInteractionSkin(theme, interactionSkinPreset)
            .iconSurrogateHoverBackground,
      },
    };
  }
  return {
    ...fullHeightCellInnerBaseSx,
    ...leadingShiftSx,
    ...leadingCornerSx,
    justifyContent: "center",
  };
}
