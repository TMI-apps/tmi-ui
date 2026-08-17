import { describe, expect, it } from "vitest";
import {
  isTableLoadDebugEnabled,
  logTableLoadSummary,
  TABLE_LOAD_DEBUG_LOG_PREFIX,
} from "../../src/index.js";

describe("tableLoadDebug public exports", () => {
  it("re-exports debug helpers from package entry", () => {
    expect(typeof logTableLoadSummary).toBe("function");
    expect(typeof isTableLoadDebugEnabled).toBe("function");
    expect(TABLE_LOAD_DEBUG_LOG_PREFIX).toBe("[table-load]");
  });
});
