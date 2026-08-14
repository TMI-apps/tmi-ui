# TMITable → `@tmi-apps/ui` (strategy C: injection boundaries)

**Complexity:** L  
**Plan review:** Done 2026-08-12 (review-dev-plan)  
**Pattern review:** See § Pattern & precedent  
**MILA DB handoff:** Not required (UI-only; no shared-schema change)

## Goal

Move the reusable **TMITable subsystem** (~60 files under `src/components/common/tmiTable/`) into the private **`TMI-apps/tmi-ui`** package (`@tmi-apps/ui`), while keeping Lesmateriaal (and future MILA) apps thin orchestrators.

**Strategy C** means: introduce **explicit injection boundaries** in Lesmateriaal *before* any cross-repo file move, so the library never imports app paths (`@/shared/context/DndContext`, feature hooks, Dutch copy, RPC types).

**Success criteria (product owner validates in app):**

- All table features (Lesmateriaal, Doelen, Media, Externe tools, Opdrachtgevers, Uitgelicht) behave unchanged after cutover.
- Feature code imports table APIs from `@tmi-apps/ui` only (no `@/components/common/tmiTable`).
- No `tmiTable` → `features/` or `tmiTable` → app-specific `shared/` coupling remains in TMI-ui.
- Local dev loop for table changes is documented (link / yalc / tagged pre-release).

---

## Out of scope

| Item | Reason |
|------|--------|
| MILA app adoption | Separate consumer PR after Lesmateriaal proves the package |
| TanStack alignment P0–P3 | **Deferred until post–Phase 6** — no `DatabaseViewer` TanStack refactors during Phases 0–5 (see § Freeze policy) |
| Feature column defs, RPCs, export row mappers | Stay in `src/features/*` |
| Lesmateriaal card grid (home) | Different subsystem; see `app-tasks.json` “Lift shared components” (card + drawer only) |
| Checkbox column for row selection | Deferred per `temp_job_tmitable_improvement_run` |

---

## Pattern & precedent

| Field | Content |
|-------|---------|
| **Capability** | Extract a large admin **master–detail table** (virtualized grid, tree rows, infinite scroll, mobile drawer detail) into a shared React component library consumed by multiple TMI apps. |
| **Industry precedents** | **MUI X Data Grid** (peer-deps + theme extension + slot/render props); **TanStack Table** headless + app-owned UI layer; **AG Grid** enterprise pattern (core grid + injected cell renderers / DnD plugins). |
| **Aspects reviewed** | Composition (master–detail); extensibility (injection vs hard imports); async/list contracts (`serverInfinite`); theming; multi-app release cadence. |
| **Findings** | Hard-wiring `LesmateriaalGridDndContext` inside `DatabaseViewerBody` matches **no** mainstream grid library. Theme tokens scattered in app `shared/theme/` mirror MUI X’s “extend the theme” docs. Re-export shim during migration matches design-system rollout (Polaris-style separate package). |
| **Verdict** | **Aligns with precedent** for injection boundaries + phased extract. **Acceptable Toolbox-specific:** `serverInfinite` contract, modifier-click selection without checkbox column. |
| **Scalability notes** | Injection props must stay stable semver surface; prefer slots/wrappers over per-feature props. Document required theme keys once in TMI-ui README. |

---

## Multi-repo vs monorepo (decision)

| Approach | Choice | Rationale |
|----------|--------|-----------|
| **A — Git-tagged `@tmi-apps/ui`** (current) | **Selected** | Matches existing `ThumbnailPill` consumption, private repo, MILA as separate consumer. Trade-off: tag/bump friction, `github:#` Vitest quirks — mitigated by link/yalc dev loop + pre-release tags. |
| **B — Turborepo / pnpm workspace** | Deferred | Atomic cross-package PRs; revisit if MILA adoption makes two-repo latency painful. |

---

## Freeze policy (Phases 0–5)

