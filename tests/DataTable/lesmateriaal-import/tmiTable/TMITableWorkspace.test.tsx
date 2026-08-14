import type { ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useWorkspaceDetailFullscreen } from "../../../../src/DataTable/lesmateriaal-import/tmiTable/context/WorkspaceDetailFullscreenContext.js";
import { TMITableWorkspace } from "../../../../src/DataTable/lesmateriaal-import/tmiTable/TMITableWorkspace.js";
import { TMITABLE_FILTER_PROMPT_DEFAULT_CUE } from "../../../../src/DataTable/lesmateriaal-import/tmiTable/tmiTableFilterPromptConstants.js";

const theme = createTheme();

function withTheme(children: ReactNode) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

function mockReducedMotion() {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
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

function mockMatchMedia(options: {
  lgPlus?: boolean;
  reducedMotion?: boolean;
}) {
  const { lgPlus = true, reducedMotion = false } = options;
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => {
      let matches = false;
      if (query === "(prefers-reduced-motion: reduce)") {
        matches = reducedMotion;
      } else if (query.includes("max-width")) {
        matches = !lgPlus;
      }
      return {
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    }),
  );
}

function FullscreenTestHarness() {
  const fullscreen = useWorkspaceDetailFullscreen();
  if (!fullscreen?.available) return null;
  return (
    <button
      type="button"
      data-testid="fs-toggle"
      onClick={() => fullscreen.toggle()}
    >
      toggle
    </button>
  );
}

function renderWorkspace(options: {
  filterPromptActive?: boolean;
  filterPromptCue?: ReactNode;
  table?: ReactNode;
  enableViewportFill?: boolean;
}) {
  const {
    filterPromptActive = false,
    filterPromptCue,
    table = <div data-testid="workspace-table">Table body</div>,
    enableViewportFill = true,
  } = options;

  return render(
    withTheme(
      <TMITableWorkspace
        leftHeader={<div data-testid="workspace-header">Filters</div>}
        table={table}
        detailOpen={false}
        detailPanel={null}
        enableViewportFill={enableViewportFill}
        filterPromptActive={filterPromptActive}
        filterPromptCue={filterPromptCue}
      />,
    ),
  );
}

