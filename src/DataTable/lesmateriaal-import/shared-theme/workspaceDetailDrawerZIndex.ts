import type { Theme } from "@mui/material/styles";

/**
 * Z-index for full-height **workspace record-detail** `Drawer`s (table routes, Start home drawer).
 *
 * Keeps overlays **above** the mobile shell fixed `AppBar` at `theme.zIndex.modal + 2`
 * (`src/components/common/AppShell.tsx`).
 * Use the same number as `hostModalZ` on `PortaledOverlayStackProvider`
 * (`src/shared/context/PortaledOverlayStackContext.tsx`) inside the drawer so portaled Popper
 * content (e.g. `AutocompleteSelectField`) can stack above the modal.
 */
export function workspaceDetailDrawerModalZ(theme: Theme): number {
  return theme.zIndex.modal + 3;
}
