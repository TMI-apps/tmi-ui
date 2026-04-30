---
name: finish
description: Completes a session — cleanup, optional changeset, staging gate, conventional commit (local only, no push). Use when the user runs finish.
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

## Staging decision gate (mandatory)

Before `git commit`:

1. Show **staged** files (`git diff --name-only --cached`).
2. Show **unstaged** files (`git diff --name-only`).
3. If there is unstaged work, **do not** silently commit—ask whether to include, exclude, or abort.
4. Never `git add -A` without explicit user direction when unrelated changes may exist.

---

## Worktree / branch

If `DEVELOPMENT_PLAN.md` includes **Working copy (Git)**, run **`finish`** in that directory on the named branch. Otherwise confirm `git status` / branch before committing.

---

## Protected files

Before modifying `.cursor/**`, `.github/workflows/**`, `tsconfig*.json`, `package.json` (for non-requested churn): **stop** and ask—see [workflow/RULE.md](../../rules/workflow/RULE.md).

---

## Validation (when relevant)

Run before commit when the change touches the library or build (see [workflow/RULE.md](../../rules/workflow/RULE.md) — on Windows prefer separate commands if `&&` misbehaves):

- `pnpm type-check`
- `pnpm run build`
- `pnpm verify:pack`

---

## After finish

Tell the user the commit is local; run **[push](../push/SKILL.md)** when they want remote updated.
