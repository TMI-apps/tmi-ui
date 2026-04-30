import type { ReactNode } from "react";
import { Box, useTheme } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import {
  ThumbnailPillMainRow,
  ThumbnailPillThumbImage,
  ThumbnailPillThumbPlaceholder,
  ThumbnailPillTitleText,
  ThumbnailPillTooltipWrap,
  buildPillContainerSx,
} from "./ThumbnailPillParts.js";

export interface ThumbnailPillProps {
  thumbnail?: string;
  thumbnailPlaceholder?: ReactNode;
  title: string;
  rightSlot?: ReactNode;
  tooltip?: string;
  thumbnailPosition?: "left" | "right";
  variant?: "default" | "appBar";
  onClick?: () => void;
  to?: string;
  sx?: SxProps<Theme>;
  maxWidth?: number | string;
  disabled?: boolean;
}

const DEFAULT_PILL_DIMS = {
  thumbnailSize: 28,
  iconSize: 16,
  titleFontSizeXs: 12,
  maxWidthAppBar: 25,
  pillMaxWidthAppBar: 35,
  pillBorderRadius: 2,
};

function getPillDimensions(theme: {
  thumbnailPill?: typeof DEFAULT_PILL_DIMS;
}) {
  return { ...DEFAULT_PILL_DIMS, ...theme.thumbnailPill };
}

interface RenderThumbParams {
  thumbnail?: string;
  thumbnailSize: number;
  iconSize: number;
  isAppBar: boolean;
  thumbnailPlaceholder?: ReactNode;
}

function renderThumbOrPlaceholder(p: RenderThumbParams) {
  if (p.thumbnail) {
    return (
      <ThumbnailPillThumbImage
        thumbnail={p.thumbnail}
        thumbnailSize={p.thumbnailSize}
      />
    );
  }
  return (
    <ThumbnailPillThumbPlaceholder
      thumbnailSize={p.thumbnailSize}
      iconSize={p.iconSize}
      isAppBar={p.isAppBar}
      thumbnailPlaceholder={p.thumbnailPlaceholder}
    />
  );
}

/**
 * Reusable horizontal pill with optional thumbnail, title, and right slot.
 */
export const ThumbnailPill = ({
  thumbnail,
  thumbnailPlaceholder,
  title,
  rightSlot,
  tooltip,
  thumbnailPosition = "left",
  variant = "default",
  onClick,
  to,
  sx,
  maxWidth,
  disabled = false,
}: ThumbnailPillProps) => {
  const theme = useTheme();
  const {
    thumbnailSize,
    iconSize,
    titleFontSizeXs,
    maxWidthAppBar,
    pillMaxWidthAppBar,
    pillBorderRadius,
  } = getPillDimensions(theme);
  const isAppBar = variant === "appBar";
  const isClickable = !disabled && (!!onClick || !!to);

  const thumbNode = renderThumbOrPlaceholder({
    thumbnail,
    thumbnailSize,
    iconSize,
    isAppBar,
    thumbnailPlaceholder,
  });

  const hasCircle = !!thumbnail || !!thumbnailPlaceholder;
  const hasLeftCircle = hasCircle && thumbnailPosition === "left";
  const hasRightCircle = hasCircle && thumbnailPosition === "right";
  const hasRightSlot = !!rightSlot;

  const pill = (
    <Box
      sx={
        [
          (t: Theme) =>
            buildPillContainerSx({
              theme: t,
              isAppBar,
              isClickable,
              disabled,
              pillBorderRadius: pillBorderRadius ?? 2,
              pillMaxWidthAppBar,
              maxWidth,
              hasLeftCircle,
              hasRightCircle,
              hasRightSlot,
            }),
          ...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
        ] as SxProps<Theme>
      }
    >
      <ThumbnailPillMainRow to={to} onClick={onClick} isAppBar={isAppBar}>
        {thumbnailPosition === "left" && thumbNode}
        <ThumbnailPillTitleText
          title={title}
          isAppBar={isAppBar}
          titleFontSizeXs={titleFontSizeXs}
          maxWidthAppBar={maxWidthAppBar}
        />
        {thumbnailPosition === "right" && thumbNode}
      </ThumbnailPillMainRow>
      {rightSlot}
    </Box>
  );

  return (
    <ThumbnailPillTooltipWrap tooltip={tooltip}>
      {pill}
    </ThumbnailPillTooltipWrap>
  );
};
