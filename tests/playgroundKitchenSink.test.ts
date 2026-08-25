import { describe, expect, it } from "vitest";
import {
  kitchenSinkColumns,
  kitchenSinkRowFromCreate,
  KITCHEN_SINK_INITIAL_ROWS,
} from "../playground/src/kitchenSinkFixture.js";

describe("playground kitchen-sink fixture", () => {
  it("defines non-empty mock data and columns", () => {
    expect(KITCHEN_SINK_INITIAL_ROWS.length).toBeGreaterThan(0);
    expect(kitchenSinkColumns.length).toBeGreaterThan(0);
  });

  it("maps create values to top-level rows", () => {
    expect(kitchenSinkRowFromCreate("created-1", "New name")).toEqual({
      id: "created-1",
      name: "New name",
    });
  });
});
