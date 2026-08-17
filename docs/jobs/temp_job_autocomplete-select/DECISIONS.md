# Decisions — AutocompleteSelect extract

Job: `temp_job_autocomplete-select`
Updated: 2026-08-17

## Closed

| id  | topic                     | status | choice                                                                                                                                              | source     | notes                                                            |
| --- | ------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------- |
| D1  | Landing folder            | closed | `src/AutocompleteSelect/` (sibling of `ThumbnailPill`), not `DataTable/lesmateriaal-import/`                                                        | plan-grill | clear-winner — handoff + CONTRIBUTING one-folder-per-component   |
| D2  | Primary contained visuals | closed | `theme.tmiPrimaryContained` filled by `createTmiTableTheme`; bar + `ListRowAddButton` `visualVariant="primary"` share it                            | plan-grill | clear-winner vs MuiButton overrides / Lesmateriaal `#CF13B3` hex |
| D3  | Overlay stacking          | closed | Reuse `usePortaledOverlayPopperZIndex` / `PortaledOverlayStackProvider` already exported                                                            | plan-grill | clear-winner — second context would split module instances       |
| D4  | Working copy              | closed | Branch `feature/autocomplete-select` from `origin/main` in this clone (tree was clean; prior branch `fix/test-import-paths` left intact)            | plan-grill | clear-winner vs implementing on the unrelated branch             |
| D5  | Large-field lint          | closed | Prefer one-line eslint disable if complexity/hooks compiler blocks the ~1200-line field; no large refactor in this publish                          | plan-grill | clear-winner — handoff                                           |
| D6  | Dutch copy                | closed | Keep Dutch strings in `MetadataFiltersBar` / remove slot for v1                                                                                     | plan-grill | clear-winner — Lesmateriaal-only consume                         |
| D7  | How 1.6.0 reaches npm     | closed | Changeset **minor** on the PR; Version packages + Publish after merge to `main`. Do not hand-bump `package.json` or `pnpm publish` in this session. | plan-grill | asked — pipeline vs same-session publish                         |

## Open

None.

## Log

- 2026-08-17T16:50 — D1–D6 closed via plan-grill (clear-winner)
- 2026-08-17T16:55 — D7 closed via plan-grill (asked)
