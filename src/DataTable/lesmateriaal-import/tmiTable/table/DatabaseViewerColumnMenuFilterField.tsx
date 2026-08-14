import { Box, TextField } from "@mui/material";
import type { RefObject } from "react";
import type { Table as TanStackTableType } from "@tanstack/react-table";
import type { DatabaseViewerColumnMenuState } from "./databaseViewerColumnMenuTypes.js";

interface DatabaseViewerColumnMenuFilterFieldProps<TData extends object> {
  table: TanStackTableType<TData>;
  menuState: DatabaseViewerColumnMenuState | null;
  filterInputRef: RefObject<HTMLInputElement | null>;
}

export function DatabaseViewerColumnMenuFilterField<TData extends object>({
  table,
  menuState,
  filterInputRef,
}: DatabaseViewerColumnMenuFilterFieldProps<TData>) {
  return (
    <Box sx={{ px: 2, py: 1 }}>
      <TextField
        key={menuState?.columnId ?? "filter-closed"}
        size="small"
        fullWidth
        label="Filter"
        inputRef={filterInputRef}
        defaultValue={
          menuState
            ? String(
                table.getColumn(menuState.columnId)?.getFilterValue() ?? "",
              )
            : ""
        }
        onBlur={(event) => {
          if (!menuState) return;
          const value = event.target.value?.trim() ?? "";
          const targetColumn = table.getColumn(menuState.columnId);
          targetColumn?.setFilterValue(value.length > 0 ? value : undefined);
        }}
        onKeyDown={(event) => {
          event.stopPropagation();
          if (event.key === "Enter") {
            (event.target as HTMLInputElement).blur();
          }
        }}
      />
    </Box>
  );
}
