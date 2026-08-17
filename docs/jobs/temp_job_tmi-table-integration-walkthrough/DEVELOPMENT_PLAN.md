# Development plan: Package integration walkthrough + plumbing

## Summary

- **Goal:** Consumer-app agents infer a table (or other package component) profile, wire **package APIs**, then skip-walk every unused catalog row so they do not invent wrappers. Absorb Lesmateriaal plumbing (ColumnDef peer types, exportable load-debug helper). Publish a copyable `.agents` skill with the npm tarball.
- **Why:** Integrations piled custom code because agents were not prompted through capabilities the package already has.
- **Complexity:** **M** — several phases, public API + published skill contract, durable for other agents.
- **Plan review:** Done 2026-08-17 (review-dev-plan synthesis applied)
- **Scope / constraints:** Product locks in sibling `DECISIONS.md` (D1–D12). This repo only (D8). Edit session, xlsx, feature columns stay out (D2). Fill-height already shipped in `1.4.0` (D12). **One PR, all three phases** — Phase 3 is release-blocking for this job (D7). Pre-approve `package.json` `files` before Phase 2 skill work. Changeset at **`finish` before PR**, not after merge.

## Working copy (Git)

Current clone may be on an unrelated branch. **Do not implement this job there.**

| Field    | Value                                                                           |
| -------- | ------------------------------------------------------------------------------- |
| Base     | `origin/main`                                                                   |
| Branch   | `feature/adopt-from-tmi-ui`                                                     |
| Worktree | Recommended: second directory from `origin/main`                                |
| Delivery | **Single atomic PR** — do not merge Phase 2 without Phase 3 when D7 is in scope |

## Phase overview

| Phase   | Goal                                        | Gate                                   | Status |
| ------- | ------------------------------------------- | -------------------------------------- | ------ |
| 1       | ColumnDef boundary + debug exports          | Full CI subset (see Phase 1)           | Done   |
| 2       | README ledgers + adopt skill (process SSOT) | Ledger review + format + build         | Done   |
| 3       | Tarball skill + consumer copy docs          | User approved `files`; `verify:pack`   | Done   |
| **Job** | D7 satisfied                                | All phases + CONTRIBUTING PR checklist | Done   |

## Conflict & compliance

- **Applicable rules:** `.cursor/rules/workflow/RULE.md` (branch, protected `package.json`, finish/changeset); `CONTRIBUTING.md` (exports, peers, tests, README SSOT); `docs/installation.md` / `docs/consumer-setup.md`.
- **File placements:**
  - Code: `DatabaseViewer.tsx` (`columns` type); sanitize `tableLoadDebug.ts`; export from `src/DataTable/index.ts` + `src/index.ts`.
  - Tests: `tests/DataTable/lesmateriaal-import/shared-utils/tableLoadDebug.test.ts`; `tests/types/databaseViewerColumnDef.compat.test.ts` (assignability).
  - Docs: root `README.md` ledgers (D9) — ThumbnailPill, VideoEmbedModal, **new** PersistentStepperList section, TMI table.
  - Skill: `.agents/skills/adopt-from-tmi-ui/SKILL.md` (consumer); `.cursor/skills` stays maintainer-only.
  - Packaging: `package.json` `files` + `scripts/verify-pack.mjs` (Phase 3, same commit as `files`).
- **Peers / theme / ESM:** No new peers. No new theme keys. `sideEffects: false` unchanged.
- **Risks:** Stale copied skill vs bumped package — mitigate with skill `forPackageVersion` frontmatter + “recopy after bump” in consumer-setup/CHANGELOG. Cursor does not load skills from `node_modules` (D7).
- **Open questions:** None product. **Pre-flight:** user approval for `package.json` `files` before Phase 2 skill authoring.

## Pattern & precedent

| Field                       | Value                                                                                                                                                                                                                                                                                                                            |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Capability**              | Component adoption (compose package APIs) + agent governance (skip-walk).                                                                                                                                                                                                                                                        |
| **Precedents**              | **Component API:** MUI/TanStack opt-in features; shadcn copy-into-repo distribution model. **Agent process:** emerging Agent Skills / `npx skills add` ecosystem (manual copy is v1 stopgap).                                                                                                                                    |
| **Aspects reviewed**        | API & integration; composition; extensibility; operability (upgrade drift).                                                                                                                                                                                                                                                      |
| **Findings**                | **API:** optional props + no-op defaults align. **Composition:** browse vs workspace = existing exports (D4). **Extensibility:** skip-walk blocks parallel wrappers — agent safety net, not classic DS human onboarding. **Operability:** ledger in README (npm SSOT); skill must stay thin and version-coupled; recopy on bump. |
| **Verdict**                 | `Acceptable product-specific` — Cursor-first distribution; component API aligns with precedent.                                                                                                                                                                                                                                  |
| **Future options (not v1)** | Postinstall copy; `npx @tmi-packages/ui copy-adopt-skill`; adopt CLI codegen if wrappers persist.                                                                                                                                                                                                                                |

