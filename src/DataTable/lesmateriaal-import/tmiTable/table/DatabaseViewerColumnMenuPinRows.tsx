import { MenuItem } from "@mui/material";
import type { Table as TanStackTableType } from "@tanstack/react-table";

interface DatabaseViewerColumnMenuPinRowsProps<TData extends object> {
  table: TanStackTableType<TData>;
  columnId: string | undefined;
  onClose: () => void;
}

export function DatabaseViewerColumnMenuPinRows<TData extends object>({
  table,
  columnId,
  onClose,
}: DatabaseViewerColumnMenuPinRowsProps<TData>) {
  if (!columnId) return null;
  const col = table.getColumn(columnId);
  const isPinned = Boolean(col?.getIsPinned());
  if (!isPinned) {
    return (
      <MenuItem
        onClick={() => {
          table.getColumn(columnId)?.pin("left");
          onClose();
        }}
      >
        Pin
      </MenuItem>
    );
  }
  return (
    <MenuItem
      onClick={() => {
        table.getColumn(columnId)?.pin(false);
        onClose();
      }}
    >
      Verwijder pin
    </MenuItem>
  );
}
