# Quality Tooling Development Plan

## Conflict & Compliance

- **Protected files:** Implementation will need edits to `package.json`, `pnpm-lock.yaml`, and likely `.github/workflows/ci.yml`. It may also need `tsconfig*.json` changes for test type-checking and `.gitignore` changes if coverage/cache output is written outside `node_modules`. Per `.cursor/rules/workflow/RULE.md`, get explicit approval before editing `package.json`, `tsconfig*.json`, `.gitignore`, `.github/workflows/`**, `.cursor/rules/**`, or `.cursor/skills/\*\*/SKILL.md`.
- **Peer dependencies:** Keep React, MUI, Emotion, and `react-router-dom` as peers. Test and lint packages belong in `devDependencies` only.
- **Exports and package files:** Do not change `package.json` `exports`, `files`, `main`, or `types` unless a tooling change proves it is required. `verify:pack` remains the publishing safety net.
- **Theme augmentation:** No new theme tokens are planned. Existing `src/theme.ts` side-effect import must continue to work in test and build environments.
- **ESM dist:** Keep NodeNext build behavior and relative `.js` imports intact. `pnpm run build` and `pnpm verify:pack` must remain required gates.
- **Docs / consumers:** Consumer install docs should not change unless new commands become part of contributor workflow. `CONTRIBUTING.md` should be updated if new local quality gates are added. `README.md` should be updated where it currently frames package-level tests as a follow-up or limitation.
- **Changesets:** Do not add a changeset during planning. During `finish`, decide whether this is docs/dev tooling only or user-visible enough to need one.
- **Out-of-scope alpha-app concerns:** Do not copy project-alpha app-only checks such as Airtable/Supabase validators, feature-doc validators, dependency-cruiser architecture gates, TanStack Query lint rules, or app alias rules.
- **Test type-checking:** Current `tsconfig.json` includes only `src/**/*`. The plan must add an explicit test type-check story instead of assuming `pnpm type-check` covers tests.

## Summary

Add a right-sized quality-tooling layer to `@tmi-apps/ui`, informed by `project-alpha-app` but scoped for a small publishable component library. The logical target is:

- Vitest + Testing Library for utility, hook, and component regression tests.
- Lightweight ESLint + Prettier checks aligned with TypeScript/React library code.
- CI gates that run lint, format check, tests, type-check, build, and pack verification.
- No default Husky/pre-push adoption unless the team explicitly wants local blocking hooks.

## Working Copy (Git)

- Current branch: `main`.
- Current tree has unrelated local doc edits in `CONTRIBUTING.md`, `README.md`, and `docs/release-flow.md`.
- Before implementation, re-check for protected local edits such as `.cursor/skills/plan/SKILL.md` and decide whether the untracked `docs/jobs/temp_job_quality-tooling/` plan should stay with this work or be committed separately.
- There is no existing `develop` branch right now.
- Recommended implementation path:
  - If the current local docs work should stay isolated, create a worktree later, for example `../tmi-ui-quality-tooling`, from `main`.
  - Suggested branch name: `feature/quality-tooling`.
  - If a `develop` branch is introduced before implementation, base the feature branch/worktree on `develop`; otherwise base it on `main`.

## Scope / Out of Scope

In scope:

- Test runner setup for library code.
- A small first test suite covering existing exported behavior.
- Lint/format commands and CI integration.
- Contributor documentation updates for the new quality gates.

Out of scope:

- New runtime dependencies.
- Public component API changes.
- New app-layer architecture rules.
- Husky hooks unless explicitly approved after the core CI setup is in place.

## Existing Functionality

- Current scripts: `type-check`, `build`, `verify:pack`, `changeset`, `version-packages`, `publish:github`.
- Current CI runs: install, type-check, build, verify pack.
- Existing exported targets worth testing first:
  - `textToStepperItems`
  - `usePersistentSteps`
  - `ThumbnailPill`
  - `VideoEmbedModal`
  - `PersistentStepperList`

