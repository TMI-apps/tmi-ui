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
      visibility?: "hidden";
      pointerEvents?: "none";
    }
  | undefined {
  const { transform, transition, isDragging } = args;
  const dropPlacement = resolveDatabaseViewerRowReorderDropPlacement(
    args.dropPlacement,
  );

  if (dropPlacement === "onto") {
    if (!isDragging) return undefined;
    return { visibility: "hidden", pointerEvents: "none" };
  }

  if (transform === null && !transition && !isDragging) return undefined;
  return {
    transform:
      transform === null ? undefined : CSS.Transform.toString(transform),
    transition,
    ...(isDragging
      ? { visibility: "hidden" as const, pointerEvents: "none" as const }
      : undefined),
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
