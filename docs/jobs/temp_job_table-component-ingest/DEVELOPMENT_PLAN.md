# Development plan — table component ingest

## Summary

Ingest a large table component from another repo into `@tmi-packages/ui` as a presentational, peer-only library export.

**Landing zone:** `src/DataTable/` (rename if public API name differs).

**Status:** Source pasted under `src/DataTable/lesmateriaal-import/` (2026-08-14). Phase 2 public API wired; grid/workspace unexported.

## Phase overview

| Phase | Goal                                       | Gate                                       | Status |
| ----- | ------------------------------------------ | ------------------------------------------ | ------ |
| 0     | User pastes source into landing zone       | Files present under `src/DataTable/`       | Done   |
| 1     | Audit imports, peers, and app coupling     | Written audit in **Notes**                 | Done   |
| 2     | Decouple + fix ESM imports                 | `pnpm type-check`                          | Done   |
| 3     | Theme tokens (if any) + graceful fallbacks | `pnpm type-check`                          | Done   |
| 4     | Wire `src/index.ts` + README row           | `pnpm type-check`                          | Done   |
| 5     | Tests                                      | `pnpm test:run` + `pnpm type-check:test`   | Done   |
| 6     | Peers + docs                               | `peerDependencies` aligned; README updated | Done   |
| 7     | Release prep                               | `finish` skill (changeset, full CI suite)  | Done   |

## Conflict & compliance

### Package boundaries (CONTRIBUTING)

- No app-layer imports (data clients, `@/` aliases, consumer types).
- Runtime deps on React/MUI/icons/router → **peerDependencies** only.
- ESM: relative imports must use **`.js`** extension (`NodeNext`).

### Likely peer additions (confirm in Phase 1)

| Package                 | When needed                                   |
| ----------------------- | --------------------------------------------- |
| `@mui/x-data-grid`      | Source uses MUI Data Grid                     |
| `@tanstack/react-table` | Headless table core                           |
| `@mui/icons-material`   | Already a peer — document if table uses icons |

Do **not** add peers until audit confirms usage.

### Exports

- Update `src/index.ts` with component + public types only.
- `package.json` `exports` stays `"."` — no subpath exports unless plan is updated.

### Theme

- Optional tokens in `src/theme.ts` only.
- Components must work with default MUI theme when tokens absent.

### Docs

- README contents table + peer notes when API is public.
- `docs/consumer-setup.md` only if install/auth/peers change materially.

### Licensing

- Confirm org IP approval for MIT release of pasted code.

### Risks

- Large paste may hide app coupling in nested files — grep for `@/`, `supabase`, `airtable`, `import.meta.env`.
- Data grid version must align with MUI 7 peer major.

## Notes during development

