import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink, Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";
import { DocsPage } from "./DocsPage.js";
import { WorkshopLayout, WorkshopSidebar } from "./layout/WorkshopLayout.js";
import { VisualsPage, visualTocItems } from "./visualSections.js";

export function App(): ReactElement {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            @tmi-packages/ui workshop
          </Typography>
          <Button component={RouterLink} to="/" color="inherit">
            Visuals
          </Button>
          <Button component={RouterLink} to="/docs" color="inherit">
            Docs
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <Routes>
          <Route
            path="/"
            element={
              <WorkshopLayout
                sidebar={
                  <WorkshopSidebar
                    title="Visual components"
                    items={visualTocItems()}
                  />
                }
              >
                <VisualsPage />
              </WorkshopLayout>
            }
          />
          <Route path="/docs" element={<DocsPage />} />
        </Routes>
      </Box>
    </Box>
  );
}
