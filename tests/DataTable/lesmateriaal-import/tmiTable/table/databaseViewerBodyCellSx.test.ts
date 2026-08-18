import type { Cell } from "@tanstack/react-table";
import { describe, expect, it } from "vitest";
import type { DatabaseViewerColumnMeta } from "../../../../../src/DataTable/lesmateriaal-import/shared-types/tmiTableMeta.types.js";
import {
  databaseViewerCellIsEdgeToEdgeInteractive,
  getDatabaseViewerBodyTableCellSx,
} from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/table/databaseViewerBodyCellSx.js";
import { DATABASE_VIEWER_BODY_ROW_BAR_HEIGHT_PX } from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/table/databaseViewerTableStyles.js";

function cellWithMeta(
  meta: DatabaseViewerColumnMeta | undefined,
): Cell<object, unknown> {
  return {
    column: {
      id: "col",
      columnDef: { meta },
      getSize: () => 120,
      getIsPinned: () => false,
    },
  } as unknown as Cell<object, unknown>;
}

function bodyCellSx(
  meta: DatabaseViewerColumnMeta | undefined,
  isDragOver = false,
) {
  return getDatabaseViewerBodyTableCellSx({
    cell: cellWithMeta(meta),
    index: 0,
    cellStartPx: 0,
    visibleCellCount: 1,
    isDragOver,
    rowDepth: 0,
    rowSavePending: false,
    treeRowIndentBoundaryIndex: -1,
    leadingContentShiftDepth: 0,
  }) as { p?: number; height?: number; "&::after"?: unknown };
}

describe("databaseViewerCellIsEdgeToEdgeInteractive", () => {
  it("is false for plain text / unflagged action columns", () => {
    expect(databaseViewerCellIsEdgeToEdgeInteractive(undefined)).toBe(false);
    expect(databaseViewerCellIsEdgeToEdgeInteractive({})).toBe(false);
  });

  it("is true for tree, icon-surrogate, thumbnail, and explicit interactive cells", () => {
    expect(
      databaseViewerCellIsEdgeToEdgeInteractive({ isTreeColumn: true }),
    ).toBe(true);
    expect(
      databaseViewerCellIsEdgeToEdgeInteractive({ iconSurrogateCell: true }),
    ).toBe(true);
    expect(
      databaseViewerCellIsEdgeToEdgeInteractive({ rowThumbnailCell: true }),
    ).toBe(true);
    expect(
      databaseViewerCellIsEdgeToEdgeInteractive({
        fullHeightInteractive: true,
      }),
    ).toBe(true);
  });
});

describe("getDatabaseViewerBodyTableCellSx full-height band", () => {
  it("gives every body cell a definite bar height and zero padding", () => {
    for (const meta of [
      undefined,
      { isTreeColumn: true },
      { fullHeightInteractive: true },
    ] as Array<DatabaseViewerColumnMeta | undefined>) {
      const sx = bodyCellSx(meta);
      expect(sx.p).toBe(0);
      expect(sx.height).toBe(DATABASE_VIEWER_BODY_ROW_BAR_HEIGHT_PX);
    }
  });

  it("lets wrap cells grow past the bar height", () => {
    const sx = bodyCellSx({ wrapCellContent: true }) as {
      p?: number;
      height?: number;
      minHeight?: number;
    };
    expect(sx.p).toBe(0);
    expect(sx.height).toBeUndefined();
    expect(sx.minHeight).toBe(DATABASE_VIEWER_BODY_ROW_BAR_HEIGHT_PX);
  });

  it("paints the dashed full-row overlay when isDragOver", () => {
    const idle = bodyCellSx(undefined, false);
    const over = bodyCellSx(undefined, true);
    expect(idle["&::after"]).toBeUndefined();
    expect(over["&::after"]).toEqual(
      expect.objectContaining({
        border: expect.stringContaining("dashed"),
        content: '""',
      }),
    );
  });
});
