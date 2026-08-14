import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Row, Table as TanStackTableType } from "@tanstack/react-table";
import { describe, expect, it, vi } from "vitest";
import { DatabaseViewerDataRow } from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/table/DatabaseViewerDataRow.js";

function makeRow(selected = false): Row<{ id: string; name: string }> {
  return {
    id: "row-1",
    original: { id: "row-1", name: "Alpha" },
    depth: 0,
    getIsExpanded: () => false,
    getIsSelected: () => selected,
    getCanExpand: () => false,
    getVisibleCells: () => [],
  } as unknown as Row<{ id: string; name: string }>;
}

const tableStub = {} as TanStackTableType<{ id: string; name: string }>;

describe("DatabaseViewerDataRow accessibility", () => {
  it("sets aria-selected when row is selected", () => {
    render(
      <table>
        <tbody>
          <DatabaseViewerDataRow
            row={makeRow(true)}
            rowIsClickable
            rowIntentEnabled={false}
            onRowClick={vi.fn()}
            canDrop={false}
            isDragOver={false}
            table={tableStub}
            interactionSkinPreset="default"
            rowIsSelected
            rowSelectionEnabled
          />
        </tbody>
      </table>,
    );
    expect(screen.getByRole("row")).toHaveAttribute("aria-selected", "true");
  });

  it("does not open row on Space when selection enabled (keyboard path B)", async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(
      <table>
        <tbody>
          <DatabaseViewerDataRow
            row={makeRow()}
            rowIsClickable
            rowIntentEnabled={false}
            onRowClick={onRowClick}
            canDrop={false}
            isDragOver={false}
            table={tableStub}
            interactionSkinPreset="default"
            rowSelectionEnabled
          />
        </tbody>
      </table>,
    );
    const row = screen.getByRole("row");
    row.focus();
    await user.keyboard(" ");
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it("opens row on Enter when selection enabled", async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(
      <table>
        <tbody>
          <DatabaseViewerDataRow
            row={makeRow()}
            rowIsClickable
            rowIntentEnabled={false}
            onRowClick={onRowClick}
            canDrop={false}
            isDragOver={false}
            table={tableStub}
            interactionSkinPreset="default"
            rowSelectionEnabled
          />
        </tbody>
      </table>,
    );
    const row = screen.getByRole("row");
    row.focus();
    await user.keyboard("{Enter}");
    expect(onRowClick).toHaveBeenCalled();
  });
});
