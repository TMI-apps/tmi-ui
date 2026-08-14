import { Box, Button, Divider, Popover, Typography } from "@mui/material";
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import type { Dispatch, SetStateAction } from "react";
import { useWorkspaceDrawerOverlayZIndex } from "../../shared-context/PortaledOverlayStackContext.js";
import type {
  DatabaseViewerScopeSummary,
  DatabaseViewerScopeSummaryItem,
} from "../../shared-types/tmiTableMeta.types.js";
import { DATABASE_VIEWER_SCOPE_SUMMARY_DEFAULT_TITLE } from "./databaseViewerConstants.js";
import {
  databaseViewerScopeSummaryPopoverActionsGridSx,
  databaseViewerScopeSummaryPopoverContentSx,
  databaseViewerScopeSummaryPopoverItemGridSx,
  databaseViewerScopeSummaryPopoverSectionTitleSx,
} from "./databaseViewerTableStyles.js";

interface DatabaseViewerScopeSummaryPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  scopeSummary: DatabaseViewerScopeSummary | undefined;
  dataSummaryItems: DatabaseViewerScopeSummaryItem[];
  displaySummaryItems: DatabaseViewerScopeSummaryItem[];
  hasActiveDataFilters: boolean;
  hasActiveSorting: boolean;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
  setSorting: Dispatch<SetStateAction<SortingState>>;
}

function ScopeSummaryItemGrid({
  items,
  sx,
}: {
  items: DatabaseViewerScopeSummaryItem[];
  sx?: object;
}) {
  return (
    <Box sx={{ ...databaseViewerScopeSummaryPopoverItemGridSx, ...sx }}>
      {items.map((item) => (
        <Box key={`${item.label}-${item.value}`}>
          <Typography variant="body2" color="text.secondary">
            {item.label}
          </Typography>
          <Typography variant="body2">{item.value}</Typography>
        </Box>
      ))}
    </Box>
  );
}

export function DatabaseViewerScopeSummaryPopover({
  open,
  anchorEl,
  onClose,
  scopeSummary,
  dataSummaryItems,
  displaySummaryItems,
  hasActiveDataFilters,
  hasActiveSorting,
  setColumnFilters,
  setSorting,
}: DatabaseViewerScopeSummaryPopoverProps) {
  const overlayZ = useWorkspaceDrawerOverlayZIndex();
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      slotProps={{
        root: { sx: { zIndex: overlayZ } },
      }}
    >
      <Box sx={databaseViewerScopeSummaryPopoverContentSx}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {scopeSummary?.title ?? DATABASE_VIEWER_SCOPE_SUMMARY_DEFAULT_TITLE}
        </Typography>

        <Typography
          variant="subtitle2"
          sx={databaseViewerScopeSummaryPopoverSectionTitleSx}
        >
          Resultaten gefilterd door
        </Typography>
        {dataSummaryItems.length > 0 ? (
          <ScopeSummaryItemGrid items={dataSummaryItems} sx={{ mb: 2 }} />
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {scopeSummary?.emptyDataFiltersLabel ?? "Geen actieve filters."}
          </Typography>
        )}

        <Typography
          variant="subtitle2"
          sx={databaseViewerScopeSummaryPopoverSectionTitleSx}
        >
          Tabelweergave
        </Typography>
        {displaySummaryItems.length > 0 ? (
          <ScopeSummaryItemGrid items={displaySummaryItems} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Geen actieve weergave-aanpassingen.
          </Typography>
        )}

        <Divider sx={{ my: 1.5 }} />
        <Box sx={databaseViewerScopeSummaryPopoverActionsGridSx}>
          <Button
            size="small"
            variant="outlined"
            disabled={!hasActiveDataFilters}
            onClick={() => {
              setColumnFilters([]);
              scopeSummary?.onClearDataFilters?.();
            }}
          >
            Alle filtering wissen
          </Button>
          <Button
            size="small"
            variant="outlined"
            disabled={!hasActiveSorting}
            onClick={() => {
              setSorting([]);
            }}
          >
            Alle sortering wissen
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}
