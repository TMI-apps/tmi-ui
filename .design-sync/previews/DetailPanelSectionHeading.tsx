import { Stack, Typography } from "@mui/material";
import { DetailPanelSectionHeading } from "@tmi-packages/ui";

// Real usage (RowStyleMultiSelect.tsx): uppercase micro-label above a section's
// body content in the detail/edit-detail panes.
export function Default() {
  return (
    <Stack spacing={1}>
      <DetailPanelSectionHeading sx={{ mt: 2, display: "block" }}>
        Goals
      </DetailPanelSectionHeading>
      <Typography variant="body2" color="text.secondary">
        No goals added yet.
      </Typography>
    </Stack>
  );
}

// Multiple section headings stacked, as they appear repeated down a detail panel body.
export function MultipleSections() {
  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <DetailPanelSectionHeading sx={{ display: "block" }}>
          Basisgegevens
        </DetailPanelSectionHeading>
        <Typography variant="body2">Bibliotheek Rotterdam</Typography>
      </Stack>
      <Stack spacing={1}>
        <DetailPanelSectionHeading sx={{ display: "block" }}>
          Media
        </DetailPanelSectionHeading>
        <Typography variant="body2" color="text.secondary">
          3 attachments
        </Typography>
      </Stack>
    </Stack>
  );
}
