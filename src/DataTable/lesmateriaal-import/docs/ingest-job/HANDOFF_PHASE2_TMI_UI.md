# Handoff — Phase 2 for `TMI-apps/tmi-ui` agent

**Lesmateriaal state:** `feature/tmitable-tmi-ui-extract-phase1` @ `f6fea1f` (Phase 0–1 done, PO smoke OK)  
**This phase:** TMI-ui repo only — scaffold package + move **satellites + types + theme factory**  
**Not this phase:** grid (`DatabaseViewer`), workspace shell, export hooks (Phases 3–4 / app-only)

---

## Master prompt (paste into TMI-ui Cursor chat)

```
You are implementing Phase 2 of the TMITable extract into @tmi-apps/ui.

Read these specs from the Lesmateriaal repo (sibling clone or attached):
- documentation/jobs/temp_job_tmitable_tmi_ui_extract/IMPLEMENTATION_PLAN.md  (§ Phase 2, § TMI-ui packaging, § Public API)
- documentation/jobs/temp_job_tmitable_tmi_ui_extract/LEAK_MANIFEST.md
- documentation/jobs/temp_job_tmitable_tmi_ui_extract/HANDOFF_PHASE2_TMI_UI.md  (this file)
- src/components/common/tmiTable/README.md  (current API SSOT)

Lesmateriaal Phase 1 is merged or on branch feature/tmitable-tmi-ui-extract-phase1 (f6fea1f).

## Phase 2 goals

1. Scaffold `src/tmi-table/` package entry, build (tsup or existing repo pattern), Vitest, CI workflow.
2. Copy/adapt **satellite components** from Lesmateriaal (see file list below) — zero `@/` imports in TMI-ui.
3. Copy/adapt **shared types** used by satellites + public API (Phase 2 list below).
4. Implement `createTmiTableTheme(base: Theme): Theme` — first slice: `tableInteractionSkin` tokens tmiTable needs (full hero theme Phase 3).
5. Export public API per IMPLEMENTATION_PLAN § Public API table; document peer dependency version matrix matching Lesmateriaal package.json pins.
6. ESLint/depcruise: **zero `@/` imports** in TMI-ui.
7. Tag `v0.5.0-alpha.1` when gates pass.

## Do NOT move in Phase 2

- `src/components/common/tmiTable/table/**` (DatabaseViewer grid) — Phase 4
- `TMITableWorkspace`, detail hero, `UnsavedChangesDialog` — Phase 3
- App-only: `useTableRowSelectionExport`, `TableSelectionExportToolbar`, `*TableExport.ts`, `useRecordEditSession`
- `PortaledOverlayStackContext` — stays app-owned (peer/documented provider rule); stub or optional injection only if needed for satellite compile

## Peer dependencies (match Lesmateriaal)

react ^19.2, react-dom, @mui/material ^7.3.6, @mui/icons-material ^7.3.6,
@emotion/react, @emotion/styled,
@tanstack/react-table ^8.21.3, @tanstack/react-virtual 3.13.24,
@dnd-kit/core ^6.3.1, @dnd-kit/sortable ^10, @dnd-kit/utilities ^3.2.2

## Done when

- pnpm test:run + build green in TMI-ui
- Storybook or minimal demo: one themed table row (plan gate)
- README lists exports + peer matrix + “app adapters stay in Lesmateriaal”
- Git tag v0.5.0-alpha.1

Do not change Lesmateriaal in this session unless the user also has that repo open for the paired shim PR (Phase 2b).
```

---

## Source files to copy FROM Lesmateriaal

Paths relative to Lesmateriaal repo root (`lesmateriaal-datasync`).

### A — Satellite components (move as-is, fix imports)

| Lesmateriaal path | TMI-ui target (suggested) |
|-------------------|---------------------------|
| `src/components/common/TableRowActionButton.tsx` | `src/tmi-table/satellites/TableRowActionButton.tsx` |
| `src/components/common/TableRowThumbnailShell.tsx` | `src/tmi-table/satellites/TableRowThumbnailShell.tsx` |
| `src/components/common/tableRowThumbConstants.ts` | `src/tmi-table/satellites/tableRowThumbConstants.ts` |
| `src/components/common/AirtableAttachmentThumbnailCell.tsx` | `src/tmi-table/satellites/AirtableAttachmentThumbnailCell.tsx` |
| `src/components/common/DataTableTruncatedText.tsx` | `src/tmi-table/satellites/DataTableTruncatedText.tsx` |
| `src/components/common/dataTableTooltipProps.ts` | `src/tmi-table/satellites/dataTableTooltipProps.ts` |
| `src/components/common/tmiTable/createAirtableAttachmentThumbnailColumn.ts` | `src/tmi-table/createAirtableAttachmentThumbnailColumn.ts` |

### B — Types (Phase 2)

| Lesmateriaal path | Notes |
|-------------------|--------|
| `src/shared/types/tmiTableMeta.types.ts` | `TMITableColumnMeta`, scope summary types |
| `src/shared/types/tmiTableConfig.types.ts` | `TMITableTreeConfig`, `Selection`, `Debug`, `TMITableLoadSettledPayload` |
| `src/shared/types/databaseViewerRowReorder.types.ts` | Row reorder config types |
| `src/shared/types/databaseViewer.types.ts` | Legacy — collapse if duplicated |

### C — Theme slice for `createTmiTableTheme` (Phase 2 first pass)

| Lesmateriaal path | Notes |
|-------------------|--------|
| `src/shared/theme/tableInteractionSkin.ts` | Row hover/selection skin presets |
| `src/shared/theme/interactiveSurfaces.ts` | `searchFieldMutedBackground` etc. (only what satellites/grid need) |

Defer to Phase 3: `detailPanelHeroTheme.ts`, `workspaceDetailDrawerZIndex.ts`, `detailPanelMetaTokens.ts`, `defaultTheme.ts` slices.

### D — Reference only (do not copy yet; informs API)

| Lesmateriaal path | Phase |
|-------------------|-------|
| `src/components/common/tmiTable/index.ts` | 5 — barrel export list |
| `src/components/common/tmiTable/context/TmiRowReorderDndProvider.tsx` | 4 |
| `src/components/common/tmiTable/feedback/tmiTableLocaleText.ts` | 3 |

---

## Create in TMI-ui (new files)

| Path | Purpose |
|------|---------|
| `src/tmi-table/index.ts` | Public barrel |
| `src/tmi-table/theme/createTmiTableTheme.ts` | Theme extension factory |
| `package.json` | `name: @tmi-apps/ui`, peers, build scripts |
| `README.md` | Public API table + peer matrix + adapter pattern for export/overlay |
| `.github/workflows/ci.yml` (or extend existing) | test + build on PR |
| `vitest.config.ts` | If not present |

---

## Public exports (Phase 2 subset)

Ship in README; full list in Lesmateriaal `IMPLEMENTATION_PLAN.md` § Public API.

- `createAirtableAttachmentThumbnailColumn`
- `TableRowActionButton`, `TableRowThumbnailShell`, `TABLE_ROW_THUMB_COLUMN_PX`
- `AirtableAttachmentThumbnailCell`, `DataTableTruncatedOverflow`, `DATA_TABLE_TOOLTIP_PROPS`
- Types: `TMITableColumnMeta`, `TMITableTreeConfig`, `TMITableSelectionConfig`, `TMITableDebugConfig`, reorder types
- `createTmiTableTheme`

---

## After TMI-ui tags `v0.5.0-alpha.1`

Switch back to **Lesmateriaal** tab and run Phase **2b** (paired consumer PR):

1. `package.json`: `"@tmi-apps/ui": "github:TMI-apps/tmi-ui#v0.5.0-alpha.1"`
2. Shim: `src/components/common/tmiTable/index.ts` re-exports moved satellites from `@tmi-apps/ui`
3. PO smoke: Media table + one workspace route (Opdrachtgevers or Doelen)

---

## Links

- Lesmateriaal job folder: `documentation/jobs/temp_job_tmitable_tmi_ui_extract/`
- Cross-feature doc: `documentation/DOC_TMI_TABLE.md`
