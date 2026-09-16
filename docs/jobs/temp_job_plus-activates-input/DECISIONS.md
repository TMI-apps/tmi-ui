# Decisions — plus activates input

Job: `temp_job_plus-activates-input`
Updated: 2026-09-16

## Closed

| id  | topic                   | status | choice                                                                                                                                                           | source     | notes                                                                                         |
| --- | ----------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------- |
| D1  | Problem + success       | closed | After + activate, focus in text input only (cursor, keyboard ready). Not dropdown-open, not add-mode.                                                            | grill-me   | asked                                                                                         |
| D2  | Perimeter               | closed | All comparable +/add autocomplete bars in this lib; + click focuses the input. Keyboard: Tab to input (see D6).                                                  | grill-me   | asked B+C; D6 softened Enter/Space-on-+                                                       |
| D3  | Non-goals               | closed | Will NOT: new add/submit/empty-value logic (excluded); restyle + or bar (excluded); separate mobile/touch path (excluded). Dropdown-open on + deferred (D1).     | grill-me   | asked                                                                                         |
| D4  | Ride vs new             | closed | Ride AutocompleteSelectField startAdornment path so + click focuses input                                                                                        | grill-me   | asked — not bar-only fork                                                                     |
| D5  | openOnFocus vs +        | closed | Respect consumer `openOnFocus` (default false → list stays closed). Same as focusing the input itself.                                                           | grill-me   | clear-winner — rejected force-closed and force-open                                           |
| D6  | + tab stop              | closed | No extra tab stop on +. Mouse on + focuses input; keyboard users Tab to the input.                                                                               | grill-me   | asked — D2 Enter/Space-on-+ dropped                                                           |
| D7  | ListRowAddButton expand | closed | Will NOT touch collapsed `ListRowAddButton` → expand → `input.focus()` loop                                                                                      | grill-me   | clear-winner — already does the job; rejected re-wiring that +                                |
| D8  | Missing +               | closed | `startIcon={null}` / no startAdornment: no extra focus behavior                                                                                                  | grill-me   | clear-winner — nothing to click                                                               |
| D9  | Adornment click-through | closed | Wrap custom `startAdornment` in MUI `InputAdornment` with `disablePointerEvents` so clicks hit the input. No tab stop, no focus() helper.                        | plan-grill | clear-winner — rejected onClick+focus (extra JS) and icon-only CSS (wrapper still captures)   |
| D10 | Working copy            | closed | Implement on current clone branch `feat/autocomplete-single-fillcell-controlled` (same `AutocompleteSelectField.tsx` already dirty). No extra worktree.          | plan-grill | clear-winner — rejected worktree-from-main (same file conflict)                               |
| D11 | startAdornment contract | closed | Public `AutocompleteSelectField.startAdornment` is a non-interactive leading icon; `disablePointerEvents` so clicks focus the input. Document on the field prop. | plan-grill | clear-winner after plan-review — no in-repo clickable adornment; rejected silent default flip |

## Open

None.

## Log

- 2026-09-15 — D1–D3 closed via grill-me (asked)
- 2026-09-16 — D4 closed via grill-me (asked); D5 closed clear-winner
- 2026-09-16 — D6 closed via grill-me (asked); D7–D8 closed clear-winner
- 2026-09-16 — D9–D10 closed via plan-grill (clear-winner)
- 2026-09-16 — D11 closed via plan-grill (clear-winner after plan-review validate)
