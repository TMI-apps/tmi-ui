---
"@tmi-packages/ui": minor
---

Publish adopt-from-tmi-ui agent skill in the npm tarball; add Integration ledgers for all public exports in README.

Export `TMITableColumnDef`, `logTableLoadSummary`, `isTableLoadDebugEnabled`, `TABLE_LOAD_DEBUG_LOG_PREFIX`, and `TMITableLoadSettledPayload`. Widen `DatabaseViewer` column typing for pnpm peer identity. Remove legacy `debug:lesmateriaalTableLoad` localStorage key.

Recopy `.agents/skills/adopt-from-tmi-ui` into consumer apps after every package bump.
