import { TableRow } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { Row, Table as TanStackTableType } from "@tanstack/react-table";
import type { DragEvent, KeyboardEvent, Ref } from "react";
import { useMemo } from "react";
import {
  getTableInteractionSkin,
  type TableInteractionSkinPreset,
} from "../../shared-theme/tableInteractionSkin.js";
import { DBV_ROW_ID_ATTR } from "./databaseViewerConstants.js";
import { DBV_REORDER_ROW_ID_ATTR } from "../../shared-utils/databaseViewerRowReorderZone.js";
import {
  getTreeRowIndentBoundaryCellIndex,
  treeRowCanExpand,
} from "./databaseViewerTableModelUtils.js";
import { DatabaseViewerDataCell } from "./DatabaseViewerDataCell.js";
import type { DatabaseViewerDataRowReorderHandleProps } from "./DatabaseViewerDataRowReorderHandle.types.js";

import type { DatabaseViewerRowSelectionClick } from "./databaseViewerRowSelection.js";

export type { DatabaseViewerDataRowReorderHandleProps } from "./DatabaseViewerDataRowReorderHandle.types.js";

export interface DatabaseViewerDataRowClickMeta {
  rowId: string;
  click: DatabaseViewerRowSelectionClick;
}

export interface DatabaseViewerDataRowProps<TData extends object> {
  row: Row<TData>;
  rowIsClickable: boolean;
  rowIntentEnabled: boolean;
  onRowClick: (row: TData, meta?: DatabaseViewerDataRowClickMeta) => void;
  onRowIntent?: (row: TData) => void;
  canDrop: boolean;
  isDragOver: boolean;
  onDragOver?: (e: DragEvent<HTMLTableRowElement>) => void;
  onDragLeave?: (e: DragEvent<HTMLTableRowElement>) => void;
  onDrop?: (e: DragEvent<HTMLTableRowElement>) => void;
  table: TanStackTableType<TData>;
  treeRowExpandableOverride?: (row: Row<TData>) => boolean;
  onTreeRowWillExpand?: (row: Row<TData>) => boolean | Promise<boolean>;
  treeRowPartiallyExpanded?: (row: Row<TData>) => boolean;
  interactionSkinPreset: TableInteractionSkinPreset;
  /** @tanstack/react-virtual: index for measureElement. */
  dataRowIndex?: number;
  /** MUI TableRow ref; composed with `dataRowIndex` for virtualization measure. */
  tableRowRef?: Ref<HTMLTableRowElement> | null;
  /** Optional data-* attributes for pointer hit-testing overlays. */
  rowDataAttributes?: Record<string, string | undefined>;
  /** Subtle “save in flight” marker for optimistic row updates. */
  rowSavePending?: boolean;
  /** Stable row-key marker for reorder DOM lookups (`computeDatabaseViewerRowDropZone`). */
  reorderLocatorRowKey?: string;
  /** Drag handle anchored in tree column (`@dnd-kit/core`). */
  reorderTreeDragHandle?: DatabaseViewerDataRowReorderHandleProps | undefined;
  /** Extra row styles merged after skin (e.g. dragging placeholder). */
  tableRowSx?: SxProps<Theme>;
  /** TanStack row selection highlight. */
  rowIsSelected?: boolean;
  /** When true, Space does not open row (keyboard path B). */
  rowSelectionEnabled?: boolean;
}

