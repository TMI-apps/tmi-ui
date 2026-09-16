# Development plan — plus activates input

## Summary

- **What:** Clicks on the leading `+` in `PrimaryContainedAutocompleteBar` (and any other `AutocompleteSelectField` `startAdornment`) focus the text input. No extra tab stop. `openOnFocus` unchanged.
- **Why:** The `+` is a decorative SVG in `startAdornment`; the adornment captures pointer events, so the input does not become active.
- **Complexity:** **S** — one field + tests; no API / theme / export change.
- **Plan review:** Not required by complexity (S). **plan-review validate 2026-09-16** findings applied in this file (no blockers).
- **Scope:** Ride `AutocompleteSelectField` `renderAutocompleteInput` startAdornment merge. Changeset **patch** at **finish**.
- **Constraints:** D1–D11 in sibling `DECISIONS.md`. Do not restyle. Do not open the list unless the consumer already set `openOnFocus`. Do not touch `ListRowAddButton` expand. Custom `startAdornment` is a **non-interactive** leading icon (D11).

## Working copy (Git)

| Field    | Value                                                                                                                                                                                                                                                 |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Base     | Current clone (already on `feat/autocomplete-single-fillcell-controlled`)                                                                                                                                                                             |
| Branch   | **`feat/autocomplete-single-fillcell-controlled`** — same file (`AutocompleteSelectField.tsx`) is already modified here. Workflow prefers `feature/*` or `fix/*`; this ride of an existing `feat/` branch is D10, not a new prefix.                   |
| Worktree | This repo: `C:\Users\Lenovo\Documents\AppDev\tmi-ui`. No second worktree (D10).                                                                                                                                                                       |
| Delivery | **finish** = local commit only (changeset patch then). **push** = separate, user-confirmed, no add/commit. Then PR to **`main`**. May share this Autocomplete branch or a later split commit — still finish → push → PR, never direct land on `main`. |

## Phase overview

| Phase | Goal                                   | Gate                                                                                                                         | Status  |
| ----- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------- |
| 1     | Click-through on custom startAdornment | Test: click `+` focuses combobox; no extra `button` role; `pnpm test:run`                                                    | Pending |
| 2     | Quality + public JSDoc                 | `pnpm type-check`; `pnpm type-check:test`; `pnpm lint` on touched files                                                      | Pending |
| 3     | Pre-finish CONTRIBUTING bar            | `pnpm format:check`; `pnpm run build`; `pnpm verify:pack` (full PR checklist at **finish**, including `pnpm test:run` again) | Pending |

## Conflict & compliance

- **Rules:** `.cursor/rules/INDEX.md`, `workflow/RULE.md`, `CONTRIBUTING.md`.
- **Protected files (ask before editing):** `.gitignore`, `tsconfig*.json`, `package.json`, `.cursor/rules/**`, `.cursor/skills/**/SKILL.md`, `.github/workflows/**`. This job must not touch them.
- **Exports / peers / theme:** Unchanged. No new public props. Behavior of existing `startAdornment` is documented as non-interactive (D11) — patch, not a new export.
- **ESM:** Existing relative `.js` imports; add `InputAdornment` from `@mui/material` (already a peer).
- **Docs:** Required JSDoc on **`AutocompleteSelectField.startAdornment`** (public contract). Optional extra line on `PrimaryContainedAutocompleteBar`. No README component-table / installation / consumer-setup change.
- **Tests:** Extend `tests/AutocompleteSelectField.test.tsx` under “Autocomplete primary chrome”.
- **Changesets:** **finish**, not implement. Semver **patch**.
- **Phase vs release bar:** Phases 1–2 are implement gates. Phase 3 + **finish** run the full CONTRIBUTING PR checklist (`type-check`, `type-check:test`, `lint`, `format:check`, `test:run`, `build`, `verify:pack`). Do not treat Phase 1–2 as the merge bar.
- **Risks:** `overflow: hidden` on fill-cell input root must still allow the input to receive the forwarded click. Multiple-mode chips remain in `params.InputProps.startAdornment` — only the **custom** leading node gets `disablePointerEvents`, not chips/tag delete. Callers that passed a _clickable_ `startAdornment` would lose that hit target — in-repo only the decorative `+` uses the prop; D11 makes that the documented contract.
- **Open questions:** None (D1–D11 closed).

## Pattern & precedent

| Field          | Value                                                                                                                 |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Capability** | Decorative input adornment must not steal clicks from the field.                                                      |
| **Precedents** | MUI `InputAdornment` `disablePointerEvents` — documented for non-interactive icons so the input stays the hit target. |
| **Verdict**    | **Aligned.** Alternatives (icon `onClick` + `input.focus()`, or a real `+` button) were rejected in D6/D9.            |

## Scope / out-of-scope

**In:** Wrap custom `startAdornment` so pointer events pass through to the input; test on `PrimaryContainedAutocompleteBar`; document `startAdornment` as non-interactive on the field prop.

**Out:** New add/submit logic; restyle; mobile-specific path; extra tab stop; `ListRowAddButton` expand loop; creatable-row `Add` in the listbox; `MetadataFiltersBar`; forcing list open/closed vs `openOnFocus`; new exports; interactive custom adornments.

## Existing functionality

- `PrimaryContainedAutocompleteBar` passes default `<Add />` as `startAdornment`.
- `renderAutocompleteInput` prepends that node to `params.InputProps.startAdornment` without `disablePointerEvents`.
- `RowStyleMultiSelect` collapsed `+` is `ListRowAddButton` (already focuses after expand) — leave it.
- Tests already mount the bar under `createTmiTableTheme`.

## Phase 1 — Click-through

### Goal

Mouse click on the leading `+` focuses the combobox. Keyboard users keep Tab → input only.

### Steps

1. In `src/AutocompleteSelect/AutocompleteSelectField.tsx`, import `InputAdornment`.
2. When merging a custom `startAdornment` (not `dropdownOnly`), wrap **only** that custom node in `<InputAdornment position="start" disablePointerEvents>` (keep chips/end content as today).
3. Do not add `onClick`, `tabIndex`, or a `button` around `+`.
4. Add a test: render `PrimaryContainedAutocompleteBar`; `userEvent.click` the Add icon (`getByTestId('AddIcon')` or similar MUI svg test id); `expect(combobox).toHaveFocus()`. Assert `queryByRole('button')` is null for that bar (no extra tab stop).
5. Keep the existing mount test.

### Gate

`pnpm test:run` — new case green; existing Autocomplete tests green. Not the merge bar.

## Phase 2 — Quality + public JSDoc

### Goal

Types/lint clean; public prop contract matches D11.

### Steps

1. Update JSDoc on **`AutocompleteSelectField` `startAdornment`**: leading node is non-interactive (`disablePointerEvents`); clicks focus the input. Do not document a clickable adornment API.
2. One-line JSDoc on `PrimaryContainedAutocompleteBar` if it still claims the `+` is only visual: clicks pass through to the field.
3. `pnpm type-check` and `pnpm type-check:test`.
4. `pnpm lint` on touched files.

### Gate

Type-check (incl. tests) and lint pass. Changeset still deferred to **finish**.

## Phase 3 — Pre-finish CONTRIBUTING bar

### Goal

Typical workflow gates besides the Phase 1–2 subset, so implement does not skip pack/build/format.

### Steps

1. `pnpm format:check`
2. `pnpm run build`
3. `pnpm verify:pack`

### Gate

Those three commands pass. **finish** still re-runs the full CONTRIBUTING PR checklist (including `pnpm test:run`) before the local commit.

## Notes during development

## Decisions made
