/* eslint-disable react-hooks/set-state-in-effect -- copied Autocomplete field; no effect rewrite in this publish */
import {
  Autocomplete,
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
  type SxProps,
  type Theme,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import CheckBoxOutlineBlank from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBox from "@mui/icons-material/CheckBox";
import Close from "@mui/icons-material/Close";
import { ThumbnailPill } from "../ThumbnailPill/ThumbnailPill.js";
import {
  autocompleteClasses,
  createFilterOptions,
  type AutocompleteRenderGetTagProps,
  type AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import type { FilterOptionsState } from "@mui/material/useAutocomplete";
import { alpha } from "@mui/material/styles";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type FocusEvent,
  type Key,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type RefObject,
  type SyntheticEvent,
} from "react";

import type { AutocompleteSelectOption } from "./autocompleteSelect.types.js";
import { usePortaledOverlayPopperZIndex } from "../DataTable/lesmateriaal-import/shared-context/PortaledOverlayStackContext.js";

export type { AutocompleteSelectOption };

interface AutocompleteSelectFieldBaseProps {
  label: string;
  options: readonly AutocompleteSelectOption[];
  /** Not used when `fillCell` and `mode="multiple"` (count label for 0 / 2+; one chip when exactly one). */
  placeholder?: string;
  helperText?: string;
  /** Highlights the field in error state (e.g. failed remote load). */
  error?: boolean;
  /** Shows a spinner in the input (e.g. remote search loading). */
  loading?: boolean;
  disabled?: boolean;
  size?: "small" | "medium";
  sx?: SxProps<Theme>;
  /** Focus the input as soon as it mounts (useful inside popovers). */
  autoFocus?: boolean;
  /** Open the suggestions list when the input receives focus. */
  openOnFocus?: boolean;
  /**
   * List-only affordance: hide the TextField chrome; keep a focusable input for filtering / a11y.
   * The suggestions list still uses the shared autocomplete (portal listbox).
   */
  dropdownOnly?: boolean;
  /**
   * When `dropdownOnly`, set the portaled list popper width to this many CSS pixels (e.g. hero stat
   * cell width). Ignored when not `dropdownOnly`.
   */
  dropdownPopperMinWidth?: number;
  /**
   * When `dropdownOnly`, use this element as the portaled suggestions popper anchor instead of MUI's
   * default (the collapsed input). Keeps dropdown flush with e.g. a full-width hero stat cell; the
   * default 1Ã—1 clipped input anchors badly.
   */
  dropdownAnchorEl?: HTMLElement | null;
  /**
   * Table / dense layouts: no outlined box; the control stretches to the parent (e.g. full table
   * cell). Click/focus uses the whole area; label is exposed via aria only.
   */
  fillCell?: boolean;
  /**
   * When `fillCell` is true: `tableCell` matches lesmateriaal table cells; `primaryContained` uses
   * white text on a transparent field for use on primary gradient rows (e.g. doelen add row).
   */
  fillCellSurface?: "tableCell" | "primaryContained";
  /**
   * When `fillCell` is true: size the portaled dropdown to this elementâ€™s width (e.g. the full
   * outer row) instead of the narrow input anchor alone.
   */
  fillCellDropdownWidthRef?: RefObject<HTMLElement | null>;
  /**
   * Optional node rendered inside the `TextField` as `InputProps.startAdornment` (prepended to
   * any MUI-provided tag chips). Useful when the field lives inside a bordered shell (e.g. a
   * primary-gradient add row) and we want e.g. a `+` icon to appear flush with the input's left
   * edge â€” making the TextField itself span the full shell and the popper anchor match the shell.
   */
  startAdornment?: ReactNode;
  /**
   * Browse-only: the list can open and be filtered, but the value cannot change (no option toggle,
   * no clear, no chip delete). Unlike `disabled`, the popup remains usable. Dropdown options use
   * no hover/focus background change so they do not look clickable.
   */
  viewMode?: boolean;
  /**
   * Controlled filter input (remote search, etc.). When set, the text field is controlled by the
   * parent. For `mode="multiple"`, may be combined with `fillCell` to get table-cell styling and
   * remote search together (otherwise `fillCell` alone uses internal filter state).
   */
  controlledInput?: {
    inputValue: string;
    onInputChange: (
      event: SyntheticEvent | null,
      value: string,
      reason: string,
    ) => void;
  };
  /**
   * Replaces the default â€œselected firstâ€ + label filter. Use e.g. `(opts) => opts` when options
   * are already server-filtered, or `createFilterOptions` with a custom `stringify`.
   */
  filterOptionsOverride?: (
    options: AutocompleteSelectOption[],
    state: FilterOptionsState<AutocompleteSelectOption>,
  ) => AutocompleteSelectOption[];
  noOptionsText?: string;
  clearText?: string;
  getOptionDisabled?: (option: AutocompleteSelectOption) => boolean;
  /**
   * When set, that option id is rendered as a creatable row (add icon + primary label) instead of a
   * checkbox (multiple mode only).
   */
  creatableOptionId?: string;
  /**
   * Called when the suggestions popup opens and when the input receives focus (single mode only),
   * for lazy-loading options (e.g. admin-only user lists).
   */
  onPopupOpen?: () => void;
}

interface AutocompleteSelectFieldMultipleProps extends AutocompleteSelectFieldBaseProps {
  mode: "multiple";
  value: string[];
  onChange: (nextValue: string[]) => void;
  /** MUI Autocomplete `onChange` reason (e.g. clear search query on `selectOption`). */
  onChangeReason?: (reason: string) => void;
  /** MUI Autocomplete `onClose` (e.g. Escape to collapse a surrounding row UI). */
  onClose?: (event: SyntheticEvent, reason: string) => void;
  /**
   * When true, listbox `mousedown` calls `preventDefault()` so the input keeps focus (helps blur
   * handling when the listbox is portaled).
   */
  preventListboxFocusSteal?: boolean;
  /**
   * When true, selected values are not shown as chips (selection is listed elsewhere).
   */
  hideSelectedTags?: boolean;
  /**
   * When true, pressing the built-in clear (X) button does NOT clear the selection; it only clears
   * the search query (MUI fires `onInputChange` with reason `"clear"` independently, so the query
   * reset still happens via `controlledInput`). Use this in layouts where selected items are
   * rendered as rows OUTSIDE the input (e.g. `RowStyleMultiSelect`), so X intuitively means
   * "clear what's inside the box" (the typed query) rather than the selection shown elsewhere.
   * Do NOT enable this for filter bars where the count/chips inside the box ARE the selection â€”
   * there X should clear it, matching the standard MUI Autocomplete behaviour.
   */
  preserveSelectionOnClear?: boolean;
  /**
   * When `fillCell`, selection count label when the filter input is empty (same styling as the
   * input placeholder; hidden while typing). Used for **0** or **2+** selections; for **1**
   * selection the chip shows that optionâ€™s label instead. Default: `"{count} selected"`.
   */
  multipleSelectedLabel?: (count: number) => string;
}

interface AutocompleteSelectFieldSingleProps extends AutocompleteSelectFieldBaseProps {
  mode: "single";
  value: string | null;
  onChange: (nextValue: string | null) => void;
  onChangeReason?: (reason: string) => void;
  /** When false, the value cannot be cleared (like a plain `Select`). Default true. */
  clearable?: boolean;
  /**
   * Allow values not present in `options` (commit on blur / Enter from typed text).
   * Value is always a string id/label on change; use `getOptionLabel`-compatible option rows.
   */
  freeSolo?: boolean;
  /**
   * Listbox `mousedown` calls `preventDefault()` so the input keeps focus when the list is portaled
   * inside a parent `ClickAwayListener`.
   */
  preventListboxFocusSteal?: boolean;
}

export type AutocompleteSelectFieldProps =
  | AutocompleteSelectFieldMultipleProps
  | AutocompleteSelectFieldSingleProps;

const CHECKBOX_ICON = <CheckBoxOutlineBlank fontSize="small" />;
const CHECKBOX_CHECKED_ICON = <CheckBox fontSize="small" />;

const DEFAULT_AUTOCOMPLETE_FILTER =
  createFilterOptions<AutocompleteSelectOption>();

/** After default label filter, list selected options first (stable order within each group). */
function filterOptionsWithSelectedFirst(
  selectedIds: ReadonlySet<string>,
  options: AutocompleteSelectOption[],
  state: FilterOptionsState<AutocompleteSelectOption>,
): AutocompleteSelectOption[] {
  const filtered = DEFAULT_AUTOCOMPLETE_FILTER(options, state);
  return stableSortSelectedFirst(filtered, selectedIds);
}

function stableSortSelectedFirst(
  options: AutocompleteSelectOption[],
  selectedIds: ReadonlySet<string>,
): AutocompleteSelectOption[] {
  return [...options].sort((a, b) => {
    const aSel = selectedIds.has(a.id);
    const bSel = selectedIds.has(b.id);
    if (aSel !== bSel) return aSel ? -1 : 1;
    return 0;
  });
}
const INPUT_SX = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
  },
} as const;

