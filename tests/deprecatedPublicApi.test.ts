import { describe, expect, it } from "vitest";
import {
  AirtableAttachmentThumbnailCell,
  createAirtableAttachmentThumbnailColumn,
  DatabaseViewer,
  TMITable,
} from "../src/index.js";

describe("deprecated public names", () => {
  it("still import from the root barrel", () => {
    expect(typeof DatabaseViewer).toBe("function");
    expect(typeof TMITable).toBe("function");
    expect(typeof AirtableAttachmentThumbnailCell).toBe("function");
    expect(typeof createAirtableAttachmentThumbnailColumn).toBe("function");
  });
});
