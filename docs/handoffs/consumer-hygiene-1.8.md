# Consumer handoff — `@tmi-packages/ui` 1.8.0 (library hygiene)

Run this **after 1.8.0 is on npm**. This library job does not bump consumer repos unless the owner asks.

## 1. Bump and recopy the adopt skill

```bash
pnpm add @tmi-packages/ui@^1.8.0
```

Recopy `.agents/skills/adopt-from-tmi-ui` from `node_modules/@tmi-packages/ui/.agents/skills/` (see [consumer-setup](../consumer-setup.md#5-adopt-skill-cursor)). `forPackageVersion` should read **1.8.0**.

## 2. Install vs runtime

Optional peers only affect **install**. Missing a peer still breaks **compile/runtime** if you import that API.

| Surface               | Optional at install                               | Required at runtime                                            |
| --------------------- | ------------------------------------------------- | -------------------------------------------------------------- |
| Pills without `to=`   | omit router + table stack                         | React + MUI + Emotion                                          |
| `ThumbnailPill` `to=` | —                                                 | `react-router-dom`                                             |
| Autocomplete          | table stack still optional until you import table | overlay provider; `createTmiTableTheme` for primary chrome     |
| `TMITable`            | —                                                 | `@tanstack/react-table`, `@tanstack/react-virtual` **3.13.24** |
| Row reorder           | —                                                 | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`     |

There are **no** lazy `import()` guards in 1.8.

## 3. Theme side-effect

If you import only `@tmi-packages/ui/table` or `@tmi-packages/ui/autocomplete`, also:

```ts
import "@tmi-packages/ui";
```

Root `src/index.ts` loads `./theme.js`. Subpath barrels do not.

## 4. Autocomplete + overlay

`./autocomplete` is **not** standalone. It uses table overlay/skin internals. Wrap hosts with `PortaledOverlayStackProvider` (`hostModalZ`) from the root barrel or `./table`.

## 5. Names in 1.8

Prefer `TMITable`. `DatabaseViewer` and `AirtableAttachmentThumbnailCell` / `createAirtableAttachmentThumbnailColumn` still work and are JSDoc-deprecated. **No** new `Attachment*` public names in 1.8.

## 6. Skip-walk groups for a future 2.0

Ask the human for each group you did **not** wire or still import under the old name. Record in the **consumer** job `DECISIONS.md`:

| Group               | Examples                                                                                                                                                         |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Headline grid       | `DatabaseViewer` vs `TMITable`                                                                                                                                   |
| Height hooks        | `useDatabaseViewerMaxHeight` / `useTMITableMaxHeight` (prefer omit `maxHeight`)                                                                                  |
| Airtable thumbs     | `AirtableAttachmentThumbnailCell`, `createAirtableAttachmentThumbnailColumn`                                                                                     |
| Helper / sx / debug | `getDatabaseViewer*` sx helpers, `warnDuplicateDatabaseViewerVirtualRowKeys`, `buildDatabaseViewerVirtualRowKey`, `DatabaseViewer*` types you import in app code |

Do not treat a closed PR comment as the skip-walk.

## 7. Verify

- App `type-check` and `build`
- Smoke: table browse + one Autocomplete (open, select, overlay in a drawer/modal)
- Confirm Vite still `optimizeDeps.include: ["@tmi-packages/ui"]`
