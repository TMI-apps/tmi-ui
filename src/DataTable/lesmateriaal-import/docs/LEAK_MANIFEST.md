# LEAK_MANIFEST — `tmiTable` → app imports

**Generated:** Phase 0 (`feature/tmitable-tmi-ui-extract-phase1`, 2026-08-14)  
**Scope:** Every `@/` import under `src/components/common/tmiTable/**` plus cross-cutting consumers.

Resolution codes: **inject** (Phase 1 boundary) · **move** (TMI-ui Phase 2–4) · **stay** (app adapter forever) · **peer** (documented peer/context rule)

---

## Phase 1 resolved

| File | Import | Resolution | Status |
|------|--------|------------|--------|
| `table/DatabaseViewerBody.tsx` | `LesmateriaalGridDndContext` | **inject** → `TmiRowReorderDndProvider` | Done |
| `table/DatabaseViewer.tsx` | `tableLoadDebug` | **inject** → `debug.onTableLoadSettled` via `TMITable` | Done |
| `index.ts` | `useRecordEditSession` re-export | **stay** app-only | Removed from barrel |
| `feedback/OptimisticTableFeedbackContext.tsx` | rollback toast copy | **inject** → `localeText` | Done |

---

## Grid body

| File | Import | Resolution |
|------|--------|------------|
| `table/DatabaseViewerBody.tsx` | `@/shared/theme/tableInteractionSkin` | **move** → `createTmiTableTheme` |
| `table/DatabaseViewerBody.tsx` | `@/shared/theme/interactiveSurfaces` | **move** theme |
| `table/DatabaseViewerBody.tsx` | `@/shared/types/databaseViewerRowReorder.types` | **move** Phase 2 |
| `table/DatabaseViewer.tsx` | `@/shared/types/tmiTableMeta.types` | **move** Phase 2 |
| `table/DatabaseViewer.tsx` | `@/shared/theme/tableInteractionSkin` | **move** theme |
| `table/DatabaseViewer.tsx` | `@/shared/types/databaseViewerRowReorder.types` | **move** Phase 2 |
| `table/DatabaseViewer.tsx` | `@/shared/types/tmiTableConfig.types` | **move** Phase 2 |
| `table/useDatabaseViewerBodyRowInteractions.ts` | `@/shared/utils/fileDropUtils` | **move** Phase 4 or inject |
| `table/DatabaseViewerDataRow.tsx` | `@/shared/theme/tableInteractionSkin`, `databaseViewerRowReorderZone` | **move** |
| `table/DatabaseViewerTreeCellContent.tsx` | `TableRowActionButton`, `dataTableTooltipProps` | **move** satellites Phase 2 |
| `table/DatabaseViewerColumnMenu.tsx` | `PortaledOverlayStackContext` | **peer** Decision #2 |
| `table/DatabaseViewerScopeSummaryPopover.tsx` | `PortaledOverlayStackContext`, `tmiTableMeta.types` | **peer** + **move** |
| `table/*` (many) | `@/shared/types/tmiTableMeta.types` | **move** Phase 2 |
| `table/*` (many) | `@/shared/theme/*` | **move** via `createTmiTableTheme` |

---

## Workspace + detail shell

| File | Import | Resolution |
|------|--------|------------|
| `TMITableWorkspace.tsx` | `PortaledOverlayStackProvider` | **peer** Decision #2 |
| `TMITableWorkspace.tsx` | `workspaceDetailDrawerZIndex` | **move** theme Phase 3 |
| `UnsavedChangesDialog.tsx` | `PortaledOverlayStackContext`, `recordEditSession.types` | **peer** + types co-move |
| `DetailPanelHeroHeader.tsx` | `coverImageValidation`, `defaultTheme`, `detailPanelHeroTheme`, `detailPanelHero.types` | **inject** / **move** hero theme |
| `DetailPanelHeroStatsStrip.tsx` | `detailPanelHeroTheme` | **move** |
| `detailHeroTypography.ts` | `detailPanelMetaTokens` | **move** |

---

## Optimistic feedback

| File | Import | Resolution |
|------|--------|------------|
| `feedback/OptimisticTableFeedbackContext.tsx` | `tableFeedbackRollbackMessage` | **inject** `localeText` (done) |
| `feedback/OptimisticTableFeedbackContext.tsx` | `optimisticTableFeedback.types` | **move** Phase 3 |
| App feature services | `tableFeedbackQuerySnapshotRestore`, `tableFeedbackToolbarVisibilityPatch` | **stay** app adapters |

---

## Satellites (Phase 2)

| File | Import | Resolution |
|------|--------|------------|
| `createAirtableAttachmentThumbnailColumn.ts` | `AirtableAttachmentThumbnailCell`, `tableRowThumbConstants`, `tmiTableMeta.types` | **move** with satellites |

---

## Selection / export (app-owned, post-0.121.0)

| Path | Resolution |
|------|------------|
| `src/shared/hooks/useTableRowSelectionExport.ts` | **stay** |
| `src/shared/utils/resolveSelectedFlatTableRows.ts` | **stay** |
| `src/shared/utils/tableExportFormatters.ts` | **stay** |
| `src/shared/utils/downloadTableAsXlsx.ts` | **stay** |
| `src/features/*/services/*TableExport.ts` | **stay** |
| `src/components/common/TableSelectionExportToolbar.tsx` | **stay** |

Grid `TMITableSelectionConfig` / `selection` prop → **move** with grid Phase 4.

---

## Cross-cutting consumers (outside `tmiTable/`)

| Consumer | Import | Notes |
|----------|--------|-------|
| `src/shared/context/DndContext.tsx` | `TmiRowReorderDndProvider` (barrel) | Home grid alias — **stay** |
| `src/shared/recordDetailStack/RecordDetailStackHost.tsx` | tmiTable barrel | Phase 5 → `@tmi-apps/ui` |
| Feature `*Table`, pages, workspaces | tmiTable barrel | Phase 5 cutover |
| `VideoEmbedDialog`, `AutocompleteSelectField` | `PortaledOverlayStackContext` | Same overlay stack as workspace |

---

## Freeze note (0.121.0)

Feature `*Table` components accept `selection={{…}}` only. Do not reintroduce flat selection props before extract completes.

---

## Gate

- [x] Manifest attached before Phase 1 merge
- [ ] PO z-index matrix (Decision #2) on staging
- [ ] PO row-reorder smoke (Lesmateriaal admin)
