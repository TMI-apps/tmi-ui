import { Box, Button, Stack, Typography } from "@mui/material";
import { useState, type ReactElement, type SyntheticEvent } from "react";
import {
  AutocompleteSelectField,
  ListRowAddButton,
  MetadataFiltersBar,
  PersistentStepperList,
  PrimaryContainedAutocompleteBar,
  RowStyleMultiSelect,
  RowStyleReadonlyRow,
  ThumbnailPill,
  ThumbnailPillRemoveTableRowSlot,
  VideoEmbedModal,
  AirtableAttachmentThumbnailCell,
  DataTableTruncatedOverflow,
  DataTableTruncatedText,
  TableRowActionButton,
  TableRowThumbnailPlaceholder,
  TableRowThumbnailShell,
  TMITableWorkspace,
} from "@tmi-packages/ui";
import type { AutocompleteSelectOption } from "@tmi-packages/ui/autocomplete";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { KitchenSinkWorkspace } from "./kitchenSinkTable.js";
import {
  WorkshopSection,
  type WorkshopTocItem,
} from "./layout/WorkshopLayout.js";

const THUMB_URL = "https://picsum.photos/seed/tmi-ui-workshop/96/96";
const OPTIONS: AutocompleteSelectOption[] = [
  { id: "1", label: "Alpha" },
  { id: "2", label: "Beta" },
  { id: "3", label: "Gamma" },
];

function ThumbnailPillDemos(): ReactElement {
  return (
    <Stack spacing={2}>
      <ThumbnailPill
        title="Default pill"
        thumbnail={THUMB_URL}
        tooltip="Tooltip on hover"
      />
      <ThumbnailPill
        title="App bar variant"
        variant="appBar"
        thumbnail={THUMB_URL}
        to="/docs"
      />
    </Stack>
  );
}

function VideoEmbedDemos(): ReactElement {
  const [openProvider, setOpenProvider] = useState<"youtube" | "vimeo" | null>(
    null,
  );
  return (
    <Stack direction="row" spacing={1}>
      <Button variant="outlined" onClick={() => setOpenProvider("youtube")}>
        Open YouTube
      </Button>
      <Button variant="outlined" onClick={() => setOpenProvider("vimeo")}>
        Open Vimeo
      </Button>
      <VideoEmbedModal
        open={openProvider === "youtube"}
        onClose={() => setOpenProvider(null)}
        title="YouTube sample"
        url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      />
      <VideoEmbedModal
        open={openProvider === "vimeo"}
        onClose={() => setOpenProvider(null)}
        title="Vimeo sample"
        url="https://vimeo.com/76979871"
      />
    </Stack>
  );
}

function StepperDemo(): ReactElement {
  return (
    <PersistentStepperList
      activityId="workshop-stepper"
      instructionText={`1. Main step one
  Sub-step detail
2. Main step two
3. Main step three`}
    />
  );
}

function AutocompleteFieldDemo(): ReactElement {
  const [value, setValue] = useState<string | null>(null);
  return (
    <AutocompleteSelectField
      mode="single"
      label="Pick one"
      options={OPTIONS}
      value={value}
      onChange={setValue}
    />
  );
}

function MetadataFiltersDemo(): ReactElement {
  const [tags, setTags] = useState<string[]>([]);
  return (
    <MetadataFiltersBar
      fields={[
        {
          id: "tags",
          label: "Tags",
          options: OPTIONS,
          value: tags,
          onChange: setTags,
        },
      ]}
      helperText="Workshop metadata filters bar"
    />
  );
}

function PrimaryBarDemo(): ReactElement {
  const [value, setValue] = useState<string | null>(null);
  return (
    <PrimaryContainedAutocompleteBar
      mode="single"
      label="Add item"
      options={OPTIONS}
      value={value}
      onChange={setValue}
      placeholder="Type to search…"
    />
  );
}

function ListRowAddDemo(): ReactElement {
  return (
    <ListRowAddButton
      label="Add row"
      visualVariant="primary"
      onClick={() => undefined}
    />
  );
}

function RowStyleMultiSelectDemo(): ReactElement {
  const [value, setValue] = useState<string[]>(["1"]);
  const [input, setInput] = useState("");
  return (
    <RowStyleMultiSelect
      sectionTitle="Goals"
      autocompleteLabel="Add goal"
      placeholder="Search goals"
      options={OPTIONS}
      value={value}
      onChange={setValue}
      controlledInput={{
        inputValue: input,
        onInputChange: (_e: SyntheticEvent | null, v: string) => setInput(v),
      }}
      selectedRows={value.map((id) => ({
        id,
        label: OPTIONS.find((o) => o.id === id)?.label ?? id,
      }))}
      removeAriaLabel="Remove"
      onRemove={(id) => setValue((prev) => prev.filter((x) => x !== id))}
      addRowLabel="Add goal"
      addRowAriaLabel="Add goal"
    />
  );
}

