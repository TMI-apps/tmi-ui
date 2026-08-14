import { describe, expect, it } from "vitest";
import { shouldClearRowSelectionForKeyChange } from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/table/databaseViewerClearRowSelection.js";

describe("shouldClearRowSelectionForKeyChange", () => {
  it("does not clear on initial mount (previous undefined)", () => {
    expect(shouldClearRowSelectionForKeyChange(undefined, "filter-a")).toBe(
      false,
    );
  });

  it("does not clear when next key is undefined", () => {
    expect(shouldClearRowSelectionForKeyChange("filter-a", undefined)).toBe(
      false,
    );
  });

  it("does not clear when key is unchanged", () => {
    expect(shouldClearRowSelectionForKeyChange("filter-a", "filter-a")).toBe(
      false,
    );
  });

  it("clears when key changes", () => {
    expect(shouldClearRowSelectionForKeyChange("filter-a", "filter-b")).toBe(
      true,
    );
  });
});
