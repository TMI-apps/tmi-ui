# TMI table (`src/components/common/tmiTable`)

Canonical guide for the shared **TanStack Table + MUI grid**, **workspace shell** (table + optional detail pane), **detail/edit panel** helpers, and related hooks. Feature code consumes the **public barrel** only unless you are changing this subsystem.

Feature-specific flows (RPCs, business rules, route wiring) live in `**src/features/<name>/README.md`** for each feature — not here.

## Purpose

Deliver one consistent admin/browse table experience across Lesmateriaal, Doelen, Media, and Externe tools: virtualization, pinning, sticky header, scope summary, optional tree rows, infinite scroll contracts, workspace height alignment, shared hero + edit-session boundaries.

Cross-feature onboarding index (short): `[documentation/DOC_TMI_TABLE.md](../../../../documentation/DOC_TMI_TABLE.md)`.

## Folder structure


| Path                          | Role                                                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts`                    | **Public barrel** — import from `@/components/common/tmiTable` only in feature/hook/component code outside this folder.                     |
| `table/`                      | Grid implementation (`DatabaseViewer`, column menu, body, virtualization internals). Prefer not to import paths here from app feature code. |
| `hooks/`                      | Workspace/table layout hooks (`useDatabaseViewerMaxHeight`, expanded state, workspace heights).                                             |
| `context/`                    | Layout provider used by `TMITableWorkspace` so nested tables sync `maxHeight` / viewport fill.                                              |
| `feedback/`                   | **`OptimisticTableFeedbackProvider`**, **`useOptimisticTableFeedback`** — pending row ids + rollback snackbar; wrap page/workspace shells that coordinate optimistic TanStack Query patches with saves/mutations. |
| `TMITable.tsx`                | Thin display-name wrapper exposing `TMITable` over `DatabaseViewer`.                                                                        |
| `TMITableWorkspace.tsx`       | Two-column shell; providers for table/detail height coupling.                                                                               |
| `TMITableDetailEditPanel.tsx` | Shared detail/edit panel shell + unsaved dialog wiring patterns.                                                                            |
| `DetailPanelHeroHeader.tsx`   | Shared gradient hero strip for detail drawers.                                                                                              |


Optional `**docs/`** holds long deep dives only when README would become unwieldy.

## Public API (feature imports)

Use the barrel:

```ts
import {
  TMITable,
  TMITableWorkspace,
  TMITableDetailEditPanel,
  DetailPanelHeroHeader,
  type TMITableServerInfinite,
  type TMITableColumnMeta,
} from "@/components/common/tmiTable";
```

### `TMITable`

Preferred name for the table surface — wraps TanStack + MUI implementation internally.

Uses:

- Flat admin tables (Media, Externe tools).
- Tree table (Lesmateriaal).
- Server infinite scroll via `serverInfinite`.
- Fully client-loaded lists via `staticClientVirtualizedList(total)`.

**Height:** omit `maxHeight` to fill; pass a number to pin; pass `maxHeight={false}` for content-sized nested/dialog tables. `useDatabaseViewerMaxHeight` is deprecated for this use case (still exported one release).

Prefer:

```ts
import { TMITable, type TMITableServerInfinite } from "@/components/common/tmiTable";
```

Avoid in feature code:

```ts
// Avoid — legacy path / wrong resolver if a stray folder exists
import { DatabaseViewer } from "@/components/common/DatabaseViewer";
import type { DatabaseViewerServerInfinite } from "@/components/common/DatabaseViewer";
```

### Optimistic table feedback

Authenticated pages that patch query caches optimistically should wrap table + detail with **`OptimisticTableFeedbackProvider`** and **`useOptimisticTableFeedback`** (exported from this barrel). **`DatabaseViewer`** accepts **`rowSavePending`** for a subtle saving accent on rows.

### Row thumbnails (**`meta.rowThumbnailCell`**)

Shared paint-dip presentation lives in **`TableRowThumbnailShell`** (**`src/components/common/TableRowThumbnailShell.tsx`**): themed placeholder, **`Fade`** after load, **`loading` / `decoding` / `fetchPriority`** on the `<img>`. Column width SSOT: **`TABLE_ROW_THUMB_COLUMN_PX`** (`src/components/common/tableRowThumbConstants.ts`). **`AirtableAttachmentThumbnailCell`** and **`LesmateriaalThumbnailTableCell`** compose it; **`createAirtableAttachmentThumbnailColumn`** (exported from this barrel) builds repeating TanStack defs for Airtable attachment columns.

### `TMITableWorkspace`

Workspace shell: left header + table column, optional detail.

- `workspaceTop`: optional alerts/global chrome above the split.
- `leftHeader`: search, filters — does not scroll with the table body.
- **`lg+`**: fixed-width detail column beside the table (matched height via layout context).
- **Detail fullscreen (`lg+` only):** hero left cluster exposes **Tabel verbergen / Tabel tonen** — hides the whole primary column (filters + table) so detail uses full workspace width; primary column stays **mounted** at frozen dimensions (scroll/virtualizer state preserved). Session-only state (resets on Sluiten). Stack drill keeps the current layout mode. No toggle below `lg` (drawer already covers the table).
- **Below `lg`**: detail opens in a **`Drawer`** (`anchor="right"`); the table uses full-flex height like `lg+`.
- `detailOpen` + `detailPanel`: content for the detail surface (inline or drawer).
- **Filter-prompt idle mode (opt-in):** `filterPromptActive` centers `leftHeader` with a short cue and hides `table` until the page activates filters. Optional `filterPromptCue` overrides the default Dutch string (`TMITABLE_FILTER_PROMPT_DEFAULT_CUE`). **`RecordWorkspaceShell`** inherits these props but stays unchanged without opt-in.
- **Motion:** Filters stay mounted; leaving idle **docks** the header via CSS height spacers (28vh→0, ~380ms) and fades the table in. (Imperative FLIP was dropped — React Strict Mode effect cleanup cleared transforms.) Respects `prefers-reduced-motion`.
- **Detail pane:** `filterPromptActive` only affects the primary table column; `detailOpen` / `detailPanel` and drawer chrome are unchanged.

**Adoption contract**

- The **feature/page consumer** owns the idle boolean and any one-shot latch policy — not `TMITableWorkspace`.
- Whatever you pass as `leftHeader` is what gets centered in idle mode (search, filters, toolbars).
- While idle, the `table` subtree is **not mounted**; it remounts on exit (verify scroll/selection if that matters).
- Override `filterPromptCue` when the default copy does not fit the catalogue.

```tsx
<TMITableWorkspace
  workspaceTop={errorAlert}
  leftHeader={searchAndFilters}
  table={table}
  filterPromptActive={needsUserFilterChoice}
  detailOpen={Boolean(selectedRecordId)}
  detailPanel={detailPanel}
