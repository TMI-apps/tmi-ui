import { Box, Paper, Stack, Typography } from "@mui/material";
import type { ReactElement } from "react";
import {
  usePortaledOverlayPopperZIndex,
  useWorkspaceDrawerOverlayZIndex,
} from "@tmi-packages/ui";

// Every preview in this design system already renders inside a real
// PortaledOverlayStackProvider (AppProviders wires it with the same
// hostModalZ a production workspace detail drawer would use) — so this story
// deliberately does NOT nest another one. It demonstrates the provider's
// actual contract by reading the two derived z-index values back out
// through its paired hooks and applying one to a mock portaled surface.
function ZIndexReadout(): ReactElement {
  const popperZ = usePortaledOverlayPopperZIndex();
  const modalZ = useWorkspaceDrawerOverlayZIndex();

  return (
    <Stack spacing={1.5} sx={{ maxWidth: 440 }}>
      <Typography variant="caption" color="text.secondary">
        Resolved from the app-shell PortaledOverlayStackProvider (see
        AppProviders) — these are the real stacking values, not mocked ones.
      </Typography>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="body2">
          Popper / listbox tier (usePortaledOverlayPopperZIndex):{" "}
          <strong>{popperZ ?? "undefined (no provider)"}</strong>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Modal tier — Dialog / Menu / Popover (useWorkspaceDrawerOverlayZIndex):{" "}
          <strong>{modalZ}</strong>
        </Typography>
      </Paper>
      <Box
        sx={{
          position: "relative",
          height: 64,
          borderRadius: 1,
          border: "1px dashed",
          borderColor: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: modalZ,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="caption">Mock portaled surface, zIndex: {modalZ}</Typography>
      </Box>
    </Stack>
  );
}

export function Default(): ReactElement {
  return <ZIndexReadout />;
}
