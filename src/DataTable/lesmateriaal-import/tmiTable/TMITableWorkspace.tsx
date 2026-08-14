import type { DrawerProps } from "@mui/material/Drawer";
import { Box, Drawer } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme, type Theme } from "@mui/material/styles";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PortaledOverlayStackProvider } from "../shared-context/PortaledOverlayStackContext.js";
import { workspaceDetailDrawerModalZ } from "../shared-theme/workspaceDetailDrawerZIndex.js";
import { DetailShellBackdropDismissRegistrar } from "./context/DetailShellBackdropDismissContext.js";
import { DatabaseTableDetailWorkspaceLayoutProvider } from "./context/DatabaseTableDetailWorkspaceLayoutContext.js";
import {
  WorkspaceDetailFullscreenProvider,
  type WorkspaceDetailFullscreenValue,
} from "./context/WorkspaceDetailFullscreenContext.js";
import { useDatabaseTableDetailWorkspaceHeights } from "./hooks/useDatabaseTableDetailWorkspaceHeights.js";
import { TMITableWorkspacePrimaryColumn } from "./TMITableWorkspaceFilterPromptLayout.js";

const detailPaneBorderSx = {
  border: 1,
  borderRadius: 2,
  bgcolor: "background.paper",
  borderColor: (theme: Theme) => theme.palette.divider,
} as const;

export type TMITableWorkspaceProps = {
  /** e.g. error alerts that belong inside the flex workspace */
  workspaceTop?: ReactNode;
  /** Search, filters, actions — does not scroll with the table */
  leftHeader: ReactNode;
  /** Table surface — grows to fill remaining height on `lg+` when viewport fill is active */
  table: ReactNode;
  detailOpen: boolean;
  /** Full detail column including hero header and body (borders are on this wrapper) */
  detailPanel: ReactNode;
  detailWidthPx?: number;
  /** Set false only if the page is not inside a viewport-height flex ancestor */
  enableViewportFill?: boolean;
  /** When true, centers {@link leftHeader} with a cue and hides {@link table} until filters activate. */
  filterPromptActive?: boolean;
  /** Optional cue above centered header; uses shared Dutch default when omitted. */
  filterPromptCue?: ReactNode;
};

function useTMITableWorkspaceChrome(options: {
  detailOpen: boolean;
  detailPanel: ReactNode;
  enableViewportFill: boolean;
}) {
  const { detailOpen, detailPanel, enableViewportFill } = options;
  const theme = useTheme();
  const detailInDrawer = useMediaQuery(theme.breakpoints.down("lg"));
  const backdropDismissRef = useRef<(() => void) | null>(null);
  const runDrawerDismiss = useCallback((_event: object, reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      backdropDismissRef.current?.();
    }
  }, []);

  const {
    panelHeightPx,
    tableMaxHeightPx: hookTableMaxHeight,
    fillViewport: hookFillViewport,
  } = useDatabaseTableDetailWorkspaceHeights();

  const tableMaxHeightPx = detailInDrawer ? "100%" : hookTableMaxHeight;
  const layoutFillViewportFlag = detailInDrawer ? true : hookFillViewport;
  const effectiveFill = enableViewportFill && layoutFillViewportFlag;

  const layoutValue = useMemo(
    () => ({ tableMaxHeightPx, fillViewport: layoutFillViewportFlag }),
    [tableMaxHeightPx, layoutFillViewportFlag],
  );

  const detailChrome = detailOpen ? (
    <DetailShellBackdropDismissRegistrar handlerRef={backdropDismissRef}>
      {detailPanel}
    </DetailShellBackdropDismissRegistrar>
  ) : null;

  const showInlineDetail = Boolean(detailOpen && !detailInDrawer);

  return {
    detailInDrawer,
    runDrawerDismiss,
    layoutValue,
    effectiveFill,
    detailChrome,
    showInlineDetail,
    panelHeightPx,
  };
}

type TMITableWorkspaceInlineDetailColumnProps = {
  detailChrome: ReactNode;
  detailWidthPx: number;
  panelHeightPx: number | string;
  expanded: boolean;
};

function TMITableWorkspaceInlineDetailColumn({
  detailChrome,
  detailWidthPx,
  panelHeightPx,
  expanded,
}: TMITableWorkspaceInlineDetailColumnProps) {
  const widthPx = `${detailWidthPx}px`;
  return (
    <Box
      data-testid="tmi-workspace-detail-column"
      data-detail-fullscreen={expanded ? "true" : "false"}
      sx={{
        ...(expanded
          ? {
              flex: 1,
              minWidth: 0,
              width: "100%",
              maxWidth: "100%",
            }
          : {
              width: widthPx,
              maxWidth: "100%",
              flexShrink: 0,
            }),
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: panelHeightPx,
        ...detailPaneBorderSx,
      }}
    >
      {detailChrome}
    </Box>
  );
}

