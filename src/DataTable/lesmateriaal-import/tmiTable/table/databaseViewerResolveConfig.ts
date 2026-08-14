import type { Row } from "@tanstack/react-table";
import type {
  TMITableDebugConfig,
  TMITableSelectionConfig,
  TMITableTreeConfig,
} from "../../shared-types/tmiTableConfig.types.js";

export interface DatabaseViewerTreePropsSlice<TData extends object> {
  getSubRows?: (row: TData) => TData[] | undefined;
  expandAllOnDataChange?: boolean;
  expandResetKey?: string;
  mergeExpandedRowIds?: Record<string, boolean> | null;
  treeRowExpandableOverride?: (row: Row<TData>) => boolean;
  onTreeRowWillExpand?: (row: Row<TData>) => boolean | Promise<boolean>;
  treeRowPartiallyExpanded?: (row: Row<TData>) => boolean;
}

export interface DatabaseViewerSelectionPropsSlice {
  enableRowSelection?: boolean;
  rowSelection?: TMITableSelectionConfig["rowSelection"];
  onRowSelectionChange?: TMITableSelectionConfig["onRowSelectionChange"];
  clearRowSelectionKey?: TMITableSelectionConfig["clearRowSelectionKey"];
}

export interface DatabaseViewerDebugPropsSlice {
  tableLoadResetKey?: string;
  debugTableContext?: Record<string, unknown>;
  onTableLoadSettled?: TMITableDebugConfig["onTableLoadSettled"];
}

export function resolveDatabaseViewerTreeConfig<TData extends object>(
  tree: TMITableTreeConfig<TData> | undefined,
  flat: DatabaseViewerTreePropsSlice<TData>,
): Required<
  Pick<DatabaseViewerTreePropsSlice<TData>, "expandAllOnDataChange">
> &
  DatabaseViewerTreePropsSlice<TData> {
  return {
    getSubRows: tree?.getSubRows ?? flat.getSubRows,
    expandAllOnDataChange:
      tree?.expandAllOnDataChange ?? flat.expandAllOnDataChange ?? true,
    expandResetKey: tree?.expandResetKey ?? flat.expandResetKey,
    mergeExpandedRowIds:
      tree?.mergeExpandedRowIds ?? flat.mergeExpandedRowIds ?? null,
    treeRowExpandableOverride:
      tree?.treeRowExpandableOverride ?? flat.treeRowExpandableOverride,
    onTreeRowWillExpand: tree?.onTreeRowWillExpand ?? flat.onTreeRowWillExpand,
    treeRowPartiallyExpanded:
      tree?.treeRowPartiallyExpanded ?? flat.treeRowPartiallyExpanded,
  };
}

export function resolveDatabaseViewerSelectionConfig(
  selection: TMITableSelectionConfig | undefined,
  flat: DatabaseViewerSelectionPropsSlice,
): {
  enableRowSelection: boolean;
  rowSelection: TMITableSelectionConfig["rowSelection"];
  onRowSelectionChange: TMITableSelectionConfig["onRowSelectionChange"];
  clearRowSelectionKey: TMITableSelectionConfig["clearRowSelectionKey"];
} {
  const enabled = selection?.enabled ?? flat.enableRowSelection ?? false;
  return {
    enableRowSelection: enabled,
    rowSelection: selection?.rowSelection ?? flat.rowSelection ?? {},
    onRowSelectionChange:
      selection?.onRowSelectionChange ?? flat.onRowSelectionChange,
    clearRowSelectionKey:
      selection?.clearRowSelectionKey ?? flat.clearRowSelectionKey,
  };
}

export function resolveDatabaseViewerDebugConfig(
  debug: TMITableDebugConfig | undefined,
  flat: DatabaseViewerDebugPropsSlice,
): TMITableDebugConfig {
  return {
    tableLoadResetKey: debug?.tableLoadResetKey ?? flat.tableLoadResetKey,
    debugTableContext: debug?.debugTableContext ?? flat.debugTableContext,
    onTableLoadSettled: debug?.onTableLoadSettled ?? flat.onTableLoadSettled,
  };
}
