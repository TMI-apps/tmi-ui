import type { ColumnDef } from "@tanstack/react-table";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DatabaseTableDetailWorkspaceLayoutProvider } from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/context/DatabaseTableDetailWorkspaceLayoutContext.js";
import { TMITable } from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/TmiTable.js";
import { staticClientVirtualizedList } from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/table/DatabaseViewer.js";

const theme = createTheme();

type Row = { id: string; name: string };

const columns: Array<ColumnDef<Row, unknown>> = [
  { accessorKey: "name", header: "Name" },
];
const rows: Row[] = [{ id: "1", name: "Alpha" }];

function withTheme(children: ReactNode) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

function mockLgPlusMatchMedia() {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: !query.includes("max-width"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

function renderTable(
  maxHeight?: number | string | false,
  layout?: { tableMaxHeightPx: number | string; fillViewport: boolean },
) {
  const table = (
    <TMITable
      data={rows}
      columns={columns}
      loading={false}
      error={null}
      getRowId={(r) => r.id}
      serverInfinite={staticClientVirtualizedList(rows.length)}
      ariaLabel="Height test table"
      {...(maxHeight !== undefined ? { maxHeight } : {})}
    />
  );
  return render(
    withTheme(
      layout ? (
        <DatabaseTableDetailWorkspaceLayoutProvider value={layout}>
          {table}
        </DatabaseTableDetailWorkspaceLayoutProvider>
      ) : (
        table
      ),
    ),
  );
}

describe("TMITable height policy", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fills from workspace layout when maxHeight is omitted", () => {
    mockLgPlusMatchMedia();
    const { container } = renderTable(undefined, {
      tableMaxHeightPx: "100%",
      fillViewport: true,
    });
    const shell = container.querySelector("[data-tmi-table-height-mode]");
    expect(shell?.getAttribute("data-tmi-table-height-mode")).toBe("fill");
  });

  it("pins when maxHeight is an explicit number", () => {
    mockLgPlusMatchMedia();
    const { container } = renderTable(600, {
      tableMaxHeightPx: "100%",
      fillViewport: true,
    });
    const shell = container.querySelector("[data-tmi-table-height-mode]");
    expect(shell?.getAttribute("data-tmi-table-height-mode")).toBe("pin");
  });

  it("stays content-sized when maxHeight is false", () => {
    mockLgPlusMatchMedia();
    const { container } = renderTable(false, {
      tableMaxHeightPx: "100%",
      fillViewport: true,
    });
    const shell = container.querySelector("[data-tmi-table-height-mode]");
    expect(shell?.getAttribute("data-tmi-table-height-mode")).toBe("content");
  });
});
