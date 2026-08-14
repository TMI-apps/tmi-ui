import type { Table } from "@tanstack/react-table";
import { getDatabaseViewerColumnWidthCssValue } from "./databaseViewerColumnSizeStyle.js";

/**
 * One `<col>` per visible leaf column so `tableLayout: fixed` column widths are independent of
 * which row is first (virtual spacers, empty state, etc.).
 */
export function DatabaseViewerColumnGroup<TData extends object>({
  table,
}: {
  table: Table<TData>;
}) {
  return (
    <colgroup>
      {table.getVisibleLeafColumns().map((col) => (
        <col
          key={col.id}
          style={{
            width: getDatabaseViewerColumnWidthCssValue(col.id, () =>
              col.getSize(),
            ),
          }}
        />
      ))}
    </colgroup>
  );
}
