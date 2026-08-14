import { useEffect, useState } from "react";
import type { ExpandedState } from "@tanstack/react-table";

export interface UseDatabaseViewerExpandedStateOptions<TData> {
  data: TData[];
  getRowId: (row: TData) => string;
  getSubRows?: (row: TData) => TData[] | undefined;
  expandAllOnDataChange?: boolean;
  /**
   * When `expandAllOnDataChange` is false, reset `expanded` to `{}` when this
   * string changes (e.g. server list query + pagination identity), not when
   * `data` reference changes from client-side merges (lazy tree children).
   * If omitted, legacy behavior: reset whenever `data` changes.
   */
  expandResetKey?: string;
}

function collectExpandableRows<TData>(
  rows: TData[],
  getRowId: (row: TData) => string,
  getSubRows: (row: TData) => TData[] | undefined,
): ExpandedState {
  const expanded: Record<string, boolean> = {};
  const visited = new Set<string>();

  const visit = (items: TData[], path: Set<string>) => {
    for (const item of items) {
      const id = getRowId(item);
      if (visited.has(id) || path.has(id)) continue;
      visited.add(id);

      const children = getSubRows(item) ?? [];
      if (children.length === 0) continue;

      expanded[id] = true;
      const nextPath = new Set(path);
      nextPath.add(id);
      visit(children, nextPath);
    }
  };

  visit(rows, new Set<string>());
  return expanded;
}

export function useDatabaseViewerExpandedState<TData>({
  data,
  getRowId,
  getSubRows,
  expandAllOnDataChange = true,
  expandResetKey,
}: UseDatabaseViewerExpandedStateOptions<TData>) {
  const [expanded, setExpanded] = useState<ExpandedState>({});

  useEffect(() => {
    if (!getSubRows) {
      return;
    }
    if (expandAllOnDataChange) {
      setExpanded(collectExpandableRows(data, getRowId, getSubRows));
    }
  }, [data, expandAllOnDataChange, getRowId, getSubRows]);

  useEffect(
    () => {
      if (!getSubRows || expandAllOnDataChange) {
        return;
      }
      setExpanded({});
    },
    expandResetKey !== undefined
      ? [expandResetKey, expandAllOnDataChange]
      : [data, expandAllOnDataChange],
  );

  return {
    expanded,
    setExpanded,
  };
}
