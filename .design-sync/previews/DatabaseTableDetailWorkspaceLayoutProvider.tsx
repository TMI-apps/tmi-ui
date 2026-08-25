import { Paper, Stack, Typography } from "@mui/material";
import type { ReactElement } from "react";
import {
  DatabaseTableDetailWorkspaceLayoutProvider,
  useDatabaseTableDetailWorkspaceLayout,
} from "@tmi-packages/ui";

// Pure layout-math plumbing: the provider carries no markup of its own, so
// the story demonstrates its actual contract by reading the resolved value
// back out through the paired hook, the way TMITableWorkspace's table slot does.
function LayoutReadout(): ReactElement {
  const layout = useDatabaseTableDetailWorkspaceLayout();
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        height: 140,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 0.5,
        bgcolor: "background.default",
      }}
    >
      <Typography variant="subtitle2">Table area (mock)</Typography>
      <Typography variant="body2" color="text.secondary">
        tableMaxHeightPx: <strong>{String(layout?.tableMaxHeightPx ?? "—")}</strong>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        fillViewport: <strong>{String(layout?.fillViewport ?? "—")}</strong>
      </Typography>
    </Paper>
  );
}

export function FixedHeight(): ReactElement {
  return (
    <Stack spacing={1} sx={{ maxWidth: 360 }}>
      <Typography variant="caption" color="text.secondary">
        Detail workspace open in a side panel — the table keeps a bounded height.
      </Typography>
      <DatabaseTableDetailWorkspaceLayoutProvider
        value={{ tableMaxHeightPx: 480, fillViewport: false }}
      >
        <LayoutReadout />
      </DatabaseTableDetailWorkspaceLayoutProvider>
    </Stack>
  );
}

export function ViewportFill(): ReactElement {
  return (
    <Stack spacing={1} sx={{ maxWidth: 360 }}>
      <Typography variant="caption" color="text.secondary">
        No detail panel open — the table is allowed to fill the viewport.
      </Typography>
      <DatabaseTableDetailWorkspaceLayoutProvider
        value={{ tableMaxHeightPx: "calc(100vh - 220px)", fillViewport: true }}
      >
        <LayoutReadout />
      </DatabaseTableDetailWorkspaceLayoutProvider>
    </Stack>
  );
}
