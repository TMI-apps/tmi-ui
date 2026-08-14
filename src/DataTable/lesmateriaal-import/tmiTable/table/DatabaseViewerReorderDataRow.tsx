import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { MutableRefObject, ReactElement } from "react";
import { useCallback, useMemo } from "react";
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
    measureElement,
    tableRowRef,
    ...pass
  } = props;

  const dragActivatorDisabled = reorderInteractionBlocked || !canDragThisRow;

  /**
   * Non-draggable rows stay valid drop targets so siblings can land between them; the wrapping
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

  const tableRowSx = useMemo(() => {
    if (transform === null && !transition && !isDragging) return undefined;
    return {
      transform:
        transform === null ? undefined : CSS.Transform.toString(transform),
      transition,
      ...(isDragging
        ? { visibility: "hidden" as const, pointerEvents: "none" as const }
        : undefined),
    };
  }, [isDragging, transform, transition]);

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
      tableRowSx={tableRowSx}
    />
  );
}

export const DatabaseViewerReorderDataRow =
  DatabaseViewerReorderDataRowInner as <TData extends object>(
    props: DatabaseViewerReorderDataRowProps<TData>,
  ) => ReactElement;
