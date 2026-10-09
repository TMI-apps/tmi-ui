---
"@tmi-packages/ui": patch
---

Fix TMITable tree expand-all so a new getRowId/getSubRows identity on re-render does not re-expand collapsed parents when data is unchanged.