/>
```

Prefer `TMITableWorkspace`, **not** `DatabaseTableDetailWorkspace` (deprecated alias).

Active detail panes should call **`useRegisterDetailShellBackdropDismiss`** with the same handler as **hero close** so backdrop / Escape respects unsaved-change flows.

The narrow-viewport detail **`Drawer`** uses **`workspaceDetailDrawerModalZ`** (`src/shared/theme/workspaceDetailDrawerZIndex.ts`) so it stacks **above** the mobile **`AppShell`** top bar.

### `TMITableDetailEditPanel`

Shared detail/read/edit framing; compose with:

- `DetailPanelHeroHeader`
- `useRecordEditSession` (from `@/shared/hooks/useRecordEditSession`, re-exported on barrel where applicable)
- `UnsavedChangesDialog`

Prefer `**TMITableDetailEditPanel`**, not `**RecordDetailEditPanel**` (alias).

### `DetailPanelHeroHeader`

Hero strip for detail panes opened inside `TMITableWorkspace`: image, clamps, toolbar slot, optional delete controls. Domain actions (RPC, placement drag wiring) stay in **feature** parents and are passed via props.

## Column metadata

SSOT type: `TMITableColumnMeta` from `@/components/common/tmiTable` (defined in `src/shared/types/tmiTableMeta.types.ts`). Set on TanStack columns with `meta: { ... } satisfies TMITableColumnMeta`.


| Flag                        | Use                                                                       |
| --------------------------- | ------------------------------------------------------------------------- |
| `defaultHidden`             | Opt-in columns                                                            |
| `isTreeColumn`              | Single hierarchy column with chevrons (edge-to-edge, no text inset)       |
| `treeRowIndentBoundary`     | Last column included in tree-depth row graphic indentation                |
| `fullHeightInteractive`     | Icon-only action column: no text inset (height stretch is default for all body cells) |
| `iconSurrogateCell`         | Icon column hover tint (edge-to-edge, no text inset)                      |
| `rowThumbnailCell`          | Full-bleed thumbnail                                                      |
| `scopeSummaryHeaderTrigger` | “Wat je nu ziet” header trigger                                           |
| `wrapCellContent`           | Body cell: allow wrapping / visible overflow (chips); default is single-line ellipsis |


**Do not** set `fullHeightInteractive` on plain text columns — it breaks padding/alignment.

## Row actions

Use `TableRowActionButton` from `@/components/common/TableRowActionButton` for any icon/button in a row. Every body cell is a 48px stretch band (`p: 0`), so the button fills the row height. Use `fullHeightInteractive` / `iconSurrogateCell` / `isTreeColumn` only to drop the default horizontal text inset. Call `event.stopPropagation()` when the row is also clickable.

References: `LesmateriaalRowActionsCell`, `LinkOpenCell`, `TableRowThumbnailShell`, `AirtableAttachmentThumbnailCell`.

## Row selection + Excel export (opt-in)

**Workspace hook (SSOT):** `useTableRowSelectionExport` from `@/shared/hooks/useTableRowSelectionExport` — owns `rowSelection`, `selectedExportCount`, `handleExportSelectedToExcel`, and a ready `selection` object for `*Table` / `TMITable`.

```ts
const { selection, selectedExportCount, handleExportSelectedToExcel } =
  useTableRowSelectionExport({
    items,
    getRowId: (row) => row.id,
    clearRowSelectionKey: listQueryKey,
    onExport: (records) => exportDoelenRowsToXlsx(records, { doelenBaseUrl: window.location.origin }),
  });
