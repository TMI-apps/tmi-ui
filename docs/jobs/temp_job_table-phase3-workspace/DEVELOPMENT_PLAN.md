# Development plan — TMI table Phase 3 (workspace + detail shell)

## Summary

Export workspace, detail/hero shell, unsaved-changes dialog, layout contexts, and optimistic feedback from `@tmi-packages/ui` (target **1.2.0** via Changeset in `finish`). Source already under `src/DataTable/lesmateriaal-import/`. Mechanical exports + theme token fill; do not recopy or rewrite component bodies.

**Handoff:** Lesmateriaal `HANDOFF_PHASE3_TMI_UI.md` (PR #80 merged). Grid stays unexported until Phase 4.

## Phase overview

| Phase | Goal                                                               | Gate                                                       | Status  |
| ----- | ------------------------------------------------------------------ | ---------------------------------------------------------- | ------- |
| 0     | Confirm source + no `@/`                                           | Grep `@/` in `src/` is empty                               | Done    |
| 1     | Extend `createTmiTableTheme` (hero parity + drawer z-index token)  | `pnpm type-check`                                          | Done    |
| 2     | Public Phase 3 exports (`DataTable/index.ts` + `src/index.ts`)     | `pnpm type-check`                                          | Done    |
| 3     | Tests live only under `tests/`; workspace + unsaved dialog covered | `pnpm test:run`                                            | Done    |
| 4     | README + consumer overlay contract                                 | README lists Phase 3; no grid export                       | Done    |
| 5     | Full local suite                                                   | type-check, lint, format, test, build, verify:pack         | Done    |
| 6     | Release prep                                                       | `finish` (changeset minor 1.2.0) — not this implement pass | Pending |

## Conflict & compliance

- **Exports:** Phase 3 subset only. Do **not** export `TMITable`, `DatabaseViewer`, `table/**`, `TmiRowReorderDndProvider`, `PortaledOverlayStackProvider`, `useRecordEditSession`, `RecordExitConfirmState` / `RecordExitPendingAction`.
- **Peers:** No new peers. Overlay stack stays in-package (workspace wraps internally); not a public export. Document that app-level portaled UI uses the same z-index helper (`workspaceDetailDrawerModalZ` / theme token).
- **Theme:** Keep `detailPanelHero` via `buildDetailPanelHeroTokens` (already includes `detailPanelMetaTokens`). Add `tmiTableWorkspace.detailDrawerModalZ` from `workspaceDetailDrawerModalZ`. Augment `src/theme.ts`.
- **ESM:** Re-export with `.js` specifiers. Tests must not emit to `dist` (delete leftover `src/**/*.test.*` duplicates).
- **Docs:** README contents + overlay placement. Changeset in **finish**, not here.
- **Publish:** After merge + Version packages → `1.2.0` + Publish on `main` (OIDC).

## Notes during development

- [Phase 0] `@/` only in ingested markdown docs under `lesmateriaal-import/docs/`, not in `.ts`/`.tsx`.
- [Phase 1] `createTmiTableTheme` still builds `detailPanelHero` (meta label colors via `detailPanelMetaTokens`). Adds `tmiTableWorkspace.detailDrawerModalZ`.
- [Phase 2] Public barrel extended; grid / `TmiRowReorderDndProvider` / overlay provider / `RecordExitConfirmState` not re-exported from `src/index.ts`. Extra helper: `workspaceDetailDrawerModalZ` for app overlay z-index.
- [Phase 3] Workspace + unsaved dialog tests already under `tests/` (74/74). No leftover `src/**/*.test.*` on `main`.
- [Phase 5] type-check, type-check:test, lint (pre-existing ingest warnings only), format, test:run, build, verify:pack green.

## Decisions made

| Decision                             | Context                                        | Outcome                     | User asked?                        |
| ------------------------------------ | ---------------------------------------------- | --------------------------- | ---------------------------------- |
| Export `workspaceDetailDrawerModalZ` | Decision #2 without exporting overlay provider | Public helper + theme token | No (handoff implied)               |
| Skip `DetailPanelHeroStatValue`      | Not on ingest barrel                           | Internal only               | Yes (handoff “if used externally”) |

---

## Phase 0 — Confirm ingest

**Goal:** No recopy; zero `@/` in `src/`.

**Steps:**

1. Confirm Phase 3 files exist under `lesmateriaal-import/tmiTable/`.
2. Grep `@/` under `src/`.

**Gate:** Zero matches for `@/` in `src/`.

---

## Phase 1 — Theme

**Goal:** `createTmiTableTheme` fills hero + workspace drawer z-index.

**Steps:**

1. Verify `buildDetailPanelHeroTokens` still applies meta label colors.
2. Fill `tmiTableWorkspace.detailDrawerModalZ` via `workspaceDetailDrawerModalZ(base)`.
3. Augment `src/theme.ts`.

**Gate:** `pnpm type-check`

---

## Phase 2 — Public API

**Goal:** Consumers import Phase 3 symbols from `@tmi-packages/ui`.

**Steps:**

1. Extend `src/DataTable/index.ts` and `src/index.ts` with the HANDOFF Phase 3 tables (workspace, detail/hero, optimistic). Also export `workspaceDetailDrawerModalZ` for app overlay z-index parity (Decision #2).
2. Export `DetailPanelHeroStatValue` only if already on the ingest barrel — skip (not on `tmiTable/index.ts`).

**Gate:** `pnpm type-check`

---

## Phase 3 — Tests

**Goal:** Workspace + unsaved dialog tests run from `tests/`; `src` tests not emitted.

**Steps:**

1. Delete leftover `src/**/*.test.*` that already live under `tests/`.
2. Keep `TMITableWorkspace.test.tsx` and `UnsavedChangesDialog.test.tsx` under `tests/`.

**Gate:** `pnpm test:run`

---

## Phase 4 — Docs

**Goal:** README matches public API and overlay contract.

**Steps:**

1. Contents table: TMI table Phase 3 (workspace/detail); grid still later.
2. Document: wrap page with `createTmiTableTheme`; workspace installs overlay stack **inside** the detail drawer; do not export that provider; app overlays outside the workspace should use `workspaceDetailDrawerModalZ(theme)` (or the theme token) as `hostModalZ`.

**Gate:** README + `src/index.ts` agree; no `TMITable` / `DatabaseViewer` in public barrel.

---

## Phase 5 — Quality suite

**Goal:** CI-equivalent green.

**Gate:** `pnpm type-check`, `type-check:test`, `lint`, `format:check`, `test:run`, `build`, `verify:pack`

---

## Phase 6 — finish

**Goal:** Minor changeset for 1.2.0.

**Steps:** User/agent runs `finish` then `push` / PR. Do not hand-bump `package.json`.
