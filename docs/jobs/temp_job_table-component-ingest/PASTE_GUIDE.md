# Paste guide — table component ingest

Use this while copying from the other repo. Goal: **decouple from the app**, keep behavior, minimize rework.

## 1. Copy strategy

**Recommended:** paste the full component tree first, get it compiling, then trim.

- Main component + colocated helpers → `src/DataTable/` (rename folder to match public API name).
- Shared utils used only by the table → same folder or `src/DataTable/utils/`.
- Utils used by other future components → `src/<UtilName>.ts` at `src/` root (see `textToStepperItems.ts`).

Do **not** paste app routes, pages, or data-fetch layers.

## 2. Import rewrite cheat sheet

```ts
// ❌ App alias
import { Foo } from "@/components/Foo";

// ✅ Library relative + .js
import { Foo } from "./Foo.js";
import { bar } from "../bar.js";
```

Peers (consumer supplies these — use imports, not new runtime deps):

- `@mui/material`, `@emotion/react`, `@emotion/styled`
- `@mui/icons-material` (if icons used)
- `react`, `react-dom`
- `react-router-dom` (only if table uses links/navigation)

If the source uses **`@mui/x-data-grid`**, `@tanstack/react-table`, or similar — **leave imports as-is** and note them; we add `peerDependencies` in a later phase (do not add to `dependencies`).

## 3. Decouple checklist

Strip or refactor anything that ties the table to one app:

- [ ] No Supabase / Airtable / REST client imports
- [ ] No env vars (`import.meta.env`, `process.env`)
- [ ] No global stores (Zustand/Redux) — pass state via props or render props
- [ ] No hardcoded routes — use `to` props or `onNavigate` callbacks
- [ ] No app-specific i18n keys — use `labels` prop object (see `PersistentStepperListLabels`)
- [ ] Column definitions: prefer props or generic types, not app entity types

## 4. Theme tokens

If the source reads `theme.somethingCustom`:

1. Add optional keys to `src/theme.ts` (document in comment block).
2. In the component, **fallback** when token missing (see `PersistentStepperList` + `theme.checklist`).

Do not require consumers to duplicate module augmentation.

## 5. Public API

Decide what ships from the package:

- **Export:** main table component + prop types + any hooks consumers need.
- **Keep internal:** row/cell helpers, styled wrappers not meant for reuse.

We wire exports in `src/index.ts` after paste — you do not need to edit that file during paste.

## 6. Tests (after compile)

Add `tests/<ComponentName>.test.tsx`:

- Use `renderWithTheme` from `tests/test-utils.tsx`.
- Smoke: renders headers / first row.
- One interaction test (sort, filter, expand row — whatever the table does).

## 7. What to tell the agent after paste

Include:

- Folder name under `src/`
- Main export name(s)
- List of **non-MUI** npm packages the table imports
- Whether consumers need new theme tokens
- Source repo path (optional, for diff/audit)

Example:

> Pasted into `src/DataTable/`. Main export `DataTable`. Uses `@tanstack/react-table` and `@mui/icons-material`. No custom theme keys.
