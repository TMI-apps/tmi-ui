import type { UnsavedChangesDialogLocaleText } from "../UnsavedChangesDialog.js";

/** Injectable copy for TMI-table feedback surfaces (moves with package in Phase 3). */
export type TmiTableLocaleText = {
  optimisticRollbackToast?: string;
  unsavedChanges?: Partial<UnsavedChangesDialogLocaleText>;
};
