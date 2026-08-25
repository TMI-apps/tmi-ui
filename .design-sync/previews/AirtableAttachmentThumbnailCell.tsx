import { Box } from "@mui/material";
import { AirtableAttachmentThumbnailCell } from "@tmi-packages/ui";

// Self-contained SVG data URI rather than a remote photo host, so the "loaded"
// story doesn't depend on an external fetch succeeding in time. A data: URI is
// a valid `url`/`thumbnails.small.url` value from the component's point of
// view — same contract. NOTE (see learnings): the underlying `<img>` (inside
// TableRowThumbnailShell) is rendered with native `loading="lazy"` while
// initially `visibility: hidden` (MUI Fade's pre-load state) — this combination
// defers the image past `package-capture.mjs`'s `networkidle` screenshot point
// even for a same-document data: URI, so "WithAttachment" still captures as
// the placeholder despite the real component correctly loading and fading the
// image in given more time / a visible, actively-rendering page.
const THUMB_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">' +
  '<rect width="96" height="96" fill="#4a7fb0"/>' +
  '<circle cx="48" cy="40" r="16" fill="#ffffff" opacity="0.85"/>' +
  '<rect x="18" y="62" width="60" height="20" rx="4" fill="#ffffff" opacity="0.6"/>' +
  "</svg>";
const THUMB_URL = `data:image/svg+xml,${encodeURIComponent(THUMB_SVG)}`;

// Real usage (playground visualSections.tsx): a fixed-size cell ("meta.rowThumbnailCell"
// paint-dip layout) — the component fills whatever box it's placed in via TableRowThumbnailShell.
export function WithAttachment() {
  return (
    <Box sx={{ width: 56, height: 56 }}>
      <AirtableAttachmentThumbnailCell
        value={[{ url: THUMB_URL, thumbnails: { small: { url: THUMB_URL } } }]}
      />
    </Box>
  );
}

// No usable URL in the JSONB payload (missing/empty attachments array) falls back
// to the shared placeholder — not a broken-image glyph.
export function MissingAttachment() {
  return (
    <Box sx={{ width: 56, height: 56 }}>
      <AirtableAttachmentThumbnailCell value={[]} alt="No thumbnail" />
    </Box>
  );
}

// Malformed JSONB (not an attachments array/object shape) is treated the same as missing.
export function MalformedValue() {
  return (
    <Box sx={{ width: 56, height: 56 }}>
      <AirtableAttachmentThumbnailCell value={{ notAnAttachment: true }} />
    </Box>
  );
}
