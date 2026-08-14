# TMI Table (index)

Lesmateriaal, Doelen, Media, and Externe tools all build on one shared grid + workspace subsystem: **`@/components/common/tmiTable`**.

This file is intentionally short. **Canonical guide (usage, APIs, checklist, internals map):**

- [`src/components/common/tmiTable/README.md`](../src/components/common/tmiTable/README.md) — includes **row thumbnail** shell (`TableRowThumbnailShell`, `createAirtableAttachmentThumbnailColumn`, `TABLE_ROW_THUMB_COLUMN_PX`).

**Enforceable rules for agents:** [`.cursor/rules/component-patterns/RULE.mdc`](../.cursor/rules/component-patterns/RULE.mdc)

**Where docs belong (features vs common subsystems vs `documentation/`):** [`.cursor/rules/file-placement/RULE.mdc`](../.cursor/rules/file-placement/RULE.mdc) — Common Component Subsystem Documentation.

**Architecture context (imports, layering, viewport fill rules):** [`ARCHITECTURE.md`](../ARCHITECTURE.md)

**Feature maintenance (Option 1):** each feature README under [`src/features/`](../src/features/) — contract in [`DOC_FEATURE_LOCAL_README.md`](DOC_FEATURE_LOCAL_README.md).

**Row selection + export:** opt-in on `TMITable` (`selection` config); all browse tables (Lesmateriaal, Doelen, Media, Externe tools, Opdrachtgevers, Samenwerkingen) — see README § Row selection + Excel export.

**Filter-prompt idle mode:** opt-in on `TMITableWorkspace` (`filterPromptActive`) — Lesmateriaal admin workspace; see README § Filter-prompt idle mode.

