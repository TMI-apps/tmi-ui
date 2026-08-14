import { Alert, Button } from "@mui/material";

/** Inline refetch error when stale rows remain visible (TanStack Query keepPreviousData pattern). */
export function DatabaseViewerInlineErrorBanner({
  error,
  onRetry,
}: {
  error: string;
  onRetry?: () => void;
}) {
  return (
    <Alert
      severity="error"
      sx={{ mb: 1, flexShrink: 0 }}
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Opnieuw proberen
          </Button>
        ) : undefined
      }
    >
      {error}
    </Alert>
  );
}
