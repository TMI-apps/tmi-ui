import { Box, TextField, Stack } from "@mui/material";
import { TMITableDetailEditPanel } from "@tmi-packages/ui";

const COVER_URL = "https://picsum.photos/seed/tmi-ui-edit-panel/960/300";

const baseHeaderProps = {
  loading: false,
  recordPresent: true,
  title: "Bibliotheek Rotterdam",
  subtitle: "Bewerken",
  isAdmin: true,
  onClose: () => undefined,
  heroImageMeta: { src: COVER_URL, fallbackSrc: null },
};

export function EditingContent() {
  return (
    <Box sx={{ height: 420, position: "relative" }}>
      <TMITableDetailEditPanel
        headerProps={baseHeaderProps}
        detailTransitioning={false}
        detailError={null}
      >
        <Stack spacing={2} sx={{ p: 2 }}>
          <TextField label="Naam" defaultValue="Bibliotheek Rotterdam" fullWidth size="small" />
          <TextField label="Adres" defaultValue="Hoogstraat 12, Rotterdam" fullWidth size="small" />
        </Stack>
      </TMITableDetailEditPanel>
    </Box>
  );
}

export function Transitioning() {
  return (
    <Box sx={{ height: 420, position: "relative" }}>
      <TMITableDetailEditPanel
        headerProps={baseHeaderProps}
        detailTransitioning
        detailError={null}
      >
        <Box sx={{ p: 2 }} />
      </TMITableDetailEditPanel>
    </Box>
  );
}

export function ErrorState() {
  return (
    <Box sx={{ height: 420, position: "relative" }}>
      <TMITableDetailEditPanel
        headerProps={baseHeaderProps}
        detailTransitioning={false}
        detailError="Kon record niet laden. Probeer het opnieuw."
      >
        <Box sx={{ p: 2 }} />
      </TMITableDetailEditPanel>
    </Box>
  );
}
