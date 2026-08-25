import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PortaledOverlayStackProvider } from "@tmi-packages/ui";
import { App } from "./App.js";
import { workshopTheme } from "./theme.js";

const root = document.getElementById("root");
if (!root) {
  throw new Error("playground root element missing");
}

createRoot(root).render(
  <StrictMode>
    <ThemeProvider theme={workshopTheme}>
      <CssBaseline />
      <PortaledOverlayStackProvider hostModalZ={1400}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PortaledOverlayStackProvider>
    </ThemeProvider>
  </StrictMode>,
);