describe("TMITableWorkspace filter prompt", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should not render table when filterPromptActive is true", () => {
    renderWorkspace({ filterPromptActive: true });
    expect(screen.queryByTestId("workspace-table")).not.toBeInTheDocument();
    expect(screen.getByTestId("workspace-header")).toBeInTheDocument();
  });

  it("should not render empty-results copy when filterPromptActive is true", () => {
    renderWorkspace({
      filterPromptActive: true,
      table: <div>Geen lesmateriaal gevonden.</div>,
    });
    expect(
      screen.queryByText("Geen lesmateriaal gevonden."),
    ).not.toBeInTheDocument();
  });

  it("should render default Dutch cue when active and override omitted", () => {
    renderWorkspace({ filterPromptActive: true });
    expect(screen.getByRole("status")).toHaveTextContent(
      TMITABLE_FILTER_PROMPT_DEFAULT_CUE,
    );
  });

  it("should render custom filterPromptCue when override provided", () => {
    renderWorkspace({
      filterPromptActive: true,
      filterPromptCue: "Custom idle cue",
    });
    expect(screen.getByRole("status")).toHaveTextContent("Custom idle cue");
  });

  it("should render header and table in default layout when filterPromptActive is omitted", () => {
    render(
      withTheme(
        <TMITableWorkspace
          leftHeader={<div data-testid="workspace-header">Filters</div>}
          table={<div data-testid="workspace-table">Table body</div>}
          detailOpen={false}
          detailPanel={null}
        />,
      ),
    );
    expect(screen.getByTestId("workspace-header")).toBeInTheDocument();
    expect(screen.getByTestId("workspace-table")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("should show expanded dock spacers when idle and effectiveFill is true", () => {
    renderWorkspace({ filterPromptActive: true, enableViewportFill: true });
    expect(screen.getByTestId("tmi-workspace-idle-column")).toBeInTheDocument();
    expect(
      screen.getAllByTestId("tmi-workspace-dock-spacer-expanded").length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("should render idle column when effectiveFill is false", () => {
    renderWorkspace({ filterPromptActive: true, enableViewportFill: false });
    expect(screen.getByTestId("tmi-workspace-idle-column")).toBeInTheDocument();
  });

  it("should collapse dock spacers when filterPromptActive is false", () => {
    renderWorkspace({ filterPromptActive: false });
    expect(
      screen.getByTestId("tmi-workspace-primary-column"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("tmi-workspace-dock-spacer-expanded"),
    ).not.toBeInTheDocument();
  });

  it("should show table with enter animation flag when leaving idle", () => {
    const { rerender } = renderWorkspace({ filterPromptActive: true });
    expect(screen.queryByTestId("workspace-table")).not.toBeInTheDocument();

    rerender(
      withTheme(
        <TMITableWorkspace
          leftHeader={<div data-testid="workspace-header">Filters</div>}
          table={<div data-testid="workspace-table">Table body</div>}
          detailOpen={false}
          detailPanel={null}
          enableViewportFill
          filterPromptActive={false}
        />,
      ),
    );

    const surface = screen.getByTestId("tmi-workspace-table-surface");
    expect(screen.getByTestId("workspace-table")).toBeInTheDocument();
    expect(surface).toHaveAttribute("data-table-enter-animated", "true");
  });

  it("should render table when filterPromptActive is false", () => {
    renderWorkspace({ filterPromptActive: false });
    expect(screen.getByTestId("workspace-table")).toBeInTheDocument();
    expect(screen.getByTestId("tmi-workspace-table-surface")).toHaveAttribute(
      "data-table-enter-animated",
      "false",
    );
  });

  it("should disable dock transitions when reduced motion is preferred", () => {
    mockReducedMotion();
    renderWorkspace({ filterPromptActive: true });

    const spacer = screen.getAllByTestId(
      "tmi-workspace-dock-spacer-expanded",
    )[0];
    expect(spacer).toHaveStyle({ transition: "none" });
  });

  it("should skip table enter animation when reduced motion is preferred", () => {
    mockReducedMotion();
    const { rerender } = renderWorkspace({ filterPromptActive: true });

    rerender(
      withTheme(
        <TMITableWorkspace
          leftHeader={<div data-testid="workspace-header">Filters</div>}
          table={<div data-testid="workspace-table">Table body</div>}
          detailOpen={false}
          detailPanel={null}
          enableViewportFill
          filterPromptActive={false}
        />,
      ),
    );

    expect(screen.getByTestId("tmi-workspace-table-surface")).toHaveAttribute(
      "data-table-enter-animated",
      "false",
    );
  });
});

describe("TMITableWorkspace detail fullscreen", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function renderSplitWorkspace(detailOpen: boolean) {
    mockMatchMedia({ lgPlus: true });
    return render(
      withTheme(
        <TMITableWorkspace
          leftHeader={<div data-testid="workspace-header">Filters</div>}
          table={<div data-testid="workspace-table">Table body</div>}
          detailOpen={detailOpen}
          detailPanel={
            detailOpen ? (
              <div data-testid="workspace-detail">
                <FullscreenTestHarness />
              </div>
            ) : null
          }
        />,
      ),
    );
  }

  it("should hide the primary column when fullscreen is toggled on lg+", async () => {
    const user = userEvent.setup();
    renderSplitWorkspace(true);

    expect(
      screen.getByTestId("tmi-workspace-primary-column-shell"),
    ).toHaveAttribute("data-primary-hidden", "false");

    await user.click(screen.getByTestId("fs-toggle"));

    expect(
      screen.getByTestId("tmi-workspace-primary-column-shell"),
    ).toHaveAttribute("data-primary-hidden", "true");
    expect(screen.getByTestId("tmi-workspace-detail-column")).toHaveAttribute(
      "data-detail-fullscreen",
      "true",
    );

    await user.click(screen.getByTestId("fs-toggle"));

    expect(
      screen.getByTestId("tmi-workspace-primary-column-shell"),
    ).toHaveAttribute("data-primary-hidden", "false");
  });

  it("should reset fullscreen when detail closes", async () => {
    const user = userEvent.setup();
    const { rerender } = renderSplitWorkspace(true);

    await user.click(screen.getByTestId("fs-toggle"));
    expect(
      screen.getByTestId("tmi-workspace-primary-column-shell"),
    ).toHaveAttribute("data-primary-hidden", "true");

    rerender(
      withTheme(
        <TMITableWorkspace
          leftHeader={<div data-testid="workspace-header">Filters</div>}
          table={<div data-testid="workspace-table">Table body</div>}
          detailOpen={false}
          detailPanel={null}
        />,
      ),
    );

    rerender(
      withTheme(
        <TMITableWorkspace
          leftHeader={<div data-testid="workspace-header">Filters</div>}
          table={<div data-testid="workspace-table">Table body</div>}
          detailOpen
          detailPanel={
            <div data-testid="workspace-detail">
              <FullscreenTestHarness />
            </div>
          }
        />,
      ),
    );

    expect(
      screen.getByTestId("tmi-workspace-primary-column-shell"),
    ).toHaveAttribute("data-primary-hidden", "false");
  });

  it("should not expose fullscreen toggle in drawer mode", () => {
    mockMatchMedia({ lgPlus: false });

    render(
      withTheme(
        <TMITableWorkspace
          leftHeader={<div data-testid="workspace-header">Filters</div>}
          table={<div data-testid="workspace-table">Table body</div>}
          detailOpen
          detailPanel={
            <div data-testid="workspace-detail">
              <FullscreenTestHarness />
            </div>
          }
        />,
      ),
    );

    expect(screen.queryByTestId("fs-toggle")).not.toBeInTheDocument();
    expect(
      screen.getByTestId("tmi-workspace-primary-column-shell"),
    ).toHaveAttribute("data-primary-hidden", "false");
  });
});
