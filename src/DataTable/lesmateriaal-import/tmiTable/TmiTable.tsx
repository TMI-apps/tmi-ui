import { useMemo, type ReactElement } from "react";
import type { TMITableLoadSettledPayload } from "../shared-types/tmiTableConfig.types.js";
import { logTableLoadSummary } from "../shared-utils/tableLoadDebug.js";
import {
  DatabaseViewer,
  staticClientVirtualizedList,
  type DatabaseViewerProps,
  type DatabaseViewerRowFileDrop,
  type DatabaseViewerRowReorderConfig,
  type TMITableServerInfinite,
} from "./table/index.js";

export type TmiTableProps<TData extends object> = DatabaseViewerProps<TData>;

function reportTableLoadSettled(payload: TMITableLoadSettledPayload): void {
  logTableLoadSummary(payload as unknown as Record<string, unknown>);
}

/**
 * Company table master: TanStack Table + MUI shell ({@link DatabaseViewer}).
 * Display name: TMI-table.
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
      onTableLoadSettled: base.onTableLoadSettled ?? reportTableLoadSettled,
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
