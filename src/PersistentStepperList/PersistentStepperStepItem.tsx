import { Box, Typography, Checkbox, IconButton, Collapse, useTheme, type Theme } from "@mui/material";
import type { MouseEvent } from "react";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Check from "@mui/icons-material/Check";
import type { StepItem } from "../textToStepperItems.js";

export interface ChecklistSizing {
  circleSize: number;
  mainStepGap: number;
  subStepGap: number;
  subItemsPl: number;
  subBulletSize: number;
  circleFontSize: number;
}

interface PersistentStepperStepItemProps {
  step: StepItem;
  checked: boolean;
  isExpanded: boolean;
  hasChildren: boolean;
  sizing: ChecklistSizing;
  gradientBullet: string;
  hoverBg: string;
  onToggleStep: (stepId: string) => void;
  onToggleExpand: (stepId: string, e: MouseEvent) => void;
  ariaExpandSubSteps: string;
  ariaCollapseSubSteps: string;
}

function UncheckedNumberIcon({
  num,
  circleSize,
  gradientBullet,
  theme,
}: {
  num: number;
  circleSize: number;
  gradientBullet: string;
  theme: Theme;
}) {
  return (
    <Box
      sx={{
        width: circleSize,
        height: circleSize,
        borderRadius: "50%",
        background: gradientBullet,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        component="span"
        sx={{
          color: theme.palette.primary.contrastText,
          fontWeight: theme.typography.fontWeightBold,
          fontSize: theme.typography.body2.fontSize,
        }}
      >
        {num}
      </Typography>
    </Box>
  );
}

function CheckedCircleIcon({
  circleSize,
  circleFontSize,
  gradientBullet,
  theme,
}: {
  circleSize: number;
  circleFontSize: number;
  gradientBullet: string;
  theme: Theme;
}) {
  return (
    <Box
      sx={{
        width: circleSize,
        height: circleSize,
        borderRadius: "50%",
        background: gradientBullet,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Check
        sx={{
          fontSize: theme.typography.pxToRem(circleFontSize),
          color: theme.palette.primary.contrastText,
        }}
      />
    </Box>
  );
}

function ChecklistSubStepLines({
  subSteps,
  subStepGap,
  subItemsPl,
  subBulletSize,
  gradientBullet,
  borderColor,
}: {
  subSteps: NonNullable<StepItem["children"]>;
  subStepGap: number;
  subItemsPl: number;
  subBulletSize: number;
  gradientBullet: string;
  borderColor: string;
}) {
  return (
    <Box
      sx={{
        pl: subItemsPl,
        pr: 1,
        pb: 1,
        ml: 2,
        borderLeft: `2px solid ${borderColor}`,
      }}
    >
      {subSteps.map((child) => (
        <Box
          key={child.id}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: subStepGap,
            py: 0.5,
            pl: 0,
          }}
        >
          <Box
            sx={{
              width: subBulletSize,
              height: subBulletSize,
              borderRadius: "50%",
              background: gradientBullet,
              flexShrink: 0,
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {child.text}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

/**
 * Single main step row + optional sub-steps collapse.
 */
export function PersistentStepperStepItem({
  step,
  checked,
  isExpanded,
  hasChildren,
  sizing,
  gradientBullet,
  hoverBg,
  onToggleStep,
  onToggleExpand,
  ariaExpandSubSteps,
  ariaCollapseSubSteps,
}: PersistentStepperStepItemProps) {
  const theme = useTheme();
  const { circleSize, mainStepGap, subStepGap, subItemsPl, subBulletSize, circleFontSize } = sizing;
  const expandAria = isExpanded ? ariaCollapseSubSteps : ariaExpandSubSteps;

  return (
    <Box component="li" sx={{ mb: 0 }}>
      <Box
        onClick={() => onToggleStep(step.id)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: mainStepGap,
          py: 1,
          px: 1,
          mx: -1,
          borderRadius: 1,
          cursor: "pointer",
          "&:hover": { bgcolor: hoverBg },
        }}
      >
        <Checkbox
          checked={checked}
          onChange={() => onToggleStep(step.id)}
          onClick={(e) => e.stopPropagation()}
          icon={
            <UncheckedNumberIcon
              num={step.index + 1}
              circleSize={circleSize}
              gradientBullet={gradientBullet}
              theme={theme}
            />
          }
          checkedIcon={
            <CheckedCircleIcon
              circleSize={circleSize}
              circleFontSize={circleFontSize}
              gradientBullet={gradientBullet}
              theme={theme}
            />
          }
          sx={{ p: 0.5 }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body1"
            sx={{
              textDecoration: checked ? "line-through" : "none",
              color: "text.secondary",
            }}
          >
            {step.text}
          </Typography>
        </Box>
        {hasChildren && (
          <IconButton
            size="small"
            onClick={(e) => onToggleExpand(step.id, e)}
            aria-label={expandAria}
            sx={{
              transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
              transition: "transform 300ms ease",
            }}
          >
            <ExpandMore fontSize="small" />
          </IconButton>
        )}
      </Box>
      {hasChildren && (
        <Collapse in={isExpanded} timeout={300}>
          <ChecklistSubStepLines
            subSteps={step.children!}
            subStepGap={subStepGap}
            subItemsPl={subItemsPl}
            subBulletSize={subBulletSize}
            gradientBullet={gradientBullet}
            borderColor={theme.palette.primary.main}
          />
        </Collapse>
      )}
    </Box>
  );
}
