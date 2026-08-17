---
"@tmi-packages/ui": minor
---

Export the AutocompleteSelect family (`AutocompleteSelectField`, `PrimaryContainedAutocompleteBar`, `MetadataFiltersBar`, `ListRowAddButton`, `RowStyleMultiSelect`, and related types).

Add `theme.tmiPrimaryContained` via `createTmiTableTheme` so the primary add-bar and `ListRowAddButton` share one token. Wrap drawer/modal hosts with `PortaledOverlayStackProvider`. Minimum consumer version `^1.6.0`.
