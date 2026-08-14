import { useEffect, useState } from "react";
import { getAirtableAttachmentChipThumbnailUrl } from "../shared-utils/airtableAttachments.js";
import {
  TableRowThumbnailPlaceholder,
  TableRowThumbnailShell,
} from "./TableRowThumbnailShell.js";

export interface AirtableAttachmentThumbnailCellProps {
  /** Raw JSONB value from e.g. `externe_tools.thumbnail` or `media.afbeelding`. */
  value: unknown;
  alt?: string;
}

/**
 * Full-bleed thumbnail cell for table rows that surface an Airtable-synced
 * `multipleAttachments` column. The image fills the entire cell (`objectFit: cover`)
 * behind **`meta.rowThumbnailCell`** (zero-padding “paint dip” layout from `DatabaseViewer`).
 *
 * Resolution stays in **`getAirtableAttachmentChipThumbnailUrl`**; paint uses **`TableRowThumbnailShell`**
 * (same placeholder tint + **`Fade`** + lazy/low-priority **`img`** as Lesmateriaal row thumbs).
 *
 * Missing/malformed attachment JSON shows the shared placeholder; a URL that fails to decode shows
 * the same placeholder (**no** broken-image glyph as an end state).
 */
export function AirtableAttachmentThumbnailCell({
  value,
  alt = "Thumbnail",
}: AirtableAttachmentThumbnailCellProps) {
  const url = getAirtableAttachmentChipThumbnailUrl(value);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    setLoadFailed(false);
  }, [url]);

  if (!url || loadFailed) {
    return <TableRowThumbnailPlaceholder />;
  }

  return (
    <TableRowThumbnailShell
      src={url}
      alt={alt}
      onError={() => setLoadFailed(true)}
    />
  );
}
