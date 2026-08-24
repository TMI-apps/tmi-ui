# Decisions — table last-row create

Job: `temp_job_table-last-row-create`
Updated: 2026-08-24

## Closed

| id  | topic                 | status | choice                                                                                      | source     | notes                                                                                                      |
| --- | --------------------- | ------ | ------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------- |
| D0  | Job vs workshop       | closed | New job `temp_job_table-last-row-create`; do not append to `temp_job_component-workshop`    | plan-grill | clear-winner — workshop is inspect playground; this is TMITable create UX                                  |
| D1  | v1 delivery surface   | closed | Optional TMITable last-row create API (consumer passes a create handler)                    | plan-grill | asked — reusability vs playground-only vs slot/docs                                                        |
| D2  | Create drawer in lib         | closed | Library does not ship a create drawer; last-row is opt-in; consumers may keep their drawers | plan-grill | clear-winner — TMITable has no create drawer today; last-row is additive, not a replacement product |
| D3  | Last-row interaction model   | closed | Blank data-like row; first committed cell (or paste) creates — Airtable/Sheets              | plan-grill | clear-winner — user delegated; ghost/click-to-arm fight multi-row EOL paste into a cell grid        |
| D4  | Multi-row EOL paste in v1    | closed | In scope: paste of newline-separated values creates multiple rows                           | plan-grill | clear-winner — user stated as a need; TMITable has no clipboard path today (greenfield)             |
| D5  | Paste fill shape             | closed | EOL splits into the focused column only (from last/create row)                              | plan-grill | asked — least code vs TSV grid vs whole-grid clipboard                                              |
| D6  | v1 table modes               | closed | Trailing empty row on the **current view** (Airtable) — including tree (last visible row) and serverInfinite (loaded window as the view). Not flat-only. | plan-grill | asked — user: Airtable empty row at bottom of current view / table component                        |
| D7  | Create-row placement         | closed | Pinned to the bottom of the table viewport (not Airtable in-flow). Divert from Airtable.    | plan-grill | asked — discoverability vs Airtable scroll-to-end                                                   |
| D8  | Phantom row vs selection     | closed | Create row is not a selectable data row; load-more stays in the scrolling body               | plan-grill | clear-winner — pin is chrome; selecting it would break bulk actions                                 |
| D9  | After a successful create    | closed | Pinned row clears; focus stays in the same column for the next add                           | plan-grill | clear-winner — rapid-entry; pin is a stable target (unlike Airtable’s moving blank row)             |

| D10 | Create id / pending chrome   | closed | Consumer create handler returns a row id (sync or Promise); library uses existing pending-row feedback | plan-grill | asked — consistency vs temp id vs fire-and-forget                                                   |
| D11 | Paste vs create API          | closed | v1: one create handler; EOL paste calls it once per line (no separate batch API)             | plan-grill | clear-winner — same contract as typing; batch API can wait until paste volume proves it             |
| D12 | Pending-row ownership        | closed | Library does not call `beginPendingRow` / `endPendingRow`. Consumer wires `rowSavePending` + provider. Reject: library `showRollbackToast` (noop if no provider) and keeps draft. Empty id = reject. | review-dev-plan | asked via accept — narrows D10; matches existing table pending (consumer-driven) |
| D13 | Paste batch on reject        | closed | Stop on first failed `onCreate`; keep failed + unsent lines in the pin; do not undo succeeded lines | review-dev-plan | asked via accept |
| D14 | Pattern D5/D7 vs Airtable/Sheets | closed | **C** — keep viewport pin + EOL one-column paste (not in-flow trailing row, not TSV grid) | review-dev-plan | asked via accept — `Acceptable product-specific` |

## Open

None.

## Log

- 2026-08-24 — D0 closed via plan-grill (clear-winner)
- 2026-08-24 — D1 closed via plan-grill (asked): library opt-in API
- 2026-08-24 — D2 closed via plan-grill (clear-winner)
- 2026-08-24 — D3 closed via plan-grill (clear-winner, user-delegated): blank spreadsheet row
- 2026-08-24 — D4 closed via plan-grill (clear-winner): EOL multi-row paste in v1
- 2026-08-24 — D5 closed via plan-grill (asked): EOL one-column fill
- 2026-08-24 — D6 closed via plan-grill (asked): current-view trailing empty row (all those modes)
- 2026-08-24 — D7 closed via plan-grill (asked): pinned to table viewport (divert from Airtable)
- 2026-08-24 — D8–D9 closed via plan-grill (clear-winner)
- 2026-08-24 — D10 closed via plan-grill (asked): handler returns row id
- 2026-08-24 — D11 closed via plan-grill (clear-winner): paste = N calls to the same handler
- 2026-08-24 — D12–D14 closed via review-dev-plan (accepted)
