# Development plan — TMITable last-row create

## Summary

- **What:** Optional **pinned create row** on `TMITable`: a blank, data-like row stuck to the **bottom of the table viewport**. Typing or **EOL paste** in a column calls a consumer `onCreate` handler (once per line). The handler **returns a row id**. Pending chrome is consumer-owned (D12). Opt-in only — no library create drawer.
- **Why:** Spreadsheet-style add without leaving the grid. Locked in `DECISIONS.md` (D0–D11).
- **Complexity:** **M** — public optional API, sticky footer vs virtualizer, paste, tree/infinite still using **current view**.
- **Plan review:** **Done 2026-08-24** (M) — six-lens `review-dev-plan` accepted; locks in `DECISIONS.md` D12–D14 and § Decisions made.
- **Scope:** Library `TMITable` / `DatabaseViewer` only. Changeset in **`finish`** (minor). Playground kitchen-sink **only if** `playground/` exists on the implementation branch (workshop is uncommitted on this clone and must not be mixed into this PR).

## Working copy (Git)

This clone is on `main` with **uncommitted component-workshop** files. D0 forbids mixing jobs.

| Field      | Value                                                                                                                |
| ---------- | -------------------------------------------------------------------------------------------------------------------- |
| Base       | `origin/main` (clean)                                                                                                |
| Branch     | `feature/table-last-row-create`                                                                                      |
| Worktree   | **Required:** `git worktree add <sibling>/tmi-ui-table-last-row-create -b feature/table-last-row-create origin/main` |
| This clone | Leave workshop dirty tree untouched                                                                                  |
| Delivery   | One PR to `main`. Changeset **minor** in `finish`                                                                    |

## Phase overview

| Phase | Goal                                          | Gate                                                                          | Status |
| ----- | --------------------------------------------- | ----------------------------------------------------------------------------- | ------ |
| 0     | Isolated worktree + branch                    | Worktree on `feature/table-last-row-create`; `git status` clean               | Done   |
| 1     | Public types + optional `rowCreate` prop      | `pnpm type-check`                                                             | Done   |
| 2     | Pinned create strip (layout, a11y, no select) | RTL: strip present when prop set; absent when omitted; not in row ids         | Done   |
| 3     | Commit + pending id contract                  | `pnpm test:run` (create + pending + reject)                                   | Done   |
| 4     | EOL paste (one column, N handler calls)       | `pnpm test:run` (paste cases)                                                 | Done   |
| 5     | Docs + README ledger                          | Ledger row; JSDoc on prop                                                     | Done   |
| 6     | Playground (conditional)                      | Skip if no `playground/` on branch; else kitchen-sink uses `rowCreate`        | Done   |
| 7     | Pre-PR suite                                  | type-check, type-check:test, lint, format:check, test:run, build, verify:pack | Done   |

## Conflict & compliance

- **Exports:** Add types next to `TmiTableProps` / `DatabaseViewerProps`. Re-export from `src/DataTable/index.ts` and `src/index.ts` (`.js` specifiers). No new component package folder.
- **Peers:** None. Reuse MUI `TextField`/`InputBase` already in the tree.
- **Theme:** No new tokens. Match sticky header fill via `getDatabaseViewerStickyHeaderBgSx` (or a shared sticky-chrome helper). `ListRowAddButton` / `tmiPrimaryContained` are **not** this row (D3).
- **ESM:** Relative `.js` imports; no `@/` .
- **Docs:** README **TMI table → Integration ledger** + short API note. Consumer create/drawer stays **out of package** (D2). Changeset in **finish**.
- **Publish:** `pnpm verify:pack` unchanged allowlist.
- **Protected files:** Do not edit `.github/workflows/**`, `.cursor/rules/**`, `.cursor/skills/**`. Do not touch workshop `playground/` on the dirty clone.
- **Tests:** `tests/DataTable/lesmateriaal-import/tmiTable/table/` (RTL + vitest). Do not add `src/**/*.test.*`.

