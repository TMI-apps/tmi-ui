import { Box, TableCell } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { Header } from "@tanstack/react-table";
import type { MouseEvent, PointerEvent, TouchEvent } from "react";
import {
  databaseViewerTableHeaderLabelCellSx,
  getDatabaseViewerColumnResizeHandleHitAreaSx,
  getDatabaseViewerColumnResizeHandleLineSx,
  getDatabaseViewerColumnResizeLineClassName,
  getDatabaseViewerStickyHeaderBgSx,
} from "./databaseViewerTableStyles.js";
import type { DatabaseViewerColumnMeta } from "../../shared-types/tmiTableMeta.types.js";
import {
  getDatabaseViewerColumnWidthCssValue,
  getDatabaseViewerIconSurrogateWidthSx,
} from "./databaseViewerColumnSizeStyle.js";
import { DatabaseViewerColumnHeaderPrimaryContent } from "./DatabaseViewerColumnHeaderPrimaryContent.js";
import type { DatabaseViewerSurfaceMode } from "./databaseViewerConstants.js";
import { getPinnedCellSx } from "./databaseViewerTableModelUtils.js";

export interface DatabaseViewerColumnHeaderCellProps<TData extends object> {
  header: Header<TData, unknown>;
  /** Matches {@link DatabaseViewer} surface — pinned header cells align with sticky strip fill. */
  surfaceMode?: DatabaseViewerSurfaceMode;
  enableSorting: boolean;
  scopeSummary: { title?: string } | undefined;
  onSummaryOpen: (el: HTMLElement) => void;
  onSortLabelClick: (
    event: MouseEvent<HTMLElement>,
    header: Header<TData, unknown>,
  ) => void;
  onResizeDragStart: (event: MouseEvent | TouchEvent) => void;
  handleHeaderContextMenu: (event: MouseEvent, columnId: string) => void;
  handleHeaderPointerDown: (event: PointerEvent, columnId: string) => void;
  handleHeaderPointerMove: (event: PointerEvent, columnId: string) => void;
  handleHeaderPointerEnd: () => void;
}

/** Column interactions wired only for non-placeholder headers (TanStack placeholders are structural). */
type DatabaseViewerHeaderCellPointerHandlers = {
  handleHeaderContextMenu: (event: MouseEvent, columnId: string) => void;
  handleHeaderPointerDown: (event: PointerEvent, columnId: string) => void;
  handleHeaderPointerMove: (event: PointerEvent, columnId: string) => void;
  handleHeaderPointerEnd: () => void;
};

function getDatabaseViewerHeaderCellInteractionProps<TData extends object>(
  header: Header<TData, unknown>,
  handlers: DatabaseViewerHeaderCellPointerHandlers,
) {
  if (header.isPlaceholder) {
    return {};
  }

  return {
    onContextMenu: (event: MouseEvent) =>
      handlers.handleHeaderContextMenu(event, header.column.id),
    onPointerDown: (event: PointerEvent) =>
      handlers.handleHeaderPointerDown(event, header.column.id),
    onPointerMove: (event: PointerEvent) =>
      handlers.handleHeaderPointerMove(event, header.column.id),
    onPointerUp: handlers.handleHeaderPointerEnd,
    onPointerCancel: handlers.handleHeaderPointerEnd,
  };
}

function DatabaseViewerColumnResizeHandle<TData extends object>({
  header,
  onResizeDragStart,
}: {
  header: Header<TData, unknown>;
  onResizeDragStart: (event: MouseEvent | TouchEvent) => void;
}) {
  if (header.isPlaceholder || !header.column.getCanResize()) {
    return null;
  }

  const isResizing = header.column.getIsResizing();
  const startResize = (event: MouseEvent | TouchEvent) => {
    onResizeDragStart(event);
    header.getResizeHandler()(event);
  };

  return (
    <Box
      data-resize-handle="true"
      onMouseDown={startResize}
      onTouchStart={startResize}
      sx={getDatabaseViewerColumnResizeHandleHitAreaSx(isResizing)}
    >
      <Box
        className={getDatabaseViewerColumnResizeLineClassName()}
        aria-hidden
        sx={getDatabaseViewerColumnResizeHandleLineSx(isResizing)}
      />
    </Box>
  );
}

export function DatabaseViewerColumnHeaderCell<TData extends object>({
  header,
  surfaceMode = "paper",
  enableSorting,
  scopeSummary,
  onSummaryOpen,
  onSortLabelClick,
  onResizeDragStart,
  handleHeaderContextMenu,
  handleHeaderPointerDown,
  handleHeaderPointerMove,
  handleHeaderPointerEnd,
}: DatabaseViewerColumnHeaderCellProps<TData>) {
  const meta = header.column.columnDef.meta as
    | DatabaseViewerColumnMeta
    | undefined;
  const headerWidthCss = getDatabaseViewerColumnWidthCssValue(
    header.column.id,
    () => header.getSize(),
  );
  const interactionProps = getDatabaseViewerHeaderCellInteractionProps(header, {
    handleHeaderContextMenu,
    handleHeaderPointerDown,
    handleHeaderPointerMove,
    handleHeaderPointerEnd,
  });

  return (
    <TableCell
      colSpan={header.colSpan}
      scope={
        header.isPlaceholder
          ? undefined
          : header.subHeaders.length > 0
            ? "colgroup"
            : "col"
      }
      {...interactionProps}
      sx={
        [
          databaseViewerTableHeaderLabelCellSx,
          {
            position: "relative",
            zIndex: 4,
            ...getDatabaseViewerStickyHeaderBgSx(surfaceMode),
            width: headerWidthCss,
            ...(meta?.iconSurrogateCell
              ? getDatabaseViewerIconSurrogateWidthSx(headerWidthCss)
              : {}),
            overflow: "hidden",
            pr: 1,
            cursor: "default",
            transition: "background-color 0.15s ease",
            "& .MuiTableSortLabel-root": {
              borderRadius: 1,
              px: 0.5,
              py: 0.25,
              transition: "color 0.15s ease",
            },
            ...getPinnedCellSx(header.column, true),
          },
        ] as SxProps<Theme>
      }
    >
      <DatabaseViewerColumnHeaderPrimaryContent
        header={header}
        enableSorting={enableSorting}
        scopeSummary={scopeSummary}
        onSummaryOpen={onSummaryOpen}
        onSortLabelClick={(event) => onSortLabelClick(event, header)}
      />
      <DatabaseViewerColumnResizeHandle
        header={header}
        onResizeDragStart={onResizeDragStart}
      />
    </TableCell>
  );
}
