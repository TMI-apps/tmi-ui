import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import type { ReactNode } from "react";
import { createTmiTableTheme } from "../../src/DataTable/lesmateriaal-import/theme/createTmiTableTheme.js";
import { PortaledOverlayStackProvider } from "../../src/DataTable/lesmateriaal-import/shared-context/PortaledOverlayStackContext.js";
import { workspaceDetailDrawerModalZ } from "../../src/DataTable/lesmateriaal-import/shared-theme/workspaceDetailDrawerZIndex.js";

const theme = createTmiTableTheme(createTheme({ palette: { mode: "light" } }));
const hostModalZ = workspaceDetailDrawerModalZ(theme);

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PortaledOverlayStackProvider hostModalZ={hostModalZ}>
        {children}
      </PortaledOverlayStackProvider>
    </ThemeProvider>
  );
}
