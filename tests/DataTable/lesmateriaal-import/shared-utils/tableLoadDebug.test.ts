import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  isTableLoadDebugEnabled,
  logTableLoadSummary,
  TABLE_LOAD_DEBUG_LOG_PREFIX,
} from "../../../../src/DataTable/lesmateriaal-import/shared-utils/tableLoadDebug.js";
import type { TMITableLoadSettledPayload } from "../../../../src/DataTable/lesmateriaal-import/shared-types/tmiTableConfig.types.js";

const payload: TMITableLoadSettledPayload = {
  event: "table_load_settled",
  loadIdentityKey: "list",
  rowCountRendered: 3,
  scopeFilters: [],
  error: null,
};

describe("tableLoadDebug", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      location: { hostname: "example.com" },
      localStorage: {
        getItem: vi.fn(() => null),
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("isTableLoadDebugEnabled", () => {
    it("returns false when window is undefined", () => {
      vi.stubGlobal("window", undefined);
      expect(isTableLoadDebugEnabled()).toBe(false);
    });

    it("returns true on localhost", () => {
      vi.stubGlobal("window", {
        location: { hostname: "localhost" },
        localStorage: { getItem: vi.fn(() => null) },
      });
      expect(isTableLoadDebugEnabled()).toBe(true);
    });

    it("returns true when debug:tableLoad is set", () => {
      vi.stubGlobal("window", {
        location: { hostname: "example.com" },
        localStorage: {
          getItem: vi.fn((key: string) =>
            key === "debug:tableLoad" ? "1" : null,
          ),
        },
      });
      expect(isTableLoadDebugEnabled()).toBe(true);
    });

    it("returns false when host is not local and localStorage is off", () => {
      expect(isTableLoadDebugEnabled()).toBe(false);
    });
  });

  describe("logTableLoadSummary", () => {
    it("does not log when disabled", () => {
      const spy = vi.spyOn(console, "log").mockImplementation(() => {});
      logTableLoadSummary(payload);
      expect(spy).not.toHaveBeenCalled();
    });

    it("logs with prefix and incrementing sequence when enabled", () => {
      vi.stubGlobal("window", {
        location: { hostname: "localhost" },
        localStorage: { getItem: vi.fn(() => null) },
      });
      const spy = vi.spyOn(console, "log").mockImplementation(() => {});
      logTableLoadSummary(payload);
      logTableLoadSummary(payload);
      expect(spy).toHaveBeenNthCalledWith(
        1,
        `${TABLE_LOAD_DEBUG_LOG_PREFIX} #1`,
        payload,
      );
      expect(spy).toHaveBeenNthCalledWith(
        2,
        `${TABLE_LOAD_DEBUG_LOG_PREFIX} #2`,
        payload,
      );
    });
  });
});
