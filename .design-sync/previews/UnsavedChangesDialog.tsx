import { UnsavedChangesDialog } from "@tmi-packages/ui";

export function ConfirmClose() {
  return (
    <UnsavedChangesDialog
      exitConfirmDialog={{ open: true, pendingAction: "close" }}
      setExitConfirmDialog={() => undefined}
      onConfirmSave={async () => true}
      setEditMode={() => undefined}
      setHasUnsavedChanges={() => undefined}
      exitNavigate={{
        closePanel: () => undefined,
        goBack: () => undefined,
      }}
    />
  );
}

export function ConfirmSwitchRecord() {
  return (
    <UnsavedChangesDialog
      exitConfirmDialog={{
        open: true,
        pendingAction: "switch",
        switchTargetId: "record-2",
      }}
      setExitConfirmDialog={() => undefined}
      onConfirmSave={async () => true}
      setEditMode={() => undefined}
      setHasUnsavedChanges={() => undefined}
      exitNavigate={{
        closePanel: () => undefined,
        goBack: () => undefined,
        openRecord: () => undefined,
      }}
    />
  );
}
