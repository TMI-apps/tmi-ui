import { Box, Stack, Tooltip, Typography } from "@mui/material";

import Add from "@mui/icons-material/Add";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import LockOutlined from "@mui/icons-material/LockOutlined";
import type { FilterOptionsState } from "@mui/material/useAutocomplete";
import type { Theme } from "@mui/material/styles";
import { DetailPanelSectionHeading } from "../DataTable/lesmateriaal-import/tmiTable/DetailPanelSectionHeading.js";
import { ThumbnailPill } from "../ThumbnailPill/ThumbnailPill.js";
import type { AutocompleteSelectOption } from "./autocompleteSelect.types.js";
import { ListRowAddButton } from "./ListRowAddButton.js";
import { PrimaryContainedAutocompleteBar } from "./PrimaryContainedAutocompleteBar.js";
import { TableRowActionButton } from "../DataTable/lesmateriaal-import/satellites/TableRowActionButton.js";
import { ThumbnailPillRemoveTableRowSlot } from "./ThumbnailPillRemoveTableRowSlot.js";
import { getTableInteractionSkin } from "../DataTable/lesmateriaal-import/shared-theme/tableInteractionSkin.js";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";

/** Shared shell for table-style doelen rows (edit selected row + read-only detail). */
export function rowStyleTableRowShellSx(theme: Theme) {
  const skin = getTableInteractionSkin(theme, "lightweight");
  return {
    display: "flex",
    alignItems: "stretch",
    gap: 0,
    px: 1,
    py: 0.75,
    minHeight: skin.rowMinHeightPx,
    borderRadius: `${skin.rowBorderRadiusPx}px`,
    bgcolor: skin.rowBackground,
    overflow: "visible",
    transition: "background-color 0.15s ease",
    "&:hover": {
      bgcolor: skin.rowHoverBackground,
    },
  };
}

/** Read-only doelen row matching edit-mode table rows, without the action column. */
export function RowStyleReadonlyRow({ label }: { label: string }) {
  return (
    <Box sx={(theme) => rowStyleTableRowShellSx(theme)}>
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          minWidth: 0,
          px: 0.75,
          alignSelf: "flex-start",
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export interface RowStyleMultiSelectProps {
  sectionTitle: string;
  /** Visible `AutocompleteSelectField` label (also used for aria when input is shown). */
  autocompleteLabel: string;
  placeholder: string;
  options: readonly AutocompleteSelectOption[];
  value: string[];
  onChange: (nextValue: string[]) => void;
  onChangeReason?: (reason: string) => void;
  controlledInput: {
    inputValue: string;
    onInputChange: (
      event: SyntheticEvent | null,
      value: string,
      reason: string,
    ) => void;
  };
  loading?: boolean;
  filterOptionsOverride?: (
    options: AutocompleteSelectOption[],
    state: FilterOptionsState<AutocompleteSelectOption>,
  ) => AutocompleteSelectOption[];
  /** When set, that option is rendered as a creatable row (add icon) in the dropdown. */
  creatableOptionId?: string;
  getOptionDisabled?: (option: AutocompleteSelectOption) => boolean;
  hideSelectedTags?: boolean;
  /**
   * How selected items render above the add row. `tableRow` matches Curriculumdoelen
   * (full-width row + side action). `tagPill` uses `ThumbnailPill` + tag icon like
   * lesmateriaal detail view mode, with lock/trash on the chip's right.
   */
  selectedRowVisual?: "tableRow" | "tagPill";
  /** Leading glyph inside `tagPill` chips. Caller supplies domain art (e.g. tag icon). */
  thumbnailPlaceholder?: ReactNode;
  /**
   * One row per selected id (label resolved by parent). When `readOnly` is set,
   * the row is rendered without a delete button and shows a non-interactive
   * lock icon (with `readOnlyTooltip`) instead â€” used for entries managed in
   * an upstream source (e.g. Airtable sync) that cannot be removed from this
   * editor.
   */
  selectedRows: ReadonlyArray<{
    id: string;
    label: string;
    readOnly?: boolean;
    readOnlyTooltip?: string;
  }>;
  removeAriaLabel: string;
  onRemove: (id: string) => void;
  /** Primary add row label (collapsed). */
  addRowLabel: string;
  addRowAriaLabel?: string;
  /** Called when the add row collapses (select, Escape, or blur away). */
  onCollapse?: () => void;
  /** When true, selected rows only (e.g. read-only tags in override mode). */
  suppressAddRow?: boolean;
  /** Hide the section heading when the parent renders its own title above selected rows. */
  hideSectionHeading?: boolean;
  /** Renders after the add/autocomplete row (e.g. â€œNieuw lesdoel toevoegenâ€). */
  footer?: ReactNode;
}

function RowStyleMultiSelectSelectedRowItem({
  row,
  removeAriaLabel,
  onRemove,
}: {
  row: {
    id: string;
    label: string;
    readOnly?: boolean;
    readOnlyTooltip?: string;
  };
  removeAriaLabel: string;
  onRemove: (id: string) => void;
}) {
  return (
    <Box sx={(theme) => rowStyleTableRowShellSx(theme)}>
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          minWidth: 0,
          px: 0.75,
          alignSelf: "flex-start",
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}
      >
        {row.label}
      </Typography>
      {row.readOnly ? (
        <Tooltip
          title={row.readOnlyTooltip ?? ""}
          placement="top"
          arrow
          disableInteractive
        >
          <Box
            aria-hidden={row.readOnlyTooltip ? undefined : true}
            aria-label={row.readOnlyTooltip || undefined}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              px: 1.25,
              minWidth: 40,
              color: "text.secondary",
            }}
          >
            <LockOutlined fontSize="small" />
          </Box>
        </Tooltip>
      ) : (
        <TableRowActionButton
          title="Verwijderen"
          aria-label={removeAriaLabel}
          onClick={(event) => {
            event.stopPropagation();
            onRemove(row.id);
          }}
          sx={{
            px: 1.25,
            borderRadius: 0,
            height: "100%",
            minHeight: "100%",
            alignSelf: "stretch",
            minWidth: 40,
          }}
        >
          <DeleteOutline fontSize="small" />
        </TableRowActionButton>
      )}
    </Box>
  );
}

