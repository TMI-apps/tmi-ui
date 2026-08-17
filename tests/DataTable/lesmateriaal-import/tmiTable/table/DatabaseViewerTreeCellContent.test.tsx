import { fireEvent, render, screen } from "@testing-library/react";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { Row, Table as TanStackTableType } from "@tanstack/react-table";
import { describe, expect, it, vi } from "vitest";
import { DatabaseViewerTreeCellContent } from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/table/DatabaseViewerTreeCellContent.js";

function makeRow(): Row<{ id: string; name: string }> {
  return {
    id: "row-1",
    original: { id: "row-1", name: "Alpha" },
    depth: 0,
    getIsExpanded: () => false,
    getCanExpand: () => false,
  } as unknown as Row<{ id: string; name: string }>;
}

const tableStub = {} as TanStackTableType<{ id: string; name: string }>;
const dragAttributes = {
  role: "button",
  tabIndex: 0,
  "aria-disabled": false,
  "aria-pressed": undefined,
  "aria-roledescription": "sortable",
} as DraggableAttributes;

describe("DatabaseViewerTreeCellContent drag handle", () => {
  it("forwards pointerdown to dnd-kit listeners after stopping propagation", () => {
    const onPointerDown = vi.fn();
    const onParentPointerDown = vi.fn();

    render(
      <div onPointerDown={onParentPointerDown}>
        <DatabaseViewerTreeCellContent
          row={makeRow()}
          table={tableStub}
          reorderTreeDragHandle={{
            setActivatorNodeRef: vi.fn(),
            disabled: false,
            attributes: dragAttributes,
            listeners: { onPointerDown },
          }}
        >
          Alpha
        </DatabaseViewerTreeCellContent>
      </div>,
    );

    fireEvent.pointerDown(
      screen.getByLabelText("Rij slepen om te verplaatsen"),
    );

    expect(onPointerDown).toHaveBeenCalledTimes(1);
    expect(onParentPointerDown).not.toHaveBeenCalled();
  });

  it("does not forward pointerdown when the handle is disabled", () => {
    const onPointerDown = vi.fn();

    const { container } = render(
      <DatabaseViewerTreeCellContent
        row={makeRow()}
        table={tableStub}
        reorderTreeDragHandle={{
          setActivatorNodeRef: vi.fn(),
          disabled: true,
          attributes: dragAttributes,
          listeners: { onPointerDown },
        }}
      >
        Alpha
      </DatabaseViewerTreeCellContent>,
    );

    const handle = container.querySelector(
      '[data-dbv-suppress-row-click="true"]',
    );
    expect(handle).toBeTruthy();
    fireEvent.pointerDown(handle!);
    expect(onPointerDown).not.toHaveBeenCalled();
  });
});
