---
"@tmi-packages/ui": minor
---

Row reorder hides the dragged source row with opacity instead of visibility, so a lazy thumbnail can finish loading. `TableRowThumbnailShell` accepts `imgLoading` (`"lazy"` by default); pass `"eager"` on tables that use `rowReorder`.
