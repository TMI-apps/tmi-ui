---
name: prime
description: Load tmi-ui context — layout, rules, package, git. Use when the user runs prime or starts a session.
disable-model-invocation: true
---

# prime

Orient the agent to **@tmi-apps/ui** before substantive work.

## Process

### 1. Repo layout

- Run `git ls-files` (or list `src/`, `docs/`, `.github/workflows/`) for a quick map.
- **Entry / contract:** `src/index.ts`, `src/theme.ts`, `package.json` (`exports`, `peerDependencies`, `files`).

### 2. Governance

- Read [.cursor/rules/INDEX.md](../../rules/INDEX.md).
- Read [.cursor/rules/workflow/RULE.md](../../rules/workflow/RULE.md) (finish/push, protected files).
- Read [CONTRIBUTING.md](../../../CONTRIBUTING.md) and skim [README.md](../../../README.md) (peers, smoke ideas).

### 3. Stack & boundaries

- Read `package.json` scripts and peers (React 19, MUI 7, Emotion, `react-router-dom`).
- **No** data layer in this package—presentational API only.

### 4. Git state

- `git status`, `git log -n 8 --oneline`, current branch.

---

## Output

Concise summary:

- **What** this repo is (published UI library, GitHub Packages).
- **Key paths** (`src/`, `docs/`, `dist/` build output gitignored).
- **Peers / consumers** (auth: see `docs/installation.md`).
- **Current branch / cleanliness / recent commits**.
- **Anything odd** noticed (uncommitted changes, version drift).

Use short headings and bullets.
