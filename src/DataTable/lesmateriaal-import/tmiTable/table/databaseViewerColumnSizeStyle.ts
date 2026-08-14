import type { Table } from "@tanstack/react-table";
import type { CSSProperties } from "react";
import type { DatabaseViewerColumnMeta } from "../../shared-types/tmiTableMeta.types.js";

const CSS_VAR_PREFIX = "--dbv-col-";

/**
 * Sanitize column ids for use in CSS custom property names.
 */
export function databaseViewerColumnIdToCssVarFragment(
  columnId: string,
): string {
  return columnId.replace(/[^a-zA-Z0-9_-]/g, "_");
}

export function getDatabaseViewerColumnWidthCssVarName(
  columnId: string,
): string {
  return `${CSS_VAR_PREFIX}${databaseViewerColumnIdToCssVarFragment(columnId)}`;
}

/**
 * MUI `TableCell` width: reads vars set on the parent `Table` (same pattern as TanStack column sizing guide).
 * Fallback is TanStack’s current `getSize()` for this render.
 */
export function getDatabaseViewerColumnWidthCssValue(
  columnId: string,
  getSize: () => number,
): string {
  return `var(${getDatabaseViewerColumnWidthCssVarName(columnId)}, ${getSize()}px)`;
}

export function getDatabaseViewerIconSurrogateWidthSx(columnWidthCss: string): {
  minWidth: number;
  maxWidth: string;
} {
  return {
    minWidth: 0,
    maxWidth: columnWidthCss,
  };
}

/**
 * Per-leaf column widths as CSS custom properties on the `<table>` root.
 *
 * When the table fills a wider block, browsers otherwise distribute spare width across all `<col>`
 * elements, including fixed icon columns. We distribute that spare width ourselves so icon-surrogate
 * columns stay at their declared size and normal content columns absorb the remainder.
 */
export function getDatabaseViewerTableColumnSizeStyle<TData extends object>(
  table: Table<TData>,
  targetWidth?: number,
): CSSProperties {
  const style: CSSProperties = {};
  const columns = table.getVisibleLeafColumns();
  const totalWidth = table.getTotalSize();
  const extraWidth =
    targetWidth && targetWidth > totalWidth ? targetWidth - totalWidth : 0;
  const expandableColumns = columns.filter((column) => {
    const meta = column.columnDef.meta as DatabaseViewerColumnMeta | undefined;
    return !meta?.iconSurrogateCell;
  });
  const expandableWidth = expandableColumns.reduce(
    (sum, column) => sum + column.getSize(),
    0,
  );

  for (const column of columns) {
    const name = getDatabaseViewerColumnWidthCssVarName(column.id);
    const meta = column.columnDef.meta as DatabaseViewerColumnMeta | undefined;
    const shouldExpand =
      extraWidth > 0 && !meta?.iconSurrogateCell && expandableWidth > 0;
    const nextWidth = shouldExpand
      ? column.getSize() + extraWidth * (column.getSize() / expandableWidth)
      : column.getSize();
    (style as Record<string, string>)[name] = `${nextWidth}px`;
  }
  return style;
}