type TMITableWorkspaceDetailDrawerShellProps = {
  detailChrome: ReactNode;
  detailWidthPx: number;
  onClose: DrawerProps["onClose"];
};

function TMITableWorkspaceDetailDrawerShell({
  detailChrome,
  detailWidthPx,
  onClose,
}: TMITableWorkspaceDetailDrawerShellProps) {
  const themeForDrawerShell = useTheme();
  const widthPx = `${detailWidthPx}px`;
  return (
    <Drawer
      anchor="right"
      open
      onClose={onClose}
      ModalProps={{
        sx: { zIndex: workspaceDetailDrawerModalZ(themeForDrawerShell) },
      }}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: widthPx },
            maxWidth: "100%",
            boxSizing: "border-box",
            borderLeft: 1,
            borderLeftColor: (theme: Theme) => theme.palette.divider,
          },
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        {detailChrome}
      </Box>
    </Drawer>
  );
}

type TMITableWorkspaceSplitRowProps = {
  effectiveFill: boolean;
  leftHeader: ReactNode;
  table: ReactNode;
  detailSibling: ReactNode | null;
  filterPromptActive: boolean;
  filterPromptCue?: ReactNode;
  primaryColumnHidden: boolean;
};

function TMITableWorkspaceSplitRow({
  effectiveFill,
  leftHeader,
  table,
  detailSibling,
  filterPromptActive,
  filterPromptCue,
  primaryColumnHidden,
}: TMITableWorkspaceSplitRowProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const frozenPrimarySizeRef = useRef<{ width: number; height: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    const el = shellRef.current;
    if (!el || primaryColumnHidden) return;
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    if (width > 0 && height > 0) {
      frozenPrimarySizeRef.current = { width, height };
    }
  });

  const frozenPrimarySize = primaryColumnHidden
    ? frozenPrimarySizeRef.current
    : null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        gap: primaryColumnHidden ? 0 : 2,
        ...(effectiveFill && {
          flex: 1,
          minHeight: 0,
        }),
      }}
    >
      <Box
        ref={shellRef}
        aria-hidden={primaryColumnHidden}
        data-testid="tmi-workspace-primary-column-shell"
        data-primary-hidden={primaryColumnHidden ? "true" : "false"}
        sx={{
          flex: primaryColumnHidden ? "0 0 0px" : undefined,
          width: primaryColumnHidden ? 0 : "100%",
          minWidth: 0,
          overflow: "hidden",
          position: "relative",
          ...(!primaryColumnHidden && {
            display: "flex",
            flexDirection: "column",
            ...(effectiveFill
              ? { flex: 1, minHeight: 0 }
              : { flex: { xs: "none", lg: "1 1 auto" } }),
          }),
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            ...(frozenPrimarySize
              ? {
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: frozenPrimarySize.width,
                  height: frozenPrimarySize.height,
                  visibility: "hidden",
                  pointerEvents: "none",
                }
              : {
                  minWidth: 0,
                  width: "100%",
                  ...(effectiveFill
                    ? { flex: 1, minHeight: 0 }
                    : { flex: { xs: "none", lg: "1 1 auto" } }),
                }),
          }}
        >
          <TMITableWorkspacePrimaryColumn
            effectiveFill={effectiveFill}
            leftHeader={leftHeader}
            table={table}
            filterPromptActive={filterPromptActive}
            filterPromptCue={filterPromptCue}
          />
        </Box>
      </Box>
      {detailSibling}
    </Box>
  );
}

type TMITableWorkspacePortaledOverlayGateProps = {
  enabled: boolean;
  hostModalZ: number;
  children: ReactNode;
};

function TMITableWorkspacePortaledOverlayGate({
  enabled,
  hostModalZ,
  children,
}: TMITableWorkspacePortaledOverlayGateProps) {
  if (!enabled) return children;
  return (
    <PortaledOverlayStackProvider hostModalZ={hostModalZ}>
      {children}
    </PortaledOverlayStackProvider>
  );
}

type TMITableWorkspaceChromeBodyProps = {
  effectiveFill: boolean;
  workspaceTop?: ReactNode;
  leftHeader: ReactNode;
  table: ReactNode;
  detailSibling: ReactNode | null;
  drawerOpen: boolean;
  detailChrome: ReactNode | null;
  detailWidthPx: number;
  onDrawerClose: DrawerProps["onClose"];
  filterPromptActive: boolean;
  filterPromptCue?: ReactNode;
  primaryColumnHidden: boolean;
};

