export type RecordExitPendingAction =
  | "close"
  | "back"
  | "cancel-edit"
  | "switch";

/** State for the shared unsaved-changes confirmation dialog. */
export interface RecordExitConfirmState {
  open: boolean;
  pendingAction: RecordExitPendingAction;
  switchTargetId?: string;
}
