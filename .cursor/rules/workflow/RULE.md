---

## description: Git workflow, release alignment, and agent safety for tmi-ui
alwaysApply: true

# Workflow (`tmi-apps/tmi-ui`)

## SSOT


| Topic                                          | Location                                                       |
| ---------------------------------------------- | -------------------------------------------------------------- |
| Library structure, PR checklist, release steps | [CONTRIBUTING.md](../../../CONTRIBUTING.md)                    |
| Consumer install & CI tokens                   | [docs/installation.md](../../../docs/installation.md)          |
| Tag + publish flow                             | [docs/release-flow.md](../../../docs/release-flow.md)          |
| Semver intent + commit norms for `finish`      | [.cursor/skills/finish/SKILL.md](../../skills/finish/SKILL.md) |


## Branches

- **Integration / default:** `main` (CI targets `main`; see [.github/workflows](../../../.github/workflows)).
- **Work:** short-lived `feature/*` or `fix/*` branches; merge via **PR** when collaboration or checks matter.
- Avoid unreviewed direct pushes to `main` in team workflows unless you intentionally bypass PRs.

## Finish / push split

1. `**finish`** — cleanup, changeset when user-facing, staging decision, **commit only** (local). See `finish` skill.
2. `**push`** — clean working tree, fetch, confirm with user, **push only** (no `git add` / `git commit`).

## Changesets & changelog

- Record semver **intent** with Changesets (`.changeset/*.md`); do not hand-bump `package.json` version on a feature branch as a substitute for the release pipeline.
- **Version packages** automation on `main` applies version + changelog when changesets are present (see [release-flow.md](../../../docs/release-flow.md)).
- **Docs-only** changes often need **no** changeset unless they are the release-worthy item.

## Protected files (ask before editing)

Do **not** modify without **explicit user approval**:

- `.gitignore`, `tsconfig*.json`, `package.json` (unless the task is specifically dependency/version work the user requested)
- `.cursor/rules/`**, `.cursor/skills/**/SKILL.md`
- `.github/workflows/**`

## Validation commands (typical gates)

- `pnpm type-check`
- `pnpm run build`
- `pnpm verify:pack`

## Windows / PowerShell

- Prefer separate commands over brittle `&&` chains in copy-paste instructions.
- Heavy use of `Select-Object` piping can cause IDE issues; see project-alpha `workflow/RULE.md` if you need the full PowerShell note (optional copy).