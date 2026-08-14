import type { Row, Table as TanStackTableType } from "@tanstack/react-table";
import type { DragEvent } from "react";
import type { TableInteractionSkinPreset } from "../../shared-theme/tableInteractionSkin.js";
import type { DatabaseViewerRowFileDrop } from "./databaseViewerRowFileDrop.js";
import type { DatabaseViewerDataRowProps } from "./DatabaseViewerDataRow.js";
import type { DatabaseViewerRowClickMeta } from "./useDatabaseViewerBodyRowInteractions.js";

export type DatabaseViewerBodyPlainDataRowArgs<TData extends object> = {
  row: Row<TData>;
  dataRowIndex?: number;
  rowDropEnabled: boolean;
  rowFileDrop?: DatabaseViewerRowFileDrop<TData>;
  dragOverRowId: string | null;
  getRowDataAttributes?: (row: TData) => Record<string, string | undefined>;
  rowIsClickable: boolean;
  rowIntentEnabled: boolean;
  onRowIntent?: (row: TData) => void;
  handleRowClick: (row: TData, meta?: DatabaseViewerRowClickMeta) => void;
  handleRowDragOver: (e: DragEvent<HTMLTableRowElement>) => void;
  handleRowDragLeave: (e: DragEvent<HTMLTableRowElement>) => void;
  handleRowDrop: (e: DragEvent<HTMLTableRowElement>) => void;
  table: TanStackTableType<TData>;
  treeRowExpandableOverride?: (row: Row<TData>) => boolean;
  onTreeRowWillExpand?: (row: Row<TData>) => boolean | Promise<boolean>;
  treeRowPartiallyExpanded?: (row: Row<TData>) => boolean;
  interactionSkinPreset: TableInteractionSkinPreset;
  rowSavePending?: (row: TData) => boolean;
  rowSelectionEnabled?: boolean;
};

export function buildDatabaseViewerBodyDataRowProps<TData extends object>(
  args: DatabaseViewerBodyPlainDataRowArgs<TData>,
): DatabaseViewerDataRowProps<TData> {
  const rowId = args.row.id;
  const canDrop =
    args.rowDropEnabled &&
    (args.rowFileDrop?.canDrop
      ? args.rowFileDrop.canDrop(args.row.original)
      : true);
  const isDragOver = args.dragOverRowId === rowId;
  const extraAttrs = args.getRowDataAttributes?.(args.row.original);
  const savePending = args.rowSavePending?.(args.row.original) ?? false;
  const fileDropHandlers = canDrop
    ? ({
        onDragOver: args.handleRowDragOver,
        onDragLeave: args.handleRowDragLeave,
        onDrop: args.handleRowDrop,
      } as Pick<
        DatabaseViewerDataRowProps<TData>,
        "onDragOver" | "onDragLeave" | "onDrop"
      >)
    : {};

  const sharedRowProps = {
    row: args.row,
    rowDataAttributes: extraAttrs,
    rowIsClickable: args.rowIsClickable,
    rowIntentEnabled: args.rowIntentEnabled,
    onRowClick: args.handleRowClick,
    onRowIntent: args.onRowIntent,
    canDrop,
    isDragOver,
    ...fileDropHandlers,
    table: args.table,
    treeRowExpandableOverride: args.treeRowExpandableOverride,
    onTreeRowWillExpand: args.onTreeRowWillExpand,
    treeRowPartiallyExpanded: args.treeRowPartiallyExpanded,
    interactionSkinPreset: args.interactionSkinPreset,
    dataRowIndex: args.dataRowIndex,
    rowSavePending: savePending,
    rowIsSelected: args.row.getIsSelected(),
    rowSelectionEnabled: args.rowSelectionEnabled ?? false,
  } satisfies DatabaseViewerDataRowProps<TData>;

  return sharedRowProps;
}
