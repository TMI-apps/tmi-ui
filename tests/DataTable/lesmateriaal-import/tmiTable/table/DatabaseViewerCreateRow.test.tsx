import type { ColumnDef } from "@tanstack/react-table";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OptimisticTableFeedbackProvider } from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/feedback/OptimisticTableFeedbackContext.js";
import { TMITable } from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/TmiTable.js";
import { staticClientVirtualizedList } from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/table/DatabaseViewer.js";
import { splitCreatePasteLines } from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/table/databaseViewerCreatePaste.js";
import type { TmiTableRowCreateConfig } from "../../../../../src/DataTable/lesmateriaal-import/tmiTable/table/tmiTableRowCreate.types.js";

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

function pasteInto(el: HTMLElement, text: string) {
  fireEvent.paste(el, {
    clipboardData: {
      getData: () => text,
    },
  });
}

function createNameInput() {
  return screen.getByRole("textbox", { name: "Name" }) as HTMLInputElement;
}

function renderGrid(
  extras: {
    rowCreate?: TmiTableRowCreateConfig;
    loading?: boolean;
    error?: string | null;
    data?: Row[];
  } = {},
) {
  const data = extras.data ?? rows;
  return render(
    withTheme(
      <OptimisticTableFeedbackProvider>
        <TMITable
          data={data}
          columns={columns}
          loading={extras.loading ?? false}
          error={extras.error ?? null}
          getRowId={(r) => r.id}
          serverInfinite={staticClientVirtualizedList(data.length)}
          ariaLabel="Create-row test table"
          {...(extras.rowCreate ? { rowCreate: extras.rowCreate } : {})}
        />
      </OptimisticTableFeedbackProvider>,
    ),
  );
}

describe("splitCreatePasteLines", () => {
  it("skips blank lines", () => {
    expect(splitCreatePasteLines("a\n\n b \r\nc\n")).toEqual(["a", " b ", "c"]);
  });
});

describe("TMITable rowCreate", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("omits the create strip when rowCreate is not passed", () => {
    mockLgPlusMatchMedia();
    renderGrid();
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("renders create inputs when rowCreate is set", () => {
    mockLgPlusMatchMedia();
    renderGrid({
      rowCreate: { onCreate: vi.fn(async () => "n1") },
    });
    expect(createNameInput()).toBeTruthy();
    expect(screen.getByLabelText("Add row")).toBeTruthy();
  });

  it("does not show the strip on full-page loading", () => {
    mockLgPlusMatchMedia();
    renderGrid({
      loading: true,
      data: [],
      rowCreate: { onCreate: vi.fn(async () => "n1") },
    });
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("does not show the strip on full-page error", () => {
    mockLgPlusMatchMedia();
    renderGrid({
      error: "boom",
      data: [],
      rowCreate: { onCreate: vi.fn(async () => "n1") },
    });
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("commits a non-empty cell on Enter", async () => {
    mockLgPlusMatchMedia();
    const onCreate = vi.fn(async () => "n2");
    const user = userEvent.setup();
    renderGrid({ rowCreate: { onCreate } });
    const input = createNameInput();
    await user.click(input);
    await user.keyboard("Beta{Enter}");
    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith({
        columnId: "name",
        value: "Beta",
        source: "commit",
      });
    });
    await waitFor(() => {
      expect(createNameInput().value).toBe("");
    });
  });

  it("does not call onCreate for an empty commit", async () => {
    mockLgPlusMatchMedia();
    const onCreate = vi.fn(async () => "n2");
    const user = userEvent.setup();
    renderGrid({ rowCreate: { onCreate } });
    await user.click(createNameInput());
    await user.keyboard("{Enter}");
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("keeps draft when onCreate rejects", async () => {
    mockLgPlusMatchMedia();
    const onCreate = vi.fn(async () => {
      throw new Error("nope");
    });
    const user = userEvent.setup();
    renderGrid({ rowCreate: { onCreate } });
    const input = createNameInput();
    await user.click(input);
    await user.keyboard("Zeta{Enter}");
    await waitFor(() => {
      expect(onCreate).toHaveBeenCalled();
    });
    expect(createNameInput().value).toBe("Zeta");
  });

  it("pastes multiple lines as ordered onCreate calls", async () => {
    mockLgPlusMatchMedia();
    const onCreate = vi.fn(async () => "ok");
    renderGrid({ rowCreate: { onCreate } });
    pasteInto(createNameInput(), "one\n\ntwo\nthree");
    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledTimes(3);
    });
    expect(onCreate).toHaveBeenNthCalledWith(1, {
      columnId: "name",
      value: "one",
      source: "paste",
    });
    expect(onCreate).toHaveBeenNthCalledWith(2, {
      columnId: "name",
      value: "two",
      source: "paste",
    });
    expect(onCreate).toHaveBeenNthCalledWith(3, {
      columnId: "name",
      value: "three",
      source: "paste",
    });
  });

  it("stops paste on first failure and keeps remaining lines", async () => {
    mockLgPlusMatchMedia();
    const onCreate = vi
      .fn()
      .mockResolvedValueOnce("ok")
      .mockRejectedValueOnce(new Error("fail"));
    renderGrid({ rowCreate: { onCreate } });
    pasteInto(createNameInput(), "keep\nfail\nlater");
    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledTimes(2);
    });
    await waitFor(() => {
      expect(createNameInput().value).toBe("fail\nlater");
    });
  });

  it("lets a single-line paste go into the input", async () => {
    mockLgPlusMatchMedia();
    const onCreate = vi.fn(async () => "n");
    renderGrid({ rowCreate: { onCreate } });
    pasteInto(createNameInput(), "solo");
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("does not expose a selectable create row id", () => {
    mockLgPlusMatchMedia();
    renderGrid({
      rowCreate: { onCreate: vi.fn(async () => "n1") },
    });
    const createRow = screen
      .getAllByRole("row")
      .find((row) => row.hasAttribute("data-tmi-create-row"));
    expect(createRow).toBeTruthy();
    expect(createRow?.hasAttribute("data-dbv-row-id")).toBe(false);
    expect(createRow?.getAttribute("aria-selected")).toBe("false");
  });
});
