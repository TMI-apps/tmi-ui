import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnSizingState,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ColumnDef,
  type Header,
  type Row,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDatabaseViewerExpandedState } from "../hooks/useDatabaseViewerExpandedState.js";
import { useDatabaseViewerMaxHeight } from "../hooks/useDatabaseViewerMaxHeight.js";
import {
  resolveTMITableMaxHeight,
  tmiTableHeightMode,
  type TMITableMaxHeightProp,
} from "../hooks/resolveTMITableMaxHeight.js";
import type { DatabaseViewerScopeSummary } from "../../shared-types/tmiTableMeta.types.js";
import type { TableInteractionSkinPreset } from "../../shared-theme/tableInteractionSkin.js";
import {
  getDatabaseViewerBodyTableSx,
  getDatabaseViewerHeaderTableSx,
  getDatabaseViewerScrollContainerSx,
  getDatabaseViewerStickyHeaderBgSx,
} from "./databaseViewerTableStyles.js";
import {
  HEADER_LONG_PRESS_MS,
  HEADER_LONG_PRESS_MOVE_THRESHOLD_PX,
  WIDTH_ROUNDING_TOLERANCE_PX,
  type DatabaseViewerSurfaceMode,
} from "./databaseViewerConstants.js";
import { getDatabaseViewerTableColumnSizeStyle } from "./databaseViewerColumnSizeStyle.js";
import { DatabaseViewerColumnGroup } from "./DatabaseViewerColumnGroup.js";
import { getInitialColumnVisibilityFromColumns } from "./databaseViewerTableModelUtils.js";
import type { DatabaseViewerServerInfinite } from "./databaseViewerServerInfinite.js";
import type { DatabaseViewerRowFileDrop } from "./databaseViewerRowFileDrop.js";
import type {
  DatabaseViewerRowReorderConfig,
  DatabaseViewerRowReorderPointerSample,
} from "../../shared-types/databaseViewerRowReorder.types.js";
import { DatabaseViewerBody } from "./DatabaseViewerBody.js";
import { DatabaseViewerColumnHeaderCell } from "./DatabaseViewerColumnHeaderCell.js";
import {
  DatabaseViewerColumnMenu,
  type DatabaseViewerColumnMenuState,
} from "./DatabaseViewerColumnMenu.js";
import { DatabaseViewerScopeSummaryPopover } from "./DatabaseViewerScopeSummaryPopover.js";
import {
  buildDatabaseViewerActiveColumnFilterItems,
  buildDatabaseViewerDataSummaryItems,
  buildDatabaseViewerDisplaySummaryItems,
  databaseViewerHasActiveSorting,
  getDatabaseViewerColumnLabel,
} from "./databaseViewerSummaryModel.js";
import type {
  TMITableDebugConfig,
  TMITableSelectionConfig,
  TMITableTreeConfig,
} from "../../shared-types/tmiTableConfig.types.js";
import {
  resolveDatabaseViewerDebugConfig,
  resolveDatabaseViewerSelectionConfig,
  resolveDatabaseViewerTreeConfig,
} from "./databaseViewerResolveConfig.js";
import { shouldClearRowSelectionForKeyChange } from "./databaseViewerClearRowSelection.js";
import { DatabaseViewerLoadingSkeleton } from "./DatabaseViewerLoadingSkeleton.js";
import { DatabaseViewerInlineErrorBanner } from "./DatabaseViewerInlineErrorBanner.js";

/* Monolithic table shell: TanStack + MUI; behavior split across DatabaseViewer* siblings and style hooks. */

const DEFAULT_INITIAL_SORTING: SortingState = [];

