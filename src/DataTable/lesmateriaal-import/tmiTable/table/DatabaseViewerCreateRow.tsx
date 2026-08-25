import Add from "@mui/icons-material/Add";
import {
  Box,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import type { Column, Table as TanStackTable } from "@tanstack/react-table";
import {
  useCallback,
  useRef,
  useState,
  type ClipboardEvent,
  type CSSProperties,
  type Dispatch,
  type KeyboardEvent,
  type SetStateAction,
} from "react";
import { tmiPrimaryContainedRowShellSx } from "../../../../AutocompleteSelect/tmiPrimaryContained.js";
import { useOptimisticTableFeedback } from "../feedback/OptimisticTableFeedbackContext.js";
import { getDatabaseViewerColumnWidthCssValue } from "./databaseViewerColumnSizeStyle.js";
import type { DatabaseViewerSurfaceMode } from "./databaseViewerConstants.js";
import {
  getDatabaseViewerCreateColumnLabel,
  isDatabaseViewerCreateInputColumn,
} from "./databaseViewerCreateColumn.js";
import { splitCreatePasteLines } from "./databaseViewerCreatePaste.js";
import { getPinnedCellSx } from "./databaseViewerTableModelUtils.js";
import {
  DATABASE_VIEWER_BODY_ROW_BAR_HEIGHT_PX,
  DATABASE_VIEWER_BODY_ROW_GAP_PX,
  getDatabaseViewerStickyHeaderBgSx,
} from "./databaseViewerTableStyles.js";
import { DatabaseViewerColumnGroup } from "./DatabaseViewerColumnGroup.js";
import type { TmiTableRowCreateConfig } from "./tmiTableRowCreate.types.js";

const DEFAULT_CREATE_STRIP_ARIA_LABEL = "Add row";

export interface DatabaseViewerCreateRowProps<TData extends object> {
  table: TanStackTable<TData>;
  rowCreate: TmiTableRowCreateConfig;
  surfaceMode: DatabaseViewerSurfaceMode;
  tableColumnSizeStyle: CSSProperties;
  headerTableSx: SxProps<Theme>;
}

export function DatabaseViewerCreateRow<TData extends object>({
  table,
  rowCreate,
  surfaceMode,
  tableColumnSizeStyle,
  headerTableSx,
}: DatabaseViewerCreateRowProps<TData>) {
  const { showRollbackToast } = useOptimisticTableFeedback();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const busyRef = useRef(false);
  const skipBlurRef = useRef(false);
  const inputRefs = useRef<
    Record<string, HTMLTextAreaElement | HTMLInputElement | null>
  >({});

  const leafColumns = table.getVisibleLeafColumns();
  const plusColumnId = leafColumns.find((column) =>
    isDatabaseViewerCreateInputColumn(column),
  )?.id;

  const focusColumn = useCallback((columnId: string) => {
    requestAnimationFrame(() => {
      inputRefs.current[columnId]?.focus();
    });
  }, []);

  const runCreates = useCallback(
    async (columnId: string, values: string[], source: "commit" | "paste") => {
      if (busyRef.current || values.length === 0) return;
      busyRef.current = true;
      skipBlurRef.current = true;
      const remaining = [...values];
      try {
        while (remaining.length > 0) {
          const value = remaining[0] ?? "";
          try {
            const id = await rowCreate.onCreate({
              columnId,
              value,
              source,
            });
            if (!String(id).trim()) {
              showRollbackToast();
              break;
            }
            remaining.shift();
          } catch {
            showRollbackToast();
            break;
          }
        }
      } finally {
        busyRef.current = false;
      }
      setDrafts((prev) => ({
        ...prev,
        [columnId]: remaining.length === 0 ? "" : remaining.join("\n"),
      }));
      focusColumn(columnId);
      requestAnimationFrame(() => {
        skipBlurRef.current = false;
      });
    },
    [focusColumn, rowCreate, showRollbackToast],
  );

  const commitColumn = useCallback(
    (columnId: string) => {
      if (skipBlurRef.current) return;
      const raw = drafts[columnId] ?? "";
      if (!raw.trim()) return;
      void runCreates(columnId, [raw], "commit");
    },
    [drafts, runCreates],
  );

  const handlePaste = useCallback(
    (columnId: string, event: ClipboardEvent<HTMLElement>) => {
      const text = event.clipboardData.getData("text");
      if (!text.includes("\n") && !text.includes("\r")) return;
      event.preventDefault();
      const lines = splitCreatePasteLines(text);
      if (lines.length === 0) return;
      void runCreates(columnId, lines, "paste");
    },
    [runCreates],
  );

  const handleKeyDown = useCallback(
    (columnId: string, event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setDrafts((prev) => ({ ...prev, [columnId]: "" }));
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        commitColumn(columnId);
      }
    },
    [commitColumn],
  );

  return (
    <Box
      sx={{
        flexShrink: 0,
        position: "sticky",
        bottom: 0,
        zIndex: 3,
        overflowAnchor: "none",
        pt: `${DATABASE_VIEWER_BODY_ROW_GAP_PX / 2}px`,
        pb: `${DATABASE_VIEWER_BODY_ROW_GAP_PX / 2}px`,
        ...getDatabaseViewerStickyHeaderBgSx(surfaceMode),
      }}
    >
      <Box
        sx={(theme) => ({
          ...tmiPrimaryContainedRowShellSx(theme, {
            heightPx: DATABASE_VIEWER_BODY_ROW_BAR_HEIGHT_PX,
          }),
        })}
      >
        <Table
          size="small"
          sx={headerTableSx}
          style={tableColumnSizeStyle}
          aria-label={rowCreate.ariaLabel ?? DEFAULT_CREATE_STRIP_ARIA_LABEL}
        >
          <DatabaseViewerColumnGroup table={table} />
          <TableBody>
            <TableRow role="row" aria-selected={false} data-tmi-create-row="">
              {leafColumns.map((column) => (
                <CreateCell
                  key={column.id}
                  column={column}
                  drafts={drafts}
                  setDrafts={setDrafts}
                  commitColumn={commitColumn}
                  handleKeyDown={handleKeyDown}
                  handlePaste={handlePaste}
                  inputRefs={inputRefs}
                  showPlus={column.id === plusColumnId}
                />
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

function CreateCell<TData extends object>({
  column,
  drafts,
  setDrafts,
  commitColumn,
  handleKeyDown,
  handlePaste,
  inputRefs,
  showPlus,
}: {
  column: Column<TData, unknown>;
  drafts: Record<string, string>;
  setDrafts: Dispatch<SetStateAction<Record<string, string>>>;
  commitColumn: (columnId: string) => void;
  handleKeyDown: (columnId: string, event: KeyboardEvent<HTMLElement>) => void;
  handlePaste: (columnId: string, event: ClipboardEvent<HTMLElement>) => void;
  inputRefs: {
    current: Record<string, HTMLTextAreaElement | HTMLInputElement | null>;
  };
  showPlus: boolean;
}) {
  const widthCss = getDatabaseViewerColumnWidthCssValue(column.id, () =>
    column.getSize(),
  );
  const skip = !isDatabaseViewerCreateInputColumn(column);
  const label = getDatabaseViewerCreateColumnLabel(column);

  return (
    <TableCell
      padding="none"
      sx={{
        ...getPinnedCellSx(column),
        width: widthCss,
        maxWidth: widthCss,
        py: 0,
        px: 0,
        borderBottom: "none",
        bgcolor: "transparent",
        verticalAlign: "middle",
      }}
    >
      {skip ? null : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            minHeight: DATABASE_VIEWER_BODY_ROW_BAR_HEIGHT_PX,
            width: "100%",
            px: 1,
            gap: 1,
          }}
        >
          {showPlus ? (
            <Add
              fontSize="small"
              data-tmi-create-plus=""
              sx={{ flexShrink: 0, color: "inherit" }}
            />
          ) : null}
          <InputBase
            multiline
            minRows={1}
            maxRows={6}
            inputRef={(el) => {
              inputRefs.current[column.id] = el;
            }}
            value={drafts[column.id] ?? ""}
            onChange={(e) => {
              const next = e.target.value;
              setDrafts((prev) => ({ ...prev, [column.id]: next }));
            }}
            onBlur={() => commitColumn(column.id)}
            onKeyDown={(e) => handleKeyDown(column.id, e)}
            onPaste={(e) => handlePaste(column.id, e)}
            placeholder={label}
            inputProps={{
              "aria-label": label,
              "data-tmi-create-column": column.id,
            }}
            sx={(theme) => ({
              flex: 1,
              minWidth: 0,
              width: "100%",
              fontSize: theme.typography.body2.fontSize,
              fontWeight: theme.typography.body2.fontWeight,
              color: theme.palette.common.white,
              "& textarea": {
                color: theme.palette.common.white,
                "&::placeholder": {
                  color: alpha(theme.palette.common.white, 0.65),
                  opacity: 1,
                },
              },
            })}
          />
        </Box>
      )}
    </TableCell>
  );
}