/**
 * Match `Table` `size="small"` cell padding (`6px 16px` in MUI) and `body2` typography used in table text.
 */
function getFillCellTextFieldSx(theme: Theme) {
  const { body2 } = theme.typography;
  return {
    m: 0,
    width: "100%",
    flex: 1,
    minHeight: 0,
    "& .MuiOutlinedInput-root": {
      borderRadius: 0,
      backgroundColor: "transparent",
      transition: theme.transitions.create(["background-color", "box-shadow"], {
        duration: theme.transitions.duration.short,
      }),
      overflow: "hidden",
      "& fieldset": { border: "none" },
      "&:hover fieldset": { border: "none" },
      "&:hover": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.hoverOpacity * 1.5,
        ),
      },
      "&.Mui-focused fieldset": { border: "none" },
      "&.Mui-disabled fieldset": { border: "none" },
      minHeight: 0,
      height: "100%",
      maxHeight: "100%",
      alignItems: "center",
      fontSize: body2.fontSize,
      lineHeight: body2.lineHeight,
      letterSpacing: body2.letterSpacing,
      fontFamily: body2.fontFamily,
      fontWeight: body2.fontWeight,
    },
    "& .MuiOutlinedInput-input": {
      padding: 0,
      fontSize: body2.fontSize,
      lineHeight: body2.lineHeight,
      letterSpacing: body2.letterSpacing,
      fontFamily: body2.fontFamily,
      fontWeight: body2.fontWeight,
    },
    "& .MuiAutocomplete-inputRoot": {
      flexWrap: "nowrap",
      alignItems: "center",
      gap: theme.spacing(0.5),
      py: theme.spacing(0.75),
      px: theme.spacing(2),
      overflow: "hidden",
      maxHeight: "100%",
    },
    "& .MuiAutocomplete-input": {
      fontSize: body2.fontSize,
      lineHeight: body2.lineHeight,
      letterSpacing: body2.letterSpacing,
      fontFamily: body2.fontFamily,
      fontWeight: body2.fontWeight,
    },
    "& input::placeholder": {
      color: theme.palette.text.secondary,
      opacity: 1,
      fontSize: body2.fontSize,
      lineHeight: body2.lineHeight,
    },
  };
}

