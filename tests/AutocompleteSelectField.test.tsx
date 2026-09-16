import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type ReactElement, type ReactNode } from "react";
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

  it("forwards remote query on single fillCell via controlledInput", async () => {
    const user = userEvent.setup();
    const onInputChange = vi.fn();

    function Harness() {
      const [inputValue, setInputValue] = useState("");
      return (
        <AutocompleteSelectField
          mode="single"
          fillCell
          label="Pick"
          options={OPTIONS}
          value={null}
          onChange={() => undefined}
          controlledInput={{
            inputValue,
            onInputChange: (event, value, reason) => {
              setInputValue(value);
              onInputChange(event, value, reason);
            },
          }}
        />
      );
    }

    renderWithTheme(
      <Overlay>
        <Harness />
      </Overlay>,
    );
    await user.type(screen.getByRole("combobox", { name: /pick/i }), "ab");
    expect(onInputChange).toHaveBeenCalledWith(
      expect.anything(),
      "ab",
      "input",
    );
  });

  it("emits a string id from single fillCell, not an array", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithTheme(
      <Overlay>
        <AutocompleteSelectField
          mode="single"
          fillCell
          label="Pick"
          options={OPTIONS}
          value={null}
          onChange={onChange}
          controlledInput={{
            inputValue: "",
            onInputChange: () => undefined,
          }}
        />
      </Overlay>,
    );
    await user.click(screen.getByRole("combobox", { name: /pick/i }));
    await user.click(await screen.findByRole("option", { name: "Alpha" }));
    expect(onChange).toHaveBeenCalledWith("1");
  });

  it("does not render checkboxes in single fillCell", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <Overlay>
        <AutocompleteSelectField
          mode="single"
          fillCell
          label="Pick"
          options={[{ id: "1", label: "Alpha" }]}
          value={null}
          onChange={() => undefined}
        />
      </Overlay>,
    );
    await user.click(screen.getByRole("combobox", { name: /pick/i }));
    expect(
      await screen.findByRole("option", { name: "Alpha" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("renders creatable single fillCell with add affordance and no checkbox", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <Overlay>
        <AutocompleteSelectField
          mode="single"
          fillCell
          label="Pick"
          creatableOptionId="new"
          options={[{ id: "new", label: "Nieuwe activiteit" }]}
          value={null}
          onChange={() => undefined}
        />
      </Overlay>,
    );
    await user.click(screen.getByRole("combobox", { name: /pick/i }));
    const option = await screen.findByRole("option", {
      name: "Nieuwe activiteit",
    });
    expect(option.querySelector("svg")).not.toBeNull();
    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("still renders checkboxes in multiple fillCell with one option", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <Overlay>
        <AutocompleteSelectField
          mode="multiple"
          fillCell
          label="Tags"
          options={[{ id: "1", label: "Alpha" }]}
          value={[]}
          onChange={() => undefined}
        />
      </Overlay>,
    );
    await user.click(screen.getByRole("combobox", { name: /tags/i }));
    expect(
      await screen.findByRole("option", { name: "Alpha" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
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

const CREATE = { id: "create", label: "Create New" };

describe("AutocompleteSelectField creatable sticky", () => {
  it("places a creatable option first even when it is not first in options", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <Overlay>
        <AutocompleteSelectField
          mode="single"
          label="Pick"
          options={[...OPTIONS, CREATE]}
          value={null}
          onChange={() => undefined}
          creatableOptionId="create"
        />
      </Overlay>,
    );
    await user.click(screen.getByRole("combobox", { name: /pick/i }));
    const options = await screen.findAllByRole("option");
    expect(options[0]).toHaveTextContent("Create New");
  });

  it("sticks the creatable option to the top of the listbox", async () => {
    const user = userEvent.setup();
    const many = Array.from({ length: 20 }, (_, i) => ({
      id: `n${i}`,
      label: `Hit ${i}`,
    }));
    renderWithTheme(
      <Overlay>
        <AutocompleteSelectField
          mode="single"
          label="Pick"
          options={[...many, CREATE]}
          value={null}
          onChange={() => undefined}
          creatableOptionId="create"
        />
      </Overlay>,
    );
    await user.click(screen.getByRole("combobox", { name: /pick/i }));
    const first = (await screen.findAllByRole("option"))[0];
    expect(first).toHaveTextContent("Create New");
    expect(first).toHaveStyle({ position: "sticky", top: "0px" });
  });

  it("still first-sticks create when filterOptionsOverride is identity", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <Overlay>
        <AutocompleteSelectField
          mode="single"
          label="Pick"
          options={[OPTIONS[0]!, CREATE, OPTIONS[1]!]}
          value={null}
          onChange={() => undefined}
          creatableOptionId="create"
          filterOptionsOverride={(opts) => opts}
        />
      </Overlay>,
    );
    await user.click(screen.getByRole("combobox", { name: /pick/i }));
    const options = await screen.findAllByRole("option");
    expect(options.map((el) => el.textContent)).toEqual([
      "Create New",
      "Alpha",
      "Beta",
    ]);
    expect(options[0]).toHaveStyle({ position: "sticky" });
  });

  it("does not sticky-header without creatableOptionId; selected stays first", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <Overlay>
        <AutocompleteSelectField
          mode="single"
          label="Pick"
          options={OPTIONS}
          value="2"
          onChange={() => undefined}
        />
      </Overlay>,
    );
    await user.click(screen.getByRole("combobox", { name: /pick/i }));
    const options = await screen.findAllByRole("option");
    expect(options[0]).toHaveTextContent("Beta");
    expect(options[0]).not.toHaveStyle({ position: "sticky" });
    expect(
      options.filter((el) => getComputedStyle(el).position === "sticky"),
    ).toHaveLength(0);
  });

  it("does not invent a creatable row when the id is missing from options", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <Overlay>
        <AutocompleteSelectField
          mode="single"
          label="Pick"
          options={OPTIONS}
          value={null}
          onChange={() => undefined}
          creatableOptionId="create"
        />
      </Overlay>,
    );
    await user.click(screen.getByRole("combobox", { name: /pick/i }));
    const options = await screen.findAllByRole("option");
    expect(options).toHaveLength(2);
    expect(
      screen.queryByRole("option", { name: /create/i }),
    ).not.toBeInTheDocument();
  });

  it("renders no checkbox on the creatable row in multiple mode", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <Overlay>
        <AutocompleteSelectField
          mode="multiple"
          label="Tags"
          options={[...OPTIONS, CREATE]}
          value={[]}
          onChange={() => undefined}
          creatableOptionId="create"
        />
      </Overlay>,
    );
    await user.click(screen.getByRole("combobox", { name: /tags/i }));
    await screen.findByRole("option", { name: "Create New" });
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
    const first = screen.getAllByRole("option")[0];
    expect(first).toHaveTextContent("Create New");
    expect(first?.querySelector('input[type="checkbox"]')).toBeNull();
  });

  it("emits the creatable id on click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithTheme(
      <Overlay>
        <AutocompleteSelectField
          mode="single"
          label="Pick"
          options={[...OPTIONS, CREATE]}
          value={null}
          onChange={onChange}
          creatableOptionId="create"
        />
      </Overlay>,
    );
    await user.click(screen.getByRole("combobox", { name: /pick/i }));
    await user.click(await screen.findByRole("option", { name: "Create New" }));
    expect(onChange).toHaveBeenCalledWith("create");
  });

  it("inherits sticky create on PrimaryContainedAutocompleteBar", async () => {
    const user = userEvent.setup();
    renderPrimaryChrome(
      <PrimaryContainedAutocompleteBar
        mode="single"
        label="Add"
        options={[CREATE, ...OPTIONS]}
        value={null}
        onChange={() => undefined}
        creatableOptionId="create"
      />,
    );
    await user.click(screen.getByRole("combobox", { name: /add/i }));
    const first = (await screen.findAllByRole("option"))[0];
    expect(first).toHaveTextContent("Create New");
    expect(first).toHaveStyle({ position: "sticky" });
  });
});
