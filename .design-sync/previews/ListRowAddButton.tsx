import Add from "@mui/icons-material/Add";
import { Box } from "@mui/material";
import { ListRowAddButton } from "@tmi-packages/ui";

export function Subtle() {
  return (
    <Box sx={{ width: 280 }}>
      <ListRowAddButton
        label="Leerdoel toevoegen"
        onClick={() => undefined}
      />
    </Box>
  );
}

export function Primary() {
  return (
    <Box sx={{ width: 280 }}>
      <ListRowAddButton
        label="Leerdoel toevoegen"
        visualVariant="primary"
        startIcon={<Add fontSize="small" />}
        onClick={() => undefined}
      />
    </Box>
  );
}

export function Disabled() {
  return (
    <Box sx={{ width: 280 }}>
      <ListRowAddButton
        label="Leerdoel toevoegen"
        visualVariant="primary"
        startIcon={<Add fontSize="small" />}
        onClick={() => undefined}
        disabled
      />
    </Box>
  );
}
