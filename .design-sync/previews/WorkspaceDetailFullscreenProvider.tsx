import { Button, Paper, Stack, Typography } from "@mui/material";
import { useState, type ReactElement } from "react";
import {
  WorkspaceDetailFullscreenProvider,
  useWorkspaceDetailFullscreen,
} from "@tmi-packages/ui";

// Composes the provider with a real controlled value (active/available/toggle)
// and a child that reads it back via the paired hook — the same shape
// TMITableWorkspace uses to let its detail pane hide the primary column.
function FullscreenToggleDemo(): ReactElement {
  const fullscreen = useWorkspaceDetailFullscreen();
  return (
    <Stack direction="row" spacing={2} sx={{ maxWidth: 480 }}>
      {!fullscreen?.active && (
        <Paper
          variant="outlined"
          sx={{
            flex: 1,
            minWidth: 80,
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Primary column
          </Typography>
        </Paper>
      )}
      <Paper
        variant="outlined"
        sx={{
          flex: fullscreen?.active ? 1 : 2,
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography variant="subtitle2">Detail panel</Typography>
        <Typography variant="body2" color="text.secondary">
          active: <strong>{String(fullscreen?.active)}</strong> · available:{" "}
          <strong>{String(fullscreen?.available)}</strong>
        </Typography>
        <Button
          size="small"
          variant="outlined"
          disabled={!fullscreen?.available}
          onClick={() => fullscreen?.toggle()}
          sx={{ alignSelf: "flex-start" }}
        >
          Toggle fullscreen detail
        </Button>
      </Paper>
    </Stack>
  );
}

function ControlledDemo({ initialActive }: { initialActive: boolean }): ReactElement {
  const [active, setActive] = useState(initialActive);
  return (
    <WorkspaceDetailFullscreenProvider
      value={{ active, available: true, toggle: () => setActive((a) => !a) }}
    >
      <FullscreenToggleDemo />
    </WorkspaceDetailFullscreenProvider>
  );
}

export function Inline(): ReactElement {
  return <ControlledDemo initialActive={false} />;
}

export function Fullscreen(): ReactElement {
  return <ControlledDemo initialActive={true} />;
}
