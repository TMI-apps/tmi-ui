import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AutocompleteSelectField } from "../src/AutocompleteSelect/AutocompleteSelectField.js";
import { PortaledOverlayStackProvider } from "../src/DataTable/lesmateriaal-import/shared-context/PortaledOverlayStackContext.js";
import { renderWithTheme } from "./test-utils.js";

describe("AutocompleteSelectField", () => {
  it("mounts inside PortaledOverlayStackProvider", () => {
    renderWithTheme(
      <PortaledOverlayStackProvider hostModalZ={1300}>
        <AutocompleteSelectField
          mode="single"
          label="Pick"
          options={[{ id: "1", label: "A" }]}
          value={null}
          onChange={() => undefined}
        />
      </PortaledOverlayStackProvider>,
    );
    expect(screen.getByRole("combobox", { name: /pick/i })).toBeInTheDocument();
  });
});
