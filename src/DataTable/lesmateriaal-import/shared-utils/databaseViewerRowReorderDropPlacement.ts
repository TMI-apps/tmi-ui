import {
  closestCenter,
  pointerWithin,
  type CollisionDetection,
} from "@dnd-kit/core";
import { CSS, type Transform } from "@dnd-kit/utilities";
import type { DatabaseViewerRowReorderDropPlacement } from "../shared-types/databaseViewerRowReorder.types.js";

export function resolveDatabaseViewerRowReorderDropPlacement(
  dropPlacement: DatabaseViewerRowReorderDropPlacement | undefined,
): DatabaseViewerRowReorderDropPlacement {
  return dropPlacement ?? "between";
}

/** `closestCenter` keeps insert-between; `pointerWithin` so the row under the pointer is `over`. */
export function resolveDatabaseViewerRowReorderCollisionDetection(
  dropPlacement: DatabaseViewerRowReorderDropPlacement | undefined,
): CollisionDetection {
  return resolveDatabaseViewerRowReorderDropPlacement(dropPlacement) === "onto"
    ? pointerWithin
    : closestCenter;
}

export function buildDatabaseViewerReorderRowTableRowSx(args: {
  transform: Transform | null;
  transition: string | undefined;
  isDragging: boolean;
  dropPlacement: DatabaseViewerRowReorderDropPlacement | undefined;
}):
  | {
      transform?: string;
      transition?: string;
      opacity?: 0;
      pointerEvents?: "none";
    }
  | undefined {
  const { transform, transition, isDragging } = args;
  const dropPlacement = resolveDatabaseViewerRowReorderDropPlacement(
    args.dropPlacement,
  );

  /**
   * Hide the source row without `visibility: hidden`. A lazy `<img>` under a
   * hidden row is not "being rendered", so the load never starts and a
   * `Fade`-gated thumbnail stays on the placeholder after drop.
   * `pointer-events: none` keeps the ghost out of hit-testing.
   */
  const dragSourceHidden = isDragging
    ? ({ opacity: 0, pointerEvents: "none" } as const)
    : undefined;

  if (dropPlacement === "onto") {
    if (!isDragging) return undefined;
    return dragSourceHidden;
  }

  if (transform === null && !transition && !isDragging) return undefined;
  return {
    transform:
      transform === null ? undefined : CSS.Transform.toString(transform),
    transition,
    ...dragSourceHidden,
  };
}

/** Onto paints `over` with the same dashed overlay as file-drop `isDragOver`. */
export function mergeDatabaseViewerRowReorderOntoIsDragOver(args: {
  fileDropIsDragOver: boolean;
  dropPlacement: DatabaseViewerRowReorderDropPlacement | undefined;
  isOver: boolean;
  isDragging: boolean;
}): boolean {
  const ontoOver =
    resolveDatabaseViewerRowReorderDropPlacement(args.dropPlacement) ===
      "onto" &&
    args.isOver &&
    !args.isDragging;
  return args.fileDropIsDragOver || ontoOver;
}