| Allowed | Blocked |
|---------|---------|
| Injection-boundary work (Phase 1) | New **public** `DatabaseViewer` / `TMITable` props (except injection API in § Injection API) |
| Bug fixes in existing table behavior | TanStack alignment P0–P3 (`DOC_DATABASEVIEWER_TANSTACK_ALIGNMENT_PRIORITIES.md`) |
| Internal refactors that do not change public API | Parallel large table feature jobs without extract-owner approval |

**Exception process:** PO + extract owner approve one-line waiver in `AGENT_STATUS.md` for production-blocking table fixes.

---

## Prerequisites (Phase 0)

### Gate 0 definition (`temp_job_tmitable_improvement_run`)

**Gate 0 satisfied when:** Jobs A + B from improvement-run are merged to `main` (selection/virtualization correctness, loading UX, a11y keyboard path). Job C (API regroup) may continue in parallel with Phase 1 **only** if it does not add new public `DatabaseViewer` props.

### Selection/export job

**Satisfied in `0.119.0` (Lesmateriaal) + `0.121.0` (all browse tables, PR #78).** Phase 0 does not re-run this job. Phase 4 grid move assumes selection/export on `develop`/`main`.

### Prerequisites satisfied branch

**Status (CHANGELOG through `0.121.0`, on `develop` as of 2026-08-14):**

| Release | Satisfies |
|---------|-----------|
| `0.119.0` | Gate 0 (selection correctness, grouped config, loading/a11y) |
| `0.120.0` | Workspace fullscreen + filter-prompt idle (Phase 3 move list) |
| `0.121.0` | Browse-table export rollout (all flat tables + Lesmateriaal tree) |

Phase 0 = **LEAK_MANIFEST + freeze only** — do not re-run selection/export jobs.

**Phase 1 not on `develop` yet:** `DatabaseViewerBody` still imports `LesmateriaalGridDndContext` (injection work lives on `feature/tmitable-tmi-ui-extract-phase1` until merged).

---

## Phase 0 deliverable: leak manifest (blocking)

**Before Phase 1 merges**, attach `LEAK_MANIFEST.md` in this job folder listing every `@/` import from `src/components/common/tmiTable/**` plus cross-cutting consumers:

| Category | Paths to include |
|----------|------------------|
| **Grid body** | `LesmateriaalGridDndContext`, `interactiveSurfaces`, `fileDropTarget`, `tableLoadDebug` |
| **Hero / detail** | `coverImageValidation`, `detailPanelHero.types`, `detailPanelMetaTokens`, `DetailPanelSectionHeading`, `detailHeroTypography` |
| **Types** | `tmiTableMeta.types`, `tmiTableConfig.types`, `databaseViewerRowReorder.types`, `optimisticTableFeedback.types`, `recordEditSession.types` |
| **Optimistic replay (app-owned)** | `tableFeedbackQuerySnapshotRestore`, `tableFeedbackToolbarVisibilityPatch`, `tableFeedbackRollbackMessage` |
| **Overlay (non-table)** | `VideoEmbedDialog`, `AutocompleteSelectField`, `FeaturedWorkspaceWithDrawer`, `LesmateriaalRouteDetailDrawerHost` |
| **Shared infra** | `recordDetailStack/RecordDetailStackHost.tsx` |
| **Selection/export (app-owned)** | `useTableRowSelectionExport`, `resolveSelectedFlatTableRows`, `downloadTableAsXlsx`, `tableExportFormatters`, `*TableExport.ts`, `TableSelectionExportToolbar` |

Each row: **file**, **import**, **resolution** (inject / move to TMI-ui / stay app adapter).

---

## Changelog sync (landed on `develop`)

Track `CHANGELOG.md` so the extract plan does not fight shipped API.

### `0.119.0` — TMITable hardening

| Change | Plan impact |
|--------|-------------|
| Lesmateriaal selection + export (first) | App-owned mappers; grid `TMITableSelectionConfig` moves with package |
| Grouped `tree` / `selection` / `debug` config | Move `tmiTableConfig.types.ts` Phase 2; stable semver |
| Loading/error UX, a11y | Phase 4 PO regression |
| Removed `DatabaseViewerServerInfinite`, `DatabaseViewerColumnMeta`, `RecordDetailEditPanel` from barrel | **Do not re-export** from TMI-ui |

### `0.120.0` — Workspace surfaces

| Change | Phase 3 move list |
|--------|-------------------|
| Detail fullscreen (`lg+`) | `WorkspaceDetailFullscreenContext`, `DetailPanelHeroLeftCluster`, workspace layout |
| Filter-prompt idle mode | `filterPromptActive`, `filterPromptCue`, `TMITableWorkspaceFilterPromptLayout`, `useFilterPromptDockTransition`, `TMITABLE_FILTER_PROMPT_DEFAULT_CUE` |
| `useOneShotDismissLatch` | **App-only** (`src/shared/hooks/`); Lesmateriaal composes via `useLesmateriaalFilterPromptActive` |

### `0.121.0` — Export rollout (all browse tables)

| Change | Plan impact |
|--------|-------------|
| `useTableRowSelectionExport` (`src/shared/hooks/`) | **Stay app** — workspace orchestration; not TMI-ui |
| `resolveSelectedFlatTableRows`, `tableExportFormatters` | **Stay app** (`src/shared/utils/`) |
| `*TableExport.ts` per feature (Doelen, Media, Externe tools, Opdrachtgevers, Samenwerkingen, Lesmateriaal) | **Stay app** (`src/features/*/services/`) |
| Feature `*Table` components accept `selection={{…}}` only | Contract frozen; no flat selection props on feature tables |
| `TableSelectionExportToolbar` | **Stay app** (`src/components/common/`) |

**PO Phase 4:** export smoke on **every** browse table that uses `useTableRowSelectionExport`, not Lesmateriaal-only.

---

## Split-brain policy (Phases 2–4)

1. **One import path per symbol** — no mixing `@tmi-apps/ui` and `@/components/common/tmiTable` for the same export.
2. **Shim-only until Phase 5** — `@/components/common/tmiTable` re-exports from `@tmi-apps/ui` for moved symbols; features keep barrel imports during Phases 2–4.
3. **Publish-before-consumer** — every cross-repo phase: TMI-ui tag → Lesmateriaal `package.json` bump PR → CI green → PO smoke → next phase.
4. **Paired branches** — e.g. `extract/tmi-table-p2` in both repos (note in `AGENT_STATUS.md`).

---

## Version & rollback protocol

### Pre-release tags (Phases 2–5)

| Phase | Tag example | Lesmateriaal pins |
|-------|-------------|-------------------|
| 2 | `v0.5.0-alpha.1` | `github:TMI-apps/tmi-ui#v0.5.0-alpha.1` |
| 3 | `v0.5.0-alpha.2` | bump alpha |
| 4 | `v0.5.0-rc.1` | bump rc |
| 6 | `v0.5.0` | stable |

Micro-fixes during a phase: push to paired branch; **do not** tag until phase gate passes.

### Rollback (Phase 4–5)

1. Pin Lesmateriaal to prior `@tmi-apps/ui` tag in `package.json`.
2. Restore local shim / `tmiTable/**` from git if deleted (revert merge commit).
3. Abort criteria: PO sign-off fails on Lesmateriaal bibliotheek regression; CI red on bump PR after 2 fix attempts.

### Deprecated shim (Decision #4)

Keep **one-release** 5-line re-export at `@/components/common/tmiTable` if MILA adoption starts within one quarter of Phase 4; else delete in Phase 5.

---

## Public API & semver (canonical names)

Publish in TMI-ui README before Phase 2 tag.

| Canonical (`@tmi-apps/ui`) | Deprecated alias (remove Phase 5) | Notes |
|----------------------------|-----------------------------------|-------|
| `TMITable` | `DatabaseViewer` | Component still exported today |
| `TMITableServerInfinite` | — | `DatabaseViewerServerInfinite` removed `0.119.0` |
| `TMITableColumnMeta` | — | `DatabaseViewerColumnMeta` removed `0.119.0` |
| `TMITableWorkspace` | — | `DatabaseTableDetailWorkspace` removed from barrel |
| `TMITableDetailEditPanel` | — | `RecordDetailEditPanel` removed `0.119.0` |
| `useTMITableMaxHeight` | `useDatabaseViewerMaxHeight` | Both still exported |
| `TMITableTreeConfig` / `Selection` / `Debug` | — | Grouped config (`0.119.0`) |
| `filterPromptActive` / `filterPromptCue` | — | Workspace opt-in (`0.120.0`) |
| `WorkspaceDetailFullscreenProvider` | — | Workspace (`0.120.0`) |
| `TmiRowReorderDndProvider` | — | Phase 1 injection (pre-extract) |

**Not in library barrel:** `useRecordEditSession`, `useTableRowSelectionExport` — app hooks only.

**Selection/export split (post-`0.121.0`):**

| Layer | Owner | Examples |
|-------|-------|----------|
| Grid | TMI-ui (Phase 4) | `selection` prop / `TMITableSelectionConfig`, row selection behavior in `DatabaseViewer` |
| Workspace glue | App `shared/` | `useTableRowSelectionExport`, `resolveSelectedFlatTableRows`, `downloadTableAsXlsx`, `tableExportFormatters` |
| Domain | App `features/` | `*TableExport.ts`, tree resolver `resolveSelectedLesmateriaalFromTree` |
| Chrome | App `components/common/` | `TableSelectionExportToolbar` |

**`serverInfinite`:** document mapping to TanStack `manualPagination` + `rowCount` in TMI-ui README; reconciliation with P0 alignment post–Phase 6.

### Locale surface

```ts
type TmiTableLocaleText = {
  optimisticRollbackToast?: string;
  unsavedChanges?: UnsavedChangesDialogLocaleText; // optional override
  // scope summary: use scopeSummary.title on props — NOT a separate top-level label prop
};
```

Default scope summary title remains `DATABASE_VIEWER_SCOPE_SUMMARY_DEFAULT_TITLE`; features keep `scopeSummary.title` (e.g. `"Wat je nu ziet"`).

---

## Current state (inventory)

### Public barrel today

`src/components/common/tmiTable/index.ts` exports ~40 symbols. After Phase 1: remove `useRecordEditSession` re-export.

### Consumers

~45 import sites. Deepest coupling: Lesmateriaal tree + reorder + infinite scroll.

### App leaks inside `tmiTable/` (must fix in Phase 1)

| Leak | File | Resolution |
|------|------|------------|
| `LesmateriaalGridDndContext` | `DatabaseViewerBody.tsx` | `TmiRowReorderDndProvider` (§ Injection API §1) |
| `PortaledOverlayStackProvider` | workspace, menus, dialogs | Decision #2 — app-owned context re-exported from neutral `@tmi-apps/ui/overlay` **or** inject `getOverlayZIndex` |
| `useRecordEditSession` re-export | `index.ts` | **Remove** from barrel; app-only |
| Optimistic rollback copy | `OptimisticTableFeedbackContext.tsx` | `TmiTableLocaleText` |
| Theme tokens | many files | `createTmiTableTheme()` — build once in TMI-ui (Phase 2), not twice |
| `tableLoadDebug` | `DatabaseViewer.tsx` | Optional `onTableLoadDebug?` prop; strip from library default build |

### Satellite components (move Phase 2)

`TableRowActionButton`, `TableRowThumbnailShell`, `tableRowThumbConstants`, `AirtableAttachmentThumbnailCell`, `DataTableTruncatedText`, `dataTableTooltipProps`. `TableSelectionExportToolbar` stays app-level.

### Shared types / utils to relocate

| Path | Phase |
|------|-------|
| `tmiTableMeta.types.ts`, `tmiTableConfig.types.ts`, `databaseViewerRowReorder.types.ts` | 2 |
| `databaseViewer.types.ts` (legacy) | 2 — collapse |
| `tableInteractionSkin`, `detailPanelHeroTheme`, `workspaceDetailDrawerZIndex` | 2–3 via `createTmiTableTheme` |
| `databaseViewerRowReorderZone.ts` + `databaseViewerRowReorderZone.test.ts` | 4 |
| `fileDropUtils.ts` | 4 (if file-drop stays) |
| `tableLoadDebug.ts` | **Stay in app** |

### Optimistic feedback boundary (three-part contract)

| Piece | Owner |
|-------|-------|
| `OptimisticTableFeedbackProvider` + `localeText` | TMI-ui (Phase 3) |
| `OptimisticTableFeedbackControls` type | TMI-ui (move with provider) |
| `tableFeedbackQuerySnapshotRestore`, `tableFeedbackToolbarVisibilityPatch` | **App** — feature services call these; document as adapter pattern in README |

---

## Injection API (Phase 1 — implement in-repo)

### 1. Row reorder DnD (redesigned)

**Problem:** `DatabaseViewerBody` hardcodes `LesmateriaalGridDndContext` with shell props the thin `{ children, enabled }` wrapper cannot carry.

**API:** Library ships **`TmiRowReorderDndProvider`** in `tmiTable` (moves to TMI-ui Phase 4) — generic `@dnd-kit` shell. App passes config via existing `rowReorder`:

```ts
// Library (DatabaseViewerBody) — when rowReorder enabled:
<TmiRowReorderDndProvider
  sensors={rowReorder.sensors}
  collisionDetection={closestCenter}
  measuring={ROW_REORDER_DND_MEASURING}
  dragPointerSampleRef={rowReorder.dragPointerSampleRef}
  onDragEnd={rowReorder.onDragEnd}
  dragOverlayDropAnimation={null}
  renderDragOverlay={...}
>
  {children}
</TmiRowReorderDndProvider>
```

`LesmateriaalGridDndContext` stays in app `shared/context/DndContext.tsx` for **home lesson grid**; table uses generic provider. No `RowReorderDndWrapper` injection prop.

**Gate:** Unit test that `rowReorder.sensors` + `onDragEnd` meta (`lastPointerSample`) still flow; integration test optional: `LesmateriaalTable` with reorder enabled.

### 2. Portaled overlay z-index (Decision #2 — Phase 1 exit gate)

**Problem:** `useWorkspaceDrawerOverlayZIndex` used by table **and** non-table UI (`VideoEmbedDialog`, autocomplete, home/uitgelicht drawers).

**Selected approach (pending PO confirm in spike):**

| Option | Decision |
|--------|----------|
| **A′ — App-owned context, TMI-ui re-export** | `PortaledOverlayStackContext` stays implemented in Lesmateriaal `shared/context/` until MILA needs it; TMI-ui imports via peer adapter or duplicate thin context in package with **documented single-provider rule** |
| **B — `getOverlayZIndex` injection** | Workspace accepts optional callback; table menus use it |
| ~~**C — theme.zIndex only**~~ | **Rejected** unless `createTmiTableTheme` enforces drawer `modal + 3` above AppBar `modal + 2` |

**Phase 1 PO z-index matrix (staging):** mobile AppShell bar, workspace drawer, column menu, scope popover, unsaved dialog, nested MUI Select inside drawer, `AutocompleteSelectField` popper.

### 3. Theme extension

`createTmiTableTheme(base: Theme): Theme` — implement **only in TMI-ui** (Phase 2). Phase 1 documents token list in `LEAK_MANIFEST.md`; do not duplicate factory in app `shared/theme/`.

### 4. Optimistic table feedback

`OptimisticTableFeedbackProvider` with `localeText?: TmiTableLocaleText`. Types move with provider (Phase 3).

### 5. Export / selection (post-`0.121.0`)

**Grid (moves to TMI-ui):** `TMITableSelectionConfig`, selection props on `TMITable` / `DatabaseViewer`, `clearRowSelectionKey`, modifier-click contract.

**App (stays):** `useTableRowSelectionExport`, `TableSelectionExportToolbar`, `downloadTableAsXlsx`, `resolveSelectedFlatTableRows`, `tableExportFormatters`, feature `*TableExport.ts`. Document in TMI-ui README: consumers wire selection via the shared hook pattern in `tmiTable/README.md`.

### 6. Scope summary copy

Use `scopeSummary.title` on table props — **no** redundant `scopeSummaryTriggerLabel` prop.

### 7. `useRecordEditSession` (Decision #3 — locked)

**App-only.** Remove from `tmiTable/index.ts` in Phase 1. Feature detail panels import `@/shared/hooks/useRecordEditSession`. `UnsavedChangesDialog` moves to TMI-ui Phase 3 with types it needs co-located or imported from app types package slice.

---

## TMI-ui packaging

### Peer dependencies

`react`, `react-dom`, `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`, `@tanstack/react-table` (^8.21), `@tanstack/react-virtual` (3.13.x), `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`

Publish **version matrix** in TMI-ui README aligned to Lesmateriaal `package.json` pins.

### Entry points

```ts
export * from "./tmi-table";
// Future: "./tmi-table/grid", "./tmi-table/workspace", "./overlay"
```

### CI (TMI-ui — mandatory from Phase 2)

- `pnpm test:run` + build on PR and tag
- ESLint `no-restricted-imports` / depcruise: **zero `@/` imports**
- Optional: API snapshot test on barrel exports

### CI (Lesmateriaal bump PR)

- Full CI including `pnpm test:run`, `type-check`
- Verify Vitest `inline` / `optimizeDeps` for `@tmi-apps/ui` per `.cursor/rules/testing/RULE.mdc`

---

## Test migration matrix

| Test file | Moves with | Green in repo |
|-----------|------------|---------------|
| `databaseViewerTableModelUtils.test.ts` | Grid (Phase 4) | TMI-ui |
| `databaseViewerRowSelection.test.ts` | Grid (Phase 4) | TMI-ui |
| `UnsavedChangesDialog.test.tsx` | Workspace (Phase 3) | TMI-ui (types from app or co-moved) |
| `databaseViewerRowReorderZone.test.ts` | Reorder util (Phase 4) | TMI-ui |
| `TMITableWorkspace.test.tsx` | Workspace (Phase 3) | TMI-ui — filter-prompt + fullscreen (`0.120.0`) |
| `doelenTableExport.test.ts`, `lesmateriaalTableExport.test.ts` | — | Lesmateriaal (app export mappers) |
| `useTableRowSelectionExport.test.ts` | — | Lesmateriaal (`shared/hooks`) |
| `downloadTableAsXlsx.test.ts` | — | Lesmateriaal (`shared/utils`) |

Phase gates require **owning repo** `pnpm test:run` green, not “old path still passes.”

---

## Implementation phases

### Phase 0 — Inventory & freeze

- **Risk:** 🟢
- **Work:**
  1. Confirm prerequisites satisfied (`0.119.0`–`0.121.0` on `develop`) — see § Prerequisites satisfied branch.
  2. Generate **LEAK_MANIFEST.md** (§ Phase 0 deliverable).
  3. PO confirms freeze policy; note exceptions in `AGENT_STATUS.md`.
- **Gate:** Manifest complete; prerequisites satisfied; PO freeze ack.
- **Files:** Docs only.

---

### Phase 1 — Injection boundaries (in-repo)

- **Risk:** 🟡
- **Work:**
  1. Replace `LesmateriaalGridDndContext` in `DatabaseViewerBody` with `TmiRowReorderDndProvider` (generic shell).
  2. **Close Decision #2** — overlay spike + PO z-index matrix on staging.
  3. **Close Decision #3** — remove `useRecordEditSession` from barrel; update feature imports.
  4. Add `TmiTableLocaleText` on optimistic provider.
  5. Add `onTableLoadDebug?` or strip debug import from `DatabaseViewer`.
  6. Deep-import cleanup: all known violations + internal `DatabaseViewer.tsx` hook path → barrel only (`detailHeroTypography`, `DetailPanelHeroStatsStrip`, `useDatabaseViewerMaxHeight`, etc.).
  7. ESLint rule: ban feature deep imports into `tmiTable/**` subpaths.
- **Gate:**
  - `pnpm test:run` + `pnpm arch:check` + `type-check`
  - **Row reorder unit test** (sensors + `onDragEnd` meta)
  - PO z-index matrix passed
  - Decisions #2 and #3 recorded in § Decisions made
- **Files:** `tmiTable/**`, `LesmateriaalTable.tsx`, feature import cleanups.

---

### Phase 2 — TMI-ui scaffold + satellites

- **Risk:** 🟡
- **Work:**
  1. TMI-ui: `src/tmi-table/`, build, peer deps, **Vitest + CI workflow**.
  2. Move satellites + types (`tmiTableMeta`, `tmiTableConfig`, reorder types).
  3. Ship `createTmiTableTheme` + public API table in README.
  4. Lesmateriaal: pin `v0.5.0-alpha.1`; shim re-exports satellites from `@tmi-apps/ui`.
  5. Minimal Storybook: theme + one table row (gate).
- **Gate:**
  - TMI-ui `pnpm test:run` + build + **zero `@/` imports**
  - Lesmateriaal bump PR CI green
  - PO: Media table + **one workspace route** (Opdrachtgevers or Doelen) smoke on staging
- **Files:** TMI-ui repo + Lesmateriaal shim + `package.json`.

---

### Phase 3 — Workspace + detail shell

- **Risk:** 🟡
- **Prerequisite:** Decision #3 done; `useRecordEditSession` not in library barrel.
- **Work:**
  1. Move workspace (incl. `0.120.0`: fullscreen + filter-prompt surfaces), detail/edit panel, hero, stats strip, `UnsavedChangesDialog`, layout contexts, backdrop dismiss, optimistic provider + types.
  2. Move hero/detail theme into `createTmiTableTheme`.
  3. Shim re-exports workspace symbols; grid still local.
  4. Migrate `TMITableWorkspace.test.tsx` + `UnsavedChangesDialog.test.tsx` to TMI-ui.
- **Gate:**
  - TMI-ui tests green; tag `v0.5.0-alpha.2`
  - PO: Opdrachtgevers + Doelen + Lesmateriaal admin (drawer, infinite, portaled menus, **filter-prompt**, **`lg+` fullscreen**)
  - React context smoke: `useTMITableMaxHeight` same provider instance as `TMITableWorkspace` from package + local grid
- **Files:** TMI-ui + partial shim.

---

### Phase 4 — Grid core (`DatabaseViewer`)

- **Risk:** 🔴
- **Work (sub-phases recommended):**
  - **4a:** Hooks, utils, types tests (`databaseViewerRowReorderZone`, model utils, row selection tests)
  - **4b:** `DatabaseViewerBody` + virtualization
  - **4c:** `TMITable.tsx`, `createAirtableAttachmentThumbnailColumn`, remaining grid tests
  1. Delete `src/components/common/tmiTable/table/**`; shim points to package.
- **Gate:**
  - Tag `v0.5.0-rc.1`
  - PO full regression: all browse tables with **selection + export** (`0.121.0`); Lesmateriaal tree/reorder/infinite; Media, Externe tools, Doelen, Opdrachtgevers (admin + school Samenwerkingen), Uitgelicht
  - Rollback plan documented if sign-off fails
- **Files:** Largest diff.

---

### Phase 5 — Consumer cutover + shim removal

- **Risk:** 🟡
- **Work:**
  1. Replace `@/components/common/tmiTable` → `@tmi-apps/ui` (~45 files); incremental by feature domain optional (Media → Externe → Doelen → Opdrachtgevers → Lesmateriaal).
  2. Update `recordDetailStack`, `RecordKeyValueList`, rules (`component-patterns`, `ARCHITECTURE.md`, `DOC_TMI_TABLE.md`).
  3. Delete shim or one-release deprecated re-export (Decision #4).
- **Gate:** `rg '@/components/common/tmiTable'` → 0; `pnpm test:run` + `type-check` + `validate:all`
- **Files:** Consumers + docs.

---

### Phase 6 — Docs, rules, release

- **Risk:** 🟢
- **Work:**
  1. Canonical README in TMI-ui; `DOC_TMI_TABLE.md` → short index.
  2. Tag **`v0.5.0`** stable.
  3. CHANGELOG both repos; MILA adoption checklist issue.
  4. Resume TanStack P0 alignment in Lesmateriaal or TMI-ui per post-cutover plan.
- **Gate:** PO production smoke after tag bump.

---

## Decisions made

| # | Decision | Status |
|---|----------|--------|
| 1 | Strategy **C** — injection boundaries before extract | **Owner: 2026-07-07** |
| 2 | Overlay z-index: app-owned `PortaledOverlayStack` with documented provider placement; **reject theme-only (C)** unless theme enforces AppBar/drawer tiers | **Pending spike — Phase 1 exit gate** |
| 3 | `useRecordEditSession` **app-only**; removed from library barrel Phase 1 | **Locked: 2026-08-12 (review-dev-plan)** |
| 4 | One-release deprecated shim if MILA adoption within 1 quarter of Phase 4; else delete Phase 5 | **Locked: 2026-08-12** |
| 5 | Phase 2 PO: Media + one workspace route; Phase 3 adds Lesmateriaal admin | **Updated: 2026-08-12** |
| 6 | Multi-repo git tags over monorepo (see § Multi-repo decision) | **Locked: 2026-08-12** |
| 7 | Row reorder: generic `TmiRowReorderDndProvider` in library, not thin wrapper injection | **Locked: 2026-08-12** |
| 8 | `createTmiTableTheme` built once in TMI-ui Phase 2 (no app-local duplicate Phase 1) | **Locked: 2026-08-12** |

---

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Two-repo friction | link/yalc; pre-release tags per phase; paired branches |
| Split-brain imports | Shim-only policy; one path per symbol |
| Visual regression | Storybook Phase 2+; expanded PO matrix |
| pnpm `#` Vitest breakage | Bump PR checklist; testing RULE config |
| Incomplete injection | LEAK_MANIFEST + TMI-ui `@/` ban in CI |
| Optimistic replay confusion | Three-part contract documented |
| Phase 4 monolith | Sub-phases 4a–4c with PO check between |

---

## Test plan (PO)

| Phase | Verify |
|-------|--------|
| 1 | Lesmateriaal row reorder; z-index matrix (§ Decision #2); unsaved dialog |
| 2 | Media thumbnails; Opdrachtgevers or Doelen workspace drawer |
| 3 | Opdrachtgevers + Doelen + Lesmateriaal admin; backdrop dismiss; filter-prompt; `lg+` fullscreen |
| 4 | All browse tables: multi-select + `.xlsx` export; Lesmateriaal tree/reorder/infinite; loading/a11y |
| 5 | Spot-check all table routes after import cutover |
| 6 | Production deploy smoke |

---

## Related

- `src/components/common/tmiTable/README.md` — current API SSOT
- `documentation/DOC_TMI_TABLE.md`
- `documentation/DOC_DATABASEVIEWER_TANSTACK_ALIGNMENT_PRIORITIES.md` — post–Phase 6
- `temp_job_tmitable_improvement_run`, `temp_job_table_row_selection_excel_export` — landed `0.119.0` + rollout `0.121.0` (PR #78)
- `LEAK_MANIFEST.md` — create in Phase 0

---

## Next steps

1. ~~`/review-dev-plan`~~ — Done 2026-08-12
2. Optional: `/validate` plan-review
3. **Phase 0:** LEAK_MANIFEST + prerequisite check → Phase 1
