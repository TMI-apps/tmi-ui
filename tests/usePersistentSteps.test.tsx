import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { usePersistentSteps } from "../src/usePersistentSteps.js";

const KEY = "activity:e1:en";

describe("usePersistentSteps", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("loads empty state when nothing is stored", () => {
    const { result } = renderHook(() =>
      usePersistentSteps({
        entityId: "e1",
        language: "en",
        stepIds: ["a", "b"],
      }),
    );
    expect(result.current.completedCount).toBe(0);
    expect(result.current.totalCount).toBe(2);
    expect(result.current.isChecked("a")).toBe(false);
  });

  it("toggles steps and persists to localStorage", () => {
    const { result } = renderHook(() =>
      usePersistentSteps({ entityId: "e1", language: "en", stepIds: ["a"] }),
    );
    act(() => {
      result.current.toggleStep("a");
    });
    expect(result.current.isChecked("a")).toBe(true);
    expect(JSON.parse(localStorage.getItem(KEY) ?? "{}")).toEqual({ a: true });
  });

  it("uses storageScope in the localStorage key", () => {
    const { result } = renderHook(() =>
      usePersistentSteps({
        entityId: "e1",
        language: "en",
        stepIds: ["a"],
        storageScope: "productkaart",
      }),
    );
    act(() => {
      result.current.toggleStep("a");
    });
    expect(localStorage.getItem("productkaart:e1:en")).toBeTruthy();
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("reloads from storage when entity or language changes", () => {
    localStorage.setItem("activity:e2:en", JSON.stringify({ x: true }));
    const { result, rerender } = renderHook(
      ({ entityId, language }: { entityId: string; language: string }) =>
        usePersistentSteps({ entityId, language, stepIds: ["x"] }),
      { initialProps: { entityId: "e1", language: "en" } },
    );
    expect(result.current.isChecked("x")).toBe(false);
    rerender({ entityId: "e2", language: "en" });
    expect(result.current.isChecked("x")).toBe(true);
  });
});