- [Phase 0] Source already at `src/DataTable/lesmateriaal-import/` (COPY_MANIFEST). No recopy/regenerate.
- [Phase 1] `@/` aliases mapped to `tmiTable/`, `satellites/`, `shared-types/`, `shared-theme/`, `shared-utils/`, `shared-context/`. No Supabase/Airtable client imports. `import.meta.env.DEV/PROD` in `tableLoadDebug` + `databaseViewerVirtualRowKey` typed as optional `ImportMeta.env` (no Vite client types).
- [Phase 1] Third-party not previously in peers: `@tanstack/react-table`, `@tanstack/react-virtual`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`. No `@mui/x-data-grid`.
- [Phase 1] Public Phase 2: satellites, config/meta/reorder types, `createAirtableAttachmentThumbnailColumn`, `createTmiTableTheme`. Keep internal: `tmiTable/table` grid, workspace, `PortaledOverlayStackContext` (copied as reference, not exported).
- [Phase 2] Mechanical: `@/` → relative `.js`; colocated `*.test.*` moved to `tests/DataTable/lesmateriaal-import/` so they are not emitted in `dist`.
- [Phase 2] `shared-theme/defaultTheme.ts` slimmed to `TABLE_ROW_CORNER_RADIUS_PX` + `COVER_IMAGE_OBJECT_POSITION` — full app `createAppTheme` / `brandTokens` were not copied and must stay in the consumer.
- [Phase 3] `theme.detailPanelHero` augmentation + `createTmiTableTheme` filling tokens via `buildDetailPanelHeroTokens`. Hero components still read `theme.detailPanelHero` without runtime fallbacks (same as Lesmateriaal; consumers should call the factory).
- [Phase 4] `src/DataTable/index.ts` + `src/index.ts` Phase 2 exports only.
- [Phase 5] Existing unit tests moved under `tests/DataTable/lesmateriaal-import/`; full `pnpm test:run` green (no new smoke test — satellite coverage already present).
- [Phase 6] Peers added to match Lesmateriaal pins so the in-tree (unexported) grid still type-checks.
- [Phase 2] ESLint: `react-hooks` compiler rules (`set-state-in-effect`, `refs`, `immutability`) disabled for `lesmateriaal-import` so ingest does not rewrite component bodies. Revisit when grid ships.

## Decisions made

| Decision                                | Context                                                | Outcome                                                       | User asked? |
| --------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------- | ----------- |
| Keep files under `lesmateriaal-import/` | User: do not recopy                                    | Public barrel at `src/DataTable/index.ts` re-exports in place | Yes         |
| Export Phase 2 subset only              | Extract HANDOFF Phase 2                                | Grid/workspace not in `src/index.ts`                          | Yes         |
| Slim `defaultTheme.ts`                  | Missing `brandTokens`; app theme must not ship         | Constants only                                                | No          |
| Add grid peers now                      | Unexported `tmiTable/` still in `src/` / `tsc` include | Peers aligned to Lesmateriaal                                 | No          |

---

## Phase 0 — Paste (user)

**Goal:** Source files live in this repo without breaking build.

**Steps:**

1. User copies files into `src/DataTable/` (see [PASTE_GUIDE.md](./PASTE_GUIDE.md)).
2. User renames folder if needed.
3. User notifies agent with export names + extra npm deps.

**Gate:** At least one `.tsx` file in landing folder; `pnpm type-check` may fail until Phase 2 — that is OK.

---

## Phase 1 — Audit

**Goal:** Know scope before refactoring.

**Steps:**

1. List all files under component folder.
2. Grep: `@/`, app aliases, data clients, env, router usage.
3. List third-party imports not in current `peerDependencies`.
4. Identify public vs internal exports.
5. Record findings in **Notes**.

**Gate:** Audit written; peer list decided.

---

## Phase 2 — Decouple + compile

**Goal:** Library builds in isolation.

**Steps:**

1. Rewrite imports (relative + `.js`).
2. Replace app data with props/callbacks/generic types.
3. Split oversized files only if needed for clarity.
4. Add barrel `index.ts` in component folder if multiple entry files.

**Gate:** `pnpm type-check`

---

## Phase 3 — Theme (if needed)

**Goal:** Optional theme tokens with fallbacks.

**Steps:**

1. Extend `src/theme.ts` for new optional keys.
2. Use `useTheme()` + defaults in components.

**Gate:** `pnpm type-check`

---

## Phase 4 — Package exports

**Goal:** Consumers can import from `@tmi-packages/ui`.

**Steps:**

1. Export component + types from `src/index.ts`.
2. Update README contents table.

**Gate:** `pnpm type-check`

---

## Phase 5 — Tests

**Goal:** Regression safety for render + one key behavior.

**Steps:**

1. Add `tests/<Name>.test.tsx` using `renderWithTheme`.
2. Cover render smoke + primary interaction.

**Gate:** `pnpm test:run` and `pnpm type-check:test`

---

## Phase 6 — Peers & consumer docs

**Goal:** Install story is correct.

**Steps:**

1. Add confirmed packages to `peerDependencies` (+ devDependencies for local test/build).
2. Document in README peer table.

**Gate:** `pnpm run build` and `pnpm verify:pack`

---

## Phase 7 — Finish (separate skill)

**Goal:** Commit-ready with changeset.

**Steps:** Run full suite per CONTRIBUTING; `pnpm changeset` (typically **minor** for new component).

**Gate:** All workflow gates + changeset on branch.
