# Development plan — component workshop (`@tmi-packages/ui`)

## Summary

- **What:** Local Vite **workshop** in this repo: two one-pagers with sidebar jump-links. **Visuals** — one live render of each visual part, plus one kitchen-sink `TMITable`. **Docs** — render existing markdown (README + `docs/` SSOT), not copied text.
- **Why:** Inspect components without cloning consumer apps. Hygiene D3 only deferred this for that job.
- **Complexity:** **M** — new local app, markdown pipeline, kitchen-sink table fixtures (Phase 5 is the main risk).
- **Plan review:** **Done 2026-08-24** — six-lens `review-dev-plan`; gates, Phase 5 fixture contract, and playground validation patched below.
- **Scope:** Local `pnpm playground` only. Not published. No GitHub Pages. No Storybook/Ladle.

## Working copy (Git)

| Field             | Value                                                                                                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Base              | Fresh `origin/main` — do not scaffold on uncommitted hygiene or unrelated branches                                                                                    |
| Branch            | `feature/component-workshop`                                                                                                                                          |
| Worktree          | This clone only (D9). Stash or finish hygiene files before switching branch.                                                                                          |
| Hygiene collision | If `feature/library-hygiene-2` merges P8 (flatten `lesmateriaal-import/`) before this PR lands, **rebase** workshop onto `main` and re-verify playground aliases/HMR. |
| Delivery          | One PR. **No changeset** (not a published API).                                                                                                                       |

## Phase overview

| Phase | Goal                                      | Gate                                                                       | Status   |
| ----- | ----------------------------------------- | -------------------------------------------------------------------------- | -------- |
| 0     | Branch from clean `main`                  | `feature/component-workshop`; no hygiene leftovers                         | **Done** |
| 1     | Vite scaffold + playground validation     | `pnpm playground`; `verify:pack` no `playground/`; lint on `playground/**` | **Done** |
| 2     | Shell: theme, overlay, routes, scroll TOC | Visuals ↔ Docs; hash scrolls **main column**; overlay smoke                | **Done** |
| 3     | Docs one-pager from real files            | README + `docs/` SSOT; link resolver; no `docs/jobs`                       | **Done** |
| 4a    | Visuals: pill, video, stepper             | Router + `appBar`; VideoEmbed YouTube/Vimeo                                | **Done** |
| 4b    | Visuals: autocomplete + satellites        | Each listed section mounts live                                            | **Done** |
| 5     | Kitchen-sink table                        | Ledger-aligned fixture; interactive paths (see gate)                       | **Done** |
| 6     | CONTRIBUTING/README pointer               | `pnpm playground` documented                                               | **Done** |
| 7     | Finish / pre-PR suite                     | Full workflow commands green (incl. playground TS/lint/format)             | **Done** |

## Conflict & compliance

- **Rules:** `.cursor/rules/INDEX.md`, `workflow/RULE.md`, `CONTRIBUTING.md`.
- **Protected files:** This job **must** edit `package.json` (Vite, scripts, devDeps, `type-check` scope). **Do not edit:** `.github/workflows/**` (D8). **Ask before:** `.cursor/rules/**`, `.gitignore` only if playground build output needs ignore.
- **Peers:** Playground is a **dev consumer**. Vite, React, MUI, TanStack, dnd-kit, `react-router-dom` as **devDependencies** only. Import library **source** for HMR; also add aliases for `./table` and `./autocomplete` subpaths so published entrypoints do not drift from root alias alone.
- **Exports / theme:** `createTmiTableTheme(createTheme())` + `PortaledOverlayStackProvider`. Import `src/index.ts` once for theme augmentation. Do not duplicate module augmentation in playground.
- **npm `files`:** Keep allowlist. **`verify-pack.mjs` must fail** if any tarball path contains `playground/`.
- **Playground validation (no CI workflow):** `tsconfig.playground.json`; fold into `pnpm type-check`. Extend `eslint.config.js` and `format:check` / `format` Prettier globs to `playground/**/*.{ts,tsx}`.
- **Changesets:** None.
- **CI:** Existing GitHub Actions unchanged. Playground quality enforced via extended root scripts (D8).

