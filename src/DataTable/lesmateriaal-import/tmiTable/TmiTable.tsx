import { useMemo, type ReactElement } from "react";
import {
  DatabaseViewer,
  staticClientVirtualizedList,
  type DatabaseViewerProps,
  type DatabaseViewerRowFileDrop,
  type DatabaseViewerRowReorderConfig,
  type TMITableServerInfinite,
} from "./table/index.js";

export type TmiTableProps<TData extends object> = DatabaseViewerProps<TData>;

/**
 * Company table master: TanStack Table + MUI shell ({@link DatabaseViewer}).
 * Display name: TMI-table.
 *
 * Does not default `debug.onTableLoadSettled` — inject from the app (e.g. `logTableLoadSummary`).
 * Omit `maxHeight` to fill remaining workspace/standalone height; pass a number to pin;
 * pass `maxHeight={false}` for content-sized nested/dialog tables.
 */
export function TMITable<TData extends object>(
  props: TmiTableProps<TData>,
): ReactElement {
  const { debug, tableLoadResetKey, debugTableContext, ...rest } = props;

  const mergedDebug = useMemo(() => {
    const base = debug ?? {};
    return {
      ...base,
      tableLoadResetKey: base.tableLoadResetKey ?? tableLoadResetKey,
      debugTableContext: base.debugTableContext ?? debugTableContext,
    };
  }, [debug, tableLoadResetKey, debugTableContext]);

  return <DatabaseViewer {...rest} debug={mergedDebug} />;
}

TMITable.displayName = "TMI-table";

export { staticClientVirtualizedList };
export type {
  DatabaseViewerRowFileDrop,
  DatabaseViewerRowReorderConfig,
  TMITableServerInfinite,
};
