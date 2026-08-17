# Development plan — AutocompleteSelect family for `@tmi-packages/ui`

## Summary

- **What:** Extract the AutocompleteSelect family from Lesmateriaal into `@tmi-packages/ui` as public components.
- **Why:** Lesmateriaal `chore/adopt-tmi-ui-1.5.0` needs a package home (no `src/DataTable/lesmateriaal-import/` dump). Target **minor 1.6.0** via Changesets after merge (D7).
- **Complexity:** **M** — new public API, theme token, seven files, README ledger.
- **Plan review:** Pattern & precedent filled in-plan; handoff copy-map is locked. Formal six-lens review skipped so extract can proceed.
- **Scope:** Copy map + import rewrites + `tmiPrimaryContained` + root exports + thin test + README Autocomplete section. Changeset at **finish**. No same-session npm publish (D7).

## Working copy (Git)

| Field    | Value                                             |
| -------- | ------------------------------------------------- |
| Base     | `origin/main` (`1.5.0`)                           |
| Branch   | `feature/autocomplete-select`                     |
| Worktree | This clone (was clean on `fix/test-import-paths`) |
| Delivery | PR to `main`; changeset minor; no hand-bump       |

## Phase overview

| Phase | Goal                                      | Gate                                                                   | Status  |
| ----- | ----------------------------------------- | ---------------------------------------------------------------------- | ------- |
| 1     | Copy seven files + barrel                 | Files under `src/AutocompleteSelect/`; not under `lesmateriaal-import` | done    |
| 2     | Rewrite imports to package-relative `.js` | `rg "@/" src/AutocompleteSelect` empty                                 | done    |
| 3     | Theme token + primary visuals             | Bar + primary `ListRowAddButton` use `tmiPrimaryContained`             | done    |
| 4     | Root exports + README                     | Export table match; Autocomplete section present                       | done    |
| 5     | Thin smoke test                           | `pnpm test:run`                                                        | done    |
| 6     | Quality suite                             | type-check, lint, format, test, build, `verify:pack`                   | done    |
| 7     | finish                                    | Changeset minor (not this phase)                                       | pending |

## Conflict & compliance

- **Peers:** No new peers. `@mui/icons-material` already required; document Autocomplete in README contents + icons note.
- **Exports:** `src/AutocompleteSelect/index.ts` **and** `src/index.ts`. `package.json` `exports` stays `"."`. Do **not** export `THUMBNAIL_PILL_REMOVE_ACTION_SX`.
- **Theme:** Augment `src/theme.ts`; fill in `createTmiTableTheme`. Components `resolveTmiPrimaryContained` if token absent. Do **not** copy `brandTokens` / `#CF13B3`. Consumers must not duplicate module augmentation.
- **ESM:** Relative `.js` imports (`tsconfig.build.json` NodeNext).
- **Docs:** README Contents + Autocomplete section + Integration ledger + Theme bullet for `tmiPrimaryContained`. Update adopt-skill description/anchor. `docs/consumer-setup.md` only if install flow changes (it should not).
- **Changesets:** **finish**, not implement. Semver **minor**.
- **Risks:** ~1200-line field may trip react-hooks compiler eslint (D5). Circular imports if AutocompleteSelect barrels DataTable index — import specific modules instead.

## Pattern & precedent

| Field                | Value                                                                                                                                                                                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Capability**       | Shared combobox / multi-select field + primary “add row” chrome for table/detail editors.                                                                                                                                                                                                                    |
| **Precedents**       | MUI `Autocomplete`; MUI X / design-system packages shipping Autocomplete wrappers; theme tokens for brand contained buttons (MUI `palette` + component tokens rather than app hex in library code).                                                                                                          |
| **Aspects reviewed** | Composition; API & integration; extensibility; accessibility (thin).                                                                                                                                                                                                                                         |
| **Findings**         | **Composition:** portaled list + host-modal z-index matches drawer-over-grid products. **API:** option `{id,label}` is a common combobox contract. **Extensibility:** `thumbnailPlaceholder` slot keeps domain art in the app. **A11y:** reuse MUI Autocomplete; Dutch strings are v1 product-specific (D6). |
| **Verdict**          | `Acceptable product-specific` — extract of an existing MUI Autocomplete wrapper, not a new picker paradigm.                                                                                                                                                                                                  |

## Scope / out-of-scope

**In:** Seven source files (copy map), types, `tmiPrimaryContained`, listed root exports, thin test, README Autocomplete + ledger, adopt-skill anchors.

