# Handoff — Phase 2 for `TMI-apps/tmi-ui` agent

**Lesmateriaal state:** `feature/tmitable-tmi-ui-extract-phase1` @ `f6fea1f` (Phase 0–1 done, PO smoke OK)  
**This phase:** TMI-ui repo only — scaffold package + move **satellites + types + theme factory**  
**Not this phase:** grid (`DatabaseViewer`), workspace shell, export hooks (Phases 3–4 / app-only)

---

## Bulk copy first (save tokens)

**Copy files on disk; agent must NOT regenerate component bodies.**

TMI-ui already has `docs/jobs/temp_job_table-component-ingest/PASTE_GUIDE.md` and landing zone `src/DataTable/`.

1. Paste **entire** `lesmateriaal-datasync/src/components/common/tmiTable/` → `tmi-ui/src/DataTable/lesmateriaal-import/tmiTable/`
2. Paste satellites + `shared/types` + `shared/theme` slices (see table below) into sibling folders under `lesmateriaal-import/`
3. Copy job docs into `lesmateriaal-import/docs/` (HANDOFF, LEAK_MANIFEST, IMPLEMENTATION_PLAN)
4. Agent: mechanical import fixes + phased exports only — see `PASTE_GUIDE.md`

Phase 2 still **ships** satellites + types + theme only; full `tmiTable/` tree can sit in `lesmateriaal-import/` unexported until Phase 3–4.

---

## Master prompt (paste into TMI-ui Cursor chat)

```
Lesmateriaal source is ALREADY COPIED under src/tmi-table/lesmateriaal-import/ (see HANDOFF_PHASE2_TMI_UI.md § Bulk copy).

Do NOT rewrite or regenerate component code. Mechanical work only:
- Fix @/ imports → package-relative paths
- Promote Phase 2 files (satellites, types, theme slice) into src/tmi-table/ with working imports
- Scaffold build, vitest, CI, README, createTmiTableTheme
- Export Phase 2 public API only; keep full tmiTable tree for Phase 3–4 unexported if needed
- Zero @/ imports in committed TMI-ui code
- Tag v0.5.0-alpha.1 when gates pass

Read HANDOFF_PHASE2_TMI_UI.md + IMPLEMENTATION_PLAN.md Phase 2. Lesmateriaal PR #79.
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
