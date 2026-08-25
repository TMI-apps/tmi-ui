# Decisions — component workshop

Job: `temp_job_component-workshop`
Updated: 2026-08-24

## Closed

| id  | topic                  | status | choice                                                                             | source     | notes                                                          |
| --- | ---------------------- | ------ | ---------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------- |
| D0  | Relation to hygiene D3 | closed | New job; hygiene D3 does not block a playground here                               | plan-grill | clear-winner — D3 was out-of-scope for hygiene only            |
| D1  | v1 inspect surface     | closed | Custom Vite preview pages (routes), not CSF/Storybook/Ladle                        | plan-grill | asked                                                          |
| D2  | npm tarball            | closed | Playground stays in repo, excluded from published `files`                          | plan-grill | clear-winner — consumers install the library, not the workshop |
| D3  | Catalog layout         | closed | Two one-pagers; sidebar jump-links scroll to sections                              | plan-grill | asked                                                          |
| D4  | Docs vs visuals        | closed | Visuals page + docs page that renders real markdown files                          | plan-grill | asked                                                          |
| D5  | Docs one-pager sources | closed | README.md + human SSOT under `docs/` (not duplicated prose)                        | plan-grill | asked — installation, consumer-setup, release-flow, handoffs   |
| D6  | Job plans in docs page | closed | Exclude `docs/jobs/**`                                                             | plan-grill | clear-winner                                                   |
| D7  | Visual snapshots       | closed | One render per visual part; one full TMITable with all capabilities on + mock data | plan-grill | asked                                                          |
| D8  | Hosting                | closed | Local Vite only (`pnpm playground`); no Pages / workflow                           | plan-grill | asked                                                          |
| D9  | Working copy           | closed | New `feature/component-workshop` on this clone; no extra worktree                  | plan-grill | asked — do not mix uncommitted hygiene into this branch        |

## Open

None.

## Log

- 2026-08-24 — D0, D2, D6 closed via plan-grill (clear-winner)
- 2026-08-24 — D1, D3–D5, D7–D9 closed via plan-grill (asked)
- 2026-08-24 — Industry scan: Storybook default platform; Ladle lean CSF; user chose custom pages
