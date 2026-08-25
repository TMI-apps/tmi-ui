import { Box } from "@mui/material";
import { useState } from "react";
import { MetadataFiltersBar } from "@tmi-packages/ui";
import type { AutocompleteSelectOption } from "@tmi-packages/ui/autocomplete";

const SUBJECT_OPTIONS: AutocompleteSelectOption[] = [
  { id: "rekenen", label: "Rekenen" },
  { id: "taal", label: "Taal" },
  { id: "wereldorientatie", label: "Wereldoriëntatie" },
  { id: "engels", label: "Engels" },
];

const GRADE_OPTIONS: AutocompleteSelectOption[] = [
  { id: "groep3", label: "Groep 3" },
  { id: "groep4", label: "Groep 4" },
  { id: "groep5", label: "Groep 5" },
  { id: "groep6", label: "Groep 6" },
];

export function Empty() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  return (
    <Box sx={{ width: 420 }}>
      <MetadataFiltersBar
        fields={[
          {
            id: "subjects",
            label: "Vak",
            options: SUBJECT_OPTIONS,
            value: subjects,
            onChange: setSubjects,
          },
          {
            id: "grades",
            label: "Groep",
            options: GRADE_OPTIONS,
            value: grades,
            onChange: setGrades,
          },
        ]}
        helperText="Filter lesmateriaal op vak en groep"
      />
    </Box>
  );
}

export function WithSelections() {
  const [subjects, setSubjects] = useState<string[]>(["rekenen"]);
  const [grades, setGrades] = useState<string[]>(["groep4", "groep5"]);
  return (
    <Box sx={{ width: 420 }}>
      <MetadataFiltersBar
        fields={[
          {
            id: "subjects",
            label: "Vak",
            options: SUBJECT_OPTIONS,
            value: subjects,
            onChange: setSubjects,
          },
          {
            id: "grades",
            label: "Groep",
            options: GRADE_OPTIONS,
            value: grades,
            onChange: setGrades,
          },
        ]}
        helperText="Filter lesmateriaal op vak en groep"
      />
    </Box>
  );
}

export function Disabled() {
  const [subjects] = useState<string[]>(["taal"]);
  const [grades] = useState<string[]>([]);
  return (
    <Box sx={{ width: 420 }}>
      <MetadataFiltersBar
        fields={[
          {
            id: "subjects",
            label: "Vak",
            options: SUBJECT_OPTIONS,
            value: subjects,
            onChange: () => undefined,
          },
          {
            id: "grades",
            label: "Groep",
            options: GRADE_OPTIONS,
            value: grades,
            onChange: () => undefined,
          },
        ]}
        disabled
        helperText="Filters worden geladen…"
      />
    </Box>
  );
}
