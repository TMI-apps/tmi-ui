import type { ColumnDef } from "@tanstack/react-table";
import type { DatabaseViewerProps } from "../../../src/DataTable/lesmateriaal-import/tmiTable/table/DatabaseViewer.js";

type Row = { id: string; name: string };

declare const appColumns: ColumnDef<Row, string>[];

type Columns = DatabaseViewerProps<Row>["columns"];
declare const accepted: Columns;
const _assignability: Columns = appColumns;
void _assignability;