## Phase Overview

| Phase | Goal                                                | Gate                                     | Status |
| ----- | --------------------------------------------------- | ---------------------------------------- | ------ |
| 0     | Confirm branch/worktree and protected-file approval | Explicit user approval                   | Done   |
| 1     | Add Vitest test infrastructure                      | `pnpm test:run`                          | Done   |
| 2     | Add focused tests and explicit test type-checking   | `pnpm test:run` and test type-check gate | Done   |
| 3     | Add lightweight ESLint and Prettier                 | `pnpm lint` and `pnpm format:check`      | Done   |
| 4     | Extend CI and contributor docs                      | GitHub workflow review + local full gate | Done   |
| 5     | Decide on optional Husky/lint-staged hooks          | Explicit decision: adopt or defer        | Done   |

## Phase 0: Implementation Setup

### Goal

Start implementation without mixing with unrelated local docs work and confirm approval for protected files.

### Steps

1. Ask whether to create a separate worktree now or continue in the current checkout.
2. If using a worktree, create it from `main` or future `develop` and switch to `feature/quality-tooling`.
3. Ask for explicit approval before editing protected files: `package.json`, `tsconfig*.json`, `.gitignore`, `.github/workflows/`**, `.cursor/rules/**`, or `.cursor/skills/\*\*/SKILL.md`.
4. Re-check `git status` before making changes, including untracked files and protected local edits.

### Gate

- Explicit user approval for the working-copy choice.
- Explicit user approval for protected file edits and handling of existing dirty files.

## Phase 1: Add Vitest Test Infrastructure

### Goal

Bring in the useful testing pieces from project-alpha in a library-sized setup.

### Steps

1. Add dev dependencies:

- `vitest`
- `@vitest/ui` only if interactive local test UI is desired
- `@vitest/coverage-v8` only if coverage is desired in this phase
- `jsdom`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- `@vitejs/plugin-react`

2. Add `vitest.config.ts` with:

- React plugin.
- `environment: "jsdom"`.
- `setupFiles: "./tests/setup.ts"`.
- Excludes for `node_modules` and `dist`.
- MUI dependency handling if needed, similar to project-alpha's `server.deps.inline`.

3. Add `tests/setup.ts` with Testing Library cleanup and jest-dom matchers.
4. Add scripts:

- `test`: `vitest`
- `test:run`: `vitest run`
- optionally `test:coverage`: `vitest --coverage`

5. Add a test type-check path:

- Preferred: add `tsconfig.test.json` extending `tsconfig.json`, including `src/**/*`, test files, `tests/**/*`, and config files that need type-checking.
- Add `type-check:test`: `tsc --noEmit -p tsconfig.test.json`.
- Keep `tsconfig.build.json` focused on publishable `src` output.

### Gate

```bash
pnpm test:run
pnpm type-check:test
```

## Phase 2: Add Focused Tests

### Goal

Cover current exported behavior where regressions would affect consumers.

### Steps

1. Add parser tests for `textToStepperItems`, including nested/sub-step behavior and empty/edge input handling.
2. Add hook tests for `usePersistentSteps`, including:

- initial state.
- toggling completion.
- localStorage persistence.
- storage key/scope behavior.

3. Add component smoke tests:

- `ThumbnailPill` renders title, image/placeholder, right slot, and click behavior.
- `ThumbnailPill` `to` behavior is tested under a router wrapper such as `MemoryRouter`.
- `VideoEmbedModal` renders supported YouTube/Vimeo URLs and returns nothing for unsupported URLs.
- `PersistentStepperList` renders main and sub items and exposes expected completion interactions.

4. Keep tests close to source files or under `tests/`, choosing the simplest convention and documenting it.

### Gate

```bash
pnpm test:run
pnpm type-check
pnpm type-check:test
```

## Phase 3: Add Lightweight ESLint and Prettier

### Goal

Add static checks without importing project-alpha's app-specific architecture rules.

