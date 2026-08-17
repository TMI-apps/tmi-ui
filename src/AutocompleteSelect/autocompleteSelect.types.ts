/**
 * Option shape for {@link AutocompleteSelectField} and related hooks.
 * Lives in shared types so hooks/services do not import from `src/components`.
 */
export interface AutocompleteSelectOption {
  id: string;
  label: string;
  description?: string;
}
