import { Box } from "@mui/material";
import { DataTableTruncatedText } from "@tmi-packages/ui";

// Narrow cell width forces truncation — hovering shows the full text in the
// shared data-table tooltip (non-interactive, matches real table cell density).
export function Truncated() {
  return (
    <Box sx={{ width: 180, border: "1px solid", borderColor: "divider", p: 1 }}>
      <DataTableTruncatedText text="Long label that truncates in narrow cells when space is tight." />
    </Box>
  );
}

// Plenty of room — text fits, no tooltip wrapper engages.
export function NotTruncated() {
  return (
    <Box sx={{ width: 320, border: "1px solid", borderColor: "divider", p: 1 }}>
      <DataTableTruncatedText text="Short label" />
    </Box>
  );
}

// Secondary/caption variant, as used for metadata sub-lines under a primary cell value.
export function CaptionVariant() {
  return (
    <Box sx={{ width: 180, border: "1px solid", borderColor: "divider", p: 1 }}>
      <DataTableTruncatedText
        text="Uploaded by lesmateriaal-import sync on 2026-08-12"
        variant="caption"
      />
    </Box>
  );
}