/** White text on transparent field; for primary gradient shells (matches link URL field in attachments). */
function getFillCellPrimaryContainedTextFieldSx(theme: Theme) {
  const { body2 } = theme.typography;
  return {
    m: 0,
    width: "100%",
    flex: 1,
    minHeight: 0,
    color: theme.palette.common.white,
    "& .MuiOutlinedInput-root": {
      borderRadius: 0,
      backgroundColor: "transparent",
      color: theme.palette.common.white,
      transition: theme.transitions.create(["background-color"], {
        duration: theme.transitions.duration.short,
      }),
      overflow: "hidden",
      "& fieldset": { border: "none" },
      "&:hover fieldset": { border: "none" },
      "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.08),
      },
      "&.Mui-focused fieldset": { border: "none" },
      "&.Mui-disabled fieldset": { border: "none" },
      minHeight: 0,
      height: "100%",
      maxHeight: "100%",
      alignItems: "center",
      fontSize: body2.fontSize,
      lineHeight: body2.lineHeight,
      letterSpacing: body2.letterSpacing,
      fontFamily: body2.fontFamily,
      fontWeight: body2.fontWeight,
    },
    "& .MuiOutlinedInput-input": {
      padding: 0,
      color: theme.palette.common.white,
      fontSize: body2.fontSize,
      lineHeight: body2.lineHeight,
      letterSpacing: body2.letterSpacing,
      fontFamily: body2.fontFamily,
      fontWeight: body2.fontWeight,
    },
    "& .MuiAutocomplete-inputRoot": {
      flexWrap: "nowrap",
      alignItems: "center",
      gap: theme.spacing(0.5),
      py: 0,
      px: 0,
      overflow: "hidden",
      maxHeight: "100%",
    },
    "& .MuiAutocomplete-input": {
      fontSize: body2.fontSize,
      lineHeight: body2.lineHeight,
      letterSpacing: body2.letterSpacing,
      fontFamily: body2.fontFamily,
      fontWeight: body2.fontWeight,
      color: theme.palette.common.white,
    },
    "& .MuiAutocomplete-endAdornment": {
      color: theme.palette.common.white,
    },
    "& input::placeholder": {
      color: alpha(theme.palette.common.white, 0.65),
      opacity: 1,
      fontSize: body2.fontSize,
      lineHeight: body2.lineHeight,
    },
  };
}

const FILL_CELL_AUTOCOMPLETE_SX = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  maxHeight: "100%",
  overflow: "hidden",
} as const;

/** Collapse the root so only the portaled listbox reads as UI (`dropdownOnly`). */
const DROPDOWN_ONLY_AUTOCOMPLETE_SX = {
  position: "relative",
  width: "100%",
  minHeight: 0,
  height: 0,
  overflow: "visible",
} as const;

/** No hover/focus background change on options (browse-only; avoids â€œclickableâ€ affordance). */
function getViewModeListboxSx(theme: Theme) {
  const selectedBg = alpha(
    theme.palette.primary.main,
    theme.palette.action.selectedOpacity,
  );
  return {
    [`& .${autocompleteClasses.option}`]: {
      cursor: "default",
      [`&.${autocompleteClasses.focused}`]: {
        backgroundColor: "transparent",
        "@media (hover: none)": {
          backgroundColor: "transparent",
        },
      },
      [`&.${autocompleteClasses.focusVisible}`]: {
        backgroundColor: "transparent",
      },
      '&[aria-selected="true"]': {
        backgroundColor: selectedBg,
        [`&.${autocompleteClasses.focused}`]: {
          backgroundColor: selectedBg,
          "@media (hover: none)": {
            backgroundColor: selectedBg,
          },
        },
        [`&.${autocompleteClasses.focusVisible}`]: {
          backgroundColor: selectedBg,
        },
      },
    },
  };
}

function getAutocompleteSlotProps(viewMode: boolean) {
  return {
    paper: { sx: { borderRadius: 2 } },
    ...(viewMode ? { listbox: { sx: getViewModeListboxSx } } : {}),
  };
}

