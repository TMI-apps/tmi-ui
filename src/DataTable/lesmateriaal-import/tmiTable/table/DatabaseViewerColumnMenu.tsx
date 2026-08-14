import { Box, Divider, Menu, MenuItem, Typography } from "@mui/material";
import type { Dispatch, RefObject, SetStateAction } from "react";
import type {
  SortingState,
  Table as TanStackTableType,
} from "@tanstack/react-table";
import { useWorkspaceDrawerOverlayZIndex } from "../../shared-context/PortaledOverlayStackContext.js";
import type { DatabaseViewerColumnMenuState } from "./databaseViewerColumnMenuTypes.js";
import { DatabaseViewerColumnMenuFilterField } from "./DatabaseViewerColumnMenuFilterField.js";
import { DatabaseViewerColumnMenuPinRows } from "./DatabaseViewerColumnMenuPinRows.js";

export type { DatabaseViewerColumnMenuState } from "./databaseViewerColumnMenuTypes.js";

interface DatabaseViewerColumnMenuProps<TData extends object> {
  table: TanStackTableType<TData>;
  menuState: DatabaseViewerColumnMenuState | null;
  setMenuState: Dispatch<SetStateAction<DatabaseViewerColumnMenuState | null>>;
  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  filterInputRef: RefObject<HTMLInputElement | null>;
}

export function DatabaseViewerColumnMenu<TData extends object>({
  table,
  menuState,
  setMenuState,
  sorting,
  setSorting,
  filterInputRef,
}: DatabaseViewerColumnMenuProps<TData>) {
  const overlayZ = useWorkspaceDrawerOverlayZIndex();
  const closeMenu = () => setMenuState(null);
  return (
    <Menu
      open={Boolean(menuState)}
      onClose={closeMenu}
      anchorReference="anchorPosition"
      anchorPosition={menuState?.anchorPosition}
      slotProps={{
        root: { sx: { zIndex: overlayZ } },
      }}
    >
      <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
        <Typography variant="subtitle2">
          Kolom: {menuState ? table.getColumn(menuState.columnId)?.id : ""}
        </Typography>
      </Box>
      <MenuItem
        onClick={() => {
          if (!menuState) return;
          setSorting((previous) =>
            previous.filter((item) => item.id !== menuState.columnId),
          );
          closeMenu();
        }}
        disabled={
          !menuState || !sorting.some((item) => item.id === menuState.columnId)
        }
      >
        Sortering wissen
      </MenuItem>
      <Divider />
      <DatabaseViewerColumnMenuFilterField
        table={table}
        menuState={menuState}
        filterInputRef={filterInputRef}
      />
      <MenuItem
        onClick={() => {
          if (!menuState) return;
          table.getColumn(menuState.columnId)?.setFilterValue(undefined);
          if (filterInputRef.current) filterInputRef.current.value = "";
          setMenuState((previous) =>
            previous ? { ...previous, filterValue: "" } : previous,
          );
        }}
      >
        Filter wissen
      </MenuItem>
      <Divider />
      <MenuItem
        onClick={() => {
          if (!menuState) return;
          const targetColumn = table.getColumn(menuState.columnId);
          if (targetColumn?.getCanHide()) {
            targetColumn.toggleVisibility(false);
          }
          closeMenu();
        }}
        disabled={
          !menuState || !table.getColumn(menuState.columnId)?.getCanHide()
        }
      >
        Kolom verbergen
      </MenuItem>
      <MenuItem
        onClick={() => {
          table
            .getAllLeafColumns()
            .forEach((column) => column.toggleVisibility(true));
          closeMenu();
        }}
      >
        Alle kolommen tonen
      </MenuItem>
      <Divider />
      <DatabaseViewerColumnMenuPinRows
        table={table}
        columnId={menuState?.columnId}
        onClose={closeMenu}
      />
    </Menu>
  );
}
