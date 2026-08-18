import { closestCenter, pointerWithin } from "@dnd-kit/core";
import { describe, expect, it } from "vitest";
import {
  buildDatabaseViewerReorderRowTableRowSx,
  mergeDatabaseViewerRowReorderOntoIsDragOver,
  resolveDatabaseViewerRowReorderCollisionDetection,
  resolveDatabaseViewerRowReorderDropPlacement,
} from "../../../../src/DataTable/lesmateriaal-import/shared-utils/databaseViewerRowReorderDropPlacement.js";

const siblingSlide = {
  x: 0,
  y: 48,
  scaleX: 1,
  scaleY: 1,
} as const;

describe("resolveDatabaseViewerRowReorderDropPlacement", () => {
  it("defaults to between when omitted", () => {
    expect(resolveDatabaseViewerRowReorderDropPlacement(undefined)).toBe(
      "between",
    );
  });
});

describe("resolveDatabaseViewerRowReorderCollisionDetection", () => {
  it("keeps closestCenter for between (default)", () => {
    expect(resolveDatabaseViewerRowReorderCollisionDetection(undefined)).toBe(
      closestCenter,
    );
    expect(resolveDatabaseViewerRowReorderCollisionDetection("between")).toBe(
      closestCenter,
    );
  });

  it("uses pointerWithin for onto", () => {
    expect(resolveDatabaseViewerRowReorderCollisionDetection("onto")).toBe(
      pointerWithin,
    );
  });
});

describe("buildDatabaseViewerReorderRowTableRowSx", () => {
  it("applies sortable transform for between (sibling gap)", () => {
    const sx = buildDatabaseViewerReorderRowTableRowSx({
      transform: siblingSlide,
      transition: "transform 200ms",
      isDragging: false,
      dropPlacement: undefined,
    });
    expect(sx?.transform).toContain("translate3d");
    expect(sx?.transition).toBe("transform 200ms");
    expect(sx?.visibility).toBeUndefined();
  });

  it("hides the active row for between", () => {
    const sx = buildDatabaseViewerReorderRowTableRowSx({
      transform: siblingSlide,
      transition: undefined,
      isDragging: true,
      dropPlacement: "between",
    });
    expect(sx?.visibility).toBe("hidden");
    expect(sx?.pointerEvents).toBe("none");
    expect(sx?.transform).toContain("translate3d");
  });

  it("does not apply sibling transform for onto", () => {
    const sx = buildDatabaseViewerReorderRowTableRowSx({
      transform: siblingSlide,
      transition: "transform 200ms",
      isDragging: false,
      dropPlacement: "onto",
    });
    expect(sx).toBeUndefined();
  });

  it("still hides the active row for onto", () => {
    const sx = buildDatabaseViewerReorderRowTableRowSx({
      transform: siblingSlide,
      transition: "transform 200ms",
      isDragging: true,
      dropPlacement: "onto",
    });
    expect(sx).toEqual({
      visibility: "hidden",
      pointerEvents: "none",
    });
  });
});

describe("mergeDatabaseViewerRowReorderOntoIsDragOver", () => {
  it("does not highlight over for between", () => {
    expect(
      mergeDatabaseViewerRowReorderOntoIsDragOver({
        fileDropIsDragOver: false,
        dropPlacement: "between",
        isOver: true,
        isDragging: false,
      }),
    ).toBe(false);
  });

  it("highlights over for onto", () => {
    expect(
      mergeDatabaseViewerRowReorderOntoIsDragOver({
        fileDropIsDragOver: false,
        dropPlacement: "onto",
        isOver: true,
        isDragging: false,
      }),
    ).toBe(true);
  });

  it("does not highlight the active onto row", () => {
    expect(
      mergeDatabaseViewerRowReorderOntoIsDragOver({
        fileDropIsDragOver: false,
        dropPlacement: "onto",
        isOver: true,
        isDragging: true,
      }),
    ).toBe(false);
  });

  it("keeps file-drop isDragOver in both modes", () => {
    expect(
      mergeDatabaseViewerRowReorderOntoIsDragOver({
        fileDropIsDragOver: true,
        dropPlacement: "between",
        isOver: false,
        isDragging: false,
      }),
    ).toBe(true);
  });
});