function mergeAutocompleteSlotPropsForListboxMouseDown(
  base: ReturnType<typeof getAutocompleteSlotProps>,
  enabled: boolean,
): ReturnType<typeof getAutocompleteSlotProps> {
  if (!enabled) return base;
  const prevListbox =
    "listbox" in base && base.listbox !== undefined && base.listbox !== null
      ? base.listbox
      : {};
  const pl = typeof prevListbox === "object" ? prevListbox : {};
  return {
    ...base,
    listbox: Object.assign({}, pl, {
      onMouseDown: (e: ReactMouseEvent<HTMLUListElement>) => {
        const om = "onMouseDown" in pl ? pl.onMouseDown : undefined;
        if (typeof om === "function") {
          (om as (ev: ReactMouseEvent<HTMLUListElement>) => void)(e);
        }
        e.preventDefault();
      },
    }),
  } as unknown as ReturnType<typeof getAutocompleteSlotProps>;
}

/** Wider dropdown than the fill-cell input anchor (e.g. full primary gradient row). */
/** MUI `renderOption` props may include `sx` at runtime; not on the public HTMLAttributes type. */
function autocompleteOptionPropsSxFragments(
  optionProps: object,
): SxProps<Theme>[] {
  const sx = (optionProps as { sx?: SxProps<Theme> }).sx;
  if (sx === undefined || sx === null) return [];
  return Array.isArray(sx) ? sx : [sx];
}

function useFillCellDropdownAnchorWidth(
  ref: RefObject<HTMLElement | null> | undefined,
) {
  const [px, setPx] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = ref?.current;
    if (!el) {
      setPx(null);
      return;
    }
    const measure = () => {
      const { width } = el.getBoundingClientRect();
      setPx(Number.isFinite(width) && width > 0 ? width : null);
    };
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return px;
}

function renderOptionContent(
  option: AutocompleteSelectOption,
  opts?: { primaryAccent?: boolean },
) {
  const descHasNewline = Boolean(option.description?.includes("\n"));
  return (
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography
        variant="body2"
        sx={(theme) => ({
          whiteSpace: "normal",
          wordBreak: "break-word",
          ...(opts?.primaryAccent
            ? {
                color: theme.palette.primary.main,
                fontWeight: theme.typography.fontWeightMedium,
              }
            : {}),
        })}
      >
        {option.label}
      </Typography>
      {option.description ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={
            descHasNewline
              ? {
                  whiteSpace: "pre-line",
                  display: "block",
                  wordBreak: "break-word",
                }
              : { wordBreak: "break-word" }
          }
        >
          {option.description}
        </Typography>
      ) : null}
    </Box>
  );
}

function renderAutocompleteInput(
  params: AutocompleteRenderInputParams,
  options: {
    fillCell: boolean;
    fillCellSurface?: "tableCell" | "primaryContained";
    label: string;
    placeholder?: string;
    helperText?: string;
    viewMode?: boolean;
    error?: boolean;
    loading?: boolean;
    startAdornment?: ReactNode;
    autoFocus?: boolean;
    dropdownOnly?: boolean;
  },
) {
  const {
    fillCell,
    fillCellSurface,
    label,
    placeholder,
    helperText,
    viewMode,
    error,
    loading,
    startAdornment,
    autoFocus,
    dropdownOnly,
  } = options;
  const surface = fillCellSurface ?? "tableCell";
  const mergedStartAdornment =
    startAdornment !== undefined && !dropdownOnly ? (
      <>
        {startAdornment}
        {params.InputProps.startAdornment}
      </>
    ) : (
      params.InputProps.startAdornment
    );
  if (dropdownOnly) {
    return (
      <TextField
        {...params}
        variant="standard"
        hiddenLabel
        placeholder={placeholder}
        error={error}
        sx={{
          position: "absolute",
          width: "1px",
          height: "1px",
          margin: "-1px",
          padding: 0,
          overflow: "hidden",
          clipPath: "inset(50%)",
          whiteSpace: "nowrap",
          border: 0,
        }}
        InputProps={{
          ...params.InputProps,
          disableUnderline: true,
          startAdornment: mergedStartAdornment,
          endAdornment: loading ? (
            <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} />
          ) : null,
        }}
        inputProps={{
          ...params.inputProps,
          ...(autoFocus ? { autoFocus: true } : {}),
          "aria-label": label,
        }}
      />
    );
  }
  return (
    <TextField
      {...params}
      hiddenLabel={fillCell}
      label={fillCell ? undefined : label}
      placeholder={placeholder}
      helperText={fillCell ? undefined : helperText}
      error={error}
      sx={
        fillCell
          ? (theme) =>
              surface === "primaryContained"
                ? getFillCellPrimaryContainedTextFieldSx(theme)
                : getFillCellTextFieldSx(theme)
          : INPUT_SX
      }
      InputProps={{
        ...params.InputProps,
        startAdornment: mergedStartAdornment,
        endAdornment: (
          <>
            {loading ? (
              <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} />
            ) : null}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
      inputProps={{
        ...params.inputProps,
        ...(autoFocus ? { autoFocus: true } : {}),
        ...(fillCell ? { "aria-label": label } : {}),
        ...(viewMode ? { "aria-readonly": true } : {}),
        ...(viewMode
          ? {
              onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
                params.inputProps?.onKeyDown?.(e);
                if (e.key === "Backspace" && e.currentTarget.value === "") {
                  e.preventDefault();
                }
              },
            }
          : {}),
      }}
    />
  );
}

function defaultMultipleSelectedLabel(count: number) {
  return `${count} selected`;
}

