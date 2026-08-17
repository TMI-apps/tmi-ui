export interface DatabaseViewerScopeSummaryItem {
  label: string;
  value: string;
}

/** Scope / filter summary for the TMI-table “what you see” popover. */
export interface DatabaseViewerScopeSummary {
  title?: string;
  dataFilters: DatabaseViewerScopeSummaryItem[];
  emptyDataFiltersLabel?: string;
  onClearDataFilters?: () => void;
}

export interface DatabaseViewerColumnMeta {
  /**
   * Hierarchy column with chevrons. Uses edge-to-edge cell content (no text inset).
   */
  isTreeColumn?: boolean;
  /**
   * Body row: last visible column included in the tree-depth row graphic inset.
   * Cells after this boundary keep the normal table-column grid alignment.
   */
  treeRowIndentBoundary?: boolean;
  /**
   * Icon-only action column: no default text inset, control centered in the
   * 48px row bar. Optional — `TableRowActionButton` already fills bar height
   * in every body cell.
   */
  fullHeightInteractive?: boolean;
  /**
   * Body cell: full-cell hover like a plain table icon (no action-button chrome).
   * Edge-to-edge layout (no text inset).
   */
  iconSurrogateCell?: boolean;
  /**
   * Body cell: full-bleed row thumbnail (no padding, fills cell height and width).
   * The rendered cell is stretched to the entire cell area so images touch the row's
   * outer edges and corners — like the end of the row "dipped in paint". Children
   * should render with `width: 100%; height: 100%;` and prefer `objectFit: "cover"`.
   * Typically applied to the first visible column (leading thumbnail).
   */
  rowThumbnailCell?: boolean;
  /**
   * Header: show scope-summary trigger icon when the table has `scopeSummary`.
   * Right-click opens the summary popover; left-click sorts with the column header.
   */
  scopeSummaryHeaderTrigger?: boolean;
  /** When true, column is hidden by default. Set in column def to easily hide in code. */
  defaultHidden?: boolean;
  /**
   * Body cell: allow wrapping / visible overflow for chip rows (default is single-line ellipsis).
   */
  wrapCellContent?: boolean;
}

/** Public library names aligned with `TMI-table`. */
export type TMITableScopeSummaryItem = DatabaseViewerScopeSummaryItem;
export type TMITableScopeSummary = DatabaseViewerScopeSummary;
export type TMITableColumnMeta = DatabaseViewerColumnMeta;
