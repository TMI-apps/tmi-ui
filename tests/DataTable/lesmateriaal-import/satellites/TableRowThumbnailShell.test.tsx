import type { ReactNode } from "react";
import { Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  TableRowThumbnailPlaceholder,
  TableRowThumbnailShell,
} from "../../../../src/DataTable/lesmateriaal-import/satellites/TableRowThumbnailShell.js";

const theme = createTheme();

function withTheme(children: ReactNode) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

describe("TableRowThumbnailPlaceholder", () => {
  it("renders the centred em dash marker", () => {
    render(withTheme(<TableRowThumbnailPlaceholder />));
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});

describe("TableRowThumbnailShell", () => {
  it("renders img and invokes onError when decode fails", () => {
    const onError = vi.fn();

    render(
      withTheme(
        <Box sx={{ width: 56, height: 48 }}>
          <TableRowThumbnailShell
            src="http://broken.local/nope.jpg"
            alt="row"
            onError={onError}
          />
        </Box>,
      ),
    );

    const img = document.querySelector('img[alt="row"]');
    expect(img).toBeTruthy();
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("fetchpriority", "low");
    fireEvent.error(img!);

    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("renders loading=eager without low fetch priority", () => {
    render(
      withTheme(
        <TableRowThumbnailShell
          src="http://cdn.local/thumb.jpg"
          alt="eager-row"
          imgLoading="eager"
        />,
      ),
    );

    const img = document.querySelector('img[alt="eager-row"]');
    expect(img).toHaveAttribute("loading", "eager");
    expect(img).not.toHaveAttribute("fetchpriority");
  });
});
