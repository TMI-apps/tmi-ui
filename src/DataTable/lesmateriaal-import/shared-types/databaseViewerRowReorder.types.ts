import type {
  DragEndEvent,
  SensorDescriptor,
  SensorOptions,
  UniqueIdentifier,
} from "@dnd-kit/core";
import type { MutableRefObject } from "react";
import type { Row } from "@tanstack/react-table";
import type { ReactNode } from "react";

/** Row hit band for vertical reorder + reparent gestures (Lesmateriaal tree): upper/lower half split. */
export type DatabaseViewerRowDropZone = "before" | "after";

/**
 * How `rowReorder` maps `@dnd-kit` `over` during drag.
 * - `"between"` (default): sortable insert; siblings slide; before/after bands apply.
 * - `"onto"`: no sibling gap; highlight the `over` row as the drop parent.
 */
export type DatabaseViewerRowReorderDropPlacement = "between" | "onto";

/** Last pointer sample during drag (window capture); used for drop band + modifiers at release. */
export type DatabaseViewerRowReorderPointerSample = {
  x: number;
  y: number;
  altKey: boolean;
};

export interface DatabaseViewerRowReorderEndMeta<TData extends object> {
  paginatedRows: Row<TData>[];
  /** True when TanStack column sorting UI is active; consumers must ignore drag persistence. */
  columnSortActive: boolean;
  /** Filled during drag via {@link TmiRowReorderDndProvider} pointer listener; null if missing. */
  lastPointerSample: DatabaseViewerRowReorderPointerSample | null;
}

export interface DatabaseViewerRowReorderConfig<TData extends object> {
  enabled: boolean;
  sensors: SensorDescriptor<SensorOptions>[];
  onDragEnd: (
    event: DragEndEvent,
    meta: DatabaseViewerRowReorderEndMeta<TData>,
  ) => void;
  /**
   * When true, `DatabaseViewerBody` renders the drag preview with the same `DatabaseViewerDataRow`
   * + column widths as the live table (portal). Ignores {@link renderDragOverlay}.
   */
  dragOverlayMirrorDataRow?: boolean;
  renderDragOverlay?: (activeId: UniqueIdentifier) => ReactNode;
  /** Predicate on `row.original`. */
  canDragRow?: (row: TData) => boolean;
  /**
   * Drop mapping. Omit or `"between"` keeps sortable insert (Lesmateriaal).
   * `"onto"` disables sibling slide and highlights `over` as the parent (Groups reparent).
   */
  dropPlacement?: DatabaseViewerRowReorderDropPlacement;
  /** When true, drag handles are inactive (e.g. column sort overrides manual order mode). */
  reorderInteractionBlocked?: boolean;
  /** Mutated during drag for `before`/`after` band derivation from **`clientY`** + Alt-modifier. */
  dragPointerSampleRef?: MutableRefObject<DatabaseViewerRowReorderPointerSample | null>;
}
