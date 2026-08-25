import type { ColumnDef } from "@tanstack/react-table";
import { Box, Typography } from "@mui/material";
import {
  DetailPanelHeroHeader,
  DetailPanelHeroStatsStrip,
  RecordWorkspaceShell,
  TMITable,
  staticClientVirtualizedList,
} from "@tmi-packages/ui";

type Row = { id: string; name: string; status: string };

const ROWS: Row[] = [
  { id: "r1", name: "Bibliotheek Rotterdam", status: "Actief" },
  { id: "r2", name: "Bibliotheek Utrecht", status: "Actief" },
];

const COLUMNS: ColumnDef<Row, unknown>[] = [
  { accessorKey: "name", header: "Naam", size: 260 },
  { accessorKey: "status", header: "Status", size: 120 },
];

const COVER_URL = "https://picsum.photos/seed/tmi-ui-record-shell/960/300";

// RecordWorkspaceShell is a re-export alias of TMITableWorkspace — same
// component, same props (see src/DataTable/lesmateriaal-import/tmiTable/RecordWorkspaceShell.tsx).
export function SplitWithDetail() {
  return (
    <Box sx={{ height: 480 }}>
      <RecordWorkspaceShell
        leftHeader={
          <Typography variant="subtitle2" color="text.secondary">
            Filters
          </Typography>
        }
        table={
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
        }
        detailOpen
        detailPanel={
          <DetailPanelHeroHeader
            loading={false}
            recordPresent
            title="Bibliotheek Rotterdam"
            subtitle="Record workspace"
            isAdmin={false}
            onClose={() => undefined}
            heroImageMeta={{ src: COVER_URL, fallbackSrc: null }}
            statsStrip={
              <DetailPanelHeroStatsStrip
                items={[{ label: "Rows", value: "2" }]}
              />
            }
          />
        }
        enableViewportFill={false}
      />
    </Box>
  );
}
