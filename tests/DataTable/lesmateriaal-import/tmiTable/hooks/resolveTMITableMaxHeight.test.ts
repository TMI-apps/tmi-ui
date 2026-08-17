import { describe, expect, it } from "vitest";
import {
  resolveTMITableMaxHeight,
  tmiTableHeightMode,
} from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/hooks/resolveTMITableMaxHeight.js";

describe("resolveTMITableMaxHeight", () => {
  it("uses layout height when maxHeight is omitted", () => {
    expect(resolveTMITableMaxHeight(undefined, "100%")).toBe("100%");
    expect(resolveTMITableMaxHeight(undefined, 420)).toBe(420);
  });

  it("lets an explicit number or string win over layout", () => {
    expect(resolveTMITableMaxHeight(600, "100%")).toBe(600);
    expect(resolveTMITableMaxHeight("80%", 420)).toBe("80%");
  });

  it("treats false as content-sized opt-out", () => {
    expect(resolveTMITableMaxHeight(false, "100%")).toBeUndefined();
    expect(resolveTMITableMaxHeight(false, 500)).toBeUndefined();
  });
});

describe("tmiTableHeightMode", () => {
  it("maps resolved values to fill, pin, or content", () => {
    expect(tmiTableHeightMode("100%")).toBe("fill");
    expect(tmiTableHeightMode(600)).toBe("pin");
    expect(tmiTableHeightMode(undefined)).toBe("content");
  });
});
