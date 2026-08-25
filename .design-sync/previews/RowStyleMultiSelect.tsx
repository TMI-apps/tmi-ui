import { Box } from "@mui/material";
import { useState, type SyntheticEvent } from "react";
import { RowStyleMultiSelect } from "@tmi-packages/ui";
import type { AutocompleteSelectOption } from "@tmi-packages/ui/autocomplete";

const GOAL_OPTIONS: AutocompleteSelectOption[] = [
  { id: "klok", label: "Klok lezen" },
  { id: "optellen", label: "Optellen tot 100" },
  { id: "werkwoordspelling", label: "Werkwoordspelling" },
  { id: "topografie", label: "Topografie Nederland" },
];

export function Empty() {
  const [value, setValue] = useState<string[]>([]);
  const [input, setInput] = useState("");
  return (
    <Box sx={{ width: 360 }}>
      <RowStyleMultiSelect
        sectionTitle="Leerdoelen"
        autocompleteLabel="Leerdoel toevoegen"
        placeholder="Zoek leerdoel…"
        options={GOAL_OPTIONS}
        value={value}
        onChange={setValue}
        controlledInput={{
          inputValue: input,
          onInputChange: (_e: SyntheticEvent | null, v: string) => setInput(v),
        }}
        selectedRows={[]}
        removeAriaLabel="Verwijderen"
        onRemove={() => undefined}
        addRowLabel="Leerdoel toevoegen"
        addRowAriaLabel="Leerdoel toevoegen"
      />
    </Box>
  );
}

export function WithSelectedRows() {
  const [value, setValue] = useState<string[]>(["klok", "optellen"]);
  const [input, setInput] = useState("");
  return (
    <Box sx={{ width: 360 }}>
      <RowStyleMultiSelect
        sectionTitle="Leerdoelen"
        autocompleteLabel="Leerdoel toevoegen"
        placeholder="Zoek leerdoel…"
        options={GOAL_OPTIONS}
        value={value}
        onChange={setValue}
        controlledInput={{
          inputValue: input,
          onInputChange: (_e: SyntheticEvent | null, v: string) => setInput(v),
        }}
        selectedRows={[
          { id: "klok", label: "Klok lezen" },
          {
            id: "optellen",
            label: "Optellen tot 100",
            readOnly: true,
            readOnlyTooltip: "Gesynchroniseerd vanuit Airtable",
          },
        ]}
        removeAriaLabel="Verwijderen"
        onRemove={(id) => setValue((prev) => prev.filter((x) => x !== id))}
        addRowLabel="Leerdoel toevoegen"
        addRowAriaLabel="Leerdoel toevoegen"
      />
    </Box>
  );
}

export function TagPillVariant() {
  const [value, setValue] = useState<string[]>(["klok", "werkwoordspelling"]);
  const [input, setInput] = useState("");
  return (
    <Box sx={{ width: 360 }}>
      <RowStyleMultiSelect
        sectionTitle="Tags"
        autocompleteLabel="Tag toevoegen"
        placeholder="Zoek tag…"
        options={GOAL_OPTIONS}
        value={value}
        onChange={setValue}
        controlledInput={{
          inputValue: input,
          onInputChange: (_e: SyntheticEvent | null, v: string) => setInput(v),
        }}
        selectedRowVisual="tagPill"
        selectedRows={[
          { id: "klok", label: "Klok lezen" },
          { id: "werkwoordspelling", label: "Werkwoordspelling" },
        ]}
        removeAriaLabel="Verwijderen"
        onRemove={(id) => setValue((prev) => prev.filter((x) => x !== id))}
        addRowLabel="Tag toevoegen"
        addRowAriaLabel="Tag toevoegen"
      />
    </Box>
  );
}
