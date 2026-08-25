import type { Column } from "@tanstack/react-table";
import type { DatabaseViewerColumnMeta } from "../../shared-types/tmiTableMeta.types.js";

/** Columns that are chrome (thumb, icon, full-height action), not string create cells. */
export function isDatabaseViewerCreateInputColumn<TData>(
  column: Column<TData, unknown>,
): boolean {
  const meta = column.columnDef.meta as DatabaseViewerColumnMeta | undefined;
  if (meta?.rowThumbnailCell) return false;
  if (meta?.fullHeightInteractive) return false;
  if (meta?.iconSurrogateCell) return false;
  return true;
}

export function getDatabaseViewerCreateColumnLabel<TData>(
  column: Column<TData, unknown>,
): string {
  const header = column.columnDef.header;
  return typeof header === "string" && header.trim() ? header : column.id;
}
