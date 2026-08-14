import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useFilterPromptDockTransition } from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/hooks/useFilterPromptDockTransition.js";

describe("useFilterPromptDockTransition", () => {
  it("should not play table enter on first render when not idle", () => {
    const { result } = renderHook(() => useFilterPromptDockTransition(false));
    expect(result.current.playTableEnter).toBe(false);
    expect(result.current.tableEnterToken).toBe(0);
  });

  it("should play table enter after leaving idle", () => {
    const { result, rerender } = renderHook(
      ({ active }) => useFilterPromptDockTransition(active),
      {
        initialProps: { active: true },
      },
    );

    act(() => {
      rerender({ active: false });
    });

    expect(result.current.playTableEnter).toBe(true);
    expect(result.current.tableEnterToken).toBe(1);
  });
});