function FilterPromptDemo(): ReactElement {
  return (
    <TMITableWorkspace
      leftHeader={<Typography variant="subtitle2">Filters idle</Typography>}
      table={<Box p={2}>Table hidden while filter prompt active</Box>}
      detailOpen={false}
      detailPanel={null}
      filterPromptActive={true}
      enableViewportFill={false}
    />
  );
}

function OverlaySmokeDemo(): ReactElement {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Box sx={{ maxWidth: 360 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        mb={1}
      >
        Autocomplete popper under PortaledOverlayStackProvider (app shell).
      </Typography>
      <AutocompleteSelectField
        mode="single"
        label="Overlay smoke"
        options={OPTIONS}
        value={value}
        onChange={setValue}
      />
    </Box>
  );
}

export type VisualSection = {
  id: string;
  title: string;
  render: () => ReactElement;
};

export const visualSections: VisualSection[] = [
  {
    id: "overlay-smoke",
    title: "Overlay smoke",
    render: () => <OverlaySmokeDemo />,
  },
  {
    id: "thumbnail-pill",
    title: "ThumbnailPill",
    render: () => <ThumbnailPillDemos />,
  },
  {
    id: "video-embed-modal",
    title: "VideoEmbedModal",
    render: () => <VideoEmbedDemos />,
  },
  {
    id: "persistent-stepper",
    title: "PersistentStepperList",
    render: () => <StepperDemo />,
  },
  {
    id: "autocomplete-field",
    title: "AutocompleteSelectField",
    render: () => <AutocompleteFieldDemo />,
  },
  {
    id: "metadata-filters",
    title: "MetadataFiltersBar",
    render: () => <MetadataFiltersDemo />,
  },
  {
    id: "primary-bar",
    title: "PrimaryContainedAutocompleteBar",
    render: () => <PrimaryBarDemo />,
  },
  {
    id: "list-row-add",
    title: "ListRowAddButton",
    render: () => <ListRowAddDemo />,
  },
  {
    id: "row-style-multiselect",
    title: "RowStyleMultiSelect",
    render: () => <RowStyleMultiSelectDemo />,
  },
  {
    id: "row-style-readonly",
    title: "RowStyleReadonlyRow",
    render: () => <RowStyleReadonlyRow label="Read-only row label" />,
  },
  {
    id: "thumbnail-pill-remove-slot",
    title: "ThumbnailPillRemoveTableRowSlot",
    render: () => (
      <ThumbnailPill
        title="Removable row"
        thumbnail={THUMB_URL}
        rightSlot={
          <ThumbnailPillRemoveTableRowSlot
            onRemove={() => undefined}
            removeAriaLabel="Remove"
          />
        }
      />
    ),
  },
  {
    id: "table-row-action",
    title: "TableRowActionButton",
    render: () => (
      <TableRowActionButton
        title="Delete"
        aria-label="Delete"
        onClick={() => undefined}
      >
        <DeleteOutline fontSize="small" />
      </TableRowActionButton>
    ),
  },
  {
    id: "table-row-thumbnail-shell",
    title: "TableRowThumbnailShell",
    render: () => <TableRowThumbnailShell src={THUMB_URL} alt="Thumb" />,
  },
  {
    id: "table-row-thumbnail-placeholder",
    title: "TableRowThumbnailPlaceholder",
    render: () => <TableRowThumbnailPlaceholder />,
  },
  {
    id: "truncated-text",
    title: "DataTableTruncatedText",
    render: () => (
      <DataTableTruncatedText text="Long label that truncates in narrow cells when space is tight." />
    ),
  },
  {
    id: "truncated-overflow",
    title: "DataTableTruncatedOverflow",
    render: () => (
      <DataTableTruncatedOverflow title="Overflow wrapper">
        Overflow wrapper around truncated table text in the workshop.
      </DataTableTruncatedOverflow>
    ),
  },
  {
    id: "airtable-thumbnail-cell",
    title: "AirtableAttachmentThumbnailCell",
    render: () => (
      <Box sx={{ width: 56, height: 56 }}>
        <AirtableAttachmentThumbnailCell
          value={[
            { url: THUMB_URL, thumbnails: { small: { url: THUMB_URL } } },
          ]}
        />
      </Box>
    ),
  },
  {
    id: "filter-prompt",
    title: "Filter prompt workspace",
    render: () => <FilterPromptDemo />,
  },
  {
    id: "kitchen-sink-table",
    title: "Kitchen-sink TMITable",
    render: () => <KitchenSinkWorkspace />,
  },
];

export function visualTocItems(): WorkshopTocItem[] {
  return visualSections.map((s) => ({ id: s.id, label: s.title }));
}

export function VisualsPage(): ReactElement {
  return (
    <>
      {visualSections.map((section) => (
        <WorkshopSection key={section.id} id={section.id} title={section.title}>
          {section.render()}
        </WorkshopSection>
      ))}
    </>
  );
}
