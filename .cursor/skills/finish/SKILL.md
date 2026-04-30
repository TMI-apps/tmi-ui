---
name: finish
description: Completes a session — cleanup (debug only), default stage-all coherent work, ask if unsure, optional changeset, conventional commit (local only, no push). Use when the user runs finish.
---

# finish

Wrap up work in **tmi-ui**:

- Remove debug logging / stray instrumentation introduced in this session.
- **User-facing or release-worthy API / behavior / consumer-visible doc changes:** add or update a **Changeset** (`pnpm changeset` or a hand-authored `.changeset/*.md` with correct frontmatter). Record **patch / minor / major** intent.  
  **Docs-only** edits often need **no** changeset; use judgment (README install/auth corrections might still warrant a patch if you want them in release notes).
- **Do not** hand-edit `CHANGELOG.md` to invent a new released version on the feature branch—that’s normally applied by **Version packages** on `main` when changesets merge (see [docs/release-flow.md](../../../docs/release-flow.md)).
- **Do not push** in this command.

After a successful commit, use **`push`** to publish commits remotely (with user confirmation).

---

## Semantic versioning (intent)

- **MAJOR** — breaking API for consumers (coordinate; confirm with user if ambiguous).
- **MINOR** — new backwards-compatible surface (components, props, theme tokens).
- **PATCH** — fixes, internal build, non-breaking adjustments.

---

## Commit messages

Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, etc.

**Example:**

```text
feat: add checklist progress variant

- …
```

No leading `[x.y.z]` in the subject for normal feature work; versioning comes from automation after merge.

---

## Staging (default: whole session; ask when unsure)

Before `git commit`:

1. **Cleanup first** — only remove debug logging / stray instrumentation (as in the intro). Do **not** delete intentional source, docs, or config the user meant to keep.
2. Show **`git status`** (including untracked).
3. **Default — stage everything for this session:** include **all** modified and **intentional** untracked files that belong to the work being finished. Use `git add -A` at the repo root when the change set is one coherent session; otherwise `git add` explicit paths after a quick scan.
4. **Ask the user** before staging/committing when anything is **ambiguous**, for example:
   - Mix of changes that look like **unrelated** work (hard to describe in one commit).
   - **Untracked** files you cannot classify (editor cruft, duplicate plans, local experiments).
   - **Protected** or sensitive paths surfaced without clear prior intent (see [workflow/RULE.md](../../rules/workflow/RULE.md)).
   - Any **doubt** whether something **really** belongs in the repo — list the paths and ask: include, exclude, or split into another commit.
5. Immediately before `git commit`, show what will land in the commit (e.g. `git diff --cached --stat` or `git diff --name-only --cached`).

Never commit `node_modules`, build artifacts under `dist/`, or other ignored junk; those should stay out via `.gitignore`.

---

## Worktree / branch

If `DEVELOPMENT_PLAN.md` includes **Working copy (Git)**, run **`finish`** in that directory on the named branch. Otherwise confirm `git status` / branch before committing.

---

## Protected files

Before modifying `.cursor/**`, `.github/workflows/**`, `tsconfig*.json`, `package.json` (for non-requested churn): **stop** and ask—see [workflow/RULE.md](../../rules/workflow/RULE.md).

---

## Validation (when relevant)

Run before commit when the change touches the library, tests, tooling, or CI (see [workflow/RULE.md](../../rules/workflow/RULE.md) and [CONTRIBUTING.md](../../../CONTRIBUTING.md) — on Windows prefer **separate** commands if `&&` misbehaves):

- `pnpm type-check`
- `pnpm type-check:test`
- `pnpm lint`
- `pnpm format:check`
- `pnpm test:run`
- `pnpm run build`
- `pnpm verify:pack`

If only markdown outside the Prettier globs changed, use judgment; **behavior or `src/` changes** should pass the full list so CI matches local.

---

## After finish

Tell the user the commit is local; run **[push](../push/SKILL.md)** when they want remote updated.
