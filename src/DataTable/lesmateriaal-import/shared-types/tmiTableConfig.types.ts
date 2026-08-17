import type { Row, RowSelectionState } from "@tanstack/react-table";

/** Tree expansion / lazy-load configuration for {@link TMITable}. */
export interface TMITableTreeConfig<TData extends object> {
  getSubRows?: (row: TData) => TData[] | undefined;
  expandAllOnDataChange?: boolean;
  expandResetKey?: string;
  mergeExpandedRowIds?: Record<string, boolean> | null;
  treeRowExpandableOverride?: (row: Row<TData>) => boolean;
  onTreeRowWillExpand?: (row: Row<TData>) => boolean | Promise<boolean>;
  treeRowPartiallyExpanded?: (row: Row<TData>) => boolean;
}

/** Multi-row selection (modifier click); mirrors {@link DatabaseViewerRowReorderConfig} `enabled` gate. */
export interface TMITableSelectionConfig {
  enabled: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (next: RowSelectionState) => void;
  /** When this key changes, selection clears (e.g. filter/search reset). */
  clearRowSelectionKey?: string | number;
}

/** Dev table-load debug identity. */
export interface TMITableLoadSettledPayload {
  event: "table_load_settled";
  loadIdentityKey: string | null;
  rowCountRendered: number;
  totalLoaded?: number;
  totalCount?: number;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  scopeFilters: unknown[];
  error: string | null;
  context?: Record<string, unknown>;
}

export interface TMITableDebugConfig {
  tableLoadResetKey?: string;
  debugTableContext?: Record<string, unknown>;
  /** App-injected reporter; package default is no-op — pass {@link logTableLoadSummary} if wanted. */
  onTableLoadSettled?: (payload: TMITableLoadSettledPayload) => void;
}
