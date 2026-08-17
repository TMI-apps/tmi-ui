import type { ColumnDef } from "@tanstack/react-table";
import { describe, expect, it } from "vitest";
import type { DatabaseViewerProps } from "../../src/DataTable/lesmateriaal-import/tmiTable/table/DatabaseViewer.js";

type Row = { id: string; name: string };

type AppColumns = ColumnDef<Row, string>[];
type ViewerColumns = DatabaseViewerProps<Row>["columns"];

/** Compile-time: app TanStack column defs must assign to DatabaseViewer props. */
type AssertColumnCompat = AppColumns extends ViewerColumns ? true : false;

const _columnCompat: AssertColumnCompat = true;

describe("DatabaseViewer column def compat", () => {
  it("assigns app ColumnDef arrays to DatabaseViewer props at compile time", () => {
    expect(_columnCompat).toBe(true);
  });
});
