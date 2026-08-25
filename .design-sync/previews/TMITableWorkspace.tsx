import type { ColumnDef } from "@tanstack/react-table";
import { Box, Typography } from "@mui/material";
import {
  DetailPanelHeroHeader,
  DetailPanelHeroStatsStrip,
  TMITableWorkspace,
  TMITable,
  staticClientVirtualizedList,
} from "@tmi-packages/ui";

type Row = { id: string; name: string; status: string };

const ROWS: Row[] = [
  { id: "r1", name: "Bibliotheek Rotterdam", status: "Actief" },
  { id: "r2", name: "Bibliotheek Utrecht", status: "Actief" },
  { id: "r3", name: "Bibliotheek Groningen", status: "Concept" },
];

const COLUMNS: ColumnDef<Row, unknown>[] = [
  { accessorKey: "name", header: "Naam", size: 260 },
  { accessorKey: "status", header: "Status", size: 120 },
];

const COVER_URL = "https://picsum.photos/seed/tmi-ui-workspace/960/300";

function Table() {
  return (
    <TMITable<Row>
      data={ROWS}
      columns={COLUMNS}
      loading={false}
      error={null}
      getRowId={(row) => row.id}
      serverInfinite={staticClientVirtualizedList(ROWS.length)}
      ariaLabel="Bibliotheken"
      maxHeight={360}
    />
  );
}

export function SplitWithDetail() {
  return (
    <Box sx={{ height: 480 }}>
      <TMITableWorkspace
        leftHeader={
          <Typography variant="subtitle2" color="text.secondary">
            Filters
          </Typography>
        }
        table={<Table />}
        detailOpen
        detailPanel={
          <DetailPanelHeroHeader
            loading={false}
            recordPresent
            title="Bibliotheek Rotterdam"
            subtitle="Detail workspace"
            isAdmin={false}
            onClose={() => undefined}
            heroImageMeta={{ src: COVER_URL, fallbackSrc: null }}
            statsStrip={
              <DetailPanelHeroStatsStrip
                items={[{ label: "Rows", value: "3" }]}
              />
            }
          />
        }
        enableViewportFill={false}
      />
    </Box>
  );
}

export function FilterPrompt() {
  return (
    <Box sx={{ height: 320 }}>
      <TMITableWorkspace
        leftHeader={
          <Typography variant="subtitle2" color="text.secondary">
            Filters inactief
          </Typography>
        }
        table={<Box p={2}>Tabel verborgen tot filters actief zijn</Box>}
        detailOpen={false}
        detailPanel={null}
        filterPromptActive
        enableViewportFill={false}
      />
    </Box>
  );
}
