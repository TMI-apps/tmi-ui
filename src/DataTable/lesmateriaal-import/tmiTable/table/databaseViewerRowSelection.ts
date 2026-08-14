import type { RowSelectionState } from "@tanstack/react-table";

export interface DatabaseViewerRowSelectionClick {
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}

/** Visible flattened rows (TanStack row model) for Shift-range selection. */
export function buildShiftRangeRowSelection(
  visibleRowIds: readonly string[],
  anchorRowId: string | null,
  targetRowId: string,
  previousSelection: RowSelectionState,
): RowSelectionState {
  if (!anchorRowId) {
    return { [targetRowId]: true };
  }
  const anchorIdx = visibleRowIds.indexOf(anchorRowId);
  const targetIdx = visibleRowIds.indexOf(targetRowId);
  if (anchorIdx < 0 || targetIdx < 0) {
    return { ...previousSelection, [targetRowId]: true };
  }
  const start = Math.min(anchorIdx, targetIdx);
  const end = Math.max(anchorIdx, targetIdx);
  const next: RowSelectionState = { ...previousSelection };
  for (let i = start; i <= end; i++) {
    next[visibleRowIds[i]!] = true;
  }
  return next;
}

export function buildModifierToggleRowSelection(
  rowId: string,
  previousSelection: RowSelectionState,
): RowSelectionState {
  const next = { ...previousSelection };
  if (next[rowId]) {
    delete next[rowId];
  } else {
    next[rowId] = true;
  }
  return next;
}

export function buildPlainClickRowSelection(rowId: string): RowSelectionState {
  return { [rowId]: true };
}

export function resolveDatabaseViewerRowSelectionFromClick(args: {
  rowId: string;
  click: DatabaseViewerRowSelectionClick;
  visibleRowIds: readonly string[];
  anchorRowId: string | null;
  previousSelection: RowSelectionState;
}): {
  selection: RowSelectionState;
  nextAnchorRowId: string;
  openDetail: boolean;
} {
  const { rowId, click, visibleRowIds, anchorRowId, previousSelection } = args;

  if (click.shiftKey) {
    return {
      selection: buildShiftRangeRowSelection(
        visibleRowIds,
        anchorRowId,
        rowId,
        previousSelection,
      ),
      nextAnchorRowId: rowId,
      openDetail: false,
    };
  }

  if (click.ctrlKey || click.metaKey) {
    return {
      selection: buildModifierToggleRowSelection(rowId, previousSelection),
      nextAnchorRowId: rowId,
      openDetail: false,
    };
  }

  return {
    selection: buildPlainClickRowSelection(rowId),
    nextAnchorRowId: rowId,
    openDetail: true,
  };
}
