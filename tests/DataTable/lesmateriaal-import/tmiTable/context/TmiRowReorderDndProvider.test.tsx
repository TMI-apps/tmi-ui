import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TmiRowReorderDndProvider } from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/context/TmiRowReorderDndProvider.js";

describe("TmiRowReorderDndProvider", () => {
  it("renders children inside the dnd shell", () => {
    render(
      <TmiRowReorderDndProvider sensors={[]} onDragEnd={vi.fn()}>
        <span>row-reorder shell</span>
      </TmiRowReorderDndProvider>,
    );
    expect(screen.getByText("row-reorder shell")).toBeInTheDocument();
  });
});