export function DatabaseViewerDataRow<TData extends object>({
  row,
  rowIsClickable,
  rowIntentEnabled,
  onRowClick,
  onRowIntent,
  canDrop,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  table,
  treeRowExpandableOverride,
  onTreeRowWillExpand,
  treeRowPartiallyExpanded,
  interactionSkinPreset,
  dataRowIndex,
  tableRowRef,
  rowDataAttributes,
  rowSavePending = false,
  reorderLocatorRowKey,
  reorderTreeDragHandle,
  tableRowSx,
  rowIsSelected = false,
  rowSelectionEnabled = false,
}: DatabaseViewerDataRowProps<TData>) {
  const visibleCells = row.getVisibleCells();
  const treeRowIndentBoundaryIndex =
    getTreeRowIndentBoundaryCellIndex(visibleCells);
  const visibleCellStartPxByIndex = useMemo(() => {
    let nextStartPx = 0;
    return visibleCells.map((cell) => {
      const startPx = nextStartPx;
      nextStartPx += cell.column.getSize();
      return startPx;
    });
  }, [visibleCells]);
  const dataAttrs = useMemo(() => {
    if (!rowDataAttributes) return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(rowDataAttributes)) {
      if (v !== undefined) out[k] = v;
    }
    return out;
  }, [rowDataAttributes]);

  return (
    <TableRow
      ref={tableRowRef}
      data-index={dataRowIndex}
      {...dataAttrs}
      {...(reorderLocatorRowKey
        ? { [DBV_REORDER_ROW_ID_ATTR]: reorderLocatorRowKey }
        : {})}
      {...(canDrop ? { [DBV_ROW_ID_ATTR]: row.id } : {})}
      hover={false}
      onClick={(event) => {
        if (
          (event.target as HTMLElement).closest(
            "[data-dbv-suppress-row-click='true']",
          )
        ) {
          return;
        }
        onRowClick(row.original, {
          rowId: row.id,
          click: {
            shiftKey: event.shiftKey,
            ctrlKey: event.ctrlKey,
            metaKey: event.metaKey,
          },
        });
      }}
      onMouseEnter={
        rowIntentEnabled ? () => onRowIntent?.(row.original) : undefined
      }
      onFocus={rowIntentEnabled ? () => onRowIntent?.(row.original) : undefined}
      onKeyDown={(event: KeyboardEvent) => {
        if (!rowIsClickable) return;
        if (rowSelectionEnabled) {
          if (event.key !== "Enter") return;
        } else if (event.key !== "Enter" && event.key !== " ") {
          return;
        }
        event.preventDefault();
        onRowClick(row.original, {
          rowId: row.id,
          click: { shiftKey: false, ctrlKey: false, metaKey: false },
        });
      }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      tabIndex={rowIsClickable ? 0 : -1}
      aria-selected={rowIsSelected ? true : undefined}
      aria-expanded={
        treeRowCanExpand(row, treeRowExpandableOverride)
          ? row.getIsExpanded()
          : undefined
      }
      aria-level={row.depth + 1}
      aria-label={
        canDrop
          ? "Rij; sleep bestanden hier om aan dit item te koppelen"
          : undefined
      }
      sx={(theme) => {
        const skin = getTableInteractionSkin(theme, interactionSkinPreset);
        const rowBackground = isDragOver
          ? skin.rowDragBackground
          : rowIsSelected
            ? skin.rowSelectedBackground
            : skin.rowBackground;
        const rowHoverBackground = isDragOver
          ? skin.rowDragHoverBackground
          : rowIsSelected
            ? skin.rowSelectedHoverBackground
            : skin.rowHoverBackground;
        const base = {
          "--dbv-row-bg": rowBackground,
          cursor: rowIsClickable ? ("pointer" as const) : ("default" as const),
          overflow: "hidden" as const,
          ...(rowIsClickable
            ? { "&:hover": { "--dbv-row-bg": rowHoverBackground } }
            : {}),
        };
        if (tableRowSx === undefined) {
          return base;
        }
        if (typeof tableRowSx === "function") {
          const fromFn = tableRowSx(theme);
          return typeof fromFn === "object" &&
            fromFn !== null &&
            !Array.isArray(fromFn)
            ? { ...base, ...fromFn }
            : base;
        }
        if (typeof tableRowSx === "object" && !Array.isArray(tableRowSx)) {
          return { ...base, ...tableRowSx };
        }
        return base;
      }}
    >
      {visibleCells.map((cell, index) => (
        <DatabaseViewerDataCell
          key={cell.id}
          cell={cell}
          row={row}
          index={index}
          cellStartPx={visibleCellStartPxByIndex[index] ?? 0}
          visibleCellCount={visibleCells.length}
          isDragOver={isDragOver}
          rowSavePending={rowSavePending}
          treeRowIndentBoundaryIndex={treeRowIndentBoundaryIndex}
          table={table}
          treeRowExpandableOverride={treeRowExpandableOverride}
          onTreeRowWillExpand={onTreeRowWillExpand}
          treeRowPartiallyExpanded={treeRowPartiallyExpanded}
          interactionSkinPreset={interactionSkinPreset}
          reorderTreeDragHandle={reorderTreeDragHandle}
        />
      ))}
    </TableRow>
  );
}
