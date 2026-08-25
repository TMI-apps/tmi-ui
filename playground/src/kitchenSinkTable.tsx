/**
 * Kitchen-sink TMITable fixture — README integration ledger mapping (workshop only).
 *
 * Enabled in this fixture:
 * - staticClientVirtualizedList (local client data)
 * - tree (getSubRows)
 * - row selection (modifier click)
 * - row reorder (sort off — reorderInteractionBlocked when column sort active)
 * - TableRowActionButton in an edge icon column
 * - rowCreate (pinned viewport create row; not a data row)
 * - detail workspace + TMITableDetailEditPanel (hero contained in pane/drawer)
 * - OptimisticTableFeedbackProvider wrapper
 * - PortaledOverlayStackProvider (app shell)
 *
 * Excluded / not simultaneous in one static view:
 * - filterPromptActive hides table — see separate Filter prompt visual section
 * - column sort + row reorder — sort blocks reorder; demo reorder with default sort state
 */
import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { Box, Button, Typography } from "@mui/material";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import {
  DetailPanelHeroStatsStrip,
  OptimisticTableFeedbackProvider,
  staticClientVirtualizedList,
  TMITable,
  TMITableDetailEditPanel,
  TMITableWorkspace,
  TableRowActionButton,
  useOptimisticTableFeedback,
  useRegisterDetailShellBackdropDismiss,
} from "@tmi-packages/ui";
import {
  kitchenSinkColumns,
  kitchenSinkRowFromCreate,
  KITCHEN_SINK_INITIAL_ROWS,
  type KitchenSinkRow,
} from "./kitchenSinkFixture.js";

function flattenRows(rows: KitchenSinkRow[]): KitchenSinkRow[] {
  const out: KitchenSinkRow[] = [];
  for (const row of rows) {
    out.push(row);
    if (row.children) out.push(...flattenRows(row.children));
  }
  return out;
}

function KitchenSinkDetailDismiss({ onClose }: { onClose: () => void }) {
  useRegisterDetailShellBackdropDismiss(onClose);
  return null;
}

function KitchenSinkWorkspaceInner(): ReactElement {
  const { beginPendingRow, endPendingRow, isRowPending } =
    useOptimisticTableFeedback();
  const createSeq = useRef(0);
  const [rows, setRows] = useState(KITCHEN_SINK_INITIAL_ROWS);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const flat = useMemo(() => flattenRows(rows), [rows]);
  const selectedRow = flat.find((r) => r.id === selectedId) ?? null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent, meta: { columnSortActive: boolean }) => {
      if (meta.columnSortActive) return;
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const activeId = String(active.id);
      const overId = String(over.id);
      setRows((prev) => {
        const fromIndex = prev.findIndex((r) => r.id === activeId);
        const toIndex = prev.findIndex((r) => r.id === overId);
        if (fromIndex < 0 || toIndex < 0) return prev;
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        return next;
      });
    },
    [],
  );

  const columns = useMemo((): Array<ColumnDef<KitchenSinkRow, unknown>> => {
    return [
      ...kitchenSinkColumns,
      {
        id: "actions",
        header: "",
        size: 56,
        enableSorting: false,
        meta: {
          iconSurrogateCell: true,
          fullHeightInteractive: true,
        },
        cell: ({ row }) => (
          <TableRowActionButton
            title="Row action"
            aria-label={`Action for ${row.original.name}`}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <DeleteOutline fontSize="small" />
          </TableRowActionButton>
        ),
      },
    ];
  }, []);

  const table = (
    <TMITable<KitchenSinkRow>
      data={rows}
      columns={columns}
      loading={false}
      error={null}
      getRowId={(row) => row.id}
      serverInfinite={staticClientVirtualizedList(flat.length)}
      ariaLabel="Kitchen-sink workshop table"
      maxHeight={420}
      tree={{
        getSubRows: (row) => row.children,
        expandAllOnDataChange: true,
      }}
      selection={{
        enabled: true,
        rowSelection,
        onRowSelectionChange: setRowSelection,
      }}
      rowReorder={{
        enabled: true,
        sensors,
        onDragEnd: (event, meta) => handleDragEnd(event, meta),
        dragOverlayMirrorDataRow: true,
      }}
      rowCreate={{
        ariaLabel: "Add workshop row",
        onCreate: ({ value }) => {
          createSeq.current += 1;
          const id = `created-${createSeq.current}`;
          setRows((prev) => [...prev, kitchenSinkRowFromCreate(id, value)]);
          beginPendingRow(id);
          queueMicrotask(() => endPendingRow(id));
          return id;
        },
      }}
      rowSavePending={(row) => isRowPending(row.id)}
      onRowClick={(row) => {
        setSelectedId(row.id);
        setDetailOpen(true);
      }}
    />
  );

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setSelectedId(null);
  }, []);

  const detailPanel = selectedRow ? (
    <>
      <KitchenSinkDetailDismiss onClose={closeDetail} />
      <TMITableDetailEditPanel
        detailTransitioning={false}
        detailError={null}
        headerProps={{
          loading: false,
          recordPresent: true,
          title: selectedRow.name,
          subtitle: "Workshop detail hero",
          isAdmin: false,
          onClose: closeDetail,
          statsStrip: (
            <DetailPanelHeroStatsStrip
              items={[
                { label: "Rows", value: String(flat.length) },
                {
                  label: "Selected",
                  value: String(Object.keys(rowSelection).length),
                },
              ]}
            />
          ),
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Detail body placeholder — open from row click in the kitchen-sink
          table.
        </Typography>
      </TMITableDetailEditPanel>
    </>
  ) : null;

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Click a row for detail. Expand tree groups. Ctrl/Shift-click to
          select. Drag top-level groups to reorder (column sort off). Type or
          paste lines in the pinned create row at the bottom of the table.
        </Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setDetailOpen(false);
            setSelectedId(null);
            setRowSelection({});
          }}
        >
          Reset selection & detail
        </Button>
      </Box>
      <TMITableWorkspace
        leftHeader={
          <Typography variant="subtitle2" color="text.secondary">
            Workshop filters header
          </Typography>
        }
        table={table}
        detailOpen={detailOpen}
        detailPanel={detailPanel}
        enableViewportFill={false}
      />
    </>
  );
}

export function KitchenSinkWorkspace(): ReactElement {
  return (
    <OptimisticTableFeedbackProvider>
      <KitchenSinkWorkspaceInner />
    </OptimisticTableFeedbackProvider>
  );
}
