# Agent status — temp_job_tmitable_tmi_ui_extract

| Field | Value |
|-------|-------|
| Complexity | L |
| Strategy | C — Extract with injection boundaries |
| Plan review | Done: 2026-08-12 |
| Pattern review | Filled in IMPLEMENTATION_PLAN.md § Pattern & precedent |
| MILA DB handoff | Not required |
| Prerequisites | **Satisfied** — CHANGELOG `0.119.0`–`0.121.0` on `develop` |
| Branch | `feature/tmitable-tmi-ui-extract-phase1` |

## Current phase

| Phase | Status |
|-------|--------|
| 0 — Inventory & freeze | **Done** — `LEAK_MANIFEST.md` |
| 1 — Injection boundaries (in-repo) | **Done** (pending PO z-index matrix + staging smoke) |
| 2 — TMI-ui package scaffold + satellites | Not started |
| 3 — Workspace + detail shell | Not started |
| 4 — Grid core (`DatabaseViewer`) | Not started |
| 5 — Consumer cutover + shim removal | Not started |
| 6 — Docs, rules, release | Not started |

## Phase 1 delivered (2026-08-14)

- `TmiRowReorderDndProvider` in `tmiTable/context/`; `DatabaseViewerBody` uses it
- `LesmateriaalGridDndContext` → barrel re-export alias (home grid unchanged)
- `useRecordEditSession` removed from tmiTable barrel
- `TmiTableLocaleText` on `OptimisticTableFeedbackProvider`
- `debug.onTableLoadSettled` injection; `TMITable` wires `logTableLoadSummary`
- Deep-import cleanup (Lesmateriaal hero/bookmark/uitgelicht → barrel)
- ESLint ban on deep `tmiTable/**` imports from features/pages/shared

## PO gates still open

1. Z-index matrix on staging (Decision #2)
2. Lesmateriaal admin row reorder smoke
3. Export smoke on all browse tables (regression check after branch merge)
