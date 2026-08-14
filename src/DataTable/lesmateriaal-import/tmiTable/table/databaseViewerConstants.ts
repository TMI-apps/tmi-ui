export const DEFAULT_ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];
export const HEADER_LONG_PRESS_MS = 500;
export const HEADER_LONG_PRESS_MOVE_THRESHOLD_PX = 8;
export const WIDTH_ROUNDING_TOLERANCE_PX = 2;

/** Set on {@link TableRow} when the row accepts file drop; stable drag handlers read this. */
export const DBV_ROW_ID_ATTR = "data-dbv-row-id";

export type DatabaseViewerSurfaceMode =
  | "paper"
  | "inherit"
  | "transparent"
  | "none";

/** Default scope-summary title (popover + header trigger `aria-label`). */
export const DATABASE_VIEWER_SCOPE_SUMMARY_DEFAULT_TITLE = "Wat je nu ziet";