### Steps

1. Add dev dependencies for a minimal flat ESLint setup:

- `eslint`
- `@eslint/js`
- `typescript-eslint`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh` only if useful for JSX library files
- `eslint-config-prettier`
- `globals`

2. Add `prettier`.
3. Add `eslint.config.js` scoped to library source and test files.
4. Include library-specific rules:

- no app path aliases such as `@/...`.
- no Airtable/Supabase/client-layer imports.
- React hooks rules.
- TypeScript-aware linting against `tsconfig.json`.

5. Add scripts:

- `lint`: `eslint . --cache --cache-location node_modules/.cache/.eslintcache`
- `lint:fix`: `eslint . --fix --cache --cache-location node_modules/.cache/.eslintcache`
- `format`: `prettier --write "src/**/*.{ts,tsx}" "tests/**/*.{ts,tsx}" "docs/**/*.md" "*.{json,md}"`
- `format:check`: matching `prettier --check` command.

6. If formatting all `docs/**/*.md` creates noisy churn, narrow the docs glob deliberately and document that choice in `CONTRIBUTING.md`.
7. Avoid broad or noisy complexity gates on the first pass. Add them later only if they solve a real maintenance problem.

### Gate

```bash
pnpm lint
pnpm format:check
```

## Phase 4: Extend CI and Contributor Docs

### Goal

Make CI the authoritative quality gate for the library.

### Steps

1. Update `.github/workflows/ci.yml` to run, in a clear order:

- `pnpm type-check`
- `pnpm type-check:test`
- `pnpm lint`
- `pnpm format:check`
- `pnpm test:run`
- `pnpm run build`
- `pnpm verify:pack`

2. Keep package permissions simple; this repo installs its own dependencies and should not need the alpha app's `GH_PACKAGES_READ_TOKEN` pattern.
3. Update `CONTRIBUTING.md` PR checklist with the new local gates. Show Windows-friendly separate command lines instead of relying on `&&`.
4. Update `README.md` if it still says package-level tests are a follow-up or known limitation. Prefer keeping contributor-only command details in `CONTRIBUTING.md`.

### Gate

```bash
pnpm type-check
pnpm type-check:test
pnpm lint
pnpm format:check
pnpm test:run
pnpm run build
pnpm verify:pack
```

## Phase 5: Optional Husky / lint-staged Decision

### Goal

Decide whether local hooks add enough value for this smaller library.

### Steps

1. Default recommendation: defer Husky initially and rely on CI plus explicit local gates.
2. If the team wants local guardrails, add a light setup only:

- `husky`
- `lint-staged`
- pre-commit: run `lint-staged` for ESLint/Prettier only.

3. Do not add alpha-style heavy pre-commit checks (`type-check`, docs validation, architecture validation) unless the library grows enough to justify them.
4. Avoid pre-push full test hooks by default; they duplicate CI and can slow down small fixes.

### Gate

- Explicit decision recorded in the plan or implementation notes:
  - "Husky deferred", or
  - "Light Husky/lint-staged adopted".

## Notes During Development

- Implemented in the main working tree on `main` (no separate worktree created).
- ESLint 9 used for compatibility with `eslint-plugin-react` peers (ESLint 10 broke peer resolution).
- `eslint-plugin-react` flat `recommended` / `jsx-runtime` configs are objects, not arrays. Do not spread them with `...`.
- `react-hooks/set-state-in-effect` flagged `usePersistentSteps` re-hydration from `localStorage`. Kept behavior and added a one-line disable with rationale.
- Prettier ran once on `docs/**/*.md`, `CHANGELOG.md`, and root `*.{json,md}` so `format:check` matches CI. Expect a larger first diff on docs.
- Added `coverage/` to `.gitignore` for future Vitest coverage runs.

## Decisions Made

- **Husky / lint-staged:** deferred. CI is the authoritative gate; revisit only if the team wants lightweight pre-commit ESLint/Prettier on staged files.