/** Column defs from the app's `@tanstack/react-table` resolve (pnpm peer symlink type identity). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TanStack ColumnDef is invariant in TValue; wide TValue at package boundary
export type TMITableColumnDef<TData extends object> = ColumnDef<TData, any>;

export interface DatabaseViewerProps<TData extends object> {
  data: TData[];
  columns: Array<TMITableColumnDef<TData>>;
  loading: boolean;
  /**
   * When true, shows a scrim + spinner over the table (headers + body) while
   * stale/placeholder data remains visible — e.g. server pagination with
   * `placeholderData: keepPreviousData`.
   */
  backdropLoading?: boolean;
  error: string | null;
  getRowId: (row: TData) => string;
  getSubRows?: (row: TData) => TData[] | undefined;
  onRowClick?: (row: TData) => void;
  /** Hover/focus intent (e.g. prefetch) without opening row */
  onRowIntent?: (row: TData) => void;
  emptyMessage?: string;
  ariaLabel?: string;
  /**
   * Height policy for the virtualized grid (pixel/`100%` fill, not content auto-height).
   * Omit to fill remaining workspace/standalone slot via {@link useDatabaseViewerMaxHeight}.
   * Pass a number or CSS length to pin. Pass `false` for content-sized nested/dialog tables.
   */
  maxHeight?: TMITableMaxHeightProp;
  expandAllOnDataChange?: boolean;
  /**
   * When `expandAllOnDataChange` is false, only reset row expansion to collapsed when
   * this value changes (e.g. list query + pagination), not on every `data` update
   * (e.g. lazy-fetched subrows). Omit for legacy: reset on `data` change.
   */
  expandResetKey?: string;
  initialSorting?: SortingState;
  enableSorting?: boolean;
  /**
   * Set true when `data` is already filtered (e.g. server RPCs / query) so TanStack
   * does not re-filter the in-memory rows. Column filter UI is separate from global filtering.
   */
  manualFiltering?: boolean;
  /**
   * Set true when row order is defined by the server; TanStack will not re-sort `data`.
   * Pair with `enableSorting: false` until server-side sort is wired, or keep header sort only as display state.
   */
  manualSorting?: boolean;
  surfaceMode?: DatabaseViewerSurfaceMode;
  scopeSummary?: DatabaseViewerScopeSummary;
  /** Shown as retry button when error is set */
  onRetry?: () => void;
  /**
   * Initial column visibility: false = hidden. Omitted keys = visible.
   * When omitted, derived from column meta.defaultHidden.
   */
  initialColumnVisibility?: Partial<Record<string, boolean>>;
  /**
   * Merged into column visibility when the object changes (e.g. responsive hide/show).
   * `false` = hidden, `true` = visible. Omitted keys are left unchanged.
   */
  responsiveColumnVisibility?: Partial<Record<string, boolean>>;
  /** Opt-in row file drop. Row click is suppressed after a drop to avoid opening detail. */
  rowFileDrop?: DatabaseViewerRowFileDrop<TData>;
  /**
   * Merged into table expanded state when data or this map changes (e.g. open ancestor rows for search hits).
   * Keys are TanStack row ids from `getRowId`; values should be `true` to expand.
   */
  mergeExpandedRowIds?: Record<string, boolean> | null;
  /**
   * Tree rows: allow expand control even when subrows are not loaded yet (e.g. lazy children).
   * OR with TanStack default (subrows present).
   */
  treeRowExpandableOverride?: (row: Row<TData>) => boolean;
  /**
   * Tree rows: invoked before expanding; return false to cancel expand (e.g. failed lazy load).
   */
  onTreeRowWillExpand?: (row: Row<TData>) => boolean | Promise<boolean>;
  /**
   * When true, row is expanded in state but not “fully opened” (e.g. search path only).
   * First chevron click should complete opening (typically via onTreeRowWillExpand), not collapse.
   */
  treeRowPartiallyExpanded?: (row: Row<TData>) => boolean;
  interactionSkinPreset?: TableInteractionSkinPreset;
  /**
   * Server-side endless scroll: `data` is the accumulated set so far; fetches the next page when the user scrolls near the end.
   * Fully client-loaded lists can use {@link staticClientVirtualizedList}.
   */
  serverInfinite: DatabaseViewerServerInfinite;
  /**
   * When set, overrides {@link expandResetKey} for dev table-load debug log identity only
   * (does not affect row expansion). Use a stable string tied to list query identity.
   */
  tableLoadResetKey?: string;
  /** Session / access fields for local table debug logs (user id, role, …). */
  debugTableContext?: Record<string, unknown>;
  /**
   * Rendered at the bottom-end inside the viewer shell (e.g. primary FAB).
   * Positioned above the table body; does not affect row layout.
   */
  bottomEndAction?: ReactNode;
  /**
   * Optional data-* attributes on each body row (string values only), e.g. for pointer hit-testing.
   */
  getRowDataAttributes?: (row: TData) => Record<string, string | undefined>;
  /** Subtle pending-save affordance (e.g. optimistic mutation in flight). */
  rowSavePending?: (row: TData) => boolean;
  /** Optional row reorder; feature hook supplies sensors + `onDragEnd` (placement + RPC on drop). */
  rowReorder?: DatabaseViewerRowReorderConfig<TData>;
  /** Opt-in multi-row selection (Ctrl/Shift + click). */
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (next: RowSelectionState) => void;
  /** When this key changes, row selection is cleared (e.g. filter/search reset). */
  clearRowSelectionKey?: string | number;
  /** Grouped tree config (preferred over flat tree props). */
  tree?: TMITableTreeConfig<TData>;
  /** Grouped selection config (preferred over flat selection props). */
  selection?: TMITableSelectionConfig;
  /** Dev table-load debug config. */
  debug?: TMITableDebugConfig;
}

