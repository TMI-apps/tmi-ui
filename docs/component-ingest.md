# Ingesting a component from an app

How `@tmi-packages/ui` has taken UI out of apps, and what **not** to repeat.

## Precedent (this repo)

Earlier migrations shipped the **product the user sees** in **one** package version. Helpers that only the app still needed stayed in the app.

| Release                       | What moved                                                            | Shape                                                                                                                                                                                 |
| ----------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0.1.0` (`3872453`)           | `ThumbnailPill`                                                       | New package + public export of the pill. Consumer (`MediaChip` / `TopbarProjectChip`) switched in the **same** change set; app folder deleted. Theme tokens went with the component.  |
| `0.2.0` (`4043f52`, next day) | `VideoEmbedModal`                                                     | Copied the modal, **inlined** URL helpers so the package is self-contained. App `videoUrlUtils` stayed in the app for other callers. One MINOR, one new peer (`@mui/icons-material`). |
| `0.4.0` (`43a7daf`)           | `PersistentStepperList` + `textToStepperItems` + `usePersistentSteps` | Synced the **checklist surface** in one drop (list + parser + hook + optional `theme.checklist`).                                                                                     |

Pattern: **one component family → one export barrel → one npm minor → one consumer bump.** No multi-release peel of satellites before the main UI.

## Anti-pattern: TMI table leaf-first extract (2026-08)

Lesmateriaal `IMPLEMENTATION_PLAN` Phases 2→3→4 published **row satellites** (`1.1.0`), then **workspace/detail chrome** (`1.2.0`), and left the **grid** (`TMITable` / `DatabaseViewer`) unexported.

That is a live-app unplug strategy (shim per layer, publish-before-consumer). In this library it was **too slow**: extra PRs, extra Version packages + Publish cycles, consumer lockfile skew (`workspaceDetailDrawerModalZ` imported while Vite still served `1.1.0`), and after two minors the package still does not export a table.

**Do not use that ordering for further ingest.** Future table (or other large) work: follow the precedent and [PASTE_GUIDE.md](./jobs/temp_job_table-component-ingest/PASTE_GUIDE.md) § Public API — export the **main table** (plus types/hooks consumers need) in **one** minor. Keep app-only adapters (export/xlsx, `useRecordEditSession`) in the app. Overlay stack is package-owned (`PortaledOverlayStackProvider`).

Grid export shipped in **1.3.0**. Consumer SSOT: [README — TMI table](../README.md#tmi-table). Extract-complete version is **1.3.x**, not `0.5.0`.