function TagPillSelectedRowItem({
  row,
  removeAriaLabel,
  onRemove,
  thumbnailPlaceholder,
}: {
  row: {
    id: string;
    label: string;
    readOnly?: boolean;
    readOnlyTooltip?: string;
  };
  removeAriaLabel: string;
  onRemove: (id: string) => void;
  thumbnailPlaceholder?: ReactNode;
}) {
  const rightSlot = row.readOnly ? (
    <Tooltip
      title={row.readOnlyTooltip ?? ""}
      placement="top"
      arrow
      disableInteractive
    >
      <Box
        aria-label={row.readOnlyTooltip || undefined}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          px: 0.75,
          color: "text.secondary",
        }}
      >
        <LockOutlined fontSize="small" />
      </Box>
    </Tooltip>
  ) : (
    <ThumbnailPillRemoveTableRowSlot
      removeAriaLabel={removeAriaLabel}
      onRemove={() => onRemove(row.id)}
    />
  );

  return (
    <ThumbnailPill
      title={row.label}
      tooltip={row.label}
      thumbnailPlaceholder={thumbnailPlaceholder}
      rightSlot={rightSlot}
    />
  );
}

function RowStyleMultiSelectExpandedSearchRow({
  autocompleteLabel,
  placeholder,
  options,
  value,
  onChange,
  onChangeReason,
  onAutocompleteClose,
  controlledInput,
  filterOptionsOverride,
  creatableOptionId,
  getOptionDisabled,
  hideSelectedTags,
  loading,
}: Pick<
  RowStyleMultiSelectProps,
  | "autocompleteLabel"
  | "placeholder"
  | "options"
  | "value"
  | "onChange"
  | "onChangeReason"
  | "controlledInput"
  | "filterOptionsOverride"
  | "creatableOptionId"
  | "getOptionDisabled"
  | "hideSelectedTags"
  | "loading"
> & {
  onAutocompleteClose: (event: SyntheticEvent, reason: string) => void;
}) {
  return (
    <PrimaryContainedAutocompleteBar
      mode="multiple"
      label={autocompleteLabel}
      placeholder={placeholder}
      options={options}
      value={value}
      onChange={onChange}
      onChangeReason={onChangeReason}
      onClose={onAutocompleteClose}
      preventListboxFocusSteal
      controlledInput={controlledInput}
      filterOptionsOverride={filterOptionsOverride}
      creatableOptionId={creatableOptionId}
      getOptionDisabled={getOptionDisabled}
      hideSelectedTags={hideSelectedTags}
      preserveSelectionOnClear
      loading={loading}
    />
  );
}

/**
 * Expand/collapse wrapper for multi-select autocomplete rows. Collapse is driven by Escape
 * or focus leaving the section (not on each `selectOption`), so the list can stay open for
 * multi-pick (MUI `disableCloseOnSelect` on `AutocompleteSelectField`; gh #34).
 */
