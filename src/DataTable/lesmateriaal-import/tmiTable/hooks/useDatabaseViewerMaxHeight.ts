import { useDatabaseTableDetailWorkspaceLayout } from "../context/DatabaseTableDetailWorkspaceLayoutContext.js";
import { useDatabaseTableDetailWorkspaceHeights } from "./useDatabaseTableDetailWorkspaceHeights.js";

/**
 * Layout `maxHeight` for the table+detail workspace (provider) or standalone breakpoint/`100%` fill.
 *
 * @deprecated Omit `maxHeight` on `TMITable` / `DatabaseViewer` to fill remaining height.
 * Pass a number (or string) to pin. Pass `maxHeight={false}` for content-sized nested/dialog tables.
 * Kept exported for one release for existing call sites.
 */
export function useDatabaseViewerMaxHeight(): number | string {
  const ctx = useDatabaseTableDetailWorkspaceLayout();
  const { tableMaxHeightPx } = useDatabaseTableDetailWorkspaceHeights();
  return ctx?.tableMaxHeightPx ?? tableMaxHeightPx;
}
