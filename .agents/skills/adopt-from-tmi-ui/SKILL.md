---
name: adopt-from-tmi-ui
description: >
  Wire @tmi-packages/ui components in a consuming app. Use when adding ThumbnailPill,
  VideoEmbedModal, PersistentStepperList, TMITable, AutocompleteSelectField, or bumping
  @tmi-packages/ui. Infer profile, wire package APIs only, skip-walk unwired ledger rows
  with the human.
forPackageVersion: 1.6.0
---

# adopt-from-tmi-ui

Consumer-app skill. **Catalog** lives in the package README integration ledgers; this file is **process only**.

## Before coding

1. Read the ledger for the component you are wiring:
   - `node_modules/@tmi-packages/ui/README.md#thumbnailpill`
   - `node_modules/@tmi-packages/ui/README.md#videoembedmodal`
   - `node_modules/@tmi-packages/ui/README.md#persistentstepperlist`
   - `node_modules/@tmi-packages/ui/README.md#tmi-table`
   - `node_modules/@tmi-packages/ui/README.md#autocomplete`
2. Copy this skill into the app after install or bump (see README / consumer-setup).

## Workflow

### 1. Infer profile

State the inferred profile in chat before wiring (or note **unambiguous** if obvious).

**TMI table:**

| Screen signal              | Profile            |
| -------------------------- | ------------------ |
| Grid + detail drawer/panel | `workspace+detail` |
| List/browse only           | `browse-only`      |

### 2. Wire package exports only

- Import from `@tmi-packages/ui` — **no** app `TmiTable` / `DatabaseViewer` wrapper components.
- `TMITable` load debug: pass `debug={{ onTableLoadSettled: logTableLoadSummary }}` from the package when wanted (default is no-op).
- Use `TMITableColumnDef` / app `ColumnDef` columns — no cast adapter file.

### 3. Skip-walk (mandatory)

For **every ledger row you did not wire**, ask the human. Post:

`Capability | Wired? | Skip confirmed? | Notes`

Record confirmed skips in the agent reply (and the app job `DECISIONS.md` if present).

### 4. MUST NOT

Build a custom equivalent for any capability the human confirmed as skipped.

## Ledger anchors

Do not duplicate catalog rows here — read README § Integration ledger for each component.
