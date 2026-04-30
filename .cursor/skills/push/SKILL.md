---
name: push
description: Push-only — verify branch, clean tree, fetch, user confirm, push (no add/commit). Use after finish.
---

# push

Push **already committed** work. **Push-only.**

## Preconditions

1. **`finish`** (or equivalent) produced the commit(s).
2. Working tree **clean** — no unstaged or staged uncommitted changes; no stray untracked files that belong in the commit.
3. At least one local commit to push.

## Hard restrictions

- **No** `git add`
- **No** `git commit` / amend
- If anything is uncommitted → **stop**; user runs **`finish`** first.

## Flow

1. Confirm branch (avoid accidental push from wrong context; team norm: **`feature/*` → PR → `main`**).
2. Confirm clean `git status`.
3. `git fetch origin`; if behind remote tracking branch, **stop**—rebase or merge per team practice, then push.
4. Ask: **Ready to push these commits?**
5. Push only after explicit confirmation.

## Relation to `finish`

- **`finish`** = commit locally.  
- **`push`** = remote + push.  
- Version/tag publish workflows are separate ([docs/release-flow.md](../../../docs/release-flow.md)).
