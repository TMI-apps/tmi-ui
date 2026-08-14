/** Row-level pending + rollback toast contract for optimistic table saves (UI implements via React context). */
export interface OptimisticTableFeedbackControls {
  beginPendingRow: (rowId: string) => void;
  endPendingRow: (rowId: string) => void;
  isRowPending: (rowId: string) => boolean;
  showRollbackToast: (message?: string) => void;
  /** Non-blocking warning (e.g. lesson saved but bookmark step failed). */
  showWarningToast: (message: string) => void;
}
