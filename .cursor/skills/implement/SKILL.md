---
name: implement
description: Executes DEVELOPMENT_PLAN.md phase by phase with gates. Use when the user runs implement. Changesets in finish, not here.
---

# implement

Execute a development plan phase by phase using **`docs/jobs/temp_job_<name>/DEVELOPMENT_PLAN.md`**. Run gates; update the plan (status, notes, decisions).

**Follow** [CONTRIBUTING.md](../../../CONTRIBUTING.md) and [.cursor/rules/workflow/RULE.md](../../rules/workflow/RULE.md).

**Do not add changesets or release-driven `package.json` bumps here** unless the plan explicitly says otherwise for a special case—normally **`finish`** owns Changesets.

---

## Input

Infer which plan from the user message (job name, open file path under `docs/jobs/`, or recent chat).

**Plan location:** `docs/jobs/temp_job_<name>/DEVELOPMENT_PLAN.md`

---

## Flow

### 1. Load plan

- [ ] Read `DEVELOPMENT_PLAN.md`
- [ ] Find first phase not done

### 2. Per phase

1. Read Goal, Steps, Gate  
2. Execute steps  
3. Run gate (must pass before next phase)  
4. Update phase status; append **Notes** / **Decisions** when needed  

### 3. Gates (typical for this repo)

- **Per phase:** run whatever **Gate** the plan names; it must pass before the next phase.
- **Before telling the user to run `finish`:** run the **full** local suite from [.cursor/rules/workflow/RULE.md](../../rules/workflow/RULE.md) / [CONTRIBUTING.md](../../../CONTRIBUTING.md), unless the plan explicitly scopes gates down (document why in **Notes**).

Full quality suite (run separately on Windows if `&&` misbehaves):

- `pnpm type-check`
- `pnpm type-check:test`
- `pnpm lint`
- `pnpm format:check`
- `pnpm test:run`
- `pnpm run build`
- `pnpm verify:pack`

**Tests** live under `tests/`. For new or changed component/parser/hook behavior, add or extend tests in the same PR/session unless the plan defers testing with a recorded decision.

There is **no** Vite app or Playwright suite in-repo by default—use browser checks only if the plan defines a consumer repro or Storybook (not shipped here yet).

### 4. Next phase

Repeat until all phases done.

---

## Rules while coding

- No app-layer imports; peers only ([CONTRIBUTING.md](../../../CONTRIBUTING.md)).
- Match existing component folder layout and `src/index.ts` export style.
- Theme: extend `src/theme.ts`; components must work without optional tokens.

---

## Obstacles

If the plan does not cover something: add to **Notes**, **stop**, ask the user.

---

## Completion

When done: all gates passed, plan table updated. Tell the user implementation is complete and suggest **`finish`** before **`push`**.
