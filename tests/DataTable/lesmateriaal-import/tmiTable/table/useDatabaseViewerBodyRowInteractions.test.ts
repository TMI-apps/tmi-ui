import { renderHook, act } from "@testing-library/react";
import type { Table as TanStackTableType } from "@tanstack/react-table";
import type { DragEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { useDatabaseViewerBodyRowInteractions } from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/table/useDatabaseViewerBodyRowInteractions.js";

function makeTable(getRowModelRows: { id: string }[] = []) {
  return {
    getRow: vi.fn(),
    getRowModel: vi.fn(() => ({ rows: getRowModelRows })),
  } as unknown as TanStackTableType<object>;
}

describe("useDatabaseViewerBodyRowInteractions", () => {
  it("suppresses row click immediately after file drop", async () => {
    const onRowClick = vi.fn();
    const onDrop = vi.fn().mockResolvedValue(undefined);
    const table = makeTable();
    const microtaskSpy = vi
      .spyOn(globalThis, "queueMicrotask")
      .mockImplementation(() => {});

    const { result } = renderHook(() =>
      useDatabaseViewerBodyRowInteractions({
        table,
        rowFileDrop: { onDrop },
        onRowClick,
      }),
    );

    const rowEl = document.createElement("tr");
    rowEl.setAttribute("data-dbv-row-id", "r1");
    table.getRow = vi.fn(() => ({
      original: { id: "r1" },
    })) as unknown as typeof table.getRow;

    const dropEvent = {
      dataTransfer: { types: ["Files"], files: { length: 0 }, items: [] },
      currentTarget: rowEl,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as DragEvent<HTMLTableRowElement>;

    await act(async () => {
      await result.current.handleRowDrop(dropEvent);
      result.current.handleRowClick(
        { id: "r1" },
        {
          rowId: "r1",
          click: { shiftKey: false, ctrlKey: false, metaKey: false },
        },
      );
    });

    microtaskSpy.mockRestore();
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it("does not scan row model on plain click when selection enabled", () => {
    const onRowSelectionChange = vi.fn();
    const rows = [{ id: "a" }, { id: "b" }, { id: "c" }];
    const table = makeTable(rows);

    const selectionAnchorRef = { current: null as string | null };

    const { result } = renderHook(() =>
      useDatabaseViewerBodyRowInteractions({
        table,
        onRowClick: vi.fn(),
        rowSelectionConfig: {
          enabled: true,
          rowSelection: {},
          onRowSelectionChange,
          selectionAnchorRef,
        },
      }),
    );

    act(() => {
      result.current.handleRowClick(
        { id: "b" },
        {
          rowId: "b",
          click: { shiftKey: false, ctrlKey: false, metaKey: false },
        },
      );
    });

    expect(table.getRowModel).not.toHaveBeenCalled();
    expect(onRowSelectionChange).toHaveBeenCalled();
  });

  it("scans row model on shift click when selection enabled", () => {
    const onRowSelectionChange = vi.fn();
    const rows = [{ id: "a" }, { id: "b" }, { id: "c" }];
    const table = makeTable(rows);

    const selectionAnchorRef = { current: "a" as string | null };

    const { result } = renderHook(() =>
      useDatabaseViewerBodyRowInteractions({
        table,
        rowSelectionConfig: {
          enabled: true,
          rowSelection: { a: true },
          onRowSelectionChange,
          selectionAnchorRef,
        },
      }),
    );

    act(() => {
      result.current.handleRowClick(
        { id: "c" },
        {
          rowId: "c",
          click: { shiftKey: true, ctrlKey: false, metaKey: false },
        },
      );
    });

    expect(table.getRowModel).toHaveBeenCalled();
    expect(onRowSelectionChange).toHaveBeenCalled();
  });

  it("updates selection anchor after modifier toggle", () => {
    const onRowSelectionChange = vi.fn();
    const table = makeTable([{ id: "x" }]);
    const selectionAnchorRef = { current: null as string | null };

    const { result } = renderHook(() =>
      useDatabaseViewerBodyRowInteractions({
        table,
        rowSelectionConfig: {
          enabled: true,
          rowSelection: {},
          onRowSelectionChange,
          selectionAnchorRef,
        },
      }),
    );

    act(() => {
      result.current.handleRowClick(
        { id: "x" },
        {
          rowId: "x",
          click: { shiftKey: false, ctrlKey: true, metaKey: false },
        },
      );
    });

    expect(selectionAnchorRef.current).toBe("x");
  });
});
