import { describe, expect, it } from "vitest";
import { sectionIdFromHash } from "../playground/src/layout/WorkshopLayout.js";

describe("workshop hash navigation", () => {
  it("strips the hash prefix", () => {
    expect(sectionIdFromHash("#kitchen-sink-table")).toBe("kitchen-sink-table");
  });
});
