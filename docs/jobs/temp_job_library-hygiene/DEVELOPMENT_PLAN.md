# Development plan — library hygiene (`@tmi-packages/ui`)

## Summary

- **What:** Cleanup of the audit, shipped as **two PRs / two versions** under this one plan. **1.8.0** is the consumer contract (optional peers, subpaths, deprecations, Autocomplete tests, handoff). **1.8.1** is internal (flatten ingest folder, then Autocomplete + table file splits). **2.0** (gated) removes deprecated public names after apps skip-walk. **1.7.0** already shipped (row-reorder `dropPlacement`); do not retarget that version.
- **Why:** The published package still looks like a Lesmateriaal extract (`lesmateriaal-import/`, required TanStack/dnd peers for pill-only apps, fat root barrel, 1,290-line Autocomplete field with one smoke test).
- **Complexity:** **L** — public contract, large internal moves, consumer coordination.
- **Plan review:** **Done 2026-08-24** — six-lens review applied; D15–D22 record post-review and worktree choices.
- **Scope:** Track A1 → **1.8.0 minor**. Track A2 → **1.8.1 patch**. Track B → **2.0.0 major**, not started until 1.8.x is on npm and consumers skip-walk.

## Working copy (Git)

| Field    | Value                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Base     | `origin/main` at Autocomplete **1.6.x** (fast-forwarded 2026-08-24).                                                                                                |
| Branch   | **`feature/library-hygiene-2`** (this clone). Do not check out `feature/library-hygiene` here — it is locked by the broken worktree `tmi-ui-library-hygiene` (D22). |
| Worktree | **This repo:** `C:\Users\Lenovo\Documents\AppDev\tmi-ui`. The sibling worktree is unusable in Cursor; do not `move_agent_to_root` there.                            |
| Delivery | Two PRs to `main`. Changeset **minor** on PR-1 (1.8.0). Changeset **patch** on PR-2 (1.8.1). Track B later + **major**. No same-session `pnpm publish`.             |

## Phase overview

| Phase | Track | Goal                                                | Gate                                                                                       | Status                                          |
| ----- | ----- | --------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| 0     | A1    | Branch on this clone                                | `feature/library-hygiene-2` checked out here                                               | **Done**                                        |
| 1     | A1    | Ingest markdown cleanup                             | No `lesmateriaal-import/docs` trees; `INGEST.md` is a short pointer                        | **Done**                                        |
| 2     | A1    | Autocomplete **tests** + encoding (no split)        | `userEvent` select/add/remove; theme-wrapped primary chrome; `pnpm test:run`               | **Done**                                        |
| 3     | A1    | Optional peers + README matrix                      | `peerDependenciesMeta` set; install vs runtime spelled out; `pnpm type-check`              | **Done**                                        |
| 4     | A1    | Subpath `exports` + `verify-pack` + theme           | `"."`, `./table`, `./autocomplete` in tarball; theme side-effect documented                | **Done**                                        |
| 5     | A1    | JSDoc deprecations (**no** new `Attachment*` names) | Deprecated names still export; compat test; README lists them once                         | **Done**                                        |
| 6     | A1    | Consumer handoff + adopt skill                      | `docs/handoffs/consumer-hygiene-1.8.md`; skill `forPackageVersion` 1.8.0                   | **Done**                                        |
| 7     | A1    | Quality suite + finish **1.8.0**                    | Full CI commands; changeset **minor**                                                      | **Done** (local suite; changeset at **finish**) |
| 8     | A2    | Flatten `lesmateriaal-import/`                      | Zero `lesmateriaal-import` under `src/` `tests/` `eslint.config.js`; `pnpm test:run`       | Pending                                         |
| 9     | A2    | Autocomplete **split** (after flatten)              | Field not one ~1290-line file; public props unchanged; `pnpm test:run`                     | Pending                                         |
| 10    | A2    | Split oversized table files + ESLint shrink         | Three shells under 700 lines; waiver glob narrower than all of `tmiTable/**`               | Pending                                         |
| 11    | A2    | Quality suite + finish **1.8.1**                    | Full CI commands; changeset **patch**                                                      | Pending                                         |
| 12    | B     | **Gate:** 1.8.x on npm + consumer skip-walk         | Skip-walk in consumer job `DECISIONS.md` (not a comment on a closed PR)                    | Pending                                         |
| 13    | B     | 2.0 prune (separate PR)                             | Removed exports listed; `Attachment*` names introduced **here** if skip-walk allows; major | Pending                                         |

## Conflict & compliance

