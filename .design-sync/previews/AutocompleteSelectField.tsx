import { Box } from "@mui/material";
import { useState } from "react";
import { AutocompleteSelectField } from "@tmi-packages/ui";
import type { AutocompleteSelectOption } from "@tmi-packages/ui/autocomplete";

const SUBJECT_OPTIONS: AutocompleteSelectOption[] = [
  { id: "rekenen", label: "Rekenen" },
  { id: "taal", label: "Taal" },
  { id: "wereldorientatie", label: "Wereldoriëntatie" },
  { id: "engels", label: "Engels" },
  { id: "gym", label: "Bewegingsonderwijs" },
];

const GOAL_OPTIONS: AutocompleteSelectOption[] = [
  {
    id: "klok",
    label: "Klok lezen",
    description: "Analoge en digitale tijdnotatie",
  },
  {
    id: "optellen",
    label: "Optellen tot 100",
    description: "Met en zonder brug",
  },
  {
    id: "werkwoordspelling",
    label: "Werkwoordspelling",
    description: "Tegenwoordige en verleden tijd",
  },
  { id: "topografie", label: "Topografie Nederland" },
];

export function SingleSelect() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Box sx={{ width: 260 }}>
      <AutocompleteSelectField
        mode="single"
        label="Vak"
        options={SUBJECT_OPTIONS}
        value={value}
        onChange={setValue}
      />
    </Box>
  );
}

export function SingleSelectWithValue() {
  const [value, setValue] = useState<string | null>("taal");
  return (
    <Box sx={{ width: 260 }}>
      <AutocompleteSelectField
        mode="single"
        label="Vak"
        options={SUBJECT_OPTIONS}
        value={value}
        onChange={setValue}
      />
    </Box>
  );
}

export function MultipleSelectWithChips() {
  const [value, setValue] = useState<string[]>(["klok", "optellen"]);
  return (
    <Box sx={{ width: 320 }}>
      <AutocompleteSelectField
        mode="multiple"
        label="Leerdoelen"
        options={GOAL_OPTIONS}
        value={value}
        onChange={setValue}
      />
    </Box>
  );
}

export function LoadingState() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Box sx={{ width: 260 }}>
      <AutocompleteSelectField
        mode="single"
        label="Vak"
        options={SUBJECT_OPTIONS}
        value={value}
        onChange={setValue}
        loading
        helperText="Suggesties laden…"
      />
    </Box>
  );
}

export function ErrorState() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Box sx={{ width: 260 }}>
      <AutocompleteSelectField
        mode="single"
        label="Vak"
        options={SUBJECT_OPTIONS}
        value={value}
        onChange={setValue}
        error
        helperText="Kon suggesties niet laden"
      />
    </Box>
  );
}
