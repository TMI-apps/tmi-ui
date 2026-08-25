import { Stack } from "@mui/material";
import { ThumbnailPill, ThumbnailPillRemoveTableRowSlot } from "@tmi-packages/ui";

const THUMB_URL = "https://picsum.photos/seed/tmi-ui-remove-slot/96/96";

// Leaf slot component — only ever rendered inside a ThumbnailPill's `rightSlot`,
// so the preview composes that real parent usage rather than the slot alone.
export function Default() {
  return (
    <ThumbnailPill
      title="Klok lezen"
      thumbnail={THUMB_URL}
      rightSlot={
        <ThumbnailPillRemoveTableRowSlot
          onRemove={() => undefined}
          removeAriaLabel="Verwijderen"
        />
      }
    />
  );
}

export function MultipleRows() {
  return (
    <Stack spacing={1}>
      <ThumbnailPill
        title="Klok lezen"
        thumbnail={THUMB_URL}
        rightSlot={
          <ThumbnailPillRemoveTableRowSlot
            onRemove={() => undefined}
            removeAriaLabel="Verwijderen"
          />
        }
      />
      <ThumbnailPill
        title="Optellen tot 100"
        thumbnail={THUMB_URL}
        rightSlot={
          <ThumbnailPillRemoveTableRowSlot
            onRemove={() => undefined}
            removeAriaLabel="Verwijderen"
          />
        }
      />
      <ThumbnailPill
        title="Werkwoordspelling"
        rightSlot={
          <ThumbnailPillRemoveTableRowSlot
            onRemove={() => undefined}
            removeAriaLabel="Verwijderen"
          />
        }
      />
    </Stack>
  );
}
