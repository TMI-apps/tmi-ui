# TMI table

Grid + optional workspace from `@tmi-packages/ui` **1.3.0+**. Types in `dist/index.d.ts` are the contract. Prefer `TMITable` over `DatabaseViewer`.

## Install

```bash
pnpm add @tmi-packages/ui@^1.3.0
```

Peers: React 19, MUI 7, Emotion 11, `@tanstack/react-table` ^8.21, `@tanstack/react-virtual` 3.13.x, `@dnd-kit/core` / `sortable` / `utilities`. See [README](../README.md#peer-dependencies).

Vite: `optimizeDeps.include: ["@tmi-packages/ui"]` — never `exclude` (dev named-export crash).

## Theme

```ts
import { createTheme } from "@mui/material/styles";
import { createTmiTableTheme } from "@tmi-packages/ui";
import "@tmi-packages/ui"; // MUI module augmentation

const theme = createTmiTableTheme(createTheme(/* your tokens */));
```

Do not redeclare `detailPanelHero` / `tmiTableWorkspace` in the app.

## Grid

```tsx
import { TMITable, staticClientVirtualizedList } from "@tmi-packages/ui";
import type { ColumnDef } from "@tanstack/react-table";

type Row = { id: string; name: string };

const columns: ColumnDef<Row>[] = [{ accessorKey: "name", header: "Name" }];

<TMITable
  data={rows}
  columns={columns}
  loading={false}
  error={null}
  getRowId={(r) => r.id}
  serverInfinite={staticClientVirtualizedList(rows.length)}
/>;
```

Server-backed lists: pass `serverInfinite` (`TMITableServerInfinite`). Tree: `tree`. Reorder: wrap with `TmiRowReorderDndProvider` and pass `rowReorder`.

## Workspace (table + detail)

```tsx
import { TMITableWorkspace } from "@tmi-packages/ui";

<TMITableWorkspace
  leftHeader={filters}
  table={<TMITable /* ... */ />}
  detailOpen={Boolean(selected)}
  detailPanel={selected ? <YourDetail record={selected} /> : null}
/>;
```

Hero / edit chrome: `TMITableDetailEditPanel`, `DetailPanelHeroHeader`, `UnsavedChangesDialog`. Dirty state is **your** hook — pass it into `UnsavedChangesDialog`.

## Overlays

`TMITableWorkspace` mounts `PortaledOverlayStackProvider`. Autocomplete / Popper inside or beside the drawer must use **that** context (same package copy):

```ts
import { usePortaledOverlayPopperZIndex } from "@tmi-packages/ui";
```

If the app already has a local overlay module, re-export from `@tmi-packages/ui` — do not keep a second React context. Modals above the drawer: `workspaceDetailDrawerModalZ(theme)`.

## App-only (not in this package)

Edit session, multi-select `.xlsx` export, `logTableLoadSummary`. Inject load logging via `debug.onTableLoadSettled` if you want it; the library default is a no-op.

## Check

`pnpm type-check`, `pnpm build`, cold `pnpm dev`. Drawer + narrow-viewport autocomplete sit above the drawer, not behind it.
