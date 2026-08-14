import { Box, ButtonBase, Typography } from "@mui/material";
import {
  alpha,
  useTheme,
  type SxProps,
  type Theme,
} from "@mui/material/styles";
import type { MouseEvent, ReactNode } from "react";
import type { DetailPanelHeroTokens } from "../shared-theme/detailPanelHeroTheme.js";
import { detailFieldLabelSx } from "./detailHeroTypography.js";
import { DetailPanelHeroStatValue } from "./DetailPanelHeroStatValue.js";

function statsStripCellHorizontalPadding(
  s: DetailPanelHeroTokens["statsStrip"],
  index: number,
  itemCount: number,
): { pl: string; pr: string } {
  const edge = s.paddingXPx + s.cellPaddingXPx;
  const inner = s.cellPaddingXPx;
  return {
    pl: `${index === 0 ? edge : inner}px`,
    pr: `${index === itemCount - 1 ? edge : inner}px`,
  };
}

export type DetailPanelHeroStatItem = {
  label: string;
  value: string;
  displayValue?: string;
  error?: boolean;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

type DetailPanelHeroStatsStripProps = {
  items: readonly DetailPanelHeroStatItem[];
};

type DetailPanelHeroStatCellProps = {
  item: DetailPanelHeroStatItem;
  borderRight?: string;
  index: number;
  itemCount: number;
};

function DetailPanelHeroStatInteractiveCell({
  cellSx,
  disabled,
  label,
  onClick,
  children,
}: {
  cellSx: SxProps<Theme>;
  disabled: boolean;
  label: string;
  onClick: (event: MouseEvent<HTMLElement>) => void;
  children: ReactNode;
}) {
  const theme = useTheme();
  const hoverBg =
    theme.palette.mode === "dark"
      ? alpha(theme.palette.common.white, 0.14)
      : alpha(theme.palette.common.black, 0.09);
  const focusHoverBg =
    theme.palette.mode === "dark"
      ? alpha(theme.palette.common.white, 0.18)
      : alpha(theme.palette.common.black, 0.12);

  return (
    <ButtonBase
      component="button"
      type="button"
      disabled={disabled}
      focusRipple
      onClick={onClick}
      aria-label={`${label} bewerken`}
      sx={{
        ...cellSx,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        width: "100%",
        m: 0,
        textAlign: "left",
        borderRadius: 0,
        cursor: disabled ? "default" : "pointer",
        WebkitTapHighlightColor: "transparent",
        transition: theme.transitions.create(["background-color"], {
          duration: theme.transitions.duration.shortest,
        }),
        "@media (hover: hover)": {
          "&:hover": disabled
            ? {}
            : {
                backgroundColor: hoverBg,
              },
        },
        ...(disabled
          ? {}
          : {
              "@media (hover: none)": {
                "&:active": {
                  backgroundColor: focusHoverBg,
                },
              },
            }),
        "&.Mui-focusVisible": {
          backgroundColor: disabled ? undefined : focusHoverBg,
          outline: `2px solid ${alpha(theme.palette.primary.main, 0.45)}`,
          outlineOffset: -2,
        },
        "&.Mui-disabled": {
          opacity: 1,
        },
      }}
    >
      {children}
    </ButtonBase>
  );
}

function DetailPanelHeroStatCell({
  item,
  borderRight,
  index,
  itemCount,
}: DetailPanelHeroStatCellProps) {
  const theme = useTheme();
  const s = theme.detailPanelHero.statsStrip;
  const { pl, pr } = statsStripCellHorizontalPadding(s, index, itemCount);
  /** Vertical padding lives on each column so the interactive cell is full strip height (no dead bands). */
  const cellSx = {
    minWidth: 0,
    minHeight: 0,
    alignSelf: "stretch",
    pl,
    pr,
    py: `${s.paddingYPx}px`,
    boxSizing: "border-box" as const,
    ...(borderRight ? { borderRight } : {}),
  } as const;
  const content = (
    <>
      <Typography
        variant="caption"
        component="div"
        sx={{
          ...detailFieldLabelSx(theme),
          lineHeight: 1.3,
        }}
      >
        {item.label}
      </Typography>
      <DetailPanelHeroStatValue
        value={item.value}
        displayValue={item.displayValue}
        error={item.error}
      />
    </>
  );

  if (!item.onClick) {
    return <Box sx={cellSx}>{content}</Box>;
  }

  return (
    <DetailPanelHeroStatInteractiveCell
      cellSx={cellSx}
      disabled={item.disabled ?? false}
      label={item.label}
      onClick={item.onClick}
    >
      {content}
    </DetailPanelHeroStatInteractiveCell>
  );
}

/**
 * Straddling stats card used under {@link DetailPanelHeroHeader}.
 * Styling is driven by `theme.detailPanelHero.statsStrip`.
 */
export function DetailPanelHeroStatsStrip({
  items,
}: DetailPanelHeroStatsStripProps) {
  const theme = useTheme();
  const s = theme.detailPanelHero.statsStrip;
  if (items.length === 0) return null;

  return (
    <Box
      sx={{
        boxSizing: "border-box",
        width: "100%",
        maxHeight: `${s.maxHeightPx}px`,
        overflow: "hidden",
        py: 0,
        px: 0,
        borderRadius: `${s.borderRadiusPx}px`,
        bgcolor: s.background,
        border: s.border,
        boxShadow: s.shadow,
        display: "grid",
        gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        columnGap: 0,
        rowGap: 1.25,
        alignItems: "stretch",
        pointerEvents: "auto",
      }}
    >
      {items.map((item, index) => (
        <DetailPanelHeroStatCell
          key={item.label}
          item={item}
          index={index}
          itemCount={items.length}
          borderRight={
            index < items.length - 1 ? s.itemSeparatorBorder : undefined
          }
        />
      ))}
    </Box>
  );
}
