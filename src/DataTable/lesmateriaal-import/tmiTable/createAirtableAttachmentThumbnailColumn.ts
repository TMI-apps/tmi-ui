import type {
  AccessorFn,
  ColumnDef,
  ColumnHelper,
} from "@tanstack/react-table";
import { createElement } from "react";
import { AirtableAttachmentThumbnailCell } from "../satellites/AirtableAttachmentThumbnailCell.js";
import { TABLE_ROW_THUMB_COLUMN_PX } from "../satellites/tableRowThumbConstants.js";
import type { DatabaseViewerColumnMeta } from "../shared-types/tmiTableMeta.types.js";

/** Leading Airtable `multipleAttachments` thumb column (**`meta.rowThumbnailCell`**). */
export function createAirtableAttachmentThumbnailColumn<TData>(
  columnHelper: ColumnHelper<TData>,
  options: {
    id: string;
    accessor: AccessorFn<TData, unknown>;
    getAlt: (row: TData) => string;
    /** Shallow-merged before `defaultHidden: false` and `rowThumbnailCell: true` */
    meta?: Partial<Omit<DatabaseViewerColumnMeta, "rowThumbnailCell">>;
  },
): ColumnDef<TData, unknown> {
  return columnHelper.accessor(options.accessor, {
    id: options.id,
    header: "",
    size: TABLE_ROW_THUMB_COLUMN_PX,
    minSize: TABLE_ROW_THUMB_COLUMN_PX,
    enableSorting: false,
    cell: (info) =>
      createElement(AirtableAttachmentThumbnailCell, {
        value: info.getValue(),
        alt: options.getAlt(info.row.original),
      }),
    meta: {
      defaultHidden: false,
      ...(options.meta ?? {}),
      rowThumbnailCell: true,
    } satisfies DatabaseViewerColumnMeta,
  });
}
