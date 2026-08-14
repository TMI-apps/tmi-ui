import type { SxProps, Theme } from "@mui/material/styles";

import type { DatabaseViewerSurfaceMode } from "./databaseViewerConstants.js";

/**
 * Vertical gap between data rows. Must match `borderSpacing` in {@link getDatabaseViewerBodyTableSx}
 * and the virtualized spacer “bar + gap” pattern in `DatabaseViewer`.
 */
export const DATABASE_VIEWER_BODY_ROW_GAP_PX = 8;

/**
 * Table `width`: TanStack total (px) when horizontally scrolling, or `"100%"` when the column
 * sum fits the block so `table-layout: fixed` can grow columns to fill the wrapper.
 * Kept in sync with `DatabaseViewer` body/header `<Table sx={...}>`.
 */
export function getDatabaseViewerBodyTableSx(
  tableWidth: number | string,
): SxProps<Theme> {
  return {
    tableLayout: "fixed",
    width: tableWidth,
    borderCollapse: "separate",
    borderSpacing: `0 ${DATABASE_VIEWER_BODY_ROW_GAP_PX}px`,
  };
}

export function getDatabaseViewerHeaderTableSx(
  tableWidth: number | string,
): SxProps<Theme> {
  return {
    ...getDatabaseViewerBodyTableSx(tableWidth),
    borderSpacing: "0",
  };
}

/** Sticky header strip + `<th>` fill: opaque so scrolling rows never show through. inherit/transparent/none map to solid `background.default` (not literal CSS inherit). */
export function getDatabaseViewerStickyHeaderBgSx(
  surfaceMode: DatabaseViewerSurfaceMode,
): SxProps<Theme> {
  switch (surfaceMode) {
    case "inherit":
    case "transparent":
    case "none":
      return { bgcolor: "background.default" };
    case "paper":
    default:
      return { bgcolor: "background.paper" };
  }
}

/**
 * Single scroll surface for header + virtualized body: both axes scroll here so native
 * horizontal and vertical scrollbars stay on the viewport edges (no nested overflow-y on wide content).
 */
export function getDatabaseViewerScrollContainerSx(
  hasHorizontalOverflow: boolean,
): SxProps<Theme> {
  return {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    overflow: "auto",
    scrollbarGutter: "stable",
    borderBottom: hasHorizontalOverflow ? 0 : 1,
    borderColor: (theme) => theme.palette.divider,
  };
}

export const databaseViewerTableHeaderLabelCellSx: SxProps<Theme> = {
  borderBottom: "none",
  fontWeight: 600,
};

/** Scope-summary trigger icon next to sort label (avoids raw numeric fontSize in viewer). */
export const databaseViewerScopeSummaryVisibilityIconSx: SxProps<Theme> = {
  fontSize: (theme) => theme.typography.pxToRem(18),
  color: "action.active",
};

const RESIZE_LINE_CLASS = "dbv-column-resize-line";

/** Hit area (wide, invisible) for column resize; pairs with {@link getDatabaseViewerColumnResizeHandleLineSx}. */
export function getDatabaseViewerColumnResizeHandleHitAreaSx(
  isResizing: boolean,
): SxProps<Theme> {
  return {
    position: "absolute",
    right: (theme) => `-${theme.spacing(0.625)}`,
    top: 0,
    height: "100%",
    width: (theme) => theme.spacing(1.25),
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    cursor: "col-resize",
    userSelect: "none",
    touchAction: "none",
    zIndex: 6,
    backgroundColor: "transparent",
    ...(!isResizing
      ? {
          [`&:hover .${RESIZE_LINE_CLASS}`]: {
            width: 3,
            marginLeft: "-1.5px",
            bgcolor: "primary.main",
            opacity: 1,
          },
        }
      : {}),
  };
}

export function getDatabaseViewerColumnResizeLineClassName(): string {
  return RESIZE_LINE_CLASS;
}

/** Always-visible line inside the hit area; use with {@link getDatabaseViewerColumnResizeHandleHitAreaSx}. */
export function getDatabaseViewerColumnResizeHandleLineSx(
  isResizing: boolean,
): SxProps<Theme> {
  return {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    width: 2,
    marginLeft: "-1px",
    bgcolor: "divider",
    opacity: 0.7,
    pointerEvents: "none",
    transition: (theme) =>
      theme.transitions.create(["width", "opacity", "background-color"], {
        duration: theme.transitions.duration.short,
      }),
    ...(isResizing
      ? {
          width: 3,
          marginLeft: "-1.5px",
          bgcolor: "primary.main",
          opacity: 1,
        }
      : {}),
  };
}

/** Scope summary popover content width (fixed dialog-like width). */
export const databaseViewerScopeSummaryPopoverContentSx: SxProps<Theme> = {
  p: 2,
  width: (theme) => theme.spacing(40),
  maxWidth: (theme) => `calc(100vw - ${theme.spacing(4)})`,
};

export const databaseViewerScopeSummaryPopoverSectionTitleSx: SxProps<Theme> = {
  mb: 0.75,
};

export const databaseViewerScopeSummaryPopoverItemGridSx: SxProps<Theme> = {
  display: "grid",
  gap: 0.75,
};

export const databaseViewerScopeSummaryPopoverActionsGridSx: SxProps<Theme> = {
  display: "grid",
  gap: 1,
};

/** Tree column: spacer when row cannot expand (aligns with chevron column). */
export const databaseViewerTreeRowSpacerSx: SxProps<Theme> = {
  width: (theme) => theme.spacing(3.5),
  mr: 0.5,
  flexShrink: 0,
};

export const DATABASE_VIEWER_TREE_ROW_INDENT_SPACING_UNITS = 2;

export function getDatabaseViewerTreeRowIndentCss(
  depth: number,
): (theme: Theme) => string {
  return (theme) =>
    theme.spacing(depth * DATABASE_VIEWER_TREE_ROW_INDENT_SPACING_UNITS);
}

/** Tree column: indent per depth (16px per level at default 8px spacing). */
export function getDatabaseViewerTreeRowIndentSx(
  depth: number,
): SxProps<Theme> {
  return {
    boxSizing: "border-box",
    paddingLeft: getDatabaseViewerTreeRowIndentCss(depth),
  };
}
