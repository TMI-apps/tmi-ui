# Decisions — library hygiene (audit follow-up)

Job: `temp_job_library-hygiene`
Updated: 2026-08-24 (post plan review)

## Closed

| id  | topic                         | status | choice                                                                                                                                                         | source     | notes                                                                             |
| --- | ----------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------- |
| D1  | One plan vs many              | closed | Single `DEVELOPMENT_PLAN.md` with Track A1/A2 and Track B                                                                                                      | user       | “All at once” as one plan; delivery is two PRs (D18)                              |
| D2  | Package split                 | closed | Keep one npm package. No `@tmi-packages/ui-core` / `ui-table`                                                                                                  | plan-grill | Optional peers + subpaths first; split is a different product                     |
| D3  | Storybook / playground        | closed | Out of scope                                                                                                                                                   | plan-grill | CONTRIBUTING already points at `pnpm link` / `file:`                              |
| D4  | Working copy                  | closed | Git **worktree** was preferred; **this session** uses this clone on `feature/library-hygiene-2` because `tmi-ui-library-hygiene` is unusable in Cursor         | user       | Broken worktree still registered; do not check out `feature/library-hygiene` here |
| D5  | Base branch                   | closed | Prefer `origin/main`. Stack on Autocomplete branch **only** if 1.6 is not on `main` yet                                                                        | plan-grill | `main` fast-forwarded; Autocomplete is on `main`                                  |
| D6  | Folder flatten                | closed | Move `lesmateriaal-import/**` → `{tmiTable,satellites,shared-*}/` in **1.8.1**, not in 1.8.0                                                                   | plan-grill | Mechanical PR after contract ships. 1.7.0 already shipped (row-reorder).          |
| D7  | Peer tax                      | closed | `peerDependenciesMeta.optional` for table, virtual, dnd-kit, `react-router-dom`                                                                                | plan-grill | Additive minor. Runtime still needs those packages if you import grid APIs (D16)  |
| D8  | Subpath exports               | closed | Add `./table` and `./autocomplete`; keep `"."`                                                                                                                 | plan-grill | Convenience, not a trimmed API. `verify-pack` must assert dist files (D19)        |
| D9  | Public API prune / aliases    | closed | **1.8:** JSDoc `@deprecated` only — **no** new `Attachment*` exports. **2.0:** remove unused names; add `Attachment*` only as the replacement if Airtable goes | review     | Avoids three names for one thing until 2.0                                        |
| D10 | Autocomplete 1290-line field  | closed | **1.8.0:** behavioral tests + encoding. **1.8.1:** split **after** flatten                                                                                     | review     | Tests without a split still pay down extract D5; split must not precede flatten   |
| D11 | Table file splits             | closed | After flatten (P8), in 1.8.1. No public API change                                                                                                             | plan-grill | Plus one `TMITable` mount smoke                                                   |
| D12 | Semver Track A                | closed | **1.8.0 minor** (peers, subpaths, deprecations). **1.8.1 patch** (flatten + splits)                                                                            | review     | 1.7.0 is row-reorder on npm; hygiene is next minor                                |
| D13 | Consumer handoff              | closed | `docs/handoffs/consumer-hygiene-1.8.md` + adopt skill 1.8.0 + skip-walk **groups**                                                                             | user       | Must cover install vs runtime, theme, overlay (D16–D17)                           |
| D14 | CI workflow files             | closed | Do **not** edit `.github/workflows/**`                                                                                                                         | plan-grill | Extend `verify-pack.mjs` instead (D19)                                            |
| D15 | P0 base wording               | closed | Default `origin/main`; stacking is fallback only                                                                                                               | review     | Avoid stale “must stack on Autocomplete” text                                     |
| D16 | Optional peers meaning        | closed | Docs/handoff only. No lazy-import runtime guards in 1.8                                                                                                        | review     | Guards would be a behavior change; honesty in the matrix is enough                |
| D17 | Subpath honesty               | closed | Document theme side-effect + Autocomplete→table coupling. Do not lift overlay in this job                                                                      | review     | Overlay lift is real decoupling; out of scope to keep 1.8 small                   |
| D18 | One PR vs two                 | closed | **Two PRs:** 1.8.0 contract, 1.8.1 flatten+splits                                                                                                              | review     | Same plan; reviewable diffs; user still gets “all” hygiene                        |
| D19 | Pack gate                     | closed | `scripts/verify-pack.mjs` **must** assert subpath files and `exports` keys                                                                                     | review     | Today it only checks root `index.js`                                              |
| D20 | Flatten vs Autocomplete split | closed | Flatten first (P8), then split (P9)                                                                                                                            | review     | New modules must not be born with `lesmateriaal-import` imports                   |
| D21 | ESLint waiver                 | closed | After flatten, waiver glob must shrink; remaining file count recorded in plan notes                                                                            | review     | “Narrow if possible” without a gate would never happen                            |
| D22 | Broken Cursor worktree        | closed | Continue in **this** clone on `feature/library-hygiene-2`. Leave `feature/library-hygiene` parked on the broken worktree until `git worktree remove --force`   | user       | Cannot check out the same branch in two worktrees                                 |

## Open

None. Track B start is a **gate**: 1.8.x on npm + skip-walk in the **consumer** job `DECISIONS.md`.

## Log

- 2026-08-24 — D1–D14 closed from audit + “one plan / consumer handoff”.
- 2026-08-24 — Plan review: D9, D10, D12, D15–D21 closed from six-lens critique.
- 2026-08-24 — D4/D22: Cursor cannot open `tmi-ui-library-hygiene`; work continues on `feature/library-hygiene-2` from updated `main`.
- 2026-08-24 — Retarget A1/A2 to **1.8.0 / 1.8.1** because **1.7.0** already shipped (row-reorder).
