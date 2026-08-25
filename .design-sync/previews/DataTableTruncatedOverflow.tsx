import { Box, Typography } from "@mui/material";
import type { ReactElement } from "react";
import { DataTableTruncatedOverflow } from "@tmi-packages/ui";

export function TextContent(): ReactElement {
  return (
    <Box
      sx={{
        display: "flex",
        width: 220,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        p: 1,
      }}
    >
      <DataTableTruncatedOverflow title="Overflow wrapper">
        Overflow wrapper around truncated table text in the workshop.
      </DataTableTruncatedOverflow>
    </Box>
  );
}

export function CompoundContent(): ReactElement {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        width: 220,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        p: 1,
      }}
    >
      <Typography variant="body2" sx={{ flexShrink: 0 }}>
        📎
      </Typography>
      <DataTableTruncatedOverflow title="lesson-plan-fractions-grade4-v3-final.pdf">
        <Typography variant="body2" noWrap>
          lesson-plan-fractions-grade4-v3-final.pdf
        </Typography>
      </DataTableTruncatedOverflow>
    </Box>
  );
}
