import type { ColumnDef } from "@tanstack/react-table";
import { TMITable, staticClientVirtualizedList } from "@tmi-packages/ui";

type Row = { id: string; name: string; status: string; children?: Row[] };

const FLAT_ROWS: Row[] = [
  { id: "r1", name: "Bibliotheek Rotterdam", status: "Actief" },
  { id: "r2", name: "Bibliotheek Utrecht", status: "Actief" },
  { id: "r3", name: "Bibliotheek Groningen", status: "Concept" },
];

const TREE_ROWS: Row[] = [
  {
    id: "g1",
    name: "Regio Zuid-Holland",
    status: "—",
    children: [
      { id: "r1", name: "Bibliotheek Rotterdam", status: "Actief" },
      { id: "r2", name: "Bibliotheek Den Haag", status: "Actief" },
    ],
  },
  {
    id: "g2",
    name: "Regio Utrecht",
    status: "—",
    children: [{ id: "r3", name: "Bibliotheek Utrecht", status: "Concept" }],
  },
];

const COLUMNS: ColumnDef<Row, unknown>[] = [
  { accessorKey: "name", header: "Naam", size: 260 },
  { accessorKey: "status", header: "Status", size: 120 },
];

// TMITable is a thin debug-config wrapper over DatabaseViewer — same props,
// same render. See DatabaseViewer.tsx for the fuller variant sweep.
export function Basic() {
  return (
    <TMITable<Row>
      data={FLAT_ROWS}
      columns={COLUMNS}
      loading={false}
      error={null}
      getRowId={(row) => row.id}
      serverInfinite={staticClientVirtualizedList(FLAT_ROWS.length)}
      ariaLabel="Bibliotheken"
      maxHeight={280}
    />
  );
}

export function Tree() {
  return (
    <TMITable<Row>
      data={TREE_ROWS}
      columns={COLUMNS}
      loading={false}
      error={null}
      getRowId={(row) => row.id}
      serverInfinite={staticClientVirtualizedList(3)}
      ariaLabel="Bibliotheken per regio"
      maxHeight={320}
      tree={{ getSubRows: (row) => row.children, expandAllOnDataChange: true }}
    />
  );
}
