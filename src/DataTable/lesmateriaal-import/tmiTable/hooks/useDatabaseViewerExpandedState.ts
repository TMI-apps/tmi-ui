import { useEffect, useRef, useState } from "react";
import type { ExpandedState } from "@tanstack/react-table";

export interface UseDatabaseViewerExpandedStateOptions<TData> {
  data: TData[];
  getRowId: (row: TData) => string;
  getSubRows?: (row: TData) => TData[] | undefined;
  /**
   * When true (default), expand every parent row when `data` changes — or when
   * this flag itself changes. Does **not** re-expand when `getRowId` or
   * `getSubRows` get a new function identity (inline accessors on re-render).
   * Latest accessors are still used when collect runs.
   */
  expandAllOnDataChange?: boolean;
  /**
   * When `expandAllOnDataChange` is false, reset `expanded` to `{}` when this
   * string changes (e.g. server list query + pagination identity), not when
   * `data` reference changes from client-side merges (lazy tree children).
   * If omitted, legacy behavior: reset whenever `data` changes.
   * Accessor identity (`getRowId` / `getSubRows`) does not reset expanded.
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
  const getRowIdRef = useRef(getRowId);
  const getSubRowsRef = useRef(getSubRows);
  getRowIdRef.current = getRowId;
  getSubRowsRef.current = getSubRows;

  const hasSubRows = Boolean(getSubRows);

  useEffect(() => {
    const subRows = getSubRowsRef.current;
    if (!subRows) {
      return;
    }
    if (expandAllOnDataChange) {
      setExpanded(collectExpandableRows(data, getRowIdRef.current, subRows));
    }
  }, [data, expandAllOnDataChange, hasSubRows]);

  useEffect(
    () => {
      if (!getSubRowsRef.current || expandAllOnDataChange) {
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
