import type { FilterOptionsState } from "@mui/material/useAutocomplete";

import type { AutocompleteSelectOption } from "./autocompleteSelect.types.js";

/**
 * Move the creatable option to index 0 when it is present. Does not invent a row.
 * Relative order of other options is preserved.
 */
export function moveCreatableOptionFirst(
  options: AutocompleteSelectOption[],
  creatableOptionId: string | undefined,
): AutocompleteSelectOption[] {
  if (!creatableOptionId) return options;
  const idx = options.findIndex((option) => option.id === creatableOptionId);
  if (idx === -1 || idx === 0) return options;
  const next = options.slice();
  const [row] = next.splice(idx, 1);
  next.unshift(row);
  return next;
}

/** Apply `moveCreatableOptionFirst` after an existing Autocomplete `filterOptions`. */
export function wrapFilterOptionsWithCreatableFirst(
  filter: (
    options: AutocompleteSelectOption[],
    state: FilterOptionsState<AutocompleteSelectOption>,
  ) => AutocompleteSelectOption[],
  creatableOptionId: string | undefined,
): (
  options: AutocompleteSelectOption[],
  state: FilterOptionsState<AutocompleteSelectOption>,
) => AutocompleteSelectOption[] {
  return (options, state) =>
    moveCreatableOptionFirst(filter(options, state), creatableOptionId);
}
