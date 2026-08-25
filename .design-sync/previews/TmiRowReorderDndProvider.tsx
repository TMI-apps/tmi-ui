import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Stack, Typography } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useState, type ReactElement } from "react";
import { TmiRowReorderDndProvider } from "@tmi-packages/ui";

type DemoRow = { id: string; label: string };

const INITIAL_ROWS: DemoRow[] = [
  { id: "row-1", label: "Introduction to fractions" },
  { id: "row-2", label: "Long division worksheet" },
  { id: "row-3", label: "Multiplication tables quiz" },
  { id: "row-4", label: "Geometry: angles and shapes" },
];

// A minimal sortable row list mirroring how DatabaseViewerBody wires
// TmiRowReorderDndProvider around a SortableContext of table rows.
function SortableDemoRow({ row }: { row: DemoRow }): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: row.id });
  return (
    <Box
      ref={setNodeRef}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.5,
        py: 1,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: isDragging ? "action.selected" : "background.paper",
        opacity: isDragging ? 0.5 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <Box
        {...attributes}
        {...listeners}
        sx={{ display: "flex", cursor: "grab", color: "text.disabled" }}
      >
        <DragIndicatorIcon fontSize="small" />
      </Box>
      <Typography variant="body2">{row.label}</Typography>
    </Box>
  );
}

function ReorderableRowList(): ReactElement {
  const [rows, setRows] = useState(INITIAL_ROWS);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setRows((prev) => {
      const fromIndex = prev.findIndex((r) => r.id === active.id);
      const toIndex = prev.findIndex((r) => r.id === over.id);
      if (fromIndex < 0 || toIndex < 0) return prev;
      return arrayMove(prev, fromIndex, toIndex);
    });
  };

  return (
    <Stack spacing={1} sx={{ maxWidth: 420 }}>
      <Typography variant="caption" color="text.secondary">
        Drag the handle to reorder rows — the exact `@dnd-kit` wiring
        TMITable's row-reorder feature uses.
      </Typography>
      <TmiRowReorderDndProvider
        sensors={sensors}
        onDragEnd={handleDragEnd}
        dragOverlayDropAnimation={null}
        renderDragOverlay={(activeId: UniqueIdentifier) => {
          const row = rows.find((r) => r.id === activeId);
          if (!row) return null;
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 1,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "primary.main",
                bgcolor: "background.paper",
                boxShadow: 4,
              }}
            >
              <DragIndicatorIcon fontSize="small" color="primary" />
              <Typography variant="body2">{row.label}</Typography>
            </Box>
          );
        }}
      >
        <SortableContext
          items={rows.map((r) => r.id)}
          strategy={verticalListSortingStrategy}
        >
          <Stack spacing={0.5}>
            {rows.map((row) => (
              <SortableDemoRow key={row.id} row={row} />
            ))}
          </Stack>
        </SortableContext>
      </TmiRowReorderDndProvider>
    </Stack>
  );
}

export function Default(): ReactElement {
  return <ReorderableRowList />;
}