## Pattern & precedent

| Field              | Value                                                                                                                                                                                                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Capability**     | Trailing create row on a virtualized data grid                                                                                                                                                                                                                                                                                             |
| **Industry**       | Airtable/Sheets: blank row + cell commit; GitHub/Notion: ghost “New”; AG Grid: pinned bottom. **D7 diverts** from Airtable in-flow: pin to **viewport**. Paste: EOL → one column (D5), not TSV.                                                                                                                                            |
| **Repo neighbors** | Sticky **header** strip in `DatabaseViewer` (same `TableContainer`). Virtualizer in `DatabaseViewerBody` — create row must **not** be a virtual item. `rowSavePending` + `OptimisticTableFeedbackProvider` (`beginPendingRow` / `endPendingRow`) for ids after create. `ListRowAddButton` is autocomplete **click** chrome — do not reuse. |
| **Verdict**        | **Acceptable product-specific:** Airtable cell model + AG Grid–style pin.                                                                                                                                                                                                                                                                  |
| **Risks**          | Horizontal scroll desync if footer leaves the scroll root; short lists without `min-height: 100%` leave the strip under rows instead of at the viewport bottom; injecting a phantom TanStack row would break selection (D8).                                                                                                               |

## Scope / out of scope

**In**

- Optional `rowCreate` on `TMITable` / `DatabaseViewer`.
- Pinned blank row; first cell commit or EOL paste creates (D3–D5).
- Current view including tree (visible leaves) and `serverInfinite` loaded window (D6) — pin is viewport chrome, independent of which rows are virtualized.
- Handler returns `string \| Promise<string>` row id (D10).
- Paste = N calls to the same handler (D11).
- After success: strip clears; focus stays on that column (D9).

**Out**

- Library create drawer (D2).
- TSV/CSV grid paste; whole-grid clipboard (D5).
- Batch `onCreateMany` (D11).
- Phantom row in `data` / TanStack row model / row selection / row reorder (D8).
- Mixing this PR with component-workshop (D0).
- New theme tokens; `ListRowAddButton` as the table create row.

## Existing functionality

- `DatabaseViewer` already uses one `overflow: auto` `TableContainer`, sticky header (`zIndex: 3`), then `DatabaseViewerBody` virtualizer.
- Cells are `flexRender` of consumer `columns` — create strip should **not** require a fake `TData` row (renderers often assume real fields).
- Optimistic feedback is an **opt-in provider**; table already has `rowSavePending?: (row) => boolean`. After create, pending applies to the **new body row id** when the provider is present; noop context if absent.
- Empty + loading: existing full-page skeleton/error paths have **no** table chrome — create strip only when the grid shell renders (including empty body).

## API sketch (implement against this)

```ts
type TmiTableRowCreateSource = "commit" | "paste";

interface TmiTableRowCreateRequest {
  columnId: string;
  value: string;
  source: TmiTableRowCreateSource;
}

interface TmiTableRowCreateConfig {
  onCreate: (request: TmiTableRowCreateRequest) => string | Promise<string>;
  ariaLabel?: string;
}

// DatabaseViewerProps
rowCreate?: TmiTableRowCreateConfig;
```

- Omit `rowCreate` → current behavior (D1).
- Default cell UI: compact text input per **visible leaf** column (skip checkbox/reorder/thumbnail columns via existing column meta flags). Optional `meta.createCell` **only if** a column cannot be a string; do not block v1 on that — add if kitchen-sink/tests hit a non-text column.
- Paste: `clipboardData.getData("text")`, split `/\\r?\\n/`, **skip blank lines**, call `onCreate` per line with `source: "paste"` and the focused `columnId`.
- Rejected promise / empty id: `showRollbackToast` (noop without provider); keep draft text in the pin. Library does not call `beginPendingRow` / `endPendingRow` (D12).
- Escape: clear local draft; no `onCreate`.

## Layout contract (D7)

Keep header, body, and create strip in the **same** horizontal scroll root (`TableContainer`).

