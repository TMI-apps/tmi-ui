import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { UnsavedChangesDialog } from "../../../../src/DataTable/lesmateriaal-import/tmiTable/UnsavedChangesDialog.js";
import type { RecordExitConfirmState } from "../../../../src/DataTable/lesmateriaal-import/shared-types/recordEditSession.types.js";

function Harness({
  onConfirmSave,
  onBeforeDiscard,
  closePanel,
}: {
  onConfirmSave: () => Promise<boolean>;
  onBeforeDiscard: () => void;
  closePanel: () => void;
}) {
  const [exitConfirmDialog, setExitConfirmDialog] =
    useState<RecordExitConfirmState>({
      open: true,
      pendingAction: "close",
    });
  const [, setEditMode] = useState(false);
  const [, setHasUnsavedChanges] = useState(true);

  return (
    <UnsavedChangesDialog
      exitConfirmDialog={exitConfirmDialog}
      setExitConfirmDialog={setExitConfirmDialog}
      onConfirmSave={onConfirmSave}
      setEditMode={setEditMode}
      setHasUnsavedChanges={setHasUnsavedChanges}
      exitNavigate={{ closePanel, goBack: vi.fn() }}
      onBeforeDiscard={onBeforeDiscard}
      localeText={{
        title: "T",
        body: "B",
        cancel: "C",
        discard: "D",
        save: "S",
      }}
    />
  );
}

describe("UnsavedChangesDialog", () => {
  it("invokes onBeforeDiscard then closePanel when discard is chosen for pending close", async () => {
    const user = userEvent.setup();
    const onConfirmSave = vi.fn();
    const onBeforeDiscard = vi.fn();
    const closePanel = vi.fn();

    render(
      <Harness
        onConfirmSave={onConfirmSave}
        onBeforeDiscard={onBeforeDiscard}
        closePanel={closePanel}
      />,
    );

    await user.click(screen.getByRole("button", { name: "D" }));

    expect(onBeforeDiscard).toHaveBeenCalledTimes(1);
    expect(closePanel).toHaveBeenCalledTimes(1);
    expect(onConfirmSave).not.toHaveBeenCalled();
  });

  it("calls onConfirmSave before closePanel when save succeeds", async () => {
    const user = userEvent.setup();
    const onConfirmSave = vi.fn().mockResolvedValue(true);
    const onBeforeDiscard = vi.fn();
    const closePanel = vi.fn();

    render(
      <Harness
        onConfirmSave={onConfirmSave}
        onBeforeDiscard={onBeforeDiscard}
        closePanel={closePanel}
      />,
    );

    await user.click(screen.getByRole("button", { name: "S" }));

    await waitFor(() => {
      expect(onConfirmSave).toHaveBeenCalledTimes(1);
      expect(closePanel).toHaveBeenCalledTimes(1);
    });
    expect(onBeforeDiscard).not.toHaveBeenCalled();
  });
});