- **Rules:** `.cursor/rules/INDEX.md`, `workflow/RULE.md`, `CONTRIBUTING.md`.
- **Protected files:** Track A **must** edit `package.json` (`peerDependenciesMeta`, `exports`). **Do not** edit `.github/workflows/**`, `.cursor/rules/**`, or `.cursor/skills/**/SKILL.md` (D14).
- **Peers:** Required: `react`, `react-dom`, `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`. Optional: `@tanstack/react-table`, `@tanstack/react-virtual`, `@dnd-kit/*`, `react-router-dom`. Pin `@tanstack/react-virtual` **3.13.24** until a consumer repro.
- **Optional peers vs runtime (D16):** Optional only means the package manager may not fail install. Importing `TMITable` still **requires** TanStack at compile/runtime. No lazy `import()` guards in 1.8.
- **Exports:** Keep `"."` → `dist/index.js`. Add `./table` → `dist/DataTable/index.js`, `./autocomplete` → `dist/AutocompleteSelect/index.js`. Root barrel still re-exports everything in 1.x.
- **Theme (D17):** Root `src/index.ts` side-effect-imports `./theme.js`. Subpath barrels do **not**. Subpath users must `import "@tmi-packages/ui"` once.
- **Autocomplete subpath (D17):** `./autocomplete` still imports table overlay/skin internals. Overlay provider comes from root or `./table`.
- **ESLint:** After P8 retarget; P10 must **narrow** the folder-wide hooks waiver.
- **Changesets:** 1.8.0 **minor** at P7 finish. 1.8.1 **patch** at P11 finish. 2.0 **major** at P13 finish.

## Pattern & precedent

| Field          | Value                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| **Capability** | Design-system packaging: entry points, peer optionality, internal layout, deprecation runway.             |
| **Precedents** | MUI subpath `exports`; Chakra optional `peerDependenciesMeta`; TanStack split packages (contrast for D2). |
| **Verdict**    | **Aligned** for Track A1. Fat root barrel is acceptable product-specific (D2).                            |

## Scope / out-of-scope

**In (1.8.0):** P0–P7. Consumer handoff. Autocomplete **tests**, not the file split.

**In (1.8.1):** P8–P11. Flatten, then Autocomplete split, then table file splits.

**In (2.0, gated):** Remove deprecated names the skip-walk released. Introduce `Attachment*` public names **only** in 2.0 if Airtable names go (D9).

**Out:** Storybook (D3). New table features. Virtualizer pin bump without repro. Publish from implement. Hygiene on the Autocomplete 1.6 PR. Dutch copy rewrite. Second npm package (D2). New `Attachment*` exports in 1.8. Overlay lift to `src/overlay/`.

## Existing functionality

- Package: `@tmi-packages/ui` (Autocomplete on `main` as 1.6.x; row-reorder **1.7.0**). Plan targets **1.8.0**.
- Public barrel: `src/index.ts` — `ThumbnailPill`, `VideoEmbedModal`, stepper family, Autocomplete family, `TMITable` / `DatabaseViewer`, `AirtableAttachmentThumbnailCell`, overlay stack, table helpers.
- Table: `src/DataTable/lesmateriaal-import/{tmiTable,satellites,shared-*}`.
- Autocomplete: `src/AutocompleteSelect/AutocompleteSelectField.tsx` (~1290 lines). Behavioral tests in `tests/AutocompleteSelectField.test.tsx`.
- Pack: `scripts/verify-pack.mjs` asserts DataTable/Autocomplete dist files and `exports` `./table` / `./autocomplete`.
- CI: `.github/workflows/ci.yml` matches `package.json`. D14: do not edit workflows.

## Consumer handoff (1.8.0 deliverable)

Write **`docs/handoffs/consumer-hygiene-1.8.md`**. Apps (Lesmateriaal first) run it **after 1.8.0 is on npm**. This job does **not** bump consumer repos unless the owner asks.

Must include:

1. **Bump** `@tmi-packages/ui` to `^1.8.0`. Recopy `.agents/skills/adopt-from-tmi-ui` from `node_modules`.
2. **Install vs runtime** matrix (pill vs `to=` vs grid vs dnd).
3. **Theme:** subpath users also `import "@tmi-packages/ui"` once.
4. **Autocomplete + overlay:** `./autocomplete` is not standalone.
5. **Names in 1.8:** Prefer `TMITable`. `DatabaseViewer` and `Airtable*` still work, JSDoc-deprecated. **No** new `Attachment*` names in 1.8 (D9).
6. **Skip-walk groups** for 2.0 (headline APIs, `DatabaseViewer*`, `Airtable*`, helper/sx/debug exports).
7. **Verify:** app type-check + build + smoke table + Autocomplete.

## Public API contract

| Change                                                             | Version     | Notes                                   |
| ------------------------------------------------------------------ | ----------- | --------------------------------------- |
| Optional peers                                                     | 1.8.0 minor | Grid users declare peers in the **app** |
| `exports["./table"]`, `./autocomplete`                             | 1.8.0 minor | Additive                                |
| `@deprecated` on `DatabaseViewer`, `Airtable*`, listed hooks/types | 1.8.0 minor | No new aliases                          |
| Flatten / Autocomplete split / table splits                        | 1.8.1 patch | No export rename                        |
| Remove deprecated names; optional `Attachment*` replacements       | 2.0 major   | After skip-walk                         |

---

## Phase 0 — Branch (A1)

**Goal:** Usable checkout after broken worktree.

**Steps:** Fast-forward `main`. Create `feature/library-hygiene-2` here. Do not check out `feature/library-hygiene`.

**Gate:** This clone on `feature/library-hygiene-2`. **Done.**

