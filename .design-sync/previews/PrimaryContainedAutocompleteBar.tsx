import { Box } from "@mui/material";
import { useState } from "react";
import { PrimaryContainedAutocompleteBar } from "@tmi-packages/ui";
import type { AutocompleteSelectOption } from "@tmi-packages/ui/autocomplete";

const GOAL_OPTIONS: AutocompleteSelectOption[] = [
  { id: "klok", label: "Klok lezen" },
  { id: "optellen", label: "Optellen tot 100" },
  { id: "werkwoordspelling", label: "Werkwoordspelling" },
  { id: "topografie", label: "Topografie Nederland" },
];

export function SingleSelectBar() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Box sx={{ width: 320 }}>
      <PrimaryContainedAutocompleteBar
        mode="single"
        label="Leerdoel toevoegen"
        placeholder="Zoek leerdoel…"
        options={GOAL_OPTIONS}
        value={value}
        onChange={setValue}
      />
    </Box>
  );
}

export function MultipleSelectBar() {
  const [value, setValue] = useState<string[]>(["klok"]);
  return (
    <Box sx={{ width: 320 }}>
      <PrimaryContainedAutocompleteBar
        mode="multiple"
        label="Leerdoelen toevoegen"
        placeholder="Zoek leerdoel…"
        options={GOAL_OPTIONS}
        value={value}
        onChange={setValue}
      />
    </Box>
  );
}

export function NoIcon() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Box sx={{ width: 320 }}>
      <PrimaryContainedAutocompleteBar
        mode="single"
        label="Leerdoel toevoegen"
        placeholder="Zoek leerdoel…"
        options={GOAL_OPTIONS}
        value={value}
        onChange={setValue}
        startIcon={null}
      />
    </Box>
  );
}
