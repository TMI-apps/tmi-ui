---

## name: plan
description: Creates DEVELOPMENT_PLAN.md under docs/jobs/temp_job_/ with conflict & compliance. Use when the user runs plan.

# plan

Create a development plan for work in **@tmi-apps/ui**. Research implementation options, check repo norms, and write `DEVELOPMENT_PLAN.md` in `docs/jobs/temp_job_<name>/`.

**Critical:** Resolve **conflict & compliance** first (peers, exports, theme, ESM dist, docs consumers read). Steps in each phase must reflect that.

**Language:** Write `DEVELOPMENT_PLAN.md` in **English** (headings, phases, gates).

**Do NOT add changesets or release changelog entries here.** That belongs in `**finish`** after implementation.

---

## Flow

### 1. Input

- User describes the change (new component, API tweak, docs, build fix).

### 2. Refine

If scope is vague, ask questions before investigating.

### 2a. Parallel local work

**Ask** (unless already answered):

> Is there parallel local work in this clone—another branch or feature active?

If **yes**: plan for a **git worktree** (second directory) + feature branch; add **Working copy (Git)** to the plan (branch name, worktree path, base branch). Same expectations as project-alpha’s `plan` skill.

If **no**: single directory is default.

### 3. Investigate

- Existing components/utilities to reuse under `src/`
- Exports: `src/index.ts`, `package.json` `exports` / `files`
- Peers: `package.json` `peerDependencies`; README peer + component tables must stay aligned for public changes
- Theme: `src/theme.ts` — new keys need safe fallbacks in components; consumers must not duplicate module augmentation
- ESM / publish: `tsconfig.build.json` (NodeNext), relative `.js` imports; after build changes run `pnpm build` + `pnpm verify:pack` mindset
- Docs: `README.md`, `docs/installation.md`, `docs/consumer-setup.md` if behavior or install/auth changes
- Read [.cursor/rules/INDEX.md](../../rules/INDEX.md) and [CONTRIBUTING.md](../../../CONTRIBUTING.md)

**Skip** app-only concerns (no Airtable/Supabase/Vite app structure in this repo).

### 4. Create plan

- **Conflict & compliance** section first
- Phases with **Goal**, **Steps**, **Gate** (each gate = runnable command or explicit check)
- Name tests when adding non-trivial logic (if/when tests exist; today the repo may rely on type-check + build + verify:pack—state that honestly in the plan)
- Write file to `**docs/jobs/temp_job_<name>/DEVELOPMENT_PLAN.md`**
- If §2a: include **Working copy (Git)**

### 5. Present & iterate

Present the plan; update after feedback.

---

## Output path

`**docs/jobs/temp_job_<descriptive-name>/DEVELOPMENT_PLAN.md`** (kebab-case folder name)

---

## Plan structure (mandatory)


| Section                      | Purpose                                 |
| ---------------------------- | --------------------------------------- |
| **Summary**                  | What / why / scope                      |
| **Phase overview**           | Table: phase #, goal, gate, status      |
| **Conflict & compliance**    | Peers, exports, theme, ESM, docs; risks |
| **Notes during development** | Leave empty                             |
| **Decisions made**           | Leave empty                             |


Per phase: **Goal**, **Steps**, **Gate**.

Optional: **Working copy (Git)**, **Scope / out-of-scope**, **Existing functionality**.

---

## Compliance checklist (for Conflict & compliance)

- `src/index.ts` and README component list (if API surface changes)
- `peerDependencies` + README tables
- Theme augmentation — no duplicate keys for consumers; document new tokens
- Publishing: `verify:pack`, assert ESM script
- Changesets: planned for **finish**, not now

---

## Rules reference


| Topic      | Location                         |
| ---------- | -------------------------------- |
| Index      | `.cursor/rules/INDEX.md`         |
| Workflow   | `.cursor/rules/workflow/RULE.md` |
| Human SSOT | `CONTRIBUTING.md`, `README.md`   |