### Extensibility contract

| Change                                                   | Maintainer action                                                                                                               |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| New **visual** export                                    | Add one row to `playground/src/visualSections.tsx` (`id`, title, `render`) — sidebar + section stay in sync; no second catalog. |
| New **docs** SSOT file under `docs/` or `docs/handoffs/` | Appears automatically via glob (exclude `docs/jobs/**`).                                                                        |
| New **peer** for a component                             | Add devDependency + update kitchen-sink or section mocks if needed.                                                             |

### Planned paths

| Path                                     | Role                                                                                                                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `playground/index.html`                  | Vite entry                                                                                                                                                                      |
| `playground/vite.config.ts`              | Aliases: `@tmi-packages/ui` → `../src/index.ts`; `@tmi-packages/ui/table` → `../src/DataTable/index.ts`; `@tmi-packages/ui/autocomplete` → `../src/AutocompleteSelect/index.ts` |
| `playground/tsconfig.json`               | Extends repo TS; included in root `type-check`                                                                                                                                  |
| `playground/src/main.tsx`                | Router: `/` visuals, `/docs` docs                                                                                                                                               |
| `playground/src/VisualsPage.tsx`         | One-pager layout (scroll container + sticky sidebar)                                                                                                                            |
| `playground/src/DocsPage.tsx`            | Markdown sections + file-grouped sidebar                                                                                                                                        |
| `playground/src/visualSections.tsx`      | Registry `{ id, title, render }[]` for Visuals TOC                                                                                                                              |
| `playground/src/docsSources.ts`          | `import.meta.glob` for markdown `?raw`; exclude `jobs/**`                                                                                                                       |
| `playground/src/markdownLinkResolver.ts` | README `#anchor` + relative `docs/…` links                                                                                                                                      |
| `playground/src/kitchenSinkTable.tsx`    | Mock data + ledger-commented `TMITable` fixture                                                                                                                                 |
| `playground/src/theme.ts`                | `createTmiTableTheme(createTheme())`                                                                                                                                            |

## Pattern & precedent

| Field                    | Value                                                                                                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Capability**           | In-repo component workshop for a published React library                                                                                                                                                                 |
| **Aspects reviewed**     | Dev surface (CSF vs custom), docs SSOT, npm boundary, validation without CI deploy, kitchen-sink fidelity                                                                                                                |
| **Precedents**           | Storybook/Ladle (CSF, Controls, a11y addons, story URLs); MUI/Radix docs (markdown SSOT + live demos); lib `playground/`/`dev/` (Vite, source alias, excluded from `files`)                                              |
| **Verdict**              | **Acceptable product-specific** — custom Vite pages (D1) instead of CSF; aligns with “preview pages” and local inspect without consumer clones                                                                           |
| **D1 tradeoff (waived)** | We lose: per-variant story URLs, Storybook Controls, a11y panel, Chromatic/Playwright story runners. We gain: designed one-pagers, real markdown rendering, no Storybook config/addon tax. Owner chose pages explicitly. |
| **Risks**                | Kitchen-sink fixture drifts from README ledger; manual visual registry; no CI playground build → bitrot unless type-check/lint/format cover `playground/`                                                                |

### Aspect findings

| Aspect            | Industry norm                | This plan                         | Notes                                       |
| ----------------- | ---------------------------- | --------------------------------- | ------------------------------------------- |
| Component inspect | Storybook/Ladle CSF          | Custom Visuals one-pager          | D1 waiver; registry in `visualSections.tsx` |
| Docs              | Hosted docs site or GitHub   | In-app render of real files       | Strong SSOT alignment                       |
| npm boundary      | Exclude dev app from `files` | `verify-pack` negative assert     | Must-fix gate                               |
| Validation        | Often CI builds stories      | Local scripts only (D8)           | Extend root type-check/lint/format          |
| Table demo        | Story per capability         | One kitchen-sink + ledger comment | Mutual exclusions documented in fixture     |

## Scope / out-of-scope

**In:** Local Vite; two one-pagers; real markdown via glob; visual registry; kitchen-sink with ledger comment; CONTRIBUTING update; optional Vitest smoke for kitchen-sink import.