function renderMultipleFieldTags(
  tagValue: AutocompleteSelectOption[],
  getTagProps: AutocompleteRenderGetTagProps,
  opts: { fillCell: boolean; viewMode: boolean },
) {
  const { fillCell, viewMode } = opts;
  if (tagValue.length === 0) return null;
  if (fillCell && tagValue.length > 1) {
    return [];
  }
  return tagValue.map((option, index) => {
    const tagProps = getTagProps({ index });
    const { onDelete, disabled } = tagProps;
    const wrapperProps: Record<string, unknown> = { ...tagProps };
    delete wrapperProps.key;
    delete wrapperProps.onDelete;
    delete wrapperProps.disabled;
    const showDelete = !viewMode && !disabled && typeof onDelete === "function";
    return (
      <Box
        {...wrapperProps}
        key={option.id}
        sx={{
          display: "inline-flex",
          minWidth: 0,
          maxWidth: fillCell ? "100%" : undefined,
        }}
      >
        <ThumbnailPill
          title={option.label}
          disabled={disabled}
          maxWidth={fillCell ? "100%" : undefined}
          rightSlot={
            showDelete ? (
              <IconButton
                size="small"
                onClick={onDelete}
                aria-label={`Verwijder ${option.label}`}
                sx={{ mr: 0.25, color: "inherit" }}
              >
                <Close sx={{ fontSize: 14 }} />
              </IconButton>
            ) : undefined
          }
        />
      </Box>
    );
  });
}

function resolveMultipleFillCellPlaceholder(opts: {
  commonPropsPlaceholder: string | undefined;
  fillCell: boolean;
  fillCellRemoteSearch: boolean;
  controlled: { inputValue: string } | undefined;
  hideSelectedTags: boolean | undefined;
  valueIdsLength: number;
  filterInput: string;
  resolveMultipleSelectedLabel: (count: number) => string;
}): string | undefined {
  const {
    commonPropsPlaceholder,
    fillCell,
    fillCellRemoteSearch,
    controlled,
    hideSelectedTags,
    valueIdsLength,
    filterInput,
    resolveMultipleSelectedLabel,
  } = opts;
  if (!fillCell) return commonPropsPlaceholder;
  if (fillCellRemoteSearch && controlled) {
    const q = controlled.inputValue;
    if (q !== "") return "";
    if (hideSelectedTags) return commonPropsPlaceholder;
    if (valueIdsLength === 1) return "";
    return resolveMultipleSelectedLabel(valueIdsLength);
  }
  if (valueIdsLength === 1) return "";
  return filterInput === "" ? resolveMultipleSelectedLabel(valueIdsLength) : "";
}

function getMultipleAutocompleteInputValue(opts: {
  fillCellRemoteSearch: boolean;
  fillCellLocalFilter: boolean;
  useControlledInputNonFillCell: boolean;
  controlled: { inputValue: string } | undefined;
  filterInput: string;
}): string | undefined {
  const {
    fillCellRemoteSearch,
    fillCellLocalFilter,
    useControlledInputNonFillCell,
    controlled,
    filterInput,
  } = opts;
  if (fillCellRemoteSearch) return controlled?.inputValue;
  if (fillCellLocalFilter) return filterInput;
  if (useControlledInputNonFillCell) return controlled?.inputValue;
  return undefined;
}

function getMultipleAutocompleteOnInputChange(opts: {
  fillCellRemoteSearch: boolean;
  fillCellLocalFilter: boolean;
  useControlledInputNonFillCell: boolean;
  controlled:
    | {
        onInputChange: (
          event: SyntheticEvent | null,
          value: string,
          reason: string,
        ) => void;
      }
    | undefined;
  setFilterInput: (v: string) => void;
}):
  | ((event: SyntheticEvent, newValue: string, reason: string) => void)
  | undefined {
  const {
    fillCellRemoteSearch,
    fillCellLocalFilter,
    useControlledInputNonFillCell,
    controlled,
    setFilterInput,
  } = opts;
  if (fillCellRemoteSearch) return controlled?.onInputChange;
  if (fillCellLocalFilter) {
    return (_event, newValue, reason) => {
      if (reason === "reset" || reason === "clear") {
        setFilterInput("");
      } else {
        setFilterInput(newValue);
      }
    };
  }
  if (useControlledInputNonFillCell) return controlled?.onInputChange;
  return undefined;
}

