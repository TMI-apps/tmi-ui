import { Box } from "@mui/material";
import { TableRowActionButton } from "@tmi-packages/ui";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import OpenInNew from "@mui/icons-material/OpenInNew";

// Row-height action button (icon-only) as used in DataTable row action rails.
export function Default() {
  return (
    <Box sx={{ height: 40, display: "flex" }}>
      <TableRowActionButton
        title="Delete"
        aria-label="Delete"
        onClick={() => undefined}
      >
        <DeleteOutline fontSize="small" />
      </TableRowActionButton>
    </Box>
  );
}

// Rendered as a native anchor (component="a") so middle-click/open-in-new-tab work,
// while onClick still runs to stop row-click propagation.
export function AsLink() {
  return (
    <Box sx={{ height: 40, display: "flex" }}>
      <TableRowActionButton
        title="Open source record"
        aria-label="Open source record"
        href="https://airtable.com/appExample/tblExample/recExample"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => undefined}
      >
        <OpenInNew fontSize="small" />
      </TableRowActionButton>
    </Box>
  );
}

export function Disabled() {
  return (
    <Box sx={{ height: 40, display: "flex" }}>
      <TableRowActionButton
        title="Delete"
        aria-label="Delete"
        disabled
        onClick={() => undefined}
      >
        <DeleteOutline fontSize="small" />
      </TableRowActionButton>
    </Box>
  );
}
