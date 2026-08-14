import { describe, expect, it } from "vitest";
import { isImageFileAcceptedAsCover } from "../../../../src/DataTable/lesmateriaal-import/shared-utils/coverImageValidation.js";

describe("isImageFileAcceptedAsCover", () => {
  it("accepts image MIME types", () => {
    expect(
      isImageFileAcceptedAsCover(
        new File(["x"], "a.png", { type: "image/png" }),
      ),
    ).toBe(true);
  });

  it("accepts common extensions when MIME is empty", () => {
    expect(
      isImageFileAcceptedAsCover(new File(["x"], "photo.JPEG", { type: "" })),
    ).toBe(true);
  });

  it("rejects PDF and documents", () => {
    expect(
      isImageFileAcceptedAsCover(
        new File(["x"], "doc.pdf", { type: "application/pdf" }),
      ),
    ).toBe(false);
  });
});