## Scope / out-of-scope

**In:** D1–D12. All phases in one PR. Plumbing, ledgers, skill, tarball, copy instructions.

**Out:** Edit session, xlsx, feature columns, RPC (D2). Consumer app PRs (D8). Fill-height code (1.4.0). Changeset/changelog during plan (→ `finish`).

## Consumer follow-up (D8 — not this job)

After npm publish, consuming apps (e.g. Lesmateriaal):

1. Bump `@tmi-packages/ui` to the release minor.
2. Copy skill: `node_modules/@tmi-packages/ui/.agents/skills/adopt-from-tmi-ui` → `.agents/skills/adopt-from-tmi-ui`.
3. Delete app `TmiTable.tsx` / `DatabaseViewer.tsx` adapters; import `TMITable` from package; pass `logTableLoadSummary` if wanted.
4. `pnpm type-check` + cold `pnpm dev`.

## Public API contract (Phase 1)

| Symbol                                  | Ship?      | Notes                                                                                               |
| --------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------- |
| `logTableLoadSummary`                   | Yes        | Opt-in via `debug.onTableLoadSettled`                                                               |
| `TABLE_LOAD_DEBUG_LOG_PREFIX`           | Yes        | Stable prefix for log filtering                                                                     |
| `isTableLoadDebugEnabled`               | Yes        | Document enablement matrix in README                                                                |
| `TMITableLoadSettledPayload`            | Yes        | Export type so consumers type the logger                                                            |
| `columns: ColumnDef<TData, any>[]`      | Yes        | JSDoc: pnpm peer symlink type identity; optional export alias `TMITableColumnDef<TData>` if clearer |
| Legacy `debug:lesmateriaalTableLoad`    | **Remove** | Keep only `debug:tableLoad`; note in changeset                                                      |
| `TMITable` default `onTableLoadSettled` | no-op      | Unchanged (D10)                                                                                     |

Debug enablement: `import.meta.env.DEV` (when present), localhost hostname, `localStorage debug:tableLoad=1`. Tests must cover **`import.meta.env` absent / `DEV: false`**.

## Ledger template (all four README sections)

**Row granularity:** one row per **optional integration decision** an agent might skip — not one row per export. TMI table: D4 add-on capabilities (~12–15 rows), not 30+ symbol rows.

```markdown
### Integration ledger

Read with the adopt skill. Infer a profile, wire package APIs below, then **skip-walk** every unwired row with the human.

| Capability | Package API   | If skipped      |
| ---------- | ------------- | --------------- |
| …          | export / prop | Do not invent … |
```

**Profile inference (TMI table):**

| Screen signal              | Profile            |
| -------------------------- | ------------------ |
| Grid + detail drawer/panel | `workspace+detail` |
| List/browse only           | `browse-only`      |

Add-on rows (wire or skip): tree, reorder, server infinite vs `staticClientVirtualizedList`, overlay z-index, row selection, filter-prompt, optimistic feedback, hero/detail, debug inject, Vite `optimizeDeps`, out-of-package (D2).

**PersistentStepperList:** one ledger covering component + `usePersistentSteps` + `textToStepperItems` (sub-capabilities as rows, not separate ledgers).

**CONTRIBUTING (Phase 2):** new or changed public export → update matching Integration ledger row(s) in README.

## Skill spec (`.agents/skills/adopt-from-tmi-ui/SKILL.md`)

**Frontmatter:** `name`, `description` with triggers (`@tmi-packages/ui`, wire TMITable, ThumbnailPill, etc.), `forPackageVersion: <semver at release>`.

**Process only** — catalog lives in README ledgers (no duplicate Vite/overlay rows in skill).

1. **Read ledger** — `node_modules/@tmi-packages/ui/README.md#<component-anchor>` (consumer default; monorepo path footnote only).
2. **Infer profile** — state inferred profile in chat before wiring (or note “unambiguous” if silent infer).
3. **Wire** — package exports only; no app `TmiTable` / `DatabaseViewer` wrappers.
4. **Skip-walk** — for each unwired ledger row, ask human; post table:

   `Capability | Wired? | Skip confirmed? | Notes`

5. **Record** — skipped rows in agent reply (and consumer job `DECISIONS.md` if present).
6. **MUST NOT** build a custom equivalent for any skipped capability.

Link each component to README anchor: `#thumbnailpill`, `#videoembedmodal`, `#persistentstepperlist`, `#tmi-table`.

