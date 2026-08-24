import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AutocompleteSelectField } from "../src/AutocompleteSelect/AutocompleteSelectField.js";
import { ListRowAddButton } from "../src/AutocompleteSelect/ListRowAddButton.js";
import { PrimaryContainedAutocompleteBar } from "../src/AutocompleteSelect/PrimaryContainedAutocompleteBar.js";
import { PortaledOverlayStackProvider } from "../src/DataTable/lesmateriaal-import/shared-context/PortaledOverlayStackContext.js";
import { createTmiTableTheme } from "../src/DataTable/lesmateriaal-import/theme/createTmiTableTheme.js";
import { renderWithTheme } from "./test-utils.js";

const OPTIONS = [
  { id: "1", label: "Alpha" },
  { id: "2", label: "Beta" },
];

function Overlay({ children }: { children: ReactNode }): ReactElement {
  return (
    <PortaledOverlayStackProvider hostModalZ={1300}>
      {children}
    </PortaledOverlayStackProvider>
  );
}

function renderPrimaryChrome(ui: ReactElement) {
  const theme = createTmiTableTheme(createTheme());
  return render(
    <ThemeProvider theme={theme}>
      <Overlay>{ui}</Overlay>
    </ThemeProvider>,
  );
}

describe("AutocompleteSelectField", () => {
  it("mounts inside PortaledOverlayStackProvider", () => {
    renderWithTheme(
      <Overlay>
        <AutocompleteSelectField
          mode="single"
          label="Pick"
          options={OPTIONS}
          value={null}
          onChange={() => undefined}
        />
      </Overlay>,
    );
    expect(screen.getByRole("combobox", { name: /pick/i })).toBeInTheDocument();
  });

  it("selects a single option via userEvent", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithTheme(
      <Overlay>
        <AutocompleteSelectField
          mode="single"
          label="Pick"
          options={OPTIONS}
          value={null}
          onChange={onChange}
        />
      </Overlay>,
    );
    await user.click(screen.getByRole("combobox", { name: /pick/i }));
    await user.click(await screen.findByRole("option", { name: "Alpha" }));
    expect(onChange).toHaveBeenCalledWith("1");
  });

  it("adds and removes multiple selections via userEvent", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithTheme(
      <Overlay>
        <AutocompleteSelectField
          mode="multiple"
          label="Tags"
          options={OPTIONS}
          value={["1"]}
          onChange={onChange}
        />
      </Overlay>,
    );
    await user.click(screen.getByRole("combobox", { name: /tags/i }));
    await user.click(await screen.findByRole("option", { name: "Beta" }));
    expect(onChange).toHaveBeenCalledWith(["1", "2"]);

    await user.click(screen.getByRole("button", { name: /verwijder alpha/i }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("disables the combobox when disabled", () => {
    renderWithTheme(
      <Overlay>
        <AutocompleteSelectField
          mode="single"
          label="Pick"
          options={OPTIONS}
          value={null}
          onChange={() => undefined}
          disabled
        />
      </Overlay>,
    );
    expect(screen.getByRole("combobox", { name: /pick/i })).toBeDisabled();
  });

  it("shows a progress indicator when loading", () => {
    renderWithTheme(
      <Overlay>
        <AutocompleteSelectField
          mode="single"
          label="Pick"
          options={OPTIONS}
          value={null}
          onChange={() => undefined}
          loading
        />
      </Overlay>,
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});

describe("Autocomplete primary chrome", () => {
  it("mounts PrimaryContainedAutocompleteBar under createTmiTableTheme", () => {
    renderPrimaryChrome(
      <PrimaryContainedAutocompleteBar
        mode="single"
        label="Add"
        options={OPTIONS}
        value={null}
        onChange={() => undefined}
      />,
    );
    expect(screen.getByRole("combobox", { name: /add/i })).toBeInTheDocument();
  });

  it("mounts ListRowAddButton visualVariant primary and handles click", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderPrimaryChrome(
      <ListRowAddButton
        label="Toevoegen…"
        visualVariant="primary"
        onClick={onClick}
      />,
    );
    await user.click(screen.getByRole("button", { name: /toevoegen/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
