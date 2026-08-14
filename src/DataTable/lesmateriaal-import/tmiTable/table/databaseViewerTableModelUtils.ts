import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import type {
  Cell,
  Column,
  ColumnDef,
  Row,
  VisibilityState,
} from "@tanstack/react-table";
import type { DatabaseViewerColumnMeta } from "../../shared-types/tmiTableMeta.types.js";

export function getInitialColumnVisibilityFromColumns<TData extends object>(
  columns: Array<ColumnDef<TData, unknown>>,
): VisibilityState {
  const result: VisibilityState = {};
  function walk(cols: Array<ColumnDef<TData, unknown>>) {
    for (const col of cols) {
      const childCols = (col as { columns?: ColumnDef<TData, unknown>[] })
        .columns;
      if (childCols) walk(childCols);
      else if (col.id) {
        const meta = col.meta as DatabaseViewerColumnMeta | undefined;
        if (meta?.defaultHidden === true) result[col.id] = false;
      }
    }
  }
  walk(columns);
  return result;
}

export function getPinnedCellSx<TData extends object>(
  column: Column<TData, unknown>,
  isHeader = false,
): SxProps<Theme> {
  const pinned = column.getIsPinned();
  if (!pinned) return {};

  const edgeColor = (theme: Theme) =>
    theme.palette.mode === "dark"
      ? alpha(theme.palette.common.white, 0.08)
      : alpha(theme.palette.common.black, 0.06);

  // Header fill lives on DatabaseViewerColumnHeaderCell; pinning adds geometry only.
  const bgSx: SxProps<Theme> = isHeader
    ? {}
    : { bgcolor: "background.default" };

  return {
    position: "sticky",
    left: pinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: pinned === "right" ? `${column.getAfter("right")}px` : undefined,
    zIndex: isHeader ? 5 : 2,
    ...bgSx,
    boxShadow: (theme: Theme) =>
      pinned === "left"
        ? `2px 0 0 ${edgeColor(theme)}`
        : pinned === "right"
          ? `-2px 0 0 ${edgeColor(theme)}`
          : undefined,
  };
}

export function treeRowCanExpand<TData extends object>(
  row: Row<TData>,
  treeRowExpandableOverride?: (row: Row<TData>) => boolean,
): boolean {
  if (row.getCanExpand()) return true;
  return (
    treeRowExpandableOverride !== undefined && treeRowExpandableOverride(row)
  );
}

export function getTreeRowIndentBoundaryCellIndex<TData extends object>(
  visibleCells: Array<Cell<TData, unknown>>,
): number {
  let treeColumnIndex = -1;

  for (let index = 0; index < visibleCells.length; index += 1) {
    const meta = visibleCells[index].column.columnDef.meta as
      | DatabaseViewerColumnMeta
      | undefined;
    if (meta?.treeRowIndentBoundary) return index;
    if (meta?.isTreeColumn) treeColumnIndex = index;
  }

  return treeColumnIndex;
}

/** Depth inset for full-height leading cells up to the tree indent boundary (excludes tree column). */
export function getLeadingContentShiftDepth(params: {
  rowDepth: number;
  cellIndex: number;
  treeRowIndentBoundaryIndex: number;
  meta: DatabaseViewerColumnMeta | undefined;
}): number {
  const { rowDepth, cellIndex, treeRowIndentBoundaryIndex, meta } = params;
  if (rowDepth <= 0) return 0;
  if (treeRowIndentBoundaryIndex < 0) return 0;
  if (cellIndex > treeRowIndentBoundaryIndex) return 0;
  if (meta?.isTreeColumn) return 0;
  return rowDepth;
}
