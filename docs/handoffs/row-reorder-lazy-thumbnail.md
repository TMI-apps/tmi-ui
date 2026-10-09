# Consumer handoff — row reorder thumbnails

Run this **after the release that contains changeset `row-reorder-lazy-thumbnail` is on npm**. This library job does not bump consumer repos.

Package: `@tmi-packages/ui`  
Change: minor (new optional prop + reorder ghost behavior)

## What changed

1. **Dragged row stays in the render tree.** `rowReorder` (`dropPlacement` `"between"` and `"onto"`) hides the source `<tr>` with `opacity: 0` and `pointer-events: none`. It no longer uses `visibility: hidden`. The drag overlay is still the visible preview.
2. **`TableRowThumbnailShell` `imgLoading`.** Optional `"lazy"` (default) or `"eager"`. `"lazy"` still sets `fetchpriority="low"`. `"eager"` omits that hint.

`visibility: hidden` on the source row blocked native lazy image loads. `onLoad` never ran, MUI `Fade` stayed closed, and the cell kept the em-dash placeholder until a full remount. Opacity keeps the row rendered so the load can finish during the drag.

## What you should do

1. Bump `@tmi-packages/ui` to the published version that includes this change.
2. Anywhere a row thumbnail is rendered with `TableRowThumbnailShell` inside a `TMITable` that sets `rowReorder`, pass `imgLoading="eager"`.
3. Delete app workarounds that remount a thumbnail after drop (epoch / `requestAnimationFrame` / polling `tr` visibility). The package no longer leaves the source row `visibility: hidden`.

Known lesmateriaal-datasync cleanup after the bump:

- `src/features/lesmateriaal/components/LesmateriaalThumbnailTableCell.tsx` — pass `imgLoading="eager"` into `TableRowThumbnailShell` (curriculum Planning + lesmateriaal browse).
- Remove `thumbReload` from `CurriculumThumbnailsContext`.
- Delete `src/features/doelen/school/utils/schedulePlanningRowThumbRemount.ts` and its test.
- Remove `reloadMovedThumb` / `planningTableSurfaceRef` / `thumbReload` wiring in `SchoolCurriculumVakPeriodeTable.tsx`.

Other apps: search for `visibility === "hidden"` polling, thumb remount keys, and `TableRowThumbnailShell` used beside `rowReorder`.

## Verify

Production build (`pnpm build` + preview), not only Vite dev:

- Drag a row that has a thumbnail to a new index. The thumb is back within one paint after drop (a short fade-in is fine).
- Drag overlay still shows the thumbnail during the drag.
- `"onto"` reorder (Groups-style reparent) still drops on the highlighted row; the dragged row is invisible while dragging and returns after drop.
