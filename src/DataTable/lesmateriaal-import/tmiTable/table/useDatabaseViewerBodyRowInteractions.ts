import type {
  RowSelectionState,
  Table as TanStackTableType,
} from "@tanstack/react-table";
import type { DragEvent, MutableRefObject } from "react";
import { useCallback, useRef, useState } from "react";
import type { DatabaseViewerRowFileDrop } from "./databaseViewerRowFileDrop.js";
import { DBV_ROW_ID_ATTR } from "./databaseViewerConstants.js";
import { collectFilesFromDrop } from "../../shared-utils/fileDropUtils.js";
import {
  type DatabaseViewerRowSelectionClick,
  resolveDatabaseViewerRowSelectionFromClick,
} from "./databaseViewerRowSelection.js";

export type DatabaseViewerRowClickMeta = {
  rowId: string;
  click: DatabaseViewerRowSelectionClick;
};

export interface DatabaseViewerRowSelectionConfig {
  enabled: boolean;
  rowSelection: RowSelectionState;
  onRowSelectionChange: (next: RowSelectionState) => void;
  selectionAnchorRef: MutableRefObject<string | null>;
}

/**
 * Stable drag/click handlers for virtualized body rows: one callback each, row id from
 * {@link DBV_ROW_ID_ATTR} on {@link TableRow} (avoids per-row closure allocation on scroll).
 */
export function useDatabaseViewerBodyRowInteractions<TData extends object>({
  table,
  rowFileDrop,
  onRowClick,
  rowSelectionConfig,
}: {
  table: TanStackTableType<TData>;
  rowFileDrop?: DatabaseViewerRowFileDrop<TData>;
  onRowClick?: (row: TData, meta?: DatabaseViewerRowClickMeta) => void;
  rowSelectionConfig?: DatabaseViewerRowSelectionConfig;
}) {
  const rowDropEnabled = Boolean(rowFileDrop);
  const [dragOverRowId, setDragOverRowId] = useState<string | null>(null);
  const suppressRowClickAfterDropRef = useRef(false);

  const handleRowDragOver = useCallback(
    (e: DragEvent<HTMLTableRowElement>) => {
      if (!rowDropEnabled || !e.dataTransfer.types.includes("Files")) return;
      const id = e.currentTarget.getAttribute(DBV_ROW_ID_ATTR);
      if (!id) return;
      const modelRow = table.getRow(id);
      if (!modelRow) return;
      const ok = rowFileDrop?.canDrop
        ? rowFileDrop.canDrop(modelRow.original)
        : true;
      if (!ok) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      setDragOverRowId(id);
    },
    [rowDropEnabled, rowFileDrop, table],
  );

  const handleRowDragLeave = useCallback(
    (e: DragEvent<HTMLTableRowElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        const id = e.currentTarget.getAttribute(DBV_ROW_ID_ATTR);
        if (id) setDragOverRowId((prev) => (prev === id ? null : prev));
      }
    },
    [],
  );

  const handleRowDrop = useCallback(
    async (e: DragEvent<HTMLTableRowElement>) => {
      if (!rowFileDrop || !e.dataTransfer.types.includes("Files")) return;
      const id = e.currentTarget.getAttribute(DBV_ROW_ID_ATTR);
      if (!id) return;
      const modelRow = table.getRow(id);
      if (!modelRow) return;
      const ok = rowFileDrop.canDrop
        ? rowFileDrop.canDrop(modelRow.original)
        : true;
      if (!ok) return;
      e.preventDefault();
      e.stopPropagation();
      setDragOverRowId(null);
      suppressRowClickAfterDropRef.current = true;
      try {
        const files = await collectFilesFromDrop(e.dataTransfer);
        if (files.length > 0)
          await rowFileDrop.onDrop(modelRow.original, files);
      } finally {
        queueMicrotask(() => {
          suppressRowClickAfterDropRef.current = false;
        });
      }
    },
    [rowFileDrop, table],
  );

  const handleRowClick = useCallback(
    (row: TData, meta?: DatabaseViewerRowClickMeta) => {
      if (suppressRowClickAfterDropRef.current) {
        suppressRowClickAfterDropRef.current = false;
        return;
      }

      const click = meta?.click ?? {
        shiftKey: false,
        ctrlKey: false,
        metaKey: false,
      };
      const rowId = meta?.rowId;

      if (rowSelectionConfig?.enabled && rowId) {
        const visibleRowIds = click.shiftKey
          ? table.getRowModel().rows.map((r) => r.id)
          : [];
        const resolved = resolveDatabaseViewerRowSelectionFromClick({
          rowId,
          click,
          visibleRowIds,
          anchorRowId: rowSelectionConfig.selectionAnchorRef.current,
          previousSelection: rowSelectionConfig.rowSelection,
        });
        rowSelectionConfig.onRowSelectionChange(resolved.selection);
        rowSelectionConfig.selectionAnchorRef.current =
          resolved.nextAnchorRowId;
        if (resolved.openDetail) {
          onRowClick?.(row, meta);
        }
        return;
      }

      onRowClick?.(row, meta);
    },
    [onRowClick, rowSelectionConfig, table],
  );

  return {
    rowDropEnabled,
    dragOverRowId,
    handleRowDragOver,
    handleRowDragLeave,
    handleRowDrop,
    handleRowClick,
  };
}
