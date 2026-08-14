import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";

/** Props for the `@dnd-kit/core` reorder drag handle in the tree column (virtualized viewer). */
export interface DatabaseViewerDataRowReorderHandleProps {
  setActivatorNodeRef: (element: HTMLElement | null) => void;
  disabled: boolean;
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners | undefined;
}
