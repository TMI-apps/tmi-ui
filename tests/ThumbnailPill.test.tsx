import { ThemeProvider, createTheme } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ThumbnailPill } from "../src/ThumbnailPill/ThumbnailPill.js";
import { renderWithTheme } from "./test-utils.js";

describe("ThumbnailPill", () => {
  it("renders title and calls onClick when used as a button", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithTheme(<ThumbnailPill title="Hello" onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: /hello/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders a link when `to` is set", () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={createTheme()}>
          <ThumbnailPill title="Nav" to="/somewhere" />
        </ThemeProvider>
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: /nav/i });
    expect(link).toHaveAttribute("href", "/somewhere");
  });

  it("renders rightSlot", () => {
    renderWithTheme(
      <ThumbnailPill title="T" rightSlot={<span data-testid="slot">X</span>} />,
    );
    expect(screen.getByTestId("slot")).toHaveTextContent("X");
  });
});
