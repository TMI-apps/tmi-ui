import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DatabaseViewerInlineErrorBanner } from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/table/DatabaseViewerInlineErrorBanner.js";
import { DatabaseViewerLoadingSkeleton } from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/table/DatabaseViewerLoadingSkeleton.js";

describe("DatabaseViewerInlineErrorBanner", () => {
  it("renders error message and retry", () => {
    const onRetry = vi.fn();
    render(
      <DatabaseViewerInlineErrorBanner
        error="Fetch failed"
        onRetry={onRetry}
      />,
    );
    expect(screen.getByText("Fetch failed")).toBeTruthy();
    screen.getByRole("button", { name: /Opnieuw proberen/i }).click();
    expect(onRetry).toHaveBeenCalled();
  });
});

describe("DatabaseViewerLoadingSkeleton", () => {
  it("renders busy skeleton table with clipped status text", () => {
    render(
      <DatabaseViewerLoadingSkeleton ariaLabel="Test tabel" colCount={3} />,
    );
    expect(screen.getByLabelText("Test tabel")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    // Present for SR; must stay clipped (MUI width/height: 1 = 100% without clip)
    expect(screen.getByRole("status")).toHaveTextContent("Tabel laden…");
  });
});
