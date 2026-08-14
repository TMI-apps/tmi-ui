import type { DatabaseViewerRowDropZone } from "../shared-types/databaseViewerRowReorder.types.js";

/** `data-*` anchor on virtualized TMI table rows during `@dnd-kit` row reorder (pointer-band lookup). */
export const DBV_REORDER_ROW_ID_ATTR = "data-dbv-reorder-row-id" as const;

export function computeDatabaseViewerRowDropZone(args: {
  clientY: number;
  rowElement: Element | null;
}): DatabaseViewerRowDropZone {
  const { clientY, rowElement } = args;
  if (!rowElement) {
    return "after";
  }
  const rect = rowElement.getBoundingClientRect();
  const y = clientY - rect.top;
  const mid = rect.height / 2;
  return y < mid ? "before" : "after";
}

export function resolveDatabaseViewerReorderRowElement(
  rowKey: string,
): Element | null {
  try {
    return document.querySelector(
      `[${DBV_REORDER_ROW_ID_ATTR}="${CSS.escape(rowKey)}"]`,
    );
  } catch {
    return document.querySelector(
      `[${DBV_REORDER_ROW_ID_ATTR}="${rowKey.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"]`,
    );
  }
}