Inner column: `minHeight: "100%"`, `display: "flex"`, `flexDirection: "column"`, width = existing `scrollContentWidth`.

1. Sticky header (existing).
2. Body region `flex: 1`, `minHeight: 0` (virtualizer unchanged).
3. Create strip `flexShrink: 0`, `position: "sticky"`, `bottom: 0`, `zIndex: 3`, same opaque bg as header, same `<Table>` column size style as header/body.

Short lists: strip sits on the viewport bottom (flex + minHeight 100%). Long lists: sticky bottom keeps it in the scrollport while rows move underneath. Load-more UI stays in the scrolling body (D8).

## Notes during development

- Phase 3 pending: implemented **D12** — library only `showRollbackToast` on reject/empty id; no `beginPendingRow` / `endPendingRow`.
- Paste leftovers use `InputBase multiline` so failed + unsent lines keep `\n` in the pin (single-line `<input>` strips newlines).
- Phase 6: **skipped** — no `playground/` on this worktree / `origin/main`. Do not copy workshop files from the dirty clone.
- Phase 7: local suite green 2026-08-24 (`type-check`, `type-check:test`, `lint`, `format:check`, `test:run` 128, `build`, `verify:pack`).

## Decisions made

| Decision                        | Context                                                                                               | Outcome                                                                                                                                                                                                                                                                                                                                | User asked?           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Pattern C                       | D5 EOL paste + D7 viewport pin vs Airtable in-flow / Sheets TSV                                       | Proceed as planned: AG Grid–style pin + one-column EOL paste; README must say pin is viewport chrome, not “row after last record.” Tree parent is app-owned.                                                                                                                                                                           | Yes — accept critique |
| Pending lifecycle (narrows D10) | Table pending is consumer `rowSavePending` + optional provider; library must not invent a second loop | Library does **not** call `beginPendingRow` / `endPendingRow`. Consumer: `onCreate` inserts + returns id; wire `rowSavePending` to `isRowPending(getRowId(r))` if they want chrome. On reject, library `showRollbackToast` (no-op without provider) and keeps draft. Empty/`""` id = reject path. Provider absent: create still works. | Yes — accept critique |
| Paste batch failure             | Sequential N `onCreate`                                                                               | Stop on first reject; keep the failed line and all unsent lines in the pin; do not roll back already-succeeded creates.                                                                                                                                                                                                                | Yes — accept critique |
| Test split                      | RTL cannot prove sticky pin / H-scroll                                                                | Automated: omit-prop, commit, `DataTransfer` paste order, blank-line skip, reject+draft, not selectable, loading/error = no strip. Manual: pin while scrolling, column alignment, tree/infinite, `maxHeight={false}`.                                                                                                                  | Yes — accept critique |
| Phase 7 playground              | Worktree from `origin/main` has no `playground/`                                                      | `pnpm playground` is **N/A** unless `playground/` exists on the branch.                                                                                                                                                                                                                                                                | Yes — accept critique |

---

## Phase 0 — Worktree

**Goal:** Implement on a clean `origin/main` worktree.

**Steps:**

1. `git fetch origin`
2. `git worktree add <sibling>/tmi-ui-table-last-row-create -b feature/table-last-row-create origin/main`
3. Copy or recreate `docs/jobs/temp_job_table-last-row-create/` in that tree if the folder is only on this dirty clone (untracked). Prefer copying `DECISIONS.md` + this plan into the worktree so the PR can include them.

**Gate:** Worktree `git status` clean except the copied job docs; branch is `feature/table-last-row-create`.

---

## Phase 1 — Types and prop plumbing

**Goal:** Optional `rowCreate` on `DatabaseViewerProps` / `TmiTableProps`; types exported.

**Steps:**

1. Add types in `src/DataTable/lesmateriaal-import/` (shared-types or next to `DatabaseViewer.tsx`).
2. Thread `rowCreate` into `DatabaseViewer`; `TMITable` already spreads props.
3. Export types from DataTable + root barrels.

