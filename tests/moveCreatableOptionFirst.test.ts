import { describe, expect, it } from "vitest";
import { moveCreatableOptionFirst } from "../src/AutocompleteSelect/moveCreatableOptionFirst.js";

const CREATE = { id: "create", label: "Create X" };
const A = { id: "a", label: "A" };
const B = { id: "b", label: "B" };

describe("moveCreatableOptionFirst", () => {
  it("moves a mid-list create id to the start without reordering others", () => {
    expect(moveCreatableOptionFirst([A, CREATE, B], "create")).toEqual([
      CREATE,
      A,
      B,
    ]);
  });

  it("returns the same array when the id is already first", () => {
    const opts = [CREATE, A, B];
    expect(moveCreatableOptionFirst(opts, "create")).toBe(opts);
  });

  it("does not invent a create row when the id is absent", () => {
    const opts = [A, B];
    expect(moveCreatableOptionFirst(opts, "create")).toBe(opts);
  });

  it("is a no-op without creatableOptionId", () => {
    const opts = [A, CREATE];
    expect(moveCreatableOptionFirst(opts, undefined)).toBe(opts);
  });
});