**Out:** Storybook/Ladle; GitHub Pages; consumer repo clones; publishing playground; `docs/jobs` on docs page; exhaustive per-ledger-row table snapshots; workflow YAML; duplicating README prose; standalone mounts for every table shell if reachable via kitchen-sink interaction.

## Existing functionality

- Library: `src/index.ts` public barrel. Visual families: ThumbnailPill, VideoEmbedModal, PersistentStepperList, Autocomplete parts, TMI table + satellites.
- Consumer visual checks today: CONTRIBUTING `pnpm link` / `file:` — workshop becomes primary inspect loop.
- Tests: `tests/AutocompleteSelectField.test.tsx` — pattern for theme + overlay mount smoke.

## User stories

- Maintainer runs `pnpm playground`, opens Visuals, sidebar-jumps to a part, inspects live UI.
- Maintainer opens Docs, sees the same README/`docs` files as GitHub, sidebar-jumps to a heading/file.
- Maintainer does not clone other TMI repos for this inspect loop.

## Phases

### Phase 0 — Branch

**Goal:** Isolated branch from clean `main`.

**Steps:** Commit or stash hygiene and any unrelated work. `git fetch`. Checkout `feature/component-workshop` from `origin/main` (not from hygiene branch).

**Gate:** `git status` clean; branch name matches D9; `git merge-base HEAD origin/main` is current `main`.

### Phase 1 — Scaffold

**Goal:** Vite React-TS app under `playground/` with playground in repo quality scripts.

**Steps:**

1. Add Vite + `@vitejs/plugin-react` as devDependencies. Script `playground` → `vite --config playground/vite.config.ts`. Optional `playground:build` for local sanity (not CI).
2. Aliases: root barrel + `./table` + `./autocomplete` subpaths.
3. `playground/tsconfig.json`; extend root `type-check` to include it.
4. Extend `eslint.config.js` and Prettier `format` / `format:check` globs to `playground/**/*.{ts,tsx}`.
5. Extend `scripts/verify-pack.mjs`: **throw** if any tarball line contains `playground/`.

**Gate:** `pnpm playground` serves; `pnpm verify:pack` passes with no `playground/` paths; `pnpm lint` passes on `playground/`; `pnpm format:check` includes playground.

### Phase 2 — App shell

**Goal:** Two routes, theme, overlay provider, sticky sidebar, hash navigation on the **main scroll column**.

**Steps:**

1. `react-router-dom`: top nav Visuals | Docs; routes `/` and `/docs`.
2. Shared layout: **sticky sidebar** + **overflow scroll on main column** (not `window`). `scrollIntoView` / hash targets use section `id`s.
3. `PortaledOverlayStackProvider` + `createTmiTableTheme(createTheme())` at app root.
4. Overlay smoke section (minimal): Autocomplete popper or placeholder popper + note for Phase 5 detail drawer z-index check.

**Gate:** Browser — switch routes; sidebar click scrolls the **main column** to the section; primary Autocomplete chrome is themed; overlay provider mounted.

### Phase 3 — Docs page

**Goal:** Render real markdown files without duplicated prose.

**Steps:**

1. `docsSources.ts`: `import.meta.glob` for `README.md`, `docs/**/*.md`, `docs/handoffs/**/*.md` with `?raw`; filter out paths matching `jobs/`.
2. `react-markdown` + GFM. Sidebar grouped by **file** then headings (not one flat TOC across README).
3. `markdownLinkResolver.ts`: resolve README `[§ …](#anchor)` and relative `docs/…` links to in-app hash navigation; external `https://` unchanged; `.agents/skills/` links → GitHub URL or “open in repo” hint.

**Gate:** Edit README locally → refresh → text updates. Sidebar has no `docs/jobs` entries. Clicking a relative `docs/installation.md` link navigates within Docs (not 404).

### Phase 4a — Visuals (pill, video, stepper)

**Goal:** Router-backed pills and modal/stepper demos.

**Steps:**

1. `visualSections.tsx` registry started.
2. `ThumbnailPill`: default + `variant="appBar"` inside `MemoryRouter` / `BrowserRouter` shared with app nav; `to=` navigation works.
3. `VideoEmbedModal`: trigger button; YouTube and Vimeo examples.
4. `PersistentStepperList`: checked/unchecked via mock props or isolated storage key.

