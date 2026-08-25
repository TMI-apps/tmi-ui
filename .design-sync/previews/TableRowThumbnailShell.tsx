import { Box } from "@mui/material";
import { TableRowThumbnailShell, TableRowThumbnailPlaceholder } from "@tmi-packages/ui";

// Self-contained SVG data URI rather than a remote photo host, so the "loaded"
// story doesn't depend on an external fetch succeeding in time. A data: URI is
// a valid `src` from the shell's point of view — same contract. NOTE (see
// learnings): the shell's own `<img loading="lazy">`, combined with starting
// `visibility: hidden` (MUI Fade's pre-load state), defers the image past
// `package-capture.mjs`'s `networkidle` screenshot point even for a same-
// document data: URI — confirmed by manually forcing `img.loading = "eager"`
// in a live tab, which loads instantly. "Default" therefore still captures as
// the placeholder-only state; the real component loads and fades correctly
// given more time / an actively-rendering page.
const THUMB_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">' +
  '<rect width="96" height="96" fill="#4a7fb0"/>' +
  '<circle cx="48" cy="40" r="16" fill="#ffffff" opacity="0.85"/>' +
  '<rect x="18" y="62" width="60" height="20" rx="4" fill="#ffffff" opacity="0.6"/>' +
  "</svg>";
const THUMB_URL = `data:image/svg+xml,${encodeURIComponent(THUMB_SVG)}`;

// Paint-dip row thumbnail: themed placeholder underneath, image Fades in on load.
// Sized like the real "meta.rowThumbnailCell" zero-padding cell from DatabaseViewer.
export function Default() {
  return (
    <Box sx={{ width: 56, height: 56 }}>
      <TableRowThumbnailShell src={THUMB_URL} alt="Row thumbnail" />
    </Box>
  );
}

// Caller-driven fallback: onError swaps the row to the shared placeholder
// (e.g. Lesmateriaal fallback phase) rather than a broken-image glyph.
export function FailedLoad() {
  return (
    <Box sx={{ width: 56, height: 56 }}>
      <TableRowThumbnailShell
        src="https://invalid.example/does-not-exist.jpg"
        alt="Row thumbnail"
        onError={() => undefined}
      />
    </Box>
  );
}

// The bare placeholder state the shell paints underneath before an image loads.
export function PlaceholderOnly() {
  return (
    <Box sx={{ width: 56, height: 56 }}>
      <TableRowThumbnailPlaceholder />
    </Box>
  );
}
