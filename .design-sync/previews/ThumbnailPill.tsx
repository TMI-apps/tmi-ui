import { Box } from "@mui/material";
import { ThumbnailPill, ThumbnailPillRemoveTableRowSlot } from "@tmi-packages/ui";

const THUMB_URL = "https://picsum.photos/seed/tmi-ui-thumbnail-pill/96/96";

export function Default() {
  return (
    <ThumbnailPill
      title="Default pill"
      thumbnail={THUMB_URL}
      tooltip="Tooltip on hover"
    />
  );
}

// Uses onClick rather than `to`: the `to` prop renders a react-router `Link`,
// and the preview compiles react-router-dom as a separate module instance
// from the one inlined in the DS bundle, so its Router context never matches
// (see NOTES.md — "React Router Link stories"). onClick exercises the same
// appBar visual variant without the routing dependency.
// variant="appBar" styles for primary.contrastText — it's meant to sit on a
// colored app bar, not a white card. Wrapped here to match its real context.
export function AppBarVariant() {
  return (
    <Box sx={{ bgcolor: "primary.main", p: 1, borderRadius: 1 }}>
      <ThumbnailPill
        title="App bar variant"
        variant="appBar"
        thumbnail={THUMB_URL}
        onClick={() => undefined}
      />
    </Box>
  );
}

export function NoThumbnail() {
  return <ThumbnailPill title="No thumbnail supplied" />;
}

export function RemovableRow() {
  return (
    <ThumbnailPill
      title="Removable row"
      thumbnail={THUMB_URL}
      rightSlot={
        <ThumbnailPillRemoveTableRowSlot
          onRemove={() => undefined}
          removeAriaLabel="Remove"
        />
      }
    />
  );
}

export function Disabled() {
  return (
    <ThumbnailPill
      title="Disabled pill"
      thumbnail={THUMB_URL}
      onClick={() => undefined}
      disabled
    />
  );
}