**Gate:** `pnpm type-check`

---

## Phase 2 — Pinned strip UI

**Goal:** Visible create row when `rowCreate` is set; layout contract above; not selectable.

**Steps:**

1. New presentational module (e.g. `DatabaseViewerCreateRow.tsx`) — one table row of inputs aligned to `table.getVisibleLeafColumns()`.
2. Mount after `DatabaseViewerBody` inside the inner width `Box`.
3. `role="row"` / inputs labeled from header names; strip `aria-label` from config or locale default (English JSDoc; UI strings follow existing table locale if a key exists, else a short English default and extend `TmiTableLocaleText` if that file is the SSOT).
4. Do not register the strip with TanStack row selection or dnd.

**Gate:** New RTL test: `rowCreate` set → create inputs in the document; omitted → none. No `getRowId` for a phantom row. `pnpm test:run` for that file.

---

## Phase 3 — Commit + pending

**Goal:** Blur/Enter in a non-empty cell calls `onCreate`; pending chrome on returned id.

**Steps:**

1. Local draft state keyed by `columnId` (or single focused value).
2. On commit: `await onCreate(...)`. Success with a non-empty id: clear that column’s draft and refocus (D9). Reject or empty id: `showRollbackToast`, keep draft. Do **not** call `beginPendingRow` / `endPendingRow` (D12).
3. Empty commit: no call.
4. Failure: toast + keep draft.

**Gate:** Tests with mocked `onCreate`; `pnpm test:run`.

---

## Phase 4 — EOL paste

**Goal:** D4–D5, D11.

**Steps:**

1. `onPaste` on the focused create input; `preventDefault` when text contains a newline (or always when `rowCreate` is set and paste has ≥1 newline).
2. Split lines; skip `trim() === ""`; sequential `await` per line (preserve order; don’t fire-and-forget races).
3. After batch, clear pin and focus same column (D9).

**Gate:** Paste tests (single line = normal paste into input; multi-line = N `onCreate` calls). `pnpm test:run`.

---

## Phase 5 — README

**Goal:** Consumers discover the opt-in.

**Steps:**

1. Integration ledger row: last-row create → `rowCreate` / `onCreate`. If skipped: do not fake a data row.
2. Short subsection: pin, EOL paste, id return, wrap `OptimisticTableFeedbackProvider` for pending.
3. Point at types; no duplicated long tutorial.

**Gate:** Ledger row exists; `pnpm type-check` still green.

---

## Phase 6 — Playground (conditional)

**Goal:** Kitchen-sink demo when workshop is on the branch.

**Steps:**

1. If `playground/` is **not** on `origin/main` / this worktree, **skip** (document in Notes).
2. If it **is**, add `rowCreate` to `kitchenSinkTable.tsx` with in-memory `onCreate` returning a new id and appending state — do not enable it in this PR by copying uncommitted workshop files from the other clone.

**Gate:** Skip **or** `pnpm playground` type-check path already used by workshop (`pnpm type-check` includes playground if present).

**Notes:** Skipped 2026-08-24 — no `playground/` in worktree.

---

## Phase 7 — Pre-PR suite

**Goal:** Same as CONTRIBUTING / CI.

**Steps:** Run `pnpm type-check`, `pnpm type-check:test`, `pnpm lint`, `pnpm format:check`, `pnpm test:run`, `pnpm run build`, `pnpm verify:pack`.

**Gate:** All green. **Do not** add a changeset here — `finish`.

---

## Test plan (human)

- Opt-in: table without `rowCreate` unchanged.
- Pin stays at bottom of the table box while scrolling vertically; columns stay aligned while scrolling horizontally.
- Type in a column, Enter/blur → one create; pin clears; caret in same column.
- Paste three lines → three creates, same column.
- Tree + infinite: pin still viewport-bottom; load-more still in body.
- Row selection / bulk actions ignore the pin.
- Failed `onCreate` → toast; text remains.
