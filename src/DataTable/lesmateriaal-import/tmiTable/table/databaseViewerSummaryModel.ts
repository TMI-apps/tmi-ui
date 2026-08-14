import type {
  ColumnFiltersState,
  Header,
  SortingState,
  Table,
} from "@tanstack/react-table";
import type {
  DatabaseViewerScopeSummary,
  DatabaseViewerScopeSummaryItem,
} from "../../shared-types/tmiTableMeta.types.js";

function databaseViewerColumnDefHeaderLabel(
  header: unknown,
  fallbackColumnId: string,
): string {
  return typeof header === "string" ? header : fallbackColumnId;
}

export function getDatabaseViewerColumnLabel<TData extends object>(
  table: Table<TData>,
  columnId: string,
): string {
  const column = table.getColumn(columnId);
  if (!column) return columnId;
  return databaseViewerColumnDefHeaderLabel(column.columnDef.header, column.id);
}

/** String label for header tooltips / truncation (aligned with {@link getDatabaseViewerColumnLabel}). */
export function getDatabaseViewerHeaderLabelString<TData extends object>(
  header: Header<TData, unknown>,
): string {
  return databaseViewerColumnDefHeaderLabel(
    header.column.columnDef.header,
    header.column.id,
  );
}

export function buildDatabaseViewerDisplaySummaryItems<TData extends object>(
  table: Table<TData>,
  getColumnLabel: (columnId: string) => string,
): DatabaseViewerScopeSummaryItem[] {
  const items: DatabaseViewerScopeSummaryItem[] = [];
  const hiddenColumnLabels: string[] = [];
  const pinnedColumnLabels: string[] = [];

  for (const column of table.getAllLeafColumns()) {
    if (!column.getIsVisible()) {
      hiddenColumnLabels.push(getColumnLabel(column.id));
    }
    if (column.getIsPinned() === "left") {
      pinnedColumnLabels.push(getColumnLabel(column.id));
    }
  }

  const hiddenColumns = hiddenColumnLabels.join(", ");
  const pinnedColumns = pinnedColumnLabels.join(", ");

  if (hiddenColumns.length > 0) {
    items.push({
      label: "Verborgen kolommen",
      value: hiddenColumns,
    });
  }
  if (pinnedColumns.length > 0) {
    items.push({
      label: "Gepinde kolommen",
      value: pinnedColumns,
    });
  }
  return items;
}

export function buildDatabaseViewerActiveColumnFilterItems(
  columnFilters: ColumnFiltersState,
  getColumnLabel: (columnId: string) => string,
): DatabaseViewerScopeSummaryItem[] {
  return columnFilters
    .filter((item) => item.value !== undefined && item.value !== "")
    .map((item) => ({
      label: `Kolomfilter ${getColumnLabel(item.id)}`,
      value: String(item.value),
    }));
}

export function buildDatabaseViewerDataSummaryItems(
  scopeSummary: DatabaseViewerScopeSummary | undefined,
  activeColumnFilterItems: DatabaseViewerScopeSummaryItem[],
): DatabaseViewerScopeSummaryItem[] {
  return [...(scopeSummary?.dataFilters ?? []), ...activeColumnFilterItems];
}

export function databaseViewerHasActiveSorting(sorting: SortingState): boolean {
  return sorting.length > 0;
}
