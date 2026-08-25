import { Box } from "@mui/material";
import type { ReactElement } from "react";
import { TableRowThumbnailPlaceholder } from "@tmi-packages/ui";

export function Default(): ReactElement {
  return (
    <Box sx={{ width: 56, height: 56, borderRadius: 1, overflow: "hidden" }}>
      <TableRowThumbnailPlaceholder />
    </Box>
  );
}

export function Layered(): ReactElement {
  return (
    <Box
      sx={{
        position: "relative",
        width: 56,
        height: 56,
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <TableRowThumbnailPlaceholder layered />
    </Box>
  );
}
