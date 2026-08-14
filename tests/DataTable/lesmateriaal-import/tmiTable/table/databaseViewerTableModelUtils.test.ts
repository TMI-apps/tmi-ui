import type { Cell } from "@tanstack/react-table";
import { describe, expect, it } from "vitest";
import type { DatabaseViewerColumnMeta } from "../../../../../src/DataTable/lesmateriaal-import/shared-types/tmiTableMeta.types.js";
import {
  getLeadingContentShiftDepth,
  getTreeRowIndentBoundaryCellIndex,
} from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/table/databaseViewerTableModelUtils.js";

function cellWithMeta(
  meta: DatabaseViewerColumnMeta | undefined,
): Cell<object, unknown> {
  return {
    column: {
      columnDef: { meta },
    },
  } as unknown as Cell<object, unknown>;
}

describe("getTreeRowIndentBoundaryCellIndex", () => {
  it("returns explicit treeRowIndentBoundary column index", () => {
    const visibleCells = [
      cellWithMeta({ rowThumbnailCell: true }),
      cellWithMeta({ isTreeColumn: true, treeRowIndentBoundary: true }),
      cellWithMeta(undefined),
    ];
    expect(getTreeRowIndentBoundaryCellIndex(visibleCells)).toBe(1);
  });

  it("falls back to isTreeColumn when no boundary flag", () => {
    const visibleCells = [
      cellWithMeta({ rowThumbnailCell: true }),
      cellWithMeta({ isTreeColumn: true }),
      cellWithMeta(undefined),
    ];
    expect(getTreeRowIndentBoundaryCellIndex(visibleCells)).toBe(1);
  });

  it("returns -1 when no tree meta", () => {
    expect(
      getTreeRowIndentBoundaryCellIndex([
        cellWithMeta(undefined),
        cellWithMeta({ defaultHidden: true }),
      ]),
    ).toBe(-1);
  });
});

describe("getLeadingContentShiftDepth", () => {
  it("returns 0 at depth 0", () => {
    expect(
      getLeadingContentShiftDepth({
        rowDepth: 0,
        cellIndex: 0,
        treeRowIndentBoundaryIndex: 1,
        meta: { rowThumbnailCell: true },
      }),
    ).toBe(0);
  });

  it("returns depth for leading non-tree cell within boundary", () => {
    expect(
      getLeadingContentShiftDepth({
        rowDepth: 2,
        cellIndex: 0,
        treeRowIndentBoundaryIndex: 2,
        meta: { rowThumbnailCell: true },
      }),
    ).toBe(2);
  });

  it("returns 0 for tree column", () => {
    expect(
      getLeadingContentShiftDepth({
        rowDepth: 2,
        cellIndex: 1,
        treeRowIndentBoundaryIndex: 2,
        meta: { isTreeColumn: true },
      }),
    ).toBe(0);
  });

  it("returns 0 past boundary index", () => {
    expect(
      getLeadingContentShiftDepth({
        rowDepth: 2,
        cellIndex: 3,
        treeRowIndentBoundaryIndex: 2,
        meta: undefined,
      }),
    ).toBe(0);
  });

  it("returns 0 when boundary index is missing", () => {
    expect(
      getLeadingContentShiftDepth({
        rowDepth: 2,
        cellIndex: 0,
        treeRowIndentBoundaryIndex: -1,
        meta: { rowThumbnailCell: true },
      }),
    ).toBe(0);
  });
});
