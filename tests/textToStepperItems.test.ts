import { describe, expect, it } from "vitest";
import { textToStepperItems } from "../src/textToStepperItems.js";

describe("textToStepperItems", () => {
  it("returns empty array for empty or non-string input", () => {
    expect(textToStepperItems("")).toEqual([]);
    expect(textToStepperItems("   \n  ")).toEqual([]);
    expect(textToStepperItems(null)).toEqual([]);
    expect(textToStepperItems(42)).toEqual([]);
  });

  it("parses numbered and bullet main steps", () => {
    const steps = textToStepperItems("1. First\n- Second\n* Third");
    expect(steps.map((s) => s.text)).toEqual(["First", "Second", "Third"]);
    expect(steps.map((s) => s.index)).toEqual([0, 1, 2]);
  });

  it("attaches indented lines as sub-steps of the previous main step", () => {
    const steps = textToStepperItems("1. Main\n  Sub one\n  Sub two\n2. Next");
    expect(steps).toHaveLength(2);
    expect(steps[0]?.text).toBe("Main");
    expect(steps[0]?.children?.map((c) => c.text)).toEqual([
      "Sub one",
      "Sub two",
    ]);
    expect(steps[1]?.text).toBe("Next");
    expect(steps[1]?.children).toBeUndefined();
  });

  it("treats a leading sub-indent as a main step when no prior main exists", () => {
    const steps = textToStepperItems("  Orphan sub");
    expect(steps).toHaveLength(1);
    expect(steps[0]?.text).toBe("Orphan sub");
    expect(steps[0]?.children).toBeUndefined();
  });

  it("skips [object Object] lines", () => {
    const steps = textToStepperItems("1. Ok\n[object Object]");
    expect(steps.map((s) => s.text)).toEqual(["Ok"]);
  });
});
