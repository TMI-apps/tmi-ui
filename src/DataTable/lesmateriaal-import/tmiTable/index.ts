/** TMI-table: reusable table + workspace + detail/edit + edit session boundary. */

export { TMITable, staticClientVirtualizedList } from "./TmiTable.js";
export type {
  TmiTableProps,
  TmiTableProps as TMITableProps,
  DatabaseViewerRowFileDrop,
  DatabaseViewerRowReorderConfig,
  TMITableServerInfinite,
} from "./TmiTable.js";

export { createAirtableAttachmentThumbnailColumn } from "./createAirtableAttachmentThumbnailColumn.js";

export {
  DatabaseViewer,
  databaseViewerTableHeaderLabelCellSx,
  getDatabaseViewerBodyTableSx,
  getDatabaseViewerHeaderTableSx,
  getDatabaseViewerScrollContainerSx,
  getDatabaseViewerStickyHeaderBgSx,
} from "./table/index.js";
export type { DatabaseViewerProps } from "./table/DatabaseViewer.js";
export type { TMITableMaxHeightProp } from "./hooks/resolveTMITableMaxHeight.js";
export type { DatabaseViewerSurfaceMode } from "./table/databaseViewerConstants.js";
export type { DatabaseViewerColumnMenuState } from "./table/DatabaseViewerColumnMenu.js";
export { HEADER_LONG_PRESS_MS } from "./table/databaseViewerConstants.js";

export type {
  TMITableTreeConfig,
  TMITableSelectionConfig,
  TMITableDebugConfig,
} from "../shared-types/tmiTableConfig.types.js";

export { TMITableWorkspace } from "./TMITableWorkspace.js";
export type { TMITableWorkspaceProps } from "./TMITableWorkspace.js";
export { TMITABLE_FILTER_PROMPT_DEFAULT_CUE } from "./tmiTableFilterPromptConstants.js";

export { RecordWorkspaceShell } from "./RecordWorkspaceShell.js";
export type { RecordWorkspaceShellProps } from "./RecordWorkspaceShell.js";

export { TMITableDetailEditPanel } from "./TMITableDetailEditPanel.js";
export type { TMITableDetailEditPanelProps } from "./TMITableDetailEditPanel.js";

export { DetailPanelHeroHeader } from "./DetailPanelHeroHeader.js";
export type {
  DetailPanelHeroHeaderProps,
  DetailHeroCoverMeta,
  DetailPanelHeroCoverEdit,
} from "./DetailPanelHeroHeader.js";

export { DetailPanelHeroStatsStrip } from "./DetailPanelHeroStatsStrip.js";
export type { DetailPanelHeroStatItem } from "./DetailPanelHeroStatsStrip.js";

export {
  DETAIL_HERO_MIN_HEIGHT_PX,
  DETAIL_HERO_SUBTITLE_LINE_CLAMP,
  DETAIL_HERO_TITLE_LINE_CLAMP,
  detailFieldLabelSx,
  detailHeroClampSx,
  detailHeroOverlayIconButtonSx,
} from "./detailHeroTypography.js";

export { DetailPanelSectionHeading } from "./DetailPanelSectionHeading.js";

export { UnsavedChangesDialog } from "./UnsavedChangesDialog.js";
export type {
  UnsavedChangesDialogProps,
  UnsavedChangesExitNavigate,
  UnsavedChangesDialogLocaleText,
} from "./UnsavedChangesDialog.js";

export type {
  RecordExitConfirmState,
  RecordExitPendingAction,
} from "../shared-types/recordEditSession.types.js";

export type {
  DatabaseViewerScopeSummary,
  DatabaseViewerScopeSummaryItem,
  TMITableScopeSummary,
  TMITableScopeSummaryItem,
  TMITableColumnMeta,
} from "../shared-types/tmiTableMeta.types.js";

export {
  useDatabaseViewerMaxHeight,
  useDatabaseViewerMaxHeight as useTMITableMaxHeight,
} from "./hooks/useDatabaseViewerMaxHeight.js";
export { useDatabaseTableDetailWorkspaceHeights } from "./hooks/useDatabaseTableDetailWorkspaceHeights.js";
export { useDatabaseViewerExpandedState } from "./hooks/useDatabaseViewerExpandedState.js";
export type { UseDatabaseViewerExpandedStateOptions } from "./hooks/useDatabaseViewerExpandedState.js";

export {
  DatabaseTableDetailWorkspaceLayoutContext,
  DatabaseTableDetailWorkspaceLayoutProvider,
  type DatabaseTableDetailWorkspaceLayoutValue,
  useDatabaseTableDetailWorkspaceLayout,
} from "./context/DatabaseTableDetailWorkspaceLayoutContext.js";

export {
  WorkspaceDetailFullscreenProvider,
  useWorkspaceDetailFullscreen,
  type WorkspaceDetailFullscreenValue,
} from "./context/WorkspaceDetailFullscreenContext.js";

export {
  TmiRowReorderDndProvider,
  type TmiRowReorderDndProviderProps,
} from "./context/TmiRowReorderDndProvider.js";

export {
  DetailShellBackdropDismissRegistrar,
  useRegisterDetailShellBackdropDismiss,
} from "./context/DetailShellBackdropDismissContext.js";

export type { OptimisticTableFeedbackControls } from "../shared-types/optimisticTableFeedback.types.js";
export {
  OptimisticTableFeedbackProvider,
  useOptimisticTableFeedback,
  useOptimisticTableFeedbackHasProvider,
} from "./feedback/OptimisticTableFeedbackContext.js";
export type { TmiTableLocaleText } from "./feedback/tmiTableLocaleText.js";
