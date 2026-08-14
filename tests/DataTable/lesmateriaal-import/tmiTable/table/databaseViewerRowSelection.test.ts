import { describe, expect, it } from "vitest";
import {
  buildModifierToggleRowSelection,
  buildPlainClickRowSelection,
  buildShiftRangeRowSelection,
  resolveDatabaseViewerRowSelectionFromClick,
} from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/table/databaseViewerRowSelection.js";

describe("databaseViewerRowSelection", () => {
  const visible = ["a", "b", "c", "d"];

  it("plain click replaces selection", () => {
    expect(buildPlainClickRowSelection("b")).toEqual({ b: true });
  });

  it("ctrl toggles row in selection", () => {
    expect(buildModifierToggleRowSelection("b", { a: true })).toEqual({
      a: true,
      b: true,
    });
    expect(buildModifierToggleRowSelection("a", { a: true, b: true })).toEqual({
      b: true,
    });
  });

  it("shift range selects visible inclusive span", () => {
    expect(buildShiftRangeRowSelection(visible, "b", "d", {})).toEqual({
      b: true,
      c: true,
      d: true,
    });
    expect(buildShiftRangeRowSelection(visible, "d", "a", { x: true })).toEqual(
      {
        x: true,
        a: true,
        b: true,
        c: true,
        d: true,
      },
    );
  });

  it("resolve click: plain opens detail", () => {
    const r = resolveDatabaseViewerRowSelectionFromClick({
      rowId: "c",
      click: { shiftKey: false, ctrlKey: false, metaKey: false },
      visibleRowIds: visible,
      anchorRowId: "a",
      previousSelection: { a: true },
    });
    expect(r.selection).toEqual({ c: true });
    expect(r.openDetail).toBe(true);
  });

  it("resolve click: shift does not open detail", () => {
    const r = resolveDatabaseViewerRowSelectionFromClick({
      rowId: "c",
      click: { shiftKey: true, ctrlKey: false, metaKey: false },
      visibleRowIds: visible,
      anchorRowId: "a",
      previousSelection: {},
    });
    expect(r.selection).toEqual({ a: true, b: true, c: true });
    expect(r.openDetail).toBe(false);
  });
});
