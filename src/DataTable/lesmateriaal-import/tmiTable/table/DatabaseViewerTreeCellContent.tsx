import DragIndicatorOutlined from "@mui/icons-material/DragIndicatorOutlined";
import { Box, Tooltip } from "@mui/material";
import { TableRowActionButton } from "../../satellites/TableRowActionButton.js";
import { DATA_TABLE_TOOLTIP_PROPS } from "../../satellites/dataTableTooltipProps.js";
import { DatabaseViewerTreeCellChevrons } from "./DatabaseViewerTreeCellChevrons.js";
import type { Row, Table as TanStackTableType } from "@tanstack/react-table";
import { type MouseEvent, type ReactNode, useCallback } from "react";
import { databaseViewerCellSingleLineEllipsisSx } from "./databaseViewerBodyCellSx.js";
import {
  databaseViewerTreeRowSpacerSx,
  getDatabaseViewerTreeRowIndentSx,
} from "./databaseViewerTableStyles.js";
import { treeRowCanExpand } from "./databaseViewerTableModelUtils.js";
import type { DatabaseViewerDataRowReorderHandleProps } from "./DatabaseViewerDataRowReorderHandle.types.js";

export interface DatabaseViewerTreeCellContentProps<TData extends object> {
  row: Row<TData>;
  children: ReactNode;
  table: TanStackTableType<TData>;
  treeRowExpandableOverride?: (row: Row<TData>) => boolean;
  onTreeRowWillExpand?: (row: Row<TData>) => boolean | Promise<boolean>;
  treeRowPartiallyExpanded?: (row: Row<TData>) => boolean;
  /** `@dnd-kit` row-reorder handle (virtualized table). */
  reorderTreeDragHandle?: DatabaseViewerDataRowReorderHandleProps;
}

export function DatabaseViewerTreeCellContent<TData extends object>({
  row,
  children,
  table,
  treeRowExpandableOverride,
  onTreeRowWillExpand,
  treeRowPartiallyExpanded,
  reorderTreeDragHandle,
}: DatabaseViewerTreeCellContentProps<TData>) {
  const canExpand = treeRowCanExpand(row, treeRowExpandableOverride);
  const isExpanded = row.getIsExpanded();
  const isPartial = Boolean(treeRowPartiallyExpanded?.(row));

  const handleChevronClick = useCallback(
    async (event: MouseEvent) => {
      event.stopPropagation();
      if (isPartial) {
        if (onTreeRowWillExpand) {
          const ok = await onTreeRowWillExpand(row);
          if (ok === false) return;
        }
        // Path-context “partial” row: first click completed lazy load; open fully.
        table.getRow(row.id)?.toggleExpanded(true);
        return;
      }
      if (!isExpanded) {
        if (onTreeRowWillExpand) {
          const ok = await onTreeRowWillExpand(row);
          if (ok === false) return;
        }
        table.getRow(row.id)?.toggleExpanded(true);
      } else {
        table.getRow(row.id)?.toggleExpanded(false);
      }
    },
    [table, isExpanded, isPartial, onTreeRowWillExpand, row],
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        height: "100%",
        width: "100%",
        ...getDatabaseViewerTreeRowIndentSx(row.depth),
        minWidth: 0,
      }}
    >
      {reorderTreeDragHandle ? (
        <Tooltip
          title={
            reorderTreeDragHandle.disabled
              ? "Rij kan hier nu niet gesleept worden"
              : "Sleep om te verplaatsen"
          }
          {...DATA_TABLE_TOOLTIP_PROPS}
        >
          <Box
            component="span"
            data-dbv-suppress-row-click="true"
            ref={reorderTreeDragHandle.setActivatorNodeRef}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              alignSelf: "center",
              flexShrink: 0,
              mr: 0.25,
              px: 0.25,
              touchAction: "manipulation",
              opacity: reorderTreeDragHandle.disabled ? 0.38 : 1,
              cursor: reorderTreeDragHandle.disabled ? "default" : "grab",
            }}
            aria-label={
              reorderTreeDragHandle.disabled
                ? undefined
                : "Rij slepen om te verplaatsen"
            }
            {...reorderTreeDragHandle.attributes}
            {...(reorderTreeDragHandle.disabled
              ? {}
              : (reorderTreeDragHandle.listeners ?? {}))}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
          >
            <DragIndicatorOutlined fontSize="small" aria-hidden />
          </Box>
        </Tooltip>
      ) : null}
      {canExpand ? (
        <TableRowActionButton
          title={
            isPartial
              ? "Alle onderliggende items tonen (zoekpad)"
              : isExpanded
                ? "Onderliggende items inklappen"
                : "Onderliggende items uitklappen"
          }
          onClick={(event) => void handleChevronClick(event)}
          aria-label={
            isPartial
              ? "Alle onderliggende items tonen, zoekpad nog niet volledig"
              : isExpanded
                ? "Onderliggende items inklappen"
                : "Onderliggende items uitklappen"
          }
          sx={{ mr: 0.5, px: 1, flexShrink: 0 }}
        >
          <DatabaseViewerTreeCellChevrons
            isPartial={isPartial}
            isExpanded={isExpanded}
          />
        </TableRowActionButton>
      ) : (
        <Box sx={databaseViewerTreeRowSpacerSx} />
      )}
      <Box
        sx={{
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          ...databaseViewerCellSingleLineEllipsisSx,
          py: 0.75,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
