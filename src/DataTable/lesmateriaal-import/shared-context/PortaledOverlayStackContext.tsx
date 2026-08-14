import { useTheme } from "@mui/material/styles";
import { createContext, useContext, type ReactNode } from "react";
import { workspaceDetailDrawerModalZ } from "../shared-theme/workspaceDetailDrawerZIndex.js";

/**
 * Z-index of the host modal layer for workspace detail drawers (see
 * `workspaceDetailDrawerModalZ`). Descendants that portal UI to `document.body`
 * should stack above this value.
 */
const PortaledOverlayStackContext = createContext<number | null>(null);

export function PortaledOverlayStackProvider({
  hostModalZ,
  children,
}: {
  /** Same value as the drawer `ModalProps.sx.zIndex` for this shell. */
  hostModalZ: number;
  children: ReactNode;
}) {
  return (
    <PortaledOverlayStackContext.Provider value={hostModalZ}>
      {children}
    </PortaledOverlayStackContext.Provider>
  );
}

/**
 * Returns the z-index portaled Popper/listbox content should use when inside a
 * workspace detail drawer; outside a provider, returns `undefined` (use MUI
 * defaults).
 */
export function usePortaledOverlayPopperZIndex(): number | undefined {
  const hostModalZ = useContext(PortaledOverlayStackContext);
  if (hostModalZ === null) return undefined;
  return hostModalZ + 1;
}

/**
 * z-index for portaled **Modal-tier** UI (`Dialog`, column `Menu`, scope `Popover`)
 * that must sit above workspace detail drawers (`workspaceDetailDrawerModalZ`).
 * Prefer {@link usePortaledOverlayPopperZIndex} for optional elevation (e.g. autocomplete listboxes).
 */
export function useWorkspaceDrawerOverlayZIndex(): number {
  const theme = useTheme();
  const hostModalZ = useContext(PortaledOverlayStackContext);
  return hostModalZ !== null
    ? hostModalZ + 1
    : workspaceDetailDrawerModalZ(theme) + 1;
}
