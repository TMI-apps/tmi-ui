export { createAirtableAttachmentThumbnailColumn } from "./lesmateriaal-import/tmiTable/createAirtableAttachmentThumbnailColumn.js";

export { TableRowActionButton } from "./lesmateriaal-import/satellites/TableRowActionButton.js";
export type { TableRowActionButtonProps } from "./lesmateriaal-import/satellites/TableRowActionButton.js";

export {
  TableRowThumbnailPlaceholder,
  TableRowThumbnailShell,
} from "./lesmateriaal-import/satellites/TableRowThumbnailShell.js";
export { TABLE_ROW_THUMB_COLUMN_PX } from "./lesmateriaal-import/satellites/tableRowThumbConstants.js";

export { AirtableAttachmentThumbnailCell } from "./lesmateriaal-import/satellites/AirtableAttachmentThumbnailCell.js";
export type { AirtableAttachmentThumbnailCellProps } from "./lesmateriaal-import/satellites/AirtableAttachmentThumbnailCell.js";

export {
  DataTableTruncatedOverflow,
  DataTableTruncatedText,
} from "./lesmateriaal-import/satellites/DataTableTruncatedText.js";
export type {
  DataTableTruncatedOverflowProps,
  DataTableTruncatedTextProps,
} from "./lesmateriaal-import/satellites/DataTableTruncatedText.js";

export { DATA_TABLE_TOOLTIP_PROPS } from "./lesmateriaal-import/satellites/dataTableTooltipProps.js";

export type { TMITableColumnMeta } from "./lesmateriaal-import/shared-types/tmiTableMeta.types.js";
export type {
  TMITableDebugConfig,
  TMITableSelectionConfig,
  TMITableTreeConfig,
} from "./lesmateriaal-import/shared-types/tmiTableConfig.types.js";
export type {
  DatabaseViewerRowDropZone,
  DatabaseViewerRowReorderConfig,
  DatabaseViewerRowReorderEndMeta,
  DatabaseViewerRowReorderPointerSample,
} from "./lesmateriaal-import/shared-types/databaseViewerRowReorder.types.js";

export { createTmiTableTheme } from "./lesmateriaal-import/theme/createTmiTableTheme.js";
export { workspaceDetailDrawerModalZ } from "./lesmateriaal-import/shared-theme/workspaceDetailDrawerZIndex.js";
export {
  getTableInteractionSkin,
  type TableInteractionSkin,
  type TableInteractionSkinPreset,
} from "./lesmateriaal-import/shared-theme/tableInteractionSkin.js";

export { TMITableWorkspace } from "./lesmateriaal-import/tmiTable/TMITableWorkspace.js";
export type { TMITableWorkspaceProps } from "./lesmateriaal-import/tmiTable/TMITableWorkspace.js";
export { TMITABLE_FILTER_PROMPT_DEFAULT_CUE } from "./lesmateriaal-import/tmiTable/tmiTableFilterPromptConstants.js";

export { RecordWorkspaceShell } from "./lesmateriaal-import/tmiTable/RecordWorkspaceShell.js";
export type { RecordWorkspaceShellProps } from "./lesmateriaal-import/tmiTable/RecordWorkspaceShell.js";

export {
  useDatabaseViewerMaxHeight,
  useDatabaseViewerMaxHeight as useTMITableMaxHeight,
} from "./lesmateriaal-import/tmiTable/hooks/useDatabaseViewerMaxHeight.js";
export { useDatabaseTableDetailWorkspaceHeights } from "./lesmateriaal-import/tmiTable/hooks/useDatabaseTableDetailWorkspaceHeights.js";
export { useDatabaseViewerExpandedState } from "./lesmateriaal-import/tmiTable/hooks/useDatabaseViewerExpandedState.js";
export type { UseDatabaseViewerExpandedStateOptions } from "./lesmateriaal-import/tmiTable/hooks/useDatabaseViewerExpandedState.js";

export {
  DatabaseTableDetailWorkspaceLayoutContext,
  DatabaseTableDetailWorkspaceLayoutProvider,
  useDatabaseTableDetailWorkspaceLayout,
} from "./lesmateriaal-import/tmiTable/context/DatabaseTableDetailWorkspaceLayoutContext.js";
export type { DatabaseTableDetailWorkspaceLayoutValue } from "./lesmateriaal-import/tmiTable/context/DatabaseTableDetailWorkspaceLayoutContext.js";

export {
  WorkspaceDetailFullscreenProvider,
  useWorkspaceDetailFullscreen,
} from "./lesmateriaal-import/tmiTable/context/WorkspaceDetailFullscreenContext.js";
export type { WorkspaceDetailFullscreenValue } from "./lesmateriaal-import/tmiTable/context/WorkspaceDetailFullscreenContext.js";

export {
  DetailShellBackdropDismissRegistrar,
  useRegisterDetailShellBackdropDismiss,
} from "./lesmateriaal-import/tmiTable/context/DetailShellBackdropDismissContext.js";

export { TMITableDetailEditPanel } from "./lesmateriaal-import/tmiTable/TMITableDetailEditPanel.js";
export type { TMITableDetailEditPanelProps } from "./lesmateriaal-import/tmiTable/TMITableDetailEditPanel.js";

export { DetailPanelHeroHeader } from "./lesmateriaal-import/tmiTable/DetailPanelHeroHeader.js";
export type {
  DetailPanelHeroHeaderProps,
  DetailHeroCoverMeta,
  DetailPanelHeroCoverEdit,
} from "./lesmateriaal-import/tmiTable/DetailPanelHeroHeader.js";

export { DetailPanelHeroStatsStrip } from "./lesmateriaal-import/tmiTable/DetailPanelHeroStatsStrip.js";
export type { DetailPanelHeroStatItem } from "./lesmateriaal-import/tmiTable/DetailPanelHeroStatsStrip.js";

export { DetailPanelSectionHeading } from "./lesmateriaal-import/tmiTable/DetailPanelSectionHeading.js";

export {
  DETAIL_HERO_MIN_HEIGHT_PX,
  DETAIL_HERO_SUBTITLE_LINE_CLAMP,
  DETAIL_HERO_TITLE_LINE_CLAMP,
  detailFieldLabelSx,
  detailHeroClampSx,
  detailHeroOverlayIconButtonSx,
} from "./lesmateriaal-import/tmiTable/detailHeroTypography.js";

export { UnsavedChangesDialog } from "./lesmateriaal-import/tmiTable/UnsavedChangesDialog.js";
export type {
  UnsavedChangesDialogProps,
  UnsavedChangesExitNavigate,
  UnsavedChangesDialogLocaleText,
} from "./lesmateriaal-import/tmiTable/UnsavedChangesDialog.js";

export {
  OptimisticTableFeedbackProvider,
  useOptimisticTableFeedback,
  useOptimisticTableFeedbackHasProvider,
} from "./lesmateriaal-import/tmiTable/feedback/OptimisticTableFeedbackContext.js";
export type { TmiTableLocaleText } from "./lesmateriaal-import/tmiTable/feedback/tmiTableLocaleText.js";
export type { OptimisticTableFeedbackControls } from "./lesmateriaal-import/shared-types/optimisticTableFeedback.types.js";
