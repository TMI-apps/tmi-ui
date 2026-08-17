# Decisions — TMI table integration walkthrough

Job: `temp_job_tmi-table-integration-walkthrough`
Updated: 2026-08-17

## Closed

| id  | topic                      | status | choice                                                                                                                                                                                                                                                                                 | source     | notes                                                                                                              |
| --- | -------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| D1  | v1 perimeter               | closed | Guidance plus absorb common consumer wrappers into the package (new props/slots); not docs-only                                                                                                                                                                                        | grill-me   | Pays with a package minor and more surface. Human is prompted on wire-up; agent must not invent parallel wrappers. |
| D2  | Absorb vs stay app         | closed | Plumbing only: ColumnDef peer-type adapter, default fill-height, overlay from package (no shim required), optional debug helper. Walkthrough for tree/infinite/reorder/workspace/selection. Edit session, xlsx, feature columns **excluded** (app).                                    | grill-me   | Reusability (export chrome) and UX (edit-session hook) rejected for this job.                                      |
| D3  | Who chooses wire-up        | closed | Agent infers a profile from the screen and may auto-wire that profile from package props. Must walk every catalog row it did not wire: confirm skip, do not build a custom equivalent.                                                                                                 | grill-me   | Full yes/no-before-code rejected for speed; skip-walk is the safety net.                                           |
| D4  | Named profiles             | closed | Profiles = existing package surfaces only: browse-only grid vs workspace+detail. Add-ons (tree, reorder, infinite vs `staticClientVirtualizedList`, overlay, row selection, filter-prompt, optimistic feedback, hero) are catalog rows for infer/skip-walk. No extra product profiles. | grill-me   | clear-winner — alternatives (all-on default, freeform unnamed) duplicate or hide package API.                      |
| D5  | Where protocol lives       | closed | General `.agents` skill = how to add a package component (infer, hook-up, explicit skip). Each importable component has its own README/ledger of features/options in the same shape.                                                                                                   | grill-me   | User override: skill for process; per-component ledger for options.                                                |
| D6  | Ledger coverage            | closed | Every current export gets a ledger, consolidated into that component’s existing README (no parallel catalog).                                                                                                                                                                          | grill-me   | ThumbnailPill, VideoEmbedModal, PersistentStepperList, TMI table.                                                  |
| D7  | Consumer reach             | closed | Publish skill + ledgers in the npm tarball; consumer-setup: copy the skill into the app `.agents/skills` so Cursor attaches it. Ledgers also readable from `node_modules`.                                                                                                             | grill-me   | Cursor does not auto-load skills from node_modules.                                                                |
| D8  | Consumer repo work         | closed | This job is **tmi-ui only**. After bump, consuming apps copy the skill and drop plumbing wrappers. No Lesmateriaal/MILA code in this job.                                                                                                                                              | grill-me   | clear-winner — this repo cannot ship those apps’ trees.                                                            |
| D9  | Ledger placement           | closed | Ledgers are subsections of the **published root README** component sections (TMI table § already SSOT). No second catalog in `src/*/README.md`.                                                                                                                                        | plan-grill | clear-winner — no per-component README exists today; dual files would drift. npm already ships README.             |
| D10 | Debug helper               | closed | Export `logTableLoadSummary` (generic keys only). `TMITable` default stays no-op. Apps pass the helper; no app `TmiTable` wrapper.                                                                                                                                                     | plan-grill | clear-winner vs boolean flag — explicit inject keeps Q3; vs wrapping component — D2 least custom.                  |
| D11 | ColumnDef boundary         | closed | Widen package `columns` to accept app `ColumnDef<TData, any>` (Lesmateriaal adapter).                                                                                                                                                                                                  | plan-grill | clear-winner — that adapter exists only for pnpm type identity.                                                    |
| D12 | Fill-height / overlay code | closed | Fill-height already in 1.4.0 — ledger only. Overlay: import from `@tmi-packages/ui` + `optimizeDeps.include`; no new export path.                                                                                                                                                      | plan-grill | clear-winner — dual context is duplicate copies, not missing API.                                                  |

## Open

None — product perimeter closed. Ledger markdown template and skill filename belong in `plan` (locked below as D9–D12).

## Log

- 2026-08-17T14:36 — D1 closed via grill-me (asked)
- 2026-08-17T14:45 — D2 closed via grill-me (asked)
- 2026-08-17T14:50 — D3 closed via grill-me (asked)
- 2026-08-17T14:50 — D4 closed via grill-me (clear-winner)
- 2026-08-17T14:55 — D5 closed via grill-me (asked, custom: skill + per-component ledger)
- 2026-08-17T15:00 — D6 closed via grill-me (asked)
- 2026-08-17T15:10 — D7 closed via grill-me (asked)
- 2026-08-17T15:10 — D8 closed via grill-me (clear-winner)
- 2026-08-17T15:10 — D9–D12 closed via plan-grill (clear-winner)