/**
 * For fully client-loaded lists: no server fetch, same endless-list contract.
 */
export function staticClientVirtualizedList(
  total: number,
): DatabaseViewerServerInfinite {
  return {
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: () => {
      /* no-op */
    },
    nextPageError: null,
    onRetryNextPage: () => {
      /* no-op */
    },
    totalLoaded: total,
    totalCount: total,
  };
}

export function DatabaseViewer<TData extends object>({
  data,
  columns,
  loading,
  backdropLoading = false,
  error,
  getRowId,
  getSubRows,
  onRowClick,
  onRowIntent,
  emptyMessage = "Geen resultaten gevonden.",
  ariaLabel = "Database viewer tabel",
  maxHeight: maxHeightProp,
  expandAllOnDataChange = true,
  expandResetKey,
  initialSorting = DEFAULT_INITIAL_SORTING,
  enableSorting = true,
  manualFiltering = false,
  manualSorting = false,
  surfaceMode = "paper",
  scopeSummary,
  onRetry,
  initialColumnVisibility,
  responsiveColumnVisibility,
  rowFileDrop,
  mergeExpandedRowIds = null,
  treeRowExpandableOverride,
  onTreeRowWillExpand,
  treeRowPartiallyExpanded,
  interactionSkinPreset = "default",
  serverInfinite,
  tableLoadResetKey,
  debugTableContext,
  bottomEndAction,
  getRowDataAttributes,
  rowSavePending,
  rowReorder,
  enableRowSelection = false,
  rowSelection = {},
  onRowSelectionChange,
  clearRowSelectionKey,
  tree,
  selection,
  debug,
}: DatabaseViewerProps<TData>) {
  const treeConfig = resolveDatabaseViewerTreeConfig(tree, {
    getSubRows,
    expandAllOnDataChange,
    expandResetKey,
    mergeExpandedRowIds,
    treeRowExpandableOverride,
    onTreeRowWillExpand,
    treeRowPartiallyExpanded,
  });
  const selectionConfig = resolveDatabaseViewerSelectionConfig(selection, {
    enableRowSelection,
    rowSelection,
    onRowSelectionChange,
    clearRowSelectionKey,
  });
  const debugConfig = resolveDatabaseViewerDebugConfig(debug, {
    tableLoadResetKey,
    debugTableContext,
  });

  const resolvedGetSubRows = treeConfig.getSubRows;
  const resolvedExpandAllOnDataChange = treeConfig.expandAllOnDataChange;
  const resolvedExpandResetKey = treeConfig.expandResetKey;
  const resolvedMergeExpandedRowIds = treeConfig.mergeExpandedRowIds;
  const resolvedTreeRowExpandableOverride =
    treeConfig.treeRowExpandableOverride;
  const resolvedOnTreeRowWillExpand = treeConfig.onTreeRowWillExpand;
  const resolvedTreeRowPartiallyExpanded = treeConfig.treeRowPartiallyExpanded;

  const resolvedEnableRowSelection = selectionConfig.enableRowSelection;
  const resolvedRowSelection = selectionConfig.rowSelection ?? {};
  const resolvedOnRowSelectionChange = selectionConfig.onRowSelectionChange;
  const resolvedClearRowSelectionKey = selectionConfig.clearRowSelectionKey;

  const resolvedTableLoadResetKey = debugConfig.tableLoadResetKey;
  const resolvedDebugTableContext = debugConfig.debugTableContext;
  const resolvedOnTableLoadSettled = debugConfig.onTableLoadSettled;
  const layoutMaxHeight = useDatabaseViewerMaxHeight();
  const resolvedMaxHeight = resolveTMITableMaxHeight(
    maxHeightProp,
    layoutMaxHeight,
  );
  const fillHeight = resolvedMaxHeight === "100%";
  const heightMode = tmiTableHeightMode(resolvedMaxHeight);
  const [summaryAnchorEl, setSummaryAnchorEl] = useState<HTMLElement | null>(
    null,
  );
  const [menuState, setMenuState] =
    useState<DatabaseViewerColumnMenuState | null>(null);
  const pagination = useMemo(
    () => ({ pageIndex: 0, pageSize: Math.max(data.length, 1) }),
    [data.length],
  );
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      if (initialColumnVisibility !== undefined) {
        return Object.fromEntries(
          Object.entries(initialColumnVisibility).filter(
            ([, v]) => typeof v === "boolean",
          ),
        ) as VisibilityState;
      }
      return getInitialColumnVisibilityFromColumns(columns);
    },
  );
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({});
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const longPressTimerRef = useRef<number | null>(null);
  const longPressStartRef = useRef<{
    columnId: string;
    x: number;
    y: number;
  } | null>(null);
  /** After touch long-press opens the column menu, ignore the next label click (ghost tap). */
  const suppressNextSortClickRef = useRef(false);
  /** Unified overflow:auto scroll root for virtualization, width measurement, and both axes. */
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  /**
   * Scroll element for TanStack Virtual: refs attach after descendant `useLayoutEffect` in the same
   * commit, so `getScrollElement: () => ref.current` can see `null` on the first paint. State bumps
   * once the `TableContainer` commits so the virtualizer re-binds with a real viewport.
   */
  const [tableScrollElement, setTableScrollElement] =
    useState<HTMLDivElement | null>(null);
  const assignTableContainerRef = useCallback((el: HTMLDivElement | null) => {
    tableContainerRef.current = el;
    setTableScrollElement((prev) => (prev === el ? prev : el));
  }, []);
  const filterInputRef = useRef<HTMLInputElement>(null);
  const selectionAnchorRef = useRef<string | null>(null);
  const [containerRect, setContainerRect] = useState<{ width: number } | null>(
    null,
  );
  /** Wrapper Box enclosing header + body strips — anchor for the absolute resize guide line. */
  const viewerWrapperRef = useRef<HTMLDivElement>(null);
  /** Vertical line that tracks the cursor during a column-resize drag. Updated imperatively. */
  const resizeGuideLineRef = useRef<HTMLDivElement>(null);
  const buildPrimarySorting = (
    previous: SortingState,
    columnId: string,
  ): SortingState => {
    const currentColumnSorting = previous.find((item) => item.id === columnId);
    const nextDesc = currentColumnSorting ? !currentColumnSorting.desc : false;
    return [
      { id: columnId, desc: nextDesc },
      ...previous.filter((item) => item.id !== columnId),
    ];
  };
  const { expanded, setExpanded } = useDatabaseViewerExpandedState({
    data,
    getRowId,
    getSubRows: resolvedGetSubRows,
    expandAllOnDataChange: resolvedExpandAllOnDataChange,
    expandResetKey: resolvedExpandResetKey,
  });

  const loadIdentityKey =
    resolvedTableLoadResetKey ?? resolvedExpandResetKey ?? "";
  const tableLoadDebugLogStateRef = useRef<{ key: string; logged: boolean }>({
    key: "",
    logged: false,
  });

  useEffect(() => {
    if (!resolvedOnTableLoadSettled) return;
    const st = tableLoadDebugLogStateRef.current;
    if (st.key !== loadIdentityKey) {
      tableLoadDebugLogStateRef.current = {
        key: loadIdentityKey,
        logged: false,
      };
    }
    if (loading || backdropLoading) return;
    if (tableLoadDebugLogStateRef.current.logged) return;
    tableLoadDebugLogStateRef.current.logged = true;
    const scopeFilters = scopeSummary?.dataFilters ?? [];
    resolvedOnTableLoadSettled({
      event: "table_load_settled",
      loadIdentityKey: loadIdentityKey || null,
      rowCountRendered: data.length,
      totalLoaded: serverInfinite.totalLoaded,
      totalCount: serverInfinite.totalCount,
      hasNextPage: serverInfinite.hasNextPage,
      isFetchingNextPage: serverInfinite.isFetchingNextPage,
      scopeFilters,
      error,
      context: resolvedDebugTableContext,
    });
  }, [
    loadIdentityKey,
    loading,
    backdropLoading,
    data.length,
    serverInfinite.totalLoaded,
    serverInfinite.totalCount,
    serverInfinite.hasNextPage,
    serverInfinite.isFetchingNextPage,
    scopeSummary,
    error,
    resolvedDebugTableContext,
    resolvedOnTableLoadSettled,
  ]);

  useEffect(() => {
    if (!resolvedMergeExpandedRowIds) return;
    const keys = Object.keys(resolvedMergeExpandedRowIds);
    if (keys.length === 0) return;
    setExpanded((prev) => {
      const base =
        typeof prev === "object" && prev !== null && !Array.isArray(prev)
          ? { ...prev }
          : {};
      let changed = false;
      for (const k of keys) {
        if (resolvedMergeExpandedRowIds[k] && base[k] !== true) {
          base[k] = true;
          changed = true;
        }
      }
      return changed ? base : prev;
    });
  }, [data, resolvedMergeExpandedRowIds, setExpanded]);

  useEffect(() => {
    setSorting(initialSorting);
  }, [initialSorting]);

  useEffect(() => {
    if (responsiveColumnVisibility === undefined) return;
    setColumnVisibility((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const [id, visible] of Object.entries(responsiveColumnVisibility)) {
        if (typeof visible === "boolean" && next[id] !== visible) {
          next[id] = visible;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [responsiveColumnVisibility]);

  useEffect(() => {
    return () => {
      clearLongPressTimer();
    };
  }, []);

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const openColumnMenu = (columnId: string, x: number, y: number) => {
    const currentFilterValue = table.getColumn(columnId)?.getFilterValue();
    setMenuState({
      columnId,
      anchorPosition: { top: y, left: x },
      filterValue:
        typeof currentFilterValue === "string" ? currentFilterValue : "",
    });
  };

  const handleHeaderContextMenu = (event: MouseEvent, columnId: string) => {
    if ((event.target as HTMLElement).closest("[data-resize-handle='true']")) {
      return;
    }
    event.preventDefault();
    openColumnMenu(columnId, event.clientX, event.clientY);
  };

  const handleHeaderPointerDown = (event: PointerEvent, columnId: string) => {
    if (event.pointerType !== "touch") return;
    if ((event.target as HTMLElement).closest("[data-resize-handle='true']")) {
      return;
    }
    clearLongPressTimer();
    longPressStartRef.current = {
      columnId,
      x: event.clientX,
      y: event.clientY,
    };
    longPressTimerRef.current = window.setTimeout(() => {
      suppressNextSortClickRef.current = true;
      openColumnMenu(columnId, event.clientX, event.clientY);
      longPressStartRef.current = null;
      longPressTimerRef.current = null;
    }, HEADER_LONG_PRESS_MS);
  };

  const handleHeaderPointerMove = (event: PointerEvent, columnId: string) => {
    const start = longPressStartRef.current;
    if (!start || start.columnId !== columnId) return;
    const dx = Math.abs(event.clientX - start.x);
    const dy = Math.abs(event.clientY - start.y);
    if (
      dx > HEADER_LONG_PRESS_MOVE_THRESHOLD_PX ||
      dy > HEADER_LONG_PRESS_MOVE_THRESHOLD_PX
    ) {
      clearLongPressTimer();
      longPressStartRef.current = null;
    }
  };

  const handleHeaderPointerEnd = () => {
    clearLongPressTimer();
    longPressStartRef.current = null;
  };

  /**
   * Imperative column-resize preview. Draws a vertical guide line that follows the
   * pointer during a resize drag without causing React re-renders. Paired with
   * `columnResizeMode: "onEnd"` so the table only re-measures once on release.
   */
  const handleResizeDragStart = useCallback(
    (event: MouseEvent | ReactTouchEvent) => {
      const wrapper = viewerWrapperRef.current;
      const line = resizeGuideLineRef.current;
      if (!wrapper || !line) return;

      const getClientX = (
        e: globalThis.MouseEvent | globalThis.TouchEvent,
      ): number => {
        if ("touches" in e)
          return e.touches[0]?.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;
        return e.clientX;
      };

      const update = (clientX: number) => {
        const rect = wrapper.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
        line.style.transform = `translate3d(${x}px, 0, 0)`;
      };

      const initialClientX =
        "touches" in event ? (event.touches[0]?.clientX ?? 0) : event.clientX;
      update(initialClientX);
      line.style.display = "block";

      const onMove = (e: globalThis.MouseEvent | globalThis.TouchEvent) => {
        update(getClientX(e));
      };
      const onEnd = () => {
        line.style.display = "none";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("mouseup", onEnd);
        window.removeEventListener("touchend", onEnd);
        window.removeEventListener("touchcancel", onEnd);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("touchmove", onMove, { passive: true });
      window.addEventListener("mouseup", onEnd);
      window.addEventListener("touchend", onEnd);
      window.addEventListener("touchcancel", onEnd);
    },
    [],
  );

  const handleHeaderSortClick = (
    event: MouseEvent<HTMLElement>,
    header: Header<TData, unknown>,
  ) => {
    if (!header.column.getCanSort() || !enableSorting) return;
    if (suppressNextSortClickRef.current) {
      suppressNextSortClickRef.current = false;
      event.preventDefault();
      return;
    }
    if (!event.shiftKey) {
      setSorting((previous) => buildPrimarySorting(previous, header.column.id));
      return;
    }
    header.column.getToggleSortingHandler()?.(event);
  };

  const tableRowCount = Math.max(data.length, 1);

  const rowSelectionEnabled =
    resolvedEnableRowSelection && Boolean(resolvedOnRowSelectionChange);

  const prevClearRowSelectionKeyRef = useRef<string | number | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!rowSelectionEnabled || resolvedClearRowSelectionKey === undefined)
      return;
    if (
      !shouldClearRowSelectionForKeyChange(
        prevClearRowSelectionKeyRef.current,
        resolvedClearRowSelectionKey,
      )
    ) {
      prevClearRowSelectionKeyRef.current = resolvedClearRowSelectionKey;
      return;
    }
    prevClearRowSelectionKeyRef.current = resolvedClearRowSelectionKey;
    resolvedOnRowSelectionChange?.({});
    selectionAnchorRef.current = null;
  }, [
    resolvedClearRowSelectionKey,
    rowSelectionEnabled,
    resolvedOnRowSelectionChange,
  ]);

  const rowSelectionConfig = useMemo(() => {
    if (!rowSelectionEnabled || !resolvedOnRowSelectionChange) return undefined;
    return {
      enabled: true,
      rowSelection: resolvedRowSelection,
      onRowSelectionChange: resolvedOnRowSelectionChange,
      selectionAnchorRef,
    };
  }, [resolvedOnRowSelectionChange, resolvedRowSelection, rowSelectionEnabled]);

  const selectedRowCount = useMemo(
    () =>
      Object.keys(resolvedRowSelection).filter((k) => resolvedRowSelection[k])
        .length,
    [resolvedRowSelection],
  );

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      minSize: 48,
    },
    state: {
      expanded,
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      columnPinning,
      columnSizing,
      ...(rowSelectionEnabled ? { rowSelection: resolvedRowSelection } : {}),
    },
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: setColumnSizing,
    ...(rowSelectionEnabled
      ? {
          enableRowSelection: true,
          onRowSelectionChange: (updater) => {
            const next =
              typeof updater === "function"
                ? updater(resolvedRowSelection)
                : updater;
            resolvedOnRowSelectionChange?.(next);
          },
        }
      : {}),
    getRowId: (row) => getRowId(row),
    getSubRows: resolvedGetSubRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel:
      enableSorting && !manualSorting ? getSortedRowModel() : undefined,
    manualPagination: true,
    manualFiltering,
    manualSorting,
    rowCount: tableRowCount,
    enableColumnPinning: true,
    enableColumnFilters: true,
    columnResizeMode: "onEnd",
  });

  const paginatedRows = table.getRowModel().rows;

  const dragPointerSampleRef =
    useRef<DatabaseViewerRowReorderPointerSample | null>(null);
  const columnSortActive = databaseViewerHasActiveSorting(sorting);

  const rowReorderResolved = useMemo(():
    | DatabaseViewerRowReorderConfig<TData>
    | undefined => {
    if (!rowReorder?.enabled) {
      return rowReorder;
    }
    return {
      ...rowReorder,
      reorderInteractionBlocked: columnSortActive,
      dragPointerSampleRef,
    };
  }, [columnSortActive, rowReorder]);

  const rowIsClickable = Boolean(onRowClick);
  const rowIntentEnabled = Boolean(onRowIntent);
  const containerWidth = containerRect?.width ?? 0;
  const totalTableWidth = table.getTotalSize();
  const hasHorizontalOverflow =
    totalTableWidth > containerWidth + WIDTH_ROUNDING_TOLERANCE_PX &&
    containerWidth > 0;

  /**
   * When the column sum fits the block, fill the measured width with explicit `<col>` sizes.
   * This keeps fixed icon columns narrow while normal columns absorb spare space.
   */
  const tableLayoutWidth = hasHorizontalOverflow
    ? totalTableWidth
    : containerWidth || "100%";
  const scrollContentWidth = hasHorizontalOverflow ? totalTableWidth : "100%";

  const tableColumnSizeStyle = useMemo(
    () =>
      getDatabaseViewerTableColumnSizeStyle(
        table,
        typeof tableLayoutWidth === "number" ? tableLayoutWidth : undefined,
      ),
    [table, tableLayoutWidth, columnSizing, columnVisibility, columnPinning],
  );
  const bodyTableSx = useMemo(
    () => getDatabaseViewerBodyTableSx(tableLayoutWidth),
    [tableLayoutWidth],
  );
  const headerTableSx = useMemo(
    () => getDatabaseViewerHeaderTableSx("100%"),
    [],
  );

  useEffect(() => {
    const el = tableContainerRef.current;
    if (!el) return;
    const update = () => {
      const measuredWidth = el.clientWidth || el.getBoundingClientRect().width;
      setContainerRect((prev) =>
        prev && prev.width === measuredWidth ? prev : { width: measuredWidth },
      );
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    const rafId = requestAnimationFrame(update);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  const getColumnLabel = useCallback(
    (columnId: string) => getDatabaseViewerColumnLabel(table, columnId),
    [table],
  );

  const displaySummaryItems = useMemo(
    () => buildDatabaseViewerDisplaySummaryItems(table, getColumnLabel),
    [getColumnLabel, table, columnVisibility, columnPinning],
  );
  const activeColumnFilterItems = useMemo(
    () =>
      buildDatabaseViewerActiveColumnFilterItems(columnFilters, getColumnLabel),
    [columnFilters, getColumnLabel],
  );
  const dataSummaryItems = useMemo(
    () =>
      buildDatabaseViewerDataSummaryItems(
        scopeSummary,
        activeColumnFilterItems,
      ),
    [activeColumnFilterItems, scopeSummary],
  );
  const hasActiveDataFilters = dataSummaryItems.length > 0;
  const stickyHeaderStripSx = useMemo(
    () => ({
      position: "sticky" as const,
      top: 0,
      zIndex: 3,
      flexShrink: 0,
      ...getDatabaseViewerStickyHeaderBgSx(surfaceMode),
    }),
    [surfaceMode],
  );

  if (loading && data.length === 0) {
    return (
      <DatabaseViewerLoadingSkeleton
        ariaLabel={ariaLabel}
        colCount={Math.max(columns.length, 1)}
      />
    );
  }

  const hasRenderableRows = data.length > 0;
  const showFullPageError = Boolean(error) && !hasRenderableRows;
  const showInlineError = Boolean(error) && hasRenderableRows;

  if (showFullPageError) {
    return (
      <Alert
        severity="error"
        sx={{ mt: 2 }}
        action={
          onRetry ? (
            <Button color="inherit" size="small" onClick={onRetry}>
              Opnieuw proberen
            </Button>
          ) : undefined
        }
      >
        {error}
      </Alert>
    );
  }

  const colCount = table.getVisibleLeafColumns().length;

  // When resolved height is `"100%"` the viewer is expected to fill a parent that
  // has a defined, bounded height (e.g. a flex:1 / min-height:0 cell inside a
  // viewport-height container). Percentage height alone cannot stretch a
  // shrink-wrapped flex item, so we additionally set `height: 100%` and turn
  // the surface into a flex column that lets the body region flex to fill.
  const content = (
    <>
      {rowSelectionEnabled && selectedRowCount > 0 ? (
        <Box
          aria-live="polite"
          aria-atomic="true"
          sx={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
          }}
        >
          {selectedRowCount} rijen geselecteerd
        </Box>
      ) : null}
      {showInlineError && error ? (
        <DatabaseViewerInlineErrorBanner error={error} onRetry={onRetry} />
      ) : null}
      <Box
        ref={viewerWrapperRef}
        data-tmi-table-height-mode={heightMode}
        sx={{
          display: "flex",
          flexDirection: "column",
          ...(fillHeight
            ? { height: "100%", flex: 1, minHeight: 0 }
            : resolvedMaxHeight !== undefined
              ? { maxHeight: resolvedMaxHeight, minHeight: 0 }
              : { minHeight: 0 }),
          width: "100%",
          position: "relative",
        }}
      >
        <Box
          ref={resizeGuideLineRef}
          aria-hidden
          sx={{
            display: "none",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "2px",
            marginLeft: "-1px",
            bgcolor: "primary.main",
            opacity: 0.8,
            pointerEvents: "none",
            zIndex: 10,
            willChange: "transform",
          }}
        />
        {backdropLoading && (
          <Box
            aria-busy="true"
            aria-live="polite"
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 15,
              pointerEvents: "auto",
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.72),
            }}
          >
            <CircularProgress aria-hidden size={40} />
          </Box>
        )}
        <TableContainer
          ref={assignTableContainerRef}
          component={Box}
          sx={getDatabaseViewerScrollContainerSx(hasHorizontalOverflow)}
        >
          <Box
            sx={{
              width: scrollContentWidth,
              minWidth: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={stickyHeaderStripSx}>
              <Table
                size="small"
                sx={headerTableSx}
                style={tableColumnSizeStyle}
              >
                <DatabaseViewerColumnGroup table={table} />
                <TableHead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <DatabaseViewerColumnHeaderCell
                          key={header.id}
                          header={header}
                          surfaceMode={surfaceMode}
                          enableSorting={enableSorting}
                          scopeSummary={scopeSummary}
                          onSummaryOpen={setSummaryAnchorEl}
                          onSortLabelClick={handleHeaderSortClick}
                          onResizeDragStart={handleResizeDragStart}
                          handleHeaderContextMenu={handleHeaderContextMenu}
                          handleHeaderPointerDown={handleHeaderPointerDown}
                          handleHeaderPointerMove={handleHeaderPointerMove}
                          handleHeaderPointerEnd={handleHeaderPointerEnd}
                        />
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
              </Table>
            </Box>
            {rowReorder?.enabled && columnSortActive ? (
              <Box
                aria-live="polite"
                role="status"
                sx={{ px: 1, py: 0.5, flexShrink: 0, bgcolor: "action.hover" }}
              >
                <Typography variant="caption" color="text.secondary">
                  Zet sortering uit om handmatig te ordenen.
                </Typography>
              </Box>
            ) : null}
            <DatabaseViewerBody<TData>
              table={table}
              paginatedRows={paginatedRows}
              colCount={colCount}
              bodyTableSx={bodyTableSx}
              ariaLabel={ariaLabel}
              emptyMessage={emptyMessage}
              tableColumnSizeStyle={tableColumnSizeStyle}
              rowIsClickable={rowIsClickable}
              rowIntentEnabled={rowIntentEnabled}
              onRowClick={onRowClick}
              onRowIntent={onRowIntent}
              rowFileDrop={rowFileDrop}
              treeRowExpandableOverride={resolvedTreeRowExpandableOverride}
              onTreeRowWillExpand={resolvedOnTreeRowWillExpand}
              treeRowPartiallyExpanded={resolvedTreeRowPartiallyExpanded}
              interactionSkinPreset={interactionSkinPreset}
              serverInfinite={serverInfinite}
              dataLength={data.length}
              tableScrollElement={tableScrollElement}
              getRowDataAttributes={getRowDataAttributes}
              rowSavePending={rowSavePending}
              rowReorder={rowReorderResolved}
              rowSelectionConfig={rowSelectionConfig}
              rowSelectionEnabled={rowSelectionEnabled}
            />
          </Box>
        </TableContainer>
        {bottomEndAction ? (
          <Box
            sx={{
              position: "absolute",
              right: 16,
              bottom: 12,
              zIndex: 20,
              pointerEvents: "none",
              "& > *": { pointerEvents: "auto" },
            }}
          >
            {bottomEndAction}
          </Box>
        ) : null}
      </Box>
      <DatabaseViewerColumnMenu
        table={table}
        menuState={menuState}
        setMenuState={setMenuState}
        sorting={sorting}
        setSorting={setSorting}
        filterInputRef={filterInputRef}
      />
      <DatabaseViewerScopeSummaryPopover
        open={Boolean(summaryAnchorEl)}
        anchorEl={summaryAnchorEl}
        onClose={() => setSummaryAnchorEl(null)}
        scopeSummary={scopeSummary}
        dataSummaryItems={dataSummaryItems}
        displaySummaryItems={displaySummaryItems}
        hasActiveDataFilters={hasActiveDataFilters}
        hasActiveSorting={columnSortActive}
        setColumnFilters={setColumnFilters}
        setSorting={setSorting}
      />
    </>
  );
  const surfaceSx = {
    width: "100%",
    overflow: "hidden",
    ...(fillHeight
      ? {
          height: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }
      : {}),
    ...(surfaceMode === "inherit"
      ? { bgcolor: "inherit", boxShadow: "none", backgroundImage: "none" }
      : {}),
    ...(surfaceMode === "transparent"
      ? { bgcolor: "transparent", boxShadow: "none", backgroundImage: "none" }
      : {}),
  };

  return surfaceMode === "none" ? (
    <Box sx={surfaceSx}>{content}</Box>
  ) : (
    <Paper sx={surfaceSx}>{content}</Paper>
  );
}