function TMITableWorkspaceChromeBody({
  effectiveFill,
  workspaceTop,
  leftHeader,
  table,
  detailSibling,
  drawerOpen,
  detailChrome,
  detailWidthPx,
  onDrawerClose,
  filterPromptActive,
  filterPromptCue,
  primaryColumnHidden,
}: TMITableWorkspaceChromeBodyProps) {
  return (
    <Box
      sx={{
        ...(effectiveFill && {
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }),
      }}
    >
      {workspaceTop}
      <TMITableWorkspaceSplitRow
        effectiveFill={effectiveFill}
        leftHeader={leftHeader}
        table={table}
        detailSibling={detailSibling}
        filterPromptActive={filterPromptActive}
        filterPromptCue={filterPromptCue}
        primaryColumnHidden={primaryColumnHidden}
      />
      {drawerOpen && detailChrome ? (
        <TMITableWorkspaceDetailDrawerShell
          detailChrome={detailChrome}
          detailWidthPx={detailWidthPx}
          onClose={onDrawerClose}
        />
      ) : null}
    </Box>
  );
}

/**
 * Shared two-column workspace (table + optional detail pane).
 * At `lg+`, detail is shown beside the table; below `lg`, detail opens in a right `Drawer`
 * with the table column using full-flex height like the wide layout.
 */
export function TMITableWorkspace({
  workspaceTop,
  leftHeader,
  table,
  detailOpen,
  detailPanel,
  detailWidthPx = 520,
  enableViewportFill = true,
  filterPromptActive = false,
  filterPromptCue,
}: TMITableWorkspaceProps) {
  const theme = useTheme();
  const chrome = useTMITableWorkspaceChrome({
    detailOpen,
    detailPanel,
    enableViewportFill,
  });

  const [detailFullscreen, setDetailFullscreen] = useState(false);

  useEffect(() => {
    if (!detailOpen) {
      setDetailFullscreen(false);
    }
  }, [detailOpen]);

  const fullscreenAvailable = Boolean(chrome.showInlineDetail && detailOpen);
  const primaryColumnHidden = fullscreenAvailable && detailFullscreen;

  const toggleDetailFullscreen = useCallback(() => {
    setDetailFullscreen((prev) => !prev);
  }, []);

  const fullscreenValue = useMemo(
    (): WorkspaceDetailFullscreenValue => ({
      active: primaryColumnHidden,
      toggle: toggleDetailFullscreen,
      available: fullscreenAvailable,
    }),
    [fullscreenAvailable, primaryColumnHidden, toggleDetailFullscreen],
  );

  const detailSibling =
    chrome.showInlineDetail && chrome.detailChrome ? (
      <TMITableWorkspaceInlineDetailColumn
        detailChrome={chrome.detailChrome}
        detailWidthPx={detailWidthPx}
        panelHeightPx={chrome.panelHeightPx}
        expanded={primaryColumnHidden}
      />
    ) : null;

  const drawerOpen = Boolean(
    detailOpen && chrome.detailInDrawer && chrome.detailChrome,
  );

  return (
    <DatabaseTableDetailWorkspaceLayoutProvider value={chrome.layoutValue}>
      <WorkspaceDetailFullscreenProvider value={fullscreenValue}>
        <TMITableWorkspacePortaledOverlayGate
          enabled={drawerOpen}
          hostModalZ={workspaceDetailDrawerModalZ(theme)}
        >
          <TMITableWorkspaceChromeBody
            effectiveFill={chrome.effectiveFill}
            workspaceTop={workspaceTop}
            leftHeader={leftHeader}
            table={table}
            detailSibling={detailSibling}
            drawerOpen={drawerOpen}
            detailChrome={chrome.detailChrome}
            detailWidthPx={detailWidthPx}
            onDrawerClose={chrome.runDrawerDismiss}
            filterPromptActive={filterPromptActive}
            filterPromptCue={filterPromptCue}
            primaryColumnHidden={primaryColumnHidden}
          />
        </TMITableWorkspacePortaledOverlayGate>
      </WorkspaceDetailFullscreenProvider>
    </DatabaseTableDetailWorkspaceLayoutProvider>
  );
}

/** @deprecated Prefer {@link TMITableWorkspace} */
export const DatabaseTableDetailWorkspace = TMITableWorkspace;

/** @deprecated Prefer {@link TMITableWorkspaceProps} */
export type DatabaseTableDetailWorkspaceProps = TMITableWorkspaceProps;
