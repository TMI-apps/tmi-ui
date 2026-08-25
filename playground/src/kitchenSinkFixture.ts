import type { ColumnDef } from "@tanstack/react-table";

export type KitchenSinkRow = {
  id: string;
  name: string;
  children?: KitchenSinkRow[];
};

export const KITCHEN_SINK_INITIAL_ROWS: KitchenSinkRow[] = [
  {
    id: "group-a",
    name: "Group A",
    children: [
      { id: "row-alpha", name: "Row Alpha" },
      { id: "row-beta", name: "Row Beta" },
    ],
  },
  {
    id: "group-b",
    name: "Group B",
    children: [
      { id: "row-gamma", name: "Row Gamma" },
      { id: "row-delta", name: "Row Delta" },
    ],
  },
];

export const kitchenSinkColumns: Array<ColumnDef<KitchenSinkRow, unknown>> = [
  { accessorKey: "name", header: "Name", size: 280 },
];

/** Workshop `rowCreate.onCreate` helper — append a top-level row from the focused column value. */
export function kitchenSinkRowFromCreate(
  id: string,
  value: string,
): KitchenSinkRow {
  return { id, name: value };
}