function AutocompleteMultipleFieldInner({
  props,
  commonProps,
}: {
  props: AutocompleteSelectFieldMultipleProps;
  commonProps: Omit<AutocompleteSelectFieldBaseProps, "options">;
}) {
  const portaledPopperZ = usePortaledOverlayPopperZIndex();
  const fillCell = commonProps.fillCell ?? false;
  const viewMode = commonProps.viewMode ?? false;
  const dropdownOnly = commonProps.dropdownOnly ?? false;
  const resolveMultipleSelectedLabel =
    props.multipleSelectedLabel ?? defaultMultipleSelectedLabel;
  const valueIds = props.value ?? [];
  const valueKey = valueIds.join("|");
  const selected = useMemo(
    () => props.options.filter((option) => valueIds.includes(option.id)),
    [props.options, valueKey],
  );
  const [filterInput, setFilterInput] = useState("");

  const selectedIdSet = useMemo(() => new Set(valueIds), [valueKey]);

  const defaultFilterOptions = useCallback(
    (
      options: AutocompleteSelectOption[],
      state: FilterOptionsState<AutocompleteSelectOption>,
    ) => filterOptionsWithSelectedFirst(selectedIdSet, options, state),
    [selectedIdSet],
  );
  const resolvedFilterOptions =
    commonProps.filterOptionsOverride ?? defaultFilterOptions;

  const controlled = commonProps.controlledInput;
  /** Table fill-cell styling + parent-owned search query (e.g. doelen row picker). */
  const fillCellRemoteSearch = Boolean(fillCell && controlled);
  /** Fill-cell with internal filter only (no `controlledInput`). */
  const fillCellLocalFilter = Boolean(fillCell && !controlled);
  const useControlledInputNonFillCell = Boolean(!fillCell && controlled);

  useEffect(() => {
    if (!fillCellLocalFilter) return;
    setFilterInput("");
  }, [fillCellLocalFilter, valueKey]);

  const fillCellPlaceholder = useMemo(
    () =>
      resolveMultipleFillCellPlaceholder({
        commonPropsPlaceholder: commonProps.placeholder,
        fillCell,
        fillCellRemoteSearch,
        controlled,
        hideSelectedTags: props.hideSelectedTags,
        valueIdsLength: valueIds.length,
        filterInput,
        resolveMultipleSelectedLabel,
      }),
    [
      fillCell,
      fillCellRemoteSearch,
      controlled,
      props.hideSelectedTags,
      commonProps.placeholder,
      valueIds.length,
      filterInput,
      resolveMultipleSelectedLabel,
    ],
  );

  const inputValueResolved = getMultipleAutocompleteInputValue({
    fillCellRemoteSearch,
    fillCellLocalFilter,
    useControlledInputNonFillCell,
    controlled,
    filterInput,
  });

  const onInputChangeResolved = getMultipleAutocompleteOnInputChange({
    fillCellRemoteSearch,
    fillCellLocalFilter,
    useControlledInputNonFillCell,
    controlled,
    setFilterInput,
  });

  const fillCellDropdownAnchorWidthPx = useFillCellDropdownAnchorWidth(
    commonProps.fillCellDropdownWidthRef,
  );

  const mergedSlotProps = useMemo(() => {
    const base = mergeAutocompleteSlotPropsForListboxMouseDown(
      getAutocompleteSlotProps(viewMode),
      Boolean(props.preventListboxFocusSteal),
    );
    const popperSx: Record<string, string | number> = {};
    if (portaledPopperZ !== undefined) {
      popperSx.zIndex = portaledPopperZ;
    }
    const dpmw = commonProps.dropdownPopperMinWidth;
    if (dropdownOnly && typeof dpmw === "number" && dpmw > 0) {
      popperSx.width = `${dpmw}px`;
      popperSx.minWidth = `${dpmw}px`;
      popperSx.boxSizing = "border-box";
    } else if (fillCellDropdownAnchorWidthPx !== null) {
      popperSx.width = `${fillCellDropdownAnchorWidthPx}px`;
      popperSx.minWidth = `${fillCellDropdownAnchorWidthPx}px`;
      popperSx.boxSizing = "border-box";
    }

    const customAnchorEl = dropdownOnly
      ? commonProps.dropdownAnchorEl
      : undefined;
    const popperProps: {
      sx?: Record<string, string | number>;
      anchorEl?: HTMLElement | null;
    } = {};
    if (customAnchorEl) popperProps.anchorEl = customAnchorEl;
    if (Object.keys(popperSx).length > 0) popperProps.sx = popperSx;

    if (Object.keys(popperProps).length === 0) return base;
    return {
      ...base,
      popper: popperProps,
    };
  }, [
    viewMode,
    props.preventListboxFocusSteal,
    fillCellDropdownAnchorWidthPx,
    dropdownOnly,
    commonProps.dropdownPopperMinWidth,
    commonProps.dropdownAnchorEl,
    portaledPopperZ,
  ]);

  return (
    <Autocomplete<AutocompleteSelectOption, true, boolean, false>
      multiple
      disableCloseOnSelect
      disableClearable={viewMode}
      options={props.options}
      value={selected}
      disabled={commonProps.disabled}
      size={commonProps.size}
      openOnFocus={commonProps.openOnFocus}
      inputValue={inputValueResolved}
      onInputChange={onInputChangeResolved}
      onChange={(_, nextOptions, reason) => {
        props.onChangeReason?.(reason);
        if (viewMode) return;
        if (reason === "clear" && props.preserveSelectionOnClear) {
          return;
        }
        props.onChange(nextOptions.map((option) => option.id));
      }}
      onClose={props.onClose}
      onOpen={() => {
        commonProps.onPopupOpen?.();
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.label}
      filterOptions={resolvedFilterOptions}
      getOptionDisabled={commonProps.getOptionDisabled}
      noOptionsText={commonProps.noOptionsText}
      clearText={commonProps.clearText}
      renderOption={(optionProps, option, state) => {
        const { key, ...liProps } = optionProps as typeof optionProps & {
          key?: Key;
        };
        const creatableId = commonProps.creatableOptionId;
        const isCreatable = Boolean(creatableId && option.id === creatableId);
        return (
          <Box
            component="li"
            key={key}
            {...liProps}
            sx={
              [
                {
                  alignItems: "flex-start",
                  py: 1,
                  minHeight: "auto",
                },
                ...autocompleteOptionPropsSxFragments(optionProps),
              ] as SxProps<Theme>
            }
          >
            {isCreatable ? (
              <Add
                fontSize="small"
                sx={(theme) => ({
                  mr: 1,
                  flexShrink: 0,
                  mt: 0.125,
                  color: theme.palette.primary.main,
                })}
              />
            ) : (
              <Checkbox
                icon={CHECKBOX_ICON}
                checkedIcon={CHECKBOX_CHECKED_ICON}
                checked={state.selected}
                sx={{ mr: 1, p: 0.5, alignSelf: "flex-start", mt: 0.125 }}
              />
            )}
            {renderOptionContent(option, { primaryAccent: isCreatable })}
          </Box>
        );
      }}
      renderTags={(tagValue, getTagProps) =>
        props.hideSelectedTags
          ? []
          : renderMultipleFieldTags(tagValue, getTagProps, {
              fillCell,
              viewMode,
            })
      }
      renderInput={(params) =>
        renderAutocompleteInput(params, {
          fillCell,
          fillCellSurface: commonProps.fillCellSurface,
          label: commonProps.label,
          placeholder: fillCell ? fillCellPlaceholder : commonProps.placeholder,
          helperText: commonProps.helperText,
          viewMode,
          error: commonProps.error,
          loading: commonProps.loading,
          startAdornment: commonProps.startAdornment,
          autoFocus: commonProps.autoFocus,
          dropdownOnly,
        })
      }
      slotProps={mergedSlotProps}
      sx={{
        width: "100%",
        ...(fillCell ? FILL_CELL_AUTOCOMPLETE_SX : {}),
        ...(dropdownOnly ? DROPDOWN_ONLY_AUTOCOMPLETE_SX : {}),
        ...commonProps.sx,
      }}
    />
  );
}

function renderMultipleField(
  props: AutocompleteSelectFieldMultipleProps,
  commonProps: Omit<AutocompleteSelectFieldBaseProps, "options">,
) {
  return (
    <AutocompleteMultipleFieldInner props={props} commonProps={commonProps} />
  );
}

function AutocompleteSingleFieldInner({
  props,
  commonProps,
}: {
  props: AutocompleteSelectFieldSingleProps;
  commonProps: Omit<AutocompleteSelectFieldBaseProps, "options">;
}) {
  const portaledPopperZ = usePortaledOverlayPopperZIndex();
  const fillCell = commonProps.fillCell ?? false;
  const viewMode = commonProps.viewMode ?? false;
  const dropdownOnly = commonProps.dropdownOnly ?? false;
  const freeSolo = props.freeSolo ?? false;
  const raw = props.value;
  const selected = freeSolo
    ? raw
      ? (props.options.find((option) => option.id === raw) ?? raw)
      : null
    : (props.options.find((option) => option.id === raw) ?? null);

  const selectedIdSet = useMemo(
    () => (props.value ? new Set([props.value]) : new Set<string>()),
    [props.value],
  );

  const defaultFilterOptions = useCallback(
    (
      options: AutocompleteSelectOption[],
      state: FilterOptionsState<AutocompleteSelectOption>,
    ) => filterOptionsWithSelectedFirst(selectedIdSet, options, state),
    [selectedIdSet],
  );
  const resolvedFilterOptions =
    commonProps.filterOptionsOverride ?? defaultFilterOptions;

  const controlled = commonProps.controlledInput;
  const useControlledInput = Boolean(!fillCell && controlled && !freeSolo);

  const fillCellDropdownAnchorWidthPx = useFillCellDropdownAnchorWidth(
    commonProps.fillCellDropdownWidthRef,
  );

  const singleSlotProps = useMemo(() => {
    const base = mergeAutocompleteSlotPropsForListboxMouseDown(
      getAutocompleteSlotProps(viewMode),
      Boolean(props.preventListboxFocusSteal),
    );
    const popperSx: Record<string, string | number> = {};
    if (portaledPopperZ !== undefined) {
      popperSx.zIndex = portaledPopperZ;
    }
    const dpmw = commonProps.dropdownPopperMinWidth;
    if (dropdownOnly && typeof dpmw === "number" && dpmw > 0) {
      popperSx.width = `${dpmw}px`;
      popperSx.minWidth = `${dpmw}px`;
      popperSx.boxSizing = "border-box";
    } else if (fillCellDropdownAnchorWidthPx !== null) {
      popperSx.width = `${fillCellDropdownAnchorWidthPx}px`;
      popperSx.minWidth = `${fillCellDropdownAnchorWidthPx}px`;
      popperSx.boxSizing = "border-box";
    }

    const customAnchorEl = dropdownOnly
      ? commonProps.dropdownAnchorEl
      : undefined;
    const popperProps: {
      sx?: Record<string, string | number>;
      anchorEl?: HTMLElement | null;
    } = {};
    if (customAnchorEl) popperProps.anchorEl = customAnchorEl;
    if (Object.keys(popperSx).length > 0) popperProps.sx = popperSx;

    if (Object.keys(popperProps).length === 0) return base;
    return {
      ...base,
      popper: popperProps,
    };
  }, [
    viewMode,
    fillCellDropdownAnchorWidthPx,
    dropdownOnly,
    commonProps.dropdownPopperMinWidth,
    commonProps.dropdownAnchorEl,
    props.preventListboxFocusSteal,
    portaledPopperZ,
  ]);

  return (
    <Autocomplete<AutocompleteSelectOption, false, boolean, boolean>
      freeSolo={freeSolo}
      options={props.options}
      value={selected}
      disabled={commonProps.disabled}
      size={commonProps.size}
      openOnFocus={commonProps.openOnFocus}
      disableClearable={viewMode || !(props.clearable ?? true) || dropdownOnly}
      inputValue={useControlledInput ? controlled!.inputValue : undefined}
      onInputChange={useControlledInput ? controlled!.onInputChange : undefined}
      onChange={(_, nextOption, reason) => {
        props.onChangeReason?.(reason);
        if (viewMode) return;
        if (freeSolo && typeof nextOption === "string") {
          props.onChange(nextOption.trim() || null);
          return;
        }
        const opt = nextOption as AutocompleteSelectOption | null;
        props.onChange(opt?.id ?? null);
      }}
      onOpen={() => {
        commonProps.onPopupOpen?.();
      }}
      selectOnFocus
      isOptionEqualToValue={(option, value) => {
        if (typeof value === "string") return option.id === value;
        return option.id === value.id;
      }}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.label
      }
      filterOptions={resolvedFilterOptions}
      getOptionDisabled={commonProps.getOptionDisabled}
      noOptionsText={commonProps.noOptionsText}
      clearText={commonProps.clearText}
      renderOption={(optionProps, option) => {
        const { key, ...liProps } = optionProps as typeof optionProps & {
          key?: Key;
        };
        const creatableId = commonProps.creatableOptionId;
        const isCreatable = Boolean(creatableId && option.id === creatableId);
        return (
          <Box
            component="li"
            key={key}
            {...liProps}
            sx={
              [
                {
                  alignItems: "flex-start",
                  py: 1,
                  minHeight: "auto",
                },
                ...autocompleteOptionPropsSxFragments(optionProps),
              ] as SxProps<Theme>
            }
          >
            {isCreatable ? (
              <Add
                fontSize="small"
                sx={(theme) => ({
                  mr: 1,
                  flexShrink: 0,
                  mt: 0.125,
                  color: theme.palette.primary.main,
                })}
              />
            ) : null}
            {renderOptionContent(option, { primaryAccent: isCreatable })}
          </Box>
        );
      }}
      renderInput={(params) => {
        const mergedParams =
          commonProps.onPopupOpen !== undefined
            ? {
                ...params,
                inputProps: {
                  ...params.inputProps,
                  onFocus: (e: FocusEvent<HTMLInputElement>) => {
                    params.inputProps.onFocus?.(e);
                    commonProps.onPopupOpen?.();
                  },
                },
              }
            : params;
        return renderAutocompleteInput(mergedParams, {
          fillCell,
          fillCellSurface: commonProps.fillCellSurface,
          label: commonProps.label,
          placeholder: commonProps.placeholder,
          helperText: commonProps.helperText,
          viewMode,
          error: commonProps.error,
          loading: commonProps.loading,
          startAdornment: commonProps.startAdornment,
          autoFocus: commonProps.autoFocus,
          dropdownOnly,
        });
      }}
      slotProps={singleSlotProps}
      sx={{
        width: "100%",
        ...(fillCell ? FILL_CELL_AUTOCOMPLETE_SX : {}),
        ...(dropdownOnly ? DROPDOWN_ONLY_AUTOCOMPLETE_SX : {}),
        ...commonProps.sx,
      }}
    />
  );
}

