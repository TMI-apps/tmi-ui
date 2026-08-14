import { Alert, Snackbar } from "@mui/material";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { OPTIMISTIC_TABLE_ROLLBACK_TOAST_MESSAGE } from "../../shared-utils/tableFeedbackRollbackMessage.js";
import type { OptimisticTableFeedbackControls } from "../../shared-types/optimisticTableFeedback.types.js";
import type { TmiTableLocaleText } from "./tmiTableLocaleText.js";

const noopFeedback: OptimisticTableFeedbackControls = {
  beginPendingRow: () => {
    /* outside provider */
  },
  endPendingRow: () => {
    /* outside provider */
  },
  isRowPending: () => false,
  showRollbackToast: () => {
    /* outside provider */
  },
  showWarningToast: () => {
    /* outside provider */
  },
};

const OptimisticTableFeedbackContext =
  createContext<OptimisticTableFeedbackControls | null>(null);

/** `true` when rendered under {@link OptimisticTableFeedbackProvider} (not the out-of-tree noop). */
export function useOptimisticTableFeedbackHasProvider(): boolean {
  return useContext(OptimisticTableFeedbackContext) !== null;
}

export function OptimisticTableFeedbackProvider({
  children,
  localeText,
}: {
  children: ReactNode;
  localeText?: TmiTableLocaleText;
}) {
  const [pending, setPending] = useState<Record<string, true>>({});
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "warning";
  }>({
    open: false,
    message: "",
    severity: "error",
  });

  const beginPendingRow = useCallback((rowId: string) => {
    const id = rowId.trim();
    if (!id) return;
    setPending((p) => ({ ...p, [id]: true }));
  }, []);

  const endPendingRow = useCallback((rowId: string) => {
    const id = rowId.trim();
    if (!id) return;
    setPending((p) => {
      if (!p[id]) return p;
      const next = { ...p };
      delete next[id];
      return next;
    });
  }, []);

  const isRowPending = useCallback(
    (rowId: string) => Boolean(pending[rowId.trim()]),
    [pending],
  );

  const showRollbackToast = useCallback(
    (message?: string) => {
      setToast({
        open: true,
        message:
          message?.trim() ||
          localeText?.optimisticRollbackToast?.trim() ||
          OPTIMISTIC_TABLE_ROLLBACK_TOAST_MESSAGE,
        severity: "error",
      });
    },
    [localeText?.optimisticRollbackToast],
  );

  const showWarningToast = useCallback((message: string) => {
    const m = message.trim();
    if (!m) return;
    setToast({
      open: true,
      message: m,
      severity: "warning",
    });
  }, []);

  const value = useMemo(
    (): OptimisticTableFeedbackControls => ({
      beginPendingRow,
      endPendingRow,
      isRowPending,
      showRollbackToast,
      showWarningToast,
    }),
    [
      beginPendingRow,
      endPendingRow,
      isRowPending,
      showRollbackToast,
      showWarningToast,
    ],
  );

  const handleCloseToast = useCallback(() => {
    setToast((t) => ({ ...t, open: false }));
  }, []);

  return (
    <OptimisticTableFeedbackContext.Provider value={value}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={handleCloseToast}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </OptimisticTableFeedbackContext.Provider>
  );
}

export function useOptimisticTableFeedback(): OptimisticTableFeedbackControls {
  return useContext(OptimisticTableFeedbackContext) ?? noopFeedback;
}