**Gate:** Sidebar sections mount live; pill `to=` navigates; video modal opens for both providers.

### Phase 4b — Visuals (autocomplete + satellites)

**Goal:** One mount per non-table visual export (D7).

**Steps:** Registry entries for: `AutocompleteSelectField`, `ListRowAddButton`, `MetadataFiltersBar`, `PrimaryContainedAutocompleteBar`, `RowStyleMultiSelect`, `RowStyleReadonlyRow`, `ThumbnailPillRemoveTableRowSlot`, `TableRowActionButton`, `TableRowThumbnailShell`, `TableRowThumbnailPlaceholder`, `DataTableTruncatedText`, `DataTableTruncatedOverflow`, `AirtableAttachmentThumbnailCell` (mock URLs only). Skip hooks/utils/sx-only exports.

**Gate:** Sidebar lists all registry entries; each section shows a live control.

### Phase 5 — Kitchen-sink table

**Goal:** One ledger-aligned `TMITable` / workspace fixture with documented mutual exclusions (D7).

**Steps:**

1. Single file `kitchenSinkTable.tsx` with **ledger comment block** at top: maps each README integration-ledger capability to props enabled in this fixture.
2. Client data only. Required: `serverInfinite` shape with `staticClientVirtualizedList` for local rows (no fake paginator).
3. Enable together where types allow: selection, tree expand, reorder (**column sort off** during reorder demo), detail/hero workspace, optimistic feedback if required to mount, overlay stack.
4. **Document exclusions in fixture comment** (not simultaneous UI):
   - `filterPromptActive` hides/collapses grid — do not claim “filter prompt + full grid” in one static view; demo filter prompt in a separate registry section or toggle if cheap.
   - Column sort active blocks row reorder — reorder gate uses sort-off state.
5. Optional: Vitest smoke importing fixture module (no full browser) — catches alias/import regressions.

**Gate:** Fixture compiles; table renders rows; **all of:** open detail/hero, select a row, expand a tree row, reorder a row (sort off). Autocomplete popper + open detail drawer without z-index clash. No network.

### Phase 6 — Docs for maintainers

**Goal:** CONTRIBUTING + README point at `pnpm playground`.

**Steps:** Short subsection — primary visual inspect loop; optional `playground:build`; PR checklist mentions playground type-check/lint/format. Do not rewrite ledgers.

**Gate:** Repo search finds `pnpm playground` in CONTRIBUTING or README.

### Phase 7 — Finish / pre-PR

**Goal:** Full workflow suite before merge.

**Steps:** Run in order: `pnpm format:check`, `pnpm lint`, `pnpm type-check`, `pnpm type-check:test`, `pnpm test:run`, `pnpm run build`, `pnpm verify:pack`.

**Gate:** All commands pass. Tarball still has no `playground/`. Optional Vitest kitchen-sink smoke passes if added in Phase 5.

## Notes during development

- 2026-08-24 — Vite bumped to **8.2.2** so `@vitejs/plugin-react@6` peer resolves (vitest + playground share config).
- 2026-08-24 — Kitchen-sink fixture in `playground/src/kitchenSinkFixture.ts` + smoke test `tests/playgroundKitchenSink.test.ts`.

## Decisions made

| Decision                       | Context                      | Outcome                                                                         | User asked?        |
| ------------------------------ | ---------------------------- | ------------------------------------------------------------------------------- | ------------------ |
| Plan review patches            | `review-dev-plan` 2026-08-24 | Gates, Phase 4 split, Phase 7 finish, fixture exclusions, playground validation | No (review accept) |
| Kitchen-sink mutual exclusions | D7 “all on” vs runtime       | Ledger comment + exclusions for filter-prompt vs grid and sort vs reorder       | No (review accept) |
| Docs glob vs manual catalog    | SSOT drift risk              | `import.meta.glob` + exclude jobs                                               | No (review accept) |
| No CI playground build         | D8                           | type-check/lint/format on playground instead                                    | No (review accept) |