**Out:** `ViewFiltersToolbar`, `GroupLensAutocomplete`, feature hooks, `LesmateriaalTagPillPlaceholder`, `VideoEmbedDialog`, `useRecordEditSession`, `DoelenRowStyle*`. Large Autocomplete refactor. Same-session `pnpm publish` (D7).

## Public API contract

| Symbol                                                    | Ship? |
| --------------------------------------------------------- | ----- |
| `AutocompleteSelectField`, `AutocompleteSelectFieldProps` | Yes   |
| `AutocompleteSelectOption`                                | Yes   |
| `PrimaryContainedAutocompleteBar` (+ props)               | Yes   |
| `MetadataFiltersBar`, `MetadataFilterFieldConfig`         | Yes   |
| `ListRowAddButton`, `ListRowAddButtonProps`               | Yes   |
| `ThumbnailPillRemoveTableRowSlot`                         | Yes   |
| `RowStyleMultiSelect`, `RowStyleMultiSelectProps`         | Yes   |
| `RowStyleReadonlyRow`, `rowStyleTableRowShellSx`          | Yes   |
| `THUMBNAIL_PILL_REMOVE_ACTION_SX`                         | No    |

## Notes during development

- [Phase 2] Zero `@/` imports under `src/AutocompleteSelect/`.
- [Phase 3] `tmiPrimaryContained` defaults to solid `palette.primary.main` + Lesmateriaal-style mode shadows (no `#CF13B3`).
- [Phase 5/6] `react-hooks/set-state-in-effect` disabled at top of `AutocompleteSelectField.tsx` (D5).
- [Phase 6] `assert-dist-esm-imports` failed on JSDoc `import("./ListRowAddButton")` — switched to `{@link ListRowAddButton}`. `pnpm test:run` 97 passed; build + `verify:pack` OK.

## Decisions made

## Phases

### Phase 1 — Copy

**Goal:** Landing zone exists with the seven renamed sources.

**Steps:**

1. Create `src/AutocompleteSelect/`.
2. Copy from Lesmateriaal per handoff copy map (sources already renamed there).

**Gate:** Seven files present; path is not under `lesmateriaal-import`.

### Phase 2 — Imports

**Goal:** Zero `@/` and zero `@tmi-packages/ui` self-imports.

**Steps:**

1. Map aliases per handoff Rewrites table; use `.js` specifiers.
2. `ThumbnailPill` / `DetailPanelSectionHeading` / `TableRowActionButton` / overlay / skin: package-internal relative paths (not the DataTable root barrel if that risks cycles).

**Gate:** grep `@/` empty under `src/AutocompleteSelect/`.

### Phase 3 — Theme

**Goal:** Shared primary-contained token.

**Steps:**

1. Augment `Theme` / `ThemeOptions` with `tmiPrimaryContained: { gradient, restShadow, activeShadow }`.
2. `createTmiTableTheme` fills defaults from `palette.primary.main` (solid) + mode-aware shadows (Lesmateriaal shadow _formula_, not brand hex).
3. `PrimaryContainedAutocompleteBar` and `ListRowAddButton` `visualVariant="primary"` read the same resolver.

**Gate:** No `brandTokens` / `#CF13B3` in the new folder; both call sites use the token.

### Phase 4 — Exports + README

**Goal:** Public contract + consumer docs.

**Steps:**

1. `src/AutocompleteSelect/index.ts` + `src/index.ts`.
2. README Contents, Autocomplete section (handoff snippet), ledger, theme bullet, smoke-test line, adopt-skill trigger + README anchor. Minimum consumer version `^1.6.0`.

**Gate:** Export table matches; README Autocomplete section present.

### Phase 5 — Test

**Goal:** Thin mount smoke.

**Steps:**

1. `tests/AutocompleteSelectField.test.tsx`: render field with `options={[{ id: "1", label: "A" }]}` inside `PortaledOverlayStackProvider`; assert it mounts.

**Gate:** `pnpm test:run`.

### Phase 6 — Quality

**Goal:** CI-aligned suite green.

**Steps:** Run `pnpm type-check`, `pnpm type-check:test`, `pnpm lint`, `pnpm format:check`, `pnpm test:run`, `pnpm run build`, `pnpm verify:pack`. Apply D5 if lint blocks the field.

**Gate:** All commands exit 0.

### Phase 7 — finish (later)

**Goal:** Changeset minor; local commit when user runs finish. npm `1.6.0` after merge + Version packages + Publish (D7).
