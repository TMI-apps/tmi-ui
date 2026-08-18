import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import type { MutableRefObject, ReactElement } from "react";
import { useCallback, useMemo } from "react";
import type { DatabaseViewerRowReorderDropPlacement } from "../../shared-types/databaseViewerRowReorder.types.js";
import {
  buildDatabaseViewerReorderRowTableRowSx,
  mergeDatabaseViewerRowReorderOntoIsDragOver,
} from "../../shared-utils/databaseViewerRowReorderDropPlacement.js";
import {
  DatabaseViewerDataRow,
  type DatabaseViewerDataRowProps,
} from "./DatabaseViewerDataRow.js";

export interface DatabaseViewerReorderDataRowProps<
  TData extends object,
> extends DatabaseViewerDataRowProps<TData> {
  dndRowId: UniqueIdentifier;
  canDragThisRow: boolean;
  reorderInteractionBlocked: boolean;
  dropPlacement?: DatabaseViewerRowReorderDropPlacement;
  measureElement?: (el: HTMLTableRowElement) => void;
}

function DatabaseViewerReorderDataRowInner<TData extends object>(
  props: DatabaseViewerReorderDataRowProps<TData>,
): ReactElement {
  const {
    dndRowId,
    row,
    canDragThisRow,
    reorderInteractionBlocked,
    dropPlacement,
    measureElement,
    tableRowRef,
    isDragOver: fileDropIsDragOver,
    ...pass
  } = props;

  const dragActivatorDisabled = reorderInteractionBlocked || !canDragThisRow;

  /**
   * Non-draggable rows stay valid drop targets (insert-between and onto-parent).
   * `SortableContext` `disabled` handles the global column-sort gate.
   */
  const sortableDisabled = canDragThisRow
    ? false
    : { draggable: true, droppable: false };

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: dndRowId,
    disabled: sortableDisabled,
  });

  const composedRowRef = useCallback(
    (el: HTMLTableRowElement | null) => {
      setNodeRef(el);
      if (el !== null) {
        measureElement?.(el);
      }
      if (!tableRowRef) return;
      if (typeof tableRowRef === "function") {
        tableRowRef(el);
      } else {
        (tableRowRef as MutableRefObject<HTMLTableRowElement | null>).current =
          el;
      }
    },
    [measureElement, setNodeRef, tableRowRef],
  );

  const tableRowSx = useMemo(
    () =>
      buildDatabaseViewerReorderRowTableRowSx({
        transform,
        transition,
        isDragging,
        dropPlacement,
      }),
    [dropPlacement, isDragging, transform, transition],
  );

  const isDragOver = mergeDatabaseViewerRowReorderOntoIsDragOver({
    fileDropIsDragOver,
    dropPlacement,
    isOver,
    isDragging,
  });

  return (
    <DatabaseViewerDataRow
      {...pass}
      row={row}
      tableRowRef={composedRowRef}
      reorderLocatorRowKey={String(dndRowId)}
      reorderTreeDragHandle={{
        disabled: dragActivatorDisabled,
        setActivatorNodeRef,
        attributes,
        listeners,
      }}
      isDragOver={isDragOver}
      tableRowSx={tableRowSx}
    />
  );
}

export const DatabaseViewerReorderDataRow =
  DatabaseViewerReorderDataRowInner as <TData extends object>(
    props: DatabaseViewerReorderDataRowProps<TData>,
  ) => ReactElement;
