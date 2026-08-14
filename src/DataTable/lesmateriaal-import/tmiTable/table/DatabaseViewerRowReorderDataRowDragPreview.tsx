import { alpha, Box, Table, TableBody } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { Row, Table as TanStackTableType } from "@tanstack/react-table";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { CSSProperties, DragEventHandler, ReactElement } from "react";
import type { TableInteractionSkinPreset } from "../../shared-theme/tableInteractionSkin.js";
import type { DatabaseViewerRowFileDrop } from "./databaseViewerRowFileDrop.js";
import { DatabaseViewerColumnGroup } from "./DatabaseViewerColumnGroup.js";
import { DatabaseViewerDataRow } from "./DatabaseViewerDataRow.js";
import type { DatabaseViewerDataRowReorderHandleProps } from "./DatabaseViewerDataRowReorderHandle.types.js";
import { buildDatabaseViewerBodyDataRowProps } from "./databaseViewerBodyDataRowProps.js";
import type { DatabaseViewerRowClickMeta } from "./useDatabaseViewerBodyRowInteractions.js";

/** Visual-only handle on the drag mirror (no `@dnd-kit` listeners — pointer follows overlay). */
const REORDER_OVERLAY_TREE_HANDLE: DatabaseViewerDataRowReorderHandleProps = {
  setActivatorNodeRef: () => {},
  disabled: false,
  /** Inert mirror — not registered as a draggable node. */
  attributes: {} as DraggableAttributes,
  listeners: undefined,
};

export interface DatabaseViewerRowReorderDataRowDragPreviewProps<
  TData extends object,
> {
  row: Row<TData>;
  table: TanStackTableType<TData>;
  bodyTableSx: SxProps<Theme>;
  tableColumnSizeStyle: CSSProperties;
  rowDropEnabled: boolean;
  rowFileDrop?: DatabaseViewerRowFileDrop<TData>;
  dragOverRowId: string | null;
  getRowDataAttributes?: (row: TData) => Record<string, string | undefined>;
  rowIsClickable: boolean;
  rowIntentEnabled: boolean;
  onRowIntent?: (row: TData) => void;
  handleRowClick: (row: TData, meta?: DatabaseViewerRowClickMeta) => void;
  handleRowDragOver: DragEventHandler<HTMLTableRowElement>;
  handleRowDragLeave: DragEventHandler<HTMLTableRowElement>;
  handleRowDrop: DragEventHandler<HTMLTableRowElement>;
  treeRowExpandableOverride?: (row: Row<TData>) => boolean;
  onTreeRowWillExpand?: (row: Row<TData>) => boolean | Promise<boolean>;
  treeRowPartiallyExpanded?: (row: Row<TData>) => boolean;
  interactionSkinPreset: TableInteractionSkinPreset;
  rowSavePending?: (row: TData) => boolean;
}

/**
 * Single-row table preview for `DragOverlay`: matches live `DatabaseViewerDataRow` cells and
 * column widths without participating in sortable transforms.
 */
export function DatabaseViewerRowReorderDataRowDragPreview<
  TData extends object,
>(props: DatabaseViewerRowReorderDataRowDragPreviewProps<TData>): ReactElement {
  const {
    row,
    table,
    bodyTableSx,
    tableColumnSizeStyle,
    rowDropEnabled,
    rowFileDrop,
    dragOverRowId,
    getRowDataAttributes,
    rowIsClickable,
    rowIntentEnabled,
    onRowIntent,
    handleRowClick,
    handleRowDragOver,
    handleRowDragLeave,
    handleRowDrop,
    treeRowExpandableOverride,
    onTreeRowWillExpand,
    treeRowPartiallyExpanded,
    interactionSkinPreset,
    rowSavePending,
  } = props;

  const rowProps = buildDatabaseViewerBodyDataRowProps({
    row,
    rowDropEnabled,
    rowFileDrop,
    dragOverRowId,
    getRowDataAttributes,
    rowIsClickable,
    rowIntentEnabled,
    onRowIntent,
    handleRowClick,
    handleRowDragOver,
    handleRowDragLeave,
    handleRowDrop,
    table,
    treeRowExpandableOverride,
    onTreeRowWillExpand,
    treeRowPartiallyExpanded,
    interactionSkinPreset,
    rowSavePending,
  });

  return (
    <Box
      sx={{
        cursor: "grabbing",
        pointerEvents: "none",
        maxWidth: "calc(100vw - 32px)",
        filter: (theme: Theme) =>
          theme.palette.mode === "dark"
            ? `drop-shadow(0 8px 20px ${alpha(theme.palette.common.black, 0.38)})`
            : `drop-shadow(0 8px 22px ${alpha(theme.palette.common.black, 0.08)})`,
      }}
    >
      <Table
        size="small"
        sx={bodyTableSx}
        style={tableColumnSizeStyle}
        aria-hidden
      >
        <DatabaseViewerColumnGroup table={table} />
        <TableBody>
          <DatabaseViewerDataRow
            {...rowProps}
            reorderTreeDragHandle={REORDER_OVERLAY_TREE_HANDLE}
            tableRowSx={{ cursor: "grabbing" }}
          />
        </TableBody>
      </Table>
    </Box>
  );
}
