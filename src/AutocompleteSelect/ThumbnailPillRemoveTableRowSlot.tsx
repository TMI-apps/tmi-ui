import Delete from "@mui/icons-material/Delete";
import { TableRowActionButton } from "../DataTable/lesmateriaal-import/satellites/TableRowActionButton.js";

/** Shared sizing for remove actions in `@tmi-packages/ui` `ThumbnailPill` `rightSlot`s. */
export const THUMBNAIL_PILL_REMOVE_ACTION_SX = {
  px: 0.5,
  minWidth: 32,
  minHeight: 28,
  borderRadius: 0,
} as const;

export function ThumbnailPillRemoveTableRowSlot({
  removeAriaLabel,
  onRemove,
}: {
  removeAriaLabel: string;
  onRemove: () => void;
}) {
  return (
    <TableRowActionButton
      title="Verwijderen"
      aria-label={removeAriaLabel}
      onClick={(event) => {
        event.stopPropagation();
        onRemove();
      }}
      sx={THUMBNAIL_PILL_REMOVE_ACTION_SX}
    >
      <Delete fontSize="small" />
    </TableRowActionButton>
  );
}
