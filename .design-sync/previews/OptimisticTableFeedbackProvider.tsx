import { Button, Chip, Stack, Typography } from "@mui/material";
import { useEffect, useState, type ReactElement } from "react";
import {
  OptimisticTableFeedbackProvider,
  useOptimisticTableFeedback,
} from "@tmi-packages/ui";

const DEMO_ROW_ID = "row-42";

// Interactive contract: beginPendingRow/endPendingRow/isRowPending drive a
// pending-save chip on a mock row, exactly like TMITable's rowSavePending prop
// (see kitchenSinkTable.tsx). Buttons make the state machine explorable.
function PendingRowDemo(): ReactElement {
  const { beginPendingRow, endPendingRow, isRowPending, showRollbackToast, showWarningToast } =
    useOptimisticTableFeedback();
  const [, forceRender] = useState(0);

  return (
    <Stack spacing={1.5} sx={{ maxWidth: 440 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2">Row {DEMO_ROW_ID}</Typography>
        <Chip
          size="small"
          label={isRowPending(DEMO_ROW_ID) ? "saving…" : "saved"}
          color={isRowPending(DEMO_ROW_ID) ? "warning" : "success"}
          variant="outlined"
        />
      </Stack>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            beginPendingRow(DEMO_ROW_ID);
            forceRender((n) => n + 1);
          }}
        >
          Begin pending
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            endPendingRow(DEMO_ROW_ID);
            forceRender((n) => n + 1);
          }}
        >
          End pending
        </Button>
        <Button size="small" color="error" variant="outlined" onClick={() => showRollbackToast()}>
          Trigger rollback toast
        </Button>
        <Button
          size="small"
          color="warning"
          variant="outlined"
          onClick={() => showWarningToast("Row exceeds the 200-character limit.")}
        >
          Trigger warning toast
        </Button>
      </Stack>
    </Stack>
  );
}

export function Default(): ReactElement {
  return (
    <OptimisticTableFeedbackProvider>
      <PendingRowDemo />
    </OptimisticTableFeedbackProvider>
  );
}

// The provider owns its own Snackbar+Alert (severity="error", variant="filled")
// for optimistic-write rollback. Firing it on mount shows that real, provider-owned
// UI surface — not just the plumbing.
function RollbackToastOnMount(): ReactElement {
  const { showRollbackToast } = useOptimisticTableFeedback();
  useEffect(() => {
    showRollbackToast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Typography variant="body2" color="text.secondary">
      A write failed and was rolled back — see the toast.
    </Typography>
  );
}

export function RollbackToastVisible(): ReactElement {
  return (
    <OptimisticTableFeedbackProvider>
      <RollbackToastOnMount />
    </OptimisticTableFeedbackProvider>
  );
}

// Same Snackbar, warning severity, with a caller-supplied message — the
// validation-style path (e.g. paste-created rows exceeding a limit).
function WarningToastOnMount(): ReactElement {
  const { showWarningToast } = useOptimisticTableFeedback();
  useEffect(() => {
    showWarningToast("3 pasted rows were skipped: missing required field.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Typography variant="body2" color="text.secondary">
      A bulk paste partially failed validation — see the toast.
    </Typography>
  );
}

export function WarningToastVisible(): ReactElement {
  return (
    <OptimisticTableFeedbackProvider>
      <WarningToastOnMount />
    </OptimisticTableFeedbackProvider>
  );
}
