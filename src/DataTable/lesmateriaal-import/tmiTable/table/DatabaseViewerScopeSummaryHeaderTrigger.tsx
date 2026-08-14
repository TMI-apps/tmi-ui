import { Box } from "@mui/material";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import { DATABASE_VIEWER_SCOPE_SUMMARY_DEFAULT_TITLE } from "./databaseViewerConstants.js";
import { databaseViewerScopeSummaryVisibilityIconSx } from "./databaseViewerTableStyles.js";

interface DatabaseViewerScopeSummaryHeaderTriggerProps {
  title?: string;
  onOpen: (el: HTMLElement) => void;
}

export function DatabaseViewerScopeSummaryHeaderTrigger({
  title,
  onOpen,
}: DatabaseViewerScopeSummaryHeaderTriggerProps) {
  return (
    <Box
      component="span"
      role="button"
      className="database-viewer-scope-summary-trigger"
      aria-label={`${title ?? DATABASE_VIEWER_SCOPE_SUMMARY_DEFAULT_TITLE} (klik of Enter voor overzicht)`}
      tabIndex={0}
      onClick={(event) => {
        event.stopPropagation();
        onOpen(event.currentTarget);
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.stopPropagation();
        onOpen(event.currentTarget);
      }}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 1,
        outlineOffset: 2,
        "&:focus-visible": {
          outline: (t) => `2px solid ${t.palette.primary.main}`,
        },
      }}
    >
      <VisibilityOutlined
        sx={databaseViewerScopeSummaryVisibilityIconSx}
        aria-hidden
      />
    </Box>
  );
}
