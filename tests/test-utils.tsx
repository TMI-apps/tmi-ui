import { ThemeProvider, createTheme } from "@mui/material/styles";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

function themeWrapper(theme = createTheme()) {
  return function Wrapper({ children }: { children: ReactNode }): ReactElement {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
  };
}

export function renderWithTheme(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
): ReturnType<typeof render> {
  return render(ui, { wrapper: themeWrapper(), ...options });
}
