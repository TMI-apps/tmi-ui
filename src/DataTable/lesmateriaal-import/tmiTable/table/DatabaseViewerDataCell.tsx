import { Box, TableCell } from "@mui/material";
import {
  flexRender,
  type Cell,
  type Row,
  type Table as TanStackTableType,
} from "@tanstack/react-table";
import type { DatabaseViewerColumnMeta } from "../../shared-types/tmiTableMeta.types.js";
import type { TableInteractionSkinPreset } from "../../shared-theme/tableInteractionSkin.js";
import {
  getDatabaseViewerBodyTableCellSx,
  getDatabaseViewerFullHeightCellInnerSx,
} from "./databaseViewerBodyCellSx.js";
import type { DatabaseViewerDataRowReorderHandleProps } from "./DatabaseViewerDataRowReorderHandle.types.js";
import { DatabaseViewerTreeCellContent } from "./DatabaseViewerTreeCellContent.js";
import { getLeadingContentShiftDepth } from "./databaseViewerTableModelUtils.js";

export interface DatabaseViewerDataCellProps<TData extends object> {
  cell: Cell<TData, unknown>;
  row: Row<TData>;
  index: number;
  cellStartPx: number;
  visibleCellCount: number;
  isDragOver: boolean;
  rowSavePending: boolean;
  treeRowIndentBoundaryIndex: number;
  table: TanStackTableType<TData>;
  treeRowExpandableOverride?: (row: Row<TData>) => boolean;
  onTreeRowWillExpand?: (row: Row<TData>) => boolean | Promise<boolean>;
  treeRowPartiallyExpanded?: (row: Row<TData>) => boolean;
  interactionSkinPreset: TableInteractionSkinPreset;
  /** Tree column reorder drag-handle (`@dnd-kit/core`). */
  reorderTreeDragHandle?: DatabaseViewerDataRowReorderHandleProps;
}

export function DatabaseViewerDataCell<TData extends object>({
  cell,
  row,
  index,
  cellStartPx,
  visibleCellCount,
  isDragOver,
  rowSavePending,
  treeRowIndentBoundaryIndex,
  table,
  treeRowExpandableOverride,
  onTreeRowWillExpand,
  treeRowPartiallyExpanded,
  interactionSkinPreset,
  reorderTreeDragHandle,
}: DatabaseViewerDataCellProps<TData>) {
  const meta = cell.column.columnDef.meta as
    | DatabaseViewerColumnMeta
    | undefined;
  const renderedCell = flexRender(
    cell.column.columnDef.cell,
    cell.getContext(),
  );
  const leadingContentShiftDepth = getLeadingContentShiftDepth({
    rowDepth: row.depth,
    cellIndex: index,
    treeRowIndentBoundaryIndex,
    meta,
  });

  const inner = (
    <Box
      sx={getDatabaseViewerFullHeightCellInnerSx({
        meta,
        interactionSkinPreset,
        leadingContentShiftDepth,
        clipLeadingRowCorner: leadingContentShiftDepth > 0 && index === 0,
      })}
    >
      {meta?.isTreeColumn ? (
        <DatabaseViewerTreeCellContent
          row={row}
          table={table}
          treeRowExpandableOverride={treeRowExpandableOverride}
          onTreeRowWillExpand={onTreeRowWillExpand}
          treeRowPartiallyExpanded={treeRowPartiallyExpanded}
          reorderTreeDragHandle={reorderTreeDragHandle}
        >
          {renderedCell}
        </DatabaseViewerTreeCellContent>
      ) : (
        renderedCell
      )}
    </Box>
  );

  return (
    <TableCell
      sx={getDatabaseViewerBodyTableCellSx({
        cell,
        index,
        cellStartPx,
        visibleCellCount,
        isDragOver,
        rowDepth: row.depth,
        rowSavePending,
        treeRowIndentBoundaryIndex,
        leadingContentShiftDepth,
      })}
    >
      {inner}
    </TableCell>
  );
}
