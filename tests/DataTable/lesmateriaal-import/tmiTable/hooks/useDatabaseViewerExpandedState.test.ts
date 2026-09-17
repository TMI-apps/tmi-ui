import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDatabaseViewerExpandedState } from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/hooks/useDatabaseViewerExpandedState.js";

type Node = { id: string; children?: Node[] };

const tree: Node[] = [
  { id: "parent-a", children: [{ id: "child-a" }] },
  { id: "parent-b", children: [{ id: "child-b" }] },
];

const nextTree: Node[] = [{ id: "parent-c", children: [{ id: "child-c" }] }];

describe("useDatabaseViewerExpandedState", () => {
  it("does not re-expand when accessor identity changes and data is unchanged", () => {
    const { result, rerender } = renderHook(
      ({ getRowId, getSubRows }) =>
        useDatabaseViewerExpandedState({
          data: tree,
          getRowId,
          getSubRows,
          expandAllOnDataChange: true,
        }),
      {
        initialProps: {
          getRowId: (row: Node) => row.id,
          getSubRows: (row: Node) => row.children,
        },
      },
    );

    expect(result.current.expanded).toEqual({
      "parent-a": true,
      "parent-b": true,
    });

    act(() => {
      result.current.setExpanded({ "parent-a": true });
    });

    act(() => {
      rerender({
        getRowId: (row: Node) => row.id,
        getSubRows: (row: Node) => row.children,
      });
    });

    expect(result.current.expanded).toEqual({ "parent-a": true });
  });

  it("re-expands all parents when data is replaced", () => {
    const { result, rerender } = renderHook(
      ({ data, getRowId }) =>
        useDatabaseViewerExpandedState({
          data,
          getRowId,
          getSubRows: (row: Node) => row.children,
          expandAllOnDataChange: true,
        }),
      {
        initialProps: {
          data: tree,
          getRowId: (row: Node) => row.id,
        },
      },
    );

    act(() => {
      result.current.setExpanded({});
    });

    act(() => {
      rerender({
        data: nextTree,
        getRowId: (row: Node) => row.id,
      });
    });

    expect(result.current.expanded).toEqual({ "parent-c": true });
  });

  it("does not clear expanded on accessor identity; still clears when expandResetKey changes", () => {
    const { result, rerender } = renderHook(
      (props) => useDatabaseViewerExpandedState(props),
      {
        initialProps: {
          data: tree,
          getRowId: (row: Node) => row.id,
          getSubRows: (row: Node) => row.children,
          expandAllOnDataChange: false,
          expandResetKey: "page-1",
        },
      },
    );

    act(() => {
      result.current.setExpanded({ "parent-a": true });
    });

    act(() => {
      rerender({
        data: tree,
        getRowId: (row: Node) => row.id,
        getSubRows: (row: Node) => row.children,
        expandAllOnDataChange: false,
        expandResetKey: "page-1",
      });
    });

    expect(result.current.expanded).toEqual({ "parent-a": true });

    act(() => {
      rerender({
        data: tree,
        getRowId: (row: Node) => row.id,
        getSubRows: (row: Node) => row.children,
        expandAllOnDataChange: false,
        expandResetKey: "page-2",
      });
    });

    expect(result.current.expanded).toEqual({});
  });
});
