import { Box, Stack, Typography } from "@mui/material";
import type { AutocompleteSelectOption } from "./autocompleteSelect.types.js";
import { AutocompleteSelectField } from "./AutocompleteSelectField.js";

export interface MetadataFilterFieldConfig {
  id: string;
  label: string;
  options: readonly AutocompleteSelectOption[];
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}

interface MetadataFiltersBarProps {
  fields: MetadataFilterFieldConfig[];
  /** Optional note under the row (e.g. client-only filter semantics). */
  helperText?: string;
  /** When true, fields are not interactive (e.g. no data yet). */
  disabled?: boolean;
}

/**
 * Shared compact row of multi-select metadata filters (AutocompleteSelectField).
 * Consumers own option lists and state; this only lays out consistent spacing and labels.
 */
export function MetadataFiltersBar({
  fields,
  helperText,
  disabled = false,
}: MetadataFiltersBarProps) {
  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", md: "flex-start" }}
        useFlexGap
        sx={{ flexWrap: "wrap" }}
      >
        {fields.map((field) => {
          const singleLabel =
            field.value.length === 1
              ? (field.options.find((o) => o.id === field.value[0])?.label ??
                field.value[0])
              : null;
          return (
            <Box
              key={field.id}
              sx={{
                flex: { md: "1 1 133px" },
                minWidth: { md: 133 },
                maxWidth: { md: 213 },
              }}
            >
              <AutocompleteSelectField
                mode="multiple"
                label={field.label}
                options={[...field.options]}
                value={field.value}
                onChange={field.onChange}
                disabled={disabled || field.disabled}
                size="small"
                placeholder={
                  field.value.length > 0
                    ? field.value.length === 1 && singleLabel
                      ? singleLabel
                      : `${field.value.length} geselecteerd`
                    : "Alle"
                }
                hideSelectedTags
              />
            </Box>
          );
        })}
      </Stack>
      {helperText ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 1 }}
        >
          {helperText}
        </Typography>
      ) : null}
    </Box>
  );
}
