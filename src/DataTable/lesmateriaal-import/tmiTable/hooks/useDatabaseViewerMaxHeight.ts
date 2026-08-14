import { useDatabaseTableDetailWorkspaceLayout } from "../context/DatabaseTableDetailWorkspaceLayoutContext.js";
import { useDatabaseTableDetailWorkspaceHeights } from "./useDatabaseTableDetailWorkspaceHeights.js";

/**
 * `DatabaseViewer` / table `maxHeight` aligned with the table+detail workspace.
 * When rendered inside `TMITableWorkspace`, uses the provider value;
 * otherwise falls back to the same breakpoint hook (standalone tables).
 */
export function useDatabaseViewerMaxHeight(): number | string {
  const ctx = useDatabaseTableDetailWorkspaceLayout();
  const { tableMaxHeightPx } = useDatabaseTableDetailWorkspaceHeights();
  return ctx?.tableMaxHeightPx ?? tableMaxHeightPx;
}