function useRowStyleMultiSelectExpand(
  onCollapseProp: (() => void) | undefined,
) {
  const [expanded, setExpanded] = useState(false);
  const sectionRootRef = useRef<HTMLDivElement | null>(null);
  const collapse = useCallback(() => {
    setExpanded(false);
    onCollapseProp?.();
  }, [onCollapseProp]);

  const handleAutocompleteClose = useCallback(
    (_event: SyntheticEvent, reason: string) => {
      if (reason === "escape") {
        collapse();
      }
    },
    [collapse],
  );

  const handleSectionBlur = useCallback(
    (e: FocusEvent<HTMLDivElement>) => {
      if (!expanded) return;
      const next = e.relatedTarget as Node | null;
      if (next !== null && e.currentTarget.contains(next)) return;
      window.setTimeout(() => {
        const active = document.activeElement;
        if (sectionRootRef.current?.contains(active)) return;
        const listbox = document.querySelector('[role="listbox"]');
        if (listbox?.contains(active)) return;
        collapse();
      }, 0);
    },
    [collapse, expanded],
  );

  useEffect(() => {
    if (!expanded) return;
    const id = window.requestAnimationFrame(() => {
      const root = sectionRootRef.current;
      const input = root?.querySelector<HTMLInputElement>("input");
      input?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [expanded]);

  return {
    expanded,
    setExpanded,
    sectionRootRef,
    collapse,
    handleAutocompleteClose,
    handleSectionBlur,
  };
}

/**
 * Table-row styling for multi-select doelen: selected rows + collapsed primary â€œaddâ€ row that
 * expands into the existing remote `AutocompleteSelectField` flow.
 */
export function RowStyleMultiSelect({
  sectionTitle,
  autocompleteLabel,
  placeholder,
  options,
  value,
  onChange,
  onChangeReason,
  controlledInput,
  loading,
  filterOptionsOverride,
  creatableOptionId,
  getOptionDisabled,
  hideSelectedTags,
  selectedRowVisual = "tableRow",
  selectedRows,
  removeAriaLabel,
  onRemove,
  addRowLabel,
  addRowAriaLabel,
  onCollapse,
  suppressAddRow = false,
  hideSectionHeading = false,
  footer,
  thumbnailPlaceholder,
}: RowStyleMultiSelectProps) {
  const {
    expanded,
    setExpanded,
    sectionRootRef,
    handleAutocompleteClose,
    handleSectionBlur,
  } = useRowStyleMultiSelectExpand(onCollapse);

  return (
    <Box ref={sectionRootRef} onBlur={handleSectionBlur}>
      <Stack spacing={1}>
        {hideSectionHeading ? null : (
          <DetailPanelSectionHeading sx={{ mt: 2, display: "block" }}>
            {sectionTitle}
          </DetailPanelSectionHeading>
        )}

        <Stack spacing={1}>
          {selectedRowVisual === "tagPill" && selectedRows.length > 0 ? (
            <Stack
              direction="row"
              flexWrap="wrap"
              gap={0.5}
              useFlexGap
              sx={{ minWidth: 0 }}
            >
              {selectedRows.map((row) => (
                <TagPillSelectedRowItem
                  key={row.id}
                  row={row}
                  removeAriaLabel={removeAriaLabel}
                  onRemove={onRemove}
                  thumbnailPlaceholder={thumbnailPlaceholder}
                />
              ))}
            </Stack>
          ) : (
            selectedRows.map((row) => (
              <RowStyleMultiSelectSelectedRowItem
                key={row.id}
                row={row}
                removeAriaLabel={removeAriaLabel}
                onRemove={onRemove}
              />
            ))
          )}

          {suppressAddRow ? null : expanded ? (
            <RowStyleMultiSelectExpandedSearchRow
              autocompleteLabel={autocompleteLabel}
              placeholder={placeholder}
              options={options}
              value={value}
              onChange={onChange}
              onChangeReason={onChangeReason}
              onAutocompleteClose={handleAutocompleteClose}
              controlledInput={controlledInput}
              filterOptionsOverride={filterOptionsOverride}
              creatableOptionId={creatableOptionId}
              getOptionDisabled={getOptionDisabled}
              hideSelectedTags={hideSelectedTags}
              loading={loading}
            />
          ) : (
            <ListRowAddButton
              visualVariant="primary"
              label={addRowLabel}
              ariaLabel={addRowAriaLabel ?? addRowLabel}
              startIcon={<Add fontSize="small" />}
              onClick={() => {
                setExpanded(true);
              }}
            />
          )}
        </Stack>

        {footer ? <Box sx={{ pt: 0.5 }}>{footer}</Box> : null}
      </Stack>
    </Box>
  );
}