## Phase 1 — Plumbing

### Goal

Apps type `columns` from their TanStack resolve and inject load-debug without local wrappers.

### Steps

1. Widen `DatabaseViewerProps.columns` to `ColumnDef<TData, any>[]` with JSDoc (pnpm peer identity). Optionally export `TMITableColumnDef<TData>` alias.
2. Sanitize `tableLoadDebug.ts` — `debug:tableLoad` only; remove Lesmateriaal legacy key.
3. Export per **Public API contract** table; keep `TMITable` default no-op.
4. Tests:
   - `tableLoadDebug.test.ts` — enabled/disabled paths, seq increment, `import.meta.env` absent.
   - `databaseViewerColumnDef.compat.test.ts` — `ColumnDef<Row, string>[]` assignable to props.
   - Re-export smoke from `src/index.ts`.
5. README one-liner under TMI table injection (full ledger Phase 2).

### Gate

`pnpm type-check`  
`pnpm type-check:test`  
`pnpm lint`  
`pnpm test:run`  
`pnpm run build`

## Phase 2 — Ledgers + skill

### Goal

README = catalog SSOT; skill = enforceable process SSOT.

### Pre-flight

User approved `package.json` `files` edit (or defer skill file until Phase 3 in same PR).

### Steps

1. Add `### Integration ledger` under: ThumbnailPill, VideoEmbedModal, **new** `### VideoEmbedModal`-style section for PersistentStepperList, TMI table §.
2. TMI ledger: capability rows (D4 add-ons, Vite, D2 out-of-package, fill-height omit/`false`).
3. Pointers only in `docs/tmi-table.md`, `docs/consumer-setup.md`, `docs/installation.md` (top line: adopt protocol → consumer-setup + README).
4. Write full `SKILL.md` per **Skill spec** (not bullet outline).
5. CONTRIBUTING: consumer skill path; **new/changed export → ledger row**; README escape hatch note (`docs/ledgers/` if README > ~500 lines — defer until needed).

### Gate

- All four ledgers present with template + capability-level rows.
- Skill references each README anchor; D3 skip-walk steps verbatim.
- Skill `forPackageVersion` matches release.
- Human review: ledger row coverage vs D4/D6.
- `pnpm format:check`
- `pnpm run build`

## Phase 3 — Publish + copy instructions

### Goal

Tarball includes skill; consumers know how to copy and when to recopy.

### Steps

1. User-approved `package.json` `files`: add `.agents/skills/**`.
2. `verify-pack.mjs`: assert `package/.agents/skills/adopt-from-tmi-ui/SKILL.md`; optional grep `### Integration ledger` count ≥ 4 in `package/README.md`.
3. `docs/consumer-setup.md` — prominent § (after install): copy skill after install **and every `@tmi-packages/ui` bump** (Unix + PowerShell one-liners).
4. README quick reference: copy path + link to ledgers.
5. `pnpm run build` + `pnpm verify:pack`.

### Gate

User approved `package.json`. Full CI: `type-check`, `type-check:test`, `lint`, `format:check`, `test:run`, `build`, `verify:pack`. Skill in tarball. Copy instructions in README + consumer-setup.

## Release

At **`finish` (before PR):** changeset **minor** listing new debug exports, `columns` widen, payload type, published skill. CHANGELOG note: recopy adopt skill after bump.

**Do not** treat job complete until Phases 1–3 merge and Publish succeeds.

## Notes during development

- 2026-08-17: Implemented on `feature/adopt-from-tmi-ui` from `origin/main` (1.4.0). Exported `TMITableColumnDef`, debug helpers, removed legacy `debug:lesmateriaalTableLoad`. Four README Integration ledgers; adopt skill at `.agents/skills/adopt-from-tmi-ui/SKILL.md`. `package.json` `files` includes `.agents/skills/**`; `verify-pack.mjs` asserts skill + ≥4 ledger headers. Full CI green (`type-check`, `type-check:test`, `lint`, `format:check`, `test:run`, `build`, `verify:pack`). Changeset deferred to `finish`.

## Decisions made

| #   | Topic                   | Choice                                                                                                                                | Precedent?                 |
| --- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| R1  | Plan review synthesis   | Single PR; pre-approve files; changeset at finish; expanded skill spec; export contract; ledger granularity; CONTRIBUTING ledger gate | review-dev-plan 2026-08-17 |
| R2  | Legacy localStorage key | Remove `debug:lesmateriaalTableLoad`                                                                                                  | review-dev-plan tests lens |
| R3  | Skill version coupling  | `forPackageVersion` in skill frontmatter                                                                                              | review-dev-plan scale lens |
