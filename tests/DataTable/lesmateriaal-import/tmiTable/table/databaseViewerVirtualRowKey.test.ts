import { describe, expect, it, vi } from "vitest";
import {
  buildDatabaseViewerVirtualRowKey,
  warnDuplicateDatabaseViewerVirtualRowKeys,
} from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/table/databaseViewerVirtualRowKey.js";

describe("buildDatabaseViewerVirtualRowKey", () => {
  it("uses row id string", () => {
    expect(buildDatabaseViewerVirtualRowKey("abc|def")).toBe("abc|def");
  });

  it("maps missing ids to noid", () => {
    expect(buildDatabaseViewerVirtualRowKey(null)).toBe("noid");
    expect(buildDatabaseViewerVirtualRowKey("")).toBe("noid");
  });
});

describe("warnDuplicateDatabaseViewerVirtualRowKeys", () => {
  it("warns on duplicate keys in dev", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    warnDuplicateDatabaseViewerVirtualRowKeys(["a", "b", "a"], "test");
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("does not warn when ids are unique", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    warnDuplicateDatabaseViewerVirtualRowKeys(["a", "b", "c"], "test");
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
