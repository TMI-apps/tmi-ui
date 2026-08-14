import { Box, TableSortLabel } from "@mui/material";
import { flexRender, type Header } from "@tanstack/react-table";
import type { MouseEvent, ReactElement, ReactNode } from "react";
import { DataTableTruncatedOverflow } from "../../satellites/DataTableTruncatedText.js";
import type { DatabaseViewerColumnMeta } from "../../shared-types/tmiTableMeta.types.js";
import { getDatabaseViewerHeaderLabelString } from "./databaseViewerSummaryModel.js";
import { DatabaseViewerScopeSummaryHeaderTrigger } from "./DatabaseViewerScopeSummaryHeaderTrigger.js";

const databaseViewerColumnHeaderPrimaryRowSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  minWidth: 0,
  width: "100%",
  overflow: "hidden",
} as const;

function ScopeSummaryTriggerSlot({ children }: { children: ReactNode }) {
  return <Box sx={{ flexShrink: 0 }}>{children}</Box>;
}

interface DatabaseViewerColumnHeaderPrimaryContentProps<TData extends object> {
  header: Header<TData, unknown>;
  enableSorting: boolean;
  scopeSummary: { title?: string } | undefined;
  onSummaryOpen: (el: HTMLElement) => void;
  onSortLabelClick: (event: MouseEvent<HTMLElement>) => void;
}

function HeaderTruncatedFlexLabel<TData extends object>({
  label,
  header,
}: {
  label: string;
  header: Header<TData, unknown>;
}): ReactElement {
  const ctx = header.getContext();
  return (
    <Box sx={{ minWidth: 0, width: "100%", overflow: "hidden" }}>
      <DataTableTruncatedOverflow title={label}>
        {flexRender(header.column.columnDef.header, ctx)}
      </DataTableTruncatedOverflow>
    </Box>
  );
}

function ScopeSortOffHeaderPrimary<TData extends object>({
  header,
  scopeSummary,
  onSummaryOpen,
}: {
  header: Header<TData, unknown>;
  scopeSummary: { title?: string };
  onSummaryOpen: (el: HTMLElement) => void;
}) {
  const label = getDatabaseViewerHeaderLabelString(header);
  const ctx = header.getContext();

  return (
    <Box sx={databaseViewerColumnHeaderPrimaryRowSx}>
      <ScopeSummaryTriggerSlot>
        <DatabaseViewerScopeSummaryHeaderTrigger
          title={scopeSummary?.title}
          onOpen={onSummaryOpen}
        />
      </ScopeSummaryTriggerSlot>
      <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
        <DataTableTruncatedOverflow title={label}>
          {flexRender(header.column.columnDef.header, ctx)}
        </DataTableTruncatedOverflow>
      </Box>
    </Box>
  );
}

/** Sort-capable columns: summary eye + truncated label behind {@link TableSortLabel}. */
function SortableColumnHeaderPrimary<TData extends object>({
  header,
  scopeSummary,
  onSummaryOpen,
  onSortLabelClick,
  showScopeTrigger,
}: {
  header: Header<TData, unknown>;
  scopeSummary: { title?: string } | undefined;
  onSummaryOpen: (el: HTMLElement) => void;
  onSortLabelClick: (event: MouseEvent<HTMLElement>) => void;
  showScopeTrigger: boolean;
}) {
  const label = getDatabaseViewerHeaderLabelString(header);
  const ctx = header.getContext();

  return (
    <Box sx={databaseViewerColumnHeaderPrimaryRowSx}>
      {showScopeTrigger ? (
        <ScopeSummaryTriggerSlot>
          <DatabaseViewerScopeSummaryHeaderTrigger
            title={scopeSummary?.title}
            onOpen={onSummaryOpen}
          />
        </ScopeSummaryTriggerSlot>
      ) : null}
      <TableSortLabel
        active={Boolean(header.column.getIsSorted())}
        direction={(header.column.getIsSorted() || "asc") as "asc" | "desc"}
        hideSortIcon={false}
        onClick={onSortLabelClick}
        sx={{
          minWidth: 0,
          flex: 1,
          overflow: "hidden",
          maxWidth: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
          "& .MuiTableSortLabel-icon": {
            flexShrink: 0,
          },
        }}
      >
        <DataTableTruncatedOverflow title={label}>
          {flexRender(header.column.columnDef.header, ctx)}
        </DataTableTruncatedOverflow>
      </TableSortLabel>
    </Box>
  );
}

export function DatabaseViewerColumnHeaderPrimaryContent<TData extends object>({
  header,
  enableSorting,
  scopeSummary,
  onSummaryOpen,
  onSortLabelClick,
}: DatabaseViewerColumnHeaderPrimaryContentProps<TData>) {
  if (header.isPlaceholder) {
    return null;
  }

  const label = getDatabaseViewerHeaderLabelString(header);
  const meta = header.column.columnDef.meta as
    | DatabaseViewerColumnMeta
    | undefined;
  const showScopeTrigger = Boolean(
    scopeSummary && meta?.scopeSummaryHeaderTrigger,
  );
  const sortingEnabledHere = Boolean(
    header.column.getCanSort() && enableSorting,
  );

  if (!sortingEnabledHere) {
    /** Eye + scope summary (“Wat je nu ziet”) must show even when sorting is off (`enableSorting={false}`), e.g. Doelen browse. */
    if (showScopeTrigger && scopeSummary) {
      return (
        <ScopeSortOffHeaderPrimary
          header={header}
          scopeSummary={scopeSummary}
          onSummaryOpen={onSummaryOpen}
        />
      );
    }

    return <HeaderTruncatedFlexLabel<TData> label={label} header={header} />;
  }

  return (
    <SortableColumnHeaderPrimary
      header={header}
      scopeSummary={scopeSummary}
      onSummaryOpen={onSummaryOpen}
      onSortLabelClick={onSortLabelClick}
      showScopeTrigger={showScopeTrigger}
    />
  );
}