## Phase 1 — Ingest markdown (A1)

**Goal:** Drop extract-era docs.

**Steps:**

1. Delete `src/DataTable/lesmateriaal-import/docs/**` and nested `ingest-job/**`. Keep `src/DataTable/INGEST.md` pointing at README TMI table + this job.
2. Do not mass-delete other `docs/jobs/temp_job_*`.
3. Fix Autocomplete JSDoc mojibake (`1Ã—1` → `1×1`) if still present.

**Gate:** Ingest tree gone. `pnpm format:check`.

## Phase 2 — Autocomplete tests (A1)

**Goal:** Behavioral net **without** splitting the 1290-line file (split is P9).

**Steps:**

1. Extend Autocomplete tests with `userEvent` (single select, multiple add/remove, disabled/loading).
2. Smoke satellites with `PortaledOverlayStackProvider`. Wrap primary chrome in `createTmiTableTheme(createTheme())`.
3. Keep file-level hooks disable until P9.

**Gate:** Multiple `it` cases with `userEvent`. `pnpm test:run` && `pnpm lint`.

## Phase 3 — Optional peers (A1)

**Goal:** Pill-only install is not forced to declare the grid stack.

**Steps:**

1. `peerDependenciesMeta.optional: true` for TanStack table/virtual, `@dnd-kit/*`, `react-router-dom`.
2. README + `docs/consumer-setup.md`: install vs runtime matrix.
3. DevDependencies unchanged.

**Gate:** README matches `package.json`. `pnpm type-check` && `pnpm type-check:test`.

## Phase 4 — Subpaths, pack gate, theme (A1)

**Goal:** Additive entries that actually resolve in the tarball.

**Steps:**

1. `exports`: `./table` → `dist/DataTable/index.js`; `./autocomplete` → `dist/AutocompleteSelect/index.js`.
2. Extend `scripts/verify-pack.mjs` to assert those files, `.d.ts`, and `exports` keys.
3. README: subpath examples + theme side-effect + overlay caveat.
4. `pnpm build` && `pnpm verify:pack`.

**Gate:** `verify-pack` fails if either subpath file is missing.

## Phase 5 — Deprecations only (A1)

**Goal:** Teach 2.0 names in JSDoc without a third public identifier.

**Steps:**

1. `@deprecated` on `DatabaseViewer`, Airtable thumbnail exports, exported `DatabaseViewer*` hooks/types.
2. **Do not** add `Attachment*` exports (D9).
3. Compat test: deprecated symbols still import from `src/index.ts`.

**Gate:** `pnpm type-check` && `pnpm type-check:test` && `pnpm test:run`.

## Phase 6 — Handoff and adopt skill (A1)

**Goal:** Apps can bump 1.8.0 without guessing.

**Steps:** Write handoff; bump adopt skill `forPackageVersion`; README ledger rows; link from consumer-setup.

**Gate:** Handoff exists; skill version 1.8.0; `verify:pack` still finds skill + ≥4 ledger headings.

## Phase 7 — Quality + finish 1.8.0 (A1)

**Goal:** First hygiene release.

**Steps:** Full CI suite. **finish**: changeset **minor**. Push only when asked.

**Gate:** All green. Owner pack/install test is success.

---

## Phase 8 — Flatten (A2)

**Goal:** Mechanical move only.

**Steps:** New branch after 1.8.0 merge. Git mv; rewrite imports; eslint globs; grep `lesmateriaal-import`.

**Gate:** Grep empty under `src`, `tests`, `eslint.config.js`. Tests pass.

## Phase 9 — Autocomplete split (A2)

**Goal:** Split **after** flatten.

**Gate:** Field not a single ~1290-line file. Tests pass.

## Phase 10 — Table file splits + ESLint shrink (A2)

**Gate:** Three shells each under 700 lines. Waiver glob narrowed. Tests pass.

## Phase 11 — Quality + finish 1.8.1 (A2)

**Gate:** Full CI. Changeset **patch**.

## Phase 12 — Track B gate

**Gate:** Skip-walk in the **consumer** `DECISIONS.md`.

## Phase 13 — 2.0 prune

**Gate:** Every removed export listed. Changeset **major**.

---

## Notes during development

- 2026-08-24: Cursor cannot open `C:\Users\Lenovo\Documents\AppDev\tmi-ui-library-hygiene`. Continuing on `feature/library-hygiene-2` in `tmi-ui`.
- 2026-08-24: Track A1 implementation on this branch. Hygiene versions **1.8.0 / 1.8.1** (1.7.0 already on npm). Changeset still belongs to **finish**.
- 2026-08-24: Local A1 gates: `type-check`, `type-check:test`, `lint` (warnings only), `format:check`, `test:run` (116), `build`, `verify:pack` OK. Do not start P8 flatten in this PR.

## Decisions made

| Decision                              | Context                      | Outcome                                   | User asked? |
| ------------------------------------- | ---------------------------- | ----------------------------------------- | ----------- |
| New branch instead of broken worktree | Cursor “workspace is broken” | `feature/library-hygiene-2` on this clone | Yes         |
