import { describe, expect, it } from "vitest";
import { computeDatabaseViewerRowDropZone } from "../../../../src/DataTable/lesmateriaal-import/shared-utils/databaseViewerRowReorderZone.js";

describe("computeDatabaseViewerRowDropZone", () => {
  it("defaults to after without an element", () => {
    expect(
      computeDatabaseViewerRowDropZone({ clientY: 12, rowElement: null }),
    ).toBe("after");
  });

  it("uses upper vs lower halves of row rect", () => {
    const rowElement = {
      getBoundingClientRect: () =>
        ({
          top: 100,
          left: 0,
          bottom: 120,
          right: 10,
          width: 10,
          height: 20,
        }) as DOMRect,
    };
    expect(
      computeDatabaseViewerRowDropZone({
        clientY: 105,
        rowElement: rowElement as Element,
      }),
    ).toBe("before");
    expect(
      computeDatabaseViewerRowDropZone({
        clientY: 115,
        rowElement: rowElement as Element,
      }),
    ).toBe("after");
    expect(
      computeDatabaseViewerRowDropZone({
        clientY: 109.999,
        rowElement: rowElement as Element,
      }),
    ).toBe("before");
    expect(
      computeDatabaseViewerRowDropZone({
        clientY: 110,
        rowElement: rowElement as Element,
      }),
    ).toBe("after");
  });
});
