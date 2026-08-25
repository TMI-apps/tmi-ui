import { Alert, Button, Stack, Typography } from "@mui/material";
import { useRef, useState, type ReactElement } from "react";
import {
  DetailShellBackdropDismissRegistrar,
  useRegisterDetailShellBackdropDismiss,
} from "@tmi-packages/ui";

// Pure wiring: the registrar renders no markup itself, it only hands a mutable
// ref down through context. The story proves the actual contract — a mounted
// detail pane registers its close handler, and the shell (the "backdrop click")
// invokes whatever is currently registered.
function DetailPane({ onDismiss }: { onDismiss: () => void }): ReactElement {
  useRegisterDetailShellBackdropDismiss(onDismiss);
  return (
    <Alert severity="info" variant="outlined">
      Detail pane mounted — registered its close handler with the shell.
    </Alert>
  );
}

function Demo(): ReactElement {
  const handlerRef = useRef<(() => void) | null>(null);
  const [dismissCount, setDismissCount] = useState(0);
  const [paneOpen, setPaneOpen] = useState(true);

  return (
    <Stack spacing={1.5} sx={{ maxWidth: 420 }}>
      <Typography variant="caption" color="text.secondary">
        Mimics the drawer backdrop / Escape flow: the shell holds a ref, the
        mounted detail pane registers its own close handler into it.
      </Typography>
      <DetailShellBackdropDismissRegistrar handlerRef={handlerRef}>
        {paneOpen ? (
          <DetailPane
            onDismiss={() => {
              setPaneOpen(false);
              setDismissCount((n) => n + 1);
            }}
          />
        ) : (
          <Alert severity="warning" variant="outlined">
            Detail pane closed.
          </Alert>
        )}
      </DetailShellBackdropDismissRegistrar>
      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          size="small"
          variant="outlined"
          onClick={() => handlerRef.current?.()}
        >
          Simulate backdrop click
        </Button>
        <Typography variant="body2" color="text.secondary">
          dismiss handler fired: {dismissCount}×
        </Typography>
      </Stack>
    </Stack>
  );
}

export function Default(): ReactElement {
  return <Demo />;
}
