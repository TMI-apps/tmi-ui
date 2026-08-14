import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { Dispatch, SetStateAction } from "react";
import { useWorkspaceDrawerOverlayZIndex } from "../shared-context/PortaledOverlayStackContext.js";
import type { RecordExitConfirmState } from "../shared-types/recordEditSession.types.js";

export interface UnsavedChangesExitNavigate {
  closePanel: () => void;
  goBack: () => void;
  /** When set (e.g. lesmateriaal stack), enables "switch" pending resolution. */
  openRecord?: (id: string) => void;
}

export interface UnsavedChangesDialogLocaleText {
  title: string;
  body: string;
  cancel: string;
  discard: string;
  save: string;
}

const DEFAULT_LOCALE: UnsavedChangesDialogLocaleText = {
  title: "Onopgeslagen wijzigingen",
  body: "Je hebt onopgeslagen wijzigingen. Wat wil je doen?",
  cancel: "Annuleren",
  discard: "Niet opslaan",
  save: "Opslaan",
};

export interface UnsavedChangesDialogProps {
  exitConfirmDialog: RecordExitConfirmState;
  setExitConfirmDialog: Dispatch<SetStateAction<RecordExitConfirmState>>;
  onConfirmSave: () => Promise<boolean>;
  setEditMode: (v: boolean) => void;
  setHasUnsavedChanges: (v: boolean) => void;
  exitNavigate: UnsavedChangesExitNavigate;
  /** Runs when the user confirms discarding changes (before navigation side-effects). */
  onBeforeDiscard?: () => void;
  /** @deprecated Use {@link onBeforeDiscard} */
  onBeforeDiscardNietOpslaan?: () => void;
  /** e.g. clear edit-restore draft after cancel-edit or successful save in that path */
  onResetEditDraft?: () => void;
  ariaTitleId?: string;
  /** @deprecated Prefer `localeText.title` */
  dialogTitle?: string;
  /** Override built-in copy (e.g. other languages). */
  localeText?: Partial<UnsavedChangesDialogLocaleText>;
}

function mergeLocale(
  localeText: Partial<UnsavedChangesDialogLocaleText> | undefined,
  dialogTitle: string | undefined,
): UnsavedChangesDialogLocaleText {
  const titleFromLegacy =
    dialogTitle !== undefined ? { title: dialogTitle } : {};
  return { ...DEFAULT_LOCALE, ...titleFromLegacy, ...localeText };
}

/**
 * Generic MUI dialog for resolving unsaved edits (close / back / switch record / cancel-edit).
 */
export function UnsavedChangesDialog({
  exitConfirmDialog,
  setExitConfirmDialog,
  onConfirmSave,
  setEditMode,
  setHasUnsavedChanges,
  exitNavigate,
  onBeforeDiscard,
  onBeforeDiscardNietOpslaan,
  onResetEditDraft,
  ariaTitleId = "record-exit-confirm-title",
  dialogTitle,
  localeText: localeTextProp,
}: UnsavedChangesDialogProps) {
  const locale = mergeLocale(localeTextProp, dialogTitle);
  const beforeDiscard = onBeforeDiscard ?? onBeforeDiscardNietOpslaan;
  const { closePanel, goBack, openRecord } = exitNavigate;
  const overlayZ = useWorkspaceDrawerOverlayZIndex();

  return (
    <Dialog
      open={exitConfirmDialog.open}
      onClose={() =>
        setExitConfirmDialog({ open: false, pendingAction: "close" })
      }
      maxWidth="xs"
      fullWidth
      aria-labelledby={ariaTitleId}
      slotProps={{
        root: { sx: { zIndex: overlayZ } },
      }}
    >
      <DialogTitle id={ariaTitleId}>{locale.title}</DialogTitle>
      <DialogContent>
        <Typography>{locale.body}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() =>
            setExitConfirmDialog({ open: false, pendingAction: "close" })
          }
        >
          {locale.cancel}
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            const { pendingAction, switchTargetId } = exitConfirmDialog;
            setExitConfirmDialog({ open: false, pendingAction: "close" });
            beforeDiscard?.();
            if (pendingAction === "close") {
              closePanel();
            } else if (
              pendingAction === "switch" &&
              switchTargetId &&
              openRecord
            ) {
              setEditMode(false);
              openRecord(switchTargetId);
            } else if (pendingAction === "back") {
              setEditMode(false);
              setHasUnsavedChanges(false);
              goBack();
            } else if (pendingAction === "cancel-edit") {
              setEditMode(false);
              setHasUnsavedChanges(false);
              onResetEditDraft?.();
            }
          }}
        >
          {locale.discard}
        </Button>
        <Button
          variant="contained"
          onClick={async () => {
            const { pendingAction, switchTargetId } = exitConfirmDialog;
            const ok = await onConfirmSave();
            if (!ok) return;
            setExitConfirmDialog({ open: false, pendingAction: "close" });
            setHasUnsavedChanges(false);
            if (pendingAction === "close") {
              closePanel();
            } else if (
              pendingAction === "switch" &&
              switchTargetId &&
              openRecord
            ) {
              setEditMode(false);
              openRecord(switchTargetId);
            } else if (pendingAction === "back") {
              setEditMode(false);
              goBack();
            } else if (pendingAction === "cancel-edit") {
              setEditMode(false);
              onResetEditDraft?.();
            }
          }}
        >
          {locale.save}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
