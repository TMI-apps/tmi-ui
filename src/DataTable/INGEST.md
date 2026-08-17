# Table component — ingest landing zone

Source from Lesmateriaal lives under `lesmateriaal-import/`. Public API is wired from [`index.ts`](./index.ts) into `src/index.ts`.

**Phase 4 (`1.3.0`):** grid (`TMITable` / `DatabaseViewer`), overlay stack context, and grid utils are on the public barrel. Parity with Lesmateriaal `develop` confirmed import/format-only after snapshot (2026-08-14).

**Phase 6:** consumer API SSOT is the [package README — TMI table](../../README.md#tmi-table) (not Lesmateriaal docs). Extract-complete version is **1.3.x**, not `0.5.0`.

See [docs/jobs/temp_job_table-component-ingest/](../../docs/jobs/temp_job_table-component-ingest/) and `lesmateriaal-import/docs/COPY_MANIFEST.md`.
