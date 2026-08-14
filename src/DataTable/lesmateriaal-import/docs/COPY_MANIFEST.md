# Copy manifest — Lesmateriaal → TMI-ui ingest

**TMI-ui landing zone:** `C:\Users\Lenovo\Documents\AppDev\tmi-ui\src\DataTable\lesmateriaal-import\`

**Lesmateriaal source:** `C:\Users\Lenovo\Documents\AppDev\lesmateriaal-datasync\`

**Status:** Synced by agent (2026-08-14). Re-run sync from Lesmateriaal tab if `tmiTable/` changes on `feature/tmitable-tmi-ui-extract-phase1` or after merge.

---

## Already copied (do not duplicate manually)

| TMI-ui folder | Lesmateriaal source | Files |
|---------------|---------------------|-------|
| `tmiTable/` | `src\components\common\tmiTable\` (entire tree) | ~72 |
| `satellites/` | `src\components\common\` (see list below) | 7 |
| `shared-types/` | `src\shared\types\` (see list below) | 7 |
| `shared-theme/` | `src\shared\theme\` (see list below) | 7 |
| `shared-utils/` | `src\shared\utils\` (reference; some app-only at export) | 8 |
| `shared-context/` | `PortaledOverlayStackContext.tsx` (reference — stub in package) | 1 |
| `docs/` | Job plans + `DOC_TMI_TABLE.md` + `ingest-job/` | varies |

---

## File-by-file source paths

### `tmiTable/` — copy whole folder

```
lesmateriaal-datasync\src\components\common\tmiTable\
```

Includes: `table/`, `hooks/`, `context/`, `feedback/`, tests, `index.ts`, `TmiTable.tsx`, `TMITableWorkspace.tsx`, etc.

API doc (if not in tree): `documentation\jobs\temp_job_ingest_table\README.md` → also at `docs\TMITABLE_README.md` in TMI-ui.

### `satellites/`

| File |
|------|
| `src\components\common\TableRowActionButton.tsx` |
| `src\components\common\TableRowThumbnailShell.tsx` |
| `src\components\common\TableRowThumbnailShell.test.tsx` |
| `src\components\common\tableRowThumbConstants.ts` |
| `src\components\common\AirtableAttachmentThumbnailCell.tsx` |
| `src\components\common\DataTableTruncatedText.tsx` |
| `src\components\common\dataTableTooltipProps.ts` |

### `shared-types/`

| File |
|------|
| `src\shared\types\tmiTableMeta.types.ts` |
| `src\shared\types\tmiTableConfig.types.ts` |
| `src\shared\types\databaseViewerRowReorder.types.ts` |
| `src\shared\types\databaseViewer.types.ts` |
| `src\shared\types\detailPanelHero.types.ts` |
| `src\shared\types\recordEditSession.types.ts` |
| `src\shared\types\optimisticTableFeedback.types.ts` |

### `shared-theme/`

| File |
|------|
| `src\shared\theme\tableInteractionSkin.ts` |
| `src\shared\theme\interactiveSurfaces.ts` |
| `src\shared\theme\detailPanelHeroTheme.ts` |
| `src\shared\theme\detailPanelMetaTokens.ts` |
| `src\shared\theme\defaultTheme.ts` |
| `src\shared\theme\workspaceDetailDrawerZIndex.ts` |
| `src\shared\theme\fileDropTarget.ts` |

### `shared-utils/` (reference for decouple; not all ship in package)

| File |
|------|
| `src\shared\utils\databaseViewerRowReorderZone.ts` |
| `src\shared\utils\databaseViewerRowReorderZone.test.ts` |
| `src\shared\utils\fileDropUtils.ts` |
| `src\shared\utils\coverImageValidation.ts` |
| `src\shared\utils\coverImageValidation.test.ts` |
| `src\shared\utils\airtableAttachments.ts` |
| `src\shared\utils\tableFeedbackRollbackMessage.ts` |
| `src\shared\utils\tableLoadDebug.ts` |

### `shared-context/` (reference — **do not export**; app owns overlay stack)

| File |
|------|
| `src\shared\context\PortaledOverlayStackContext.tsx` |

### `docs/`

| File |
|------|
| `documentation\jobs\temp_job_tmitable_tmi_ui_extract\*.md` |
| `documentation\jobs\temp_job_ingest_table\*.md` → `docs\ingest-job\` |
| `documentation\DOC_TMI_TABLE.md` |
| `src\components\common\tmiTable\README.md` → `docs\TMITABLE_README.md` |

---

## Never copy (stay in Lesmateriaal forever)

| Path | Reason |
|------|--------|
| `src\shared\hooks\useTableRowSelectionExport.ts` | App workspace orchestration |
| `src\shared\hooks\useRecordEditSession.ts` | App edit session |
| `src\components\common\TableSelectionExportToolbar.tsx` | App chrome |
| `src\shared\utils\downloadTableAsXlsx.ts` | App export |
| `src\shared\utils\resolveSelectedFlatTableRows.ts` | App export |
| `src\shared\utils\tableExportFormatters.ts` | App export |
| `src\features\*\services\*TableExport.ts` | Domain mappers |
| Feature columns, RPCs, pages | App domain |

---

## TMI-ui agent prompt (after copy is done)

```
Source already at src/DataTable/lesmateriaal-import/ — see docs/COPY_MANIFEST.md (ingest-job copy).

Do NOT recopy or regenerate. Mechanical: @/ → relative .js, peers, createTmiTableTheme, phased exports, CI.

Read: docs/jobs/temp_job_table-component-ingest/PASTE_GUIDE.md + lesmateriaal-import/docs/HANDOFF_PHASE2_TMI_UI.md

/implement table ingest
```

---

## This job folder (`temp_job_ingest_table`)

Docs-only staging in Lesmateriaal — you copied plans + tmiTable README here. **Code lives in TMI-ui** `lesmateriaal-import/`, not in this folder.
