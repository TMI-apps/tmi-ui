import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { keyframes, type SxProps, type Theme } from "@mui/material/styles";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Row, Table as TanStackTableType } from "@tanstack/react-table";
import type {
  DragEndEvent,
  MeasuringConfiguration,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  closestCenter,
  MeasuringFrequency,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { CSSProperties } from "react";
import type { DragEvent, ReactElement, RefObject } from "react";
import { memo, useCallback, useEffect, useRef } from "react";
import type { TableInteractionSkinPreset } from "../../shared-theme/tableInteractionSkin.js";
import { searchFieldMutedBackground } from "../../shared-theme/interactiveSurfaces.js";
import { DATABASE_VIEWER_BODY_ROW_GAP_PX } from "./databaseViewerTableStyles.js";
import type { DatabaseViewerServerInfinite } from "./databaseViewerServerInfinite.js";
import type { DatabaseViewerRowFileDrop } from "./databaseViewerRowFileDrop.js";
import type { DatabaseViewerRowReorderConfig } from "../../shared-types/databaseViewerRowReorder.types.js";
import { DatabaseViewerColumnGroup } from "./DatabaseViewerColumnGroup.js";
import { DatabaseViewerDataRow } from "./DatabaseViewerDataRow.js";
import { DatabaseViewerReorderDataRow } from "./DatabaseViewerReorderDataRow.js";
import {
  useDatabaseViewerBodyRowInteractions,
  type DatabaseViewerRowClickMeta,
  type DatabaseViewerRowSelectionConfig,
} from "./useDatabaseViewerBodyRowInteractions.js";
import { TmiRowReorderDndProvider } from "../context/TmiRowReorderDndProvider.js";
import {
  buildDatabaseViewerBodyDataRowProps,
  type DatabaseViewerBodyPlainDataRowArgs,
} from "./databaseViewerBodyDataRowProps.js";
import { DatabaseViewerRowReorderDataRowDragPreview } from "./DatabaseViewerRowReorderDataRowDragPreview.js";
import {
  buildDatabaseViewerVirtualRowKey,
  warnDuplicateDatabaseViewerVirtualRowKeys,
} from "./databaseViewerVirtualRowKey.js";

/** Reduce `getBoundingClientRect` churn on virtualized droppable rows vs `@dnd-kit` defaults. */
const ROW_REORDER_DND_MEASURING: MeasuringConfiguration = {
  droppable: {
    strategy: MeasuringStrategy.WhileDragging,
    frequency: MeasuringFrequency.Optimized,
  },
};

/** Full pitch per row slot (bar + gap). Must match `estimateSize` in `useVirtualizer`. */
const VIRTUALIZED_ROW_ESTIMATE_PX = 44;
/** Height of the painted bar within each slot; the remainder is the inter-row gap. */
const VIRTUALIZED_ROW_BAR_HEIGHT_PX =
  VIRTUALIZED_ROW_ESTIMATE_PX - DATABASE_VIEWER_BODY_ROW_GAP_PX;

/**
 * Matches MUI `Skeleton` `animation="wave"` (`@mui/material/Skeleton`), so empty placeholders
 * feel like the same loading shimmer.
 */
const databaseViewerSpacerWaveKeyframe = keyframes`
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const getVirtualizedSpacerSx = (height: number): SxProps<Theme> => {
  return {
    p: 0,
    border: 0,
    height,
    /** Spacer uses a single `colSpan` cell; pin to the full table width (not inferred content width). */
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    verticalAlign: "top",
    ...(height > 0
      ? {
          position: "relative",
          /** Same as MUI Skeleton wave: lets the sweep pseudo hide outside bounds. */
          overflow: "hidden",
          /* Fix bug in Safari (MUI Skeleton copies this) */
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          backgroundImage: (theme: Theme) => {
            const bar = searchFieldMutedBackground(theme);
            return `repeating-linear-gradient(to bottom, ${bar} 0, ${bar} ${VIRTUALIZED_ROW_BAR_HEIGHT_PX}px, transparent ${VIRTUALIZED_ROW_BAR_HEIGHT_PX}px, transparent ${VIRTUALIZED_ROW_ESTIMATE_PX}px)`;
          },
          backgroundSize: `100% ${VIRTUALIZED_ROW_ESTIMATE_PX}px`,
          backgroundRepeat: "repeat",
          backgroundAttachment: "local",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: (theme: Theme) =>
              `linear-gradient(90deg, transparent, ${theme.palette.action.hover}, transparent)`,
            transform: "translateX(-100%)",
            animation: `${databaseViewerSpacerWaveKeyframe} 2s linear 0.5s infinite`,
            pointerEvents: "none",
          },
        }
      : {}),
  };
};

const isFirefox =
  typeof navigator !== "undefined" &&
  navigator.userAgent.toLowerCase().includes("firefox");

function DatabaseViewerEmptyRow({
  colCount,
  emptyMessage,
}: {
  colCount: number;
  emptyMessage: string;
}) {
  return (
    <TableRow>
      <TableCell
        colSpan={colCount}
        sx={{
          py: 4,
          textAlign: "center",
          color: "text.secondary",
          borderBottom: "none",
        }}
      >
        <Typography variant="body2">{emptyMessage}</Typography>
      </TableCell>
    </TableRow>
  );
}

function DatabaseViewerVirtualSpacerRow({
  colCount,
  height,
  position,
}: {
  colCount: number;
  height: number;
  position: "top" | "bottom";
}) {
  if (height <= 0) return null;

  return (
    <TableRow key={`vpad-${position}`} aria-hidden>
      <TableCell colSpan={colCount} sx={getVirtualizedSpacerSx(height)} />
    </TableRow>
  );
}

function DatabaseViewerInfiniteSentinelRow({
  colCount,
  sentinelRef,
  serverInfinite,
}: {
  colCount: number;
  sentinelRef: RefObject<HTMLDivElement | null>;
  serverInfinite: DatabaseViewerServerInfinite;
}) {
  return (
    <TableRow key="infinite-sentinel">
      <TableCell
        colSpan={colCount}
        sx={{ p: 1, border: 0, verticalAlign: "middle" }}
      >
        <Box
          ref={sentinelRef}
          display="flex"
          minHeight={4}
          alignItems="center"
          justifyContent="center"
          gap={1}
          flexWrap="wrap"
        >
          {serverInfinite.isFetchingNextPage && (
            <CircularProgress size={20} aria-label="Meer rijen laden" />
          )}
          {serverInfinite.nextPageError ? (
            <Button
              size="small"
              color="inherit"
              variant="outlined"
              onClick={() => serverInfinite.onRetryNextPage()}
            >
              Opnieuw proberen
            </Button>
          ) : null}
        </Box>
      </TableCell>
    </TableRow>
  );
}

function getDatabaseViewerVirtualRowPaddings(
  virtualItems: ReadonlyArray<{ start: number; end: number }>,
  totalSize: number,
  paginatedRowCount: number,
): { paddingTop: number; paddingBottom: number } {
  if (virtualItems.length > 0) {
    return {
      paddingTop: virtualItems[0]?.start ?? 0,
      paddingBottom:
        totalSize - (virtualItems[virtualItems.length - 1]?.end ?? 0),
    };
  }
  if (paginatedRowCount > 0) {
    /* Bootstrap scrollHeight when no virtual items have entered the visible range yet. */
    return { paddingTop: 0, paddingBottom: totalSize };
  }
  return { paddingTop: 0, paddingBottom: 0 };
}

function useDatabaseViewerInfiniteScrollRootObserver(args: {
  tableScrollElement: HTMLDivElement | null;
  sentinelRef: RefObject<HTMLDivElement | null>;
  dataLength: number;
  paginatedRowCount: number;
  serverInfinite: DatabaseViewerServerInfinite;
}) {
  const {
    tableScrollElement,
    sentinelRef,
    dataLength,
    paginatedRowCount,
    serverInfinite,
  } = args;
  const serverInfiniteRef =
    useRef<DatabaseViewerServerInfinite>(serverInfinite);
  serverInfiniteRef.current = serverInfinite;

  useEffect(() => {
    const root = tableScrollElement;
    const target = sentinelRef.current;
    if (!root || !target) {
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) {
            return;
          }
          const si = serverInfiniteRef.current;
          if (si.hasNextPage && !si.isFetchingNextPage && !si.nextPageError) {
            si.fetchNextPage();
          }
        }
      },
      { root, rootMargin: "400px 0px", threshold: 0 },
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, [dataLength, paginatedRowCount, sentinelRef, tableScrollElement]);
}

function useDatabaseViewerVirtualRows<TData extends object>({
  table,
  paginatedRows,
  tableScrollElement,
  dataLength,
  serverInfinite,
  rowFileDrop,
  onRowClick,
  rowSelectionConfig,
}: {
  table: TanStackTableType<TData>;
  paginatedRows: Row<TData>[];
  /** Committed scroll viewport (`TableContainer`); state in parent so virtualizer sees it after ref attaches. */
  tableScrollElement: HTMLDivElement | null;
  dataLength: number;
  serverInfinite: DatabaseViewerServerInfinite;
  rowFileDrop?: DatabaseViewerRowFileDrop<TData>;
  onRowClick?: (row: TData, meta?: DatabaseViewerRowClickMeta) => void;
  rowSelectionConfig?: DatabaseViewerRowSelectionConfig;
  rowSelectionEnabled?: boolean;
}) {
  const infiniteSentinelRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: paginatedRows.length,
    getScrollElement: () => tableScrollElement,
    estimateSize: () => VIRTUALIZED_ROW_ESTIMATE_PX,
    /** React 19: avoid `flushSync` from virtualizer scroll callbacks fighting commit order. */
    useFlushSync: false,
    /** Defer ResizeObserver geometry to the next frame so flex `minHeight:0` chains have settled. */
    useAnimationFrameWithResizeObserver: true,
    overscan: 6,
    getItemKey: (index) => {
      const row = paginatedRows[index];
      return buildDatabaseViewerVirtualRowKey(row?.id);
    },
    measureElement:
      typeof window !== "undefined" && !isFirefox
        ? (el) => (el as HTMLTableRowElement).getBoundingClientRect().height
        : undefined,
  });

  useDatabaseViewerInfiniteScrollRootObserver({
    tableScrollElement,
    sentinelRef: infiniteSentinelRef,
    dataLength,
    paginatedRowCount: paginatedRows.length,
    serverInfinite,
  });

  warnDuplicateDatabaseViewerVirtualRowKeys(
    paginatedRows.map((row) => row.id),
    "DatabaseViewerBody",
  );

  const {
    dragOverRowId,
    handleRowDragOver,
    handleRowDragLeave,
    handleRowDrop,
    handleRowClick,
  } = useDatabaseViewerBodyRowInteractions({
    table,
    rowFileDrop,
    onRowClick,
    rowSelectionConfig,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const { paddingTop, paddingBottom } = getDatabaseViewerVirtualRowPaddings(
    virtualItems,
    totalSize,
    paginatedRows.length,
  );

  return {
    rowDropEnabled: Boolean(rowFileDrop),
    rowVirtualizer,
    infiniteSentinelRef,
    virtualItems,
    paddingTop,
    paddingBottom,
    dragOverRowId,
    handleRowDragOver,
    handleRowDragLeave,
    handleRowDrop,
    handleRowClick,
  };
}

export interface DatabaseViewerBodyProps<TData extends object> {
  table: TanStackTableType<TData>;
  paginatedRows: Row<TData>[];
  colCount: number;
  bodyTableSx: SxProps<Theme>;
  /** TanStack table + per-column CSS variables (aligns with header strip). */
  tableColumnSizeStyle: CSSProperties;
  ariaLabel: string;
  emptyMessage: string;
  rowIsClickable: boolean;
  rowIntentEnabled: boolean;
  onRowClick?: (row: TData, meta?: DatabaseViewerRowClickMeta) => void;
  onRowIntent?: (row: TData) => void;
  rowFileDrop?: DatabaseViewerRowFileDrop<TData>;
  rowSelectionConfig?: DatabaseViewerRowSelectionConfig;
  rowSelectionEnabled?: boolean;
  treeRowExpandableOverride?: (row: Row<TData>) => boolean;
  onTreeRowWillExpand?: (row: Row<TData>) => boolean | Promise<boolean>;
  treeRowPartiallyExpanded?: (row: Row<TData>) => boolean;
  interactionSkinPreset: TableInteractionSkinPreset;
  serverInfinite: DatabaseViewerServerInfinite;
  /** Same as parent `data.length` — invalidates infinite-scroll observer when dataset size changes. */
  dataLength: number;
  /**
   * Committed `TableContainer` scroll root — state in parent (callback ref) so TanStack Virtual and
   * infinite scroll attach after the DOM node exists (`ref.current` is still null in child layout).
   */
  tableScrollElement: HTMLDivElement | null;
  getRowDataAttributes?: (row: TData) => Record<string, string | undefined>;
  rowSavePending?: (row: TData) => boolean;
  /** Vertical row reorder via **`@dnd-kit/sortable`** + **`SortableContext`** on the virtualized rows. */
  rowReorder?: DatabaseViewerRowReorderConfig<TData>;
}

function renderDatabaseViewerBodyDataRow<TData extends object>(
  args: DatabaseViewerBodyPlainDataRowArgs<TData> & {
    measureElement?: (el: HTMLTableRowElement) => void;
  },
): ReactElement {
  return (
    <DatabaseViewerDataRow
      {...buildDatabaseViewerBodyDataRowProps(args)}
      tableRowRef={args.measureElement}
    />
  );
}

// eslint-disable-next-line max-lines-per-function -- DnD shell + sortable + virtualized table forwarding
function DatabaseViewerBodyWithRowReorder<TData extends object>(
  props: DatabaseViewerBodyProps<TData> & {
    rowReorder: DatabaseViewerRowReorderConfig<TData>;
  },
): ReactElement {
  const {
    table,
    paginatedRows,
    colCount,
    bodyTableSx,
    ariaLabel,
    emptyMessage,
    tableColumnSizeStyle,
    rowIsClickable,
    rowIntentEnabled,
    onRowClick,
    onRowIntent,
    rowFileDrop,
    treeRowExpandableOverride,
    onTreeRowWillExpand,
    treeRowPartiallyExpanded,
    interactionSkinPreset,
    serverInfinite,
    dataLength,
    tableScrollElement,
    getRowDataAttributes,
    rowSavePending,
    rowReorder,
    rowSelectionConfig,
    rowSelectionEnabled = false,
  } = props;

  const {
    rowDropEnabled,
    rowVirtualizer,
    infiniteSentinelRef,
    virtualItems,
    paddingTop,
    paddingBottom,
    dragOverRowId,
    handleRowDragOver,
    handleRowDragLeave,
    handleRowDrop,
    handleRowClick,
  } = useDatabaseViewerVirtualRows({
    table,
    paginatedRows,
    tableScrollElement,
    dataLength,
    serverInfinite,
    rowFileDrop,
    onRowClick,
    rowSelectionConfig,
  });

  const {
    sensors,
    onDragEnd,
    renderDragOverlay,
    dragPointerSampleRef,
    reorderInteractionBlocked,
    dragOverlayMirrorDataRow,
  } = rowReorder;

  const renderDragOverlayResolved = useCallback(
    (activeId: UniqueIdentifier) => {
      if (dragOverlayMirrorDataRow) {
        const row = paginatedRows.find((r) => r.id === activeId);
        if (!row) return null;
        return (
          <DatabaseViewerRowReorderDataRowDragPreview<TData>
            row={row}
            table={table}
            bodyTableSx={bodyTableSx}
            tableColumnSizeStyle={tableColumnSizeStyle}
            rowDropEnabled={rowDropEnabled}
            rowFileDrop={rowFileDrop}
            dragOverRowId={dragOverRowId}
            getRowDataAttributes={getRowDataAttributes}
            rowIsClickable={rowIsClickable}
            rowIntentEnabled={rowIntentEnabled}
            onRowIntent={onRowIntent}
            handleRowClick={handleRowClick}
            handleRowDragOver={handleRowDragOver}
            handleRowDragLeave={handleRowDragLeave}
            handleRowDrop={handleRowDrop}
            treeRowExpandableOverride={treeRowExpandableOverride}
            onTreeRowWillExpand={onTreeRowWillExpand}
            treeRowPartiallyExpanded={treeRowPartiallyExpanded}
            interactionSkinPreset={interactionSkinPreset}
            rowSavePending={rowSavePending}
          />
        );
      }
      return renderDragOverlay?.(activeId) ?? null;
    },
    [
      dragOverlayMirrorDataRow,
      paginatedRows,
      table,
      bodyTableSx,
      tableColumnSizeStyle,
      rowDropEnabled,
      rowFileDrop,
      dragOverRowId,
      getRowDataAttributes,
      rowIsClickable,
      rowIntentEnabled,
      onRowIntent,
      handleRowClick,
      handleRowDragOver,
      handleRowDragLeave,
      handleRowDrop,
      treeRowExpandableOverride,
      onTreeRowWillExpand,
      treeRowPartiallyExpanded,
      interactionSkinPreset,
      rowSavePending,
      renderDragOverlay,
    ],
  );

  const handleReorderDragEnd = useCallback(
    (event: DragEndEvent) => {
      onDragEnd(event, {
        paginatedRows,
        columnSortActive: Boolean(reorderInteractionBlocked),
        lastPointerSample: dragPointerSampleRef?.current ?? null,
      });
    },
    [dragPointerSampleRef, onDragEnd, paginatedRows, reorderInteractionBlocked],
  );

  return (
    <TmiRowReorderDndProvider
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={ROW_REORDER_DND_MEASURING}
      dragPointerSampleRef={dragPointerSampleRef}
      onDragEnd={handleReorderDragEnd}
      dragOverlayDropAnimation={null}
      renderDragOverlay={
        dragOverlayMirrorDataRow || renderDragOverlay
          ? renderDragOverlayResolved
          : undefined
      }
    >
      <DatabaseViewerBodyVirtualizedTable<TData>
        table={table}
        paginatedRows={paginatedRows}
        colCount={colCount}
        bodyTableSx={bodyTableSx}
        ariaLabel={ariaLabel}
        emptyMessage={emptyMessage}
        tableColumnSizeStyle={tableColumnSizeStyle}
        rowReorder={rowReorder}
        rowIsClickable={rowIsClickable}
        rowIntentEnabled={rowIntentEnabled}
        onRowIntent={onRowIntent}
        rowFileDrop={rowFileDrop}
        treeRowExpandableOverride={treeRowExpandableOverride}
        onTreeRowWillExpand={onTreeRowWillExpand}
        treeRowPartiallyExpanded={treeRowPartiallyExpanded}
        interactionSkinPreset={interactionSkinPreset}
        serverInfinite={serverInfinite}
        getRowDataAttributes={getRowDataAttributes}
        rowSavePending={rowSavePending}
        virtualItems={virtualItems}
        paddingTop={paddingTop}
        paddingBottom={paddingBottom}
        rowDropEnabled={rowDropEnabled}
        dragOverRowId={dragOverRowId}
        handleRowClick={handleRowClick}
        handleRowDragOver={handleRowDragOver}
        handleRowDragLeave={handleRowDragLeave}
        handleRowDrop={handleRowDrop}
        measureElement={rowVirtualizer.measureElement}
        infiniteSentinelRef={infiniteSentinelRef}
        rowSelectionEnabled={rowSelectionEnabled}
      />
    </TmiRowReorderDndProvider>
  );
}

function DatabaseViewerBodyRouter<TData extends object>(
  props: DatabaseViewerBodyProps<TData>,
): ReactElement {
  if (props.rowReorder?.enabled) {
    return (
      <DatabaseViewerBodyWithRowReorder
        {...props}
        rowReorder={props.rowReorder}
      />
    );
  }
  return <DatabaseViewerBodyVirtualized {...props} />;
}

type DatabaseViewerBodyVirtualizedTableProps<TData extends object> = Pick<
  DatabaseViewerBodyProps<TData>,
  | "table"
  | "paginatedRows"
  | "colCount"
  | "bodyTableSx"
  | "tableColumnSizeStyle"
  | "ariaLabel"
  | "emptyMessage"
  | "rowIsClickable"
  | "rowIntentEnabled"
  | "onRowIntent"
  | "rowFileDrop"
  | "treeRowExpandableOverride"
  | "onTreeRowWillExpand"
  | "treeRowPartiallyExpanded"
  | "interactionSkinPreset"
  | "serverInfinite"
  | "getRowDataAttributes"
  | "rowSavePending"
  | "rowSelectionEnabled"
> & {
  virtualItems: ReturnType<
    ReturnType<
      typeof useVirtualizer<HTMLDivElement, HTMLTableRowElement>
    >["getVirtualItems"]
  >;
  paddingTop: number;
  paddingBottom: number;
  rowDropEnabled: boolean;
  dragOverRowId: string | null;
  handleRowClick: (row: TData, meta?: DatabaseViewerRowClickMeta) => void;
  handleRowDragOver: (e: DragEvent<HTMLTableRowElement>) => void;
  handleRowDragLeave: (e: DragEvent<HTMLTableRowElement>) => void;
  handleRowDrop: (e: DragEvent<HTMLTableRowElement>) => void;
  measureElement: (el: HTMLTableRowElement) => void;
  infiniteSentinelRef: RefObject<HTMLDivElement | null>;
  rowReorder?: DatabaseViewerRowReorderConfig<TData>;
};

// eslint-disable-next-line max-lines-per-function -- spacer + SortableContext + sentinel in one JSX tree
function DatabaseViewerBodyVirtualizedTable<TData extends object>(
  props: DatabaseViewerBodyVirtualizedTableProps<TData>,
) {
  const {
    table,
    paginatedRows,
    colCount,
    bodyTableSx,
    tableColumnSizeStyle,
    ariaLabel,
    emptyMessage,
    virtualItems,
    paddingTop,
    paddingBottom,
    rowDropEnabled,
    rowFileDrop,
    dragOverRowId,
    getRowDataAttributes,
    rowIsClickable,
    rowIntentEnabled,
    onRowIntent,
    handleRowClick,
    handleRowDragOver,
    handleRowDragLeave,
    handleRowDrop,
    treeRowExpandableOverride,
    onTreeRowWillExpand,
    treeRowPartiallyExpanded,
    interactionSkinPreset,
    measureElement,
    infiniteSentinelRef,
    serverInfinite,
    rowSavePending,
    rowReorder,
    rowSelectionEnabled = false,
  } = props;

  const renderVirtualItemRow = (vi: (typeof virtualItems)[number]) => {
    const row = paginatedRows[vi.index];
    if (!row) return null;
    if (rowReorder?.enabled) {
      const canDragThisRow = rowReorder.canDragRow?.(row.original) ?? true;
      return (
        <DatabaseViewerReorderDataRow<TData>
          key={vi.key}
          {...buildDatabaseViewerBodyDataRowProps({
            row,
            dataRowIndex: vi.index,
            rowDropEnabled,
            rowFileDrop,
            dragOverRowId,
            getRowDataAttributes,
            rowIsClickable,
            rowIntentEnabled,
            onRowIntent,
            handleRowClick,
            handleRowDragOver,
            handleRowDragLeave,
            handleRowDrop,
            table,
            treeRowExpandableOverride,
            onTreeRowWillExpand,
            treeRowPartiallyExpanded,
            interactionSkinPreset,
            rowSavePending,
            rowSelectionEnabled,
          })}
          dndRowId={row.id as UniqueIdentifier}
          canDragThisRow={canDragThisRow}
          reorderInteractionBlocked={Boolean(
            rowReorder.reorderInteractionBlocked,
          )}
          measureElement={measureElement}
        />
      );
    }
    return renderDatabaseViewerBodyDataRow({
      row,
      dataRowIndex: vi.index,
      rowDropEnabled,
      rowFileDrop,
      dragOverRowId,
      getRowDataAttributes,
      rowIsClickable,
      rowIntentEnabled,
      onRowIntent,
      handleRowClick,
      handleRowDragOver,
      handleRowDragLeave,
      handleRowDrop,
      table,
      treeRowExpandableOverride,
      onTreeRowWillExpand,
      treeRowPartiallyExpanded,
      interactionSkinPreset,
      measureElement,
      rowSavePending,
      rowSelectionEnabled,
    });
  };

  const virtualRows = virtualItems.map((vi) => renderVirtualItemRow(vi));

  return (
    <Table
      size="small"
      sx={bodyTableSx}
      style={tableColumnSizeStyle}
      aria-label={ariaLabel}
      aria-multiselectable={rowSelectionEnabled ? true : undefined}
    >
      <DatabaseViewerColumnGroup table={table} />
      <TableBody>
        {paginatedRows.length === 0 ? (
          <DatabaseViewerEmptyRow
            colCount={colCount}
            emptyMessage={emptyMessage}
          />
        ) : (
          <>
            <DatabaseViewerVirtualSpacerRow
              colCount={colCount}
              height={paddingTop}
              position="top"
            />
            {rowReorder?.enabled ? (
              <SortableContext
                items={paginatedRows.map((r) => r.id as UniqueIdentifier)}
                strategy={verticalListSortingStrategy}
                disabled={Boolean(rowReorder.reorderInteractionBlocked)}
              >
                {virtualRows}
              </SortableContext>
            ) : (
              virtualRows
            )}
            <DatabaseViewerVirtualSpacerRow
              colCount={colCount}
              height={paddingBottom}
              position="bottom"
            />
            <DatabaseViewerInfiniteSentinelRow
              colCount={colCount}
              sentinelRef={infiniteSentinelRef}
              serverInfinite={serverInfinite}
            />
          </>
        )}
      </TableBody>
    </Table>
  );
}

function DatabaseViewerBodyVirtualized<TData extends object>({
  table,
  paginatedRows,
  colCount,
  bodyTableSx,
  ariaLabel,
  emptyMessage,
  tableColumnSizeStyle,
  rowIsClickable,
  rowIntentEnabled,
  onRowClick,
  onRowIntent,
  rowFileDrop,
  treeRowExpandableOverride,
  onTreeRowWillExpand,
  treeRowPartiallyExpanded,
  interactionSkinPreset,
  serverInfinite,
  dataLength,
  tableScrollElement,
  getRowDataAttributes,
  rowSavePending,
  rowSelectionConfig,
  rowSelectionEnabled = false,
}: DatabaseViewerBodyProps<TData>) {
  const {
    rowDropEnabled,
    rowVirtualizer,
    infiniteSentinelRef,
    virtualItems,
    paddingTop,
    paddingBottom,
    dragOverRowId,
    handleRowDragOver,
    handleRowDragLeave,
    handleRowDrop,
    handleRowClick,
  } = useDatabaseViewerVirtualRows({
    table,
    paginatedRows,
    tableScrollElement,
    dataLength,
    serverInfinite,
    rowFileDrop,
    onRowClick,
    rowSelectionConfig,
  });

  return (
    <DatabaseViewerBodyVirtualizedTable<TData>
      table={table}
      paginatedRows={paginatedRows}
      colCount={colCount}
      bodyTableSx={bodyTableSx}
      tableColumnSizeStyle={tableColumnSizeStyle}
      ariaLabel={ariaLabel}
      emptyMessage={emptyMessage}
      rowIsClickable={rowIsClickable}
      rowIntentEnabled={rowIntentEnabled}
      onRowIntent={onRowIntent}
      rowFileDrop={rowFileDrop}
      treeRowExpandableOverride={treeRowExpandableOverride}
      onTreeRowWillExpand={onTreeRowWillExpand}
      treeRowPartiallyExpanded={treeRowPartiallyExpanded}
      interactionSkinPreset={interactionSkinPreset}
      serverInfinite={serverInfinite}
      getRowDataAttributes={getRowDataAttributes}
      virtualItems={virtualItems}
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      rowDropEnabled={rowDropEnabled}
      dragOverRowId={dragOverRowId}
      handleRowClick={handleRowClick}
      handleRowDragOver={handleRowDragOver}
      handleRowDragLeave={handleRowDragLeave}
      handleRowDrop={handleRowDrop}
      measureElement={rowVirtualizer.measureElement}
      infiniteSentinelRef={infiniteSentinelRef}
      rowSavePending={rowSavePending}
      rowSelectionEnabled={rowSelectionEnabled}
    />
  );
}

DatabaseViewerBodyVirtualized.displayName = "DatabaseViewerBodyVirtualized";

DatabaseViewerBodyRouter.displayName = "DatabaseViewerBody";

export const DatabaseViewerBody = memo(DatabaseViewerBodyRouter) as <
  TData extends object,
>(
  props: DatabaseViewerBodyProps<TData>,
) => ReactElement;