function renderSingleField(
  props: AutocompleteSelectFieldSingleProps,
  commonProps: Omit<AutocompleteSelectFieldBaseProps, "options">,
) {
  return (
    <AutocompleteSingleFieldInner props={props} commonProps={commonProps} />
  );
}

export function AutocompleteSelectField(props: AutocompleteSelectFieldProps) {
  const commonProps = {
    label: props.label,
    placeholder: props.placeholder,
    helperText: props.helperText,
    error: props.error,
    loading: props.loading,
    disabled: props.disabled ?? false,
    size: props.size ?? "small",
    sx: props.sx,
    autoFocus: props.autoFocus ?? false,
    openOnFocus: props.openOnFocus ?? false,
    dropdownOnly: props.dropdownOnly ?? false,
    dropdownPopperMinWidth: props.dropdownPopperMinWidth,
    dropdownAnchorEl: props.dropdownAnchorEl,
    fillCell: props.fillCell ?? false,
    fillCellSurface: props.fillCellSurface ?? "tableCell",
    viewMode: props.viewMode ?? false,
    controlledInput: props.controlledInput,
    filterOptionsOverride: props.filterOptionsOverride,
    noOptionsText: props.noOptionsText,
    clearText: props.clearText,
    getOptionDisabled: props.getOptionDisabled,
    fillCellDropdownWidthRef: props.fillCellDropdownWidthRef,
    creatableOptionId: props.creatableOptionId,
    startAdornment: props.startAdornment,
    onPopupOpen: props.onPopupOpen,
  };
  return props.mode === "multiple"
    ? renderMultipleField(props, commonProps)
    : renderSingleField(props, commonProps);
}