```

Tree tables (Lesmateriaal): pass `resolveSelectedRows: resolveSelectedLesmateriaalFromTree`.

**Table prop:** pass only `selection={selection}` — do not spread flat selection props on feature `*Table` components.

`DatabaseViewer` still accepts flat props for backward compatibility; grouped config is preferred:

```ts
selection={{
  enabled: true,
  rowSelection,
  onRowSelectionChange,
  clearRowSelectionKey: listQueryKey,
}}
```

| Field | Role |
| ----- | ---- |
| `enabled` | Turns on TanStack `rowSelection` + modifier click handling |
| `rowSelection` / `onRowSelectionChange` | Controlled selection state (lift to page/workspace for export) |
| `clearRowSelectionKey` | Parent list/filter identity — selection clears when this **value** changes (not on mount) |

**Click contract:** plain click → select row + `onRowClick`; Ctrl/Cmd+click → toggle without opening detail; Shift+click → range over **visible** flattened rows only.

**Keyboard (path B, selection enabled):** Enter opens detail; Space does **not** open row (use modifier clicks for selection). Non-selection tables: Enter and Space both open.

**Export:** `TableSelectionExportToolbar` + `downloadTableAsXlsx` with a feature row mapper. Flat tables: default resolver uses `resolveSelectedFlatTableRows` + `*TableExport.ts` in each feature. Tree: `lesmateriaalTableExport.ts` + `resolveSelectedLesmateriaalFromTree`. Shared formatters: `tableExportFormatters.ts`.

**Adopted on:** Lesmateriaal bibliotheek, Doelen, Media, Externe tools, Opdrachtgevers, Samenwerkingen (admin + school).

**Export limit:** Excel includes **currently loaded** rows for the selected ids (infinite-scroll tables may omit rows not yet fetched).

## Grouped config objects

Prefer grouped configs (same pattern as `rowReorder` / `rowFileDrop` / `serverInfinite`):

| Config | Fields |
| ------ | ------ |
| `tree` | `getSubRows`, `expandAllOnDataChange`, `expandResetKey`, `mergeExpandedRowIds`, tree expand hooks |
| `selection` | `enabled`, `rowSelection`, `onRowSelectionChange`, `clearRowSelectionKey` |
| `debug` | `tableLoadResetKey`, `debugTableContext` |

Feature `*Table` components accept `selection?: TMITableSelectionConfig` only. `DatabaseViewer` flat props remain for backward compatibility during migration.

## Error and loading UX

- **First load** (`loading && data.length === 0`): shimmer skeleton rows with `aria-busy`.
- **Refetch error with stale rows** (`error && data.length > 0`): inline banner + retry; table stays visible (TanStack Query `keepPreviousData` pattern).
- **Error with no rows**: full-page `Alert` (unchanged).

## Accessibility notes

- Selected rows expose `aria-selected`; body table uses `aria-multiselectable` when selection is enabled.
- Selection count changes are announced via a visually hidden `aria-live="polite"` region.
- Header and body are separate `<table>` elements (sticky header layout). Full grid-role retrofit is deferred; document limitation for assistive-tech audits.

## Import rules

- **Feature / page / feature-hook code:** `@/components/common/tmiTable` only (public names: `TMITable`, `TMITableServerInfinite`, `TMITableColumnMeta`, config types). Omit `maxHeight` to fill; do not call `useDatabaseViewerMaxHeight` on page tables.
- **Internals maintenance:** may import from `./table/...` **inside** this package; do not leak deep paths to features.

## Extension rules

- **Layering:** `components/common` must not import `features/`*. Shared types used by both live under `src/shared/types/`.
- **Public surface:** add re-exports in `index.ts` when introducing new stable API; avoid feature consumers importing file-by-file from `table/`.
- **Layout / scroll:** follow `ARCHITECTURE.md` flex-cascade guidance for viewport fill; do not add `getBoundingClientRect` + `100vh` height loops for table+detail pages.
- **Extracting components:** keep new extractable pieces under `tmiTable/` (or `components/common` shared cells) so features stay thin orchestrators.

## Feature wiring checklist

When building or changing a table feature:

- Import from `@/components/common/tmiTable`.
- Keep data fetching in feature hooks/services; columns in `*TableColumns.tsx` (or similar).
- Use `TMITableWorkspace` when the route is table + side detail.
- Use `TMITableServerInfinite` for server-driven infinite lists; `staticClientVirtualizedList` for all-client lists.
- Keep generic grid behavior here; keep domain copy and RPC args in features.

## Reference implementations

- `src/features/doelen/components/DoelenTable.tsx` — flat wrapper.
- `src/features/media/components/MediaTable.tsx` — simple list.
- `src/features/externe-tools/components/ExterneToolsTable.tsx` — flat list.
- `src/features/lesmateriaal/components/LesmateriaalTable.tsx` — tree + infinite.
- `src/features/lesmateriaal/components/LesmateriaalPageAdminWorkspace.tsx` — `TMITableWorkspace` composition.

## Testing and validation

- Colocate unit tests as `*.test.ts` / `*.test.tsx` next to implementation (see `projectStructure.config.cjs`).
- After structural or import-surface changes: `pnpm validate:structure`, `pnpm arch:check` (or staged variants on commit).
- Feature README strict checks do **not** apply to this folder; keep this README updated with behavioral/API changes anyway for handoff safety.

## Related

- Enforceable shorthand: `[.cursor/rules/component-patterns/RULE.mdc](../../../../.cursor/rules/component-patterns/RULE.mdc)`
- Feature README contract: `[documentation/DOC_FEATURE_LOCAL_README.md](../../../../documentation/DOC_FEATURE_LOCAL_README.md)`
- File placement: `[.cursor/rules/file-placement/RULE.mdc](../../../../.cursor/rules/file-placement/RULE.mdc)`

