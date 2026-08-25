import { Stack } from "@mui/material";
import type { ReactElement } from "react";
import { RowStyleReadonlyRow } from "@tmi-packages/ui";

export function Short(): ReactElement {
  return (
    <Stack spacing={1} sx={{ maxWidth: 420 }}>
      <RowStyleReadonlyRow label="Introduction to fractions" />
    </Stack>
  );
}

export function LongWrapping(): ReactElement {
  return (
    <Stack spacing={1} sx={{ maxWidth: 420 }}>
      <RowStyleReadonlyRow label="Long division worksheet with a considerably longer goal label that wraps across two lines" />
    </Stack>
  );
}
